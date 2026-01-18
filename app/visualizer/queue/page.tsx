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
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ElementState = "default" | "front" | "rear" | "enqueuing" | "dequeuing" | "peeking";

interface QueueElement {
    id: number;
    value: number;
    state: ElementState;
}

export default function QueuePage() {
    const [queue, setQueue] = useState<QueueElement[]>([
        { id: 1, value: 10, state: "front" },
        { id: 2, value: 20, state: "default" },
        { id: 3, value: 30, state: "rear" },
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
        setQueue(prev => prev.map((el, idx) => {
            if (prev.length === 1) return { ...el, state: "front" as ElementState };
            if (idx === 0) return { ...el, state: "front" as ElementState };
            if (idx === prev.length - 1) return { ...el, state: "rear" as ElementState };
            return { ...el, state: "default" as ElementState };
        }));
    };

    // Enqueue operation (add to rear)
    const enqueue = async () => {
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            setMessage("Please enter a valid number");
            return;
        }

        if (queue.length >= maxSize) {
            setMessage("Queue Overflow! Maximum size reached.");
            return;
        }

        setIsRunning(true);
        setMessage(`Enqueuing ${value} at rear...`);

        const newElement: QueueElement = {
            id: nextId.current++,
            value,
            state: "enqueuing",
        };

        setQueue(prev => [...prev, newElement]);
        await delay();

        updateStates();
        setMessage(`Enqueued ${value} (Queue size: ${queue.length + 1})`);
        setInputValue("");
        setIsRunning(false);
    };

    // Dequeue operation (remove from front)
    const dequeue = async () => {
        if (queue.length === 0) {
            setMessage("Queue Underflow! Queue is empty.");
            return;
        }

        setIsRunning(true);
        const frontValue = queue[0].value;
        setMessage(`Dequeuing ${frontValue} from front...`);

        setQueue(prev => prev.map((el, idx) => ({
            ...el,
            state: idx === 0 ? "dequeuing" : el.state
        })));
        await delay();

        setQueue(prev => prev.slice(1));
        await delay();

        updateStates();
        setMessage(`Dequeued ${frontValue} (Queue size: ${queue.length - 1})`);
        setIsRunning(false);
    };

    // Peek front
    const peekFront = async () => {
        if (queue.length === 0) {
            setMessage("Queue is empty. Nothing to peek.");
            return;
        }

        setIsRunning(true);
        const frontValue = queue[0].value;
        setMessage(`Peeking at front element...`);

        setQueue(prev => prev.map((el, idx) => ({
            ...el,
            state: idx === 0 ? "peeking" : el.state
        })));
        await delay();
        await delay();

        updateStates();
        setMessage(`Front element is ${frontValue}`);
        setIsRunning(false);
    };

    // Peek rear
    const peekRear = async () => {
        if (queue.length === 0) {
            setMessage("Queue is empty. Nothing to peek.");
            return;
        }

        setIsRunning(true);
        const rearValue = queue[queue.length - 1].value;
        setMessage(`Peeking at rear element...`);

        setQueue(prev => prev.map((el, idx) => ({
            ...el,
            state: idx === prev.length - 1 ? "peeking" : el.state
        })));
        await delay();
        await delay();

        updateStates();
        setMessage(`Rear element is ${rearValue}`);
        setIsRunning(false);
    };

    // isEmpty
    const isEmpty = () => {
        setMessage(queue.length === 0 ? "Queue is EMPTY" : `Queue is NOT empty (${queue.length} elements)`);
    };

    // isFull
    const isFull = () => {
        setMessage(queue.length >= maxSize ? "Queue is FULL" : `Queue is NOT full (${maxSize - queue.length} slots available)`);
    };

    // Clear queue
    const clearQueue = () => {
        setQueue([]);
        setMessage("Queue cleared");
        nextId.current = 1;
    };

    const getElementColor = (state: ElementState) => {
        switch (state) {
            case "front": return "border-emerald-500 bg-emerald-500/20";
            case "rear": return "border-violet-500 bg-violet-500/20";
            case "enqueuing": return "border-sky-500 bg-sky-500/20";
            case "dequeuing": return "border-pink-500 bg-pink-500/20";
            case "peeking": return "border-orange-500 bg-orange-500/20";
            default: return "border-slate-400 dark:border-slate-600 bg-card";
        }
    };

    const codeSnippet = `class Queue {
  constructor(maxSize = 10) {
    this.items = [];
    this.maxSize = maxSize;
  }

  enqueue(value) {
    if (this.isFull()) {
      throw new Error("Queue Overflow");
    }
    this.items.push(value);
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Queue Underflow");
    }
    return this.items.shift();
  }

  front() {
    if (this.isEmpty()) return null;
    return this.items[0];
  }

  rear() {
    if (this.isEmpty()) return null;
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
                                Queue (FIFO)
                            </h1>
                            <p className="text-muted-foreground max-w-2xl">
                                A First-In-First-Out (FIFO) data structure. The first element added is the first one to be removed. Think of a line at a ticket counter!
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">Enqueue: O(1)</Badge>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">Dequeue: O(1)*</Badge>
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
                                    <Button onClick={enqueue} disabled={isRunning || !inputValue} className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                                        <Plus className="h-4 w-4" /> Enqueue
                                    </Button>
                                    <Button onClick={dequeue} disabled={isRunning || queue.length === 0} className="gap-1 bg-pink-600 hover:bg-pink-700">
                                        <Minus className="h-4 w-4" /> Dequeue
                                    </Button>
                                    <Button onClick={peekFront} disabled={isRunning || queue.length === 0} variant="outline" className="gap-1">
                                        <Eye className="h-4 w-4" /> Front
                                    </Button>
                                    <Button onClick={peekRear} disabled={isRunning || queue.length === 0} variant="outline" className="gap-1">
                                        <Eye className="h-4 w-4" /> Rear
                                    </Button>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <Button onClick={isEmpty} disabled={isRunning} size="sm" variant="outline">
                                        isEmpty()
                                    </Button>
                                    <Button onClick={isFull} disabled={isRunning} size="sm" variant="outline">
                                        isFull()
                                    </Button>
                                    <Button onClick={clearQueue} disabled={isRunning} size="sm" variant="ghost" className="text-destructive">
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

                            {/* Queue Visualization */}
                            <div className="bg-card rounded-xl border border-border/50 p-6 min-h-[300px]">
                                <div className="flex items-center justify-center gap-2 overflow-x-auto py-8">
                                    {/* Front indicator */}
                                    <div className="flex flex-col items-center mr-2">
                                        <ArrowRight className="h-6 w-6 text-emerald-500" />
                                        <span className="text-xs font-semibold text-emerald-500">FRONT</span>
                                        <span className="text-xs text-muted-foreground">(Dequeue)</span>
                                    </div>

                                    {/* Queue elements */}
                                    <div className="flex items-center gap-1 min-w-max bg-muted/30 rounded-lg p-4">
                                        <AnimatePresence mode="popLayout">
                                            {queue.map((element, index) => (
                                                <motion.div
                                                    key={element.id}
                                                    initial={{ scale: 0, x: 50 }}
                                                    animate={{ scale: 1, x: 0 }}
                                                    exit={{ scale: 0, x: -50 }}
                                                    layout
                                                    className={cn(
                                                        "w-16 h-16 flex flex-col items-center justify-center border-2 rounded-lg transition-all duration-300",
                                                        getElementColor(element.state)
                                                    )}
                                                >
                                                    <div className="text-lg font-bold">{element.value}</div>
                                                    <div className="text-[10px] text-muted-foreground">
                                                        {index === 0 && queue.length > 1 && "front"}
                                                        {index === queue.length - 1 && queue.length > 1 && "rear"}
                                                        {queue.length === 1 && "only"}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        {queue.length === 0 && (
                                            <div className="text-muted-foreground px-8 py-4">Queue is Empty</div>
                                        )}
                                    </div>

                                    {/* Rear indicator */}
                                    <div className="flex flex-col items-center ml-2">
                                        <ArrowRight className="h-6 w-6 text-violet-500" />
                                        <span className="text-xs font-semibold text-violet-500">REAR</span>
                                        <span className="text-xs text-muted-foreground">(Enqueue)</span>
                                    </div>
                                </div>

                                {/* Flow direction */}
                                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                                    <span>← Elements flow this way ←</span>
                                </div>

                                {/* Legend */}
                                <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border-2 border-slate-400" />
                                        <span className="text-muted-foreground">Default</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border-2 border-emerald-500 bg-emerald-500/20" />
                                        <span className="text-muted-foreground">Front</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border-2 border-violet-500 bg-violet-500/20" />
                                        <span className="text-muted-foreground">Rear</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border-2 border-sky-500 bg-sky-500/20" />
                                        <span className="text-muted-foreground">Enqueuing</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border-2 border-pink-500 bg-pink-500/20" />
                                        <span className="text-muted-foreground">Dequeuing</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-card rounded-xl border border-border/50 text-center">
                                    <div className="text-3xl font-bold text-primary">{queue.length}</div>
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
                                    Queue Operations
                                </h3>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    <li><strong className="text-foreground">Enqueue:</strong> Add element to rear</li>
                                    <li><strong className="text-foreground">Dequeue:</strong> Remove element from front</li>
                                    <li><strong className="text-foreground">Front:</strong> View front element</li>
                                    <li><strong className="text-foreground">Rear:</strong> View rear element</li>
                                    <li><strong className="text-foreground">isEmpty:</strong> Check if queue is empty</li>
                                    <li><strong className="text-foreground">isFull:</strong> Check if queue is full</li>
                                </ul>
                            </div>

                            {/* Use Cases */}
                            <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20">
                                <h3 className="font-semibold mb-3 text-cyan-500">Real-World Uses</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• CPU task scheduling</li>
                                    <li>• Print job spooling</li>
                                    <li>• BFS traversal</li>
                                    <li>• Request handling (web servers)</li>
                                    <li>• Call center systems</li>
                                </ul>
                            </div>

                            {/* Complexity */}
                            <div className="p-6 bg-card rounded-xl border border-border/50">
                                <h3 className="font-semibold mb-4">Complexity</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Enqueue</span>
                                        <Badge variant="outline" className="bg-green-500/10 text-green-500">O(1)</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Dequeue</span>
                                        <Badge variant="outline" className="bg-green-500/10 text-green-500">O(1)*</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Peek (front/rear)</span>
                                        <Badge variant="outline" className="bg-green-500/10 text-green-500">O(1)</Badge>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-border/50">
                                        <span className="text-muted-foreground">Space</span>
                                        <Badge variant="secondary">O(n)</Badge>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    * O(n) for array-based, O(1) for linked list implementation
                                </p>
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
