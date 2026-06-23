// app/(app)/editor/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FORMAT_LIST } from "@/lib/formatConfig";
import { FormatId, emptyResumeContent } from "@/types/resume";
import { Badge } from "@/components/ui/Badge";
import { UpgradeModal } from "@/components/UpgradeModal";

export default function NewResumePage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  async function handleSelectFormat(formatId: FormatId) {
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

    const format = FORMAT_LIST.find((f) => f.id === formatId)!;
    const isPremium = userRow?.is_premium ?? false;

    if (!isPremium && !format.freeTier) {
      setShowUpgrade(true);
      return;
    }

    // Free tier: block creating a second resume at the API/DB level via RLS-friendly check here.
    if (!isPremium) {
      const { count } = await supabase
        .from("resumes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
      if ((count ?? 0) >= 1) {
        setShowUpgrade(true);
        return;
      }
    }

    setCreating(true);
    const { data: defaultTemplate } = await supabase
      .from("templates")
      .select("id")
      .eq("is_premium", false)
      .order("sort_order")
      .limit(1)
      .single();

    const { data: resume, error } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title: `${format.label} — Untitled`,
        format_id: formatId,
        template_id: defaultTemplate?.id,
        content: emptyResumeContent(),
      })
      .select("id")
      .single();

    setCreating(false);

    if (!error && resume) {
      router.push(`/editor/${resume.id}`);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl text-ink">Choose a resume format</h1>
      <p className="mt-2 text-muted">Each format follows different conventions for your target market.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {FORMAT_LIST.map((format) => (
          <button
            key={format.id}
            onClick={() => handleSelectFormat(format.id)}
            disabled={creating}
            className="text-left rounded-md border border-rule bg-white p-5 transition hover:border-accent disabled:opacity-50"
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-lg text-ink">{format.label}</p>
              {!format.freeTier && <Badge tone="gold">Premium</Badge>}
            </div>
            <p className="mt-1.5 text-sm text-muted">{format.shortDescription}</p>
          </button>
        ))}
      </div>

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        trigger="format"
      />
    </main>
  );
}
