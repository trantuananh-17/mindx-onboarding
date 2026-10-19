import { vi } from "vitest";

export type TicketStatus = "open" | "in-progress" | "closed";
export type TicketPriority = "low" | "medium" | "high";

export interface TicketTestRecord {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_TIME = "2026-10-17T02:00:00.000Z";

function cloneTicket(ticket: TicketTestRecord): TicketTestRecord {
  return {
    ...ticket,
    tags: [...ticket.tags],
  };
}

export function createTicketFixture(
  overrides: Partial<TicketTestRecord> = {},
): TicketTestRecord {
  const ticket: TicketTestRecord = {
    id: 1,
    title: "Lỗi đăng nhập",
    description: "",
    status: "open",
    priority: "medium",
    tags: [],
    createdAt: DEFAULT_TIME,
    updatedAt: DEFAULT_TIME,
    ...overrides,
  };

  return cloneTicket(ticket);
}

export function createMockTicketRepository(
  initialTickets: TicketTestRecord[] = [],
) {
  let tickets = initialTickets.map(cloneTicket);

  const nextId = vi.fn(() => {
    if (tickets.length === 0) {
      return 1;
    }

    return Math.max(...tickets.map((ticket) => ticket.id)) + 1;
  });

  const save = vi.fn((ticket: TicketTestRecord) => {
    const existingIndex = tickets.findIndex(({ id }) => id === ticket.id);

    if (existingIndex === -1) {
      tickets.push(cloneTicket(ticket));
      return;
    }

    tickets[existingIndex] = cloneTicket(ticket);
  });

  const findById = vi.fn((id: number) => {
    const ticket = tickets.find((candidate) => candidate.id === id);
    return ticket ? cloneTicket(ticket) : undefined;
  });

  const findAll = vi.fn(() => tickets.map(cloneTicket));

  const snapshot = () => tickets.map(cloneTicket);

  return {
    nextId,
    save,
    findById,
    findAll,
    snapshot,
  };
}

export function createFixedClock(isoTime = DEFAULT_TIME) {
  const instant = new Date(isoTime);

  if (Number.isNaN(instant.getTime())) {
    throw new Error(`Thời gian test không hợp lệ: ${isoTime}`);
  }

  return vi.fn(() => new Date(instant.getTime()));
}

export function createMockCliIO() {
  return {
    stdout: vi.fn((_message: string) => undefined),
    stderr: vi.fn((_message: string) => undefined),
    setExitCode: vi.fn((_code: number) => undefined),
  };
}
