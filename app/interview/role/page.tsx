"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    ArrowLeft,
    User,
    Briefcase,
    Code,
    BarChart3,
    Sparkles
} from "lucide-react";
import { useInterview } from "@/contexts/InterviewContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    RoleBasedInterviewInput,
    InterviewRole,
    ExperienceLevel,
    INTERVIEW_ROLES
} from "@/types/interview";

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string; description: string }[] = [
    { value: 'fresher', label: 'Fresher', description: '0-1 years' },
    { value: 'junior', label: 'Junior', description: '1-3 years' },
    { value: 'mid', label: 'Mid-Level', description: '3-6 years' },
    { value: 'senior', label: 'Senior', description: '6+ years' },
];

export default function RoleBasedInterviewPage() {
    const router = useRouter();
    const { setManualInput, setCurrentStep } = useInterview();

    const [formData, setFormData] = useState<RoleBasedInterviewInput>({
        name: "",
        role: 'sde',
        customRole: "",
        experienceLevel: 'junior',
        techStack: [],
    });

    const [techStackInput, setTechStackInput] = useState("");
    const [errors, setErrors] = useState<{ name?: string; customRole?: string }>({});

    const handleChange = <K extends keyof RoleBasedInterviewInput>(
        field: K,
        value: RoleBasedInterviewInput[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleTechStackChange = (value: string) => {
        setTechStackInput(value);
        // Parse comma-separated values
        const techs = value.split(',').map(t => t.trim()).filter(t => t.length > 0);
        handleChange('techStack', techs);
    };

    const handleSubmit = () => {
        const newErrors: typeof errors = {};

        // Validate name
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        // Validate custom role if 'other' is selected
        if (formData.role === 'other' && !formData.customRole?.trim()) {
            newErrors.customRole = "Please specify your role";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Set manual input in context
        setManualInput({
            mode: 'role-based',
            data: {
                name: formData.name.trim(),
                role: formData.role,
                customRole: formData.customRole?.trim(),
                experienceLevel: formData.experienceLevel,
                techStack: formData.techStack,
            }
        });

        // Navigate to permission page
        router.push("/interview/permission");
    };

    const handleBack = () => {
        setCurrentStep(1);
        router.push("/interview");
    };

    return (
        <div className="container max-w-2xl mx-auto px-4 py-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
            >
                <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Role-Based Interview
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-foreground via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Select Your Target Role
                </h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    Choose the role you're preparing for to get targeted technical questions.
                </p>
            </motion.div>

            {/* Form Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-2xl p-8 shadow-lg"
            >
                <div className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2 text-base font-medium">
                            <User className="w-4 h-4 text-primary" />
                            Your Name *
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className={`h-12 text-base ${errors.name ? 'border-red-500' : ''}`}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-base font-medium">
                            <Briefcase className="w-4 h-4 text-primary" />
                            Target Role *
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                            {INTERVIEW_ROLES.map((role) => (
                                <button
                                    key={role.value}
                                    type="button"
                                    onClick={() => handleChange('role', role.value)}
                                    className={`p-3 rounded-xl border-2 text-left transition-all ${formData.role === role.value
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <span className="font-medium">{role.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Custom Role Input */}
                        {formData.role === 'other' && (
                            <div className="mt-3">
                                <Input
                                    type="text"
                                    placeholder="Specify your role (e.g., DevOps Engineer)"
                                    value={formData.customRole ?? ""}
                                    onChange={(e) => handleChange('customRole', e.target.value)}
                                    className={`h-12 text-base ${errors.customRole ? 'border-red-500' : ''}`}
                                />
                                {errors.customRole && (
                                    <p className="text-sm text-red-500 mt-1">{errors.customRole}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Experience Level */}
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-base font-medium">
                            <BarChart3 className="w-4 h-4 text-primary" />
                            Experience Level *
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {EXPERIENCE_LEVELS.map((level) => (
                                <button
                                    key={level.value}
                                    type="button"
                                    onClick={() => handleChange('experienceLevel', level.value)}
                                    className={`p-3 rounded-xl border-2 text-center transition-all ${formData.experienceLevel === level.value
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <div className="font-medium">{level.label}</div>
                                    <div className="text-xs text-muted-foreground">{level.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tech Stack Field */}
                    <div className="space-y-2">
                        <Label htmlFor="techStack" className="flex items-center gap-2 text-base font-medium">
                            <Code className="w-4 h-4 text-primary" />
                            Tech Stack
                            <span className="text-xs text-muted-foreground font-normal">(optional)</span>
                        </Label>
                        <Input
                            id="techStack"
                            type="text"
                            placeholder="React, Node.js, Python, AWS (comma-separated)"
                            value={techStackInput}
                            onChange={(e) => handleTechStackChange(e.target.value)}
                            className="h-12 text-base"
                        />
                        <p className="text-xs text-muted-foreground">
                            List technologies you want to be interviewed on.
                        </p>
                        {formData.techStack && formData.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.techStack.map((tech, i) => (
                                    <Badge key={i} variant="secondary" className="px-2 py-1">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                        <strong>Role-Based Interview Mode:</strong> Our AI will focus on role-specific technical questions
                        and scenarios. Questions will be calibrated to your experience level.
                    </p>
                </div>
            </motion.div>

            {/* Navigation Buttons */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-between mt-8"
            >
                <Button
                    onClick={handleBack}
                    variant="outline"
                    size="lg"
                    className="h-12 px-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <Button
                    onClick={handleSubmit}
                    size="lg"
                    className="h-12 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                >
                    Continue to Setup
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </motion.div>
        </div>
    );
}
