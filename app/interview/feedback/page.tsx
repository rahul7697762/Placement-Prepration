"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronRight, Target, FileUp, Video, MessageSquare, Award } from "lucide-react";
import { FeedbackReport } from "@/components/interview/FeedbackReport";
import { useInterview } from "@/contexts/InterviewContext";
import { useAuth } from "@/contexts/AuthContext";

const STEPS = [
    { icon: <Target className="w-5 h-5" />, label: "Select Type", completed: true },
    { icon: <FileUp className="w-5 h-5" />, label: "Input Details", completed: true },
    { icon: <Video className="w-5 h-5" />, label: "Camera Setup", completed: true },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Interview", completed: true },
    { icon: <Award className="w-5 h-5" />, label: "Feedback", active: true },
];

export default function FeedbackPage() {
    const router = useRouter();
    const { state, resetState } = useInterview();
    const { user } = useAuth();

    // Redirect if no feedback available
    useEffect(() => {
        if (!state.feedback) {
            router.push("/interview");
        }
    }, [state.feedback, router]);

    // Save interview to database on mount
    useEffect(() => {
        if (state.session && state.feedback && user) {
            saveInterview();
        }
    }, [state.session, state.feedback, user]);

    const saveInterview = async () => {
        try {
            await fetch("/api/interview/save-interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session: state.session,
                    feedback: state.feedback,
                }),
            });
        } catch (error) {
            console.error("Error saving interview:", error);
        }
    };

    const handleStartNew = () => {
        resetState();
        router.push("/interview");
    };

    const handleViewHistory = () => {
        router.push("/interview/history");
    };

    if (!state.feedback) {
        return null;
    }

    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            {/* Progress Steps */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 md:gap-4 mb-12 overflow-x-auto pb-2"
            >
                {STEPS.map((step, index) => (
                    <React.Fragment key={index}>
                        <div
                            className={`
                flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap transition-colors
                ${step.completed
                                    ? "bg-green-500/20 text-green-600 dark:text-green-400"
                                    : step.active
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                }
              `}
                        >
                            {step.icon}
                            <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
                        </div>
                        {index < STEPS.length - 1 && (
                            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        )}
                    </React.Fragment>
                ))}
            </motion.div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-10"
            >
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    Your Interview Feedback
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Here&apos;s a comprehensive analysis of your interview performance.
                    Review the feedback and work on the suggested improvements.
                </p>
            </motion.div>

            {/* Feedback Report */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <FeedbackReport
                    feedback={state.feedback}
                    onStartNew={handleStartNew}
                    onViewHistory={handleViewHistory}
                />
            </motion.div>
        </div>
    );
}
