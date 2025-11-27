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
import { PlayCircle, Clock, FileCode, Users, Trophy, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const modules = [
    {
        id: "1",
        title: "Introduction, Output and Math Operators",
        description: "Python programs covering print statements and basic math operations.",
        progress: 0,
        problems: [
            { name: "Sum and Print - MCQ", difficulty: "Easy", status: "Unsolved", slug: "sum-and-print-mcq" },
            { name: "Print Coding Chef", difficulty: "Easy", status: "Unsolved", slug: "print-coding-chef" },
            { name: "Identify Correct Syntax", difficulty: "Easy", status: "Unsolved", slug: "identify-correct-syntax" },
            { name: "Print difference of 10 and 3", difficulty: "Easy", status: "Unsolved", slug: "print-difference" },
            { name: "Identify Correct Syntax", difficulty: "Easy", status: "Unsolved", slug: "identify-correct-syntax-2" },
            { name: "Print String num", difficulty: "Easy", status: "Unsolved", slug: "print-string-num" },
            { name: "Print 6 divided by 2", difficulty: "Easy", status: "Unsolved", slug: "print-division" },
            { name: "Identify Incorrect Syntax", difficulty: "Easy", status: "Unsolved", slug: "identify-incorrect-syntax" },
            { name: "Print 108 using 9 and 12", difficulty: "Easy", status: "Unsolved", slug: "print-multiplication" },
            { name: "Print Learn Coding on CodeChef", difficulty: "Easy", status: "Unsolved", slug: "print-learn-coding" },
            { name: "Print Right Angled Triangle", difficulty: "Medium", status: "Unsolved", slug: "print-right-angled-triangle" },
            { name: "Print Multiple Strings - MCQ", difficulty: "Easy", status: "Unsolved", slug: "print-multiple-strings-mcq" },
            { name: "Print 5 5", difficulty: "Easy", status: "Unsolved", slug: "print-5-5" },
            { name: "Output Format - MCQ", difficulty: "Easy", status: "Unsolved", slug: "output-format-mcq" },
            { name: "Role of endl", difficulty: "Easy", status: "Unsolved", slug: "role-of-endl" },
            { name: "Print Python Programming", difficulty: "Easy", status: "Unsolved", slug: "print-python-programming" },
            { name: "Print Many Literals - MCQ", difficulty: "Easy", status: "Unsolved", slug: "print-many-literals-mcq" },
            { name: "Output Challenge - MCQ", difficulty: "Easy", status: "Unsolved", slug: "output-challenge-mcq" },
            { name: "Print 1 to 5", difficulty: "Easy", status: "Unsolved", slug: "print-1-to-5" },
            { name: "Print I love CodeChef", difficulty: "Easy", status: "Unsolved", slug: "print-i-love-codechef" },
            { name: "Print Squares", difficulty: "Easy", status: "Unsolved", slug: "print-squares" },
            { name: "Print Pattern", difficulty: "Medium", status: "Unsolved", slug: "print-pattern" },
        ],
    },
    {
        id: "2",
        title: "Variables and Data Types",
        description: "Exercises on using variables and working with different data types in Python.",
        progress: 0,
        problems: [],
    },
    // ... other modules can be added here as needed
];

export default function PythonCoursePage() {
    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Header Section */}
            <div className="bg-card border-b">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-2 text-primary font-medium">
                                <FileCode className="h-5 w-5" />
                                <span>Python Track</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold">Practice Python</h1>
                            <p className="text-muted-foreground text-lg max-w-2xl">
                                Solve Python coding problems online with Practice Python. Write code for over 195 Python coding exercises and boost your confidence in programming.
                            </p>

                            <div className="flex flex-wrap gap-4 md:gap-8 text-sm text-muted-foreground pt-2">
                                <div className="flex items-center gap-2">
                                    <PlayCircle className="h-4 w-4" />
                                    <span>21 Lessons</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>10 Hours</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileCode className="h-4 w-4" />
                                    <span>192 Problems</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span>261.4k Learners</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trophy className="h-4 w-4" />
                                    <span>Beginner Level</span>
                                </div>
                            </div>
                        </div>

                        <Card className="w-full md:w-80 shrink-0">
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span>Your Progress</span>
                                        <span>0%</span>
                                    </div>
                                    <Progress value={0} className="h-2" />
                                    <p className="text-xs text-muted-foreground">0/14 Modules Completed</p>
                                </div>
                                <Button className="w-full" size="lg">
                                    Start Learning
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Course Content */}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                <div className="space-y-4">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {modules.map((module) => (
                            <AccordionItem key={module.id} value={module.id} className="border rounded-lg bg-card px-4">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                                            {module.id}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-base">{module.title}</h3>
                                            <p className="text-sm text-muted-foreground font-normal mt-1">{module.description}</p>
                                        </div>
                                        <div className="text-xs text-muted-foreground font-normal hidden sm:block">
                                            {module.progress}% Solved
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-4">
                                    {module.problems.length > 0 ? (
                                        <div className="space-y-2 mt-2">
                                            <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground px-4 py-2 uppercase tracking-wider">
                                                <div className="col-span-6">Problem Name</div>
                                                <div className="col-span-3 text-center">Status</div>
                                                <div className="col-span-3 text-right">Difficulty</div>
                                            </div>
                                            <div className="space-y-1">
                                                {module.problems.map((problem, idx) => (
                                                    <Link
                                                        key={idx}
                                                        href={`/roadmap/python/${problem.slug}`}
                                                        className="grid grid-cols-12 items-center px-4 py-3 rounded-md hover:bg-muted/50 transition-colors border border-transparent hover:border-border cursor-pointer"
                                                    >
                                                        <div className="col-span-6 font-medium flex items-center gap-2">
                                                            <FileCode className="h-4 w-4 text-muted-foreground" />
                                                            {problem.name}
                                                        </div>
                                                        <div className="col-span-3 text-center">
                                                            <Badge variant="outline" className="font-normal">
                                                                {problem.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="col-span-3 text-right">
                                                            <span className={`text-xs font-medium ${problem.difficulty === 'Easy' ? 'text-green-500' :
                                                                    problem.difficulty === 'Medium' ? 'text-yellow-500' :
                                                                        'text-red-500'
                                                                }`}>
                                                                {problem.difficulty}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p>Content for this module is coming soon.</p>
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
