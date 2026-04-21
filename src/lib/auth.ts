import { NextRequest } from "next/server";
import { Agent } from "@/types/database";
import { findActiveAgentByApiKeyHash } from "./store";

export async function verifyApiKey(
  request: NextRequest
): Promise<Agent | null> {
  const apiKey = request.headers.get("X-API-Key");
  if (!apiKey) return null;

  const hash = await hashApiKey(apiKey);
  const agent = await findActiveAgentByApiKeyHash(hash);

  if (!agent) return null;
  return agent as Agent;
}

export async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function generateApiKey(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return `ask_${btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")}`;
}

export function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}
