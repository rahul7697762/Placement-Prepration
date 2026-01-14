import React, { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { useAuth } from '../../contexts/AuthContext';
import { ResumeService } from '../../services/resumeService';
import { ResumeData, ResumeColor } from '../../types/resume';
import html2canvas from 'html2canvas';

interface DownloadDropdownProps {
  data: ResumeData;
  templateId?: number;
  color?: ResumeColor;
  resumeId?: number;
}

const DownloadDropdown: React.FC<DownloadDropdownProps> = ({
  data,
  templateId = 0,
  color,
  resumeId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Save resume to Supabase
  const saveResumeToDatabase = async () => {
    if (!user) {
      console.log('User not authenticated, skipping database save');
      return;
    }

    try {
      console.log('Saving resume before download...');
      const savedResume = await ResumeService.autoSave(
        data,
        templateId,
        color || { primary: '#000000', background: '#ffffff' },
        user.id,
        resumeId
      );
      console.log('Resume saved successfully:', savedResume);
    } catch (error) {
      console.error('Failed to save resume:', error);
    }
  };



  // Hybrid PDF - Visual design with invisible searchable text layer (works with ATS)
  const handleDownloadPDF = async () => {

    setIsDownloading(true);
    setIsOpen(false);

    // Save to database when downloading
    await saveResumeToDatabase();

    try {
      // Wait a bit for dropdown to close
      await new Promise(resolve => setTimeout(resolve, 100));

      const element = document.getElementById('resume-preview');
      if (!element) {
        console.error('Resume element not found');
        alert('Resume element not found. Please try again.');
        return;
      }

      console.log('Generating hybrid PDF (visual + searchable text)...');

      // Capture visual design as image using html-to-image (supports modern CSS colors)
      const imgData = await toPng(element, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
        filter: (node) => {
          // Exclude elements with data-html2canvas-ignore attribute
          if (node instanceof HTMLElement) {
            return !node.hasAttribute('data-html2canvas-ignore');
          }
          return true;
        },
      });

      // Create an image to get dimensions
      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const marginLR = 10; // Left/Right margin in mm
      const marginTB = 5; // Top/Bottom margin in mm
      const availableWidth = pageWidth - (marginLR * 2);
      const availableHeight = pageHeight - (marginTB * 2);

      // Calculate dimensions to fit on single A4 page
      let imgWidth = availableWidth;
      let imgHeight = (img.height * imgWidth) / img.width;

      // If image is taller than available height, scale down to fit
      if (imgHeight > availableHeight) {
        const scale = availableHeight / imgHeight;
        imgHeight = availableHeight;
        imgWidth = imgWidth * scale;
      }

      // Center horizontally if scaled down
      const xPos = marginLR + (availableWidth - imgWidth) / 2;

      // Add image layer - fits on single A4 page
      pdf.addImage(imgData, 'PNG', xPos, marginTB, imgWidth, imgHeight, undefined, 'FAST');

      // Now add INVISIBLE text layer for ATS parsing
      // This text will be searchable but not visible
      pdf.setTextColor(255, 255, 255); // White text (invisible on white background)
      pdf.setFontSize(1); // Tiny font

      const margin = 10;
      let yPos = margin;

      // Helper to add invisible text
      const addInvisibleText = (text: string) => {
        if (!text || text.trim().length === 0) return;
        const lines = pdf.splitTextToSize(text, imgWidth - (margin * 2));
        lines.forEach((line: string) => {
          if (yPos > pageHeight - margin) {
            // Text continues on visual but we keep it on first page for ATS
            yPos = margin;
          }
          pdf.text(line, margin, yPos);
          yPos += 0.5;
        });
      };

      // Add all resume content as invisible searchable text
      if (data.contact?.name) addInvisibleText(data.contact.name);
      if (data.contact?.email) addInvisibleText(data.contact.email);
      if (data.contact?.phone) addInvisibleText(data.contact.phone);
      if (data.contact?.address) addInvisibleText(data.contact.address);
      if (data.contact?.linkedin) addInvisibleText(data.contact.linkedin);
      if (data.contact?.github) addInvisibleText(data.contact.github);
      if (data.objective) addInvisibleText(data.objective);
      if (data.skills) addInvisibleText(data.skills.join(' '));

      data.internship?.forEach((exp: any) => {
        addInvisibleText(`${exp.position || ''} ${exp.company || ''} ${exp.year || ''} ${exp.description || ''}`);
      });

      data.education?.forEach((edu: any) => {
        addInvisibleText(`${edu.course || ''} ${edu.institution || ''} ${edu.year || ''} ${edu.description || ''}`);
      });

      data.projects?.forEach((proj: any) => {
        addInvisibleText(`${proj.title || ''} ${proj.description || ''} ${proj.technologies || ''}`);
      });

      data.certifications?.forEach((cert: any) => {
        addInvisibleText(`${cert.course || ''} ${cert.institution || ''} ${cert.year || ''}`);
      });

      // Single page A4 PDF - content is scaled to fit
      pdf.save(`${data.contact?.name?.replace(/\s+/g, '_') || 'resume'}.pdf`);
      console.log('Hybrid PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDownloading(false);
    }
  };



  const handleDownloadDOC = async () => {
    setIsDownloading(true);
    setIsOpen(false);

    // Save to database when downloading
    await saveResumeToDatabase();

    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Header - Name
              new Paragraph({
                text: data.contact?.name || 'Your Name',
                heading: HeadingLevel.HEADING_1,
                spacing: { after: 200 },
              }),

              // Contact Info
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${data.contact?.phone || ''} | ${data.contact?.email || ''} | ${data.contact?.address || ''}`,
                    size: 20,
                  }),
                ],
                spacing: { after: 400 },
              }),

              // Objective
              ...(data.objective ? [
                new Paragraph({
                  text: 'ABOUT ME',
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 200, after: 200 },
                }),
                new Paragraph({
                  text: data.objective,
                  spacing: { after: 400 },
                }),
              ] : []),

              // Education
              ...(data.education && data.education.length > 0 ? [
                new Paragraph({
                  text: 'EDUCATION',
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 200, after: 200 },
                }),
                ...data.education.flatMap((edu: any) => [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${edu.year || edu.duration || ''} - ${edu.course || edu.degree || ''}`,
                        bold: true,
                      }),
                    ],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text: edu.institution || '',
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text: edu.achievements || edu.description || '',
                    spacing: { after: 300 },
                  }),
                ]),
              ] : []),

              // Experience
              ...(data.internship && data.internship.length > 0 ? [
                new Paragraph({
                  text: 'EXPERIENCE',
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 200, after: 200 },
                }),
                ...data.internship.flatMap((exp: any) => [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${exp.year || exp.duration || ''} - ${exp.position || ''}`,
                        bold: true,
                      }),
                    ],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text: exp.company || '',
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text: exp.description || '',
                    spacing: { after: 300 },
                  }),
                ]),
              ] : []),

              // Skills
              ...(data.skills && data.skills.length > 0 ? [
                new Paragraph({
                  text: 'SKILLS',
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 200, after: 200 },
                }),
                new Paragraph({
                  text: data.skills.join(', '),
                  spacing: { after: 400 },
                }),
              ] : []),

              // References
              ...(data.references && data.references.length > 0 ? [
                new Paragraph({
                  text: 'REFERENCES',
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 200, after: 200 },
                }),
                ...data.references.flatMap((ref: any) => [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: ref.name || '',
                        bold: true,
                      }),
                    ],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text: `${ref.desig || ref.position || ''}`,
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    text: `${ref.phone || ''} | ${ref.email || ''}`,
                    spacing: { after: 300 },
                  }),
                ]),
              ] : []),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${data.contact?.name || 'resume'}.docx`);
    } catch (error) {
      console.error('Error generating DOC:', error);
      alert('Failed to generate DOC. Please try again.');
    } finally {
      setIsDownloading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-pink-500 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDownloading}
      >
        {isDownloading ? '⏳ Downloading...' : '📥 Download'}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] overflow-hidden z-[100] min-w-[260px] animate-slideDown">
          <button
            className="block w-full px-5 py-3 text-left bg-white border-none cursor-pointer transition-colors duration-200 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-200"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">📄</span>
              <div>
                <div className="text-[15px] font-semibold text-blue-700">Download PDF</div>
                <div className="text-[11px] text-gray-500">Visual design + ATS compatible</div>
              </div>
            </div>
          </button>
          <button
            className="block w-full px-5 py-3 text-left bg-white border-none cursor-pointer transition-colors duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDownloadDOC}
            disabled={isDownloading}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">📝</span>
              <div>
                <div className="text-[15px] font-semibold text-gray-700">Download DOC</div>
                <div className="text-[11px] text-gray-500">Editable Word document</div>
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadDropdown;
