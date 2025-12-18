"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    ArrowLeft,
    User,
    Calendar,
    Target,
    Sparkles
} from "lucide-react";
import { useInterview } from "@/contexts/InterviewContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GeneralInterviewInput } from "@/types/interview";

export default function GeneralInterviewPage() {
    const router = useRouter();
    const { setManualInput, setCurrentStep } = useInterview();

    const [formData, setFormData] = useState<GeneralInterviewInput>({
        name: "",
        yearsOfExperience: undefined,
        primaryDomain: "",
    });

    const [errors, setErrors] = useState<{ name?: string }>({});

    const handleChange = (field: keyof GeneralInterviewInput, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (field === 'name' && errors.name) {
            setErrors({});
        }
    };

    const handleSubmit = () => {
        // Validate name
        if (!formData.name.trim()) {
            setErrors({ name: "Name is required" });
            return;
        }

        // Set manual input in context
        setManualInput({
            mode: 'general',
            data: {
                name: formData.name.trim(),
                yearsOfExperience: formData.yearsOfExperience,
                primaryDomain: formData.primaryDomain?.trim() || undefined,
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
                <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1">
                    <Sparkles className="w-3 h-3 mr-1" />
                    General Interview
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-foreground via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    Tell Us About Yourself
                </h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    Provide some basic information so our AI can tailor questions to your background.
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

                    {/* Years of Experience Field */}
                    <div className="space-y-2">
                        <Label htmlFor="experience" className="flex items-center gap-2 text-base font-medium">
                            <Calendar className="w-4 h-4 text-primary" />
                            Years of Experience
                            <span className="text-xs text-muted-foreground font-normal">(optional)</span>
                        </Label>
                        <Input
                            id="experience"
                            type="number"
                            min="0"
                            max="50"
                            placeholder="e.g., 3"
                            value={formData.yearsOfExperience ?? ""}
                            onChange={(e) => handleChange('yearsOfExperience', e.target.value ? parseInt(e.target.value) : undefined as any)}
                            className="h-12 text-base"
                        />
                        <p className="text-xs text-muted-foreground">
                            This helps our AI calibrate question difficulty.
                        </p>
                    </div>

                    {/* Primary Domain Field */}
                    <div className="space-y-2">
                        <Label htmlFor="domain" className="flex items-center gap-2 text-base font-medium">
                            <Target className="w-4 h-4 text-primary" />
                            Primary Domain
                            <span className="text-xs text-muted-foreground font-normal">(optional)</span>
                        </Label>
                        <Input
                            id="domain"
                            type="text"
                            placeholder="e.g., Web Development, Data Science, DevOps"
                            value={formData.primaryDomain ?? ""}
                            onChange={(e) => handleChange('primaryDomain', e.target.value)}
                            className="h-12 text-base"
                        />
                        <p className="text-xs text-muted-foreground">
                            If provided, we'll include questions related to this area.
                        </p>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>General Interview Mode:</strong> Our AI will ask adaptive questions covering problem-solving,
                        technical concepts, and communication skills. Great for exploring your overall abilities!
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
                    className="h-12 px-8 bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90"
                >
                    Continue to Setup
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </motion.div>
        </div>
    );
}
