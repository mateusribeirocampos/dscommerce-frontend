import { apiFetch } from "@/app/lib/api";
import type {
  ProductDTO,
  ProductInsertDTO,
  ProductMinDTO,
  SpringPage,
} from "@/app/types";

type GetProductsParams = {
  name?: string;
  page?: number;
  size?: number;
};

// ── Public endpoints ──────────────────────────────────────────────────────────

/**
 * GET /products
 * Public — no auth required. Returns a paginated list of ProductMinDTO.
 */
export async function getProducts(
  params: GetProductsParams = {}
): Promise<SpringPage<ProductMinDTO>> {
  const { name = "", page = 0, size = 12 } = params;

  const query = new URLSearchParams({ page: String(page), size: String(size) });
  if (name.trim()) query.set("name", name.trim());

  return apiFetch<SpringPage<ProductMinDTO>>(`/products?${query}`);
}

/**
 * GET /products/{id}
 * Public — no auth required. Returns the full ProductDTO.
 */
export async function getProductById(
  id: number | string
): Promise<ProductDTO> {
  return apiFetch<ProductDTO>(`/products/${id}`);
}

// ── Admin endpoints (ROLE_ADMIN) ──────────────────────────────────────────────

/**
 * POST /products
 * Requires ROLE_ADMIN. Creates a new product.
 */
export async function createProduct(
  data: ProductInsertDTO,
  token: string
): Promise<ProductDTO> {
  return apiFetch<ProductDTO>("/products", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}

/**
 * PUT /products/{id}
 * Requires ROLE_ADMIN. Updates an existing product.
 */
export async function updateProduct(
  id: number | string,
  data: ProductInsertDTO,
  token: string
): Promise<ProductDTO> {
  return apiFetch<ProductDTO>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    token,
  });
}

/**
 * DELETE /products/{id}
 * Requires ROLE_ADMIN. Returns 204 No Content.
 */
export async function deleteProduct(
  id: number | string,
  token: string
): Promise<void> {
  return apiFetch<void>(`/products/${id}`, {
    method: "DELETE",
    token,
  });
}
