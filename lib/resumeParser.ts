// ============================================
// Resume Parser Utilities
// ============================================

import { ParsedResume, ExperienceEntry, ProjectEntry, EducationEntry } from "@/types/interview";

// ============================================
// PDF Text Extraction (Client-side using pdf.js)
// ============================================
export async function extractTextFromPDF(file: File): Promise<string> {
    try {
        // Dynamic import of pdf.js
        const pdfjsLib = await import("pdfjs-dist");

        // Disable worker to avoid CORS issues - uses fake worker instead
        // This is fine for small PDFs like resumes
        pdfjsLib.GlobalWorkerOptions.workerSrc = "";

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({
            data: arrayBuffer,
            useWorkerFetch: false,
            isEvalSupported: false,
            useSystemFonts: true,
        }).promise;

        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item) => {
                    // Check if item has 'str' property (TextItem vs TextMarkedContent)
                    if ('str' in item) {
                        return item.str;
                    }
                    return "";
                })
                .join(" ");
            fullText += pageText + "\n";
        }

        return fullText;
    } catch (error) {
        console.error("Error extracting PDF text:", error);
        // Fallback: try to read as plain text if PDF parsing fails
        try {
            const text = await file.text();
            return text;
        } catch {
            throw new Error("Failed to extract text from PDF. Please try a different file.");
        }
    }
}

// ============================================
// Resume Parsing Logic
// ============================================
export function parseResumeText(text: string): ParsedResume {
    const normalizedText = text.replace(/\s+/g, " ").trim();

    return {
        rawText: normalizedText,
        skills: extractSkills(normalizedText),
        experience: extractExperience(normalizedText),
        projects: extractProjects(normalizedText),
        education: extractEducation(normalizedText),
        summary: extractSummary(normalizedText),
    };
}

// ============================================
// Skill Extraction
// ============================================
const COMMON_SKILLS = [
    // Programming Languages
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin",
    // Frontend
    "React", "Vue", "Angular", "Next.js", "HTML", "CSS", "SASS", "Tailwind", "Redux", "MobX",
    // Backend
    "Node.js", "Express", "Django", "Flask", "Spring Boot", "FastAPI", "GraphQL", "REST API",
    // Databases
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase", "Supabase", "DynamoDB",
    // Cloud & DevOps
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Jenkins", "GitHub Actions", "Terraform",
    // Data & ML
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Pandas", "NumPy", "Data Analysis",
    // Tools & Concepts
    "Git", "Agile", "Scrum", "System Design", "Microservices", "OOP", "Data Structures", "Algorithms",
    "Testing", "Jest", "Cypress", "Webpack", "Vite", "Linux", "Shell Scripting",
];

function extractSkills(text: string): string[] {
    const foundSkills: string[] = [];
    const lowerText = text.toLowerCase();

    COMMON_SKILLS.forEach((skill) => {
        const skillPattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "i");
        if (skillPattern.test(text)) {
            foundSkills.push(skill);
        }
    });

    // Also look for skills in a "Skills" section
    const skillsSectionMatch = text.match(/skills?\s*[:\-]?\s*([\s\S]*?)(?=experience|education|projects|$)/i);
    if (skillsSectionMatch) {
        const skillsSection = skillsSectionMatch[1];
        // Extract comma or bullet separated skills
        const additionalSkills = skillsSection
            .split(/[,•\|;]/)
            .map((s) => s.trim())
            .filter((s) => s.length > 1 && s.length < 30)
            .slice(0, 20);

        additionalSkills.forEach((skill) => {
            if (!foundSkills.some((fs) => fs.toLowerCase() === skill.toLowerCase())) {
                foundSkills.push(skill);
            }
        });
    }

    return [...new Set(foundSkills)].slice(0, 25);
}

