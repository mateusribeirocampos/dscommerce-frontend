# 001 — Página Home: Estrutura e Funções

**Projeto:** DSCommerce
**Stack:** Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4
**Data:** 2026-02-19

---

## Visão Geral

Nesta etapa foi construída a página inicial (home) do projeto. O resultado é uma landing page com:

- **Navbar** fixa no topo com logo e links de navegação
- **Hero section** com texto de apresentação, botão de ação e uma ilustração decorativa SVG

A estrutura segue o padrão **App Router** do Next.js, onde cada pasta dentro de `src/app/` representa uma rota da aplicação.

---

## Arquivos Criados / Modificados

```bash
src/
└── app/
    ├── components/
    │   └── Navbar.tsx        ← CRIADO
    ├── layout.tsx            ← MODIFICADO
    └── page.tsx              ← MODIFICADO
```

---

## 1. `src/app/layout.tsx` — Layout Raiz

### O que é

O arquivo `layout.tsx` na raiz de `src/app/` é o **layout global da aplicação**. Tudo que for colocado aqui será renderizado em **todas as páginas** do projeto.

No Next.js App Router, layouts são persistentes: eles não são remontados ao navegar entre páginas, o que os torna o lugar ideal para elementos que devem aparecer em toda a aplicação (navbar, footer, providers de contexto, etc).

### Código

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "./components/Navbar";   // ← adicionado

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DSCommerce",
  description: "DSCommerce - Next.js App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">           {/* ← idioma alterado para pt-BR */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />                {/* ← adicionado: renderiza em todas as páginas */}
        {children}
      </body>
    </html>
  );
}
```

### O que cada parte faz

| Elemento | Função |
|---|---|
| `Geist` / `Geist_Mono` | Importa as fontes do Google via Next.js. São aplicadas como variáveis CSS (`--font-geist-sans`) que o Tailwind usa via `globals.css`. |
| `@/styles/globals.css` | Importa o CSS global que contém o `@import "tailwindcss"` e as variáveis de tema. O `@/` é um alias para `src/` configurado no `tsconfig.json`. |
| `export const metadata` | Objeto especial que o Next.js usa para gerar as tags `<title>` e `<meta>` do HTML automaticamente. |
| `RootLayout` | Componente que envolve todas as páginas. O `children` recebe o conteúdo da página atual. |
| `lang="pt-BR"` | Informa ao navegador e leitores de tela que o idioma da página é português do Brasil. |
| `antialiased` | Classe do Tailwind que aplica `font-smoothing: antialiased` — suaviza a renderização das fontes. |

### Conceito: Server Component

Por padrão, todos os componentes no App Router do Next.js são **Server Components**. Eles são renderizados no servidor e enviados como HTML para o navegador. Isso é mais eficiente porque não carrega JavaScript desnecessário no cliente.

O `layout.tsx` é um Server Component. Para usar hooks como `useState` ou `useEffect`, seria necessário adicionar `"use client"` no topo do arquivo — mas layouts geralmente não precisam disso.

---

## 2. `src/app/components/Navbar.tsx` — Barra de Navegação

### O que é

Um componente React que representa a barra de navegação superior da aplicação. Fica no diretório `components/` dentro de `app/` — uma convenção para organizar componentes que não são páginas.

> **Importante:** A pasta `components/` não vira uma rota porque o Next.js só trata como rota pastas que contêm um arquivo `page.tsx`.

### Código

```tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-blue-600 text-white">
      <div className="max-w-5xl mx-auto px-8 py-3 flex items-center justify-between">
        <span className="font-bold text-base tracking-wide">DS Catalog</span>
        <nav className="flex gap-8 text-sm font-medium">
          <Link href="/" className="uppercase tracking-widest text-white">
            Home
          </Link>
          <Link href="/catalogo" className="uppercase tracking-widest text-blue-200 hover:text-white transition-colors">
            Catálogo
          </Link>
          <Link href="/admin" className="uppercase tracking-widest text-blue-200 hover:text-white transition-colors">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
