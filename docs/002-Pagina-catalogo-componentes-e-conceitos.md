# 002 — Página Catálogo: Componentes e Conceitos

**Projeto:** DSCommerce
**Stack:** Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4
**Data:** 2026-02-19

---

## Visão Geral

Nesta etapa foi construída a página de catálogo (`/catalogo`) e dois conceitos importantes foram introduzidos: **componentes reutilizáveis** e **link ativo dinâmico na Navbar**.

O resultado é uma página com:
- Barra de filtros (nome + categoria + limpar)
- Grid de 4 colunas com cards de produto
- Paginação numerada

Além disso, o botão da home passou a navegar para o catálogo, e a Navbar passou a destacar automaticamente o link da página atual.

---

## Arquivos Criados / Modificados

```bash
src/
└── app/
    ├── components/
    │   ├── Navbar.tsx        ← MODIFICADO (link ativo dinâmico)
    │   └── ProductCard.tsx   ← CRIADO
    ├── catalogo/
    │   └── page.tsx          ← CRIADO
    └── page.tsx              ← MODIFICADO (botão → Link)
```

---

## 1. `Navbar.tsx` — Link Ativo Dinâmico

### O problema anterior

Na versão anterior, todos os links tinham estilos fixos. O link "Home" era sempre branco e os outros sempre azul-claro — independente de qual página o usuário estava visitando.

### A solução: `usePathname`

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-blue-600 text-white">
      <div className="max-w-5xl mx-auto px-8 py-3 flex items-center justify-between">
        <span className="font-bold text-base tracking-wide">DS Catalog</span>
        <nav className="flex gap-8 text-sm font-medium">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`uppercase tracking-widest transition-colors ${
                pathname === href
                  ? "text-white"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
```

### Conceito: `"use client"`

Por padrão no Next.js App Router, todos os componentes são **Server Components** — renderizados no servidor, sem acesso a hooks do React nem a APIs do navegador.

Para usar hooks como `useState`, `useEffect` ou `usePathname`, o componente precisa ser um **Client Component**, declarado com a diretiva `"use client"` na primeira linha:

```tsx
"use client";   // ← deve ser a PRIMEIRA linha, antes de qualquer import
```

| | Server Component | Client Component |
|---|---|---|
| Hooks (`useState`, etc.) | ❌ | ✅ |
| Acesso ao navegador | ❌ | ✅ |
| Executado em | Servidor | Servidor + Navegador |
| Tamanho do bundle JS | Menor | Maior |
| Indicado para | Layouts, páginas, busca de dados | Interatividade, formulários, estado |

**Regra prática:** só use `"use client"` quando precisar de interatividade. O Navbar precisa porque usa `usePathname`.

### Conceito: `usePathname`

```tsx
const pathname = usePathname();
// Na rota /catalogo → pathname === "/catalogo"
// Na rota /         → pathname === "/"
```

`usePathname` é um hook do Next.js que retorna a URL atual como string. Sempre que o usuário navega para outra página, o valor de `pathname` muda e o componente re-renderiza, atualizando as classes CSS dos links.

### Conceito: Template Literal com Ternário

Para aplicar classes condicionais, usamos template literals (`` ` ` ``) com o operador ternário (`? :`):

```tsx
className={`uppercase tracking-widest transition-colors ${
  pathname === href
    ? "text-white"          // condição VERDADEIRA → link ativo
    : "text-blue-200 hover:text-white"   // condição FALSA → link inativo
}`}
```

O operador ternário tem a forma: `condição ? valor_se_verdadeiro : valor_se_falso`.

### Conceito: Array de objetos + `.map()`

Em vez de repetir três `<Link>` manualmente, os dados foram extraídos para um array:

```tsx
// Dados separados da estrutura visual
const links = [
  { href: "/", label: "Home" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/admin", label: "Admin" },
];

// Geração automática dos links
{links.map(({ href, label }) => (
  <Link key={href} href={href} ...>
    {label}
  </Link>
))}
```

**Por que isso é melhor?** Para adicionar um novo link (ex: `/contato`), basta adicionar um objeto ao array — o JSX não precisa mudar.

**A prop `key`:** quando o React renderiza uma lista, ele precisa de um identificador único em cada item para saber qual atualizar quando algo mudar. O `key` deve ser único e estável — aqui usamos o `href`, que nunca se repete.

```tsx
// ❌ Sem key: React não consegue otimizar re-renderizações
links.map(({ href, label }) => <Link href={href}>{label}</Link>)

// ✅ Com key: React sabe exatamente qual elemento mudou
links.map(({ href, label }) => <Link key={href} href={href}>{label}</Link>)
```

---

