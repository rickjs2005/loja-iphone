# Descrição do Produto — Loja de iPhone White-label

> Documento de referência: o que o produto **é hoje** (sem inventar feature)
> e como **vendê-lo** para lojas de iPhone que operam via Instagram + WhatsApp.
> Atualizado em 10/06/2026, refletindo o código na branch `main`.

---

# PARTE 1 — O que o produto é hoje

## Em uma frase

Um **site de loja de iPhones pronto, escuro e rápido**, onde o cliente vê
catálogo com preço e parcelamento, escolhe o aparelho e **fecha a compra pelo
WhatsApp** — e o dono gerencia tudo (produtos, fotos, preços, estoque,
conteúdo) por um **painel admin** simples, pelo celular ou computador.
Não existe gateway de pagamento: o site é uma vitrine profissional que
desemboca no WhatsApp do dono, que é onde essas lojas já vendem.

É construído como **white-label**: o mesmo código vira a loja de outro
cliente trocando nome, logo, cores, WhatsApp e redes sociais via variáveis de
ambiente (ou um único arquivo de config) — nenhum componente precisa ser
editado. Dá para revender a mesma base para N lojas, cada uma com seu deploy.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Estilo | Tailwind CSS v4 (tema via CSS variables — cores do tenant) |
| Animações | Framer Motion (com suporte a `prefers-reduced-motion`) |
| Backend | Supabase: Auth (login do dono), Postgres (produtos/estoque/conteúdo), Storage (fotos) |
| Estado | Zustand (carrinho, persistido no navegador) |
| Validação | Zod (em todas as mutações, no servidor) |

Hospedagem alvo: Vercel (ou qualquer host Node). O projeto roda inclusive
**sem Supabase configurado** (modo demo com produtos de exemplo) — útil para
demonstração comercial sem custo.

## A loja pública (o que o cliente final vê)

**Home** (`/`) — landing page completa em seções:
1. **Hero** com vídeo de iPhone, headline e CTAs
2. Faixa de confiança (garantia, procedência, parcelamento)
3. Destaque visual do aparelho
4. **Cards de linha Apple** (iPhone, MacBook, iPad, Acessórios) — cada card
   só aparece quando a linha tem produto ativo, e leva à seção
   correspondente (Watch e AirPods entram como acessórios, no filtro)
5. **Uma seção de catálogo por linha** — grade de produtos com foto, preço,
   parcelamento (ex.: "12x de R$ 291,59"), saúde da bateria e condição no
   card; aparelho lacrado ganha badge **"Novo"** monocromático
6. **Acessórios** — seção própria com filtro por categoria (capas,
   carregadores, áudio, outros)
7. "Por que comprar na {loja}"
8. **"Nossa loja"** — endereço, horário, link do Google Maps e carrossel de
   fotos reais do ponto físico, com legenda opcional por foto (tudo editável
   no admin)
9. **"Entregas realizadas"** — carrossel de fotos de entregas/clientes, com
   legenda opcional (editável no admin)

**Página de produto** (`/produtos/[id]`) — cada aparelho tem URL própria com:
- Galeria de fotos com miniaturas
- Preço grande + parcelamento sem juros (nº de parcelas configurável por produto)
- **Estado real do aparelho**: saúde da bateria (com barra de %) e condição
  (Novo lacrado / Vitrine / Excelente / Bom) — preenchidos no admin
- Badge de estoque honesto: "Disponível", **"Últimas N unidades"** (estoque ≤ 3)
  ou "Esgotado" (esgotado desabilita compra)
- Formas de pagamento aceitas (texto editável no admin)
- **CTA "Adicionar ao carrinho"** (no mobile, barra fixa estilo app): a
  compra fecha sempre pelo carrinho, no botão "Finalizar no WhatsApp"
- Produtos relacionados da mesma categoria

**Carrinho** (`/carrinho` + drawer lateral) — para compra de mais de um item:
- Quantidades com clamp pelo estoque, subtotal, upsell de acessórios
- **"Finalizar no WhatsApp"**: monta a mensagem com a lista de itens,
  quantidades e total, e abre o chat do dono
- Persistido no navegador (o cliente pode voltar depois)

**Sempre presentes**: botão flutuante do WhatsApp, header com carrinho,
footer com redes sociais da loja.

## O fluxo de compra (resumo)

```
Instagram (link na bio) → Home → página do iPhone (preço, 12x, bateria, fotos)
   → "Adicionar ao carrinho" → "Finalizar no WhatsApp" → chat do dono com a
     mensagem pronta → venda fecha no WhatsApp como hoje (Pix, cartão,
     retirada, entrega — combinados lá)
```

