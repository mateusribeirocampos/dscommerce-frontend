import { apiFetch } from "@/app/lib/api";
import type { CategoryDTO } from "@/app/types";

/**
 * GET /categories
 * Public endpoint — no auth required.
 * Returns the full list of categories (not paginated).
 */
export async function getCategories(): Promise<CategoryDTO[]> {
  return apiFetch<CategoryDTO[]>("/categories");
}
