"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, ChevronRight, Target, FileUp, Video, MessageSquare, Award } from "lucide-react";
import { ResumeUploader } from "@/components/interview/ResumeUploader";
import { useInterview } from "@/contexts/InterviewContext";
import { Button } from "@/components/ui/button";
import { ParsedResume } from "@/types/interview";

const STEPS = [
    { icon: <Target className="w-5 h-5" />, label: "Select Type", completed: true },
    { icon: <FileUp className="w-5 h-5" />, label: "Upload Resume", active: true },
    { icon: <Video className="w-5 h-5" />, label: "Camera Setup" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Interview" },
    { icon: <Award className="w-5 h-5" />, label: "Feedback" },
];

export default function ResumePage() {
    const router = useRouter();
    const { state, setParsedResume, setResumeFile } = useInterview();

    // Redirect if no interview type selected
    React.useEffect(() => {
        if (!state.interviewType) {
            router.push("/interview");
        }
    }, [state.interviewType, router]);

    const handleResumeParsed = (resume: ParsedResume, file: File) => {
        setParsedResume(resume);
        setResumeFile(file);
    };

    const handleContinue = () => {
        if (state.parsedResume) {
            router.push("/interview/permission");
        }
    };

    return (
        <div className="container max-w-4xl mx-auto px-4 py-12">
            {/* Back Button */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8"
            >
                <Button
                    variant="ghost"
                    onClick={() => router.push("/interview")}
                    className="gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
            </motion.div>

            {/* Progress Steps */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
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
                transition={{ delay: 0.2 }}
                className="text-center mb-10"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-4">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">Step 2 of 5</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    Upload Your Resume
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Upload your resume and our AI will analyze it to create a personalized
                    interview experience based on your actual skills and experience.
                </p>
            </motion.div>

            {/* Resume Uploader */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <ResumeUploader
                    onResumeParsed={handleResumeParsed}
                    onContinue={handleContinue}
                    parsedResume={state.parsedResume}
                />
            </motion.div>
        </div>
    );
}
