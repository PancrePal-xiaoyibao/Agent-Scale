import { NextRequest, NextResponse } from "next/server";
import { hashApiKey } from "@/lib/auth";
import { calculateScore } from "@/lib/scoring/engine";
import { isPostgresError } from "@/lib/postgres";
import { findTemplateBySlug } from "@/lib/templates";
import { completeSession, expireSession, getSessionByTokenHash } from "@/lib/store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const tokenHash = await hashApiKey(token);

  const session = await getSessionByTokenHash(tokenHash);

  if (!session) {
    return NextResponse.json({ error: "Invalid session token" }, { status: 404 });
  }

  if (session.status === "completed") {
    return NextResponse.json({ error: "Session already completed" }, { status: 409 });
  }

  if (session.status === "expired" || new Date(session.expires_at) < new Date()) {
    if (session.status !== "expired") {
      await expireSession(session.id);
    }
    return NextResponse.json({ error: "Session has expired" }, { status: 410 });
  }

  let body: { answers: Record<string, number> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.answers || typeof body.answers !== "object") {
    return NextResponse.json({ error: "answers object is required" }, { status: 400 });
  }

  const template = findTemplateBySlug(session.template_slug);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const schema = template.schema;
  const requiredIds = schema.questions
    .filter((q) => q.required)
    .map((q) => q.id);

  const missingQuestions = requiredIds.filter((id) => !(id in body.answers));
  if (missingQuestions.length > 0) {
    return NextResponse.json(
      { error: "Missing required answers", missing: missingQuestions },
      { status: 400 }
    );
  }

  const scoringRules = template.scoring_rules;
  const scoreResult = calculateScore(body.answers, scoringRules);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const ua = request.headers.get("user-agent") || null;

  try {
    await completeSession({
      sessionId: session.id,
      answers: body.answers,
      rawScore: scoreResult.raw_score,
      dimensionScores: scoreResult.dimension_scores,
      riskLevel: scoreResult.risk_level,
      completedAt: new Date().toISOString(),
      ipAddress: ip,
      userAgent: ua,
    });
  } catch (error) {
    if (isPostgresError(error) && error.code === "23505") {
      return NextResponse.json({ error: "Session already completed" }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to save response" }, { status: 500 });
  }

  const detailItems = template.schema.questions.map((q) => {
    const value = body.answers[q.id] ?? 0;
    return {
      question_id: q.id,
      question_text: q.text,
      selected_value: value,
      selected_label: q.options.find((o) => o.value === value)?.label ?? null,
    };
  });

  const maxScore = Math.max(
    ...template.scoring_rules.risk_levels.map((r) => r.max)
  );

  const fullResult = {
    raw_score: scoreResult.raw_score,
    max_score: maxScore,
    risk_level: scoreResult.risk_level,
    dimension_scores: scoreResult.dimension_scores,
    completed_at: new Date().toISOString(),
    items: detailItems,
  };

  if (session.callback_url) {
    fetch(session.callback_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "session.completed",
        session_id: session.id,
        result: fullResult,
      }),
    }).catch(() => {});
  }

  return NextResponse.json({
    status: "completed",
    result: fullResult,
  });
}
