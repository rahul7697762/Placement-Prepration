import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Debug environment variables
if (!supabaseUrl) {
    console.error("CRITICAL: Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
} else if (!supabaseUrl.startsWith('http')) {
    console.warn(`WARNING: NEXT_PUBLIC_SUPABASE_URL ("${supabaseUrl}") does not start with 'http'. Requests may fail.`);
}

if (!supabaseAnonKey) {
    console.error("CRITICAL: Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export const createSupabaseClient = (supabaseToken?: string) => {
    return supabase;
}

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
export async function getUserProgress(userId: string, token?: string) {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('supabaseUrl or supabaseAnonKey missing in getUserProgress')
        return []
    }
    const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)

    if (error) {
        console.warn('Error fetching user progress:', JSON.stringify(error, null, 2))
        return []
    }

    return data as UserProgress[]
}

export async function toggleQuestionComplete(
    userId: string,
    questionId: string,
    patternSlug: string,
    completed: boolean,
    token?: string
) {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('supabaseUrl or supabaseAnonKey missing in toggleQuestionComplete')
        return false
    }

    // Check if entry exists
    const { data: existing, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .maybeSingle()

    if (fetchError) {
        console.error('Error checking existing progress:', JSON.stringify(fetchError, null, 2))
    }

    if (existing) {
        const { error } = await supabase
            .from('user_progress')
            .update({ completed, updated_at: new Date().toISOString() })
            .eq('user_id', userId)
            .eq('question_id', questionId)

        if (error) {
            console.error('Error updating progress:', JSON.stringify(error, null, 2))
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
            console.error('Error inserting progress:', JSON.stringify(error, null, 2))
            return false
        }
    }

    return true
}

export async function getPatternProgress(userId: string, patternSlug: string, token?: string) {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('supabaseUrl or supabaseAnonKey missing in getPatternProgress')
        return []
    }
    const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('pattern_slug', patternSlug)

    if (error) {
        console.error('Error fetching pattern progress:', JSON.stringify(error, null, 2))
        return []
    }

    return data as UserProgress[]
}

// Community types
export interface Post {
    id: string
    title: string
    content: string
    user_id: string
    author_name: string
    created_at: string
    likes: number
    tags?: string[]
}

export interface Comment {
    id: string
    post_id: string
    content: string
    user_id: string
    author_name: string
    created_at: string
}

// Community Helper functions
export async function fetchPosts(token?: string) {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching posts:', JSON.stringify(error, null, 2))
        return []
    }

    return data as Post[]
}

export async function fetchPostById(postId: string, token?: string) {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single()

    if (error) {
        console.error('Error fetching post:', JSON.stringify(error, null, 2))
        return null
    }

    return data as Post
}

export async function createPost(post: Omit<Post, 'id' | 'created_at' | 'likes'>, token?: string) {
    const { data, error } = await supabase
        .from('posts')
        .insert(post)
        .select()
        .single()

    if (error) {
        console.error('Error creating post:', JSON.stringify(error, null, 2))
        return null
    }

    return data as Post
}

export async function fetchComments(postId: string, token?: string) {
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching comments:', JSON.stringify(error, null, 2))
        return []
    }

    return data as Comment[]
}

export async function createComment(comment: Omit<Comment, 'id' | 'created_at'>, token?: string) {
    const { data, error } = await supabase
        .from('comments')
        .insert(comment)
        .select()
        .single()

    if (error) {
        console.error('Error creating comment:', JSON.stringify(error, null, 2))
        return null
    }

    return data as Comment
}

// Solutions types
export interface Solution {
    id: string
    question_id: string
    title?: string // Optional display title
    content: string
    video_url?: string
    code_snippet?: string
    language?: string
    created_at?: string
    updated_at?: string
}

// Solutions Helper functions
export async function getSolution(questionId: string) {
    const { data, error } = await supabase
        .from('solutions')
        .select('*')
        .eq('question_id', questionId)
        .single() // Expecting at most one solution per question

    if (error) {
        if (error.code !== 'PGRST116') { // Ignore "Row not found" error
            console.error('Error fetching solution:', JSON.stringify(error, null, 2))
        }
        return null
    }

    return data as Solution
}

export async function upsertSolution(solution: Omit<Solution, 'id' | 'created_at' | 'updated_at'>) {
    // Check if exists first to get ID for update or just use upsert
    // upsert requires a unique constraint on question_id
    const { data, error } = await supabase
        .from('solutions')
        .upsert(
            { ...solution, updated_at: new Date().toISOString() },
            { onConflict: 'question_id' }
        )
        .select()
        .single()

    if (error) {
        console.error('Error upserting solution:', JSON.stringify(error, null, 2))
        return null
    }

    return data as Solution
}

export async function getAllSolutions() {
    const { data, error } = await supabase
        .from('solutions')
        .select('question_id, id, updated_at')

    if (error) {
        console.error('Error fetching all solutions:', JSON.stringify(error, null, 2))
        return []
    }

    return data as Partial<Solution>[]
}
