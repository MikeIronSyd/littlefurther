import path from "node:path";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { parseEnv } from "node:util";
import { createApp } from "./app.js";

const portText = process.env.CAPSTONE_PORT ?? "4317";
const port = Number(portText);
if (!/^\d+$/u.test(portText) || !Number.isInteger(port) || port < 1024 || port > 65535)
  throw new Error("CAPSTONE_PORT must be an integer from 1024 to 65535");
const bindHost = process.env.CAPSTONE_BIND_HOST ?? "127.0.0.1";
if (bindHost !== "127.0.0.1" && bindHost !== "0.0.0.0")
  throw new Error("CAPSTONE_BIND_HOST must be 127.0.0.1 or 0.0.0.0");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const origin = `http://127.0.0.1:${port}`;
async function configuredAiKey(): Promise<string | undefined> {
  // Process/check harnesses disable AI before even reading the ordinary operator credential file.
  if (process.env.CAPSTONE_AI_DISABLED === "1") return undefined;
  if (process.env.OPENAI_API_KEY !== undefined)
    return process.env.OPENAI_API_KEY.trim() || undefined;
  try {
    const contents = await readFile(path.join(root, ".local/ai-provider.env"), "utf8");
    if (Buffer.byteLength(contents, "utf8") > 65_536) return undefined;
    return parseEnv(contents).OPENAI_API_KEY?.trim() || undefined;
  } catch {
    return undefined;
  }
}
const aiKey = await configuredAiKey();
const running = await createApp({
  dataDirectory: path.resolve(process.env.CAPSTONE_DATA_DIR ?? path.join(root, ".local/data")),
  origin,
  clientDirectory: path.join(root, "dist/client"),
  ...(aiKey ? { ai: { apiKey: aiKey } } : {}),
});
const server = createServer(running.app);
server.on("error", (error) => {
  running.close();
  console.error(
    error instanceof Error && "code" in error && error.code === "EADDRINUSE"
      ? `Port ${port} is already in use; choose another CAPSTONE_PORT.`
      : "Local server could not start.",
  );
  process.exitCode = 1;
});
server.listen(port, bindHost, () => {
  console.log(`Local learning demo: ${origin}\nKeep this process running. Stop with Ctrl+C.`);
});
let stopping = false;
function stop(): void {
  if (stopping) return;
  stopping = true;
  server.closeAllConnections();
  server.close(() => {
    running.close();
  });
}
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
