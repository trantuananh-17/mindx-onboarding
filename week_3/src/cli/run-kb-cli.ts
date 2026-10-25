import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { parseArgs } from "node:util";

import { KBError, ValidationError } from "../domain/errors.ts";
import type { KBClient } from "../kb/kb-client.ts";

export interface CliIO {
  stdout(message: string): void;
  stderr(message: string): void;
}

export interface KbCliDependencies {
  client: KBClient;
  io: CliIO;
}

const USAGE = [
  "Usage:",
  '  kb search "<query>" [--top-k <n>]',
  "  kb list --node <path> [--limit <n>]",
  "  kb retrieve <doc-id>",
  "  kb add --file <path> --path <node> [--title <text>] [--tags <list>]",
].join("\n");

function parsePositiveInteger(
  value: string | undefined,
  fallback: number,
  fieldName: string,
): number {
  if (value === undefined) {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new ValidationError(`${fieldName} must be a positive integer`);
  }
  return parsed;
}

function formatSearchLine(
  id: string,
  matchType: string,
  title: string,
  nodePath: string,
): string {
  return `${id} | ${matchType} | ${title} | ${nodePath}`;
}

function deriveTitleFromFile(filePath: string, content: string, explicit?: string): string {
  const fromFlag = explicit?.trim();
  if (fromFlag) {
    return fromFlag;
  }

  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (heading) {
    return heading;
  }

  return basename(filePath).replace(/\.[^.]+$/, "");
}

export async function runKbCli(
  args: string[],
  dependencies: KbCliDependencies,
): Promise<number> {
  const { client, io } = dependencies;

  try {
    const [command, ...commandArgs] = args;

    if (command === undefined || command === "help" || command === "--help") {
      io.stdout(USAGE);
      return 0;
    }

    switch (command) {
      case "search": {
        const { values, positionals } = parseArgs({
          args: commandArgs,
          options: { "top-k": { type: "string" } },
          allowPositionals: true,
          strict: true,
        });
        const query = positionals.join(" ").trim();
        const topK = parsePositiveInteger(values["top-k"], 5, "top-k");
        const results = await client.search(query, topK);

        if (results.length === 0) {
          io.stdout("No documents matched your search.");
          return 0;
        }

        for (const result of results) {
          io.stdout(
            formatSearchLine(
              result.document.id,
              result.matchType,
              result.document.title,
              result.document.nodePath,
            ),
          );
        }
        return 0;
      }

      case "list": {
        const { values } = parseArgs({
          args: commandArgs,
          options: {
            node: { type: "string" },
            limit: { type: "string" },
          },
          strict: true,
        });
        const nodePath = values.node?.trim() ?? "";
        const limit = parsePositiveInteger(values.limit, 10, "limit");
        const documents = await client.list(nodePath, limit);

        if (documents.length === 0) {
          io.stdout("No documents found for this node.");
          return 0;
        }

        for (const document of documents) {
          io.stdout(`${document.id} | ${document.title} | ${document.nodePath}`);
        }
        return 0;
      }

      case "retrieve": {
        const docId = commandArgs[0]?.trim();
        if (!docId) {
          throw new ValidationError("doc id is required");
        }
        const document = await client.retrieve(docId);
        io.stdout(
          [
            `ID: ${document.id}`,
            `Title: ${document.title}`,
            `Node: ${document.nodePath}`,
            `Tags: ${document.tags.join(", ") || "(none)"}`,
            "",
            document.content,
          ].join("\n"),
        );
        return 0;
      }

      case "add": {
        const { values } = parseArgs({
          args: commandArgs,
          options: {
            file: { type: "string" },
            path: { type: "string" },
            title: { type: "string" },
            tags: { type: "string" },
          },
          strict: true,
        });
        const filePath = values.file?.trim();
        const nodePath = values.path?.trim();
        if (!filePath) {
          throw new ValidationError("--file is required");
        }
        if (!nodePath) {
          throw new ValidationError("--path is required");
        }

        const content = readFileSync(filePath, "utf8");
        const title = deriveTitleFromFile(filePath, content, values.title);
        const tags = values.tags?.split(",").map((tag) => tag.trim()) ?? [];
        const document = await client.add({
          title,
          content,
          nodePath,
          tags,
        });
        io.stdout(`Added document ${document.id}: ${document.title}`);
        return 0;
      }

      default:
        throw new ValidationError(`Unknown command: ${command}`);
    }
  } catch (error) {
    if (error instanceof KBError) {
      io.stderr(error.message);
      return 1;
    }
    if (error instanceof Error && error.message.startsWith("Unknown option")) {
      io.stderr(error.message);
      return 1;
    }
    io.stderr(error instanceof Error ? error.message : "Unexpected CLI error");
    return 1;
  }
}
