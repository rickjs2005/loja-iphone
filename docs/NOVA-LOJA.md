# Checklist: colocar uma NOVA loja no ar

Roteiro completo para replicar este sistema para um novo cliente. Seguindo na
ordem, uma loja nova sobe em ~30 minutos. **Não pule etapas** — cada uma
existe porque a falta dela já causou (ou causaria) problema real.

> **REGRA DE OURO: 1 cliente = 1 projeto Supabase + 1 deploy.**
> NUNCA aponte duas lojas para o mesmo banco — não há isolamento entre
> clientes no schema, e um admin veria/editaria os produtos do outro.

---

## 1. Banco (Supabase) — ~10 min

1. Crie um **projeto novo** em [supabase.com](https://supabase.com)
   (anote a senha do banco; região: `sa-east-1` / São Paulo).
2. Aplique as migrations (na raiz do repositório):
   ```bash
   supabase link --project-ref <ref-do-projeto-novo>
   supabase db push
   ```
   Isso cria tabelas, RLS, bucket de imagens, rate limit e o trigger de
   estoque — tudo. Confira com `supabase migration list`.
3. *(Opcional)* Produtos de exemplo para a demonstração inicial:
   rode o conteúdo de `supabase/seed.sql` no SQL Editor.

## 2. Dono da loja (admin) — ~5 min

1. Dashboard → **Authentication → Users → Add user**: crie o usuário com o
   e-mail do dono (marque "Auto confirm").
2. **Allow-list** (sem isso o usuário loga mas não consegue escrever nada):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'dono@cliente.com';
   ```
3. **Desabilite signups públicos**: Authentication → Sign In / Up →
   desligue "Allow new users to sign up". (Mesmo ligado a allow-list
   segura a escrita, mas não há motivo para aceitar cadastros.)
4. Authentication → **URL Configuration**: Site URL = domínio final da loja
   (necessário para o e-mail de recuperação de senha apontar certo).

## 3. Deploy (Vercel) — ~10 min

Crie o projeto apontando para o repositório e configure as
**Environment Variables** (copie de `.env.example`):

| Variável | Valor | Obrigatória? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto novo | **SIM** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | chave publishable/anon | **SIM** |
| `NEXT_PUBLIC_SITE_URL` | domínio final (https://...) | **SIM** |
| `NEXT_PUBLIC_STORE_NAME` | nome da loja | **SIM** |
| `NEXT_PUBLIC_STORE_WHATSAPP` | **o MESMO número da matriz** | **SIM** |
| `NEXT_PUBLIC_STORE_DESCRIPTION` | frase curta | recomendada |
| `NEXT_PUBLIC_STORE_INSTAGRAM` | URL do perfil | se tiver |
| `NEXT_PUBLIC_COLOR_*` | paleta do cliente | se quiser cores próprias |

Sem as obrigatórias a loja entra em **modo demo** (produtos falsos) — em
produção isso gera um `console.error` nos logs, mas confira antes de entregar.

## 4. Identidade visual — ~5 min

Arquivos em `/public` (trocar pelo material do cliente, MESMOS nomes):

- `logo.svg` — logo do cabeçalho (ou aponte `NEXT_PUBLIC_STORE_LOGO_URL`).
- `hero-v5.mp4` — vídeo do hero (~10s, 720p, **≤ 800 KB**, sem áudio:
  `ffmpeg -i bruto.mp4 -an -c:v libx264 -preset slow -crf 28 -movflags +faststart hero-v5.mp4`).
- `hero-poster.jpg` — frame de capa do vídeo.
- `tradein-v2.webp` — imagem da seção de troca.

## 5. Conteúdo (no próprio admin da loja) — dono faz

1. `/admin` → **Informações da loja**: WhatsApp da matriz, endereço,
   horário, formas de pagamento, texto de garantia.
   - **Link do mapa**: cole o link da **ficha do Google Business** da loja
     (não um pin genérico) — o cliente cai na página com avaliações e fotos,
     que vendem confiança. No Brasil, Google Maps > Apple Maps em cobertura.
2. **Unidades** (só se houver mais de um endereço) — cada uma pode ter
   WhatsApp próprio; o cliente escolhe a loja ao clicar nos botões.
3. **Produtos**: cadastrar com fotos (JPG/PNG/WebP, até 5 MB cada).
4. **Fotos da loja / entregas / Instagram**: alimentam as seções da home.

## 6. Conferência final (5 testes, no celular)

- [ ] Home abre com os produtos reais (sem faixa "Demonstração").
- [ ] Clicar em "Comprar pelo WhatsApp" → abre a conversa **no número
      certo, com mensagem preenchida**.
- [ ] `/admin` exige login; login do dono funciona; criar/editar produto ok.
- [ ] Compartilhar o link da loja no WhatsApp → preview com nome e imagem.
- [ ] Recuperação de senha: "Esqueci a senha" chega no e-mail do dono.

---

## Manutenção esperada

O sistema não tem rotina de manutenção (sem cron, sem fila, sem webhook).
O que existe de recorrente:

- **Dependências**: rodar `npm update` + `npm run build` de tempos em tempos
  (1x/trimestre é suficiente) e re-deployar.
- **Supabase free tier**: projetos gratuitos **pausam após ~1 semana sem
  tráfego** — para loja de cliente pagante, use o plano Pro ou monitore.
- **Backups**: o plano Pro do Supabase tem backup diário automático. No
  free, exporte o banco de vez em quando (`supabase db dump`).
