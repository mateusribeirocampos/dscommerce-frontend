"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { getMe, updateMe } from "@/app/services/userService";
import type { UserDTO } from "@/app/types";

// ── helpers ───────────────────────────────────────────────────────────────────

function roleLabel(role: string) {
  const map: Record<string, string> = {
    ROLE_ADMIN: "Admin",
    ROLE_CLIENT: "Client",
  };
  return map[role] ?? role;
}

function formatDate(iso: string) {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

// ── skeleton ──────────────────────────────────────────────────────────────────

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

// ── main component ────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const { token, isAuthenticated, hydrated } = useAuth();

  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

          {/* header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
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

            {!editing && !loading && !error && (
              <button
                onClick={startEditing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
                Edit
              </button>
            )}
          </div>

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

              {/* name */}
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={3}
                  maxLength={80}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-indigo-600 transition-colors"
                />
              </div>

              {/* email — read only */}
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">
                  E-mail <span className="text-zinc-600 normal-case">(cannot be changed)</span>
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-zinc-800/40 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-600 cursor-not-allowed"
                />
              </div>

              {/* phone */}
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-600 transition-colors"
                />
              </div>

              {/* birth date */}
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wide">
                  Birth date
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-indigo-600 transition-colors"
                />
              </div>

              {/* actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
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
                  ) : (
                    "Save changes"
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="px-5 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

// ── Field — read-only display ─────────────────────────────────────────────────

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1.5">
        {label}
      </p>
      <p className="px-4 py-3 bg-zinc-800/50 border border-zinc-800 rounded-xl text-sm text-zinc-200">
        {value}
      </p>
    </div>
  );
}
