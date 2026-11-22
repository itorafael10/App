"use client";

import { useState } from "react";
import { CartaoReceita, DetalheReceita } from "@/components/Receita";
import { Cabecalho, Chip } from "@/components/ui";
import { SECOES_FESTAS } from "@/lib/receitas-festas";
import type { Receita } from "@/lib/tipos";

export default function Festas() {
  const [aberta, setAberta] = useState<Receita | null>(null);
  const [secao, setSecao] = useState<string | null>(null);
  const secoes = secao ? SECOES_FESTAS.filter((s) => s.id === secao) : SECOES_FESTAS;

  return (
    <>
      <Cabecalho titulo="Natal e Ano Novo" voltar />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#9e2a2b] via-[#7a2a1f] to-marrom px-5 pb-6 pt-7 text-white">
        <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
          <span className="absolute -right-2 top-3 text-6xl">🎄</span>
          <span className="absolute right-20 top-16 text-3xl">✨</span>
          <span className="absolute right-6 top-24 text-4xl">🥂</span>
        </div>
        <p className="relative text-[13px] font-medium uppercase tracking-wider text-primaria-clara2">Receitas clássicas</p>
        <h2 className="relative mt-1 max-w-[15rem] font-marca text-[28px] font-bold leading-tight">Ceia de fim de ano</h2>
        <p className="relative mt-2 max-w-[16rem] text-sm text-white/85">
          Os pratos tradicionais das festas, com passo a passo completo.
        </p>
      </section>

      <div className="space-y-7 p-5">
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
          <Chip ativo={secao === null} onClick={() => setSecao(null)}>
            Todas
          </Chip>
          {SECOES_FESTAS.map((s) => (
            <Chip key={s.id} ativo={secao === s.id} onClick={() => setSecao(s.id)}>
              {s.titulo}
            </Chip>
          ))}
        </div>

        {secoes.map((s) => (
          <section key={s.id}>
            <h3 className="mb-3 font-semibold">
              {s.titulo} <span className="font-normal text-texto-suave">({s.receitas.length})</span>
            </h3>
            <div className="space-y-4">
              {s.receitas.map((r) => (
                <CartaoReceita key={r.id} receita={r} onAbrir={() => setAberta(r)} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <DetalheReceita receita={aberta} onFechar={() => setAberta(null)} />
    </>
  );
}
