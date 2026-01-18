"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Play,
    RotateCcw,
    ArrowLeft,
    Shuffle,
    Search,
    Info,
    Clock,
    Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ArrayElement {
    value: number;
    state: "default" | "current" | "found" | "checked" | "not-found";
}

export default function LinearSearchPage() {
    const [array, setArray] = useState<ArrayElement[]>([]);
    const [arraySize, setArraySize] = useState(20);
    const [searchValue, setSearchValue] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [foundIndex, setFoundIndex] = useState<number | null>(null);
    const [comparisons, setComparisons] = useState(0);
    const [speed, setSpeed] = useState(50);

    const generateRandomArray = useCallback(() => {
        const newArray: ArrayElement[] = [];
        for (let i = 0; i < arraySize; i++) {
            newArray.push({
                value: Math.floor(Math.random() * 100) + 1,
                state: "default",
            });
        }
        setArray(newArray);
        setFoundIndex(null);
        setComparisons(0);
    }, [arraySize]);

    useEffect(() => {
        generateRandomArray();
    }, [generateRandomArray]);

    const delay = useCallback(() => {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, Math.max(100, 500 - speed * 4));
        });
    }, [speed]);

    const runSearch = async () => {
        const target = parseInt(searchValue);
        if (isNaN(target)) {
            alert("Please enter a valid number to search");
            return;
        }

        setIsRunning(true);
        setFoundIndex(null);
        setComparisons(0);

        // Reset states
        setArray(prev => prev.map(el => ({ ...el, state: "default" })));

        const arr = [...array];
        let found = false;

        for (let i = 0; i < arr.length; i++) {
            arr[i].state = "current";
            setArray([...arr]);
            setComparisons(i + 1);
            await delay();

            if (arr[i].value === target) {
                arr[i].state = "found";
                setArray([...arr]);
                setFoundIndex(i);
                found = true;
                break;
            }

            arr[i].state = "checked";
            setArray([...arr]);
        }

        if (!found) {
            // Mark all as not-found
            setArray(arr.map(el => ({ ...el, state: el.state === "checked" ? "checked" : "default" })));
        }

        setIsRunning(false);
    };

    const getElementColor = (state: ArrayElement["state"]) => {
        switch (state) {
            case "current": return "bg-yellow-500 scale-110";
            case "found": return "bg-green-500 scale-125 shadow-lg shadow-green-500/50";
            case "checked": return "bg-muted-foreground/30";
            case "not-found": return "bg-red-500/50";
            default: return "bg-primary";
        }
    };

    const codeSnippet = `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Found at index i
    }
  }
  return -1; // Not found
}`;

    const algorithmSteps = [
        "Start from the first element of the array",
        "Compare current element with target value",
        "If match found, return the index",
        "If not, move to the next element",
        "Repeat until element found or array ends",
        "Return -1 if element not in array",
    ];

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
                                Linear Search
                            </h1>
                            <p className="text-muted-foreground max-w-2xl">
                                Linear Search is the simplest searching algorithm that checks every element sequentially until the target is found or the list ends.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Best: O(1)
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Worst: O(n)
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
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Search value..."
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        className="w-32"
                                        disabled={isRunning}
                                    />
                                    <Button
                                        onClick={runSearch}
                                        disabled={isRunning || !searchValue}
                                        className="gap-2"
                                    >
                                        <Search className="h-4 w-4" />
                                        Search
                                    </Button>
                                </div>

                                <Button
                                    onClick={generateRandomArray}
                                    variant="outline"
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
                                            min={5}
                                            max={50}
                                            step={1}
                                            onValueChange={([val]) => !isRunning && setArraySize(val)}
                                            disabled={isRunning}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-muted-foreground">Speed:</span>
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
                            <div className="bg-card rounded-xl border border-border/50 p-6">
                                <div className="flex flex-wrap gap-2 justify-center min-h-[200px] items-center">
                                    {array.map((element, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className={cn(
                                                "flex items-center justify-center w-12 h-12 rounded-lg font-bold text-white transition-all duration-200",
                                                getElementColor(element.state)
                                            )}
                                        >
                                            {element.value}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Legend */}
                                <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-primary" />
                                        <span className="text-muted-foreground">Unchecked</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-yellow-500" />
                                        <span className="text-muted-foreground">Checking</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-muted-foreground/30" />
                                        <span className="text-muted-foreground">Checked</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-green-500" />
                                        <span className="text-muted-foreground">Found</span>
                                    </div>
                                </div>

                                {/* Result */}
                                {foundIndex !== null && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center"
                                    >
                                        <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
                                        <p className="text-green-500 font-semibold">
                                            Found at index {foundIndex}!
                                        </p>
                                    </motion.div>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="p-4 bg-card rounded-xl border border-border/50 text-center">
                                <div className="text-3xl font-bold text-primary">{comparisons}</div>
                                <div className="text-sm text-muted-foreground">Comparisons Made</div>
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
                                            O(1)
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Average Case</span>
                                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                                            O(n)
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Worst Case</span>
                                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                                            O(n)
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-border/50">
                                        <span className="text-muted-foreground">Space Complexity</span>
                                        <Badge variant="secondary">O(1)</Badge>
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
