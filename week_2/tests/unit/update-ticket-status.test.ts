import { describe, expect, it } from "vitest";

import { updateTicketStatus } from "../../src/services/update-ticket-status";
import {
  createFixedClock,
  createMockTicketRepository,
  createTicketFixture,
} from "../helpers/ticket-test-doubles";

describe("updateTicketStatus", () => {
  it("cập nhật status và updatedAt nhưng giữ nguyên các trường khác", () => {
    const original = createTicketFixture({
      description: "Không thể đăng nhập",
      priority: "high",
      tags: ["auth"],
    });
    const repository = createMockTicketRepository([original]);
    const clock = createFixedClock("2026-10-18T03:00:00.000Z");

    const result = updateTicketStatus(1, "in-progress", repository, clock);

    expect(result).toEqual({
      ...original,
      status: "in-progress",
      updatedAt: "2026-10-18T03:00:00.000Z",
    });
    expect(repository.snapshot()).toEqual([result]);
    expect(repository.save).toHaveBeenCalledOnce();
  });

  it("từ chối status không hợp lệ mà không thay đổi dữ liệu", () => {
    const original = createTicketFixture();
    const repository = createMockTicketRepository([original]);
    const clock = createFixedClock();

    expect(() =>
      updateTicketStatus(1, "done", repository, clock),
    ).toThrow("Status must be one of: open, in-progress, closed");
    expect(repository.snapshot()).toEqual([original]);
    expect(repository.save).not.toHaveBeenCalled();
    expect(clock).not.toHaveBeenCalled();
  });

  it("báo lỗi khi ticket không tồn tại mà không lưu dữ liệu", () => {
    const repository = createMockTicketRepository();
    const clock = createFixedClock();

    expect(() =>
      updateTicketStatus(999, "closed", repository, clock),
    ).toThrow("Ticket #999 not found");
    expect(repository.save).not.toHaveBeenCalled();
    expect(clock).not.toHaveBeenCalled();
  });
});
