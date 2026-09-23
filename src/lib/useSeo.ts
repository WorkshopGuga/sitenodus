import { useEffect } from "react";

const SITE = "https://somosnodus.com";
const OG_IMAGE = `${SITE}/__l5e/assets-v1/a3fe1777-91c2-4a13-86d1-6a29db4753fc/nodus-social-share.png`;

function setMeta(seletor: string, atributo: string, valor: string, conteudo: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(seletor);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(atributo, valor);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", conteudo);
}

/**
 * Define título, descrição, canonical e Open Graph por página.
 *
 * O site é uma SPA: sem isso, TODAS as rotas herdam o mesmo título e a
 * mesma descrição do index.html, e o Google mostra todas iguais no
 * resultado de busca. O canonical evita que variações de URL (com
 * parâmetro de campanha, por exemplo) sejam tratadas como páginas
 * distintas.
 */
export function useSeo({
  titulo, descricao, caminho, imagem,
}: { titulo: string; descricao: string; caminho: string; imagem?: string }) {
  useEffect(() => {
    const url = `${SITE}${caminho}`;
    const img = imagem ?? OG_IMAGE;

    document.title = titulo;

    setMeta('meta[name="description"]', "name", "description", descricao);
    setMeta('meta[property="og:title"]', "property", "og:title", titulo);
    setMeta('meta[property="og:description"]', "property", "og:description", descricao);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[property="og:image"]', "property", "og:image", img);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", "nodus tecnologia");
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", titulo);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", descricao);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", img);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [titulo, descricao, caminho, imagem]);
}
