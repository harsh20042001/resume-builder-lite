// components/templates/sectionRenderers.tsx
//
// Shared section-rendering helpers used by every template. Templates differ
// in visual styling (fonts, spacing, color); the *content* per section is
// rendered consistently here so format logic lives in one place.

import { ResumeContent } from "@/types/resume";
import { FormatConfig, formatDate } from "@/lib/formatConfig";

interface SectionProps {
  content: ResumeContent;
  format: FormatConfig;
}

export function ExperienceSection({ content, format }: SectionProps) {
  if (content.experience.length === 0) return null;
  return (
    <div className="space-y-3">
      {content.experience.map((exp) => (
        <div key={exp.id}>
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-semibold text-ink">
              {exp.role} <span className="font-normal text-muted">· {exp.company}</span>
            </p>
            <p className="whitespace-nowrap text-xs font-mono text-muted">
              {formatDate(exp.startDate, format.dateFormat)} —{" "}
              {exp.isCurrent ? "Present" : formatDate(exp.endDate, format.dateFormat)}
            </p>
          </div>
          {exp.location && <p className="text-xs text-muted">{exp.location}</p>}
          {exp.bullets.filter(Boolean).length > 0 && (
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm text-ink/90">
              {exp.bullets.filter(Boolean).map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export function EducationSection({ content, format }: SectionProps) {
  if (content.education.length === 0) return null;
  return (
    <div className="space-y-2.5">
      {content.education.map((edu) => (
        <div key={edu.id}>
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-semibold text-ink">
              {edu.degree}
              {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}{" "}
              <span className="font-normal text-muted">· {edu.institution}</span>
            </p>
            <p className="whitespace-nowrap text-xs font-mono text-muted">
              {formatDate(edu.startDate, format.dateFormat)} —{" "}
              {edu.isCurrent ? "Present" : formatDate(edu.endDate, format.dateFormat)}
            </p>
          </div>
          {edu.details && <p className="text-sm text-ink/80">{edu.details}</p>}
        </div>
      ))}
    </div>
  );
}

export function SkillsSection({ content }: SectionProps) {
  if (content.skills.length === 0) return null;
  return <p className="text-sm text-ink/90">{content.skills.join("  ·  ")}</p>;
}

export function CertificationsSection({ content, format }: SectionProps) {
  if (content.certifications.length === 0) return null;
  return (
    <div className="space-y-1">
      {content.certifications.map((cert) => (
        <p key={cert.id} className="text-sm text-ink/90">
          <span className="font-medium">{cert.name}</span> — {cert.issuer}{" "}
          <span className="font-mono text-xs text-muted">
            ({formatDate(cert.date, format.dateFormat)})
          </span>
        </p>
      ))}
    </div>
  );
}

export function ProjectsSection({ content }: SectionProps) {
  if (content.projects.length === 0) return null;
  return (
    <div className="space-y-2">
      {content.projects.map((proj) => (
        <div key={proj.id}>
          <p className="font-semibold text-ink">
            {proj.name}
            {proj.link && <span className="ml-2 font-mono text-xs text-accent">{proj.link}</span>}
          </p>
          <p className="text-sm text-ink/90">{proj.description}</p>
        </div>
      ))}
    </div>
  );
}

export function LanguagesSection({ content }: SectionProps) {
  if (content.languages.length === 0) return null;
  return (
    <p className="text-sm text-ink/90">
      {content.languages.map((l) => `${l.name} (${l.proficiency})`).join("  ·  ")}
    </p>
  );
}

export const SECTION_COMPONENTS: Record<
  string,
  React.ComponentType<SectionProps>
> = {
  experience: ExperienceSection,
  education: EducationSection,
  skills: SkillsSection,
  certifications: CertificationsSection,
  projects: ProjectsSection,
  languages: LanguagesSection,
};

export const SECTION_LABELS: Record<string, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  certifications: "Certifications",
  projects: "Projects",
  languages: "Languages",
};
