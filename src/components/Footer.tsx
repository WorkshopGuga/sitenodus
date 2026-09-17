import { Link } from "react-router-dom";
import logo from "../assets/nodus-horizontal-branco.png";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-white/[.07] px-5 md:px-10 pt-14 pb-10">
      <div className="max-w-content mx-auto grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img src={logo} alt="nodus tecnologia" className="h-8 w-auto opacity-90" />
          <p className="mt-5 text-white/45 text-[14px] leading-relaxed max-w-[300px] font-light">
            Entramos na operação, encontramos onde gente boa está fazendo trabalho
            de máquina, e resolvemos.
          </p>
        </div>

        <div>
          <p className="text-white text-[14px] font-medium">Frentes</p>
          <ul className="mt-4 space-y-2.5">
            {[
              ["/desenvolvimento", "Desenvolvimento"],
              ["/diagnostico", "Diagnóstico"],
              ["/capacitacao", "Capacitação"],
              ["/marketing", "Marketing"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-white/50 hover:text-white text-[14px] transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-white text-[14px] font-medium">Empresa</p>
          <ul className="mt-4 space-y-2.5">
            <li><Link to="/cases" className="text-white/50 hover:text-white text-[14px] transition-colors">Cases</Link></li>
            <li><Link to="/blog" className="text-white/50 hover:text-white text-[14px] transition-colors">Blog</Link></li>
            <li><Link to="/contato" className="text-white/50 hover:text-white text-[14px] transition-colors">Contato</Link></li>
            <li><Link to="/privacidade" className="text-white/50 hover:text-white text-[14px] transition-colors">Privacidade</Link></li>
            <li>
              <a href="https://gustavobettiol.com" target="_blank" rel="noreferrer"
                 className="text-white/50 hover:text-white text-[14px] transition-colors">
                Gustavo Bettiol
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-content mx-auto mt-12 pt-7 border-t border-white/[.07] flex flex-wrap gap-4 justify-between items-center">
        <p className="text-white/35 text-[13px] m-0">
          Caxias do Sul, RS · somosnodus.com
        </p>
        <a href="https://instagram.com/nodustecnologiabr" target="_blank" rel="noreferrer"
           className="text-white/35 hover:text-white text-[13px] transition-colors">
          @nodustecnologiabr
        </a>
        <a href="https://www.linkedin.com/company/nodustecnologia/" target="_blank" rel="noreferrer"
           className="text-white/35 hover:text-white text-[13px] transition-colors">
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
