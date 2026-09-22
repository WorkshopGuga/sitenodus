import { useState } from "react";
import { useCrud } from "./useCrud";
import { Cabecalho, Cartao, Botao, Campo, input, UploadImagem, Vazio } from "./componentes";
import type { BlogPost } from "../lib/supabase";

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
   .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 70);

const vazio = {
  titulo: "", slug: "", resumo: "", conteudo: "", capa_url: "",
  autor: "nodus tecnologia", status: "rascunho", origem: "manual",
};

function FormularioPost({
  valor, onMudar, onSalvar, onCancelar, salvando, tituloBotao = "Salvar",
}: {
  valor: any; onMudar: (v: any) => void; onSalvar: () => void;
  onCancelar?: () => void; salvando?: boolean; tituloBotao?: string;
}) {
  return (
    <Cartao>
      <div className="grid gap-4">
        <Campo label="Título">
          <input className={input} value={valor.titulo}
            onChange={(e) => onMudar({ ...valor, titulo: e.target.value, slug: valor.slug || slugify(e.target.value) })} />
        </Campo>
        <Campo label="Endereço da página">
          <input className={input} value={valor.slug}
            onChange={(e) => onMudar({ ...valor, slug: slugify(e.target.value) })} />
        </Campo>
        <Campo label="Resumo">
          <textarea className={input} rows={2} value={valor.resumo}
            onChange={(e) => onMudar({ ...valor, resumo: e.target.value })} />
        </Campo>
        <Campo label="Conteúdo (Markdown)">
          <textarea className={input + " font-mono text-[13px]"} rows={12} value={valor.conteudo}
            onChange={(e) => onMudar({ ...valor, conteudo: e.target.value })}
            placeholder={"## Um subtítulo\n\nSeu parágrafo aqui.\n\n- item\n- outro item"} />
        </Campo>
        <div className="grid gap-4 md:grid-cols-2">
          <Campo label="Imagem de capa">
            <UploadImagem bucket="blog" valor={valor.capa_url}
              onChange={(url) => onMudar({ ...valor, capa_url: url })}
              maxLargura={1600} maxAltura={900} />
          </Campo>
          <Campo label="Status">
            <select className={input} value={valor.status}
              onChange={(e) => onMudar({ ...valor, status: e.target.value })}>
              <option value="rascunho" className="bg-ink">Rascunho</option>
              <option value="publicado" className="bg-ink">Publicado</option>
              <option value="arquivado" className="bg-ink">Arquivado</option>
            </select>
          </Campo>
        </div>
      </div>
      <div className="mt-5 flex gap-3">
        <Botao onClick={onSalvar} disabled={!valor.titulo || salvando}>
          {salvando ? "Salvando…" : tituloBotao}
        </Botao>
        {onCancelar && <Botao tipo="secundario" onClick={onCancelar}>Cancelar</Botao>}
      </div>
    </Cartao>
  );
}

export default function AdminBlog() {
  const { itens, carregando, erro, criar, atualizar, remover } = useCrud<BlogPost>("blog_posts", "criado_em");
  const [novo, setNovo] = useState<any>(vazio);
  const [abrindo, setAbrindo] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState<any>(null);

  const comPublicadoEm = (registro: any, statusAnterior?: string) => {
    if (registro.status === "publicado" && statusAnterior !== "publicado") {
      return { ...registro, publicado_em: new Date().toISOString() };
    }
    if (registro.status !== "publicado") {
      return { ...registro, publicado_em: null };
    }
    return registro;
  };

  const salvar = async () => {
    if (!novo.titulo) return;
    const slug = novo.slug || slugify(novo.titulo);
    const ok = await criar(comPublicadoEm({ ...novo, slug }));
    if (ok) { setNovo(vazio); setAbrindo(false); }
  };

  const iniciarEdicao = (p: BlogPost) => { setEditandoId(p.id); setRascunho({ ...p }); };

  const salvarEdicao = async () => {
    if (!editandoId || !rascunho) return;
    const { id, criado_em, atualizado_em, ...campos } = rascunho;
    const original = itens.find((p) => p.id === editandoId);
    const ok = await atualizar(editandoId, comPublicadoEm(campos, original?.status));
    if (ok) { setEditandoId(null); setRascunho(null); }
  };

  const publicar = (p: BlogPost) =>
    atualizar(p.id, {
      status: p.status === "publicado" ? "rascunho" : "publicado",
      publicado_em: p.status === "publicado" ? null : new Date().toISOString(),
    } as any);

  return (
    <>
      <Cabecalho
        titulo="Blog"
        descricao="Escreva em Markdown. Posts criados pelo n8n aparecem aqui com a origem marcada — revise antes de publicar."
        acao={<Botao onClick={() => setAbrindo(!abrindo)}>{abrindo ? "Cancelar" : "Novo post"}</Botao>}
      />

      {abrindo && (
        <div className="mb-6">
          <FormularioPost valor={novo} onMudar={setNovo} onSalvar={salvar} />
        </div>
      )}

      {erro && <p className="text-red-400 text-[14px]">{erro}</p>}
      {carregando && <p className="text-white/45 text-[14px]">Carregando…</p>}
      {!carregando && itens.length === 0 && <Vazio texto="Nenhum post ainda." />}

      <div className="grid gap-3">
        {itens.map((p) =>
          editandoId === p.id ? (
            <FormularioPost
              key={p.id}
              valor={rascunho}
              onMudar={setRascunho}
              onSalvar={salvarEdicao}
              onCancelar={() => { setEditandoId(null); setRascunho(null); }}
            />
          ) : (
            <Cartao key={p.id}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-[220px]">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-full text-[11.5px] font-medium ${
                      p.status === "publicado" ? "bg-accent/15 text-accent" : "bg-white/10 text-white/55"
                    }`}>
                      {p.status === "publicado" ? "Publicado" : p.status === "arquivado" ? "Arquivado" : "Rascunho"}
                    </span>
                    {p.origem === "n8n" && (
                      <span className="px-2.5 py-1 rounded-full text-[11.5px] bg-white/[.07] text-white/50">
                        Gerado por n8n
                      </span>
                    )}
                  </div>
                  <p className="mt-2.5 mb-0 text-white text-[16px] font-medium leading-[1.4]">{p.titulo}</p>
                  <p className="mt-1 mb-0 text-white/35 text-[12.5px]">/blog/{p.slug}</p>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Botao tipo="secundario" onClick={() => iniciarEdicao(p)}>Editar</Botao>
                  <Botao tipo="secundario" onClick={() => publicar(p)}>
                    {p.status === "publicado" ? "Despublicar" : "Publicar"}
                  </Botao>
                  <Botao tipo="perigo" onClick={() => confirm(`Remover "${p.titulo}"?`) && remover(p.id)}>
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
