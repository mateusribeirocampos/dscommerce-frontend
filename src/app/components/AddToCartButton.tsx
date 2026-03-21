"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import type { ProductDTO } from "@/app/types";

export function AddToCartButton({ product }: { product: ProductDTO }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imgUrl: product.imgUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className="w-full py-4 rounded-xl font-semibold text-white text-sm transition-all hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-[1.01] active:scale-[0.99]"
      style={{
        background: added
          ? "linear-gradient(135deg, #059669 0%, #10b981 100%)"
          : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      }}
    >
      {added ? "✓ Added to cart!" : "Add to Cart"}
    </button>
  );
}
