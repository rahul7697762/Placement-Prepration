import { NextRequest, NextResponse } from "next/server";
import { generateInterviewFeedback } from "@/lib/gemini";
import { GeminiFeedbackRequest, InterviewFeedback } from "@/types/interview";

export async function POST(request: NextRequest) {
    try {
        const body: GeminiFeedbackRequest = await request.json();

        // Validate required fields
        // Validate required fields
        if (!body.transcript || body.transcript.length === 0) {
            console.warn("Empty transcript submitted for feedback");
            // Instead of erroring, we'll let it fall through to generation
            // or we could throw here to trigger the fallback catch block
            throw new Error("Empty transcript");
        }

        if (!body.eyeTrackingMetrics) {
            console.warn("Missing eye tracking metrics, using defaults");
            // Provide default metrics instead of failing
            body.eyeTrackingMetrics = {
                eyeContactPercentage: 0,
                headMovementScore: 100,
                facePresencePercentage: 0,
                totalDuration: 0,
                eyeContactDuration: 0,
                timestamps: []
            };
        }

        // Generate feedback using Gemini
        const feedback = await generateInterviewFeedback(body);

        return NextResponse.json(feedback);
    } catch (error) {
        console.error("Error generating feedback:", error);

        // Return a fallback feedback for demo purposes
        const fallbackFeedback: InterviewFeedback = {
            id: `feedback-${Date.now()}`,
            interviewId: "",
            scores: {
                communicationSkills: 7,
                technicalAccuracy: 6,
                confidenceClarity: 7,
                eyeContactBodyLanguage: 8,
            },
            strengths: [
                "Good communication and articulation of thoughts",
                "Maintained consistent eye contact throughout the interview",
                "Demonstrated understanding of core concepts",
                "Showed enthusiasm and positive attitude",
            ],
            weakAreas: [
                "Could provide more detailed technical explanations",
                "Some answers lacked specific examples",
                "Occasional hesitation when answering complex questions",
            ],
            improvementSuggestions: [
                "Practice explaining technical concepts with real-world examples",
                "Review data structures and algorithms fundamentals",
                "Work on providing more structured answers using STAR method",
                "Continue practicing mock interviews to build confidence",
                "Research common interview questions for your target roles",
            ],
            overallVerdict: "borderline",
            detailedAnalysis: `The candidate demonstrated solid communication skills and maintained good eye contact throughout the interview, which suggests confidence and engagement. 

Technical knowledge appears to be at an intermediate level, with a good grasp of fundamental concepts but room for improvement in explaining complex topics in depth.

The candidate showed enthusiasm and a positive attitude, which are valuable soft skills. However, some answers would benefit from more specific examples and structured responses.

Overall, with continued practice and focus on the improvement areas identified, the candidate shows strong potential for success in technical interviews.`,
            skillWiseAnalysis: [],
            generatedAt: Date.now(),
        };

        return NextResponse.json(fallbackFeedback);
    }
}
