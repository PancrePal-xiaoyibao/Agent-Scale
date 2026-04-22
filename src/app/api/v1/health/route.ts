import { NextResponse } from "next/server";
import { query } from "@/lib/postgres";
import { listTemplateSummaries } from "@/lib/templates";

export async function GET() {
  let dbStatus = "ok";
  try {
    await query("SELECT 1");
  } catch {
    dbStatus = "unavailable";
  }

  const templates = listTemplateSummaries();

  return NextResponse.json({
    status: dbStatus === "ok" ? "healthy" : "degraded",
    version: "1.0.0",
    services: {
      database: dbStatus,
      templates: templates.length,
    },
  }, {
    status: dbStatus === "ok" ? 200 : 503,
  });
}
