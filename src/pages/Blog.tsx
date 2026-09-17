import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import { Section, PageHero } from "../components/ui";
import { useTabela } from "../lib/useTabela";
import type { BlogPost } from "../lib/supabase";

const dataBR = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }) : "";

export default function Blog() {
  const { dados: posts, carregando } = useTabela<BlogPost>("blog_posts", [], {
    ordem: "publicado_em",
    filtro: (q) => q.eq("status", "publicado"),
  });

  return (
    <>
      <Navbar />
      <PageHero
        eyebrow="Blog"
        titulo="O que aprendemos implementando"
        texto="Notas práticas sobre automação, IA aplicada e operação — a partir do que acontece dentro dos projetos."
      />

      <Section tone="light">
        {carregando ? (
          <p className="text-ink/50 text-[15px]">Carregando…</p>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-ink text-[19px] font-medium m-0">Ainda não há publicações.</p>
            <p className="text-ink/55 text-[15px] mt-2.5 font-light">
              Os primeiros artigos chegam em breve.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 80}>
                <Link to={`/blog/${p.slug}`} className="block h-full rounded-[20px] overflow-hidden bg-white border border-ink/[.08] no-underline hover:shadow-[0_18px_46px_-28px_rgba(26,26,46,.5)] transition-shadow">
                  {p.capa_url && (
                    <img src={p.capa_url} alt="" className="w-full aspect-[16/9] object-cover" />
                  )}
                  <div className="p-7">
                    <p className="m-0 text-accent-deep text-[13px] font-medium">{dataBR(p.publicado_em)}</p>
                    <h2 className="mt-3 mb-0 text-ink text-[19px] font-semibold leading-[1.35] tracking-[-.015em]">
                      {p.titulo}
                    </h2>
                    {p.resumo && (
                      <p className="mt-3 mb-0 text-ink/60 text-[15px] leading-[1.6] font-light">{p.resumo}</p>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <Footer />
    </>
  );
}
