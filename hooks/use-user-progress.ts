"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserProgress, toggleQuestionComplete, UserProgress } from "@/lib/supabase";

export function useUserProgress() {
    const { user } = useUser();
    const [progress, setProgress] = useState<UserProgress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProgress() {
            if (!user?.id) {
                setLoading(false);
                return;
            }

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
        if (!user?.id) return false;

        const success = await toggleQuestionComplete(
            user.id,
            questionId,
            patternSlug,
            completed
        );

        if (success) {
            // Update local state
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
