"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Play,
    ArrowLeft,
    Shuffle,
    Search,
    Info,
    Clock,
    Target,
    ArrowLeftRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ArrayElement {
    value: number;
    state: "default" | "current" | "found" | "eliminated" | "mid" | "range";
}

export default function BinarySearchPage() {
    const [array, setArray] = useState<ArrayElement[]>([]);
    const [arraySize, setArraySize] = useState(20);
    const [searchValue, setSearchValue] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [foundIndex, setFoundIndex] = useState<number | null>(null);
    const [comparisons, setComparisons] = useState(0);
    const [speed, setSpeed] = useState(50);
    const [leftPointer, setLeftPointer] = useState(-1);
    const [rightPointer, setRightPointer] = useState(-1);
    const [midPointer, setMidPointer] = useState(-1);

    const generateSortedArray = useCallback(() => {
        const newArray: ArrayElement[] = [];
        let value = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < arraySize; i++) {
            value += Math.floor(Math.random() * 5) + 1;
            newArray.push({
                value,
                state: "default",
            });
        }
        setArray(newArray);
        setFoundIndex(null);
        setComparisons(0);
        setLeftPointer(-1);
        setRightPointer(-1);
        setMidPointer(-1);
    }, [arraySize]);

    useEffect(() => {
        generateSortedArray();
    }, [generateSortedArray]);

    const delay = useCallback(() => {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, Math.max(200, 800 - speed * 6));
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
        let left = 0;
        let right = arr.length - 1;
        let found = false;

        while (left <= right) {
            // Mark current range
            for (let i = 0; i < arr.length; i++) {
                if (i < left || i > right) {
                    arr[i].state = "eliminated";
                } else {
                    arr[i].state = "range";
                }
            }

            const mid = Math.floor((left + right) / 2);
            arr[mid].state = "mid";

            setLeftPointer(left);
            setRightPointer(right);
            setMidPointer(mid);
            setArray([...arr]);
            setComparisons(prev => prev + 1);
            await delay();

            if (arr[mid].value === target) {
                arr[mid].state = "found";
                setArray([...arr]);
                setFoundIndex(mid);
                found = true;
                break;
            } else if (arr[mid].value < target) {
                // Target is in right half
                arr[mid].state = "eliminated";
                left = mid + 1;
            } else {
                // Target is in left half
                arr[mid].state = "eliminated";
                right = mid - 1;
            }

            setArray([...arr]);
            await delay();
        }

        if (!found) {
            setLeftPointer(-1);
            setRightPointer(-1);
            setMidPointer(-1);
        }

        setIsRunning(false);
    };

    const getElementColor = (state: ArrayElement["state"]) => {
        switch (state) {
            case "mid": return "bg-yellow-500 scale-110 shadow-lg shadow-yellow-500/30";
            case "found": return "bg-green-500 scale-125 shadow-lg shadow-green-500/50";
            case "eliminated": return "bg-muted-foreground/20 scale-90 opacity-50";
            case "range": return "bg-primary";
            default: return "bg-primary";
        }
    };

    const codeSnippet = `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // Found!
    } else if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  
  return -1; // Not found
}`;

    const algorithmSteps = [
        "Array must be sorted for binary search",
        "Find the middle element of current range",
        "Compare middle element with target",
        "If equal, target found!",
        "If target is larger, search right half",
        "If target is smaller, search left half",
        "Repeat until found or range is empty",
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
                                Binary Search
                            </h1>
                            <p className="text-muted-foreground max-w-2xl">
                                Binary Search efficiently finds elements in a sorted array by repeatedly dividing the search interval in half. It&apos;s one of the most important algorithms in computer science.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="flex items-center gap-1 bg-green-500/10 text-green-500 border-green-500/20">
                                <Clock className="h-3 w-3" />
                                O(log n)
                            </Badge>
                            <Badge variant="secondary">
                                Requires Sorted Array
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
                                    onClick={generateSortedArray}
                                    variant="outline"
                                    disabled={isRunning}
                                    className="gap-2"
                                >
                                    <Shuffle className="h-4 w-4" />
                                    New Array
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
                                            max={30}
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
                                {/* Pointers */}
                                <div className="flex flex-wrap gap-2 justify-center mb-4 text-sm">
                                    {leftPointer >= 0 && (
                                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                                            Left: {leftPointer}
                                        </Badge>
                                    )}
                                    {midPointer >= 0 && (
                                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                                            Mid: {midPointer}
                                        </Badge>
                                    )}
                                    {rightPointer >= 0 && (
                                        <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                                            Right: {rightPointer}
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2 justify-center min-h-[200px] items-center">
                                    {array.map((element, index) => (
                                        <div key={index} className="flex flex-col items-center gap-1">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className={cn(
                                                    "flex items-center justify-center w-12 h-12 rounded-lg font-bold text-white transition-all duration-300",
                                                    getElementColor(element.state)
                                                )}
                                            >
                                                {element.value}
                                            </motion.div>
                                            <span className="text-xs text-muted-foreground">{index}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Legend */}
                                <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-primary" />
                                        <span className="text-muted-foreground">Search Range</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-yellow-500" />
                                        <span className="text-muted-foreground">Middle Element</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-muted-foreground/20" />
                                        <span className="text-muted-foreground">Eliminated</span>
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
                                            Found at index {foundIndex} in only {comparisons} comparison{comparisons > 1 ? 's' : ''}!
                                        </p>
                                    </motion.div>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-card rounded-xl border border-border/50 text-center">
                                    <div className="text-3xl font-bold text-primary">{comparisons}</div>
                                    <div className="text-sm text-muted-foreground">Comparisons Made</div>
                                </div>
                                <div className="p-4 bg-card rounded-xl border border-border/50 text-center">
                                    <div className="text-3xl font-bold text-primary">
                                        {Math.ceil(Math.log2(arraySize + 1))}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Max Comparisons (log₂n)</div>
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

                            {/* Why It's Fast */}
                            <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                                <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-500">
                                    <ArrowLeftRight className="h-4 w-4" />
                                    Why O(log n)?
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Each comparison eliminates <strong>half</strong> of the remaining elements.
                                    For an array of 1 million elements, binary search needs at most <strong>20 comparisons</strong>
                                    vs. 1 million for linear search!
                                </p>
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
                                        <span className="text.muted-foreground">Average Case</span>
                                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                            O(log n)
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Worst Case</span>
                                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                            O(log n)
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
