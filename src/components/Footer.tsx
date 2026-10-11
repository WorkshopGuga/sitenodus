import { Link } from "react-router-dom";
import logo from "../assets/nodus-horizontal-branco.png";

const linkCls = "inline-block py-1 text-white/55 hover:text-white text-[13.5px] transition-colors";
const tituloCls = "m-0 text-white/90 text-[10px] font-bold uppercase tracking-[.2em]";

export default function Footer() {
  return (
    <footer className="bg-ink border-t border-white/[.13] px-5 md:px-10 pt-16 pb-10">
      <div className="max-w-content mx-auto grid gap-12 grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-1">
          <img src={logo} alt="nodus tecnologia" className="h-8 w-auto opacity-90" />
          <p className="mt-6 text-white/50 text-[14px] leading-[1.8] max-w-[320px]">
            Entramos na operação, encontramos onde gente boa está fazendo trabalho de máquina, e resolvemos.
          </p>
        </div>

        <div>
          <p className={tituloCls}>Frentes</p>
          <ul className="mt-5 p-0 list-none space-y-1.5">
            {[
              ["/desenvolvimento", "Desenvolvimento"],
              ["/diagnostico", "Diagnóstico"],
              ["/capacitacao", "Capacitação"],
              ["/marketing", "Marketing"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className={linkCls}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={tituloCls}>Empresa</p>
          <ul className="mt-5 p-0 list-none space-y-1.5">
            <li>
              <Link to="/cases" className={linkCls}>
                Cases
              </Link>
            </li>
            <li>
              <Link to="/blog" className={linkCls}>
                Blog
              </Link>
            </li>
            <li>
              <Link to="/contato" className={linkCls}>
                Contato
              </Link>
            </li>
            <li>
              <Link to="/privacidade" className={linkCls}>
                Privacidade
              </Link>
            </li>
            <li>
              <a href="https://gustavobettiol.com" target="_blank" rel="noreferrer" className={linkCls}>
                Gustavo Bettiol
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-content mx-auto mt-14 pt-7 border-t border-white/[.13] flex flex-wrap gap-x-8 gap-y-3 justify-between items-center">
        <p className="text-[#79869d] text-[11px] tracking-[.04em] m-0 w-full md:w-auto">
          Caxias do Sul e Torres, RS, Brasil · somosnodus.com
        </p>
        <div className="flex gap-x-7 gap-y-1 flex-wrap">
          <a
            href="https://instagram.com/nodustecnologiabr"
            target="_blank"
            rel="noreferrer"
            className="py-2 text-[#79869d] hover:text-white text-[11px] tracking-[.04em] transition-colors"
          >
            @nodustecnologiabr
          </a>
          <a
            href="https://www.linkedin.com/company/nodustecnologia/"
            target="_blank"
            rel="noreferrer"
            className="py-2 text-[#79869d] hover:text-white text-[11px] tracking-[.04em] transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
