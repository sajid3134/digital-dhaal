import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserFromCookieStore } from "../../lib/auth.js";
import { getCaseById, listCasesForUser } from "../../lib/db.js";
import ChatWindow from "../../components/ChatWindow.jsx";

export const metadata = { title: "চ্যাট — Digital Dhaal" };
export const dynamic = "force-dynamic";

// Extract only what the victim-facing client may see from stored history:
// their own messages plus the agent's reply_to_user. Internal JSON stays server-side.
function sanitizeHistory(conversation) {
  const messages = [];
  for (const turn of conversation) {
    if (turn.role === "user") {
      messages.push({ role: "user", text: turn.content });
    } else {
      try {
        const parsed = JSON.parse(turn.content);
        if (parsed.reply_to_user) messages.push({ role: "agent", text: parsed.reply_to_user });
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

  const cases = listCasesForUser(user.id);

  const sessionId = cookieStore.get("dd_session")?.value;
  let initialMessages = [];
  let initialStatus = "collecting";
  let activeCaseId = null;

  if (sessionId) {
    const caseRow = getCaseById(sessionId);
    // Only restore history if this case belongs to the signed-in user.
    if (caseRow && (!caseRow.userId || caseRow.userId === user.id)) {
      initialMessages = sanitizeHistory(caseRow.conversation);
      initialStatus = caseRow.status;
      activeCaseId = caseRow.id;
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
    />
  );
}
