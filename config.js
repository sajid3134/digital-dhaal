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

  // OpenRouter — one key, dozens of models, several genuinely FREE. Best free
  // pick. Browse openrouter.ai/models and use any id tagged ":free", e.g.
  //   deepseek/deepseek-chat-v3-0324:free
  //   meta-llama/llama-3.3-70b-instruct:free
  //   qwen/qwen-2.5-72b-instruct:free
  openrouter: {
    type: "openai",
    baseUrl: "https://openrouter.ai/api/v1",
    model: "deepseek/deepseek-chat-v3-0324:free",
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
