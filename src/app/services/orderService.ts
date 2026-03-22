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

/**
 * GET /orders
 * Requires ROLE_ADMIN — returns all orders.
 */
export async function getAllOrders(token: string): Promise<OrderDTO[]> {
  return apiFetch<OrderDTO[]>("/orders", { token });
}

/**
 * PUT /orders/{id}
 * Requires ROLE_ADMIN — updates an existing order.
 */
export async function updateOrder(
  id: number | string,
  data: OrderDTO,
  token: string
): Promise<OrderDTO> {
  return apiFetch<OrderDTO>(`/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    token,
  });
}

/**
 * DELETE /orders/{id}
 * Requires ROLE_ADMIN.
 */
export async function deleteOrder(
  id: number | string,
  token: string
): Promise<void> {
  return apiFetch<void>(`/orders/${id}`, { method: "DELETE", token });
}
