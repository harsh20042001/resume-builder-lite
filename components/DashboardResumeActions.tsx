// components/DashboardResumeActions.tsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { UpgradeModal } from "@/components/UpgradeModal";

interface DashboardResumeActionsProps {
  resumeId: string;
  isPremium: boolean;
}

export function DashboardResumeActions({ resumeId, isPremium }: DashboardResumeActionsProps) {
  const router = useRouter();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleDuplicate() {
    if (!isPremium) {
      setShowUpgrade(true);
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const { data: original } = await supabase
      .from("resumes")
      .select("title, format_id, template_id, content, user_id")
      .eq("id", resumeId)
      .single();

    if (original) {
      await supabase.from("resumes").insert({
        ...original,
        title: `${original.title} (copy)`,
      });
      router.refresh();
    }
    setBusy(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this resume? This cannot be undone.")) return;
    setBusy(true);
    const supabase = createClient();
    await supabase.from("resumes").delete().eq("id", resumeId);
    router.refresh();
    setBusy(false);
  }

  return (
    <>
      <div className="flex gap-2">
        <Link href={`/editor/${resumeId}`}>
          <Button variant="secondary" size="sm">
            Edit
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={handleDuplicate} disabled={busy}>
          Duplicate
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDelete} disabled={busy}>
          Delete
        </Button>
      </div>
      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        trigger="resume-limit"
      />
    </>
  );
}
