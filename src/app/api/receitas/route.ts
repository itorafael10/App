import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { gerarReceitas, IaIndisponivelError } from "@/lib/ia";
import { PedidoReceitasSchema } from "@/lib/tipos";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurado } from "@/lib/supabase-config";

async function usuarioAutenticado(request: Request) {
  if (!supabaseConfigurado) return true; // modo demonstração
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return false;
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data, error } = await supabase.auth.getUser(token);
  return !error && Boolean(data.user);
}

export async function POST(request: Request) {
  if (!(await usuarioAutenticado(request))) {
    return Response.json({ erro: "Faça login para gerar receitas." }, { status: 401 });
  }

  const corpo = await request.json().catch(() => null);
  const pedido = PedidoReceitasSchema.safeParse(corpo);
  if (!pedido.success) {
    return Response.json({ erro: "Informe pelo menos um ingrediente." }, { status: 400 });
  }

  try {
    const receitas = await gerarReceitas(pedido.data);
    return Response.json({ receitas });
  } catch (erro) {
    if (erro instanceof IaIndisponivelError) {
      return Response.json({ erro: erro.message }, { status: 502 });
    }
    if (erro instanceof Anthropic.RateLimitError) {
      return Response.json(
        { erro: "Muitas pessoas usando agora. Tente de novo em alguns segundos." },
        { status: 429 },
      );
    }
    console.error("Falha ao gerar receitas", erro);
    return Response.json(
      { erro: "Não foi possível gerar receitas agora. Tente novamente." },
      { status: 500 },
    );
  }
}
