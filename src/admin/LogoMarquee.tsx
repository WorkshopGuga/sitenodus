import type { EmpresaParceira } from "../lib/supabase";

/**
 * Três esteiras horizontais infinitas. A linha de cada logo é escolhida
 * no painel (campo "linha"), não inferida por posição — assim o que se
 * vê no admin bate exatamente com o que aparece no site.
 */
export default function LogoMarquee({ empresas }: { empresas: EmpresaParceira[] }) {
  const linhas: EmpresaParceira[][] = [
    empresas.filter((e) => e.linha === 1),
    empresas.filter((e) => e.linha === 2),
    empresas.filter((e) => e.linha === 3),
  ];

  const direcoes: ("right" | "left" | "right")[] = ["right", "left", "right"];

  return (
    <div className="flex flex-col gap-8">
      <style>{`
        @keyframes nodus-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
      {linhas.map((linha, i) => {
        if (linha.length === 0) return null;
        const dobrada = [...linha, ...linha];
        const duracao = Math.max(linha.length * 5, 14);
        return (
          <div key={i} className="overflow-hidden">
            <div
              className="flex items-center gap-14 w-max hover:[animation-play-state:paused]"
              style={{
                animation: `nodus-marquee ${duracao}s linear infinite`,
                animationDirection: direcoes[i] === "right" ? "reverse" : "normal",
              }}
            >
              {dobrada.map((e, j) => (
                <img
                  key={`${e.id}-${j}`}
                  src={e.logo_url}
                  alt={e.nome}
                  decoding="async"
                  style={{ height: e.tamanho_px }}
                  className="w-auto object-contain shrink-0"
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
