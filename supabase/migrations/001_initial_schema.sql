-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Agents table: stores API key holders
create table agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  api_key_hash text not null unique,
  org_id text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_agents_api_key_hash on agents(api_key_hash);
create index idx_agents_org_id on agents(org_id);

-- Assessment templates table
create table assessment_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  version text not null default '1.0.0',
  schema jsonb not null,
  scoring_rules jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_templates_slug on assessment_templates(slug);

-- Sessions table
create table sessions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id),
  template_id uuid not null references assessment_templates(id),
  token_hash text not null unique,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'expired')),
  expires_at timestamptz not null,
  callback_url text,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index idx_sessions_token_hash on sessions(token_hash);
create index idx_sessions_agent_id on sessions(agent_id);
create index idx_sessions_status on sessions(status);

-- Responses table
create table responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references sessions(id),
  answers jsonb not null,
  raw_score integer not null,
  dimension_scores jsonb,
  risk_level text not null,
  completed_at timestamptz not null default now()
);

create index idx_responses_session_id on responses(session_id);

-- RLS policies
alter table agents enable row level security;
alter table assessment_templates enable row level security;
alter table sessions enable row level security;
alter table responses enable row level security;

-- Service role can do everything (API routes use service role key)
create policy "Service role full access on agents"
  on agents for all using (true);

create policy "Service role full access on assessment_templates"
  on assessment_templates for all using (true);

create policy "Service role full access on sessions"
  on sessions for all using (true);

create policy "Service role full access on responses"
  on responses for all using (true);
