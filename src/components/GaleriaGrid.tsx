import Reveal from "./Reveal";
import type { GaleriaImagem } from "../lib/supabase";

/** Tira de fotos com bordas arredondadas e overlay sutil no hover —
 *  sem legenda visível, só alt para acessibilidade e SEO. */
export default function GaleriaGrid({ imagens }: { imagens: GaleriaImagem[] }) {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {imagens.map((g, i) => (
        <Reveal key={g.id} delay={(i % 4) * 70}>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
            <img
              src={g.imagem_url}
              alt={g.alt ?? g.titulo ?? ""}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Reveal>
      ))}
    </div>
  );
}
