import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import StepTimeline from "../components/StepTimeline";
import DepoimentosCarrossel from "../components/DepoimentosCarrossel";
import GaleriaGrid from "../components/GaleriaGrid";
import { Section, Eyebrow, H2, CTAButton, PageHero } from "../components/ui";
import { FRENTES, getFrente } from "../content/frentes";
import { useTabela } from "../lib/useTabela";
import type { Depoimento, GaleriaImagem } from "../lib/supabase";

export default function Frente({ slug }: { slug: string }) {
  const f = getFrente(slug);
  const outras = FRENTES.filter((x) => x.slug !== slug);

  // Só busca depoimentos/galeria quando a frente pede — senão usa um
  // filtro que nunca casa, pra manter o hook incondicional (regra do React)
  // sem trazer conteúdo de frente que não configurou isso.
  // Capacitação filtra por origem (treinamento/mentoria); as três frentes
  // comerciais filtram por tags_servico dentro de depoimentos de cliente.
  const { dados: depoimentos } = useTabela<Depoimento>("depoimentos", [], {
    filtro: (q) => {
      if (f.depoimentosOrigem) return q.in("origem", f.depoimentosOrigem);
      if (f.depoimentosServico) return q.eq("origem", "cliente").contains("tags_servico", [f.depoimentosServico]);
      return q.eq("id", "00000000-0000-0000-0000-000000000000");
    },
  });

  const { dados: galeria } = useTabela<GaleriaImagem>("galeria_imagens", [], {
    filtro: (q) => (f.galeria ? q : q.eq("id", "00000000-0000-0000-0000-000000000000")),
  });

  return (
    <>
      <Navbar />
      <PageHero eyebrow={f.nome} titulo={f.titulo} texto={f.resumo} />

      {/* o que inclui */}
      <Section tone="light">
        <Reveal>
          <Eyebrow light>O que inclui</Eyebrow>
          <H2 className="text-ink max-w-[640px]">{f.chamada}</H2>
        </Reveal>
        {f.sequencial ? (
          <div className="mt-10">
            <StepTimeline passos={f.itens} tone="light" />
          </div>
        ) : (
          <div className="mt-14 grid gap-px bg-ink/10 border border-ink/10 rounded-[20px] overflow-hidden [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {f.itens.map((it, i) => (
              <Reveal key={it.t} delay={i * 70}>
                <div className="bg-paper h-full px-7 py-9">
                  <h3 className="m-0 text-ink text-[18px] font-semibold tracking-[-.015em]">{it.t}</h3>
                  <p className="mt-3 mb-0 text-ink/60 text-[15px] leading-[1.65] font-light">{it.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      {/* para quem */}
      <Section tone="dark">
        <Reveal>
          <Eyebrow>Faz sentido se</Eyebrow>
        </Reveal>
        <div className="mt-10">
          {f.paraQuem.map((p, i) => (
            <Reveal key={p} delay={i * 80}>
              <div className={`flex items-start gap-4 py-6 ${i ? "border-t border-white/10" : ""}`}>
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <p className="m-0 text-white text-[clamp(17px,2.2vw,23px)] leading-[1.45] font-light max-w-[760px]">{p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* galeria (só quando a frente pede e há imagem ativa) */}
      {f.galeria && galeria.length > 0 && (
        <Section tone="light">
          <Reveal>
            <Eyebrow light>Como acontece na prática</Eyebrow>
          </Reveal>
          <div className="mt-8">
            <GaleriaGrid imagens={galeria} />
          </div>
        </Section>
      )}

      {/* depoimentos desta frente (origem, na Capacitação; serviço, nas comerciais) */}
      {(f.depoimentosOrigem || f.depoimentosServico) && depoimentos.length > 0 && (
        <Section tone="dark">
          <Reveal>
            <Eyebrow>O que dizem quem passou por isso</Eyebrow>
          </Reveal>
          <div className="mt-11">
            <DepoimentosCarrossel depoimentos={depoimentos} tone="dark" />
          </div>
        </Section>
      )}

      {/* outras frentes */}
      <Section tone="light">
        <Reveal>
          <Eyebrow light>Outras frentes</Eyebrow>
          <H2 className="text-ink max-w-[560px]">Raramente um problema mora em uma frente só.</H2>
        </Reveal>
        <div className="mt-12 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
          {outras.map((o, i) => (
            <Reveal key={o.slug} delay={i * 80}>
              <Link
                to={`/${o.slug}`}
                className="block h-full p-7 rounded-[18px] bg-white border border-ink/[.08] no-underline hover:border-accent-deep/40 hover:shadow-[0_14px_40px_-26px_rgba(26,26,46,.5)] transition-all"
              >
                <p className="m-0 text-accent-deep text-[13.5px] font-medium">{o.nome}</p>
                <p className="mt-3 mb-0 text-ink text-[17px] font-medium leading-[1.4] tracking-[-.015em]">{o.titulo}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="bg-ink bg-[radial-gradient(800px_420px_at_50%_0%,rgba(29,78,216,.34),transparent_70%)] px-5 md:px-10 py-24 md:py-32 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-[700px] text-white font-semibold text-[clamp(26px,4vw,46px)] leading-[1.12] tracking-[-.028em] m-0">
            Vamos entender o seu caso?
          </h2>
          <p className="mx-auto mt-5 max-w-[460px] text-white/60 text-[16px] leading-[1.6] font-light">
            Uma conversa de 30 minutos costuma ser suficiente para descobrir por onde começar.
          </p>
          <div className="mt-8"><CTAButton to="/contato">Agendar uma conversa</CTAButton></div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
