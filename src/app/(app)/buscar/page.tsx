"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useSyncExternalStore } from "react";
import { useApp } from "@/components/AppProvider";
import { IconeBrilho, IconeBusca, IconeMais, IconeMic } from "@/components/Icones";
import { Aviso, BotaoPrincipal, Cabecalho, Chip } from "@/components/ui";
import { INGREDIENTES_POPULARES } from "@/lib/tipos";

/* eslint-disable @typescript-eslint/no-explicit-any */
function reconhecimentoDeVoz(): any {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

const semInscricao = () => () => {};
const normalizar = (s: string) => s.trim().replace(/\s+/g, " ");
const mesmo = (a: string, b: string) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }) === 0;

export default function Buscar() {
  const router = useRouter();
  const { ingredientes, setIngredientes, gerarReceitas, perfil, salvarPerfil } = useApp();
  const [texto, setTexto] = useState("");
  const [ouvindo, setOuvindo] = useState(false);
  const temVoz = useSyncExternalStore(
    semInscricao,
    () => Boolean(reconhecimentoDeVoz()),
    () => false,
  );
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState("");
  const reconhecedor = useRef<any>(null);

  function adicionar(valor: string) {
    const novos = valor
      .split(/,|\se\s/)
      .map(normalizar)
      .filter(Boolean)
      .filter((n) => !ingredientes.some((i) => mesmo(i, n)));
    if (novos.length) setIngredientes([...ingredientes, ...novos.map((n) => n.charAt(0).toUpperCase() + n.slice(1))]);
  }

  function alternar(nome: string) {
    if (ingredientes.some((i) => mesmo(i, nome))) setIngredientes(ingredientes.filter((i) => !mesmo(i, nome)));
    else setIngredientes([...ingredientes, nome]);
  }

  function falar() {
    const Reconhecimento = reconhecimentoDeVoz();
    if (!Reconhecimento) return;
    if (ouvindo) {
      reconhecedor.current?.stop();
      return;
    }
    const r = new Reconhecimento();
    r.lang = "pt-BR";
    r.interimResults = false;
    r.onresult = (e: any) => adicionar(e.results[0][0].transcript);
    r.onend = () => setOuvindo(false);
    r.onerror = () => setOuvindo(false);
    reconhecedor.current = r;
    setOuvindo(true);
    r.start();
  }

  async function gerar() {
    setErro("");
    setGerando(true);
    try {
      await gerarReceitas();
      router.push("/receitas");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível gerar receitas.");
      setGerando(false);
    }
  }

  const restricoes = perfil?.restricoes ?? [];

  return (
    <>
      <Cabecalho titulo="Buscar receitas" />
      <div className="space-y-7 p-5">
        <div>
          <h2 className="text-xl font-semibold">O que tem na sua cozinha?</h2>
          <p className="mt-1 text-sm text-texto-suave">Adicione ingredientes para descobrir receitas incríveis</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            adicionar(texto);
            setTexto("");
          }}
          className="flex gap-2"
        >
          <label className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-xl border border-linha bg-cartao px-3.5 focus-within:border-verde focus-within:ring-2 focus-within:ring-verde/20">
            <IconeBusca className="size-[18px] text-texto-suave" />
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={ouvindo ? "Estou ouvindo..." : "Digite ou fale seus ingredientes"}
              className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-texto-suave/70"
              enterKeyHint="done"
              aria-label="Ingrediente"
            />
            {texto && (
              <button type="submit" className="grid size-8 place-items-center rounded-lg bg-verde text-white" aria-label="Adicionar">
                <IconeMais className="size-4" />
              </button>
            )}
          </label>
          {temVoz && (
            <button
              type="button"
              onClick={falar}
              aria-label={ouvindo ? "Parar de ouvir" : "Falar ingredientes"}
              className={`grid size-12 shrink-0 place-items-center rounded-xl border transition ${
                ouvindo ? "animate-pulse border-verde bg-verde text-white" : "border-linha bg-cartao text-verde"
              }`}
            >
              <IconeMic />
            </button>
          )}
        </form>

        <section>
          <h3 className="mb-3 font-semibold">Seus ingredientes</h3>
          {ingredientes.length ? (
            <div className="flex flex-wrap gap-2">
              {ingredientes.map((i) => (
                <Chip key={i} onRemover={() => alternar(i)}>
                  {i}
                </Chip>
              ))}
            </div>
          ) : (
            <p className="text-sm text-texto-suave">Nenhum ingrediente ainda. Digite acima ou toque nos populares.</p>
          )}
        </section>

        <section>
          <h3 className="mb-3 font-semibold">Ingredientes populares</h3>
          <div className="flex flex-wrap gap-2">
            {INGREDIENTES_POPULARES.filter((p) => !ingredientes.some((i) => mesmo(i, p))).map((p) => (
              <Chip key={p} onClick={() => alternar(p)}>
                {p}
              </Chip>
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-linha bg-cartao p-4">
          <label className="flex items-center justify-between gap-3">
            <span>
              <span className="block text-sm font-semibold">💰 Receitas econômicas</span>
              <span className="block text-[12px] text-texto-suave">Prioriza ingredientes baratos e pouca compra extra</span>
            </span>
            <input
              type="checkbox"
              role="switch"
              checked={perfil?.economico ?? false}
              onChange={(e) => perfil && salvarPerfil({ ...perfil, economico: e.target.checked })}
              className="peer sr-only"
            />
            <span className="relative h-7 w-12 shrink-0 rounded-full bg-linha transition peer-checked:bg-verde after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-verde/40" />
          </label>
          <div className="border-t border-linha pt-3 text-[13px]">
            <span className="text-texto-suave">Restrições: </span>
            {restricoes.length ? <strong className="font-medium">{restricoes.join(", ")}</strong> : "nenhuma"}
            {" · "}
            <Link href="/perfil" className="font-semibold text-verde">
              Alterar
            </Link>
          </div>
        </section>

        {erro && <Aviso tipo="erro">{erro}</Aviso>}

        <div className="sticky bottom-[72px] -mx-5 bg-gradient-to-t from-fundo from-70% to-transparent px-5 pb-3 pt-6">
          <BotaoPrincipal onClick={gerar} disabled={!ingredientes.length} carregando={gerando}>
            {!gerando && <IconeBrilho className="size-5" />}
            {gerando ? "O chef está criando suas receitas..." : `Gerar receitas (${ingredientes.length})`}
          </BotaoPrincipal>
        </div>
      </div>
    </>
  );
}
