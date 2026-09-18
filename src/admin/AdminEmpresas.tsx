import { useState } from "react";
import { useCrud } from "./useCrud";
import { Cabecalho, Cartao, Botao, Campo, input, UploadImagem, Vazio } from "./componentes";
import type { EmpresaParceira } from "../lib/supabase";

const vazio = { nome: "", logo_url: "", site_url: "", tamanho_px: 40, linha: 1, ordem: 0, ativo: true };

/** Campo de tamanho com botão de salvar — não grava a cada tecla, então
 *  um valor intermediário digitando (ex: "4" antes de "40") nunca chega
 *  a tocar o banco e nunca esbarra na trava de 20–96px. */
function CampoTamanho({ item, onSalvar }: { item: EmpresaParceira; onSalvar: (px: number) => void }) {
  const [valor, setValor] = useState(String(item.tamanho_px));
  const numero = Number(valor);
  const valido = Number.isFinite(numero) && numero >= 20 && numero <= 96;
  const mudou = numero !== item.tamanho_px;

  return (
    <div className="flex items-center gap-2">
      <label className="text-white/55 text-[13px]">Altura</label>
      <input
        type="number" min={20} max={96} value={valor}
        onChange={(e) => setValor(e.target.value)}
        className="w-16 bg-white/[.06] border border-white/12 rounded-lg px-2 py-1.5 text-[13px] text-white outline-none focus:border-accent"
      />
      <span className="text-white/40 text-[12px]">px</span>
      <Botao tipo="secundario" disabled={!valido || !mudou} onClick={() => valido && onSalvar(numero)}>
        Salvar
      </Botao>
      {!valido && <span className="text-red-400 text-[12px]">20–96</span>}
    </div>
  );
}

export default function AdminEmpresas() {
  const { itens, carregando, erro, criar, atualizar, remover } = useCrud<EmpresaParceira>("empresas_parceiras");
  const [novo, setNovo] = useState<any>(vazio);
  const [abrindo, setAbrindo] = useState(false);

  const salvar = async () => {
    if (!novo.nome || !novo.logo_url) return;
    const daLinha = itens.filter((i) => i.linha === Number(novo.linha));
    const ok = await criar({
      ...novo,
      linha: Number(novo.linha),
      ordem: daLinha.length + 1,
    });
    if (ok) { setNovo(vazio); setAbrindo(false); }
  };

  // troca a ordem só com o vizinho DA MESMA linha
  const mover = async (linha: EmpresaParceira[], i: number, direcao: -1 | 1) => {
    const j = i + direcao;
    if (j < 0 || j >= linha.length) return;
    const a = linha[i], b = linha[j];
    await Promise.all([
      atualizar(a.id, { ordem: b.ordem } as any),
      atualizar(b.id, { ordem: a.ordem } as any),
    ]);
  };

  const porLinha = [1, 2, 3].map((n) =>
    itens.filter((i) => i.linha === n).sort((a, b) => a.ordem - b.ordem)
  );

  return (
    <>
      <Cabecalho
        titulo="Empresas que confiam"
        descricao="Três esteiras na home e em Cases. Escolha em qual linha cada logo entra — é exatamente a linha que ele ocupa no site."
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
              <Campo label="Linha">
                <select className={input} value={novo.linha}
                  onChange={(e) => setNovo({ ...novo, linha: e.target.value })}>
                  <option value={1} className="bg-ink">Linha 1 — corre para a direita</option>
                  <option value={2} className="bg-ink">Linha 2 — corre para a esquerda</option>
                  <option value={3} className="bg-ink">Linha 3 — corre para a direita</option>
                </select>
              </Campo>
              <Campo label="Altura do logo (px)">
                <input className={input} type="number" min={20} max={96} value={novo.tamanho_px}
                  onChange={(e) => setNovo({ ...novo, tamanho_px: e.target.value })} />
              </Campo>
              <div className="md:col-span-2">
                <Campo label="Logotipo">
                  <UploadImagem bucket="logos" valor={novo.logo_url}
                    onChange={(url) => setNovo({ ...novo, logo_url: url })} />
                </Campo>
              </div>
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

      {!carregando && itens.length > 0 && (
        <div className="grid gap-8">
          {porLinha.map((linha, li) => (
            <div key={li}>
              <p className="m-0 mb-3 text-white/45 text-[12.5px] font-medium uppercase tracking-[.06em]">
                Linha {li + 1} — {li === 1 ? "esquerda" : "direita"}
              </p>
              {linha.length === 0 ? (
                <p className="text-white/30 text-[13.5px] m-0">Vazia.</p>
              ) : (
                <div className="grid gap-3">
                  {linha.map((e, i) => (
                    <Cartao key={e.id}>
                      <div className="flex items-center gap-5 flex-wrap">
                        <div className="flex flex-col gap-1">
                          <button onClick={() => mover(linha, i, -1)} disabled={i === 0}
                            className="w-6 h-6 rounded bg-white/[.06] text-white/60 text-[12px] disabled:opacity-25 hover:bg-white/10">▲</button>
                          <button onClick={() => mover(linha, i, 1)} disabled={i === linha.length - 1}
                            className="w-6 h-6 rounded bg-white/[.06] text-white/60 text-[12px] disabled:opacity-25 hover:bg-white/10">▼</button>
                        </div>

                        <div className="w-28 h-14 bg-white rounded-lg grid place-items-center shrink-0 p-2">
                          <img src={e.logo_url} alt={e.nome} style={{ height: Math.min(e.tamanho_px, 40) }} className="max-w-full object-contain" />
                        </div>

                        <div className="flex-1 min-w-[140px]">
                          <p className="m-0 text-white text-[15.5px] font-medium">{e.nome}</p>
                        </div>

                        <CampoTamanho item={e} onSalvar={(px) => atualizar(e.id, { tamanho_px: px } as any)} />

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
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
