import { readFile } from "node:fs/promises";
import { createServer } from "node:http";

// An optional artifact viewer, separate from the application server.
const files = new Map([
  ["/", ["reference.html", "text/html; charset=utf-8"]],
  ["/reference.html", ["reference.html", "text/html; charset=utf-8"]],
  ["/mark.svg", ["mark.svg", "image/svg+xml"]],
  ["/reference.png", ["reference.png", "image/png"]],
  ["/wordmark-preview.png", ["wordmark-preview.png", "image/png"]],
  ["/options.html", ["options.html", "text/html; charset=utf-8"]],
  ["/mark-b.svg", ["mark-b.svg", "image/svg+xml"]],
  ["/mark-c.svg", ["mark-c.svg", "image/svg+xml"]],
  ["/options.png", ["options.png", "image/png"]],
  ["/choices.png", ["choices.png", "image/png"]],
]);
const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }
  let pathname;
  try {
    pathname = new URL(request.url, "http://127.0.0.1:4320").pathname;
  } catch {
    response.writeHead(400);
    response.end();
    return;
  }
  const file = files.get(pathname);
  if (!file) {
    response.writeHead(404);
    response.end();
    return;
  }
  try {
    const body = await readFile(new URL(file[0], import.meta.url));
    response.writeHead(200, { "Content-Type": file[1], "Cache-Control": "no-store" });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(500);
    response.end("Reference unavailable");
  }
});
server.on("error", (error) => {
  console.error(`Reference viewer could not start: ${error.message}`);
  process.exitCode = 1;
});
server.listen(4320, "127.0.0.1", () => {
  console.log("LittleFurther artwork reference: http://127.0.0.1:4320/");
});
