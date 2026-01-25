-- Create weekly_goals table
CREATE TABLE IF NOT EXISTS public.weekly_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    week_start TIMESTAMP WITH TIME ZONE NOT NULL,
    target_problems INTEGER NOT NULL DEFAULT 10,
    completed_problems INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, week_start)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_weekly_goals_user_id ON public.weekly_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_goals_week_start ON public.weekly_goals(week_start);

-- Enable Row Level Security
ALTER TABLE public.weekly_goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own weekly goals"
    ON public.weekly_goals
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly goals"
    ON public.weekly_goals
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly goals"
    ON public.weekly_goals
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly goals"
    ON public.weekly_goals
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_weekly_goals_updated_at
    BEFORE UPDATE ON public.weekly_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.weekly_goals TO authenticated;
GRANT ALL ON public.weekly_goals TO service_role;
