# DSCommerce Frontend — Claude Instructions

## Status
study | Branch: main (remote: git@github.com:mateusribeirocampos/dscommerce-frontend.git)

## Structure
```
dscommerce-frontend/
├── src/
│   └── app/                    # Next.js App Router
│       ├── layout.tsx          # Root layout
│       ├── page.tsx            # Route: / (home — hero + CTA)
│       ├── catalogo/
│       │   └── page.tsx        # Route: /catalogo (product grid + filter)
│       ├── components/
│       │   ├── Navbar.tsx      # Active-link navigation bar
│       │   └── ProductCard.tsx # Reusable product card
│       └── styles/
│           └── globals.css
├── docs/                       # Study notes (MD files per implementation step)
├── public/
├── next.config.ts
└── package.json
```

## Key Commands
```bash
npm run dev    # next dev --webpack  → http://localhost:3000
npm run build  # production build
npm start      # start production server
npm run lint   # eslint
```

## Rules
- Study/course project — changes are low-risk but keep commits clean for learning record
- Currently uses MOCK DATA in /catalogo — backend integration is planned (Java Spring Boot on :8080)
- Do NOT add external dependencies without evaluating if they fit the study scope
- App Router only — no pages/ directory; all routes are in src/app/
- Server Components by default; use 'use client' only where interactivity is required

## Environment
No .env needed currently — all data is mocked.
When backend integration is added:
```
NEXT_PUBLIC_API_URL=http://localhost:8080   # Spring Boot backend
```
