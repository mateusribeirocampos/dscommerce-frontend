import { API_BASE_URL, apiFetch } from "@/app/lib/api";
import type { TokenResponse } from "@/app/types";

// OAuth2 client credentials — configure in .env.local
// Must match the registered client in Spring Authorization Server
const CLIENT_ID =
  process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID ?? "myclientid";
const CLIENT_SECRET =
  process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET ?? "myclientsecret";

/**
 * POST /oauth2/token using Resource Owner Password Grant
 *
 * Spring Authorization Server custom password flow:
 *  - Authorization: Basic base64(clientId:clientSecret)
 *  - Body: grant_type=password&username=...&password=...
 */
export async function login(
  email: string,
  password: string
): Promise<TokenResponse> {
  const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

  const body = new URLSearchParams({
    grant_type: "password",
    username: email,
    password,
  });

  const res = await fetch(`${API_BASE_URL}/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error("E-mail ou senha inválidos");
  }

  return res.json() as Promise<TokenResponse>;
}

export async function forgotPassword(email: string): Promise<void> {
  await apiFetch<void>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await apiFetch<void>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}
