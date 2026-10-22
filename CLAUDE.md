# CODEXY — site institucional

Vite + React 18 + TypeScript + react-router-dom v6 + Tailwind + shadcn/ui. Todas as rotas públicas são pré-renderizadas como HTML estático durante o build e hidratadas pelo React no navegador.

## Landing pages programáticas (`/informacoes/:slug`)

Sistema de páginas de nicho × estado pra tráfego pago/SEO, inspirado em sites que geram uma página por serviço+localização (ex: `empresa.com/informacoes/servico-em-cidade/`).

**Arquitetura (`src/data/landingPages.ts`)**: cada nicho é um `NicheTemplate` (copy, pain points, benefits, FAQ, imagens — tudo fixo); a lista `BRAZILIAN_STATES` tem os 27 estados. `landingPages` é gerado automaticamente como `niches × states`. Isso é proposital: **não editar manualmente entradas de `landingPages`** — editar os templates ou a lista de estados.

### Regras obrigatórias da máquina de páginas

Toda página pública nova, institucional ou programática, deve seguir estas regras. Elas fazem parte da arquitetura e não são opcionais:

- A URL deve entrar em `prerenderRoutes` e gerar um arquivo `dist/<rota>/index.html` com o conteúdo completo dentro de `#root`; não entregar apenas o shell vazio da SPA.
- Cada página deve ter exatamente um `<title>` e uma `<meta name="description">`, ambos descritivos e exclusivos em todo o site.
- Cada página indexável deve ter canonical exclusivo e metadados Open Graph/Twitter próprios já presentes no HTML estático.
- Cidade e estado com o mesmo nome devem ser diferenciados nos metadados pela UF da cidade, usando `seoIn` (ex.: `São Paulo, SP`).
- A página 404 deve ser estática, responder como 404 na hospedagem, conter `noindex, nofollow` e não possuir canonical.
- O React deve hidratar o HTML existente com `hydrateRoot`; não substituir o conteúdo pré-renderizado.
- Sempre executar `npm run build` após alterar ou criar páginas. O build deve falhar se faltar HTML, title, description, canonical, OG/Twitter ou se title, description ou canonical forem duplicados.

- **Adicionar novo estado**: não deveria ser necessário, os 27 já estão cobertos. Só mexer se abrir pra outro país.
- **Adicionar novo nicho** (ex: "chatbot para academias"): criar um `NicheTemplate` novo em `NICHE_TEMPLATES`. Isso sozinho já gera as 27 páginas (uma por estado). É o único trabalho manual — pain points/benefits/FAQ são escritos uma vez só, não por estado.
- **Limite: nunca passar de 30 páginas programáticas no total.** Hoje são 81 (3 nichos × 27 estados) — já acima do limite, mantido assim por decisão consciente, não mexer retroativamente. Mas **daqui pra frente, qualquer nicho novo tem que ser avaliado contra esse teto antes de entrar**: como cada nicho novo multiplica por 27 estados, 1 nicho a mais já eram +27 páginas. Antes de adicionar `NicheTemplate` novo, checar `landingPages.length` e discutir com o usuário se vai estourar 30 — não adicionar direto sem esse check.
- **Regionalização é propositalmente leve**: só `headline`, `introParagraph`, `whatsappMessage` e `seo.title/description` recebem `${state.label}` interpolado. `painPoints`, `benefits`, `faq`, `heroImage`, `partner` são **compartilhados entre todos os estados do nicho** — isso é o que mantém a criação de página rápida. Não escrever pain points/benefits únicos por estado; se for necessário algo genuinamente regional, discutir antes de expandir esse padrão (aumenta o custo de manutenção por N estados).
- **Slug**: `chatbot-para-{nicheSlug}-{stateSlug}` (`stateSlug` vem de `slugify(state.label)`, sem acento). Não mudar esse formato sem atualizar redirects (`netlify.toml`/`vercel.json`) e sitemap.

**Pipeline de build** (100% data-driven — adicionar nicho/estado não exige tocar em nada abaixo):
1. `vite build` → build client normal (`dist/`).
2. `vite build --ssr src/entry-server.tsx --outDir dist-ssr` → bundle SSR só pra prerender (resolve imports de imagem/asset que `tsx` puro não resolve).
3. `node scripts/prerender.mjs` → lê `prerenderRoutes` (rotas institucionais + rotas geradas a partir de `landingPages` em `src/entry-server.tsx`), renderiza cada rota com `renderToString` + `StaticRouter` + `HelmetProvider`, escreve um `index.html` estático por URL e aplica todas as validações das regras obrigatórias acima.
4. `tsx scripts/generate-sitemap.tsx` → gera `dist/sitemap.xml` a partir do mesmo array `landingPages`.

Tudo isso roda via `npm run build`. Rodar localmente com `npm run build` sempre que mexer em `landingPages.ts`/`entry-server.tsx` pra confirmar que as páginas prerenderizam certo (checar `dist/informacoes/<slug>/index.html` tem title/OG específico da página, não o genérico do `index.html`).

**Template visual** (`src/pages/InformacoesLandingPage.tsx` + `src/components/landing/InformacoesNavbar.tsx`): navbar com barra de contato/redes sociais + nav principal, hero com imagem de fundo e badge nicho·UF, parágrafo intro, cards de pain points/benefits, bloco de parceiro (opcional, via `template.partner`), FAQ em accordion, CTA final, bolha flutuante de WhatsApp. Esse template é único e compartilhado — não duplicar por nicho.

**CTA/lead capture**: só WhatsApp (`src/lib/whatsapp.ts`, `openWhatsApp`), sem form/backend. Segue o mesmo padrão do `ContactSection.tsx` da home.
