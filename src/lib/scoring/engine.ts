import { ScoringRules } from "@/types/database";

export interface ScoreResult {
  raw_score: number;
  dimension_scores: Record<string, number> | null;
  risk_level: string;
}

export function calculateScore(
  answers: Record<string, number>,
  rules: ScoringRules
): ScoreResult {
  let raw_score = 0;
  let dimension_scores: Record<string, number> | null = null;

  if (rules.method === "sum") {
    raw_score = Object.values(answers).reduce((sum, val) => sum + val, 0);
  }

  if (rules.dimensions && rules.dimensions.length > 0) {
    dimension_scores = {};
    for (const dim of rules.dimensions) {
      dimension_scores[dim.id] = dim.question_ids.reduce(
        (sum, qid) => sum + (answers[qid] ?? 0),
        0
      );
    }
  }

  let risk_level = "unknown";
  for (const level of rules.risk_levels) {
    if (raw_score >= level.min && raw_score <= level.max) {
      risk_level = level.label;
      break;
    }
  }

  return { raw_score, dimension_scores, risk_level };
}
