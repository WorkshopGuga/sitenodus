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

export type FormatoVideo = "quadrado" | "vertical" | "horizontal";

const LIMITE_VIDEO_MB = 50;

/** Lê as dimensões do vídeo no navegador e sugere o formato (o admin pode trocar). */
function detectarFormato(arquivo: File): Promise<FormatoVideo | null> {
  return new Promise((resolve) => {
    const v = document.createElement("video");
    const url = URL.createObjectURL(arquivo);
    v.preload = "metadata";
    v.muted = true;
    v.onloadedmetadata = () => {
      const r = v.videoWidth / v.videoHeight;
      URL.revokeObjectURL(url);
      resolve(!isFinite(r) ? null : r > 1.2 ? "horizontal" : r < 0.8 ? "vertical" : "quadrado");
    };
    v.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    v.src = url;
  });
}

/** Upload de vídeo (mp4/webm) para um bucket público. Devolve a URL e o formato detectado. */
export function UploadVideo({
  bucket, valor, onChange,
}: {
  bucket: string; valor: string | null;
  onChange: (url: string | null, formato: FormatoVideo | null) => void;
}) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  const enviar = async (arquivo: File) => {
    setErro("");
    if (!["video/mp4", "video/webm"].includes(arquivo.type)) { setErro("Use um arquivo .mp4 ou .webm."); return; }
    if (arquivo.size > LIMITE_VIDEO_MB * 1024 * 1024) {
      setErro(`Máximo de ${LIMITE_VIDEO_MB} MB (este tem ${(arquivo.size / 1048576).toFixed(0)} MB). Comprima o vídeo antes de enviar.`);
      return;
    }
    setEnviando(true);
    try {
      const formato = await detectarFormato(arquivo);
      const ext = arquivo.type === "video/webm" ? "webm" : "mp4";
      const nome = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(nome, arquivo, { upsert: false, contentType: arquivo.type });
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(nome);
      onChange(data.publicUrl, formato ?? "quadrado");
    } catch (e: any) {
      setErro(e?.message ?? "Erro ao enviar vídeo");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div>
      {valor && (
        <video src={valor} controls playsInline preload="metadata"
          className="mb-3 max-h-[220px] max-w-full rounded-lg border border-white/12 bg-black" />
      )}
      <div className="flex items-center gap-3 flex-wrap">
        <label className="inline-block px-3.5 py-2 rounded-lg bg-white/[.06] border border-white/12 text-white/75 text-[13.5px] cursor-pointer hover:bg-white/10 transition-colors">
          {enviando ? "Enviando…" : valor ? "Trocar vídeo" : "Enviar vídeo"}
          <input type="file" accept="video/mp4,video/webm" className="hidden" disabled={enviando}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) enviar(f); e.target.value = ""; }} />
        </label>
        {valor && !enviando && (
          <button type="button" onClick={() => onChange(null, null)}
            className="text-red-300 text-[13px] underline">Remover vídeo</button>
        )}
      </div>
      <p className="mt-2 mb-0 text-white/35 text-[12px]">mp4 ou webm, até {LIMITE_VIDEO_MB} MB. O formato é detectado sozinho.</p>
      {erro && <p className="text-red-400 text-[12.5px] mt-1.5 mb-0">{erro}</p>}
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
