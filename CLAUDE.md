# CODEXY — site institucional

Vite + React 18 + TypeScript + react-router-dom v6 + Tailwind + shadcn/ui. Todas as rotas públicas são pré-renderizadas como HTML estático durante o build e hidratadas pelo React no navegador.

## Landing pages programáticas (`/informacoes/:slug`)

Sistema de páginas de nicho × cidade. As variantes programáticas existem para tráfego direto e compatibilidade de URL; só páginas com conteúdo próprio para a combinação nicho+cidade podem ser indexadas.

**Arquitetura (`src/data/landingPages.ts`)**: cada nicho é um `NicheTemplate` e `landingPages` combina esses templates com as cidades suportadas. `PRIORITY_PAGE_OVERRIDES` guarda o conteúdo substancial de uma combinação nicho+cidade. Somente páginas com override têm `indexable: true`, entram no sitemap e recebem links internos. As demais são pré-renderizadas com `noindex, follow` e sem canonical. **Não editar manualmente entradas de `landingPages`** — editar templates, cidades ou overrides.

### Regras obrigatórias da máquina de páginas

Toda página pública nova, institucional ou programática, deve seguir estas regras. Elas fazem parte da arquitetura e não são opcionais:

- A URL deve entrar em `prerenderRoutes` e gerar um arquivo `dist/<rota>/index.html` com o conteúdo completo dentro de `#root`; não entregar apenas o shell vazio da SPA.
- Cada página deve ter exatamente um `<title>` e uma `<meta name="description">`, ambos descritivos e exclusivos em todo o site.
- Cada página indexável deve ter canonical exclusivo e metadados Open Graph/Twitter próprios já presentes no HTML estático. Página programática sem override deve ter `noindex, follow`, não ter canonical e ficar fora do sitemap e dos links internos.
- Cidade e estado com o mesmo nome devem ser diferenciados nos metadados pela UF da cidade, usando `seoIn` (ex.: `São Paulo, SP`).
- A página 404 deve ser estática, responder como 404 na hospedagem, conter `noindex, nofollow` e não possuir canonical.
- O React deve hidratar o HTML existente com `hydrateRoot`; não substituir o conteúdo pré-renderizado.
- Sempre executar `npm run build` após alterar ou criar páginas. O build deve falhar se faltar HTML, title, description, canonical, OG/Twitter ou se title, description ou canonical forem duplicados.

- **Adicionar novo nicho**: criar o `NicheTemplate` não torna suas variantes indexáveis. Para promover uma URL no Google, criar também um `PRIORITY_PAGE_OVERRIDES["nicho:cidade-uf"]` com introdução, dores, benefícios e FAQ realmente próprios daquela combinação e uma data `updatedAt`.
- **Limite: nunca passar de 30 páginas programáticas indexáveis no total.** Conferir `indexableLandingPages.length` antes de promover uma nova URL.
- **Regionalização leve não conta como conteúdo único**: trocar apenas cidade em headline, introdução e metadados não libera indexação. Pain points, benefits, FAQ e introdução precisam de revisão substancial por nicho+cidade; não inventar dados locais para forçar diferenciação.
- **Slug**: `chatbot-para-{nicheSlug}-{stateSlug}` (`stateSlug` vem de `slugify(state.label)`, sem acento). Não mudar esse formato sem atualizar redirects (`netlify.toml`/`vercel.json`) e sitemap.

**Pipeline de build** (100% data-driven — adicionar nicho/estado não exige tocar em nada abaixo):
1. `vite build` → build client normal (`dist/`).
2. `vite build --ssr src/entry-server.tsx --outDir dist-ssr` → bundle SSR só pra prerender (resolve imports de imagem/asset que `tsx` puro não resolve).
3. `node scripts/prerender.mjs` → lê `prerenderRoutes` (rotas institucionais + rotas geradas a partir de `landingPages` em `src/entry-server.tsx`), renderiza cada rota com `renderToString` + `StaticRouter` + `HelmetProvider`, escreve um `index.html` estático por URL e aplica todas as validações das regras obrigatórias acima.
4. `tsx scripts/generate-sitemap.tsx` → gera `dist/sitemap.xml` somente a partir de `indexableLandingPages`.

Tudo isso roda via `npm run build`. Rodar localmente com `npm run build` sempre que mexer em `landingPages.ts`/`entry-server.tsx` pra confirmar que as páginas prerenderizam certo (checar `dist/informacoes/<slug>/index.html` tem title/OG específico da página, não o genérico do `index.html`).

**Template visual** (`src/pages/InformacoesLandingPage.tsx` + `src/components/landing/InformacoesNavbar.tsx`): navbar com barra de contato/redes sociais + nav principal, hero com imagem de fundo e badge nicho·UF, parágrafo intro, cards de pain points/benefits, bloco de parceiro (opcional, via `template.partner`), FAQ em accordion, CTA final, bolha flutuante de WhatsApp. Esse template é único e compartilhado — não duplicar por nicho.

**CTA/lead capture**: só WhatsApp (`src/lib/whatsapp.ts`, `openWhatsApp`), sem form/backend. Segue o mesmo padrão do `ContactSection.tsx` da home.
