import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import type { BlogPost as Post } from "../lib/supabase";

/** Markdown mínimo: títulos, negrito, itálico, links, listas e parágrafos.
 *  Suficiente para conteúdo vindo do n8n sem trazer dependência extra. */
function md(src: string) {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const inline = (s: string) =>
    esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');

  return src.split(/\n{2,}/).map((bloco) => {
    const b = bloco.trim();
    if (!b) return "";
    if (b.startsWith("### ")) return `<h3>${inline(b.slice(4))}</h3>`;
    if (b.startsWith("## ")) return `<h2>${inline(b.slice(3))}</h2>`;
    if (b.startsWith("# ")) return `<h2>${inline(b.slice(2))}</h2>`;
    if (/^[-*] /m.test(b)) {
      const li = b.split("\n").filter((l) => /^[-*] /.test(l))
        .map((l) => `<li>${inline(l.replace(/^[-*] /, ""))}</li>`).join("");
      return `<ul>${li}</ul>`;
    }
    return `<p>${inline(b).replace(/\n/g, "<br/>")}</p>`;
  }).join("");
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("blog_posts").select("*")
        .eq("slug", slug).eq("status", "publicado").maybeSingle();
      if (error || !data) setErro(true);
      else setPost(data as Post);
    })();
  }, [slug]);

  return (
    <>
      <Navbar />
      <article className="bg-paper text-ink min-h-screen px-5 md:px-10 pt-32 pb-24">
        <div className="max-w-[720px] mx-auto">
          <Link to="/blog" className="text-accent-deep text-[14px] no-underline">← Blog</Link>

          {erro && <p className="mt-10 text-ink/60">Publicação não encontrada.</p>}

          {post && (
            <>
              <h1 className="mt-7 mb-0 text-[clamp(28px,4.4vw,46px)] font-semibold leading-[1.12] tracking-[-.028em]">
                {post.titulo}
              </h1>
              <p className="mt-4 text-ink/50 text-[14px]">
                {post.autor}
                {post.publicado_em &&
                  ` · ${new Date(post.publicado_em).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}`}
              </p>
              {post.capa_url && (
                <img src={post.capa_url} alt="" className="mt-8 w-full rounded-[20px] aspect-[16/9] object-cover" />
              )}
              <div
                className="prose-nodus mt-10"
                dangerouslySetInnerHTML={{ __html: md(post.conteudo ?? "") }}
              />
            </>
          )}
        </div>
      </article>

      <style>{`
        .prose-nodus p { margin: 0 0 20px; font-size: 17px; line-height: 1.75; font-weight: 300; color: rgba(26,26,46,.78); }
        .prose-nodus h2 { margin: 40px 0 14px; font-size: 26px; font-weight: 600; letter-spacing: -.02em; }
        .prose-nodus h3 { margin: 32px 0 12px; font-size: 20px; font-weight: 600; }
        .prose-nodus ul { margin: 0 0 20px; padding-left: 22px; }
        .prose-nodus li { font-size: 17px; line-height: 1.7; font-weight: 300; margin-bottom: 8px; color: rgba(26,26,46,.78); }
        .prose-nodus a { color: #1D4ED8; }
        .prose-nodus strong { font-weight: 600; color: #0D0D1A; }
      `}</style>

      <Footer />
    </>
  );
}
