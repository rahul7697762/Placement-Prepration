// Additional types for the enhanced features
export interface UserStats {
    problemsSolved: number;
    dayStreak: number;
    patternsMastered: number;
    thisWeek: number;
    totalTime: number;
    lastActive: string;
}

export interface RecentActivity {
    id: string;
    question_id: string;
    question_name: string;
    pattern_slug: string;
    pattern_name: string;
    completed: boolean;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    completed_at: string;
}

export interface WeeklyGoal {
    id?: string;
    user_id: string;
    week_start: string;
    target_problems: number;
    completed_problems: number;
    created_at?: string;
    updated_at?: string;
}

export interface PatternProgress {
    pattern_slug: string;
    pattern_name: string;
    total_questions: number;
    completed_questions: number;
    percentage: number;
    last_practiced?: string;
}
