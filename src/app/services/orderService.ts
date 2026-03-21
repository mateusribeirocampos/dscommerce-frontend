import { apiFetch } from "@/app/lib/api";
import type { CreateOrderDTO, OrderDTO } from "@/app/types";

/**
 * POST /orders
 * Requires ROLE_CLIENT or ROLE_ADMIN.
 * Sends cart items and returns the created order.
 */
export async function createOrder(
  data: CreateOrderDTO,
  token: string
): Promise<OrderDTO> {
  return apiFetch<OrderDTO>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}

/**
 * GET /orders/{id}
 * Requires ROLE_CLIENT (own order) or ROLE_ADMIN.
 */
export async function getOrderById(
  id: number | string,
  token: string
): Promise<OrderDTO> {
  return apiFetch<OrderDTO>(`/orders/${id}`, { token });
}
