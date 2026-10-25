#!/usr/bin/env node

import { createKBClient } from "../kb/create-kb-client.ts";
import { runKbCli } from "./run-kb-cli.ts";

let exitCode = 1;

try {
  exitCode = await runKbCli(process.argv.slice(2), {
    client: createKBClient(),
    io: {
      stdout: (message) => console.log(message),
      stderr: (message) => console.error(message),
    },
  });
} catch (error) {
  const message = error instanceof Error ? error.message : "Unexpected startup error";
  console.error(message);
  exitCode = 1;
}

process.exitCode = exitCode;
