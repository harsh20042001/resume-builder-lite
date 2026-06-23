// app/(app)/preview/[resumeId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ResumeContent, FormatId } from "@/types/resume";
import { getFormatConfig } from "@/lib/formatConfig";
import { ResumeDocument, TemplateName } from "@/components/templates/ResumeDocument";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { UpgradeModal } from "@/components/UpgradeModal";

interface TemplateRow {
  id: string;
  name: string;
  is_premium: boolean;
}

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.resumeId as string;

  const [content, setContent] = useState<ResumeContent | null>(null);
  const [formatId, setFormatId] = useState<FormatId | null>(null);
  const [templateId, setTemplateId] = useState<string>("");
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState<false | "watermark" | "template">(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const [{ data: resumeRow }, { data: userRow }, { data: templateRows }] = await Promise.all([
        supabase.from("resumes").select("*").eq("id", resumeId).eq("user_id", user.id).single(),
        supabase.from("users").select("is_premium").eq("id", user.id).single(),
        supabase.from("templates").select("id, name, is_premium").order("sort_order"),
      ]);

      if (!resumeRow) {
        router.push("/dashboard");
        return;
      }

      setContent(resumeRow.content);
      setFormatId(resumeRow.format_id);
      setTemplateId(resumeRow.template_id ?? "");
      setIsPremium(userRow?.is_premium ?? false);
      setTemplates(templateRows ?? []);
    }
    load();
  }, [resumeId, router]);

  async function handleSelectTemplate(template: TemplateRow) {
    if (template.is_premium && !isPremium) {
      setShowUpgrade("template");
      return;
    }
    setTemplateId(template.id);
    const supabase = createClient();
    await supabase.from("resumes").update({ template_id: template.id }).eq("id", resumeId);
  }

  async function handleExport() {
    if (!isPremium) {
      setShowUpgrade("watermark");
      return;
    }
    setExporting(true);
    const res = await fetch("/api/export-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId }),
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();
      URL.revokeObjectURL(url);
    }
    setExporting(false);
  }

  async function handleExportWatermarked() {
    setExporting(true);
    const res = await fetch("/api/export-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId }),
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume-preview.pdf";
      a.click();
      URL.revokeObjectURL(url);
    }
    setExporting(false);
  }

  if (!content || !formatId) {
    return <main className="px-6 py-12 text-center text-muted">Loading…</main>;
  }

  const format = getFormatConfig(formatId);
  const activeTemplateName = (templates.find((t) => t.id === templateId)?.name.toLowerCase() ??
    "classic") as TemplateName;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-rule bg-white px-6 py-3">
        <Link href={`/editor/${resumeId}`} className="text-sm text-muted hover:text-ink">
          ← Back to editor
        </Link>
        <div className="flex items-center gap-3">
          <Button onClick={isPremium ? handleExport : handleExportWatermarked} disabled={exporting}>
            {exporting ? "Exporting…" : isPremium ? "Download PDF" : "Download (watermarked)"}
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Template picker */}
        <nav className="w-64 border-r border-rule bg-white p-5">
          <p className="mb-3 font-mono text-xs uppercase tracking-wide text-muted">Templates</p>
          <div className="space-y-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className={`flex w-full items-center justify-between rounded-sm border px-3 py-2.5 text-left text-sm transition ${
                  templateId === template.id
                    ? "border-accent bg-accentSoft text-accent"
                    : "border-rule text-ink hover:border-ink/30"
                }`}
              >
                {template.name}
                {template.is_premium && <Badge tone="gold">Pro</Badge>}
              </button>
            ))}
          </div>

          {!isPremium && (
            <p className="mt-5 text-xs text-muted">
              Free exports include a watermark.{" "}
              <button onClick={() => setShowUpgrade("watermark")} className="text-accent underline">
                Remove it with Premium
              </button>
              .
            </p>
          )}
        </nav>

        {/* Preview */}
        <section className="flex-1 overflow-y-auto bg-rule/10 p-10">
          <ResumeDocument
            content={content}
            format={format}
            templateName={activeTemplateName}
            watermark={!isPremium}
          />
        </section>
      </div>

      <UpgradeModal
        open={!!showUpgrade}
        onClose={() => setShowUpgrade(false)}
        trigger={showUpgrade === "template" ? "template" : "watermark"}
      />
    </div>
  );
}
