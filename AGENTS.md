# Convenções do projeto (Loja de iPhone white-label)

Stack: **Next.js 15** (App Router) + TypeScript + **Tailwind v4** + Framer Motion
+ Supabase (@supabase/ssr) + Zustand + Zod.

> **Escopo: modelo de loja APPLE.** A personalização (marca/cores/contatos/
> endereços/copy/catálogo) é por configuração, sem código. Mas o domínio
> **assume produtos Apple por design**: as categorias (`CATEGORIES` em
> `src/lib/data/types.ts` + constraint no banco), a marca `Apple` no JSON-LD
> de produto e alguns rótulos de navegação são **fixos**. Trocar de nicho =
> fork (alterar esses 3 pontos + migration). Não tente "generalizar" isso em
> mudanças de rotina — é decisão de produto. Detalhes no README ("Escopo").

## Regras ao editar este repositório

- **Personalização white-label**: cores/logo/WhatsApp vivem só em
  `src/config/theme.config.ts`. Nunca hardcode cor em componente — use os
  utilitários do tema (`bg-bg`, `bg-surface`, `text-primary`, `text-muted`...).
- **Textos de marketing** (títulos, frases, CTAs da vitrine) vivem só em
  `src/config/copy.ts`. Rótulos de UI ("Adicionar ao carrinho", erros) podem
  ficar no componente.
- **WhatsApp**: número sempre normalizado por `src/lib/phone.ts`; links só
  via `waUrl()` ou `<WhatsappCta>` (nunca monte `wa.me` na mão).
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
