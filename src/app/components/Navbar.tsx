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
