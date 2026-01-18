"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Play,
    Pause,
    RotateCcw,
    ArrowLeft,
    Info,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NodeState = "default" | "visiting" | "visited" | "current" | "start" | "backtrack";

interface GraphNode {
    id: number;
    x: number;
    y: number;
    state: NodeState;
}

interface Edge {
    from: number;
    to: number;
    visited: boolean;
}

export default function DFSPage() {
    const [nodes, setNodes] = useState<GraphNode[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [visitOrder, setVisitOrder] = useState<number[]>([]);
    const [stack, setStack] = useState<number[]>([]);
    const pauseRef = useRef(false);
    const isCancelled = useRef(false);

    const initializeGraph = useCallback(() => {
        const graphNodes: GraphNode[] = [
            { id: 0, x: 300, y: 50, state: "start" },
            { id: 1, x: 150, y: 150, state: "default" },
            { id: 2, x: 450, y: 150, state: "default" },
            { id: 3, x: 75, y: 280, state: "default" },
            { id: 4, x: 225, y: 280, state: "default" },
            { id: 5, x: 375, y: 280, state: "default" },
            { id: 6, x: 525, y: 280, state: "default" },
            { id: 7, x: 150, y: 400, state: "default" },
            { id: 8, x: 450, y: 400, state: "default" },
        ];

        const graphEdges: Edge[] = [
            { from: 0, to: 1, visited: false },
            { from: 0, to: 2, visited: false },
            { from: 1, to: 3, visited: false },
            { from: 1, to: 4, visited: false },
            { from: 2, to: 5, visited: false },
            { from: 2, to: 6, visited: false },
            { from: 3, to: 7, visited: false },
            { from: 4, to: 7, visited: false },
            { from: 5, to: 8, visited: false },
            { from: 6, to: 8, visited: false },
        ];

        setNodes(graphNodes);
        setEdges(graphEdges);
        setVisitOrder([]);
        setStack([]);
    }, []);

    useEffect(() => {
        initializeGraph();
    }, [initializeGraph]);

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

    const getAdjacent = (nodeId: number): number[] => {
        return edges
            .filter(e => e.from === nodeId || e.to === nodeId)
            .map(e => e.from === nodeId ? e.to : e.from)
            .sort((a, b) => a - b);
    };

    const runDFS = async () => {
        if (isRunning) return;

        setIsRunning(true);
        isCancelled.current = false;
        pauseRef.current = false;
        setVisitOrder([]);
        setStack([]);

        // Reset states
        setNodes(prev => prev.map((n, i) => ({ ...n, state: i === 0 ? "start" : "default" })));
        setEdges(prev => prev.map(e => ({ ...e, visited: false })));

        const visited = new Set<number>();
        const order: number[] = [];

        const dfs = async (nodeId: number, currentStack: number[]) => {
            if (isCancelled.current) return;

            visited.add(nodeId);
            order.push(nodeId);
            currentStack.push(nodeId);

            setVisitOrder([...order]);
            setStack([...currentStack]);

            // Mark current node
            setNodes(prev => prev.map(n => ({
                ...n,
                state: n.id === nodeId ? "current" :
                    visited.has(n.id) ? "visited" : n.state
            })));
            await delay();

            const neighbors = getAdjacent(nodeId);
            for (const neighbor of neighbors) {
                if (isCancelled.current) break;

                if (!visited.has(neighbor)) {
                    // Mark edge as visited
                    setEdges(prev => prev.map(e => {
                        if ((e.from === nodeId && e.to === neighbor) ||
                            (e.to === nodeId && e.from === neighbor)) {
                            return { ...e, visited: true };
                        }
                        return e;
                    }));

                    await dfs(neighbor, [...currentStack]);

                    if (isCancelled.current) return;

                    // Backtrack visualization
                    setNodes(prev => prev.map(n => ({
                        ...n,
                        state: n.id === nodeId ? "backtrack" : n.state
                    })));
                    setStack([...currentStack]);
                    await delay();

                    setNodes(prev => prev.map(n => ({
                        ...n,
                        state: n.id === nodeId ? "current" : n.state
                    })));
                }
            }

            // Mark as fully visited
            setNodes(prev => prev.map(n => ({
                ...n,
                state: n.id === nodeId ? "visited" : n.state
            })));
        };

        await dfs(0, []);

        setIsRunning(false);
        setIsPaused(false);
        setStack([]);
    };

    const togglePause = () => {
        pauseRef.current = !pauseRef.current;
        setIsPaused(!isPaused);
    };

    const reset = () => {
        isCancelled.current = true;
        setIsRunning(false);
        setIsPaused(false);
        initializeGraph();
    };

    const codeSnippet = `function dfs(graph, start) {
  const visited = new Set();
  const result = [];
  
  function explore(node) {
    if (visited.has(node)) return;
    
    visited.add(node);
    result.push(node);
    
    for (const neighbor of graph[node]) {
      explore(neighbor);
    }
  }
  
  explore(start);
  return result;
}

// Iterative version with stack:
function dfsIterative(graph, start) {
  const visited = new Set();
  const stack = [start];
  const result = [];
  
  while (stack.length > 0) {
    const node = stack.pop();
    if (!visited.has(node)) {
      visited.add(node);
      result.push(node);
      // Add neighbors in reverse order
      for (const n of graph[node].reverse()) {
        stack.push(n);
      }
    }
  }
  return result;
}`;

    const algorithmSteps = [
        "Start from the source node",
        "Mark current node as visited",
        "Explore first unvisited neighbor (go deep)",
        "Recursively apply DFS to that neighbor",
        "Backtrack when no unvisited neighbors",
        "Continue until all reachable nodes visited",
        "DFS explores as deep as possible first",
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
                                Depth-First Search (DFS)
                            </h1>
                            <p className="text-muted-foreground max-w-2xl">
                                DFS explores a graph by going as deep as possible along each branch before backtracking. Uses recursion or a stack data structure.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                O(V + E)
                            </Badge>
                            <Badge variant="secondary">
                                Uses Stack/Recursion
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
                                    onClick={runDFS}
                                    disabled={isRunning && !isPaused}
                                    className="gap-2"
                                >
                                    <Play className="h-4 w-4" />
                                    {isRunning ? "Running..." : "Start DFS"}
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

                            {/* Graph Visualization */}
                            <div className="bg-card rounded-xl border border-border/50 p-6">
                                <svg viewBox="0 0 600 500" className="w-full h-auto">
                                    {/* Edges */}
                                    {edges.map((edge, idx) => {
                                        const fromNode = nodes.find(n => n.id === edge.from);
                                        const toNode = nodes.find(n => n.id === edge.to);
                                        if (!fromNode || !toNode) return null;
                                        return (
                                            <line
                                                key={idx}
                                                x1={fromNode.x}
                                                y1={fromNode.y}
                                                x2={toNode.x}
                                                y2={toNode.y}
                                                stroke={edge.visited ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                                                strokeWidth={edge.visited ? 3 : 2}
                                                strokeOpacity={edge.visited ? 1 : 0.3}
                                                className="transition-all duration-300"
                                            />
                                        );
                                    })}

                                    {/* Nodes */}
                                    {nodes.map((node) => (
                                        <g key={node.id}>
                                            <circle
                                                cx={node.x}
                                                cy={node.y}
                                                r={node.state === "current" ? 32 : 28}
                                                className={cn(
                                                    "transition-all duration-300 stroke-2",
                                                    node.state === "start" && "fill-green-500 stroke-green-400",
                                                    node.state === "current" && "fill-yellow-500 stroke-yellow-400",
                                                    node.state === "backtrack" && "fill-orange-500 stroke-orange-400",
                                                    node.state === "visited" && "fill-purple-500 stroke-purple-400",
                                                    node.state === "default" && "fill-muted stroke-muted-foreground"
                                                )}
                                            />
                                            <text
                                                x={node.x}
                                                y={node.y}
                                                textAnchor="middle"
                                                dominantBaseline="central"
                                                className="fill-white font-bold text-lg"
                                            >
                                                {node.id}
                                            </text>
                                        </g>
                                    ))}
                                </svg>

                                {/* Legend */}
                                <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-green-500" />
                                        <span className="text-muted-foreground">Start</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-yellow-500" />
                                        <span className="text-muted-foreground">Current</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-orange-500" />
                                        <span className="text-muted-foreground">Backtracking</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-purple-500" />
                                        <span className="text-muted-foreground">Visited</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stack & Visit Order */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 bg-card rounded-xl border border-border/50">
                                    <h3 className="font-semibold mb-3">Current Stack (Call Stack)</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {stack.map((nodeId, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-500 text-white font-bold"
                                            >
                                                {nodeId}
                                            </motion.div>
                                        ))}
                                        {stack.length === 0 && (
                                            <span className="text-muted-foreground text-sm">Empty</span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 bg-card rounded-xl border border-border/50">
                                    <h3 className="font-semibold mb-3">Visit Order</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {visitOrder.map((nodeId, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold"
                                            >
                                                {nodeId}
                                            </motion.div>
                                        ))}
                                        {visitOrder.length === 0 && (
                                            <span className="text-muted-foreground text-sm">
                                                Start the visualization
                                            </span>
                                        )}
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
                                    How DFS Works
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

                            {/* DFS vs BFS */}
                            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                                <h3 className="font-semibold mb-3 text-purple-500">DFS vs BFS</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• DFS uses <strong>Stack</strong>, BFS uses <strong>Queue</strong></li>
                                    <li>• DFS goes <strong>deep</strong>, BFS goes <strong>wide</strong></li>
                                    <li>• DFS uses less memory for sparse graphs</li>
                                    <li>• BFS finds shortest path, DFS finds any path</li>
                                </ul>
                            </div>

                            {/* Complexity */}
                            <div className="p-6 bg-card rounded-xl border border-border/50">
                                <h3 className="font-semibold mb-4">Complexity</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Time</span>
                                        <Badge variant="outline">O(V + E)</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Space</span>
                                        <Badge variant="secondary">O(V)</Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Code */}
                            <div className="p-6 bg-card rounded-xl border border-border/50">
                                <h3 className="font-semibold mb-4">Code</h3>
                                <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-x-auto max-h-64">
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
