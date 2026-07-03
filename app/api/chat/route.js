import { NextResponse } from "next/server";
import { loadSystemPrompt } from "../../../lib/prompt.js";
import { sendTurn } from "../../../lib/providers.js";
import { PROVIDER, PROVIDERS } from "../../../config.js";
import { getOrCreateCase, appendTurn } from "../../../lib/db.js";
import {
  readSessionId,
  newSessionId,
  ensureSessionCookie,
} from "../../../lib/session.js";

const { model: MODEL } = PROVIDERS[PROVIDER];
const systemPrompt = loadSystemPrompt();

const FALLBACK_REPLY =
  "দুঃখিত, এই মুহূর্তে সংযোগে একটু সমস্যা হচ্ছে। একটু পর আবার চেষ্টা করুন।";

export async function POST(request) {
  const body = await request.json();
  const userText = typeof body.message === "string" ? body.message.trim() : "";

  if (!userText) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }

  let sessionId = readSessionId(request);
  const isNewSession = !sessionId;
  if (!sessionId) sessionId = newSessionId();

  const caseRow = getOrCreateCase(sessionId);
  const conversation = [
    ...caseRow.conversation,
    { role: "user", content: userText },
  ];

  function reply(payload) {
    const response = NextResponse.json(payload);
    if (isNewSession) ensureSessionCookie(response, sessionId);
    return response;
  }

  let rawReply;
  try {
    rawReply = await sendTurn(PROVIDER, {
      model: MODEL,
      systemPrompt,
      conversation,
    });
  } catch (err) {
    console.error("[chat] provider error:", err.message);
    return reply({ reply_to_user: FALLBACK_REPLY, status: caseRow.status });
  }

  conversation.push({ role: "assistant", content: rawReply });

  let parsed;
  try {
    parsed = JSON.parse(rawReply);
  } catch (err) {
    console.error("[chat] failed to parse model reply as JSON:", rawReply);
    return reply({ reply_to_user: FALLBACK_REPLY, status: caseRow.status });
  }

  appendTurn(sessionId, conversation, parsed);

  return reply({ reply_to_user: parsed.reply_to_user, status: parsed.status });
}
