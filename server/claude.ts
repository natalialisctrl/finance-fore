import Anthropic from "@anthropic-ai/sdk";

// Replit AI Integration provides ANTHROPIC_API_KEY at runtime
export const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export const SONNET = "claude-sonnet-4-6";   // fast, balanced — for most tasks
export const OPUS   = "claude-opus-4-7";     // most capable — for complex predictions

/**
 * Call Claude and get a text response. Falls back to null if no key.
 */
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

/**
 * Call Claude and parse the response as JSON.
 * Claude is instructed explicitly to return only valid JSON.
 */
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
    // Strip any accidental markdown fences
    const clean = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
    return JSON.parse(clean) as T;
  } catch {
    console.error("Claude JSON parse failed. Raw:", raw.slice(0, 200));
    return null;
  }
}
