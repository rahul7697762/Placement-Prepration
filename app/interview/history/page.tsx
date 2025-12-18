"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Calendar,
    Clock,
    Trophy,
    AlertTriangle,
    TrendingUp,
    ArrowLeft,
    ChevronRight,
    Loader2,
    History,
    BarChart3,
    Target
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { InterviewHistoryEntry, FeedbackScores } from "@/types/interview";

interface HistoryResponse {
    history: InterviewHistoryEntry[];
    total: number;
}

const getVerdictConfig = (verdict: string) => {
    switch (verdict) {
        case "hire":
            return { icon: <Trophy className="w-4 h-4" />, color: "text-green-500", bg: "bg-green-500/10" };
        case "borderline":
            return { icon: <AlertTriangle className="w-4 h-4" />, color: "text-yellow-500", bg: "bg-yellow-500/10" };
        default:
            return { icon: <TrendingUp className="w-4 h-4" />, color: "text-orange-500", bg: "bg-orange-500/10" };
    }
};

const getAverageScore = (scores: FeedbackScores) => {
    return (
        (scores.communicationSkills +
            scores.technicalAccuracy +
            scores.confidenceClarity +
            scores.eyeContactBodyLanguage) /
        4
    ).toFixed(1);
};

export default function HistoryPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [history, setHistory] = useState<InterviewHistoryEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        if (user) {
            fetchHistory();
        }
    }, [user, authLoading, router]);

    const fetchHistory = async () => {
        try {
            const response = await fetch("/api/interview/get-history");
            if (response.ok) {
                const data: HistoryResponse = await response.json();
                setHistory(data.history);
                setTotal(data.total);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // Calculate stats
    const stats = React.useMemo(() => {
        if (history.length === 0) return null;

        const avgScore =
            history.reduce((sum, h) => sum + parseFloat(getAverageScore(h.scores)), 0) /
            history.length;

        const hireCount = history.filter((h) => h.overallVerdict === "hire").length;
        const totalDuration = history.reduce((sum, h) => sum + h.duration, 0);

        return {
            avgScore: avgScore.toFixed(1),
            hireRate: Math.round((hireCount / history.length) * 100),
            totalInterviews: history.length,
            totalTime: Math.round(totalDuration / 60),
        };
    }, [history]);

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container max-w-5xl mx-auto px-4 py-12">
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
                    Back to Interview
                </Button>
            </motion.div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
                    <History className="w-8 h-8 text-primary" />
                    Interview History
                </h1>
                <p className="text-muted-foreground">
                    Track your progress and review past interview performances.
                </p>
            </motion.div>

            {/* Stats Cards */}
            {stats && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.avgScore}</p>
                                    <p className="text-sm text-muted-foreground">Avg. Score</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <Trophy className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.hireRate}%</p>
                                    <p className="text-sm text-muted-foreground">Hire Rate</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.totalInterviews}</p>
                                    <p className="text-sm text-muted-foreground">Interviews</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.totalTime}m</p>
                                    <p className="text-sm text-muted-foreground">Total Time</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* History List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {history.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <History className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No Interviews Yet</h3>
                            <p className="text-muted-foreground mb-6">
                                Start your first AI interview to see your history here.
                            </p>
                            <Button onClick={() => router.push("/interview")}>
                                Start an Interview
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {history.map((interview, index) => {
                            const verdictConfig = getVerdictConfig(interview.overallVerdict);
                            const avgScore = getAverageScore(interview.scores);

                            return (
                                <motion.div
                                    key={interview.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                >
                                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                        <CardContent className="py-4">
                                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                                {/* Verdict Icon */}
                                                <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center
                          ${verdictConfig.bg} ${verdictConfig.color}
                        `}>
                                                    {verdictConfig.icon}
                                                </div>

                                                {/* Main Info */}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="font-semibold capitalize">
                                                            {interview.type.replace("-", " ")} Interview
                                                        </h3>
                                                        <Badge className={`${verdictConfig.bg} ${verdictConfig.color} capitalize`}>
                                                            {interview.overallVerdict.replace("-", " ")}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {formatDate(interview.date)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {formatDuration(interview.duration)}
                                                        </span>
                                                    </div>
                                                    {/* Skills */}
                                                    {interview.skillsCovered.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {interview.skillsCovered.slice(0, 4).map((skill, idx) => (
                                                                <Badge key={idx} variant="outline" className="text-xs">
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                            {interview.skillsCovered.length > 4 && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    +{interview.skillsCovered.length - 4}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Score */}
                                                <div className="text-center md:text-right">
                                                    <div className="text-3xl font-bold text-primary">
                                                        {avgScore}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Avg. Score</p>
                                                </div>

                                                <ChevronRight className="w-5 h-5 text-muted-foreground hidden md:block" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
