"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { EyeTrackingMetrics, EyeTrackingDataPoint } from "@/types/interview";

// MediaPipe Face Mesh types
interface FaceLandmark {
    x: number;
    y: number;
    z?: number;
}

interface FaceMeshResults {
    multiFaceLandmarks?: FaceLandmark[][];
}

interface FaceMesh {
    setOptions: (options: FaceMeshOptions) => void;
    onResults: (callback: (results: FaceMeshResults) => void) => void;
    send: (options: { image: HTMLVideoElement }) => Promise<void>;
}

interface FaceMeshOptions {
    maxNumFaces: number;
    refineLandmarks: boolean;
    minDetectionConfidence: number;
    minTrackingConfidence: number;
}

interface CameraUtils {
    onFrame: (options: { video: HTMLVideoElement }, callback: () => Promise<void>) => void;
    start: () => void;
    stop: () => void;
}

declare global {
    interface Window {
        FaceMesh?: new (options: { locateFile: (file: string) => string }) => FaceMesh;
        Camera?: new (video: HTMLVideoElement, options: { onFrame: () => Promise<void>; width: number; height: number }) => CameraUtils;
    }
}

// Eye landmark indices for MediaPipe Face Mesh
const LEFT_EYE_INDICES = [33, 133, 160, 159, 158, 144, 145, 153];
const RIGHT_EYE_INDICES = [362, 263, 387, 386, 385, 373, 374, 380];
const LEFT_IRIS_CENTER = 468;
const RIGHT_IRIS_CENTER = 473;
const NOSE_TIP = 4;
const FACE_CENTER_INDICES = [10, 152, 234, 454]; // Forehead, chin, left, right

interface UseEyeTrackingOptions {
    videoStream: MediaStream | null;
    videoElement: HTMLVideoElement | null;
    enabled?: boolean;
    onUpdate?: (dataPoint: EyeTrackingDataPoint) => void;
}

