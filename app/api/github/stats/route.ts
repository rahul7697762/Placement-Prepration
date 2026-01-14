import { NextRequest, NextResponse } from 'next/server'

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

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
        return NextResponse.json(
            { error: 'Missing username parameter' },
            { status: 400 }
        )
    }

    try {
        // Fetch user profile
        const userResponse = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'prep4place-app'
            }
        })

        if (!userResponse.ok) {
            if (userResponse.status === 404) {
                return NextResponse.json({
                    error: 'User not found',
                    message: 'GitHub user not found'
                }, { status: 404 })
            }
            return NextResponse.json(
                { error: 'Failed to fetch from GitHub API' },
                { status: 502 }
            )
        }

        const userData = await userResponse.json()

        // Fetch repositories to calculate total stars
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'prep4place-app'
            }
        })

        let totalStars = 0
        if (reposResponse.ok) {
            const repos = await reposResponse.json()
            totalStars = repos.reduce((sum: number, repo: any) => sum + (repo.stargazers_count || 0), 0)
        }

        const stats: GitHubStats = {
            name: userData.name || username,
            bio: userData.bio || '',
            publicRepos: userData.public_repos || 0,
            followers: userData.followers || 0,
            following: userData.following || 0,
            totalStars,
            createdAt: userData.created_at,
            avatarUrl: userData.avatar_url
        }

        return NextResponse.json({
            success: true,
            username,
            stats
        })

    } catch (error) {
        console.error('Error fetching GitHub stats:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
