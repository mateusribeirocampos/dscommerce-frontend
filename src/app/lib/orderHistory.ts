/**
 * Order history helper — stores order IDs in localStorage per user.
 *
 * Why localStorage instead of a backend endpoint:
 *   GET /orders is ROLE_ADMIN only. Clients can fetch a specific order via
 *   GET /orders/{id}, but there is no "list my orders" endpoint.
 *   This helper bridges that gap on the frontend: after each successful
 *   checkout the order ID is persisted under the authenticated user's key,
 *   so the profile page can re-fetch those orders individually.
 */

const MAX_HISTORY = 50; // cap to avoid unbounded growth

function storageKey(userEmail: string): string {
  return `dscommerce:orders:${userEmail}`;
}

/**
 * Append an order ID to the user's local history (newest first).
 * Safe to call on the server — no-ops when localStorage is unavailable.
 */
export function saveOrderId(userEmail: string, orderId: number): void {
  if (typeof window === "undefined") return;
  try {
    const key = storageKey(userEmail);
    const existing = getOrderIds(userEmail);
    // deduplicate and keep newest first
    const updated = [orderId, ...existing.filter((id) => id !== orderId)].slice(
      0,
      MAX_HISTORY
    );
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {
    // localStorage may be blocked — fail silently
  }
}

/**
 * Return the user's saved order IDs, newest first.
 */
export function getOrderIds(userEmail: string): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(userEmail));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
