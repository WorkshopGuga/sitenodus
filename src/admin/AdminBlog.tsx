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

export default function AdminBlog() {
  const { itens, carregando, erro, criar, atualizar, remover } = useCrud<BlogPost>("blog_posts", "criado_em");
  const [novo, setNovo] = useState<any>(vazio);
  const [abrindo, setAbrindo] = useState(false);

  const salvar = async () => {
    if (!novo.titulo) return;
    const slug = novo.slug || slugify(novo.titulo);
    const registro: any = { ...novo, slug };
    if (novo.status === "publicado") registro.publicado_em = new Date().toISOString();
    const ok = await criar(registro);
    if (ok) { setNovo(vazio); setAbrindo(false); }
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
          <Cartao>
            <div className="grid gap-4">
              <Campo label="Título">
                <input className={input} value={novo.titulo}
                  onChange={(e) => setNovo({ ...novo, titulo: e.target.value, slug: slugify(e.target.value) })} />
              </Campo>
              <Campo label="Endereço da página">
                <input className={input} value={novo.slug}
                  onChange={(e) => setNovo({ ...novo, slug: slugify(e.target.value) })} />
              </Campo>
              <Campo label="Resumo">
                <textarea className={input} rows={2} value={novo.resumo}
                  onChange={(e) => setNovo({ ...novo, resumo: e.target.value })} />
              </Campo>
              <Campo label="Conteúdo (Markdown)">
                <textarea className={input + " font-mono text-[13px]"} rows={12} value={novo.conteudo}
                  onChange={(e) => setNovo({ ...novo, conteudo: e.target.value })}
                  placeholder={"## Um subtítulo\n\nSeu parágrafo aqui.\n\n- item\n- outro item"} />
              </Campo>
              <div className="grid gap-4 md:grid-cols-2">
                <Campo label="Imagem de capa">
                  <UploadImagem bucket="blog" valor={novo.capa_url}
                    onChange={(url) => setNovo({ ...novo, capa_url: url })} />
                </Campo>
                <Campo label="Status">
                  <select className={input} value={novo.status}
                    onChange={(e) => setNovo({ ...novo, status: e.target.value })}>
                    <option value="rascunho" className="bg-ink">Rascunho</option>
                    <option value="publicado" className="bg-ink">Publicado</option>
                  </select>
                </Campo>
              </div>
            </div>
            <div className="mt-5">
              <Botao onClick={salvar} disabled={!novo.titulo}>Salvar</Botao>
            </div>
          </Cartao>
        </div>
      )}

      {erro && <p className="text-red-400 text-[14px]">{erro}</p>}
      {carregando && <p className="text-white/45 text-[14px]">Carregando…</p>}
      {!carregando && itens.length === 0 && <Vazio texto="Nenhum post ainda." />}

      <div className="grid gap-3">
        {itens.map((p) => (
          <Cartao key={p.id}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[220px]">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`px-2.5 py-1 rounded-full text-[11.5px] font-medium ${
                    p.status === "publicado" ? "bg-accent/15 text-accent" : "bg-white/10 text-white/55"
                  }`}>
                    {p.status === "publicado" ? "Publicado" : "Rascunho"}
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
              <div className="flex items-center gap-2.5">
                <Botao tipo="secundario" onClick={() => publicar(p)}>
                  {p.status === "publicado" ? "Despublicar" : "Publicar"}
                </Botao>
                <Botao tipo="perigo" onClick={() => confirm(`Remover "${p.titulo}"?`) && remover(p.id)}>
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
