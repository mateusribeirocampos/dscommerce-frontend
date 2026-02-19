import ProductCard from "@/app/components/ProductCard";

const mockProducts = [
  { id: 1, name: "Computador Desktop - Intel Core i7", price: 2779.0 },
  { id: 2, name: "Computador Desktop - Intel Core i7", price: 2779.0 },
  { id: 3, name: "Computador Desktop - Intel Core i7", price: 2779.0 },
  { id: 4, name: "Computador Desktop - Intel Core i7", price: 2779.0 },
  { id: 5, name: "Computador Desktop - Intel Core i7", price: 2779.0 },
  { id: 6, name: "Computador Desktop - Intel Core i7", price: 2779.0 },
  { id: 7, name: "Computador Desktop - Intel Core i7", price: 2779.0 },
  { id: 8, name: "Computador Desktop - Intel Core i7", price: 2779.0 },
];

const pageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 10, 35];

export default function CatalogoPage() {
  return (
    <main className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Page title */}
        <h1 className="text-xl font-bold text-gray-900 mb-5">
          Catálogo de produtos
        </h1>

        {/* Filter bar */}
        <div className="bg-white border border-gray-200 rounded mb-6 flex items-center divide-x divide-gray-200">
          {/* Search input */}
          <div className="flex items-center flex-1 px-4 py-3 gap-2">
            <input
              type="text"
              placeholder="Nome do produto"
              className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-400 shrink-0"
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
          </div>

          {/* Category dropdown */}
          <div className="flex items-center px-4 py-3 gap-2 cursor-pointer w-52">
            <span className="flex-1 text-sm text-gray-400">Categoria</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-400 shrink-0"
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

          {/* Clear filter button */}
          <div className="px-4 py-3">
            <button className="text-xs font-semibold text-gray-500 uppercase tracking-widest hover:text-gray-700 transition-colors whitespace-nowrap">
              Limpar Filtro
            </button>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-1">
          {pageNumbers.map((n, i) => (
            <button
              key={i}
              className={`w-8 h-8 text-xs rounded flex items-center justify-center border transition-colors ${
                n === 1
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              {n}
            </button>
          ))}
          <button className="w-8 h-8 text-xs rounded flex items-center justify-center border bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
