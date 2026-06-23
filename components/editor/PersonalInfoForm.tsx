// components/editor/PersonalInfoForm.tsx
"use client";

import { PersonalInfo } from "@/types/resume";
import { FormatConfig } from "@/lib/formatConfig";
import { Field, TextInput } from "@/components/ui/Field";

interface PersonalInfoFormProps {
  value: PersonalInfo;
  onChange: (value: PersonalInfo) => void;
  format: FormatConfig;
}

export function PersonalInfoForm({ value, onChange, format }: PersonalInfoFormProps) {
  function update<K extends keyof PersonalInfo>(key: K, val: PersonalInfo[K]) {
    onChange({ ...value, [key]: val });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Full name" htmlFor="fullName">
          <TextInput
            id="fullName"
            value={value.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="Aanya Sharma"
          />
        </Field>
        <Field label="Title / headline" htmlFor="title">
          <TextInput
            id="title"
            value={value.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Product Designer"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Email" htmlFor="email">
          <TextInput
            id="email"
            type="email"
            value={value.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="aanya@email.com"
          />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <TextInput
            id="phone"
            value={value.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+91 98765 43210"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Location" htmlFor="location">
          <TextInput
            id="location"
            value={value.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="Bengaluru, India"
          />
        </Field>
        <Field label="LinkedIn" htmlFor="linkedin" optional>
          <TextInput
            id="linkedin"
            value={value.linkedin ?? ""}
            onChange={(e) => update("linkedin", e.target.value)}
            placeholder="linkedin.com/in/aanya"
          />
        </Field>
      </div>

      {format.showNationality && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Date of birth" htmlFor="dob" optional>
            <TextInput
              id="dob"
              type="date"
              value={value.dateOfBirth ?? ""}
              onChange={(e) => update("dateOfBirth", e.target.value)}
            />
          </Field>
          <Field label="Nationality" htmlFor="nationality" optional>
            <TextInput
              id="nationality"
              value={value.nationality ?? ""}
              onChange={(e) => update("nationality", e.target.value)}
              placeholder="Indian"
            />
          </Field>
        </div>
      )}

      {format.showPhoto && (
        <Field label="Photo URL" htmlFor="photoUrl" optional>
          <TextInput
            id="photoUrl"
            value={value.photoUrl ?? ""}
            onChange={(e) => update("photoUrl", e.target.value)}
            placeholder="https://…"
          />
        </Field>
      )}
    </div>
  );
}
