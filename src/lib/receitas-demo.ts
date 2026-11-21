import type { PedidoReceitas, Receita } from "./tipos";

// Receitas de exemplo usadas enquanto a chave da IA não está configurada.
// Elas usam os ingredientes informados para que o fluxo do app possa ser testado.

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function receitasDemonstracao(pedido: PedidoReceitas): Receita[] {
  const ing = pedido.ingredientes.map((i) => i.toLowerCase());
  const [a, b = "cebola", c = "alho"] = ing;
  const vegano = pedido.restricoes.some((r) => r.toLowerCase().includes("vegano"));
  const tenho = (nome: string) => ({ nome, quantidade: "a gosto", tenho: true });
  const comprar = (nome: string, quantidade: string) => ({ nome, quantidade, tenho: false });

  const receitas: Omit<Receita, "id">[] = [
    {
      titulo: `Refogado rápido de ${a}`,
      descricao: `Um prato simples e saboroso com ${a}, ${b} e ${c}.`,
      categoria: "outro",
      tempoMinutos: 20,
      porcoes: 2,
      dificuldade: "Fácil",
      custo: "Baixo",
      ingredientes: [tenho(a), tenho(b), tenho(c), tenho("azeite"), tenho("sal")],
      modoPreparo: [
        `Pique ${b} e ${c}.`,
        "Aqueça um fio de azeite na frigideira e refogue até dourar.",
        `Junte ${a} picado e cozinhe por 8 a 10 minutos.`,
        "Acerte o sal e sirva quente.",
      ],
      dica: "Finalize com ervas frescas, se tiver.",
    },
    {
      titulo: `Arroz cremoso com ${a}`,
      descricao: `Arroz de panela única, cremoso e cheio de sabor.`,
      categoria: "arroz",
      tempoMinutos: 35,
      porcoes: 4,
      dificuldade: "Fácil",
      custo: "Baixo",
      ingredientes: [
        comprar("arroz", "2 xícaras"),
        tenho(a),
        tenho(b),
        vegano ? tenho("azeite") : comprar("queijo ralado", "1/2 xícara"),
        tenho("água"),
      ],
      modoPreparo: [
        `Refogue ${b} no azeite.`,
        "Adicione o arroz e mexa por 1 minuto.",
        `Junte ${a} e 4 xícaras de água quente aos poucos, mexendo.`,
        vegano ? "Finalize com um fio de azeite." : "Desligue o fogo e misture o queijo ralado.",
      ],
      dica: "Use caldo de legumes no lugar da água para mais sabor.",
    },
    {
      titulo: `Sopa caseira de ${a}`,
      descricao: "Reconfortante, econômica e ótima para o jantar.",
      categoria: "sopa",
      tempoMinutos: 40,
      porcoes: 4,
      dificuldade: "Fácil",
      custo: "Baixo",
      ingredientes: [tenho(a), tenho(b), tenho(c), comprar("batata", "2 unidades"), tenho("sal")],
      modoPreparo: [
        "Pique todos os ingredientes.",
        `Refogue ${b} e ${c}, depois junte ${a} e as batatas.`,
        "Cubra com água e cozinhe por 25 minutos.",
        "Bata no liquidificador se quiser uma sopa cremosa.",
      ],
      dica: "Congela bem por até 3 meses.",
    },
    {
      titulo: vegano ? `Salada morna de ${a}` : `Omelete de ${a}`,
      descricao: vegano
        ? `Salada leve com ${a} salteado.`
        : `Omelete fofinha recheada com ${a}.`,
      categoria: vegano ? "salada" : "ovos",
      tempoMinutos: 15,
      porcoes: 1,
      dificuldade: "Fácil",
      custo: "Baixo",
      ingredientes: vegano
        ? [tenho(a), comprar("folhas verdes", "1 maço"), tenho("azeite"), tenho("sal")]
        : [comprar("ovos", "3 unidades"), tenho(a), tenho("sal"), tenho("óleo")],
      modoPreparo: vegano
        ? [`Salteie ${a} no azeite por 3 minutos.`, "Misture com as folhas.", "Tempere e sirva."]
        : [
            "Bata os ovos com sal.",
            `Junte ${a} picado.`,
            "Despeje na frigideira untada e doure dos dois lados.",
          ],
      dica: "",
    },
  ];

  return receitas.map((r, i) => ({ ...r, titulo: cap(r.titulo), id: `demo-${Date.now()}-${i}` }));
}
