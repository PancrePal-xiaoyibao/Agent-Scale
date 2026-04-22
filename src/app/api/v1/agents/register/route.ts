import { NextRequest, NextResponse } from "next/server";
import { generateApiKey, hashApiKey } from "@/lib/auth";
import { createAgent } from "@/lib/store";

export async function POST(request: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    return NextResponse.json(
      { error: "Agent registration is not configured" },
      { status: 503 }
    );
  }

  const authHeader = request.headers.get("Authorization");
  const providedKey = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!providedKey || providedKey !== adminKey) {
    return NextResponse.json(
      { error: "Invalid or missing admin authorization" },
      { status: 401 }
    );
  }

  let body: { name: string; org_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json(
      { error: "name is required" },
      { status: 400 }
    );
  }

  const apiKey = generateApiKey();
  const apiKeyHash = await hashApiKey(apiKey);

  try {
    const agent = await createAgent({
      name: body.name,
      api_key_hash: apiKeyHash,
      org_id: body.org_id || "default",
      is_active: true,
    });

    return NextResponse.json({
      agent_id: agent.id,
      name: agent.name,
      api_key: apiKey,
      message: "Save this API key — it will not be shown again.",
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create agent" },
      { status: 500 }
    );
  }
}