## 2. `ProductCard.tsx` — Componente Reutilizável

### O que é

Um componente que recebe os dados de um produto e renderiza seu card visual. É chamado 8 vezes na página do catálogo — um para cada produto.

### TypeScript: Tipando as props

```tsx
type Product = {
  id: number;
  name: string;
  price: number;
};

export default function ProductCard({ product }: { product: Product }) {
  // ...
}
```

O `type Product` define o "formato" que o objeto produto deve ter. Se tentar passar um produto sem o campo `price`, o TypeScript vai mostrar um erro **antes de rodar o código** — isso evita bugs em tempo de desenvolvimento.

A sintaxe `{ product }: { product: Product }` é **desestruturação com tipagem**:
- `{ product }` → extrai a prop `product` diretamente (em vez de `props.product`)
- `: { product: Product }` → declara que o componente recebe um objeto com uma prop chamada `product` do tipo `Product`

### Formatando o preço em pt-BR

```tsx
function formatPrice(price: number) {
  const formatted = price.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  // formatted = "2.779,00"

  const [integer, decimal] = formatted.split(",");
  // integer = "2.779"
  // decimal = "00"

  return { integer, decimal };
}
```

`toLocaleString("pt-BR")` formata o número seguindo as regras do português brasileiro:
- Ponto como separador de milhar: `2779` → `2.779`
- Vírgula como separador decimal: `2779.00` → `2.779,00`

O `.split(",")` divide a string no caractere `,`, retornando um array. A **desestruturação de array** `const [integer, decimal]` pega o primeiro elemento em `integer` e o segundo em `decimal`.

### Renderizando o preço com tamanhos diferentes

```tsx
const { integer, decimal } = formatPrice(product.price);

<div className="flex items-baseline gap-0.5 text-blue-600">
  <span className="text-xs font-medium">R$</span>
  <span className="text-2xl font-bold leading-none">{integer}</span>
  <span className="text-xs font-medium">,{decimal}</span>
</div>
```

| Classe | Efeito |
|---|---|
| `items-baseline` | Alinha os três `<span>` pela **linha de base do texto** (base das letras). Sem isso, os textos de tamanhos diferentes ficariam desalinhados verticalmente. |
| `text-xs` | Tamanho pequeno para "R$" e ",00" |
| `text-2xl font-bold` | Tamanho grande e negrito para o número principal |
| `leading-none` | Remove o espaçamento de linha extra do número grande |

```
Com items-baseline:        Sem items-baseline (items-center):
R$ 2.779,00               R$
   ↑ alinhados             2.779
   pela base               ,00
```

### Subcomponente interno: `ComputerImage`

```tsx
function ComputerImage() {
  return (
    <svg viewBox="0 0 200 140" ...>
      {/* SVG do computador */}
    </svg>
  );
}
```

`ComputerImage` é uma função que retorna JSX — ou seja, é um componente React como qualquer outro. A diferença é que ela **não é exportada** (`export default`), então só pode ser usada dentro do arquivo `ProductCard.tsx`.

Isso organiza o código: `ProductCard` fica limpo e legível, enquanto os detalhes do SVG ficam isolados em `ComputerImage`.

### Card com hover

```tsx
<div className="bg-white border border-gray-200 hover:border-green-400 rounded transition-colors cursor-pointer p-4 flex flex-col gap-3">
```

| Classe | Efeito |
|---|---|
| `border border-gray-200` | Borda cinza fina no estado normal |
| `hover:border-green-400` | Borda verde ao passar o mouse |
| `transition-colors` | Anima a mudança de cor suavemente (300ms) |
| `cursor-pointer` | Muda o cursor para "mãozinha" — indica que é clicável |
| `flex flex-col gap-3` | Empilha imagem e texto verticalmente com espaço entre eles |

---

## 3. `catalogo/page.tsx` — Página do Catálogo

### Rota automática pelo sistema de arquivos

Criar o arquivo `src/app/catalogo/page.tsx` é suficiente para que a URL `http://localhost:3000/catalogo` funcione. O Next.js mapeia automaticamente a estrutura de pastas para rotas:

```
src/app/page.tsx              →  /
src/app/catalogo/page.tsx     →  /catalogo
src/app/admin/page.tsx        →  /admin         (a criar)
```

### Mock data

```tsx
const mockProducts = [
  { id: 1, name: "Computador Desktop - Intel Core i7", price: 2779.0 },
  // ... 7 mais
];
```

**Mock data** (dados fictícios) é uma prática comum no desenvolvimento frontend para construir e testar a interface antes de ter uma API real. Os dados têm a mesma estrutura que virão do backend, então quando a API estiver pronta, basta substituir o array pela chamada de rede.

