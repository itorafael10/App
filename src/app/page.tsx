"use client";

import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import { ChapeuChef } from "@/components/Logo";

function IconeCesta({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 10h18l-1.6 9.2a1.5 1.5 0 0 1-1.5 1.3H6.1a1.5 1.5 0 0 1-1.5-1.3L3 10Z" />
      <path d="m7 10 4-6M17 10l-3-6" />
      <path d="M9 14v3M12 14v3M15 14v3" />
    </svg>
  );
}

function IconeLivro({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V4Z" />
      <path d="M5 18a2 2 0 0 1 2-2h12" />
      <path d="M9 8h6M9 11h4" />
    </svg>
  );
}

const DESTAQUES = [
  { Icone: IconeCesta, texto: "Use o que tem em casa" },
  { Icone: IconeLivro, texto: "Receitas variadas" },
  { Icone: ChapeuChef, texto: "Cozinhe de forma mais prática" },
];

export default function Boasvindas() {
  const { usuario } = useApp();
  return (
    <main className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-marrom text-white">
      {/* Fundo: luz quente de cozinha */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 0%, #a8663a 0%, #7a4a2b 38%, #4a2c1a 75%), #4a2c1a",
        }}
      />
      {/* Prateleira sugerida e temperos no alto */}
      <div className="absolute inset-x-0 top-[150px] -z-10 h-2 bg-[#5c3820]/70 blur-[1px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 select-none" aria-hidden="true">
        <span className="absolute left-[6%] top-[78px] text-3xl opacity-80 sm:text-4xl">🫙</span>
        <span className="absolute left-[2%] top-[104px] text-2xl opacity-70 sm:text-3xl">🧂</span>
        <span className="absolute right-[7%] top-[70px] text-4xl opacity-90 sm:text-5xl">🌿</span>
      </div>

      <section className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center px-6 pt-12 text-center sm:pt-16">
        <div className="relative">
          <ChapeuChef className="size-24 text-white drop-shadow sm:size-28" />
          <span className="absolute -right-12 top-10 flex flex-col gap-1.5" aria-hidden="true">
            <span className="block h-1 w-5 -rotate-45 rounded-full bg-primaria" />
            <span className="block h-1 w-6 -rotate-12 rounded-full bg-primaria" />
            <span className="block h-1 w-5 rotate-12 rounded-full bg-primaria" />
          </span>
        </div>

        <h1 className="mt-3 font-marca font-bold leading-[0.9] drop-shadow-sm">
          <span className="block text-[64px] text-white sm:text-[84px]">Chef</span>
          <span className="block text-[56px] text-primaria sm:text-[72px]">de Casa</span>
        </h1>

        <p className="mt-6 max-w-sm text-lg leading-snug text-white/95 sm:text-xl">
          Informe os ingredientes que você tem e descubra{" "}
          <span className="relative whitespace-nowrap font-semibold text-primaria">
            receitas incríveis!
            <svg viewBox="0 0 200 12" className="absolute -bottom-3 left-0 w-full" aria-hidden="true">
              <path d="M4 8c50-6 130-7 192-2" stroke="#e8862a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </p>

        <div className="mt-10 w-full max-w-xs space-y-3">
          <Link
            href={usuario ? "/inicio" : "/entrar?modo=cadastro"}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-primaria text-lg font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-primaria-escura"
          >
            {usuario ? "Abrir o app" : "Começar agora"}
          </Link>
          {!usuario && (
            <p className="text-sm text-white/85">
              Já tem conta?{" "}
              <Link href="/entrar" className="font-semibold text-primaria underline-offset-2 hover:underline">
                Entrar
              </Link>
            </p>
          )}
        </div>

        <Link
          href={usuario ? "/festas" : "/entrar?modo=cadastro&voltar=/festas"}
          className="mt-8 flex w-full max-w-xs items-center gap-3 rounded-2xl border border-white/15 bg-[#9e2a2b]/85 px-4 py-3 text-left shadow-lg shadow-black/20 backdrop-blur transition hover:bg-[#9e2a2b]"
        >
          <span className="text-3xl" aria-hidden="true">
            🎄
          </span>
          <span className="flex-1">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-primaria-clara2">Novidade</span>
            <span className="block text-sm font-semibold leading-snug">Receitas de Natal e Ano Novo</span>
          </span>
          <span className="text-xl text-primaria" aria-hidden="true">
            ›
          </span>
        </Link>
      </section>

      {/* Bancada de madeira com ingredientes apoiados na borda */}
      <footer className="relative mt-16 bg-gradient-to-b from-[#8a5530] to-[#5a341d] px-4 pb-8 pt-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 select-none" aria-hidden="true">
          <span className="absolute -top-12 -left-2 text-6xl sm:left-[4%] sm:text-7xl">🍅</span>
          <span className="absolute -top-9 left-12 text-5xl sm:left-[12%] sm:text-6xl">🍅</span>
          <span className="absolute -top-8 left-[26%] -rotate-12 text-4xl sm:left-[20%] sm:text-5xl">🌿</span>
          <span className="absolute -top-8 right-[24%] text-4xl sm:right-[16%] sm:text-5xl">🧄</span>
          <span className="absolute -top-11 -right-2 text-6xl sm:right-[4%] sm:text-7xl">🧀</span>
        </div>
        <ul className="mx-auto grid max-w-xl grid-cols-3 divide-x divide-primaria/70">
          {DESTAQUES.map(({ Icone, texto }) => (
            <li key={texto} className="flex flex-col items-center gap-2 px-2 text-center">
              <Icone className="size-9 text-white" />
              <span className="text-[13px] leading-tight text-white/95 sm:text-sm">{texto}</span>
            </li>
          ))}
        </ul>
        <svg viewBox="0 0 300 14" className="mx-auto mt-5 w-2/3 max-w-md" aria-hidden="true">
          <path d="M4 10c80-8 200-9 292-3" stroke="#e8862a" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      </footer>
    </main>
  );
}
