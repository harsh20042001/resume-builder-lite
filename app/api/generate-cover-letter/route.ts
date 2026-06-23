// app/api/generate-cover-letter/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { data: userRow } = await supabase
    .from("users")
    .select("is_premium")
    .eq("id", user.id)
    .single();

  if (!userRow?.is_premium) {
    return NextResponse.json({ error: "Cover letters require Premium." }, { status: 403 });
  }

  const { resumeId, jobTitle, companyName } = await req.json();

  const { data: resume } = await supabase
    .from("resumes")
    .select("content")
    .eq("id", resumeId)
    .eq("user_id", user.id)
    .single();

  if (!resume) {
    return NextResponse.json({ error: "Resume not found." }, { status: 404 });
  }

  const { personalInfo, summary, experience, skills } = resume.content;

  const prompt = `Write a concise, professional cover letter (under 300 words) for the role of "${jobTitle}" at "${companyName}".

Candidate details:
Name: ${personalInfo.fullName}
Current title: ${personalInfo.title}
Summary: ${summary}
Key skills: ${skills.join(", ")}
Most recent role: ${experience[0] ? `${experience[0].role} at ${experience[0].company}` : "N/A"}

Write in first person, warm but professional tone, no generic filler phrases. Do not include a letterhead or date — just the body paragraphs. End with a simple closing line, no signature block.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const letterText = data.content
      .map((block: { type: string; text?: string }) => (block.type === "text" ? block.text : ""))
      .filter(Boolean)
      .join("\n");

    await supabase.from("cover_letters").insert({
      resume_id: resumeId,
      content: letterText,
    });

    return NextResponse.json({ content: letterText });
  } catch (err) {
    console.error("Cover letter generation failed", err);
    return NextResponse.json({ error: "Could not generate cover letter." }, { status: 500 });
  }
}
