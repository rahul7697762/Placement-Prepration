"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Play,
    Pause,
    RotateCcw,
    ArrowLeft,
    Shuffle,
    ChevronRight,
    Info,
    Clock,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ArrayBar {
    value: number;
    state: "default" | "comparing" | "swapping" | "sorted" | "pivot" | "current";
}

interface SortingVisualizerProps {
    title: string;
    description: string;
    timeComplexity: {
        best: string;
        average: string;
        worst: string;
    };
    spaceComplexity: string;
    codeSnippet: string;
    algorithmSteps: string[];
    sortFunction: (
        array: ArrayBar[],
        setArray: React.Dispatch<React.SetStateAction<ArrayBar[]>>,
        delay: () => Promise<void>,
        isCancelled: React.MutableRefObject<boolean>
    ) => Promise<void>;
}

export function SortingVisualizer({
    title,
    description,
    timeComplexity,
    spaceComplexity,
    codeSnippet,
    algorithmSteps,
    sortFunction,
}: SortingVisualizerProps) {
    const [array, setArray] = useState<ArrayBar[]>([]);
    const [arraySize, setArraySize] = useState(20);
    const [speed, setSpeed] = useState(50);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [comparisons, setComparisons] = useState(0);
    const [swaps, setSwaps] = useState(0);
    const isCancelled = useRef(false);
    const pauseRef = useRef(false);

    const generateRandomArray = useCallback(() => {
        const newArray: ArrayBar[] = [];
        for (let i = 0; i < arraySize; i++) {
            newArray.push({
                value: Math.floor(Math.random() * 100) + 5,
                state: "default",
            });
        }
        setArray(newArray);
        setComparisons(0);
        setSwaps(0);
    }, [arraySize]);

    useEffect(() => {
        generateRandomArray();
    }, [generateRandomArray]);

    const delay = useCallback(() => {
        return new Promise<void>((resolve) => {
            const checkPause = () => {
                if (isCancelled.current) {
                    resolve();
                    return;
                }
                if (pauseRef.current) {
                    setTimeout(checkPause, 50);
                } else {
                    setTimeout(resolve, Math.max(30, 300 - speed * 2.5));
                }
            };
            checkPause();
        });
    }, [speed]);

    const runSort = async () => {
        if (isRunning) return;

        setIsRunning(true);
        isCancelled.current = false;
        pauseRef.current = false;
        setComparisons(0);
        setSwaps(0);

        // Reset array states
        setArray(prev => prev.map(bar => ({ ...bar, state: "default" })));

        await sortFunction(array, setArray, delay, isCancelled);

        if (!isCancelled.current) {
            // Mark all as sorted
            setArray(prev => prev.map(bar => ({ ...bar, state: "sorted" })));
        }

        setIsRunning(false);
        setIsPaused(false);
    };

    const togglePause = () => {
        pauseRef.current = !pauseRef.current;
        setIsPaused(!isPaused);
    };

    const reset = () => {
        isCancelled.current = true;
        setIsRunning(false);
        setIsPaused(false);
        generateRandomArray();
    };

    const getBarColor = (state: ArrayBar["state"]) => {
        switch (state) {
            case "comparing": return "bg-orange-500 shadow-lg shadow-orange-500/50";
            case "swapping": return "bg-pink-500 shadow-lg shadow-pink-500/50";
            case "sorted": return "bg-emerald-500 shadow-lg shadow-emerald-500/30";
            case "pivot": return "bg-violet-600 shadow-lg shadow-violet-600/50";
            case "current": return "bg-sky-500 shadow-lg shadow-sky-500/50";
            default: return "bg-slate-400 dark:bg-slate-600";
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            {/* Header */}
            <section className="py-8 border-b border-border/50">
                <div className="container mx-auto px-6 md:px-12">
                    <Link
                        href="/visualizer"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Visualizer
                    </Link>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                {title}
                            </h1>
                            <p className="text-muted-foreground max-w-2xl">
                                {description}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Best: {timeComplexity.best}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                Avg: {timeComplexity.average}
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Space: {spaceComplexity}
                            </Badge>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visualizer */}
            <section className="py-8">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Visualization */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Controls */}
                            <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-xl border border-border/50">
                                <Button
                                    onClick={runSort}
                                    disabled={isRunning && !isPaused}
                                    className="gap-2"
                                >
                                    <Play className="h-4 w-4" />
                                    {isRunning ? "Running..." : "Start"}
                                </Button>

                                {isRunning && (
                                    <Button
                                        onClick={togglePause}
                                        variant="outline"
                                        className="gap-2"
                                    >
                                        {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                                        {isPaused ? "Resume" : "Pause"}
                                    </Button>
                                )}

                                <Button
                                    onClick={reset}
                                    variant="outline"
                                    className="gap-2"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Reset
                                </Button>

                                <Button
                                    onClick={generateRandomArray}
                                    variant="ghost"
                                    disabled={isRunning}
                                    className="gap-2"
                                >
                                    <Shuffle className="h-4 w-4" />
                                    Randomize
                                </Button>

                                <div className="flex items-center gap-4 ml-auto">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-muted-foreground">Size:</span>
                                        <span className="font-mono">{arraySize}</span>
                                    </div>
                                    <div className="w-24">
                                        <Slider
                                            value={[arraySize]}
                                            min={10}
                                            max={100}
                                            step={5}
                                            onValueChange={([val]) => !isRunning && setArraySize(val)}
                                            disabled={isRunning}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-muted-foreground">Speed:</span>
                                        <span className="font-mono">{speed}%</span>
                                    </div>
                                    <div className="w-24">
                                        <Slider
                                            value={[speed]}
                                            min={1}
                                            max={100}
                                            step={1}
                                            onValueChange={([val]) => setSpeed(val)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Array Visualization */}
                            <div className="bg-card rounded-xl border border-border/50 p-6 min-h-[400px]">
                                <div className="flex items-end justify-center gap-1 h-80">
                                    {array.map((bar, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${bar.value * 3}px` }}
                                            transition={{ duration: 0.1 }}
                                            className={cn(
                                                "rounded-t-sm transition-colors duration-150",
                                                getBarColor(bar.state)
                                            )}
                                            style={{
                                                width: `${Math.max(4, 600 / arraySize)}px`,
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Legend */}
                                <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-slate-400 dark:bg-slate-600" />
                                        <span className="text-muted-foreground">Default</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-orange-500" />
                                        <span className="text-muted-foreground">Comparing</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-pink-500" />
                                        <span className="text-muted-foreground">Swapping</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-emerald-500" />
                                        <span className="text-muted-foreground">Sorted</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-violet-600" />
                                        <span className="text-muted-foreground">Pivot</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-sky-500" />
                                        <span className="text-muted-foreground">Current</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-card rounded-xl border border-border/50 text-center">
                                    <div className="text-3xl font-bold text-primary">{comparisons}</div>
                                    <div className="text-sm text-muted-foreground">Comparisons</div>
                                </div>
                                <div className="p-4 bg-card rounded-xl border border-border/50 text-center">
                                    <div className="text-3xl font-bold text-primary">{swaps}</div>
                                    <div className="text-sm text-muted-foreground">Swaps</div>
                                </div>
                            </div>
                        </div>

                        {/* Side Panel */}
                        <div className="space-y-6">
                            {/* Algorithm Steps */}
                            <div className="p-6 bg-card rounded-xl border border-border/50">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Info className="h-4 w-4 text-primary" />
                                    How It Works
                                </h3>
                                <ol className="space-y-3">
                                    {algorithmSteps.map((step, index) => (
                                        <li key={index} className="flex items-start gap-3 text-sm">
                                            <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary font-medium shrink-0">
                                                {index + 1}
                                            </span>
                                            <span className="text-muted-foreground">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            {/* Complexity Info */}
                            <div className="p-6 bg-card rounded-xl border border-border/50">
                                <h3 className="font-semibold mb-4">Time Complexity</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Best Case</span>
                                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                            {timeComplexity.best}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Average Case</span>
                                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                                            {timeComplexity.average}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Worst Case</span>
                                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                                            {timeComplexity.worst}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-border/50">
                                        <span className="text-muted-foreground">Space Complexity</span>
                                        <Badge variant="secondary">
                                            {spaceComplexity}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Code Snippet */}
                            <div className="p-6 bg-card rounded-xl border border-border/50">
                                <h3 className="font-semibold mb-4">Code</h3>
                                <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-x-auto">
                                    <code className="text-muted-foreground">{codeSnippet}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

// Export increment functions for stats
export const incrementComparisons = (setComparisons: React.Dispatch<React.SetStateAction<number>>) => {
    setComparisons(prev => prev + 1);
};

export const incrementSwaps = (setSwaps: React.Dispatch<React.SetStateAction<number>>) => {
    setSwaps(prev => prev + 1);
};
