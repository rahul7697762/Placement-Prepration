
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { pythonModules, Problem } from "@/lib/python-data";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, CheckCircle2, XCircle, ChevronRight, Lightbulb, FileCode } from "lucide-react";
import { useTheme } from "next-themes";
import ReactMarkdown from "react-markdown";

export default function ProblemPage() {
    const params = useParams();
    const router = useRouter();
    const { theme } = useTheme();
    const slug = params.slug as string;

    const [problem, setProblem] = useState<Problem | null>(null);
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [mcqResult, setMcqResult] = useState<"correct" | "incorrect" | null>(null);
    const [activeTab, setActiveTab] = useState("statement"); // Changed default tab to "statement"

    const [loading, setLoading] = useState(true);
    const [nextSlug, setNextSlug] = useState<string | null>(null);

    useEffect(() => {
        // Find the problem by slug
        let foundProblem: Problem | undefined;
        let nextProblemSlug: string | null = null;

        // Flatten all problems to find current and next
        const allProblems = pythonModules.flatMap(m => m.problems);
        const currentIndex = allProblems.findIndex(p => p.slug === slug);

        if (currentIndex !== -1) {
            foundProblem = allProblems[currentIndex];
            if (currentIndex + 1 < allProblems.length) {
                nextProblemSlug = allProblems[currentIndex + 1].slug;
            }
        }

        if (foundProblem) {
            setProblem(foundProblem);
            setCode(foundProblem.starterCode || "");
            setNextSlug(nextProblemSlug);
        }
        setLoading(false);
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="animate-pulse flex flex-col items-center gap-2">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p>Loading problem...</p>
                </div>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground">
                <h2 className="text-2xl font-bold">Problem not found</h2>
                <p className="text-muted-foreground">The problem you are looking for does not exist or has been moved.</p>
                <Button onClick={() => router.push("/roadmap/python")}>
                    Back to Course
                </Button>
            </div>
        );
    }

    const runCode = async () => {
        setIsRunning(true);
        setOutput("");
        try {
            const response = await fetch("/api/compile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    language: "python",
                    version: "3.10.0",
                    files: [{ content: code }],
                }),
            });

            const data = await response.json();
            const runOutput = data.run ? data.run.output : data.message || "Error executing code";
            setOutput(runOutput);

            if (problem.testCases && problem.testCases.length > 0) {
                const expected = problem.testCases[0].expectedOutput.trim();
                const actual = runOutput.trim();
                // Logic for success could go here
            }

        } catch (error) {
            setOutput("Failed to connect to server.");
        } finally {
            setIsRunning(false);
        }
    };

    const checkMcq = () => {
        if (!selectedOption || !problem.options) return;
        const correctOption = problem.options.find((o) => o.isCorrect);
        if (correctOption?.id === selectedOption) {
            setMcqResult("correct");
        } else {
            setMcqResult("incorrect");
        }
    };

    const handleNext = () => {
        if (nextSlug) {
            router.push(`/roadmap/python/${nextSlug}`);
            // Reset state for next problem
            setMcqResult(null);
            setSelectedOption(null);
            setOutput("");
            setActiveTab("statement");
        }
    };

    return (
        <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
            {/* Top Navigation Bar */}
            <div className="h-14 border-b flex items-center px-4 justify-between bg-card shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <div className="h-6 w-px bg-border" />
                    <h1 className="font-semibold truncate max-w-[300px]">{problem.title}</h1>
                    <Badge variant={problem.difficulty === "Easy" ? "default" : "secondary"} className="hidden sm:inline-flex">
                        {problem.difficulty}
                    </Badge>
                </div>
                {/* Right side of header could have user profile etc */}
            </div>

            {/* Main Content - Split Layout */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left Pane: Statement & AI Help */}
                <div className="w-1/2 border-r flex flex-col min-w-[400px]">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                        <div className="border-b px-2 bg-muted/30">
                            <TabsList className="bg-transparent p-0 h-10 w-auto justify-start gap-6">
                                <TabsTrigger
                                    value="statement"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-2"
                                >
                                    Statement
                                </TabsTrigger>
                                <TabsTrigger
                                    value="ai-help"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-2"
                                >
                                    AI Help
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="statement" className="flex-1 overflow-y-auto p-6 m-0 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">{problem.title}</h2>
                                <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                                    <ReactMarkdown>{problem.description}</ReactMarkdown>
                                </div>
                            </div>

                            <div className="prose dark:prose-invert max-w-none">
                                <h3 className="text-lg font-semibold mb-2">Problem</h3>
                                <div className="bg-muted/50 p-4 rounded-lg border">
                                    <ReactMarkdown>{problem.problemStatement || ""}</ReactMarkdown>
                                </div>
                            </div>

                            {/* Feedback Section */}
                            <div className="mt-auto pt-8">
                                <div className="bg-card border rounded-lg p-4 flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        <p className="font-medium text-foreground">Did you like the problem?</p>
                                        <p className="text-xs">Help us improve the content.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="icon" className="h-8 w-8">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" /></svg>
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-8 w-8">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" /></svg>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="ai-help" className="flex-1 overflow-y-auto p-6 m-0">
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-primary mb-4">
                                    <Lightbulb className="h-5 w-5" />
                                    <h3 className="font-semibold text-lg">{problem.lesson.title}</h3>
                                </div>
                                <div className="prose dark:prose-invert max-w-none">
                                    <ReactMarkdown>{problem.lesson.content}</ReactMarkdown>
                                </div>
                                {problem.lesson.examples.map((ex, idx) => (
                                    <div key={idx} className="bg-muted p-4 rounded-lg space-y-2 border">
                                        <p className="text-sm font-medium text-muted-foreground">Example:</p>
                                        <pre className="bg-black/90 text-white p-3 rounded font-mono text-sm overflow-x-auto">
                                            {ex.code}
                                        </pre>
                                        <p className="text-sm text-muted-foreground italic">
                                            {ex.explanation}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Pane: Interaction Area */}
                <div className="w-1/2 flex flex-col bg-card/30">
                    {problem.type === "MCQ" ? (
                        <div className="flex-1 flex flex-col p-8 max-w-2xl mx-auto w-full">
                            <h3 className="text-lg font-medium mb-6">Select one of the following options:</h3>

                            <div className="space-y-4 flex-1 overflow-y-auto">
                                {problem.options?.map((option) => (
                                    <div
                                        key={option.id}
                                        onClick={() => !mcqResult && setSelectedOption(option.id)}
                                        className={`
                                            group p-5 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-4
                                            ${selectedOption === option.id
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50 hover:bg-muted/50"}
                                            ${mcqResult === "correct" && option.isCorrect ? "!border-green-500 !bg-green-500/10" : ""}
                                            ${mcqResult === "incorrect" && selectedOption === option.id ? "!border-red-500 !bg-red-500/10" : ""}
                                        `}
                                    >
                                        <div className={`
                                            w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                                            ${selectedOption === option.id ? "border-primary" : "border-muted-foreground group-hover:border-primary/70"}
                                            ${mcqResult === "correct" && option.isCorrect ? "!border-green-500" : ""}
                                            ${mcqResult === "incorrect" && selectedOption === option.id ? "!border-red-500" : ""}
                                        `}>
                                            {selectedOption === option.id && (
                                                <div className={`w-3 h-3 rounded-full ${mcqResult === "correct" ? "bg-green-500" :
                                                    mcqResult === "incorrect" ? "bg-red-500" : "bg-primary"
                                                    }`} />
                                            )}
                                        </div>
                                        <span className="text-base font-medium">{option.text}</span>

                                        {mcqResult === "correct" && option.isCorrect && (
                                            <CheckCircle2 className="ml-auto h-6 w-6 text-green-500" />
                                        )}
                                        {mcqResult === "incorrect" && selectedOption === option.id && (
                                            <XCircle className="ml-auto h-6 w-6 text-red-500" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Action Bar */}
                            <div className="mt-8 pt-6 border-t flex items-center justify-end gap-4">
                                {mcqResult ? (
                                    <>
                                        <div className={`flex-1 font-medium ${mcqResult === "correct" ? "text-green-500" : "text-red-500"}`}>
                                            {mcqResult === "correct" ? "Correct Answer!" : "Incorrect, try again."}
                                        </div>
                                        {mcqResult === "incorrect" && (
                                            <Button variant="outline" onClick={() => {
                                                setMcqResult(null);
                                                setSelectedOption(null);
                                            }}>
                                                Try Again
                                            </Button>
                                        )}
                                        <Button onClick={handleNext} disabled={!nextSlug}>
                                            Next <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={checkMcq} disabled={!selectedOption} size="lg" className="w-full sm:w-auto min-w-[120px]">
                                        Submit
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col h-full">
                            {/* Coding Header */}
                            <div className="h-10 bg-muted/50 border-b flex items-center justify-between px-4 shrink-0">
                                <span className="text-sm font-medium flex items-center gap-2">
                                    <FileCode className="h-4 w-4" /> Python 3
                                </span>
                                <Button size="sm" variant="ghost" onClick={runCode} disabled={isRunning} className="h-8 gap-2 text-green-500 hover:text-green-600 hover:bg-green-500/10">
                                    {isRunning ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" /> : <Play className="h-3 w-3" />}
                                    Run
                                </Button>
                            </div>

                            {/* Editor */}
                            <div className="flex-1 relative">
                                <Editor
                                    height="100%"
                                    language="python"
                                    theme={theme === "dark" ? "vs-dark" : "light"}
                                    value={code}
                                    onChange={(val) => setCode(val || "")}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        scrollBeyondLastLine: false,
                                        padding: { top: 16 },
                                    }}
                                />
                            </div>

                            {/* Output Console */}
                            <div className="h-1/3 border-t bg-black/95 text-white flex flex-col">
                                <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Output</span>
                                    <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground hover:text-white" onClick={() => setOutput("")}>Clear</Button>
                                </div>
                                <div className="flex-1 p-4 font-mono text-sm overflow-auto whitespace-pre-wrap">
                                    {output || <span className="text-white/30 italic">Run your code to see output...</span>}
                                </div>
                                <div className="p-2 border-t border-white/10 flex justify-end">
                                    <Button size="sm" onClick={handleNext} disabled={!nextSlug} variant="secondary">
                                        Next Problem <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
