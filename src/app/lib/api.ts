export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

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
};

/**
 * Thin wrapper around fetch that:
 *  1. Prepends the base API URL
 *  2. Sets JSON + optional Authorization headers
 *  3. Throws a typed ApiError on non-2xx responses
 *  4. Returns parsed JSON typed as T
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { cache = "no-store", token, ...rest } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    cache,
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
}
