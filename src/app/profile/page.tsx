"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { getMe, updateMe } from "@/app/services/userService";
import { getOrderById } from "@/app/services/orderService";
import { getOrderIds } from "@/app/lib/orderHistory";
import type { UserDTO, OrderDTO, OrderStatus } from "@/app/types";

// ── helpers ───────────────────────────────────────────────────────────────────

function roleLabel(role: string) {
  const map: Record<string, string> = { ROLE_ADMIN: "Admin", ROLE_CLIENT: "Client" };
  return map[role] ?? role;
}

function formatDate(iso: string) {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  WAITING_PAYMENT: { label: "Aguardando", color: "text-yellow-400", bg: "bg-yellow-950/40", border: "border-yellow-800/50", dot: "bg-yellow-400" },
  PAID:            { label: "Pago",       color: "text-emerald-400", bg: "bg-emerald-950/40", border: "border-emerald-800/50", dot: "bg-emerald-400" },
  SHIPPED:         { label: "Enviado",    color: "text-blue-400",    bg: "bg-blue-950/40",    border: "border-blue-800/50",    dot: "bg-blue-400" },
  DELIVERED:       { label: "Entregue",   color: "text-indigo-400",  bg: "bg-indigo-950/40",  border: "border-indigo-800/50",  dot: "bg-indigo-400" },
  CANCELED:        { label: "Cancelado",  color: "text-red-400",     bg: "bg-red-950/40",     border: "border-red-800/50",     dot: "bg-red-400" },
};

// ── sub-components ────────────────────────────────────────────────────────────

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">{label}</p>
      <p className="px-4 py-3 bg-zinc-800/50 border border-zinc-800 rounded-xl text-sm text-zinc-200">{value}</p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-zinc-800" />
        <div className="space-y-2">
          <div className="h-5 w-40 rounded bg-zinc-800" />
          <div className="h-3.5 w-28 rounded bg-zinc-800" />
        </div>
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-1.5">
          <div className="h-3 w-20 rounded bg-zinc-800" />
          <div className="h-10 rounded-xl bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ── My Orders tab ─────────────────────────────────────────────────────────────

