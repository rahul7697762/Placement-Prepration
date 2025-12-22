"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { PlayCircle, Clock, FileCode, Users, Trophy, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { allPatterns, Pattern } from "@/lib/data";
import { useUserProgress } from "@/hooks/use-user-progress";

export default function DsaPatternsPage() {
    const { isQuestionComplete, toggleComplete, progress } = useUserProgress();

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
                                                                toggleComplete(problem.id, pattern.slug, !isComplete);
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
        </div>
    );
}
