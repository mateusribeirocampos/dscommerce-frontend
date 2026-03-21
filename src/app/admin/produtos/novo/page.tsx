import Link from "next/link";
import ProductForm from "../ProductForm";

export default function NovoProdutoPage() {
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
        <h1 className="text-xl font-bold text-white">Novo produto</h1>
        <p className="text-zinc-500 text-sm mt-0.5">
          Preencha os dados para cadastrar um novo produto no catálogo.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
