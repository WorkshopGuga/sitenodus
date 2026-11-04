import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSeo } from "../lib/useSeo";

/**
 * Página somosnodus.com/brinde
 * Colar em src/pages/Brinde.tsx e registrar a rota "/brinde" no router.
 * Usa o mesmo Navbar (com o logo) e o mesmo Footer da Home.
 *
 * Preencher: FOTOS (urls das fotos da fotógrafa; se ficar vazio, a seção some).
 */

const WHATSAPP_NUMBER = "5554981482271";
const WHATSAPP_TEXT = "Oi, recebi a cerveja da Nodus Tecnologia e quero conversar.";

const VIDEO_BASE = "https://res.cloudinary.com/dkfbcca0b/video/upload";
const VIDEO_ID = "v1793378268/video_cerveja_nodus_t1piil";
const VIDEO_SRC = `${VIDEO_BASE}/q_auto/${VIDEO_ID}.mp4`;
const VIDEO_POSTER = `${VIDEO_BASE}/so_2,f_jpg,q_auto/${VIDEO_ID}.jpg`;

const FOTOS: string[] = [];

const FICHA = {
  estilo: "Witbier",
  teor: "4,2%",
  ingredientes: "Água, Malte, Lúpulo, levedura, casca de laranja, casca de limão e coentro",
  recomendacoes: ["Manter refrigerada, na vertical", "Não agitar"],
};

const PAPER = "#FAF8F9";
const BLUE = "#1D4ED8";
const SKY = "#5B9CF6";

