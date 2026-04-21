alter table sessions
  add column if not exists template_slug text;

update sessions as s
set template_slug = t.slug
from assessment_templates as t
where s.template_id = t.id
  and s.template_slug is null;

alter table sessions
  drop constraint if exists sessions_template_id_fkey;

alter table sessions
  alter column template_id drop not null;

alter table sessions
  alter column template_slug set not null;

create index if not exists idx_sessions_template_slug on sessions(template_slug);
