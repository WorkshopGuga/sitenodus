import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import logo from "../assets/nodus-horizontal-branco.png";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav("/admin", { replace: true });
    });
  }, [nav]);

  const entrar = async () => {
    setCarregando(true); setErro("");
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setCarregando(false);
    if (error) setErro("E-mail ou senha incorretos.");
    else nav("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-ink grid place-items-center px-5">
      <div className="w-full max-w-[380px]">
        <img src={logo} alt="nodus tecnologia" className="h-8 w-auto mx-auto" />
        <p className="text-center text-white/50 text-[14px] mt-5">Painel interno</p>

        <div className="mt-8 grid gap-3">
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail" autoComplete="email"
            className="w-full bg-white/[.05] border border-white/12 rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-white/35 focus:border-accent outline-none"
          />
          <input
            type="password" value={senha} onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && entrar()}
            placeholder="Senha" autoComplete="current-password"
            className="w-full bg-white/[.05] border border-white/12 rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-white/35 focus:border-accent outline-none"
          />
          <button
            onClick={entrar} disabled={carregando || !email || !senha}
            className="mt-1 px-7 py-3.5 rounded-xl bg-gradient-to-br from-accent to-accent-deep text-white text-[15px] font-medium disabled:opacity-40"
          >
            {carregando ? "Entrando…" : "Entrar"}
          </button>
          {erro && <p className="text-red-400 text-[14px] text-center m-0">{erro}</p>}
        </div>
      </div>
    </div>
  );
}
