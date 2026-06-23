// lib/pdfDocument.tsx
//
// @react-pdf/renderer cannot render arbitrary HTML/Tailwind — it has its own
// primitive components (Document, Page, View, Text) and StyleSheet API.
// This mirrors ResumeDocument's format-driven logic but targets those
// primitives so the exported PDF matches the on-screen preview.

import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { ResumeContent } from "@/types/resume";
import { FormatConfig, formatDate } from "@/lib/formatConfig";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#1C1A17" },
  header: { borderBottomWidth: 1, borderBottomColor: "#D8D2C4", paddingBottom: 12, marginBottom: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  name: { fontSize: 22, fontFamily: "Helvetica-Bold" },
  title: { fontSize: 12, color: "#2F5D4E", marginTop: 2 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
  contactItem: { fontSize: 8, color: "#6B6358" },
  photo: { width: 64, height: 64, objectFit: "cover" },
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#2F5D4E",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 5,
  },
  bodyText: { fontSize: 9.5, lineHeight: 1.4 },
  entryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
  entryTitle: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  entrySub: { fontSize: 9, color: "#6B6358" },
  entryDate: { fontSize: 8, color: "#6B6358" },
  bullet: { flexDirection: "row", marginTop: 2, paddingLeft: 4 },
  bulletDot: { width: 10, fontSize: 9 },
  bulletText: { fontSize: 9.5, flex: 1, lineHeight: 1.4 },
  watermark: {
    position: "absolute",
    top: 320,
    left: 60,
    fontSize: 40,
    color: "#1C1A17",
    opacity: 0.06,
    transform: "rotate(-30deg)",
  },
});

interface PdfDocumentProps {
  content: ResumeContent;
  format: FormatConfig;
  watermark?: boolean;
}

export function PdfDocument({ content, format, watermark = false }: PdfDocumentProps) {
  const { personalInfo } = content;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {watermark && <Text style={styles.watermark}>RESUME BUILDER LITE — FREE</Text>}

        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.name}>{personalInfo.fullName || "Your Name"}</Text>
              <Text style={styles.title}>{personalInfo.title || "Your Title"}</Text>
              <View style={styles.contactRow}>
                {personalInfo.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
                {personalInfo.phone && <Text style={styles.contactItem}>{personalInfo.phone}</Text>}
                {personalInfo.location && <Text style={styles.contactItem}>{personalInfo.location}</Text>}
                {personalInfo.linkedin && <Text style={styles.contactItem}>{personalInfo.linkedin}</Text>}
              </View>
            </View>
            {format.showPhoto && personalInfo.photoUrl && (
              <Image src={personalInfo.photoUrl} style={styles.photo} />
            )}
          </View>
        </View>

        {content.sectionOrder
          .filter((id) => format.sectionOrder.includes(id))
          .map((sectionId) => {
            if (sectionId === "summary" && content.summary) {
              return (
                <View key="summary" style={styles.section}>
                  <Text style={styles.sectionTitle}>{format.summaryLabel}</Text>
                  <Text style={styles.bodyText}>{content.summary}</Text>
                </View>
              );
            }

            if (sectionId === "experience" && content.experience.length > 0) {
              return (
                <View key="experience" style={styles.section}>
                  <Text style={styles.sectionTitle}>Experience</Text>
                  {content.experience.map((exp) => (
                    <View key={exp.id} style={{ marginBottom: 6 }}>
                      <View style={styles.entryRow}>
                        <Text style={styles.entryTitle}>
                          {exp.role} · {exp.company}
                        </Text>
                        <Text style={styles.entryDate}>
                          {formatDate(exp.startDate, format.dateFormat)} —{" "}
                          {exp.isCurrent ? "Present" : formatDate(exp.endDate, format.dateFormat)}
                        </Text>
                      </View>
                      {exp.bullets.filter(Boolean).map((b, i) => (
                        <View key={i} style={styles.bullet}>
                          <Text style={styles.bulletDot}>•</Text>
                          <Text style={styles.bulletText}>{b}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              );
            }

            if (sectionId === "education" && content.education.length > 0) {
              return (
                <View key="education" style={styles.section}>
                  <Text style={styles.sectionTitle}>Education</Text>
                  {content.education.map((edu) => (
                    <View key={edu.id} style={{ marginBottom: 4 }}>
                      <View style={styles.entryRow}>
                        <Text style={styles.entryTitle}>
                          {edu.degree}
                          {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""} · {edu.institution}
                        </Text>
                        <Text style={styles.entryDate}>
                          {formatDate(edu.startDate, format.dateFormat)} —{" "}
                          {edu.isCurrent ? "Present" : formatDate(edu.endDate, format.dateFormat)}
                        </Text>
                      </View>
                      {edu.details && <Text style={styles.bodyText}>{edu.details}</Text>}
                    </View>
                  ))}
                </View>
              );
            }

            if (sectionId === "skills" && content.skills.length > 0) {
              return (
                <View key="skills" style={styles.section}>
                  <Text style={styles.sectionTitle}>Skills</Text>
                  <Text style={styles.bodyText}>{content.skills.join("  ·  ")}</Text>
                </View>
              );
            }

            if (sectionId === "certifications" && content.certifications.length > 0) {
              return (
                <View key="certifications" style={styles.section}>
                  <Text style={styles.sectionTitle}>Certifications</Text>
                  {content.certifications.map((cert) => (
                    <Text key={cert.id} style={styles.bodyText}>
                      {cert.name} — {cert.issuer} ({formatDate(cert.date, format.dateFormat)})
                    </Text>
                  ))}
                </View>
              );
            }

            if (sectionId === "projects" && content.projects.length > 0) {
              return (
                <View key="projects" style={styles.section}>
                  <Text style={styles.sectionTitle}>Projects</Text>
                  {content.projects.map((proj) => (
                    <View key={proj.id} style={{ marginBottom: 4 }}>
                      <Text style={styles.entryTitle}>{proj.name}</Text>
                      <Text style={styles.bodyText}>{proj.description}</Text>
                    </View>
                  ))}
                </View>
              );
            }

            if (sectionId === "languages" && content.languages.length > 0) {
              return (
                <View key="languages" style={styles.section}>
                  <Text style={styles.sectionTitle}>Languages</Text>
                  <Text style={styles.bodyText}>
                    {content.languages.map((l) => `${l.name} (${l.proficiency})`).join("  ·  ")}
                  </Text>
                </View>
              );
            }

            return null;
          })}

        {content.customSections.map((custom) => (
          <View key={custom.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{custom.title}</Text>
            <Text style={styles.bodyText}>{custom.content}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
