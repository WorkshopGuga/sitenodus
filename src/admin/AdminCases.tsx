import { useState } from "react";
import { useCrud } from "./useCrud";
import { Cabecalho, Cartao, Botao, Campo, input, Vazio } from "./componentes";
import { CATEGORIAS_CASE } from "../content/categorias";
import type { CaseItem } from "../lib/supabase";

const vazio = { setor: "", categoria: CATEGORIAS_CASE[0], desafio: "", solucao: "", resultado: "", destaque: false, ordem: 0, ativo: true };

function FormularioCase({
  valor, onMudar, onSalvar, onCancelar, salvando,
}: { valor: any; onMudar: (v: any) => void; onSalvar: () => void; onCancelar?: () => void; salvando?: boolean }) {
  return (
    <Cartao>
      <div className="grid gap-4">
        <Campo label="Setor">
          <input className={input} value={valor.setor}
            onChange={(e) => onMudar({ ...valor, setor: e.target.value })}
            placeholder="Ex: Distribuição industrial — abrasivos B2B" />
        </Campo>
        <Campo label="Categoria">
          <select className={input} value={valor.categoria}
            onChange={(e) => onMudar({ ...valor, categoria: e.target.value })}>
            {CATEGORIAS_CASE.map((c) => (
              <option key={c} value={c} className="bg-ink">{c}</option>
            ))}
          </select>
        </Campo>
        <Campo label="Desafio">
          <textarea className={input} rows={2} value={valor.desafio}
            onChange={(e) => onMudar({ ...valor, desafio: e.target.value })}
            placeholder="Qual era o problema" />
        </Campo>
        <Campo label="O que foi feito">
          <textarea className={input} rows={2} value={valor.solucao}
            onChange={(e) => onMudar({ ...valor, solucao: e.target.value })} />
        </Campo>
        <Campo label="Resultado">
          <textarea className={input} rows={2} value={valor.resultado}
            onChange={(e) => onMudar({ ...valor, resultado: e.target.value })} />
        </Campo>
        <div className="flex items-center gap-6 flex-wrap">
          <label className="flex items-center gap-2 text-white/65 text-[14px]">
            <input type="checkbox" checked={valor.destaque}
              onChange={(e) => onMudar({ ...valor, destaque: e.target.checked })} />
            Mostrar na home
          </label>
          <Campo label="Ordem">
            <input className={input + " w-24"} type="number" value={valor.ordem}
              onChange={(e) => onMudar({ ...valor, ordem: e.target.value })} />
          </Campo>
        </div>
      </div>
      <div className="mt-5 flex gap-3">
        <Botao onClick={onSalvar} disabled={!valor.setor || !valor.desafio || salvando}>
          {salvando ? "Salvando…" : "Salvar"}
        </Botao>
        {onCancelar && <Botao tipo="secundario" onClick={onCancelar}>Cancelar</Botao>}
      </div>
    </Cartao>
  );
}

export default function AdminCases() {
  const { itens, carregando, erro, criar, atualizar, remover } = useCrud<CaseItem>("cases");
  const [novo, setNovo] = useState<any>(vazio);
  const [abrindo, setAbrindo] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState<any>(null);

  const salvar = async () => {
    if (!novo.setor || !novo.desafio) return;
    const ok = await criar({ ...novo, ordem: Number(novo.ordem) || itens.length + 1 });
    if (ok) { setNovo(vazio); setAbrindo(false); }
  };

  const iniciarEdicao = (c: CaseItem) => { setEditandoId(c.id); setRascunho({ ...c }); };

  const salvarEdicao = async () => {
    if (!editandoId || !rascunho) return;
    const { id, ...campos } = rascunho;
    const ok = await atualizar(editandoId, { ...campos, ordem: Number(campos.ordem) });
    if (ok) { setEditandoId(null); setRascunho(null); }
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
          <FormularioCase valor={novo} onMudar={setNovo} onSalvar={salvar} />
        </div>
      )}

      {erro && <p className="text-red-400 text-[14px]">{erro}</p>}
      {carregando && <p className="text-white/45 text-[14px]">Carregando…</p>}
      {!carregando && itens.length === 0 && <Vazio texto="Nenhum case cadastrado ainda." />}

      <div className="grid gap-3">
        {itens.map((c) =>
          editandoId === c.id ? (
            <FormularioCase
              key={c.id}
              valor={rascunho}
              onMudar={setRascunho}
              onSalvar={salvarEdicao}
              onCancelar={() => { setEditandoId(null); setRascunho(null); }}
            />
          ) : (
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
                  <Botao tipo="secundario" onClick={() => iniciarEdicao(c)}>Editar</Botao>
                  <Botao tipo="perigo" onClick={() => confirm("Remover este case?") && remover(c.id)}>Remover</Botao>
                </div>
              </div>
            </Cartao>
          )
        )}
      </div>
    </>
  );
}
