"use client";

import { useState } from "react";
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
import { CheckCircle2, Circle, ArrowRight, FileCode, Trophy, Target } from "lucide-react";
import Link from "next/link";
import { blind75Categories, totalBlind75Questions, Blind75Question, Blind75Category } from "@/lib/blind-75-data";
import { useUserProgress } from "@/hooks/use-user-progress";

export default function Blind75Page() {
    const { isQuestionComplete, toggleComplete, progress } = useUserProgress();

    // Calculate progress
    const completedQuestions = progress.filter(p => p.completed).length;
    const progressPercentage = totalBlind75Questions > 0
        ? Math.round((completedQuestions / totalBlind75Questions) * 100)
        : 0;

    const handleToggleComplete = async (question: Blind75Question, categorySlug: string) => {
        const currentlyComplete = isQuestionComplete(question.id);
        await toggleComplete(question.id, categorySlug, !currentlyComplete);
    };

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header Section */}
            <div className="bg-card border-b">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-2 text-primary font-medium">
                                <Target className="h-5 w-5" />
                                <span>Interview Prep</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold">Blind 75</h1>
                            <p className="text-muted-foreground text-lg max-w-2xl">
                                The most popular curated list of 75 essential LeetCode problems for technical interview preparation.
                                Master these problems to ace your coding interviews at top tech companies.
                            </p>

                            <div className="flex flex-wrap gap-4 md:gap-8 text-sm text-muted-foreground pt-2">
                                <div className="flex items-center gap-2">
                                    <FileCode className="h-4 w-4" />
                                    <span>{totalBlind75Questions} Problems</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trophy className="h-4 w-4" />
                                    <span>Interview Essential</span>
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
                                    <p className="text-xs text-muted-foreground">
                                        {completedQuestions}/{totalBlind75Questions} Problems Solved
                                    </p>
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
                <h2 className="text-2xl font-bold mb-6">Problems by Category</h2>
                <div className="space-y-4">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {blind75Categories.map((category: Blind75Category) => {
                            // Calculate category progress
                            const categoryCompleted = category.questions.filter(q =>
                                isQuestionComplete(q.id)
                            ).length;
                            const categoryTotal = category.questions.length;
                            const categoryProgress = categoryTotal > 0
                                ? Math.round((categoryCompleted / categoryTotal) * 100)
                                : 0;

                            return (
                                <AccordionItem
                                    key={category.id}
                                    value={category.id}
                                    className="border rounded-lg bg-card px-4"
                                >
                                    <AccordionTrigger className="hover:no-underline py-4">
                                        <div className="flex items-center gap-4 text-left w-full">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold text-base">{category.title}</h3>
                                                    <Badge variant="outline" className="text-xs">
                                                        {categoryCompleted}/{categoryTotal}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground font-normal">
                                                    {category.description}
                                                </p>
                                                {categoryProgress > 0 && (
                                                    <Progress
                                                        value={categoryProgress}
                                                        className="h-1 mt-3"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-2 pb-4">
                                        {category.questions.length > 0 ? (
                                            <div className="space-y-2 mt-2">
                                                <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground px-4 py-2 uppercase tracking-wider">
                                                    <div className="col-span-1 text-center">#</div>
                                                    <div className="col-span-6 md:col-span-5">Problem Name</div>
                                                    <div className="col-span-5 md:col-span-3 text-right">Difficulty</div>
                                                    <div className="col-span-0 md:col-span-3 text-center hidden md:block">Action</div>
                                                </div>
                                                <div className="space-y-1">
                                                    {category.questions.map((problem, idx) => {
                                                        const isComplete = isQuestionComplete(problem.id);
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className={`grid grid-cols-12 items-center px-4 py-3 rounded-md transition-colors border border-transparent cursor-pointer group
                                                                    ${isComplete ? 'bg-green-500/5 hover:bg-green-500/10 border-green-500/20' : 'hover:bg-muted/50 hover:border-border'}
                                                                `}
                                                                onClick={() => {
                                                                    handleToggleComplete(problem, category.slug);
                                                                }}
                                                            >
                                                                <div className="col-span-1 flex items-center justify-center">
                                                                    {isComplete ? (
                                                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                                                    ) : (
                                                                        <Circle className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                                                                    )}
                                                                </div>
                                                                <div className="col-span-6 md:col-span-5 font-medium flex items-center gap-2 overflow-hidden">
                                                                    <Link
                                                                        href={problem.link}
                                                                        target="_blank"
                                                                        className={`truncate hover:underline ${isComplete ? 'text-muted-foreground line-through decoration-muted-foreground/50' : ''}`}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        {problem.number}. {problem.title}
                                                                    </Link>
                                                                </div>
                                                                <div className="col-span-5 md:col-span-3 text-right flex items-center justify-end gap-2">
                                                                    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${problem.difficulty === 'Easy'
                                                                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                                            : problem.difficulty === 'Medium'
                                                                                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                                                : 'bg-red-500/10 text-red-500 border-red-500/20'
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
                            );
                        })}
                    </Accordion>
                </div>
            </div>
        </div>
    );
}
