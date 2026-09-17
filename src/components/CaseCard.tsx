import { useEffect, useRef, useState } from "react";

export type CaseDado = {
  id: string;
  setor: string;
  desafio: string;
  solucao: string;
  resultado: string;
};

/**
 * Três nós (desafio -> solução -> resultado) ligados por uma linha.
 *
 * Dois modos:
 * - padrão (home): acende sozinho quando o card entra na tela ao rolar.
 * - expandable (página de Cases): começa fechado mostrando só o desafio
 *   como título; clicar abre solução e resultado com a mesma animação,
 *   agora disparada pelo clique em vez do scroll.
 *
 * Genérico por design — funciona para qualquer case vindo do painel.
 */
export default function CaseCard({
  caso, tone = "dark", expandable = false,
}: { caso: CaseDado; tone?: "dark" | "light"; expandable?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [porScroll, setPorScroll] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (expandable) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setPorScroll(true), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandable]);

  const on = expandable ? aberto : porScroll;

  const dark = tone === "dark";
  const cardBg = dark ? "bg-white/[.035] border-white/[.08]" : "bg-white border-ink/[.08]";
  const setorCls = dark ? "text-accent" : "text-accent-deep";
  const titleCls = dark ? "text-white" : "text-ink";
  const bodyCls = dark ? "text-white/55" : "text-ink/60";
  const lineDim = dark ? "bg-white/10" : "bg-ink/10";
  const lineLit = dark ? "bg-accent" : "bg-accent-deep";
  const dotLit = dark ? "bg-accent shadow-[0_0_0_4px_rgba(91,156,246,.18)]" : "bg-accent-deep shadow-[0_0_0_4px_rgba(29,78,216,.14)]";
  const dotDim = dark ? "bg-white/15" : "bg-ink/15";

  const RESTANTES = [
    { label: "O que fizemos", texto: caso.solucao, peso: "font-light", tamanho: "text-[14.5px]" },
    { label: "Resultado", texto: caso.resultado, peso: "font-medium", tamanho: "text-[15px]" },
  ];

  if (!expandable) {
    const NOS = [
      { label: "Desafio", texto: caso.desafio, peso: "font-normal", tamanho: dark ? "text-[16.5px]" : "text-[17px]" },
      ...RESTANTES,
    ];
    return (
      <article ref={ref} className={`h-full rounded-[20px] border p-7 ${cardBg}`}>
        <p className={`m-0 text-[13px] font-medium ${setorCls}`}>{caso.setor}</p>
        <div className="relative mt-6 pl-7">
          <div className={`absolute left-[5px] top-1.5 bottom-1.5 w-px ${lineDim}`} aria-hidden />
          <div
            className={`absolute left-[5px] top-1.5 w-px ${lineLit}`}
            style={{ height: on ? "calc(100% - 12px)" : "0%", transition: "height 900ms cubic-bezier(.2,.7,.2,1) 150ms" }}
            aria-hidden
          />
          {NOS.map((n, i) => (
            <div key={n.label} className={i ? "mt-5" : ""}>
              <div className="relative">
                <span
                  className={`absolute -left-7 top-[5px] w-[11px] h-[11px] rounded-full transition-all duration-500 ${on ? dotLit : dotDim}`}
                  style={{ transitionDelay: on ? `${150 + i * 220}ms` : "0ms" }}
                  aria-hidden
                />
                <p
                  className={`m-0 text-[11px] font-medium uppercase tracking-[.06em] ${dark ? "text-white/35" : "text-ink/40"}`}
                  style={{ opacity: on ? 1 : 0, transition: "opacity 500ms ease", transitionDelay: on ? `${150 + i * 220}ms` : "0ms" }}
                >
                  {n.label}
                </p>
                <p
                  className={`mt-1.5 mb-0 leading-[1.55] ${n.peso} ${n.tamanho} ${i === 0 ? titleCls : bodyCls}`}
                  style={{
                    opacity: on ? 1 : 0,
                    transform: on ? "none" : "translateY(5px)",
                    transition: "opacity 550ms ease, transform 550ms ease",
                    transitionDelay: on ? `${190 + i * 220}ms` : "0ms",
                  }}
                >
                  {n.texto}
                </p>
              </div>
            </div>
          ))}
        </div>
      </article>
    );
  }

  /* ---------- modo expansível (página de Cases) ---------- */
  return (
    <article className={`h-full rounded-[20px] border overflow-hidden ${cardBg}`}>
      <button
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="w-full text-left p-7 flex items-start gap-4"
      >
        <span
          className={`mt-[7px] w-[11px] h-[11px] rounded-full shrink-0 transition-colors duration-300 ${dotLit}`}
          aria-hidden
        />
        <span className="flex-1">
          <span className={`block text-[13px] font-medium ${setorCls}`}>{caso.setor}</span>
          <span className={`block mt-2 leading-[1.5] font-normal ${dark ? "text-[16.5px]" : "text-[17px]"} ${titleCls}`}>
            {caso.desafio}
          </span>
        </span>
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          className={`mt-1.5 shrink-0 transition-transform duration-300 ${aberto ? "rotate-180" : ""} ${dark ? "text-white/40" : "text-ink/35"}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div style={{ maxHeight: aberto ? 400 : 0, transition: "max-height 480ms ease", overflow: "hidden" }}>
        <div className="px-7 pb-7 pl-[52px] relative">
          <div className={`absolute left-[26px] top-0 bottom-3 w-px ${lineDim}`} aria-hidden />
          <div
            className={`absolute left-[26px] top-0 w-px ${lineLit}`}
            style={{ height: aberto ? "calc(100% - 12px)" : "0%", transition: "height 500ms ease 100ms" }}
            aria-hidden
          />
          {RESTANTES.map((n, i) => (
            <div key={n.label} className={i ? "mt-5" : ""}>
              <div className="relative">
                <span
                  className={`absolute -left-7 top-[5px] w-[11px] h-[11px] rounded-full transition-all duration-400 ${aberto ? dotLit : dotDim}`}
                  style={{ transitionDelay: aberto ? `${120 + i * 160}ms` : "0ms" }}
                  aria-hidden
                />
                <p
                  className={`m-0 text-[11px] font-medium uppercase tracking-[.06em] ${dark ? "text-white/35" : "text-ink/40"}`}
                  style={{ opacity: aberto ? 1 : 0, transition: "opacity 400ms ease", transitionDelay: aberto ? `${120 + i * 160}ms` : "0ms" }}
                >
                  {n.label}
                </p>
                <p
                  className={`mt-1.5 mb-0 leading-[1.55] ${n.peso} ${n.tamanho} ${bodyCls}`}
                  style={{
                    opacity: aberto ? 1 : 0,
                    transform: aberto ? "none" : "translateY(5px)",
                    transition: "opacity 450ms ease, transform 450ms ease",
                    transitionDelay: aberto ? `${150 + i * 160}ms` : "0ms",
                  }}
                >
                  {n.texto}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
