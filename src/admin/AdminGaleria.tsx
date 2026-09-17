import { useState } from "react";
import { useCrud } from "./useCrud";
import { Cabecalho, Cartao, Botao, Campo, input, UploadImagem, Vazio } from "./componentes";
import type { GaleriaImagem } from "../lib/supabase";

const vazio = { titulo: "", imagem_url: "", alt: "", categoria: "treinamento", ordem: 0, ativo: true };

export default function AdminGaleria() {
  const { itens, carregando, erro, criar, atualizar, remover } = useCrud<GaleriaImagem>("galeria_imagens");
  const [novo, setNovo] = useState<any>(vazio);
  const [abrindo, setAbrindo] = useState(false);

  const salvar = async () => {
    if (!novo.imagem_url) return;
    const ok = await criar({ ...novo, ordem: Number(novo.ordem) || itens.length + 1 });
    if (ok) { setNovo(vazio); setAbrindo(false); }
  };

  return (
    <>
      <Cabecalho
        titulo="Galeria"
        descricao="Fotos de treinamentos, eventos e bastidores. Preencha a descrição — ela é lida por quem usa leitor de tela e conta para o Google."
        acao={<Botao onClick={() => setAbrindo(!abrindo)}>{abrindo ? "Cancelar" : "Adicionar imagem"}</Botao>}
      />

      {abrindo && (
        <div className="mb-6">
          <Cartao>
            <div className="grid gap-4 md:grid-cols-2">
              <Campo label="Título (opcional)">
                <input className={input} value={novo.titulo}
                  onChange={(e) => setNovo({ ...novo, titulo: e.target.value })} />
              </Campo>
              <Campo label="Categoria">
                <select className={input} value={novo.categoria}
                  onChange={(e) => setNovo({ ...novo, categoria: e.target.value })}>
                  <option value="treinamento" className="bg-ink">Treinamento</option>
                  <option value="evento" className="bg-ink">Evento</option>
                  <option value="equipe" className="bg-ink">Equipe</option>
                  <option value="bastidor" className="bg-ink">Bastidor</option>
                </select>
              </Campo>
              <div className="md:col-span-2">
                <Campo label="Descrição da imagem">
                  <input className={input} value={novo.alt}
                    onChange={(e) => setNovo({ ...novo, alt: e.target.value })}
                    placeholder="Ex: Turma do treinamento presencial em Caxias do Sul" />
                </Campo>
              </div>
              <Campo label="Imagem">
                <UploadImagem bucket="galeria" valor={novo.imagem_url}
                  onChange={(url) => setNovo({ ...novo, imagem_url: url })} />
              </Campo>
            </div>
            <div className="mt-5">
              <Botao onClick={salvar} disabled={!novo.imagem_url}>Salvar</Botao>
            </div>
          </Cartao>
        </div>
      )}

      {erro && <p className="text-red-400 text-[14px]">{erro}</p>}
      {carregando && <p className="text-white/45 text-[14px]">Carregando…</p>}
      {!carregando && itens.length === 0 && <Vazio texto="Nenhuma imagem na galeria ainda." />}

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {itens.map((g) => (
          <div key={g.id} className="bg-white/[.03] border border-white/[.08] rounded-xl overflow-hidden">
            <img src={g.imagem_url} alt={g.alt ?? ""} className="w-full aspect-[4/3] object-cover" />
            <div className="p-4">
              <p className="m-0 text-white text-[14px] font-medium">{g.titulo || "Sem título"}</p>
              <p className="mt-0.5 mb-3 text-white/40 text-[12.5px]">{g.categoria}</p>
              <div className="flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-white/55 text-[13px]">
                  <input type="checkbox" checked={g.ativo}
                    onChange={() => atualizar(g.id, { ativo: !g.ativo } as any)} />
                  Visível
                </label>
                <Botao tipo="perigo" onClick={() => confirm("Remover esta imagem?") && remover(g.id)}>Remover</Botao>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
