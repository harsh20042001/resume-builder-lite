// components/ui/Badge.tsx

interface BadgeProps {
  children: React.ReactNode;
  tone?: "gold" | "accent" | "muted";
}

const toneClasses: Record<string, string> = {
  gold: "bg-gold/10 text-gold border-gold/30",
  accent: "bg-accentSoft text-accent border-accent/20",
  muted: "bg-rule/30 text-muted border-rule",
};

export function Badge({ children, tone = "muted" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium font-mono uppercase tracking-wide ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
