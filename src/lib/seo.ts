/**
 * Serializa dados estruturados (JSON-LD) para uso em <script> inline.
 * O caractere menor-que é escapado como sequência unicode: sem isso, um
 * texto vindo do banco contendo "menor-que/script" encerraria a tag e
 * injetaria HTML/JS na página (XSS armazenado).
 */
export function jsonLdHtml(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
