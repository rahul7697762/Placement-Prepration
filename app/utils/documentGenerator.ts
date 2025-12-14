import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { ResumeData } from '../../types/resume';

// PDF Generation using html2canvas and jsPDF
export const generatePDF = async (elementId: string, data?: ResumeData, filename: string = 'resume') => {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error('Element not found');
        }

        // Clone the element to safely modify styles for PDF generation
        const clone = element.cloneNode(true) as HTMLElement;
        document.body.appendChild(clone);
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        clone.style.top = '0';

        // Wait for all images in the clone to ensure they are loaded
        const images = clone.querySelectorAll('img');
        await Promise.all(Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = resolve; // Ignore errors to proceed
            });
        }));
        // Helper function to convert any color to RGB using a canvas
        const colorToRgb = (color: string): string => {
            if (!color || color === 'transparent' || color === 'inherit' || color === 'initial') {
                return color;
            }
            // If it's already rgb/rgba, return as-is
            if (color.startsWith('rgb')) {
                return color;
            }
            // If it's a hex color, return as-is
            if (color.startsWith('#')) {
                return color;
            }
            // For oklch/lab/etc, use a temporary element to convert
            try {
                const tempDiv = document.createElement('div');
                tempDiv.style.color = color;
                tempDiv.style.display = 'none';
                document.body.appendChild(tempDiv);
                const computedColor = window.getComputedStyle(tempDiv).color;
                document.body.removeChild(tempDiv);
                return computedColor || '#000000';
            } catch {
                return '#000000';
            }
        };

        // Function to inline all computed styles as RGB
        const inlineAllColors = (node: Element) => {
            if (!(node instanceof HTMLElement) && !(node instanceof SVGElement)) return;

            const computed = window.getComputedStyle(node);

            // Get the actual RGB values from computed styles and inline them
            const color = computed.color;
            const bgColor = computed.backgroundColor;
            const borderColor = computed.borderColor;

            // Force inline the computed RGB values
            if (color) {
                (node as HTMLElement).style.color = colorToRgb(color);
            }
            if (bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
                (node as HTMLElement).style.backgroundColor = colorToRgb(bgColor);
            }
            if (borderColor) {
                (node as HTMLElement).style.borderColor = colorToRgb(borderColor);
            }

            // Process children
            Array.from(node.children).forEach(child => inlineAllColors(child));
        };

        // Inline colors on our clone before passing to html2canvas
        inlineAllColors(clone);

        // Create canvas from HTML element using onclone for additional safety
        const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: element.offsetWidth,
            height: element.offsetHeight,
            onclone: (clonedDoc, clonedElement) => {
                // Additional color inlining in the html2canvas internal clone
                const inlineColorsInClone = (node: Element) => {
                    if (!(node instanceof HTMLElement)) return;

                    const computed = clonedDoc.defaultView?.getComputedStyle(node);
                    if (!computed) return;

                    // Only set if we can get a valid value
                    try {
                        const color = computed.color;
                        const bgColor = computed.backgroundColor;

                        if (color && !color.includes('oklch') && !color.includes('lab')) {
                            node.style.color = color;
                        } else {
                            node.style.color = '#000000';
                        }

                        if (bgColor && !bgColor.includes('oklch') && !bgColor.includes('lab')) {
                            if (bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
                                node.style.backgroundColor = bgColor;
                            }
                        } else if (bgColor && (bgColor.includes('oklch') || bgColor.includes('lab'))) {
                            node.style.backgroundColor = '#ffffff';
                        }
                    } catch (e) {
                        // Ignore errors
                    }

                    Array.from(node.children).forEach(child => inlineColorsInClone(child));
                };

                inlineColorsInClone(clonedElement);
            }
        });

        document.body.removeChild(clone);

        // Use JPEG instead of PNG for smaller file size
        const imgData = canvas.toDataURL('image/jpeg', 0.85);

        // Create PDF with compression enabled
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true
        });

        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // Add first page with JPEG compression
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'MEDIUM');

        // --- HYBRID ATS LAYER (Invisible Text) ---
        if (data) {
            pdf.setTextColor(255, 255, 255); // White text
            pdf.setFontSize(1); // Tiny font
            const margin = 10;
            let yPos = margin;

            const addInvisibleText = (text: string) => {
                if (!text || text.trim().length === 0) return;
                // Use splitTextToSize to ensure it vaguely respects width, though invisible
                const lines = pdf.splitTextToSize(text, imgWidth - (margin * 2));
                lines.forEach((line: string) => {
                    // Reset yPos if it goes off page (simplification for ATS reading flow)
                    if (yPos > pageHeight - margin) yPos = margin;
                    pdf.text(line, margin, yPos);
                    yPos += 0.5; // Tiny increment
                });
            };

            // Inject all data
            if (data.contact?.name) addInvisibleText(data.contact.name);
            if (data.contact?.email) addInvisibleText(data.contact.email);
            if (data.contact?.phone) addInvisibleText(data.contact.phone);
            if (data.contact?.address) addInvisibleText(data.contact.address);
            if (data.contact?.linkedin) addInvisibleText(data.contact.linkedin);
            if (data.contact?.github) addInvisibleText(data.contact.github);
            if (data.objective) addInvisibleText(data.objective);

            if (data.skills) addInvisibleText("Skills: " + data.skills.join(', '));

            data.internship?.forEach((exp: any) => {
                addInvisibleText(`${exp.position || ''} - ${exp.company || ''} (${exp.year || ''})`);
                if (exp.description) addInvisibleText(exp.description);
            });

            data.education?.forEach((edu: any) => {
                addInvisibleText(`${edu.institution || ''} - ${edu.course || ''} (${edu.year || ''})`);
                if (edu.description) addInvisibleText(edu.description);
            });

            data.projects?.forEach((proj: any) => {
                addInvisibleText(`${proj.title || ''}: ${proj.description || ''}`);
            });

            data.certifications?.forEach((cert: any) => {
                addInvisibleText(`${cert.course || ''} - ${cert.institution || ''}`);
            });
        }
        // ---------------------------------------

        heightLeft -= pageHeight;

        // Add additional pages if needed
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'MEDIUM');
            heightLeft -= pageHeight;
        }

        // Save the PDF
        pdf.save(`${filename}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF');
    }
};

// DOC Generation using docx library
export const generateDOC = async (data: ResumeData, filename: string = 'resume') => {
    try {
        const doc = new Document({
            sections: [
                {
                    children: [
                        // Header with name
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: data.contact?.name || 'Your Name',
                                    bold: true,
                                    size: 32,
                                    color: '1f4e79',
                                }),
                            ],
                            alignment: AlignmentType.LEFT,
                            spacing: { after: 200 },
                        }),

                        // Contact Information
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Mobile: ${data.contact?.phone || ''} | `,
                                    size: 20,
                                }),
                                new TextRun({
                                    text: `Email: ${data.contact?.email || ''}`,
                                    size: 20,
                                    color: '0066cc',
                                }),
                                ...(data.contact?.github ? [
                                    new TextRun({
                                        text: ` | GitHub: ${data.contact.github}`,
                                        size: 20,
                                        color: '0066cc',
                                    })
                                ] : []),
                                ...(data.contact?.linkedin ? [
                                    new TextRun({
                                        text: ` | LinkedIn: ${data.contact.linkedin}`,
                                        size: 20,
                                        color: '0066cc',
                                    })
                                ] : []),
                            ],
                            spacing: { after: 300 },
                        }),

                        // Objective Section
                        ...(data.objective ? [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: 'OBJECTIVE',
                                        bold: true,
                                        size: 24,
                                        color: '1f4e79',
                                    }),
                                ],
                                heading: HeadingLevel.HEADING_2,
                                spacing: { before: 200, after: 200 },
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: data.objective,
                                        size: 20,
                                    }),
                                ],
                                spacing: { after: 300 },
                            }),
                        ] : []),

                        // Skills Section
                        ...(data.skills && data.skills.length > 0 ? [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: 'SKILLS',
                                        bold: true,
                                        size: 24,
                                        color: '1f4e79',
                                    }),
                                ],
                                heading: HeadingLevel.HEADING_2,
                                spacing: { before: 200, after: 200 },
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: data.skills.join(', '),
                                        size: 20,
                                    }),
                                ],
                                spacing: { after: 300 },
                            }),
                        ] : []),

                        // Experience Section
                        ...(data.internship && data.internship.length > 0 ? [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: 'EXPERIENCE',
                                        bold: true,
                                        size: 24,
                                        color: '1f4e79',
                                    }),
                                ],
                                heading: HeadingLevel.HEADING_2,
                                spacing: { before: 300, after: 200 },
                            }),
                            ...data.internship.flatMap(exp => [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: `${exp.company || ''} | ${exp.location || ''}`,
                                            bold: true,
                                            size: 20,
                                            color: '1f4e79',
                                        }),
                                        new TextRun({
                                            text: `\t${exp.year || ''}`,
                                            bold: true,
                                            size: 20,
                                        }),
                                    ],
                                    spacing: { after: 50 },
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: exp.position || '',
                                            italics: true,
                                            bold: true,
                                            size: 20,
                                        }),
                                    ],
                                    spacing: { after: 100 },
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: `• ${exp.description || ''}`,
                                            size: 20,
                                        }),
                                    ],
                                    spacing: { after: 100 },
                                }),
                            ]),
                        ] : []),

                        // Education Section
                        ...(data.education && data.education.length > 0 ? [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: 'EDUCATION',
                                        bold: true,
                                        size: 24,
                                        color: '1f4e79',
                                    }),
                                ],
                                heading: HeadingLevel.HEADING_2,
                                spacing: { before: 300, after: 200 },
                            }),
                            ...data.education.flatMap(edu => [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: `${edu.institution || ''} | ${edu.year || ''}`,
                                            bold: true,
                                            size: 20,
                                            color: '1f4e79',
                                        }),
                                    ],
                                    spacing: { after: 50 },
                                }),
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: edu.course || '',
                                            italics: true,
                                            bold: true,
                                            size: 20,
                                        }),
                                    ],
                                    spacing: { after: 100 },
                                }),
                                ...(edu.description ? [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: `• ${edu.description}`,
                                                size: 20,
                                            }),
                                        ],
                                        spacing: { after: 100 },
                                    }),
                                ] : []),
                            ]),
                        ] : []),

                        // Certifications Section
                        ...(data.certifications && data.certifications.length > 0 ? [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: 'CERTIFICATIONS',
                                        bold: true,
                                        size: 24,
                                        color: '1f4e79',
                                    }),
                                ],
                                heading: HeadingLevel.HEADING_2,
                                spacing: { before: 300, after: 200 },
                            }),
                            ...data.certifications.map(cert =>
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: `• ${cert.course || ''} - ${cert.institution || ''}`,
                                            bold: true,
                                            size: 20,
                                        }),
                                        new TextRun({
                                            text: `\t${cert.year || ''}`,
                                            bold: true,
                                            size: 20,
                                        }),
                                    ],
                                    spacing: { after: 50 },
                                })
                            ),
                        ] : []),

                        // Projects Section
                        ...(data.projects && data.projects.length > 0 ? [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: 'PROJECTS',
                                        bold: true,
                                        size: 24,
                                        color: '1f4e79',
                                    }),
                                ],
                                heading: HeadingLevel.HEADING_2,
                                spacing: { before: 300, after: 200 },
                            }),
                            ...data.projects.map(project =>
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: `• ${project.title || ''}: ${project.description || ''}`,
                                            size: 20,
                                        }),
                                    ],
                                    spacing: { after: 50 },
                                })
                            ),
                        ] : []),
                    ],
                },
            ],
        });

        // Generate and save the document
        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${filename}.docx`);
    } catch (error) {
        console.error('Error generating DOC:', error);
        throw new Error('Failed to generate DOC');
    }
};



// Print function (for browser's print dialog)
export const printResume = () => {
    window.print();
};