"use client";

import { useState, useEffect, useCallback } from "react";
import ProductCard from "@/app/components/ProductCard";
import { getProducts } from "@/app/services/productService";
import { getCategories } from "@/app/services/categoryService";
import type { ProductMinDTO, CategoryDTO, SpringPage } from "@/app/types";

const PAGE_SIZE = 12;

// ── Loading skeleton for product grid ─────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 animate-pulse">
      <div className="w-full h-40 rounded-lg bg-zinc-800" />
      <div className="space-y-2">
        <div className="h-3 bg-zinc-800 rounded w-3/4" />
        <div className="h-3 bg-zinc-800 rounded w-1/2" />
        <div className="h-5 bg-zinc-800 rounded w-1/3 mt-1" />
      </div>
    </div>
  );
}

// ── Error banner ──────────────────────────────────────────────────────────────
function ErrorBanner({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center py-20 text-center">
      <p className="text-4xl mb-4">⚠️</p>
      <p className="text-zinc-300 font-semibold text-lg mb-1">
        Não foi possível carregar os produtos
      </p>
      <p className="text-zinc-600 text-sm mb-6">
        Verifique se o Spring Boot está rodando em{" "}
        <code className="text-indigo-400">localhost:8080</code>
      </p>
      <button
        onClick={onRetry}
        className="px-5 py-2.5 rounded-xl text-sm font-medium border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CatalogoPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed (Spring convention)

  const [pageData, setPageData] = useState<SpringPage<ProductMinDTO> | null>(null);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ── Debounce: wait 400ms after user stops typing ──────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Reset to page 0 whenever search changes ───────────────────────────────
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch]);

  // ── Fetch products whenever search or page changes ────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getProducts({
        name: debouncedSearch,
        page: currentPage,
        size: PAGE_SIZE,
      });
      setPageData(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── Fetch categories once on mount ────────────────────────────────────────
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {}); // categories are optional UI — fail silently
  }, []);

  // ── Derived values ────────────────────────────────────────────────────────
  const products = pageData?.content ?? [];
  const totalPages = pageData?.totalPages ?? 0;
  const totalElements = pageData?.totalElements ?? 0;
  const hasFilters = search || selectedCategory;

  const handleClear = () => {
    setSearch("");
    setSelectedCategory("");
    setCurrentPage(0);
  };

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">
            Catálogo de Produtos
          </h1>
          <p className="text-zinc-500 text-sm">
            {loading
              ? "Carregando..."
              : `${totalElements} ${totalElements === 1 ? "produto encontrado" : "produtos encontrados"}`}
          </p>
        </div>

        {/* ── Filter bar ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-56 flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus-within:border-indigo-700/60 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-zinc-500 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm text-zinc-200 placeholder-zinc-600 outline-none bg-transparent"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-zinc-600 hover:text-zinc-400 transition-colors shrink-0"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Category select — populated from GET /categories */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(0);
              }}
              className="appearance-none bg-zinc-900 border border-zinc-800 text-sm rounded-xl px-4 py-3 pr-9 outline-none focus:border-indigo-700/60 cursor-pointer transition-colors min-w-44"
              style={{ color: selectedCategory ? "#e4e4e7" : "#52525b" }}
            >
              <option value="">Todas as categorias</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Limpar filtros
            </button>
          )}
        </div>

        {/* ── Product grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {loading ? (
            // Skeleton while fetching
            Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))
          ) : error ? (
            <ErrorBanner onRetry={fetchProducts} />
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-24">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-zinc-300 font-semibold text-lg mb-1">
                Nenhum produto encontrado
              </p>
              <p className="text-zinc-600 text-sm">
                Tente buscar por outro termo ou limpe os filtros
              </p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>

        {/* ── Pagination ─────────────────────────────────────────────────── */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Page numbers — show max 5 around current page */}
            {Array.from({ length: totalPages }, (_, i) => i)
              .filter(
                (n) =>
                  n === 0 ||
                  n === totalPages - 1 ||
                  Math.abs(n - currentPage) <= 2
              )
              .reduce<(number | "...")[]>((acc, n, idx, arr) => {
                if (idx > 0 && n - (arr[idx - 1] as number) > 1) {
                  acc.push("...");
                }
                acc.push(n);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "..." ? (
                  <span key={`ellipsis-${idx}`} className="text-zinc-600 px-1 text-sm">
                    ···
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setCurrentPage(item as number)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      item === currentPage
                        ? "text-white border border-indigo-600"
                        : "border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
                    }`}
                    style={
                      item === currentPage
                        ? {
                            background:
                              "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                          }
                        : {}
                    }
                  >
                    {(item as number) + 1}
                  </button>
                )
              )}

            {/* Next */}
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
              }
              disabled={currentPage === totalPages - 1}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
