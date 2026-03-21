import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/app/services/productService";
import { ApiError } from "@/app/lib/api";
import ProductForm from "../../ProductForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditarProdutoPage({ params }: Props) {
  const { id } = await params;

  let product;
  try {
    product = await getProductById(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    // Backend down or other error
    return (
      <div className="p-8">
        <div className="max-w-md">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
              style={{ background: "linear-gradient(135deg, #27272a 0%, #3f3f46 100%)" }}
            >
              ⚠️
            </div>
            <h2 className="text-base font-bold text-white mb-2">
              Erro ao carregar produto
            </h2>
            <p className="text-zinc-500 text-sm mb-6">
              Não foi possível buscar os dados do produto. Verifique a conexão com o backend.
            </p>
            <Link
              href="/admin/produtos"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-300 border border-zinc-700 hover:border-zinc-500 hover:text-white transition-colors"
            >
              Voltar aos produtos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/produtos"
          className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm mb-4 transition-colors group"
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
          Voltar aos produtos
        </Link>
        <h1 className="text-xl font-bold text-white">Editar produto</h1>
        <p className="text-zinc-500 text-sm mt-0.5">
          Atualize os dados de{" "}
          <span className="text-zinc-300 font-medium">{product.name}</span>
        </p>
      </div>

      {/* Form card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <ProductForm mode="edit" product={product} />
      </div>
    </div>
  );
}
