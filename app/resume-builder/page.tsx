'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ResumeBuilder from '../../components/resume/ResumeBuilder';
import TemplateSelection from '../../components/resume/TemplateSelection';
// import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { ResumeService } from '../../services/resumeService';

function ResumeBuilderContent() {
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const [showTemplateSelection, setShowTemplateSelection] = useState<boolean>(true);
  const [loadingResume, setLoadingResume] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('resumeId');

  useEffect(() => {
    if (resumeId) {
      loadExistingResume(resumeId);
    }
  }, [resumeId]);

  const loadExistingResume = async (id: string) => {
    try {
      setLoadingResume(true);
      const resume = await ResumeService.getResume(parseInt(id));
      if (resume) {
        // Set the template from the loaded resume
        //setSelectedTemplate(resume.template_id || 0);
        // Skip template selection and go directly to the builder
        setShowTemplateSelection(false);
      }
    } catch (error) {
      console.error('Failed to load resume:', error);
      // If loading fails, show template selection
      setShowTemplateSelection(true);
    } finally {
      setLoadingResume(false);
    }
  };

  const handleTemplateSelect = (templateId: number) => {
    setSelectedTemplate(templateId);
    setShowTemplateSelection(false);
  };


  if (loadingResume) {
    return (
      <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-gray-100 font-sans min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 dark:text-gray-300">Loading your resume...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-gray-100 font-sans flex flex-col h-full">
      <main className="flex-grow">
        {showTemplateSelection ? (
          <TemplateSelection onTemplateSelect={handleTemplateSelect} />
        ) : (
          <ResumeBuilder
            selectedTemplate={selectedTemplate}
            onBackToTemplates={() => setShowTemplateSelection(true)}
            resumeId={resumeId ? parseInt(resumeId) : undefined}
          />
        )}
      </main>
    </div>
  );
}

export default function ResumeBuilderPage() {
  return (
    // <ProtectedRoute>
    <Suspense fallback={
      <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-gray-100 font-sans min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 dark:text-gray-300">Loading...</span>
        </div>
      </div>
    }>
      <ResumeBuilderContent />
    </Suspense>
    // </ProtectedRoute>
  );
}
