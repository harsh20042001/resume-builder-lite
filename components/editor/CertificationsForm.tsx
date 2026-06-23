// components/editor/CertificationsForm.tsx
"use client";

import { v4 as uuidv4 } from "uuid";
import { CertificationEntry } from "@/types/resume";
import { Field, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

interface CertificationsFormProps {
  value: CertificationEntry[];
  onChange: (value: CertificationEntry[]) => void;
}

function emptyEntry(): CertificationEntry {
  return { id: uuidv4(), name: "", issuer: "", date: "" };
}

export function CertificationsForm({ value, onChange }: CertificationsFormProps) {
  function updateEntry(id: string, patch: Partial<CertificationEntry>) {
    onChange(value.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function addEntry() {
    onChange([...value, emptyEntry()]);
  }

  function removeEntry(id: string) {
    onChange(value.filter((e) => e.id !== id));
  }

  return (
    <div className="space-y-4">
      {value.map((entry, i) => (
        <div key={entry.id} className="grid grid-cols-[1fr_1fr_140px_auto] gap-3 items-end">
          <Field label={i === 0 ? "Certification" : ""} htmlFor={`cert-name-${entry.id}`}>
            <TextInput
              id={`cert-name-${entry.id}`}
              value={entry.name}
              onChange={(e) => updateEntry(entry.id, { name: e.target.value })}
              placeholder="AWS Certified Developer"
            />
          </Field>
          <Field label={i === 0 ? "Issuer" : ""} htmlFor={`cert-issuer-${entry.id}`}>
            <TextInput
              id={`cert-issuer-${entry.id}`}
              value={entry.issuer}
              onChange={(e) => updateEntry(entry.id, { issuer: e.target.value })}
              placeholder="Amazon"
            />
          </Field>
          <Field label={i === 0 ? "Date" : ""} htmlFor={`cert-date-${entry.id}`}>
            <TextInput
              id={`cert-date-${entry.id}`}
              type="month"
              value={entry.date}
              onChange={(e) => updateEntry(entry.id, { date: e.target.value })}
            />
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
        + Add certification
      </Button>
    </div>
  );
}
