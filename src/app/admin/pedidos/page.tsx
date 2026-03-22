"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { getAllOrders } from "@/app/services/orderService";
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
    label: "Aguardando",
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

// ── Skeleton row ───────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b border-zinc-800">
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-zinc-800 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.border} ${cfg.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminPedidosPage() {
  const { token } = useAuth();

  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [filtered, setFiltered] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await getAllOrders(token);
      setOrders(data);
    } catch {
      setError("Erro ao carregar pedidos. Verifique a conexão com o backend.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // client-side filter
  useEffect(() => {
    let result = orders;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          String(o.id).includes(q) ||
          o.client.name.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter((o) => o.orderStatus === statusFilter);
    }
    setFiltered(result);
  }, [orders, search, statusFilter]);

  const statuses: OrderStatus[] = [
    "WAITING_PAYMENT",
    "PAID",
    "SHIPPED",
    "DELIVERED",
    "CANCELED",
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Pedidos</h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            {loading
              ? "Carregando…"
              : `${filtered.length} pedido${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        {/* Search */}
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por ID ou cliente…"
            className="bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-600 transition-colors w-64"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "")}
          className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 outline-none focus:border-indigo-600 transition-colors appearance-none pr-8"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
          }}
        >
          <option value="">Todos os status</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {STATUS_CONFIG[s].label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-20">
                Pedido
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-44">
                Data
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-36">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider w-32">
                Total
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider w-20">
                Ação
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <p className="text-red-400 text-sm mb-3">{error}</p>
                  <button
                    onClick={fetchOrders}
                    className="px-4 py-2 rounded-lg text-xs font-medium border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
                  >
                    Tentar novamente
                  </button>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <p className="text-zinc-500 text-sm">
                    Nenhum pedido encontrado.
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors"
                >
                  {/* Order ID */}
                  <td className="px-4 py-3 text-zinc-400 font-mono text-xs">
                    #{order.id}
                  </td>

                  {/* Client */}
                  <td className="px-4 py-3 text-zinc-100 font-medium">
                    {order.client.name}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-zinc-400 text-xs">
                    {formatDate(order.moment)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={order.orderStatus} />
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3 text-right font-semibold text-zinc-200">
                    {formatPrice(order.total)}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-indigo-400 hover:bg-indigo-950/30 border border-zinc-700 hover:border-indigo-800/50 transition-colors"
                      title="Ver pedido"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Ver
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
