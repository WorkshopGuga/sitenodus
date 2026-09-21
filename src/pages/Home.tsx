import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import gustavoFoto from "../assets/gustavo-bettiol.jpg.asset.json";
import KnotField from "../components/KnotField";
import Reveal from "../components/Reveal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Section, Eyebrow, H2, Lead, CTAButton } from "../components/ui";
import StepTimeline from "../components/StepTimeline";
import CaseCard from "../components/CaseCard";
import LogoMarquee from "../components/LogoMarquee";
import DepoimentosGrid from "../components/DepoimentosGrid";
import { FRENTES } from "../content/frentes";
import { PASSOS, SINTOMAS, CASES_FALLBACK, DEPOIMENTOS_FALLBACK } from "../content/site";
import { useTabela } from "../lib/useTabela";
import type { EmpresaParceira, Depoimento, CaseItem } from "../lib/supabase";

export default function Home() {
  const [frente, setFrente] = useState(0);
  const [sy, setSy] = useState(0);
  const F = FRENTES[frente];

  useEffect(() => {
    const onScroll = () => setSy(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { dados: empresas } = useTabela<EmpresaParceira>("empresas_parceiras");
  const { dados: depoimentos } = useTabela<Depoimento>("depoimentos", DEPOIMENTOS_FALLBACK as any, {
    filtro: (q) => q.eq("origem", "cliente"),
  });
  const { dados: cases } = useTabela<CaseItem>("cases", CASES_FALLBACK as any, {
    filtro: (q) => q.eq("destaque", true),
  });

  const fade = Math.max(0, 1 - sy / 420);

  return (
    <>
      <Navbar floating />

      {/* ---------- HERO ---------- */}
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-ink bg-[radial-gradient(1100px_620px_at_78%_42%,rgba(29,78,216,.30),transparent_65%)]">
        <KnotField />
        <div
          className="relative z-10 flex-1 flex items-center px-5 md:px-10 pt-28"
          style={{ opacity: fade, transform: `translateY(${sy * -0.12}px)` }}
        >
          <div className="max-w-content mx-auto w-full">
            <div className="max-w-[620px] pb-[8vh]">
              <h1 className="m-0 text-white font-semibold text-[clamp(38px,5.6vw,72px)] leading-[1.04] tracking-[-.028em]">
                A tecnologia faz o repetitivo.<br />Sua equipe faz o que importa.
              </h1>
              <p className="mt-7 text-white/60 text-[clamp(15px,1.25vw,17.5px)] leading-[1.62] max-w-[470px] font-light">
                Entramos na operação, encontramos onde gente boa está fazendo
                trabalho de máquina, e resolvemos.
              </p>
              <div className="flex gap-3.5 mt-10 flex-wrap">
                <CTAButton to="/contato">Agendar uma conversa</CTAButton>
                <CTAButton to="/cases" variant="ghost">Ver o que construímos</CTAButton>
              </div>
            </div>
          </div>
        </div>
        <p className="relative z-10 text-center pb-8 text-white/35 text-[12px] m-0" style={{ opacity: fade }}>
          Role para continuar
        </p>
      </section>

      {/* ---------- EMPRESAS ----------
          Some inteira enquanto não houver nenhuma cadastrada no painel —
          nunca mostra nome de cliente em texto, e nunca fica com o título
          sozinho sem nada embaixo. */}
      {empresas.length > 0 && (
        <section className="bg-white px-5 md:px-10 py-16 md:py-24">
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

      {/* ---------- O PROBLEMA ---------- */}
      <Section tone="dark">
        <Reveal>
          <Eyebrow>Por que existimos</Eyebrow>
          <H2 className="text-white max-w-[780px]">
            Existe um ponto em toda empresa onde pessoas boas estão fazendo
            trabalho de máquina.
          </H2>
        </Reveal>
        <Reveal delay={140}>
          <div className="mt-14 grid gap-px rounded-[18px] overflow-hidden border border-white/[.07] bg-white/[.07] [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
            {SINTOMAS.map((s) => (
              <div key={s.t} className="bg-ink px-7 py-9">
                <p className="m-0 text-white text-[19px] font-medium">{s.t}</p>
                <p className="mt-2.5 mb-0 text-white/50 text-[14.5px] leading-[1.6] font-light">{s.d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ---------- FRENTES ---------- */}
      <Section tone="light">
        <Reveal>
          <Eyebrow light>O que fazemos</Eyebrow>
          <H2 className="text-ink max-w-[700px]">Quatro frentes. Uma porta de entrada.</H2>
        </Reveal>

        <Reveal delay={120}>
          <div className="flex gap-2.5 mt-11 flex-wrap" role="tablist">
            {FRENTES.map((f, i) => (
              <button
                key={f.slug}
                role="tab"
                aria-selected={i === frente}
                onClick={() => setFrente(i)}
                className={`px-[22px] py-[11px] rounded-full text-[14.5px] font-medium transition-all ${
                  i === frente ? "bg-ink text-white" : "bg-ink/[.06] text-ink/60 hover:bg-ink/10"
                }`}
              >
                {f.nome}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div
            key={frente}
            className="mt-8 grid gap-8 md:gap-14 bg-white rounded-[22px] p-7 md:p-12 border border-ink/[.08] shadow-[0_18px_50px_-30px_rgba(26,26,46,.35)] [grid-template-columns:repeat(auto-fit,minmax(290px,1fr))] animate-[fadeUp_.45s_ease]"
          >
            <div>
              <h3 className="m-0 text-[clamp(22px,2.6vw,32px)] font-semibold tracking-[-.022em] text-ink leading-[1.18]">
                {F.titulo}
              </h3>
              <p className="mt-4 text-ink/60 text-[15.5px] leading-[1.68] font-light max-w-[460px]">
                {F.resumo}
              </p>
              <Link
                to={`/${F.slug}`}
                className="inline-block mt-7 text-accent-deep text-[15px] font-medium no-underline border-b border-accent-deep/35 pb-[3px]"
              >
                Conhecer {F.nome.toLowerCase()}
              </Link>
            </div>
            <div className="flex flex-col justify-center">
              {F.itens.map((it) => (
                <div key={it.t} className="py-3.5 border-b border-ink/[.08] text-ink text-[15px] flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-deep shrink-0" />
                  {it.t}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
      </Section>

      {/* ---------- CASES ---------- */}
      <section className="bg-gradient-to-b from-ink to-surface px-5 md:px-10 py-20 md:py-32">
        <div className="max-w-content mx-auto">
          <Reveal>
            <Eyebrow>O que já construímos</Eyebrow>
            <H2 className="text-white max-w-[720px]">
              Projetos reais. Nomes preservados por contrato.
            </H2>
          </Reveal>
          <div className="mt-14 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
            {cases.slice(0, 4).map((c) => (
              <CaseCard key={c.id} caso={c} tone="dark" />
            ))}
          </div>
          <Reveal delay={200}>
            <Link to="/cases" className="inline-block mt-10 text-accent text-[15px] font-medium no-underline border-b border-accent/40 pb-[3px]">
              Ver todos os cases
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- COMO TRABALHAMOS ---------- */}
      <Section tone="light">
        <Reveal>
          <Eyebrow light>Como trabalhamos</Eyebrow>
          <H2 className="text-ink max-w-[680px]">Nenhum projeto começa com uma proposta.</H2>
        </Reveal>
        <div className="mt-10">
          <StepTimeline passos={PASSOS} tone="light" />
        </div>
      </Section>

      {/* ---------- DEPOIMENTOS (origem: cliente) ---------- */}
      <Section tone="dark">
        <Reveal>
          <Eyebrow>O que dizem quem passou por isso</Eyebrow>
        </Reveal>
        <div className="mt-11">
          <DepoimentosGrid depoimentos={depoimentos} tone="dark" />
        </div>
      </Section>

      {/* ---------- FUNDADOR ---------- */}
      <Section tone="light">
        <div className="grid gap-8 md:gap-16 items-center [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          <Reveal>
            <div className="aspect-[4/5] max-w-[400px] rounded-[24px] overflow-hidden">
              <img src={gustavoFoto.url} alt="Gustavo Bettiol" className="w-full h-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div>
              <Eyebrow light>Quem está por trás</Eyebrow>
              <H2 className="text-ink !text-[clamp(26px,3.4vw,40px)]">Gustavo Bettiol</H2>
              <Lead className="text-ink/60">
                Fundador da nodus tecnologia. Capacita times de empresas da Serra Gaúcha
                e lidera projetos de automação em indústrias e distribuidoras.
              </Lead>
              <a
                href="https://gustavobettiol.com"
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-6 text-accent-deep text-[15px] font-medium no-underline border-b border-accent-deep/35 pb-[3px]"
              >
                Conhecer o trabalho do Gustavo
              </a>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------- CTA FINAL ---------- */}
      <section className="relative overflow-hidden bg-ink bg-[radial-gradient(800px_420px_at_50%_0%,rgba(29,78,216,.34),transparent_70%)] px-5 md:px-10 py-24 md:py-36 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-[760px] text-white font-semibold text-[clamp(28px,4.4vw,54px)] leading-[1.1] tracking-[-.028em] m-0">
            Onde sua equipe está fazendo trabalho de máquina?
          </h2>
        </Reveal>
        <Reveal delay={130}>
          <p className="mx-auto mt-6 max-w-[480px] text-white/60 text-[16.5px] leading-[1.6] font-light">
            Uma conversa de 30 minutos costuma ser suficiente para descobrir.
          </p>
        </Reveal>
        <Reveal delay={220}>
          <div className="mt-9">
            <CTAButton to="/contato">Agendar uma conversa</CTAButton>
          </div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
