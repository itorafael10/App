// Chapéu de chef com uma casinha: "cozinha de casa" + "chef".
export function ChapeuChef({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M18 40c-6.5-1-11-6-11-12 0-7 6-12.5 13-11.5C22 10 27 6 33 6s11 4 13 10.5c7-1 13 4.5 13 11.5 0 6-4.5 11-11 12"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M18 38v14h30V38" stroke="currentColor" strokeWidth="4.5" strokeLinejoin="round" />
      {/* casinha */}
      <path d="M26 31.5 33 25l7 6.5V38H26v-6.5Z" fill="currentColor" />
      <rect x="31" y="32" width="4" height="4" rx="0.5" fill="var(--logo-fundo, #4a2c1a)" />
      {/* traço laranja sob o chapéu */}
      <path d="M14 58c10-4 26-5 38-2" stroke="#e8862a" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function LogoHorizontal({ claro = false }: { claro?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <ChapeuChef className={`size-9 ${claro ? "text-white" : "text-marrom"}`} />
      <span className="font-marca text-xl font-bold leading-none">
        <span className={claro ? "text-white" : "text-marrom"}>Chef </span>
        <span className="text-primaria">de Casa</span>
      </span>
    </span>
  );
}
