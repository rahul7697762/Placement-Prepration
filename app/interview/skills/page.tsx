"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Zap, ChevronRight, Target, FileUp, Video, MessageSquare, Award } from "lucide-react";
import { SkillsMultiSelect } from "@/components/interview/SkillsMultiSelect";
import { useInterview } from "@/contexts/InterviewContext";
import { Button } from "@/components/ui/button";
import { Skill, ExperienceLevel } from "@/types/interview";

const STEPS = [
    { icon: <Target className="w-5 h-5" />, label: "Select Type", completed: true },
    { icon: <FileUp className="w-5 h-5" />, label: "Input Details", active: true },
    { icon: <Video className="w-5 h-5" />, label: "Camera Setup" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Interview" },
    { icon: <Award className="w-5 h-5" />, label: "Feedback" },
];

export default function SkillsPage() {
    const router = useRouter();
    const { state, setSkillSelection } = useInterview();

    const [selectedSkills, setSelectedSkills] = React.useState<Skill[]>(
        state.skillSelection?.skills || []
    );
    const [experienceLevel, setExperienceLevel] = React.useState<ExperienceLevel | null>(
        state.skillSelection?.experienceLevel || null
    );

    // Redirect if no interview type selected
    React.useEffect(() => {
        if (!state.interviewType) {
            router.push("/interview");
        }
    }, [state.interviewType, router]);

    const handleContinue = () => {
        if (selectedSkills.length > 0 && experienceLevel) {
            setSkillSelection({
                skills: selectedSkills,
                experienceLevel,
            });
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
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">Step 2 of 5</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    Select Your Interview Focus
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Choose the skills you want to be interviewed on and your experience level.
                    The AI will tailor questions accordingly.
                </p>
            </motion.div>

            {/* Skills Selection Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <SkillsMultiSelect
                    selectedSkills={selectedSkills}
                    experienceLevel={experienceLevel}
                    onSkillsChange={setSelectedSkills}
                    onExperienceLevelChange={setExperienceLevel}
                    onContinue={handleContinue}
                    maxSkills={5}
                />
            </motion.div>
        </div>
    );
}
