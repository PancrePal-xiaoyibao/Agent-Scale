import { NextResponse } from "next/server";
import { listTemplateSummaries } from "@/lib/templates";

export async function GET() {
  const templates = listTemplateSummaries();

  return NextResponse.json({ templates });
}
