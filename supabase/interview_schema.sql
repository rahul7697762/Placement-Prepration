-- ============================================
-- AI Interview Module Database Schema
-- ============================================

-- Interview History Table
CREATE TABLE IF NOT EXISTS interview_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    interview_type VARCHAR(50) NOT NULL CHECK (interview_type IN ('skill-based', 'resume-based')),
    skills TEXT[] DEFAULT '{}',
    experience_level VARCHAR(50),
    resume_data JSONB,
    transcript JSONB NOT NULL DEFAULT '[]',
    eye_tracking_metrics JSONB DEFAULT '{}',
    feedback JSONB NOT NULL,
    scores JSONB NOT NULL,
    overall_verdict VARCHAR(50) NOT NULL CHECK (overall_verdict IN ('hire', 'borderline', 'needs-improvement')),
    duration INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_interview_history_user_id ON interview_history(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_history_created_at ON interview_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interview_history_type ON interview_history(interview_type);

-- Enable Row Level Security
ALTER TABLE interview_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own interview history
CREATE POLICY "Users can view own interview history" ON interview_history
    FOR SELECT
    USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own interview history
CREATE POLICY "Users can insert own interview history" ON interview_history
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own interview history
CREATE POLICY "Users can update own interview history" ON interview_history
    FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS Policy: Users can delete their own interview history
CREATE POLICY "Users can delete own interview history" ON interview_history
    FOR DELETE
    USING (auth.uid() = user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_interview_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger
DROP TRIGGER IF EXISTS update_interview_history_updated_at ON interview_history;
CREATE TRIGGER update_interview_history_updated_at
    BEFORE UPDATE ON interview_history
    FOR EACH ROW
    EXECUTE FUNCTION update_interview_updated_at();

-- ============================================
-- Interview Skill Analysis Table (Optional)
-- For tracking skill-wise progress over time
-- ============================================

CREATE TABLE IF NOT EXISTS interview_skill_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    interview_id UUID REFERENCES interview_history(id) ON DELETE CASCADE,
    skill VARCHAR(100) NOT NULL,
    score INTEGER CHECK (score >= 1 AND score <= 10),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for skill analysis
CREATE INDEX IF NOT EXISTS idx_skill_analysis_user_skill ON interview_skill_analysis(user_id, skill);
CREATE INDEX IF NOT EXISTS idx_skill_analysis_interview ON interview_skill_analysis(interview_id);

-- Enable RLS
ALTER TABLE interview_skill_analysis ENABLE ROW LEVEL SECURITY;

-- RLS Policies for skill analysis
CREATE POLICY "Users can view own skill analysis" ON interview_skill_analysis
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skill analysis" ON interview_skill_analysis
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- View for Interview Statistics
-- ============================================

CREATE OR REPLACE VIEW user_interview_stats AS
SELECT 
    user_id,
    COUNT(*) as total_interviews,
    AVG(
        ((scores->>'communicationSkills')::numeric + 
         (scores->>'technicalAccuracy')::numeric +
         (scores->>'confidenceClarity')::numeric +
         (scores->>'eyeContactBodyLanguage')::numeric) / 4
    ) as average_score,
    COUNT(*) FILTER (WHERE overall_verdict = 'hire') as hire_count,
    COUNT(*) FILTER (WHERE overall_verdict = 'borderline') as borderline_count,
    COUNT(*) FILTER (WHERE overall_verdict = 'needs-improvement') as needs_improvement_count,
    SUM(duration) as total_duration_seconds,
    MAX(created_at) as last_interview_date
FROM interview_history
GROUP BY user_id;

-- Grant access to authenticated users for the view
-- Note: Views inherit RLS from underlying tables

-- ============================================
-- Function to get user's skill progress
-- ============================================

CREATE OR REPLACE FUNCTION get_skill_progress(p_user_id UUID)
RETURNS TABLE (
    skill VARCHAR,
    avg_score NUMERIC,
    interview_count BIGINT,
    latest_score INTEGER,
    trend VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    WITH skill_scores AS (
        SELECT 
            isa.skill,
            isa.score,
            isa.created_at,
            ROW_NUMBER() OVER (PARTITION BY isa.skill ORDER BY isa.created_at DESC) as rn
        FROM interview_skill_analysis isa
        WHERE isa.user_id = p_user_id
    ),
    skill_stats AS (
        SELECT 
            ss.skill,
            AVG(ss.score)::NUMERIC as avg_score,
            COUNT(*) as interview_count,
            MAX(CASE WHEN ss.rn = 1 THEN ss.score END) as latest_score,
            MAX(CASE WHEN ss.rn = 2 THEN ss.score END) as prev_score
        FROM skill_scores ss
        GROUP BY ss.skill
    )
    SELECT 
        sst.skill,
        ROUND(sst.avg_score, 1) as avg_score,
        sst.interview_count,
        sst.latest_score,
        CASE 
            WHEN sst.prev_score IS NULL THEN 'new'
            WHEN sst.latest_score > sst.prev_score THEN 'up'
            WHEN sst.latest_score < sst.prev_score THEN 'down'
            ELSE 'stable'
        END as trend
    FROM skill_stats sst
    ORDER BY sst.interview_count DESC, sst.avg_score DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
