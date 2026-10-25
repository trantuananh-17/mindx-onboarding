export class KBError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "KBError";
  }
}

export class ValidationError extends KBError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends KBError {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class KBClientError extends KBError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "KBClientError";
  }
}
