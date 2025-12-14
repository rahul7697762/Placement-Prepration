import React, { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { ResumeData, ResumeColor } from '../../types/resume';
import Form from './Form';
import Resume from './Resume';
import DownloadDropdown from './DownloadDropdown';
import { ResumeService } from '../../services/resumeService';

// Default data
const defaultResumeData: ResumeData = {
    contact: {
        name: "John Doe",
        position: "Software Engineer",
        photoUrl: "",
        phone: "+1 234 567 890",
        email: "john.doe@example.com",
        linkedin: "linkedin.com/in/johndoe",
        github: "github.com/johndoe",
        address: "New York, USA",
    },
    objective: "Detail-oriented Software Engineer with 5+ years of experience in full-stack development. Passionate about building scalable web applications and solving complex problems.",
    education: [
        {
            course: "Bachelor of Science in Computer Science",
            institution: "University of Technology",
            year: "2018 - 2022",
            description: "Graduated with Honors. Specialized in Artificial Intelligence."
        }
    ],
    internship: [
        {
            position: "Senior Developer",
            company: "Tech Solutions Inc.",
            year: "2022 - Present",
            description: "Leading the frontend team in migration to Next.js. Improved performance by 40%."
        }
    ],
    skills: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS"],
    customSkills: [
        { category: "Frontend", items: ["React", "Tailwind CSS", "Next.js"] },
        { category: "Backend", items: ["Node.js", "Express", "PostgreSQL"] }
    ],
    tools: ["VS Code", "Git", "Jira", "Figma"],
    languages: [
        { language: "English", level: "Native" },
        { language: "Spanish", level: "Intermediate" }
    ],
    certifications: [],
    references: [],
    interests: ["Coding", "Hiking", "Photography"],
    projects: [
        {
            title: "E-Commerce Platform",
            link: "https://github.com/johndoe/ecommerce",
            description: "Built a full-stack e-commerce application using Next.js and Stripe. Implemented user authentication and payment processing."
        }
    ],
    activities: [
        {
            title: "Volunteer at Local Coding Bootcamp"
        }
    ],
    achievements: [
        {
            title: "Best Developer Award 2023",
            description: "Awarded for exceptional contribution to the team."
        }
    ],
    customSections: [
        {
            title: "Publications",
            items: ["Published a paper on AI in Healthcare", "Wrote a technical blog on Next.js Performance"]
        }
    ],
    sectionOrder: [
        "objective",
        "education",
        "internship",
        "projects",
        "skills",
        "activities",
        "achievements",
        "certifications",
        "languages",
        "references",
        "customSections"
    ]
};

const defaultColor: ResumeColor = {
    primary: '#4f46e5', // Indigo 600
    background: '#4f46e5',
};

// Preset colors matching Tailwind shades
const presets: ResumeColor[] = [
    { primary: '#4f46e5', background: '#4f46e5' }, // Indigo
    { primary: '#db2777', background: '#db2777' }, // Pink
    { primary: '#059669', background: '#059669' }, // Emerald
    { primary: '#0891b2', background: '#0891b2' }, // Cyan
    { primary: '#d97706', background: '#d97706' }, // Amber
    { primary: '#dc2626', background: '#dc2626' }, // Red
    { primary: '#111827', background: '#111827' }, // Gray
    { primary: '#7c3aed', background: '#7c3aed' }, // Violet
];

interface ResumeBuilderProps {
    selectedTemplate: number;
    onBackToTemplates: () => void;
    resumeId?: number;
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
    selectedTemplate,
    onBackToTemplates,
    resumeId,
}) => {
    const [data, setData] = useState<ResumeData>(defaultResumeData);
    const [color, setColor] = useState<ResumeColor>(defaultColor);
    const [loading, setLoading] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const uploadRef = useRef<HTMLInputElement>(null);
    const componentRef = useRef<HTMLDivElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/parse-resume', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Failed to parse resume');

            const parsedData = await res.json();

            // Merge with existing structure to avoid missing fields
            const mergedData: ResumeData = {
                ...defaultResumeData,
                ...parsedData,
                contact: {
                    ...defaultResumeData.contact,
                    ...parsedData.contact
                },
                // Ensure arrays are initialized if missing in parsed data
                education: parsedData.education || [],
                internship: parsedData.internship || [],
                projects: parsedData.projects || [],
                skills: parsedData.skills || [],
                languages: parsedData.languages || [],
                certifications: parsedData.certifications || [],
                achievements: parsedData.achievements || [],
                references: parsedData.references || [],
                customSections: parsedData.customSections || [],
                customSkills: parsedData.customSkills || [],
            };

            setData(mergedData);
            // alert('Resume imported successfully!');
        } catch (error) {
            console.error(error);
            alert('Error importing resume. Please ensure it is a readable PDF.');
        } finally {
            setIsImporting(false);
            if (uploadRef.current) uploadRef.current.value = '';
        }
    };

    useEffect(() => {
        if (resumeId) {
            setLoading(true);
            ResumeService.getResume(resumeId).then(fetched => {
                if (fetched) {
                    setData(fetched);
                    if (fetched.color_scheme) setColor(fetched.color_scheme);
                }
                setLoading(false);
            });
        }
    }, [resumeId]);

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-gray-100 dark:bg-slate-900 overflow-hidden font-sans">
            {/* Left Panel: Editor */}
            <div className="w-1/2 min-w-[500px] flex flex-col border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 z-10 shadow-xl transition-all duration-300">
                {/* Header */}
                <div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <button
                        onClick={onBackToTemplates}
                        className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium flex items-center gap-2 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Templates
                    </button>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text">
                        Resume Builder
                    </h1>
                    <div className="flex items-center gap-3">
                        <input
                            type="file"
                            ref={uploadRef}
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileUpload}
                        />
                        <button
                            onClick={() => uploadRef.current?.click()}
                            disabled={isImporting}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-slate-600 rounded-lg transition-all text-sm font-medium disabled:opacity-50"
                        >
                            {isImporting ? (
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Upload size={18} />
                            )}
                            {isImporting ? 'Parsing...' : 'Import Resume'}
                        </button>
                    </div>
                </div>

                {/* Form Container */}
                <div className="flex-1 overflow-hidden p-0 relative">
                    <Form
                        data={data}
                        setData={setData}
                        preset={presets}
                        setColor={setColor}
                        selectedTemplate={selectedTemplate}
                        setSelectedTemplate={() => { }} // Template switching handled by parent for now
                    />
                </div>
            </div>

            {/* Right Panel: Preview */}
            <div className="w-1/2 flex flex-col bg-slate-100 dark:bg-slate-950">
                {/* Toolbar */}
                <div className="h-16 shrink-0 flex items-center justify-between px-8 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm z-10">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                            Preview Mode
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <DownloadDropdown
                            data={data}
                            templateId={selectedTemplate}
                            color={color}
                            resumeId={resumeId}
                        />
                    </div>
                </div>

                {/* Resume Canvas Area */}
                <div className="flex-1 overflow-auto p-8 flex justify-center items-start custom-scrollbar">
                    <div className="shadow-2xl print:shadow-none bg-white rounded-lg overflow-hidden transition-transform duration-300 origin-top">
                        <div ref={componentRef} style={{ width: '210mm', minHeight: '297mm', transform: 'scale(1)', transformOrigin: 'top center' }}>
                            <Resume
                                data={data}
                                color={color}
                                selectedTemplate={selectedTemplate}
                                onUpdate={setData}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
