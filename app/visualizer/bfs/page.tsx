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

type NodeState = "default" | "visiting" | "visited" | "current" | "start" | "path";

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

export default function BFSPage() {
    const [nodes, setNodes] = useState<GraphNode[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [speed, setSpeed] = useState(50);
    const [visitOrder, setVisitOrder] = useState<number[]>([]);
    const pauseRef = useRef(false);
    const isCancelled = useRef(false);

    const initializeGraph = useCallback(() => {
        // Create a sample graph
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
            .map(e => e.from === nodeId ? e.to : e.from);
    };

    const runBFS = async () => {
        if (isRunning) return;

        setIsRunning(true);
        isCancelled.current = false;
        pauseRef.current = false;
        setVisitOrder([]);

        // Reset states
        setNodes(prev => prev.map((n, i) => ({ ...n, state: i === 0 ? "start" : "default" })));
        setEdges(prev => prev.map(e => ({ ...e, visited: false })));

        const visited = new Set<number>();
        const queue: number[] = [0];
        const order: number[] = [];

        visited.add(0);

        while (queue.length > 0 && !isCancelled.current) {
            const current = queue.shift()!;
            order.push(current);
            setVisitOrder([...order]);

            // Mark current node
            setNodes(prev => prev.map(n => ({
                ...n,
                state: n.id === current ? "current" :
                    n.id === 0 && current !== 0 ? "visited" :
                        visited.has(n.id) ? "visited" : n.state
            })));
            await delay();

            const neighbors = getAdjacent(current);
            for (const neighbor of neighbors) {
                if (isCancelled.current) break;

                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);

                    // Mark edge as visited
                    setEdges(prev => prev.map(e => {
                        if ((e.from === current && e.to === neighbor) ||
                            (e.to === current && e.from === neighbor)) {
                            return { ...e, visited: true };
                        }
                        return e;
                    }));

                    // Mark neighbor as visiting (in queue)
                    setNodes(prev => prev.map(n => ({
                        ...n,
                        state: n.id === neighbor ? "visiting" : n.state
                    })));
                    await delay();
                }
            }

            // Mark current as visited
            setNodes(prev => prev.map(n => ({
                ...n,
                state: n.id === current ? "visited" : n.state
            })));
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
        initializeGraph();
    };

    const getNodeColor = (state: NodeState) => {
        switch (state) {
            case "start": return "bg-green-500 border-green-400";
            case "current": return "bg-yellow-500 border-yellow-400 scale-125";
            case "visiting": return "bg-blue-500 border-blue-400";
            case "visited": return "bg-purple-500 border-purple-400";
            default: return "bg-muted border-border";
        }
    };

    const codeSnippet = `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const result = [];
  
  visited.add(start);
  
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);
    
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}`;

    const algorithmSteps = [
        "Start from the source node, add it to a queue",
        "Mark the source node as visited",
        "While queue is not empty, dequeue a node",
        "Process the current node (visit it)",
        "For each unvisited neighbor, mark visited and enqueue",
        "Repeat until queue is empty",
        "BFS explores level by level (breadth-first)",
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
                                Breadth-First Search (BFS)
                            </h1>
                            <p className="text-muted-foreground max-w-2xl">
                                BFS explores a graph level by level, visiting all neighbors of the current node before moving to the next level. Uses a queue data structure.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                O(V + E)
                            </Badge>
                            <Badge variant="secondary">
                                Uses Queue
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
                                    onClick={runBFS}
                                    disabled={isRunning && !isPaused}
                                    className="gap-2"
                                >
                                    <Play className="h-4 w-4" />
                                    {isRunning ? "Running..." : "Start BFS"}
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
                                                    node.state === "visiting" && "fill-blue-500 stroke-blue-400",
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
                                        <div className="w-4 h-4 rounded-full bg-blue-500" />
                                        <span className="text-muted-foreground">In Queue</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-purple-500" />
                                        <span className="text-muted-foreground">Visited</span>
                                    </div>
                                </div>
                            </div>

                            {/* Visit Order */}
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
                                            Start the visualization to see the visit order
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Side Panel */}
                        <div className="space-y-6">
                            {/* Algorithm Steps */}
                            <div className="p-6 bg-card rounded-xl border border-border/50">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Info className="h-4 w-4 text-primary" />
                                    How BFS Works
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

                            {/* Key Properties */}
                            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
                                <h3 className="font-semibold mb-3 text-blue-500">Key Properties</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Finds <strong>shortest path</strong> in unweighted graphs</li>
                                    <li>• Explores all nodes at current depth first</li>
                                    <li>• Uses <strong>Queue (FIFO)</strong> data structure</li>
                                    <li>• Complete: Will find solution if one exists</li>
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
                                <p className="text-xs text-muted-foreground mt-3">
                                    V = vertices, E = edges
                                </p>
                            </div>

                            {/* Code */}
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
