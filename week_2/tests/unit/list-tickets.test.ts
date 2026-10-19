import { describe, expect, it } from "vitest";

import { listTickets } from "../../src/services/list-tickets";
import {
  createMockTicketRepository,
  createTicketFixture,
} from "../helpers/ticket-test-doubles";

describe("listTickets", () => {
  const tickets = [
    createTicketFixture({
      id: 3,
      title: "Lỗi báo cáo",
      status: "closed",
      priority: "high",
      tags: ["report"],
    }),
    createTicketFixture({
      id: 1,
      title: "Lỗi đăng nhập",
      status: "open",
      priority: "high",
      tags: ["auth", "urgent"],
    }),
    createTicketFixture({
      id: 2,
      title: "Lỗi giao diện",
      status: "open",
      priority: "low",
      tags: ["ui"],
    }),
  ];

  it("trả toàn bộ ticket theo ID tăng dần", () => {
    const repository = createMockTicketRepository(tickets);

    const result = listTickets({}, repository);

    expect(result.map(({ id }) => id)).toEqual([1, 2, 3]);
    expect(repository.snapshot()).toEqual(tickets);
  });

  it("trả mảng rỗng khi repository không có ticket", () => {
    const repository = createMockTicketRepository();

    expect(listTickets({}, repository)).toEqual([]);
  });

  it("lọc riêng theo status", () => {
    const repository = createMockTicketRepository(tickets);

    expect(listTickets({ status: "closed" }, repository)).toEqual([tickets[0]]);
  });

  it("lọc riêng theo priority", () => {
    const repository = createMockTicketRepository(tickets);

    expect(listTickets({ priority: "low" }, repository)).toEqual([tickets[2]]);
  });

  it("lọc riêng theo tag sau khi chuẩn hóa", () => {
    const repository = createMockTicketRepository(tickets);

    expect(listTickets({ tag: " UI " }, repository)).toEqual([tickets[2]]);
  });

  it("kết hợp status, priority và tag theo điều kiện AND", () => {
    const repository = createMockTicketRepository(tickets);

    const result = listTickets(
      { status: "open", priority: "high", tag: " AUTH " },
      repository,
    );

    expect(result).toEqual([tickets[1]]);
  });

  it("từ chối filter không hợp lệ", () => {
    const repository = createMockTicketRepository(tickets);

    expect(() => listTickets({ status: "unknown" }, repository)).toThrow(
      "Status must be one of: open, in-progress, closed",
    );
    expect(() => listTickets({ priority: "urgent" }, repository)).toThrow(
      "Priority must be one of: low, medium, high",
    );
    expect(repository.findAll).not.toHaveBeenCalled();
    expect(repository.snapshot()).toEqual(tickets);
  });
});
