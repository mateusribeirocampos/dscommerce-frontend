import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-gray-100 min-h-screen flex items-center">
      <div className="max-w-5xl mx-auto px-8 py-16 flex items-center gap-12">
        {/* Text content */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
            Conheça o melhor
            <br />
            catálogo de produtos
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-10">
            Ajudaremos você a encontrar os melhores
            <br />
            produtos disponíveis no mercado.
          </p>
          <Link
            href="/catalogo"
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-bold uppercase tracking-widest px-8 py-4 flex items-center gap-3 w-fit"
          >
            Inicie agora a sua busca
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Illustration */}
        <div className="flex-1 flex justify-center">
          <svg
            viewBox="0 0 440 320"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-md"
          >
            {/* Large download circle */}
            <circle cx="110" cy="95" r="72" fill="#EFF6FF" />
            <circle cx="110" cy="95" r="52" fill="#DBEAFE" />
            <line
              x1="110" y1="72" x2="110" y2="108"
              stroke="#2563EB" strokeWidth="4" strokeLinecap="round"
            />
            <polyline
              points="92,92 110,110 128,92"
              fill="none" stroke="#2563EB" strokeWidth="4"
              strokeLinecap="round" strokeLinejoin="round"
            />

            {/* Small download circle */}
            <circle cx="300" cy="68" r="52" fill="#EFF6FF" />
            <circle cx="300" cy="68" r="37" fill="#DBEAFE" />
            <line
              x1="300" y1="47" x2="300" y2="79"
              stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round"
            />
            <polyline
              points="285,65 300,82 315,65"
              fill="none" stroke="#2563EB" strokeWidth="3.5"
              strokeLinecap="round" strokeLinejoin="round"
            />

            {/* Desk surface */}
            <rect x="55" y="230" width="310" height="12" rx="6" fill="#1D4ED8" />
            <rect x="80" y="242" width="10" height="35" rx="4" fill="#1E40AF" />
            <rect x="330" y="242" width="10" height="35" rx="4" fill="#1E40AF" />

            {/* Monitor */}
            <rect x="150" y="155" width="140" height="76" rx="6" fill="#1E40AF" />
            <rect x="157" y="162" width="126" height="62" rx="4" fill="#BFDBFE" />
            <rect x="167" y="173" width="70" height="5" rx="2" fill="#1E40AF" opacity="0.35" />
            <rect x="167" y="183" width="100" height="5" rx="2" fill="#1E40AF" opacity="0.35" />
            <rect x="167" y="193" width="85" height="5" rx="2" fill="#1E40AF" opacity="0.35" />
            <rect x="210" y="231" width="20" height="6" rx="2" fill="#1E40AF" />

            {/* Keyboard */}
            <rect x="145" y="228" width="130" height="8" rx="3" fill="#93C5FD" />

            {/* Person - head */}
            <circle cx="130" cy="150" r="26" fill="#FDE68A" />
            {/* Hair */}
            <path
              d="M106 145 Q108 122 130 122 Q152 122 154 145 Q142 133 130 133 Q118 133 106 145Z"
              fill="#78350F"
            />
            {/* Body */}
            <path
              d="M106 178 Q106 158 130 156 Q154 158 154 178 L157 228 L103 228 Z"
              fill="#3B82F6"
            />
            {/* Arm */}
            <path
              d="M150 190 Q198 208 218 226"
              stroke="#FDE68A" strokeWidth="14" strokeLinecap="round" fill="none"
            />

            {/* Boxes - right */}
            <rect x="330" y="203" width="40" height="27" rx="3" fill="#60A5FA" />
            <line x1="350" y1="203" x2="350" y2="230" stroke="#3B82F6" strokeWidth="1.5" />
            <line x1="330" y1="216" x2="370" y2="216" stroke="#3B82F6" strokeWidth="1.5" />
            <rect x="336" y="183" width="30" height="20" rx="3" fill="#93C5FD" />
            <line x1="351" y1="183" x2="351" y2="203" stroke="#3B82F6" strokeWidth="1.5" />

            {/* Plant - left */}
            <rect x="68" y="200" width="8" height="30" fill="#92400E" />
            <ellipse cx="72" cy="194" rx="20" ry="26" fill="#4ADE80" />
            <ellipse cx="55" cy="208" rx="15" ry="20" fill="#22C55E" />
            <ellipse cx="89" cy="207" rx="15" ry="20" fill="#22C55E" />
          </svg>
        </div>
      </div>
    </main>
  );
}
