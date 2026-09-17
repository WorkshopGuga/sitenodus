-- =====================================================
-- nodus tecnologia — schema do site institucional
-- Projeto: gavxiiuyglysdkzgrvve
-- Rode no SQL Editor do Supabase (de uma vez só)
-- =====================================================

-- -----------------------------------------------------
-- 1. EMPRESAS QUE CONFIAM (logotipos do site)
-- -----------------------------------------------------
create table if not exists public.empresas_parceiras (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  logo_url    text not null,
  site_url    text,
  ordem       int  not null default 0,
  ativo       boolean not null default true,
  criado_em   timestamptz not null default now()
);

create index if not exists empresas_parceiras_ordem_idx
  on public.empresas_parceiras (ativo, ordem);

-- -----------------------------------------------------
-- 2. GALERIA (fotos de treinamentos, bastidores, eventos)
-- -----------------------------------------------------
create table if not exists public.galeria_imagens (
  id          uuid primary key default gen_random_uuid(),
  titulo      text,
  imagem_url  text not null,
  alt         text,
  categoria   text,            -- ex: 'treinamento', 'evento', 'equipe'
  ordem       int  not null default 0,
  ativo       boolean not null default true,
  criado_em   timestamptz not null default now()
);

create index if not exists galeria_imagens_ordem_idx
  on public.galeria_imagens (ativo, categoria, ordem);

-- -----------------------------------------------------
-- 3. DEPOIMENTOS
-- -----------------------------------------------------
create table if not exists public.depoimentos (
  id          uuid primary key default gen_random_uuid(),
  texto       text not null,
  autor       text not null,
  cargo       text,            -- ex: 'Gerente Comercial — Indústria'
  foto_url    text,
  origem      text,            -- ex: 'treinamento', 'cliente'
  ordem       int  not null default 0,
  ativo       boolean not null default true,
  criado_em   timestamptz not null default now()
);

create index if not exists depoimentos_ordem_idx
  on public.depoimentos (ativo, ordem);

-- -----------------------------------------------------
-- 4. CASES (setor, dor, solução, resultado — sem nome do cliente)
-- -----------------------------------------------------
create table if not exists public.cases (
  id          uuid primary key default gen_random_uuid(),
  setor       text not null,
  desafio     text not null,
  solucao     text not null,
  resultado   text not null,
  destaque    boolean not null default false,   -- aparece na home
  ordem       int  not null default 0,
  ativo       boolean not null default true,
  criado_em   timestamptz not null default now()
);

create index if not exists cases_ordem_idx
  on public.cases (ativo, destaque, ordem);

-- -----------------------------------------------------
-- 5. BLOG — estrutura pronta, alimentada por n8n depois
-- -----------------------------------------------------
create table if not exists public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  titulo        text not null,
  resumo        text,
  conteudo      text,                -- markdown
  capa_url      text,
  autor         text default 'nodus tecnologia',
  tags          text[] default '{}',
  status        text not null default 'rascunho'
                check (status in ('rascunho','publicado','arquivado')),
  origem        text default 'manual'  -- 'manual' | 'n8n'
                check (origem in ('manual','n8n')),
  publicado_em  timestamptz,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists blog_posts_publicados_idx
  on public.blog_posts (status, publicado_em desc);

-- atualiza atualizado_em automaticamente
create or replace function public.tg_set_atualizado_em()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em := now();
  return new;
end;
$$;

drop trigger if exists blog_posts_atualizado_em on public.blog_posts;
create trigger blog_posts_atualizado_em
  before update on public.blog_posts
  for each row execute function public.tg_set_atualizado_em();

-- -----------------------------------------------------
-- 6. LEADS DO SITE (formulário de contato)
-- -----------------------------------------------------
create table if not exists public.leads_site (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  email       text,
  telefone    text,
  empresa     text,
  mensagem    text,
  origem      text,            -- ex: 'home', 'desenvolvimento', 'treinamentos'
  criado_em   timestamptz not null default now()
);

create index if not exists leads_site_criado_idx
  on public.leads_site (criado_em desc);

-- =====================================================
-- RLS — leitura pública do conteúdo, escrita só autenticado
-- =====================================================
alter table public.empresas_parceiras enable row level security;
alter table public.galeria_imagens    enable row level security;
alter table public.depoimentos        enable row level security;
alter table public.cases              enable row level security;
alter table public.blog_posts         enable row level security;
alter table public.leads_site         enable row level security;

-- --- conteúdo público: qualquer visitante lê o que está ativo ---
create policy "leitura publica empresas"
  on public.empresas_parceiras for select to anon, authenticated
  using (ativo = true);

create policy "leitura publica galeria"
  on public.galeria_imagens for select to anon, authenticated
  using (ativo = true);

create policy "leitura publica depoimentos"
  on public.depoimentos for select to anon, authenticated
  using (ativo = true);

create policy "leitura publica cases"
  on public.cases for select to anon, authenticated
  using (ativo = true);

create policy "leitura publica blog"
  on public.blog_posts for select to anon, authenticated
  using (status = 'publicado');

-- --- painel interno: quem está logado administra tudo ---
create policy "admin empresas"    on public.empresas_parceiras
  for all to authenticated using (true) with check (true);
create policy "admin galeria"     on public.galeria_imagens
  for all to authenticated using (true) with check (true);
create policy "admin depoimentos" on public.depoimentos
  for all to authenticated using (true) with check (true);
create policy "admin cases"       on public.cases
  for all to authenticated using (true) with check (true);
create policy "admin blog"        on public.blog_posts
  for all to authenticated using (true) with check (true);

-- --- leads: visitante só insere, ninguém anônimo lê ---
create policy "visitante envia lead"
  on public.leads_site for insert to anon, authenticated
  with check (true);

create policy "admin le leads"
  on public.leads_site for select to authenticated
  using (true);

-- =====================================================
-- STORAGE — buckets públicos para imagens
-- (crie os buckets pelo painel: Storage > New bucket,
--  nomes 'logos', 'galeria', 'blog', todos como Public)
-- Depois rode as policies abaixo.
-- =====================================================
create policy "leitura publica imagens"
  on storage.objects for select to anon, authenticated
  using (bucket_id in ('logos','galeria','blog'));

create policy "upload autenticado imagens"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('logos','galeria','blog'));

create policy "update autenticado imagens"
  on storage.objects for update to authenticated
  using (bucket_id in ('logos','galeria','blog'));

create policy "delete autenticado imagens"
  on storage.objects for delete to authenticated
  using (bucket_id in ('logos','galeria','blog'));
