import { describe, expect, it } from "vitest";

import { showTicket } from "../../src/services/show-ticket";
import {
  createMockTicketRepository,
  createTicketFixture,
} from "../helpers/ticket-test-doubles";

describe("showTicket", () => {
  it("trả đúng ticket khi ID tồn tại", () => {
    const ticket = createTicketFixture({ id: 2 });
    const repository = createMockTicketRepository([ticket]);

    expect(showTicket(2, repository)).toEqual(ticket);
  });

  it.each([0, -1, 1.5, Number.NaN])("từ chối ID không hợp lệ: %s", (id) => {
    const repository = createMockTicketRepository();

    expect(() => showTicket(id, repository)).toThrow(
      "ID must be a positive integer",
    );
    expect(repository.findById).not.toHaveBeenCalled();
  });

  it("báo lỗi khi ticket không tồn tại", () => {
    const repository = createMockTicketRepository();

    expect(() => showTicket(999, repository)).toThrow(
      "Ticket #999 not found",
    );
  });
});
