"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useCodingProfile } from "@/hooks/use-coding-profile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    Code2,
    Github,
    ExternalLink,
    TrendingUp,
    Award,
    Star,
    GitFork,
    Users,
    CheckCircle,
    Loader2,
    AlertCircle,
    ArrowLeft
} from "lucide-react"
import Link from "next/link"

interface LeetCodeStats {
    totalSolved: number
    easySolved: number
    mediumSolved: number
    hardSolved: number
    ranking: number
    contributionPoints: number
    reputation: number
}

interface GitHubStats {
    name: string
    bio: string
    publicRepos: number
    followers: number
    following: number
    totalStars: number
    createdAt: string
    avatarUrl: string
}

export default function CodingStatsPage() {
    const { user } = useAuth()
    const { leetcodeUsername, githubUsername, hasLeetCodeLinked, hasGitHubLinked } = useCodingProfile()

    const [leetcodeStats, setLeetcodeStats] = useState<LeetCodeStats | null>(null)
    const [githubStats, setGithubStats] = useState<GitHubStats | null>(null)
    const [loadingLeetCode, setLoadingLeetCode] = useState(false)
    const [loadingGitHub, setLoadingGitHub] = useState(false)
    const [leetcodeError, setLeetcodeError] = useState<string | null>(null)
    const [githubError, setGithubError] = useState<string | null>(null)

    useEffect(() => {
        if (hasLeetCodeLinked && leetcodeUsername) {
            fetchLeetCodeStats()
        }
        if (hasGitHubLinked && githubUsername) {
            fetchGitHubStats()
        }
    }, [leetcodeUsername, githubUsername, hasLeetCodeLinked, hasGitHubLinked])

    const fetchLeetCodeStats = async () => {
        setLoadingLeetCode(true)
        setLeetcodeError(null)
        try {
            const response = await fetch(`/api/leetcode/stats?username=${encodeURIComponent(leetcodeUsername!)}`)
            const data = await response.json()
            if (data.success) {
                setLeetcodeStats(data.stats)
            } else {
                setLeetcodeError(data.message || 'Failed to fetch LeetCode stats')
            }
        } catch (error) {
            setLeetcodeError('Failed to fetch LeetCode stats')
        } finally {
            setLoadingLeetCode(false)
        }
    }

    const fetchGitHubStats = async () => {
        setLoadingGitHub(true)
        setGithubError(null)
        try {
            const response = await fetch(`/api/github/stats?username=${encodeURIComponent(githubUsername!)}`)
            const data = await response.json()
            if (data.success) {
                setGithubStats(data.stats)
            } else {
                setGithubError(data.message || 'Failed to fetch GitHub stats')
            }
        } catch (error) {
            setGithubError('Failed to fetch GitHub stats')
        } finally {
            setLoadingGitHub(false)
        }
    }

    if (!user) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Sign In Required</CardTitle>
                        <CardDescription>
                            Please sign in to view your coding statistics.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/login">Sign In</Link>
                        </Button>
                    </CardContent>
                </Card>
            </main>
        )
    }

    const totalProblems = leetcodeStats ? leetcodeStats.totalSolved : 0
    const easyProgress = leetcodeStats ? (leetcodeStats.easySolved / Math.max(leetcodeStats.totalSolved, 1)) * 100 : 0
    const mediumProgress = leetcodeStats ? (leetcodeStats.mediumSolved / Math.max(leetcodeStats.totalSolved, 1)) * 100 : 0
    const hardProgress = leetcodeStats ? (leetcodeStats.hardSolved / Math.max(leetcodeStats.totalSolved, 1)) * 100 : 0

    return (
        <main className="min-h-screen bg-background relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 py-16 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight">Coding Statistics</h1>
                            <p className="text-lg text-muted-foreground">
                                Your coding journey across platforms
                            </p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/profile">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Profile
                            </Link>
                        </Button>
                    </div>

                    {!hasLeetCodeLinked && !hasGitHubLinked && (
                        <Card className="border-dashed">
                            <CardContent className="pt-6 text-center">
                                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="font-semibold text-lg mb-2">No Profiles Linked</h3>
                                <p className="text-muted-foreground mb-4">
                                    Link your coding profiles to see your statistics here
                                </p>
                                <Button asChild>
                                    <Link href="/profile">Link Profiles</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* LeetCode Stats */}
                    {hasLeetCodeLinked && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                                            <Code2 className="h-6 w-6 text-orange-500" />
                                        </div>
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                LeetCode Statistics
                                                <Button variant="ghost" size="sm" asChild>
                                                    <a
                                                        href={`https://leetcode.com/${leetcodeUsername}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            </CardTitle>
                                            <CardDescription>@{leetcodeUsername}</CardDescription>
                                        </div>
                                    </div>
                                    {loadingLeetCode && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {leetcodeError ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                                        <p>{leetcodeError}</p>
                                    </div>
                                ) : loadingLeetCode ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                                        <p>Loading statistics...</p>
                                    </div>
                                ) : leetcodeStats ? (
                                    <div className="space-y-6">
                                        {/* Overview Stats */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center p-4 bg-secondary/50 rounded-lg">
                                                <p className="text-3xl font-bold text-primary">{leetcodeStats.totalSolved}</p>
                                                <p className="text-sm text-muted-foreground mt-1">Total Solved</p>
                                            </div>
                                            <div className="text-center p-4 bg-secondary/50 rounded-lg">
                                                <p className="text-3xl font-bold">{leetcodeStats.ranking || 'N/A'}</p>
                                                <p className="text-sm text-muted-foreground mt-1">Global Ranking</p>
                                            </div>
                                            <div className="text-center p-4 bg-secondary/50 rounded-lg">
                                                <p className="text-3xl font-bold">{leetcodeStats.contributionPoints}</p>
                                                <p className="text-sm text-muted-foreground mt-1">Contribution</p>
                                            </div>
                                            <div className="text-center p-4 bg-secondary/50 rounded-lg">
                                                <p className="text-3xl font-bold">{leetcodeStats.reputation}</p>
                                                <p className="text-sm text-muted-foreground mt-1">Reputation</p>
                                            </div>
                                        </div>

                                        {/* Problem Breakdown */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold">Problems by Difficulty</h3>

                                            {/* Easy */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-green-500 font-medium">Easy</span>
                                                    <span className="text-muted-foreground">{leetcodeStats.easySolved} solved</span>
                                                </div>
                                                <Progress value={easyProgress} className="h-2 bg-green-500/20" />
                                            </div>

                                            {/* Medium */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-yellow-500 font-medium">Medium</span>
                                                    <span className="text-muted-foreground">{leetcodeStats.mediumSolved} solved</span>
                                                </div>
                                                <Progress value={mediumProgress} className="h-2 bg-yellow-500/20" />
                                            </div>

                                            {/* Hard */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-red-500 font-medium">Hard</span>
                                                    <span className="text-muted-foreground">{leetcodeStats.hardSolved} solved</span>
                                                </div>
                                                <Progress value={hardProgress} className="h-2 bg-red-500/20" />
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </CardContent>
                        </Card>
                    )}

                    {/* GitHub Stats */}
                    {hasGitHubLinked && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-foreground/10 flex items-center justify-center">
                                            <Github className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                GitHub Statistics
                                                <Button variant="ghost" size="sm" asChild>
                                                    <a
                                                        href={`https://github.com/${githubUsername}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            </CardTitle>
                                            <CardDescription>@{githubUsername}</CardDescription>
                                        </div>
                                    </div>
                                    {loadingGitHub && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {githubError ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                                        <p>{githubError}</p>
                                    </div>
                                ) : loadingGitHub ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                                        <p>Loading statistics...</p>
                                    </div>
                                ) : githubStats ? (
                                    <div className="space-y-6">
                                        {/* Profile Info */}
                                        {githubStats.bio && (
                                            <p className="text-muted-foreground italic">"{githubStats.bio}"</p>
                                        )}

                                        {/* Overview Stats */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center p-4 bg-secondary/50 rounded-lg">
                                                <GitFork className="h-6 w-6 mx-auto mb-2 text-primary" />
                                                <p className="text-3xl font-bold">{githubStats.publicRepos}</p>
                                                <p className="text-sm text-muted-foreground mt-1">Public Repos</p>
                                            </div>
                                            <div className="text-center p-4 bg-secondary/50 rounded-lg">
                                                <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                                                <p className="text-3xl font-bold">{githubStats.followers}</p>
                                                <p className="text-sm text-muted-foreground mt-1">Followers</p>
                                            </div>
                                            <div className="text-center p-4 bg-secondary/50 rounded-lg">
                                                <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                                                <p className="text-3xl font-bold">{githubStats.following}</p>
                                                <p className="text-sm text-muted-foreground mt-1">Following</p>
                                            </div>
                                            <div className="text-center p-4 bg-secondary/50 rounded-lg">
                                                <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                                                <p className="text-3xl font-bold">{githubStats.totalStars}</p>
                                                <p className="text-sm text-muted-foreground mt-1">Total Stars</p>
                                            </div>
                                        </div>

                                        <div className="text-sm text-muted-foreground text-center">
                                            Member since {new Date(githubStats.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>
                                ) : null}
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            </div>
        </main>
    )
}
