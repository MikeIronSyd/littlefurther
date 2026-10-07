import { readdir } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(".local/test-build/tests");
const files = (await readdir(root, { recursive: true }))
  .filter((file) => file.endsWith(".test.js"))
  .map((file) => path.join(root, file));
if (!files.length) throw new Error("No compiled domain/HTTP tests found.");
const result = spawnSync(process.execPath, ["--test", ...files], { stdio: "inherit" });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
