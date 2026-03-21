import { apiFetch } from "@/app/lib/api";
import type { UserDTO, UserInsertDTO } from "@/app/types";

/**
 * POST /users/register
 * Public — no auth required. Creates a new user account.
 */
export async function registerUser(data: UserInsertDTO): Promise<UserDTO> {
  return apiFetch<UserDTO>("/users/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * GET /users/me
 * Requires ROLE_CLIENT or ROLE_ADMIN. Returns the logged-in user's profile.
 */
export async function getMe(token: string): Promise<UserDTO> {
  return apiFetch<UserDTO>("/users/me", { token });
}
