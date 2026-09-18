import { useState } from "react";
import { useCrud } from "./useCrud";
import { Cabecalho, Cartao, Botao, Campo, input, UploadImagem, Vazio } from "./componentes";
import type { Depoimento } from "../lib/supabase";

const vazio = { autor: "", cargo: "", texto: "", foto_url: "", origem: "cliente", ordem: 0, ativo: true };

export default function AdminDepoimentos() {
  const { itens, carregando, erro, criar, atualizar, remover } = useCrud<Depoimento>("depoimentos");
  const [novo, setNovo] = useState<any>(vazio);
  const [abrindo, setAbrindo] = useState(false);

  const salvar = async () => {
    if (!novo.autor || !novo.texto) return;
    const ok = await criar({ ...novo, ordem: Number(novo.ordem) || itens.length + 1 });
    if (ok) { setNovo(vazio); setAbrindo(false); }
  };

  return (
    <>
      <Cabecalho
        titulo="Depoimentos"
        descricao="Nome, profissão, texto e foto de perfil. A foto aparece redonda no site — se não houver, entra a inicial do nome."
        acao={<Botao onClick={() => setAbrindo(!abrindo)}>{abrindo ? "Cancelar" : "Adicionar depoimento"}</Botao>}
      />

      {abrindo && (
        <div className="mb-6">
          <Cartao>
            <div className="grid gap-4 md:grid-cols-2">
              <Campo label="Nome">
                <input className={input} value={novo.autor}
                  onChange={(e) => setNovo({ ...novo, autor: e.target.value })} placeholder="Ex: Matheus Silva" />
              </Campo>
              <Campo label="Profissão">
                <input className={input} value={novo.cargo}
                  onChange={(e) => setNovo({ ...novo, cargo: e.target.value })}
                  placeholder="Ex: Representante Comercial — Indústria" />
              </Campo>
              <div className="md:col-span-2">
                <Campo label="Depoimento">
                  <textarea className={input} rows={3} value={novo.texto}
                    onChange={(e) => setNovo({ ...novo, texto: e.target.value })}
                    placeholder="O que a pessoa disse" />
                </Campo>
              </div>
              <Campo label="Origem">
                <select className={input} value={novo.origem}
                  onChange={(e) => setNovo({ ...novo, origem: e.target.value })}>
                  <option value="cliente" className="bg-ink">Cliente</option>
                  <option value="treinamento" className="bg-ink">Treinamento</option>
                  <option value="mentoria" className="bg-ink">Mentoria</option>
                </select>
              </Campo>
              <Campo label="Foto de perfil">
                <UploadImagem bucket="depoimentos" valor={novo.foto_url} formato="circulo"
                  onChange={(url) => setNovo({ ...novo, foto_url: url })}
                  maxLargura={480} maxAltura={480} />
              </Campo>
            </div>
            <div className="mt-5">
              <Botao onClick={salvar} disabled={!novo.autor || !novo.texto}>Salvar</Botao>
            </div>
          </Cartao>
        </div>
      )}

      {erro && <p className="text-red-400 text-[14px]">{erro}</p>}
      {carregando && <p className="text-white/45 text-[14px]">Carregando…</p>}
      {!carregando && itens.length === 0 && <Vazio texto="Nenhum depoimento cadastrado ainda." />}

      <div className="grid gap-3">
        {itens.map((d) => (
          <Cartao key={d.id}>
            <div className="flex items-start gap-4 flex-wrap">
              {d.foto_url
                ? <img src={d.foto_url} alt={d.autor} className="w-12 h-12 rounded-full object-cover shrink-0" />
                : <span className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-deep grid place-items-center text-white font-medium shrink-0">
                    {d.autor.charAt(0)}
                  </span>}
              <div className="flex-1 min-w-[200px]">
                <p className="m-0 text-white text-[15.5px] font-medium">{d.autor}</p>
                {d.cargo && <p className="mt-0.5 mb-0 text-white/45 text-[13px]">{d.cargo}</p>}
                <p className="mt-2.5 mb-0 text-white/65 text-[14px] leading-[1.6] font-light">{d.texto}</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-white/60 text-[13.5px]">
                  <input type="checkbox" checked={d.ativo}
                    onChange={() => atualizar(d.id, { ativo: !d.ativo } as any)} />
                  Visível
                </label>
                <Botao tipo="perigo" onClick={() => confirm(`Remover o depoimento de ${d.autor}?`) && remover(d.id)}>
                  Remover
                </Botao>
              </div>
            </div>
          </Cartao>
        ))}
      </div>
    </>
  );
}
