"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getCategories } from "@/app/services/categoryService";
import { createProduct, updateProduct } from "@/app/services/productService";
import type { CategoryDTO, ProductDTO, ProductInsertDTO } from "@/app/types";

type FormValues = {
  name: string;
  description: string;
  price: string;
  imgUrl: string;
  categoryIds: number[];
};

const EMPTY_FORM: FormValues = {
  name: "",
  description: "",
  price: "",
  imgUrl: "",
  categoryIds: [],
};

function fromProduct(p: ProductDTO): FormValues {
  return {
    name: p.name,
    description: p.description ?? "",
    price: String(p.price),
    imgUrl: p.imgUrl ?? "",
    categoryIds: p.categories.map((c) => c.id),
  };
}

function toInsertDTO(f: FormValues): ProductInsertDTO {
  return {
    name: f.name.trim(),
    description: f.description.trim(),
    price: parseFloat(f.price.replace(",", ".")),
    imgUrl: f.imgUrl.trim() || null,
    categories: f.categoryIds.map((id) => ({ id })),
  };
}

// ── Validation ────────────────────────────────────────────────────────────────
function validate(f: FormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!f.name.trim()) errors.name = "Nome é obrigatório.";
  else if (f.name.trim().length < 3) errors.name = "Nome deve ter pelo menos 3 caracteres.";
  if (!f.description.trim()) errors.description = "Descrição é obrigatória.";
  else if (f.description.trim().length < 10) errors.description = "Descrição deve ter pelo menos 10 caracteres.";
  const price = parseFloat(f.price.replace(",", "."));
  if (!f.price) errors.price = "Preço é obrigatório.";
  else if (isNaN(price) || price <= 0) errors.price = "Informe um preço válido maior que zero.";
  if (f.categoryIds.length === 0) errors.categoryIds = "Selecione ao menos uma categoria.";
  return errors;
}

// ── Props ─────────────────────────────────────────────────────────────────────
type Props =
  | { mode: "create" }
  | { mode: "edit"; product: ProductDTO };

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProductForm(props: Props) {
  const router = useRouter();
  const { token } = useAuth();

  const [form, setForm] = useState<FormValues>(
    props.mode === "edit" ? fromProduct(props.product) : EMPTY_FORM
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // Load categories
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoadingCats(false));
  }, []);

  // Field helpers
  const set = (field: keyof FormValues, value: FormValues[typeof field]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const toggleCategory = (id: number) => {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((c) => c !== id)
        : [...prev.categoryIds, id],
    }));
    setErrors((prev) => ({ ...prev, categoryIds: "" }));
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (!token) return;
    setSubmitting(true);
    setApiError("");
    try {
      const dto = toInsertDTO(form);
      if (props.mode === "create") {
        await createProduct(dto, token);
      } else {
        await updateProduct(props.product.id, dto, token);
      }
      router.push("/admin/produtos");
    } catch {
      setApiError(
        props.mode === "create"
          ? "Erro ao criar produto. Verifique os dados e tente novamente."
          : "Erro ao atualizar produto. Tente novamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* API error */}
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
          Nome <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Ex: Notebook Pro X"
          className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-600 transition-colors ${
            errors.name ? "border-red-600" : "border-zinc-700"
          }`}
        />
        {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Descrição <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Descreva o produto com detalhes relevantes…"
          rows={4}
          className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-600 transition-colors resize-none ${
            errors.description ? "border-red-600" : "border-zinc-700"
          }`}
        />
        {errors.description && (
          <p className="mt-1.5 text-xs text-red-400">{errors.description}</p>
        )}
      </div>

      {/* Price + Image URL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Preço (R$) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none">
              R$
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="0,00"
              className={`w-full bg-zinc-800 border rounded-xl pl-9 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-600 transition-colors ${
                errors.price ? "border-red-600" : "border-zinc-700"
              }`}
            />
          </div>
          {errors.price && <p className="mt-1.5 text-xs text-red-400">{errors.price}</p>}
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            URL da imagem
            <span className="ml-1.5 text-zinc-600 text-xs font-normal">(opcional)</span>
          </label>
          <input
            type="url"
            value={form.imgUrl}
            onChange={(e) => set("imgUrl", e.target.value)}
            placeholder="https://…"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-600 transition-colors"
          />
        </div>
      </div>

      {/* Image preview */}
      {form.imgUrl && (
        <div className="flex items-center gap-3 p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={form.imgUrl}
            alt="Preview"
            className="w-14 h-14 object-contain rounded-lg bg-zinc-900 border border-zinc-700 p-1"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <p className="text-xs text-zinc-500">Pré-visualização da imagem</p>
        </div>
      )}

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Categorias <span className="text-red-500">*</span>
        </label>
        {loadingCats ? (
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-24 bg-zinc-800 rounded-full animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const selected = form.categoryIds.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selected
                      ? "bg-indigo-600/20 text-indigo-400 border-indigo-700/60"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-200"
                  }`}
                >
                  {selected && <span className="mr-1">✓</span>}
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}
        {errors.categoryIds && (
          <p className="mt-1.5 text-xs text-red-400">{errors.categoryIds}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-70 hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          }}
        >
          {submitting ? (
            <>
              <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {props.mode === "create" ? "Criando…" : "Salvando…"}
            </>
          ) : props.mode === "create" ? (
            "Criar produto"
          ) : (
            "Salvar alterações"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/produtos")}
          className="px-6 py-3 rounded-xl text-sm font-medium text-zinc-400 border border-zinc-700 hover:border-zinc-500 hover:text-white transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
