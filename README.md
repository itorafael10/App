# Cozinha Inteligente 🍲

App que transforma os ingredientes que você tem em casa em receitas personalizadas, usando inteligência artificial.

Funciona no navegador do celular e do computador, e pode ser instalado na tela inicial como um app.

**Acesse:** https://cozinha-inteligente-iota.vercel.app

## O que já funciona (fase 1)

- Cadastro, login e saída da conta
- Busca por ingredientes: digitando, tocando nos populares ou falando (microfone)
- Receitas geradas por IA, respeitando as restrições alimentares
- Modo "receitas econômicas"
- Filtros na lista: até 30 min, fáceis, econômicas, sem compras
- Detalhe da receita: ingredientes que você tem e o que falta comprar, e passos que dá para marcar como feitos
- Favoritos e perfil com restrições alimentares

## Próximas fases

2. Cardápio semanal e lista de compras automática
3. Assinatura paga (Stripe) e bloqueio para quem não assina
4. Publicação online (Vercel) e instalação no celular

## Modo demonstração

Sem as chaves configuradas, o app roda em **modo demonstração**:

- As receitas são exemplos prontos, montados com os ingredientes informados.
- A conta e os favoritos ficam salvos só no navegador, e a senha não é verificada.

## Como ativar a IA e o login de verdade

1. **Supabase** (login e banco de dados)
   - Crie um projeto em [supabase.com](https://supabase.com).
   - Abra **SQL Editor**, cole o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) e clique em **Run**.
   - Em **Project Settings → API**, copie a *Project URL* e a chave *anon public*.
2. **Anthropic** (inteligência artificial)
   - Crie uma chave em [console.anthropic.com](https://console.anthropic.com) e adicione créditos.
3. Copie `.env.example` para `.env.local` e preencha os valores.

## Rodar no computador

```bash
npm install
npm run dev
```

Depois abra http://localhost:3000.

## Tecnologia

Next.js 16 (App Router), React 19, Tailwind CSS 4, Supabase (auth e Postgres com RLS) e a API do Claude com saída estruturada.
