import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "digitaldhaal.db");

fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

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
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    google_id TEXT UNIQUE,
    phone TEXT,
    phone_verified INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS auth_sessions (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS otp_codes (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    phone TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS feedback (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    support_type TEXT NOT NULL,
    rating INTEGER NOT NULL,
    review TEXT NOT NULL
  );
`);

// Idempotent migrations for columns added after the first release.
function ensureColumn(table, column, ddl) {
  const exists = db
    .prepare(`SELECT 1 FROM pragma_table_info(?) WHERE name = ?`)
    .get(table, column);
  if (!exists) db.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
}
ensureColumn("cases", "user_id", "user_id TEXT REFERENCES users(id)");
ensureColumn("cases", "case_status", "case_status TEXT NOT NULL DEFAULT 'new'");
ensureColumn("cases", "engineer_notes", "engineer_notes TEXT NOT NULL DEFAULT ''");

const now = () => new Date().toISOString();

/* ---------------------------- cases ---------------------------- */

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
    userId: row.user_id ?? null,
    caseStatus: row.case_status ?? "new",
    engineerNotes: row.engineer_notes ?? "",
    // present only when the query joined users
    user:
      row.u_email !== undefined && row.u_email !== null
        ? {
            name: row.u_name,
            email: row.u_email,
            phone: row.u_phone,
            phoneVerified: !!row.u_phone_verified,
          }
        : null,
  };
}

export function getOrCreateCase(sessionId, userId = null) {
  const existing = db.prepare("SELECT * FROM cases WHERE id = ?").get(sessionId);
  if (existing) {
    // Claim legacy rows that predate accounts; never hand one user's case
    // to another (caller must issue a fresh session id on mismatch).
    if (!existing.user_id && userId) {
      db.prepare("UPDATE cases SET user_id = ? WHERE id = ?").run(userId, sessionId);
      existing.user_id = userId;
    }
    return rowToCase(existing);
  }

  const ts = now();
  db.prepare(
    `INSERT INTO cases (id, created_at, updated_at, user_id) VALUES (?, ?, ?, ?)`,
  ).run(sessionId, ts, ts, userId);
  return rowToCase(db.prepare("SELECT * FROM cases WHERE id = ?").get(sessionId));
}

// parsedReply is the JSON object the agent returned this turn.
export function appendTurn(sessionId, conversation, parsedReply) {
  db.prepare(
    `UPDATE cases SET
       updated_at = ?, pillar = ?, status = ?, severity = ?,
       flags = ?, conversation = ?, case_card = ?
     WHERE id = ?`,
  ).run(
    now(),
    parsedReply.pillar ?? null,
    parsedReply.status ?? "collecting",
    parsedReply.case_card?.severity ?? null,
    JSON.stringify(parsedReply.flags ?? []),
    JSON.stringify(conversation),
    parsedReply.case_card ? JSON.stringify(parsedReply.case_card) : null,
    sessionId,
  );
}

const CASE_JOIN = `
  SELECT c.*, u.name AS u_name, u.email AS u_email,
         u.phone AS u_phone, u.phone_verified AS u_phone_verified
  FROM cases c LEFT JOIN users u ON u.id = c.user_id
`;

export function listCasesForAdmin() {
  const rows = db
    .prepare(
      `${CASE_JOIN}
       ORDER BY
         CASE c.severity
           WHEN 'critical' THEN 0 WHEN 'high' THEN 1
           WHEN 'standard' THEN 2 ELSE 3
         END,
         c.updated_at DESC`,
    )
    .all();
  return rows.map(rowToCase);
}

export function getCaseById(id) {
  return rowToCase(db.prepare(`${CASE_JOIN} WHERE c.id = ?`).get(id));
}

// Sidebar history: id, dates, status, and a short topic title derived from
// the first thing the user said (never from internal agent output).
export function listCasesForUser(userId) {
  const rows = db
    .prepare(
      `SELECT id, created_at, updated_at, pillar, status, severity, conversation
       FROM cases WHERE user_id = ? ORDER BY updated_at DESC`,
    )
    .all(userId);

  return rows.map((row) => {
    let title = null;
    try {
      const firstUserTurn = JSON.parse(row.conversation).find((t) => t.role === "user");
      if (firstUserTurn) {
        title =
          firstUserTurn.content.length > 44
            ? `${firstUserTurn.content.slice(0, 44)}…`
            : firstUserTurn.content;
      }
    } catch {
      /* fall through to placeholder */
    }
    return {
      id: row.id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      pillar: row.pillar,
      status: row.status,
      severity: row.severity,
      title: title ?? "নতুন কেস",
    };
  });
}

export const CASE_WORKFLOW_STATUSES = [
  "new",
  "verifying",
  "contacted",
  "in_progress",
  "resolved",
  "closed",
];

export function updateCaseWorkflow(id, { caseStatus, engineerNotes }) {
  if (!CASE_WORKFLOW_STATUSES.includes(caseStatus)) {
    throw new Error("Invalid case status");
  }
  db.prepare(
    `UPDATE cases SET case_status = ?, engineer_notes = ?, updated_at = ? WHERE id = ?`,
  ).run(caseStatus, String(engineerNotes ?? "").slice(0, 5000), now(), id);
  return getCaseById(id);
}

export function caseStats() {
  const total = db.prepare("SELECT COUNT(*) AS n FROM cases").get().n;
  const critical = db
    .prepare(
      "SELECT COUNT(*) AS n FROM cases WHERE severity = 'critical' AND case_status NOT IN ('resolved','closed')",
    )
    .get().n;
  const open = db
    .prepare("SELECT COUNT(*) AS n FROM cases WHERE case_status NOT IN ('resolved','closed')")
    .get().n;
  const resolved = db
    .prepare("SELECT COUNT(*) AS n FROM cases WHERE case_status IN ('resolved','closed')")
    .get().n;
  return { total, critical, open, resolved };
}

/* ---------------------------- users ---------------------------- */

function rowToUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    googleId: row.google_id,
    phone: row.phone,
    phoneVerified: !!row.phone_verified,
  };
}

export function createUser({ name, email, passwordHash = null, googleId = null }) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO users (id, created_at, name, email, password_hash, google_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(id, now(), name, email.toLowerCase(), passwordHash, googleId);
  return getUserById(id);
}

export function getUserById(id) {
  return rowToUser(db.prepare("SELECT * FROM users WHERE id = ?").get(id));
}

export function getUserByEmail(email) {
  return rowToUser(
    db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase()),
  );
}

export function getUserByGoogleId(googleId) {
  return rowToUser(db.prepare("SELECT * FROM users WHERE google_id = ?").get(googleId));
}

export function linkGoogleId(userId, googleId) {
  db.prepare("UPDATE users SET google_id = ? WHERE id = ?").run(googleId, userId);
}

export function setUserPhone(userId, phone) {
  db.prepare("UPDATE users SET phone = ?, phone_verified = 0 WHERE id = ?").run(
    phone,
    userId,
  );
}

export function markPhoneVerified(userId) {
  db.prepare("UPDATE users SET phone_verified = 1 WHERE id = ?").run(userId);
}

/* ------------------------- auth sessions ------------------------ */

export function createAuthSession(tokenHash, userId, ttlMs) {
  db.prepare(
    `INSERT INTO auth_sessions (token_hash, user_id, created_at, expires_at)
     VALUES (?, ?, ?, ?)`,
  ).run(tokenHash, userId, now(), new Date(Date.now() + ttlMs).toISOString());
}

export function getUserByAuthSession(tokenHash) {
  const row = db
    .prepare(
      `SELECT u.*, s.expires_at AS s_expires FROM auth_sessions s
       JOIN users u ON u.id = s.user_id WHERE s.token_hash = ?`,
    )
    .get(tokenHash);
  if (!row) return null;
  if (new Date(row.s_expires) < new Date()) {
    deleteAuthSession(tokenHash);
    return null;
  }
  return rowToUser(row);
}

export function deleteAuthSession(tokenHash) {
  db.prepare("DELETE FROM auth_sessions WHERE token_hash = ?").run(tokenHash);
}

/* ----------------------------- OTP ------------------------------ */

export function saveOtp(userId, phone, codeHash, ttlMs) {
  db.prepare(
    `INSERT INTO otp_codes (user_id, phone, code_hash, attempts, expires_at)
     VALUES (?, ?, ?, 0, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       phone = excluded.phone, code_hash = excluded.code_hash,
       attempts = 0, expires_at = excluded.expires_at`,
  ).run(userId, phone, codeHash, new Date(Date.now() + ttlMs).toISOString());
}

export function getOtp(userId) {
  return db.prepare("SELECT * FROM otp_codes WHERE user_id = ?").get(userId) ?? null;
}

export function bumpOtpAttempts(userId) {
  db.prepare("UPDATE otp_codes SET attempts = attempts + 1 WHERE user_id = ?").run(userId);
}

export function deleteOtp(userId) {
  db.prepare("DELETE FROM otp_codes WHERE user_id = ?").run(userId);
}

/* --------------------------- feedback --------------------------- */

export const SUPPORT_TYPES = ["latte_large", "latte_regular", "hug"];

export function addFeedback({ userId, supportType, rating, review }) {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO feedback (id, created_at, user_id, support_type, rating, review)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(id, now(), userId, supportType, rating, review);
  return id;
}

export function listFeedback() {
  return db
    .prepare(
      `SELECT f.*, u.name AS u_name, u.email AS u_email
       FROM feedback f LEFT JOIN users u ON u.id = f.user_id
       ORDER BY f.created_at DESC`,
    )
    .all()
    .map((row) => ({
      id: row.id,
      createdAt: row.created_at,
      supportType: row.support_type,
      rating: row.rating,
      review: row.review,
      userName: row.u_name ?? "Anonymous",
      userEmail: row.u_email ?? null,
    }));
}

export function feedbackStats() {
  const row = db
    .prepare("SELECT COUNT(*) AS n, AVG(rating) AS avg FROM feedback")
    .get();
  return { count: row.n, average: row.avg ? Math.round(row.avg * 10) / 10 : null };
}