O site **não processa pagamento nem cria "pedidos"** — ele qualifica e
encaminha. Isso é uma decisão de produto: o público-alvo já fecha tudo no
WhatsApp e não quer (nem precisa de) checkout online.

## O painel admin (`/admin`)

Protegido por login (e-mail/senha do Supabase Auth, com rate limit contra
força bruta). Funciona bem em celular (campos sem zoom forçado no iOS).

**Produtos** (`/admin/produtos`):
- Dashboard rápido: produtos ativos, estoque total, itens sem estoque
- Lista com abas por linha (Todos / iPhones / MacBooks / iPads /
  Acessórios — só as com produto), toggle ativo/inativo (otimista),
  edição e exclusão com confirmação
- **Criar produto**: linha Apple (iPhone, MacBook, iPad ou
  acessório), nome, descrição, **preço com máscara de moeda** (digita e
  vê "R$ 2.000,00"), estoque, parcelas, e por tipo: saúde da bateria +
  condição (aparelhos) ou categoria do acessório. **Upload de fotos na própria
  criação**, com pré-visualização
- **Editar produto**: mesmos campos + gerenciador de fotos (adicionar várias,
  excluir com confirmação)
- Produto inativo ou sem estoque some/trava na loja na hora (sem cache velho)

**Conteúdo da loja** (`/admin/loja`):
- Endereço, horário de funcionamento, formas de pagamento, link do Google
  Maps, texto da garantia
- Upload das fotos das seções "Nossa loja" e "Entregas realizadas", com legenda
  opcional por foto

**Robustez** (trabalhada recentemente): formulários não perdem o que foi
digitado em caso de erro, mensagens de erro amigáveis em português, telas de
erro/404 tematizadas, validação de imagem (formato/tamanho) antes do upload.

## SEO e compartilhamento

- `sitemap.xml` dinâmico (home + todos os produtos ativos) e `robots.txt`
- **Schema.org** (JSON-LD): `Product` + `Offer` por produto (preço, moeda,
  disponibilidade — candidato a rich snippet no Google) e `Organization`
- **Open Graph por produto**: link compartilhado no WhatsApp/Instagram mostra
  foto, nome e descrição do aparelho (e imagem OG dinâmica da marca na home)
- Title/description por página, canonical, admin e carrinho com `noindex`

## Segurança (postura atual)

- Escrita no banco/storage restrita a **allow-list de admins** (RLS); a chave
  pública do Supabase não dá poder de escrita a estranhos
- Sessão em cookies httpOnly; `getUser()` validado no servidor; middleware
  protege `/admin`; anti open-redirect no login; rate limit de login
- Headers de segurança; sem service_role key em lugar nenhum
- Validação Zod em toda mutação + constraints no banco como última defesa

## Estado honesto: pronto × parcial × inexistente

**Pronto e funcionando:**
- Catálogo completo por linha Apple (iPhones, MacBooks, iPads e
  acessórios — Watch/AirPods entram como acessórios) com preço, parcelas,
  bateria, condição (incl. "Novo" lacrado com badge) e cards de navegação
- Página por produto com galeria e SEO; compra fecha pelo carrinho no WhatsApp
- Carrinho multi-item com checkout WhatsApp
- Admin CRUD completo de produtos com upload de fotos (criação e edição)
- Conteúdo institucional editável (endereço/horário/pagamentos/maps/fotos)
- **Prova social = fotos reais**: galerias da loja física e de entregas com
  legenda opcional por foto, editáveis no admin. Sem contadores de "números
  da loja" e sem depoimentos, por decisão de design (nada que pareça
  fabricado)

- **Garantia configurável** por loja (texto no admin, aparece na página do
  produto; vazio mostra texto genérico)
- White-label por env vars + modo demo sem backend
- SEO técnico (sitemap, robots, JSON-LD, OG por produto)
- Segurança com allow-list de admins

**Parcial / com ressalvas:**
- Carrinho guarda **preço do momento do clique** no navegador; cliente que
  volta dias depois pode enviar pedido com preço desatualizado (o vendedor vê
  na conversa, mas gera atrito)
- Galeria do admin **não reordena fotos** nem define capa (a capa é a 1ª foto
  enviada)
- Lista de produtos do admin sem busca/paginação (ok até ~50 itens)
- Vídeo do hero pesa 2,3 MB (funciona, mas merece compressão) e as imagens de
  marketing do hero/destaque são da marca demo

**Não existe (não prometer):**
- Pagamento online (Pix/cartão no site), checkout com pedido/comprovante
- Registro de pedidos, histórico de vendas, CRM, dashboard de métricas/analytics
- Multi-usuário/permissões (é modelo de dono único; allow-list aceita mais
  admins via banco, mas não há UI para isso)
