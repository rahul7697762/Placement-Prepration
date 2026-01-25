export interface Topic {
    id: string;
    title: string;
    description: string;
    details: string;
    codeExample?: string;
    visualizationType?: 'image' | 'code' | 'diagram';
}

export interface Unit {
    id: string;
    title: string;
    topics: Topic[];
    description?: string;
}
