"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { allPatterns, Question } from "@/lib/data";
import { getSolution, Solution } from "@/lib/supabase";
import { useUserProgress } from "@/hooks/use-user-progress";
import { useCodingProfile } from "@/hooks/use-coding-profile";
import { extractLeetCodeSlug } from "@/lib/coding-profile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, CheckCircle2, Circle, ExternalLink, PlayCircle, Code2, Loader2, AlertCircle, X, ChevronRight, FileText } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ProblemDetailPage() {
    const params = useParams();
    const router = useRouter();
    const patternSlug = params.slug as string;
    const questionId = params.questionId as string;

    const [question, setQuestion] = useState<Question | null>(null);
    const [pattern, setPattern] = useState<any>(null);
    const [solution, setSolution] = useState<Solution | null>(null);
    const [loading, setLoading] = useState(true);

    const { isQuestionComplete, toggleComplete } = useUserProgress();
    const { leetcodeUsername, hasLeetCodeLinked } = useCodingProfile();

    // Verification state
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationError, setVerificationError] = useState<string | null>(null);
    const [showVerifyDialog, setShowVerifyDialog] = useState(false);

    useEffect(() => {
        // Find static data
        const p = allPatterns.find(p => p.slug === patternSlug);
        if (p) {
            setPattern(p);
            const q = p.questions.find(q => q.id === questionId);
            setQuestion(q || null);
        } else {
            console.error("Pattern not found");
        }
    }, [patternSlug, questionId]);

    useEffect(() => {
        if (!questionId) return;

        async function fetchSol() {
            try {
                const sol = await getSolution(questionId);
                setSolution(sol);
            } catch (e) {
                console.error("Failed to load solution", e);
            } finally {
                setLoading(false);
            }
        }
        fetchSol();
    }, [questionId]);


    const verifyLeetCodeSolution = async (): Promise<boolean> => {
        if (!leetcodeUsername || !question) return true;

        const problemSlug = extractLeetCodeSlug(question.link);
        if (!problemSlug) return true; // Not a leetcode problem or custom link

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

    const handleMarkComplete = async () => {
        if (!question || !pattern) return;

        const currentlyComplete = isQuestionComplete(question.id);
        if (currentlyComplete) {
            // Unmark is simple
            await toggleComplete(question.id, pattern.slug, false);
            return;
        }

        // Marking as complete: Check verification
        if (hasLeetCodeLinked) {
            setShowVerifyDialog(true);
            const verified = await verifyLeetCodeSolution();
            if (!verified) return; // Keep dialog open with error

            // Success
            setShowVerifyDialog(false);
        }

        await toggleComplete(question.id, pattern.slug, true);
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
    }

    if (!question || !pattern) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <h1 className="text-xl font-bold">Problem Not Found</h1>
                <Link href="/roadmap/dsa-patterns"><Button>Back to Roadmap</Button></Link>
            </div>
        );
    }

    const isComplete = isQuestionComplete(question.id);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/roadmap/dsa-patterns">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                        <div className="h-4 w-[1px] bg-border mx-2" />
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">{pattern.title}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                            <span className="text-sm font-bold truncate max-w-[200px] md:max-w-md">{question.title}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className={`${question.difficulty === 'Easy' ? 'text-green-600 bg-green-50' : question.difficulty === 'Medium' ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'}`}>
                            {question.difficulty}
                        </Badge>
                        <Button
                            variant={isComplete ? "outline" : "default"}
                            className={isComplete ? "text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700" : ""}
                            onClick={handleMarkComplete}
                        >
                            {isComplete ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Completed
                                </>
                            ) : (
                                <>
                                    <Circle className="h-4 w-4 mr-2" />
                                    Mark Complete
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between p-6 bg-card rounded-lg border shadow-sm">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold">{question.title}</h1>
                            <p className="text-muted-foreground">Pattern: {pattern.title}</p>
                        </div>
                        <Button asChild size="lg" className="shrink-0 gap-2">
                            <a href={question.link} target="_blank" rel="noopener noreferrer">
                                Solve on LeetCode
                                <ExternalLink className="h-4 w-4" />
                            </a>
                        </Button>
                    </div>

                    <Tabs defaultValue="solution" className="w-full">
                        <TabsList className="w-full justify-start h-12 bg-muted/50 p-1">
                            <TabsTrigger value="solution" className="gap-2 px-6">
                                <FileText className="h-4 w-4" />
                                Solution & Approach
                            </TabsTrigger>
                            <TabsTrigger value="video" className="gap-2 px-6" disabled={!solution?.video_url}>
                                <PlayCircle className="h-4 w-4" />
                                Video Walkthrough
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="solution" className="mt-6 space-y-6">
                            {solution ? (
                                <>
                                    {solution.content && (
                                        <Card>
                                            <CardContent className="p-6 prose prose-slate max-w-none dark:prose-invert">
                                                <ReactMarkdown>{solution.content}</ReactMarkdown>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {solution.code_snippet && (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                                    <Code2 className="h-5 w-5" />
                                                    Implementation ({solution.language || 'Code'})
                                                </h3>
                                            </div>
                                            <div className="rounded-lg overflow-hidden border">
                                                <SyntaxHighlighter
                                                    language={solution.language || 'javascript'}
                                                    style={vscDarkPlus}
                                                    customStyle={{ margin: 0, borderRadius: 0 }}
                                                    showLineNumbers
                                                >
                                                    {solution.code_snippet}
                                                </SyntaxHighlighter>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Card className="border-dashed">
                                    <CardContent className="p-12 text-center text-muted-foreground space-y-2">
                                        <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FileText className="h-6 w-6 opacity-50" />
                                        </div>
                                        <h3 className="font-semibold text-lg text-foreground">No Solution Added Yet</h3>
                                        <p>The detailed solution for this problem hasn't been added yet.</p>
                                        <Button variant="outline" className="mt-4" asChild>
                                            <a href={question.link} target="_blank">Try solving on LeetCode</a>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        <TabsContent value="video" className="mt-6">
                            {solution?.video_url && (
                                <Card className="overflow-hidden bg-black">
                                    <div className="aspect-video w-full flex items-center justify-center">
                                        {getEmbedUrl(solution.video_url) ? (
                                            <iframe
                                                src={getEmbedUrl(solution.video_url)}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="text-white text-center">
                                                <p>Video URL: {solution.video_url}</p>
                                                <p className="text-xs text-gray-400 mt-2">Could not embed automatically.</p>
                                                <Button variant="secondary" size="sm" className="mt-4" asChild>
                                                    <a href={solution.video_url} target="_blank">Open Video</a>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right: Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-4">Progress</h3>
                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${isComplete ? 'bg-green-500' : 'bg-muted'}`} />
                                <span className={isComplete ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                                    {isComplete ? 'Solved' : 'Not Solved'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-semibold">Similar Problems</h3>
                            <div className="space-y-3">
                                {pattern.questions.filter((q: any) => q.id !== question.id).slice(0, 3).map((q: any) => (
                                    <Link key={q.id} href={`/roadmap/dsa-patterns/${pattern.slug}/${q.id}`} className="block">
                                        <div className="p-3 rounded-md border hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium line-clamp-1">{q.title}</span>
                                                <Badge variant="outline" className="text-[10px] px-1 h-5">{q.difficulty}</Badge>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Reuse verification dialog */}
            <Dialog open={showVerifyDialog} onOpenChange={(open) => setShowVerifyDialog(open)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isVerifying ? "Verifying..." : verificationError ? "Not Solved" : "Verified"}</DialogTitle>
                    </DialogHeader>
                    {isVerifying ? (
                        <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>
                    ) : verificationError ? (
                        <div className="space-y-4">
                            <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
                                {verificationError}
                            </div>
                            <DialogFooter>
                                <Button onClick={() => setShowVerifyDialog(false)}>Close</Button>
                            </DialogFooter>
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Youtube Helper
function getEmbedUrl(url: string) {
    try {
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            const vParam = url.split("v=")[1]?.split("&")[0];
            const shortCode = url.split("youtu.be/")[1]?.split("?")[0];
            const id = vParam || shortCode;
            if (id) return `https://www.youtube.com/embed/${id}`;
        }
    } catch { }
    return undefined;
}
