"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { getOrderById } from "@/app/services/orderService";
import type { OrderDTO, OrderStatus } from "@/app/types";

// ── helpers ────────────────────────────────────────────────────────────────────

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  WAITING_PAYMENT: {
    label: "Aguardando pagamento",
    color: "text-yellow-400",
    bg: "bg-yellow-950/40",
    border: "border-yellow-800/50",
    dot: "bg-yellow-400",
  },
  PAID: {
    label: "Pago",
    color: "text-emerald-400",
    bg: "bg-emerald-950/40",
    border: "border-emerald-800/50",
    dot: "bg-emerald-400",
  },
  SHIPPED: {
    label: "Enviado",
    color: "text-blue-400",
    bg: "bg-blue-950/40",
    border: "border-blue-800/50",
    dot: "bg-blue-400",
  },
  DELIVERED: {
    label: "Entregue",
    color: "text-indigo-400",
    bg: "bg-indigo-950/40",
    border: "border-indigo-800/50",
    dot: "bg-indigo-400",
  },
  CANCELED: {
    label: "Cancelado",
    color: "text-red-400",
    bg: "bg-red-950/40",
    border: "border-red-800/50",
    dot: "bg-red-400",
  },
};

// ── skeleton ───────────────────────────────────────────────────────────────────

function OrderSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-6 w-48 rounded bg-zinc-800" />
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="h-4 w-32 rounded bg-zinc-800" />
        <div className="h-4 w-48 rounded bg-zinc-800" />
        <div className="h-6 w-40 rounded bg-zinc-800" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-4">
          <div className="w-16 h-16 rounded-lg bg-zinc-800 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-zinc-800" />
            <div className="h-3 w-1/4 rounded bg-zinc-800" />
          </div>
          <div className="h-4 w-16 rounded bg-zinc-800 shrink-0" />
        </div>
      ))}
    </div>
  );
}

// ── main component ─────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { token, isAuthenticated, hydrated } = useAuth();

  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // redirect if not authenticated
  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace(`/login?redirect=/orders/${id}`);
    }
  }, [hydrated, isAuthenticated, router, id]);

  // fetch order
  useEffect(() => {
    if (!hydrated || !isAuthenticated || !token) return;

    setLoading(true);
    getOrderById(id, token)
      .then(setOrder)
      .catch(() => setError("Pedido não encontrado ou sem permissão de acesso."))
      .finally(() => setLoading(false));
  }, [hydrated, isAuthenticated, token, id]);

  // guard: waiting for hydration
  if (!hydrated || (!isAuthenticated && hydrated)) {
    return null;
  }

  const statusCfg = order ? STATUS_CONFIG[order.orderStatus] : null;

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/profile" className="hover:text-zinc-400 transition-colors">My Profile</Link>
          <span>/</span>
          <span className="text-zinc-400">Order #{id}</span>
        </nav>

        <h1 className="text-2xl font-bold text-white mb-6">Order Detail</h1>

        {/* error */}
        {error && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-950/50 border border-red-800/50 text-red-400 text-sm mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        {loading && <OrderSkeleton />}

        {!loading && !error && order && (
          <div className="space-y-5">

            {/* ── Order summary card ─────────────────────────────────────── */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Order</p>
                  <p className="text-2xl font-bold text-white">#{order.id}</p>
                </div>
                {statusCfg && (
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${statusCfg.bg} ${statusCfg.border} ${statusCfg.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                    {statusCfg.label}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-5 border-t border-zinc-800 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Client</p>
                  <p className="text-zinc-200">{order.client.name}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Date</p>
                  <p className="text-zinc-200">{formatDate(order.moment)}</p>
                </div>
                {order.payment && (
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Payment</p>
                    <p className="text-zinc-200">{formatDate(order.payment.moment)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Items ─────────────────────────────────────────────────── */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800">
                <h2 className="text-sm font-semibold text-zinc-200">
                  Items ({order.items.length})
                </h2>
              </div>

              <div className="divide-y divide-zinc-800">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 px-6 py-4">
                    {/* image */}
                    <Link href={`/produto/${item.productId}`} className="shrink-0">
                      <div
                        className="w-14 h-14 rounded-lg flex items-center justify-center overflow-hidden hover:opacity-80 transition-opacity"
                        style={{ background: "linear-gradient(135deg, #1c1c22 0%, #27272a 100%)" }}
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
                    </Link>

                    {/* info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/produto/${item.productId}`}
                        className="text-sm font-medium text-zinc-100 hover:text-indigo-400 transition-colors line-clamp-2 leading-snug"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>

                    {/* subtotal */}
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-white">
                        {formatPrice(item.subTotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* total */}
              <div className="px-6 py-4 border-t border-zinc-800 flex justify-between items-center">
                <span className="text-sm font-medium text-zinc-300">Total</span>
                <span className="text-xl font-bold text-white">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            {/* ── actions ───────────────────────────────────────────────── */}
            <div className="flex gap-3 pt-1">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
              >
                Continuar comprando
              </Link>
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-colors"
              >
                My Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
