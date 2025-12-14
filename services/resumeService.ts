import { ResumeData, ResumeColor } from '../types/resume';

export const ResumeService = {
    getResume: async (id: number): Promise<ResumeData | null> => {
        // Mock implementation - Replace with actual API call
        if (typeof window === 'undefined') return null;

        console.log(`Getting resume ${id}`);
        try {
            const stored = localStorage.getItem(`resume_${id}`);
            if (stored) return JSON.parse(stored);
        } catch (e) {
            console.error("Error reading from local storage", e);
        }
        return null;
    },

    autoSave: async (
        data: ResumeData,
        templateId: number,
        color: ResumeColor,
        userId: string,
        resumeId?: number
    ) => {
        console.log('Auto-saving resume', { userId, resumeId });
        // Mock implementation - Replace with actual API call
        if (typeof window === 'undefined') return;

        const id = resumeId || Date.now();
        const savePayload = { ...data, template_id: templateId, color_scheme: color, id };
        try {
            localStorage.setItem(`resume_${id}`, JSON.stringify(savePayload));
        } catch (e) {
            console.error("Error saving to local storage", e);
        }
        return savePayload;
    },

    createResume: async (userId: string, templateId: number) => {
        // Mock implementation
        return { id: Date.now() };
    }
};
