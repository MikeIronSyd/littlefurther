import type { ApiError } from "../shared/contracts.js";
import type { MessageKey } from "./i18n.js";
export class RequestError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
  ) {
    super(code);
  }
}
export async function request<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method,
      credentials: "same-origin",
      headers:
        body === undefined
          ? { Accept: "application/json" }
          : { Accept: "application/json", "Content-Type": "application/json" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch {
    throw new RequestError("NETWORK", 0);
  }
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new RequestError("UNEXPECTED", response.status);
  }
  if (!response.ok) {
    const result = data as Partial<ApiError> & { code?: string };
    throw new RequestError(result.error?.code ?? result.code ?? "UNEXPECTED", response.status);
  }
  return data as T;
}
export function errorKey(error: unknown): MessageKey {
  if (!(error instanceof RequestError)) return "genericError";
  if (error.status === 0) return "networkError";
  if (error.status === 401) return "signedOut";
  if (error.status === 409) return "stale";
  if (error.status === 403 || error.status === 404) return "forbidden";
  if (error.status === 413) return "limitError";
  if (error.code.includes("TIMEZONE")) return "invalidTimezone";
  if (error.code.includes("URL") || error.code.includes("REFERENCE")) return "invalidLink";
  if (error.code.includes("DATE")) return "invalidDate";
  if (error.code.includes("PROFILE")) return "profileRequired";
  return error.status === 400 ? "validation" : "saveError";
}
