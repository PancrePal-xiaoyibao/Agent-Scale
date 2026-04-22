import { PHQ9_TEMPLATE } from "./phq9";
import { GAD7_TEMPLATE } from "./gad7";
import { SSS_TEMPLATE } from "./sss";
import type { TemplateSummary, TemplateDefinition } from "@/types/database";

export const BUILTIN_TEMPLATES = [PHQ9_TEMPLATE, GAD7_TEMPLATE, SSS_TEMPLATE];

const TEMPLATES_BY_ID = new Map(
  BUILTIN_TEMPLATES.map((template) => [template.id, template])
);
const TEMPLATES_BY_SLUG = new Map(
  BUILTIN_TEMPLATES.map((template) => [template.slug, template])
);

function toSummary(t: TemplateDefinition): TemplateSummary {
  const questionCount = t.schema.questions.length;
  return {
    id: t.id,
    slug: t.slug,
    name: t.name,
    description: t.description,
    category: t.category,
    tags: t.tags,
    question_count: questionCount,
    estimated_minutes: Math.max(1, Math.ceil(questionCount * 0.5)),
    version: t.version,
  };
}

export function listTemplates() {
  return [...BUILTIN_TEMPLATES].sort((a, b) => a.slug.localeCompare(b.slug));
}

export function listTemplateSummaries(): TemplateSummary[] {
  return listTemplates().map(toSummary);
}

export function getTemplateSummary(slug: string): TemplateSummary | null {
  const t = TEMPLATES_BY_SLUG.get(slug);
  return t ? toSummary(t) : null;
}

export function findTemplateById(id: string) {
  return TEMPLATES_BY_ID.get(id) ?? null;
}

export function findTemplateBySlug(slug: string) {
  return TEMPLATES_BY_SLUG.get(slug) ?? null;
}

export { PHQ9_TEMPLATE, GAD7_TEMPLATE, SSS_TEMPLATE };
