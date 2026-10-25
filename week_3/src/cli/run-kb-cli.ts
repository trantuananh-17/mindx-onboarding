import type { KBClient } from "../kb/kb-client.ts";

export interface CliIO {
  stdout(message: string): void;
  stderr(message: string): void;
}

export interface KbCliDependencies {
  client: KBClient;
  io: CliIO;
}

export async function runKbCli(
  _args: string[],
  _dependencies: KbCliDependencies,
): Promise<number> {
  throw new Error("CLI not implemented");
}
