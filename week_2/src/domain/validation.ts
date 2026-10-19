import { ValidationError } from "./errors.ts";
import type { TicketPriority, TicketStatus } from "./ticket.ts";

const PRIORITIES: TicketPriority[] = ["low", "medium", "high"];
const STATUSES: TicketStatus[] = ["open", "in-progress", "closed"];

export function normalizeTitle(value: string): string {
  const title = value.trim();

  if (title.length === 0) {
    throw new ValidationError("Title is required");
  }
  if (title.length > 100) {
    throw new ValidationError("Title must be at most 100 characters");
  }

  return title;
}

export function normalizeDescription(value?: string): string {
  const description = (value ?? "").trim();

  if (description.length > 1_000) {
    throw new ValidationError(
      "Description must be at most 1000 characters",
    );
  }

  return description;
}

export function normalizeTags(values?: string[]): string[] {
  return [
    ...new Set(
      (values ?? [])
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0),
    ),
  ];
}

export function parsePriority(
  value: string | undefined,
  defaultValue: TicketPriority = "medium",
): TicketPriority {
  const priority = value ?? defaultValue;

  if (!PRIORITIES.includes(priority as TicketPriority)) {
    throw new ValidationError("Priority must be one of: low, medium, high");
  }

  return priority as TicketPriority;
}

export function parseStatus(value: string): TicketStatus {
  if (!STATUSES.includes(value as TicketStatus)) {
    throw new ValidationError(
      "Status must be one of: open, in-progress, closed",
    );
  }

  return value as TicketStatus;
}

export function validateTicketId(value: number): number {
  if (!Number.isInteger(value) || value <= 0) {
    throw new ValidationError("ID must be a positive integer");
  }

  return value;
}
