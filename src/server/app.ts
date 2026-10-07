import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import Database from "better-sqlite3";
import express, { type ErrorRequestHandler, type Request, type Response } from "express";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { APIError } from "better-auth/api";
import { getMigrations } from "better-auth/db/migration";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { templates } from "../domain/templates.js";
import {
  activityInput,
  completionInput,
  createPlanInput,
  DomainError,
  identifier,
  profileInput,
  updatePlanInput,
} from "../domain/validation.js";
import { JourneyStore, migrate } from "./store.js";

export interface AppOptions {
  dataDirectory: string;
  origin: string;
  clientDirectory?: string;
  clock?: () => Date;
}

async function persistentSecret(directory: string): Promise<string> {
  const filename = path.join(directory, "auth-secret");
  try {
    await writeFile(filename, randomBytes(48).toString("base64url"), { flag: "wx", mode: 0o600 });
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "EEXIST")) throw error;
  }
  const secret = await readFile(filename, "utf8");
  if (!/^[A-Za-z0-9_-]{64}$/u.test(secret))
    throw new Error(
      "Local authentication secret is invalid; preserve the data directory and consult recovery guidance",
    );
  return secret;
}

export async function createApp(
  options: AppOptions,
): Promise<{ app: express.Express; close: () => void }> {
  const origin = new URL(options.origin);
  if (
    origin.protocol !== "http:" ||
    !["localhost", "127.0.0.1"].includes(origin.hostname) ||
    origin.origin !== options.origin
  )
    throw new Error("A canonical HTTP loopback origin is required");
  await mkdir(options.dataDirectory, { recursive: true });
  const secret = await persistentSecret(options.dataDirectory);
  const database = new Database(path.join(options.dataDirectory, "capstone.sqlite"));
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  database.pragma("busy_timeout = 5000");
  try {
    const authOptions: BetterAuthOptions = {
      appName: "Learning engagement local demo",
      database,
      baseURL: options.origin,
      secret,
      trustedOrigins: [options.origin],
      telemetry: { enabled: false },
      logger: { disabled: true },
      emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: false,
        minPasswordLength: 8,
        maxPasswordLength: 128,
      },
      rateLimit: { enabled: true, window: 60, max: 100, storage: "memory" },
      databaseHooks: {
        user: {
          create: {
            before: async (user) => {
              if (!user.name.trim() || user.name.trim().length > 80 || user.email.length > 254)
                throw new APIError("BAD_REQUEST", {
                  code: "INVALID_INPUT",
                  message: "Invalid account details",
                });
              return { data: { ...user, name: user.name.trim() } };
            },
          },
        },
      },
    };
    const authMigrations = await getMigrations(authOptions);
    if (authMigrations.unsafeChanges.length)
      throw new Error("Unsafe identity migration requires review");
    await authMigrations.runMigrations();
    migrate(database);
    const auth = betterAuth(authOptions);
    const store = new JourneyStore(database, options.clock ?? (() => new Date()));
    const app = express();
    app.disable("x-powered-by");
    app.use((request, response, next) => {
      response.set({
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
        "Content-Security-Policy":
          "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
      });
      if (request.get("host") !== origin.host)
        return void response.status(403).json({ error: { code: "invalid_host" } });
      const unsafe = !["GET", "HEAD", "OPTIONS"].includes(request.method);
      if ((unsafe || request.get("origin")) && request.get("origin") !== options.origin)
        return void response.status(403).json({ error: { code: "invalid_origin" } });
      if (unsafe && !request.is("application/json"))
        return void response.status(415).json({ error: { code: "json_required" } });
      next();
    });
    const exposedAuthPaths = new Set([
      "/api/auth/sign-up/email",
      "/api/auth/sign-in/email",
      "/api/auth/sign-out",
      "/api/auth/get-session",
      "/api/auth/ok",
    ]);
    app.all("/api/auth/*splat", (request, response) => {
      if (!exposedAuthPaths.has(request.path))
        return void response.status(404).json({ error: { code: "not_found" } });
      return toNodeHandler(auth)(request, response);
    });
    app.use(express.json({ limit: "64kb", strict: true }));
    app.get("/api/health", (_request, response) => {
      response.json({ status: "ok" });
    });
    app.use("/api", async (request, response, next) => {
      const session = await auth.api.getSession({ headers: fromNodeHeaders(request.headers) });
      if (!session) return void response.status(401).json({ error: { code: "unauthenticated" } });
      response.locals.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      };
      next();
    });
    const owner = (response: Response): string => (response.locals.user as { id: string }).id;
    const planId = (request: Request): string => identifier(request.params.id);
    app.get("/api/me", (_request, response) => {
      response.json({ user: response.locals.user, profile: store.profile(owner(response)) });
    });
    app.put("/api/me", (request, response) => {
      store.saveProfile(owner(response), profileInput(request.body));
      response.json({ user: response.locals.user, profile: store.profile(owner(response)) });
    });
    app.get("/api/templates", (_request, response) => {
      response.json({ templates });
    });
    app.get("/api/plans", (_request, response) => {
      response.json({ plans: store.list(owner(response)) });
    });
    app.post("/api/plans", (request, response) => {
      response.status(201).json(store.create(owner(response), createPlanInput(request.body)));
    });
    app.get("/api/plans/:id", (request, response) => {
      response.json(store.detail(owner(response), planId(request)));
    });
    app.put("/api/plans/:id", (request, response) => {
      response.json(store.update(owner(response), planId(request), updatePlanInput(request.body)));
    });
    app.post("/api/plans/:id/activities", (request, response) => {
      response.json(store.activity(owner(response), planId(request), activityInput(request.body)));
    });
    app.post("/api/plans/:id/completions", (request, response) => {
      response.json(
        store.complete(owner(response), planId(request), completionInput(request.body)),
      );
    });
    app.use("/api", (_request, response) => {
      response.status(404).json({ error: { code: "not_found" } });
    });
    if (options.clientDirectory) {
      app.use(express.static(options.clientDirectory, { etag: false }));
      const index = path.resolve(options.clientDirectory, "index.html");
      app.get("/{*splat}", (_request, response) => {
        response.sendFile(index);
      });
    }
    const errors: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
      if (error instanceof DomainError)
        return void response
          .status(error.status)
          .json({ error: { code: error.code, ...(error.field ? { field: error.field } : {}) } });
      if (error instanceof SyntaxError && "body" in error)
        return void response.status(400).json({ error: { code: "invalid_json" } });
      if (
        error !== null &&
        typeof error === "object" &&
        "type" in error &&
        error.type === "entity.too.large"
      )
        return void response.status(413).json({ error: { code: "payload_too_large" } });
      response.status(500).json({ error: { code: "save_failed" } });
    };
    app.use(errors);
    return { app, close: () => database.close() };
  } catch (error) {
    database.close();
    throw error;
  }
}
