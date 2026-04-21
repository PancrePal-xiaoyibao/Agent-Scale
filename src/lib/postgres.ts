import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";

declare global {
  var __agentScalePgPool: Pool | undefined;
}

function getConnectionString() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required");
  }

  return connectionString;
}

function getSslConfig() {
  const mode = (process.env.DATABASE_SSL || "disable").toLowerCase();

  if (mode === "disable" || mode === "false") {
    return undefined;
  }

  if (mode === "verify-full") {
    return { rejectUnauthorized: true };
  }

  return { rejectUnauthorized: false };
}

function getPool() {
  if (globalThis.__agentScalePgPool) {
    return globalThis.__agentScalePgPool;
  }

  const pool = new Pool({
    connectionString: getConnectionString(),
    ssl: getSslConfig(),
  });

  if (process.env.NODE_ENV !== "production") {
    globalThis.__agentScalePgPool = pool;
  }

  return pool;
}

export async function query<TRow extends QueryResultRow = QueryResultRow>(
  text: string,
  values: unknown[] = []
): Promise<QueryResult<TRow>> {
  return getPool().query<TRow>(text, values);
}

export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
) {
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export interface PostgresError extends Error {
  code?: string;
  constraint?: string;
  detail?: string;
}

export function isPostgresError(error: unknown): error is PostgresError {
  return (
    typeof error === "object" &&
    error !== null &&
    ("code" in error || "constraint" in error || "detail" in error)
  );
}
