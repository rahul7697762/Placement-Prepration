# Supabase Setup for User Progress Tracking

This application uses Supabase to store user progress data while using Clerk for authentication.

## Database Schema

The `user_progress` table stores which questions each user has completed:

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,           -- Clerk user ID
  question_id TEXT NOT NULL,       -- Question identifier
  pattern_slug TEXT NOT NULL,      -- Pattern category
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(user_id, question_id)
);
```

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Run the Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `supabase/schema.sql`
3. Run the SQL to create the table and policies

### 3. Configure Environment Variables

Your `.env.local` should already have:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Test the Integration

1. Sign in with Clerk
2. Navigate to any pattern page
3. Click the checkbox next to a question
4. Check your Supabase dashboard to see the data

## How It Works

- **Authentication**: Handled by Clerk
- **User ID**: Clerk's user ID is used as the foreign key in Supabase
- **Progress Tracking**: When a user marks a question as complete, it's stored in Supabase
- **Real-time Sync**: Progress is fetched when the page loads and updated on each toggle

## Files

- `lib/supabase.ts` - Supabase client and helper functions
- `hooks/use-user-progress.ts` - React hook for managing progress
- `supabase/schema.sql` - Database schema
- `app/patterns/[slug]/page.tsx` - Pattern page with progress tracking
