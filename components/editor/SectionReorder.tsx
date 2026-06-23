// components/editor/SectionReorder.tsx
"use client";

interface SectionReorderProps {
  sectionOrder: string[];
  sectionLabels: Record<string, string>;
  onChange: (order: string[]) => void;
  disabled?: boolean;
}

export function SectionReorder({
  sectionOrder,
  sectionLabels,
  onChange,
  disabled,
}: SectionReorderProps) {
  function move(index: number, direction: -1 | 1) {
    const next = [...sectionOrder];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-1.5">
      {disabled && (
        <p className="mb-2 text-xs text-muted">
          Section reordering is a Premium feature. Upgrade to rearrange sections.
        </p>
      )}
      {sectionOrder.map((sectionId, i) => (
        <div
          key={sectionId}
          className={`flex items-center justify-between rounded-sm border border-rule px-3 py-2 text-sm ${
            disabled ? "opacity-50" : ""
          }`}
        >
          <span className="text-ink">{sectionLabels[sectionId] ?? sectionId}</span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={disabled || i === 0}
              onClick={() => move(i, -1)}
              className="rounded-sm px-2 py-0.5 text-muted hover:bg-rule/30 disabled:opacity-30"
              aria-label="Move up"
            >
              ↑
            </button>
            <button
              type="button"
              disabled={disabled || i === sectionOrder.length - 1}
              onClick={() => move(i, 1)}
              className="rounded-sm px-2 py-0.5 text-muted hover:bg-rule/30 disabled:opacity-30"
              aria-label="Move down"
            >
              ↓
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
