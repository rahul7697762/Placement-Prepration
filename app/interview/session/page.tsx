"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { VapiInterview } from "@/components/interview/VapiInterview";
import { useInterview } from "@/contexts/InterviewContext";
import { useVapiInterview } from "@/hooks/useVapiInterview";
import { useEyeTracking } from "@/hooks/useEyeTracking";
import { TranscriptEntry, EyeTrackingMetrics, InterviewFeedback, generateVapiPromptInjection } from "@/types/interview";

export default function SessionPage() {
    const router = useRouter();
    const {
        state,
        addTranscriptEntry,
        setEyeTrackingMetrics,
        endInterview,
        setFeedback,
        setLoading
    } = useInterview();

    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasStarted, setHasStarted] = useState(false);
    const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

    // Get skills for the interview - use focus areas from vapiContext or fallback
    const skills = state.vapiContext?.focusAreas?.length
        ? state.vapiContext.focusAreas
        : state.skillSelection?.skills || ["General Programming"];

    // Get experience level
    const experienceLevel = state.vapiContext?.candidate.experienceLevel ||
        state.skillSelection?.experienceLevel;

    // Generate context summary for Vapi
    const contextSummary = state.vapiContext
        ? generateVapiPromptInjection(state.vapiContext)
        : undefined;

    // Initialize Vapi
    const vapiApiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY || "";

    const vapi = useVapiInterview({
        apiKey: vapiApiKey,
        interviewType: state.interviewType || "general",
        skills,
        experienceLevel,
        resumeSummary: contextSummary, // Use Vapi context summary instead of resume
        onTranscriptUpdate: (entry) => {
            addTranscriptEntry(entry);
        },
        onInterviewEnd: handleInterviewEnd,
        onError: (error) => {
            console.error("Vapi Error:", error);
        }
    });

    // Initialize eye tracking
    const eyeTracking = useEyeTracking({
        videoStream: state.cameraStream,
        videoElement: videoRef.current,
        enabled: hasStarted,
    });

    // Redirect if prerequisites not met
    useEffect(() => {
        if (!state.interviewType) {
            router.push("/interview");
        } else if (!state.permissionsGranted || !state.cameraStream) {
            router.push("/interview/permission");
        }
    }, [state.interviewType, state.permissionsGranted, state.cameraStream, router]);

    // Set video source when available
    useEffect(() => {
        if (videoRef.current && state.cameraStream) {
            videoRef.current.srcObject = state.cameraStream;
        }
    }, [state.cameraStream]);

    // Handle interview start
    const handleStart = async () => {
        setHasStarted(true);
        await vapi.startInterview();
    };

    // Handle interview end
    async function handleInterviewEnd() {
        setIsGeneratingFeedback(true);
        setLoading(true);

        try {
            // Stop eye tracking and get metrics
            const metrics = eyeTracking.stopTracking();
            setEyeTrackingMetrics(metrics);

            // End the interview session
            endInterview();

            // Generate feedback
            const feedback = await generateFeedback(vapi.transcript, metrics);
            setFeedback(feedback);

            // Navigate to feedback page
            router.push("/interview/feedback");
        } catch (error) {
            console.error("Error ending interview:", error);
            // Still navigate to feedback with fallback data
            router.push("/interview/feedback");
        } finally {
            setIsGeneratingFeedback(false);
            setLoading(false);
        }
    }

    // Generate feedback via API
    async function generateFeedback(
        transcript: TranscriptEntry[],
        metrics: EyeTrackingMetrics
    ): Promise<InterviewFeedback> {
        try {
            const response = await fetch("/api/interview/generate-feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    transcript,
                    interviewType: state.interviewType,
                    skillSelection: state.skillSelection,
                    vapiContext: state.vapiContext, // NEW: Send Vapi context instead of parsedResume
                    eyeTrackingMetrics: metrics,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate feedback");
            }

            return await response.json();
        } catch (error) {
            console.error("Error generating feedback:", error);
            // Return fallback feedback
            return {
                id: `feedback-${Date.now()}`,
                interviewId: state.session?.id || "",
                scores: {
                    communicationSkills: 7,
                    technicalAccuracy: 6,
                    confidenceClarity: 7,
                    eyeContactBodyLanguage: Math.round(metrics.eyeContactPercentage / 10),
                },
                strengths: [
                    "Completed the interview successfully",
                    "Showed willingness to learn",
                    "Maintained engagement throughout",
                ],
                weakAreas: [
                    "Could provide more detailed answers",
                    "Practice structuring responses better",
                ],
                improvementSuggestions: [
                    "Practice mock interviews regularly",
                    "Review core concepts for your target skills",
                    "Work on maintaining consistent eye contact",
                    "Prepare examples using the STAR method",
                ],
                overallVerdict: "borderline",
                detailedAnalysis: "The interview was completed. Please review your performance and continue practicing.",
                generatedAt: Date.now(),
            };
        }
    }

    // Handle manual end
    const handleEnd = () => {
        vapi.endInterview();
    };

    // Loading state for feedback generation
    if (isGeneratingFeedback) {
        return (
            <div className="h-screen flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-6" />
                    <h2 className="text-2xl font-bold mb-2">Generating Your Feedback</h2>
                    <p className="text-muted-foreground">
                        Our AI is analyzing your interview performance...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col">
            <VapiInterview
                isConnected={vapi.isConnected}
                isLoading={vapi.isLoading}
                isAISpeaking={vapi.isAISpeaking}
                isMuted={vapi.isMuted}
                volumeLevel={vapi.volumeLevel}
                transcript={vapi.transcript}
                eyeTrackingData={eyeTracking.isActive ? {
                    timestamp: Date.now(),
                    eyeContact: true,
                    faceDetected: true,
                    headPosition: { x: 0, y: 0, z: 0 },
                } : null}
                onStart={handleStart}
                onEnd={handleEnd}
                onToggleMute={vapi.toggleMute}
                videoRef={videoRef}
            />
        </div>
    );
}
