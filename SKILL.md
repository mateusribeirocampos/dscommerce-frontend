# DSCommerce Frontend — Project Reference

## Description
Study/course project: a Next.js 16 + React 19 e-commerce frontend for the DSCommerce system. Implements a product catalog with filter bar and pagination. Designed to eventually connect to the DSCommerce Java Spring Boot REST API backend (OAuth2/JWT). Currently uses mock data. Every implementation step is documented in /docs for learning purposes. Audience: developer learning Next.js App Router patterns.

## Tech Stack
- **Framework:** Next.js 16.1.6 (App Router, Server Components by default)
- **UI:** React 19.2.3, TypeScript 5.x, Tailwind CSS 4.x
- **Tooling:** ESLint 9 (eslint-config-next)
- **Backend (planned):** Java Spring Boot 3 REST API (separate project)
- **Deploy:** Not deployed to production (study project)

## Directory Structure
```
dscommerce-frontend/
├── docs/
│   ├── 001-Pagina-home-estrutura-e-funcoes.md        # App Router, layout, Server Components, Tailwind
│   └── 002-Pagina-catalogo-componentes-e-conceitos.md # Client Components, usePathname, CSS Grid, mock data
├── public/                     # Static assets
├── src/
│   └── app/
│       ├── layout.tsx          # Root layout (wraps all pages with Navbar)
│       ├── page.tsx            # / — Hero section + "Inicie agora a sua busca" CTA → /catalogo
│       ├── catalogo/
│       │   └── page.tsx        # /catalogo — product grid with filter bar + pagination (mock data)
│       ├── components/
│       │   ├── Navbar.tsx      # Global navbar with active route highlighting (usePathname)
│       │   └── ProductCard.tsx # Reusable product card component
│       └── styles/
│           └── globals.css     # Global styles + Tailwind import
├── next.config.ts
├── postcss.config.mjs          # Tailwind CSS 4 PostCSS config
├── tsconfig.json
└── package.json
```

## Key Files
- `src/app/page.tsx` — home page with inline SVG illustration (no external image assets)
- `src/app/catalogo/page.tsx` — catalog page; replace mock data here when wiring backend
- `src/app/components/Navbar.tsx` — uses `usePathname` (client component) for active link detection
- `docs/` — step-by-step implementation notes; read these to understand design decisions

## Deploy & URLs
- No production deployment
- Local dev: http://localhost:3000
- Planned backend: http://localhost:8080 (Java Spring Boot DSCommerce API)

## Development Setup
```bash
git clone git@github.com:mateusribeirocampos/dscommerce-frontend.git
cd dscommerce-frontend
npm install
npm run dev    # http://localhost:3000
```

## Expected Backend API Contract (when integrated)
```
GET  /products?name=&categoryId=&page=&size=   # paginated product list
GET  /products/{id}                             # single product
GET  /categories                                # list categories
POST /oauth2/token                              # JWT authentication
```

## Git
- Remote: git@github.com:mateusribeirocampos/dscommerce-frontend.git
- Main branch: main
