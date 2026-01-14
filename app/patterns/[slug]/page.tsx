"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { initialPatterns, Pattern, Question } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle2, Circle, ExternalLink, Plus, ArrowLeft, Trophy, AlertCircle, Loader2, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useUserProgress } from "@/hooks/use-user-progress";
import { useCodingProfile } from "@/hooks/use-coding-profile";
import { extractLeetCodeSlug } from "@/lib/coding-profile";


export default function PatternPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [pattern, setPattern] = useState<Pattern | undefined>(undefined);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { isQuestionComplete, toggleComplete, loading: progressLoading } = useUserProgress();
    const { leetcodeUsername, hasLeetCodeLinked } = useCodingProfile();

    // Verification state
    const [verifyingQuestion, setVerifyingQuestion] = useState<Question | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationError, setVerificationError] = useState<string | null>(null);
    const [showVerifyDialog, setShowVerifyDialog] = useState(false);

    // Form state
    const [newQuestionTitle, setNewQuestionTitle] = useState("");
    const [newQuestionLink, setNewQuestionLink] = useState("");
    const [newQuestionDifficulty, setNewQuestionDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");

    useEffect(() => {
        const foundPattern = initialPatterns.find((p) => p.slug === slug);
        if (foundPattern) {
            setPattern(foundPattern);
            setQuestions(foundPattern.questions);
        }
    }, [slug]);

    const handleAddQuestion = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pattern) return;

        const newQuestion: Question = {
            id: Math.random().toString(36).substr(2, 9),
            title: newQuestionTitle,
            link: newQuestionLink,
            difficulty: newQuestionDifficulty,
            pattern: pattern.slug,
            completed: false,
        };

        setQuestions([...questions, newQuestion]);
        setNewQuestionTitle("");
        setNewQuestionLink("");
        setNewQuestionDifficulty("Easy");
        setIsDialogOpen(false);
    };

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

    const toggleCompletion = async (question: Question) => {
        if (!pattern) return;

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

        await toggleComplete(question.id, pattern.slug, !currentlyComplete);
    };

    if (!pattern) {
        return <div className="p-8 text-center text-muted-foreground">Pattern not found</div>;
    }

    const completedCount = questions.filter(q => isQuestionComplete(q.id)).length;
    const progress = questions.length > 0 ? (completedCount / questions.length) * 100 : 0;

    return (
        <main className="min-h-screen bg-background relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="container mx-auto px-8 md:px-12 py-8 max-w-5xl space-y-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 mb-8"
                >
                    <Link href="/" className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                        <div className="bg-secondary p-2 rounded-full mr-2 group-hover:bg-primary/10 transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                        </div>
                        Back to Patterns
                    </Link>
                </motion.div>

                <div className="grid md:grid-cols-[2fr,1fr] gap-8 items-start">
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h1 className="text-4xl font-bold tracking-tight mb-2">{pattern.title}</h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">{pattern.description}</p>
                        </motion.div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    Questions <Badge variant="outline">{questions.length}</Badge>
                                </h2>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="shadow-lg shadow-primary/20">
                                            <Plus className="mr-2 h-4 w-4" /> Add Question
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Add New Question</DialogTitle>
                                            <DialogDescription>
                                                Add a new DSA question to the {pattern.title} pattern.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleAddQuestion} className="space-y-4 mt-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="title">Question Title</Label>
                                                <Input
                                                    id="title"
                                                    value={newQuestionTitle}
                                                    onChange={(e) => setNewQuestionTitle(e.target.value)}
                                                    placeholder="e.g. Two Sum"
                                                    required
                                                    className="bg-secondary/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="link">Problem Link</Label>
                                                <Input
                                                    id="link"
                                                    value={newQuestionLink}
                                                    onChange={(e) => setNewQuestionLink(e.target.value)}
                                                    placeholder="https://leetcode.com/..."
                                                    required
                                                    className="bg-secondary/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="difficulty">Difficulty</Label>
                                                <Select
                                                    value={newQuestionDifficulty}
                                                    onValueChange={(value: "Easy" | "Medium" | "Hard") =>
                                                        setNewQuestionDifficulty(value)
                                                    }
                                                >
                                                    <SelectTrigger className="bg-secondary/50">
                                                        <SelectValue placeholder="Select difficulty" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Easy">Easy</SelectItem>
                                                        <SelectItem value="Medium">Medium</SelectItem>
                                                        <SelectItem value="Hard">Hard</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit">Add Question</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <AnimatePresence mode="popLayout">
                                {questions.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-16 border-2 border-dashed rounded-xl bg-card/50 text-muted-foreground"
                                    >
                                        No questions added yet. Be the first to add one!
                                    </motion.div>
                                ) : (
                                    questions.map((question, index) => {
                                        const completed = isQuestionComplete(question.id);
                                        return (
                                            <motion.div
                                                key={question.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <Card className={`group transition-all duration-300 hover:shadow-md border-border/50 ${completed ? 'bg-secondary/30' : 'bg-card'}`}>
                                                    <CardContent className="p-4 flex items-center justify-between gap-4">
                                                        <div className="flex items-center gap-4 flex-1">
                                                            <button
                                                                onClick={() => toggleCompletion(question)}
                                                                className={`transition-all duration-300 ${completed ? "text-green-500 scale-110" : "text-muted-foreground hover:text-primary hover:scale-110"}`}
                                                            >
                                                                {completed ? (
                                                                    <CheckCircle2 className="h-6 w-6" />
                                                                ) : (
                                                                    <Circle className="h-6 w-6" />
                                                                )}
                                                            </button>
                                                            <div className="flex-1">
                                                                <h3 className={`font-medium text-lg transition-all duration-300 ${completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                                                    {question.title}
                                                                </h3>
                                                                <div className="flex items-center gap-3 mt-1.5">
                                                                    <Badge
                                                                        variant={
                                                                            question.difficulty === "Easy"
                                                                                ? "secondary"
                                                                                : question.difficulty === "Medium"
                                                                                    ? "default"
                                                                                    : "destructive"
                                                                        }
                                                                        className={`text-xs px-2 py-0.5 ${question.difficulty === "Easy" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : question.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20" : "bg-red-500/10 text-red-500 hover:bg-red-500/20"}`}
                                                                    >
                                                                        {question.difficulty}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <a
                                                            href={question.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"
                                                        >
                                                            <ExternalLink className="h-5 w-5" />
                                                        </a>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        )
                                    })
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Sidebar / Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6 sticky top-24"
                    >
                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Trophy className="w-24 h-24" />
                            </div>
                            <CardContent className="p-6 space-y-6 relative">
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Progress</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {completedCount} of {questions.length} completed
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-primary"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                        />
                                    </div>
                                    <p className="text-xs text-right text-muted-foreground">{Math.round(progress)}%</p>
                                </div>

                                {progress === 100 && questions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-green-500/10 text-green-500 p-3 rounded-lg text-sm font-medium text-center border border-green-500/20"
                                    >
                                        🎉 All questions completed!
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
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
        </main>
    );
}

