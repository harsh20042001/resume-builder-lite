// components/editor/ProjectsForm.tsx
"use client";

import { v4 as uuidv4 } from "uuid";
import { ProjectEntry } from "@/types/resume";
import { Field, TextInput, TextArea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

interface ProjectsFormProps {
  value: ProjectEntry[];
  onChange: (value: ProjectEntry[]) => void;
}

function emptyEntry(): ProjectEntry {
  return { id: uuidv4(), name: "", description: "", link: "" };
}

export function ProjectsForm({ value, onChange }: ProjectsFormProps) {
  function updateEntry(id: string, patch: Partial<ProjectEntry>) {
    onChange(value.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function addEntry() {
    onChange([...value, emptyEntry()]);
  }

  function removeEntry(id: string) {
    onChange(value.filter((e) => e.id !== id));
  }

  return (
    <div className="space-y-5">
      {value.map((entry, i) => (
        <div key={entry.id} className="rounded-sm border border-rule p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs uppercase tracking-wide text-muted">Project {i + 1}</p>
            <button
              onClick={() => removeEntry(entry.id)}
              className="text-xs text-muted hover:text-red-600"
              type="button"
            >
              Remove
            </button>
          </div>
          <Field label="Project name" htmlFor={`proj-name-${entry.id}`}>
            <TextInput
              id={`proj-name-${entry.id}`}
              value={entry.name}
              onChange={(e) => updateEntry(entry.id, { name: e.target.value })}
              placeholder="Campus Event Finder App"
            />
          </Field>
          <Field label="Description" htmlFor={`proj-desc-${entry.id}`}>
            <TextArea
              id={`proj-desc-${entry.id}`}
              rows={2}
              value={entry.description}
              onChange={(e) => updateEntry(entry.id, { description: e.target.value })}
              placeholder="What you built and the impact or outcome"
            />
          </Field>
          <Field label="Link" htmlFor={`proj-link-${entry.id}`} optional>
            <TextInput
              id={`proj-link-${entry.id}`}
              value={entry.link ?? ""}
              onChange={(e) => updateEntry(entry.id, { link: e.target.value })}
              placeholder="github.com/you/project"
            />
          </Field>
        </div>
      ))}
      <Button variant="secondary" size="sm" onClick={addEntry} type="button">
        + Add project
      </Button>
    </div>
  );
}
