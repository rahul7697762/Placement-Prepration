"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUserProgress } from "@/hooks/use-user-progress";
import { useCodingProfile } from "@/hooks/use-coding-profile";
import { initialPatterns } from "@/lib/data";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Trophy, Target, CheckCircle, TrendingUp, Award, Activity, DollarSign, Users, CreditCard, Download, Calendar, Github, Code2, Link2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardPage() {
    const { user: authUser } = useAuth();
    const { progress, loading, getPatternCompletionCount } = useUserProgress();
    const { profile, leetcodeUsername, githubUsername, hasLeetCodeLinked, hasGitHubLinked } = useCodingProfile();

    const user = authUser;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-muted-foreground animate-pulse">Loading dashboard...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card className="w-[400px] text-center">
                    <CardHeader>
                        <CardTitle>Authentication Required</CardTitle>
                        <CardDescription>Please sign in to view your dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/login">
                            <Button className="w-full">Sign In</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const totalQuestions = initialPatterns.reduce(
        (acc, p) => acc + p.questions.length,
        0
    );
    const completedQuestions = progress.filter((p) => p.completed).length;
    const overallProgress =
        totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

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

    const userName =
        user.user_metadata?.full_name || user.email?.split("@")[0] || "Developer";

    // Process progress for Recent Activity and Chart
    const completedItems = progress
        .filter((p) => p.completed)
        .sort((a, b) => {
            const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
            const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
            return dateB - dateA;
        });

    const recentActivity = completedItems.slice(0, 5).map((item) => {
        // Find question details
        let questionTitle = "Unknown Question";
        let patternTitle = "Unknown Pattern";

        for (const pattern of initialPatterns) {
            if (pattern.slug === item.pattern_slug) {
                patternTitle = pattern.title;
                const q = pattern.questions.find((q) => q.id === item.question_id);
                if (q) {
                    questionTitle = q.title;
                }
                break;
            }
        }

        return {
            ...item,
            questionTitle,
            patternTitle,
            date: new Date(item.updated_at || item.created_at || Date.now()).toLocaleDateString(),
            timestamp: new Date(item.updated_at || item.created_at || Date.now()).getTime(),
        };
    });

    // Process for Activity Chart (Last 12 months)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    // Rotate months array so current month is last
    const chartLabels = [...months.slice(currentMonth + 1), ...months.slice(0, currentMonth + 1)];

    const activityMap = new Array(12).fill(0);
    completedItems.forEach(item => {
        const d = new Date(item.updated_at || item.created_at || Date.now());
        const monthIndex = d.getMonth();
        // Calculate index relative to the rotated labels (0-11, where 11 is current month)
        // If current is Dec (11), and item is Jan (0), distance is 11 months ago.
        // We want 11 to be "Dec", 10 to be "Nov"...

        // Simpler approach for now: just map to 0-11 standard Jan-Dec for fixed chart, 
        // or just visualize distribution across standard months if easier.
        // Let's stick to standard Jan-Dec for simplicity of this visual bar chart
        activityMap[monthIndex]++;
    });

    // Normalize for chart height (max 100%)
    const maxActivity = Math.max(...activityMap, 1); // avoid divide by zero
    const chartHeights = activityMap.map(count => (count / maxActivity) * 100);


    return (
        <div className="flex-1 space-y-8 p-8 pt-8 relative overflow-hidden bg-primary/5 min-h-screen">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[url('/grid.svg')] opacity-20 border-b-8 border-l-8 border-foreground pointer-events-none" />
            
            <div className="flex items-center justify-between space-y-2 relative z-10">
                <div className="space-y-1">
                    <h2 className="text-4xl font-black uppercase tracking-tighter bg-foreground text-background inline-block px-4 py-1 border-4 border-foreground">System Dashboard</h2>
                    <p className="font-mono text-xs uppercase font-bold tracking-widest text-foreground mt-2">Active Node: {userName}</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="grid gap-2">
                        <Button variant="outline" className="w-[260px] justify-start text-left font-mono font-bold tracking-widest text-xs uppercase rounded-none border-2 border-foreground bg-background h-12" id="date">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Since genesis</span>
                        </Button>
                    </div>
                    <Button className="rounded-none border-2 border-foreground bg-primary text-primary-foreground brutalist-shadow-hover hover:bg-primary font-bold uppercase tracking-widest text-xs h-12">
                        <Download className="mr-2 h-4 w-4" />
                        Export Log
                    </Button>
                </div>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics" disabled>
                        Analytics
                    </TabsTrigger>
                    <TabsTrigger value="reports" disabled>
                        Reports
                    </TabsTrigger>
                    <TabsTrigger value="notifications" disabled>
                        Notifications
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-6 relative z-10">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="rounded-none border-4 border-foreground brutalist-shadow bg-background">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Progress
                                </CardTitle>
                                <Trophy className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
                                <p className="text-xs text-muted-foreground">
                                    {completedQuestions} of {totalQuestions} questions
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="rounded-none border-4 border-foreground brutalist-shadow bg-secondary">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Questions Solved
                                </CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+{completedQuestions}</div>
                                <p className="text-xs text-muted-foreground">
                                    Lifetime total
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="rounded-none border-4 border-foreground brutalist-shadow bg-background">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Patterns</CardTitle>
                                <Target className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    +{patternStats.filter((p) => p.completed > 0).length}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    of {initialPatterns.length} total patterns
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="rounded-none border-4 border-foreground brutalist-shadow bg-primary text-primary-foreground">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Current Streak
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">0</div>
                                <p className="text-xs text-muted-foreground">
                                    Days active (Coming soon)
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4 rounded-none border-4 border-foreground brutalist-shadow bg-background">
                            <CardHeader>
                                <CardTitle>Activity Overview</CardTitle>
                                <CardDescription>Problems solved per month</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                {/* Dynamic Activity Chart */}
                                <div className="h-[350px] w-full flex items-end justify-between gap-2 p-4">
                                    {chartHeights.map((h, i) => (
                                        <div key={i} className="group relative w-full bg-primary/90 rounded-t-md hover:opacity-80 transition-opacity cursor-pointer" style={{ height: `${Math.max(h, 2)}%` }}>
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                {activityMap[i]} solved
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between px-4 text-xs text-muted-foreground mt-2">
                                    {months.map(m => <span key={m}>{m}</span>)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3 rounded-none border-4 border-foreground brutalist-shadow bg-background">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>
                                    Your latest {recentActivity.length} problem solving milestones.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    {recentActivity.length > 0 ? (
                                        recentActivity.map((activity, index) => (
                                            <div key={`${activity.question_id}-${index}`} className="flex items-center">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={`https://avatar.vercel.sh/${userName}-${index}.png`} alt="Avatar" />
                                                    <AvatarFallback>{userName[0]?.toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">Solved "{activity.questionTitle}"</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {activity.patternTitle}
                                                    </p>
                                                </div>
                                                <div className="ml-auto font-medium text-green-500 text-xs">
                                                    {activity.date}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-muted-foreground py-8">
                                            No recent activity found. Start solving!
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Coding Profile Section */}
                    <Card className="rounded-none border-4 border-foreground brutalist-shadow bg-background">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Link2 className="h-5 w-5" />
                                    Coding Profiles
                                </CardTitle>
                                <CardDescription>
                                    Linked accounts for automatic verification
                                </CardDescription>
                            </div>
                            <Button variant="outline" asChild className="rounded-none border-2 border-foreground hover:bg-secondary font-bold uppercase tracking-widest text-xs">
                                <Link href="/profile">
                                    Manage Profiles
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {/* LeetCode Card */}
                                <div className="flex items-center justify-between p-4 border-4 border-foreground rounded-none bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                                            <Code2 className="h-5 w-5 text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium">LeetCode</p>
                                            {hasLeetCodeLinked ? (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <a
                                                        href={`https://leetcode.com/${leetcodeUsername}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-primary hover:underline flex items-center gap-1"
                                                    >
                                                        {leetcodeUsername}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">Not linked</p>
                                            )}
                                        </div>
                                    </div>
                                    {hasLeetCodeLinked ? (
                                        <Badge variant="secondary" className="rounded-none border-2 border-foreground bg-primary/20 text-foreground font-mono uppercase tracking-widest">
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Active
                                        </Badge>
                                    ) : (
                                        <Button variant="ghost" size="sm" asChild className="rounded-none border-2 border-foreground uppercase font-bold text-xs">
                                            <Link href="/profile">Link</Link>
                                        </Button>
                                    )}
                                </div>

                                {/* GitHub Card */}
                                <div className="flex items-center justify-between p-4 border-4 border-foreground rounded-none bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-foreground/10 flex items-center justify-center">
                                            <Github className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium">GitHub</p>
                                            {hasGitHubLinked ? (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <a
                                                        href={`https://github.com/${githubUsername}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-primary hover:underline flex items-center gap-1"
                                                    >
                                                        {githubUsername}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">Not linked</p>
                                            )}
                                        </div>
                                    </div>
                                    {hasGitHubLinked ? (
                                        <Badge variant="secondary" className="rounded-none border-2 border-foreground bg-primary/20 text-foreground font-mono uppercase tracking-widest">
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Active
                                        </Badge>
                                    ) : (
                                        <Button variant="ghost" size="sm" asChild className="rounded-none border-2 border-foreground uppercase font-bold text-xs">
                                            <Link href="/profile">Link</Link>
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Verification Info */}
                            {hasLeetCodeLinked && (
                                <div className="mt-6 p-4 bg-primary/20 border-4 border-foreground rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <div className="flex gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-medium text-foreground">LeetCode Verification Active</p>
                                            <p className="text-muted-foreground mt-0.5">
                                                You can only mark LeetCode problems as complete after solving them on your linked account.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
