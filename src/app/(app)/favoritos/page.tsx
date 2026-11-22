"use client";

import Link from "next/link";
import { useState } from "react";
import { useApp } from "@/components/AppProvider";
import { CartaoReceita, DetalheReceita } from "@/components/Receita";
import { Cabecalho } from "@/components/ui";
import type { Receita } from "@/lib/tipos";

export default function Favoritos() {
  const { favoritos } = useApp();
  const [aberta, setAberta] = useState<Receita | null>(null);

  return (
    <>
      <Cabecalho titulo="Favoritos" />
      {favoritos.length === 0 ? (
        <div className="flex flex-col items-center px-8 py-20 text-center">
          <span className="text-6xl" aria-hidden="true">
            🧡
          </span>
          <h2 className="mt-4 text-lg font-semibold">Sem favoritos por enquanto</h2>
          <p className="mt-1 text-sm text-texto-suave">Toque no coração de uma receita para guardá-la aqui.</p>
          <Link href="/buscar" className="mt-6 rounded-xl bg-primaria px-6 py-3 text-sm font-semibold text-white">
            Encontrar receitas
          </Link>
        </div>
      ) : (
        <div className="space-y-4 p-5">
          {favoritos.map((r) => (
            <CartaoReceita key={r.id} receita={r} onAbrir={() => setAberta(r)} />
          ))}
        </div>
      )}
      <DetalheReceita receita={aberta} onFechar={() => setAberta(null)} />
    </>
  );
}
