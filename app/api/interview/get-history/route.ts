import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { InterviewHistoryEntry } from "@/types/interview";

export async function GET(request: NextRequest) {
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

        // Get query params
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get("limit") || "10");
        const offset = parseInt(searchParams.get("offset") || "0");

        // Fetch interview history
        const { data, error, count } = await supabase
            .from("interview_history")
            .select("*", { count: "exact" })
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error("Error fetching history:", error);
            return NextResponse.json(
                { error: "Failed to fetch interview history" },
                { status: 500 }
            );
        }

        // Transform to history entries
        const history: InterviewHistoryEntry[] = (data || []).map((record) => ({
            id: record.id,
            userId: record.user_id,
            type: record.interview_type,
            date: record.created_at,
            duration: record.duration,
            scores: record.scores,
            overallVerdict: record.overall_verdict,
            skillsCovered: record.skills || [],
        }));

        return NextResponse.json({
            history,
            total: count || 0,
            limit,
            offset,
        });
    } catch (error) {
        console.error("Error in get-history API:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Get single interview details
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

        const { interviewId } = await request.json();

        if (!interviewId) {
            return NextResponse.json(
                { error: "Interview ID is required" },
                { status: 400 }
            );
        }

        // Fetch specific interview
        const { data, error } = await supabase
            .from("interview_history")
            .select("*")
            .eq("id", interviewId)
            .eq("user_id", user.id)
            .single();

        if (error) {
            console.error("Error fetching interview:", error);
            return NextResponse.json(
                { error: "Interview not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in get-interview API:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
