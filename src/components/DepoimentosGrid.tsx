import Reveal from "./Reveal";
import type { Depoimento } from "../lib/supabase";

/** Grade de cards de depoimento — reaproveitada na home e em qualquer
 *  frente que tenha depoimentos filtrados por origem (ex: Capacitação). */
export default function DepoimentosGrid({
  depoimentos, tone = "dark", limite = 3,
}: { depoimentos: Depoimento[]; tone?: "dark" | "light"; limite?: number }) {
  const dark = tone === "dark";
  const cardBg = dark ? "bg-white/[.035] border-white/[.08]" : "bg-white border-ink/[.08]";
  const textCls = dark ? "text-white" : "text-ink";
  const cargoCls = dark ? "text-white/45" : "text-ink/45";

  return (
    <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(270px,1fr))]">
      {depoimentos.slice(0, limite).map((d, i) => (
        <Reveal key={d.id} delay={i * 100}>
          <figure className={`m-0 h-full p-7 rounded-[20px] border flex flex-col justify-between ${cardBg}`}>
            <blockquote className={`m-0 text-[16px] leading-[1.6] font-light ${textCls}`}>{d.texto}</blockquote>
            <figcaption className="mt-7 flex items-center gap-3.5">
              {d.foto_url ? (
                <img src={d.foto_url} alt={d.autor} className="w-11 h-11 rounded-full object-cover border border-white/15" />
              ) : (
                <span className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-accent-deep grid place-items-center text-white text-[15px] font-medium">
                  {d.autor.charAt(0)}
                </span>
              )}
              <span>
                <span className={`block text-[15px] font-medium ${textCls}`}>{d.autor}</span>
                {d.cargo && <span className={`block text-[13.5px] ${cargoCls}`}>{d.cargo}</span>}
              </span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
