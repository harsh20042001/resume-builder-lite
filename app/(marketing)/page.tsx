// app/(marketing)/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FORMAT_LIST } from "@/lib/formatConfig";

export default function LandingPage() {
  return (
    <main className="bg-paper">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 sm:pt-28">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Resume Builder Lite
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-ink sm:text-6xl">
          One resume, formatted right for every country you apply to.
        </h1>
        <p className="mt-5 max-w-xl text-base text-muted sm:text-lg">
          ATS, US, Europe, and India formats — each with its own rules for layout,
          tone, and what to include. Fill in your details once, export the right
          version every time.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard">
            <Button size="lg">Start for free</Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="secondary">
              See Premium — ₹999 once
            </Button>
          </Link>
        </div>
      </section>

      {/* Signature element: format cards rendered as literal mini-documents */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <p className="mb-6 font-mono text-xs uppercase tracking-wide text-muted">
          Five formats, five rule sets
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {FORMAT_LIST.map((format) => (
            <div
              key={format.id}
              className="doc-preview flex flex-col rounded-sm border border-rule bg-white p-3 shadow-sm"
              style={{ aspectRatio: "0.78" }}
            >
              <div className="mb-2 h-1.5 w-2/3 rounded-full bg-ink/80" />
              <div className="mb-3 h-1 w-1/3 rounded-full bg-accent/60" />
              <div className="space-y-1">
                {Array.from({ length: format.sectionOrder.length }).map((_, i) => (
                  <div key={i} className="h-1 w-full rounded-full bg-rule" />
                ))}
              </div>
              <p className="mt-auto pt-2 text-[11px] font-medium leading-tight text-ink">
                {format.label}
              </p>
              {!format.freeTier && (
                <p className="font-mono text-[9px] uppercase text-gold">Premium</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Why format matters */}
      <section className="border-t border-rule bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">
            Why the same resume doesn&apos;t work everywhere
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-accent">ATS</p>
              <p className="mt-1 text-sm text-ink/80">
                Tracking systems reject tables, icons, and columns. Plain layout,
                literal keywords, single column.
              </p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-accent">Europe CV</p>
              <p className="mt-1 text-sm text-ink/80">
                A photo and date of birth are conventional, not a red flag —
                the opposite of US norms.
              </p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-accent">US Resume</p>
              <p className="mt-1 text-sm text-ink/80">
                One page, achievement-led, no personal details. Recruiters scan
                for impact in seconds.
              </p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-accent">India Professional</p>
              <p className="mt-1 text-sm text-ink/80">
                Education sits higher, languages are listed, and a clear
                objective sets the tone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl text-ink">One payment. No subscription.</h2>
        <p className="mt-3 text-muted">
          ₹999 once unlocks every format, every template, unlimited resumes, and
          a cover letter generator. No renewal, ever.
        </p>
        <Link href="/pricing" className="mt-6 inline-block">
          <Button size="lg" variant="gold">
            See what&apos;s included
          </Button>
        </Link>
      </section>
    </main>
  );
}
