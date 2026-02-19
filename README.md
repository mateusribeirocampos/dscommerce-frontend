# DSCommerce Frontend

A modern e-commerce frontend application built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4. This project is part of a full-stack application — the frontend is designed to integrate with a **Java Spring Boot** REST API backend (in progress).

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Roadmap](#roadmap)
- [Backend Integration](#backend-integration)

---

## Overview

DSCommerce is a product catalog application where users can browse products by name or category. The project follows a component-driven architecture using the **Next.js App Router**, with server components by default and client components only where interactivity is required.

### Current Features

- **Home page** — hero section with a call-to-action button navigating to the catalog
- **Catalog page** — product grid with filter bar (name + category) and pagination
- **Active navigation** — navbar highlights the current route automatically
- **Study documentation** — every implementation step is documented in `/docs` for learning purposes

---

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.1.6 | React framework (App Router) |
| [React](https://react.dev) | 19.2.3 | UI library |
| [TypeScript](https://www.typescriptlang.org) | 5.x | Static typing |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Utility-first styling |

---

## Project Structure

```
dscommerce/
├── docs/                                         # Step-by-step study documentation
│   ├── 001-Pagina-home-estrutura-e-funcoes.md
│   └── 002-Pagina-catalogo-componentes-e-conceitos.md
├── public/                                       # Static assets
└── src/
    └── app/                                      # Next.js App Router
        ├── components/
        │   ├── Navbar.tsx                        # Global navigation bar
        │   └── ProductCard.tsx                   # Reusable product card
        ├── catalogo/
        │   └── page.tsx                          # Route: /catalogo
        ├── layout.tsx                            # Root layout (wraps all pages)
        ├── page.tsx                              # Route: / (home)
        └── styles/
            └── globals.css                       # Global styles + Tailwind import
```

### Routing convention

The App Router maps the file system directly to URL routes:

| File | URL |
|---|---|
| `src/app/page.tsx` | `/` |
| `src/app/catalogo/page.tsx` | `/catalogo` |
| `src/app/admin/page.tsx` | `/admin` *(planned)* |

---

## Pages

### `/` — Home

Hero section introducing the catalog with a call-to-action button that navigates to `/catalogo`.

### `/catalogo` — Product Catalog

- **Filter bar** — text search by product name and category dropdown
- **Product grid** — 4-column responsive grid of product cards
- **Pagination** — numbered page controls

> Currently using mock data. Will be replaced by API calls to the Spring Boot backend.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone git@github.com:mateusribeirocampos/dscommerce-frontend.git

# Navigate into the project
cd dscommerce-frontend

# Install dependencies
npm install
```

### Running in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server with hot-reload |
| `npm run build` | Create an optimized production build |
| `npm start` | Start the production server (requires build first) |
| `npm run lint` | Run ESLint to check for code issues |

---

## Roadmap

### Frontend

- [x] Home page with hero section
- [x] Product catalog page with filter bar and pagination
- [x] Active link highlighting in navbar
- [ ] Functional search and category filter (client-side state)
- [ ] Product detail page (`/catalogo/[id]`)
- [ ] Admin dashboard (`/admin`)
- [ ] Admin product form (create / edit / delete)
- [ ] User authentication UI (login / register)
- [ ] Shopping cart
- [ ] Checkout flow

### Integration

- [ ] Fetch product list from Spring Boot API
- [ ] Fetch categories from API
- [ ] Implement JWT-based authentication with the backend
- [ ] Connect admin CRUD operations to API endpoints

---

## Backend Integration

This frontend is designed to connect to a **Java Spring Boot** REST API. Once the backend is available, the mock data in the catalog page will be replaced by real `fetch` calls inside Next.js Server Components.

### Expected API contract

```
GET  /products?name=&categoryId=&page=&size=   → paginated product list
GET  /products/{id}                            → single product detail
GET  /categories                               → list of categories
POST /oauth2/token                             → authentication (JWT)
```

### How data fetching will work in Next.js

Server Components can fetch data directly — no `useEffect` needed:

```tsx
// src/app/catalogo/page.tsx (future implementation)
export default async function CatalogoPage() {
  const response = await fetch("http://localhost:8080/products");
  const data = await response.json();

  return (
    <div>
      {data.content.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

The backend is expected to run on `http://localhost:8080` in local development. A base URL environment variable will be configured for production.

---

## Study Documentation

The `/docs` folder contains detailed explanations of every implementation step, written for learning purposes:

| File | Contents |
|---|---|
| `001-Pagina-home-estrutura-e-funcoes.md` | App Router, layout, Server Components, SVG, Tailwind basics |
| `002-Pagina-catalogo-componentes-e-conceitos.md` | Client Components, `usePathname`, TypeScript types, CSS Grid, mock data |

---

## License

This project is for educational purposes.
