"use client";

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from "react";
import {
    InterviewState,
    InterviewType,
    SkillSelection,
    ParsedResume,
    InterviewSession,
    InterviewFeedback,
    TranscriptEntry,
    EyeTrackingMetrics,
    ManualInterviewInput,
    VapiInterviewContext,
    toVapiInterviewContext,
} from "@/types/interview";

// ============================================
// Initial State
// ============================================
const initialState: InterviewState = {
    currentStep: 1,
    interviewType: null,
    skillSelection: null,
    parsedResume: null,
    resumeFile: null,
    manualInput: null,
    vapiContext: null,
    permissionsGranted: false,
    cameraStream: null,
    session: null,
    isInterviewActive: false,
    feedback: null,
    isLoading: false,
    error: null,
};

// ============================================
// Action Types
// ============================================
type InterviewAction =
    | { type: "SET_INTERVIEW_TYPE"; payload: InterviewType }
    | { type: "SET_SKILL_SELECTION"; payload: SkillSelection }
    | { type: "SET_PARSED_RESUME"; payload: ParsedResume }
    | { type: "SET_RESUME_FILE"; payload: File }
    | { type: "SET_MANUAL_INPUT"; payload: ManualInterviewInput }
    | { type: "SET_VAPI_CONTEXT"; payload: VapiInterviewContext }
    | { type: "SET_PERMISSIONS_GRANTED"; payload: boolean }
    | { type: "SET_CAMERA_STREAM"; payload: MediaStream | null }
    | { type: "START_INTERVIEW"; payload: InterviewSession }
    | { type: "END_INTERVIEW" }
    | { type: "ADD_TRANSCRIPT_ENTRY"; payload: TranscriptEntry }
    | { type: "SET_EYE_TRACKING_METRICS"; payload: EyeTrackingMetrics }
    | { type: "SET_FEEDBACK"; payload: InterviewFeedback }
    | { type: "SET_CURRENT_STEP"; payload: 1 | 2 | 3 | 4 | 5 | 6 }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "RESET_STATE" };

// ============================================
// Reducer
// ============================================
function interviewReducer(state: InterviewState, action: InterviewAction): InterviewState {
    switch (action.type) {
        case "SET_INTERVIEW_TYPE":
            return {
                ...state,
                interviewType: action.payload,
                currentStep: 2,
                error: null,
            };

        case "SET_SKILL_SELECTION":
            return {
                ...state,
                skillSelection: action.payload,
                currentStep: 3,
                error: null,
            };

        case "SET_PARSED_RESUME":
            return {
                ...state,
                parsedResume: action.payload,
                currentStep: 3,
                error: null,
            };

        case "SET_RESUME_FILE":
            return {
                ...state,
                resumeFile: action.payload,
            };

        case "SET_MANUAL_INPUT":
            // Convert to Vapi context automatically
            const vapiContext = toVapiInterviewContext(action.payload);
            return {
                ...state,
                manualInput: action.payload,
                vapiContext: vapiContext,
                currentStep: 3,
                error: null,
            };

        case "SET_VAPI_CONTEXT":
            return {
                ...state,
                vapiContext: action.payload,
            };

        case "SET_PERMISSIONS_GRANTED":
            return {
                ...state,
                permissionsGranted: action.payload,
                currentStep: action.payload ? 4 : state.currentStep,
                error: null,
            };

        case "SET_CAMERA_STREAM":
            return {
                ...state,
                cameraStream: action.payload,
            };

        case "START_INTERVIEW":
            return {
                ...state,
                session: action.payload,
                isInterviewActive: true,
                error: null,
            };

        case "END_INTERVIEW":
            return {
                ...state,
                isInterviewActive: false,
                session: state.session
                    ? { ...state.session, status: "completed", endTime: Date.now() }
                    : null,
                currentStep: 5,
            };

        case "ADD_TRANSCRIPT_ENTRY":
            return {
                ...state,
                session: state.session
                    ? {
                        ...state.session,
                        transcript: [...state.session.transcript, action.payload],
                    }
                    : null,
            };

        case "SET_EYE_TRACKING_METRICS":
            return {
                ...state,
                session: state.session
                    ? { ...state.session, eyeTrackingMetrics: action.payload }
                    : null,
            };

        case "SET_FEEDBACK":
            return {
                ...state,
                feedback: action.payload,
                currentStep: 6,
                error: null,
            };

        case "SET_CURRENT_STEP":
            return {
                ...state,
                currentStep: action.payload,
            };

        case "SET_LOADING":
            return {
                ...state,
                isLoading: action.payload,
            };

        case "SET_ERROR":
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };

        case "RESET_STATE":
            // Clean up camera stream before resetting
            if (state.cameraStream) {
                state.cameraStream.getTracks().forEach((track) => track.stop());
            }
            return initialState;

        default:
            return state;
    }
}

// ============================================
// Context Type
// ============================================
interface InterviewContextType {
    state: InterviewState;

