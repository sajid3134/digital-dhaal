// Provider adapters. Each takes { model, systemPrompt, conversation } and
// returns the assistant's raw reply text. conversation is a plain array of
// { role: "user" | "assistant", content: string } turns.
//
// Both adapters run at temperature 0.2 (the prompt file requires low temp so
// the JSON output stays stable), and sendTurn retries transient provider
// errors (429/5xx) with exponential backoff before giving up.

async function sendToAnthropic({ model, systemPrompt, conversation }) {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();

  const response = await client.messages.create({
    model,
    max_tokens: 1024,
    temperature: 0.2,
    system: systemPrompt,
    messages: conversation,
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock ? textBlock.text : "";
}

async function sendToGemini({ model, systemPrompt, conversation }) {
  const { GoogleGenAI } = await import("@google/genai");
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // Gemini wants history as { role: "user" | "model", parts: [{ text }] }.
  const contents = conversation.map((turn) => ({
    role: turn.role === "assistant" ? "model" : "user",
    parts: [{ text: turn.content }],
  }));

  const response = await client.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.2,
      maxOutputTokens: 1024,
      // Forces valid JSON output — the agent replies only in JSON anyway,
      // and this removes the markdown-fence/parse failures entirely.
      responseMimeType: "application/json",
    },
  });

  return response.text ?? "";
}

const SENDERS = {
  anthropic: sendToAnthropic,
  gemini: sendToGemini,
};

function isRetryable(err) {
  const status = err?.status ?? err?.code;
  if ([429, 500, 502, 503, 504].includes(Number(status))) return true;
  const msg = String(err?.message ?? "");
  return /overloaded|unavailable|high demand|429|503|fetch failed|ECONNRESET|ETIMEDOUT/i.test(
    msg,
  );
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendTurn(providerName, { model, systemPrompt, conversation }) {
  const send = SENDERS[providerName];
  if (!send) {
    throw new Error(`Unknown provider "${providerName}" — check config.js`);
  }

  const MAX_ATTEMPTS = 3;
  let lastError;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      return await send({ model, systemPrompt, conversation });
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
