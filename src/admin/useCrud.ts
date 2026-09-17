import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useCrud<T extends { id: string }>(tabela: string, ordem = "ordem") {
  const [itens, setItens] = useState<T[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    const { data, error } = await supabase.from(tabela).select("*").order(ordem, { ascending: true });
    if (error) setErro(error.message);
    else setItens((data ?? []) as T[]);
    setCarregando(false);
  }, [tabela, ordem]);

  useEffect(() => { carregar(); }, [carregar]);

  const criar = async (registro: Partial<T>) => {
    const { error } = await supabase.from(tabela).insert(registro as any);
    if (error) { setErro(error.message); return false; }
    await carregar(); return true;
  };

  const atualizar = async (id: string, mudancas: Partial<T>) => {
    const { error } = await supabase.from(tabela).update(mudancas as any).eq("id", id);
    if (error) { setErro(error.message); return false; }
    await carregar(); return true;
  };

  const remover = async (id: string) => {
    const { error } = await supabase.from(tabela).delete().eq("id", id);
    if (error) { setErro(error.message); return false; }
    await carregar(); return true;
  };

  return { itens, carregando, erro, carregar, criar, atualizar, remover };
}
