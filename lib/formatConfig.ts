// lib/formatConfig.ts
//
// This is the entire "global format logic" for the app. Each resume format
// (ATS / US / Europe / India / Fresher) is just a config object. Templates
// (visual skins) read this config to decide section order, photo visibility,
// date formatting, and labels — there is no per-format rendering logic
// duplicated across templates.

import { FormatId } from "@/types/resume";

export type DateFormatStyle = "MM/YYYY" | "Month YYYY" | "DD/MM/YYYY";

export interface FormatConfig {
  id: FormatId;
  label: string;
  shortDescription: string;
  sectionOrder: string[];
  showPhoto: boolean;
  showDateOfBirth: boolean;
  showNationality: boolean;
  maxPages: number;
  dateFormat: DateFormatStyle;
  summaryLabel: string;
  summaryGuidance: string; // shown as placeholder/help text in the editor
  toneNote: string;
  layoutNote: string;
  /** Whether this format is available on the free tier */
  freeTier: boolean;
}

export const FORMAT_CONFIGS: Record<FormatId, FormatConfig> = {
  ats: {
    id: "ats",
    label: "ATS Resume",
    shortDescription: "Parses cleanly through applicant tracking systems.",
    sectionOrder: [
      "summary",
      "skills",
      "experience",
      "education",
      "certifications",
    ],
    showPhoto: false,
    showDateOfBirth: false,
    showNationality: false,
    maxPages: 1,
    dateFormat: "MM/YYYY",
    summaryLabel: "Summary",
    summaryGuidance:
      "2-3 lines, keyword-rich. Mention your role, years of experience, and 2-3 core skills the system should match on.",
    toneNote: "Plain, literal, keyword-dense. No graphics or icons.",
    layoutNote: "Single column. Standard fonts. No tables, text boxes, or headers/footers.",
    freeTier: true,
  },
  us: {
    id: "us",
    label: "US Resume",
    shortDescription: "Achievement-driven format for US employers.",
    sectionOrder: ["summary", "experience", "education", "skills", "projects"],
    showPhoto: false,
    showDateOfBirth: false,
    showNationality: false,
    maxPages: 1,
    dateFormat: "Month YYYY",
    summaryLabel: "Professional Summary",
    summaryGuidance:
      "Optional. If used, 2-3 lines focused on impact and seniority, not job duties.",
    toneNote: "Action verbs, quantified achievements. No personal details (age, marital status, photo).",
    layoutNote: "Clean, minimal, one page unless 10+ years of experience.",
    freeTier: false,
  },
  europe: {
    id: "europe",
    label: "Europe CV",
    shortDescription: "Structured CV format common across the EU.",
    sectionOrder: [
      "summary",
      "experience",
      "education",
      "languages",
      "skills",
      "certifications",
    ],
    showPhoto: true,
    showDateOfBirth: true,
    showNationality: true,
    maxPages: 2,
    dateFormat: "DD/MM/YYYY",
    summaryLabel: "Personal Profile",
    summaryGuidance: "3-4 lines, formal register. A brief professional self-introduction.",
    toneNote: "Formal. Personal details like nationality and date of birth are commonly included.",
    layoutNote: "Sectioned, structured layout. Photo in the top corner is conventional.",
    freeTier: false,
  },
  india: {
    id: "india",
    label: "India Professional Resume",
    shortDescription: "Qualification-forward format for the Indian job market.",
    sectionOrder: [
      "summary",
      "experience",
      "education",
      "skills",
      "certifications",
      "projects",
      "languages",
    ],
    showPhoto: false,
    showDateOfBirth: false,
    showNationality: false,
    maxPages: 2,
    dateFormat: "DD/MM/YYYY",
    summaryLabel: "Career Objective",
    summaryGuidance: "3-4 lines. State your role, key qualification, and what you're looking for next.",
    toneNote: "Formal and respectful. Education is given strong prominence.",
    layoutNote: "Education section sits higher than in US format. Languages section is common.",
    freeTier: true,
  },
  fresher: {
    id: "fresher",
    label: "Fresher Resume",
    shortDescription: "For students and first-time job seekers with little work history.",
    sectionOrder: [
      "summary",
      "education",
      "skills",
      "projects",
      "certifications",
    ],
    showPhoto: false,
    showDateOfBirth: false,
    showNationality: false,
    maxPages: 1,
    dateFormat: "Month YYYY",
    summaryLabel: "Objective",
    summaryGuidance:
      "2-3 forward-looking lines. What you're eager to contribute and learn, not what you lack in experience.",
    toneNote: "Eager, potential-focused. No work history required.",
    layoutNote: "Education and projects pushed above experience. Skills section emphasized.",
    freeTier: false,
  },
};

export const FORMAT_LIST: FormatConfig[] = Object.values(FORMAT_CONFIGS);

export function getFormatConfig(id: FormatId): FormatConfig {
  return FORMAT_CONFIGS[id];
}

/** Formats a YYYY-MM date string per the format's date style. Empty string passes through. */
export function formatDate(isoMonth: string, style: DateFormatStyle): string {
  if (!isoMonth) return "";
  const [year, month] = isoMonth.split("-");
  if (!year || !month) return isoMonth;

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const monthIndex = parseInt(month, 10) - 1;

  switch (style) {
    case "MM/YYYY":
      return `${month}/${year}`;
    case "DD/MM/YYYY":
      // Resume dates are month-precision; render as 01/MM/YYYY for a consistent day field.
      return `01/${month}/${year}`;
    case "Month YYYY":
    default:
      return `${monthNames[monthIndex] ?? month} ${year}`;
  }
}
