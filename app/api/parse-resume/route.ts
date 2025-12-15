import { NextRequest, NextResponse } from "next/server";
import { parsePdfText } from "../../../lib/pdfTextParser";
import { parsePdfWithOCR } from "../../../lib/pdfOcrParser";

export const runtime = "nodejs";

function extractEmail(text: string) {
    return text.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/
    )?.[0] || "";
}

function extractPhone(text: string) {
    return text.match(/(\+91[-\s]?)?[6-9]\d{9}/)?.[0] || "";
}

function extractLinks(text: string) {
    return {
        linkedin: text.match(/linkedin\.com\/in\/[\w-]+/i)?.[0] || "",
        github: text.match(/github\.com\/[\w-]+/i)?.[0] || ""
    };
}

const SKILLS = [
    "javascript", "typescript", "react", "next.js",
    "node.js", "python", "java", "sql", "mongodb", "docker", "aws"
];

function extractSkills(text: string) {
    const t = text.toLowerCase();
    return SKILLS.filter(s => t.includes(s));
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        if (file.type !== "application/pdf") {
            return NextResponse.json({ error: "Only PDF allowed" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        let text = "";
        let parseMethod = "UNKNOWN";

        // 1. Stage 1: Text Extraction (Primary)
        text = await parsePdfText(buffer);

        if (text.length > 50) {
            parseMethod = "TEXT_PDF";
        } else {
            // 2. Stage 2: OCR Fallback
            // Only if text is empty or very short
            const ocrText = await parsePdfWithOCR(buffer);
            if (ocrText.trim()) {
                text = ocrText;
                parseMethod = "SCANNED_PDF_OCR";
            } else {
                parseMethod = "FAILED_OCR_UNAVAILABLE";
            }
        }

        console.log(`Resume Parse Result: Method=${parseMethod}, TextLength=${text.length}`);

        if (!text.trim()) {
            return NextResponse.json(
                { error: "Unable to extract text. Please ensure the PDF is readable or upload a non-scanned version." },
                { status: 400 }
            );
        }

        return NextResponse.json({
            contact: {
                name: "",
                email: extractEmail(text),
                phone: extractPhone(text),
                ...extractLinks(text)
            },
            skills: extractSkills(text)
        });

    } catch (err) {
        console.error("Parse API Fatal Error:", err);
        return NextResponse.json(
            { error: "Internal server error during resume parsing" },
            { status: 500 }
        );
    }
}
