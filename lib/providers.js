// Provider adapters. Each takes the provider config plus { systemPrompt,
// conversation } and returns the assistant's raw reply text. conversation is a
// plain array of { role: "user" | "assistant", content: string } turns.
//
// Two adapter types cover everything:
//   - "gemini": Google's SDK.
//   - "openai": any OpenAI-compatible /chat/completions endpoint (OpenRouter,
//     Groq, GLM, DeepSeek, Mistral, Together, local Ollama/LM Studio, …).
//
// sendTurn retries transient provider errors (429/5xx) with exponential backoff.

import { PROVIDERS } from "../config.js";

async function sendToGemini(cfg, { systemPrompt, conversation }) {
  const { GoogleGenAI } = await import("@google/genai");
  const client = new GoogleGenAI({ apiKey: process.env[cfg.apiKeyEnv] });

  // Gemini wants history as { role: "user" | "model", parts: [{ text }] }.
  const contents = conversation.map((turn) => ({
    role: turn.role === "assistant" ? "model" : "user",
    parts: [{ text: turn.content }],
  }));

  const response = await client.models.generateContent({
    model: cfg.model,
    contents,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.2,
      // Flash models spend "thinking" tokens from the same output budget,
      // which was truncating long JSON replies mid-object. Thinking off +
      // a generous cap keeps every turn complete.
      maxOutputTokens: 4096,
      thinkingConfig: { thinkingBudget: 0 },
      // Forces valid JSON output — the agent replies only in JSON anyway,
      // and this removes the markdown-fence/parse failures entirely.
      responseMimeType: "application/json",
    },
  });

  return response.text ?? "";
}

// Works with any OpenAI-compatible chat-completions API. Configured entirely by
// the provider entry in config.js (baseUrl, model, apiKeyEnv, optional headers).
async function sendToOpenAICompatible(cfg, { systemPrompt, conversation }) {
  const apiKey = process.env[cfg.apiKeyEnv];
  if (!apiKey) throw new Error(`Missing ${cfg.apiKeyEnv} for provider`);

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversation.map(({ role, content }) => ({ role, content })),
  ];

  const body = {
    model: cfg.model,
    messages,
    temperature: 0.2,
    max_tokens: cfg.maxTokens ?? 2048,
  };
  // Most modern providers support JSON mode; the intake route also has a
  // tolerant JSON parser as a backup. Set `json: false` in config to disable.
  if (cfg.json !== false) body.response_format = { type: "json_object" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), cfg.timeoutMs ?? 45000);
  try {
    const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...(cfg.headers ?? {}),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const err = new Error(`Provider ${res.status}: ${text.slice(0, 300)}`);
      err.status = res.status;
      throw err;
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? "";
  } finally {
    clearTimeout(timer);
  }
}

const SENDERS = {
  gemini: sendToGemini,
  openai: sendToOpenAICompatible,
};

function isRetryable(err) {
  const status = err?.status ?? err?.code;
  if ([429, 500, 502, 503, 504].includes(Number(status))) return true;
  const msg = String(err?.message ?? "");
  return /overloaded|unavailable|high demand|429|503|fetch failed|ECONNRESET|ETIMEDOUT|aborted/i.test(
    msg,
  );
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Called as sendTurn(PROVIDER, { systemPrompt, conversation }). A legacy
// `model` field in the args is ignored — the model comes from config.js.
export async function sendTurn(providerName, { systemPrompt, conversation }) {
  const cfg = PROVIDERS[providerName];
  if (!cfg) {
    throw new Error(`Unknown provider "${providerName}" — check config.js`);
  }
  const send = SENDERS[cfg.type];
  if (!send) {
    throw new Error(`No adapter for provider type "${cfg.type}" — check config.js`);
  }

  const MAX_ATTEMPTS = 3;
  let lastError;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      return await send(cfg, { systemPrompt, conversation });
    } catch (err) {
      lastError = err;
      if (attempt < MAX_ATTEMPTS - 1 && isRetryable(err)) {
        await sleep(700 * 2 ** attempt + Math.random() * 300);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}
