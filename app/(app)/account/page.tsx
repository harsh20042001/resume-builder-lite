// app/(app)/account/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { SignOutButton } from "@/components/SignOutButton";

export default async function AccountPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: userRow }, { data: purchases }] = await Promise.all([
    supabase.from("users").select("email, full_name, is_premium, created_at").eq("id", user.id).single(),
    supabase
      .from("purchases")
      .select("id, amount, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl text-ink">Account</h1>

      <div className="mt-6 rounded-md border border-rule bg-white p-6">
        <p className="text-sm text-muted">Signed in as</p>
        <p className="mt-1 font-medium text-ink">{userRow?.email}</p>
        <div className="mt-3">
          <Badge tone={userRow?.is_premium ? "gold" : "muted"}>
            {userRow?.is_premium ? "Premium" : "Free plan"}
          </Badge>
        </div>
      </div>

      {purchases && purchases.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">
            Purchase history
          </p>
          <div className="space-y-2">
            {purchases.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-sm border border-rule bg-white px-4 py-3 text-sm"
              >
                <span className="text-ink">₹{(p.amount / 100).toFixed(0)}</span>
                <span className="text-muted">{new Date(p.created_at).toLocaleDateString()}</span>
                <Badge tone={p.status === "success" ? "accent" : "muted"}>{p.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <SignOutButton />
      </div>
    </main>
  );
}
