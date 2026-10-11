import { useEffect, useRef, useState } from "react";
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
  const barra = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (floating) setSolid(window.scrollY > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barra.current) barra.current.style.width = max > 0 ? `${Math.min(100, (window.scrollY / max) * 100)}%` : "0%";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [floating]);

  // trava o scroll do fundo enquanto o menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`${floating ? "fixed" : "sticky"} top-0 inset-x-0 z-50 transition-colors duration-300 ${
        solid || open ? "bg-ink/80 backdrop-blur-xl border-b border-white/[.06]" : ""
      }`}
    >
      <div ref={barra} aria-hidden className="absolute top-0 left-0 h-[2px] w-0 bg-[#7f9eff]" />
      <div className="max-w-content mx-auto flex items-center justify-between px-5 md:px-10 py-4 md:py-5">
        <Link to="/" aria-label="nodus tecnologia" onClick={() => setOpen(false)}>
          <img src={logo} alt="nodus tecnologia" className="h-7 md:h-8 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-[12px] transition-colors ${isActive ? "text-white" : "text-[#b9c0cd] hover:text-white"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/contato"
            className="text-[12px] text-white px-[19px] py-[11px] rounded-full border border-white/[.22] hover:bg-white/[.06] transition-colors"
          >
            Falar com a gente
          </Link>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="menu-mobile"
          className="lg:hidden -mr-2 w-11 h-11 grid place-items-center"
        >
          <span
            className={`relative block w-5 h-[2px] transition-colors ${open ? "bg-transparent" : "bg-white"} before:content-[''] before:absolute before:left-0 before:w-5 before:h-[2px] before:bg-white before:transition-transform after:content-[''] after:absolute after:left-0 after:w-5 after:h-[2px] after:bg-white after:transition-transform ${
              open ? "before:top-0 before:rotate-45 after:top-0 after:-rotate-45" : "before:-top-[6px] after:top-[6px]"
            }`}
          />
        </button>
      </div>

      {open && (
        <div
          id="menu-mobile"
          className="lg:hidden bg-ink border-t border-white/[.06] px-5 pt-2 pb-8 h-[calc(100svh-64px)] overflow-y-auto"
        >
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between py-[18px] text-white text-[19px] font-bold tracking-[-.03em] border-b border-white/[.08]"
            >
              {l.label}
              <span aria-hidden className="text-accent text-[18px] font-normal">→</span>
            </Link>
          ))}
          <Link
            to="/contato"
            onClick={() => setOpen(false)}
            className="mt-7 flex items-center justify-between min-h-[52px] px-[22px] rounded-[5px] bg-[#e9eefc] text-[#0b1020] text-[13px] font-bold"
          >
            <span>Falar com a gente</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </header>
  );
}
