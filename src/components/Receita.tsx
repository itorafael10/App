"use client";

import { useEffect, useState } from "react";
import { useApp } from "./AppProvider";
import { IconeCarrinho, IconeCheck, IconeCoracao, IconePessoas, IconeRelogio, IconeX } from "./Icones";
import type { Categoria, Receita } from "@/lib/tipos";

const VISUAL: Record<Categoria, { emoji: string; fundo: string }> = {
  salada: { emoji: "🥗", fundo: "from-lime-200 to-emerald-300" },
  massa: { emoji: "🍝", fundo: "from-amber-200 to-orange-300" },
  carne: { emoji: "🥩", fundo: "from-rose-200 to-red-300" },
  frango: { emoji: "🍗", fundo: "from-amber-200 to-yellow-300" },
  peixe: { emoji: "🐟", fundo: "from-sky-200 to-cyan-300" },
  sopa: { emoji: "🍲", fundo: "from-orange-200 to-amber-300" },
  vegetariano: { emoji: "🥦", fundo: "from-green-200 to-lime-300" },
  arroz: { emoji: "🍚", fundo: "from-stone-200 to-amber-200" },
  ovos: { emoji: "🍳", fundo: "from-yellow-100 to-amber-200" },
  lanche: { emoji: "🥪", fundo: "from-orange-100 to-rose-200" },
  sobremesa: { emoji: "🍰", fundo: "from-pink-200 to-rose-300" },
  outro: { emoji: "🍽️", fundo: "from-emerald-100 to-teal-200" },
};

const COR_DIFICULDADE = {
  Fácil: "bg-verde text-white",
  Média: "bg-laranja text-white",
  Difícil: "bg-erro text-white",
};

function BotaoFavorito({ receita, className = "" }: { receita: Receita; className?: string }) {
  const { ehFavorito, alternarFavorito } = useApp();
  const fav = ehFavorito(receita.id);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        alternarFavorito(receita).catch(() => alert("Não foi possível salvar o favorito."));
      }}
      aria-label={fav ? "Remover dos favoritos" : "Salvar nos favoritos"}
      aria-pressed={fav}
      className={`grid size-9 place-items-center rounded-full bg-white/90 shadow-sm transition hover:scale-105 ${
        fav ? "text-erro" : "text-texto"
      } ${className}`}
    >
      <IconeCoracao cheio={fav} className="size-[18px]" />
    </button>
  );
}

