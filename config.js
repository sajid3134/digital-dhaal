// Single place to pick which LLM backend the intake chat talks to.
// Switch providers by changing PROVIDER on the next line — nothing else to touch.
export const PROVIDER = "gemini"; // "gemini" | "anthropic"

export const PROVIDERS = {
  anthropic: {
    model: "claude-haiku-4-5-20251001",
    apiKeyEnv: "ANTHROPIC_API_KEY",
  },
  gemini: {
    // Not "gemini-flash-latest": that resolves to the newest flash, whose
    // free tier allows only ~20 requests/day. 2.5-flash has a much higher
    // free daily quota — better fit for multi-turn intake conversations.
    model: "gemini-2.5-flash",
    apiKeyEnv: "GEMINI_API_KEY",
  },
};
