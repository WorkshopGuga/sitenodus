# nodus tecnologia — site institucional

Site + painel interno. React + Vite + TypeScript + Tailwind + Supabase.

## Rodar localmente

```bash
npm install
npm run dev              # http://localhost:8080
```

O `.env` já vem preenchido com a URL e a anon key do projeto. Não precisa
configurar nada para rodar.

## Variáveis de ambiente

Crie um `.env` na raiz:

```
VITE_SUPABASE_URL=https://gavxiiuyglysdkzgrvve.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key
```

Só a anon key entra aqui. A service_role nunca vai para o front — a
segurança é garantida pelas policies de RLS no banco.

## Painel interno

Acesse `/admin/login` com o usuário criado em Authentication > Users
no painel do Supabase.

O que dá para administrar sem mexer no código:

| Aba          | O que controla                                          |
|--------------|---------------------------------------------------------|
| Empresas     | Logotipos da seção "Empresas que confiam na nodus"      |
| Depoimentos  | Nome, profissão, texto e foto de perfil                 |
| Cases        | Setor, desafio, solução e resultado (marque "Home")     |
| Galeria      | Fotos de treinamentos, eventos e bastidores             |
| Blog         | Posts em Markdown, manuais ou vindos do n8n             |

## Estrutura

```
src/
  components/   KnotField (animação do hero), Navbar, Footer, Reveal, ui
  content/      textos fixos das frentes e da home
  pages/        Home, Frente, Cases, Blog, BlogPost, Contato, NotFound
  admin/        login, layout e as cinco telas do painel
  lib/          cliente Supabase, tipos e hook de leitura pública
```

### Onde editar o quê

- Textos das quatro frentes: `src/content/frentes.ts`
- Passos do "Como trabalhamos" e sintomas: `src/content/site.ts`
- Número do WhatsApp: `src/pages/Contato.tsx` (constante `WHATSAPP`)
- Foto do Gustavo: `src/pages/Home.tsx`, seção do fundador
- Cores e fontes: `tailwind.config.ts`

## Conteúdo dinâmico e fallback

As seções de empresas, depoimentos e cases leem do Supabase. Enquanto o
painel não tiver registros, o site usa o conteúdo local de
`src/content/site.ts`, então nunca aparece uma seção vazia. Assim que você
cadastrar pelo painel, o conteúdo do banco assume.

## Blog automatizado via n8n

A tabela `blog_posts` aceita inserção direta. Para publicar pelo n8n:

```
POST {SUPABASE_URL}/rest/v1/blog_posts
Headers: apikey + Authorization: Bearer {service_role}
Body: {
  "slug": "titulo-do-post",
  "titulo": "Título do post",
  "resumo": "Resumo curto",
  "conteudo": "## Subtítulo\n\nParágrafo em Markdown.",
  "status": "rascunho",
  "origem": "n8n"
}
```

Recomendo `status: "rascunho"` — o post aparece no painel marcado como
gerado por n8n, e você revisa antes de publicar. A service_role key fica
guardada no n8n, nunca no site.

## Deploy

Build estático comum:

```bash
npm run build     # gera dist/
```

Em Vercel, Netlify ou Cloudflare Pages, configure o redirect de SPA
(todas as rotas para `index.html`) e adicione as duas variáveis de
ambiente no painel do provedor.

## Pendências de conteúdo

- Logotipos reais dos clientes (cadastrar pelo painel)
- Foto do Gustavo em formato retrato
- Número real do WhatsApp em `src/pages/Contato.tsx`
