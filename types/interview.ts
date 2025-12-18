// ============================================
// Interview Module Types
// ============================================

// Interview Type Selection (Updated: removed resume-based, added general/role-based)
export type InterviewType = 'general' | 'role-based';

// Experience Levels
export type ExperienceLevel = 'fresher' | 'junior' | 'mid' | 'senior';

// Predefined Roles for Role-Based Interview
export type InterviewRole =
    | 'ml-engineer'
    | 'sde'
    | 'frontend-developer'
    | 'backend-developer'
    | 'data-analyst'
    | 'other';

export const INTERVIEW_ROLES: { value: InterviewRole; label: string }[] = [
    { value: 'ml-engineer', label: 'ML Engineer' },
    { value: 'sde', label: 'Software Development Engineer' },
    { value: 'frontend-developer', label: 'Frontend Developer' },
    { value: 'backend-developer', label: 'Backend Developer' },
    { value: 'data-analyst', label: 'Data Analyst' },
    { value: 'other', label: 'Other (Custom)' },
];

// Available Skills for Interview (kept for backward compatibility)
export type Skill = string;

// Skill Selection State (kept for backward compatibility)
export interface SkillSelection {
    skills: Skill[];
    experienceLevel: ExperienceLevel;
}

// ============================================
// Manual Interview Input Types (NEW)
// ============================================

// General Interview Input
export interface GeneralInterviewInput {
    name: string;
    yearsOfExperience?: number;
    primaryDomain?: string;
}

// Role-Based Interview Input
export interface RoleBasedInterviewInput {
    name: string;
    role: InterviewRole;
    customRole?: string; // When role is 'other'
    experienceLevel: ExperienceLevel;
    techStack?: string[]; // Optional comma-separated technologies
}

// Union type for manual input
export type ManualInterviewInput =
    | { mode: 'general'; data: GeneralInterviewInput }
    | { mode: 'role-based'; data: RoleBasedInterviewInput };

// ============================================
// Unified Interview Context Output (Vapi Safe)
// ============================================
export interface VapiInterviewContext {
    candidate: {
        name: string;
        role?: string;
        experienceLevel?: ExperienceLevel;
    };
    interviewMode: 'general' | 'role-based';
    focusAreas: string[];
    avoidAreas: string[];
}

// Helper to convert ManualInterviewInput to VapiInterviewContext
export function toVapiInterviewContext(input: ManualInterviewInput): VapiInterviewContext {
    if (input.mode === 'general') {
        const { name, yearsOfExperience, primaryDomain } = input.data;

        // Derive experience level from years
        let experienceLevel: ExperienceLevel | undefined;
        if (yearsOfExperience !== undefined) {
            if (yearsOfExperience < 1) experienceLevel = 'fresher';
            else if (yearsOfExperience < 3) experienceLevel = 'junior';
            else if (yearsOfExperience < 6) experienceLevel = 'mid';
            else experienceLevel = 'senior';
        }

        return {
            candidate: {
                name,
                role: primaryDomain,
                experienceLevel,
            },
            interviewMode: 'general',
            focusAreas: primaryDomain ? [primaryDomain] : [],
            avoidAreas: [],
        };
    } else {
        const { name, role, customRole, experienceLevel, techStack } = input.data;
        const roleLabel = role === 'other'
            ? (customRole || 'General')
            : (INTERVIEW_ROLES.find(r => r.value === role)?.label || role);

        return {
            candidate: {
                name,
                role: roleLabel,
                experienceLevel,
            },
            interviewMode: 'role-based',
            focusAreas: techStack || [],
            avoidAreas: [],
        };
    }
}

// Generate Vapi system prompt injection from context
export function generateVapiPromptInjection(context: VapiInterviewContext): string {
    const lines: string[] = [];

    lines.push(`## Candidate Information`);
    lines.push(`- Name: ${context.candidate.name}`);
    if (context.candidate.role) {
        lines.push(`- Target Role: ${context.candidate.role}`);
    }
    if (context.candidate.experienceLevel) {
        lines.push(`- Experience Level: ${context.candidate.experienceLevel}`);
    }
    lines.push('');

    lines.push(`## Interview Mode: ${context.interviewMode === 'general' ? 'General Adaptive' : 'Role-Specific'}`);
    lines.push('');

    if (context.focusAreas.length > 0) {
        lines.push(`## Focus Areas`);
        context.focusAreas.forEach(area => lines.push(`- ${area}`));
        lines.push('');
    }

    if (context.interviewMode === 'general') {
        lines.push(`## Interview Strategy`);
        lines.push(`- Ask broad, adaptive questions`);
        lines.push(`- Explore candidate's strengths organically`);
        lines.push(`- Cover problem-solving and communication skills`);
    } else {
        lines.push(`## Interview Strategy`);
        lines.push(`- Prioritize role-specific technical questions`);
        lines.push(`- Adjust difficulty based on experience level`);
        lines.push(`- Focus on practical scenarios for ${context.candidate.role}`);
    }

    return lines.join('\n');
}

