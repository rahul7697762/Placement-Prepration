import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')
    const problemSlug = searchParams.get('problemSlug')

    console.log('🔍 Verification Request:', { username, problemSlug })

    if (!username || !problemSlug) {
        return NextResponse.json(
            { error: 'Missing username or problemSlug parameter' },
            { status: 400 }
        )
    }

    try {
        // Use LeetCode's user profile API to get ALL solved problems
        // This is more reliable than recentAcSubmissionList which has a limit
        console.log('📡 Fetching ALL solved problems from profile...')

        const query = `
            query userProblemsSolved($username: String!) {
                allQuestionsCount {
                    difficulty
                    count
                }
                matchedUser(username: $username) {
                    problemsSolvedBeatsStats {
                        difficulty
                        percentage
                    }
                    submitStatsGlobal {
                        acSubmissionNum {
                            difficulty
                            count
                        }
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
            console.error('❌ LeetCode API error:', response.status)
            return NextResponse.json(
                { solved: false, error: 'Failed to fetch from LeetCode API' },
                { status: 502 }
            )
        }

        const data = await response.json()

        if (!data.data?.matchedUser) {
            console.log('⚠️ User not found:', username)
            return NextResponse.json({
                solved: false,
                error: 'User not found on LeetCode',
                message: `LeetCode user "${username}" not found`
            }, { status: 404 })
        }

        const totalSolved = data.data.matchedUser.submitStatsGlobal?.acSubmissionNum
            ?.find((stat: any) => stat.difficulty === 'All')?.count || 0

        console.log(`📊 User ${username} has solved ${totalSolved} total problems`)

        // Now fetch the actual list of solved problems using the user's public profile endpoint
        // This is a REST API that returns all solved problems
        console.log(`📥 Fetching solved problems list from REST API...`)

        const profileUrl = `https://leetcode.com/${username}/`
        const profileResponse = await fetch(profileUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            }
        })

        if (!profileResponse.ok) {
            console.error('❌ Profile fetch failed')
            // Fallback: Try the GraphQL submissions approach with higher limit
            return await checkUsingSubmissions(username, problemSlug, totalSolved)
        }

        const html = await profileResponse.text()

        // Extract the solved problems from the profile page
        // The page contains a JSON object with all solved problems
        const match = html.match(/ng-init='[\s\S]*?problems[\s\S]*?=[\s\S]*?(\[[\s\S]*?\]);/)

        if (!match) {
            console.log('⚠️ Could not parse profile page, falling back to submissions API')
            return await checkUsingSubmissions(username, problemSlug, totalSolved)
        }

        try {
            const solvedProblemsJson = match[1]
            const solvedProblems = JSON.parse(solvedProblemsJson)
            const solvedSlugs = new Set(
                solvedProblems.map((p: any) => p.stat?.question__title_slug?.toLowerCase()).filter(Boolean)
            )

            console.log(`✅ Parsed ${solvedSlugs.size} solved problems from profile`)
            console.log(`🎯 Looking for: "${problemSlug}"`)
            console.log(`📋 Sample slugs:`, Array.from(solvedSlugs).slice(0, 10))

            const solved = solvedSlugs.has(problemSlug.toLowerCase())

            console.log(solved ? '✅ VERIFIED - Problem found!' : '❌ NOT FOUND')

            return NextResponse.json({
                solved,
                username,
                problemSlug,
                message: solved
                    ? 'Problem has been solved on LeetCode'
                    : 'Problem has not been solved on LeetCode yet',
                debug: {
                    totalSolvedProblems: totalSolved,
                    problemsChecked: solvedSlugs.size,
                    allProblemsChecked: true
                }
            })
        } catch (parseError) {
            console.error('❌ Failed to parse problems JSON:', parseError)
            return await checkUsingSubmissions(username, problemSlug, totalSolved)
        }

    } catch (error) {
        console.error('💥 Error checking LeetCode status:', error)
        return NextResponse.json(
            { solved: false, error: 'Internal server error', details: String(error) },
            { status: 500 }
        )
    }
}

// Fallback function using submissions API
async function checkUsingSubmissions(username: string, problemSlug: string, totalSolved: number) {
    console.log('🔄 Using fallback submissions API...')

    const limit = Math.min(10000, Math.max(2000, totalSolved * 2))
    console.log(`📥 Fetching up to ${limit} recent submissions...`)

    const query = `
        query recentAcSubmissions($username: String!, $limit: Int!) {
            recentAcSubmissionList(username: $username, limit: $limit) {
                titleSlug
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
            variables: { username, limit }
        })
    })

    if (!response.ok) {
        return NextResponse.json(
            { solved: false, error: 'Failed to fetch submissions' },
            { status: 502 }
        )
    }

    const data = await response.json()
    const submissions = data.data?.recentAcSubmissionList || []

    const uniqueSlugs = new Set(submissions.map((s: any) => s.titleSlug.toLowerCase()))
    console.log(`📝 Retrieved ${uniqueSlugs.size} unique problems from ${submissions.length} submissions`)

    const solved = uniqueSlugs.has(problemSlug.toLowerCase())

    if (!solved && uniqueSlugs.size < totalSolved) {
        console.log(`⚠️ WARNING: Only checked ${uniqueSlugs.size}/${totalSolved} problems`)
    }

    return NextResponse.json({
        solved,
        username,
        problemSlug,
        message: solved
            ? 'Problem has been solved on LeetCode'
            : uniqueSlugs.size < totalSolved
                ? `Could not fully verify - checked ${uniqueSlugs.size} of ${totalSolved} problems. The problem might be in older submissions not returned by the API.`
                : 'Problem has not been solved on LeetCode yet',
        debug: {
            totalSolvedProblems: totalSolved,
            submissionsChecked: uniqueSlugs.size,
            allProblemsChecked: uniqueSlugs.size >= totalSolved,
            method: 'submissions_fallback'
        }
    })
}
