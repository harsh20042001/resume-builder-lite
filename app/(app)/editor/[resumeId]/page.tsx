// app/(app)/editor/[resumeId]/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ResumeContent, FormatId, Resume } from "@/types/resume";
import { getFormatConfig } from "@/lib/formatConfig";
import { ResumeDocument, TemplateName } from "@/components/templates/ResumeDocument";
import { PersonalInfoForm } from "@/components/editor/PersonalInfoForm";
import { SummaryForm } from "@/components/editor/SummaryForm";
import { ExperienceForm } from "@/components/editor/ExperienceForm";
import { EducationForm } from "@/components/editor/EducationForm";
import { SkillsForm } from "@/components/editor/SkillsForm";
import { CertificationsForm } from "@/components/editor/CertificationsForm";
import { ProjectsForm } from "@/components/editor/ProjectsForm";
import { LanguagesForm } from "@/components/editor/LanguagesForm";
import { SectionReorder } from "@/components/editor/SectionReorder";
import { SECTION_LABELS } from "@/components/templates/sectionRenderers";
import { Button } from "@/components/ui/Button";
import { UpgradeModal } from "@/components/UpgradeModal";

const SECTIONS = [
  "personal",
  "summary",
  "experience",
  "education",
  "skills",
  "certifications",
  "projects",
  "languages",
  "order",
] as const;

const SECTION_NAV_LABELS: Record<string, string> = {
  personal: "Personal info",
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  certifications: "Certifications",
  projects: "Projects",
  languages: "Languages",
  order: "Reorder sections",
};

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.resumeId as string;

  const [resume, setResume] = useState<Resume | null>(null);
  const [content, setContent] = useState<ResumeContent | null>(null);
  const [activeSection, setActiveSection] = useState<typeof SECTIONS[number]>("personal");
  const [isPremium, setIsPremium] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState<false | "cover-letter">(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const [{ data: resumeRow }, { data: userRow }] = await Promise.all([
        supabase.from("resumes").select("*").eq("id", resumeId).eq("user_id", user.id).single(),
        supabase.from("users").select("is_premium").eq("id", user.id).single(),
      ]);

      if (!resumeRow) {
        router.push("/dashboard");
        return;
      }

      setResume({
        id: resumeRow.id,
        userId: resumeRow.user_id,
        title: resumeRow.title,
        formatId: resumeRow.format_id,
        templateId: resumeRow.template_id,
        content: resumeRow.content,
        createdAt: resumeRow.created_at,
        updatedAt: resumeRow.updated_at,
      });
      setContent(resumeRow.content);
      setIsPremium(userRow?.is_premium ?? false);
    }
    load();
  }, [resumeId, router]);

  const save = useCallback(
    async (next: ResumeContent) => {
      setSaving(true);
      const supabase = createClient();
      await supabase.from("resumes").update({ content: next }).eq("id", resumeId);
      setSaving(false);
    },
    [resumeId]
  );

  function updateContent(patch: Partial<ResumeContent>) {
    if (!content) return;
    const next = { ...content, ...patch };
    setContent(next);
    save(next);
  }

  if (!resume || !content) {
    return <main className="px-6 py-12 text-center text-muted">Loading…</main>;
  }

  const format = getFormatConfig(resume.formatId as FormatId);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-rule bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-muted hover:text-ink">
            ← Dashboard
          </Link>
          <span className="text-rule">|</span>
          <input
            value={resume.title}
            onChange={(e) => {
              const title = e.target.value;
              setResume({ ...resume, title });
            }}
            onBlur={async () => {
              const supabase = createClient();
              await supabase.from("resumes").update({ title: resume.title }).eq("id", resumeId);
            }}
            className="border-none bg-transparent text-sm font-medium text-ink focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted">{saving ? "Saving…" : "Saved"}</span>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              if (isPremium) {
                router.push(`/cover-letter/${resumeId}`);
              } else {
                setShowUpgrade("cover-letter");
              }
            }}
          >
            Cover letter
          </Button>
          <Link href={`/preview/${resumeId}`}>
            <Button size="sm">Preview & export</Button>
          </Link>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Section nav */}
        <nav className="w-56 border-r border-rule bg-white p-4">
          <ul className="space-y-1">
            {SECTIONS.map((section) => (
              <li key={section}>
                <button
                  onClick={() => setActiveSection(section)}
                  className={`w-full rounded-sm px-3 py-2 text-left text-sm transition ${
                    activeSection === section
                      ? "bg-accentSoft text-accent font-medium"
                      : "text-ink/80 hover:bg-rule/20"
                  }`}
                >
                  {SECTION_NAV_LABELS[section]}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Form panel */}
        <section className="w-1/2 overflow-y-auto p-8">
          <h2 className="mb-5 font-display text-xl text-ink">
            {SECTION_NAV_LABELS[activeSection]}
          </h2>

          {activeSection === "personal" && (
            <PersonalInfoForm
              value={content.personalInfo}
              onChange={(personalInfo) => updateContent({ personalInfo })}
              format={format}
            />
          )}
          {activeSection === "summary" && (
            <SummaryForm
              value={content.summary}
              onChange={(summary) => updateContent({ summary })}
              format={format}
            />
          )}
          {activeSection === "experience" && (
            <ExperienceForm
              value={content.experience}
              onChange={(experience) => updateContent({ experience })}
            />
          )}
          {activeSection === "education" && (
            <EducationForm
              value={content.education}
              onChange={(education) => updateContent({ education })}
            />
          )}
          {activeSection === "skills" && (
            <SkillsForm value={content.skills} onChange={(skills) => updateContent({ skills })} />
          )}
          {activeSection === "certifications" && (
            <CertificationsForm
              value={content.certifications}
              onChange={(certifications) => updateContent({ certifications })}
            />
          )}
          {activeSection === "projects" && (
            <ProjectsForm
              value={content.projects}
              onChange={(projects) => updateContent({ projects })}
            />
          )}
          {activeSection === "languages" && (
            <LanguagesForm
              value={content.languages}
              onChange={(languages) => updateContent({ languages })}
            />
          )}
          {activeSection === "order" && (
            <SectionReorder
              sectionOrder={content.sectionOrder}
              sectionLabels={SECTION_LABELS}
              onChange={(sectionOrder) => updateContent({ sectionOrder })}
              disabled={!isPremium}
            />
          )}
        </section>

        {/* Live preview */}
        <section className="w-1/2 overflow-y-auto bg-rule/10 p-8">
          <div className="scale-[0.85] origin-top">
            <ResumeDocument
              content={content}
              format={format}
              templateName={"classic" as TemplateName}
              watermark={!isPremium}
            />
          </div>
        </section>
      </div>

      <UpgradeModal
        open={!!showUpgrade}
        onClose={() => setShowUpgrade(false)}
        trigger="cover-letter"
      />
    </div>
  );
}
