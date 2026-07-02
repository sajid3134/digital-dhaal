// Provider adapters. Each takes { model, systemPrompt, conversation } and
// returns the assistant's raw reply text. conversation is a plain array of
// { role: "user" | "assistant", content: string } turns.

async function sendToAnthropic({ model, systemPrompt, conversation }) {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();

  const response = await client.messages.create({
    model,
    max_tokens: 1024,
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
    config: { systemInstruction: systemPrompt },
  });

  return response.text ?? "";
}

const SENDERS = {
  anthropic: sendToAnthropic,
  gemini: sendToGemini,
};

export async function sendTurn(providerName, { model, systemPrompt, conversation }) {
  const send = SENDERS[providerName];
  if (!send) {
    throw new Error(`Unknown provider "${providerName}" — check config.js`);
  }
  return send({ model, systemPrompt, conversation });
}
