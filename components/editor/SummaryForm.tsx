// components/editor/SummaryForm.tsx
"use client";

import { FormatConfig } from "@/lib/formatConfig";
import { Field, TextArea } from "@/components/ui/Field";

interface SummaryFormProps {
  value: string;
  onChange: (value: string) => void;
  format: FormatConfig;
}

export function SummaryForm({ value, onChange, format }: SummaryFormProps) {
  return (
    <div className="space-y-2">
      <Field label={format.summaryLabel} htmlFor="summary">
        <TextArea
          id="summary"
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={format.summaryGuidance}
        />
      </Field>
      <p className="text-xs text-muted">{format.summaryGuidance}</p>
    </div>
  );
}
