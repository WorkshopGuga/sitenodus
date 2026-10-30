import { useEffect } from "react";

/**
 * Página somosnodus.com/brinde
 * Para colar no Lovable: src/pages/Brinde.tsx (export default)
 * e registrar a rota "/brinde" no router do projeto.
 *
 * Preencha antes de publicar:
 *  - public/logo-nodus-branco.png (arquivo do logo, na pasta public do projeto)
 *  - WHATSAPP_NUMBER (formato 55 + DDD + número, só dígitos)
 *  - FOTOS (urls das fotos da fotógrafa; se ficar vazio, a seção some)
 */

const WHATSAPP_NUMBER = "55XXXXXXXXXXX";
const WHATSAPP_TEXT = "Oi, recebi a cerveja da Nodus Tecnologia e quero conversar.";

const VIDEO_BASE = "https://res.cloudinary.com/dkfbcca0b/video/upload";
const VIDEO_ID = "v1793378268/video_cerveja_nodus_t1piil";
const VIDEO_SRC = `${VIDEO_BASE}/q_auto/${VIDEO_ID}.mp4`;
const VIDEO_POSTER = `${VIDEO_BASE}/so_2,f_jpg,q_auto/${VIDEO_ID}.jpg`;

const FOTOS: string[] = [];

const C = {
  night: "#0D0D1A",
  paper: "#FAF8F9",
  ink: "#1A1A2E",
  sky: "#5B9CF6",
  blue: "#1D4ED8",
};

export default function Brinde() {
  useEffect(() => {
    document.title = "feche os olhos. o que você descobre? | nodus tecnologia";
    const id = "poppins-font";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

  return (
    <div
      className="min-h-screen"
      style={{ fontFamily: "'Poppins', system-ui, sans-serif", background: C.paper, color: C.ink }}
    >
      {/* Topo */}
      <section style={{ background: C.night, color: C.paper }}>
        <div className="mx-auto max-w-5xl px-6 pb-16 pt-8 sm:pb-24">
          <img src="/logo-nodus-branco.png" alt="nodus tecnologia" className="mb-14 h-20 w-auto sm:mb-20 sm:h-24" />

          <h1 className="max-w-3xl text-[clamp(2.25rem,6.5vw,4.75rem)] font-semibold leading-[1.05] tracking-tight">
            feche os olhos.
            <br />o que você descobre?
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed opacity-80">
            esta cerveja foi feita por nós, com as nossas próprias mãos. aqui está a história.
          </p>

          <div
            className="mt-12 overflow-hidden rounded-2xl"
            style={{ boxShadow: `0 0 0 1px ${C.blue}`, background: "#000" }}
          >
            <video
              className="aspect-video w-full object-cover"
              controls
              playsInline
              preload="metadata"
              poster={VIDEO_POSTER}
              aria-label="vídeo: como nasceu a cerveja da Nodus Tecnologia"
            >
              <source src={VIDEO_SRC} type="video/mp4" />
              seu navegador não conseguiu reproduzir o vídeo.
            </video>
          </div>
        </div>
      </section>

      {/* História */}
      <section className="px-6 py-16 sm:py-24">
        <div
          className="mx-auto max-w-2xl px-8 py-12 sm:px-14 sm:py-16"
          style={{
            background: C.paper,
            border: `2px solid ${C.blue}`,
            boxShadow: `inset 0 0 0 10px ${C.paper}, inset 0 0 0 11px ${C.sky}`,
          }}
        >
          <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            toda boa cerveja tem uma base: água, malte, trigo.
          </h2>
          <div className="mt-8 space-y-5 text-[1.05rem] leading-[1.75]">
            <p>
              mas o que faz ela ser lembrada são as especiarias. nesta witbier, são duas: coentro e casca de limão. você
              não vê, mas sente.
            </p>
            <p>
              na Nodus Tecnologia é igual. a base é construir algo que funcione de verdade. o que faz a diferença é o
              que a gente coloca a mais: experiência e visão para criar algo que ninguém tem igual.
            </p>
            <p>por isso, em vez de comprar um brinde pronto, a gente preferiu fazer o nosso.</p>
          </div>
        </div>
      </section>

      {/* Bastidores (some se não houver fotos) */}
      {FOTOS.length > 0 && (
        <section className="px-6 pb-16 sm:pb-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">como nasceu esta cerveja</h2>
            <p className="mt-3 max-w-xl leading-relaxed opacity-80">
              do malte à garrafa, tudo feito pela nossa equipe. alguns momentos do processo.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {FOTOS.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`bastidores da produção da cerveja, foto ${i + 1}`}
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-lg object-cover"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sob medida */}
      <section className="px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">o que isso diz sobre o nosso trabalho</h2>
          <p className="mt-4 text-[1.05rem] leading-[1.75]">
            fazemos sob medida: entendemos como a sua empresa funciona e construímos o que ela precisa, do zero. uma
            cerveja, um sistema, uma automação. a lógica é a mesma.
          </p>
        </div>
      </section>

      {/* Convite */}
      <section style={{ background: C.night, color: C.paper }}>
        <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-24">
          <h2 className="text-[clamp(1.75rem,4.5vw,3rem)] font-semibold leading-tight tracking-tight">
            como podemos criar a especiaria do seu negócio, juntos?
          </h2>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block rounded-full px-8 py-4 text-base font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{ background: C.sky, color: C.night, outlineColor: C.paper }}
          >
            conversar no WhatsApp
          </a>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="px-6 py-10 text-center text-sm" style={{ background: C.night, color: C.paper }}>
        <p className="opacity-70">Nodus Tecnologia · somosnodus.com · @nodus.corp</p>
        <p className="mt-3 text-xs opacity-60">aprecie com moderação. venda proibida para menores de 18 anos.</p>
      </footer>
    </div>
  );
}
