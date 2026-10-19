import type {
  Ticket,
  TicketFilters,
  TicketRepository,
} from "../domain/ticket.ts";
import { parsePriority, parseStatus } from "../domain/validation.ts";

export function listTickets(
  filters: TicketFilters,
  repository: TicketRepository,
): Ticket[] {
  const status =
    filters.status === undefined ? undefined : parseStatus(filters.status);
  const priority =
    filters.priority === undefined
      ? undefined
      : parsePriority(filters.priority);
  const tag = filters.tag?.trim().toLowerCase();

  return repository
    .findAll()
    .filter((ticket) => status === undefined || ticket.status === status)
    .filter((ticket) => priority === undefined || ticket.priority === priority)
    .filter((ticket) => tag === undefined || ticket.tags.includes(tag))
    .sort((left, right) => left.id - right.id);
}