- Busca de produtos na loja pública (a navegação é por seções/abas)
- Importação automática do Instagram (cadastro é manual, produto a produto)
- Avaliações reais de clientes (sistema de reviews)
- Painel de revenda/provisionamento automático de novas lojas (criar loja nova
  = novo deploy com env vars + projeto Supabase; processo manual documentado)
- App nativo / PWA instalável / notificações

---

# PARTE 2 — Pitch para lojas de iPhone do Instagram

> Público: revendedores de iPhone de Manhuaçu/Caratinga e região que vendem
> 100% pelo Instagram (feed = catálogo, sem preço público) + WhatsApp na bio.
> De ~5 mil a ~100 mil seguidores, novos e seminovos, 12x no cartão, garantia.

## 1. As 5 dores que o site resolve (cada uma ligada a feature que EXISTE)

**Dor 1 — "Quanto tá?" o dia inteiro.**
No Instagram não tem preço público; cada curioso vira uma conversa no direct,
e a maioria some depois da resposta.
→ *Feature:* catálogo com **preço e "12x de R$ X" visíveis** em todos os
aparelhos, na grade e na página do produto. O cliente chega no WhatsApp já
sabendo o valor — quem chama é quem quer comprar.

**Dor 2 — Catálogo enterrado no feed.**
O iPhone 13 postado há 3 semanas está 40 posts pra baixo; o cliente não acha,
e estoque vendido continua aparecendo no feed.
→ *Feature:* **grade organizada por linha (iPhones, MacBooks, iPads,
acessórios)**, cada aparelho com
página própria (todas as fotos, bateria %, condição, estoque). Vendeu? O dono
desativa no admin pelo celular e o aparelho **some do site na hora** — sem
apagar post, sem repostar.

**Dor 3 — O cliente pergunta sempre as mesmas coisas (bateria? estado? parcela?).**
→ *Feature:* a página do aparelho mostra **saúde da bateria com barrinha de
porcentagem, condição (Novo lacrado/Vitrine/Excelente/Bom), parcelamento e
formas de pagamento**. As 4 perguntas padrão já chegam respondidas; o
WhatsApp vira fechamento, não triagem.

**Dor 4 — Fricção entre o interesse e a mensagem.**
Hoje o caminho é: ver post → ir na bio → abrir WhatsApp → escrever "oi, vi o
iPhone 13 de vocês..." — e muita gente desiste no meio.
→ *Feature:* carrinho com **"Finalizar no WhatsApp"** que abre o chat do
dono **com a mensagem pronta**: itens, quantidades e total. Poucos toques.
E o vendedor recebe exatamente quais produtos são, sem adivinhar.

**Dor 5 — Invisível fora do Instagram.**
Quem pesquisa "iPhone seminovo Manhuaçu" no Google não encontra a loja —
Instagram praticamente não aparece em busca.
→ *Feature:* site com **SEO de loja de verdade** (cada produto indexável no
Google com preço e disponibilidade marcados para o buscador, sitemap, dados
estruturados). E o link na bio deixa de ser um `wa.me` seco: compartilhou o
aparelho em qualquer lugar, aparece **cartão com foto, nome e descrição**.

## 2. Argumentos de venda — como falar num áudio de WhatsApp

> "Ô [nome], deixa eu te mostrar uma coisa. Seu Instagram tá bonito, mas pensa
> comigo: todo cliente teu precisa te chamar pra saber o preço. Aí tu responde
> 30 'quanto tá?' por dia e fecha 3. O site faz essa peneira pra você: o cara
> entra, vê o iPhone com preço, com as 12x, com a porcentagem da bateria,
> as fotos todas — e quando ele te chama no WhatsApp, já vem com a mensagem
> pronta: 'quero o iPhone 13 de R$ 2.800'. Tu só fecha."

> "E o melhor: não muda NADA no teu jeito de vender. Não tem maquininha de
> site, não tem pagamento online, não tem nota — o botão de comprar cai
> direto no TEU WhatsApp, e tu negocia Pix, cartão, entrega, do jeito que tu
> já faz hoje. O site é tua vitrine trabalhando 24h; a venda continua tua."

> "Vendeu o aparelho? Tu pega o celular, entra no painel, desliga o produto —
> sumiu do site. Chegou aparelho novo? Foto, preço, bateria, salva — tá no ar.
> É mais fácil que postar no feed, porque não precisa de arte, não precisa
> de legenda, não precisa de hora certa."

> "E pensa no cliente das 11 da noite, que tá deitado pesquisando iPhone. Ele
> não vai te chamar àquela hora — mas ele entra no site, escolhe, e te manda
> a mensagem. Tu acorda com a venda meio fechada."

