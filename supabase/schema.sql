-- Cozinha Inteligente: estrutura do banco de dados no Supabase.
-- Como usar: no painel do Supabase, abra "SQL Editor", cole este arquivo inteiro e clique em "Run".

-- Perfil de cada usuário (restrições alimentares e preferências)
create table if not exists public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null default '',
  restricoes text[] not null default '{}',
  economico boolean not null default false,
  atualizado_em timestamptz not null default now()
);

-- Receitas favoritas de cada usuário
create table if not exists public.favoritos (
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  receita_id text not null,
  receita jsonb not null,
  criado_em timestamptz not null default now(),
  primary key (usuario_id, receita_id)
);

-- Segurança: cada pessoa só enxerga e altera os próprios dados
alter table public.perfis enable row level security;
alter table public.favoritos enable row level security;

drop policy if exists "perfil próprio" on public.perfis;
create policy "perfil próprio" on public.perfis
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "favoritos próprios" on public.favoritos;
create policy "favoritos próprios" on public.favoritos
  for all using (auth.uid() = usuario_id) with check (auth.uid() = usuario_id);
