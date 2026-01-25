"use client";

import { motion } from "framer-motion";
import {
    ArrowRight,
    Layout,
    Mic,
    Terminal,
    FileText,
    Users,
    BookOpen,
    Target,
    TrendingUp,
    Award,
    Zap,
    Clock,
    Edit2,
    CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {
    getUserStats,
    getRecentActivity,
    getPersonalizedRecommendations,
    getWeeklyGoal,
    updateWeeklyGoal
} from "@/lib/services/dashboard-service";
import { Input } from "@/components/ui/input";

interface Stats {
    problemsSolved: number;
    dayStreak: number;
    patternsMastered: number;
    thisWeek: number;
}

interface Activity {
    id: string;
    question_name: string;
    pattern_name: string;
    completed: boolean;
    difficulty: string;
    completed_at: string;
}

interface Recommendation {
    title: string;
    description: string;
    progress: number;
    total: number;
    link: string;
    color: string;
}

interface WeeklyGoalData {
    target_problems: number;
    completed_problems: number;
}

// Personalized Homepage for Logged-In Users
export default function AuthenticatedHome({ user }: { user: User }) {
    const [stats, setStats] = useState<Stats>({
        problemsSolved: 0,
        dayStreak: 0,
        patternsMastered: 0,
        thisWeek: 0
    });
    const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [weeklyGoal, setWeeklyGoal] = useState<WeeklyGoalData>({
        target_problems: 10,
        completed_problems: 0
    });
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [newGoalTarget, setNewGoalTarget] = useState(10);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                setLoading(true);

                // Fetch all data in parallel
                const [statsData, activityData, recommendationsData, goalData] = await Promise.all([
                    getUserStats(user.id),
                    getRecentActivity(user.id, 5),
                    getPersonalizedRecommendations(user.id),
                    getWeeklyGoal(user.id)
                ]);

                setStats(statsData);
                setRecentActivity(activityData);
                setRecommendations(recommendationsData);
                setWeeklyGoal({
                    target_problems: goalData.target_problems,
                    completed_problems: goalData.completed_problems
                });
                setNewGoalTarget(goalData.target_problems);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, [user.id]);

    const handleUpdateGoal = async () => {
        try {
            await updateWeeklyGoal(user.id, newGoalTarget);
            setWeeklyGoal(prev => ({ ...prev, target_problems: newGoalTarget }));
            setIsEditingGoal(false);
        } catch (error) {
            console.error('Error updating goal:', error);
        }
    };

    const getTimeOfDay = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "morning";
        if (hour < 18) return "afternoon";
        return "evening";
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return "just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-500';
            case 'Medium': return 'text-yellow-500';
            case 'Hard': return 'text-red-500';
            default: return 'text-muted-foreground';
        }
    };

    const goalProgress = weeklyGoal.target_problems > 0
        ? (weeklyGoal.completed_problems / weeklyGoal.target_problems) * 100
        : 0;

    return (
        <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            {/* Welcome Hero Section */}
            <section className="container mx-auto px-6 md:px-12 py-16 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-2xl">
                                {getTimeOfDay() === 'morning' ? '🌅' : getTimeOfDay() === 'afternoon' ? '☀️' : '🌙'}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">
                                Good {getTimeOfDay()}, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'there'}!
                            </h1>
                            <p className="text-muted-foreground">
                                {loading ? 'Loading your progress...' : 'Keep up the great work! 🚀'}
                            </p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                        {[
                            { icon: Target, label: "Problems Solved", value: stats.problemsSolved, color: "text-blue-500", bg: "bg-blue-500/10" },
                            { icon: TrendingUp, label: "Day Streak", value: stats.dayStreak, color: "text-green-500", bg: "bg-green-500/10", suffix: stats.dayStreak > 0 ? "🔥" : "" },
                            { icon: Award, label: "Patterns Mastered", value: stats.patternsMastered, color: "text-purple-500", bg: "bg-purple-500/10" },
                            { icon: Zap, label: "This Week", value: stats.thisWeek, color: "text-orange-500", bg: "bg-orange-500/10" },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all"
                            >
                                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <div className="text-2xl font-bold mb-1">
                                    {loading ? "..." : stat.value} {stat.suffix}
                                </div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Weekly Goal Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-6 border border-primary/20"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-primary" />
                                <h3 className="font-semibold">Weekly Goal</h3>
                            </div>
                            {!isEditingGoal ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsEditingGoal(true)}
                                >
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        value={newGoalTarget}
                                        onChange={(e) => setNewGoalTarget(parseInt(e.target.value) || 10)}
                                        className="w-20 h-8"
                                        min="1"
                                    />
                                    <Button size="sm" onClick={handleUpdateGoal}>
                                        <CheckCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">
                                    {weeklyGoal.completed_problems}/{weeklyGoal.target_problems} problems
                                </span>
                            </div>
                            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(goalProgress, 100)}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-gradient-to-r from-primary to-purple-600"
                                />
                            </div>
                            {goalProgress >= 100 && (
                                <p className="text-sm text-primary font-medium">
                                    🎉 Congratulations! You've reached your weekly goal!
                                </p>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Recent Activity Feed */}
            {recentActivity.length > 0 && (
                <section className="container mx-auto px-6 md:px-12 py-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Clock className="h-6 w-6 text-primary" />
                        Recent Activity
                    </h2>
                    <div className="space-y-3">
                        {recentActivity.map((activity, idx) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-card rounded-xl p-4 border border-border/50 flex items-center justify-between hover:border-primary/30 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${activity.completed ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                    <div>
                                        <h4 className="font-medium">{activity.question_name}</h4>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Badge variant="outline" className="text-xs">{activity.pattern_name}</Badge>
                                            <span className={getDifficultyColor(activity.difficulty)}>{activity.difficulty}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-sm text-muted-foreground">{formatTimeAgo(activity.completed_at)}</span>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Quick Access Cards */}
            <section className="container mx-auto px-6 md:px-12 py-12">
                <h2 className="text-2xl font-bold mb-6">Quick Access</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            icon: Layout,
                            title: "Continue Learning",
                            description: "Pick up where you left off with DSA patterns",
                            link: "/patterns",
                            color: "text-blue-500",
                            bg: "bg-blue-500/10",
                            badge: "20+ Patterns"
                        },
                        {
                            icon: BookOpen,
                            title: "Blind 75 Challenge",
                            description: "Master the most important coding problems",
                            link: "/roadmap/blind-75",
                            color: "text-purple-500",
                            bg: "bg-purple-500/10",
                            badge: "75 Problems",
                            isNew: true
                        },
                        {
                            icon: Mic,
                            title: "Practice Interview",
                            description: "AI-powered mock interviews with feedback",
                            link: "/interview",
                            color: "text-green-500",
                            bg: "bg-green-500/10",
                            badge: "AI Powered"
                        },
                        {
                            icon: FileText,
                            title: "Build Resume",
                            description: "Create ATS-optimized professional resume",
                            link: "/resume-builder",
                            color: "text-orange-500",
                            bg: "bg-orange-500/10",
                            badge: "Templates"
                        },
                        {
                            icon: Terminal,
                            title: "Code Editor",
                            description: "Practice coding in our online compiler",
                            link: "/compiler",
                            color: "text-cyan-500",
                            bg: "bg-cyan-500/10",
                            badge: "Multi-language"
                        },
                        {
                            icon: Users,
                            title: "Join Community",
                            description: "Connect with peers and share experiences",
                            link: "/community",
                            color: "text-pink-500",
                            bg: "bg-pink-500/10",
                            badge: "Active"
                        },
                    ].map((card, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Link href={card.link}>
                                <div className="group relative bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1 h-full">
                                    {card.isNew && (
                                        <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-bold rounded-full">
                                            NEW
                                        </div>
                                    )}
                                    <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <card.icon className={`w-6 h-6 ${card.color}`} />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                        {card.title}
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-3">{card.description}</p>
                                    <Badge variant="secondary" className="text-xs">{card.badge}</Badge>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Personalized Recommendations */}
            <section className="container mx-auto px-6 md:px-12 py-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Recommended for You</h2>
                    <Link href="/roadmap">
                        <Button variant="outline" size="sm">
                            View All Roadmaps <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {recommendations.map((item, idx) => (
                        <Link key={idx} href={item.link}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg group"
                            >
                                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span className="font-medium">{item.progress}/{item.total}</span>
                                    </div>
                                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} transition-all duration-500`}
                                            style={{ width: `${(item.progress / item.total) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Latest Blog Articles */}
            <section className="container mx-auto px-6 md:px-12 py-12 border-t border-border/50">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Latest Articles</h2>
                    <Link href="/blog">
                        <Button variant="outline" size="sm">
                            View All <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <Link href="/blog/blind-75-leetcode-problems-complete-guide-2025">
                        <div className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg">
                            <div className="relative h-48 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900">
                                <div className="absolute inset-0 bg-[url('/blog/blind-75-banner.png')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6">
                                <Badge className="mb-3">Blind 75</Badge>
                                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                                    Blind 75: Complete Interview Guide 2025
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Master the most efficient curated list of LeetCode problems
                                </p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/blog/top-50-dsa-questions-for-placements-2025">
                        <div className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg">
                            <div className="relative h-48 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
                                <div className="text-6xl">💻</div>
                            </div>
                            <div className="p-6">
                                <Badge className="mb-3">DSA</Badge>
                                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                                    Top 50 DSA Questions for Placements
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Most frequently asked questions in FAANG interviews
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}
