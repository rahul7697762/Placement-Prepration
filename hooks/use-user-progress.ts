"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProgress, toggleQuestionComplete, UserProgress } from "@/lib/supabase";

export function useUserProgress() {
    const { user } = useAuth();
    const [progress, setProgress] = useState<UserProgress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProgress() {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            // No token needed, Supabase client handles session
            const data = await getUserProgress(user.id);
            setProgress(data);
            setLoading(false);
        }

        loadProgress();
    }, [user?.id]);

    const toggleComplete = async (
        questionId: string,
        patternSlug: string,
        completed: boolean
    ) => {
        if (!user?.id) {
            console.warn("User ID missing in toggleComplete");
            return false;
        }

        const success = await toggleQuestionComplete(
            user.id,
            questionId,
            patternSlug,
            completed
        );

        if (success) {
            // Update local state
            // Re-fetching is safer to stay in sync
            const data = await getUserProgress(user.id);
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