// ============================================
// Experience Extraction
// ============================================
function extractExperience(text: string): ExperienceEntry[] {
    const experiences: ExperienceEntry[] = [];

    // Common patterns for experience entries
    const experiencePatterns = [
        /(?:software|senior|junior|lead|full[- ]?stack|frontend|backend|data|ml|devops|sde|engineer|developer|intern)\s+(?:engineer|developer|intern|analyst|scientist)?\s*(?:at|@|-|–)\s*([A-Za-z0-9\s&.,]+?)(?:\s*(?:\(|\||-|–)\s*(\d{4}\s*-\s*(?:\d{4}|present|current)|\d+\s*(?:year|month)s?))?/gi,
        /([A-Za-z0-9\s&.,]+?)\s*(?:\||-|–)\s*(?:software|senior|junior|lead|full[- ]?stack|frontend|backend|data|ml|devops|engineer|developer|intern|analyst)/gi,
    ];

    // Look for experience section
    const expSectionMatch = text.match(/(?:experience|work history|employment)\s*[:\-]?\s*([\s\S]*?)(?=education|projects|skills|certifications|$)/i);

    if (expSectionMatch) {
        const expSection = expSectionMatch[1];

        // Split by common delimiters (dates, bullet points, or company names)
        const entries = expSection.split(/(?=\d{4}\s*[-–]\s*(?:\d{4}|present)|•|\n{2,})/i).filter(Boolean);

        entries.slice(0, 5).forEach((entry) => {
            const cleanEntry = entry.trim();
            if (cleanEntry.length > 20) {
                // Try to extract structured info
                const titleMatch = cleanEntry.match(/^([A-Za-z\s]+(?:engineer|developer|intern|analyst|scientist|designer|manager))/i);
                const companyMatch = cleanEntry.match(/(?:at|@)\s*([A-Za-z0-9\s&.,]+?)(?:\s*[-–(]|$)/i);
                const durationMatch = cleanEntry.match(/(\d{4}\s*[-–]\s*(?:\d{4}|present|current|\w+\s+\d{4}))/i);

                experiences.push({
                    title: titleMatch?.[1]?.trim() || "Position",
                    company: companyMatch?.[1]?.trim() || "Company",
                    duration: durationMatch?.[1]?.trim() || "",
                    description: [cleanEntry.substring(0, 200)],
                });
            }
        });
    }

    return experiences.slice(0, 5);
}

// ============================================
// Project Extraction
// ============================================
function extractProjects(text: string): ProjectEntry[] {
    const projects: ProjectEntry[] = [];

    // Look for projects section
    const projSectionMatch = text.match(/(?:projects?|portfolio)\s*[:\-]?\s*([\s\S]*?)(?=experience|education|skills|certifications|$)/i);

    if (projSectionMatch) {
        const projSection = projSectionMatch[1];

        // Split by bullet points or double newlines
        const entries = projSection.split(/(?:•|\n{2,}|^\s*[-*])/).filter((e) => e.trim().length > 15);

        entries.slice(0, 5).forEach((entry) => {
            const cleanEntry = entry.trim();

            // Try to extract project name (usually at the start, in caps or followed by colon/dash)
            const nameMatch = cleanEntry.match(/^([A-Za-z0-9\s\-_]+?)(?:[:\-–|]|\s{2,})/);

            // Extract technologies used
            const techSkills = extractSkills(cleanEntry);

            projects.push({
                name: nameMatch?.[1]?.trim() || cleanEntry.substring(0, 40),
                description: cleanEntry.substring(0, 200),
                technologies: techSkills.slice(0, 6),
            });
        });
    }

    return projects.slice(0, 5);
}

// ============================================
// Education Extraction
// ============================================
function extractEducation(text: string): EducationEntry[] {
    const education: EducationEntry[] = [];

    // Look for education section
    const eduSectionMatch = text.match(/education\s*[:\-]?\s*([\s\S]*?)(?=experience|projects|skills|certifications|$)/i);

    if (eduSectionMatch) {
        const eduSection = eduSectionMatch[1];

        // Common degree patterns
        const degreePatterns = [
            /(?:b\.?(?:tech|e|sc|a|s)|m\.?(?:tech|s|sc|a)|ph\.?d|bachelor|master|diploma)\s*(?:in|of)?\s*([A-Za-z\s]+?)(?:\s*[-–|,]\s*|\s*from\s*)([A-Za-z\s]+?)(?:\s*[-–|(]\s*(\d{4}(?:\s*[-–]\s*\d{4})?))?/gi,
        ];

        // Also try to split by obvious entries
        const entries = eduSection.split(/(?:•|\n{2,})/).filter((e) => e.trim().length > 10);

        entries.slice(0, 3).forEach((entry) => {
            const cleanEntry = entry.trim();

            // Extract year
            const yearMatch = cleanEntry.match(/(\d{4}(?:\s*[-–]\s*(?:\d{4}|present|current))?)/);

            // Extract degree type
            const degreeMatch = cleanEntry.match(/(b\.?(?:tech|e|sc|a|s)|m\.?(?:tech|s|sc|a)|ph\.?d|bachelor|master|diploma|degree)/i);

            education.push({
                degree: degreeMatch?.[0]?.toUpperCase() || "Degree",
                institution: cleanEntry.substring(0, 60),
                year: yearMatch?.[1] || "",
            });
        });
    }

    return education.slice(0, 3);
}

// ============================================
// Summary Extraction
// ============================================
function extractSummary(text: string): string {
    // Look for summary/objective section
    const summaryMatch = text.match(/(?:summary|objective|about\s*me|profile)\s*[:\-]?\s*([\s\S]*?)(?=experience|education|skills|projects|$)/i);

    if (summaryMatch) {
        const summary = summaryMatch[1].trim();
        return summary.substring(0, 500);
    }

    // If no summary section, take the first 200 characters after removing potential header info
    return text.substring(0, 300).trim();
}

// ============================================
// Generate Resume Summary for Interview Context
// ============================================
export function generateResumeSummary(parsed: ParsedResume): string {
    let summary = "";

    if (parsed.skills.length > 0) {
        summary += `Skills: ${parsed.skills.slice(0, 10).join(", ")}. `;
    }

    if (parsed.experience.length > 0) {
        summary += `Experience includes: ${parsed.experience.map((e) => `${e.title} at ${e.company}`).join("; ")}. `;
    }

    if (parsed.projects.length > 0) {
        summary += `Notable projects: ${parsed.projects.map((p) => p.name).join(", ")}. `;
    }

    if (parsed.education.length > 0) {
        summary += `Education: ${parsed.education.map((e) => `${e.degree} from ${e.institution}`).join("; ")}.`;
    }

    return summary.trim();
}
