import { useEffect, useRef } from "react";

/**
 * Campo de partículas que parte do caos e se organiza na projeção
 * de um nó de quatro cruzamentos. Caos -> estrutura: a promessa da
 * nodus desenhada. O cursor desfaz o nó localmente; ele se refaz sozinho.
 */
export default function KnotField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const pts = useRef<any[]>([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const t0 = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;

    const isSmall = () => window.innerWidth < 768;

    const build = () => {
      const r = parent.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const N = isSmall() ? 90 : 190;
      const scale = Math.min(W, H) / (isSmall() ? 7.2 : 6.2);
      const cx = isSmall() ? W / 2 : W * 0.72;
      const cy = isSmall() ? H * 0.4 : H / 2;
      pts.current = Array.from({ length: N }, (_, i) => ({
        t: (i / N) * Math.PI * 2,
        cx, cy, scale,
        x: Math.random() * W, y: Math.random() * H,
        vx: 0, vy: 0, r: Math.random() * 1.3 + 0.7,
      }));
    };

    const target = (p: any, time: number) => {
      const t = p.t + time * 0.00007;
      const rad = 2 + Math.cos(2 * t);
      const b = 1 + Math.sin(time * 0.0004) * 0.03;
      return {
        x: p.cx + rad * Math.cos(3 * t) * p.scale * b,
        y: p.cy + rad * Math.sin(3 * t) * p.scale * b,
      };
    };

    const draw = (time: number) => {
      if (!t0.current) t0.current = time;
      const elapsed = time - t0.current;
      ctx.clearRect(0, 0, W, H);
      const P = pts.current;

      for (const p of P) {
        const tg = target(p, reduced ? 0 : time);
        const k = 0.006 + 0.03 * Math.min(elapsed / 1800, 1);
        p.vx += (tg.x - p.x) * k;
        p.vy += (tg.y - p.y) * k;
        const dx = p.x - mouse.current.x, dy = p.y - mouse.current.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 16000 && d2 > 0.01) {
          const f = (16000 - d2) / 16000, d = Math.sqrt(d2);
          p.vx += (dx / d) * f * 2.2; p.vy += (dy / d) * f * 2.2;
        }
        p.vx *= 0.86; p.vy *= 0.86;
        p.x += p.vx; p.y += p.vy;
      }

      for (let i = 0; i < P.length; i++)
        for (let j = i + 1; j < P.length; j++) {
          const dx = P[i].x - P[j].x, dy = P[i].y - P[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 7000) {
            ctx.strokeStyle = `rgba(91,156,246,${(1 - d2 / 7000) * 0.32})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(P[i].x, P[i].y);
            ctx.lineTo(P[j].x, P[j].y);
            ctx.stroke();
          }
        }

      for (const p of P) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.78)";
        ctx.fill();
      }

      raf.current = requestAnimationFrame(draw);
    };

    build();
    raf.current = requestAnimationFrame(draw);

    const onResize = () => { t0.current = 0; build(); };
    window.addEventListener("resize", onResize);

    // O nó só reage ao cursor em telas com mouse de verdade (hover + ponteiro
    // fino). Em toque, "mousemove" é emulado durante o arraste de scroll e
    // faz o nó perseguir o dedo de forma caótica — por isso não escutamos
    // nada em touch; ele apenas respira e gira sozinho, o que já é o efeito
    // desejado ali (ambiente, não reativo).
    const temMouseDeVerdade = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let onMove: ((e: MouseEvent) => void) | undefined;
    let onLeave: (() => void) | undefined;

    if (temMouseDeVerdade) {
      onMove = (e) => {
        const r = canvas.getBoundingClientRect();
        mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      };
      onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };
      parent.addEventListener("mousemove", onMove);
      parent.addEventListener("mouseleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", onResize);
      if (onMove) parent.removeEventListener("mousemove", onMove);
      if (onLeave) parent.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // pointerEvents: "none" -> o canvas nunca captura toque ou clique; o scroll
  // e qualquer botão por cima funcionam normalmente em qualquer dispositivo.
  return (
    <canvas
      ref={ref}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: "none" }}
      aria-hidden
    />
  );
}
