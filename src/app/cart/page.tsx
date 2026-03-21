"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { createOrder } from "@/app/services/orderService";

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

type OrderResult = { id: number; status: string } | null;

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } =
    useCart();
  const { isAuthenticated, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderResult, setOrderResult] = useState<OrderResult>(null);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/cart");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const order = await createOrder(
        { items: items.map((i) => ({ productId: i.id, quantity: i.quantity })) },
        token!
      );
      clearCart();
      setOrderResult({ id: order.id, status: order.orderStatus });
    } catch {
      setError("Erro ao finalizar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // ── Order success ─────────────────────────────────────────────────────────
  if (orderResult) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6"
            style={{
              background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
            }}
          >
            ✓
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Pedido realizado!
          </h1>
          <p className="text-zinc-400 text-sm mb-1">
            Pedido <span className="text-white font-semibold">#{orderResult.id}</span> criado com sucesso.
          </p>
          <p className="text-zinc-600 text-xs mb-8">
            Status: <span className="text-zinc-400">{orderResult.status}</span>
          </p>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:shadow-lg hover:shadow-indigo-500/25"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            }}
          >
            Continuar comprando
          </Link>
        </div>
      </main>
    );
  }

  // ── Empty cart ────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-3xl mx-auto mb-6">
            🛒
          </div>
          <h1 className="text-xl font-bold text-white mb-2">
            Your cart is empty
          </h1>
          <p className="text-zinc-500 text-sm mb-8">
            Browse the catalog and add products to your cart
          </p>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            }}
          >
            Explorar catálogo
          </Link>
        </div>
      </main>
    );
  }

  // ── Cart with items ───────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">My Cart</h1>
          <p className="text-zinc-500 text-sm">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Items list ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-4"
              >
                {/* Image */}
                <div
                  className="w-16 h-16 rounded-lg shrink-0 flex items-center justify-center overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #1c1c22 0%, #27272a 100%)",
                  }}
                >
                  {item.imgUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.imgUrl}
                      alt={item.name}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <span className="text-zinc-600 text-xl">📦</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-100 leading-snug line-clamp-2 mb-1">
                    {item.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatPrice(item.price)} cada
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white transition-colors text-sm"
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold text-white w-5 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white transition-colors text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right shrink-0 ml-2">
                  <p className="text-sm font-bold text-white">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-1 p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-950/30 transition-colors shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}

            {/* Back link */}
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm transition-colors mt-2 w-fit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Continuar comprando
            </Link>
          </div>

          {/* ── Order summary ───────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-24">
              <h2 className="text-base font-bold text-white mb-5">
                Resumo do pedido
              </h2>

              {/* Items summary */}
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs">
                    <span className="text-zinc-500 truncate mr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-zinc-400 shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-zinc-800 my-4" />

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-medium text-zinc-300">Total</span>
                <span className="text-xl font-bold text-white">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-400 text-xs mb-4 text-center">{error}</p>
              )}

              {/* Checkout button */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-70 hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processando...
                  </span>
                ) : isAuthenticated ? (
                  "Finalizar Pedido"
                ) : (
                  "Entrar para finalizar"
                )}
              </button>

              {!isAuthenticated && (
                <p className="text-center text-zinc-600 text-xs mt-3">
                  Você precisa estar logado para finalizar o pedido
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
