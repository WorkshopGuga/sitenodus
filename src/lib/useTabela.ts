import { useEffect, useState } from "react";
import { supabase } from "./supabase";

/**
 * Busca uma tabela pública. Se falhar, usa o fallback, para o site nunca
 * aparecer quebrado enquanto o painel não foi alimentado.
 *
 * `chave` identifica a CONSULTA, não a tabela. É obrigatória sempre que a
 * mesma tabela é consultada com filtros diferentes na mesma tela ou em
 * rotas que compartilham componente (ex: as páginas de frente, que usam
 * o mesmo <Frente /> e a mesma tabela `depoimentos` com filtros distintos).
 * Sem ela, o React reaproveita o componente, o efeito não re-executa e o
 * resultado da primeira rota fica grudado nas demais.
 */
export function useTabela<T>(
  tabela: string,
  fallback: T[] = [],
  opts: { ordem?: string; filtro?: (q: any) => any; chave?: string } = {}
) {
  const [dados, setDados] = useState<T[]>(fallback);
  const [carregando, setCarregando] = useState(true);

  const chave = opts.chave ?? "";

  useEffect(() => {
    let vivo = true;
    setCarregando(true);
    (async () => {
      try {
        let q: any = supabase.from(tabela).select("*");
        if (opts.filtro) q = opts.filtro(q);
        q = q.order(opts.ordem ?? "ordem", { ascending: true });
        const { data, error } = await q;
        if (!vivo) return;
        if (error) throw error;
        // Resultado vazio precisa esvaziar de verdade — senão sobra o
        // conteúdo da consulta anterior na tela.
        setDados(data && data.length ? (data as T[]) : fallback);
      } catch (e) {
        if (vivo) setDados(fallback);
        console.warn(`[${tabela}] usando conteúdo local:`, e);
      } finally {
        if (vivo) setCarregando(false);
      }
    })();
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabela, chave]);

  return { dados, carregando };
}
