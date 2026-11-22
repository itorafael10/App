"use client";

import Link from "next/link";
import { useState } from "react";
import { useApp } from "@/components/AppProvider";
import { IconeBrilho, IconeCalendario, IconeCarrinho, IconeMoeda } from "@/components/Icones";
import { CartaoReceita, DetalheReceita } from "@/components/Receita";
import type { Receita } from "@/lib/tipos";

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

const EM_BREVE = [
  { Icone: IconeCalendario, titulo: "Cardápio semanal", texto: "Planeje a semana inteira" },
  { Icone: IconeCarrinho, titulo: "Lista de compras", texto: "Gerada automaticamente" },
  { Icone: IconeMoeda, titulo: "Economia do mês", texto: "Quanto você poupou" },
];

export default function Inicio() {
  const { perfil, favoritos, resultados } = useApp();
  const [aberta, setAberta] = useState<Receita | null>(null);
  const primeiroNome = perfil?.nome.split(" ")[0];
  const destaque = resultados[0] ?? favoritos[0];

  return (
    <div className="space-y-7 p-5 pt-8">
      <header>
        <p className="text-sm text-texto-suave">{saudacao()}{primeiroNome ? `, ${primeiroNome}` : ""} 👋</p>
        <h1 className="mt-1 font-marca text-[28px] font-bold leading-tight text-marrom">O que vamos cozinhar hoje?</h1>
      </header>

      <Link
        href="/buscar"
        className="relative block overflow-hidden rounded-3xl bg-gradient-to-br from-primaria via-[#c96a24] to-marrom-medio p-5 text-white shadow-sm"
      >
        <span className="absolute -right-3 -top-3 text-7xl opacity-90" aria-hidden="true">
          🥘
        </span>
        <IconeBrilho className="size-6" />
        <p className="mt-3 text-lg font-semibold">Receitas com o que você tem</p>
        <p className="mt-1 max-w-[16rem] text-sm text-white/85">Diga seus ingredientes e a IA cria pratos para você.</p>
        <span className="mt-4 inline-block rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-marrom">
          Começar agora
        </span>
      </Link>

      <Link
        href="/festas"
        className="relative flex items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#9e2a2b] via-[#7a2a1f] to-marrom p-5 text-white shadow-sm"
      >
        <span className="pointer-events-none absolute right-3 top-2 text-2xl opacity-80" aria-hidden="true">
          ✨
        </span>
        <span className="text-5xl" aria-hidden="true">
          🎄
        </span>
        <span className="flex-1">
          <span className="block text-[12px] font-medium uppercase tracking-wider text-primaria-clara2">Especial de fim de ano</span>
          <span className="block font-marca text-xl font-bold leading-tight">Receitas de Natal e Ano Novo</span>
          <span className="mt-1 block text-[13px] text-white/85">Peru, pernil, farofa, rabanada e mais clássicos</span>
        </span>
        <span className="text-2xl text-primaria" aria-hidden="true">
          ›
        </span>
      </Link>

      {destaque && (
        <section>
          <h2 className="mb-3 font-semibold">{resultados[0] ? "Da sua última busca" : "Um dos seus favoritos"}</h2>
          <CartaoReceita receita={destaque} onAbrir={() => setAberta(destaque)} />
        </section>
      )}

      <section>
        <h2 className="mb-3 font-semibold">Em breve</h2>
        <div className="grid grid-cols-3 gap-3">
          {EM_BREVE.map(({ Icone, titulo, texto }) => (
            <div key={titulo} className="rounded-2xl border border-linha bg-cartao p-3">
              <span className="grid size-9 place-items-center rounded-full bg-primaria-clara text-primaria">
                <Icone className="size-[18px]" />
              </span>
              <p className="mt-2 text-[13px] font-semibold leading-tight">{titulo}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-texto-suave">{texto}</p>
            </div>
          ))}
        </div>
      </section>

      <DetalheReceita receita={aberta} onFechar={() => setAberta(null)} />
    </div>
  );
}
