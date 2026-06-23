// app/(marketing)/layout.tsx
import Link from "next/link";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="border-b border-rule bg-paper">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-lg text-ink">
            Resume Builder Lite
          </Link>
          <nav className="flex items-center gap-6 text-sm text-ink/80">
            <Link href="/pricing" className="hover:text-ink">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-ink">
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="rounded-sm bg-ink px-4 py-2 text-paper hover:bg-ink/90"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
