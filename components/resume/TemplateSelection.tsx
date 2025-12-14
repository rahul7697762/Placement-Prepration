import React from 'react';

const templates = Array.from({ length: 11 }, (_, i) => i);

interface TemplateSelectionProps {
    onTemplateSelect: (id: number) => void;
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({ onTemplateSelect }) => {
    return (
        <div className="bg-slate-50 dark:bg-slate-900 py-12 px-6 min-h-screen">
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
                    {templates.map((id) => (
                        <div
                            key={id}
                            onClick={() => onTemplateSelect(id)}
                            className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-700"
                        >
                            <div className="aspect-[210/297] bg-slate-100 dark:bg-slate-900 p-4">
                                <div className="w-full h-full bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                                    <span className="text-slate-400 font-medium">Preview {id + 1}</span>
                                </div>
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
