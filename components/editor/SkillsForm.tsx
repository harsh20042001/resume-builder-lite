// components/editor/SkillsForm.tsx
"use client";

import { useState } from "react";
import { TextInput } from "@/components/ui/Field";

interface SkillsFormProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function SkillsForm({ value, onChange }: SkillsFormProps) {
  const [draft, setDraft] = useState("");

  function addSkill() {
    const trimmed = draft.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setDraft("");
  }

  function removeSkill(skill: string) {
    onChange(value.filter((s) => s !== skill));
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <TextInput
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
          placeholder="Type a skill and press Enter — e.g. Figma"
          className="flex-1"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1.5 rounded-full bg-accentSoft px-3 py-1 text-sm text-accent"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="text-accent/60 hover:text-accent"
              type="button"
              aria-label={`Remove ${skill}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
