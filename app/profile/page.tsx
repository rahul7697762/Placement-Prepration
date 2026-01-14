"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useCodingProfile } from "@/hooks/use-coding-profile"
import { upsertCodingProfile } from "@/lib/coding-profile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    User,
    Github,
    ExternalLink,
    Check,
    Loader2,
    Link2,
    Code2,
    TrendingUp
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
    const router = useRouter()
    const { user } = useAuth()
    const { profile, loading, refreshProfile, hasLeetCodeLinked, hasGitHubLinked } = useCodingProfile()

    const [leetcodeUsername, setLeetcodeUsername] = useState("")
    const [githubUsername, setGithubUsername] = useState("")
    const [saving, setSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    useEffect(() => {
        if (profile) {
            setLeetcodeUsername(profile.leetcode_username || "")
            setGithubUsername(profile.github_username || "")
        }
    }, [profile])

    const handleSave = async () => {
        if (!user?.id) return

        setSaving(true)
        setSaveSuccess(false)

        const success = await upsertCodingProfile(
            user.id,
            leetcodeUsername.trim() || null,
            githubUsername.trim() || null
        )

        if (success) {
            await refreshProfile()
            setSaveSuccess(true)

            // Redirect to stats page after showing success message
            setTimeout(() => {
                router.push('/coding-stats')
            }, 1500)
        }

        setSaving(false)
    }

    if (!user) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Sign In Required</CardTitle>
                        <CardDescription>
                            Please sign in to manage your coding profile.
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

    if (loading) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="container mx-auto px-6 md:px-12 py-16 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight">Coding Profile</h1>
                            <p className="text-lg text-muted-foreground">
                                Link your coding profiles to verify your progress automatically.
                            </p>
                        </div>
                        {(hasLeetCodeLinked || hasGitHubLinked) && (
                            <Button asChild>
                                <Link href="/coding-stats">
                                    <TrendingUp className="h-4 w-4 mr-2" />
                                    View Stats
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* User Info Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Account
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                    {user.email?.[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-medium">{user.email}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Member since {new Date(user.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Coding Profiles Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Link2 className="h-5 w-5" />
                                Linked Profiles
                            </CardTitle>
                            <CardDescription>
                                Connect your LeetCode account to enable automatic problem verification.
                                This ensures you actually solve problems before marking them complete.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* LeetCode */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="leetcode" className="flex items-center gap-2 text-base">
                                        <Code2 className="h-4 w-4 text-orange-500" />
                                        LeetCode Username
                                    </Label>
                                    {hasLeetCodeLinked && (
                                        <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                                            <Check className="h-3 w-3 mr-1" />
                                            Linked
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        id="leetcode"
                                        placeholder="e.g. your_leetcode_username"
                                        value={leetcodeUsername}
                                        onChange={(e) => setLeetcodeUsername(e.target.value)}
                                        className="flex-1"
                                    />
                                    {leetcodeUsername && (
                                        <Button variant="outline" size="icon" asChild>
                                            <a
                                                href={`https://leetcode.com/${leetcodeUsername}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    When linked, you can only mark questions as complete if you've solved them on LeetCode.
                                </p>
                            </div>

                            {/* GitHub */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="github" className="flex items-center gap-2 text-base">
                                        <Github className="h-4 w-4" />
                                        GitHub Username
                                    </Label>
                                    {hasGitHubLinked && (
                                        <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                                            <Check className="h-3 w-3 mr-1" />
                                            Linked
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        id="github"
                                        placeholder="e.g. your_github_username"
                                        value={githubUsername}
                                        onChange={(e) => setGithubUsername(e.target.value)}
                                        className="flex-1"
                                    />
                                    {githubUsername && (
                                        <Button variant="outline" size="icon" asChild>
                                            <a
                                                href={`https://github.com/${githubUsername}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Your GitHub profile will be displayed on your public profile.
                                </p>
                            </div>

                            {/* Save Button */}
                            <div className="pt-4 flex items-center gap-4">
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="min-w-32"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Profiles"
                                    )}
                                </Button>
                                {saveSuccess && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-green-500 text-sm flex items-center gap-1"
                                    >
                                        <Check className="h-4 w-4" />
                                        Saved successfully!
                                    </motion.span>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <Card className="border-primary/30 bg-primary/5">
                        <CardContent className="pt-6">
                            <div className="flex gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Code2 className="h-5 w-5 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-medium">How LeetCode Verification Works</p>
                                    <p className="text-sm text-muted-foreground">
                                        Once you link your LeetCode account, when you try to mark a problem as complete,
                                        we'll check your LeetCode submissions first. If you haven't solved it yet,
                                        you'll be prompted to solve it on LeetCode first. This ensures your progress is real!
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </main>
    )
}
