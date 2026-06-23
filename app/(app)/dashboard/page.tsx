// app/(app)/dashboard/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DashboardResumeActions } from "@/components/DashboardResumeActions";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: userRow }, { data: resumes }] = await Promise.all([
    supabase.from("users").select("is_premium, full_name, email").eq("id", user.id).single(),
    supabase
      .from("resumes")
      .select("id, title, format_id, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false }),
  ]);

  const isPremium = userRow?.is_premium ?? false;
  const resumeCount = resumes?.length ?? 0;
  const atFreeLimit = !isPremium && resumeCount >= 1;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Your resumes</h1>
          <p className="mt-1 text-sm text-muted">
            {userRow?.email}{" "}
            <Badge tone={isPremium ? "gold" : "muted"}>{isPremium ? "Premium" : "Free"}</Badge>
          </p>
        </div>
        <Link href="/editor/new">
          <Button disabled={atFreeLimit}>New resume</Button>
        </Link>
      </div>

      {atFreeLimit && (
        <p className="mt-3 text-sm text-muted">
          You&apos;ve used your free resume.{" "}
          <Link href="/pricing" className="text-accent underline">
            Upgrade to create more
          </Link>
          .
        </p>
      )}

      <div className="mt-8 space-y-3">
        {resumeCount === 0 && (
          <div className="rounded-md border border-dashed border-rule p-10 text-center">
            <p className="text-muted">No resumes yet. Create your first one to get started.</p>
          </div>
        )}

        {resumes?.map((resume) => (
          <div
            key={resume.id}
            className="flex items-center justify-between rounded-sm border border-rule bg-white px-5 py-4"
          >
            <div>
              <p className="font-medium text-ink">{resume.title}</p>
              <p className="text-xs font-mono uppercase text-muted">{resume.format_id}</p>
            </div>
            <DashboardResumeActions resumeId={resume.id} isPremium={isPremium} />
          </div>
        ))}
      </div>
    </main>
  );
}
