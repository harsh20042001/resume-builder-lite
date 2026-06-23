// app/(marketing)/pricing/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const FREE_FEATURES = [
  "1 resume",
  "2 templates",
  "ATS + India formats",
  "Watermarked PDF export",
];

const PREMIUM_FEATURES = [
  "Unlimited resumes",
  "All 6 templates",
  "All 5 formats — ATS, US, Europe, India, Fresher",
  "Clean PDF export, no watermark",
  "Duplicate any resume",
  "Cover letter generator",
  "Section reordering",
];

export default function PricingPage() {
  return (
    <main className="bg-paper px-6 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-accent">Pricing</p>
        <h1 className="mt-3 font-display text-4xl text-ink">
          One price. Yours forever.
        </h1>
        <p className="mt-3 text-muted">No subscriptions, no renewals, no surprise charges.</p>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
        {/* Free */}
        <div className="rounded-md border border-rule bg-white p-8">
          <p className="font-mono text-xs uppercase tracking-wide text-muted">Free</p>
          <p className="mt-2 font-display text-3xl text-ink">₹0</p>
          <ul className="mt-6 space-y-2.5 text-left text-sm text-ink/80">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-muted">·</span>
                {f}
              </li>
            ))}
          </ul>
          <Link href="/dashboard" className="mt-8 block">
            <Button variant="secondary" className="w-full">
              Start for free
            </Button>
          </Link>
        </div>

        {/* Premium */}
        <div className="rounded-md border-2 border-gold bg-white p-8">
          <p className="font-mono text-xs uppercase tracking-wide text-gold">Premium</p>
          <p className="mt-2 font-display text-3xl text-ink">
            ₹999 <span className="text-base font-normal text-muted">once</span>
          </p>
          <ul className="mt-6 space-y-2.5 text-left text-sm text-ink/80">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-accent">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <Link href="/dashboard" className="mt-8 block">
            <Button variant="gold" className="w-full">
              Unlock Premium
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
