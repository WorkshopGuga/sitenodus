import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import logo from "../assets/nodus-horizontal-branco.png";

const ABAS = [
  { to: "/admin/empresas", label: "Empresas" },
  { to: "/admin/depoimentos", label: "Depoimentos" },
  { to: "/admin/cases", label: "Cases" },
  { to: "/admin/galeria", label: "Galeria" },
  { to: "/admin/blog", label: "Blog" },
];

export default function AdminLayout() {
  const nav = useNavigate();
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) nav("/admin/login", { replace: true });
      else setPronto(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) nav("/admin/login", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [nav]);

  if (!pronto) return <div className="min-h-screen bg-ink" />;

  return (
    <div className="min-h-screen bg-ink text-white">
      <header className="border-b border-white/[.08] px-5 md:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-5">
          <img src={logo} alt="nodus" className="h-7 w-auto" />
          <span className="text-white/40 text-[13px]">Painel interno</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-white/50 hover:text-white text-[13.5px]">Ver site</Link>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-white/50 hover:text-white text-[13.5px]"
          >
            Sair
          </button>
        </div>
      </header>

      <nav className="border-b border-white/[.08] px-5 md:px-8 flex gap-1 overflow-x-auto">
        {ABAS.map((a) => (
          <NavLink
            key={a.to} to={a.to}
            className={({ isActive }) =>
              `px-4 py-3.5 text-[14px] whitespace-nowrap border-b-2 transition-colors ${
                isActive ? "border-accent text-white" : "border-transparent text-white/50 hover:text-white"
              }`
            }
          >
            {a.label}
          </NavLink>
        ))}
      </nav>

      <main className="px-5 md:px-8 py-8 max-w-[1100px]">
        <Outlet />
      </main>
    </div>
  );
}
