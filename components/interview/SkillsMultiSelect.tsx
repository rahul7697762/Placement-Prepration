"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, X, Sparkles, Zap, Plus } from "lucide-react";
import { Skill, ExperienceLevel } from "@/types/interview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Available skills with categories
const SKILL_CATEGORIES = {
    "Programming Languages": ["JavaScript", "TypeScript", "Python", "Java", "C++"] as Skill[],
    "Frontend Development": ["React", "Node.js"] as Skill[],
    "Data & ML": ["Machine Learning", "SQL"] as Skill[],
    "Architecture": ["System Design", "REST APIs", "GraphQL", "Database Design"] as Skill[],
    "Core Concepts": ["DSA", "OOP Concepts", "Testing", "Git", "Agile/Scrum"] as Skill[],
    "Cloud & DevOps": ["Cloud (AWS/GCP/Azure)", "DevOps"] as Skill[],
};

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string; description: string }[] = [
    {
        value: "fresher",
        label: "Fresher",
        description: "0-1 years experience, learning fundamentals"
    },
    {
        value: "junior",
        label: "Junior",
        description: "1-3 years experience, solid fundamentals"
    },
    {
        value: "mid",
        label: "Mid-Level",
        description: "3-6 years experience, strong expertise"
    },
    {
        value: "senior",
        label: "Senior",
        description: "6+ years experience, deep expertise"
    },
];

interface SkillsMultiSelectProps {
    selectedSkills: Skill[];
    experienceLevel: ExperienceLevel | null;
    onSkillsChange: (skills: Skill[]) => void;
    onExperienceLevelChange: (level: ExperienceLevel) => void;
    onContinue: () => void;
    maxSkills?: number;
}

export function SkillsMultiSelect({
    selectedSkills,
    experienceLevel,
    onSkillsChange,
    onExperienceLevelChange,
    onContinue,
    maxSkills = 5,
}: SkillsMultiSelectProps) {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [customSkill, setCustomSkill] = useState("");

    const handleAddCustomSkill = () => {
        if (!customSkill.trim()) return;

        const formattedSkill = customSkill.trim();

        const isDuplicate = selectedSkills.some(
            s => s.toLowerCase() === formattedSkill.toLowerCase()
        );

        if (isDuplicate) {
            setCustomSkill("");
            return;
        }

        if (selectedSkills.length < maxSkills) {
            onSkillsChange([...selectedSkills, formattedSkill as Skill]);
            setCustomSkill("");
        }
    };

    const toggleSkill = (skill: Skill) => {
        if (selectedSkills.includes(skill)) {
            onSkillsChange(selectedSkills.filter((s) => s !== skill));
        } else if (selectedSkills.length < maxSkills) {
            onSkillsChange([...selectedSkills, skill]);
        }
    };

    const removeSkill = (skill: Skill) => {
        onSkillsChange(selectedSkills.filter((s) => s !== skill));
    };

    const isValid = selectedSkills.length >= 1 && experienceLevel !== null;

    return (
        <div className="space-y-8">
            {/* Selected Skills Display */}
            <AnimatePresence>
                {selectedSkills.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <Card className="border-primary/20 bg-primary/5">
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium">
                                        Selected Skills ({selectedSkills.length}/{maxSkills})
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedSkills.map((skill) => (
                                        <motion.div
                                            key={skill}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                        >
                                            <Badge
                                                variant="secondary"
                                                className="pl-3 pr-2 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer group"
                                                onClick={() => removeSkill(skill)}
                                            >
                                                {skill}
                                                <X className="w-3 h-3 ml-1.5 group-hover:rotate-90 transition-transform" />
                                            </Badge>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Custom Skill */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Add Custom Skill
                </h3>
                <div className="flex gap-2">
                    <Input
                        placeholder="Type any skill (e.g. Rust, Go, Docker)..."
                        value={customSkill}
                        onChange={(e) => setCustomSkill(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddCustomSkill();
                            }
                        }}
                        className="max-w-md"
                    />
                    <Button
                        onClick={handleAddCustomSkill}
                        disabled={!customSkill.trim() || selectedSkills.length >= maxSkills}
                        variant="outline"
                    >
                        Add
                    </Button>
                </div>
            </div>

            {/* Skill Categories */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Select Your Skills
                </h3>
                <p className="text-sm text-muted-foreground">
                    Choose up to {maxSkills} skills for your interview focus
                </p>

                <div className="grid gap-3">
                    {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
                        <Card
                            key={category}
                            className={`
                transition-all duration-200 hover:shadow-md cursor-pointer
                ${expandedCategory === category ? "border-primary/50 shadow-md" : "border-border/50"}
              `}
                        >
                            <CardHeader
                                className="py-3 px-4 cursor-pointer"
                                onClick={() => setExpandedCategory(
                                    expandedCategory === category ? null : category
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium">{category}</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">
                                            {skills.filter((s) => selectedSkills.includes(s)).length}/{skills.length}
                                        </span>
                                        <ChevronDown className={`
                      w-4 h-4 text-muted-foreground transition-transform
                      ${expandedCategory === category ? "rotate-180" : ""}
                    `} />
                                    </div>
                                </div>
                            </CardHeader>

                            <AnimatePresence>
                                {expandedCategory === category && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <CardContent className="pt-0 pb-4 px-4">
                                            <div className="flex flex-wrap gap-2">
                                                {skills.map((skill) => {
                                                    const isSelected = selectedSkills.includes(skill);
                                                    const isDisabled = !isSelected && selectedSkills.length >= maxSkills;

                                                    return (
                                                        <motion.button
                                                            key={skill}
                                                            whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                                                            whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                                                            onClick={() => !isDisabled && toggleSkill(skill)}
                                                            disabled={isDisabled}
                                                            className={`
                                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
                                border transition-all duration-200
                                ${isSelected
                                                                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                                                    : isDisabled
                                                                        ? "bg-muted/50 text-muted-foreground/50 border-muted cursor-not-allowed"
                                                                        : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/10"
                                                                }
                              `}
                                                        >
                                                            {isSelected && <Check className="w-3 h-3" />}
                                                            {skill}
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold">Experience Level</h3>
                <p className="text-sm text-muted-foreground">
                    This helps us adjust interview difficulty
                </p>

                <div className="grid sm:grid-cols-3 gap-3">
                    {EXPERIENCE_LEVELS.map((level) => (
                        <motion.button
                            key={level.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onExperienceLevelChange(level.value)}
                            className={`
                p-4 rounded-xl border-2 text-left transition-all duration-200
                ${experienceLevel === level.value
                                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                                    : "border-border/50 bg-card/50 hover:border-primary/30"
                                }
              `}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <div className={`
                  w-4 h-4 rounded-full border-2 flex items-center justify-center
                  ${experienceLevel === level.value ? "border-primary" : "border-muted-foreground"}
                `}>
                                    {experienceLevel === level.value && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-2 h-2 rounded-full bg-primary"
                                        />
                                    )}
                                </div>
                                <span className="font-semibold text-sm">{level.label}</span>
                            </div>
                            <p className="text-xs text-muted-foreground pl-6">
                                {level.description}
                            </p>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Continue Button */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <Button
                    onClick={onContinue}
                    disabled={!isValid}
                    size="lg"
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 disabled:opacity-50"
                >
                    {isValid ? (
                        <>
                            Continue to Interview Setup
                            <ChevronDown className="w-5 h-5 ml-2 rotate-[-90deg]" />
                        </>
                    ) : (
                        "Select at least 1 skill and experience level"
                    )}
                </Button>
            </motion.div>
        </div>
    );
}
