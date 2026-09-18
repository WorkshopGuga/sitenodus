/**
 * Redimensiona e comprime uma imagem no navegador antes do upload —
 * evita subir um arquivo de vários MB para algo exibido em 40-90px.
 * SVG passa direto (é vetor, já é leve, e canvas o rasterizaria).
 */
export async function comprimirImagem(
  arquivo: File,
  opcoes: { maxLargura?: number; maxAltura?: number; qualidade?: number } = {}
): Promise<{ blob: Blob; extensao: string; tipo: string }> {
  const { maxLargura = 1600, maxAltura = 1600, qualidade = 0.85 } = opcoes;

  if (arquivo.type === "image/svg+xml") {
    return { blob: arquivo, extensao: "svg", tipo: arquivo.type };
  }

  const bitmap = await createImageBitmap(arquivo);
  const escala = Math.min(1, maxLargura / bitmap.width, maxAltura / bitmap.height);
  const largura = Math.max(1, Math.round(bitmap.width * escala));
  const altura = Math.max(1, Math.round(bitmap.height * escala));

  const canvas = document.createElement("canvas");
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { blob: arquivo, extensao: arquivo.name.split(".").pop() ?? "png", tipo: arquivo.type };
  ctx.drawImage(bitmap, 0, 0, largura, altura);

  const paraBlob = (tipo: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, tipo, qualidade));

  // WebP primeiro (bem menor, mantém transparência). Se o navegador não
  // suportar codificar WebP, cai para PNG — nunca para JPEG, que perderia
  // a transparência de um logo.
  const webp = await paraBlob("image/webp");
  if (webp) return { blob: webp, extensao: "webp", tipo: "image/webp" };

  const png = await paraBlob("image/png");
  if (png) return { blob: png, extensao: "png", tipo: "image/png" };

  // Última saída: manda o arquivo original sem comprimir.
  return { blob: arquivo, extensao: arquivo.name.split(".").pop() ?? "png", tipo: arquivo.type };
}
