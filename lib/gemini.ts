
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    GeminiFeedbackRequest,
    InterviewFeedback,
    FeedbackScores,
    SkillAnalysis,
} from "@/types/interview";

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

// ============================================
// Feedback Generation Prompt
// ============================================
const FEEDBACK_SYSTEM_PROMPT = `You are an expert AI interview evaluator for placement and hiring purposes. 
Your task is to analyze interview transcripts and provide detailed, constructive feedback.

You must return a valid JSON object with the following structure:
{
  "scores": {
    "communicationSkills": number (1-10),
    "technicalAccuracy": number (1-10),
    "confidenceClarity": number (1-10),
    "eyeContactBodyLanguage": number (1-10)
  },
  "strengths": string[] (3-5 specific strengths observed),
  "weakAreas": string[] (3-5 specific areas needing improvement),
  "improvementSuggestions": string[] (4-6 actionable suggestions),
  "overallVerdict": "hire" | "borderline" | "needs-improvement",
  "detailedAnalysis": string (comprehensive 3-4 paragraph analysis),
  "skillWiseAnalysis": [
    {
      "skill": string,
      "score": number (1-10),
      "feedback": string (1-2 sentences)
    }
  ]
}

Scoring Guidelines:
- 9-10: Exceptional, ready for top-tier companies
- 7-8: Strong, would likely pass most interviews  
- 5-6: Average, needs some improvement
- 3-4: Below average, significant improvement needed
- 1-2: Poor, fundamental skills lacking

For Eye Contact & Body Language score, use the provided metrics:
- eyeContactPercentage: percentage of time candidate maintained eye contact
- facePresencePercentage: percentage of time face was detected
- headMovementScore: stability score (higher is better, 100 is perfect stillness)

Verdict Guidelines:
- "hire": Overall score average >= 7.5 and no individual score below 6
- "borderline": Overall score average >= 5.5 and <= 7.5
- "needs-improvement": Overall score average < 5.5 or any critical weakness

Be constructive, specific, and provide actionable feedback. Reference specific answers or moments from the transcript when possible.`;

const RESUME_PARSER_SYSTEM_PROMPT = `You are an expert Resume Parser for Vapi AI voice interviews.
Objective: Extract interview metadata from the provided resume text.

Key Constraints (Vapi-Specific):
- Output must be concise, deterministic, and conversation-safe
- Missing data must never block the interview (use empty arrays)
- No hallucinated skills or experience

Output Contract (JSON Only):
{
  "candidate": {
    "name": "string (extracted or 'Candidate')",
    "primaryRole": "string (optional)",
    "experienceLevel": "fresher" | "junior" | "mid" | "senior" (optional)
  },
  "techStack": {
    "strong": ["string"],   // confidently mentioned
    "familiar": ["string"] // lightly mentioned
  },
  "experience": [
    {
      "company": "string",
      "role": "string",
      "duration": "string (optional)",
      "discussionPoints": ["string"] // responsibilities or challenges explicitly stated (max 3 per role)
    }
  ],
  "projects": [
    {
      "name": "string",
      "tech": ["string"],
      "discussionPoints": ["string"] // problems, decisions, challenges (explicit only)
    }
  ],
  "interviewHints": {
    "focusAreas": ["string"], // e.g. backend, frontend, ML
    "avoidAreas": ["string"] // if resume lacks depth
  }
}

Parsing Rules:
1. Section detection should support synonyms (e.g., "Work History" -> Experience).
2. Normalize tech names (e.g., "Node js" -> "Node.js").
3. Do NOT hallucinate skills or experience. If unsure, return empty arrays.
4. Prefer fewer but high-confidence discussion points.
5. Identify experience level based on years and role titles.
`;

import { VapiResumeContext, createFallbackVapiContext } from "@/types/vapi";
export type { VapiResumeContext } from "@/types/vapi";

// ============================================
// Generate Feedback Function
// ============================================
export async function generateInterviewFeedback(
    request: GeminiFeedbackRequest
): Promise<InterviewFeedback> {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 4096,
        },
    });

    // Build the prompt with all context
    const contextPrompt = buildContextPrompt(request);

    try {
        const result = await model.generateContent([
            { text: FEEDBACK_SYSTEM_PROMPT },
            { text: contextPrompt },
        ]);

        const response = result.response;
        const text = response.text();

        // Parse the JSON response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Failed to parse feedback response");
        }

        const feedbackData = JSON.parse(jsonMatch[0]);

        // Construct the feedback object
        const feedback: InterviewFeedback = {
            id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            interviewId: "", // Will be set by the caller
            scores: feedbackData.scores as FeedbackScores,
            strengths: feedbackData.strengths || [],
            weakAreas: feedbackData.weakAreas || [],
            improvementSuggestions: feedbackData.improvementSuggestions || [],
            overallVerdict: feedbackData.overallVerdict,
            detailedAnalysis: feedbackData.detailedAnalysis || "",
            skillWiseAnalysis: feedbackData.skillWiseAnalysis as SkillAnalysis[] || [],
            generatedAt: Date.now(),
        };

        return feedback;
    } catch (error) {
        console.error("Error generating interview feedback:", error);
        throw error;
    }
}

