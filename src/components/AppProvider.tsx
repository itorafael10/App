"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { backend } from "@/lib/backend";
import type { Perfil, Receita, Usuario } from "@/lib/tipos";

type Estado = {
  modo: "demo" | "supabase";
  carregando: boolean;
  usuario: Usuario | null;
  /** true logo depois de a pessoa tocar em "Sair" (para não pedir login de novo na mesma tela) */
  saiu: boolean;
  perfil: Perfil | null;
  favoritos: Receita[];
  ingredientes: string[];
  resultados: Receita[];
  setIngredientes: (lista: string[]) => void;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<{ precisaConfirmarEmail: boolean }>;
  sair: () => Promise<void>;
  salvarPerfil: (p: Perfil) => Promise<void>;
  ehFavorito: (id: string) => boolean;
  alternarFavorito: (r: Receita) => Promise<void>;
  gerarReceitas: () => Promise<void>;
};

const Contexto = createContext<Estado | null>(null);

function lerSessao<T>(chave: string, padrao: T): T {
  try {
    const v = sessionStorage.getItem(chave);
    return v ? (JSON.parse(v) as T) : padrao;
  } catch {
    return padrao;
  }
}

function gravarSessao(chave: string, valor: unknown) {
  try {
    sessionStorage.setItem(chave, JSON.stringify(valor));
  } catch {}
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const api = backend();
  const [carregando, setCarregando] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [saiu, setSaiu] = useState(false);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [favoritos, setFavoritos] = useState<Receita[]>([]);
  // Restaura a busca atual quando a página é recarregada. As telas que usam esses dados
  // só aparecem depois que a sessão carrega no navegador, então não há diferença com o servidor.
  const [ingredientes, setIngredientesState] = useState<string[]>(() => lerSessao("ci:ingredientes", []));
  const [resultados, setResultados] = useState<Receita[]>(() => lerSessao("ci:resultados", []));

  useEffect(() => {
    let ativo = true;
    // undefined = ainda não sabemos; null = ninguém logado
    let idAtual: string | null | undefined = undefined;

    async function carregarDados(u: Usuario | null) {
      if (!ativo) return;
      // Ignora eventos repetidos (ex.: renovação do token) para não recarregar a tela à toa
      if ((u?.id ?? null) === idAtual) return;
      idAtual = u?.id ?? null;
      setCarregando(true);
      setUsuario(u);
      if (u) setSaiu(false);
      if (!u) {
        setPerfil(null);
        setFavoritos([]);
        setCarregando(false);
        return;
      }
      try {
        const [p, f] = await Promise.all([api.carregarPerfil(u), api.listarFavoritos(u)]);
        if (!ativo) return;
        setPerfil({ ...p, nome: p.nome || u.nome });
        setFavoritos(f);
      } catch (e) {
        console.error("Falha ao carregar dados do usuário", e);
        if (ativo) setPerfil({ nome: u.nome, restricoes: [], economico: false });
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    api.usuarioAtual().then(carregarDados);
    const cancelar = api.aoMudarSessao((u) => {
      // Fora do callback do Supabase para não travar o cliente de autenticação
      setTimeout(() => carregarDados(u), 0);
    });
    return () => {
      ativo = false;
      cancelar();
    };
  }, [api]);

  const setIngredientes = useCallback((lista: string[]) => {
    setIngredientesState(lista);
    gravarSessao("ci:ingredientes", lista);
  }, []);

  const sair = useCallback(async () => {
    setSaiu(true);
    // Limpa a busca para a próxima pessoa que usar este aparelho
    setIngredientesState([]);
    setResultados([]);
    try {
      sessionStorage.removeItem("ci:ingredientes");
      sessionStorage.removeItem("ci:resultados");
    } catch {}
    await api.sair();
  }, [api]);

  const salvarPerfil = useCallback(
    async (p: Perfil) => {
      if (!usuario) return;
      await api.salvarPerfil(usuario, p);
      setPerfil(p);
    },
    [api, usuario],
  );

  const ehFavorito = useCallback((id: string) => favoritos.some((f) => f.id === id), [favoritos]);

  const alternarFavorito = useCallback(
    async (r: Receita) => {
      if (!usuario) return;
      const anterior = favoritos;
      const ja = anterior.some((f) => f.id === r.id);
      setFavoritos(ja ? anterior.filter((f) => f.id !== r.id) : [r, ...anterior]);
      try {
        if (ja) await api.removerFavorito(usuario, r.id);
        else await api.adicionarFavorito(usuario, r);
      } catch (e) {
        setFavoritos(anterior);
        throw e;
      }
    },
    [api, usuario, favoritos],
  );

  const gerarReceitas = useCallback(async () => {
    const token = await api.tokenDeAcesso();
    const resp = await fetch("/api/receitas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        ingredientes,
        restricoes: perfil?.restricoes ?? [],
        economico: perfil?.economico ?? false,
      }),
    });
    const dados = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(dados.erro ?? "Não foi possível gerar receitas.");
    setResultados(dados.receitas);
    gravarSessao("ci:resultados", dados.receitas);
  }, [api, ingredientes, perfil]);

  const valor = useMemo<Estado>(
    () => ({
      modo: api.modo,
      carregando,
      usuario,
      saiu,
      perfil,
      favoritos,
      ingredientes,
      resultados,
      setIngredientes,
      entrar: api.entrar,
      cadastrar: api.cadastrar,
      sair,
      salvarPerfil,
      ehFavorito,
      alternarFavorito,
      gerarReceitas,
    }),
    [api, carregando, usuario, saiu, perfil, favoritos, ingredientes, resultados, setIngredientes, sair, salvarPerfil, ehFavorito, alternarFavorito, gerarReceitas],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useApp() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useApp precisa estar dentro de <AppProvider>");
  return ctx;
}