export function useEyeTracking({
    videoStream,
    videoElement,
    enabled = true,
    onUpdate,
}: UseEyeTrackingOptions) {
    const [isLoading, setIsLoading] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [currentMetrics, setCurrentMetrics] = useState<EyeTrackingMetrics | null>(null);
    const [error, setError] = useState<string | null>(null);

    const dataPointsRef = useRef<EyeTrackingDataPoint[]>([]);
    const startTimeRef = useRef<number>(0);
    const faceMeshRef = useRef<FaceMesh | null>(null);
    const cameraRef = useRef<CameraUtils | null>(null);
    const frameCountRef = useRef(0);
    const eyeContactFramesRef = useRef(0);
    const faceDetectedFramesRef = useRef(0);
    const lastHeadPositionRef = useRef({ x: 0, y: 0, z: 0 });
    const headMovementScoreRef = useRef(100);

    // Load MediaPipe Face Mesh
    const loadFaceMesh = useCallback(async () => {
        if (typeof window === "undefined") return;

        try {
            // Load MediaPipe scripts dynamically
            if (!window.FaceMesh) {
                await loadScript(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js"
                );
                await loadScript(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
                );
            }

            if (!window.FaceMesh) {
                throw new Error("FaceMesh not loaded");
            }

            const faceMesh = new window.FaceMesh({
                locateFile: (file: string) =>
                    `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
            });

            faceMesh.setOptions({
                maxNumFaces: 1,
                refineLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            faceMesh.onResults(handleFaceMeshResults);
            faceMeshRef.current = faceMesh;
            setIsLoading(false);
        } catch (err) {
            console.error("Failed to load FaceMesh:", err);
            setError("Failed to load eye tracking. Using fallback mode.");
            setIsLoading(false);
        }
    }, []);

    // Handle FaceMesh results
    const handleFaceMeshResults = useCallback((results: FaceMeshResults) => {
        if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
            // No face detected
            const dataPoint: EyeTrackingDataPoint = {
                timestamp: Date.now(),
                eyeContact: false,
                faceDetected: false,
                headPosition: lastHeadPositionRef.current,
            };

            dataPointsRef.current.push(dataPoint);
            frameCountRef.current++;
            onUpdate?.(dataPoint);
            return;
        }

        const landmarks = results.multiFaceLandmarks[0];
        faceDetectedFramesRef.current++;
        frameCountRef.current++;

        // Calculate head position
        const noseTip = landmarks[NOSE_TIP];
        const headPosition = {
            x: noseTip.x,
            y: noseTip.y,
            z: noseTip.z || 0,
        };

        // Calculate head movement (lower score = more movement)
        const movement = Math.sqrt(
            Math.pow(headPosition.x - lastHeadPositionRef.current.x, 2) +
            Math.pow(headPosition.y - lastHeadPositionRef.current.y, 2)
        );

        // Decay movement score based on movement amount
        if (movement > 0.02) {
            headMovementScoreRef.current = Math.max(0, headMovementScoreRef.current - movement * 100);
        } else {
            headMovementScoreRef.current = Math.min(100, headMovementScoreRef.current + 0.5);
        }

        lastHeadPositionRef.current = headPosition;

        // Determine if looking at camera (simplified)
        // Check if iris centers are roughly centered in the eye
        const leftIris = landmarks[LEFT_IRIS_CENTER];
        const rightIris = landmarks[RIGHT_IRIS_CENTER];

        // Get eye corners to determine if looking forward
        const leftEyeCenter = {
            x: (landmarks[LEFT_EYE_INDICES[0]].x + landmarks[LEFT_EYE_INDICES[4]].x) / 2,
            y: (landmarks[LEFT_EYE_INDICES[0]].y + landmarks[LEFT_EYE_INDICES[4]].y) / 2,
        };

        const rightEyeCenter = {
            x: (landmarks[RIGHT_EYE_INDICES[0]].x + landmarks[RIGHT_EYE_INDICES[4]].x) / 2,
            y: (landmarks[RIGHT_EYE_INDICES[0]].y + landmarks[RIGHT_EYE_INDICES[4]].y) / 2,
        };

        // Check if iris is near center of eye (indicating looking at camera)
        const leftIrisOffset = Math.abs(leftIris.x - leftEyeCenter.x);
        const rightIrisOffset = Math.abs(rightIris.x - rightEyeCenter.x);

        // Also check head angle (nose tip should be roughly centered)
        const headCentered = noseTip.x > 0.35 && noseTip.x < 0.65;

        const eyeContact = leftIrisOffset < 0.03 && rightIrisOffset < 0.03 && headCentered;

        if (eyeContact) {
            eyeContactFramesRef.current++;
        }

        const dataPoint: EyeTrackingDataPoint = {
            timestamp: Date.now(),
            eyeContact,
            faceDetected: true,
            headPosition,
        };

        dataPointsRef.current.push(dataPoint);
        onUpdate?.(dataPoint);
    }, [onUpdate]);

    // Start tracking
    const startTracking = useCallback(async () => {
        if (!videoElement || !faceMeshRef.current || !enabled) return;

        startTimeRef.current = Date.now();
        dataPointsRef.current = [];
        frameCountRef.current = 0;
        eyeContactFramesRef.current = 0;
        faceDetectedFramesRef.current = 0;
        headMovementScoreRef.current = 100;

        // Process frames
        const processFrame = async () => {
            if (faceMeshRef.current && videoElement.readyState >= 2) {
                await faceMeshRef.current.send({ image: videoElement });
            }
        };

        // Use camera utils if available, otherwise use requestAnimationFrame
        if (window.Camera) {
            try {
                const camera = new window.Camera(videoElement, {
                    onFrame: processFrame,
                    width: 640,
                    height: 480,
                });
                camera.start();
                cameraRef.current = camera;
            } catch (err) {
                console.warn("Camera utils failed, using fallback:", err);
                startFrameLoop(processFrame);
            }
        } else {
            startFrameLoop(processFrame);
        }

        setIsActive(true);
    }, [videoElement, enabled, handleFaceMeshResults]);

    // Fallback frame loop
    const startFrameLoop = (processFrame: () => Promise<void>) => {
        let animationId: number;

        const loop = async () => {
            await processFrame();
            animationId = requestAnimationFrame(loop);
        };

        loop();

        // Store cleanup
        cameraRef.current = {
            onFrame: () => { },
            start: () => { },
            stop: () => cancelAnimationFrame(animationId),
        };
    };

    // Stop tracking and get metrics
    const stopTracking = useCallback((): EyeTrackingMetrics => {
        if (cameraRef.current) {
            cameraRef.current.stop();
        }

        setIsActive(false);

        const endTime = Date.now();
        const totalDuration = endTime - startTimeRef.current;
        const totalFrames = frameCountRef.current || 1;

        const metrics: EyeTrackingMetrics = {
            eyeContactPercentage: (eyeContactFramesRef.current / totalFrames) * 100,
            headMovementScore: headMovementScoreRef.current,
            facePresencePercentage: (faceDetectedFramesRef.current / totalFrames) * 100,
            totalDuration,
            eyeContactDuration: (eyeContactFramesRef.current / totalFrames) * totalDuration,
            timestamps: dataPointsRef.current,
        };

        setCurrentMetrics(metrics);
        return metrics;
    }, []);

    // Load FaceMesh on mount
    useEffect(() => {
        if (enabled && videoStream) {
            loadFaceMesh();
        }
    }, [enabled, videoStream, loadFaceMesh]);

    // Auto-start when ready
    useEffect(() => {
        if (!isLoading && videoElement && enabled && faceMeshRef.current) {
            startTracking();
        }

        return () => {
            if (cameraRef.current) {
                cameraRef.current.stop();
            }
        };
    }, [isLoading, videoElement, enabled, startTracking]);

    return {
        isLoading,
        isActive,
        currentMetrics,
        error,
        startTracking,
        stopTracking,
    };
}

// Utility to load scripts dynamically
function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
}
