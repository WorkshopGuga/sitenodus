import { useState } from "react";
import { useCrud } from "./useCrud";
import { Cabecalho, Cartao, Botao, Campo, input, UploadImagem, Vazio } from "./componentes";
import type { Depoimento } from "../lib/supabase";

const vazio = { autor: "", cargo: "", texto: "", foto_url: "", origem: "cliente", ordem: 0, ativo: true };

/** Formulário de autor/cargo/texto/origem/foto — reaproveitado tanto
 *  pra criar quanto pra editar, só muda o que acontece ao salvar. */
function FormularioDepoimento({
  valor, onMudar, onSalvar, onCancelar, salvando,
}: {
  valor: any; onMudar: (v: any) => void; onSalvar: () => void; onCancelar?: () => void; salvando?: boolean;
}) {
  return (
    <Cartao>
      <div className="grid gap-4 md:grid-cols-2">
        <Campo label="Nome">
          <input className={input} value={valor.autor}
            onChange={(e) => onMudar({ ...valor, autor: e.target.value })} placeholder="Ex: Matheus Silva" />
        </Campo>
        <Campo label="Profissão">
          <input className={input} value={valor.cargo}
            onChange={(e) => onMudar({ ...valor, cargo: e.target.value })}
            placeholder="Ex: Representante Comercial — Indústria" />
        </Campo>
        <div className="md:col-span-2">
          <Campo label="Depoimento">
            <textarea className={input} rows={3} value={valor.texto}
              onChange={(e) => onMudar({ ...valor, texto: e.target.value })}
              placeholder="O que a pessoa disse" />
          </Campo>
        </div>
        <Campo label="Origem">
          <select className={input} value={valor.origem}
            onChange={(e) => onMudar({ ...valor, origem: e.target.value })}>
            <option value="cliente" className="bg-ink">Cliente</option>
            <option value="treinamento" className="bg-ink">Treinamento</option>
            <option value="mentoria" className="bg-ink">Mentoria</option>
          </select>
        </Campo>
        <Campo label="Foto de perfil">
          <UploadImagem bucket="depoimentos" valor={valor.foto_url} formato="circulo"
            onChange={(url) => onMudar({ ...valor, foto_url: url })}
            maxLargura={480} maxAltura={480} />
        </Campo>
      </div>
      <div className="mt-5 flex gap-3">
        <Botao onClick={onSalvar} disabled={!valor.autor || !valor.texto || salvando}>
          {salvando ? "Salvando…" : "Salvar"}
        </Botao>
        {onCancelar && <Botao tipo="secundario" onClick={onCancelar}>Cancelar</Botao>}
      </div>
    </Cartao>
  );
}

const ORIGENS = [
  { valor: "todos", label: "Todos" },
  { valor: "cliente", label: "Cliente" },
  { valor: "treinamento", label: "Treinamento" },
  { valor: "mentoria", label: "Mentoria" },
];

export default function AdminDepoimentos() {
  const { itens, carregando, erro, criar, atualizar, remover } = useCrud<Depoimento>("depoimentos");
  const [novo, setNovo] = useState<any>(vazio);
  const [abrindo, setAbrindo] = useState(false);
  const [filtro, setFiltro] = useState("todos");

  const itensFiltrados = filtro === "todos" ? itens : itens.filter((d) => d.origem === filtro);

  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState<any>(null);

  const salvarNovo = async () => {
    if (!novo.autor || !novo.texto) return;
    const ok = await criar({ ...novo, ordem: Number(novo.ordem) || itens.length + 1 });
    if (ok) { setNovo(vazio); setAbrindo(false); }
  };

  const iniciarEdicao = (d: Depoimento) => {
    setEditandoId(d.id);
    setRascunho({ ...d });
  };

  const salvarEdicao = async () => {
    if (!editandoId || !rascunho) return;
    const { id, ...campos } = rascunho;
    const ok = await atualizar(editandoId, campos);
    if (ok) { setEditandoId(null); setRascunho(null); }
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
          <FormularioDepoimento valor={novo} onMudar={setNovo} onSalvar={salvarNovo} />
        </div>
      )}

      {erro && <p className="text-red-400 text-[14px]">{erro}</p>}
      {carregando && <p className="text-white/45 text-[14px]">Carregando…</p>}
      {!carregando && itens.length === 0 && <Vazio texto="Nenhum depoimento cadastrado ainda." />}

      {itens.length > 0 && (
        <div className="flex gap-2 mb-5 flex-wrap">
          {ORIGENS.map((o) => (
            <button
              key={o.valor}
              onClick={() => setFiltro(o.valor)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                filtro === o.valor ? "bg-white text-ink" : "bg-white/[.06] text-white/55 hover:bg-white/10"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}

      {!carregando && itens.length > 0 && itensFiltrados.length === 0 && (
        <Vazio texto="Nenhum depoimento com essa origem." />
      )}

      <div className="grid gap-3">
        {itensFiltrados.map((d) =>
          editandoId === d.id ? (
            <FormularioDepoimento
              key={d.id}
              valor={rascunho}
              onMudar={setRascunho}
              onSalvar={salvarEdicao}
              onCancelar={() => { setEditandoId(null); setRascunho(null); }}
            />
          ) : (
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
                  <Botao tipo="secundario" onClick={() => iniciarEdicao(d)}>Editar</Botao>
                  <Botao tipo="perigo" onClick={() => confirm(`Remover o depoimento de ${d.autor}?`) && remover(d.id)}>
                    Remover
                  </Botao>
                </div>
              </div>
            </Cartao>
          )
        )}
      </div>
    </>
  );
}
