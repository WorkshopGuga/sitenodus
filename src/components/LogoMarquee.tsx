import type { EmpresaParceira } from "../lib/supabase";

/**
 * Três esteiras horizontais infinitas, cada uma correndo num sentido
 * (direita, esquerda, direita). Cada linha duplica a própria lista de
 * logos lado a lado — é isso que faz o loop parecer contínuo, sem salto
 * quando a esteira reinicia.
 */
export default function LogoMarquee({ empresas }: { empresas: EmpresaParceira[] }) {
  const linhas: EmpresaParceira[][] = [[], [], []];
  empresas.forEach((e, i) => linhas[i % 3].push(e));

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
