import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * Operações no Supabase Storage (bucket "product-images").
 * Upload e remoção exigem sessão autenticada — a policy do bucket bloqueia o
 * resto. A leitura é pública (bucket público).
 */

const BUCKET = "product-images";

/** Extensão original sanitizada (".jpg", ".webp"...; vazio se não houver). */
function safeExt(fileName: string): string {
  const match = /\.([a-zA-Z0-9]+)$/.exec(fileName);
  return match ? `.${match[1].toLowerCase()}` : "";
}

/**
 * Caminho ÚNICO por arquivo: UUID garante que dois uploads nunca colidem
 * (índice/nome repetido sobrescreveria o arquivo de outra linha).
 */
function buildPath(prefix: string, fileName: string): string {
  return `${prefix}/${crypto.randomUUID()}${safeExt(fileName)}`;
}

async function uploadToBucket(path: string, file: File): Promise<string> {
  const supabase = await createClient();

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false, // nunca sobrescreve: cada upload é um arquivo novo
    contentType: file.type,
  });

  if (error) throw new Error(`Falha no upload da imagem: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Upload de foto de produto (organizado por produto no bucket). */
export async function uploadProductImage(
  productId: string,
  file: File,
): Promise<string> {
  return uploadToBucket(buildPath(productId, file.name), file);
}

/** Upload de imagem de conteúdo do site (loja física / entrega). */
export async function uploadSiteImage(
  section: string,
  file: File,
): Promise<string> {
  return uploadToBucket(buildPath(`site/${section}`, file.name), file);
}

/** Extrai o caminho interno do bucket a partir da URL pública. */
export function storagePathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

export async function removeProductImageByUrl(url: string): Promise<void> {
  return removeImagesByUrls([url]);
}

/** Remove vários arquivos de uma vez (URLs externas são ignoradas). */
export async function removeImagesByUrls(urls: string[]): Promise<void> {
  const paths = urls
    .map(storagePathFromUrl)
    .filter((p): p is string => p !== null);
  if (paths.length === 0) return;

  const supabase = await createClient();
  const { error } = await supabase.storage.from(BUCKET).remove(paths);

  if (error) throw new Error(`Falha ao remover arquivos: ${error.message}`);
}
