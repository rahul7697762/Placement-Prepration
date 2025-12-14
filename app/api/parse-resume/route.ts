
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || 'AIzaSyDYTsw4WknRsNUhYl_VLSD-axom80utcz4');

// Dynamic import for pdf-parse to avoid canvas dependency issues at build time
const getPdfParser = async () => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdfParse = await import('pdf-parse') as any;
        return pdfParse.default || pdfParse;
    } catch (e) {
        console.warn('pdf-parse not available:', e);
        return null;
    }
};

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        let text = '';
        try {
            const pdf = await getPdfParser();
            if (!pdf) {
                return NextResponse.json({ error: 'PDF parser not available' }, { status: 500 });
            }
            const data = await pdf(buffer);
            text = data.text;
        } catch (e) {
            console.error("PDF parse error:", e);
            return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 });
        }

        if (!text.trim()) {
            return NextResponse.json({ error: 'Could not extract text from PDF' }, { status: 400 });
        }

        // Use Gemini to extract data
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are an AI that extracts resume data from text into a JSON format.
        
        Extract the following information from the text below:
        - Contact info (Name, email, phone, linkedin, github, address, etc.)
        - Professional Summary / Objective
        - Education (Institution, course, year, percentage/GPA, description)
        - Experience/Internships (Company, position, year/duration, description)
        - Projects (Title, link, description)
        - Skills (List of technical skills)
        - Certifications (Course, institution, year)
        - Languages
        - Achievements
        - References
        - Custom Sections

        Return ONLY a JSON object that matches this TypeScript interface:
        
        interface ResumeData {
            contact: {
                name: string;
                position?: string;
                photoUrl?: string; // Leave empty
                phone?: string;
                email?: string;
                linkedin?: string;
                github?: string;
                address?: string;
            };
            objective?: string;
            education: {
                institution?: string;
                course?: string;
                year?: string;
                percentage?: string;
                description?: string;
            }[];
            internship: {
                company?: string;
                position?: string;
                year?: string;
                description?: string;
            }[];
            projects: {
                title?: string;
                link?: string;
                description?: string;
            }[];
            skills: string[];
            certifications: {
                course?: string; // or title
                institution?: string;
                year?: string;
            }[];
            languages: {
                language: string;
                level?: string;
            }[];
            achievements: {
                title: string;
                description?: string;
            }[];
            references: {
                name: string;
                desig?: string;
                phone?: string;
                email?: string;
            }[];
            customSections: {
                title: string;
                items: string[];
            }[];
        }

        If a field is missing, leave it as empty array or empty string or ignore optional fields.
        Ensure "skills" is a flat string array.
        For descriptions, try to keep them as single block of text or bullet points if applicable.

        Resume Text:
        ${text}
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean up the response (remove markdown code blocks if any)
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const parsedData = JSON.parse(jsonStr);
            return NextResponse.json(parsedData);
        } catch (e) {
            console.error("JSON parse error from AI:", e);
            console.log("Raw AI response:", responseText);
            return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
        }

    } catch (error) {
        console.error('Error processing resume:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