```

### O que cada parte faz

| Elemento | Função |
|---|---|
| `import Link from "next/link"` | Importa o componente de link do Next.js. Diferente da tag `<a>` padrão, o `Link` faz **navegação client-side** (sem reload da página) e pré-carrega a rota ao passar o mouse. |
| `<header>` | Elemento semântico HTML5 para o cabeçalho da página. Melhor que usar uma `<div>` por questões de acessibilidade (leitores de tela e SEO). |
| `bg-blue-600` | Cor de fundo azul do Tailwind (escala: 100=claro → 900=escuro). O valor `600` corresponde aproximadamente a `#2563EB`. |
| `max-w-5xl mx-auto` | Limita a largura máxima do conteúdo a `1024px` e centraliza horizontalmente. Evita que o conteúdo fique muito largo em telas grandes. |
| `flex items-center justify-between` | Flexbox que alinha logo e nav na mesma linha, com o logo na esquerda e os links na direita. |
| `text-blue-200` | Tom mais claro do azul para os links inativos, criando hierarquia visual: o link ativo (Home) é branco, os demais são mais suaves. |
| `hover:text-white transition-colors` | Ao passar o mouse, o texto vira branco. O `transition-colors` anima a mudança de cor suavemente. |

### Conceito: `Link` vs `<a>`

```tsx
// NÃO usar para navegação interna:
<a href="/catalogo">Catálogo</a>

// USAR — navegação sem reload, com pré-fetch:
<Link href="/catalogo">Catálogo</Link>
```

O `<a>` recarrega a página inteira. O `Link` do Next.js mantém o estado da aplicação e só busca os dados da nova página.

---

## 3. `src/app/page.tsx` — Página Home

### O que é

O arquivo `page.tsx` dentro de `src/app/` representa a rota raiz da aplicação — o que aparece ao acessar `http://localhost:3000/`. No App Router, cada `page.tsx` define o conteúdo de uma rota.

### Estrutura visual

```
┌─────────────────────────────────────────────────────┐
│ <main> bg-gray-100, min-h-screen, flex             │
│  ┌─────────────────────────────────────────────────┐│
│  │ <div> max-w-5xl, flex, gap-12                  ││
│  │  ┌──────────────────┐ ┌──────────────────────┐ ││
│  │  │ Coluna texto     │ │ Coluna ilustração    │ ││
│  │  │ (flex-1)         │ │ (flex-1)             │ ││
│  │  │                  │ │                      │ ││
│  │  │ <h1> título      │ │ <svg> inline         │ ││
│  │  │ <p>  subtítulo   │ │                      │ ││
│  │  │ <button> CTA     │ │                      │ ││
│  │  └──────────────────┘ └──────────────────────┘ ││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### Seção de texto

```tsx
<div className="flex-1">
  <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
    Conheça o melhor<br />catálogo de produtos
  </h1>
  <p className="text-gray-500 text-sm leading-relaxed mb-10">
    Ajudaremos você a encontrar os melhores<br />
    produtos disponíveis no mercado.
  </p>
  <button className="bg-blue-600 hover:bg-blue-700 transition-colors text-white
                     text-sm font-bold uppercase tracking-widest px-8 py-4
                     flex items-center gap-3">
    Inicie agora a sua busca
    <svg ...> {/* ícone de seta */} </svg>
  </button>
</div>
```

| Classe Tailwind | O que faz |
|---|---|
| `flex-1` | O elemento cresce para ocupar metade do espaço disponível no flex container pai. |
| `text-4xl` | Tamanho de fonte `2.25rem` (36px). |
| `leading-tight` | Reduz o espaçamento entre linhas (`line-height: 1.25`). Ideal para títulos grandes. |
| `leading-relaxed` | Aumenta o espaçamento entre linhas (`line-height: 1.625`). Melhora a leitura de parágrafos. |
| `tracking-widest` | Espaçamento entre letras mais largo (`letter-spacing: 0.1em`). Usado no botão para o efeito uppercase. |
| `px-8 py-4` | Padding horizontal de `2rem` e vertical de `1rem`. |

### Ícone SVG inline no botão

```tsx
<svg
  xmlns="http://www.w3.org/2000/svg"
  className="w-5 h-5"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"   // ← herda a cor do texto do elemento pai
  strokeWidth={2.5}
