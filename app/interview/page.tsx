"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    Sparkles,
    Target,
    User,
    Video,
    MessageSquare,
    Award,
    ChevronRight,
    Briefcase,
    Users
} from "lucide-react";
import { InterviewTypeCard } from "@/components/interview/InterviewTypeCard";
import { useInterview } from "@/contexts/InterviewContext";
import { InterviewType } from "@/types/interview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const INTERVIEW_TYPES = [
    {
        type: "general" as InterviewType,
        title: "General Interview",
        description: "A flexible interview that adapts to your background and explores your skills broadly.",
        features: [
            "Adaptive questioning based on responses",
            "Explores problem-solving abilities",
            "Great for career changers",
            "No role-specific preparation needed",
        ],
        icon: <Users className="w-6 h-6" />,
    },
    {
        type: "role-based" as InterviewType,
        title: "Role-Based Interview",
        description: "Targeted technical interview focused on a specific role like SDE, ML Engineer, or Frontend Developer.",
        features: [
            "Role-specific technical questions",
            "Choose from predefined roles",
            "Difficulty based on experience level",
            "Best for job interview preparation",
        ],
        icon: <Briefcase className="w-6 h-6" />,
    },
];

const STEPS = [
    { icon: <Target className="w-5 h-5" />, label: "Select Type" },
    { icon: <User className="w-5 h-5" />, label: "Your Details" },
    { icon: <Video className="w-5 h-5" />, label: "Camera Setup" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Interview" },
    { icon: <Award className="w-5 h-5" />, label: "Feedback" },
];

export default function InterviewPage() {
    const router = useRouter();
    const { state, setInterviewType } = useInterview();

    const handleSelectType = (type: InterviewType) => {
        setInterviewType(type);
    };

    const handleContinue = () => {
        if (state.interviewType === "general") {
            router.push("/interview/general");
        } else if (state.interviewType === "role-based") {
            router.push("/interview/role");
        }
    };

    return (
        <div className="container max-w-5xl mx-auto px-4 py-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-1">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI-Powered Interview
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
                    Practice Your Interview Skills
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Get real-time feedback on your technical knowledge, communication skills, and body language with our AI interviewer.
                </p>
            </motion.div>

            {/* Progress Steps */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-2 md:gap-4 mb-12 overflow-x-auto pb-2"
            >
                {STEPS.map((step, index) => (
                    <React.Fragment key={index}>
                        <div
                            className={`
                flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap
                ${index === 0
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

            {/* Interview Type Selection */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Choose Your Interview Type
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {INTERVIEW_TYPES.map((interviewType) => (
                        <InterviewTypeCard
                            key={interviewType.type}
                            type={interviewType.type}
                            title={interviewType.title}
                            description={interviewType.description}
                            features={interviewType.features}
                            selected={state.interviewType === interviewType.type}
                            onSelect={handleSelectType}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Continue Button */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: state.interviewType ? 1 : 0.5 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center"
            >
                <Button
                    onClick={handleContinue}
                    disabled={!state.interviewType}
                    size="lg"
                    className="h-14 px-12 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 disabled:opacity-50"
                >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </motion.div>

            {/* Features Highlight */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-16 grid md:grid-cols-3 gap-6"
            >
                {[
                    {
                        icon: <Video className="w-6 h-6" />,
                        title: "Eye Tracking",
                        description: "AI monitors your eye contact and body language for comprehensive feedback.",
                    },
                    {
                        icon: <MessageSquare className="w-6 h-6" />,
                        title: "Voice Interview",
                        description: "Natural conversation with AI interviewer using advanced voice technology.",
                    },
                    {
                        icon: <Award className="w-6 h-6" />,
                        title: "Detailed Feedback",
                        description: "Get scores and actionable suggestions to improve your interview skills.",
                    },
                ].map((feature, index) => (
                    <div
                        key={index}
                        className="text-center p-6 rounded-2xl bg-card/50 border border-border/50"
                    >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                            {feature.icon}
                        </div>
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
