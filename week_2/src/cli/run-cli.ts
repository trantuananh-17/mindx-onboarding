import { parseArgs } from "node:util";

import { ValidationError } from "../domain/errors.ts";
import type { Clock, TicketRepository } from "../domain/ticket.ts";
import { createTicket } from "../services/create-ticket.ts";
import { listTickets } from "../services/list-tickets.ts";
import { showTicket } from "../services/show-ticket.ts";
import { updateTicketStatus } from "../services/update-ticket-status.ts";

export interface CliIO {
  stdout(message: string): void;
  stderr(message: string): void;
}

export interface CliDependencies {
  repository: TicketRepository;
  clock: Clock;
  io: CliIO;
}

const USAGE = [
  "Usage:",
  "  tickets create --title <title> [--description <text>] [--priority <value>] [--tags <list>]",
  "  tickets list [--status <value>] [--priority <value>] [--tag <value>]",
  "  tickets show <id>",
  "  tickets update <id> --status <value>",
].join("\n");

function parseId(value: string | undefined): number {
  return value === undefined ? Number.NaN : Number(value);
}

export function runCli(args: string[], dependencies: CliDependencies): number {
  const { repository, clock, io } = dependencies;

  try {
    const [command, ...commandArgs] = args;

    if (command === undefined || command === "help" || command === "--help") {
      io.stdout(USAGE);
      return 0;
    }

    switch (command) {
      case "create": {
        const { values } = parseArgs({
          args: commandArgs,
          options: {
            title: { type: "string" },
            description: { type: "string" },
            priority: { type: "string" },
            tags: { type: "string" },
          },
          strict: true,
        });
        const ticket = createTicket(
          {
            title: values.title ?? "",
            description: values.description,
            priority: values.priority,
            tags: values.tags?.split(","),
          },
          repository,
          clock,
        );
        io.stdout(`Created ticket #${ticket.id}: ${ticket.title}`);
        return 0;
      }

      case "list": {
        const { values } = parseArgs({
          args: commandArgs,
          options: {
            status: { type: "string" },
            priority: { type: "string" },
            tag: { type: "string" },
          },
          strict: true,
        });
        const tickets = listTickets(
          {
            status: values.status,
            priority: values.priority,
            tag: values.tag,
          },
          repository,
        );

        if (tickets.length === 0) {
          io.stdout("No tickets found.");
          return 0;
        }

        for (const ticket of tickets) {
          io.stdout(
            `${ticket.id} | ${ticket.status} | ${ticket.priority} | ${ticket.title}`,
          );
        }
        return 0;
      }

      case "show": {
        const { positionals } = parseArgs({
          args: commandArgs,
          allowPositionals: true,
          strict: true,
        });
        if (positionals.length !== 1) {
          throw new ValidationError("Show command requires exactly one ID");
        }

        const ticket = showTicket(parseId(positionals[0]), repository);
        io.stdout(
          [
            `ID: ${ticket.id}`,
            `Title: ${ticket.title}`,
            `Description: ${ticket.description}`,
            `Status: ${ticket.status}`,
            `Priority: ${ticket.priority}`,
            `Tags: ${ticket.tags.join(", ") || "-"}`,
            `Created: ${ticket.createdAt}`,
            `Updated: ${ticket.updatedAt}`,
          ].join("\n"),
        );
        return 0;
      }

      case "update": {
        const { values, positionals } = parseArgs({
          args: commandArgs,
          options: {
            status: { type: "string" },
          },
          allowPositionals: true,
          strict: true,
        });
        if (positionals.length !== 1) {
          throw new ValidationError("Update command requires exactly one ID");
        }
        if (values.status === undefined) {
          throw new ValidationError("Status is required");
        }

        const ticket = updateTicketStatus(
          parseId(positionals[0]),
          values.status,
          repository,
          clock,
        );
        io.stdout(`Updated ticket #${ticket.id} to ${ticket.status}`);
        return 0;
      }

      default:
        throw new ValidationError(`Unknown command: ${command}\n${USAGE}`);
    }
  } catch (error) {
    io.stderr(error instanceof Error ? error.message : "Unexpected error");
    return 1;
  }
}