function MyOrdersTab({ userEmail, token }: { userEmail: string; token: string }) {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = getOrderIds(userEmail);

    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    // fetch each order individually — GET /orders/{id} is accessible to ROLE_CLIENT
    Promise.allSettled(ids.map((id) => getOrderById(id, token)))
      .then((results) => {
        const fetched = results
          .filter((r): r is PromiseFulfilledResult<OrderDTO> => r.status === "fulfilled")
          .map((r) => r.value)
          // sort newest first by moment
          .sort((a, b) => new Date(b.moment).getTime() - new Date(a.moment).getTime());
        setOrders(fetched);
      })
      .finally(() => setLoading(false));
  }, [userEmail, token]);

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-zinc-800" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl mx-auto mb-4">
          📦
        </div>
        <p className="text-zinc-400 text-sm font-medium mb-1">Nenhum pedido ainda</p>
        <p className="text-zinc-600 text-xs mb-6">
          Seus pedidos aparecem aqui após a finalização da compra.
        </p>
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/25"
          style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
        >
          Explorar catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/orders/${order.id}`}
          className="flex items-center justify-between gap-4 px-5 py-4 bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 rounded-xl transition-colors group"
        >
          {/* left: id + date */}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors">
              Pedido #{order.id}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">{formatDateTime(order.moment)}</p>
          </div>

          {/* middle: status */}
          <StatusBadge status={order.orderStatus} />

          {/* right: total + arrow */}
          <div className="text-right shrink-0 flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-200">{formatPrice(order.total)}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

type Tab = "profile" | "orders";

export default function ProfilePage() {
  const router = useRouter();
  const { token, isAuthenticated, hydrated, userName } = useAuth();

  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("profile");

  // edit state
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // redirect if not authenticated
  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/login?redirect=/profile");
    }
  }, [hydrated, isAuthenticated, router]);

  // fetch profile
  useEffect(() => {
    if (!hydrated || !isAuthenticated || !token) return;

    setLoading(true);
    getMe(token)
      .then((data) => {
        setUser(data);
        setName(data.name);
        setPhone(data.phone ?? "");
        setBirthDate(data.birthDate ?? "");
      })
      .catch(() => setError("Não foi possível carregar o perfil."))
      .finally(() => setLoading(false));
  }, [hydrated, isAuthenticated, token]);

  function startEditing() {
    setSaveError("");
    setSaveSuccess(false);
    setEditing(true);
  }

  function cancelEditing() {
    if (!user) return;
    setName(user.name);
    setPhone(user.phone ?? "");
    setBirthDate(user.birthDate ?? "");
    setSaveError("");
    setEditing(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !token) return;

    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      const updated = await updateMe(
        { ...user, name: name.trim(), phone: phone.trim(), birthDate },
        token
      );
      setUser(updated);
      setEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setSaveError("Não foi possível salvar as alterações. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  // guard: waiting for hydration
  if (!hydrated || (!isAuthenticated && hydrated)) {
    return null;
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10">
      <div className="max-w-xl mx-auto">

        {/* breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-8">
          <Link href="/" className="hover:text-zinc-400 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-400">My Profile</span>
        </nav>

        {/* ── avatar + name header ─────────────────────────────────────── */}
        <div className="flex items-center gap-4 mb-6">
          {user ? (
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-zinc-800 animate-pulse" />
          )}
          <div>
            <h1 className="text-white font-semibold text-lg leading-tight">
              {user?.name ?? "—"}
            </h1>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              {user?.roles.map((role) => (
                <span
                  key={role}
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    role === "ROLE_ADMIN"
                      ? "bg-indigo-900/50 text-indigo-300 border border-indigo-700/50"
                      : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                  }`}
                >
                  {roleLabel(role)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── tabs ─────────────────────────────────────────────────────── */}
        <div className="flex gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl mb-6">
          {(["profile", "orders"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setEditing(false); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                tab === t
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t === "profile" ? "Perfil" : "Meus Pedidos"}
            </button>
          ))}
        </div>

        {/* ── profile tab ──────────────────────────────────────────────── */}
        {tab === "profile" && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

            {/* edit button */}
            {!editing && !loading && !error && (
              <div className="flex justify-end mb-6">
                <button
                  onClick={startEditing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                  </svg>
                  Edit
                </button>
              </div>
            )}

            {/* success banner */}
            {saveSuccess && (
              <div className="flex items-center gap-2.5 px-4 py-3 mb-6 rounded-xl bg-green-950/50 border border-green-800/50 text-green-400 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Profile updated successfully.
              </div>
            )}

            {/* error loading */}
            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-950/50 border border-red-800/50 text-red-400 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            {/* skeleton */}
            {loading && <ProfileSkeleton />}

            {/* view mode */}
            {!loading && !error && user && !editing && (
              <div className="space-y-5">
                <Field label="Full name" value={user.name} />
                <Field label="E-mail" value={user.email} />
                <Field label="Phone" value={user.phone || "—"} />
                <Field label="Birth date" value={formatDate(user.birthDate)} />
              </div>
            )}

            {/* edit mode */}
            {!loading && !error && user && editing && (
              <form onSubmit={handleSave} className="space-y-5">

                {saveError && (
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-950/50 border border-red-800/50 text-red-400 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    {saveError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">Full name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required minLength={3} maxLength={80}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-indigo-600 transition-colors" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">
                    E-mail <span className="text-zinc-600 normal-case">(cannot be changed)</span>
                  </label>
                  <input type="email" value={user.email} disabled
                    className="w-full bg-zinc-800/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-600 cursor-not-allowed" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-600 transition-colors" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">Birth date</label>
                  <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-indigo-600 transition-colors" />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-70 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving...
                      </>
                    ) : "Save changes"}
                  </button>
                  <button type="button" onClick={cancelEditing}
                    className="px-5 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ── orders tab ───────────────────────────────────────────────── */}
        {tab === "orders" && userName && token && (
          <MyOrdersTab userEmail={userName} token={token} />
        )}
      </div>
    </main>
  );
}
