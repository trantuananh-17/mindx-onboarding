import { TicketNotFoundError } from "../domain/errors.ts";
import type { Ticket, TicketRepository } from "../domain/ticket.ts";
import { validateTicketId } from "../domain/validation.ts";

export function showTicket(
  id: number,
  repository: TicketRepository,
): Ticket {
  const validId = validateTicketId(id);
  const ticket = repository.findById(validId);

  if (!ticket) {
    throw new TicketNotFoundError(validId);
  }

  return ticket;
}
