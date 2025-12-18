"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Camera,
    Mic,
    Video,
    Volume2,
    CheckCircle,
    XCircle,
    RefreshCw,
    Shield,
    Info,
    ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface PermissionRequestProps {
    onPermissionsGranted: (stream: MediaStream) => void;
    onSkip?: () => void;
}

interface PermissionStatus {
    camera: "pending" | "granted" | "denied";
    microphone: "pending" | "granted" | "denied";
}

export function PermissionRequest({
    onPermissionsGranted,
    onSkip,
}: PermissionRequestProps) {
    const [status, setStatus] = useState<PermissionStatus>({
        camera: "pending",
        microphone: "pending",
    });
    const [isRequesting, setIsRequesting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [audioLevel, setAudioLevel] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const requestPermissions = async () => {
        setIsRequesting(true);
        setError(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: "user",
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                },
            });

            streamRef.current = stream;

            // Set video preview
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            // Setup audio level monitoring
            setupAudioMonitoring(stream);

            setStatus({
                camera: "granted",
                microphone: "granted",
            });

        } catch (err: unknown) {
            console.error("Permission error:", err);

            const errorMessage = err instanceof Error ? err.message : String(err);

            if (errorMessage.includes("NotAllowedError") || errorMessage.includes("Permission denied")) {
                setError("Permission denied. Please allow camera and microphone access in your browser settings.");
                setStatus({
                    camera: "denied",
                    microphone: "denied",
                });
            } else if (errorMessage.includes("NotFoundError")) {
                setError("No camera or microphone found. Please connect a device and try again.");
            } else {
                setError("Failed to access camera/microphone. Please try again.");
            }
        } finally {
            setIsRequesting(false);
        }
    };

    const setupAudioMonitoring = (stream: MediaStream) => {
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;
        microphone.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkAudioLevel = () => {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            setAudioLevel(Math.min(100, average * 2));
            requestAnimationFrame(checkAudioLevel);
        };

        checkAudioLevel();
    };

    const handleContinue = () => {
        if (streamRef.current) {
            onPermissionsGranted(streamRef.current);
        }
    };

    const retryPermissions = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setStatus({ camera: "pending", microphone: "pending" });
        setError(null);
        requestPermissions();
    };

    const allGranted = status.camera === "granted" && status.microphone === "granted";

    return (
        <div className="space-y-6">
            {/* Info Card */}
            <Card className="border-blue-500/20 bg-blue-500/5">
                <CardContent className="py-4">
                    <div className="flex gap-3">
                        <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-blue-700 dark:text-blue-300">
                                Camera & Microphone Access Required
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                We use your camera for eye-tracking analysis to provide feedback on your body language.
                                Your video is processed locally and never stored on our servers.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Permission Cards */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Camera Permission */}
                <Card className={`
          transition-all duration-300
          ${status.camera === "granted"
                        ? "border-green-500/30"
                        : status.camera === "denied"
                            ? "border-red-500/30"
                            : "border-border/50"
                    }
        `}>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${status.camera === "granted"
                                        ? "bg-green-500/20 text-green-500"
                                        : status.camera === "denied"
                                            ? "bg-red-500/20 text-red-500"
                                            : "bg-muted text-muted-foreground"
                                    }
                `}>
                                    <Video className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">Camera</CardTitle>
                                    <CardDescription className="text-xs">For eye tracking</CardDescription>
                                </div>
                            </div>
                            {status.camera === "granted" && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            {status.camera === "denied" && (
                                <XCircle className="w-5 h-5 text-red-500" />
                            )}
                        </div>
                    </CardHeader>
                </Card>

                {/* Microphone Permission */}
                <Card className={`
          transition-all duration-300
          ${status.microphone === "granted"
                        ? "border-green-500/30"
                        : status.microphone === "denied"
                            ? "border-red-500/30"
                            : "border-border/50"
                    }
        `}>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${status.microphone === "granted"
                                        ? "bg-green-500/20 text-green-500"
                                        : status.microphone === "denied"
                                            ? "bg-red-500/20 text-red-500"
                                            : "bg-muted text-muted-foreground"
                                    }
                `}>
                                    <Mic className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">Microphone</CardTitle>
                                    <CardDescription className="text-xs">For voice interview</CardDescription>
                                </div>
                            </div>
                            {status.microphone === "granted" && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            {status.microphone === "denied" && (
                                <XCircle className="w-5 h-5 text-red-500" />
                            )}
                        </div>
                    </CardHeader>
                </Card>
            </div>

            {/* Video Preview */}
            {allGranted && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <Card className="overflow-hidden">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Camera className="w-4 h-4" />
                                Camera Preview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover mirror"
                                    style={{ transform: "scaleX(-1)" }}
                                />
                                {/* Grid overlay for eye tracking positioning */}
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20" />
                                    <div className="absolute top-2/3 left-0 right-0 h-px bg-white/20" />
                                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20" />
                                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/20" />
                                </div>
                                {/* Center reticle */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-16 h-16 border-2 border-primary/50 rounded-full" />
                                    <div className="absolute inset-2 border border-primary/30 rounded-full" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Audio Level Indicator */}
                    <Card>
                        <CardContent className="py-4">
                            <div className="flex items-center gap-4">
                                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-colors
                  ${audioLevel > 20 ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"}
                `}>
                                    <Volume2 className="w-5 h-5" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">Microphone Level</span>
                                        <span className="text-muted-foreground">
                                            {audioLevel > 20 ? "Receiving audio" : "Speak to test"}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-green-500 to-green-400"
                                            animate={{ width: `${audioLevel}%` }}
                                            transition={{ duration: 0.1 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Positioning Tips */}
                    <Card className="border-amber-500/20 bg-amber-500/5">
                        <CardContent className="py-4">
                            <div className="flex gap-3">
                                <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-amber-700 dark:text-amber-300">
                                        Positioning Tips
                                    </p>
                                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                                        <li>• Ensure your face is centered and clearly visible</li>
                                        <li>• Position yourself at arm&apos;s length from the camera</li>
                                        <li>• Make sure you have good lighting on your face</li>
                                        <li>• Minimize background noise if possible</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Error Display */}
            {error && (
                <Card className="border-red-500/30 bg-red-500/5">
                    <CardContent className="py-4">
                        <div className="flex gap-3">
                            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="space-y-2">
                                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={retryPermissions}
                                    className="border-red-500/30"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Try Again
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
                {!allGranted ? (
                    <Button
                        onClick={requestPermissions}
                        disabled={isRequesting}
                        size="lg"
                        className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                    >
                        {isRequesting ? (
                            <>
                                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                Requesting Access...
                            </>
                        ) : (
                            <>
                                <Camera className="w-5 h-5 mr-2" />
                                Enable Camera & Microphone
                            </>
                        )}
                    </Button>
                ) : (
                    <Button
                        onClick={handleContinue}
                        size="lg"
                        className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-green-500 hover:opacity-90"
                    >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Start Interview
                        <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
}
