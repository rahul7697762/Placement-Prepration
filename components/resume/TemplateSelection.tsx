import React from 'react';
import Image from 'next/image';

const templates = [10, ...Array.from({ length: 10 }, (_, i) => i)];

interface TemplateSelectionProps {
    onTemplateSelect: (id: number) => void;
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({ onTemplateSelect }) => {
    return (
        <div className="bg-slate-50 dark:bg-slate-900 py-12 px-6 min-h-screen font-['Times_New_Roman',_serif]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Choose Your Resume Template
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Select a professional design to get started. You can change it later at any time.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {templates.map((id, index) => (
                        <div
                            key={id}
                            onClick={() => onTemplateSelect(id)}
                            className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-700"
                        >
                            <div className="aspect-[210/297] bg-slate-100 dark:bg-slate-900 overflow-hidden relative rounded-lg border border-slate-200 dark:border-slate-700">
                                <Image
                                    src={`/images/resume_templates-images-${id}.${id === 10 ? 'png' : 'jpg'}`}
                                    alt={`Resume Template ${id + 1}`}
                                    fill
                                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    priority={index === 0}
                                />
                                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors" />
                            </div>

                            <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <span className="bg-white text-indigo-600 px-6 py-2 rounded-full font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                    Use Template
                                </span>
                            </div>

                            <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                                <h3 className="font-semibold text-slate-800 dark:text-gray-200">Template {id + 1}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TemplateSelection;
