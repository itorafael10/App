import type { Categoria } from "@/lib/tipos";

// Capa da receita no estilo de cardápio: papel com textura suave, ícone de traço fino
// e o nome da categoria. Substitui os emojis (visual mais adulto e consistente).

type Estilo = { rotulo: string; cor: string; papel: string };

const ESTILOS: Record<Categoria, Estilo> = {
  salada: { rotulo: "Saladas", cor: "#5f7a34", papel: "#eef0e0" },
  massa: { rotulo: "Massas", cor: "#b5652a", papel: "#f7ead8" },
  carne: { rotulo: "Carnes", cor: "#8e3b2c", papel: "#f5e4dc" },
  frango: { rotulo: "Aves", cor: "#a8621e", papel: "#f7e9d6" },
  peixe: { rotulo: "Peixes", cor: "#3d6a72", papel: "#e3eeee" },
  sopa: { rotulo: "Sopas e caldos", cor: "#9a5a26", papel: "#f5e6d4" },
  vegetariano: { rotulo: "Vegetariano", cor: "#4f7a3a", papel: "#e8f0df" },
  arroz: { rotulo: "Arroz e grãos", cor: "#8a6a2e", papel: "#f4ecda" },
  ovos: { rotulo: "Ovos", cor: "#b98a1c", papel: "#f8efd6" },
  lanche: { rotulo: "Lanches", cor: "#9a4f2e", papel: "#f6e6da" },
  sobremesa: { rotulo: "Sobremesas", cor: "#8a3f57", papel: "#f5e3e6" },
  outro: { rotulo: "Pratos", cor: "#7a4a2b", papel: "#f3e8db" },
};

export function rotuloCategoria(c: Categoria) {
  return (ESTILOS[c] ?? ESTILOS.outro).rotulo;
}

