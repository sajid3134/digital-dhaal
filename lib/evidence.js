import fs from "node:fs/promises";
import path from "node:path";
import { getEvidenceById } from "./db.js";

// Reads one evidence image off disk by its id. Returns null if the row or the
// file is missing. Callers are responsible for authorization.
export async function readEvidence(id) {
  const row = getEvidenceById(id);
  if (!row) return null;
  const file = path.join(process.cwd(), "data", "uploads", row.case_id, row.file);
  try {
    const buffer = await fs.readFile(file);
    return { buffer, mime: row.mime, caseId: row.case_id };
  } catch {
    return null;
  }
}
