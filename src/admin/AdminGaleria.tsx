import { useState } from "react";
import { useCrud } from "./useCrud";
import { Cabecalho, Cartao, Botao, Campo, input, UploadImagem, Vazio } from "./componentes";
import type { GaleriaImagem } from "../lib/supabase";

const vazio = { titulo: "", imagem_url: "", alt: "", categoria: "treinamento", ordem: 0, ativo: true };

function FormularioGaleria({
  valor, onMudar, onSalvar, onCancelar, salvando,
}: { valor: any; onMudar: (v: any) => void; onSalvar: () => void; onCancelar?: () => void; salvando?: boolean }) {
  return (
    <Cartao>
      <div className="grid gap-4 md:grid-cols-2">
        <Campo label="Título (opcional)">
          <input className={input} value={valor.titulo}
            onChange={(e) => onMudar({ ...valor, titulo: e.target.value })} />
        </Campo>
        <Campo label="Categoria">
          <select className={input} value={valor.categoria}
            onChange={(e) => onMudar({ ...valor, categoria: e.target.value })}>
            <option value="treinamento" className="bg-ink">Treinamento</option>
            <option value="evento" className="bg-ink">Evento</option>
            <option value="equipe" className="bg-ink">Equipe</option>
            <option value="bastidor" className="bg-ink">Bastidor</option>
          </select>
        </Campo>
        <div className="md:col-span-2">
          <Campo label="Descrição da imagem">
            <input className={input} value={valor.alt}
              onChange={(e) => onMudar({ ...valor, alt: e.target.value })}
              placeholder="Ex: Turma do treinamento presencial em Caxias do Sul" />
          </Campo>
        </div>
        <Campo label="Imagem">
          <UploadImagem bucket="galeria" valor={valor.imagem_url}
            onChange={(url) => onMudar({ ...valor, imagem_url: url })}
            maxLargura={1600} maxAltura={1200} />
        </Campo>
      </div>
      <div className="mt-5 flex gap-3">
        <Botao onClick={onSalvar} disabled={!valor.imagem_url || salvando}>
          {salvando ? "Salvando…" : "Salvar"}
        </Botao>
        {onCancelar && <Botao tipo="secundario" onClick={onCancelar}>Cancelar</Botao>}
      </div>
    </Cartao>
  );
}

export default function AdminGaleria() {
  const { itens, carregando, erro, criar, atualizar, remover } = useCrud<GaleriaImagem>("galeria_imagens");
  const [novo, setNovo] = useState<any>(vazio);
  const [abrindo, setAbrindo] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState<any>(null);

  const salvar = async () => {
    if (!novo.imagem_url) return;
    const ok = await criar({ ...novo, ordem: Number(novo.ordem) || itens.length + 1 });
    if (ok) { setNovo(vazio); setAbrindo(false); }
  };

  const iniciarEdicao = (g: GaleriaImagem) => { setEditandoId(g.id); setRascunho({ ...g }); };

  const salvarEdicao = async () => {
    if (!editandoId || !rascunho) return;
    const { id, ...campos } = rascunho;
    const ok = await atualizar(editandoId, campos);
    if (ok) { setEditandoId(null); setRascunho(null); }
  };

  return (
    <>
      <Cabecalho
        titulo="Galeria"
        descricao="Fotos de treinamentos, eventos e bastidores. Aparecem na página de Capacitação. Preencha a descrição — ela é lida por quem usa leitor de tela e conta para o Google."
        acao={<Botao onClick={() => setAbrindo(!abrindo)}>{abrindo ? "Cancelar" : "Adicionar imagem"}</Botao>}
      />

      {abrindo && (
        <div className="mb-6">
          <FormularioGaleria valor={novo} onMudar={setNovo} onSalvar={salvar} />
        </div>
      )}

      {erro && <p className="text-red-400 text-[14px]">{erro}</p>}
      {carregando && <p className="text-white/45 text-[14px]">Carregando…</p>}
      {!carregando && itens.length === 0 && <Vazio texto="Nenhuma imagem na galeria ainda." />}

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
        {itens.map((g) =>
          editandoId === g.id ? (
            <div key={g.id} className="col-span-full max-w-xl">
              <FormularioGaleria
                valor={rascunho}
                onMudar={setRascunho}
                onSalvar={salvarEdicao}
                onCancelar={() => { setEditandoId(null); setRascunho(null); }}
              />
            </div>
          ) : (
            <div key={g.id} className="bg-white/[.03] border border-white/[.08] rounded-xl overflow-hidden">
              <img src={g.imagem_url} alt={g.alt ?? ""} className="w-full aspect-[4/3] object-cover" />
              <div className="p-4">
                <p className="m-0 text-white text-[14px] font-medium">{g.titulo || "Sem título"}</p>
                <p className="mt-0.5 mb-3 text-white/40 text-[12.5px]">{g.categoria}</p>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <label className="flex items-center gap-2 text-white/55 text-[13px]">
                    <input type="checkbox" checked={g.ativo}
                      onChange={() => atualizar(g.id, { ativo: !g.ativo } as any)} />
                    Visível
                  </label>
                  <div className="flex gap-2">
                    <Botao tipo="secundario" onClick={() => iniciarEdicao(g)}>Editar</Botao>
                    <Botao tipo="perigo" onClick={() => confirm("Remover esta imagem?") && remover(g.id)}>Remover</Botao>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
