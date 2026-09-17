import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <section className="bg-ink min-h-[70vh] grid place-items-center px-5 text-center pt-24">
        <div>
          <p className="text-accent text-[14px] font-medium m-0">Erro 404</p>
          <h1 className="mt-4 text-white font-semibold text-[clamp(28px,4.4vw,48px)] tracking-[-.028em] m-0">
            Esta página não existe.
          </h1>
          <Link to="/" className="inline-block mt-8 px-7 py-3.5 rounded-full bg-gradient-to-br from-accent to-accent-deep text-white text-[15px] font-medium no-underline">
            Voltar para o início
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
