# Convenções do projeto (Loja de iPhone white-label)

Stack: **Next.js 15** (App Router) + TypeScript + **Tailwind v4** + Framer Motion
+ Supabase (@supabase/ssr) + Zustand + Zod.

## Regras ao editar este repositório

- **Personalização white-label**: cores/logo/WhatsApp vivem só em
  `src/config/theme.config.ts`. Nunca hardcode cor em componente — use os
  utilitários do tema (`bg-bg`, `bg-surface`, `text-primary`, `text-muted`...).
- **Camada de dados única**: todo acesso ao Supabase fica em `src/lib/data/`
  (com `import "server-only"`). Componentes NÃO importam o client do Supabase.
- **Mutações** só via Server Actions (`'use server'`) com validação Zod e
  `requireUser()`. RLS é a defesa final no banco.
- **Preços em centavos** (inteiro) no banco; formate com `formatCents()` na UI.
- **Tailwind v4**: tema em CSS-first (`@theme inline` em `globals.css`), não há
  `tailwind.config`. As cores vêm de CSS variables `--store-*`.
- Arquivos pequenos, de responsabilidade única; estilos via utilitários.
- Commits em português, um por bloco funcional.

## Comandos

```bash
npm run dev     # desenvolvimento
npm run build   # build (valida tipos + lint)
npm run lint    # eslint
npx tsc --noEmit
```
