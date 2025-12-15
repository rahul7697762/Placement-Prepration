"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUserProgress } from "@/hooks/use-user-progress";
import { initialPatterns } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Trophy, Target, CheckCircle, TrendingUp, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const { user } = useAuth();
    const { progress, loading, getPatternCompletionCount } = useUserProgress();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="p-8 text-center">
                    <CardTitle className="mb-4">Please sign in to view your dashboard</CardTitle>
                    <Link href="/login">
                        <Button>Sign In</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-muted-foreground">Loading your progress...</div>
            </div>
        );
    }

    const totalQuestions = initialPatterns.reduce((acc, p) => acc + p.questions.length, 0);
    const completedQuestions = progress.filter((p) => p.completed).length;
    const overallProgress = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

    const patternStats = initialPatterns.map((pattern) => {
        const completed = getPatternCompletionCount(pattern.slug);
        const total = pattern.questions.length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        return {
            ...pattern,
            completed,
            total,
            percentage,
        };
    });

    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || "Developer";

    return (
        <main className="min-h-screen bg-background relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="container mx-auto px-8 md:px-12 py-16 max-w-7xl space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Welcome back, {userName}! 👋
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Track your DSA learning journey and celebrate your progress.
                    </p>
                </motion.div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="border-border/50 bg-gradient-to-br from-primary/10 to-primary/5">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Progress</CardTitle>
                                <Trophy className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {completedQuestions} of {totalQuestions} questions
                                </p>
                                <Progress value={overallProgress} className="mt-3" />
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="border-border/50 bg-gradient-to-br from-green-500/10 to-green-500/5">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-500">{completedQuestions}</div>
                                <p className="text-xs text-muted-foreground mt-1">Questions solved</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border-border/50 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Patterns</CardTitle>
                                <Target className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-500">
                                    {patternStats.filter((p) => p.completed > 0).length}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    of {initialPatterns.length} started
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="border-border/50 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Streak</CardTitle>
                                <TrendingUp className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-500">0</div>
                                <p className="text-xs text-muted-foreground mt-1">Days (Coming soon)</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Pattern Progress */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-6"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Pattern Progress</h2>
                        <Link href="/">
                            <Button variant="outline">View All Patterns</Button>
                        </Link>
                    </div>

                    <div className="grid gap-4">
                        {patternStats.map((pattern, index) => (
                            <motion.div
                                key={pattern.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.05 }}
                            >
                                <Link href={`/patterns/${pattern.slug}`}>
                                    <Card className="border-border/50 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                                        {pattern.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {pattern.completed} of {pattern.total} questions completed
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {pattern.percentage === 100 && pattern.total > 0 && (
                                                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                                            <Award className="w-3 h-3 mr-1" />
                                                            Complete
                                                        </Badge>
                                                    )}
                                                    <span className="text-2xl font-bold text-primary">
                                                        {Math.round(pattern.percentage)}%
                                                    </span>
                                                </div>
                                            </div>
                                            <Progress value={pattern.percentage} className="h-2" />
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Achievements Section (Placeholder) */}
                {completedQuestions > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Card className="border-border/50 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-purple-500" />
                                    Recent Achievements
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            🎯
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">First Steps</p>
                                            <p className="text-xs">Completed your first question!</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
