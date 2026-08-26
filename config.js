// Single place to configure the chat backend for the intake agent.
//
// To switch provider WITHOUT editing code: set LLM_PROVIDER in .env to one of
// the keys below (e.g. LLM_PROVIDER=openrouter) and add that provider's API key.
// To add a new OpenAI-compatible provider: copy an "openai" entry, change the
// baseUrl / model / apiKeyEnv. Nothing else in the app needs to change.

export const PROVIDERS = {
  // Google Gemini — good at Bangla, free tier has a daily request limit.
  gemini: {
    type: "gemini",
    model: "gemini-2.5-flash",
    apiKeyEnv: "GEMINI_API_KEY",
  },

  // OpenRouter — one key, many models, several genuinely FREE. Free model ids
  // change often, so if you get a 404 "unavailable for free", pick a current
  // one from openrouter.ai/models (filter: Free). Verified-good for Bangla+JSON
  // at time of writing: minimax/minimax-m3:free, google/gemma-4-31b-it:free,
  // z-ai/glm-5.2:free. (Avoid the "openrouter/free" auto-router — it can route
  // to non-chat models.) Note: the shared free pool is often rate-limited (429)
  // at peak; the app retries, but Groq below is more reliable if that annoys you.
  openrouter: {
    type: "openai",
    baseUrl: "https://openrouter.ai/api/v1",
    model: "minimax/minimax-m3:free",
    apiKeyEnv: "OPENROUTER_API_KEY",
    headers: { "HTTP-Referer": "https://digitaldhaal.local", "X-Title": "Digital Dhaal" },
  },

  // Groq — free tier, extremely fast (not slow at all). Daily token caps.
  groq: {
    type: "openai",
    baseUrl: "https://api.groq.com/openai/v1",
    model: "llama-3.3-70b-versatile",
    apiKeyEnv: "GROQ_API_KEY",
  },

  // Zhipu GLM — GLM-4-Flash is free on their platform.
  glm: {
    type: "openai",
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    model: "glm-4-flash",
    apiKeyEnv: "GLM_API_KEY",
  },

  // DeepSeek direct — very cheap, but NOT free (needs a small credit balance).
  // The free way to use DeepSeek is via OpenRouter above.
  deepseek: {
    type: "openai",
    baseUrl: "https://api.deepseek.com",
    model: "deepseek-chat",
    apiKeyEnv: "DEEPSEEK_API_KEY",
  },
};

// Provider in use. Overridable via LLM_PROVIDER in .env; falls back to gemini
// if the value isn't a known provider above.
export const PROVIDER = PROVIDERS[process.env.LLM_PROVIDER] ? process.env.LLM_PROVIDER : "gemini";
