"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/app/services/authService";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setSubmitted(true);
    } catch (err) {
      console.error("[esqueci-senha]", err);
      const isTimeout = err instanceof Error && err.name === "AbortError";
      setError(
        isTimeout
          ? "O servidor está demorando para responder. Aguarde alguns segundos e tente novamente."
          : "Não foi possível processar a solicitação. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Verifique seu e-mail</h1>
          <p className="text-zinc-400 text-sm mb-1">
            Se o endereço informado estiver cadastrado, você receberá um link para redefinir sua senha.
          </p>
          <p className="text-zinc-600 text-xs mb-8">
            Não esqueceu? Verifique a caixa de spam.
          </p>
          <Link
            href="/login"
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
          >
            ← Voltar para o login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)" }}
      />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
            >
              DS
            </div>
            <span className="font-bold text-white text-xl tracking-tight">DSCommerce</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Esqueceu sua senha?</h1>
          <p className="text-zinc-500 text-sm">
            Informe seu e-mail e enviaremos um link para redefinição
          </p>
        </div>

        {/* Form card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-950/50 border border-red-800/50 text-red-400 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-600 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-70 hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.01] active:scale-[0.99]"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Enviando...
                </span>
              ) : (
                "Enviar link de redefinição"
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-zinc-500 text-sm">
          Lembrou a senha?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
