import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import { PageHero } from "../components/ui";
import { useSeo } from "../lib/useSeo";

const WHATSAPP = "https://wa.me/5554981482271";
const EMAIL = "gustavo@somosnodus.com";

const SEDES = [
  { nome: "Sede 1", endereco: "Rua Roque Callage, 87", cidade: "Caxias do Sul, RS" },
  { nome: "Sede 2", endereco: "Rua Bento Gonçalves, 165", cidade: "Torres, RS" },
];

export default function Contato() {
  useSeo({
    titulo: "Contato — nodus tecnologia | Caxias do Sul e Torres, RS",
    descricao:
      "Uma conversa de 30 minutos costuma ser suficiente para descobrir onde sua equipe está fazendo trabalho de máquina. Atendimento remoto, escritórios no RS.",
    caminho: "/contato",
  });

  const [form, setForm] = useState({ nome: "", email: "", telefone: "", empresa: "", mensagem: "" });
  const [aceite, setAceite] = useState(false);
  const [estado, setEstado] = useState<"idle" | "enviando" | "ok" | "erro">("idle");

  const campo = (k: string) => ({
    value: (form as any)[k],
    onChange: (e: any) => setForm({ ...form, [k]: e.target.value }),
    className:
      "w-full bg-white border border-ink/15 rounded-xl px-4 py-3 text-[15px] text-ink placeholder:text-ink/35 focus:border-accent-deep outline-none transition-colors",
  });

  const enviar = async () => {
    if (!form.nome.trim() || !aceite) return;
    setEstado("enviando");
    const { error } = await supabase.from("leads_site").insert({
      ...form,
      origem: "contato",
      consentiu_privacidade: true,
    });
    setEstado(error ? "erro" : "ok");
  };

  return (
    <>
      <Navbar />
      <PageHero
        eyebrow="Contato"
        titulo="Onde sua equipe está fazendo trabalho de máquina?"
        texto="Uma conversa de 30 minutos costuma ser suficiente para descobrir. Sem apresentação, sem proposta pronta — só entender a sua operação."
      />

      {/* ---------- SEDES ---------- */}
      <section className="bg-ink px-5 md:px-10 py-20 md:py-28">
        <div className="max-w-content mx-auto">
          <p className="m-0 text-accent text-[14px] font-medium">Onde estamos</p>
          <h2 className="mt-4 mb-0 text-white font-semibold text-[clamp(26px,3.6vw,42px)] leading-[1.12] tracking-[-.026em] max-w-[640px]">
            Atendimento remoto, onde sua empresa estiver — com endereço físico em dois pontos.
          </h2>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {SEDES.map((s) => (
              <div key={s.nome} className="rounded-[20px] border border-white/[.08] bg-white/[.03] p-7">
                <p className="m-0 text-accent text-[13px] font-medium">{s.nome}</p>
                <p className="mt-3 mb-0 text-white text-[17px] font-medium">{s.endereco}</p>
                <p className="mt-1 mb-0 text-white/50 text-[15px]">{s.cidade}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3">
            <a href={WHATSAPP} target="_blank" rel="noreferrer"
               className="text-white/70 hover:text-white text-[15px] transition-colors">
              (54) 98148-2271
            </a>
            <a href={`mailto:${EMAIL}`} className="text-white/70 hover:text-white text-[15px] transition-colors">
              {EMAIL}
            </a>
          </div>
        </div>
      </section>

      <section className="bg-paper text-ink px-5 md:px-10 py-20 md:py-28">
        <div className="max-w-[560px] mx-auto">
          {estado === "ok" ? (
            <div className="text-center py-14">
              <p className="text-ink text-[22px] font-semibold m-0">Recebemos sua mensagem.</p>
              <p className="text-ink/60 text-[15.5px] mt-3 font-light">
                Retornamos em até um dia útil. Se preferir adiantar, chame no WhatsApp.
              </p>
              <a href={WHATSAPP} target="_blank" rel="noreferrer"
                 className="inline-block mt-7 px-7 py-3.5 rounded-full bg-gradient-to-br from-accent to-accent-deep text-white text-[15px] font-medium no-underline">
                Falar no WhatsApp
              </a>
            </div>
          ) : (
            <div className="grid gap-4">
              <input {...campo("nome")} placeholder="Seu nome" />
              <input {...campo("email")} type="email" placeholder="E-mail" />
              <input {...campo("telefone")} placeholder="WhatsApp" />
              <input {...campo("empresa")} placeholder="Empresa" />
              <textarea {...campo("mensagem")} rows={4} placeholder="O que está travando hoje?" />

              <label className="flex items-start gap-2.5 text-ink/60 text-[13.5px] leading-[1.5] cursor-pointer">
                <input
                  type="checkbox"
                  checked={aceite}
                  onChange={(e) => setAceite(e.target.checked)}
                  className="mt-0.5 shrink-0"
                />
                <span>
                  Li e concordo com a{" "}
                  <Link to="/privacidade" target="_blank" className="text-accent-deep underline">
                    Política de Privacidade
                  </Link>
                  . Uso meus dados só para responder este contato.
                </span>
              </label>

              <button
                onClick={enviar}
                disabled={estado === "enviando" || !form.nome.trim() || !aceite}
                className="mt-2 px-7 py-4 rounded-full bg-gradient-to-br from-accent to-accent-deep text-white text-[15px] font-medium disabled:opacity-45 transition-opacity"
              >
                {estado === "enviando" ? "Enviando…" : "Enviar"}
              </button>

              {estado === "erro" && (
                <p className="text-[14px] text-red-600 m-0">
                  Não consegui enviar agora. Tente de novo ou chame no WhatsApp.
                </p>
              )}

              <p className="text-center text-ink/45 text-[14px] mt-2">
                Prefere conversar direto?{" "}
                <a href={WHATSAPP} target="_blank" rel="noreferrer" className="text-accent-deep">
                  Chamar no WhatsApp
                </a>
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
