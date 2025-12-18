import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { InterviewSession, InterviewFeedback } from "@/types/interview";

// Database types
interface InterviewRecord {
    id: string;
    user_id: string;
    interview_type: string;
    skills: string[];
    experience_level?: string;
    resume_data?: object;
    transcript: object[];
    eye_tracking_metrics: object;
    feedback: object;
    scores: object;
    overall_verdict: string;
    duration: number;
    created_at: string;
}

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookies) {
                        cookies.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    },
                },
            }
        );

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { session, feedback }: { session: InterviewSession; feedback: InterviewFeedback } = body;

        if (!session || !feedback) {
            return NextResponse.json(
                { error: "Session and feedback data are required" },
                { status: 400 }
            );
        }

        // Calculate duration
        const duration = session.endTime
            ? Math.round((session.endTime - session.startTime) / 1000)
            : 0;

        // Prepare record
        const record: Partial<InterviewRecord> = {
            user_id: user.id,
            interview_type: session.type,
            skills: session.skillSelection?.skills || [],
            experience_level: session.skillSelection?.experienceLevel,
            resume_data: session.parsedResume || undefined,
            transcript: session.transcript,
            eye_tracking_metrics: session.eyeTrackingMetrics || {},
            feedback: feedback,
            scores: feedback.scores,
            overall_verdict: feedback.overallVerdict,
            duration,
        };

        // Insert into database
        const { data, error } = await supabase
            .from("interview_history")
            .insert(record)
            .select()
            .single();

        if (error) {
            console.error("Error saving interview:", error);
            return NextResponse.json(
                { error: "Failed to save interview" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, id: data.id });
    } catch (error) {
        console.error("Error in save-interview API:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
