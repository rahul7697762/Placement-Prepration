"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mic,
    MicOff,
    Phone,
    PhoneOff,
    User,
    Bot,
    Volume2,
    FileText,
    Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TranscriptEntry, EyeTrackingDataPoint } from "@/types/interview";

interface VapiInterviewProps {
    isConnected: boolean;
    isLoading: boolean;
    isAISpeaking: boolean;
    isMuted: boolean;
    volumeLevel: number;
    transcript: TranscriptEntry[];
    eyeTrackingData?: EyeTrackingDataPoint | null;
    onStart: () => void;
    onEnd: () => void;
    onToggleMute: () => void;
    videoRef?: React.RefObject<HTMLVideoElement | null>;
}

export function VapiInterview({
    isConnected,
    isLoading,
    isAISpeaking,
    isMuted,
    volumeLevel,
    transcript,
    eyeTrackingData,
    onStart,
    onEnd,
    onToggleMute,
    videoRef,
}: VapiInterviewProps) {
    const transcriptEndRef = useRef<HTMLDivElement>(null);
    const aiVideoRef = useRef<HTMLVideoElement>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showTranscript, setShowTranscript] = useState(false);

    // Auto-scroll transcript when opened
    useEffect(() => {
        if (showTranscript) {
            transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [transcript, showTranscript]);

    // Handle AI Video Playback
    useEffect(() => {
        if (aiVideoRef.current) {
            if (isConnected && isAISpeaking) {
                // Ensure video loops and plays
                aiVideoRef.current.loop = true;
                aiVideoRef.current.play().catch(console.error);
            } else {
                aiVideoRef.current.pause();
                // Optional: reset to a specific frame if needed, but pausing is smoother
            }
        }
    }, [isConnected, isAISpeaking]);

    // Timer
    useEffect(() => {
        if (!isConnected) return;

        const interval = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isConnected]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Top Bar */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm z-10">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className={`
                            w-3 h-3 rounded-full
                            ${isConnected ? "bg-green-500 animate-pulse" : "bg-muted"}
                        `} />
                        <span className="text-sm font-medium">
                            {isConnected ? "Live Interview" : isLoading ? "Connecting..." : "Ready to Start"}
                        </span>
                    </div>

                    {isConnected && (
                        <div className="px-3 py-1 bg-muted rounded-full text-sm font-mono flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            {formatTime(elapsedTime)}
                        </div>
                    )}
                </div>

                {eyeTrackingData && (
                    <div className="flex items-center gap-2 text-sm bg-muted/50 px-3 py-1 rounded-full">
                        <div className={`
                            w-2 h-2 rounded-full
                            ${eyeTrackingData.eyeContact ? "bg-green-500" : "bg-yellow-500"}
                        `} />
                        <span className="text-muted-foreground">
                            {eyeTrackingData.eyeContact ? "Good Eye Contact" : "Adjust Focus"}
                        </span>
                    </div>
                )}
            </div>

            {/* Main Split Screen Content */}
            <div className="flex-1 p-4 grid md:grid-cols-2 gap-4 overflow-hidden relative">

                {/* Left Side: AI Interviewer */}
                <Card className="overflow-hidden border-0 shadow-lg relative bg-black group">
                    <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                        <Bot className="w-4 h-4 text-blue-400" />
                        AI Interviewer
                        {isAISpeaking && (
                            <span className="flex items-center gap-1">
                                <span className="w-1 h-3 bg-blue-400 animate-pulse rounded-full" style={{ animationDelay: '0ms' }} />
                                <span className="w-1 h-4 bg-blue-400 animate-pulse rounded-full" style={{ animationDelay: '100ms' }} />
                                <span className="w-1 h-3 bg-blue-400 animate-pulse rounded-full" style={{ animationDelay: '200ms' }} />
                            </span>
                        )}
                    </div>

                    <video
                        ref={aiVideoRef}
                        src="/video/AI_Interviewer_Video_Generation.mp4"
                        className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                        playsInline
                        muted
                        loop
                    />

                    {/* Audio Visualization Overlay for AI */}
                    {isAISpeaking && (
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-8 gap-1">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [10, 40, 10] }}
                                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                                    className="w-2 bg-blue-500/80 rounded-full"
                                />
                            ))}
                        </div>
                    )}

                    {/* Live Captions Overlay */}
                    <div className="absolute bottom-20 left-4 right-4 text-center">
                        <AnimatePresence mode="wait">
                            {transcript.length > 0 && (
                                <motion.div
                                    key={transcript[transcript.length - 1].id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="inline-block px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl text-white text-sm font-medium shadow-lg max-w-[90%]"
                                >
                                    <span className={transcript[transcript.length - 1].role === 'interviewer' ? 'text-blue-300' : 'text-green-300'}>
                                        {transcript[transcript.length - 1].role === 'interviewer' ? 'AI: ' : 'You: '}
                                    </span>
                                    {transcript[transcript.length - 1].content}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </Card>

                {/* Right Side: Candidate Camera */}
                <Card className="overflow-hidden border-0 shadow-lg relative bg-black">
                    <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                        <User className="w-4 h-4 text-green-400" />
                        You
                        {isMuted && <MicOff className="w-3 h-3 text-red-500 ml-1" />}
                    </div>

                    <div className="relative w-full h-full">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                            style={{ transform: "scaleX(-1)" }}
                        />

                        {/* Eye Tracking Reticle Overlay (Subtle) */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                            <div className={`w-64 h-64 border-2 rounded-full transition-colors duration-500 ${eyeTrackingData?.eyeContact ? "border-green-500" : "border-yellow-500"
                                }`} />
                        </div>

                        {/* Volume Meter for User */}
                        {!isMuted && (
                            <div className="absolute bottom-6 right-6 flex items-center gap-1 bg-black/50 p-2 rounded-lg backdrop-blur">
                                <Mic className="w-4 h-4 text-white" />
                                <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-green-500"
                                        animate={{ width: `${Math.min(volumeLevel * 200, 100)}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

            </div>

            {/* Bottom Controls Bar */}
            <div className="flex-shrink-0 p-6 bg-card border-t z-10 w-full">
                <div className="flex items-center justify-center lg:justify-between w-full max-w-5xl mx-auto gap-4">

                    {/* Transcript Button - Hidden on Mobile, shown on larger screens on left */}
                    <div className="hidden lg:flex min-w-[200px]">
                        <Dialog open={showTranscript} onOpenChange={setShowTranscript}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="gap-2 h-12 rounded-xl border-2">
                                    <FileText className="w-5 h-5" />
                                    Transcript
                                    {transcript.length > 0 && (
                                        <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                                            {transcript.length}
                                        </span>
                                    )}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xl h-[80vh] flex flex-col p-0 gap-0">
                                <DialogHeader className="p-6 border-b">
                                    <DialogTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Live Transcript
                                    </DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="flex-1 p-6">
                                    <div className="space-y-4">
                                        {transcript.length === 0 ? (
                                            <div className="text-center text-muted-foreground py-10">
                                                <p>Conversation will appear here...</p>
                                            </div>
                                        ) : (
                                            transcript.map((entry) => (
                                                <div
                                                    key={entry.id}
                                                    className={`flex gap-3 text-sm ${entry.role === "interviewer" ? "flex-row" : "flex-row-reverse"
                                                        }`}
                                                >
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${entry.role === "interviewer" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                                                        }`}>
                                                        {entry.role === "interviewer" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                                    </div>
                                                    <div className={`p-3 rounded-2xl max-w-[85%] ${entry.role === "interviewer"
                                                        ? "bg-muted rounded-tl-none"
                                                        : "bg-primary text-primary-foreground rounded-tr-none"
                                                        }`}>
                                                        {entry.content}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        <div ref={transcriptEndRef} />
                                    </div>
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Center Call Controls */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        {!isConnected && !isLoading ? (
                            <Button
                                onClick={onStart}
                                size="lg"
                                className="h-14 px-8 rounded-full text-lg shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700"
                            >
                                <Phone className="w-5 h-5 mr-2" />
                                Start Interview
                            </Button>
                        ) : isLoading ? (
                            <Button
                                disabled
                                size="lg"
                                className="h-14 px-8 rounded-full text-lg"
                            >
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Connecting...
                            </Button>
                        ) : (
                            <>
                                <Button
                                    onClick={onToggleMute}
                                    variant={isMuted ? "destructive" : "secondary"}
                                    size="lg"
                                    className="h-14 w-14 rounded-full border-2"
                                >
                                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                                </Button>

                                <Button
                                    onClick={onEnd}
                                    variant="destructive"
                                    size="lg"
                                    className="h-14 px-8 rounded-full shadow-lg shadow-red-500/20"
                                >
                                    <PhoneOff className="w-5 h-5 mr-2" />
                                    End Interview
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Right spacer for desktop, Transcript button for Mobile */}
                    <div className="lg:min-w-[200px] flex justify-end">
                        <div className="lg:hidden">
                            <Dialog open={showTranscript} onOpenChange={setShowTranscript}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-2">
                                        <FileText className="w-5 h-5" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-xl h-[80vh] flex flex-col p-0 gap-0">
                                    <DialogHeader className="p-6 border-b">
                                        <DialogTitle className="flex items-center gap-2">
                                            <FileText className="w-5 h-5" />
                                            Live Transcript
                                        </DialogTitle>
                                    </DialogHeader>
                                    <ScrollArea className="flex-1 p-6">
                                        <div className="space-y-4">
                                            {/* (Duplicate transcript logic for mobile modal if desired, or componentize it) */}
                                            {/* Reusing exact same logic as above */}
                                            {transcript.map((entry) => (
                                                <div
                                                    key={entry.id}
                                                    className={`flex gap-3 text-sm ${entry.role === "interviewer" ? "flex-row" : "flex-row-reverse"
                                                        }`}
                                                >
                                                    <div className={`p-3 rounded-2xl max-w-[85%] ${entry.role === "interviewer"
                                                        ? "bg-muted rounded-tl-none"
                                                        : "bg-primary text-primary-foreground rounded-tr-none"
                                                        }`}>
                                                        {entry.content}
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={transcriptEndRef} />
                                        </div>
                                    </ScrollArea>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
