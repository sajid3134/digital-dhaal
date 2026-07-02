// Single place to pick which LLM backend the intake chat talks to.
// Switch providers by changing PROVIDER on the next line — nothing else to touch.
export const PROVIDER = "gemini"; // "gemini" | "anthropic"

export const PROVIDERS = {
  anthropic: {
    model: "claude-haiku-4-5-20251001",
    apiKeyEnv: "ANTHROPIC_API_KEY",
  },
  gemini: {
    model: "gemini-flash-latest",
    apiKeyEnv: "GEMINI_API_KEY",
  },
};
