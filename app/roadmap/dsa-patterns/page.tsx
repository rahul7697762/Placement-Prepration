"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { PlayCircle, Clock, FileCode, Users, Trophy, CheckCircle2, Circle, ArrowRight, AlertCircle, Loader2, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { allPatterns, Pattern, Question } from "@/lib/data";
import { useUserProgress } from "@/hooks/use-user-progress";
import { useCodingProfile } from "@/hooks/use-coding-profile";
import { extractLeetCodeSlug } from "@/lib/coding-profile";

export default function DsaPatternsPage() {
    const { isQuestionComplete, toggleComplete, progress } = useUserProgress();
    const { leetcodeUsername, hasLeetCodeLinked } = useCodingProfile();

    // Verification state
    const [verifyingQuestion, setVerifyingQuestion] = useState<Question | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationError, setVerificationError] = useState<string | null>(null);
    const [showVerifyDialog, setShowVerifyDialog] = useState(false);

    const verifyLeetCodeSolution = async (question: Question): Promise<boolean> => {
        if (!leetcodeUsername) return true; // No verification if not linked

        const problemSlug = extractLeetCodeSlug(question.link);
        if (!problemSlug) {
            // Not a LeetCode problem, allow marking
            return true;
        }

        setIsVerifying(true);
        setVerificationError(null);

        try {
            const response = await fetch(
                `/api/leetcode/verify?username=${encodeURIComponent(leetcodeUsername)}&problemSlug=${encodeURIComponent(problemSlug)}`
            );
            const data = await response.json();

            if (data.solved) {
                return true;
            } else {
                setVerificationError(data.message || "Problem not solved on LeetCode yet");
                return false;
            }
        } catch {
            setVerificationError("Failed to verify LeetCode status");
            return false;
        } finally {
            setIsVerifying(false);
        }
    };

    const handleToggleComplete = async (question: Question, patternSlug: string) => {
        const currentlyComplete = isQuestionComplete(question.id);

        // If trying to mark as complete and LeetCode is linked
        if (!currentlyComplete && hasLeetCodeLinked) {
            const problemSlug = extractLeetCodeSlug(question.link);

            // Only verify for LeetCode problems
            if (problemSlug) {
                setVerifyingQuestion(question);
                setShowVerifyDialog(true);

                const verified = await verifyLeetCodeSolution(question);

                if (!verified) {
                    // Don't mark complete, show error dialog
                    return;
                }

                // Verified! Close dialog and mark complete
                setShowVerifyDialog(false);
                setVerifyingQuestion(null);
            }
        }

        await toggleComplete(question.id, patternSlug, !currentlyComplete);
    };

    // Calculate total progress based on user's actual progress
    const totalPatterns = allPatterns.length;
    const totalQuestions = allPatterns.reduce((acc, pattern) => acc + pattern.questions.length, 0);
    const completedQuestions = progress.filter(p => p.completed).length;
    const progressPercentage = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header Section */}
            <div className="bg-card border-b">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-2 text-primary font-medium">
                                <FileCode className="h-5 w-5" />
                                <span>DSA Track</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold">DSA Pattern Cheatsheet 2025</h1>
                            <p className="text-muted-foreground text-lg max-w-2xl">
                                Master individual coding patterns to solve algorithmic problems efficiently. This comprehensive cheatsheet covers 27 essential patterns with 300+ curated LeetCode problems.
                            </p>

                            <div className="flex flex-wrap gap-4 md:gap-8 text-sm text-muted-foreground pt-2">
                                <div className="flex items-center gap-2">
                                    <PlayCircle className="h-4 w-4" />
                                    <span>{totalPatterns} Patterns</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileCode className="h-4 w-4" />
                                    <span>{totalQuestions} Problems</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trophy className="h-4 w-4" />
                                    <span>Intermediate to Advanced</span>
                                </div>
                            </div>
                        </div>

                        <Card className="w-full md:w-80 shrink-0">
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span>Your Progress</span>
                                        <span>{progressPercentage}%</span>
                                    </div>
                                    <Progress value={progressPercentage} className="h-2" />
                                    <p className="text-xs text-muted-foreground">{completedQuestions}/{totalQuestions} Problems Solved</p>
                                </div>
                                <Button className="w-full" size="lg">
                                    Start Practice
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Course Content */}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h2 className="text-2xl font-bold mb-6">Patterns & Problems</h2>
                <div className="space-y-4">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {allPatterns.map((pattern: Pattern) => (
                            <AccordionItem key={pattern.id} value={pattern.id} className="border rounded-lg bg-card px-4">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-4 text-left w-full">
                                        {/* <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium shrink-0">
                                            {pattern.id}
                                        </div> */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-base truncate">{pattern.title}</h3>
                                            <p className="text-sm text-muted-foreground font-normal mt-1 block line-clamp-2 md:line-clamp-1">{pattern.description}</p>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-4">
                                    {pattern.questions.length > 0 ? (
                                        <div className="space-y-2 mt-2">
                                            <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground px-4 py-2 uppercase tracking-wider">
                                                <div className="col-span-8 md:col-span-6">Problem Name</div>
                                                <div className="col-span-4 md:col-span-3 text-right">Difficulty</div>
                                                <div className="col-span-0 md:col-span-3 text-center hidden md:block">Action</div>
                                            </div>
                                            <div className="space-y-1">
                                                {pattern.questions.map((problem, idx) => {
                                                    const isComplete = isQuestionComplete(problem.id);
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`grid grid-cols-12 items-center px-4 py-3 rounded-md transition-colors border border-transparent cursor-pointer group
                                                                ${isComplete ? 'bg-green-500/5 hover:bg-green-500/10 border-green-500/20' : 'hover:bg-muted/50 hover:border-border'}
                                                            `}
                                                            onClick={(e) => {
                                                                handleToggleComplete(problem, pattern.slug);
                                                            }}
                                                        >
                                                            <div className="col-span-8 md:col-span-6 font-medium flex items-center gap-2 overflow-hidden">
                                                                {isComplete ? (
                                                                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                                                ) : (
                                                                    <Circle className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                                                                )}
                                                                <Link
                                                                    href={problem.link}
                                                                    target="_blank"
                                                                    className={`truncate hover:underline ${isComplete ? 'text-muted-foreground line-through decoration-muted-foreground/50' : ''}`}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    {problem.title}
                                                                </Link>
                                                            </div>
                                                            <div className="col-span-4 md:col-span-3 text-right">
                                                                <span className={`text-xs font-medium px-2 py-1 rounded-full border ${problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                                    problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                                        'bg-red-500/10 text-red-500 border-red-500/20'
                                                                    }`}>
                                                                    {problem.difficulty}
                                                                </span>
                                                            </div>
                                                            <div className="col-span-0 md:col-span-3 text-center hidden md:flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Link href={problem.link} target="_blank">
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                        <ArrowRight className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p>No problems added yet.</p>
                                        </div>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>

            {/* LeetCode Verification Dialog */}
            <Dialog open={showVerifyDialog} onOpenChange={(open) => {
                if (!open) {
                    setShowVerifyDialog(false);
                    setVerifyingQuestion(null);
                    setVerificationError(null);
                }
            }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {isVerifying ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                    Verifying on LeetCode...
                                </>
                            ) : verificationError ? (
                                <>
                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                    Not Solved Yet
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    Verified!
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {verifyingQuestion?.title}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        {isVerifying && (
                            <div className="text-center text-muted-foreground">
                                Checking your LeetCode submissions for <strong>{leetcodeUsername}</strong>...
                            </div>
                        )}

                        {verificationError && (
                            <div className="space-y-4">
                                <div className="bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20">
                                    <p className="font-medium">Solve this problem on LeetCode first!</p>
                                    <p className="text-sm mt-1 opacity-80">
                                        We couldn't find an accepted submission for this problem
                                        on your LeetCode account ({leetcodeUsername}).
                                    </p>
                                </div>

                                <Button asChild className="w-full">
                                    <a
                                        href={verifyingQuestion?.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Solve on LeetCode
                                    </a>
                                </Button>
                            </div>
                        )}
                    </div>

                    {verificationError && (
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowVerifyDialog(false);
                                    setVerifyingQuestion(null);
                                    setVerificationError(null);
                                }}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Close
                            </Button>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
