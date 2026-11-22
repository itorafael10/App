"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useApp } from "@/components/AppProvider";
import { LogoHorizontal } from "@/components/Logo";
import { Aviso, BotaoPrincipal } from "@/components/ui";

export default function Entrar() {
  const router = useRouter();
  const { usuario, carregando, entrar, cadastrar, modo: modoBackend } = useApp();
  const modoDaUrl = useSyncExternalStore(
    () => () => {},
    () => (new URLSearchParams(window.location.search).get("modo") === "cadastro" ? "cadastro" : "entrar"),
    () => "entrar" as const,
  );
  const [modoEscolhido, setModo] = useState<"entrar" | "cadastro" | null>(null);
  const modo = modoEscolhido ?? modoDaUrl;
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [confirmar, setConfirmar] = useState(false);

  useEffect(() => {
    if (!carregando && usuario) router.replace("/buscar");
  }, [carregando, usuario, router]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      if (modo === "cadastro") {
        const r = await cadastrar(nome, email, senha);
        if (r.precisaConfirmarEmail) setConfirmar(true);
      } else {
        await entrar(email, senha);
      }
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Algo deu errado. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  const campo =
    "h-12 w-full rounded-xl border border-linha bg-cartao px-4 text-[15px] outline-none transition placeholder:text-texto-suave/70 focus:border-primaria focus:ring-2 focus:ring-primaria/20";

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col bg-fundo px-6 py-10">
      <Link href="/" className="mb-10 self-start" aria-label="Cozinha Inteligente, página inicial">
        <LogoHorizontal />
      </Link>

      <h1 className="text-2xl font-semibold">{modo === "cadastro" ? "Crie sua conta" : "Bem-vindo de volta"}</h1>
      <p className="mt-1 text-sm text-texto-suave">
        {modo === "cadastro"
          ? "Salve suas receitas favoritas e preferências."
          : "Entre para continuar cozinhando."}
      </p>

      {confirmar ? (
        <div className="mt-8">
          <Aviso>
            Enviamos um link de confirmação para <strong>{email}</strong>. Abra seu e-mail, confirme a conta e
            depois volte aqui para entrar.
          </Aviso>
          <button onClick={() => { setConfirmar(false); setModo("entrar"); }} className="mt-4 text-sm font-semibold text-primaria">
            Já confirmei, quero entrar
          </button>
        </div>
      ) : (
        <form onSubmit={enviar} className="mt-8 space-y-4">
          {modo === "cadastro" && (
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Nome</span>
              <input className={campo} value={nome} onChange={(e) => setNome(e.target.value)} required autoComplete="name" placeholder="Como podemos te chamar?" />
            </label>
          )}
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">E-mail</span>
            <input className={campo} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="voce@email.com" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Senha</span>
            <input
              className={campo}
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength={6}
              autoComplete={modo === "cadastro" ? "new-password" : "current-password"}
              placeholder="Mínimo de 6 caracteres"
            />
          </label>

          {erro && <Aviso tipo="erro">{erro}</Aviso>}

          <BotaoPrincipal type="submit" carregando={enviando}>
            {modo === "cadastro" ? "Criar conta" : "Entrar"}
          </BotaoPrincipal>

          <p className="text-center text-sm text-texto-suave">
            {modo === "cadastro" ? "Já tem conta? " : "Ainda não tem conta? "}
            <button
              type="button"
              onClick={() => { setErro(""); setModo(modo === "cadastro" ? "entrar" : "cadastro"); }}
              className="font-semibold text-primaria"
            >
              {modo === "cadastro" ? "Entrar" : "Criar conta"}
            </button>
          </p>
        </form>
      )}

      {modoBackend === "demo" && (
        <p className="mt-auto pt-10 text-center text-xs text-texto-suave">
          Modo demonstração: os dados ficam salvos só neste aparelho e a senha não é verificada.
        </p>
      )}
    </main>
  );
}
