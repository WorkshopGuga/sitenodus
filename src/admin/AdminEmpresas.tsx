import { useState } from "react";
import { useCrud } from "./useCrud";
import { Cabecalho, Cartao, Botao, Campo, input, UploadImagem, Vazio } from "./componentes";
import type { EmpresaParceira } from "../lib/supabase";

const vazio = { nome: "", logo_url: "", site_url: "", ordem: 0, ativo: true };

export default function AdminEmpresas() {
  const { itens, carregando, erro, criar, atualizar, remover } = useCrud<EmpresaParceira>("empresas_parceiras");
  const [novo, setNovo] = useState<any>(vazio);
  const [abrindo, setAbrindo] = useState(false);

  const salvar = async () => {
    if (!novo.nome || !novo.logo_url) return;
    const ok = await criar({ ...novo, ordem: Number(novo.ordem) || itens.length + 1 });
    if (ok) { setNovo(vazio); setAbrindo(false); }
  };

  return (
    <>
      <Cabecalho
        titulo="Empresas que confiam"
        descricao="Logotipos exibidos na home. Use PNG com fundo transparente — o site aplica escala de cinza e devolve a cor no hover."
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
              <Campo label="Ordem">
                <input className={input} type="number" value={novo.ordem}
                  onChange={(e) => setNovo({ ...novo, ordem: e.target.value })} />
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
        {itens.map((e) => (
          <Cartao key={e.id}>
            <div className="flex items-center gap-5 flex-wrap">
              <div className="w-28 h-14 bg-white rounded-lg grid place-items-center shrink-0 p-2">
                <img src={e.logo_url} alt={e.nome} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="flex-1 min-w-[140px]">
                <p className="m-0 text-white text-[15.5px] font-medium">{e.nome}</p>
                <p className="mt-1 mb-0 text-white/40 text-[13px]">Ordem {e.ordem}</p>
              </div>
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
