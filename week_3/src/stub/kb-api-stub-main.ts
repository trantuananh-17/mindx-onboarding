#!/usr/bin/env node

import { loadEnvFile } from "../env/load-env-file.ts";
import { startKbApiStub } from "./kb-api-stub.ts";

loadEnvFile();

const port = Number(process.env.KB_STUB_PORT ?? "3928");

const stub = await startKbApiStub({ port, host: "127.0.0.1" });

console.log(`KB API stub listening at ${stub.baseUrl}`);
console.log("Endpoints: POST /search, /list, /retrieve, /add");
console.log("Press Ctrl+C to stop.");

process.on("SIGINT", () => {
  void stub.close().finally(() => process.exit(0));
});
  

