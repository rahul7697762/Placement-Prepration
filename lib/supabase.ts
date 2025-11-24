import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface UserProgress {
    id?: string
    user_id: string
    question_id: string
    pattern_slug: string
    completed: boolean
    created_at?: string
    updated_at?: string
}

// Helper functions
export async function getUserProgress(userId: string) {
    const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)

    if (error) {
        console.error('Error fetching user progress:', error)
        return []
    }

    return data as UserProgress[]
}

export async function toggleQuestionComplete(
    userId: string,
    questionId: string,
    patternSlug: string,
    completed: boolean
) {
    const { data: existing } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .single()

    if (existing) {
        const { error } = await supabase
            .from('user_progress')
            .update({ completed, updated_at: new Date().toISOString() })
            .eq('user_id', userId)
            .eq('question_id', questionId)

        if (error) {
            console.error('Error updating progress:', error)
            return false
        }
    } else {
        const { error } = await supabase
            .from('user_progress')
            .insert({
                user_id: userId,
                question_id: questionId,
                pattern_slug: patternSlug,
                completed,
            })

        if (error) {
            console.error('Error inserting progress:', error)
            return false
        }
    }

    return true
}

export async function getPatternProgress(userId: string, patternSlug: string) {
    const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('pattern_slug', patternSlug)

    if (error) {
        console.error('Error fetching pattern progress:', error)
        return []
    }

    return data as UserProgress[]
}
