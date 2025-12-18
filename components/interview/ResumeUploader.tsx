"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileUp,
    FileText,
    Check,
    Loader2,
    X,
    AlertCircle,
    Sparkles,
    ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ParsedResume } from "@/types/interview";
import { parseResumeText } from "@/lib/resumeParser";

interface ResumeUploaderProps {
    onResumeParsed: (resume: ParsedResume, file: File) => void;
    onContinue: () => void;
    parsedResume?: ParsedResume | null;
}

export function ResumeUploader({
    onResumeParsed,
    onContinue,
    parsedResume,
}: ResumeUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const processFile = async (file: File) => {
        if (file.type !== "application/pdf") {
            setError("Please upload a PDF file only");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB");
            return;
        }

        setIsProcessing(true);
        setProgress(0);
        setError(null);
        setFileName(file.name);

        try {
            // 1. Upload to server for text extraction
            setProgress(20);
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/parse-resume', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Failed to parse resume on server");
            }

            setProgress(50);
            const data = await res.json();

            if (!data.text) {
                throw new Error("No text extracted from resume");
            }

            // 2. Parse the extracted text on client
            setProgress(70);
            // Artificial delay for better UX
            await new Promise((r) => setTimeout(r, 200));

            const parsed = parseResumeText(data.text);
            console.log("Parsed Resume Data:", parsed);

            setProgress(100);
            await new Promise((r) => setTimeout(r, 300));

            onResumeParsed(parsed, file);
        } catch (err) {
            console.error("Error processing resume:", err);
            setError("Failed to process resume. Please try again or use a different PDF.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const resetUpload = () => {
        setFileName(null);
        setError(null);
        setProgress(0);
    };

    return (
        <div className="space-y-6">
            {/* Upload Area */}
            {!parsedResume && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`
              relative border-2 border-dashed transition-all duration-300 overflow-hidden
              ${isProcessing ? "pointer-events-none" : "cursor-pointer"}
              ${isDragging
                                ? "border-primary bg-primary/10 scale-[1.02]"
                                : error
                                    ? "border-destructive/50 bg-destructive/5"
                                    : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                            }
            `}
                    >
                        {/* Animated Background */}
                        <div className={`
              absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5
              transition-opacity duration-300
              ${isDragging ? "opacity-100" : "opacity-0"}
            `} />

                        <label htmlFor="resume-upload" className="cursor-pointer">
                            <CardContent className="py-12 px-8">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    {isProcessing ? (
                                        <motion.div
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            className="space-y-4"
                                        >
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                                </div>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    className="absolute inset-0 w-16 h-16 rounded-full border-2 border-primary border-t-transparent"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="font-medium">Processing Resume...</p>
                                                <Progress value={progress} className="w-48 h-2" />
                                                <p className="text-xs text-muted-foreground">
                                                    {progress < 40
                                                        ? "Extracting text..."
                                                        : progress < 70
                                                            ? "Analyzing content..."
                                                            : "Finalizing..."
                                                    }
                                                </p>
                                            </div>
                                        </motion.div>
                                    ) : error ? (
                                        <motion.div
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            className="space-y-4"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                                                <AlertCircle className="w-8 h-8 text-destructive" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="font-medium text-destructive">{error}</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={(e) => { e.preventDefault(); resetUpload(); }}
                                                >
                                                    Try Again
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <>
                                            <motion.div
                                                animate={{ y: isDragging ? -8 : 0 }}
                                                transition={{ type: "spring", stiffness: 400 }}
                                                className={`
                          w-20 h-20 rounded-2xl flex items-center justify-center transition-colors
                          ${isDragging ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
                        `}
                                            >
                                                <FileUp className="w-10 h-10" />
                                            </motion.div>
                                            <div className="space-y-2">
                                                <p className="text-lg font-semibold">
                                                    {isDragging ? "Drop your resume here" : "Upload your resume"}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Drag and drop your PDF file here, or click to browse
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Badge variant="outline">PDF only</Badge>
                                                <span>•</span>
                                                <span>Max 5MB</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </label>
                        <input
                            id="resume-upload"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={isProcessing}
                        />
                    </Card>
                </motion.div>
            )}

            {/* Parsed Resume Display */}
            <AnimatePresence>
                {parsedResume && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        {/* Success Header */}
                        <Card className="border-green-500/30 bg-green-500/5">
                            <CardContent className="py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <Check className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-green-700 dark:text-green-400">
                                            Resume Analyzed Successfully
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {fileName || "resume.pdf"}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            resetUpload();
                                            onResumeParsed(null as unknown as ParsedResume, null as unknown as File);
                                        }}
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        Change
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Extracted Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                    Extracted Information
                                </CardTitle>
                                <CardDescription>
                                    Review the data extracted from your resume
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Skills */}
                                {parsedResume.skills.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            Detected Skills ({parsedResume.skills.length})
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {parsedResume.skills.map((skill, idx) => (
                                                <Badge key={idx} variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-300">
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Experience */}
                                {parsedResume.experience.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                                            Experience ({parsedResume.experience.length} positions)
                                        </h4>
                                        <div className="space-y-2">
                                            {parsedResume.experience.map((exp, idx) => (
                                                <div key={idx} className="text-sm p-3 rounded-lg bg-muted/50">
                                                    <p className="font-medium">{exp.title}</p>
                                                    <p className="text-muted-foreground">{exp.company} {exp.duration && `• ${exp.duration}`}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Projects */}
                                {parsedResume.projects.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            Projects ({parsedResume.projects.length})
                                        </h4>
                                        <div className="space-y-2">
                                            {parsedResume.projects.map((proj, idx) => (
                                                <div key={idx} className="text-sm p-3 rounded-lg bg-muted/50">
                                                    <p className="font-medium">{proj.name}</p>
                                                    {proj.technologies.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {proj.technologies.map((tech, tIdx) => (
                                                                <Badge key={tIdx} variant="outline" className="text-xs">
                                                                    {tech}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Continue Button */}
                        <Button
                            onClick={onContinue}
                            size="lg"
                            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
                        >
                            Continue to Interview Setup
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
