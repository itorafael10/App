"use client";

import { useRouter } from "next/navigation";
import { IconeVoltar, IconeX } from "./Icones";

export function Cabecalho({
  titulo,
  voltar,
  acao,
}: {
  titulo: string;
  voltar?: boolean;
  acao?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-linha bg-cartao/95 px-4 backdrop-blur">
      <div className="w-9">
        {voltar && (
          <button
            onClick={() => router.back()}
            className="-ml-2 grid size-9 place-items-center rounded-full text-texto hover:bg-fundo"
            aria-label="Voltar"
          >
            <IconeVoltar />
          </button>
        )}
      </div>
      <h1 className="flex-1 text-center text-[17px] font-semibold">{titulo}</h1>
      <div className="flex w-9 justify-end">{acao}</div>
    </header>
  );
}

export function Chip({
  children,
  ativo,
  onClick,
  onRemover,
}: {
  children: React.ReactNode;
  ativo?: boolean;
  onClick?: () => void;
  onRemover?: () => void;
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors";
  if (onRemover) {
    return (
      <span className={`${base} bg-primaria text-white`}>
        {children}
        <button onClick={onRemover} aria-label={`Remover ${children}`} className="-mr-1 rounded-full p-0.5 hover:bg-white/20">
          <IconeX className="size-3.5" />
        </button>
      </span>
    );
  }
  return (
    <button
      onClick={onClick}
      aria-pressed={ativo}
      className={`${base} ${
        ativo ? "bg-primaria text-white" : "bg-primaria-clara text-primaria-escura hover:bg-primaria-clara2"
      }`}
    >
      {children}
    </button>
  );
}

export function BotaoPrincipal({
  children,
  carregando,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { carregando?: boolean }) {
  return (
    <button
      {...props}
      disabled={props.disabled || carregando}
      className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primaria font-semibold text-white shadow-sm transition hover:bg-primaria-escura disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {carregando ? <span className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : null}
      {children}
    </button>
  );
}

const COR_AVISO = {
  info: "bg-laranja-claro text-laranja-escuro",
  sucesso: "bg-folha-clara text-folha",
  erro: "bg-erro-claro text-erro",
};

export function Aviso({ children, tipo = "info" }: { children: React.ReactNode; tipo?: keyof typeof COR_AVISO }) {
  return (
    <div
      role={tipo === "erro" ? "alert" : "status"}
      className={`rounded-xl px-4 py-3 text-sm ${COR_AVISO[tipo]}`}
    >
      {children}
    </div>
  );
}
