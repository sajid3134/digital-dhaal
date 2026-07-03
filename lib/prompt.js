import fs from "node:fs";
import path from "node:path";

const PROMPT_FILE = path.join(process.cwd(), "digital-dhaal-intake-agent-prompt.md");

// The .md file has an explanatory note above a "---" line, then the actual
// system prompt below it. We only want to send the real prompt to the model.
export function loadSystemPrompt() {
  const fileText = fs.readFileSync(PROMPT_FILE, "utf-8");
  const separator = "\n---\n";
  const separatorIndex = fileText.indexOf(separator);
  if (separatorIndex === -1) {
    return fileText.trim();
  }
  return fileText.slice(separatorIndex + separator.length).trim();
}
