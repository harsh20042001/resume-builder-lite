// types/resume.ts
// Core data shapes for resume content. Stored as jsonb in `resumes.content`.

export type FormatId = "ats" | "us" | "europe" | "india" | "fresher";

export interface PersonalInfo {
  fullName: string;
  title: string; // e.g. "Product Designer"
  email: string;
  phone: string;
  location: string; // city, country
  linkedin?: string;
  website?: string;
  photoUrl?: string; // only rendered if format.showPhoto is true
  dateOfBirth?: string; // only used by europe/india formats, optional
  nationality?: string; // europe only, optional
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string; // ISO "YYYY-MM" — formatted per-format at render time
  endDate: string; // ISO "YYYY-MM" or "" for present
  isCurrent: boolean;
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  details?: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  link?: string;
}

export interface LanguageEntry {
  id: string;
  name: string;
  proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface ResumeContent {
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  certifications: CertificationEntry[];
  projects: ProjectEntry[];
  languages: LanguageEntry[];
  customSections: CustomSection[];
  sectionOrder: string[]; // ids like "summary", "experience", "education", etc. Premium-only reordering.
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  formatId: FormatId;
  templateId: string;
  content: ResumeContent;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  isPremium: boolean;
  previewImageUrl?: string;
}

export function emptyResumeContent(): ResumeContent {
  return {
    personalInfo: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: [],
    customSections: [],
    sectionOrder: [
      "summary",
      "experience",
      "education",
      "skills",
      "certifications",
      "projects",
      "languages",
    ],
  };
}
