import { NextRequest, NextResponse } from "next/server";
import { generateSessionToken, hashApiKey } from "@/lib/auth";
import { findTemplateBySlug } from "@/lib/templates";
import { createSession, getOrCreateWalkInAgent } from "@/lib/store";

export async function POST(request: NextRequest) {
  let body: { template_slug: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.template_slug) {
    return NextResponse.json({ error: "template_slug is required" }, { status: 400 });
  }

  const template = findTemplateBySlug(body.template_slug);

  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const walkInAgent = await getOrCreateWalkInAgent();

  const token = generateSessionToken();
  const tokenHash = await hashApiKey(token);
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

  try {
    const session = await createSession({
      agentId: walkInAgent.id,
      templateId: template.id,
      templateSlug: template.slug,
      tokenHash,
      expiresAt,
      callbackUrl: null,
      status: "pending",
    });

    const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;

    return NextResponse.json({
      assessment_url: `${baseUrl}/s/${token}`,
      session_id: session.id,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
