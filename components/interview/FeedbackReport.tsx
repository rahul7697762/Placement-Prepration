"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Trophy,
    AlertTriangle,
    TrendingUp,
    Star,
    MessageSquare,
    Target,
    Eye,
    Brain,
    Lightbulb,
    CheckCircle,
    XCircle,
    ChevronRight,
    Download,
    Share2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { InterviewFeedback, FeedbackScores } from "@/types/interview";

interface FeedbackReportProps {
    feedback: InterviewFeedback;
    onViewHistory?: () => void;
    onStartNew?: () => void;
}

const SCORE_LABELS: Record<keyof FeedbackScores, { label: string; icon: React.ReactNode }> = {
    communicationSkills: { label: "Communication", icon: <MessageSquare className="w-4 h-4" /> },
    technicalAccuracy: { label: "Technical Accuracy", icon: <Target className="w-4 h-4" /> },
    confidenceClarity: { label: "Confidence & Clarity", icon: <Star className="w-4 h-4" /> },
    eyeContactBodyLanguage: { label: "Eye Contact & Body Language", icon: <Eye className="w-4 h-4" /> },
};

const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500";
    if (score >= 6) return "text-blue-500";
    if (score >= 4) return "text-yellow-500";
    return "text-red-500";
};

const getScoreBgColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-blue-500";
    if (score >= 4) return "bg-yellow-500";
    return "bg-red-500";
};

const getVerdictConfig = (verdict: InterviewFeedback["overallVerdict"]) => {
    switch (verdict) {
        case "hire":
            return {
                label: "Ready to Hire",
                icon: <Trophy className="w-8 h-8" />,
                color: "text-green-500",
                bgColor: "bg-green-500/10",
                borderColor: "border-green-500/30",
                description: "Excellent performance! You demonstrated strong skills across all areas.",
            };
        case "borderline":
            return {
                label: "Borderline",
                icon: <AlertTriangle className="w-8 h-8" />,
                color: "text-yellow-500",
                bgColor: "bg-yellow-500/10",
                borderColor: "border-yellow-500/30",
                description: "Good potential with some areas to improve. Keep practicing!",
            };
        case "needs-improvement":
            return {
                label: "Needs Improvement",
                icon: <TrendingUp className="w-8 h-8" />,
                color: "text-orange-500",
                bgColor: "bg-orange-500/10",
                borderColor: "border-orange-500/30",
                description: "Focus on the improvement suggestions to strengthen your interview skills.",
            };
    }
};

export function FeedbackReport({
    feedback,
    onViewHistory,
    onStartNew,
}: FeedbackReportProps) {
    const verdictConfig = getVerdictConfig(feedback.overallVerdict);
    const averageScore = Object.values(feedback.scores).reduce((a, b) => a + b, 0) / 4;

    return (
        <div className="space-y-6">
            {/* Overall Verdict Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card className={`${verdictConfig.bgColor} ${verdictConfig.borderColor} border-2`}>
                    <CardContent className="py-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Verdict Icon */}
                            <div className={`
                w-20 h-20 rounded-full flex items-center justify-center
                ${verdictConfig.bgColor} ${verdictConfig.color}
              `}>
                                {verdictConfig.icon}
                            </div>

                            {/* Verdict Text */}
                            <div className="flex-1 text-center md:text-left">
                                <Badge className={`${verdictConfig.bgColor} ${verdictConfig.color} mb-2`}>
                                    Overall Verdict
                                </Badge>
                                <h2 className={`text-3xl font-bold ${verdictConfig.color}`}>
                                    {verdictConfig.label}
                                </h2>
                                <p className="text-muted-foreground mt-1">
                                    {verdictConfig.description}
                                </p>
                            </div>

                            {/* Average Score */}
                            <div className="text-center">
                                <div className={`text-5xl font-bold ${getScoreColor(averageScore)}`}>
                                    {averageScore.toFixed(1)}
                                </div>
                                <p className="text-sm text-muted-foreground">Average Score</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Score Breakdown */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-primary" />
                            Performance Breakdown
                        </CardTitle>
                        <CardDescription>
                            Detailed scores across key interview dimensions
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Object.entries(feedback.scores).map(([key, score], index) => {
                            const config = SCORE_LABELS[key as keyof FeedbackScores];
                            return (
                                <motion.div
                                    key={key}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                                {config.icon}
                                            </div>
                                            <span className="font-medium">{config.label}</span>
                                        </div>
                                        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                                            {score}/10
                                        </span>
                                    </div>
                                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${score * 10}%` }}
                                            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                                            className={`h-full ${getScoreBgColor(score)} rounded-full`}
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Strengths & Weak Areas */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="h-full border-green-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <CheckCircle className="w-5 h-5" />
                                Strengths
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {feedback.strengths.map((strength, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckCircle className="w-3 h-3 text-green-500" />
                                        </div>
                                        <span className="text-sm">{strength}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Weak Areas */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="h-full border-orange-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                                <XCircle className="w-5 h-5" />
                                Areas to Improve
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {feedback.weakAreas.map((area, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <XCircle className="w-3 h-3 text-orange-500" />
                                        </div>
                                        <span className="text-sm">{area}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Improvement Suggestions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-yellow-500" />
                            Improvement Suggestions
                        </CardTitle>
                        <CardDescription>
                            Actionable steps to enhance your interview performance
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {feedback.improvementSuggestions.map((suggestion, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    className="flex items-start gap-3 p-4 bg-background rounded-xl border"
                                >
                                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-xs font-bold">
                                        {index + 1}
                                    </div>
                                    <span className="text-sm">{suggestion}</span>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Detailed Analysis */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Detailed Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {feedback.detailedAnalysis}
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Skill-wise Analysis */}
            {feedback.skillWiseAnalysis && feedback.skillWiseAnalysis.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-primary" />
                                Skill-wise Assessment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {feedback.skillWiseAnalysis.map((skill, index) => (
                                    <Card key={index} className="bg-muted/30">
                                        <CardContent className="pt-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium">{skill.skill}</span>
                                                <Badge className={getScoreBgColor(skill.score)}>
                                                    {skill.score}/10
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {skill.feedback}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
            >
                <Button
                    onClick={onStartNew}
                    size="lg"
                    className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                >
                    Start New Interview
                    <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                    onClick={onViewHistory}
                    size="lg"
                    variant="outline"
                    className="flex-1 h-14 text-lg font-semibold"
                >
                    View Interview History
                </Button>
            </motion.div>
        </div>
    );
}
