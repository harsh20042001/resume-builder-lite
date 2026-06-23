// app/api/export-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { getFormatConfig } from "@/lib/formatConfig";
import { PdfDocument } from "@/lib/pdfDocument";
import { FormatId } from "@/types/resume";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { resumeId } = await req.json();

  const [{ data: resume, error }, { data: userRow }] = await Promise.all([
    supabase.from("resumes").select("*").eq("id", resumeId).eq("user_id", user.id).single(),
    supabase.from("users").select("is_premium").eq("id", user.id).single(),
  ]);

  if (error || !resume) {
    return NextResponse.json({ error: "Resume not found." }, { status: 404 });
  }

  const isPremium = userRow?.is_premium ?? false;
  const format = getFormatConfig(resume.format_id as FormatId);

  // Free-tier formats are restricted server-side too, not just in the UI.
  if (!isPremium && !format.freeTier) {
    return NextResponse.json(
      { error: "This format requires Premium." },
      { status: 403 }
    );
  }

  const pdfBuffer = await renderToBuffer(
    <PdfDocument content={resume.content} format={format} watermark={!isPremium} />
  );

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${resume.title || "resume"}.pdf"`,
    },
  });
}
