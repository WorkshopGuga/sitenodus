import { useEffect, useState } from "react";
import { supabase } from "./supabase";

/** Busca uma tabela pública. Se falhar ou vier vazia, usa o fallback,
 *  para o site nunca aparecer quebrado enquanto o painel não foi alimentado. */
export function useTabela<T>(
  tabela: string,
  fallback: T[] = [],
  opts: { ordem?: string; filtro?: (q: any) => any } = {}
) {
  const [dados, setDados] = useState<T[]>(fallback);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        let q: any = supabase.from(tabela).select("*");
        if (opts.filtro) q = opts.filtro(q);
        q = q.order(opts.ordem ?? "ordem", { ascending: true });
        const { data, error } = await q;
        if (!vivo) return;
        if (error) throw error;
        if (data && data.length) setDados(data as T[]);
      } catch (e) {
        console.warn(`[${tabela}] usando conteúdo local:`, e);
      } finally {
        if (vivo) setCarregando(false);
      }
    })();
    return () => { vivo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabela]);

  return { dados, carregando };
}
