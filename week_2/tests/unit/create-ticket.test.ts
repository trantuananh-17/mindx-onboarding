import { describe, expect, it } from "vitest";

import { createTicket } from "../../src/services/create-ticket";
import {
  createFixedClock,
  createMockTicketRepository,
  createTicketFixture,
} from "../helpers/ticket-test-doubles";

describe("createTicket", () => {
  it("tạo và lưu ticket với các giá trị mặc định", () => {
    const repository = createMockTicketRepository();
    const clock = createFixedClock();

    const result = createTicket(
      { title: "  Lỗi đăng nhập  " },
      repository,
      clock,
    );

    expect(result).toEqual(createTicketFixture());
    expect(repository.nextId).toHaveBeenCalledOnce();
    expect(repository.save).toHaveBeenCalledOnce();
    expect(repository.save).toHaveBeenCalledWith(result);
    expect(repository.snapshot()).toEqual([result]);
    expect(clock).toHaveBeenCalledOnce();
  });

  it.each(["", "   "])(
    "từ chối title không có nội dung mà không thay đổi repository",
    (title) => {
      const repository = createMockTicketRepository();
      const clock = createFixedClock();

      expect(() => createTicket({ title }, repository, clock)).toThrow(
        "Title is required",
      );
      expect(repository.snapshot()).toEqual([]);
      expect(repository.nextId).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
      expect(clock).not.toHaveBeenCalled();
    },
  );

  it("từ chối title dài hơn 100 ký tự", () => {
    const repository = createMockTicketRepository();

    expect(() =>
      createTicket(
        { title: "a".repeat(101) },
        repository,
        createFixedClock(),
      ),
    ).toThrow("Title must be at most 100 characters");
    expect(repository.snapshot()).toEqual([]);
  });

  it("chuẩn hóa description, priority và tags hợp lệ", () => {
    const repository = createMockTicketRepository();

    const result = createTicket(
      {
        title: "Lỗi thanh toán",
        description: "  Không thể thanh toán bằng thẻ  ",
        priority: "high",
        tags: [" Payment ", "URGENT", "payment", ""],
      },
      repository,
      createFixedClock(),
    );

    expect(result).toEqual(
      createTicketFixture({
        title: "Lỗi thanh toán",
        description: "Không thể thanh toán bằng thẻ",
        priority: "high",
        tags: ["payment", "urgent"],
      }),
    );
    expect(repository.snapshot()).toEqual([result]);
  });

  it("từ chối priority không hợp lệ mà không lưu ticket", () => {
    const repository = createMockTicketRepository();

    expect(() =>
      createTicket(
        { title: "Lỗi đăng nhập", priority: "urgent" },
        repository,
        createFixedClock(),
      ),
    ).toThrow("Priority must be one of: low, medium, high");
    expect(repository.snapshot()).toEqual([]);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it("từ chối description dài hơn 1.000 ký tự", () => {
    const existingTicket = createTicketFixture();
    const repository = createMockTicketRepository([existingTicket]);

    expect(() =>
      createTicket(
        {
          title: "Lỗi thanh toán",
          description: "a".repeat(1_001),
        },
        repository,
        createFixedClock(),
      ),
    ).toThrow("Description must be at most 1000 characters");
    expect(repository.snapshot()).toEqual([existingTicket]);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it("tạo ID kế tiếp mà không ghi đè ticket hiện có", () => {
    const existingTicket = createTicketFixture();
    const repository = createMockTicketRepository([existingTicket]);

    const result = createTicket(
      { title: "Lỗi thanh toán" },
      repository,
      createFixedClock(),
    );

    expect(result.id).toBe(2);
    expect(repository.snapshot()).toEqual([
      existingTicket,
      createTicketFixture({ id: 2, title: "Lỗi thanh toán" }),
    ]);
  });
});