### Barra de filtros com `divide-x`

```tsx
<div className="bg-white border border-gray-200 rounded mb-6 flex items-center divide-x divide-gray-200">
  <div className="flex items-center flex-1 px-4 py-3 gap-2">
    {/* Input de busca */}
  </div>
  <div className="flex items-center px-4 py-3 gap-2 cursor-pointer w-52">
    {/* Dropdown de categoria */}
  </div>
  <div className="px-4 py-3">
    {/* Botão limpar */}
  </div>
</div>
```

`divide-x divide-gray-200` é uma utilidade do Tailwind que adiciona automaticamente uma borda vertical (`border-left`) entre cada filho direto do container — sem precisar adicionar `border-l` manualmente em cada um.

```
┌──────────────────────┬──────────────┬──────────────┐
│  Nome do produto  🔍 │  Categoria ∨ │ LIMPAR FILTRO│
└──────────────────────┴──────────────┴──────────────┘
                       ↑              ↑
                   divide-x       divide-x
```

### CSS Grid para o grid de produtos

```tsx
<div className="grid grid-cols-4 gap-4 mb-8">
  {mockProducts.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

`grid grid-cols-4` cria um grid CSS com 4 colunas de largura igual. Os 8 produtos se distribuem automaticamente: 4 na primeira linha, 4 na segunda.

**Grid vs Flexbox — quando usar cada um:**

| | Flexbox | CSS Grid |
|---|---|---|
| Dimensão | 1D (linha OU coluna) | 2D (linhas E colunas) |
| Controle | Pelo filho (flex-1, etc.) | Pelo pai (grid-cols-4) |
| Ideal para | Navbar, botões, alinhamentos | Cards, galerias, layouts de página |

### Paginação com classe condicional

```tsx
const pageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 10, 35];

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
```

O mesmo padrão de ternário usado no Navbar é aplicado aqui: a página `1` recebe as classes de "ativo" (fundo azul), as demais recebem as classes de "inativo" (fundo branco com borda cinza).

Note que o `.map()` aqui recebe dois parâmetros: `(n, i)`. O `n` é o número da página e o `i` é o índice (0, 1, 2...). Usamos `key={i}` porque os números não são sequenciais (pulam o 9) e o índice é o identificador mais simples disponível.

---

## 4. `page.tsx` (Home) — Botão → Link

### A mudança

```tsx
// Antes — não navegava
<button className="bg-blue-600 ...">
  Inicie agora a sua busca
</button>

// Depois — navega para /catalogo
import Link from "next/link";

<Link href="/catalogo" className="bg-blue-600 ... w-fit">
  Inicie agora a sua busca
</Link>
```

### Por que `w-fit`?

O `<Link>` renderiza como uma tag `<a>` no HTML, que por padrão é um elemento **inline** — não ocupa a largura total. Porém, quando adicionamos `flex` nas classes (para posicionar o texto e o ícone lado a lado), o elemento se comporta como um flex container e pode esticar dependendo do contexto.

`w-fit` garante que o link tenha exatamente a largura do seu conteúdo (`width: fit-content`) — igual ao comportamento natural de um `<button>`.

---

## Conceitos-chave desta etapa

### Hierarquia de componentes

```
layout.tsx
├── Navbar.tsx          ← Client Component ("use client")
└── catalogo/page.tsx   ← Server Component (padrão)
    └── ProductCard.tsx ← Server Component (padrão)
        └── ComputerImage()  ← função interna, não exportada
```

### Server vs Client — decisão prática

```
Precisa de useState / useEffect / usePathname?
  ├── SIM → "use client"
  └── NÃO → deixa como Server Component (padrão)
```

O `CatalogoPage` e o `ProductCard` não têm interatividade ainda — são puramente visuais — então permanecem Server Components. Quando implementarmos o filtro funcional, precisaremos de um Client Component para gerenciar o estado do input.

### Composição de componentes

Em vez de uma página enorme com todo o HTML, o código foi dividido em:

- `ProductCard` → responsável por renderizar **um** produto
- `CatalogoPage` → responsável por montar a **lista** de produtos

Essa separação de responsabilidades torna o código mais fácil de ler, testar e manter. É o princípio de **composição** do React: componentes pequenos e focados compõem interfaces complexas.

---

## Próximos passos sugeridos

- [ ] Tornar o filtro de nome funcional (extrair para um Client Component com `useState`)
- [ ] Implementar o dropdown de categorias com dados reais
- [ ] Conectar a paginação ao estado da página atual
- [ ] Criar a rota `/admin` com listagem e edição de produtos
- [ ] Substituir os `mockProducts` por dados vindos de uma API com `fetch` em Server Component
