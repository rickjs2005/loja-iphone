import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * Operações no Supabase Storage (bucket "product-images").
 * Upload e remoção exigem sessão autenticada — a policy do bucket bloqueia o
 * resto. A leitura é pública (bucket público).
 */

const BUCKET = "product-images";

/** Caminho determinístico: product-images é organizado por produto. */
function buildPath(productId: string, fileName: string, index: number): string {
  const safe = fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  // O índice (posição na galeria) evita colisão entre arquivos de mesmo nome.
  return `${productId}/${index}-${safe}`;
}

export async function uploadProductImage(
  productId: string,
  file: File,
  index: number,
): Promise<string> {
  const supabase = await createClient();
  const path = buildPath(productId, file.name, index);

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type,
  });

  if (error) throw new Error(`Falha no upload da imagem: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Upload de imagem de conteúdo do site (loja física / entrega). */
export async function uploadSiteImage(
  section: string,
  file: File,
  index: number,
): Promise<string> {
  const supabase = await createClient();
  const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `site/${section}/${index}-${safe}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type,
  });

  if (error) throw new Error(`Falha no upload da imagem: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Extrai o caminho interno do bucket a partir da URL pública. */
export function storagePathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

export async function removeProductImageByUrl(url: string): Promise<void> {
  const path = storagePathFromUrl(url);
  if (!path) return; // URL externa/desconhecida: nada a remover no storage.

  const supabase = await createClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);

  if (error) throw new Error(`Falha ao remover arquivo: ${error.message}`);
}
