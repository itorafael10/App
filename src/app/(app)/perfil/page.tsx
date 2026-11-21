"use client";

import { useState } from "react";
import { useApp } from "@/components/AppProvider";
import { Aviso, BotaoPrincipal, Cabecalho, Chip } from "@/components/ui";
import { RESTRICOES } from "@/lib/tipos";

export default function Perfil() {
  const { usuario, perfil, salvarPerfil, sair, modo } = useApp();
  // O perfil já está carregado quando esta tela aparece (ver AreaLogada)
  const [nome, setNome] = useState(perfil?.nome ?? "");
  const [restricoes, setRestricoes] = useState<string[]>(perfil?.restricoes ?? []);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  async function salvar() {
    if (!perfil) return;
    setSalvando(true);
    setMensagem(null);
    try {
      await salvarPerfil({ ...perfil, nome: nome.trim(), restricoes });
      setMensagem({ tipo: "sucesso", texto: "Preferências salvas!" });
    } catch {
      setMensagem({ tipo: "erro", texto: "Não foi possível salvar. Tente novamente." });
    } finally {
      setSalvando(false);
    }
  }

  const inicial = (nome || usuario?.email || "?").charAt(0).toUpperCase();

  return (
    <>
      <Cabecalho titulo="Perfil" />
      <div className="space-y-6 p-5">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-full bg-verde text-xl font-semibold text-white">{inicial}</span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{nome || "Sem nome"}</p>
            <p className="truncate text-sm text-texto-suave">{usuario?.email}</p>
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Nome</span>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="h-12 w-full rounded-xl border border-linha bg-cartao px-4 outline-none focus:border-verde focus:ring-2 focus:ring-verde/20"
          />
        </label>

        <section>
          <h2 className="text-sm font-semibold">Restrições alimentares</h2>
          <p className="mb-3 text-[12px] text-texto-suave">As receitas sugeridas sempre vão respeitar o que você marcar.</p>
          <div className="flex flex-wrap gap-2">
            {RESTRICOES.map((r) => (
              <Chip
                key={r}
                ativo={restricoes.includes(r)}
                onClick={() => setRestricoes((a) => (a.includes(r) ? a.filter((x) => x !== r) : [...a, r]))}
              >
                {r}
              </Chip>
            ))}
          </div>
        </section>

        {mensagem && <Aviso tipo={mensagem.tipo}>{mensagem.texto}</Aviso>}

        <BotaoPrincipal onClick={salvar} carregando={salvando}>
          Salvar preferências
        </BotaoPrincipal>

        <div className="rounded-2xl border border-linha bg-cartao p-4">
          <p className="text-sm font-semibold">Assinatura</p>
          <p className="mt-1 text-[13px] text-texto-suave">
            Em breve: plano mensal com receitas ilimitadas, cardápio semanal e lista de compras automática.
          </p>
        </div>

        <button onClick={sair} className="w-full rounded-xl border border-linha bg-cartao py-3 text-sm font-semibold text-erro">
          Sair da conta
        </button>

        {modo === "demo" && (
          <p className="text-center text-xs text-texto-suave">Modo demonstração: dados salvos só neste aparelho.</p>
        )}
      </div>
    </>
  );
}
