"use client";

import { useState, useRef } from "react";
import { computerVisionData, Topic } from "./data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, BookOpen, Code2, Menu, Eye, ChevronDown, Play, RotateCcw, Layers, Cpu, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

// ─── VISUALIZATION COMPONENTS ─────────────────────────────────────────────────

/** Pixel Grid – illustrates f(x,y) as a 2-D array of intensity values */
function PixelGridViz() {
    type Channel = "rgb" | "r" | "g" | "b" | "gray";
    const [channel, setChannel] = useState<Channel>("rgb");
    const [hovered, setHovered] = useState<{ x: number; y: number } | null>(null);

    const grid = [
        [{ r: 220, g: 50, b: 50 }, { r: 230, g: 100, b: 40 }, { r: 200, g: 180, b: 40 }, { r: 60, g: 180, b: 60 }, { r: 40, g: 140, b: 210 }, { r: 80, g: 60, b: 210 }],
        [{ r: 200, g: 40, b: 80 }, { r: 240, g: 130, b: 20 }, { r: 240, g: 220, b: 30 }, { r: 30, g: 200, b: 80 }, { r: 20, g: 120, b: 220 }, { r: 100, g: 40, b: 200 }],
        [{ r: 180, g: 30, b: 100 }, { r: 220, g: 160, b: 10 }, { r: 200, g: 200, b: 30 }, { r: 20, g: 180, b: 100 }, { r: 10, g: 100, b: 200 }, { r: 120, g: 20, b: 180 }],
        [{ r: 160, g: 20, b: 120 }, { r: 200, g: 140, b: 10 }, { r: 180, g: 180, b: 20 }, { r: 10, g: 160, b: 120 }, { r: 30, g: 80, b: 180 }, { r: 140, g: 10, b: 160 }],
        [{ r: 140, g: 10, b: 140 }, { r: 180, g: 120, b: 10 }, { r: 160, g: 160, b: 10 }, { r: 10, g: 140, b: 140 }, { r: 50, g: 60, b: 160 }, { r: 160, g: 10, b: 140 }],
        [{ r: 120, g: 10, b: 160 }, { r: 160, g: 100, b: 10 }, { r: 140, g: 140, b: 10 }, { r: 10, g: 120, b: 160 }, { r: 70, g: 40, b: 140 }, { r: 180, g: 10, b: 120 }],
    ];

    const getColor = (p: { r: number; g: number; b: number }) => {
        const g = Math.round(0.299 * p.r + 0.587 * p.g + 0.114 * p.b);
        if (channel === "rgb") return `rgb(${p.r},${p.g},${p.b})`;
        if (channel === "r") return `rgb(${p.r},0,0)`;
        if (channel === "g") return `rgb(0,${p.g},0)`;
        if (channel === "b") return `rgb(0,0,${p.b})`;
        return `rgb(${g},${g},${g})`;
    };

    const getValue = (p: { r: number; g: number; b: number }) => {
        if (channel === "r") return p.r;
        if (channel === "g") return p.g;
        if (channel === "b") return p.b;
        return Math.round(0.299 * p.r + 0.587 * p.g + 0.114 * p.b);
    };

    const hp = hovered ? grid[hovered.y][hovered.x] : null;
    const CELL = 56;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {(["rgb", "r", "g", "b", "gray"] as Channel[]).map((c) => (
                    <button key={c} onClick={() => setChannel(c)}
                        className={cn("px-3 py-1 rounded text-xs font-mono font-bold uppercase border transition-all",
                            channel === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary")}>
                        {c}
                    </button>
                ))}
            </div>

            <div className="flex gap-6 flex-wrap">
                {/* Grid */}
                <div className="relative">
                    <svg width={grid[0].length * CELL + 1} height={grid.length * CELL + 1}>
                        {grid.map((row, y) =>
                            row.map((p, x) => {
                                const isHov = hovered?.x === x && hovered?.y === y;
                                return (
                                    <g key={`${x}-${y}`} onMouseEnter={() => setHovered({ x, y })} onMouseLeave={() => setHovered(null)}>
                                        <rect x={x * CELL} y={y * CELL} width={CELL} height={CELL}
                                            fill={getColor(p)} stroke={isHov ? "white" : "rgba(255,255,255,0.15)"} strokeWidth={isHov ? 2 : 1} />
                                        {channel !== "rgb" && (
                                            <text x={x * CELL + CELL / 2} y={y * CELL + CELL / 2 + 4}
                                                textAnchor="middle" fontSize="11" fontFamily="monospace"
                                                fill={getValue(p) > 120 ? "#000" : "#fff"} fontWeight="bold">
                                                {getValue(p)}
                                            </text>
                                        )}
                                        {/* coord labels */}
                                        <text x={x * CELL + 3} y={y * CELL + 11} fontSize="8" fill="rgba(255,255,255,0.5)" fontFamily="monospace">
                                            ({x},{y})
                                        </text>
                                    </g>
                                );
                            })
                        )}
                    </svg>
                </div>

                {/* Info panel */}
                <div className="flex flex-col gap-3 min-w-[160px]">
                    <div className="bg-muted/50 rounded-lg p-3 text-xs font-mono space-y-1">
                        <div className="text-muted-foreground font-bold mb-2">f(x, y)</div>
                        {hp ? (
                            <>
                                <div>x = {hovered!.x}, y = {hovered!.y}</div>
                                <div className="text-red-400">R = {hp.r}</div>
                                <div className="text-green-400">G = {hp.g}</div>
                                <div className="text-blue-400">B = {hp.b}</div>
                                <div className="text-muted-foreground">Gray = {Math.round(0.299 * hp.r + 0.587 * hp.g + 0.114 * hp.b)}</div>
                                <div className="mt-2 w-8 h-8 rounded" style={{ background: `rgb(${hp.r},${hp.g},${hp.b})` }} />
                            </>
                        ) : (
                            <div className="text-muted-foreground italic">hover a pixel</div>
                        )}
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 text-xs space-y-1">
                        <div className="font-semibold text-primary mb-1">Image = 2D Array</div>
                        <div className="text-muted-foreground">Size: {grid[0].length} × {grid.length}</div>
                        <div className="text-muted-foreground">Channels: 3 (RGB)</div>
                        <div className="text-muted-foreground">Depth: 8-bit</div>
                        <div className="text-muted-foreground">Values: 0–255</div>
                    </div>
                </div>
            </div>
            <p className="text-xs text-muted-foreground">
                A digital image is a 2D function <code className="bg-muted px-1 rounded">f(x,y)</code> — toggle channels to see how each stores intensity values independently.
            </p>
        </div>
    );
}

/** Intensity Transform – plots transform curves + interactive gamma slider */
function IntensityTransformViz() {
    const [gamma, setGamma] = useState(1.0);
    const W = 280, H = 200;

    const curves: { label: string; color: string; fn: (r: number) => number }[] = [
        { label: "Identity (γ=1)", color: "#888", fn: (r) => r },
        { label: "Negative", color: "#f87171", fn: (r) => 255 - r },
        { label: "Log (c·log(1+r))", color: "#34d399", fn: (r) => Math.min(255, (255 / Math.log(256)) * Math.log(1 + r)) },
        { label: `Gamma γ=${gamma.toFixed(1)}`, color: "#a78bfa", fn: (r) => Math.min(255, 255 * Math.pow(r / 255, gamma)) },
    ];

    const toSvg = (r: number, val: number) => `${(r / 255) * W},${H - (val / 255) * H}`;

    const pathFor = (fn: (r: number) => number) => {
        const pts = Array.from({ length: 64 }, (_, i) => {
            const r = (i / 63) * 255;
            return toSvg(r, fn(r));
        });
        return `M ${pts.join(" L ")}`;
    };

    return (
        <div className="space-y-4">
            <svg width={W} height={H} className="bg-muted/20 rounded-lg border border-border/50 overflow-visible">
                {/* Grid */}
                {[0, 64, 128, 192, 255].map((v) => (
                    <g key={v}>
                        <line x1={(v / 255) * W} y1={0} x2={(v / 255) * W} y2={H} stroke="rgba(255,255,255,0.06)" />
                        <line x1={0} y1={H - (v / 255) * H} x2={W} y2={H - (v / 255) * H} stroke="rgba(255,255,255,0.06)" />
                    </g>
                ))}
                {/* Curves */}
                {curves.map((c) => (
                    <path key={c.label} d={pathFor(c.fn)} fill="none" stroke={c.color} strokeWidth={c.label.startsWith("Gamma") ? 2.5 : 1.5} strokeLinecap="round" />
                ))}
                {/* Axis labels */}
                <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="10" fill="#888" fontFamily="monospace">Input r</text>
                <text x={6} y={H / 2} textAnchor="middle" fontSize="10" fill="#888" fontFamily="monospace" transform={`rotate(-90, 6, ${H / 2})`}>Output s</text>
            </svg>

            {/* Gamma slider */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-muted-foreground">
                    <span>γ = {gamma.toFixed(2)}</span>
                    <span className="text-purple-400">{gamma < 1 ? "Brightening (γ < 1)" : gamma > 1 ? "Darkening (γ > 1)" : "Identity (γ = 1)"}</span>
                </div>
                <input type="range" min={0.1} max={3.0} step={0.05} value={gamma}
                    onChange={(e) => setGamma(parseFloat(e.target.value))}
                    className="w-full accent-purple-500" />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.1 (bright)</span><span>1.0</span><span>3.0 (dark)</span>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3">
                {curves.map((c) => (
                    <div key={c.label} className="flex items-center gap-1.5 text-xs">
                        <div className="w-4 h-0.5 rounded" style={{ background: c.color }} />
                        <span className="text-muted-foreground">{c.label}</span>
                    </div>
                ))}
            </div>

            {/* Gamma preview strip */}
            <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-mono">Live γ correction preview:</p>
                <div className="flex gap-0.5">
                    {Array.from({ length: 40 }, (_, i) => {
                        const r = (i / 39) * 255;
                        const out = Math.min(255, 255 * Math.pow(r / 255, gamma));
                        return <div key={i} className="flex-1 h-8 rounded-sm" style={{ background: `rgb(${out},${out},${out})` }} />;
                    })}
                </div>
            </div>
        </div>
    );
}

/** Convolution Visualizer – animated kernel sliding over a pixel matrix */
function ConvolutionViz() {
    type KernelKey = "blur" | "sharpen" | "edge";
    const KERNELS: Record<KernelKey, { label: string; k: number[][]; color: string }> = {
        blur: { label: "Box Blur (Mean)", color: "#34d399", k: [[1, 1, 1], [1, 1, 1], [1, 1, 1]] },
        sharpen: { label: "Sharpen", color: "#fbbf24", k: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]] },
        edge: { label: "Edge Detect (Laplacian)", color: "#f87171", k: [[0, -1, 0], [-1, 4, -1], [0, -1, 0]] },
    };

    const INPUT = [
        [10, 20, 30, 40, 50, 60, 70],
        [15, 25, 35, 45, 55, 65, 75],
        [20, 40, 80, 100, 80, 40, 20],
        [25, 50, 100, 200, 100, 50, 25],
        [20, 40, 80, 100, 80, 40, 20],
        [15, 25, 35, 45, 55, 65, 75],
        [10, 20, 30, 40, 50, 60, 70],
    ];

    const [kType, setKType] = useState<KernelKey>("blur");
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [playing, setPlaying] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const maxX = INPUT[0].length - 3;
    const maxY = INPUT.length - 3;

    const advance = (p: { x: number; y: number }) => {
        const nx = p.x + 1 > maxX ? 0 : p.x + 1;
        const ny = nx === 0 ? (p.y + 1 > maxY ? 0 : p.y + 1) : p.y;
        return { x: nx, y: ny };
    };

    const togglePlay = () => {
        if (playing) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setPlaying(false);
        } else {
            setPlaying(true);
            intervalRef.current = setInterval(() => {
                setPos((p) => advance(p));
            }, 400);
        }
    };

    const reset = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setPlaying(false);
        setPos({ x: 0, y: 0 });
    };

    // Compute output value at current position
    const kern = KERNELS[kType];
    const divisor = kType === "blur" ? 9 : 1;
    let sum = 0;
    for (let dy = 0; dy < 3; dy++)
        for (let dx = 0; dx < 3; dx++)
            sum += INPUT[pos.y + dy][pos.x + dx] * kern.k[dy][dx];
    const outputVal = Math.max(0, Math.min(255, Math.round(sum / divisor)));

    const CELL = 40;

    return (
        <div className="space-y-4">
            {/* Kernel selector */}
            <div className="flex flex-wrap gap-2">
                {(Object.keys(KERNELS) as KernelKey[]).map((k) => (
                    <button key={k} onClick={() => { setKType(k); reset(); }}
                        className={cn("px-3 py-1 rounded text-xs font-mono border transition-all",
                            kType === k ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary")}>
                        {KERNELS[k].label}
                    </button>
                ))}
            </div>

            <div className="flex gap-6 flex-wrap">
                {/* Input grid */}
                <div>
                    <p className="text-xs font-mono text-muted-foreground mb-1">Input f(x,y)</p>
                    <svg width={INPUT[0].length * CELL + 1} height={INPUT.length * CELL + 1}>
                        {INPUT.map((row, y) => row.map((v, x) => {
                            const isActive = x >= pos.x && x < pos.x + 3 && y >= pos.y && y < pos.y + 3;
                            const brightness = Math.round((v / 255) * 220);
                            return (
                                <g key={`${x}-${y}`}>
                                    <rect x={x * CELL} y={y * CELL} width={CELL} height={CELL}
                                        fill={isActive ? kern.color + "40" : `rgb(${brightness},${brightness},${brightness + 20})`}
                                        stroke={isActive ? kern.color : "rgba(255,255,255,0.1)"} strokeWidth={isActive ? 2 : 1} />
                                    <text x={x * CELL + CELL / 2} y={y * CELL + CELL / 2 + 4}
                                        textAnchor="middle" fontSize="10" fontFamily="monospace"
                                        fill={isActive ? kern.color : (v > 100 ? "#000" : "#fff")} fontWeight={isActive ? "bold" : "normal"}>
                                        {v}
                                    </text>
                                </g>
                            );
                        }))}
                    </svg>
                </div>

                {/* Kernel */}
                <div>
                    <p className="text-xs font-mono text-muted-foreground mb-1">Kernel w</p>
                    <svg width={3 * CELL + 1} height={3 * CELL + 1}>
                        {kern.k.map((row, y) => row.map((v, x) => (
                            <g key={`${x}-${y}`}>
                                <rect x={x * CELL} y={y * CELL} width={CELL} height={CELL}
                                    fill={v > 0 ? "rgba(168,85,247,0.2)" : v < 0 ? "rgba(248,113,113,0.2)" : "rgba(255,255,255,0.05)"}
                                    stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                                <text x={x * CELL + CELL / 2} y={y * CELL + CELL / 2 + 4}
                                    textAnchor="middle" fontSize="12" fontFamily="monospace"
                                    fill={v > 0 ? "#a78bfa" : v < 0 ? "#f87171" : "#888"} fontWeight="bold">
                                    {v}
                                </text>
                            </g>
                        )))}
                    </svg>
                    {kType === "blur" && <p className="text-xs text-muted-foreground mt-1 font-mono">÷ 9</p>}
                </div>

                {/* Output */}
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-mono text-muted-foreground">Output at ({pos.x + 1},{pos.y + 1})</p>
                    <div className="w-[3.5rem] h-[3.5rem] rounded-lg border-2 flex items-center justify-center text-xl font-bold font-mono"
                        style={{ borderColor: kern.color, color: kern.color, background: kern.color + "15" }}>
                        {outputVal}
                    </div>
                    <div className="w-[3.5rem] h-[3.5rem] rounded-lg" style={{ background: `rgb(${outputVal},${outputVal},${outputVal + 20})` }} />
                    <p className="text-xs text-muted-foreground font-mono">gray value</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={togglePlay} className="gap-1.5">
                    <Play className="h-3 w-3" />{playing ? "Pause" : "Animate"}
                </Button>
                <Button size="sm" variant="ghost" onClick={reset} className="gap-1.5">
                    <RotateCcw className="h-3 w-3" />Reset
                </Button>
                <span className="text-xs font-mono text-muted-foreground self-center">
                    pos: ({pos.x},{pos.y})
                </span>
            </div>
        </div>
    );
}

/** Edge Detection pipeline – step-by-step Canny visualization */
function EdgeDetectionViz() {
    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        {
            label: "1. Gaussian Blur",
            color: "#34d399",
            icon: "🔵",
            desc: "Apply Gaussian filter to reduce noise. Prevents false edges from small intensity fluctuations.",
            formula: "G(x,y) = (1/2πσ²) · e^(-(x²+y²)/2σ²)",
        },
        {
            label: "2. Gradient Magnitude",
            color: "#fbbf24",
            icon: "📐",
            desc: "Compute image gradient using Sobel operators in X and Y directions.",
            formula: "|∇f| = √(Gₓ² + Gᵧ²),  θ = atan2(Gᵧ, Gₓ)",
        },
        {
            label: "3. Non-Max Suppression",
            color: "#a78bfa",
            icon: "✂️",
            desc: "Thin edges: keep only local maxima along gradient direction, zero everything else.",
            formula: "If |∇f(x,y)| < neighbors along θ → set to 0",
        },
        {
            label: "4. Double Threshold",
            color: "#f97316",
            icon: "🎚️",
            desc: "Classify pixels as strong edges (> T_high), weak edges (T_low–T_high), or suppressed (< T_low).",
            formula: "Strong if M > T_high | Weak if T_low < M ≤ T_high | None if M < T_low",
        },
        {
            label: "5. Edge Tracking (Hysteresis)",
            color: "#f87171",
            icon: "🔗",
            desc: "Keep weak edges only if connected to strong edges. Eliminates isolated noise responses.",
            formula: "Weak pixel → Edge if 8-connected to any Strong pixel",
        },
    ];

    // Simple grid demo per step
    const grids: number[][][] = [
        [[200, 200, 200], [200, 10, 10], [200, 10, 10]],   // original
        [[180, 180, 180], [180, 40, 20], [180, 40, 20]],   // blurred
        [[0, 0, 170], [0, 160, 0], [0, 140, 0]],            // gradient
        [[0, 0, 170], [0, 160, 0], [0, 0, 0]],              // NMS
        [[0, 0, 255], [0, 255, 0], [0, 0, 0]],              // final
    ];

    const CELL = 40;
    const grid = grids[activeStep];

    return (
        <div className="space-y-4">
            {/* Pipeline */}
            <div className="flex flex-wrap gap-2">
                {steps.map((s, i) => (
                    <button key={i} onClick={() => setActiveStep(i)}
                        className={cn("px-3 py-1.5 rounded-lg text-xs font-mono border transition-all text-left",
                            activeStep === i ? "text-black font-bold" : "border-border text-muted-foreground hover:text-foreground")}
                        style={activeStep === i ? { background: s.color, borderColor: s.color } : {}}>
                        {s.icon} {s.label}
                    </button>
                ))}
            </div>

            <div className="flex gap-6 flex-wrap">
                {/* Grid demo */}
                <div>
                    <p className="text-xs font-mono text-muted-foreground mb-2">Pixel matrix after step:</p>
                    <svg width={grid[0].length * CELL + 1} height={grid.length * CELL + 1}>
                        {grid.map((row, y) => row.map((v, x) => (
                            <g key={`${x}-${y}`}>
                                <rect x={x * CELL} y={y * CELL} width={CELL} height={CELL}
                                    fill={`rgb(${v},${v},${v})`} stroke="rgba(255,255,255,0.1)" />
                                <text x={x * CELL + CELL / 2} y={y * CELL + CELL / 2 + 4}
                                    textAnchor="middle" fontSize="10" fontFamily="monospace" fill={v > 100 ? "#000" : "#fff"}>
                                    {v}
                                </text>
                            </g>
                        )))}
                    </svg>
                </div>

                {/* Step info */}
                <div className="flex-1 min-w-[220px] space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: steps[activeStep].color }} />
                        <span className="font-semibold">{steps[activeStep].label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{steps[activeStep].desc}</p>
                    <code className="block text-xs bg-muted/50 p-3 rounded font-mono text-green-400">
                        {steps[activeStep].formula}
                    </code>
                </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-1">
                {steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full transition-all" style={{ background: i <= activeStep ? s.color : "#333" }} />
                        {i < steps.length - 1 && <div className="w-6 h-0.5 rounded" style={{ background: i < activeStep ? "#555" : "#222" }} />}
                    </div>
                ))}
                <span className="text-xs text-muted-foreground ml-2 font-mono">Step {activeStep + 1}/5</span>
            </div>
        </div>
    );
}

