import type { Depoimento } from "../lib/supabase";

/**
 * Carrossel horizontal automático, lento, sem paginação — mostra todos
 * os depoimentos, mesmo que sejam muitos. A lista dobra (duplicada) pra
 * o loop ficar contínuo, igual à esteira de logos.
 */
export default function DepoimentosCarrossel({
  depoimentos, tone = "dark",
}: { depoimentos: Depoimento[]; tone?: "dark" | "light" }) {
  if (depoimentos.length === 0) return null;

  const dark = tone === "dark";
  const cardBg = dark ? "bg-white/[.035] border-white/[.08]" : "bg-white border-ink/[.08]";
  const textCls = dark ? "text-white" : "text-ink";
  const cargoCls = dark ? "text-white/45" : "text-ink/45";

  const duracao = Math.max(depoimentos.length * 7, 22);
    // Divide em duas linhas só quando há volume — com poucos depoimentos,
  // duas fileiras ficam desequilibradas (ex: 2 em cima, 1 embaixo).
  const duasLinhas = depoimentos.length >= 8;
  const metade = Math.ceil(depoimentos.length / 2);
  const linhas = duasLinhas
    ? [depoimentos.slice(0, metade), depoimentos.slice(metade)]
    : [depoimentos];

  return (
    <div className="overflow-hidden">
      <style>{`
        @keyframes nodus-depoimentos-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
           {linhas.map((linha, li) => {
        const dobrado = [...linha, ...linha];
        return (
          <div
            key={li}
            className={`flex items-stretch gap-4 w-max hover:[animation-play-state:paused] ${li ? "mt-4" : ""}`}
            style={{
              animation: `nodus-depoimentos-scroll ${duracao}s linear infinite`,
              animationDirection: li === 1 ? "reverse" : "normal",
            }}
          >
            {dobrado.map((d, i) => (
              <figure
                key={`${d.id}-${i}`}
                className={`m-0 w-[300px] sm:w-[340px] shrink-0 p-7 rounded-[20px] border flex flex-col justify-between ${cardBg}`}
              >
                <blockquote className={`m-0 text-[15.5px] leading-[1.6] font-light ${textCls}`}>
                  {d.texto}
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3.5">
                  {d.foto_url ? (
                    <img src={d.foto_url} alt={d.autor} className="w-11 h-11 rounded-full object-cover border border-white/15 shrink-0" />
                  ) : (
                    <span className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-accent-deep grid place-items-center text-white text-[15px] font-medium shrink-0">
                      {d.autor.charAt(0)}
                    </span>
                  )}
                  <span>
                    <span className={`block text-[15px] font-medium ${textCls}`}>{d.autor}</span>
                    {d.cargo && <span className={`block text-[13.5px] ${cargoCls}`}>{d.cargo}</span>}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        );
      })}
    </div>
  );
}
