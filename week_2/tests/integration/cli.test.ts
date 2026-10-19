import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { runCli } from "../../src/cli/run-cli";
import { JsonTicketRepository } from "../../src/storage/json-ticket-repository";
import {
  createFixedClock,
  createMockCliIO,
} from "../helpers/ticket-test-doubles";

describe("Ticket Manager CLI", () => {
  let temporaryDirectory: string;
  let dataFile: string;

  beforeEach(() => {
    temporaryDirectory = mkdtempSync(join(tmpdir(), "ticket-cli-"));
    dataFile = join(temporaryDirectory, "tickets.json");
  });

  afterEach(() => {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  });

  function execute(args: string[]) {
    const io = createMockCliIO();
    const repository = new JsonTicketRepository(dataFile);
    const exitCode = runCli(args, {
      repository,
      clock: createFixedClock(),
      io,
    });

    return { exitCode, io, repository };
  }

  it("tạo ticket rồi liệt kê ticket đã được lưu", () => {
    const created = execute([
      "create",
      "--title",
      "  Lỗi đăng nhập  ",
      "--priority",
      "high",
      "--tags",
      "auth, urgent,auth",
    ]);

    expect(created.exitCode).toBe(0);
    expect(created.io.stderr).not.toHaveBeenCalled();
    expect(created.io.stdout).toHaveBeenCalledWith(
      "Created ticket #1: Lỗi đăng nhập",
    );
    expect(created.repository.findById(1)).toMatchObject({
      title: "Lỗi đăng nhập",
      priority: "high",
      tags: ["auth", "urgent"],
    });

    const listed = execute(["list", "--status", "open", "--tag", "auth"]);

    expect(listed.exitCode).toBe(0);
    expect(listed.io.stdout).toHaveBeenCalledWith(
      "1 | open | high | Lỗi đăng nhập",
    );
  });

  it("hiển thị và cập nhật status của ticket", () => {
    execute(["create", "--title", "Lỗi đăng nhập"]);

    const shown = execute(["show", "1"]);
    expect(shown.exitCode).toBe(0);
    expect(shown.io.stdout).toHaveBeenCalledWith(
      expect.stringContaining("Title: Lỗi đăng nhập"),
    );
    expect(shown.io.stdout).toHaveBeenCalledWith(
      expect.stringContaining("Status: open"),
    );

    const updated = execute(["update", "1", "--status", "closed"]);
    expect(updated.exitCode).toBe(0);
    expect(updated.io.stdout).toHaveBeenCalledWith(
      "Updated ticket #1 to closed",
    );
    expect(updated.repository.findById(1)?.status).toBe("closed");
  });

  it("trả lỗi trên stderr và không lưu khi input không hợp lệ", () => {
    const result = execute(["create", "--title", "   "]);

    expect(result.exitCode).toBe(1);
    expect(result.io.stdout).not.toHaveBeenCalled();
    expect(result.io.stderr).toHaveBeenCalledWith("Title is required");
    expect(result.repository.findAll()).toEqual([]);
  });

  it("trả lỗi cho command không tồn tại", () => {
    const result = execute(["remove", "1"]);

    expect(result.exitCode).toBe(1);
    expect(result.io.stderr).toHaveBeenCalledWith(
      expect.stringContaining("Unknown command: remove"),
    );
  });

  it("không ghi đè tệp JSON hỏng", () => {
    const invalidJson = "{broken";
    writeFileSync(dataFile, invalidJson, "utf8");

    const result = execute(["create", "--title", "Lỗi đăng nhập"]);

    expect(result.exitCode).toBe(1);
    expect(result.io.stderr).toHaveBeenCalledWith(
      "Ticket data contains invalid JSON",
    );
    expect(readFileSync(dataFile, "utf8")).toBe(invalidJson);
  });

  it("báo kho rỗng trên stdout và exit 0 khi chưa có ticket", () => {
    const result = execute(["list"]);

    expect(result.exitCode).toBe(0);
    expect(result.io.stdout).toHaveBeenCalledWith("No tickets found.");
    expect(result.io.stderr).not.toHaveBeenCalled();
  });

  it("báo không có kết quả khi filter không khớp ticket nào", () => {
    execute(["create", "--title", "Lỗi đăng nhập"]);

    const result = execute(["list", "--status", "closed"]);

    expect(result.exitCode).toBe(0);
    expect(result.io.stdout).toHaveBeenCalledWith("No tickets found.");
  });

  it("trả lỗi khi show với ID không hợp lệ", () => {
    const result = execute(["show", "0"]);

    expect(result.exitCode).toBe(1);
    expect(result.io.stderr).toHaveBeenCalledWith(
      "ID must be a positive integer",
    );
    expect(result.io.stdout).not.toHaveBeenCalled();
  });

  it("trả lỗi khi update status không hợp lệ mà không đổi dữ liệu", () => {
    execute(["create", "--title", "Lỗi đăng nhập"]);

    const result = execute(["update", "1", "--status", "urgent"]);

    expect(result.exitCode).toBe(1);
    expect(result.io.stderr).toHaveBeenCalledWith(
      "Status must be one of: open, in-progress, closed",
    );
    expect(result.repository.findById(1)?.status).toBe("open");
  });

  it("trả lỗi khi update ticket không tồn tại", () => {
    const result = execute(["update", "999", "--status", "closed"]);

    expect(result.exitCode).toBe(1);
    expect(result.io.stderr).toHaveBeenCalledWith("Ticket #999 not found");
    expect(result.repository.findAll()).toEqual([]);
  });
});