export default function Brinde() {
  useSeo({
    titulo: "Feche os olhos. O que você descobre? — Nodus Tecnologia",
    descricao:
      "A história da cerveja que a Nodus Tecnologia fez com as próprias mãos, e o que ela diz sobre o nosso trabalho sob medida.",
    caminho: "/brinde",
  });

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

  return (
    <>
      <Navbar floating />

      {/* Topo */}
      <section className="bg-ink text-white bg-[radial-gradient(1100px_620px_at_78%_20%,rgba(39,85,196,.32),transparent_65%)]">
        <div className="mx-auto max-w-5xl px-5 md:px-10 pt-32 pb-16 md:pt-40 md:pb-24">
          <h1 className="m-0 max-w-3xl font-bold text-[clamp(38px,6vw,76px)] leading-[1.04] tracking-[-.05em]">
            Feche os olhos.
            <br />O que você descobre?
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.7] text-white/75">
            Esta cerveja foi feita por nós, com as nossas próprias mãos. Aqui está a história.
          </p>

          <div className="mt-12 overflow-hidden rounded-2xl bg-black" style={{ boxShadow: `0 0 0 1px ${BLUE}` }}>
            <video
              className="aspect-video w-full object-cover"
              controls
              playsInline
              preload="metadata"
              poster={VIDEO_POSTER}
              aria-label="Vídeo: como nasceu a cerveja da Nodus Tecnologia"
            >
              <source src={VIDEO_SRC} type="video/mp4" />
              Seu navegador não conseguiu reproduzir o vídeo.
            </video>
          </div>
        </div>
      </section>

      {/* Ficha da cerveja (em destaque) */}
      <section className="px-5 md:px-10 pt-16 md:pt-24" style={{ background: PAPER }}>
        <div
          className="mx-auto max-w-5xl text-ink"
          style={{
            border: `2px solid ${BLUE}`,
            boxShadow: `inset 0 0 0 8px ${PAPER}, inset 0 0 0 9px ${SKY}`,
          }}
        >
          <div className="grid gap-0 px-8 py-10 sm:px-12 md:grid-cols-[1.1fr_1.4fr_1.1fr] md:gap-10">
            <div>
              <p className="m-0 text-[12px] font-bold uppercase tracking-[.18em]" style={{ color: BLUE }}>
                Cerveja artesanal
              </p>
              <p className="mt-3 mb-0 text-[clamp(34px,4.4vw,52px)] font-bold leading-none tracking-[-.05em]">
                {FICHA.estilo}
              </p>
              <p className="mt-4 mb-0 text-[15px] leading-snug">
                Teor alcoólico <span className="font-bold">{FICHA.teor}</span>
              </p>
            </div>
            <div
              className="mt-8 border-t pt-8 md:mt-0 md:border-l md:border-t-0 md:pl-10 md:pt-0"
              style={{ borderColor: SKY }}
            >
              <p className="m-0 text-[12px] font-bold uppercase tracking-[.18em]" style={{ color: BLUE }}>
                Ingredientes
              </p>
              <p className="mt-3 mb-0 text-[16.5px] leading-[1.65]">{FICHA.ingredientes}</p>
            </div>
            <div
              className="mt-8 border-t pt-8 md:mt-0 md:border-l md:border-t-0 md:pl-10 md:pt-0"
              style={{ borderColor: SKY }}
            >
              <p className="m-0 text-[12px] font-bold uppercase tracking-[.18em]" style={{ color: BLUE }}>
                Para uma melhor experiência
              </p>
              <ul className="mt-3 mb-0 list-none space-y-1.5 p-0 text-[16.5px] leading-[1.5]">
                {FICHA.recomendacoes.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* História */}
      <section className="px-5 md:px-10 py-16 md:py-24" style={{ background: PAPER }}>
        <div
          className="mx-auto max-w-2xl px-8 py-12 sm:px-14 sm:py-16 text-ink"
          style={{
            background: PAPER,
            border: `2px solid ${BLUE}`,
            boxShadow: `inset 0 0 0 10px ${PAPER}, inset 0 0 0 11px ${SKY}`,
          }}
        >
          <h2 className="m-0 text-[clamp(26px,3.6vw,38px)] font-bold leading-[1.15] tracking-[-.04em]">
            Toda boa cerveja tem uma base: água, malte, trigo.
          </h2>
          <div className="mt-8 space-y-5 text-[16.5px] leading-[1.75]">
            <p className="m-0">
              Mas o que faz ela ser lembrada são as especiarias. Nesta witbier, são três: coentro, casca de laranja e
              casca de limão. Você não vê, mas sente.
            </p>
            <p className="m-0">
              Na Nodus Tecnologia é igual. A base é construir algo que funcione de verdade. O que faz a diferença é o
              que a gente coloca a mais: experiência e visão para criar algo que ninguém tem igual.
            </p>
            <p className="m-0">Por isso, em vez de comprar um brinde pronto, a gente preferiu fazer o nosso.</p>
          </div>
        </div>
      </section>

      {/* Bastidores (some se não houver fotos) */}
      {FOTOS.length > 0 && (
        <section className="px-5 md:px-10 pb-16 md:pb-24" style={{ background: PAPER }}>
          <div className="mx-auto max-w-5xl text-ink">
            <h2 className="m-0 text-[clamp(24px,3vw,34px)] font-bold tracking-[-.04em]">Como nasceu esta cerveja</h2>
            <p className="mt-3 max-w-xl leading-[1.7] text-ink/70">
              Do malte à garrafa, tudo feito pela nossa equipe. Alguns momentos do processo.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {FOTOS.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`Bastidores da produção da cerveja, foto ${i + 1}`}
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-lg object-cover"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sob medida */}
      <section className="px-5 md:px-10 pb-16 md:pb-24" style={{ background: PAPER }}>
        <div className="mx-auto max-w-2xl text-ink">
          <h2 className="m-0 text-[clamp(24px,3vw,34px)] font-bold tracking-[-.04em]">
            O que isso diz sobre o nosso trabalho
          </h2>
          <p className="mt-4 text-[16.5px] leading-[1.75]">
            Fazemos sob medida: entendemos como a sua empresa funciona e construímos o que ela precisa, do zero. Uma
            cerveja, um sistema, uma automação. A lógica é a mesma.
          </p>
        </div>
      </section>

      {/* Convite */}
      <section className="bg-ink bg-[radial-gradient(800px_420px_at_50%_0%,rgba(39,85,196,.34),transparent_70%)] px-5 md:px-10 py-20 md:py-32 text-center text-white">
        <h2 className="mx-auto m-0 max-w-[760px] font-bold text-[clamp(30px,4.6vw,58px)] leading-[1.06] tracking-[-.05em]">
          Como podemos criar a especiaria do seu negócio, juntos?
        </h2>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block rounded-full px-8 py-4 text-[16px] font-bold no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          style={{ background: SKY, color: "#0D0D1A" }}
        >
          Conversar no WhatsApp
        </a>
        <p className="mx-auto mt-14 mb-0 text-[12px] text-white/50">
          Aprecie com moderação. Venda proibida para menores de 18 anos.
        </p>
      </section>

      <Footer />
    </>
  );
}
