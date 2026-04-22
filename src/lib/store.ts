import type { PoolClient, QueryResultRow } from "pg";
import { query, withTransaction, isPostgresError } from "./postgres";
import type {
  Agent,
  Response as AssessmentResponse,
  Session,
} from "@/types/database";

interface CreateAgentInput {
  name: string;
  api_key_hash: string;
  org_id: string;
  is_active?: boolean;
}

interface CreateSessionInput {
  agentId: string;
  templateId: string;
  templateSlug: string;
  tokenHash: string;
  expiresAt: string;
  callbackUrl?: string | null;
  status?: Session["status"];
}

interface CompleteSessionInput {
  sessionId: string;
  answers: Record<string, number>;
  rawScore: number;
  dimensionScores: Record<string, number> | null;
  riskLevel: string;
  completedAt: string;
  ipAddress: string | null;
  userAgent: string | null;
}

async function oneOrNull<T extends QueryResultRow>(
  client: PoolClient | null,
  text: string,
  values: unknown[] = []
) {
  const result = client
    ? await client.query<T>(text, values)
    : await query<T>(text, values);
  return result.rows[0] ?? null;
}

export async function findActiveAgentByApiKeyHash(hash: string) {
  return oneOrNull<Agent>(
    null,
    `
      select *
      from agents
      where api_key_hash = $1
        and is_active = true
      limit 1
    `,
    [hash]
  );
}

export async function createAgent(input: CreateAgentInput) {
  const result = await query<Agent>(
    `
      insert into agents (name, api_key_hash, org_id, is_active)
      values ($1, $2, $3, $4)
      returning *
    `,
    [input.name, input.api_key_hash, input.org_id, input.is_active ?? true]
  );

  return result.rows[0];
}

export async function getOrCreateWalkInAgent() {
  const apiKeyHash = "__walk_in_no_key__";

  const existing = await oneOrNull<Agent>(
    null,
    `
      select *
      from agents
      where api_key_hash = $1
      limit 1
    `,
    [apiKeyHash]
  );

  if (existing) {
    return existing;
  }

  try {
    return await createAgent({
      name: "Walk-in (Web)",
      api_key_hash: apiKeyHash,
      org_id: "__walk_in__",
      is_active: true,
    });
  } catch (error) {
    if (
      isPostgresError(error) &&
      error.code === "23505"
    ) {
      const agent = await oneOrNull<Agent>(
        null,
        `
          select *
          from agents
          where api_key_hash = $1
          limit 1
        `,
        [apiKeyHash]
      );

      if (agent) {
        return agent;
      }
    }

    throw error;
  }
}

export async function createSession(input: CreateSessionInput) {
  const result = await query<Session>(
    `
      insert into sessions (
        agent_id,
        template_id,
        template_slug,
        token_hash,
        status,
        expires_at,
        callback_url
      )
      values ($1, $2, $3, $4, $5, $6, $7)
      returning *
    `,
    [
      input.agentId,
      input.templateId,
      input.templateSlug,
      input.tokenHash,
      input.status ?? "pending",
      input.expiresAt,
      input.callbackUrl ?? null,
    ]
  );

  return result.rows[0];
}

export async function listSessionsByAgent(
  agentId: string,
  filters?: { status?: string; template_slug?: string; limit?: number }
) {
  const conditions = ["agent_id = $1"];
  const values: unknown[] = [agentId];
  let paramIndex = 2;

  if (filters?.status) {
    conditions.push(`status = $${paramIndex}`);
    values.push(filters.status);
    paramIndex++;
  }
  if (filters?.template_slug) {
    conditions.push(`template_slug = $${paramIndex}`);
    values.push(filters.template_slug);
    paramIndex++;
  }

  const limit = filters?.limit ?? 50;

  const result = await query<Session>(
    `
      select id, status, created_at, expires_at, completed_at, template_id, template_slug
      from sessions
      where ${conditions.join(" and ")}
      order by created_at desc
      limit ${limit}
    `,
    values
  );

  return result.rows;
}

export async function getSessionByIdForAgent(id: string, agentId: string) {
  return oneOrNull<Session>(
    null,
    `
      select *
      from sessions
      where id = $1
        and agent_id = $2
      limit 1
    `,
    [id, agentId]
  );
}

export async function getSessionByTokenHash(tokenHash: string) {
  return oneOrNull<Session>(
    null,
    `
      select *
      from sessions
      where token_hash = $1
      limit 1
    `,
    [tokenHash]
  );
}

export async function expireSession(id: string) {
  await query(
    `
      update sessions
      set status = 'expired'
      where id = $1
    `,
    [id]
  );
}

export async function getResponseBySessionId(sessionId: string) {
  return oneOrNull<AssessmentResponse>(
    null,
    `
      select *
      from responses
      where session_id = $1
      limit 1
    `,
    [sessionId]
  );
}

export async function completeSession(input: CompleteSessionInput) {
  await withTransaction(async (client) => {
    await client.query(
      `
        insert into responses (
          session_id,
          answers,
          raw_score,
          dimension_scores,
          risk_level
        )
        values ($1, $2, $3, $4, $5)
      `,
      [
        input.sessionId,
        input.answers,
        input.rawScore,
        input.dimensionScores,
        input.riskLevel,
      ]
    );

    await client.query(
      `
        update sessions
        set status = 'completed',
            completed_at = $2,
            ip_address = $3,
            user_agent = $4
        where id = $1
      `,
      [
        input.sessionId,
        input.completedAt,
        input.ipAddress,
        input.userAgent,
      ]
    );
  });
}
