type Product = {
  id: number;
  name: string;
  price: number;
};

function formatPrice(price: number) {
  const formatted = price.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const [integer, decimal] = formatted.split(",");
  return { integer, decimal };
}

function ComputerImage() {
  return (
    <svg
      viewBox="0 0 200 140"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-36 object-contain"
    >
      {/* Monitor */}
      <rect x="55" y="8" width="105" height="78" rx="4" fill="#374151" />
      <rect x="60" y="13" width="95" height="68" rx="2" fill="#93C5FD" />
      {/* Screen content (decorative) */}
      <rect x="68" y="22" width="50" height="4" rx="2" fill="#1D4ED8" opacity="0.4" />
      <rect x="68" y="30" width="79" height="4" rx="2" fill="#1D4ED8" opacity="0.4" />
      <rect x="68" y="38" width="65" height="4" rx="2" fill="#1D4ED8" opacity="0.4" />
      <rect x="68" y="52" width="40" height="20" rx="3" fill="#BFDBFE" />
      <rect x="115" y="52" width="40" height="20" rx="3" fill="#BFDBFE" />
      {/* Monitor stand */}
      <rect x="99" y="86" width="18" height="12" fill="#374151" />
      <rect x="82" y="98" width="52" height="5" rx="2" fill="#4B5563" />
      {/* Tower / Case */}
      <rect x="12" y="28" width="32" height="72" rx="4" fill="#374151" />
      <circle cx="28" cy="44" r="5" fill="#60A5FA" />
      <rect x="18" y="56" width="20" height="3" rx="1" fill="#1F2937" />
      <rect x="18" y="63" width="20" height="3" rx="1" fill="#1F2937" />
      <rect x="18" y="70" width="14" height="2" rx="1" fill="#1F2937" />
      {/* Keyboard */}
      <rect x="55" y="108" width="100" height="18" rx="3" fill="#374151" />
      <rect x="59" y="111" width="92" height="12" rx="2" fill="#4B5563" />
      <rect x="63" y="113" width="8" height="3" rx="1" fill="#374151" />
      <rect x="74" y="113" width="8" height="3" rx="1" fill="#374151" />
      <rect x="85" y="113" width="8" height="3" rx="1" fill="#374151" />
      <rect x="96" y="113" width="8" height="3" rx="1" fill="#374151" />
      <rect x="107" y="113" width="8" height="3" rx="1" fill="#374151" />
      <rect x="118" y="113" width="8" height="3" rx="1" fill="#374151" />
      <rect x="129" y="113" width="8" height="3" rx="1" fill="#374151" />
      {/* Mouse */}
      <ellipse cx="172" cy="120" rx="11" ry="14" fill="#374151" />
      <line x1="172" y1="108" x2="172" y2="118" stroke="#6B7280" strokeWidth="1" />
    </svg>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const { integer, decimal } = formatPrice(product.price);

  return (
    <div className="bg-white border border-gray-200 hover:border-green-400 rounded transition-colors cursor-pointer p-4 flex flex-col gap-3">
      <div className="flex items-center justify-center py-2">
        <ComputerImage />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold text-gray-900 leading-snug">
          {product.name}
        </p>
        <div className="flex items-baseline gap-0.5 text-blue-600">
          <span className="text-xs font-medium">R$</span>
          <span className="text-2xl font-bold leading-none">{integer}</span>
          <span className="text-xs font-medium">,{decimal}</span>
        </div>
      </div>
    </div>
  );
}
