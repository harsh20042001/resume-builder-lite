// components/editor/LanguagesForm.tsx
"use client";

import { v4 as uuidv4 } from "uuid";
import { LanguageEntry } from "@/types/resume";
import { Field, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

interface LanguagesFormProps {
  value: LanguageEntry[];
  onChange: (value: LanguageEntry[]) => void;
}

const PROFICIENCIES: LanguageEntry["proficiency"][] = [
  "Basic",
  "Conversational",
  "Fluent",
  "Native",
];

function emptyEntry(): LanguageEntry {
  return { id: uuidv4(), name: "", proficiency: "Conversational" };
}

export function LanguagesForm({ value, onChange }: LanguagesFormProps) {
  function updateEntry(id: string, patch: Partial<LanguageEntry>) {
    onChange(value.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function addEntry() {
    onChange([...value, emptyEntry()]);
  }

  function removeEntry(id: string) {
    onChange(value.filter((e) => e.id !== id));
  }

  return (
    <div className="space-y-3">
      {value.map((entry, i) => (
        <div key={entry.id} className="grid grid-cols-[1fr_160px_auto] gap-3 items-end">
          <Field label={i === 0 ? "Language" : ""} htmlFor={`lang-name-${entry.id}`}>
            <TextInput
              id={`lang-name-${entry.id}`}
              value={entry.name}
              onChange={(e) => updateEntry(entry.id, { name: e.target.value })}
              placeholder="French"
            />
          </Field>
          <Field label={i === 0 ? "Proficiency" : ""} htmlFor={`lang-prof-${entry.id}`}>
            <select
              id={`lang-prof-${entry.id}`}
              value={entry.proficiency}
              onChange={(e) =>
                updateEntry(entry.id, {
                  proficiency: e.target.value as LanguageEntry["proficiency"],
                })
              }
              className="rounded-sm border border-rule bg-paper px-3 py-2 text-sm text-ink focus:border-accent"
            >
              {PROFICIENCIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>
          <button
            onClick={() => removeEntry(entry.id)}
            className="mb-2 text-xs text-muted hover:text-red-600"
            type="button"
          >
            Remove
          </button>
        </div>
      ))}
      <Button variant="secondary" size="sm" onClick={addEntry} type="button">
        + Add language
      </Button>
    </div>
  );
}
