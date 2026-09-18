# Atualização nodus-site_8.zip — compressão de imagens no upload

## O que muda nesta versão
- Toda imagem enviada pelo painel interno (logos, fotos de depoimento, galeria, capa de blog) passa a ser redimensionada e comprimida no navegador antes do upload.
- Arquivo novo: `src/lib/comprimirImagem.ts`.

## Arquivos a aplicar (diff ZIP × projeto atual)
- `src/admin/AdminBlog.tsx`
- `src/admin/AdminDepoimentos.tsx`
- `src/admin/AdminEmpresas.tsx`
- `src/admin/AdminGaleria.tsx`
- `src/admin/componentes.tsx` (o UploadImagem passa a comprimir antes de subir)
- `src/components/LogoMarquee.tsx`
- `src/lib/comprimirImagem.ts` (novo)

## Ajustes de proteção (não copiar cegamente)
- `package.json`: o ZIP remove o script `"build:dev"` — manter o script atual.
- `tsconfig.json`: o ZIP adiciona `"baseUrl": "."` — manter o tsconfig atual (o projeto já resolve imports).
- Ignorar `.env` do ZIP; preservar `.workspace`, `bun.lock`, `bunfig.toml`, `AGENTS.md`, `src/vite-env.d.ts` e os `.asset.json` existentes.
- Sem mudanças no banco/Supabase, sem novas dependências, sem refatorações.

## Verificação
1. `bun run build` e `bun run build:dev` devem passar.
2. Rodar o projeto e abrir no navegador: home com as três esteiras de logos e página de Cases com a seção de logos.
3. Painel `/admin`: abrir uma aba com upload (ex.: Empresas) e confirmar que o envio usa a compressão (sem erros no console).
