"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { TranscriptEntry, SkillSelection, ParsedResume, InterviewType, ExperienceLevel } from "@/types/interview";
import {
    loadVapiScript,
    createVapiInstance,
    createVapiInterviewConfig,
    VapiInstance,
    VAPI_EVENTS
} from "@/lib/vapi";

interface UseVapiInterviewOptions {
    apiKey: string;
    interviewType: InterviewType;
    skills: string[];
    experienceLevel?: ExperienceLevel;
    resumeSummary?: string;
    onTranscriptUpdate?: (entry: TranscriptEntry) => void;
    onInterviewEnd?: () => void;
    onError?: (error: string) => void;
}

interface VapiState {
    isLoading: boolean;
    isConnected: boolean;
    isAISpeaking: boolean;
    isUserSpeaking: boolean;
    isMuted: boolean;
    error: string | null;
    transcript: TranscriptEntry[];
    volumeLevel: number;
}

export function useVapiInterview({
    apiKey,
    interviewType,
    skills,
    experienceLevel,
    resumeSummary,
    onTranscriptUpdate,
    onInterviewEnd,
    onError,
}: UseVapiInterviewOptions) {
    const [state, setState] = useState<VapiState>({
        isLoading: true,
        isConnected: false,
        isAISpeaking: false,
        isUserSpeaking: false,
        isMuted: false,
        error: null,
        transcript: [],
        volumeLevel: 0,
    });

    const vapiRef = useRef<VapiInstance | null>(null);
    const transcriptRef = useRef<TranscriptEntry[]>([]);

    // Stabilize callbacks using refs
    const onTranscriptUpdateRef = useRef(onTranscriptUpdate);
    const onInterviewEndRef = useRef(onInterviewEnd);
    const onErrorRef = useRef(onError);

    useEffect(() => {
        onTranscriptUpdateRef.current = onTranscriptUpdate;
        onInterviewEndRef.current = onInterviewEnd;
        onErrorRef.current = onError;
    }, [onTranscriptUpdate, onInterviewEnd, onError]);

    // Initialize Vapi
    const initializeVapi = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            await loadVapiScript();

            // Double check availability
            // Double check availability
            if (typeof window !== 'undefined' && !(window as any).Vapi) {
                console.warn("Waiting for window.Vapi...");
                await new Promise(r => setTimeout(r, 500));
            }

            const vapi = createVapiInstance(apiKey);
            let vapiInstance = vapi;

            if (!vapiInstance) {
                // One last retry
                await new Promise(r => setTimeout(r, 1000));
                vapiInstance = createVapiInstance(apiKey);
                if (!vapiInstance) {
                    throw new Error("Failed to initialize Vapi - SDK not attached to window");
                }
            }

            vapiRef.current = vapiInstance;

            // Set up event listeners
            vapiInstance.on(VAPI_EVENTS.CALL_START, () => {
                setState(prev => ({ ...prev, isConnected: true, isLoading: false }));
            });

            vapiInstance.on(VAPI_EVENTS.CALL_END, () => {
                setState(prev => ({ ...prev, isConnected: false }));
                onInterviewEndRef.current?.();
            });

            vapiInstance.on(VAPI_EVENTS.SPEECH_START, () => {
                setState(prev => ({ ...prev, isAISpeaking: true }));
            });

            vapiInstance.on(VAPI_EVENTS.SPEECH_END, () => {
                setState(prev => ({ ...prev, isAISpeaking: false }));
            });

            vapiInstance.on(VAPI_EVENTS.TRANSCRIPT as any, (message: unknown) => {
                const msg = message as { role: string; transcript: string; isFinal?: boolean };
                if (msg.isFinal) {
                    const entry: TranscriptEntry = {
                        id: `transcript-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        role: msg.role === "assistant" ? "interviewer" : "candidate",
                        content: msg.transcript,
                        timestamp: Date.now(),
                    };

                    transcriptRef.current = [...transcriptRef.current, entry];
                    setState(prev => ({ ...prev, transcript: transcriptRef.current }));
                    onTranscriptUpdateRef.current?.(entry);
                }
            });

            vapiInstance.on(VAPI_EVENTS.VOLUME_LEVEL, (level: unknown) => {
                setState(prev => ({ ...prev, volumeLevel: level as number }));
            });

            vapiInstance.on(VAPI_EVENTS.ERROR, (error: unknown) => {
                const err = error as { message?: string };
                // Enhanced error handling for common Vapi errors
                const errorMessage = err?.message || "An error occurred";

                // If we get an error about getUserMedia/microphone, make it friendly
                if (errorMessage.includes("getUserMedia") || errorMessage.includes("microphone")) {
                    setState(prev => ({ ...prev, error: "Microphone access denied or not found" }));
                    onErrorRef.current?.("Please check your microphone permissions");
                } else {
                    setState(prev => ({ ...prev, error: errorMessage }));
                    onErrorRef.current?.(errorMessage);
                }
            });

            setState(prev => ({ ...prev, isLoading: false }));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to initialize interview";
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
            onErrorRef.current?.(errorMessage);
        }
    }, [apiKey]);

    // Start interview
    const startInterview = useCallback(async () => {
        if (!vapiRef.current) {
            await initializeVapi();
        }

        if (!vapiRef.current) {
            onErrorRef.current?.("Vapi not initialized");
            return;
        }

        try {
            setState(prev => ({ ...prev, isLoading: true }));

            const config = createVapiInterviewConfig({
                apiKey,
                interviewContext: {
                    type: interviewType,
                    skills,
                    experienceLevel,
                    resumeSummary,
                },
            });

            await vapiRef.current.start(config as any);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to start interview";
            setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
            onErrorRef.current?.(errorMessage);
        }
    }, [apiKey, interviewType, skills, experienceLevel, resumeSummary, initializeVapi]);

    // End interview
    const endInterview = useCallback(() => {
        if (vapiRef.current) {
            vapiRef.current.stop();
        }
    }, []);

    // Toggle mute
    const toggleMute = useCallback(() => {
        if (vapiRef.current) {
            const newMutedState = !vapiRef.current.isMuted();
            vapiRef.current.setMuted(newMutedState);
            setState(prev => ({ ...prev, isMuted: newMutedState }));
        }
    }, []);

    // Send message (for text input fallback)
    const sendMessage = useCallback((message: string) => {
        if (vapiRef.current) {
            vapiRef.current.send({ type: "text", content: message } as any);
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (vapiRef.current) {
                vapiRef.current.stop();
            }
        };
    }, []);

    // Initialize on mount
    useEffect(() => {
        initializeVapi();
    }, [initializeVapi]);

    return {
        ...state,
        startInterview,
        endInterview,
        toggleMute,
        sendMessage,
    };
}

// Fallback hook for when Vapi is not available (demo mode)
export function useVapiInterviewFallback({
    interviewType,
    skills,
    experienceLevel,
    onTranscriptUpdate,
    onInterviewEnd,
}: Omit<UseVapiInterviewOptions, "apiKey">) {
    const [state, setState] = useState<VapiState>({
        isLoading: false,
        isConnected: false,
        isAISpeaking: false,
        isUserSpeaking: false,
        isMuted: false,
        error: null,
        transcript: [],
        volumeLevel: 0,
    });

    const transcriptRef = useRef<TranscriptEntry[]>([]);
    const questionIndexRef = useRef(0);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize Audio Context for visualization (fake volume levels)
    useEffect(() => {
        if (state.isAISpeaking || state.isUserSpeaking) {
            if (!animationFrameRef.current) {
                const animate = () => {
                    // Simulate volume levels when speaking (random for now, could use AnalyserNode later)
                    const level = Math.random() * 0.5 + 0.3;
                    setState(prev => ({ ...prev, volumeLevel: level }));
                    animationFrameRef.current = requestAnimationFrame(animate);
                };
                animate();
            }
        } else {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
                setState(prev => ({ ...prev, volumeLevel: 0 }));
            }
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [state.isAISpeaking, state.isUserSpeaking]);

    // Cleanup silence timeout
    const clearSilenceTimeout = useCallback(() => {
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
        }
    }, []);

    // Speech Recognition Implementation
    useEffect(() => {
        if (!state.isConnected || state.isAISpeaking) return;

        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false; // Stop after each sentence
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setState(prev => ({ ...prev, isUserSpeaking: true }));
            };

            recognition.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    // @ts-ignore
                    .map((result: any) => result[0].transcript)
                    .join('');

                if (event.results[0].isFinal) {
                    simulateUserResponse(transcript);
                }
            };

            recognition.onend = () => {
                setState(prev => ({ ...prev, isUserSpeaking: false }));
                // Restart recognition if still connected and AI is not speaking
                // We add a small delay to avoid rapid loops
                if (state.isConnected && !state.isAISpeaking) {
                    setTimeout(() => {
                        try {
                            recognition.start();
                        } catch (e) {
                            // Ignore "already started" errors
                        }
                    }, 100);
                }
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setState(prev => ({ ...prev, isUserSpeaking: false }));
            };

            try {
                recognition.start();
            } catch (e) {
                console.error("Failed to start recognition", e);
            }

            return () => {
                recognition.stop();
            };
        } else {
            console.warn("Speech Recognition API not supported in this browser.");
        }
    }, [state.isConnected, state.isAISpeaking]); // Re-run when connection status or AI speaking state changes

    // Demo questions based on skills
    const demoQuestions = [
        `Hello! Welcome to your ${interviewType === 'role-based' ? 'role-specific technical' : 'general'} interview. To start, could you briefly introduce yourself?`,
        `Great! Let's dive into some technical questions. Can you explain ${skills[0] || 'your primary programming language'} and when you would use it?`,
        `Interesting. Now, can you walk me through a challenging project you've worked on?`,
        `Good answer. How do you approach debugging when something isn't working as expected?`,
        `Last question: Where do you see yourself in the next 3-5 years professionally?`,
        `Thank you for your time today. This concludes our interview. You did well!`,
    ];

    // Keep reference to current utterance to prevent garbage collection bug
    const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const speakText = useCallback((text: string) => {
        if ('speechSynthesis' in window) {
            // Cancel any current speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            currentUtteranceRef.current = utterance; // Store ref to prevent GC

            // Try to find a good voice
            let voices = window.speechSynthesis.getVoices();
            // Retry getting voices if empty (Safari/Chrome quirk)
            if (voices.length === 0) {
                window.speechSynthesis.onvoiceschanged = () => {
                    voices = window.speechSynthesis.getVoices();
                };
            }

            const preferredVoice = voices.find(v => v.name.includes('Google US English')) ||
                voices.find(v => v.name.includes('Samantha')) ||
                voices.find(v => v.lang.startsWith('en'));

            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }

            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            utterance.onstart = () => {
                setState(prev => ({ ...prev, isAISpeaking: true }));
                clearSilenceTimeout(); // Clear any existing timeout when AI starts speaking
            };

            const handleEndOrError = () => {
                setState(prev => ({ ...prev, isAISpeaking: false }));
                currentUtteranceRef.current = null; // Clear ref

                // Start 20s silence timer after AI finishes (or errors), unless it was the goodbye message
                if (questionIndexRef.current <= demoQuestions.length) {
                    clearSilenceTimeout(); // Ensure no duplicates
                    silenceTimeoutRef.current = setTimeout(() => {
                        // Check if we haven't already moved on (user hasn't spoken)
                        const currentQIndex = questionIndexRef.current - 1;
                        if (currentQIndex >= 0 && currentQIndex < demoQuestions.length) {
                            const questionToRepeat = demoQuestions[currentQIndex];
                            simulateAIResponse(`I haven't heard from you. Let me repeat the question: ${questionToRepeat}`, true);
                        }
                    }, 20000); // 20 seconds
                }
            };

            utterance.onend = handleEndOrError;

            utterance.onerror = (e) => {
                // Ignore "interrupted" or "canceled" errors as they are normal when new speech overwrites old
                if (e.error === 'interrupted' || e.error === 'canceled') {
                    return;
                }
                console.warn("Speech synthesis error:", e.error);
                handleEndOrError(); // Fail gracefully so interview continues
            };

            try {
                window.speechSynthesis.speak(utterance);
            } catch (e) {
                console.error("Failed to call speak:", e);
                handleEndOrError();
            }
        } else {
            // Fallback if no TTS (just timeout)
            setState(prev => ({ ...prev, isAISpeaking: true }));
            setTimeout(() => {
                setState(prev => ({ ...prev, isAISpeaking: false }));
            }, 3000);
        }
    }, [state.isMuted, clearSilenceTimeout, demoQuestions]);

    const simulateAIResponse = useCallback((response: string, isRepetition: boolean = false) => {
        const entry: TranscriptEntry = {
            id: `transcript-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            role: "interviewer",
            content: response,
            timestamp: Date.now(),
        };

        transcriptRef.current = [...transcriptRef.current, entry];
        setState(prev => ({
            ...prev,
            transcript: transcriptRef.current,
        }));
        onTranscriptUpdate?.(entry);

        // Speak the text
        if (!state.isMuted) {
            speakText(response);
        }
    }, [onTranscriptUpdate, speakText, state.isMuted]);

    const startInterview = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true }));

        // Simulate connection delay
        await new Promise(r => setTimeout(r, 1500));

        setState(prev => ({ ...prev, isLoading: false, isConnected: true }));

        // Start with first question
        setTimeout(() => {
            simulateAIResponse(demoQuestions[0]);
            questionIndexRef.current = 1;
        }, 500);
    }, [demoQuestions, simulateAIResponse]);

    const simulateUserResponse = useCallback((content: string) => {
        clearSilenceTimeout(); // User spoke, clear timeout

        // Add user response to transcript
        const userEntry: TranscriptEntry = {
            id: `transcript-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            role: "candidate",
            content,
            timestamp: Date.now(),
        };

        transcriptRef.current = [...transcriptRef.current, userEntry];
        setState(prev => ({ ...prev, transcript: transcriptRef.current }));
        onTranscriptUpdate?.(userEntry);

        // AI responds with next question
        if (questionIndexRef.current < demoQuestions.length) {
            setTimeout(() => {
                simulateAIResponse(demoQuestions[questionIndexRef.current]);
                questionIndexRef.current++;

                // End interview after last question
                if (questionIndexRef.current >= demoQuestions.length) {
                    setTimeout(() => {
                        onInterviewEnd?.();
                    }, 5000); // Give time for last speech to finish
                }
            }, 1000);
        }
    }, [demoQuestions, simulateAIResponse, onTranscriptUpdate, onInterviewEnd, clearSilenceTimeout]);

    const endInterview = useCallback(() => {
        clearSilenceTimeout();
        window.speechSynthesis.cancel();
        setState(prev => ({ ...prev, isConnected: false, isAISpeaking: false }));
        onInterviewEnd?.();
    }, [onInterviewEnd, clearSilenceTimeout]);

    const toggleMute = useCallback(() => {
        setState(prev => {
            const newMuted = !prev.isMuted;
            if (newMuted) {
                window.speechSynthesis.cancel();
            }
            return { ...prev, isMuted: newMuted };
        });
    }, []);

    // Cleanup speech on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    // Pre-load voices
    useEffect(() => {
        const loadVoices = () => {
            window.speechSynthesis.getVoices();
        };
        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    return {
        ...state,
        startInterview,
        endInterview,
        toggleMute,
        sendMessage: simulateUserResponse,
    };
}
