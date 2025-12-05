import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl) console.error("Missing NEXT_PUBLIC_SUPABASE_URL");
if (!supabaseAnonKey) console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");

export const createSupabaseClient = (supabaseToken?: string) => {
    const options = supabaseToken
        ? { global: { headers: { Authorization: `Bearer ${supabaseToken}` } } }
        : {}
    return createClient(supabaseUrl, supabaseAnonKey, options)
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
    const supabase = createSupabaseClient(token)
    const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)

    if (error) {
        console.error('Error fetching user progress:', JSON.stringify(error, null, 2))
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
    const supabase = createSupabaseClient(token)

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
    const supabase = createSupabaseClient(token)
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
    const supabase = createSupabaseClient(token)
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
    const supabase = createSupabaseClient(token)
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
    const supabase = createSupabaseClient(token)
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
    const supabase = createSupabaseClient(token)
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
    const supabase = createSupabaseClient(token)
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
