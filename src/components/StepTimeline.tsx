import { useEffect, useRef, useState } from "react";

type Passo = { t: string; d: string };

/**
 * Linha vertical que se traça conforme o scroll passa por cada passo,
 * com o número acendendo em sequência. Só faz sentido em conteúdo que
 * é de fato uma sequência (um passo depende do anterior) — em ofertas
 * paralelas isso mentiria uma ordem que não existe, então esse
 * componente é usado só onde a ordem é real.
 */
export default function StepTimeline({ passos, tone = "light" }: { passos: Passo[]; tone?: "light" | "dark" }) {
  const [aceso, setAceso] = useState<boolean[]>(() => passos.map(() => false));
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = refs.current.map((el, i) => {
      if (!el) return null;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setAceso((prev) => {
              if (prev[i]) return prev;
              const next = [...prev];
              next[i] = true;
              return next;
            });
          }
        },
        { threshold: 0.35 },
      );
      io.observe(el);
      return io;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [passos.length]);

  const numDim = tone === "dark" ? "text-white/[.14]" : "text-ink/[.14]";
  const numLit = tone === "dark" ? "text-accent" : "text-accent-deep";
  const lineDim = tone === "dark" ? "bg-white/10" : "bg-ink/10";
  const titleCls = tone === "dark" ? "text-white" : "text-ink";
  const textCls = tone === "dark" ? "text-white/55" : "text-ink/60";

  return (
    <div className="relative">
      {/* trilho de fundo */}
      <div className={`absolute left-[7px] top-3 bottom-3 w-px ${lineDim}`} aria-hidden />
      {passos.map((p, i) => (
        <div
          key={p.t}
          ref={(el) => (refs.current[i] = el)}
          className="relative grid [grid-template-columns:58px_1fr] md:[grid-template-columns:68px_1fr] gap-5 md:gap-10 py-7"
        >
          {/* segmento da linha que "acende" até este passo */}
          <div
            className={`absolute left-[7px] top-0 w-px ${tone === "dark" ? "bg-accent" : "bg-accent-deep"}`}
            style={{
              height: aceso[i] ? "calc(100% - 0px)" : "0%",
              transition: "height 700ms cubic-bezier(.2,.7,.2,1) 80ms",
            }}
            aria-hidden
          />
          <div className="relative flex justify-center">
            <span
              className={`text-[clamp(26px,3.4vw,38px)] font-semibold leading-none tracking-[-.03em] transition-colors duration-500 ${
                aceso[i] ? numLit : numDim
              }`}
              style={{ transitionDelay: aceso[i] ? "120ms" : "0ms" }}
            >
              {i + 1}
            </span>
          </div>
          <div
            style={{
              opacity: aceso[i] ? 1 : 0.35,
              transform: aceso[i] ? "none" : "translateY(6px)",
              transition: "opacity 600ms ease 120ms, transform 600ms ease 120ms",
            }}
          >
            <h3 className={`m-0 text-[clamp(18px,2.1vw,24px)] font-semibold tracking-[-.016em] ${titleCls}`}>{p.t}</h3>
            <p className={`mt-2.5 mb-0 text-[15px] leading-[1.65] font-light max-w-[600px] ${textCls}`}>{p.d}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