export function CartaoReceita({ receita, onAbrir }: { receita: Receita; onAbrir: () => void }) {
  const v = VISUAL[receita.categoria] ?? VISUAL.outro;
  return (
    <article
      onClick={onAbrir}
      className="cursor-pointer overflow-hidden rounded-2xl border border-linha bg-cartao shadow-sm transition hover:shadow-md"
    >
      <div className={`relative grid h-36 place-items-center bg-gradient-to-br ${v.fundo}`}>
        <span className="text-6xl drop-shadow-sm" aria-hidden="true">
          {v.emoji}
        </span>
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${COR_DIFICULDADE[receita.dificuldade]}`}
        >
          {receita.dificuldade}
        </span>
        {receita.custo === "Baixo" && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-verde-escuro">
            💰 Econômica
          </span>
        )}
        <BotaoFavorito receita={receita} className="absolute right-3 top-3" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold leading-snug">{receita.titulo}</h3>
        <p className="mt-1 line-clamp-2 text-[13px] text-texto-suave">{receita.descricao}</p>
        <div className="mt-3 flex items-center justify-between text-[12px] text-texto-suave">
          <span className="flex items-center gap-1">
            <IconeRelogio className="size-4" /> {receita.tempoMinutos} min
          </span>
          <span className="flex items-center gap-1">
            <IconePessoas className="size-4" /> {receita.porcoes} {receita.porcoes === 1 ? "porção" : "porções"}
          </span>
        </div>
      </div>
    </article>
  );
}

export function DetalheReceita({ receita, onFechar }: { receita: Receita | null; onFechar: () => void }) {
  if (!receita) return null;
  // A "key" reinicia os passos marcados quando outra receita é aberta
  return <PainelReceita key={receita.id} receita={receita} onFechar={onFechar} />;
}

function PainelReceita({ receita, onFechar }: { receita: Receita; onFechar: () => void }) {
  const [feitos, setFeitos] = useState<number[]>([]);

  useEffect(() => {
    const fecharNoEsc = (e: KeyboardEvent) => e.key === "Escape" && onFechar();
    document.addEventListener("keydown", fecharNoEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", fecharNoEsc);
      document.body.style.overflow = "";
    };
  }, [onFechar]);

  const v = VISUAL[receita.categoria] ?? VISUAL.outro;
  const faltam = receita.ingredientes.filter((i) => !i.tenho);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onFechar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={receita.titulo}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-cartao sm:rounded-3xl"
      >
        <div className={`relative grid h-44 place-items-center bg-gradient-to-br ${v.fundo}`}>
          <span className="text-7xl" aria-hidden="true">
            {v.emoji}
          </span>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="absolute left-4 top-4 grid size-9 place-items-center rounded-full bg-white/90 shadow-sm"
          >
            <IconeX className="size-[18px]" />
          </button>
          <BotaoFavorito receita={receita} className="absolute right-4 top-4" />
        </div>

        <div className="space-y-6 p-5 pb-10">
          <div>
            <h2 className="text-xl font-bold leading-tight">{receita.titulo}</h2>
            <p className="mt-1.5 text-sm text-texto-suave">{receita.descricao}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[12px]">
              <Info rotulo="Tempo" valor={`${receita.tempoMinutos} min`} />
              <Info rotulo="Porções" valor={String(receita.porcoes)} />
              <Info rotulo="Custo" valor={receita.custo} />
            </div>
          </div>

          <section>
            <h3 className="mb-3 font-semibold">Ingredientes</h3>
            <ul className="space-y-2">
              {receita.ingredientes.map((i, n) => (
                <li key={n} className="flex items-start gap-3 text-sm">
                  <span
                    className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${
                      i.tenho ? "bg-verde-claro text-verde" : "bg-laranja-claro text-laranja-escuro"
                    }`}
                  >
                    {i.tenho ? <IconeCheck className="size-3.5" /> : <IconeCarrinho className="size-3" />}
                  </span>
                  <span className="flex-1">
                    <span className="font-medium">{i.nome}</span>
                    <span className="text-texto-suave"> · {i.quantidade}</span>
                  </span>
                </li>
              ))}
            </ul>
            {faltam.length > 0 && (
              <p className="mt-3 rounded-xl bg-laranja-claro px-3 py-2 text-[13px] text-laranja-escuro">
                Você precisa comprar: {faltam.map((i) => i.nome).join(", ")}
              </p>
            )}
          </section>

          <section>
            <h3 className="mb-3 font-semibold">Modo de preparo</h3>
            <ol className="space-y-3">
              {receita.modoPreparo.map((passo, n) => {
                const feito = feitos.includes(n);
                return (
                  <li key={n}>
                    <button
                      onClick={() => setFeitos((f) => (feito ? f.filter((x) => x !== n) : [...f, n]))}
                      className="flex w-full items-start gap-3 text-left text-sm"
                    >
                      <span
                        className={`grid size-6 shrink-0 place-items-center rounded-full text-[12px] font-semibold ${
                          feito ? "bg-verde text-white" : "bg-verde-claro text-verde-escuro"
                        }`}
                      >
                        {feito ? <IconeCheck className="size-3.5" /> : n + 1}
                      </span>
                      <span className={feito ? "text-texto-suave line-through" : ""}>{passo}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>

          {receita.dica && (
            <p className="rounded-xl bg-verde-claro px-4 py-3 text-sm text-verde-escuro">
              <strong>Dica:</strong> {receita.dica}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="rounded-xl bg-fundo py-2">
      <div className="text-texto-suave">{rotulo}</div>
      <div className="font-semibold">{valor}</div>
    </div>
  );
}
