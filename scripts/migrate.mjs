import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { Client } from "pg";

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

async function main() {
  const client = new Client({
    connectionString: getConnectionString(),
    ssl: getSslConfig(),
  });

  const migrationsDir = path.join(process.cwd(), "supabase", "migrations");
  const files = (await readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  await client.connect();

  try {
    await client.query(`
      create table if not exists app_migrations (
        filename text primary key,
        applied_at timestamptz not null default now()
      )
    `);

    const applied = await client.query("select filename from app_migrations");
    const appliedFiles = new Set(applied.rows.map((row) => row.filename));

    for (const file of files) {
      if (appliedFiles.has(file)) {
        continue;
      }

      const sql = await readFile(path.join(migrationsDir, file), "utf8");

      process.stdout.write(`Applying ${file}\n`);
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query(
          "insert into app_migrations (filename) values ($1)",
          [file]
        );
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
