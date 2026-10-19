import {
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname } from "node:path";

import { StorageError } from "../domain/errors.ts";
import type { Ticket, TicketRepository } from "../domain/ticket.ts";

function cloneTicket(ticket: Ticket): Ticket {
  return { ...ticket, tags: [...ticket.tags] };
}

function isTicket(value: unknown): value is Ticket {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const ticket = value as Record<string, unknown>;
  return (
    Number.isInteger(ticket.id) &&
    (ticket.id as number) > 0 &&
    typeof ticket.title === "string" &&
    typeof ticket.description === "string" &&
    ["open", "in-progress", "closed"].includes(ticket.status as string) &&
    ["low", "medium", "high"].includes(ticket.priority as string) &&
    Array.isArray(ticket.tags) &&
    ticket.tags.every((tag) => typeof tag === "string") &&
    typeof ticket.createdAt === "string" &&
    !Number.isNaN(Date.parse(ticket.createdAt)) &&
    typeof ticket.updatedAt === "string" &&
    !Number.isNaN(Date.parse(ticket.updatedAt))
  );
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

export class JsonTicketRepository implements TicketRepository {
  private readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  nextId(): number {
    const tickets = this.readTickets();
    if (tickets.length === 0) {
      return 1;
    }

    return Math.max(...tickets.map((ticket) => ticket.id)) + 1;
  }

  save(ticket: Ticket): void {
    const tickets = this.readTickets();
    const existingIndex = tickets.findIndex(({ id }) => id === ticket.id);

    if (existingIndex === -1) {
      tickets.push(cloneTicket(ticket));
    } else {
      tickets[existingIndex] = cloneTicket(ticket);
    }

    this.writeTickets(tickets);
  }

  findById(id: number): Ticket | undefined {
    const ticket = this.readTickets().find((candidate) => candidate.id === id);
    return ticket ? cloneTicket(ticket) : undefined;
  }

  findAll(): Ticket[] {
    return this.readTickets().map(cloneTicket);
  }

  private readTickets(): Ticket[] {
    let content: string;

    try {
      content = readFileSync(this.filePath, "utf8");
    } catch (error) {
      if (isNodeError(error) && error.code === "ENOENT") {
        return [];
      }

      throw new StorageError("Cannot read ticket data", { cause: error });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch (error) {
      throw new StorageError("Ticket data contains invalid JSON", {
        cause: error,
      });
    }

    if (!Array.isArray(parsed) || !parsed.every(isTicket)) {
      throw new StorageError("Ticket data has an invalid structure");
    }

    return parsed.map(cloneTicket);
  }

  private writeTickets(tickets: Ticket[]): void {
    const directory = dirname(this.filePath);
    const temporaryFile = `${this.filePath}.${process.pid}.${Date.now()}.tmp`;

    try {
      mkdirSync(directory, { recursive: true });
      writeFileSync(
        temporaryFile,
        `${JSON.stringify(tickets, null, 2)}\n`,
        "utf8",
      );
      renameSync(temporaryFile, this.filePath);
    } catch (error) {
      rmSync(temporaryFile, { force: true });
      throw new StorageError("Cannot write ticket data", { cause: error });
    }
  }
}
