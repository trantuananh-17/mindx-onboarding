#!/usr/bin/env node

import { resolve } from "node:path";

import { JsonTicketRepository } from "../storage/json-ticket-repository.ts";
import { runCli } from "./run-cli.ts";

const dataFile =
  process.env.TICKETS_DATA_FILE ?? resolve(process.cwd(), "data", "tickets.json");

const exitCode = runCli(process.argv.slice(2), {
  repository: new JsonTicketRepository(dataFile),
  clock: () => new Date(),
  io: {
    stdout: (message) => console.log(message),
    stderr: (message) => console.error(message),
  },
});

process.exitCode = exitCode;
