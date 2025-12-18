// ============================================
// Vapi AI Client Configuration
// ============================================

import { VapiConfig } from "@/types/interview";
import Vapi from "@vapi-ai/web";

// Re-export specific types if needed, or use them from the package
export type VapiInstance = Vapi;

// Vapi Types are now inferred from the package where possible
// or we can define helper interfaces if they are missing from the package export

// Keeping VapiAssistantConfig as we use it to build the config object
// and it might not be exported exactly as we need or strictness
interface VapiAssistantConfig {
    name?: string;
    firstMessage?: string;
    transcriber?: {
        provider: string;
        model?: string;
        language?: string;
    };
    model?: {
        provider: string;
        model: string;
        systemPrompt?: string;
        temperature?: number;
        maxTokens?: number;
    };
    voice?: {
        provider: string;
        voiceId: string;
    };
    endCallMessage?: string;
    endCallPhrases?: string[];
    silenceTimeoutSeconds?: number;
    maxDurationSeconds?: number;
    backgroundSound?: string;
    recordingEnabled?: boolean;
}

interface VapiMessage {
    type: string;
    content?: string;
}

// ============================================
// Interview System Prompt Template
// ============================================
function buildInterviewSystemPrompt(config: VapiConfig["interviewContext"]): string {
    const skillsList = config.skills.join(", ");
    const experienceContext = config.experienceLevel
        ? `The candidate is at ${config.experienceLevel} level.`
        : "";
    const resumeContext = config.resumeSummary
        ? `\n\nCandidate's Background:\n${config.resumeSummary}`
        : "";

    return `You are a professional AI interviewer conducting a technical interview for a placement/hiring evaluation.

## Your Role
- You are interviewing a candidate focusing on: ${skillsList}
${experienceContext}
${resumeContext}

## Interview Guidelines

1. **Start Warmly**: Begin with a brief, friendly introduction. Ask the candidate to introduce themselves.

2. **Question Flow**:
   - Ask ONE question at a time
   - Wait for the candidate to finish answering completely
   - Listen actively and ask follow-up questions when appropriate
   - Mix theoretical concepts with practical scenarios
   - Progressively increase difficulty based on responses

3. **Communication Style**:
   - Be conversational and encouraging
   - Use clear, concise language
   - Acknowledge good answers naturally ("That's a good point", "Interesting approach")
   - Provide gentle redirection for off-track answers

4. **Technical Depth**:
   - For ${config.experienceLevel || 'intermediate'} candidates, adjust complexity accordingly
   - Cover fundamentals AND advanced scenarios when appropriate
   - Ask about real-world applications, not just definitions

5. **Topics to Cover** (based on selected skills):
${config.skills.map(skill => `   - ${skill}: Ask 2-3 questions`).join('\n')}

6. **Interview Structure**:
   - Introduction: 1-2 minutes
   - Technical Questions: 15-20 minutes
   - Behavioral/Situational: 2-3 minutes
   - Closing: Let candidate ask questions

7. **Ending the Interview**:
   - After covering the key topics, wrap up professionally
   - Thank the candidate for their time
   - Say "This concludes our interview" to signal the end

## Important Rules
- NEVER interrupt the candidate
- NEVER provide answers or hints
- Keep your responses brief between questions
- Maintain a professional but approachable tone
- If the candidate struggles, move on gracefully after one follow-up attempt
- Track the topics covered and ensure balanced coverage`;
}

// ============================================
// Create Vapi Interview Configuration
// ============================================
export function createVapiInterviewConfig(config: VapiConfig): VapiAssistantConfig {
    const systemPrompt = buildInterviewSystemPrompt(config.interviewContext);

    return {
        name: "AI Interviewer",

        firstMessage:
            "Hello! Welcome to your technical interview. I’ll be conducting this session today. To begin, could you briefly introduce yourself and share your background?",

        // Speech-to-Text (Cheaper & fast cost-effective standard)
        transcriber: {
            provider: "deepgram",
            model: "nova-2",
            language: "en",
        },

        // LLM (Major cost reduction)
        model: {
            provider: "openai",
            model: "gpt-3.5-turbo",
            systemPrompt: systemPrompt,
            temperature: 0.5,
            maxTokens: 300,
        },

        // Text-to-Speech (Reliable & Low cost)
        voice: {
            provider: "azure",
            voiceId: "en-US-JennyNeural",
        },

        endCallMessage:
            "Thank you for attending the interview. This concludes our session. Best of luck!",

        endCallPhrases: [
            "end interview",
            "stop interview",
            "finish interview",
            "that's all",
        ],

        silenceTimeoutSeconds: 20, // reduces idle cost
        maxDurationSeconds: 1200, // 20 minutes instead of 30
        recordingEnabled: false, // disable unless required (big cost saver)
    };

}

// ============================================
// Vapi Script Loader (Deprecated, kept for compatibility)
// ============================================
export function loadVapiScript(): Promise<void> {
    return Promise.resolve();
}

// ============================================
// Create Vapi Instance
// ============================================
export function createVapiInstance(apiKey: string): VapiInstance | null {
    try {
        return new Vapi(apiKey);
    } catch (e) {
        console.error("Failed to initialize Vapi instance", e);
        return null; // Handle initialization failure
    }
}

// ============================================
// Vapi Event Types
// ============================================
export const VAPI_EVENTS = {
    CALL_START: "call-start",
    CALL_END: "call-end",
    SPEECH_START: "speech-start",
    SPEECH_END: "speech-end",
    TRANSCRIPT: "transcript",
    FUNCTION_CALL: "function-call",
    ERROR: "error",
    VOLUME_LEVEL: "volume-level",
} as const;

export type VapiEventType = typeof VAPI_EVENTS[keyof typeof VAPI_EVENTS];
