-- Create solutions table
CREATE TABLE IF NOT EXISTS public.solutions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id TEXT NOT NULL UNIQUE, -- Links to the static question ID (e.g. "1-1")
  title TEXT, -- Optional, for display backup
  content TEXT, -- Markdown solution
  video_url TEXT, -- YouTube/Vimeo link
  code_snippet TEXT, -- Code block
  language TEXT DEFAULT 'javascript',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Public read access
CREATE POLICY "Solutions are viewable by everyone"
  ON public.solutions FOR SELECT
  USING (true);

-- 2. Authenticated write access (Insert/Update)
-- Note: In a production app with roles, you would check (auth.jwt() ->> 'role' = 'admin')
-- For now, we allow any authenticated user to potentially script this, but the UI will be protected.
CREATE POLICY "Authenticated users can insert solutions"
  ON public.solutions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update solutions"
  ON public.solutions FOR UPDATE
  USING (auth.role() = 'authenticated');