function Icone({ categoria }: { categoria: Categoria }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  switch (categoria) {
    case "salada":
      return (
        <g {...p}>
          <path d="M8 26h32a16 14 0 0 1-32 0Z" />
          <path d="M14 26c0-6 4-9 9-9-1 5-4 8-9 9ZM34 26c0-6-4-9-9-9 1 5 4 8 9 9Z" />
          <path d="M24 26c0-6 0-9 0-13M24 18c2-2 4-3 6-3" />
          <path d="M18 40h12" />
        </g>
      );
    case "massa":
      return (
        <g {...p}>
          <path d="M8 28h32a16 12 0 0 1-32 0Z" />
          <path d="M13 28c2-4 6-5 9-3s7 1 9-2 5-3 7 0" />
          <path d="M30 6v14M33 6v14M27 6v14M27 14h6" />
        </g>
      );
    case "carne":
      return (
        <g {...p}>
          {/* cutelo de açougueiro */}
          <path d="M6 13h24v17H11a5 5 0 0 1-5-5V13Z" />
          <circle cx="11.5" cy="18" r="1.8" />
          <path d="M30 19h11a2.5 2.5 0 0 1 0 5H30" />
          <path d="M10 35h20" />
        </g>
      );
    case "frango":
      return (
        <g {...p}>
          {/* coxa de ave */}
          <path d="M31 8c6 1 10 7 8 13-2 7-9 10-15 8-5-2-7-7-5-12 2-6 7-10 12-9Z" />
          <path d="M22 26 14 34" />
          <circle cx="11.5" cy="34.5" r="2.6" />
          <circle cx="14.5" cy="37.5" r="2.6" />
        </g>
      );
    case "peixe":
      return (
        <g {...p}>
          <path d="M8 24c5-8 13-11 21-9 4 1 7 4 9 9-2 5-5 8-9 9-8 2-16-1-21-9Z" />
          <path d="M38 24l6-6v12l-6-6" />
          <circle cx="15" cy="22" r="1.4" />
          <path d="M22 17c2 4 2 10 0 14" />
        </g>
      );
    case "sopa":
      return (
        <g {...p}>
          <path d="M8 24h32v4a12 10 0 0 1-12 10h-8A12 10 0 0 1 8 28v-4Z" />
          <path d="M4 26h4M40 26h4" />
          <path d="M18 10c-2 2 2 4 0 7M24 8c-2 2 2 4 0 7M30 10c-2 2 2 4 0 7" />
        </g>
      );
    case "vegetariano":
      return (
        <g {...p}>
          <path d="M14 34 32 16c3-3 8-2 8-2s1 5-2 8L20 40c-3 3-8 2-8 2s-1-5 2-8Z" />
          <path d="M33 15c0-4 2-7 5-8M36 18c3-1 6 0 8 2" />
          <path d="M20 28l3 3M25 23l3 3" />
        </g>
      );
    case "arroz":
      return (
        <g {...p}>
          <path d="M8 26h32a16 13 0 0 1-32 0Z" />
          <path d="M12 26c1-7 6-10 12-10s11 3 12 10" />
          <path d="M18 21h1M23 19h1M28 21h1M21 24h1M26 23h1" />
          <path d="M30 6l8 12M34 5l7 11" />
        </g>
      );
    case "ovos":
      return (
        <g {...p}>
          <path d="M10 24c0-8 7-12 13-11 5-4 14-2 15 5 3 4 2 11-3 14-4 4-11 5-16 3-6 0-9-5-9-11Z" />
          <circle cx="24" cy="24" r="6" />
        </g>
      );
    case "lanche":
      return (
        <g {...p}>
          <path d="M8 20c0-6 7-10 16-10s16 4 16 10H8Z" />
          <path d="M7 25c3 2 6-2 9 0s6-2 9 0 6-2 9 0 5 0 7-1" />
          <path d="M8 30h32v3c0 2-2 4-4 4H12c-2 0-4-2-4-4v-3Z" />
        </g>
      );
    case "sobremesa":
      return (
        <g {...p}>
          <path d="M10 22 36 12l2 10H10Z" />
          <path d="M10 22v14h28V22" />
          <path d="M10 29h28" />
          <path d="M33 12c0-3 2-5 4-5" />
        </g>
      );
    default:
      return (
        <g {...p}>
          <path d="M8 34h32" />
          <path d="M11 34a13 13 0 0 1 26 0" />
          <path d="M24 21v-3M22 18h4" />
          <path d="M6 38h36" />
        </g>
      );
  }
}

export function CapaReceita({
  categoria,
  grande = false,
  className = "",
  children,
}: {
  categoria: Categoria;
  grande?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const e = ESTILOS[categoria] ?? ESTILOS.outro;
  return (
    <div
      className={`relative grid place-items-center overflow-hidden ${grande ? "h-48" : "h-36"} ${className}`}
      style={{
        backgroundColor: e.papel,
        // textura de papel: pontilhado bem suave
        backgroundImage: `radial-gradient(${e.cor}14 1px, transparent 1.2px)`,
        backgroundSize: "14px 14px",
        color: e.cor,
      }}
    >
      <div className="flex flex-col items-center">
        <span className={`grid place-items-center rounded-full border ${grande ? "size-24" : "size-[76px]"}`} style={{ borderColor: `${e.cor}55` }}>
          <span className={`grid place-items-center rounded-full bg-white/70 ${grande ? "size-20" : "size-16"}`}>
            <svg viewBox="0 0 48 48" className={grande ? "size-14" : "size-11"} aria-hidden="true">
              <Icone categoria={categoria} />
            </svg>
          </span>
        </span>
        <span className="mt-2.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em]">
          <span className="h-px w-5" style={{ backgroundColor: `${e.cor}80` }} />
          {e.rotulo}
          <span className="h-px w-5" style={{ backgroundColor: `${e.cor}80` }} />
        </span>
      </div>
      {children}
    </div>
  );
}
