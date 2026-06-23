// app/(app)/cover-letter/[resumeId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Field, TextInput, TextArea } from "@/components/ui/Field";
import { UpgradeModal } from "@/components/UpgradeModal";

export default function CoverLetterPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.resumeId as string;

  const [isPremium, setIsPremium] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [letter, setLetter] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data: userRow } = await supabase
        .from("users")
        .select("is_premium")
        .eq("id", user.id)
        .single();
      setIsPremium(userRow?.is_premium ?? false);
      setLoaded(true);
    }
    load();
  }, [router]);

  async function handleGenerate() {
    if (!isPremium) {
      setShowUpgrade(true);
      return;
    }
    if (!jobTitle || !companyName) {
      setError("Add the job title and company name first.");
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, jobTitle, companyName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not generate cover letter.");
      setLetter(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setGenerating(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(letter);
  }

  if (!loaded) {
    return <main className="px-6 py-12 text-center text-muted">Loading…</main>;
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href={`/editor/${resumeId}`} className="text-sm text-muted hover:text-ink">
        ← Back to editor
      </Link>
      <h1 className="mt-3 font-display text-3xl text-ink">Cover letter</h1>
      <p className="mt-1 text-sm text-muted">
        Generated from this resume&apos;s summary, experience, and skills.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Field label="Job title" htmlFor="jobTitle">
          <TextInput
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Senior Product Designer"
          />
        </Field>
        <Field label="Company" htmlFor="companyName">
          <TextInput
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Acme Corp"
          />
        </Field>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <Button onClick={handleGenerate} disabled={generating} className="mt-4">
        {generating ? "Writing…" : letter ? "Regenerate" : "Generate cover letter"}
      </Button>

      {letter && (
        <div className="mt-6">
          <Field label="Your cover letter" htmlFor="letter">
            <TextArea
              id="letter"
              rows={14}
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              className="w-full"
            />
          </Field>
          <Button variant="secondary" onClick={handleCopy} className="mt-3">
            Copy to clipboard
          </Button>
        </div>
      )}

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} trigger="cover-letter" />
    </main>
  );
}
