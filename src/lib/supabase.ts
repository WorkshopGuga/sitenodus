import { createClient } from "@supabase/supabase-js";

/**
 * Chave pública (anon). Ela é enviada ao navegador de qualquer visitante,
 * então não é segredo — o que protege os dados são as policies de RLS
 * no banco. A service_role nunca deve aparecer aqui.
 *
 * O fallback existe para o site subir mesmo sem .env (import na Lovable,
 * por exemplo). Em produção, prefira definir as variáveis no provedor.
 */
const PADRAO_URL = "https://gavxiiuyglysdkzgrvve.supabase.co";
const PADRAO_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhdnhpaXV5Z2x5c2RremdydnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NjYyMzQsImV4cCI6MjEwNTA0MjIzNH0.CCjuEdLU2DGEWxwuYwp4VC2SDyqsepjQebS_X3_yJ8g";

const url = (import.meta.env.VITE_SUPABASE_URL as string) || PADRAO_URL;
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || PADRAO_ANON;

export const supabase = createClient(url, key);

/* ---------- tipos das tabelas ---------- */
export type EmpresaParceira = {
  id: string; nome: string; logo_url: string;
  site_url: string | null; tamanho_px: number; linha: number; ordem: number; ativo: boolean;
};

export type Depoimento = {
  id: string; texto: string; autor: string;
  cargo: string | null; foto_url: string | null;
  origem: string | null; tags_servico: string[]; ordem: number; ativo: boolean;
};

export type CaseItem = {
  id: string; setor: string; categoria: string | null; desafio: string; solucao: string;
  resultado: string; destaque: boolean; ordem: number; ativo: boolean;
};

export type GaleriaImagem = {
  id: string; titulo: string | null; imagem_url: string;
  alt: string | null; categoria: string | null; ordem: number; ativo: boolean;
};

export type BlogPost = {
  id: string; slug: string; titulo: string; resumo: string | null;
  conteudo: string | null; capa_url: string | null; autor: string | null;
  tags: string[] | null; status: "rascunho" | "publicado" | "arquivado";
  origem: "manual" | "n8n"; publicado_em: string | null;
  criado_em: string; atualizado_em: string;
};
