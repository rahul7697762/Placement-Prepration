import { supabase } from './supabase'

// Coding Profile types
export interface CodingProfile {
    id?: string
    user_id: string
    leetcode_username: string | null
    github_username: string | null
    created_at?: string
    updated_at?: string
}

// Get user's coding profile
export async function getCodingProfile(userId: string): Promise<CodingProfile | null> {
    const { data, error } = await supabase
        .from('coding_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

    if (error) {
        console.error('Error fetching coding profile:', JSON.stringify(error, null, 2))
        return null
    }

    return data as CodingProfile | null
}

// Update or create coding profile
export async function upsertCodingProfile(
    userId: string,
    leetcodeUsername: string | null,
    githubUsername: string | null
): Promise<boolean> {
    const { data: existing } = await supabase
        .from('coding_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

    if (existing) {
        const { error } = await supabase
            .from('coding_profiles')
            .update({
                leetcode_username: leetcodeUsername,
                github_username: githubUsername,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId)

        if (error) {
            console.error('Error updating coding profile:', JSON.stringify(error, null, 2))
            return false
        }
    } else {
        const { error } = await supabase
            .from('coding_profiles')
            .insert({
                user_id: userId,
                leetcode_username: leetcodeUsername,
                github_username: githubUsername,
            })

        if (error) {
            console.error('Error inserting coding profile:', JSON.stringify(error, null, 2))
            return false
        }
    }

    return true
}

// Extract problem slug from LeetCode URL
export function extractLeetCodeSlug(url: string): string | null {
    // Handles both formats:
    // https://leetcode.com/problems/two-sum/
    // https://leetcode.com/problems/two-sum
    const match = url.match(/leetcode\.com\/problems\/([a-z0-9-]+)/i)
    return match ? match[1] : null
}
