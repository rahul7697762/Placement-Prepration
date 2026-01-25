import { supabase } from '@/lib/supabase';

// Get user statistics
export async function getUserStats(userId: string) {
    try {
        // Get all user progress
        const { data: progress, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Calculate stats
        const problemsSolved = progress?.filter(p => p.completed).length || 0;

        // Calculate this week's problems
        const thisWeek = progress?.filter(p =>
            p.completed && new Date(p.updated_at) >= weekAgo
        ).length || 0;

        // Calculate day streak (simplified - counts consecutive days)
        const dayStreak = await calculateStreak(userId);

        // Calculate patterns mastered (patterns with 100% completion)
        const patternsMastered = await calculatePatternsMastered(userId);

        return {
            problemsSolved,
            dayStreak,
            patternsMastered,
            thisWeek,
            totalTime: 0, // Can be calculated if you track time
            lastActive: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return {
            problemsSolved: 0,
            dayStreak: 0,
            patternsMastered: 0,
            thisWeek: 0,
            totalTime: 0,
            lastActive: new Date().toISOString()
        };
    }
}

// Calculate day streak
async function calculateStreak(userId: string): Promise<number> {
    try {
        const { data, error } = await supabase
            .from('user_progress')
            .select('updated_at')
            .eq('user_id', userId)
            .eq('completed', true)
            .order('updated_at', { ascending: false });

        if (error || !data || data.length === 0) return 0;

        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // Group by dates
        const dates = new Set(
            data.map(p => new Date(p.updated_at).toDateString())
        );

        // Check consecutive days from today backwards
        while (dates.has(currentDate.toDateString())) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        }

        return streak;
    } catch (error) {
        console.error('Error calculating streak:', error);
        return 0;
    }
}

// Calculate patterns mastered
async function calculatePatternsMastered(userId: string): Promise<number> {
    try {
        const { data: progress } = await supabase
            .from('user_progress')
            .select('pattern_slug, completed')
            .eq('user_id', userId);

        if (!progress) return 0;

        // Group by pattern
        const patternStats: { [key: string]: { total: number; completed: number } } = {};

        progress.forEach(p => {
            if (!patternStats[p.pattern_slug]) {
                patternStats[p.pattern_slug] = { total: 0, completed: 0 };
            }
            patternStats[p.pattern_slug].total++;
            if (p.completed) {
                patternStats[p.pattern_slug].completed++;
            }
        });

        // Count patterns with 100% completion
        return Object.values(patternStats).filter(
            stat => stat.completed === stat.total && stat.total > 0
        ).length;
    } catch (error) {
        console.error('Error calculating patterns mastered:', error);
        return 0;
    }
}

// Get recent activity
export async function getRecentActivity(userId: string, limit: number = 10) {
    try {
        const { data, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        return data?.map(item => ({
            id: item.id,
            question_id: item.question_id,
            question_name: extractQuestionName(item.question_id),
            pattern_slug: item.pattern_slug,
            pattern_name: formatPatternName(item.pattern_slug),
            completed: item.completed,
            difficulty: 'Medium' as const, // Would need to store this in DB
            completed_at: item.updated_at
        })) || [];
    } catch (error) {
        console.error('Error fetching recent activity:', error);
        return [];
    }
}

// Get pattern progress for recommendations
export async function getPatternProgress(userId: string) {
    try {
        const { data: progress } = await supabase
            .from('user_progress')
            .select('pattern_slug, completed, updated_at')
            .eq('user_id', userId);

        if (!progress) return [];

        // Group by pattern
        const patternStats: { [key: string]: any } = {};

        progress.forEach(p => {
            if (!patternStats[p.pattern_slug]) {
                patternStats[p.pattern_slug] = {
                    pattern_slug: p.pattern_slug,
                    pattern_name: formatPatternName(p.pattern_slug),
                    total_questions: 0,
                    completed_questions: 0,
                    last_practiced: p.updated_at
                };
            }
            patternStats[p.pattern_slug].total_questions++;
            if (p.completed) {
                patternStats[p.pattern_slug].completed_questions++;
            }
            if (new Date(p.updated_at) > new Date(patternStats[p.pattern_slug].last_practiced)) {
                patternStats[p.pattern_slug].last_practiced = p.updated_at;
            }
        });

        return Object.values(patternStats).map((stat: any) => ({
            ...stat,
            percentage: stat.total_questions > 0
                ? Math.round((stat.completed_questions / stat.total_questions) * 100)
                : 0
        }));
    } catch (error) {
        console.error('Error fetching pattern progress:', error);
        return [];
    }
}

// Get or create weekly goal
export async function getWeeklyGoal(userId: string) {
    try {
        const weekStart = getWeekStart();

        // Try to get existing goal
        const { data: existing } = await supabase
            .from('weekly_goals')
            .select('*')
            .eq('user_id', userId)
            .eq('week_start', weekStart)
            .maybeSingle();

        if (existing) {
            // Update completed count
            const { data: thisWeekProgress } = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', userId)
                .eq('completed', true)
                .gte('updated_at', weekStart);

            const completed = thisWeekProgress?.length || 0;

            await supabase
                .from('weekly_goals')
                .update({ completed_problems: completed })
                .eq('id', existing.id);

            return { ...existing, completed_problems: completed };
        }

        // Create default goal if none exists
        const { data: newGoal, error } = await supabase
            .from('weekly_goals')
            .insert({
                user_id: userId,
                week_start: weekStart,
                target_problems: 10,
                completed_problems: 0
            })
            .select()
            .single();

        if (error) throw error;
        return newGoal;
    } catch (error) {
        console.error('Error fetching weekly goal:', error);
        return {
            user_id: userId,
            week_start: getWeekStart(),
            target_problems: 10,
            completed_problems: 0
        };
    }
}

// Update weekly goal target
export async function updateWeeklyGoal(userId: string, targetProblems: number) {
    try {
        const weekStart = getWeekStart();

        const { data, error } = await supabase
            .from('weekly_goals')
            .upsert({
                user_id: userId,
                week_start: weekStart,
                target_problems: targetProblems,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id,week_start'
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating weekly goal:', error);
        return null;
    }
}

// Helper functions
function getWeekStart(): string {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Monday start
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString();
}

function extractQuestionName(questionId: string): string {
    // Convert question ID to readable name
    // E.g., "two-sum" -> "Two Sum"
    return questionId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function formatPatternName(patternSlug: string): string {
    // Convert pattern slug to readable name
    // E.g., "two-pointers" -> "Two Pointers"
    return patternSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Get personalized recommendations
export async function getPersonalizedRecommendations(userId: string) {
    try {
        const patterns = await getPatternProgress(userId);

        // Sort patterns by:
        // 1. Started but not completed (in progress)
        // 2. Not started
        // 3. Recently practiced

        const inProgress = patterns.filter(p =>
            p.percentage > 0 && p.percentage < 100
        ).sort((a, b) => b.percentage - a.percentage);

        const notStarted = patterns.filter(p => p.percentage === 0);

        const recentlyPracticed = patterns
            .filter(p => p.last_practiced)
            .sort((a, b) =>
                new Date(b.last_practiced!).getTime() - new Date(a.last_practiced!).getTime()
            )
            .slice(0, 3);

        // Prioritize in-progress patterns
        const recommendations = [
            ...inProgress.slice(0, 2),
            ...recentlyPracticed.slice(0, 1),
            ...notStarted.slice(0, 1)
        ].slice(0, 3);

        // Add default recommendations if not enough
        const defaults = [
            {
                title: "Blind 75 Problems",
                description: "Most efficient interview prep strategy",
                progress: 0,
                total: 75,
                link: "/roadmap/blind-75",
                color: "bg-blue-500"
            },
            {
                title: "DSA Patterns",
                description: "Master core algorithm patterns",
                progress: 0,
                total: 20,
                link: "/patterns",
                color: "bg-purple-500"
            },
            {
                title: "System Design",
                description: "Learn scalable architecture",
                progress: 0,
                total: 15,
                link: "/roadmap",
                color: "bg-green-500"
            }
        ];

        return recommendations.length > 0 ? recommendations.map((r, idx) => ({
            title: r.pattern_name,
            description: `Continue your progress (${r.percentage}% complete)`,
            progress: r.completed_questions,
            total: r.total_questions,
            link: `/patterns/${r.pattern_slug}`,
            color: ['bg-blue-500', 'bg-purple-500', 'bg-green-500'][idx]
        })) : defaults;
    } catch (error) {
        console.error('Error getting recommendations:', error);
        // Return default recommendations
        return [
            {
                title: "Blind 75 Problems",
                description: "Most efficient interview prep strategy",
                progress: 0,
                total: 75,
                link: "/roadmap/blind-75",
                color: "bg-blue-500"
            },
            {
                title: "DSA Patterns",
                description: "Master core algorithm patterns",
                progress: 0,
                total: 20,
                link: "/patterns",
                color: "bg-purple-500"
            },
            {
                title: "System Design",
                description: "Learn scalable architecture",
                progress: 0,
                total: 15,
                link: "/roadmap",
                color: "bg-green-500"
            }
        ];
    }
}
