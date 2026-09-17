import { useState } from "react";
import { useCrud } from "./useCrud";
import { Cabecalho, Cartao, Botao, Campo, input, Vazio } from "./componentes";
import { CATEGORIAS_CASE } from "../content/categorias";
import type { CaseItem } from "../lib/supabase";

const vazio = { setor: "", categoria: CATEGORIAS_CASE[0], desafio: "", solucao: "", resultado: "", destaque: false, ordem: 0, ativo: true };

export default function AdminCases() {
  const { itens, carregando, erro, criar, atualizar, remover } = useCrud<CaseItem>("cases");
  const [novo, setNovo] = useState<any>(vazio);
  const [abrindo, setAbrindo] = useState(false);

  const salvar = async () => {
    if (!novo.setor || !novo.desafio) return;
    const ok = await criar({ ...novo, ordem: Number(novo.ordem) || itens.length + 1 });
    if (ok) { setNovo(vazio); setAbrindo(false); }
  };

  return (
    <>
      <Cabecalho
        titulo="Cases"
        descricao="Nunca use nome de cliente — só o setor. Marque como destaque os que devem aparecer na home."
        acao={<Botao onClick={() => setAbrindo(!abrindo)}>{abrindo ? "Cancelar" : "Adicionar case"}</Botao>}
      />

      {abrindo && (
        <div className="mb-6">
          <Cartao>
            <div className="grid gap-4">
              <Campo label="Setor">
                <input className={input} value={novo.setor}
                  onChange={(e) => setNovo({ ...novo, setor: e.target.value })}
                  placeholder="Ex: Distribuição industrial — abrasivos B2B" />
              </Campo>
              <Campo label="Categoria">
                <select className={input} value={novo.categoria}
                  onChange={(e) => setNovo({ ...novo, categoria: e.target.value })}>
                  {CATEGORIAS_CASE.map((c) => (
                    <option key={c} value={c} className="bg-ink">{c}</option>
                  ))}
                </select>
              </Campo>
              <Campo label="Desafio">
                <textarea className={input} rows={2} value={novo.desafio}
                  onChange={(e) => setNovo({ ...novo, desafio: e.target.value })}
                  placeholder="Qual era o problema" />
              </Campo>
              <Campo label="O que foi feito">
                <textarea className={input} rows={2} value={novo.solucao}
                  onChange={(e) => setNovo({ ...novo, solucao: e.target.value })} />
              </Campo>
              <Campo label="Resultado">
                <textarea className={input} rows={2} value={novo.resultado}
                  onChange={(e) => setNovo({ ...novo, resultado: e.target.value })} />
              </Campo>
              <div className="flex items-center gap-6 flex-wrap">
                <label className="flex items-center gap-2 text-white/65 text-[14px]">
                  <input type="checkbox" checked={novo.destaque}
                    onChange={(e) => setNovo({ ...novo, destaque: e.target.checked })} />
                  Mostrar na home
                </label>
                <Campo label="Ordem">
                  <input className={input + " w-24"} type="number" value={novo.ordem}
                    onChange={(e) => setNovo({ ...novo, ordem: e.target.value })} />
                </Campo>
              </div>
            </div>
            <div className="mt-5">
              <Botao onClick={salvar} disabled={!novo.setor || !novo.desafio}>Salvar</Botao>
            </div>
          </Cartao>
        </div>
      )}

      {erro && <p className="text-red-400 text-[14px]">{erro}</p>}
      {carregando && <p className="text-white/45 text-[14px]">Carregando…</p>}
      {!carregando && itens.length === 0 && <Vazio texto="Nenhum case cadastrado ainda." />}

      <div className="grid gap-3">
        {itens.map((c) => (
          <Cartao key={c.id}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[240px]">
                <p className="m-0 text-accent text-[13px] font-medium">{c.setor}</p>
                {c.categoria && (
                  <p className="mt-1 mb-0 text-white/35 text-[11.5px]">{c.categoria}</p>
                )}
                <p className="mt-2 mb-0 text-white text-[15px] leading-[1.5]">{c.desafio}</p>
                <p className="mt-2 mb-0 text-white/50 text-[13.5px] leading-[1.55] font-light">{c.resultado}</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <label className="flex items-center gap-2 text-white/60 text-[13.5px]">
                  <input type="checkbox" checked={c.destaque}
                    onChange={() => atualizar(c.id, { destaque: !c.destaque } as any)} />
                  Home
                </label>
                <label className="flex items-center gap-2 text-white/60 text-[13.5px]">
                  <input type="checkbox" checked={c.ativo}
                    onChange={() => atualizar(c.id, { ativo: !c.ativo } as any)} />
                  Visível
                </label>
                <Botao tipo="perigo" onClick={() => confirm("Remover este case?") && remover(c.id)}>Remover</Botao>
              </div>
            </div>
          </Cartao>
        ))}
      </div>
    </>
  );
}
