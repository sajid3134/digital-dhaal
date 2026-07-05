import { NextResponse } from "next/server";
import { loadSystemPrompt } from "../../../lib/prompt.js";
import { sendTurn } from "../../../lib/providers.js";
import { PROVIDER, PROVIDERS } from "../../../config.js";
import { getOrCreateCase, getCaseById, appendTurn } from "../../../lib/db.js";
import {
  readSessionId,
  newSessionId,
  ensureSessionCookie,
} from "../../../lib/session.js";
import { getUserFromRequest } from "../../../lib/auth.js";
import { rateLimit, getClientIp } from "../../../lib/ratelimit.js";
import { isSameOrigin, jsonError, cleanString } from "../../../lib/security.js";

const { model: MODEL } = PROVIDERS[PROVIDER];
const systemPrompt = loadSystemPrompt();

const MAX_MESSAGE_LENGTH = 2000;

// Models occasionally wrap JSON in markdown fences or add stray text.
// Pull out the first complete JSON object instead of failing the turn.
function parseAgentReply(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    const cleaned = raw.replace(/```(?:json)?/gi, "").trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      if (start !== -1 && end > start) {
        try {
          return JSON.parse(cleaned.slice(start, end + 1));
        } catch {
          return null;
        }
      }
      return null;
    }
  }
}

export async function POST(request) {
  if (!isSameOrigin(request)) return jsonError("Forbidden", 403);

  const user = getUserFromRequest(request);
  if (!user) return jsonError("Not signed in", 401);

  if (!rateLimit(`chat:${user.id}:${getClientIp(request)}`, 20, 60_000)) {
    return jsonError("একটু ধীরে — কিছুক্ষণ পর আবার লিখুন।", 429);
  }

  const body = await request.json().catch(() => ({}));
  const userText = cleanString(body.message, MAX_MESSAGE_LENGTH);
  if (!userText) return jsonError("Empty message", 400);

  let sessionId = readSessionId(request);
  let setCookie = !sessionId;

  // Never let a stale cookie attach this user to someone else's case
  // (e.g. two people sharing one browser).
  if (sessionId) {
    const existing = getCaseById(sessionId);
    if (existing?.userId && existing.userId !== user.id) {
      sessionId = null;
      setCookie = true;
    }
  }
  if (!sessionId) sessionId = newSessionId();

  const caseRow = getOrCreateCase(sessionId, user.id);
  const conversation = [
    ...caseRow.conversation,
    { role: "user", content: userText, at: new Date().toISOString() },
  ];

  function reply(payload, status = 200) {
    const response = NextResponse.json(payload, { status });
    if (setCookie) ensureSessionCookie(response, sessionId);
    return response;
  }

  let rawReply;
  try {
    rawReply = await sendTurn(PROVIDER, {
      model: MODEL,
      systemPrompt,
      // The model only ever sees role + content — timestamps stay local.
      conversation: conversation.map(({ role, content }) => ({ role, content })),
    });
  } catch (err) {
    console.error("[chat] provider error after retries:", err.message);
    // failed:true lets the client show a retry button instead of a dead end.
    return reply({ failed: true, status: caseRow.status }, 502);
  }

  const parsed = parseAgentReply(rawReply);
  if (!parsed || typeof parsed.reply_to_user !== "string") {
    console.error("[chat] unparseable model reply:", rawReply.slice(0, 400));
    return reply({ failed: true, status: caseRow.status }, 502);
  }

  conversation.push({
    role: "assistant",
    content: rawReply,
    at: new Date().toISOString(),
  });
  appendTurn(sessionId, conversation, parsed);

  return reply({ reply_to_user: parsed.reply_to_user, status: parsed.status });
}
