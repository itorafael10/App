"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useApp } from "./AppProvider";
import { BarraNavegacao } from "./BarraNavegacao";

export function AreaLogada({ children }: { children: React.ReactNode }) {
  const { carregando, usuario, saiu } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (carregando || usuario) return;
    // Quem acabou de sair volta para a página inicial; quem abriu uma tela sem login
    // vai para o login e depois retorna para a mesma tela.
    if (saiu) router.replace("/");
    else router.replace(`/entrar?voltar=${encodeURIComponent(window.location.pathname)}`);
  }, [carregando, usuario, saiu, router]);

  if (carregando || !usuario) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <span className="size-8 animate-spin rounded-full border-[3px] border-primaria/25 border-t-primaria" aria-label="Carregando" />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto min-h-dvh max-w-md bg-fundo pb-24">{children}</div>
      <BarraNavegacao />
    </>
  );
}
