// Terminal test client for the Digital Dhaal intake agent.
// Loads the system prompt from digital-dhaal-intake-agent-prompt.md, sends
// each line you type to the configured LLM provider (see config.js), and
// prints only reply_to_user. When the agent marks a case "complete" (or
// "blocked_minor"), it also prints the full case_card it generated.

import "dotenv/config";
import fs from "node:fs";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { PROVIDER, PROVIDERS } from "./config.js";
import { sendTurn as callProvider } from "./lib/providers.js";

const { model: MODEL, apiKeyEnv: API_KEY_ENV } = PROVIDERS[PROVIDER];
const PROMPT_FILE = "./digital-dhaal-intake-agent-prompt.md";

// The .md file has an explanatory note above a "---" line, then the actual
// system prompt below it. We only want to send the real prompt to Claude.
function loadSystemPrompt(path) {
  const fileText = fs.readFileSync(path, "utf-8");
  const separator = "\n---\n";
  const separatorIndex = fileText.indexOf(separator);
  if (separatorIndex === -1) {
    return fileText.trim();
  }
  return fileText.slice(separatorIndex + separator.length).trim();
}

const systemPrompt = loadSystemPrompt(PROMPT_FILE);

// The API is stateless: every request must include the full conversation
// so far. We build that list up as messages go back and forth.
const conversation = [];

async function sendTurn(userText) {
  conversation.push({ role: "user", content: userText });

  const rawReply = await callProvider(PROVIDER, {
    model: MODEL,
    systemPrompt,
    conversation,
  });

  // Keep the raw reply in history so the model remembers what it already said.
  conversation.push({ role: "assistant", content: rawReply });

  let parsed;
  try {
    parsed = JSON.parse(rawReply);
  } catch (err) {
    console.log("\n[Agent reply was not valid JSON — showing raw text]");
    console.log(rawReply, "\n");
    return;
  }

  console.log(`\nAgent: ${parsed.reply_to_user}\n`);

  if (parsed.status === "complete" || parsed.status === "blocked_minor") {
    console.log("=== CASE CARD ===");
    console.log(JSON.stringify(parsed.case_card, null, 2));
    console.log("=================\n");
  }
}

async function main() {
  if (!process.env[API_KEY_ENV]) {
    console.error(
      `Missing ${API_KEY_ENV}. Copy .env.example to .env and add your key.`,
    );
    process.exit(1);
  }

  console.log("Digital Dhaal intake agent — test chat. Type 'exit' to quit.\n");

  const rl = readline.createInterface({ input, output });

  while (true) {
    let userText;
    try {
      userText = await rl.question("You: ");
    } catch (err) {
      if (err.code === "ERR_USE_AFTER_CLOSE") break; // stdin closed (e.g. Ctrl+D)
      throw err;
    }
    if (userText.trim().toLowerCase() === "exit") break;
    if (userText.trim() === "") continue;

    try {
      await sendTurn(userText);
    } catch (err) {
      console.error("\n[Request failed]", err.message, "\n");
    }
  }

  rl.close();
}

main();
