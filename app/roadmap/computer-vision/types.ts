export interface Topic {
    id: string;
    title: string;
    description: string;
    details: string;
    codeExample?: string;
    visualizationType?: 'image' | 'code' | 'diagram';
}

export interface MCQ {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export interface Unit {
    id: string;
    title: string;
    topics: Topic[];
    description?: string;
    mcqs?: MCQ[];
}
