"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Plus,
    Minus,
    Eye,
    RotateCcw,
    Info,
    ArrowDown,
    ArrowUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ElementState = "default" | "top" | "pushing" | "popping" | "peeking";

interface StackElement {
    id: number;
    value: number;
    state: ElementState;
}

export default function StackPage() {
    const [stack, setStack] = useState<StackElement[]>([
        { id: 1, value: 10, state: "default" },
        { id: 2, value: 20, state: "default" },
        { id: 3, value: 30, state: "top" },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [message, setMessage] = useState("");
    const [speed, setSpeed] = useState(50);
    const nextId = useRef(4);
    const maxSize = 10;

    const delay = useCallback(() => {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, Math.max(200, 800 - speed * 6));
        });
    }, [speed]);

    const updateStates = () => {
        setStack(prev => prev.map((el, idx) => ({
            ...el,
            state: idx === prev.length - 1 ? "top" : "default"
        })));
    };

    // Push operation
    const push = async () => {
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            setMessage("Please enter a valid number");
            return;
        }

        if (stack.length >= maxSize) {
            setMessage("Stack Overflow! Maximum size reached.");
            return;
        }

        setIsRunning(true);
        setMessage(`Pushing ${value} onto stack...`);

        // Mark current top
        if (stack.length > 0) {
            setStack(prev => prev.map((el, idx) => ({
                ...el,
                state: idx === prev.length - 1 ? "default" : el.state
            })));
        }

        const newElement: StackElement = {
            id: nextId.current++,
            value,
            state: "pushing",
        };

        setStack(prev => [...prev, newElement]);
        await delay();

        updateStates();
        setMessage(`Pushed ${value} (Stack size: ${stack.length + 1})`);
        setInputValue("");
        setIsRunning(false);
    };

    // Pop operation
    const pop = async () => {
        if (stack.length === 0) {
            setMessage("Stack Underflow! Stack is empty.");
            return;
        }

        setIsRunning(true);
        const topValue = stack[stack.length - 1].value;
        setMessage(`Popping ${topValue} from stack...`);

        setStack(prev => prev.map((el, idx) => ({
            ...el,
            state: idx === prev.length - 1 ? "popping" : el.state
        })));
        await delay();

        setStack(prev => prev.slice(0, -1));
        await delay();

        updateStates();
        setMessage(`Popped ${topValue} (Stack size: ${stack.length - 1})`);
        setIsRunning(false);
    };

    // Peek operation
    const peek = async () => {
        if (stack.length === 0) {
            setMessage("Stack is empty. Nothing to peek.");
            return;
        }

        setIsRunning(true);
        const topValue = stack[stack.length - 1].value;
        setMessage(`Peeking at top element...`);

        setStack(prev => prev.map((el, idx) => ({
            ...el,
            state: idx === prev.length - 1 ? "peeking" : el.state
        })));
        await delay();
        await delay();

        updateStates();
        setMessage(`Top element is ${topValue}`);
        setIsRunning(false);
    };

    // isEmpty
    const isEmpty = () => {
        setMessage(stack.length === 0 ? "Stack is EMPTY" : `Stack is NOT empty (${stack.length} elements)`);
    };

    // isFull
    const isFull = () => {
        setMessage(stack.length >= maxSize ? "Stack is FULL" : `Stack is NOT full (${maxSize - stack.length} slots available)`);
    };

    // Clear stack
    const clearStack = () => {
        setStack([]);
        setMessage("Stack cleared");
        nextId.current = 1;
    };

    const getElementColor = (state: ElementState) => {
        switch (state) {
            case "top": return "border-emerald-500 bg-emerald-500/20";
            case "pushing": return "border-sky-500 bg-sky-500/20";
            case "popping": return "border-pink-500 bg-pink-500/20";
            case "peeking": return "border-orange-500 bg-orange-500/20";
            default: return "border-slate-400 dark:border-slate-600 bg-card";
        }
    };

    const codeSnippet = `class Stack {
  constructor(maxSize = 10) {
    this.items = [];
    this.maxSize = maxSize;
  }

  push(value) {
    if (this.isFull()) {
      throw new Error("Stack Overflow");
    }
    this.items.push(value);
  }

  pop() {
    if (this.isEmpty()) {
      throw new Error("Stack Underflow");
    }
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  isFull() {
    return this.items.length >= this.maxSize;
  }

  size() {
    return this.items.length;
  }
}`;

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
                                Stack (LIFO)
                            </h1>
                            <p className="text-muted-foreground max-w-2xl">
                                A Last-In-First-Out (LIFO) data structure. The last element added is the first one to be removed. Think of a stack of plates!
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">Push: O(1)</Badge>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">Pop: O(1)</Badge>
                            <Badge variant="secondary">Peek: O(1)</Badge>
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
                            {/* Operations */}
                            <div className="p-4 bg-card rounded-xl border border-border/50 space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <Input
                                        type="number"
                                        placeholder="Value"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="w-24"
                                        disabled={isRunning}
                                    />
                                    <Button onClick={push} disabled={isRunning || !inputValue} className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                                        <ArrowUp className="h-4 w-4" /> Push
                                    </Button>
                                    <Button onClick={pop} disabled={isRunning || stack.length === 0} className="gap-1 bg-pink-600 hover:bg-pink-700">
                                        <ArrowDown className="h-4 w-4" /> Pop
                                    </Button>
                                    <Button onClick={peek} disabled={isRunning || stack.length === 0} variant="outline" className="gap-1">
                                        <Eye className="h-4 w-4" /> Peek
                                    </Button>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <Button onClick={isEmpty} disabled={isRunning} size="sm" variant="outline">
                                        isEmpty()
                                    </Button>
                                    <Button onClick={isFull} disabled={isRunning} size="sm" variant="outline">
                                        isFull()
                                    </Button>
                                    <Button onClick={clearStack} disabled={isRunning} size="sm" variant="ghost" className="text-destructive">
                                        <RotateCcw className="h-3 w-3 mr-1" /> Clear
                                    </Button>
                                    <div className="flex items-center gap-2 ml-auto">
                                        <span className="text-sm text-muted-foreground">Speed:</span>
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
                            </div>

                            {/* Message */}
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-center text-sm"
                                >
                                    {message}
                                </motion.div>
                            )}

                            {/* Stack Visualization */}
                            <div className="bg-card rounded-xl border border-border/50 p-6 min-h-[400px]">
                                <div className="flex flex-col items-center">
                                    {/* Top indicator */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <ArrowDown className="h-5 w-5 text-emerald-500" />
                                        <span className="text-sm font-semibold text-emerald-500">TOP</span>
                                    </div>

                                    {/* Stack elements (reversed for visual - top at top) */}
                                    <div className="flex flex-col-reverse items-center gap-1 min-h-[250px]">
                                        <AnimatePresence mode="popLayout">
                                            {stack.map((element, index) => (
                                                <motion.div
                                                    key={element.id}
                                                    initial={{ scale: 0, y: -50 }}
                                                    animate={{ scale: 1, y: 0 }}
                                                    exit={{ scale: 0, y: -50 }}
                                                    layout
                                                    className={cn(
                                                        "w-40 h-14 flex items-center justify-center border-2 rounded-lg transition-all duration-300",
                                                        getElementColor(element.state)
                                                    )}
                                                >
                                                    <div className="text-center">
                                                        <div className="text-lg font-bold">{element.value}</div>
                                                        {index === stack.length - 1 && (
                                                            <div className="text-xs text-emerald-500 font-medium">← TOP</div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        {stack.length === 0 && (
                                            <div className="text-muted-foreground py-20">Stack is Empty</div>
                                        )}
                                    </div>

                                    {/* Bottom indicator */}
                                    <div className="w-48 h-2 bg-slate-600 rounded-full mt-4" />
                                    <div className="text-sm text-muted-foreground mt-2">BOTTOM</div>
                                </div>

                                {/* Legend */}
                                <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border-2 border-slate-400" />
                                        <span className="text-muted-foreground">Default</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border-2 border-emerald-500 bg-emerald-500/20" />
                                        <span className="text-muted-foreground">Top</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border-2 border-sky-500 bg-sky-500/20" />
                                        <span className="text-muted-foreground">Pushing</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border-2 border-pink-500 bg-pink-500/20" />
                                        <span className="text-muted-foreground">Popping</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border-2 border-orange-500 bg-orange-500/20" />
                                        <span className="text-muted-foreground">Peeking</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-card rounded-xl border border-border/50 text-center">
                                    <div className="text-3xl font-bold text-primary">{stack.length}</div>
                                    <div className="text-sm text-muted-foreground">Current Size</div>
                                </div>
                                <div className="p-4 bg-card rounded-xl border border-border/50 text-center">
                                    <div className="text-3xl font-bold text-muted-foreground">{maxSize}</div>
                                    <div className="text-sm text-muted-foreground">Max Size</div>
                                </div>
                            </div>
                        </div>

                        {/* Side Panel */}
                        <div className="space-y-6">
                            {/* Operations Info */}
                            <div className="p-6 bg-card rounded-xl border border-border/50">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Info className="h-4 w-4 text-primary" />
                                    Stack Operations
                                </h3>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    <li><strong className="text-foreground">Push:</strong> Add element to top</li>
                                    <li><strong className="text-foreground">Pop:</strong> Remove element from top</li>
                                    <li><strong className="text-foreground">Peek:</strong> View top element without removing</li>
                                    <li><strong className="text-foreground">isEmpty:</strong> Check if stack is empty</li>
                                    <li><strong className="text-foreground">isFull:</strong> Check if stack is full</li>
                                </ul>
                            </div>

                            {/* Use Cases */}
                            <div className="p-6 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl border border-violet-500/20">
                                <h3 className="font-semibold mb-3 text-violet-500">Real-World Uses</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Undo/Redo functionality</li>
                                    <li>• Browser back button</li>
                                    <li>• Function call stack</li>
                                    <li>• Expression evaluation</li>
                                    <li>• Parenthesis matching</li>
                                </ul>
                            </div>

                            {/* Complexity */}
                            <div className="p-6 bg-card rounded-xl border border-border/50">
                                <h3 className="font-semibold mb-4">Complexity</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Push</span>
                                        <Badge variant="outline" className="bg-green-500/10 text-green-500">O(1)</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Pop</span>
                                        <Badge variant="outline" className="bg-green-500/10 text-green-500">O(1)</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Peek</span>
                                        <Badge variant="outline" className="bg-green-500/10 text-green-500">O(1)</Badge>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-border/50">
                                        <span className="text-muted-foreground">Space</span>
                                        <Badge variant="secondary">O(n)</Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Code */}
                            <div className="p-6 bg-card rounded-xl border border-border/50">
                                <h3 className="font-semibold mb-4">Code</h3>
                                <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-auto max-h-64">
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
