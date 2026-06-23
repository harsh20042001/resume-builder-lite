// components/editor/ExperienceForm.tsx
"use client";

import { v4 as uuidv4 } from "uuid";
import { ExperienceEntry } from "@/types/resume";
import { Field, TextInput, TextArea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

interface ExperienceFormProps {
  value: ExperienceEntry[];
  onChange: (value: ExperienceEntry[]) => void;
}

function emptyEntry(): ExperienceEntry {
  return {
    id: uuidv4(),
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    bullets: [""],
  };
}

export function ExperienceForm({ value, onChange }: ExperienceFormProps) {
  function updateEntry(id: string, patch: Partial<ExperienceEntry>) {
    onChange(value.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
  }

  function updateBullet(entryId: string, index: number, text: string) {
    const entry = value.find((e) => e.id === entryId);
    if (!entry) return;
    const bullets = [...entry.bullets];
    bullets[index] = text;
    updateEntry(entryId, { bullets });
  }

  function addBullet(entryId: string) {
    const entry = value.find((e) => e.id === entryId);
    if (!entry) return;
    updateEntry(entryId, { bullets: [...entry.bullets, ""] });
  }

  function removeBullet(entryId: string, index: number) {
    const entry = value.find((e) => e.id === entryId);
    if (!entry) return;
    updateEntry(entryId, { bullets: entry.bullets.filter((_, i) => i !== index) });
  }

  function addEntry() {
    onChange([...value, emptyEntry()]);
  }

  function removeEntry(id: string) {
    onChange(value.filter((entry) => entry.id !== id));
  }

  return (
    <div className="space-y-6">
      {value.map((entry, i) => (
        <div key={entry.id} className="rounded-sm border border-rule p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-wide text-muted">
              Position {i + 1}
            </p>
            <button
              onClick={() => removeEntry(entry.id)}
              className="text-xs text-muted hover:text-red-600"
              type="button"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Company" htmlFor={`company-${entry.id}`}>
              <TextInput
                id={`company-${entry.id}`}
                value={entry.company}
                onChange={(e) => updateEntry(entry.id, { company: e.target.value })}
                placeholder="Acme Corp"
              />
            </Field>
            <Field label="Role" htmlFor={`role-${entry.id}`}>
              <TextInput
                id={`role-${entry.id}`}
                value={entry.role}
                onChange={(e) => updateEntry(entry.id, { role: e.target.value })}
                placeholder="Senior Designer"
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Start date" htmlFor={`start-${entry.id}`}>
              <TextInput
                id={`start-${entry.id}`}
                type="month"
                value={entry.startDate}
                onChange={(e) => updateEntry(entry.id, { startDate: e.target.value })}
              />
            </Field>
            <Field label="End date" htmlFor={`end-${entry.id}`}>
              <TextInput
                id={`end-${entry.id}`}
                type="month"
                value={entry.endDate}
                disabled={entry.isCurrent}
                onChange={(e) => updateEntry(entry.id, { endDate: e.target.value })}
              />
            </Field>
            <Field label="Currently here" htmlFor={`current-${entry.id}`}>
              <label className="flex items-center gap-2 pt-2 text-sm text-ink">
                <input
                  id={`current-${entry.id}`}
                  type="checkbox"
                  checked={entry.isCurrent}
                  onChange={(e) =>
                    updateEntry(entry.id, { isCurrent: e.target.checked, endDate: "" })
                  }
                />
                Present
              </label>
            </Field>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-ink">Highlights</p>
            {entry.bullets.map((bullet, bi) => (
              <div key={bi} className="flex gap-2">
                <TextArea
                  rows={2}
                  value={bullet}
                  onChange={(e) => updateBullet(entry.id, bi, e.target.value)}
                  placeholder="Led redesign of onboarding flow, increasing activation by 18%"
                  className="flex-1"
                />
                <button
                  onClick={() => removeBullet(entry.id, bi)}
                  className="text-xs text-muted hover:text-red-600"
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={() => addBullet(entry.id)} type="button">
              + Add highlight
            </Button>
          </div>
        </div>
      ))}

      <Button variant="secondary" onClick={addEntry} type="button">
        + Add position
      </Button>
    </div>
  );
}
