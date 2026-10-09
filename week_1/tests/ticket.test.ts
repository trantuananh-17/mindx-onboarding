import { beforeEach, describe, expect, it } from "vitest";

import { addTicket, InMemoryTicketRepository } from "../src/ticket";

describe("addTicket", () => {
  let repository: InMemoryTicketRepository;

  beforeEach(() => {
    repository = new InMemoryTicketRepository();
  });

  it("creates and saves an open ticket when the title is valid", () => {
    const result = addTicket({ title: "Login error" }, repository);

    expect(result).toEqual({
      id: 1,
      title: "Login error",
      status: "open",
    });
    expect(repository.findById(result.id)).toEqual(result);
  });

  it("rejects an empty title without saving a ticket", () => {
    expect(() => addTicket({ title: "" }, repository)).toThrow(
      "Title is required",
    );
    expect(repository.findAll()).toHaveLength(0);
  });

  it("rejects a title containing only spaces", () => {
    expect(() => addTicket({ title: "   " }, repository)).toThrow(
      "Title is required",
    );
    expect(repository.findAll()).toHaveLength(0);
  });

  it("trims unnecessary spaces from the title", () => {
    const result = addTicket({ title: "  Login error  " }, repository);

    expect(result.title).toBe("Login error");
  });

  it("creates unique IDs without overwriting existing tickets", () => {
    const firstTicket = addTicket({ title: "Login error" }, repository);
    const secondTicket = addTicket({ title: "Payment error" }, repository);

    expect(firstTicket.id).toBe(1);
    expect(secondTicket.id).toBe(2);
    expect(repository.findAll()).toHaveLength(2);
    expect(repository.findById(1)?.title).toBe("Login error");
    expect(repository.findById(2)?.title).toBe("Payment error");
  });
});
