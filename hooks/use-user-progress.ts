"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { getUserProgress, toggleQuestionComplete, UserProgress } from "@/lib/supabase";

export function useUserProgress() {
    const { user } = useUser();
    const { getToken } = useAuth();
    const [progress, setProgress] = useState<UserProgress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProgress() {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            let token;
            try {
                token = await getToken({ template: 'supabase' });
            } catch (err) {
                console.warn("Failed to get Supabase token", err);
            }

            const data = await getUserProgress(user.id, token || undefined);
            setProgress(data);
            setLoading(false);
        }

        loadProgress();
    }, [user?.id, getToken]);

    const toggleComplete = async (
        questionId: string,
        patternSlug: string,
        completed: boolean
    ) => {
        if (!user?.id) return false;

        let token;
        try {
            token = await getToken({ template: 'supabase' });
        } catch (err) {
            console.warn("Failed to get Supabase token", err);
        }

        const success = await toggleQuestionComplete(
            user.id,
            questionId,
            patternSlug,
            completed,
            token || undefined
        );

        if (success) {
            // Update local state
            // Re-fetching is safer to stay in sync
            const data = await getUserProgress(user.id, token || undefined);
            setProgress(data);
        }

        return success;
    };

    const isQuestionComplete = (questionId: string) => {
        return progress.some((p) => p.question_id === questionId && p.completed);
    };

    const getPatternCompletionCount = (patternSlug: string) => {
        return progress.filter(
            (p) => p.pattern_slug === patternSlug && p.completed
        ).length;
    };

    return {
        progress,
        loading,
        toggleComplete,
        isQuestionComplete,
        getPatternCompletionCount,
    };
}
