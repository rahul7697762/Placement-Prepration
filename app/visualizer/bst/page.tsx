"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    Pause,
    RotateCcw,
    ArrowLeft,
    Info,
    Plus,
    Search,
    Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NodeState = "default" | "current" | "found" | "comparing" | "inserted" | "path";

interface TreeNode {
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;
    x: number;
    y: number;
    state: NodeState;
}

export default function BSTPage() {
    const [root, setRoot] = useState<TreeNode | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [message, setMessage] = useState("");
    const isCancelled = useRef(false);

    const delay = useCallback(() => {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, Math.max(200, 800 - speed * 6));
        });
    }, [speed]);

    // Calculate positions for visualization
    const calculatePositions = (node: TreeNode | null, x: number, y: number, spread: number): TreeNode | null => {
        if (!node) return null;
        return {
            ...node,
            x,
            y,
            left: calculatePositions(node.left, x - spread, y + 80, spread / 2),
            right: calculatePositions(node.right, x + spread, y + 80, spread / 2),
        };
    };

    const updateTree = (newRoot: TreeNode | null) => {
        if (newRoot) {
            const positioned = calculatePositions(newRoot, 300, 50, 120);
            setRoot(positioned);
        } else {
            setRoot(null);
        }
    };

    const resetStates = (node: TreeNode | null): TreeNode | null => {
        if (!node) return null;
        return {
            ...node,
            state: "default",
            left: resetStates(node.left),
            right: resetStates(node.right),
        };
    };

    const insertValue = async () => {
        const value = parseInt(inputValue);
        if (isNaN(value)) {
            setMessage("Please enter a valid number");
            return;
        }

        setIsRunning(true);
        setMessage(`Inserting ${value}...`);
        isCancelled.current = false;

        // Reset states
        if (root) {
            updateTree(resetStates(root));
        }

        const insert = async (node: TreeNode | null, val: number): Promise<TreeNode> => {
            if (!node) {
                return {
                    value: val,
                    left: null,
                    right: null,
                    x: 0,
                    y: 0,
                    state: "inserted",
                };
            }

            // Highlight current node
            node.state = "current";
            updateTree(calculatePositions(root!, 300, 50, 120));
            await delay();

            if (val < node.value) {
                node.state = "path";
                node.left = await insert(node.left, val);
            } else if (val > node.value) {
                node.state = "path";
                node.right = await insert(node.right, val);
            } else {
                node.state = "found";
                setMessage(`${val} already exists in the tree`);
            }

            return node;
        };

        if (!root) {
            const newNode: TreeNode = {
                value,
                left: null,
                right: null,
                x: 300,
                y: 50,
                state: "inserted",
            };
            setRoot(newNode);
            setMessage(`Inserted ${value} as root`);
        } else {
            const newRoot = await insert({ ...root }, value);
            updateTree(newRoot);
            setMessage(`Inserted ${value}`);
        }

        setInputValue("");
        setIsRunning(false);

        // Reset states after a moment
        setTimeout(() => {
            if (root) {
                updateTree(resetStates(root));
            }
        }, 1000);
    };

    const searchForValue = async () => {
        const value = parseInt(searchValue);
        if (isNaN(value) || !root) {
            setMessage("Please enter a valid number and ensure tree is not empty");
            return;
        }

        setIsRunning(true);
        setMessage(`Searching for ${value}...`);
        updateTree(resetStates(root));

        const search = async (node: TreeNode | null): Promise<boolean> => {
            if (!node) {
                setMessage(`${value} not found in the tree`);
                return false;
            }

            node.state = "current";
            updateTree(calculatePositions(root!, 300, 50, 120));
            await delay();

            if (value === node.value) {
                node.state = "found";
                updateTree(calculatePositions(root!, 300, 50, 120));
                setMessage(`Found ${value}!`);
                return true;
            } else if (value < node.value) {
                node.state = "path";
                return await search(node.left);
            } else {
                node.state = "path";
                return await search(node.right);
            }
        };

        await search(root);
        setIsRunning(false);
        setSearchValue("");
    };

    const generateRandomTree = () => {
        const values = [50, 30, 70, 20, 40, 60, 80, 15, 25, 35, 45];
        let newRoot: TreeNode | null = null;

        const insertSync = (node: TreeNode | null, val: number): TreeNode => {
            if (!node) {
                return { value: val, left: null, right: null, x: 0, y: 0, state: "default" };
            }
            if (val < node.value) {
                node.left = insertSync(node.left, val);
            } else if (val > node.value) {
                node.right = insertSync(node.right, val);
            }
            return node;
        };

        for (const val of values) {
            newRoot = insertSync(newRoot, val);
        }

        updateTree(newRoot);
        setMessage("Generated sample BST");
    };

    const clearTree = () => {
        setRoot(null);
        setMessage("Tree cleared");
    };

    // Flatten tree for rendering
    const flattenTree = (node: TreeNode | null, edges: { from: TreeNode; to: TreeNode }[] = []): { nodes: TreeNode[]; edges: { from: TreeNode; to: TreeNode }[] } => {
        if (!node) return { nodes: [], edges };

        const nodes: TreeNode[] = [node];

        if (node.left) {
            edges.push({ from: node, to: node.left });
            const leftResult = flattenTree(node.left, edges);
            nodes.push(...leftResult.nodes);
        }
        if (node.right) {
            edges.push({ from: node, to: node.right });
            const rightResult = flattenTree(node.right, edges);
            nodes.push(...rightResult.nodes);
        }

        return { nodes, edges };
    };

    const { nodes, edges } = flattenTree(root);

    const codeSnippet = `class BST {
  insert(value) {
    const node = { value, left: null, right: null };
    if (!this.root) {
      this.root = node;
      return;
    }
    
    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = node;
          break;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = node;
          break;
        }
        current = current.right;
      }
    }
  }

  search(value) {
    let current = this.root;
    while (current) {
      if (value === current.value) return true;
      current = value < current.value 
        ? current.left 
        : current.right;
    }
    return false;
  }
}`;

    const algorithmSteps = [
        "Start at the root node",
        "Compare target value with current node",
        "If target < current, go to left subtree",
        "If target > current, go to right subtree",
        "Repeat until found or reach null",
        "BST property: left < parent < right",
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
                                Binary Search Tree (BST)
                            </h1>
                            <p className="text-muted-foreground max-w-2xl">
                                A Binary Search Tree maintains the property that left children are smaller and right children are larger than the parent node.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                O(log n) average
                            </Badge>
                            <Badge variant="secondary">
                                O(n) worst case
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
                                        placeholder="Value..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="w-24"
                                        disabled={isRunning}
                                    />
                                    <Button
                                        onClick={insertValue}
                                        disabled={isRunning || !inputValue}
                                        size="sm"
                                        className="gap-1"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Insert
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Search..."
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        className="w-24"
                                        disabled={isRunning}
                                    />
                                    <Button
                                        onClick={searchForValue}
                                        disabled={isRunning || !searchValue || !root}
                                        size="sm"
                                        variant="outline"
                                        className="gap-1"
                                    >
                                        <Search className="h-4 w-4" />
                                        Search
                                    </Button>
                                </div>

                                <Button
                                    onClick={generateRandomTree}
                                    variant="outline"
                                    size="sm"
                                    disabled={isRunning}
                                >
                                    Sample Tree
                                </Button>

                                <Button
                                    onClick={clearTree}
                                    variant="ghost"
                                    size="sm"
                                    disabled={isRunning}
                                    className="gap-1 text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Clear
                                </Button>

                                <div className="flex items-center gap-4 ml-auto">
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

                            {/* Tree Visualization */}
                            <div className="bg-card rounded-xl border border-border/50 p-6 min-h-[500px]">
                                {root ? (
                                    <svg viewBox="0 0 600 450" className="w-full h-auto">
                                        {/* Edges */}
                                        {edges.map((edge, idx) => (
                                            <line
                                                key={idx}
                                                x1={edge.from.x}
                                                y1={edge.from.y}
                                                x2={edge.to.x}
                                                y2={edge.to.y}
                                                stroke={
                                                    edge.to.state === "path" || edge.to.state === "found" || edge.to.state === "current"
                                                        ? "hsl(var(--primary))"
                                                        : "hsl(var(--muted-foreground))"
                                                }
                                                strokeWidth={2}
                                                strokeOpacity={0.5}
                                                className="transition-all duration-300"
                                            />
                                        ))}

                                        {/* Nodes */}
                                        <AnimatePresence>
                                            {nodes.map((node) => (
                                                <motion.g
                                                    key={node.value}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                >
                                                    <circle
                                                        cx={node.x}
                                                        cy={node.y}
                                                        r={node.state === "current" || node.state === "found" ? 28 : 24}
                                                        className={cn(
                                                            "transition-all duration-300 stroke-2",
                                                            node.state === "default" && "fill-primary stroke-primary/50",
                                                            node.state === "current" && "fill-yellow-500 stroke-yellow-400",
                                                            node.state === "found" && "fill-green-500 stroke-green-400",
                                                            node.state === "inserted" && "fill-blue-500 stroke-blue-400",
                                                            node.state === "path" && "fill-orange-500 stroke-orange-400",
                                                            node.state === "comparing" && "fill-purple-500 stroke-purple-400"
                                                        )}
                                                    />
                                                    <text
                                                        x={node.x}
                                                        y={node.y}
                                                        textAnchor="middle"
                                                        dominantBaseline="central"
                                                        className="fill-white font-bold text-sm"
                                                    >
                                                        {node.value}
                                                    </text>
                                                </motion.g>
                                            ))}
                                        </AnimatePresence>
                                    </svg>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                        <div className="text-6xl mb-4">🌳</div>
                                        <p>Tree is empty. Insert a value or generate a sample tree.</p>
                                    </div>
                                )}

                                {/* Legend */}
                                <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-primary" />
                                        <span className="text-muted-foreground">Node</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-yellow-500" />
                                        <span className="text-muted-foreground">Current</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-orange-500" />
                                        <span className="text-muted-foreground">Path</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-green-500" />
                                        <span className="text-muted-foreground">Found</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-blue-500" />
                                        <span className="text-muted-foreground">Inserted</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Side Panel */}
                        <div className="space-y-6">
                            {/* Algorithm Steps */}
                            <div className="p-6 bg-card rounded-xl border border-border/50">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Info className="h-4 w-4 text-primary" />
                                    BST Property
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

                            {/* Complexity */}
                            <div className="p-6 bg-card rounded-xl border border-border/50">
                                <h3 className="font-semibold mb-4">Complexity</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Search (avg)</span>
                                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                            O(log n)
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Search (worst)</span>
                                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                                            O(n)
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Insert</span>
                                        <Badge variant="outline">O(log n)</Badge>
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
