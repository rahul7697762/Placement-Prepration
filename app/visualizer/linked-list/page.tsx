"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Plus,
    Trash2,
    Search,
    ArrowRight,
    RotateCcw,
    Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NodeState = "default" | "current" | "found" | "new" | "deleting";

interface ListNode {
    id: number;
    value: number;
    state: NodeState;
}

export default function LinkedListPage() {
    const [nodes, setNodes] = useState<ListNode[]>([
        { id: 1, value: 10, state: "default" },
        { id: 2, value: 20, state: "default" },
        { id: 3, value: 30, state: "default" },
        { id: 4, value: 40, state: "default" },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [positionValue, setPositionValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [message, setMessage] = useState("");
    const [speed, setSpeed] = useState(50);
    const nextId = useRef(5);

    const delay = useCallback(() => {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, Math.max(200, 800 - speed * 6));
        });
    }, [speed]);

    const resetStates = () => {
        setNodes(prev => prev.map(node => ({ ...node, state: "default" })));
    };

    // Insert at beginning
    const insertAtHead = async () => {
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            setMessage("Please enter a valid number");
            return;
        }

        setIsRunning(true);
        resetStates();
        setMessage(`Inserting ${value} at head...`);

        const newNode: ListNode = {
            id: nextId.current++,
            value,
            state: "new",
        };

        setNodes(prev => [newNode, ...prev]);
        await delay();

        setNodes(prev => prev.map(node => ({ ...node, state: "default" })));
        setMessage(`Inserted ${value} at head`);
        setInputValue("");
        setIsRunning(false);
    };

    // Insert at end
    const insertAtTail = async () => {
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            setMessage("Please enter a valid number");
            return;
        }

        setIsRunning(true);
        resetStates();
        setMessage(`Traversing to end...`);

        // Traverse animation
        for (let i = 0; i < nodes.length; i++) {
            setNodes(prev => prev.map((node, idx) => ({
                ...node,
                state: idx === i ? "current" : idx < i ? "default" : node.state
            })));
            await delay();
        }

        const newNode: ListNode = {
            id: nextId.current++,
            value,
            state: "new",
        };

        setNodes(prev => [...prev, newNode]);
        setMessage(`Inserted ${value} at tail`);
        await delay();

        resetStates();
        setInputValue("");
        setIsRunning(false);
    };

    // Insert at position
    const insertAtPosition = async () => {
        const value = parseInt(inputValue);
        const position = parseInt(positionValue);

        if (isNaN(value) || isNaN(position)) {
            setMessage("Please enter valid value and position");
            return;
        }

        if (position < 0 || position > nodes.length) {
            setMessage(`Position must be between 0 and ${nodes.length}`);
            return;
        }

        setIsRunning(true);
        resetStates();
        setMessage(`Traversing to position ${position}...`);

        // Traverse animation
        for (let i = 0; i < position; i++) {
            setNodes(prev => prev.map((node, idx) => ({
                ...node,
                state: idx === i ? "current" : node.state
            })));
            await delay();
        }

        const newNode: ListNode = {
            id: nextId.current++,
            value,
            state: "new",
        };

        setNodes(prev => [
            ...prev.slice(0, position),
            newNode,
            ...prev.slice(position)
        ]);
        setMessage(`Inserted ${value} at position ${position}`);
        await delay();

        resetStates();
        setInputValue("");
        setPositionValue("");
        setIsRunning(false);
    };

    // Delete from head
    const deleteFromHead = async () => {
        if (nodes.length === 0) {
            setMessage("List is empty");
            return;
        }

        setIsRunning(true);
        setMessage("Deleting from head...");

        setNodes(prev => prev.map((node, idx) => ({
            ...node,
            state: idx === 0 ? "deleting" : node.state
        })));
        await delay();

        setNodes(prev => prev.slice(1));
        setMessage("Deleted from head");
        setIsRunning(false);
    };

    // Delete from tail
    const deleteFromTail = async () => {
        if (nodes.length === 0) {
            setMessage("List is empty");
            return;
        }

        setIsRunning(true);
        setMessage("Traversing to end...");

        // Traverse animation
        for (let i = 0; i < nodes.length; i++) {
            setNodes(prev => prev.map((node, idx) => ({
                ...node,
                state: idx === i ? "current" : idx < i ? "default" : node.state
            })));
            await delay();
        }

        setNodes(prev => prev.map((node, idx) => ({
            ...node,
            state: idx === prev.length - 1 ? "deleting" : node.state
        })));
        await delay();

        setNodes(prev => prev.slice(0, -1));
        setMessage("Deleted from tail");
        setIsRunning(false);
    };

    // Search for value
    const searchForValue = async () => {
        const value = parseInt(searchValue);
        if (isNaN(value)) {
            setMessage("Please enter a valid number to search");
            return;
        }

        setIsRunning(true);
        resetStates();
        setMessage(`Searching for ${value}...`);

        let found = false;
        for (let i = 0; i < nodes.length; i++) {
            setNodes(prev => prev.map((node, idx) => ({
                ...node,
                state: idx === i ? "current" : idx < i ? "default" : node.state
            })));
            await delay();

            if (nodes[i].value === value) {
                setNodes(prev => prev.map((node, idx) => ({
                    ...node,
                    state: idx === i ? "found" : "default"
                })));
                setMessage(`Found ${value} at position ${i}`);
                found = true;
                break;
            }
        }

        if (!found) {
            resetStates();
            setMessage(`${value} not found in the list`);
        }

        setSearchValue("");
        setIsRunning(false);
    };

    // Reverse list
    const reverseList = async () => {
        if (nodes.length <= 1) {
            setMessage("Need at least 2 nodes to reverse");
            return;
        }

        setIsRunning(true);
        setMessage("Reversing list...");

        setNodes(prev => [...prev].reverse().map(n => ({ ...n, state: "new" })));
        await delay();

        resetStates();
        setMessage("List reversed");
        setIsRunning(false);
    };

    // Clear list
    const clearList = () => {
        setNodes([]);
        setMessage("List cleared");
        nextId.current = 1;
    };

    const getNodeColor = (state: NodeState) => {
        switch (state) {
            case "current": return "border-orange-500 bg-orange-500/20";
            case "found": return "border-emerald-500 bg-emerald-500/20";
            case "new": return "border-sky-500 bg-sky-500/20";
            case "deleting": return "border-pink-500 bg-pink-500/20";
            default: return "border-slate-400 dark:border-slate-600 bg-card";
        }
    };

    const codeSnippet = `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertAtHead(value) {
    const node = new Node(value);
    node.next = this.head;
    this.head = node;
  }

  insertAtTail(value) {
    const node = new Node(value);
    if (!this.head) {
      this.head = node;
      return;
    }
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = node;
  }

  deleteFromHead() {
    if (this.head) {
      this.head = this.head.next;
    }
  }

  search(value) {
    let current = this.head;
    let index = 0;
    while (current) {
      if (current.value === value) {
        return index;
      }
      current = current.next;
      index++;
    }
    return -1;
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
                                Linked List
                            </h1>
                            <p className="text-muted-foreground max-w-2xl">
                                A linear data structure where elements are stored in nodes, each pointing to the next node. Allows dynamic memory allocation and efficient insertions/deletions.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Insert: O(1) at head</Badge>
                            <Badge variant="secondary">Search: O(n)</Badge>
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
                                    <Button onClick={insertAtHead} disabled={isRunning || !inputValue} size="sm" className="gap-1">
                                        <Plus className="h-3 w-3" /> Head
                                    </Button>
                                    <Button onClick={insertAtTail} disabled={isRunning || !inputValue} size="sm" className="gap-1">
                                        <Plus className="h-3 w-3" /> Tail
                                    </Button>
                                    <Input
                                        type="number"
                                        placeholder="Position"
                                        value={positionValue}
                                        onChange={(e) => setPositionValue(e.target.value)}
                                        className="w-24"
                                        disabled={isRunning}
                                    />
                                    <Button onClick={insertAtPosition} disabled={isRunning || !inputValue || !positionValue} size="sm" variant="outline">
                                        Insert at Pos
                                    </Button>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <Button onClick={deleteFromHead} disabled={isRunning || nodes.length === 0} size="sm" variant="destructive" className="gap-1">
                                        <Trash2 className="h-3 w-3" /> Delete Head
                                    </Button>
                                    <Button onClick={deleteFromTail} disabled={isRunning || nodes.length === 0} size="sm" variant="destructive" className="gap-1">
                                        <Trash2 className="h-3 w-3" /> Delete Tail
                                    </Button>
                                    <Input
                                        type="number"
                                        placeholder="Search"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        className="w-24"
                                        disabled={isRunning}
                                    />
                                    <Button onClick={searchForValue} disabled={isRunning || !searchValue} size="sm" variant="outline" className="gap-1">
                                        <Search className="h-3 w-3" /> Search
                                    </Button>
                                    <Button onClick={reverseList} disabled={isRunning || nodes.length <= 1} size="sm" variant="outline" className="gap-1">
                                        <RotateCcw className="h-3 w-3" /> Reverse
                                    </Button>
                                    <Button onClick={clearList} disabled={isRunning} size="sm" variant="ghost" className="text-destructive">
                                        Clear
                                    </Button>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-muted-foreground">Speed:</span>
                                    <div className="w-32">
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

                            {/* List Visualization */}
                            <div className="bg-card rounded-xl border border-border/50 p-6 min-h-[300px] overflow-x-auto">
                                <div className="flex items-center gap-2 min-w-max">
                                    <div className="text-sm font-medium text-muted-foreground mr-2">HEAD →</div>
                                    <AnimatePresence mode="popLayout">
                                        {nodes.map((node, index) => (
                                            <motion.div
                                                key={node.id}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                layout
                                                className="flex items-center"
                                            >
                                                <div
                                                    className={cn(
                                                        "flex items-center border-2 rounded-lg p-3 transition-all duration-300",
                                                        getNodeColor(node.state)
                                                    )}
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <div className="text-xs text-muted-foreground mb-1">idx: {index}</div>
                                                        <div className="text-xl font-bold">{node.value}</div>
                                                    </div>
                                                    <div className="ml-3 pl-3 border-l border-border">
                                                        <div className="text-xs text-muted-foreground">next</div>
                                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                </div>
                                                {index < nodes.length - 1 && (
                                                    <div className="mx-1 text-muted-foreground">→</div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {nodes.length > 0 && (
                                        <div className="text-sm font-medium text-muted-foreground ml-2">→ NULL</div>
                                    )}
                                    {nodes.length === 0 && (
                                        <div className="text-muted-foreground">NULL (Empty List)</div>
                                    )}
                                </div>

                                {/* Legend */}
                                <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border-2 border-slate-400" />
                                        <span className="text-muted-foreground">Default</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border-2 border-orange-500 bg-orange-500/20" />
                                        <span className="text-muted-foreground">Current</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border-2 border-emerald-500 bg-emerald-500/20" />
                                        <span className="text-muted-foreground">Found</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border-2 border-sky-500 bg-sky-500/20" />
                                        <span className="text-muted-foreground">New</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border-2 border-pink-500 bg-pink-500/20" />
                                        <span className="text-muted-foreground">Deleting</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="p-4 bg-card rounded-xl border border-border/50 text-center">
                                <div className="text-3xl font-bold text-primary">{nodes.length}</div>
                                <div className="text-sm text-muted-foreground">Nodes in List</div>
                            </div>
                        </div>

                        {/* Side Panel */}
                        <div className="space-y-6">
                            {/* Operations Info */}
                            <div className="p-6 bg-card rounded-xl border border-border/50">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Info className="h-4 w-4 text-primary" />
                                    Operations
                                </h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li><strong>Insert at Head:</strong> O(1)</li>
                                    <li><strong>Insert at Tail:</strong> O(n)</li>
                                    <li><strong>Insert at Position:</strong> O(n)</li>
                                    <li><strong>Delete from Head:</strong> O(1)</li>
                                    <li><strong>Delete from Tail:</strong> O(n)</li>
                                    <li><strong>Search:</strong> O(n)</li>
                                    <li><strong>Reverse:</strong> O(n)</li>
                                </ul>
                            </div>

                            {/* Complexity */}
                            <div className="p-6 bg-card rounded-xl border border-border/50">
                                <h3 className="font-semibold mb-4">Complexity</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Access</span>
                                        <Badge variant="outline">O(n)</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Search</span>
                                        <Badge variant="outline">O(n)</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Insert (head)</span>
                                        <Badge variant="outline" className="bg-green-500/10 text-green-500">O(1)</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Delete (head)</span>
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
