"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import { IconeBrilho, IconeCarrinho, IconeFiltro } from "@/components/Icones";

const RECURSOS = [
  {
    Icone: IconeBrilho,
    titulo: "Receitas com IA",
    texto: "Sugestões personalizadas a partir dos seus ingredientes",
  },
  {
    Icone: IconeFiltro,
    titulo: "Filtros alimentares",
    texto: "Vegano, sem glúten, sem lactose, low carb e mais",
  },
  {
    Icone: IconeCarrinho,
    titulo: "Lista de compras inteligente",
    texto: "Saiba exatamente o que falta comprar",
  },
];

export default function Boasvindas() {
  const { usuario } = useApp();
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col bg-cartao">
      <section className="relative flex h-[46dvh] min-h-72 flex-col justify-end overflow-hidden bg-gradient-to-br from-[#1f3a24] via-[#2b4d2f] to-[#14261a] p-6 text-white">
        <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
          <span className="absolute right-6 top-10 rotate-12 text-7xl">🍅</span>
          <span className="absolute left-8 top-16 -rotate-12 text-5xl">🧄</span>
          <span className="absolute right-24 top-36 text-6xl">🥕</span>
          <span className="absolute left-24 top-32 rotate-6 text-4xl">🌿</span>
          <span className="absolute -right-4 top-56 text-8xl opacity-90">🍲</span>
        </div>
        <div className="relative">
          <h1 className="text-[28px] font-semibold leading-tight">
            Transforme o que você tem em uma refeição deliciosa
          </h1>
          <p className="mt-2 text-sm text-white/80">Receitas com inteligência artificial feitas com os seus ingredientes</p>
        </div>
      </section>

      <section className="flex flex-1 flex-col gap-5 p-6">
        {RECURSOS.map(({ Icone, titulo, texto }) => (
          <div key={titulo} className="flex items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-verde-claro text-verde">
              <Icone className="size-5" />
            </span>
            <div>
              <h2 className="text-[15px] font-semibold">{titulo}</h2>
              <p className="text-[13px] text-texto-suave">{texto}</p>
            </div>
          </div>
        ))}

        <div className="mt-auto space-y-3 pt-4">
          <Link
            href={usuario ? "/buscar" : "/entrar?modo=cadastro"}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-verde font-semibold text-white shadow-sm transition hover:bg-verde-escuro"
          >
            <IconeBrilho className="size-5" /> Começar
          </Link>
          {!usuario && (
            <p className="text-center text-sm text-texto-suave">
              Já tem conta?{" "}
              <Link href="/entrar" className="font-semibold text-verde">
                Entrar
              </Link>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
