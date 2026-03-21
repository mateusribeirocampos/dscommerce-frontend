# DSCommerce — Frontend

A modern, dark-themed e-commerce frontend built with **Next.js 15** and **Tailwind CSS v4**, fully integrated with a [Java Spring Boot backend](https://github.com/mateusribeirocampos/project-spring-boot-dscommerce).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | OAuth2 (Spring Authorization Server) + JWT |
| State | React Context API + localStorage |
| Backend | Spring Boot on [Render.com](https://project-spring-boot-dscommerce.onrender.com) |

---

## Features

- **Catalog** — paginated product listing with real-time name search and category filter
- **Product detail** — full page with image, price, categories and add-to-cart
- **Cart** — persisted cart with quantity controls, subtotal and checkout
- **Authentication** — JWT login via OAuth2 password grant; token decoded client-side
- **Registration** — new account creation via `POST /users/register`
- **Admin area** (ROLE_ADMIN only)
  - Product list with search, pagination, delete with confirmation
  - Create new product with category selection
  - Edit existing product

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- Running Spring Boot backend (locally or remote)

### Install & run

```bash
npm install
npm run dev     # http://localhost:3000
```

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Spring Boot API base URL | `http://localhost:8080` |
| `NEXT_PUBLIC_OAUTH_CLIENT_ID` | OAuth2 client ID | `myclient` |
| `NEXT_PUBLIC_OAUTH_CLIENT_SECRET` | OAuth2 client secret | `mysecret` |

> For the Render.com deployment set `NEXT_PUBLIC_API_URL=https://project-spring-boot-dscommerce.onrender.com`

### Development accounts

The backend seed file (`import.sql`) creates two users for local testing:

| Account | Email | Password | Roles |
|---------|-------|----------|-------|
| Maria Brown | `maria@gmail.com` | `123456` | `ROLE_CLIENT` |
| Alex Green | `matcamp1981@gmail.com` | `123456` | `ROLE_ADMIN` + `ROLE_CLIENT` |

Use Alex's credentials to access the `/admin` area.

---

## Project Structure

```
src/app/
├── layout.tsx              # Root layout (Navbar + Providers)
├── page.tsx                # / — Hero landing page
├── catalogo/               # /catalogo — Product grid + search
├── produto/[id]/           # /produto/:id — Product detail
├── cart/                   # /cart — Cart + checkout
├── login/                  # /login — OAuth2 login
├── register/               # /register — User registration
├── admin/
│   ├── layout.tsx          # Auth guard (ROLE_ADMIN only)
│   ├── page.tsx            # Redirects → /admin/produtos
│   └── produtos/
│       ├── page.tsx        # Product list (search, paginate, delete)
│       ├── ProductForm.tsx # Shared create/edit form component
│       ├── novo/page.tsx   # Create product
│       └── [id]/editar/    # Edit product
├── components/
│   ├── Navbar.tsx          # Sticky nav with cart badge + auth menu
│   ├── ProductCard.tsx     # Reusable product card
│   ├── AddToCartButton.tsx # Client island for cart interaction
│   └── Providers.tsx       # AuthProvider + CartProvider wrapper
├── context/
│   ├── AuthContext.tsx     # JWT token management
│   └── CartContext.tsx     # Cart state + localStorage persistence
├── services/               # API fetch wrappers (one file per resource)
├── lib/api.ts              # Base fetch helper + ApiError class
└── types/index.ts          # All DTOs mirroring the backend
```

---

## API Integration

The frontend communicates with the Spring Boot backend through a thin service layer:

| Service | Endpoints |
|---------|-----------|
| `productService` | `GET /products`, `GET /products/{id}`, `POST /products`, `PUT /products/{id}`, `DELETE /products/{id}` |
| `categoryService` | `GET /categories` |
| `orderService` | `POST /orders`, `GET /orders/{id}` |
| `userService` | `POST /users/register`, `GET /users/me` |
| `authService` | `POST /oauth2/token` (password grant) |

All protected routes send `Authorization: Bearer <token>` in the request header. The JWT token is stored in `localStorage` under the key `dscommerce:token` and decoded client-side to extract the user's email and roles.

---

## Deployment

### Vercel (frontend)

1. Push to GitHub
2. Import the project in the Vercel dashboard
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` → your Render.com backend URL
   - `NEXT_PUBLIC_OAUTH_CLIENT_ID`
   - `NEXT_PUBLIC_OAUTH_CLIENT_SECRET`
4. Deploy

### Backend CORS (Render.com)

The Spring Boot backend must allow the Vercel domain. Set the `CORS_ORIGINS` environment variable on Render to your Vercel deployment URL:

```
CORS_ORIGINS=https://your-app.vercel.app
```

---

## Scripts

```bash
npm run dev     # Development server (http://localhost:3000)
npm run build   # Production build
npm start       # Start production server
npm run lint    # ESLint check
```
