import { useEffect, useRef } from "react";
import iconeSrc from "../assets/icone-nodus-branco.png";

type Ponto = [number, number];

/** Marching squares simples: extrai um ou mais contornos fechados
 *  (loops de pontos ordenados) de uma grade booleana N x N. */
function extrairContornos(dentro: (x: number, y: number) => boolean, N: number): Ponto[][] {
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= N || y >= N ? false : dentro(x, y));

  const TABELA: Record<number, [string, string][]> = {
    1: [["L", "T"]], 2: [["T", "R"]], 3: [["L", "R"]], 4: [["R", "B"]],
    5: [["L", "T"], ["R", "B"]], 6: [["T", "B"]], 7: [["B", "L"]], 8: [["B", "L"]],
    9: [["T", "B"]], 10: [["T", "R"], ["B", "L"]], 11: [["R", "B"]], 12: [["L", "R"]],
    13: [["T", "R"]], 14: [["L", "T"]],
  };
  const pontoDaBorda = (cx: number, cy: number, nome: string): Ponto => {
    if (nome === "T") return [cx + 0.5, cy];
    if (nome === "R") return [cx + 1, cy + 0.5];
    if (nome === "B") return [cx + 0.5, cy + 1];
    return [cx, cy + 0.5]; // L
  };

  const segmentos: [Ponto, Ponto][] = [];
  for (let y = 0; y < N - 1; y++) {
    for (let x = 0; x < N - 1; x++) {
      const tl = at(x, y) ? 1 : 0, tr = at(x + 1, y) ? 1 : 0;
      const br = at(x + 1, y + 1) ? 1 : 0, bl = at(x, y + 1) ? 1 : 0;
      const idx = tl | (tr << 1) | (br << 2) | (bl << 3);
      const defs = TABELA[idx];
      if (!defs) continue;
      for (const [a, b] of defs) segmentos.push([pontoDaBorda(x, y, a), pontoDaBorda(x, y, b)]);
    }
  }

  const chave = (p: Ponto) => p[0] + "," + p[1];
  const adj = new Map<string, { pt: Ponto; segIdx: number }[]>();
  segmentos.forEach((seg, i) => {
    const [a, b] = seg;
    for (const [p, outro] of [[a, b], [b, a]] as [Ponto, Ponto][]) {
      const k = chave(p);
      if (!adj.has(k)) adj.set(k, []);
      adj.get(k)!.push({ pt: outro, segIdx: i });
    }
  });

  const usado = new Array(segmentos.length).fill(false);
  const loops: Ponto[][] = [];
  for (let i = 0; i < segmentos.length; i++) {
    if (usado[i]) continue;
    const loop: Ponto[] = [segmentos[i][0]];
    let atual = segmentos[i][1];
    usado[i] = true;
    let guarda = 0;
    while (guarda++ < 20000) {
      loop.push(atual);
      if (chave(atual) === chave(loop[0]) && loop.length > 3) break;
      const opts = adj.get(chave(atual)) || [];
      const prox = opts.find((o) => !usado[o.segIdx]);
      if (!prox) break;
      usado[prox.segIdx] = true;
      atual = prox.pt;
    }
    if (loop.length > 6) loops.push(loop);
  }
  return loops;
}

type Particula = {
  loop: number; base: number;
  cx: number; cy: number; escala: number;
  x: number; y: number; vx: number; vy: number; r: number;
};

/**
 * Campo de partículas que forma o próprio ícone da nodus, extraído da
 * transparência da imagem. Cada partícula fica presa a uma posição no
 * contorno (borda externa + vãos internos da fita) e avança com o
 * tempo — por isso a forma parece fluir, não girar como corpo rígido.
 * O cursor desfaz o desenho localmente; ele se refaz sozinho.
 */
