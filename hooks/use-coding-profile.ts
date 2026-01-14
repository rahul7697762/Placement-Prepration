"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getCodingProfile, CodingProfile } from "@/lib/coding-profile"

export function useCodingProfile() {
    const { user } = useAuth()
    const [profile, setProfile] = useState<CodingProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadProfile() {
            if (!user?.id) {
                setLoading(false)
                return
            }

            const data = await getCodingProfile(user.id)
            setProfile(data)
            setLoading(false)
        }

        loadProfile()
    }, [user?.id])

    const refreshProfile = async () => {
        if (!user?.id) return
        const data = await getCodingProfile(user.id)
        setProfile(data)
    }

    return {
        profile,
        loading,
        refreshProfile,
        leetcodeUsername: profile?.leetcode_username || null,
        githubUsername: profile?.github_username || null,
        hasLeetCodeLinked: !!profile?.leetcode_username,
        hasGitHubLinked: !!profile?.github_username,
    }
}
