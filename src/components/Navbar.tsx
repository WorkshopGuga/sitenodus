import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/nodus-horizontal-branco.png";

const LINKS = [
  { to: "/desenvolvimento", label: "Desenvolvimento" },
  { to: "/diagnostico", label: "Diagnóstico" },
  { to: "/capacitacao", label: "Capacitação" },
  { to: "/marketing", label: "Marketing" },
  { to: "/cases", label: "Cases" },
];

export default function Navbar({ floating = false }: { floating?: boolean }) {
  const [solid, setSolid] = useState(!floating);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!floating) return;
    const onScroll = () => setSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [floating]);

  return (
    <header
      className={`${floating ? "fixed" : "sticky"} top-0 inset-x-0 z-50 transition-colors duration-300 ${
        solid ? "bg-ink/85 backdrop-blur border-b border-white/[.07]" : ""
      }`}
    >
      <div className="max-w-content mx-auto flex items-center justify-between px-5 md:px-10 py-5">
        <Link to="/" aria-label="nodus tecnologia">
          <img src={logo} alt="nodus tecnologia" className="h-8 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-[13.5px] transition-colors ${
                  isActive ? "text-white" : "text-white/60 hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/contato"
            className="text-[13.5px] font-medium text-white px-[18px] py-[9px] rounded-full border border-accent/45 bg-accent/10 hover:bg-accent/20 transition-colors"
          >
            Falar com a gente
          </Link>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          aria-label="Abrir menu"
          aria-expanded={open}
          className="lg:hidden w-10 h-10 grid place-items-center"
        >
          <span className="relative block w-5 h-[2px] bg-white before:content-[''] before:absolute before:-top-[6px] before:left-0 before:w-5 before:h-[2px] before:bg-white after:content-[''] after:absolute after:top-[6px] after:left-0 after:w-5 after:h-[2px] after:bg-white" />
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-ink border-t border-white/[.07] px-5 pb-6">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block py-3 text-white/75 text-[15px] border-b border-white/[.06]"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contato"
            onClick={() => setOpen(false)}
            className="inline-block mt-5 px-6 py-3 rounded-full bg-gradient-to-br from-accent to-accent-deep text-white text-[15px] font-medium"
          >
            Falar com a gente
          </Link>
        </div>
      )}
    </header>
  );
}
