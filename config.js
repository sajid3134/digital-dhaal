// Single place to configure the chat backend for the intake agent.
// To add another backend later: add an entry here and a matching sender
// in lib/providers.js, then flip PROVIDER — nothing else to touch.
export const PROVIDER = "gemini";

export const PROVIDERS = {
  gemini: {
    // Not "gemini-flash-latest": that resolves to the newest flash, whose
    // free tier allows only ~20 requests/day. 2.5-flash has a much higher
    // free daily quota — better fit for multi-turn intake conversations.
    model: "gemini-2.5-flash",
    apiKeyEnv: "GEMINI_API_KEY",
  },
};