> "Teu Instagram continua sendo teu marketing. O site é o catálogo que o
> Instagram não te deixa ter: com preço, com busca no Google, com link
> profissional na bio. Os dois juntos, não um no lugar do outro."

## 3. Objeções prováveis e como responder

**"Já vendo bem pelo Instagram."**
"E vai continuar vendendo — o site não substitui o Instagram, ele tampa o
buraco do Instagram. Hoje tu perde duas vendas que tu nem vê: o cara que não
te chamou porque não tinha preço, e o cara que te procurou no Google e não te
achou. O site pega esses dois. E quem já te segue passa a ter um link na bio
que mostra tudo, em vez de um 'me chama no zap'."

**"Site é caro." / "Não quero gastar com isso."**
"Site caro é site feito do zero por agência. Esse aqui já tá pronto — entra
tua logo, tua cor, teu WhatsApp e teus aparelhos. A estrutura roda em serviço
que custa quase nada por mês [definir preço/modelo antes de usar]. Faz a
conta: se ele te trouxer UM iPhone vendido a mais por mês, pagou o ano. É
menos que tu gasta impulsionando um post."

**"Não sei mexer com site."**
"Tu não vai mexer com site — tu vai mexer num painel que é mais simples que
o Instagram. É literalmente: foto do aparelho, preço, quantos tem, salvar.
Pelo celular. Se tu sabe postar story, tu sabe usar. E a parte técnica
(colocar no ar, domínio, manutenção) é comigo, não contigo."

**"Não quero meu preço público — concorrente vai ver."**
"Teu concorrente descobre teu preço hoje em 2 minutos mandando um 'quanto tá?'
de um perfil fake. Quem tu tá escondendo o preço é do TEU cliente — e cliente
que não acha preço vai embora pra quem mostra. As lojas grandes da região que
crescem são as que mostram preço. [Se for inegociável: hoje o produto não tem
modo 'sob consulta' — ver gaps abaixo.]"

**"Meu cliente gosta de comprar conversando, no direct."**
"E vai continuar comprando conversando! Todo botão do site cai no teu
WhatsApp. A diferença é que a conversa começa no 'quero esse, é esse preço
mesmo?' em vez de começar no 'quanto tá? tem na cor azul? e a bateria?'. Tu
conversa menos pra vender o mesmo tanto."

## 4. O que falta para o pitch ficar redondo (gaps reais)

Em ordem de prioridade para este público:

1. ~~Prova social fake~~ **RESOLVIDO**: a prova social é 100% visual — fotos
   reais da loja e das entregas, com legenda, editáveis no admin (números
   da loja e depoimentos foram removidos do produto). Resta orientar o
   lojista a manter as galerias vivas (e idealmente uma página curta de
   garantia/trocas + CNPJ no rodapé — confiança para ticket de R$ 3–8 mil).
2. ~~Garantia fixa~~ **RESOLVIDO**: texto da garantia configurável no admin.
3. **Sem analytics = sem prova de resultado.** O pitch promete "vendas que
   você não vê"; sem nem um contador de cliques no botão de WhatsApp, não dá
   para mostrar ao dono o que o site gerou — e renovação depende disso.
   Mínimo: contagem de cliques nos CTAs (origem por produto).
4. **Cadastro é manual.** Para a loja de 100 mil seguidores com 60 aparelhos
   no feed, migrar catálogo é uma tarde de trabalho. Não há importação do
   Instagram (e tecnicamente é frágil prometer). Resolver no comercial:
   "eu cadastro seu estoque inicial pra você" como parte do setup.
5. **Provisionamento de loja nova é manual.** Cada cliente = deploy + env
   vars + projeto Supabase + usuário admin. Funciona, está documentado, mas
   ~30–60 min por loja e exige quem saiba fazer. Para escalar a revenda, vale
   roteirizar/automatizar.
6. **Modo "sob consulta" não existe.** Se um lojista grande recusar preço
   público, hoje não há flag "ocultar preço" por produto. Decidir se é
   feature ou se o posicionamento é "preço público sempre".
7. **Detalhes que poliriam a demo:** vídeo do hero comprimido (2,3 MB),
   imagens de marketing genéricas substituíveis por foto da loja do cliente,
   reordenar fotos/definir capa no admin, busca na loja quando o catálogo
   passar de ~30 itens.

**O que NÃO prometer em hipótese alguma** (não existe): pagamento pelo site,
controle de pedidos/vendas, integração com Instagram, app, multi-vendedor,
relatórios. O produto é: **vitrine profissional + catálogo gerenciável +
funil para o WhatsApp** — e isso, sozinho, já resolve as 5 dores de cima.
