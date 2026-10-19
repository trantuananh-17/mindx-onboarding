export type TicketStatus = "open" | "in-progress" | "closed";
export type TicketPriority = "low" | "medium" | "high";

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NewTicketInput {
  title: string;
  description?: string;
  priority?: string;
  tags?: string[];
}

export interface TicketFilters {
  status?: string;
  priority?: string;
  tag?: string;
}

export interface TicketRepository {
  nextId(): number;
  save(ticket: Ticket): void;
  findById(id: number): Ticket | undefined;
  findAll(): Ticket[];
}

export type Clock = () => Date;
