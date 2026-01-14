import { NextRequest, NextResponse } from 'next/server'

interface LeetCodeStats {
    totalSolved: number
    easySolved: number
    mediumSolved: number
    hardSolved: number
    ranking: number
    contributionPoints: number
    reputation: number
}

interface LeetCodeAPIResponse {
    data: {
        matchedUser: {
            submitStats: {
                acSubmissionNum: Array<{
                    difficulty: string
                    count: number
                    submissions: number
                }>
            }
            profile: {
                ranking: number
                reputation: number
            }
            contributions: {
                points: number
            }
        }
    }
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
        // LeetCode GraphQL API to get user stats
        const query = `
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    submitStats {
                        acSubmissionNum {
                            difficulty
                            count
                            submissions
                        }
                    }
                    profile {
                        ranking
                        reputation
                    }
                    contributions {
                        points
                    }
                }
            }
        `

        const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com',
            },
            body: JSON.stringify({
                query,
                variables: { username }
            })
        })

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch from LeetCode API' },
                { status: 502 }
            )
        }

        const data: LeetCodeAPIResponse = await response.json()

        if (!data.data?.matchedUser) {
            return NextResponse.json({
                error: 'User not found',
                message: 'LeetCode user not found'
            }, { status: 404 })
        }

        const submissions = data.data.matchedUser.submitStats.acSubmissionNum

        const stats: LeetCodeStats = {
            totalSolved: submissions.find(s => s.difficulty === 'All')?.count || 0,
            easySolved: submissions.find(s => s.difficulty === 'Easy')?.count || 0,
            mediumSolved: submissions.find(s => s.difficulty === 'Medium')?.count || 0,
            hardSolved: submissions.find(s => s.difficulty === 'Hard')?.count || 0,
            ranking: data.data.matchedUser.profile?.ranking || 0,
            contributionPoints: data.data.matchedUser.contributions?.points || 0,
            reputation: data.data.matchedUser.profile?.reputation || 0,
        }

        return NextResponse.json({
            success: true,
            username,
            stats
        })

    } catch (error) {
        console.error('Error fetching LeetCode stats:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
