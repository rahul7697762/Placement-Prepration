"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BrainstormState } from '@/types/thinkSolve';

interface BrainstormEditorProps {
    state: BrainstormState;
    onChange: (field: keyof BrainstormState, value: string) => void;
}

export function BrainstormEditor({ state, onChange }: BrainstormEditorProps) {
    return (
        <div className="space-y-6 h-full overflow-y-auto p-4">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Brainstorm</h2>
                <p className="text-sm text-muted-foreground">
                    Break down the problem before you code.
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="understanding">Problem Understanding</Label>
                    <Textarea
                        id="understanding"
                        placeholder="What is the core problem? What are the inputs and outputs?"
                        className="min-h-[120px] font-mono text-sm leading-relaxed"
                        value={state.problemUnderstanding}
                        onChange={(e) => onChange('problemUnderstanding', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="assumptions">Assumptions</Label>
                    <Textarea
                        id="assumptions"
                        placeholder="e.g., Input fits in memory, elements are unique..."
                        className="min-h-[100px] font-mono text-sm leading-relaxed"
                        value={state.assumptions}
                        onChange={(e) => onChange('assumptions', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="constraints">Constraints</Label>
                    <Textarea
                        id="constraints"
                        placeholder="Time complexity? Space complexity? n <= 10^5?"
                        className="min-h-[100px] font-mono text-sm leading-relaxed"
                        value={state.constraints}
                        onChange={(e) => onChange('constraints', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="edgeCases">Edge Cases</Label>
                    <Textarea
                        id="edgeCases"
                        placeholder="Empty input, negative numbers, max values..."
                        className="min-h-[100px] font-mono text-sm leading-relaxed"
                        value={state.edgeCases}
                        onChange={(e) => onChange('edgeCases', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
