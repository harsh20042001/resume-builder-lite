// components/UpgradeModal.tsx
"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  /** What triggered the modal — used only to tailor the headline copy */
  trigger?: "template" | "format" | "resume-limit" | "watermark" | "cover-letter" | "generic";
}

const TRIGGER_COPY: Record<string, { headline: string; sub: string }> = {
  template: {
    headline: "This template is part of Premium",
    sub: "Unlock every template, all five resume formats, and clean exports — once, for ₹999.",
  },
  format: {
    headline: "This format is part of Premium",
    sub: "Free includes ATS and India formats. Unlock US, Europe, and Fresher with Premium.",
  },
  "resume-limit": {
    headline: "You've used your free resume",
    sub: "Premium gives you unlimited resumes, all formats, and all templates — one payment, no subscription.",
  },
  watermark: {
    headline: "Remove the watermark",
    sub: "Premium exports are clean, print-ready PDFs with no Resume Builder Lite branding.",
  },
  "cover-letter": {
    headline: "Cover letters are part of Premium",
    sub: "Generate a matching cover letter for any resume, included with Premium.",
  },
  generic: {
    headline: "Unlock Resume Builder Lite Premium",
    sub: "Everything you need to apply globally — once, for ₹999.",
  },
};

const FEATURES = [
  "Unlimited resumes",
  "All 5 formats: ATS, US, Europe, India, Fresher",
  "All templates, no lock-ins",
  "Clean PDF export — no watermark",
  "Cover letter generator",
  "Duplicate any resume",
];

export function UpgradeModal({ open, onClose, trigger = "generic" }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copy = TRIGGER_COPY[trigger] ?? TRIGGER_COPY.generic;

  async function handlePayment() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/razorpay/create-order", { method: "POST" });
      if (!res.ok) throw new Error("Could not start checkout. Please try again.");
      const { orderId, amount, currency, keyId } = await res.json();

      const options = {
        key: keyId,
        amount,
        currency,
        order_id: orderId,
        name: "Resume Builder Lite",
        description: "Premium — one-time unlock",
        handler: function () {
          window.location.reload();
        },
        theme: { color: "#2F5D4E" },
      };

      // @ts-expect-error — Razorpay is loaded via script tag, see app/layout or checkout script
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-gold">Premium · ₹999 once</p>
        <h2 className="mt-2 font-display text-2xl text-ink">{copy.headline}</h2>
        <p className="mt-2 text-sm text-muted">{copy.sub}</p>
      </div>

      <ul className="mt-6 space-y-2.5">
        {FEATURES.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-ink">
            <span className="mt-0.5 text-accent">✓</span>
            {feature}
          </li>
        ))}
      </ul>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-7 flex flex-col gap-2.5">
        <Button variant="gold" size="lg" onClick={handlePayment} disabled={loading}>
          {loading ? "Starting checkout…" : "Unlock Premium — ₹999"}
        </Button>
        <Button variant="ghost" size="md" onClick={onClose}>
          Maybe later
        </Button>
      </div>
    </Modal>
  );
}
