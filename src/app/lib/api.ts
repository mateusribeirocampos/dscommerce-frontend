const DEV_API_BASE_URL = "http://localhost:8080";

const envApiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

export const API_BASE_URL =
  envApiBaseUrl || process.env.NODE_ENV === "development"
    ? envApiBaseUrl || DEV_API_BASE_URL
    : "";

export const API_BASE_URL_LABEL = API_BASE_URL || "NEXT_PUBLIC_API_URL";

/**
 * Typed error that carries the HTTP status code.
 * Useful for distinguishing 404 (not found) from 401 (unauthorized).
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiFetchOptions = RequestInit & {
  /** Override cache strategy. Defaults to 'no-store' (always fresh). */
  cache?: RequestCache;
  /** Optional Bearer token for protected endpoints. */
  token?: string;
  /** Abort the request after this many milliseconds. Default: 20 000 ms. */
  timeoutMs?: number;
};

/**
 * Thin wrapper around fetch that:
 *  1. Prepends the base API URL
 *  2. Sets JSON + optional Authorization headers
 *  3. Aborts after timeoutMs (default 20 s) to prevent infinite hangs
 *  4. Throws a typed ApiError on non-2xx responses
 *  5. Returns parsed JSON typed as T
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { cache = "no-store", token, timeoutMs = 20_000, ...rest } = options;

  if (!API_BASE_URL) {
    throw new Error(
      "Missing NEXT_PUBLIC_API_URL for this deployment."
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      cache,
      signal: rest.signal ?? controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...rest.headers,
      },
    });

    if (!res.ok) {
      throw new ApiError(
        res.status,
        `API responded with ${res.status} on ${path}`
      );
    }

    // 204 No Content has no body
    if (res.status === 204) return undefined as T;

    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
}
