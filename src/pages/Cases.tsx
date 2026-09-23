import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import { Section, PageHero, CTAButton } from "../components/ui";
import CaseCard from "../components/CaseCard";
import LogoMarquee from "../components/LogoMarquee";
import { useTabela } from "../lib/useTabela";
import { CASES_FALLBACK } from "../content/site";
import { CATEGORIAS_CASE } from "../content/categorias";
import type { CaseItem, EmpresaParceira } from "../lib/supabase";
import { useSeo } from "../lib/useSeo";

export default function Cases() {
  useSeo({
    titulo: "Cases de automação e sistemas sob medida | nodus tecnologia",
    descricao:
      "Projetos reais de automação, sistemas e IA em indústria, distribuição, saúde, transporte e varejo. Resultados concretos, identidade dos clientes preservada.",
    caminho: "/cases",
  });

  const { dados: cases } = useTabela<CaseItem>("cases", CASES_FALLBACK as any, { chave: "cases:todos" });
  const { dados: empresas } = useTabela<EmpresaParceira>("empresas_parceiras");
  const [filtro, setFiltro] = useState<string>("Todos");

  // só mostra como filtro as categorias que de fato têm case cadastrado,
  // na ordem fixa definida em content/categorias.ts
  const categoriasPresentes = useMemo(() => {
    const presentes = new Set(cases.map((c) => c.categoria).filter(Boolean));
    return CATEGORIAS_CASE.filter((c) => presentes.has(c));
  }, [cases]);

  const filtrados = filtro === "Todos" ? cases : cases.filter((c) => c.categoria === filtro);

  return (
    <>
      <Navbar />
      <PageHero
        eyebrow="Cases"
        titulo="O que já construímos para empresas como a sua"
        texto="Preservamos a identidade dos nossos clientes. Cada projeto aqui é real — o que não divulgamos é o nome de quem confiou na gente."
      />

      <Section tone="light">
        {categoriasPresentes.length > 0 && (
          <Reveal>
            <div className="flex flex-wrap gap-2 mb-10" role="tablist">
              {["Todos", ...categoriasPresentes].map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={filtro === c}
                  onClick={() => setFiltro(c)}
                  className={`px-4 py-2 rounded-full text-[13.5px] font-medium transition-all ${
                    filtro === c ? "bg-ink text-white" : "bg-ink/[.06] text-ink/60 hover:bg-ink/10"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {filtrados.length === 0 ? (
          <p className="text-ink/50 text-[15px] py-10 text-center">
            Nenhum case nessa categoria ainda.
          </p>
        ) : (
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
            {filtrados.map((c) => (
              <CaseCard key={c.id} caso={c} tone="light" expandable />
            ))}
          </div>
        )}
      </Section>

      {empresas.length > 0 && (
        <section className="bg-white px-5 md:px-10 py-16 md:py-20">
          <div className="max-w-content mx-auto">
            <Reveal>
              <p className="text-ink/55 text-[14.5px] m-0 text-center">
                Empresas que confiam na nodus
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-10">
                <LogoMarquee empresas={empresas} />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <section className="bg-ink bg-[radial-gradient(800px_420px_at_50%_0%,rgba(29,78,216,.34),transparent_70%)] px-5 md:px-10 py-24 md:py-32 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-[700px] text-white font-semibold text-[clamp(26px,4vw,46px)] leading-[1.12] tracking-[-.028em] m-0">
            Onde sua equipe está fazendo trabalho de máquina?
          </h2>
          <div className="mt-8"><CTAButton to="/contato">Agendar uma conversa</CTAButton></div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