export default function KnotField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const pts = useRef<Particula[]>([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const t0 = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const temMouseDeVerdade = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let cancelado = false;
    let limpar = () => {};

    const img = new Image();
    img.src = iconeSrc;

    img.onload = () => {
      if (cancelado) return;

      const N = 150;
      const off = document.createElement("canvas");
      off.width = N; off.height = N;
      const octx = off.getContext("2d")!;
      const s = Math.min(N / img.width, N / img.height);
      const dw = img.width * s, dh = img.height * s;
      octx.drawImage(img, (N - dw) / 2, (N - dh) / 2, dw, dh);
      const data = octx.getImageData(0, 0, N, N).data;
      const dentro = (x: number, y: number) => data[(y * N + x) * 4 + 3] > 120;

      const loopsGrade = extrairContornos(dentro, N);
      const loops = loopsGrade.map((loop) =>
        loop.map(([gx, gy]) => [gx / N - 0.5, gy / N - 0.5] as Ponto)
      );
      const comprimentoTotal = loops.reduce((s, l) => s + l.length, 0);
      if (comprimentoTotal === 0) return; // guarda: imagem sem contorno legível

      const isSmall = () => window.innerWidth < 768;
      const totalParticulas = isSmall() ? 260 : 480;

      const pontoNoLoop = (loop: Ponto[], param: number): Ponto => {
        const n = loop.length;
        const p = ((param % n) + n) % n;
        const i0 = Math.floor(p), i1 = (i0 + 1) % n, frac = p - i0;
        return [
          loop[i0][0] + (loop[i1][0] - loop[i0][0]) * frac,
          loop[i0][1] + (loop[i1][1] - loop[i0][1]) * frac,
        ];
      };

      const build = () => {
        const rect = parent.getBoundingClientRect();
        W = rect.width; H = rect.height;
        canvas.width = W * dpr; canvas.height = H * dpr;
        canvas.style.width = W + "px"; canvas.style.height = H + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const escala = Math.min(W, H) * (isSmall() ? 0.62 : 0.72);
        const cx = isSmall() ? W / 2 : W * 0.72;
        const cy = isSmall() ? H * 0.4 : H / 2;

        const novos: Particula[] = [];
        loops.forEach((loop, li) => {
          const n = Math.max(2, Math.round((loop.length / comprimentoTotal) * totalParticulas));
          for (let i = 0; i < n; i++) {
            novos.push({
              loop: li, base: (i / n) * loop.length,
              cx, cy, escala,
              x: Math.random() * W, y: Math.random() * H,
              vx: 0, vy: 0, r: Math.random() * 1.25 + 0.65,
            });
          }
        });
        pts.current = novos;
      };

      const target = (p: Particula, time: number) => {
        const param = p.base + (reduced ? 0 : time * 0.012);
        const [px, py] = pontoNoLoop(loops[p.loop], param);
        const b = reduced ? 1 : 1 + Math.sin(time * 0.0004) * 0.03;
        return { x: p.cx + px * p.escala * b, y: p.cy + py * p.escala * b };
      };

      const draw = (time: number) => {
        if (!t0.current) t0.current = time;
        const elapsed = time - t0.current;
        ctx.clearRect(0, 0, W, H);
        const P = pts.current;

        for (const p of P) {
          const tg = target(p, time);
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
            if (d2 < 260) {
              ctx.strokeStyle = `rgba(91,156,246,${(1 - d2 / 260) * 0.35})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(P[i].x, P[i].y); ctx.lineTo(P[j].x, P[j].y); ctx.stroke();
            }
          }

        for (const p of P) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.fill();
        }

        raf.current = requestAnimationFrame(draw);
      };

      build();
      raf.current = requestAnimationFrame(draw);

      const onResize = () => { t0.current = 0; build(); };
      window.addEventListener("resize", onResize);

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

      // guarda a limpeza pra rodar quando o efeito desmontar
      limpar = () => {
        cancelAnimationFrame(raf.current);
        window.removeEventListener("resize", onResize);
        if (onMove) parent.removeEventListener("mousemove", onMove);
        if (onLeave) parent.removeEventListener("mouseleave", onLeave);
      };
    };

    return () => {
      cancelado = true;
      limpar();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 z-0"
      style={{ pointerEvents: "none" }}
      aria-hidden
    />
  );
}
