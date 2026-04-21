export interface Agent {
  id: string;
  name: string;
  api_key_hash: string;
  org_id: string;
  created_at: string;
  is_active: boolean;
}

export interface TemplateDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  version: string;
  schema: TemplateSchema;
  scoring_rules: ScoringRules;
}

export interface AssessmentTemplate extends TemplateDefinition {
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  agent_id: string;
  template_id: string | null;
  template_slug: string;
  token_hash: string;
  status: "pending" | "in_progress" | "completed" | "expired";
  expires_at: string;
  callback_url: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface Response {
  id: string;
  session_id: string;
  answers: Record<string, number>;
  raw_score: number;
  dimension_scores: Record<string, number> | null;
  risk_level: string;
  completed_at: string;
}

export interface TemplateSchema {
  instructions: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  description?: string;
  type: "likert" | "single_choice";
  options: Option[];
  required: boolean;
}

export interface Option {
  label: string;
  value: number;
}

export interface ScoringRules {
  method: "sum";
  dimensions?: Dimension[];
  risk_levels: RiskLevel[];
}

export interface Dimension {
  id: string;
  name: string;
  question_ids: string[];
}

export interface RiskLevel {
  label: string;
  min: number;
  max: number;
}
