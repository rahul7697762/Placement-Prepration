
export type NodeType = 'process' | 'decision' | 'input' | 'data';

export interface BrainstormState {
    problemUnderstanding: string;
    assumptions: string;
    constraints: string;
    edgeCases: string;
}

export interface Comment {
    id: string;
    author: string;
    content: string;
    timestamp: number;
    reactions: Record<string, number>;
    resolved: boolean;
}

export interface ThinkSession {
    id: string;
    title: string;
    brainstorm: BrainstormState;
    sketchNodes: any[]; // ReactFlow nodes
    sketchEdges: any[]; // ReactFlow edges
    comments: Comment[];
    isPublic: boolean;
    lastModified: number;
}
