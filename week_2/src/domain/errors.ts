export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class TicketNotFoundError extends Error {
  constructor(id: number) {
    super(`Ticket #${id} not found`);
    this.name = "TicketNotFoundError";
  }
}

export class StorageError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "StorageError";
  }
}
