// ─────────────────────────────────────────────
// DTOs — mirrors the Spring Boot backend exactly
// ─────────────────────────────────────────────

export type CategoryDTO = {
  id: number;
  name: string;
};

/** Returned by GET /products (paginated listing) */
export type ProductMinDTO = {
  id: number;
  name: string;
  price: number;
  imgUrl: string | null;
};

/** Returned by GET /products/{id} (full detail) */
export type ProductDTO = {
  id: number;
  name: string;
  description: string;
  price: number;
  imgUrl: string | null;
  categories: CategoryDTO[];
};

/**
 * Sent to POST /products and PUT /products/{id}
 * Validation mirrors backend: name 3-80, description ≥50, price > 0, imgUrl HTTPS
 */
export type ProductInsertDTO = {
  name: string;
  description: string;
  price: number;
  imgUrl: string | null;
  categories: { id: number }[];
};

/** Spring Data Page<T> response envelope */
export type SpringPage<T> = {
  content: T[];
  page: {
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  };
};

/** Sent to POST /users/register */
export type UserInsertDTO = {
  name: string;
  email: string;
  phone?: string;
  birthDate?: string; // ISO format: YYYY-MM-DD
  password: string;
};

/** Returned by GET /users/me */
export type UserDTO = {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  roles: string[];
};

/** Item inside an order */
export type OrderItemDTO = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imgUrl: string | null;
  subTotal: number;
};

export type OrderStatus =
  | "WAITING_PAYMENT"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED";

/** Returned by GET /orders/{id} */
export type OrderDTO = {
  id: number;
  moment: string;
  orderStatus: OrderStatus;
  client: { id: number; name: string };
  payment: { id: number; moment: string } | null;
  items: OrderItemDTO[];
  total: number;
};

/** Sent to POST /orders */
export type CreateOrderDTO = {
  items: { productId: number; quantity: number }[];
};

/** OAuth2 token response from /oauth2/token */
export type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

/** Sent to POST /auth/forgot-password */
export type ForgotPasswordDTO = {
  email: string;
};

/** Sent to POST /auth/reset-password */
export type NewPasswordDTO = {
  token: string;
  password: string;
};
