import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 overflow-hidden relative">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top glow orb */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(99,102,241,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Hero section */}
      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-800/40 bg-indigo-950/40 text-indigo-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Mais de 1.200 produtos disponíveis agora
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 max-w-4xl tracking-tight">
          Descubra produtos que
          <span
            className="block mt-1"
            style={{
              background:
                "linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #38bdf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            elevam sua experiência
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-zinc-400 text-lg max-w-lg mb-10 leading-relaxed">
          Encontre os melhores produtos do mercado com preços competitivos,
          entrega rápida e suporte dedicado.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4 flex-wrap justify-center mb-20">
          <Link
            href="/catalogo"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/25 active:scale-100"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            }}
          >
            Explorar catálogo
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
          <Link
            href="/registro"
            className="px-6 py-3.5 rounded-xl font-semibold text-zinc-300 text-sm border border-zinc-700 hover:border-zinc-500 hover:text-white transition-colors"
          >
            Criar conta grátis
          </Link>
        </div>

        {/* Stats bar */}
        <div className="w-full max-w-2xl grid grid-cols-3 rounded-2xl border border-zinc-800 overflow-hidden">
          {[
            { value: "1.200+", label: "Produtos" },
            { value: "50+", label: "Categorias" },
            { value: "98%", label: "Satisfação" },
          ].map(({ value, label }, i) => (
            <div
              key={label}
              className={`bg-zinc-900 px-8 py-6 text-center ${
                i < 2 ? "border-r border-zinc-800" : ""
              }`}
            >
              <p className="text-2xl font-bold text-white mb-1">{value}</p>
              <p className="text-zinc-500 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature cards */}
      <div className="relative max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "🚀",
              title: "Entrega Expressa",
              desc: "Receba em até 24h úteis diretamente na sua porta com rastreamento em tempo real.",
            },
            {
              icon: "🔒",
              title: "Compra 100% Segura",
              desc: "Pagamento protegido, dados criptografados e checkout com certificado SSL.",
            },
            {
              icon: "↩️",
              title: "Troca Garantida",
              desc: "30 dias para trocar ou devolver qualquer produto sem burocracia.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-indigo-800/60 hover:bg-zinc-900/80 transition-all duration-200 group"
            >
              <span className="text-3xl mb-4 block">{icon}</span>
              <h3 className="text-white font-semibold mb-2 group-hover:text-indigo-300 transition-colors">
                {title}
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
