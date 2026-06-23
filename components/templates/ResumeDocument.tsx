// components/templates/ResumeDocument.tsx
//
// This is the config-driven renderer described in the format logic plan:
// ONE component reads `format` (section order, photo visibility, date style,
// labels) and `templateName` (visual skin) to produce the right output.
// Adding a 6th format later means adding a config entry, not a new component.

import { ResumeContent } from "@/types/resume";
import { FormatConfig } from "@/lib/formatConfig";
import { SECTION_COMPONENTS, SECTION_LABELS } from "@/components/templates/sectionRenderers";

export type TemplateName = "classic" | "minimal" | "modern" | "executive" | "compact" | "academic";

interface ResumeDocumentProps {
  content: ResumeContent;
  format: FormatConfig;
  templateName?: TemplateName;
  watermark?: boolean;
}

const TEMPLATE_STYLES: Record<TemplateName, { heading: string; accent: string; nameSize: string }> = {
  classic: { heading: "font-display", accent: "text-accent", nameSize: "text-3xl" },
  minimal: { heading: "font-body font-semibold", accent: "text-ink", nameSize: "text-2xl" },
  modern: { heading: "font-display italic", accent: "text-gold", nameSize: "text-3xl" },
  executive: { heading: "font-display", accent: "text-ink", nameSize: "text-4xl" },
  compact: { heading: "font-body font-semibold", accent: "text-accent", nameSize: "text-xl" },
  academic: { heading: "font-display", accent: "text-accent", nameSize: "text-2xl" },
};

export function ResumeDocument({
  content,
  format,
  templateName = "classic",
  watermark = false,
}: ResumeDocumentProps) {
  const style = TEMPLATE_STYLES[templateName];
  const { personalInfo } = content;

  return (
    <div className="relative mx-auto max-w-page bg-white p-10 text-ink shadow-sm">
      {watermark && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <p className="rotate-[-30deg] select-none whitespace-nowrap text-6xl font-bold text-ink/5">
            RESUME BUILDER LITE — FREE
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-6 border-b border-rule pb-4">
        <div>
          <h1 className={`${style.heading} ${style.nameSize} text-ink`}>{personalInfo.fullName || "Your Name"}</h1>
          <p className={`mt-1 text-base ${style.accent}`}>{personalInfo.title || "Your Title"}</p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          </div>
          {format.showNationality && (personalInfo.dateOfBirth || personalInfo.nationality) && (
            <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted">
              {personalInfo.dateOfBirth && <span>DOB: {personalInfo.dateOfBirth}</span>}
              {personalInfo.nationality && <span>{personalInfo.nationality}</span>}
            </div>
          )}
        </div>
        {format.showPhoto && personalInfo.photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={personalInfo.photoUrl}
            alt=""
            className="h-24 w-24 rounded-sm object-cover"
          />
        )}
      </div>

      {/* Body — section order driven entirely by format.sectionOrder */}
      <div className="mt-5 space-y-5">
        {content.sectionOrder
          .filter((id) => format.sectionOrder.includes(id))
          .map((sectionId) => {
            if (sectionId === "summary") {
              if (!content.summary) return null;
              return (
                <section key="summary">
                  <h2 className={`mb-1.5 text-xs font-semibold uppercase tracking-wide ${style.accent}`}>
                    {format.summaryLabel}
                  </h2>
                  <p className="text-sm text-ink/90">{content.summary}</p>
                </section>
              );
            }

            const SectionComponent = SECTION_COMPONENTS[sectionId];
            if (!SectionComponent) return null;

            return (
              <section key={sectionId}>
                <h2 className={`mb-1.5 text-xs font-semibold uppercase tracking-wide ${style.accent}`}>
                  {SECTION_LABELS[sectionId]}
                </h2>
                <SectionComponent content={content} format={format} />
              </section>
            );
          })}

        {content.customSections.map((custom) => (
          <section key={custom.id}>
            <h2 className={`mb-1.5 text-xs font-semibold uppercase tracking-wide ${style.accent}`}>
              {custom.title}
            </h2>
            <p className="whitespace-pre-line text-sm text-ink/90">{custom.content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
