// components/editor/EducationForm.tsx
"use client";

import { v4 as uuidv4 } from "uuid";
import { EducationEntry } from "@/types/resume";
import { Field, TextInput, TextArea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

interface EducationFormProps {
  value: EducationEntry[];
  onChange: (value: EducationEntry[]) => void;
}

function emptyEntry(): EducationEntry {
  return {
    id: uuidv4(),
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    details: "",
  };
}

export function EducationForm({ value, onChange }: EducationFormProps) {
  function updateEntry(id: string, patch: Partial<EducationEntry>) {
    onChange(value.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
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
              Education {i + 1}
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
            <Field label="Institution" htmlFor={`institution-${entry.id}`}>
              <TextInput
                id={`institution-${entry.id}`}
                value={entry.institution}
                onChange={(e) => updateEntry(entry.id, { institution: e.target.value })}
                placeholder="Delhi University"
              />
            </Field>
            <Field label="Degree" htmlFor={`degree-${entry.id}`}>
              <TextInput
                id={`degree-${entry.id}`}
                value={entry.degree}
                onChange={(e) => updateEntry(entry.id, { degree: e.target.value })}
                placeholder="B.A. Economics"
              />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Field of study" htmlFor={`field-${entry.id}`} optional>
              <TextInput
                id={`field-${entry.id}`}
                value={entry.fieldOfStudy ?? ""}
                onChange={(e) => updateEntry(entry.id, { fieldOfStudy: e.target.value })}
                placeholder="Economics"
              />
            </Field>
            <Field label="Start date" htmlFor={`edu-start-${entry.id}`}>
              <TextInput
                id={`edu-start-${entry.id}`}
                type="month"
                value={entry.startDate}
                onChange={(e) => updateEntry(entry.id, { startDate: e.target.value })}
              />
            </Field>
            <Field label="End date" htmlFor={`edu-end-${entry.id}`}>
              <TextInput
                id={`edu-end-${entry.id}`}
                type="month"
                value={entry.endDate}
                disabled={entry.isCurrent}
                onChange={(e) => updateEntry(entry.id, { endDate: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Details" htmlFor={`details-${entry.id}`} optional>
            <TextArea
              id={`details-${entry.id}`}
              rows={2}
              value={entry.details ?? ""}
              onChange={(e) => updateEntry(entry.id, { details: e.target.value })}
              placeholder="Relevant coursework, honors, GPA"
            />
          </Field>
        </div>
      ))}

      <Button variant="secondary" onClick={addEntry} type="button">
        + Add education
      </Button>
    </div>
  );
}