    // Actions
    setInterviewType: (type: InterviewType) => void;
    setSkillSelection: (selection: SkillSelection) => void;
    setParsedResume: (resume: ParsedResume) => void;
    setResumeFile: (file: File) => void;
    setManualInput: (input: ManualInterviewInput) => void;
    setVapiContext: (context: VapiInterviewContext) => void;
    setPermissionsGranted: (granted: boolean) => void;
    setCameraStream: (stream: MediaStream | null) => void;
    startInterview: () => void;
    endInterview: () => void;
    addTranscriptEntry: (entry: Omit<TranscriptEntry, "id" | "timestamp">) => void;
    setEyeTrackingMetrics: (metrics: EyeTrackingMetrics) => void;
    setFeedback: (feedback: InterviewFeedback) => void;
    setCurrentStep: (step: 1 | 2 | 3 | 4 | 5 | 6) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    resetState: () => void;

    // Helpers
    generateSessionId: () => string;
}

// ============================================
// Context Creation
// ============================================
const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

// ============================================
// Provider Component
// ============================================
export function InterviewProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(interviewReducer, initialState);

    // Generate unique session ID
    const generateSessionId = useCallback(() => {
        return `interview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    // Action handlers
    const setInterviewType = useCallback((type: InterviewType) => {
        dispatch({ type: "SET_INTERVIEW_TYPE", payload: type });
    }, []);

    const setSkillSelection = useCallback((selection: SkillSelection) => {
        dispatch({ type: "SET_SKILL_SELECTION", payload: selection });
    }, []);

    const setParsedResume = useCallback((resume: ParsedResume) => {
        dispatch({ type: "SET_PARSED_RESUME", payload: resume });
    }, []);

    const setResumeFile = useCallback((file: File) => {
        dispatch({ type: "SET_RESUME_FILE", payload: file });
    }, []);

    const setManualInput = useCallback((input: ManualInterviewInput) => {
        dispatch({ type: "SET_MANUAL_INPUT", payload: input });
    }, []);

    const setVapiContext = useCallback((context: VapiInterviewContext) => {
        dispatch({ type: "SET_VAPI_CONTEXT", payload: context });
    }, []);

    const setPermissionsGranted = useCallback((granted: boolean) => {
        dispatch({ type: "SET_PERMISSIONS_GRANTED", payload: granted });
    }, []);

    const setCameraStream = useCallback((stream: MediaStream | null) => {
        dispatch({ type: "SET_CAMERA_STREAM", payload: stream });
    }, []);

    const startInterview = useCallback(() => {
        const session: InterviewSession = {
            id: generateSessionId(),
            startTime: Date.now(),
            type: state.interviewType!,
            skillSelection: state.skillSelection || undefined,
            parsedResume: state.parsedResume || undefined,
            manualInput: state.manualInput || undefined,
            vapiContext: state.vapiContext || undefined,
            transcript: [],
            status: "in-progress",
        };
        dispatch({ type: "START_INTERVIEW", payload: session });
    }, [state.interviewType, state.skillSelection, state.parsedResume, state.manualInput, state.vapiContext, generateSessionId]);

    const endInterview = useCallback(() => {
        dispatch({ type: "END_INTERVIEW" });
    }, []);

    const addTranscriptEntry = useCallback(
        (entry: Omit<TranscriptEntry, "id" | "timestamp">) => {
            const fullEntry: TranscriptEntry = {
                ...entry,
                id: `transcript-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                timestamp: Date.now(),
            };
            dispatch({ type: "ADD_TRANSCRIPT_ENTRY", payload: fullEntry });
        },
        []
    );

    const setEyeTrackingMetrics = useCallback((metrics: EyeTrackingMetrics) => {
        dispatch({ type: "SET_EYE_TRACKING_METRICS", payload: metrics });
    }, []);

    const setFeedback = useCallback((feedback: InterviewFeedback) => {
        dispatch({ type: "SET_FEEDBACK", payload: feedback });
    }, []);

    const setCurrentStep = useCallback((step: 1 | 2 | 3 | 4 | 5 | 6) => {
        dispatch({ type: "SET_CURRENT_STEP", payload: step });
    }, []);

    const setLoading = useCallback((loading: boolean) => {
        dispatch({ type: "SET_LOADING", payload: loading });
    }, []);

    const setError = useCallback((error: string | null) => {
        dispatch({ type: "SET_ERROR", payload: error });
    }, []);

    const resetState = useCallback(() => {
        dispatch({ type: "RESET_STATE" });
    }, []);

    const value: InterviewContextType = {
        state,
        setInterviewType,
        setSkillSelection,
        setParsedResume,
        setResumeFile,
        setManualInput,
        setVapiContext,
        setPermissionsGranted,
        setCameraStream,
        startInterview,
        endInterview,
        addTranscriptEntry,
        setEyeTrackingMetrics,
        setFeedback,
        setCurrentStep,
        setLoading,
        setError,
        resetState,
        generateSessionId,
    };

    return (
        <InterviewContext.Provider value={value}>
            {children}
        </InterviewContext.Provider>
    );
}

// ============================================
// Custom Hook
// ============================================
export function useInterview() {
    const context = useContext(InterviewContext);
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }
    return context;
}
