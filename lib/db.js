import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "digitaldhaal.db");

fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS cases (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    pillar TEXT,
    status TEXT NOT NULL DEFAULT 'collecting',
    severity TEXT,
    flags TEXT NOT NULL DEFAULT '[]',
    conversation TEXT NOT NULL DEFAULT '[]',
    case_card TEXT
  )
`);

function rowToCase(row) {
  if (!row) return null;
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    pillar: row.pillar,
    status: row.status,
    severity: row.severity,
    flags: JSON.parse(row.flags),
    conversation: JSON.parse(row.conversation),
    caseCard: row.case_card ? JSON.parse(row.case_card) : null,
  };
}

export function getOrCreateCase(sessionId) {
  const existing = db
    .prepare("SELECT * FROM cases WHERE id = ?")
    .get(sessionId);
  if (existing) return rowToCase(existing);

  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO cases (id, created_at, updated_at) VALUES (?, ?, ?)`,
  ).run(sessionId, now, now);

  return rowToCase(db.prepare("SELECT * FROM cases WHERE id = ?").get(sessionId));
}

// parsedReply is the JSON object the agent returned this turn:
// { pillar, flags, slots, missing, reply_to_user, status, case_card }
export function appendTurn(sessionId, conversation, parsedReply) {
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE cases SET
       updated_at = ?,
       pillar = ?,
       status = ?,
       severity = ?,
       flags = ?,
       conversation = ?,
       case_card = ?
     WHERE id = ?`,
  ).run(
    now,
    parsedReply.pillar ?? null,
    parsedReply.status ?? "collecting",
    parsedReply.case_card?.severity ?? null,
    JSON.stringify(parsedReply.flags ?? []),
    JSON.stringify(conversation),
    parsedReply.case_card ? JSON.stringify(parsedReply.case_card) : null,
    sessionId,
  );
}

export function listCasesForAdmin() {
  const rows = db
    .prepare(
      `SELECT * FROM cases
       ORDER BY
         CASE severity
           WHEN 'critical' THEN 0
           WHEN 'high' THEN 1
           WHEN 'standard' THEN 2
           ELSE 3
         END,
         updated_at DESC`,
    )
    .all();
  return rows.map(rowToCase);
}

export function getCaseById(id) {
  return rowToCase(db.prepare("SELECT * FROM cases WHERE id = ?").get(id));
}
