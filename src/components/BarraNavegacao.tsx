"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconeBusca, IconeChef, IconeCoracao, IconeInicio, IconePerfil } from "./Icones";

const ITENS = [
  { href: "/inicio", rotulo: "Início", Icone: IconeInicio },
  { href: "/buscar", rotulo: "Buscar", Icone: IconeBusca },
  { href: "/receitas", rotulo: "Receitas", Icone: IconeChef },
  { href: "/favoritos", rotulo: "Favoritos", Icone: IconeCoracao },
  { href: "/perfil", rotulo: "Perfil", Icone: IconePerfil },
];

export function BarraNavegacao() {
  const caminho = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-linha bg-cartao/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto flex max-w-md">
        {ITENS.map(({ href, rotulo, Icone }) => {
          const ativo = caminho === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={ativo ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
                  ativo ? "text-verde" : "text-texto-suave hover:text-texto"
                }`}
              >
                <Icone className="size-[22px]" />
                {rotulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
