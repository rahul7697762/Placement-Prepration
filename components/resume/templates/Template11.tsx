import React, { useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { ResumeData, ResumeColor } from "../../../types/resume";

interface TemplateProps {
    data: ResumeData;
    color: ResumeColor;
    onUpdate?: (data: ResumeData) => void;
}

const DraggableSection = ({ id, children, color, onDelete }: { id: string, children: React.ReactNode, color: string, onDelete?: () => void }) => {
    const controls = useDragControls();

    return (
        <Reorder.Item
            value={id}
            dragListener={false}
            dragControls={controls}
            className="relative group mb-2" // Added mb-2 to ensure spacing for controls
            style={{ listStyle: 'none' }}
        >
            <div
                className="absolute -top-7 left-0 flex flex-row items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity print:hidden z-50 pointer-events-none"
            >
                <div className="flex items-center bg-white border border-gray-200 shadow-sm rounded-md px-1 py-0.5 pointer-events-auto">
                    <div
                        className="p-1 cursor-grab hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 flex items-center"
                        onPointerDown={(e) => controls.start(e)}
                        title="Drag to reorder"
                    >
                        <GripVertical size={14} />
                    </div>
                    {onDelete && (
                        <>
                            <div className="w-[1px] h-3 bg-gray-200 mx-1"></div>
                            <div
                                className="p-1 cursor-pointer hover:bg-red-50 rounded text-gray-400 hover:text-red-500 flex items-center"
                                onClick={onDelete}
                                title="Remove section"
                            >
                                <Trash2 size={14} />
                            </div>
                        </>
                    )}
                </div>
            </div>
            {children}
        </Reorder.Item>
    );
};

const Template11: React.FC<TemplateProps> = ({ data, color, onUpdate }) => {
    if (!data || !data.contact) return null;
    const { contact, objective, skills, internship, projects, education, certifications, activities, languages, references } = data;

    // Helper to check if section has data
    const hasData = (arr: any[] | undefined) => arr && arr.length > 0;

    const sections: { [key: string]: React.ReactNode } = {
        skills: (hasData(data.customSkills) ? (
            <section className="mb-4">
                <h2
                    className="text-lg font-bold uppercase border-b border-gray-400 mb-2 tracking-wider text-blue-800"
                    style={{ color: color.primary, borderColor: color.primary }}
                >
                    Skills
                </h2>
                <div className="text-sm space-y-2">
                    {data.customSkills?.map((skillGroup, index) => (
                        <div key={index} className="flex flex-wrap gap-2">
                            <span className="font-bold">{skillGroup.category}:</span>
                            <span>{Array.isArray(skillGroup.items) ? skillGroup.items.join(", ") : skillGroup.items}</span>
                        </div>
                    ))}
                </div>
            </section>
        ) : hasData(skills) ? (
            <section className="mb-4">
                <h2
                    className="text-lg font-bold uppercase border-b border-gray-400 mb-2 tracking-wider text-blue-800"
                    style={{ color: color.primary, borderColor: color.primary }}
                >
                    Skills
                </h2>
                <div className="text-sm">
                    <ul className="list-disc list-inside">
                        <li className="flex flex-wrap gap-2">
                            <span className="font-bold">Key Skills:</span>
                            <span>{skills!.join(", ")}</span>
                        </li>
                    </ul>
                </div>
            </section>
        ) : null),

        internship: (hasData(data.internship) ? (
            <section className="mb-4">
                <h2
                    className="text-lg font-bold uppercase border-b border-gray-400 mb-2 tracking-wider"
                    style={{ color: color.primary, borderColor: color.primary }}
                >
                    Internship
                </h2>
                <div className="space-y-3">
                    {data.internship?.map((exp, i) => (
                        <div key={i}>
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-gray-900 text-base">
                                    {exp.company}
                                </h3>
                                <span className="text-sm italic">{exp.year}</span>
                            </div>
                            <div className="mb-1 text-sm font-medium italic">
                                {exp.position}
                            </div>
                            {exp.description && (
                                <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                                    {exp.description.split('.').filter(s => s.trim()).map((sentence, idx) => (
                                        <li key={idx}>{sentence.trim()}.</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        ) : null),

        projects: (hasData(projects) ? (
            <section className="mb-4">
                <h2
                    className="text-lg font-bold uppercase border-b border-gray-400 mb-2 tracking-wider"
                    style={{ color: color.primary, borderColor: color.primary }}
                >
                    Projects
                </h2>
                <div className="space-y-3">
                    {projects?.map((proj, i) => (
                        <div key={i}>
                            <div className="flex justify-between items-baseline mb-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-base" style={{ color: color.primary }}>
                                        {proj.title}
                                    </h3>
                                    {proj.link && (
                                        <a href={proj.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">
                                            [Link]
                                        </a>
                                    )}
                                </div>
                            </div>
                            {proj.description && (
                                <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                                    {proj.description.split('.').filter(s => s.trim()).map((sentence, idx) => (
                                        <li key={idx}>{sentence.trim()}.</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        ) : null),

        certifications: (hasData(certifications) ? (
            <section className="mb-4">
                <h2
                    className="text-lg font-bold uppercase border-b border-gray-400 mb-2 tracking-wider"
                    style={{ color: color.primary, borderColor: color.primary }}
                >
                    Certificates
                </h2>
                <ul className="list-disc list-inside text-sm space-y-1">
                    {certifications?.map((cert, i) => (
                        <li key={i}>
                            <span className="font-medium text-gray-900">{cert.course}</span>
                            {cert.institution && <span> | {cert.institution}</span>}
                            {cert.year && <span className="float-right italic text-sm">{cert.year}</span>}
                        </li>
                    ))}
                </ul>
            </section>
        ) : null),

        activities: (hasData(activities) ? (
            <section className="mb-4">
                <h2
                    className="text-lg font-bold uppercase border-b border-gray-400 mb-2 tracking-wider"
                    style={{ color: color.primary, borderColor: color.primary }}
                >
                    Extracurricular Activities
                </h2>
                <ul className="list-disc list-inside text-sm space-y-1">
                    {activities?.map((act, i) => (
                        <li key={i}>
                            {act.title}
                        </li>
                    ))}
                </ul>
            </section>
        ) : null),

        achievements: (hasData(data.achievements) ? (
            <section className="mb-4">
                <h2
                    className="text-lg font-bold uppercase border-b border-gray-400 mb-2 tracking-wider"
                    style={{ color: color.primary, borderColor: color.primary }}
                >
                    Achievements
                </h2>
                <ul className="list-disc list-inside text-sm space-y-1">
                    {data.achievements?.map((ach, i) => (
                        <li key={i}>
                            <span className="font-bold text-gray-900">{ach.title}</span>
                            {ach.description && <span className="text-gray-800"> - {ach.description}</span>}
                        </li>
                    ))}
                </ul>
            </section>
        ) : null),

        languages: (hasData(languages) ? (
            <section className="mb-4">
                <h2
                    className="text-lg font-bold uppercase border-b border-gray-400 mb-2 tracking-wider"
                    style={{ color: color.primary, borderColor: color.primary }}
                >
                    Languages
                </h2>
                <ul className="list-disc list-inside text-sm space-y-1">
                    {languages?.map((lang, i) => (
                        <li key={i}>
                            <span className="font-bold">{lang.language}</span>
                            {lang.level && <span> - {lang.level}</span>}
                        </li>
                    ))}
                </ul>
            </section>
        ) : null),

        references: (hasData(references) ? (
            <section className="mb-4">
                <h2
                    className="text-lg font-bold uppercase border-b border-gray-400 mb-2 tracking-wider"
                    style={{ color: color.primary, borderColor: color.primary }}
                >
                    References
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                    {references?.map((ref, i) => (
                        <div key={i}>
                            <p className="font-bold text-gray-900">{ref.name}</p>
                            {ref.desig && <p className="italic text-xs text-gray-700">{ref.desig}</p>}
                            {ref.phone && <p className="text-xs text-gray-600">Phone: {ref.phone}</p>}
                            {ref.email && <p className="text-xs text-gray-600">Email: {ref.email}</p>}
                        </div>
                    ))}
                </div>
            </section>
        ) : null),

        customSections: (hasData(data.customSections) ? (
            <div>
                {data.customSections?.map((section, i) => (
                    <section key={i} className="mb-4">
                        <h2
                            className="text-lg font-bold uppercase border-b border-gray-400 mb-2 tracking-wider"
                            style={{ color: color.primary, borderColor: color.primary }}
                        >
                            {section.title}
                        </h2>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            {Array.isArray(section.items) && section.items.map((item, idx) => (
                                <li key={idx}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
        ) : null),

        education: (hasData(education) ? (
            <section className="mb-4">
                <h2
                    className="text-lg font-bold uppercase border-b border-gray-400 mb-2 tracking-wider"
                    style={{ color: color.primary, borderColor: color.primary }}
                >
                    Education
                </h2>
                <div className="space-y-2">
                    {education?.map((edu, i) => (
                        <div key={i} className="flex justify-between items-start text-sm">
                            <div>
                                <h3 className="font-bold text-base" style={{ color: color.primary }}>{edu.institution}</h3>
                                <p className="italic text-gray-800">{edu.course}</p>
                            </div>
                            <div className="text-right">
                                <p className="italic">{edu.year}</p>
                                {edu.percentage && <p className="font-semibold">GPA/Percentage: {edu.percentage}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        ) : null),

        objective: (objective ? (
            <section className="mb-4">
                <h2
                    className="text-lg font-bold uppercase border-b border-gray-400 mb-2 tracking-wider"
                    style={{ color: color.primary, borderColor: color.primary }}
                >
                    Objective
                </h2>
                <p className="text-sm text-gray-800">{objective}</p>
            </section>
        ) : null)
    };

    const defaultOrder = [
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
    ];

    const order = data.sectionOrder || defaultOrder;
    // Calculate available sections (those in defaultOrder but not in current order)
    const availableSections = defaultOrder.filter(item => !order.includes(item));

    const handleDelete = (id: string) => {
        if (!onUpdate) return;
        const newOrder = order.filter(item => item !== id);
        onUpdate({ ...data, sectionOrder: newOrder });
    };

    const handleAdd = (id: string) => {
        if (!onUpdate) return;
        const newOrder = [...order, id];
        onUpdate({ ...data, sectionOrder: newOrder });
    };

    return (
        <div className="w-[850px] mx-auto bg-white text-gray-900 font-serif p-8 leading-relaxed relative pb-20">
            {/* HEADER - Fixed */}
            <header className="mb-6">
                <h1
                    className="text-4xl font-bold tracking-wide mb-4"
                    style={{ color: color.primary }}
                >
                    {contact.name}
                </h1>

                {/* 2-column grid with proper column alignment */}
                <div className="grid grid-cols-2 gap-x-10 gap-y-1 text-sm text-gray-800">

                    {/* LEFT COLUMN */}
                    {contact.github && (
                        <a
                            href={contact.github}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-700 hover:underline text-left"
                        >
                            GitHub: {contact.github}
                        </a>
                    )}

                    {/* RIGHT COLUMN */}
                    {contact.email && (
                        <a
                            href={`mailto:${contact.email}`}
                            className="text-blue-700 hover:underline text-right"
                        >
                            Email: {contact.email}
                        </a>
                    )}

                    {/* LEFT COLUMN */}
                    {contact.linkedin && (
                        <a
                            href={contact.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-700 hover:underline text-left"
                        >
                            LinkedIn: {contact.linkedin}
                        </a>
                    )}

                    {/* RIGHT COLUMN */}
                    {contact.phone && (
                        <span className="text-blue-700 text-right">
                            Phone: {contact.phone}
                        </span>
                    )}
                </div>
            </header>

            {/* Reorderable Sections */}
            <Reorder.Group axis="y" values={order} onReorder={(newOrder) => onUpdate?.({ ...data, sectionOrder: newOrder })} as="div">
                {order.map((sectionId) => {
                    const content = sections[sectionId];
                    // Even if content is null (no data), we might want to allow reordering if we want 'empty' placeholders?
                    // But here we rely on 'hasData' returning null if empty.
                    // If the user wants to Drag it, it must be visible.
                    // If it is 'null', it won't render. 
                    // BUT: if it's in the 'order' list, we should probably render it differently if empty?
                    // Currently: if empty -> null.
                    // If I delete it -> it's gone from order.
                    // If I add it -> it's in order.
                    // If I add an empty section, it will render null and disappear visually but be in order.
                    // User might be confused.
                    // However, 'Adding' usually implies the user wants to see it to fill it?
                    // The standard ResumeBuilder workflow is: Edit in left panel -> See in right panel.
                    // If I add 'Languages' but have no languages data, it won't show up.
                    // The user should go to the 'Form' side to add data.
                    // The 'Add/Delete' on canvas is purely for layout control of *existing* (populated) sections OR removing them even if populated.
                    // So if it returns null, it's just not there. That's fine.

                    if (!content) return null;

                    return (
                        <DraggableSection
                            key={sectionId}
                            id={sectionId}
                            color={color.primary}
                            onDelete={() => handleDelete(sectionId)}
                        >
                            {content}
                        </DraggableSection>
                    );
                })}
            </Reorder.Group>

            {/* Add Section Button - Print Hidden */}
            {availableSections.length > 0 && (
                <div className="mt-8 border-t border-dashed border-gray-300 pt-4 print:hidden">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Add Sections</h3>
                    <div className="flex flex-wrap gap-2">
                        {availableSections.map((sectionId) => (
                            <button
                                key={sectionId}
                                onClick={() => handleAdd(sectionId)}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors shadow-sm cursor-pointer"
                            >
                                <Plus size={14} />
                                <span className="capitalize">{sectionId.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Template11;
