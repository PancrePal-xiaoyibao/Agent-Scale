import { NextResponse } from "next/server";
import { generateApiKey, hashApiKey } from "@/lib/auth";
import { createAgent } from "@/lib/store";

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in development" }, { status: 403 });
  }

  const apiKey = generateApiKey();
  const apiKeyHash = await hashApiKey(apiKey);

  try {
    const agent = await createAgent({
      name: "Dev Test Agent",
      api_key_hash: apiKeyHash,
      org_id: "dev-org",
      is_active: true,
    });

    return NextResponse.json({
      message: "Agent created. Save this API key - it won't be shown again!",
      agent_id: agent.id,
      api_key: apiKey,
    }, { status: 201 });
  } catch (error) {
    const details = error instanceof Error ? error.message : "unknown error";
    return NextResponse.json({ error: "Failed to create agent", details }, { status: 500 });
  }
}
