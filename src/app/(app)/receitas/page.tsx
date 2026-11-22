"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useApp } from "@/components/AppProvider";
import { IconeFiltro } from "@/components/Icones";
import { CartaoReceita, DetalheReceita } from "@/components/Receita";
import { Cabecalho, Chip } from "@/components/ui";
import type { Receita } from "@/lib/tipos";

const FILTROS = {
  rapidas: { rotulo: "Até 30 min", teste: (r: Receita) => r.tempoMinutos <= 30 },
  faceis: { rotulo: "Fáceis", teste: (r: Receita) => r.dificuldade === "Fácil" },
  baratas: { rotulo: "Econômicas", teste: (r: Receita) => r.custo === "Baixo" },
  semCompras: { rotulo: "Sem compras", teste: (r: Receita) => r.ingredientes.every((i) => i.tenho) },
};
type Filtro = keyof typeof FILTROS;

export default function Receitas() {
  const { resultados, ingredientes } = useApp();
  const [aberta, setAberta] = useState<Receita | null>(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtros, setFiltros] = useState<Filtro[]>([]);

  const lista = useMemo(
    () => resultados.filter((r) => filtros.every((f) => FILTROS[f].teste(r))),
    [resultados, filtros],
  );

  return (
    <>
      <Cabecalho
        titulo="Receitas"
        voltar
        acao={
          resultados.length > 0 && (
            <button
              onClick={() => setMostrarFiltros((m) => !m)}
              aria-label="Filtros"
              aria-expanded={mostrarFiltros}
              className={`grid size-9 place-items-center rounded-full ${filtros.length ? "bg-primaria-clara text-primaria" : "text-texto hover:bg-fundo"}`}
            >
              <IconeFiltro className="size-[18px]" />
            </button>
          )
        }
      />

      {resultados.length === 0 ? (
        <div className="flex flex-col items-center px-8 py-20 text-center">
          <span className="text-6xl" aria-hidden="true">
            👩‍🍳
          </span>
          <h2 className="mt-4 text-lg font-semibold">Nenhuma receita ainda</h2>
          <p className="mt-1 text-sm text-texto-suave">Conte o que você tem em casa e o chef cria receitas para você.</p>
          <Link href="/buscar" className="mt-6 rounded-xl bg-primaria px-6 py-3 text-sm font-semibold text-white">
            Buscar receitas
          </Link>
        </div>
      ) : (
        <div className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-2">
            {ingredientes.map((i) => (
              <span key={i} className="rounded-full bg-primaria-clara px-3 py-1 text-[12px] font-medium text-primaria-escura">
                {i}
              </span>
            ))}
            <Link href="/buscar" className="px-1 text-[12px] font-semibold text-primaria">
              Editar
            </Link>
          </div>

          {mostrarFiltros && (
            <div className="flex flex-wrap gap-2 rounded-2xl border border-linha bg-cartao p-3">
              {(Object.keys(FILTROS) as Filtro[]).map((f) => (
                <Chip
                  key={f}
                  ativo={filtros.includes(f)}
                  onClick={() => setFiltros((a) => (a.includes(f) ? a.filter((x) => x !== f) : [...a, f]))}
                >
                  {FILTROS[f].rotulo}
                </Chip>
              ))}
            </div>
          )}

          {lista.length ? (
            lista.map((r) => <CartaoReceita key={r.id} receita={r} onAbrir={() => setAberta(r)} />)
          ) : (
            <p className="py-10 text-center text-sm text-texto-suave">Nenhuma receita combina com esses filtros.</p>
          )}
        </div>
      )}

      <DetalheReceita receita={aberta} onFechar={() => setAberta(null)} />
    </>
  );
}
