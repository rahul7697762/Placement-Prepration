import React from "react";
import { ResumeData, ResumeColor } from "../../../types/resume";

interface TemplateProps {
  data: ResumeData;
  color: ResumeColor;
}

const Template10: React.FC<TemplateProps> = ({ data, color }) => {
  if (!data || !data.contact) return null;
  const { contact, objective, skills, internship, education, certifications, references } = data;

  return (
    <div className="w-[850px] mx-auto bg-white text-gray-900 font-sans p-10">
      {/* ===== HEADER ===== */}
      <header
        className="border-b-2 pb-4 mb-6 text-center"
        style={{ borderColor: color.primary }}
      >
        <h1 className="text-3xl font-bold uppercase tracking-wide">
          {contact.name}
        </h1>
        <h3
          className="text-lg font-medium mt-1"
          style={{ color: color.primary }}
        >
          {contact.position || "UX Designer"}
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          {contact.email} | {contact.phone} | {contact.linkedin}
        </p>
      </header>

      {/* ===== SUMMARY ===== */}
      {objective && (
        <section className="mb-6">
          <h2
            className="text-lg font-semibold uppercase mb-2 border-b pb-1"
            style={{ borderColor: color.primary, color: color.primary }}
          >
            Summary
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">{objective}</p>
        </section>
      )}

      {/* ===== TECHNICAL SKILLS ===== */}
      {skills && skills.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-lg font-semibold uppercase mb-3 border-b pb-1"
            style={{ borderColor: color.primary, color: color.primary }}
          >
            Technical Skills
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-700">
            {skills.map((s, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-md border border-gray-300 bg-gray-50"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ===== INTERNSHIP EXPERIENCE ===== */}
      {internship && internship.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-lg font-semibold uppercase mb-3 border-b pb-1"
            style={{ borderColor: color.primary, color: color.primary }}
          >
            Internship Experience
          </h2>
          {internship.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between text-sm font-semibold text-gray-800">
                <span>{exp.company}</span>
                <span className="text-gray-600">{exp.year}</span>
              </div>
              <p className="text-sm text-gray-700 italic mb-1">
                {exp.position}
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 leading-relaxed">
                {exp.description
                  ?.split(".")
                  .filter((p) => p.trim())
                  .map((p, idx) => (
                    <li key={idx}>{p.trim()}.</li>
                  ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* ===== EDUCATION ===== */}
      {education && education.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-lg font-semibold uppercase mb-3 border-b pb-1"
            style={{ borderColor: color.primary, color: color.primary }}
          >
            Education
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            {education.map((edu, i) => (
              <div key={i}>
                <strong className="text-gray-900">{edu.course}</strong> —{" "}
                <span className="italic">{edu.institution}</span>{" "}
                <span className="text-gray-500">({edu.year})</span>
                {edu.description && (
                  <p className="text-gray-700 mt-1">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== CERTIFICATIONS ===== */}
      {certifications && certifications.length > 0 && (
        <section className="mb-6">
          <h2
            className="text-lg font-semibold uppercase mb-3 border-b pb-1"
            style={{ borderColor: color.primary, color: color.primary }}
          >
            Certifications
          </h2>
          <div className="space-y-2 text-sm text-gray-700">
            {certifications.map((cert, i) => (
              <div key={i}>
                <strong className="text-gray-900">{cert.course}</strong>
                {cert.institution && <span> — {cert.institution}</span>}
                {cert.year && <span className="text-gray-500"> ({cert.year})</span>}
                {cert.description && (
                  <p className="text-gray-700 mt-1">{cert.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== REFERENCES ===== */}
      {references && references.length > 0 && (
        <section>
          <h2
            className="text-lg font-semibold uppercase mb-3 border-b pb-1"
            style={{ borderColor: color.primary, color: color.primary }}
          >
            References
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            {references.map((ref, i) => (
              <div key={i}>
                <p className="font-semibold text-gray-900">{ref.name}</p>
                {ref.desig && <p className="text-gray-600">{ref.desig}</p>}
                {ref.phone && <p>📞 {ref.phone}</p>}
                {ref.email && <p>✉️ {ref.email}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Template10;
