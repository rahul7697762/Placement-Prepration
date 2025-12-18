import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * DEPRECATED: Resume upload has been disabled.
 * 
 * This API route is kept for reference but returns a controlled error.
 * Resume-based interviews have been replaced with manual input modes:
 * - General Interview: /interview/general
 * - Role-Based Interview: /interview/role
 * 
 * The parsing logic is preserved in the following files (unused):
 * - lib/pdfTextParser.ts
 * - lib/docxTextParser.ts
 * - lib/pdfOcrParser.ts
 * - lib/gemini.ts (parseResumeWithGemini function)
 */

export async function POST(req: NextRequest) {
    console.log("[parse-resume API] DEPRECATED: Resume upload is disabled");

    return NextResponse.json(
        {
            error: "Resume upload has been disabled",
            message: "Please use the manual interview input instead. Choose either General Interview or Role-Based Interview from the interview page.",
            deprecated: true,
            alternatives: [
                { path: "/interview/general", label: "General Interview" },
                { path: "/interview/role", label: "Role-Based Interview" }
            ]
        },
        { status: 410 } // 410 Gone - resource no longer available
    );
}

// ============================================
// PRESERVED CODE (UNUSED) - DO NOT DELETE
// ============================================
//
// The following imports and functions were used for resume parsing:
//
// import { parsePdfText } from "../../../lib/pdfTextParser";
// import { parseDocxText } from "../../../lib/docxTextParser";
// import { parseResumeWithGemini } from "../../../lib/gemini";
// import { createFallbackVapiContext } from "@/types/vapi";
//
// Regex Helpers:
// function extractEmail(text: string): string { ... }
// function extractPhone(text: string): string { ... }
// function extractLinks(text: string) { ... }
// function extractName(text: string): string { ... }
//
// The full implementation is preserved in git history.
// ============================================
