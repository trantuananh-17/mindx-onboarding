import { TicketNotFoundError } from "../domain/errors.ts";
import type { Clock, Ticket, TicketRepository } from "../domain/ticket.ts";
import { parseStatus, validateTicketId } from "../domain/validation.ts";

export function updateTicketStatus(
  id: number,
  status: string,
  repository: TicketRepository,
  clock: Clock,
): Ticket {
  const validId = validateTicketId(id);
  const validStatus = parseStatus(status);
  const ticket = repository.findById(validId);

  if (!ticket) {
    throw new TicketNotFoundError(validId);
  }

  const updatedTicket: Ticket = {
    ...ticket,
    tags: [...ticket.tags],
    status: validStatus,
    updatedAt: clock().toISOString(),
  };

  repository.save(updatedTicket);

  return updatedTicket;
}
