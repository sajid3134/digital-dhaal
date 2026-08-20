// Terminal test client for the Digital Dhaal intake agent.
//
// Loads the system prompt from:
//   digital-dhaal-intake-agent-prompt.md
//
// Sends each line typed in the terminal to the configured LLM provider
// (see config.js) and prints only `reply_to_user`.
//
// When the agent marks a case as `complete` or `blocked_minor`,
// the generated `case_card` is also printed.

import "dotenv/config";
import fs from "node:fs";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { PROVIDER, PROVIDERS } from "./config.js";
import { sendTurn as callProvider } from "./lib/providers.js";

const PROMPT_FILE = "./digital-dhaal-intake-agent-prompt.md";

// -----------------------------------------------------------------------------
// Provider configuration
// -----------------------------------------------------------------------------

const providerConfig = PROVIDERS[PROVIDER];

if (!providerConfig) {
  console.error(`Unknown provider: ${PROVIDER}`);
  process.exit(1);
}

const {
  model: MODEL,
  apiKeyEnv: API_KEY_ENV,
} = providerConfig;

// -----------------------------------------------------------------------------
// Load system prompt
// -----------------------------------------------------------------------------

function loadSystemPrompt(filePath) {
  const fileText = fs.readFileSync(filePath, "utf-8");

  // The markdown file contains an explanatory section before the actual
  // system prompt, separated by "\n---\n".
  const separator = "\n---\n";
  const separatorIndex = fileText.indexOf(separator);

  if (separatorIndex === -1) {
    return fileText.trim();
  }

  return fileText
    .slice(separatorIndex + separator.length)
    .trim();
}

let systemPrompt;

try {
  systemPrompt = loadSystemPrompt(PROMPT_FILE);
} catch (error) {
  console.error(
    `Failed to load system prompt from "${PROMPT_FILE}":`,
    error.message,
  );
  process.exit(1);
}

// -----------------------------------------------------------------------------
// Conversation history
// -----------------------------------------------------------------------------

// The API is stateless, so every request must contain the complete
// conversation history.
const conversation = [];

// -----------------------------------------------------------------------------
// Send one user turn to the agent
// -----------------------------------------------------------------------------

async function sendTurn(userText) {
  conversation.push({
    role: "user",
    content: userText,
  });

  const rawReply = await callProvider(PROVIDER, {
    model: MODEL,
    systemPrompt,
    conversation,
  });

  // Store the raw assistant response so that the next request
  // has access to the previous response.
  conversation.push({
    role: "assistant",
    content: rawReply,
  });

  let parsedReply;

  try {
    parsedReply = JSON.parse(rawReply);
  } catch (error) {
    console.log("\n[Agent reply was not valid JSON — showing raw text]");
    console.log(rawReply);
    console.log();

    return;
  }

  // Print only the user-facing response.
  console.log(`\nAgent: ${parsedReply.reply_to_user}\n`);

  // Print the complete case card when the case is finished or blocked.
  if (
    parsedReply.status === "complete" ||
    parsedReply.status === "blocked_minor"
  ) {
    console.log("=== CASE CARD ===");
    console.log(
      JSON.stringify(parsedReply.case_card, null, 2),
    );
    console.log("=================\n");
  }
}

// -----------------------------------------------------------------------------
// Main terminal loop
// -----------------------------------------------------------------------------

async function main() {
  // Check that the required API key exists.
  if (!process.env[API_KEY_ENV]) {
    console.error(
      `Missing ${API_KEY_ENV}. ` +
      `Copy .env.example to .env and add your API key.`,
    );

    process.exit(1);
  }

  console.log(
    "Digital Dhaal intake agent — test chat. Type 'exit' to quit.\n",
  );

  const rl = readline.createInterface({
    input,
    output,
  });

  try {
    while (true) {
      let userText;

      try {
        userText = await rl.question("You: ");
      } catch (error) {
        // Ctrl+D / stdin closed.
        if (error.code === "ERR_USE_AFTER_CLOSE") {
          break;
        }

        throw error;
      }

      const trimmedText = userText.trim();

      // Ignore empty input.
      if (trimmedText === "") {
        continue;
      }

      // Exit the application.
      if (trimmedText.toLowerCase() === "exit") {
        break;
      }

      try {
        await sendTurn(trimmedText);
      } catch (error) {
        console.error(
          "\n[Request failed]",
          error.message,
          "\n",
        );
      }
    }
  } finally {
    rl.close();
  }
}

// -----------------------------------------------------------------------------
// Start application
// -----------------------------------------------------------------------------

main().catch((error) => {
  console.error("\n[Fatal error]", error.message);
  process.exit(1);
});
