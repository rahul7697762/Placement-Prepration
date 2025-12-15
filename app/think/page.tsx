"use client";

import React, { useState } from 'react';
import { BrainstormEditor } from './components/BrainstormEditor';
import { SketchCanvas } from './components/SketchCanvas';
import { SharePanel } from './components/SharePanel';
import { BrainstormState } from '@/types/thinkSolve';
import { Button } from '@/components/ui/button';
import { Save, Layout, Columns } from 'lucide-react';
import { saveAs } from 'file-saver';

export default function ThinkPage() {
    const [brainstormState, setBrainstormState] = useState<BrainstormState>({
        problemUnderstanding: '',
        assumptions: '',
        constraints: '',
        edgeCases: '',
    });

    const handleBrainstormChange = (field: keyof BrainstormState, value: string) => {
        setBrainstormState(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const [leftOpen, setLeftOpen] = useState(true);
    const [rightOpen, setRightOpen] = useState(true);

    const handleSaveSession = () => {
        const sessionData = {
            brainstorm: brainstormState,
            timestamp: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: "application/json" });
        saveAs(blob, "think-session.json");
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
            {/* Toolbar */}
            <div className="h-14 border-b flex items-center justify-between px-4 bg-card">
                <div className="flex items-center gap-2">
                    <h1 className="font-semibold text-lg">Think & Solve Workspace</h1>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">Beta</span>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setLeftOpen(!leftOpen)} title="Toggle Brainstorm">
                        <Layout className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setRightOpen(!rightOpen)} title="Toggle Comments">
                        <Columns className="h-4 w-4" />
                    </Button>
                    <div className="h-4 w-px bg-border mx-2" />
                    <Button size="sm" className="gap-2" onClick={handleSaveSession}>
                        <Save className="h-4 w-4" />
                        Save Session
                    </Button>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left: Brainstorm */}
                <div
                    className={`border-r bg-card transition-all duration-300 ease-in-out ${leftOpen ? 'w-80 md:w-96 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}
                >
                    <div className="w-80 md:w-96 h-full">
                        <BrainstormEditor state={brainstormState} onChange={handleBrainstormChange} />
                    </div>
                </div>

                {/* Center: Sketch */}
                <div className="flex-1 bg-slate-50 dark:bg-slate-950 relative overflow-hidden p-4">
                    <SketchCanvas />
                </div>

                {/* Right: Share/Comments */}
                <div
                    className={`border-l bg-card transition-all duration-300 ease-in-out ${rightOpen ? 'w-72 md:w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}
                >
                    <div className="w-72 md:w-80 h-full">
                        <SharePanel />
                    </div>
                </div>

            </div>
        </div>
    );
}
