import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <section className="bg-ink min-h-[70vh] grid place-items-center px-5 text-center pt-24">
        <div>
          <p className="m-0 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[.2em] text-white"><span aria-hidden className="w-[7px] h-[7px] rounded-full bg-accent shadow-[0_0_16px_#5a83ff]" />Erro 404</p>
          <h1 className="mt-4 text-white font-bold text-[clamp(34px,5vw,60px)] leading-[1.05] tracking-[-.06em] m-0">
            Esta página não existe.
          </h1>
          <Link to="/" className="inline-block mt-8 px-7 py-3.5 rounded-[5px] bg-[#e9eefc] text-[#0b1020] text-[13px] font-bold min-h-[50px] hover:bg-white no-underline">
            Voltar para o início
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
