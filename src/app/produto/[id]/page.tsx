import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/app/services/productService";
import { ApiError } from "@/app/lib/api";
import { AddToCartButton } from "@/app/components/AddToCartButton";
import type { ProductDTO } from "@/app/types";

type Props = {
  params: Promise<{ id: string }>;
};

// ── Price helpers ──────────────────────────────────────────────────────────────
function formatPriceParts(price: number) {
  const formatted = price.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const [integer, decimal] = formatted.split(",");
  return { integer, decimal };
}

// ── Placeholder when imgUrl is null ───────────────────────────────────────────
function ImagePlaceholder() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        background:
          "radial-gradient(circle at 50% 60%, rgba(99,102,241,0.15) 0%, transparent 65%)",
      }}
    >
      <svg
        viewBox="0 0 200 140"
        xmlns="http://www.w3.org/2000/svg"
        className="w-48 h-36 opacity-60"
      >
        <rect x="55" y="8" width="105" height="78" rx="5" fill="#3f3f46" />
        <rect x="60" y="13" width="95" height="68" rx="3" fill="#27272a" />
        <rect x="68" y="22" width="50" height="3" rx="1.5" fill="#6366f1" opacity="0.6" />
        <rect x="68" y="30" width="79" height="3" rx="1.5" fill="#6366f1" opacity="0.4" />
        <rect x="68" y="38" width="65" height="3" rx="1.5" fill="#6366f1" opacity="0.3" />
        <rect x="68" y="50" width="40" height="18" rx="3" fill="#4f46e5" opacity="0.5" />
        <rect x="115" y="50" width="40" height="18" rx="3" fill="#4f46e5" opacity="0.5" />
        <rect x="99" y="86" width="18" height="12" fill="#3f3f46" />
        <rect x="82" y="98" width="52" height="5" rx="2.5" fill="#52525b" />
        <rect x="12" y="28" width="32" height="72" rx="4" fill="#3f3f46" />
        <circle cx="28" cy="44" r="5" fill="#6366f1" opacity="0.9" />
        <rect x="55" y="108" width="100" height="18" rx="3" fill="#3f3f46" />
        <rect x="59" y="111" width="92" height="12" rx="2" fill="#52525b" />
        <ellipse cx="172" cy="120" rx="11" ry="14" fill="#3f3f46" />
        <line x1="172" y1="108" x2="172" y2="118" stroke="#52525b" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ── Error state when backend is down ──────────────────────────────────────────
function BackendError() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6"
          style={{ background: "linear-gradient(135deg, #27272a 0%, #3f3f46 100%)" }}
        >
          ⚠️
        </div>
        <h1 className="text-xl font-bold text-white mb-2">
          Backend indisponível
        </h1>
        <p className="text-zinc-500 text-sm mb-2">
          Certifique-se que o Spring Boot está rodando em{" "}
          <code className="text-indigo-400 bg-indigo-950/40 px-1.5 py-0.5 rounded text-xs">
            localhost:8080
          </code>
        </p>
        <p className="text-zinc-600 text-xs mb-8">
          Comando:{" "}
          <code className="text-zinc-400">mvn spring-boot:run</code>
        </p>
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-300 border border-zinc-800 hover:border-zinc-600 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar ao catálogo
        </Link>
      </div>
    </main>
  );
}

// ── Product detail layout ──────────────────────────────────────────────────────
function ProductDetail({ product }: { product: ProductDTO }) {
  const { integer, decimal } = formatPriceParts(product.price);

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Back */}
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm mb-10 transition-colors group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar ao catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* ── Image panel ─────────────────────────────────────────────── */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
            {product.imgUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={product.imgUrl}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
            ) : (
              <ImagePlaceholder />
            )}
          </div>

          {/* ── Info panel ──────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Category badges */}
            {product.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="px-3 py-1 rounded-full text-xs font-medium border border-indigo-800/50 bg-indigo-950/40 text-indigo-400"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            {/* Name */}
            <h1 className="text-3xl font-bold text-white leading-snug">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-medium text-zinc-400">R$</span>
              <span className="text-4xl font-bold text-white">{integer}</span>
              <span className="text-lg font-medium text-zinc-400">,{decimal}</span>
            </div>

            {/* Divider */}
            <div className="h-px bg-zinc-800" />

            {/* Description */}
            <div>
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
                Descrição
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-zinc-800" />

            {/* CTA */}
            <div className="flex flex-col gap-3">
              <AddToCartButton product={product} />

              <Link
                href="/cart"
                className="w-full py-3.5 rounded-xl font-semibold text-zinc-300 text-sm border border-zinc-700 hover:border-zinc-500 hover:text-white transition-colors text-center"
              >
                View cart
              </Link>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: "🚀", label: "Entrega rápida" },
                { icon: "🔒", label: "Compra segura" },
                { icon: "↩️", label: "30 dias p/ troca" },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center"
                >
                  <span className="text-lg">{icon}</span>
                  <span className="text-zinc-500 text-xs leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ── Page entry point (Server Component) ───────────────────────────────────────
export default async function ProdutoPage({ params }: Props) {
  const { id } = await params;

  let product: ProductDTO;

  try {
    product = await getProductById(id);
  } catch (err) {
    // 404 → Next.js not-found page
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    // Any other error (backend down, network) → friendly error screen
    return <BackendError />;
  }

  return <ProductDetail product={product} />;
}
