export type TicketStatus = "open";

export interface Ticket {
  id: number;
  title: string;
  status: TicketStatus;
}

export interface NewTicketInput {
  title: string;
}

export interface TicketRepository {
  nextId(): number;
  save(ticket: Ticket): void;
  findById(id: number): Ticket | undefined;
  findAll(): Ticket[];
}

export class InMemoryTicketRepository implements TicketRepository {
  private tickets: Ticket[] = [];

  nextId(): number {
    if (this.tickets.length === 0) {
      return 1;
    }

    return Math.max(...this.tickets.map((ticket) => ticket.id)) + 1;
  }

  save(ticket: Ticket): void {
    this.tickets.push({ ...ticket });
  }

  findById(id: number): Ticket | undefined {
    return this.tickets.find((ticket) => ticket.id === id);
  }

  findAll(): Ticket[] {
    return this.tickets.map((ticket) => ({ ...ticket }));
  }
}

export function addTicket(
  input: NewTicketInput,
  repository: TicketRepository,
): Ticket {
  const title = input.title.trim();

  if (title.length === 0) {
    throw new Error("Title is required");
  }

  const ticket: Ticket = {
    id: repository.nextId(),
    title,
    status: "open",
  };

  repository.save(ticket);

  return ticket;
}
