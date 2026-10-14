import { useEffect, useRef, useState } from "react";
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
 * Sem player: o vídeo toca sozinho, sem som e em loop, enquanto está na tela, e pausa ao sair.
 * Se o navegador bloquear o autoplay (ex: economia de bateria no iPhone), aparece um botão de play.
 */
/** Escolhe o vídeo e a capa da versão pedida, com fallback para a outra versão e para o vídeo antigo. */
export function videoDoCase(caso: CaseDado, versao: "claro" | "escuro") {
  const claro = { src: caso.video_claro_url, poster: caso.poster_claro_url };
  const escuro = { src: caso.video_escuro_url, poster: caso.poster_escuro_url };
  const [a, b] = versao === "claro" ? [claro, escuro] : [escuro, claro];
  if (a.src) return { src: a.src, poster: a.poster ?? undefined };
  if (b.src) return { src: b.src, poster: b.poster ?? undefined };
  if (caso.video_url) return { src: caso.video_url, poster: undefined };
  return null;
}

export default function CaseVideoCard({ caso, tone = "light", versao = "escuro" }: { caso: CaseDado; tone?: "dark" | "light"; versao?: "claro" | "escuro" }) {
  const video = videoDoCase(caso, versao);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [bloqueado, setBloqueado] = useState(false);
  const formato = caso.video_formato && RATIO[caso.video_formato] ? caso.video_formato : "quadrado";
  const dark = tone === "dark";

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // React não grava o atributo "muted" no HTML; sem ele o navegador bloqueia o autoplay
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    const onPlaying = () => setBloqueado(false);
    v.addEventListener("playing", onPlaying);
    if (typeof IntersectionObserver === "undefined" || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setBloqueado(true); // sem autoplay: deixa o botão de play
      return () => v.removeEventListener("playing", onPlaying);
    }
    const tocar = () => {
      const p = v.play();
      if (p) p.catch(() => setBloqueado(true));
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) tocar();
        else v.pause();
      },
      { threshold: 0.15, rootMargin: "200px 0px" },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      v.removeEventListener("playing", onPlaying);
    };
  }, []);

  const blocos = [
    { label: "O que fizemos", texto: caso.solucao },
    { label: "Resultado", texto: caso.resultado },
  ];

  const cardCls = dark ? "border-white/[.08] bg-white/[.035]" : "border-ink/[.08] bg-white";
  const palcoCls = dark ? "bg-black/30" : "bg-ink";
  const setorCls = dark ? "text-accent" : "text-accent-deep";
  const dotCls = dark ? "bg-accent" : "bg-accent-deep";
  const tituloCls = dark ? "text-white" : "text-ink";
  const linhaCls = dark ? "border-white/10" : "border-ink/10";
  const labelCls = dark ? "text-white/40" : "text-ink/40";
  const textoCls = dark ? "text-white/60" : "text-ink/65";

  return (
    <article className={`col-span-full overflow-hidden rounded-[10px] border grid ${COLUNAS[formato]} ${cardCls}`}>
      {/* vídeo: no celular vem primeiro, no desktop fica ao lado */}
      <div className={`order-1 md:order-2 p-4 md:p-8 grid place-items-center ${palcoCls}`}>
        <div className="relative w-full mx-auto" style={{ maxWidth: LARGURA_MAX[formato], aspectRatio: RATIO[formato] }}>
          <video
            ref={videoRef}
            src={video?.src ?? undefined}
            poster={video?.poster}
            muted
            autoPlay
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            disableRemotePlayback
            tabIndex={-1}
            aria-label={`Vídeo do case: ${caso.setor}`}
            onContextMenu={(e) => e.preventDefault()}
            className="block w-full h-full rounded-[6px] bg-black object-cover pointer-events-none select-none"
          />
          {bloqueado && (
            <button
              type="button"
              aria-label="Reproduzir vídeo"
              onClick={() => videoRef.current?.play().catch(() => {})}
              className="absolute inset-0 grid place-items-center rounded-[6px] bg-black/35"
            >
              <span className="w-16 h-16 rounded-full bg-[#e9eefc] text-[#0b1020] grid place-items-center text-[22px] pl-1">▶</span>
            </button>
          )}
        </div>
      </div>

      <div className="order-2 md:order-1 p-6 md:p-10 flex flex-col justify-center">
        <p className={`m-0 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[.16em] leading-[1.6] ${setorCls}`}>
          <span aria-hidden className={`shrink-0 w-[7px] h-[7px] rounded-full ${dotCls}`} />
          {caso.setor}
        </p>
        <h3 className={`mt-5 mb-0 font-bold text-[clamp(22px,2.6vw,32px)] leading-[1.15] tracking-[-.045em] ${tituloCls}`}>
          {caso.desafio}
        </h3>
        <div className="mt-7 grid gap-6">
          {blocos.map((b) => (
            <div key={b.label} className={`border-t pt-5 ${linhaCls}`}>
              <p className={`m-0 text-[10px] font-bold uppercase tracking-[.2em] ${labelCls}`}>{b.label}</p>
              <p className={`mt-2 mb-0 text-[15px] leading-[1.7] ${textoCls}`}>{b.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