/** CNN Architecture – interactive layer diagram */
function CNNViz() {
    const [active, setActive] = useState<number | null>(null);
    const layers = [
        { label: "Input", sub: "224×224×3", color: "#38bdf8", shape: [32, 44, 3], desc: "Raw RGB image. Each of the 3 channels (R, G, B) is a 224×224 matrix of pixel intensities (0–255)." },
        { label: "Conv1", sub: "64 filters 3×3", color: "#34d399", shape: [28, 38, 8], desc: "64 learnable 3×3 filters slide across the image producing 64 feature maps. Detects low-level features: edges, colors, gradients." },
        { label: "ReLU", sub: "non-linearity", color: "#a78bfa", shape: [28, 38, 8], desc: "ReLU(x) = max(0, x). Introduces non-linearity by zeroing negative activations, enabling the network to learn complex patterns." },
        { label: "MaxPool", sub: "2×2 stride 2", color: "#fbbf24", shape: [20, 28, 8], desc: "Downsamples feature maps by taking the maximum in each 2×2 window. Halves spatial dimensions, reducing computation and adding translation invariance." },
        { label: "Conv2", sub: "128 filters 3×3", color: "#34d399", shape: [16, 22, 12], desc: "Deeper convolutional layer with 128 filters. Learns higher-level patterns: corners, textures, object parts." },
        { label: "MaxPool", sub: "2×2 stride 2", color: "#fbbf24", shape: [12, 16, 12], desc: "Second pooling layer. Further reduces spatial dimensions, increasing the receptive field of each neuron." },
        { label: "Flatten", sub: "→ 1D vector", color: "#f97316", shape: [44, 6, 1], desc: "Unrolls 3D feature maps into a 1D vector to feed into fully connected layers. No learnable parameters." },
        { label: "FC + Softmax", sub: "N classes", color: "#f87171", shape: [44, 12, 1], desc: "Fully connected layers combine all features. Final Softmax converts raw scores to class probabilities summing to 1." },
    ];

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto pb-2">
                <div className="flex items-end gap-1 min-w-max">
                    {layers.map((l, i) => {
                        const isActive = active === i;
                        const [w, h, d] = l.shape;
                        return (
                            <div key={i} className="flex flex-col items-center gap-1 cursor-pointer group" onClick={() => setActive(isActive ? null : i)}>
                                {/* 3D-ish block */}
                                <div className="relative transition-transform group-hover:-translate-y-1" style={{ marginTop: 8 }}>
                                    {/* depth faces */}
                                    {Array.from({ length: Math.min(d, 3) }).map((_, di) => (
                                        <div key={di} className="absolute rounded-sm border transition-all"
                                            style={{
                                                width: w, height: h,
                                                top: -di * 2, left: di * 2,
                                                background: isActive ? l.color + "60" : l.color + "25",
                                                borderColor: isActive ? l.color : l.color + "80",
                                                zIndex: d - di,
                                            }} />
                                    ))}
                                    {/* front face */}
                                    <div className="relative rounded-sm border-2 flex items-center justify-center transition-all"
                                        style={{
                                            width: w, height: h, zIndex: d + 1,
                                            background: isActive ? l.color + "40" : l.color + "18",
                                            borderColor: l.color,
                                            boxShadow: isActive ? `0 0 12px ${l.color}60` : "none",
                                        }}>
                                    </div>
                                </div>
                                <span className="text-xs font-mono font-bold" style={{ color: l.color }}>{l.label}</span>
                                <span className="text-[10px] text-muted-foreground font-mono">{l.sub}</span>
                                {/* arrow */}
                                {i < layers.length - 1 && (
                                    <div className="text-muted-foreground text-xs self-end mb-6 translate-y-[-24px] translate-x-[4px]">→</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Detail panel */}
            <AnimatePresence mode="wait">
                {active !== null && (
                    <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className="rounded-xl border p-4 space-y-1" style={{ borderColor: layers[active].color + "60", background: layers[active].color + "08" }}>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: layers[active].color }} />
                            <span className="font-semibold text-sm">{layers[active].label}</span>
                            <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono text-muted-foreground">{layers[active].sub}</code>
                        </div>
                        <p className="text-sm text-muted-foreground">{layers[active].desc}</p>
                    </motion.div>
                )}
                {active === null && (
                    <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground italic">
                        Click any layer block above to learn more about it.
                    </motion.p>
                )}
            </AnimatePresence>

            {/* Legend */}
            <div className="flex flex-wrap gap-3">
                {[{ c: "#34d399", l: "Convolutional" }, { c: "#fbbf24", l: "Pooling" }, { c: "#a78bfa", l: "Activation" }, { c: "#f97316", l: "Reshape" }, { c: "#f87171", l: "Classifier" }].map((x) => (
                    <div key={x.l} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="w-3 h-3 rounded-sm" style={{ background: x.c + "40", border: `1.5px solid ${x.c}` }} />
                        {x.l}
                    </div>
                ))}
            </div>
        </div>
    );
}

/** Corner Detection – Harris response map visualization */
function CornerDetectionViz() {
    const [showR, setShowR] = useState(true);
    const labels = [
        ["Flat", "Flat", "Flat", "Flat", "Flat"],
        ["Flat", "Edge", "Edge", "Edge", "Flat"],
        ["Flat", "Edge", "Corner", "Edge", "Flat"],
        ["Flat", "Edge", "Edge", "Edge", "Flat"],
        ["Flat", "Flat", "Flat", "Flat", "Flat"],
    ];
    const R = [
        [-0.02, -0.01, 0.00, -0.01, -0.02],
        [-0.01, -0.20, -0.30, -0.20, -0.01],
        [0.00, -0.30, 0.85, -0.30, 0.00],
        [-0.01, -0.20, -0.30, -0.20, -0.01],
        [-0.02, -0.01, 0.00, -0.01, -0.02],
    ];
    const CELL = 62;
    const getColor = (r: number) => {
        if (r > 0.3) return "#f87171"; // corner: red
        if (r < -0.1) return "#60a5fa"; // edge: blue
        return "#374151"; // flat: gray
    };
    const getLabel = (r: number) => r > 0.3 ? "Corner" : r < -0.1 ? "Edge" : "Flat";

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <button onClick={() => setShowR(false)} className={cn("px-3 py-1 rounded text-xs font-mono border", !showR ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground")}>
                    Region Labels
                </button>
                <button onClick={() => setShowR(true)} className={cn("px-3 py-1 rounded text-xs font-mono border", showR ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground")}>
                    Harris R values
                </button>
            </div>

            <div className="flex gap-6 flex-wrap">
                <div>
                    <p className="text-xs font-mono text-muted-foreground mb-2">Harris Response Map</p>
                    <svg width={5 * CELL + 1} height={5 * CELL + 1}>
                        {R.map((row, y) => row.map((v, x) => {
                            const c = getColor(v);
                            return (
                                <g key={`${x}-${y}`}>
                                    <rect x={x * CELL} y={y * CELL} width={CELL} height={CELL}
                                        fill={c + "40"} stroke={c} strokeWidth={1.5} />
                                    <text x={x * CELL + CELL / 2} y={y * CELL + CELL / 2 - 4}
                                        textAnchor="middle" fontSize="10" fontFamily="monospace" fill={c} fontWeight="bold">
                                        {showR ? v.toFixed(2) : labels[y][x]}
                                    </text>
                                    {!showR && (
                                        <text x={x * CELL + CELL / 2} y={y * CELL + CELL / 2 + 10}
                                            textAnchor="middle" fontSize="9" fontFamily="monospace" fill={c + "cc"}>
                                            R={v.toFixed(2)}
                                        </text>
                                    )}
                                </g>
                            );
                        }))}
                    </svg>
                </div>

                <div className="space-y-3">
                    <div className="space-y-2 text-xs font-mono">
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{ background: "#374151", border: "1.5px solid #6b7280" }} /><span className="text-muted-foreground">Flat: λ₁ ≈ λ₂ ≈ 0, R ≈ 0</span></div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{ background: "#1d3a5c", border: "1.5px solid #60a5fa" }} /><span className="text-blue-400">Edge: λ₁ ≫ λ₂, R &lt; 0</span></div>
                        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{ background: "#5c1d1d", border: "1.5px solid #f87171" }} /><span className="text-red-400">Corner: λ₁ ≈ λ₂ ≫ 0, R &gt; 0</span></div>
                    </div>
                    <div className="bg-muted/30 rounded p-3 text-xs font-mono space-y-1">
                        <div className="text-muted-foreground">R = det(M) − k·trace(M)²</div>
                        <div className="text-muted-foreground">k ≈ 0.04–0.06</div>
                        <div className="text-primary mt-1">det(M) = λ₁·λ₂</div>
                        <div className="text-primary">trace(M) = λ₁+λ₂</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/** Generic "No Visualization" placeholder */
function DefaultViz({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
            <div className="text-5xl opacity-30">📊</div>
            <p className="text-sm font-mono">Interactive visualization coming soon for <strong>{title}</strong>.</p>
            <p className="text-xs">Check the <strong>Concept</strong> and <strong>Code</strong> tabs above for detailed content.</p>
        </div>
    );
}

// ─── TOPIC → VISUALIZATION MAP ─────────────────────────────────────────────────
const vizMap: Record<string, React.FC> = {
    "image-formation": PixelGridViz,
    "intensity-transforms": IntensityTransformViz,
    "spatial-filtering": ConvolutionViz,
    "edge-detection": EdgeDetectionViz,
    "corner-detection": CornerDetectionViz,
    "cnn-fundamentals": CNNViz,
};

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function ComputerVisionPage() {
    const [selectedTopic, setSelectedTopic] = useState<Topic>(computerVisionData[0].topics[0]);
    const [selectedUnitId, setSelectedUnitId] = useState<string>(computerVisionData[0].id);
    const [tab, setTab] = useState<"concept" | "code" | "viz">("concept");
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

    const VizComponent = vizMap[selectedTopic.id] ?? (() => <DefaultViz title={selectedTopic.title} />);

    const selectTopic = (topic: Topic, unitId: string) => {
        setSelectedTopic(topic);
        setSelectedUnitId(unitId);
        setTab("concept");
    };

    const toggleSection = (id: string) =>
        setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

    const SidebarContent = () => (
        <div className="py-4 flex flex-col h-full">
            <div className="px-5 pb-4 border-b border-border/50">
                <div className="flex items-center gap-2 mb-1">
                    <Eye className="h-4 w-4 text-primary" />
                    <h2 className="text-base font-bold">Computer Vision</h2>
                </div>
                <p className="text-xs text-muted-foreground">Complete Roadmap · {computerVisionData.reduce((a, u) => a + u.topics.length, 0)} topics</p>
            </div>
            <ScrollArea className="flex-1 px-3 pt-3">
                <div className="space-y-2 pb-6">
                    {computerVisionData.map((unit, ui) => {
                        const isOpen = !collapsed[unit.id];
                        return (
                            <div key={unit.id} className="rounded-lg border border-border/40 overflow-hidden">
                                <button
                                    onClick={() => toggleSection(unit.id)}
                                    className="w-full flex items-center justify-between px-3 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                            {String(ui + 1).padStart(2, "0")}
                                        </span>
                                        <span className="text-xs font-semibold">{unit.title.replace(/^Section \d+: /, "")}</span>
                                    </div>
                                    <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform", isOpen ? "rotate-180" : "")} />
                                </button>
                                {isOpen && (
                                    <div className="px-2 py-1 space-y-0.5">
                                        {unit.topics.map((topic) => {
                                            const isSelected = selectedTopic.id === topic.id;
                                            const hasViz = !!vizMap[topic.id];
                                            return (
                                                <button
                                                    key={topic.id}
                                                    onClick={() => selectTopic(topic, unit.id)}
                                                    className={cn(
                                                        "w-full text-left px-2 py-2 rounded-md text-xs flex items-center gap-2 transition-all",
                                                        isSelected
                                                            ? "bg-primary/15 text-primary font-semibold"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                                    )}
                                                >
                                                    {isSelected ? (
                                                        <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                                                    ) : (
                                                        <ChevronRight className="h-3 w-3 shrink-0 opacity-40" />
                                                    )}
                                                    <span className="flex-1 truncate">{topic.title}</span>
                                                    {hasViz && (
                                                        <span className="text-[8px] px-1 py-0.5 rounded bg-primary/10 text-primary font-mono shrink-0">VIZ</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );

    const tabIcons = { concept: BookOpen, code: Code2, viz: Layers };
    const tabLabels = { concept: "Concept", code: "Code", viz: "Visualize" };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-72 border-r bg-card/30 shrink-0">
                <SidebarContent />
            </aside>

            {/* Mobile Sheet */}
            <div className="md:hidden fixed top-20 left-4 z-50">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="h-9 w-9 shadow-lg">
                            <Menu className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main content */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-6 py-8 md:px-10 md:py-10">

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 font-mono flex-wrap">
                        <Eye className="h-3 w-3" />
                        <span>Computer Vision</span>
                        <ChevronRight className="h-3 w-3" />
                        <span>{selectedUnitId.replace("section-", "Unit ")}</span>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-foreground font-semibold">{selectedTopic.title}</span>
                    </div>

                    {/* Hero */}
                    <AnimatePresence mode="wait">
                        <motion.div key={selectedTopic.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                            <div className="flex items-start gap-3 mb-2">
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{selectedTopic.title}</h1>
                                {vizMap[selectedTopic.id] && (
                                    <span className="mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-mono font-bold shrink-0">
                                        Interactive
                                    </span>
                                )}
                            </div>
                            <p className="text-muted-foreground mb-6">{selectedTopic.description}</p>

                            {/* Tabs */}
                            <div className="flex gap-1 p-1 bg-muted/40 rounded-lg w-fit mb-6">
                                {(["concept", "code", "viz"] as const).map((t) => {
                                    const Icon = tabIcons[t];
                                    const disabled = t === "code" && !selectedTopic.codeExample;
                                    return (
                                        <button key={t} disabled={disabled} onClick={() => setTab(t)}
                                            className={cn(
                                                "flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all",
                                                tab === t ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground",
                                                disabled && "opacity-30 cursor-not-allowed"
                                            )}>
                                            <Icon className="h-4 w-4" />
                                            {tabLabels[t]}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Tab content */}
                            <AnimatePresence mode="wait">
                                {tab === "concept" && (
                                    <motion.div key="concept" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="flex items-center gap-2 text-base">
                                                    <BookOpen className="h-4 w-4 text-primary" />
                                                    Concept
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-muted prose-code:bg-muted prose-code:px-1 prose-code:rounded">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedTopic.details}</ReactMarkdown>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}

                                {tab === "code" && selectedTopic.codeExample && (
                                    <motion.div key="code" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="flex items-center gap-2 text-base">
                                                    <Code2 className="h-4 w-4 text-primary" />
                                                    Implementation
                                                    <span className="text-xs font-normal text-muted-foreground font-mono ml-2">Python / OpenCV</span>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <div className="rounded-b-lg overflow-hidden">
                                                    <SyntaxHighlighter language="python" style={vscDarkPlus}
                                                        customStyle={{ margin: 0, borderRadius: 0, fontSize: "12px" }} showLineNumbers>
                                                        {selectedTopic.codeExample.trim()}
                                                    </SyntaxHighlighter>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}

                                {tab === "viz" && (
                                    <motion.div key="viz" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="flex items-center gap-2 text-base">
                                                    <Zap className="h-4 w-4 text-primary" />
                                                    Interactive Visualization
                                                    <span className="text-xs font-normal text-muted-foreground font-mono ml-2">{selectedTopic.title}</span>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <VizComponent />
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
