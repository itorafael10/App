import * as z from "zod/v4";

export const CATEGORIAS = [
  "salada",
  "massa",
  "carne",
  "frango",
  "peixe",
  "sopa",
  "vegetariano",
  "arroz",
  "ovos",
  "lanche",
  "sobremesa",
  "outro",
] as const;

export const IngredienteSchema = z.object({
  nome: z.string().describe("Nome do ingrediente, ex.: 'tomate'"),
  quantidade: z.string().describe("Quantidade em medida caseira, ex.: '2 unidades', '1 xícara'"),
  tenho: z
    .boolean()
    .describe("true se o usuário informou que tem este ingrediente ou se é item básico de despensa"),
});

export const ReceitaGeradaSchema = z.object({
  titulo: z.string(),
  descricao: z.string().describe("Uma frase curta e apetitosa"),
  categoria: z.enum(CATEGORIAS),
  tempoMinutos: z.number().int(),
  porcoes: z.number().int(),
  dificuldade: z.enum(["Fácil", "Média", "Difícil"]),
  custo: z.enum(["Baixo", "Médio", "Alto"]),
  ingredientes: z.array(IngredienteSchema),
  modoPreparo: z.array(z.string()).describe("Passos em ordem, um por item"),
  dica: z.string().describe("Uma dica prática ou variação. Pode ser vazia."),
});

export const RespostaReceitasSchema = z.object({
  receitas: z.array(ReceitaGeradaSchema),
});

export type ReceitaGerada = z.infer<typeof ReceitaGeradaSchema>;
export type Receita = ReceitaGerada & { id: string };
export type Categoria = (typeof CATEGORIAS)[number];

export const PedidoReceitasSchema = z.object({
  ingredientes: z.array(z.string().trim().min(1).max(60)).min(1).max(30),
  restricoes: z.array(z.string().trim().max(60)).max(20).default([]),
  economico: z.boolean().default(false),
});

export type PedidoReceitas = z.infer<typeof PedidoReceitasSchema>;

export type Usuario = { id: string; email: string; nome: string };

export type Perfil = {
  nome: string;
  restricoes: string[];
  economico: boolean;
};

export const RESTRICOES = [
  "Vegetariano",
  "Vegano",
  "Sem glúten",
  "Sem lactose",
  "Low carb",
  "Sem açúcar",
  "Sem frutos do mar",
  "Sem amendoim",
];

export const INGREDIENTES_POPULARES = [
  "Tomate",
  "Cebola",
  "Alho",
  "Arroz",
  "Feijão",
  "Ovo",
  "Frango",
  "Carne moída",
  "Batata",
  "Queijo",
  "Macarrão",
  "Cenoura",
  "Leite",
  "Pimentão",
  "Cogumelos",
  "Espinafre",
];
