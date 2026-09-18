import { useState } from "react";
import { useCrud } from "./useCrud";
import { Cabecalho, Cartao, Botao, Campo, input, UploadImagem, Vazio } from "./componentes";
import type { EmpresaParceira } from "../lib/supabase";

const vazio = { nome: "", logo_url: "", site_url: "", tamanho_px: 40, ordem: 0, ativo: true };

export default function AdminEmpresas() {
  const { itens, carregando, erro, criar, atualizar, remover } = useCrud<EmpresaParceira>("empresas_parceiras");
  const [novo, setNovo] = useState<any>(vazio);
  const [abrindo, setAbrindo] = useState(false);

  const salvar = async () => {
    if (!novo.nome || !novo.logo_url) return;
    const ok = await criar({ ...novo, ordem: Number(novo.ordem) || itens.length + 1 });
    if (ok) { setNovo(vazio); setAbrindo(false); }
  };

  // troca a ordem com o vizinho — reordenar sem drag-and-drop
  const mover = async (i: number, direcao: -1 | 1) => {
    const j = i + direcao;
    if (j < 0 || j >= itens.length) return;
    const a = itens[i], b = itens[j];
    await Promise.all([
      atualizar(a.id, { ordem: b.ordem } as any),
      atualizar(b.id, { ordem: a.ordem } as any),
    ]);
  };

  return (
    <>
      <Cabecalho
        titulo="Empresas que confiam"
        descricao="Logotipos exibidos na home, em cores originais, correndo em três linhas. Use PNG com fundo transparente."
        acao={<Botao onClick={() => setAbrindo(!abrindo)}>{abrindo ? "Cancelar" : "Adicionar empresa"}</Botao>}
      />

      {abrindo && (
        <div className="mb-6">
          <Cartao>
            <div className="grid gap-4 md:grid-cols-2">
              <Campo label="Nome da empresa">
                <input className={input} value={novo.nome}
                  onChange={(e) => setNovo({ ...novo, nome: e.target.value })} placeholder="Ex: Hydrol" />
              </Campo>
              <Campo label="Site (opcional)">
                <input className={input} value={novo.site_url}
                  onChange={(e) => setNovo({ ...novo, site_url: e.target.value })} placeholder="https://" />
              </Campo>
              <Campo label="Altura do logo (px)">
                <input className={input} type="number" min={20} max={96} value={novo.tamanho_px}
                  onChange={(e) => setNovo({ ...novo, tamanho_px: e.target.value })} />
              </Campo>
              <Campo label="Logotipo">
                <UploadImagem bucket="logos" valor={novo.logo_url}
                  onChange={(url) => setNovo({ ...novo, logo_url: url })} />
              </Campo>
            </div>
            <div className="mt-5">
              <Botao onClick={salvar} disabled={!novo.nome || !novo.logo_url}>Salvar</Botao>
            </div>
          </Cartao>
        </div>
      )}

      {erro && <p className="text-red-400 text-[14px]">{erro}</p>}
      {carregando && <p className="text-white/45 text-[14px]">Carregando…</p>}
      {!carregando && itens.length === 0 && <Vazio texto="Nenhuma empresa cadastrada ainda." />}

      <div className="grid gap-3">
        {itens.map((e, i) => (
          <Cartao key={e.id}>
            <div className="flex items-center gap-5 flex-wrap">
              <div className="flex flex-col gap-1">
                <button onClick={() => mover(i, -1)} disabled={i === 0}
                  className="w-6 h-6 rounded bg-white/[.06] text-white/60 text-[12px] disabled:opacity-25 hover:bg-white/10">▲</button>
                <button onClick={() => mover(i, 1)} disabled={i === itens.length - 1}
                  className="w-6 h-6 rounded bg-white/[.06] text-white/60 text-[12px] disabled:opacity-25 hover:bg-white/10">▼</button>
              </div>

              <div className="w-28 h-14 bg-white rounded-lg grid place-items-center shrink-0 p-2">
                <img src={e.logo_url} alt={e.nome} style={{ height: Math.min(e.tamanho_px, 40) }} className="max-w-full object-contain" />
              </div>

              <div className="flex-1 min-w-[140px]">
                <p className="m-0 text-white text-[15.5px] font-medium">{e.nome}</p>
                <p className="mt-1 mb-0 text-white/40 text-[13px]">Ordem {e.ordem}</p>
              </div>

              <label className="flex items-center gap-2 text-white/55 text-[13px]">
                Altura
                <input
                  type="number" min={20} max={96} value={e.tamanho_px}
                  onChange={(ev) => atualizar(e.id, { tamanho_px: Number(ev.target.value) } as any)}
                  className="w-16 bg-white/[.06] border border-white/12 rounded-lg px-2 py-1.5 text-[13px] text-white outline-none focus:border-accent"
                />
                px
              </label>

              <label className="flex items-center gap-2 text-white/60 text-[13.5px]">
                <input type="checkbox" checked={e.ativo}
                  onChange={() => atualizar(e.id, { ativo: !e.ativo } as any)} />
                Visível
              </label>
              <Botao tipo="perigo" onClick={() => confirm(`Remover ${e.nome}?`) && remover(e.id)}>Remover</Botao>
            </div>
          </Cartao>
        ))}
      </div>
    </>
  );
}
