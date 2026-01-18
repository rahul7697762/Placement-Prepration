"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    Pause,
    RotateCcw,
    ArrowLeft,
    Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NodeState = "default" | "current" | "visited" | "processing";
type TraversalType = "inorder" | "preorder" | "postorder" | "levelorder";

interface TreeNode {
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;
    x: number;
    y: number;
    state: NodeState;
}

export default function TreeTraversalsPage() {
    const [root, setRoot] = useState<TreeNode | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [traversalResult, setTraversalResult] = useState<number[]>([]);
    const [currentTraversal, setCurrentTraversal] = useState<TraversalType>("inorder");
    const pauseRef = useRef(false);
    const isCancelled = useRef(false);

    // Initialize sample tree
    const initializeTree = useCallback(() => {
        const tree: TreeNode = {
            value: 50,
            x: 300,
            y: 50,
            state: "default",
            left: {
                value: 30,
                x: 150,
                y: 130,
                state: "default",
                left: {
                    value: 20,
                    x: 75,
                    y: 210,
                    state: "default",
                    left: null,
                    right: null,
                },
                right: {
                    value: 40,
                    x: 225,
                    y: 210,
                    state: "default",
                    left: null,
                    right: null,
                },
            },
            right: {
                value: 70,
                x: 450,
                y: 130,
                state: "default",
                left: {
                    value: 60,
                    x: 375,
                    y: 210,
                    state: "default",
                    left: null,
                    right: null,
                },
                right: {
                    value: 80,
                    x: 525,
                    y: 210,
                    state: "default",
                    left: null,
                    right: null,
                },
            },
        };
        setRoot(tree);
        setTraversalResult([]);
    }, []);

    useState(() => {
        initializeTree();
    });

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
                    setTimeout(resolve, Math.max(200, 800 - speed * 6));
                }
            };
            checkPause();
        });
    }, [speed]);

    const resetStates = (node: TreeNode | null): TreeNode | null => {
        if (!node) return null;
        return {
            ...node,
            state: "default",
            left: resetStates(node.left),
            right: resetStates(node.right),
        };
    };

    const updateNodeState = (targetValue: number, newState: NodeState) => {
        const update = (node: TreeNode | null): TreeNode | null => {
            if (!node) return null;
            return {
                ...node,
                state: node.value === targetValue ? newState : node.state,
                left: update(node.left),
                right: update(node.right),
            };
        };
        setRoot(prev => update(prev));
    };

    // Inorder: Left -> Root -> Right
    const inorderTraversal = async (node: TreeNode | null, result: number[]) => {
        if (!node || isCancelled.current) return;

        updateNodeState(node.value, "processing");
        await delay();

        await inorderTraversal(node.left, result);

        if (isCancelled.current) return;

        updateNodeState(node.value, "current");
        await delay();

        result.push(node.value);
        setTraversalResult([...result]);

        updateNodeState(node.value, "visited");

        await inorderTraversal(node.right, result);
    };

    // Preorder: Root -> Left -> Right
    const preorderTraversal = async (node: TreeNode | null, result: number[]) => {
        if (!node || isCancelled.current) return;

        updateNodeState(node.value, "current");
        await delay();

        result.push(node.value);
        setTraversalResult([...result]);

        updateNodeState(node.value, "visited");

        await preorderTraversal(node.left, result);
        await preorderTraversal(node.right, result);
    };

    // Postorder: Left -> Right -> Root
    const postorderTraversal = async (node: TreeNode | null, result: number[]) => {
        if (!node || isCancelled.current) return;

        updateNodeState(node.value, "processing");
        await delay();

        await postorderTraversal(node.left, result);
        await postorderTraversal(node.right, result);

        if (isCancelled.current) return;

        updateNodeState(node.value, "current");
        await delay();

        result.push(node.value);
        setTraversalResult([...result]);

        updateNodeState(node.value, "visited");
    };

    // Level Order (BFS)
    const levelOrderTraversal = async (root: TreeNode | null, result: number[]) => {
        if (!root) return;

        const queue: TreeNode[] = [root];

        while (queue.length > 0 && !isCancelled.current) {
            const node = queue.shift()!;

            updateNodeState(node.value, "current");
            await delay();

            result.push(node.value);
            setTraversalResult([...result]);

            updateNodeState(node.value, "visited");

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    };

    const runTraversal = async (type: TraversalType) => {
        if (isRunning) return;

        setIsRunning(true);
        setCurrentTraversal(type);
        isCancelled.current = false;
        pauseRef.current = false;
        setTraversalResult([]);

        // Reset states
        setRoot(prev => resetStates(prev));
        await new Promise(r => setTimeout(r, 100));

        const result: number[] = [];

        switch (type) {
            case "inorder":
                await inorderTraversal(root, result);
                break;
            case "preorder":
                await preorderTraversal(root, result);
                break;
            case "postorder":
                await postorderTraversal(root, result);
                break;
            case "levelorder":
                await levelOrderTraversal(root, result);
                break;
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
        initializeTree();
    };

    const flattenTree = (node: TreeNode | null): { nodes: TreeNode[]; edges: { from: TreeNode; to: TreeNode }[] } => {
        if (!node) return { nodes: [], edges: [] };

        const nodes: TreeNode[] = [node];
        const edges: { from: TreeNode; to: TreeNode }[] = [];

        if (node.left) {
            edges.push({ from: node, to: node.left });
            const leftResult = flattenTree(node.left);
            nodes.push(...leftResult.nodes);
            edges.push(...leftResult.edges);
        }
        if (node.right) {
            edges.push({ from: node, to: node.right });
            const rightResult = flattenTree(node.right);
            nodes.push(...rightResult.nodes);
            edges.push(...rightResult.edges);
        }

        return { nodes, edges };
    };

    const { nodes, edges } = flattenTree(root);

    const traversalInfo = {
        inorder: {
            name: "Inorder",
            order: "Left → Root → Right",
            use: "BST: gives sorted order",
            color: "from-blue-500 to-cyan-500",
        },
        preorder: {
            name: "Preorder",
            order: "Root → Left → Right",
            use: "Copy tree, prefix expression",
            color: "from-green-500 to-emerald-500",
        },
        postorder: {
            name: "Postorder",
            order: "Left → Right → Root",
            use: "Delete tree, postfix expression",
            color: "from-purple-500 to-pink-500",
        },
        levelorder: {
            name: "Level Order",
            order: "Level by level (BFS)",
            use: "Find shortest path, level-wise processing",
            color: "from-orange-500 to-red-500",
        },
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
                                Tree Traversals
                            </h1>
                            <p className="text-muted-foreground max-w-2xl">
                                Learn the four fundamental ways to traverse a binary tree: Inorder, Preorder, Postorder, and Level Order.
                            </p>
                        </div>

                        <Badge variant="outline">
                            O(n) Time & Space
                        </Badge>
                    </div>
                </div>
            </section>

            {/* Visualizer */}
            <section className="py-8">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Visualization */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Traversal Buttons */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {(Object.keys(traversalInfo) as TraversalType[]).map((type) => (
                                    <Button
                                        key={type}
                                        onClick={() => runTraversal(type)}
                                        disabled={isRunning}
                                        variant={currentTraversal === type && isRunning ? "default" : "outline"}
                                        className={cn(
                                            "h-auto py-3 flex flex-col gap-1",
                                            currentTraversal === type && isRunning && `bg-gradient-to-r ${traversalInfo[type].color}`
                                        )}
                                    >
                                        <span className="font-semibold">{traversalInfo[type].name}</span>
                                        <span className="text-xs opacity-80">{traversalInfo[type].order}</span>
                                    </Button>
                                ))}
                            </div>

                            {/* Controls */}
                            <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-xl border border-border/50">
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

                                <div className="flex items-center gap-4 ml-auto">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-muted-foreground">Speed:</span>
                                    </div>
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

                            {/* Tree Visualization */}
                            <div className="bg-card rounded-xl border border-border/50 p-6">
                                <svg viewBox="0 0 600 300" className="w-full h-auto">
                                    {/* Edges */}
                                    {edges.map((edge, idx) => (
                                        <line
                                            key={idx}
                                            x1={edge.from.x}
                                            y1={edge.from.y}
                                            x2={edge.to.x}
                                            y2={edge.to.y}
                                            stroke="hsl(var(--muted-foreground))"
                                            strokeWidth={2}
                                            strokeOpacity={0.3}
                                        />
                                    ))}

                                    {/* Nodes */}
                                    {nodes.map((node) => (
                                        <g key={node.value}>
                                            <circle
                                                cx={node.x}
                                                cy={node.y}
                                                r={node.state === "current" ? 30 : 26}
                                                className={cn(
                                                    "transition-all duration-300 stroke-2",
                                                    node.state === "default" && "fill-muted stroke-muted-foreground",
                                                    node.state === "processing" && "fill-blue-500/30 stroke-blue-400",
                                                    node.state === "current" && "fill-yellow-500 stroke-yellow-400",
                                                    node.state === "visited" && "fill-green-500 stroke-green-400"
                                                )}
                                            />
                                            <text
                                                x={node.x}
                                                y={node.y}
                                                textAnchor="middle"
                                                dominantBaseline="central"
                                                className={cn(
                                                    "font-bold text-lg",
                                                    node.state === "default" ? "fill-foreground" : "fill-white"
                                                )}
                                            >
                                                {node.value}
                                            </text>
                                        </g>
                                    ))}
                                </svg>

                                {/* Legend */}
                                <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-muted border border-muted-foreground" />
                                        <span className="text-muted-foreground">Unvisited</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-blue-500/30 border border-blue-400" />
                                        <span className="text-muted-foreground">Processing</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-yellow-500" />
                                        <span className="text-muted-foreground">Current</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-green-500" />
                                        <span className="text-muted-foreground">Visited</span>
                                    </div>
                                </div>
                            </div>

                            {/* Traversal Result */}
                            <div className="p-4 bg-card rounded-xl border border-border/50">
                                <h3 className="font-semibold mb-3">
                                    {traversalInfo[currentTraversal].name} Result
                                </h3>
                                <div className="flex flex-wrap gap-2 min-h-[50px] items-center">
                                    <AnimatePresence>
                                        {traversalResult.map((value, idx) => (
                                            <motion.div
                                                key={`${value}-${idx}`}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="flex items-center"
                                            >
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                                                    {value}
                                                </div>
                                                {idx < traversalResult.length - 1 && (
                                                    <span className="mx-1 text-muted-foreground">→</span>
                                                )}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {traversalResult.length === 0 && (
                                        <span className="text-muted-foreground text-sm">
                                            Click a traversal type to start
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Side Panel */}
                        <div className="space-y-6">
                            {/* Traversal Types */}
                            <div className="p-6 bg-card rounded-xl border border-border/50">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Info className="h-4 w-4 text-primary" />
                                    Traversal Types
                                </h3>
                                <div className="space-y-4">
                                    {(Object.entries(traversalInfo) as [TraversalType, typeof traversalInfo.inorder][]).map(([type, info]) => (
                                        <div key={type} className="p-3 rounded-lg bg-muted/50">
                                            <div className={cn(
                                                "font-semibold bg-clip-text text-transparent bg-gradient-to-r",
                                                info.color
                                            )}>
                                                {info.name}
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-1">
                                                <strong>Order:</strong> {info.order}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                <strong>Use:</strong> {info.use}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Code Snippets */}
                            <div className="p-6 bg-card rounded-xl border border-border/50">
                                <h3 className="font-semibold mb-4">Code</h3>
                                <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-auto max-h-64">
                                    <code className="text-muted-foreground">
                                        {`// Inorder: Left → Root → Right
function inorder(node) {
  if (!node) return;
  inorder(node.left);
  console.log(node.value);
  inorder(node.right);
}

// Preorder: Root → Left → Right  
function preorder(node) {
  if (!node) return;
  console.log(node.value);
  preorder(node.left);
  preorder(node.right);
}

// Postorder: Left → Right → Root
function postorder(node) {
  if (!node) return;
  postorder(node.left);
  postorder(node.right);
  console.log(node.value);
}

// Level Order (BFS)
function levelOrder(root) {
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    console.log(node.value);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
}`}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
