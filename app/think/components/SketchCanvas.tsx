"use client";

import React, { useCallback } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    BackgroundVariant,
    Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Plus, Square, Circle, Diamond } from 'lucide-react';

interface SketchCanvasProps {
    initialNodes?: Node[];
    initialEdges?: Edge[];
    onNodesChange?: (nodes: Node[]) => void;
    onEdgesChange?: (edges: Edge[]) => void;
}

const initialNodesData: Node[] = [
    { id: '1', position: { x: 250, y: 100 }, data: { label: 'Start' }, type: 'input' },
    { id: '2', position: { x: 250, y: 200 }, data: { label: 'Process Step' } },
];

const initialEdgesData: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
];

export function SketchCanvas({
    initialNodes = initialNodesData,
    initialEdges = initialEdgesData,
    onNodesChange: notifyNodesChange,
    onEdgesChange: notifyEdgesChange
}: SketchCanvasProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const addNode = (type: string, label: string) => {
        const newNode: Node = {
            id: Math.random().toString(),
            type,
            position: { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 },
            data: { label },
        };
        setNodes((nds) => [...nds, newNode]);
    };

    // Notify parent of changes (simplified for now)
    React.useEffect(() => {
        notifyNodesChange?.(nodes);
    }, [nodes, notifyNodesChange]);

    React.useEffect(() => {
        notifyEdgesChange?.(edges);
    }, [edges, notifyEdgesChange]);

    return (
        <div className="h-full w-full bg-slate-50 dark:bg-slate-900 border rounded-xl overflow-hidden relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Controls />
                <MiniMap />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

                <Panel position="top-left" className="bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-sm flex gap-2">
                    <Button size="icon" variant="outline" onClick={() => addNode('default', 'Step')} title="Add Step">
                        <Square className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => addNode('input', 'Start/End')} title="Add Input/Output">
                        <Circle className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => addNode('output', 'Decision')} title="Add Decision">
                        <Diamond className="h-4 w-4" />
                    </Button>
                </Panel>
            </ReactFlow>
        </div>
    );
}
