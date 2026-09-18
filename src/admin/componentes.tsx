import { ReactNode, useState } from "react";
import { supabase } from "../lib/supabase";
import { comprimirImagem } from "../lib/comprimirImagem";

export const input =
  "w-full bg-white/[.05] border border-white/12 rounded-lg px-3.5 py-2.5 text-[14.5px] text-white placeholder:text-white/30 focus:border-accent outline-none";

export function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-white/55 text-[13px] mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export function Botao({ children, onClick, tipo = "primario", disabled }:
  { children: ReactNode; onClick?: () => void; tipo?: "primario" | "secundario" | "perigo"; disabled?: boolean }) {
  const cls =
    tipo === "primario" ? "bg-gradient-to-br from-accent to-accent-deep text-white" :
    tipo === "perigo" ? "bg-red-500/15 text-red-300 border border-red-500/25 hover:bg-red-500/25" :
    "bg-white/[.06] text-white/75 border border-white/12 hover:bg-white/10";
  return (
    <button onClick={onClick} disabled={disabled}
      className={`px-4 py-2.5 rounded-lg text-[14px] font-medium transition-all disabled:opacity-40 ${cls}`}>
      {children}
    </button>
  );
}

export function Cartao({ children }: { children: ReactNode }) {
  return <div className="bg-white/[.03] border border-white/[.08] rounded-xl p-5">{children}</div>;
}

export function Cabecalho({ titulo, descricao, acao }:
  { titulo: string; descricao: string; acao?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap mb-7">
      <div>
        <h1 className="m-0 text-[24px] font-semibold tracking-[-.02em]">{titulo}</h1>
        <p className="mt-1.5 mb-0 text-white/50 text-[14px] font-light max-w-[560px]">{descricao}</p>
      </div>
      {acao}
    </div>
  );
}

/** Upload para um bucket do Storage, devolvendo a URL pública. A imagem é
 *  redimensionada e comprimida no navegador antes de subir — evita logo de
 *  3MB pra ser exibido em 40px de altura. Ajuste maxLargura/maxAltura
 *  conforme o tamanho real de exibição de cada uso. */
export function UploadImagem({
  bucket, valor, onChange, formato = "retangulo", maxLargura = 1600, maxAltura = 1600,
}: {
  bucket: string; valor: string | null; onChange: (url: string) => void;
  formato?: "retangulo" | "circulo"; maxLargura?: number; maxAltura?: number;
}) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  const enviar = async (arquivo: File) => {
    setEnviando(true); setErro("");
    try {
      const { blob, extensao, tipo } = await comprimirImagem(arquivo, { maxLargura, maxAltura });
      const nome = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensao}`;
      const { error } = await supabase.storage
        .from(bucket)
        .upload(nome, blob, { upsert: false, contentType: tipo || arquivo.type });
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(nome);
      onChange(data.publicUrl);
    } catch (e: any) {
      setErro(e?.message ?? "Erro ao enviar imagem");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className={`shrink-0 grid place-items-center bg-white/[.06] border border-white/12 overflow-hidden ${
        formato === "circulo" ? "w-16 h-16 rounded-full" : "w-24 h-16 rounded-lg"
      }`}>
        {valor
          ? <img src={valor} alt="" className="w-full h-full object-contain" />
          : <span className="text-white/25 text-[11px]">vazio</span>}
      </div>
      <div>
        <label className="inline-block px-3.5 py-2 rounded-lg bg-white/[.06] border border-white/12 text-white/75 text-[13.5px] cursor-pointer hover:bg-white/10 transition-colors">
          {enviando ? "Enviando…" : valor ? "Trocar imagem" : "Enviar imagem"}
          <input type="file" accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.[0] && enviar(e.target.files[0])} />
        </label>
        {erro && <p className="text-red-400 text-[12.5px] mt-1.5 mb-0">{erro}</p>}
      </div>
    </div>
  );
}

export function Vazio({ texto }: { texto: string }) {
  return (
    <div className="border border-dashed border-white/12 rounded-xl py-14 text-center">
      <p className="text-white/45 text-[14.5px] m-0">{texto}</p>
    </div>
  );
}
