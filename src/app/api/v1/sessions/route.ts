import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey, generateSessionToken, hashApiKey } from "@/lib/auth";
import { findTemplateById, findTemplateBySlug } from "@/lib/templates";
import { createSession, listSessionsByAgent } from "@/lib/store";

export async function POST(request: NextRequest) {
  const agent = await verifyApiKey(request);
  if (!agent) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 });
  }

  let body: {
    template_id?: string;
    template_slug?: string;
    callback_url?: string;
    expires_in?: number;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  let template = null;

  if (body.template_slug) {
    template = findTemplateBySlug(body.template_slug);
  } else if (body.template_id) {
    template = findTemplateById(body.template_id);
  } else {
    return NextResponse.json(
      { error: "template_id or template_slug is required" },
      { status: 400 }
    );
  }

  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const token = generateSessionToken();
  const tokenHash = await hashApiKey(token);

  const expiresIn = body.expires_in || 24 * 60 * 60;
  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

  let session;
  try {
    session = await createSession({
      agentId: agent.id,
      templateId: template.id,
      templateSlug: template.slug,
      tokenHash,
      expiresAt,
      callbackUrl: body.callback_url || null,
      status: "pending",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }

  const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;

  return NextResponse.json({
    session_id: session.id,
    assessment_url: `${baseUrl}/s/${token}`,
    expires_at: expiresAt,
    template: {
      id: template.id,
      slug: template.slug,
      name: template.name,
    },
  }, { status: 201 });
}

export async function GET(request: NextRequest) {
  const agent = await verifyApiKey(request);
  if (!agent) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 });
  }

  try {
    const sessions = (await listSessionsByAgent(agent.id)).map((session) => {
      const template = findTemplateBySlug(session.template_slug);

      return {
        ...session,
        template_id: template?.id ?? session.template_id,
      };
    });

    return NextResponse.json({ sessions });
  } catch {
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}
