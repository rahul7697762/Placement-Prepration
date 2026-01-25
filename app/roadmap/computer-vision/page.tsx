"use client";

import { useState } from "react";
import { computerVisionData, Topic, Unit } from "./data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, BookOpen, Code2, Menu } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function ComputerVisionPage() {
    const [selectedTopic, setSelectedTopic] = useState<Topic>(computerVisionData[0].topics[0]);
    const [selectedUnitId, setSelectedUnitId] = useState<string>(computerVisionData[0].id);

    const SidebarContent = () => (
        <div className="space-y-6 py-4">
            <div className="px-4">
                <h2 className="text-xl font-bold">Computer Vision</h2>
                <p className="text-sm text-muted-foreground">Complete Roadmap</p>
            </div>
            <ScrollArea className="h-[calc(100vh-120px)] px-2">
                <div className="space-y-4">
                    {computerVisionData.map((unit) => (
                        <div key={unit.id} className="space-y-2">
                            <h3 className="px-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                {unit.title}
                            </h3>
                            <div className="space-y-1">
                                {unit.topics.map((topic) => (
                                    <Button
                                        key={topic.id}
                                        variant={selectedTopic.id === topic.id ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full justify-start text-sm",
                                            selectedTopic.id === topic.id && "bg-secondary"
                                        )}
                                        onClick={() => {
                                            setSelectedTopic(topic);
                                            setSelectedUnitId(unit.id);
                                        }}
                                    >
                                        <div className="flex items-center w-full">
                                            {selectedTopic.id === topic.id ? (
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                                            ) : (
                                                <ChevronRight className="mr-2 h-4 w-4 opacity-50" />
                                            )}
                                            <span className="truncate">{topic.title}</span>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-72 border-r bg-card/30">
                <SidebarContent />
            </div>

            {/* Mobile Sheet Trigger */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="h-full px-6 py-8 md:px-12 md:py-12 max-w-4xl mx-auto">
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                <span>Unit {selectedUnitId.replace('unit-', '')}</span>
                                <ChevronRight className="h-4 w-4" />
                                <span className="text-foreground font-medium">{selectedTopic.title}</span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight mb-2">{selectedTopic.title}</h1>
                            <p className="text-xl text-muted-foreground">{selectedTopic.description}</p>
                        </div>

                        <div className="grid gap-6">
                            {/* Explanation Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="h-5 w-5 text-primary" />
                                        Concept
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="prose dark:prose-invert max-w-none">
                                    <ReactMarkdown>{selectedTopic.details}</ReactMarkdown>
                                </CardContent>
                            </Card>

                            {/* Code Example Card (if available) */}
                            {selectedTopic.codeExample && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Code2 className="h-5 w-5 text-primary" />
                                            Implementation
                                        </CardTitle>
                                        <CardDescription>Python / OpenCV Example</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="rounded-md overflow-hidden bg-[#1e1e1e]">
                                            <SyntaxHighlighter
                                                language="python"
                                                style={vscDarkPlus}
                                                customStyle={{ margin: 0, borderRadius: 0 }}
                                                showLineNumbers
                                            >
                                                {selectedTopic.codeExample.trim()}
                                            </SyntaxHighlighter>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
