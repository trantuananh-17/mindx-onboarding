import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import {
  chmodSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { JsonTicketRepository } from "../../src/storage/json-ticket-repository";
import { createTicketFixture } from "../helpers/ticket-test-doubles";

describe("JsonTicketRepository", () => {
  let temporaryDirectory: string;
  let dataFile: string;

  beforeEach(() => {
    temporaryDirectory = mkdtempSync(join(tmpdir(), "ticket-manager-"));
    dataFile = join(temporaryDirectory, "tickets.json");
  });

  afterEach(() => {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  });

  it("xem tệp chưa tồn tại là repository rỗng", () => {
    const repository = new JsonTicketRepository(dataFile);

    expect(repository.findAll()).toEqual([]);
    expect(repository.nextId()).toBe(1);
  });

  it("ghi ticket và đọc lại đầy đủ từ tệp JSON", () => {
    const ticket = createTicketFixture();
    const repository = new JsonTicketRepository(dataFile);

    repository.save(ticket);

    const reopenedRepository = new JsonTicketRepository(dataFile);
    expect(reopenedRepository.findAll()).toEqual([ticket]);
    expect(reopenedRepository.findById(ticket.id)).toEqual(ticket);
    expect(reopenedRepository.nextId()).toBe(2);
  });

  it("cập nhật một ticket mà không làm mất ticket khác", () => {
    const firstTicket = createTicketFixture();
    const secondTicket = createTicketFixture({ id: 2, title: "Lỗi thanh toán" });
    const repository = new JsonTicketRepository(dataFile);
    repository.save(firstTicket);
    repository.save(secondTicket);

    repository.save({ ...firstTicket, status: "closed" });

    expect(repository.findAll()).toEqual([
      { ...firstTicket, status: "closed" },
      secondTicket,
    ]);
  });

  it("báo lỗi và giữ nguyên tệp JSON sai cú pháp", () => {
    const invalidJson = "{not-json";
    writeFileSync(dataFile, invalidJson, "utf8");
    const repository = new JsonTicketRepository(dataFile);

    expect(() => repository.findAll()).toThrow(
      "Ticket data contains invalid JSON",
    );
    expect(readFileSync(dataFile, "utf8")).toBe(invalidJson);
  });

  it("từ chối JSON đúng cú pháp nhưng sai cấu trúc", () => {
    const invalidStructure = JSON.stringify([{ id: 1 }]);
    writeFileSync(dataFile, invalidStructure, "utf8");
    const repository = new JsonTicketRepository(dataFile);

    expect(() => repository.findAll()).toThrow(
      "Ticket data has an invalid structure",
    );
    expect(readFileSync(dataFile, "utf8")).toBe(invalidStructure);
  });

  it("báo lỗi khi không ghi được dữ liệu", () => {
    writeFileSync(dataFile, "[]\n", "utf8");
    chmodSync(dataFile, 0o444);
    const repository = new JsonTicketRepository(dataFile);
    const originalContent = readFileSync(dataFile, "utf8");

    expect(() => repository.save(createTicketFixture())).toThrow(
      "Cannot write ticket data",
    );
    expect(readFileSync(dataFile, "utf8")).toBe(originalContent);
  });
});
