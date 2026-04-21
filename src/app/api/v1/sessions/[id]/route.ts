import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/auth";
import { findTemplateBySlug } from "@/lib/templates";
import {
  expireSession,
  getResponseBySessionId,
  getSessionByIdForAgent,
} from "@/lib/store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const agent = await verifyApiKey(request);
  if (!agent) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 });
  }

  const { id } = await params;

  const session = await getSessionByIdForAgent(id, agent.id);

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.status === "pending" && new Date(session.expires_at) < new Date()) {
    await expireSession(id);
    session.status = "expired";
  }

  let response = null;
  if (session.status === "completed") {
    response = await getResponseBySessionId(id);
  }

  const template = findTemplateBySlug(session.template_slug);

  return NextResponse.json({
    session: {
      id: session.id,
      status: session.status,
      created_at: session.created_at,
      expires_at: session.expires_at,
      completed_at: session.completed_at,
      template: template
        ? {
            id: template.id,
            slug: template.slug,
            name: template.name,
          }
        : null,
    },
    result: response
      ? {
          answers: response.answers,
          raw_score: response.raw_score,
          dimension_scores: response.dimension_scores,
          risk_level: response.risk_level,
          completed_at: response.completed_at,
        }
      : null,
  });
}
