import Anthropic from "@anthropic-ai/sdk";

// Replit AI Integration injects AI_INTEGRATIONS_ANTHROPIC_* vars automatically.
// Personal ANTHROPIC_API_KEY is accepted as a fallback.
const apiKey =
  process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY ||
  process.env.ANTHROPIC_API_KEY;
const baseURL = process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL;

export const anthropic = apiKey
  ? new Anthropic({ apiKey, ...(baseURL ? { baseURL } : {}) })
  : null;

export const SONNET = "claude-sonnet-4-6";
export const OPUS   = "claude-opus-4-7";

export async function callClaude(
  prompt: string,
  model: string = SONNET,
  maxTokens = 1024,
): Promise<string | null> {
  if (!anthropic) return null;
  const response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });
  const block = response.content[0];
  return block.type === "text" ? block.text : null;
}

export async function callClaudeJSON<T = any>(
  prompt: string,
  model: string = SONNET,
  maxTokens = 2048,
): Promise<T | null> {
  const raw = await callClaude(
    prompt + "\n\nReturn ONLY valid JSON with no markdown fences, no prose, no explanation.",
    model,
    maxTokens,
  );
  if (!raw) return null;
  try {
    const clean = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
    return JSON.parse(clean) as T;
  } catch {
    console.error("Claude JSON parse failed. Raw:", raw.slice(0, 200));
    return null;
  }
}
