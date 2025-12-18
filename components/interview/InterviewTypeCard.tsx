"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Briefcase,
    FileText,
    ChevronRight,
    Sparkles,
    Target,
    FileUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InterviewType } from "@/types/interview";

interface InterviewTypeCardProps {
    type: InterviewType;
    title: string;
    description: string;
    features: string[];
    selected?: boolean;
    onSelect: (type: InterviewType) => void;
}

export function InterviewTypeCard({
    type,
    title,
    description,
    features,
    selected = false,
    onSelect,
}: InterviewTypeCardProps) {
    const Icon = type === "general" ? Target : FileUp;

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                onClick={() => onSelect(type)}
                className={`
          relative cursor-pointer overflow-hidden transition-all duration-300
          border-2 hover:shadow-2xl
          ${selected
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                        : "border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm"
                    }
        `}
            >
                {/* Gradient Background Effect */}
                <div className={`
          absolute inset-0 opacity-0 transition-opacity duration-500
          ${selected ? "opacity-100" : "group-hover:opacity-50"}
          bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10
        `} />

                {/* Selected Indicator */}
                {selected && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                    >
                        <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </motion.div>
                )}

                <CardHeader className="relative pb-4">
                    <div className={`
            inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4
            transition-all duration-300
            ${selected
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                            : "bg-muted text-muted-foreground"
                        }
          `}>
                        <Icon className="w-7 h-7" />
                    </div>

                    <CardTitle className="text-xl font-bold tracking-tight">
                        {title}
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                        {description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="relative space-y-4">
                    {/* Features List */}
                    <ul className="space-y-3">
                        {features.map((feature, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3"
                            >
                                <div className={`
                  flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5
                  ${selected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}
                `}>
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-sm text-muted-foreground leading-relaxed">
                                    {feature}
                                </span>
                            </motion.li>
                        ))}
                    </ul>

                    {/* Action Indicator */}
                    <div className={`
            flex items-center gap-2 pt-4 font-medium text-sm transition-colors
            ${selected ? "text-primary" : "text-muted-foreground"}
          `}>
                        <span>{selected ? "Selected" : "Click to select"}</span>
                        <ChevronRight className={`
              w-4 h-4 transition-transform
              ${selected ? "translate-x-1" : ""}
            `} />
                    </div>
                </CardContent>

                {/* Bottom Gradient Line */}
                <div className={`
          absolute bottom-0 left-0 right-0 h-1 transition-all duration-300
          ${selected
                        ? "bg-gradient-to-r from-primary via-purple-500 to-primary opacity-100"
                        : "bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0"
                    }
        `} />
            </Card>
        </motion.div>
    );
}
