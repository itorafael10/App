"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useApp } from "./AppProvider";
import { BarraNavegacao } from "./BarraNavegacao";

export function AreaLogada({ children }: { children: React.ReactNode }) {
  const { carregando, usuario } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!carregando && !usuario) router.replace("/entrar");
  }, [carregando, usuario, router]);

  if (carregando || !usuario) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <span className="size-8 animate-spin rounded-full border-[3px] border-verde/25 border-t-verde" aria-label="Carregando" />
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
