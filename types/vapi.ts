// ============================================
// Vapi AI Voice Interview Types
// ============================================

/**
 * Experience level classification for interview difficulty calibration
 */
export type VapiExperienceLevel = "fresher" | "junior" | "mid" | "senior";

/**
 * Candidate information extracted from resume
 * Used for personalized greeting and context
 */
export interface VapiCandidate {
    /** Candidate's name (defaults to "Candidate" if not found) */
    name: string;
    /** Primary role/title (e.g., "Frontend Developer") */
    primaryRole?: string;
    /** Experience level derived from resume analysis */
    experienceLevel?: VapiExperienceLevel;
}

/**
 * Tech stack classification for interview focus
 */
export interface VapiTechStack {
    /** Technologies confidently mentioned/demonstrated */
    strong: string[];
    /** Technologies mentioned but with less depth */
    familiar: string[];
}

/**
 * Work experience entry with discussion points
 */
export interface VapiExperience {
    /** Company name */
    company: string;
    /** Job title/role */
    role: string;
    /** Duration (e.g., "2020-2022", "3 years") */
    duration?: string;
    /** Key responsibilities or challenges explicitly stated - max 3 */
    discussionPoints: string[];
}

/**
 * Project entry with discussion points
 */
export interface VapiProject {
    /** Project name */
    name: string;
    /** Technologies used */
    tech: string[];
    /** Problems, decisions, challenges explicitly mentioned - max 3 */
    discussionPoints: string[];
}

/**
 * Interview hints for adaptive questioning
 */
export interface VapiInterviewHints {
    /** Areas to focus questions on (e.g., "backend", "ML") */
    focusAreas: string[];
    /** Areas to avoid if resume lacks depth */
    avoidAreas: string[];
}

/**
 * Complete Vapi Resume Context
 * This is the output contract for the resume parsing pipeline
 */
export interface VapiResumeContext {
    candidate: VapiCandidate;
    techStack: VapiTechStack;
    experience: VapiExperience[];
    projects: VapiProject[];
    interviewHints: VapiInterviewHints;
    /** Original extracted text for reference */
    rawText: string;
}

/**
 * Generates a Vapi-safe system prompt injection from parsed resume context
 * @param context - The parsed VapiResumeContext
 * @returns A formatted string safe for Vapi systemPrompt injection
 */
export function generateVapiSystemPromptContext(context: VapiResumeContext): string {
    const lines: string[] = [];

    // Candidate info
    lines.push(`## Candidate Profile`);
    lines.push(`- Name: ${context.candidate.name}`);
    if (context.candidate.primaryRole) {
        lines.push(`- Role: ${context.candidate.primaryRole}`);
    }
    if (context.candidate.experienceLevel) {
        lines.push(`- Experience Level: ${context.candidate.experienceLevel}`);
    }
    lines.push("");

    // Tech Stack
    if (context.techStack.strong.length > 0 || context.techStack.familiar.length > 0) {
        lines.push(`## Technical Skills`);
        if (context.techStack.strong.length > 0) {
            lines.push(`- Strong: ${context.techStack.strong.join(", ")}`);
        }
        if (context.techStack.familiar.length > 0) {
            lines.push(`- Familiar: ${context.techStack.familiar.join(", ")}`);
        }
        lines.push("");
    }

    // Experience
    if (context.experience.length > 0) {
        lines.push(`## Work Experience`);
        context.experience.forEach((exp) => {
            lines.push(`- ${exp.role} at ${exp.company}${exp.duration ? ` (${exp.duration})` : ""}`);
            if (exp.discussionPoints.length > 0) {
                exp.discussionPoints.forEach((point) => {
                    lines.push(`  • ${point}`);
                });
            }
        });
        lines.push("");
    }

    // Projects
    if (context.projects.length > 0) {
        lines.push(`## Projects`);
        context.projects.forEach((proj) => {
            lines.push(`- ${proj.name} [${proj.tech.join(", ")}]`);
            if (proj.discussionPoints.length > 0) {
                proj.discussionPoints.forEach((point) => {
                    lines.push(`  • ${point}`);
                });
            }
        });
        lines.push("");
    }

    // Interview hints
    lines.push(`## Interview Guidance`);
    if (context.interviewHints.focusAreas.length > 0) {
        lines.push(`- Focus Areas: ${context.interviewHints.focusAreas.join(", ")}`);
    }
    if (context.interviewHints.avoidAreas.length > 0) {
        lines.push(`- Avoid Areas (weak depth): ${context.interviewHints.avoidAreas.join(", ")}`);
    }

    return lines.join("\n");
}

/**
 * Validates if a VapiResumeContext is safe for interview
 * @param context - The context to validate
 * @returns true if context has minimum required data
 */
export function isVapiContextValid(context: VapiResumeContext): boolean {
    // Minimum requirement: must have candidate name and rawText
    return !!(context.candidate?.name && context.rawText?.length > 0);
}

/**
 * Creates a fallback VapiResumeContext when parsing fails
 * @param rawText - The raw text that was extracted
 * @param name - Optional candidate name
 */
export function createFallbackVapiContext(rawText: string, name?: string): VapiResumeContext {
    return {
        candidate: { name: name || "Candidate" },
        techStack: { strong: [], familiar: [] },
        experience: [],
        projects: [],
        interviewHints: { focusAreas: [], avoidAreas: [] },
        rawText
    };
}
