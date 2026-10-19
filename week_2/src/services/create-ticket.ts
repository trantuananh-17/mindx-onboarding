import type {
  Clock,
  NewTicketInput,
  Ticket,
  TicketRepository,
} from "../domain/ticket.ts";
import {
  normalizeDescription,
  normalizeTags,
  normalizeTitle,
  parsePriority,
} from "../domain/validation.ts";

export function createTicket(
  input: NewTicketInput,
  repository: TicketRepository,
  clock: Clock,
): Ticket {
  const title = normalizeTitle(input.title);
  const description = normalizeDescription(input.description);
  const priority = parsePriority(input.priority);
  const tags = normalizeTags(input.tags);

  const timestamp = clock().toISOString();
  const ticket: Ticket = {
    id: repository.nextId(),
    title,
    description,
    status: "open",
    priority,
    tags,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  repository.save(ticket);

  return ticket;
}
