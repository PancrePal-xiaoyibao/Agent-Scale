import type { TemplateDefinition, Response as AssessmentResponse } from "@/types/database";

export interface AnswerDetail {
  question_id: string;
  question_text: string;
  description: string | null;
  selected_value: number;
  selected_label: string | null;
}

export interface DetailedResult {
  raw_score: number;
  max_score: number;
  risk_level: string;
  dimension_scores: Record<string, number> | null;
  completed_at: string;
  items: AnswerDetail[];
}

export function buildDetailedResult(
  response: AssessmentResponse,
  template: TemplateDefinition
): DetailedResult {
  const maxScore = Math.max(
    ...template.scoring_rules.risk_levels.map((r) => r.max)
  );

  const items: AnswerDetail[] = template.schema.questions.map((q) => {
    const value = response.answers[q.id] ?? 0;
    return {
      question_id: q.id,
      question_text: q.text,
      description: q.description ?? null,
      selected_value: value,
      selected_label: q.options.find((o) => o.value === value)?.label ?? null,
    };
  });

  return {
    raw_score: response.raw_score,
    max_score: maxScore,
    risk_level: response.risk_level,
    dimension_scores: response.dimension_scores,
    completed_at: response.completed_at,
    items,
  };
}
