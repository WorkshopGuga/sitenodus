import { useEffect, useRef } from "react";
import type { CaseDado } from "./CaseCard";

const LARGURA_MAX: Record<string, number> = { vertical: 320, quadrado: 460, horizontal: 640 };
// coluna do vídeo no desktop = largura do vídeo + respiro (p-8 = 32px de cada lado)
const COLUNAS: Record<string, string> = {
  vertical: "md:[grid-template-columns:minmax(0,1fr)_384px]",
  quadrado: "md:[grid-template-columns:minmax(0,1fr)_524px]",
  horizontal: "md:[grid-template-columns:minmax(0,1fr)_704px]",
};
const RATIO: Record<string, string> = { vertical: "9 / 16", quadrado: "1 / 1", horizontal: "16 / 9" };

/**
 * Case com vídeo: texto de um lado, vídeo grande do outro, sempre visível (sem abrir).
 * O vídeo toca sozinho, sem som e em loop, enquanto está na tela, e pausa ao sair.
 * Os controles ficam disponíveis para pausar ou ligar o som.
 */
export default function CaseVideoCard({ caso }: { caso: CaseDado }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const formato = caso.video_formato && RATIO[caso.video_formato] ? caso.video_formato : "quadrado";

  useEffect(() => {
    const v = videoRef.current;
    if (!v || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const blocos = [
    { label: "O que fizemos", texto: caso.solucao },
    { label: "Resultado", texto: caso.resultado },
  ];

  return (
    <article className={`col-span-full overflow-hidden rounded-[10px] border border-ink/[.08] bg-white grid ${COLUNAS[formato]}`}>
      {/* vídeo: no celular vem primeiro, no desktop fica ao lado */}
      <div className="order-1 md:order-2 bg-ink p-4 md:p-8 grid place-items-center">
        <video
          ref={videoRef}
          src={`${caso.video_url}#t=0.1`}
          muted
          loop
          playsInline
          controls
          preload="metadata"
          className="block w-full mx-auto rounded-[6px] bg-black"
          style={{ maxWidth: LARGURA_MAX[formato], aspectRatio: RATIO[formato] }}
        />
      </div>

      <div className="order-2 md:order-1 p-6 md:p-10 flex flex-col justify-center">
        <p className="m-0 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.16em] leading-[1.6] text-accent-deep">
          <span aria-hidden className="shrink-0 w-[7px] h-[7px] rounded-full bg-accent-deep" />
          {caso.setor}
        </p>
        <h3 className="mt-5 mb-0 text-ink font-bold text-[clamp(22px,2.6vw,32px)] leading-[1.15] tracking-[-.045em]">
          {caso.desafio}
        </h3>
        <div className="mt-7 grid gap-6">
          {blocos.map((b) => (
            <div key={b.label} className="border-t border-ink/10 pt-5">
              <p className="m-0 text-[10px] font-bold uppercase tracking-[.2em] text-ink/40">{b.label}</p>
              <p className="mt-2 mb-0 text-ink/65 text-[15px] leading-[1.7]">{b.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
