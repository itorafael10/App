import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { RespostaReceitasSchema, type PedidoReceitas, type Receita } from "./tipos";
import { receitasDemonstracao } from "./receitas-demo";

const MODELO = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";

const INSTRUCOES = `Você é o chef do app "Cozinha Inteligente", que ajuda pessoas no Brasil a cozinhar com o que têm em casa.

Regras:
- Sugira exatamente 4 receitas variadas (pratos diferentes entre si), escritas em português do Brasil.
- Use principalmente os ingredientes que a pessoa informou. Considere que ela também tem itens básicos de despensa: sal, óleo, azeite, água, açúcar, pimenta-do-reino e farinha de trigo.
- Prefira receitas que precisem de poucos ingredientes extras. Marque "tenho": true nos ingredientes que ela informou e nos itens básicos de despensa; marque false no que ela precisaria comprar.
- Respeite TODAS as restrições alimentares informadas, sem exceção. Se uma restrição impedir usar um ingrediente informado, simplesmente não use esse ingrediente.
- Use medidas caseiras brasileiras (xícara, colher de sopa, unidade, gramas).
- Modo de preparo claro, em passos curtos, que um iniciante consiga seguir.
- Seja realista no tempo de preparo, no número de porções e no custo.`;

export class IaIndisponivelError extends Error {}

export function iaConfigurada() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export async function gerarReceitas(pedido: PedidoReceitas): Promise<Receita[]> {
  if (!iaConfigurada()) {
    return receitasDemonstracao(pedido);
  }

  const client = new Anthropic();

  const linhas = [
    `Ingredientes que tenho: ${pedido.ingredientes.join(", ")}.`,
    pedido.restricoes.length
      ? `Restrições alimentares: ${pedido.restricoes.join(", ")}.`
      : "Não tenho restrições alimentares.",
    pedido.economico
      ? "Quero receitas econômicas: evite ingredientes caros e minimize o que eu precisaria comprar."
      : "",
  ].filter(Boolean);

  const resposta = await client.beta.messages.parse({
    model: MODELO,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: {
      effort: "low",
      format: betaZodOutputFormat(RespostaReceitasSchema),
    },
    system: INSTRUCOES,
    messages: [{ role: "user", content: linhas.join("\n") }],
  });

  if (resposta.stop_reason === "refusal") {
    throw new IaIndisponivelError("A IA não conseguiu sugerir receitas para esse pedido.");
  }
  if (resposta.stop_reason === "max_tokens" || !resposta.parsed_output) {
    throw new IaIndisponivelError("A resposta da IA veio incompleta. Tente novamente.");
  }

  return resposta.parsed_output.receitas.map((r) => ({ ...r, id: crypto.randomUUID() }));
}