// ============================================
// Legacy Types (Kept for backward compatibility)
// ============================================

// Parsed Resume Data (DEPRECATED - Resume upload disabled)
export interface ParsedResume {
    rawText: string;
    skills: string[];
    experience: ExperienceEntry[];
    projects: ProjectEntry[];
    education: EducationEntry[];
    summary?: string;
}

export interface ExperienceEntry {
    title: string;
    company: string;
    duration: string;
    description: string[];
}

export interface ProjectEntry {
    name: string;
    description: string;
    technologies: string[];
}

export interface EducationEntry {
    degree: string;
    institution: string;
    year: string;
}

// Eye Tracking Metrics
export interface EyeTrackingMetrics {
    eyeContactPercentage: number;
    headMovementScore: number;
    facePresencePercentage: number;
    totalDuration: number;
    eyeContactDuration: number;
    timestamps: EyeTrackingDataPoint[];
}

export interface EyeTrackingDataPoint {
    timestamp: number;
    eyeContact: boolean;
    faceDetected: boolean;
    headPosition: {
        x: number;
        y: number;
        z: number;
    };
}

// Interview Transcript
export interface TranscriptEntry {
    id: string;
    role: 'interviewer' | 'candidate';
    content: string;
    timestamp: number;
}

// Interview Session State (Updated)
export interface InterviewSession {
    id: string;
    startTime: number;
    endTime?: number;
    type: InterviewType;
    skillSelection?: SkillSelection;
    parsedResume?: ParsedResume; // DEPRECATED
    manualInput?: ManualInterviewInput; // NEW
    vapiContext?: VapiInterviewContext; // NEW
    transcript: TranscriptEntry[];
    eyeTrackingMetrics?: EyeTrackingMetrics;
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
}

// Feedback Scores (1-10 scale)
export interface FeedbackScores {
    communicationSkills: number;
    technicalAccuracy: number;
    confidenceClarity: number;
    eyeContactBodyLanguage: number;
}

// Detailed Feedback Report
export interface InterviewFeedback {
    id: string;
    interviewId: string;
    scores: FeedbackScores;
    strengths: string[];
    weakAreas: string[];
    improvementSuggestions: string[];
    overallVerdict: 'hire' | 'borderline' | 'needs-improvement';
    detailedAnalysis: string;
    skillWiseAnalysis?: SkillAnalysis[];
    generatedAt: number;
}

export interface SkillAnalysis {
    skill: string;
    score: number;
    feedback: string;
}

// Interview History Entry (for Dashboard)
export interface InterviewHistoryEntry {
    id: string;
    userId: string;
    type: InterviewType;
    date: string;
    duration: number; // in seconds
    scores: FeedbackScores;
    overallVerdict: 'hire' | 'borderline' | 'needs-improvement';
    skillsCovered: string[];
}

// Interview Context State (Updated)
export interface InterviewState {
    // Step tracking
    currentStep: 1 | 2 | 3 | 4 | 5 | 6;

    // Step 1
    interviewType: InterviewType | null;

    // Step 2 (Updated)
    skillSelection: SkillSelection | null; // Legacy
    parsedResume: ParsedResume | null; // DEPRECATED
    resumeFile: File | null; // DEPRECATED
    manualInput: ManualInterviewInput | null; // NEW
    vapiContext: VapiInterviewContext | null; // NEW

    // Step 3
    permissionsGranted: boolean;
    cameraStream: MediaStream | null;

    // Step 4
    session: InterviewSession | null;
    isInterviewActive: boolean;

    // Step 5-6
    feedback: InterviewFeedback | null;

    // UI State
    isLoading: boolean;
    error: string | null;
}

// Gemini API Request
export interface GeminiFeedbackRequest {
    transcript: TranscriptEntry[];
    interviewType: InterviewType;
    skillSelection?: SkillSelection;
    parsedResume?: ParsedResume;
    vapiContext?: VapiInterviewContext; // NEW
    eyeTrackingMetrics: EyeTrackingMetrics;
}

// Vapi Configuration
export interface VapiConfig {
    assistantId?: string;
    apiKey: string;
    interviewContext: {
        type: InterviewType;
        skills: string[];
        experienceLevel?: ExperienceLevel;
        resumeSummary?: string;
        vapiContext?: VapiInterviewContext; // NEW
    };
}
