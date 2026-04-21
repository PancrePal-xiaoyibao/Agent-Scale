import { PHQ9_TEMPLATE } from "./phq9";
import { GAD7_TEMPLATE } from "./gad7";
import { SSS_TEMPLATE } from "./sss";

export const BUILTIN_TEMPLATES = [PHQ9_TEMPLATE, GAD7_TEMPLATE, SSS_TEMPLATE];

const TEMPLATES_BY_ID = new Map(
  BUILTIN_TEMPLATES.map((template) => [template.id, template])
);
const TEMPLATES_BY_SLUG = new Map(
  BUILTIN_TEMPLATES.map((template) => [template.slug, template])
);

export function listTemplates() {
  return [...BUILTIN_TEMPLATES].sort((a, b) => a.slug.localeCompare(b.slug));
}

export function findTemplateById(id: string) {
  return TEMPLATES_BY_ID.get(id) ?? null;
}

export function findTemplateBySlug(slug: string) {
  return TEMPLATES_BY_SLUG.get(slug) ?? null;
}

export { PHQ9_TEMPLATE, GAD7_TEMPLATE, SSS_TEMPLATE };
