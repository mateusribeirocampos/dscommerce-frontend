"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/services/userService";

type RegistroForm = {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof RegistroForm, string>>;

const initialForm: RegistroForm = {
  name: "",
  email: "",
  phone: "",
  birthDate: "",
  password: "",
  confirmPassword: "",
};

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegistroForm>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegistroForm]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (form.name.trim().length < 3)
      errs.name = "Nome deve ter pelo menos 3 caracteres";
    if (!form.email.includes("@") || !form.email.includes("."))
      errs.email = "E-mail inválido";
    if (form.password.length < 8)
      errs.password = "Senha deve ter pelo menos 8 caracteres";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "As senhas não conferem";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setApiError("");
    try {
      await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        birthDate: form.birthDate || undefined,
        password: form.password,
      });
      setSuccess(true);
      // Redirect to login after brief success message
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("422") || message.includes("400")) {
        setApiError("Dados inválidos. Verifique se o e-mail já está em uso.");
      } else {
        setApiError("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6"
            style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)" }}
          >
            ✓
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Conta criada!</h1>
          <p className="text-zinc-400 text-sm mb-1">
            Bem-vindo(a), <span className="text-white font-semibold">{form.name.split(" ")[0]}</span>!
          </p>
          <p className="text-zinc-600 text-xs">
            Redirecionando para o login…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%)",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              }}
            >
              DS
            </div>
            <span className="font-bold text-white text-xl tracking-tight">
              DSCommerce
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Crie sua conta</h1>
          <p className="text-zinc-500 text-sm">
            Rápido, gratuito e sem complicações
          </p>
        </div>

        {/* Form card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* API error banner */}
            {apiError && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-950/50 border border-red-800/50 text-red-400 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {apiError}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Nome completo
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="João Silva"
                className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-600 transition-colors ${
                  errors.name ? "border-red-600/70" : "border-zinc-700"
                }`}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-600 transition-colors ${
                  errors.email ? "border-red-600/70" : "border-zinc-700"
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Phone + BirthDate in a row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-600 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Nascimento
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-400 outline-none focus:border-indigo-600 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 8 caracteres"
                  className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 pr-12 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-600 transition-colors ${
                    errors.password ? "border-red-600/70" : "border-zinc-700"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Confirmar senha
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repita a senha"
                className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-600 transition-colors ${
                  errors.confirmPassword ? "border-red-600/70" : "border-zinc-700"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-70 hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.01] active:scale-[0.99] mt-2"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Criando conta...
                </span>
              ) : (
                "Criar conta"
              )}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center mt-6 text-zinc-500 text-sm">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
