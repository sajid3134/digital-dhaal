import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserFromCookieStore } from "../../lib/auth.js";
import { getCaseById, listCasesForUser, listCaseEvents } from "../../lib/db.js";
import { getLang, STRINGS } from "../../lib/i18n.js";
import ChatWindow from "../../components/ChatWindow.jsx";

export const metadata = { title: "Chat — Digital Dhaal" };
export const dynamic = "force-dynamic";

// Extract only what the victim-facing client may see from stored history:
// their own messages plus the agent's reply_to_user (+ timestamps).
// Internal JSON stays server-side.
function sanitizeHistory(conversation) {
  const messages = [];
  for (const turn of conversation) {
    if (turn.role === "user") {
      messages.push({ role: "user", text: turn.content, at: turn.at ?? null });
    } else {
      try {
        const parsed = JSON.parse(turn.content);
        if (parsed.reply_to_user) {
          messages.push({ role: "agent", text: parsed.reply_to_user, at: turn.at ?? null });
        }
      } catch {
        // skip unparseable turns rather than leaking raw content
      }
    }
  }
  return messages;
}

export default async function ChatPage() {
  const cookieStore = await cookies();
  const user = getUserFromCookieStore(cookieStore);
  if (!user) redirect("/login?next=/chat");

  const lang = getLang(cookieStore);
  const t = STRINGS[lang];
  const cases = listCasesForUser(user.id);

  const sessionId = cookieStore.get("dd_session")?.value;
  let initialMessages = [];
  let initialStatus = "collecting";
  let activeCaseId = null;
  let caseEvents = [];
  let caseStatus = "new";

  if (sessionId) {
    const caseRow = getCaseById(sessionId);
    // Only restore history if this case belongs to the signed-in user.
    if (caseRow && (!caseRow.userId || caseRow.userId === user.id)) {
      initialMessages = sanitizeHistory(caseRow.conversation);
      initialStatus = caseRow.status;
      activeCaseId = caseRow.id;
      caseStatus = caseRow.caseStatus;
      // Safe subset for the victim: event types + timestamps only.
      caseEvents = listCaseEvents(caseRow.id);
    }
  }

  return (
    <ChatWindow
      key={activeCaseId ?? "new"}
      userName={user.name}
      phoneVerified={user.phoneVerified}
      initialMessages={initialMessages}
      initialStatus={initialStatus}
      cases={cases}
      activeCaseId={activeCaseId}
      caseEvents={caseEvents}
      caseStatus={caseStatus}
      lang={lang}
      t={t}
    />
  );
}
