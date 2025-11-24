"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type NodeType = "empty" | "wall" | "start" | "end" | "visited" | "path";

interface GridNode {
    row: number;
    col: number;
    type: NodeType;
}

const ROWS = 15;
const COLS = 25;
const START_NODE = { row: 2, col: 2 };
const END_NODE = { row: 12, col: 22 };

export function GridVisualizer() {
    const [grid, setGrid] = useState<GridNode[][]>([]);
    const [isRunning, setIsRunning] = useState(false);

    // Initialize grid
    const resetGrid = useCallback(() => {
        const newGrid: GridNode[][] = [];
        for (let r = 0; r < ROWS; r++) {
            const currentRow: GridNode[] = [];
            for (let c = 0; c < COLS; c++) {
                let type: NodeType = "empty";
                if (r === START_NODE.row && c === START_NODE.col) type = "start";
                else if (r === END_NODE.row && c === END_NODE.col) type = "end";
                currentRow.push({ row: r, col: c, type });
            }
            newGrid.push(currentRow);
        }
        setGrid(newGrid);
        setIsRunning(false);
    }, []);

    useEffect(() => {
        resetGrid();
    }, [resetGrid]);

    const toggleWall = (row: number, col: number) => {
        if (isRunning) return;
        if ((row === START_NODE.row && col === START_NODE.col) || (row === END_NODE.row && col === END_NODE.col)) return;

        setGrid((prev) => {
            const newGrid = [...prev];
            const node = newGrid[row][col];
            newGrid[row][col] = {
                ...node,
                type: node.type === "wall" ? "empty" : "wall",
            };
            return newGrid;
        });
    };

    const runBFS = async () => {
        if (isRunning) return;
        setIsRunning(true);

        // Clear previous path/visited but keep walls
        setGrid((prev) =>
            prev.map((row) =>
                row.map((node) => {
                    if (node.type === "visited" || node.type === "path") {
                        return { ...node, type: "empty" };
                    }
                    return node;
                })
            )
        );

        const queue: { row: number; col: number; dist: number }[] = [
            { row: START_NODE.row, col: START_NODE.col, dist: 0 },
        ];
        const visited = new Set<string>();
        const parent = new Map<string, string>();
        visited.add(`${START_NODE.row},${START_NODE.col}`);

        const directions = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
        ];

        let found = false;

        while (queue.length > 0) {
            const { row, col } = queue.shift()!;

            if (row === END_NODE.row && col === END_NODE.col) {
                found = true;
                break;
            }

            // Visualize visited (skip start node)
            if (!(row === START_NODE.row && col === START_NODE.col)) {
                setGrid((prev) => {
                    const newGrid = [...prev];
                    newGrid[row][col] = { ...newGrid[row][col], type: "visited" };
                    return newGrid;
                });
                await new Promise((r) => setTimeout(r, 20)); // Animation delay
            }

            for (const [dr, dc] of directions) {
                const newR = row + dr;
                const newC = col + dc;
                const key = `${newR},${newC}`;

                if (
                    newR >= 0 &&
                    newR < ROWS &&
                    newC >= 0 &&
                    newC < COLS &&
                    !visited.has(key) &&
                    grid[newR][newC].type !== "wall"
                ) {
                    visited.add(key);
                    parent.set(key, `${row},${col}`);
                    queue.push({ row: newR, col: newC, dist: 0 });
                }
            }
        }

        if (found) {
            let curr = `${END_NODE.row},${END_NODE.col}`;
            const path: { row: number; col: number }[] = [];
            while (curr !== `${START_NODE.row},${START_NODE.col}`) {
                path.push({ row: parseInt(curr.split(",")[0]), col: parseInt(curr.split(",")[1]) });
                curr = parent.get(curr)!;
            }

            // Animate path
            for (let i = path.length - 1; i >= 0; i--) {
                const { row, col } = path[i];
                if (!(row === END_NODE.row && col === END_NODE.col)) {
                    setGrid((prev) => {
                        const newGrid = [...prev];
                        newGrid[row][col] = { ...newGrid[row][col], type: "path" };
                        return newGrid;
                    });
                    await new Promise((r) => setTimeout(r, 30));
                }
            }
        }

        setIsRunning(false);
    };

    return (
        <div className="flex flex-col items-center space-y-6 w-full max-w-4xl mx-auto p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg">
            <div className="flex items-center gap-4 w-full justify-between">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold">BFS Visualizer</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-sm"></div>Start</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-sm"></div>End</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-primary rounded-sm"></div>Wall</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-400 rounded-sm"></div>Visited</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>Path</div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={runBFS} disabled={isRunning} size="sm">
                        <Play className="w-4 h-4 mr-2" /> Run BFS
                    </Button>
                    <Button onClick={resetGrid} variant="outline" disabled={isRunning} size="sm">
                        <RotateCcw className="w-4 h-4 mr-2" /> Reset
                    </Button>
                </div>
            </div>

            <div
                className="grid gap-1 bg-muted/20 p-2 rounded-lg overflow-hidden"
                style={{
                    gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
                }}
            >
                {grid.map((row, r) =>
                    row.map((node, c) => (
                        <div
                            key={`${r}-${c}`}
                            onClick={() => toggleWall(r, c)}
                            className={cn(
                                "w-6 h-6 md:w-8 md:h-8 rounded-sm cursor-pointer transition-all duration-200 border border-transparent hover:border-primary/20",
                                node.type === "empty" && "bg-background shadow-sm",
                                node.type === "wall" && "bg-primary shadow-inner scale-90",
                                node.type === "start" && "bg-green-500 shadow-lg scale-110 z-10",
                                node.type === "end" && "bg-red-500 shadow-lg scale-110 z-10",
                                node.type === "visited" && "bg-blue-400/50 animate-in fade-in zoom-in duration-300",
                                node.type === "path" && "bg-yellow-400 shadow-lg scale-105 animate-in fade-in zoom-in duration-300"
                            )}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
