import { NextRequest, NextResponse } from "next/server";
import { findTemplateBySlug, getTemplateSummary } from "@/lib/templates";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const template = findTemplateBySlug(slug);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  const summary = getTemplateSummary(slug)!;

  return NextResponse.json({
    ...summary,
    schema: template.schema,
    scoring_rules: {
      method: template.scoring_rules.method,
      risk_levels: template.scoring_rules.risk_levels,
      dimensions: template.scoring_rules.dimensions ?? [],
    },
  });
}