// ============================================
// Resume Parsing Function
// ============================================
export async function parseResumeWithGemini(resumeText: string): Promise<VapiResumeContext> {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
            temperature: 0.1, // Low temperature for deterministic output
            topP: 0.8,
            maxOutputTokens: 4096,
            responseMimeType: "application/json",
        },
    });

    try {
        const result = await model.generateContent([
            { text: RESUME_PARSER_SYSTEM_PROMPT },
            { text: `Resume Text:\n${resumeText}` },
        ]);

        const response = result.response;
        const text = response.text();

        // Ensure we parse standard JSON
        let parsedData: any;
        try {
            parsedData = JSON.parse(text);
        } catch (e) {
            // Fallback for markdown code blocks if responseMimeType fails
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsedData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Invalid JSON response from Gemini");
            }
        }

        // Add rawText to the result as per contract
        return {
            ...parsedData,
            rawText: resumeText
        };

    } catch (error) {
        console.error("Error parsing resume with Gemini:", error);
        // Use fallback context when LLM fails
        return createFallbackVapiContext(resumeText);
    }
}

// ============================================
// Build Context Prompt
// ============================================
function buildContextPrompt(request: GeminiFeedbackRequest): string {
    let prompt = `
## Interview Context

**Interview Type:** ${request.interviewType === 'general' ? 'General Adaptive Interview' : 'Role-Based Technical Interview'}

`;

    // Add skill context (legacy)
    if (request.skillSelection) {
        prompt += `**Target Skills:** ${request.skillSelection.skills.join(', ')}
**Experience Level:** ${request.skillSelection.experienceLevel}

`;
    }

    // Add Vapi context (new)
    if (request.vapiContext) {
        prompt += `**Candidate Profile:**
- Name: ${request.vapiContext.candidate.name}
${request.vapiContext.candidate.role ? `- Target Role: ${request.vapiContext.candidate.role}` : ''}
${request.vapiContext.candidate.experienceLevel ? `- Experience Level: ${request.vapiContext.candidate.experienceLevel}` : ''}
- Interview Mode: ${request.vapiContext.interviewMode === 'general' ? 'General Adaptive' : 'Role-Specific'}
${request.vapiContext.focusAreas.length > 0 ? `- Focus Areas: ${request.vapiContext.focusAreas.join(', ')}` : ''}

`;
    }

    // Add resume context (legacy/deprecated)
    if (request.parsedResume) {
        prompt += `**Candidate Resume Summary:**
- Skills: ${request.parsedResume.skills.join(', ')}
- Experience: ${request.parsedResume.experience.map(e => `${e.title} at ${e.company}`).join('; ')}
- Projects: ${request.parsedResume.projects.map(p => p.name).join(', ')}

`;
    }

    // Add eye tracking metrics
    prompt += `## Eye Tracking & Body Language Metrics

- **Eye Contact Percentage:** ${request.eyeTrackingMetrics.eyeContactPercentage.toFixed(1)}%
- **Face Presence:** ${request.eyeTrackingMetrics.facePresencePercentage.toFixed(1)}%
- **Head Movement Stability Score:** ${request.eyeTrackingMetrics.headMovementScore.toFixed(1)}/100
- **Total Interview Duration:** ${Math.round(request.eyeTrackingMetrics.totalDuration / 1000 / 60)} minutes

`;

    // Add transcript
    prompt += `## Interview Transcript

`;

    request.transcript.forEach((entry, index) => {
        const role = entry.role === 'interviewer' ? '🤖 AI Interviewer' : '👤 Candidate';
        prompt += `**${role}:** ${entry.content}

`;
    });

    prompt += `
---

Based on the above interview transcript, candidate background, and eye tracking metrics, provide comprehensive feedback in the specified JSON format.
Focus on:
1. Technical accuracy and depth of answers
2. Communication clarity and structure
3. Confidence level and body language indicators
4. Specific skill-wise assessment
5. Actionable improvement suggestions

Remember: Be constructive and supportive while being honest about areas needing improvement.`;

    return prompt;
}

// ============================================
// Simple Question Generation for Dynamic Interview
// ============================================
export async function generateInterviewQuestion(
    skills: string[],
    experienceLevel: string,
    previousQuestions: string[],
    previousAnswers: string[]
): Promise<string> {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 500,
        },
    });

    const prompt = `You are an AI technical interviewer. Generate ONE follow-up interview question.

Skills to assess: ${skills.join(', ')}
Experience Level: ${experienceLevel}
Previous questions asked: ${previousQuestions.length > 0 ? previousQuestions.join(' | ') : 'None yet - this is the first question'}
Previous answers: ${previousAnswers.length > 0 ? previousAnswers.join(' | ') : 'None yet'}

Rules:
1. If this is the first question, start with a warm introduction and an easy question
2. Progressively increase difficulty based on previous answers
3. Mix theoretical and practical questions
4. Keep questions conversational and clear
5. Don't ask more than 2 questions on the same topic
6. Question should be 1-3 sentences max

Return ONLY the question text, nothing else.`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        console.error("Error generating question:", error);
        // Return a fallback question
        return `Can you tell me about your experience with ${skills[0]}?`;
    }
}