>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
</svg>
```

O atributo `stroke="currentColor"` é especialmente útil: o ícone herda automaticamente a cor do texto do elemento pai. Se o botão tiver `text-white`, o ícone também será branco — sem precisar definir a cor explicitamente.

O path `d="M9 5l7 7-7 7"` desenha um chevron (`>`) usando comandos SVG:
- `M9 5` — move para o ponto (9, 5)
- `l7 7` — linha relativa para (+7, +7), chegando em (16, 12)
- `-7 7` — linha relativa para (-7, +7), chegando em (9, 19)

### Ilustração SVG

A ilustração é um SVG inline construído com formas geométricas básicas. Isso evita a necessidade de importar uma imagem externa e mantém o código auto-contido.

```tsx
<div className="flex-1 flex justify-center">
  <svg viewBox="0 0 440 320" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md">
    {/* elementos SVG... */}
  </svg>
</div>
```

**Elementos SVG usados:**

| Elemento | Descrição | Exemplo de uso |
|---|---|---|
| `<circle>` | Círculo. Atributos: `cx/cy` (centro), `r` (raio), `fill` (cor). | Círculos decorativos de download, cabeça da pessoa |
| `<rect>` | Retângulo. Atributos: `x/y` (posição), `width/height`, `rx` (borda arredondada). | Mesa, monitor, teclado, caixas |
| `<line>` | Linha reta entre dois pontos (`x1/y1` → `x2/y2`). | Seta de download, divisórias das caixas |
| `<polyline>` | Linha com múltiplos segmentos. `points="x1,y1 x2,y2 ..."`. | Ponta da seta de download (chevron) |
| `<path>` | Forma livre usando comandos de desenho. | Cabelo e corpo da pessoa, braço |
| `<ellipse>` | Elipse. Similar ao circle mas com raio X e Y separados (`rx/ry`). | Folhas da planta |

**`viewBox="0 0 440 320"`** define o sistema de coordenadas interno do SVG (largura 440, altura 320). O SVG vai escalar para o tamanho definido pelo CSS sem distorcer — é o equivalente ao `viewBox` de um ícone vetorial.

**`className="w-full max-w-md"`** faz o SVG ser responsivo: ocupa 100% da coluna mas nunca passa de `28rem` (448px).

---

## Conceitos-chave desta etapa

### App Router vs Pages Router

Este projeto usa o **App Router** (introduzido no Next.js 13). A estrutura de arquivos é diferente do antigo Pages Router:

| | App Router (`src/app/`) | Pages Router (`src/pages/`) |
|---|---|---|
| Rota raiz | `app/page.tsx` | `pages/index.tsx` |
| Layout global | `app/layout.tsx` | `pages/_app.tsx` |
| Padrão de componentes | Server Components | Client Components |

### Hierarquia de arquivos no App Router

```
src/app/
├── layout.tsx        → envolvente de TODAS as páginas
├── page.tsx          → rota "/"
├── catalogo/
│   └── page.tsx      → rota "/catalogo"  (a criar)
├── admin/
│   └── page.tsx      → rota "/admin"     (a criar)
└── components/
    └── Navbar.tsx    → componente (não é uma rota)
```

### Por que Tailwind CSS?

O Tailwind aplica estilos diretamente nas classes HTML, eliminando a necessidade de criar arquivos CSS separados para cada componente. Em vez de:

```css
/* button.css */
.cta-button {
  background-color: #2563eb;
  color: white;
  padding: 1rem 2rem;
}
```

Escreve-se diretamente no JSX:

```tsx
<button className="bg-blue-600 text-white px-8 py-4">...</button>
```

Isso acelera o desenvolvimento e mantém o estilo próximo da estrutura.

---

## Próximos passos sugeridos

- [ ] Criar a rota `/catalogo` com listagem de produtos (`src/app/catalogo/page.tsx`)
- [ ] Criar a rota `/admin` com painel administrativo (`src/app/admin/page.tsx`)
- [ ] Separar a ilustração em um componente próprio (`src/app/components/HeroIllustration.tsx`)
- [ ] Tornar a Navbar dinâmica (destacar o link da rota atual com `usePathname`)
- [ ] Substituir o SVG inline por uma imagem real usando o componente `<Image>` do Next.js
