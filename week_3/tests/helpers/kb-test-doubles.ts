import { vi } from "vitest";

export function createMockCliIO() {
  return {
    stdout: vi.fn((_message: string) => undefined),
    stderr: vi.fn((_message: string) => undefined),
  };
}
