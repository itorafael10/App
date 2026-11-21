"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Perfil, Receita, Usuario } from "./tipos";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurado } from "./supabase-config";

export interface Backend {
  modo: "demo" | "supabase";
  usuarioAtual(): Promise<Usuario | null>;
  aoMudarSessao(cb: (u: Usuario | null) => void): () => void;
  entrar(email: string, senha: string): Promise<void>;
  cadastrar(nome: string, email: string, senha: string): Promise<{ precisaConfirmarEmail: boolean }>;
  sair(): Promise<void>;
  tokenDeAcesso(): Promise<string | null>;
  carregarPerfil(u: Usuario): Promise<Perfil>;
  salvarPerfil(u: Usuario, p: Perfil): Promise<void>;
  listarFavoritos(u: Usuario): Promise<Receita[]>;
  adicionarFavorito(u: Usuario, r: Receita): Promise<void>;
  removerFavorito(u: Usuario, id: string): Promise<void>;
}

const perfilPadrao = (nome: string): Perfil => ({ nome, restricoes: [], economico: false });

// ---------- Modo demonstração: tudo fica salvo apenas neste navegador ----------

function ler<T>(chave: string, padrao: T): T {
  try {
    const v = localStorage.getItem(chave);
    return v ? (JSON.parse(v) as T) : padrao;
  } catch {
    return padrao;
  }
}

function gravar(chave: string, valor: unknown) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // armazenamento indisponível (aba anônima, etc.)
  }
}

function criarBackendDemo(): Backend {
  const ouvintes = new Set<(u: Usuario | null) => void>();
  const avisar = (u: Usuario | null) => ouvintes.forEach((cb) => cb(u));
  const idDe = (email: string) => "demo-" + email.trim().toLowerCase();

  return {
    modo: "demo",
    async usuarioAtual() {
      return ler<Usuario | null>("ci:usuario", null);
    },
    aoMudarSessao(cb) {
      ouvintes.add(cb);
      return () => ouvintes.delete(cb);
    },
    async entrar(email) {
      const contas = ler<Record<string, Usuario>>("ci:contas", {});
      const u = contas[idDe(email)];
      if (!u) throw new Error("Conta não encontrada. Crie uma conta primeiro.");
      gravar("ci:usuario", u);
      avisar(u);
    },
    async cadastrar(nome, email) {
      const u: Usuario = { id: idDe(email), email: email.trim().toLowerCase(), nome: nome.trim() };
      const contas = ler<Record<string, Usuario>>("ci:contas", {});
      contas[u.id] = u;
      gravar("ci:contas", contas);
      gravar(`ci:perfil:${u.id}`, perfilPadrao(u.nome));
      gravar("ci:usuario", u);
      avisar(u);
      return { precisaConfirmarEmail: false };
    },
    async sair() {
      try {
        localStorage.removeItem("ci:usuario");
      } catch {}
      avisar(null);
    },
    async tokenDeAcesso() {
      return null;
    },
    async carregarPerfil(u) {
      return ler<Perfil>(`ci:perfil:${u.id}`, perfilPadrao(u.nome));
    },
    async salvarPerfil(u, p) {
      gravar(`ci:perfil:${u.id}`, p);
    },
    async listarFavoritos(u) {
      return ler<Receita[]>(`ci:favoritos:${u.id}`, []);
    },
    async adicionarFavorito(u, r) {
      const favs = ler<Receita[]>(`ci:favoritos:${u.id}`, []).filter((f) => f.id !== r.id);
      gravar(`ci:favoritos:${u.id}`, [r, ...favs]);
    },
    async removerFavorito(u, id) {
      const favs = ler<Receita[]>(`ci:favoritos:${u.id}`, []).filter((f) => f.id !== id);
      gravar(`ci:favoritos:${u.id}`, favs);
    },
  };
}

// ---------- Supabase: login real e dados salvos na nuvem ----------

function paraUsuario(user: { id: string; email?: string; user_metadata?: Record<string, unknown> }): Usuario {
  const nome = typeof user.user_metadata?.nome === "string" ? user.user_metadata.nome : "";
  return { id: user.id, email: user.email ?? "", nome };
}

function traduzirErro(mensagem: string) {
  if (/invalid login credentials/i.test(mensagem)) return "E-mail ou senha incorretos.";
  if (/email not confirmed/i.test(mensagem)) return "Confirme seu e-mail antes de entrar.";
  if (/already registered/i.test(mensagem)) return "Este e-mail já tem uma conta. Faça login.";
  if (/password should be at least/i.test(mensagem)) return "A senha precisa ter pelo menos 6 caracteres.";
  return mensagem;
}

function criarBackendSupabase(sb: SupabaseClient): Backend {
  return {
    modo: "supabase",
    async usuarioAtual() {
      const { data } = await sb.auth.getSession();
      return data.session ? paraUsuario(data.session.user) : null;
    },
    aoMudarSessao(cb) {
      const { data } = sb.auth.onAuthStateChange((_evento, sessao) => {
        cb(sessao ? paraUsuario(sessao.user) : null);
      });
      return () => data.subscription.unsubscribe();
    },
    async entrar(email, senha) {
      const { error } = await sb.auth.signInWithPassword({ email, password: senha });
      if (error) throw new Error(traduzirErro(error.message));
    },
    async cadastrar(nome, email, senha) {
      const { data, error } = await sb.auth.signUp({
        email,
        password: senha,
        options: { data: { nome } },
      });
      if (error) throw new Error(traduzirErro(error.message));
      return { precisaConfirmarEmail: !data.session };
    },
    async sair() {
      await sb.auth.signOut();
    },
    async tokenDeAcesso() {
      const { data } = await sb.auth.getSession();
      return data.session?.access_token ?? null;
    },
    async carregarPerfil(u) {
      const { data, error } = await sb
        .from("perfis")
        .select("nome, restricoes, economico")
        .eq("id", u.id)
        .maybeSingle();
      if (error) throw error;
      return data ?? perfilPadrao(u.nome);
    },
    async salvarPerfil(u, p) {
      const { error } = await sb.from("perfis").upsert({ id: u.id, ...p, atualizado_em: new Date().toISOString() });
      if (error) throw error;
    },
    async listarFavoritos() {
      const { data, error } = await sb
        .from("favoritos")
        .select("receita")
        .order("criado_em", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((l) => l.receita as Receita);
    },
    async adicionarFavorito(u, r) {
      const { error } = await sb
        .from("favoritos")
        .upsert({ usuario_id: u.id, receita_id: r.id, receita: r });
      if (error) throw error;
    },
    async removerFavorito(u, id) {
      const { error } = await sb.from("favoritos").delete().eq("usuario_id", u.id).eq("receita_id", id);
      if (error) throw error;
    },
  };
}

let instancia: Backend | null = null;

export function backend(): Backend {
  if (!instancia) {
    instancia = supabaseConfigurado
      ? criarBackendSupabase(createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY))
      : criarBackendDemo();
  }
  return instancia;
}
