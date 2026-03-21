import Link from "next/link";
import type { ProductMinDTO } from "@/app/types";

// Re-export for backwards compatibility with any existing imports
export type { ProductMinDTO as Product };

function formatPrice(price: number) {
  const formatted = price.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const [integer, decimal] = formatted.split(",");
  return { integer, decimal };
}

// ── SVG placeholder when imgUrl is null ──────────────────────────────────────
function ImagePlaceholder() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        background:
          "radial-gradient(circle at 50% 60%, rgba(99,102,241,0.18) 0%, transparent 65%)",
      }}
    >
      <svg
        viewBox="0 0 200 140"
        xmlns="http://www.w3.org/2000/svg"
        className="w-28 h-20 opacity-75"
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

// ── Card ──────────────────────────────────────────────────────────────────────
export default function ProductCard({ product }: { product: ProductMinDTO }) {
  const { integer, decimal } = formatPrice(product.price);

  return (
    <Link href={`/produto/${product.id}`} className="group block">
      <div className="bg-zinc-900 border border-zinc-800 hover:border-indigo-700/50 rounded-xl transition-all duration-200 p-4 flex flex-col gap-3 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 cursor-pointer">
        {/* Image area */}
        <div
          className="w-full h-40 rounded-lg overflow-hidden flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #1c1c22 0%, #27272a 100%)" }}
        >
          {product.imgUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={product.imgUrl}
              alt={product.name}
              className="w-full h-full object-contain p-3"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-zinc-200 leading-snug line-clamp-2 group-hover:text-white transition-colors">
            {product.name}
          </p>
          <div className="flex items-baseline gap-0.5">
            <span className="text-xs font-medium text-zinc-500">R$</span>
            <span className="text-xl font-bold text-white leading-none">
              {integer}
            </span>
            <span className="text-xs font-medium text-zinc-500">,{decimal}</span>
          </div>
        </div>

        {/* Hover reveal */}
        <div className="h-8 flex items-center justify-center rounded-lg text-xs font-semibold border transition-all duration-200 opacity-0 group-hover:opacity-100 border-indigo-800/60 text-indigo-400 group-hover:bg-indigo-600/10">
          Ver produto →
        </div>
      </div>
    </Link>
  );
}
