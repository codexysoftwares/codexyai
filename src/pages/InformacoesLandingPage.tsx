import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Link2,
  ListTree,
  Lock,
  MapPin,
  MessageCircle,
  Package,
  Share2,
  ShieldCheck,
  Sparkles,
  Wrench,
  XCircle,
} from "lucide-react";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import InformacoesNavbar from "@/components/landing/InformacoesNavbar";
import { getLandingPageBySlug, getRelatedPages, type LandingPageData } from "@/data/landingPages";
import { getAllBlogPosts } from "@/data/blogPosts";
import { openWhatsApp } from "@/lib/whatsapp";

const SITE_URL = "https://codexy.com.br";
const WORDS_PER_MINUTE = 200;
const CTA_IMAGE = "/images/shared/cta-professional.jpg";

const TRUST_PILLARS = [
  { icon: Wrench, title: "Desenvolvimento sob medida", description: "Cada projeto pensado pro negócio específico — não é solução genérica de prateleira." },
  { icon: Sparkles, title: "No WhatsApp que já existe", description: "Usa o número que a empresa já usa — cliente não precisa salvar contato novo." },
  { icon: ShieldCheck, title: "Suporte na implantação", description: "Acompanhamento até o chatbot responder do jeito certo, não só entrega e some." },
];

const PROCESS_STEPS = [
  { title: "Diagnóstico", description: "Entendemos o atendimento atual e onde o chatbot ajuda mais." },
  { title: "Configuração", description: "Montamos os fluxos de resposta específicos pro seu nicho." },
  { title: "Integração", description: "Conectamos ao WhatsApp Business que a empresa já usa." },
  { title: "Testes", description: "Validamos as respostas antes de colocar no ar de verdade." },
  { title: "Acompanhamento", description: "Ajustes depois que o chatbot já tá atendendo cliente real." },
];

const DELIVERABLES = [
  "Chatbot configurado e funcionando no seu WhatsApp Business",
  "Respostas automáticas pros assuntos mais comuns do seu nicho",
  "Encaminhamento pra atendimento humano quando a conversa exige",
  "Suporte durante a implantação e os primeiros ajustes",
];

function estimateReadingMinutes(page: LandingPageData): number {
  const words = [
    page.introParagraph,
    ...page.painPoints.flatMap((p) => [p.title, p.description]),
    ...page.benefits.flatMap((b) => [b.title, b.description]),
    ...page.faq.flatMap((f) => [f.question, f.answer]),
  ]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

const InformacoesLandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = getLandingPageBySlug(slug);

  if (!page) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <NotFound />
      </>
    );
  }

  const { otherNichesSameLocation, otherLocationsSameNiche } = getRelatedPages(page);
  const recentBlogPosts = getAllBlogPosts().slice(0, 3);
  const readingMinutes = estimateReadingMinutes(page);
  const pageUrl = `${SITE_URL}/informacoes/${page.slug}/`;
  const shareText = encodeURIComponent(page.headline);
  const shareUrl = encodeURIComponent(pageUrl);
  const ogImageUrl = new URL(page.seo.ogImage ?? "/logo.png", SITE_URL).toString();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: page.eyebrow, item: pageUrl },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{page.seo.title}</title>
        <meta name="description" content={page.seo.description} />
        <meta
          name="keywords"
          content={`${page.service}, ${page.niche}, ${page.stateLabel}, whatsapp, automação`}
        />

        <meta property="og:title" content={page.seo.title} />
        <meta property="og:description" content={page.seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={page.heroImageAlt} />
        <meta property="og:url" content={pageUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={page.seo.title} />
        <meta name="twitter:description" content={page.seo.description} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content={page.heroImageAlt} />

        <link rel="canonical" href={pageUrl} />

        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <InformacoesNavbar onWhatsAppClick={() => openWhatsApp(page.whatsappMessage)} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-primary">
        <div className="absolute inset-0 hidden md:block">
          <img
            src={page.heroImage}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/35 via-transparent to-primary/15" />
        </div>

        <div className="container relative mx-auto px-4 py-10 sm:px-6 sm:py-16 md:min-h-[590px]">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Ver todos os serviços
            </a>
            <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-white/15 text-white font-semibold text-xs sm:text-sm">
              <MapPin className="w-3.5 h-3.5" />
              {page.niche.toUpperCase()} · {page.stateUf}
            </span>
          </div>

          <div className="grid items-center md:grid-cols-2">
            <div className="max-w-2xl text-center md:text-left">
            <span className="inline-block mb-4 px-4 py-1 rounded-full bg-white/15 text-white font-semibold text-sm">
              {page.eyebrow}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
              {page.headline}
            </h1>
            <p className="mb-10 max-w-xl text-lg text-white/85 sm:text-xl md:mx-0">
              {page.subheadline}
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="px-6 sm:px-8 py-4 sm:py-6 tech-glow group text-base sm:text-lg font-semibold"
              onClick={() => openWhatsApp(page.whatsappMessage)}
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:translate-x-1 transition-transform" />
              Falar no WhatsApp
            </Button>
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-primary/30 md:hidden">
              <img
                src={page.heroImage}
                alt={page.heroImageAlt}
                width="1536"
                height="1024"
                loading="eager"
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Banda de confiança */}
      <section className="border-b border-border bg-secondary/30 py-8">
        <div className="container mx-auto grid gap-6 px-4 sm:grid-cols-3 sm:px-6">
          {TRUST_PILLARS.map((pillar) => (
            <div key={pillar.title} className="flex items-start gap-3">
              <pillar.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
              <div>
                <p className="text-sm font-semibold text-primary">{pillar.title}</p>
                <p className="text-xs text-tech-gray">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 sm:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Início</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">
                  {page.niche} {page.stateIn}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <p className="text-base sm:text-lg text-tech-gray leading-relaxed">
            {page.introParagraph}
          </p>

          <blockquote className="mt-8 rounded-xl border-l-4 border-accent bg-secondary/40 p-5 text-tech-gray">
            <p className="font-medium text-primary">Automatizar não é substituir o atendimento humano.</p>
            <p>É dar mais tempo pro que realmente importa: o cliente na sua frente.</p>
          </blockquote>

          <nav aria-label="Sumário" className="mt-8 rounded-xl border border-border bg-secondary/40 p-5">
            <div className="mb-3 flex items-center justify-between gap-3 text-sm font-semibold text-primary">
              <span className="flex items-center gap-2">
                <ListTree className="h-4 w-4" />
                Sumário
              </span>
              <span className="flex items-center gap-1.5 font-normal text-tech-gray">
                <Clock className="h-4 w-4" />
                {readingMinutes} min de leitura
              </span>
            </div>
            <ol className="space-y-1.5 text-sm">
              <li>
                <a href="#desafios" className="text-tech-gray transition-colors hover:text-primary">
                  Desafios comuns em {page.niche.toLowerCase()}
                </a>
              </li>
              <li>
                <a href="#beneficios" className="text-tech-gray transition-colors hover:text-primary">
                  O que o chatbot resolve
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="text-tech-gray transition-colors hover:text-primary">
                  Como funciona
                </a>
              </li>
              <li>
                <a href="#entregaveis" className="text-tech-gray transition-colors hover:text-primary">
                  O que você recebe
                </a>
              </li>
              <li>
                <a href="#faq" className="text-tech-gray transition-colors hover:text-primary">
                  Perguntas frequentes
                </a>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 id="desafios" className="scroll-mt-24 text-2xl sm:text-3xl font-bold mb-10 text-center text-primary">
            Desafios comuns em {page.niche.toLowerCase()}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {page.painPoints.map((item) => (
              <Card key={item.title} className="tech-card border-0">
                <CardContent className="p-6 flex items-start gap-4">
                  <XCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-primary mb-1">{item.title}</h3>
                    <p className="text-sm text-tech-gray">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 id="beneficios" className="scroll-mt-24 text-2xl sm:text-3xl font-bold mb-10 text-center text-primary">
            O que o chatbot resolve
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {page.benefits.map((item) => (
              <Card key={item.title} className="tech-card border-0">
                <CardContent className="p-6 flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-primary mb-1">{item.title}</h3>
                    <p className="text-sm text-tech-gray">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <h2 id="como-funciona" className="scroll-mt-24 text-2xl sm:text-3xl font-bold mb-10 text-center text-primary">
            Como funciona
          </h2>
          <div className="grid gap-6 sm:grid-cols-5">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center text-center sm:items-start sm:text-left">
                <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mb-1 font-semibold text-primary">{step.title}</h3>
                <p className="text-sm text-tech-gray">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que você recebe */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <h2 id="entregaveis" className="scroll-mt-24 text-2xl sm:text-3xl font-bold mb-10 text-center text-primary">
            O que você recebe
          </h2>
          <div className="space-y-4">
            {DELIVERABLES.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-secondary/30 p-4">
                <Package className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                <p className="text-sm text-tech-gray">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {page.partner && (
        <section className="bg-primary py-16 text-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-primary-glow/80 to-primary p-8 shadow-2xl shadow-primary/30 sm:p-12">
              <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_85%_20%,rgba(0,85,255,0.45),transparent_32%),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:100%_100%,48px_48px,48px_48px]" />
              <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/85">
                    <ShieldCheck className="h-4 w-4" />
                    {page.partner.eyebrow}
                  </span>
                  <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
                    {page.partner.title}
                  </h2>
                  <p className="mt-4 max-w-2xl leading-relaxed text-white/75">
                    {page.partner.description}
                  </p>
                  <a
                    href={page.partner.detailsPath}
                    className="mt-5 inline-flex text-sm font-semibold text-accent-glow transition-colors hover:text-white"
                  >
                    Entenda a parceria entre CODEXY e {page.partner.name}
                  </a>
                </div>

                <Button asChild size="lg" variant="secondary" className="font-semibold">
                  <a href={page.partner.url} target="_blank" rel="noopener nofollow sponsored">
                    {page.partner.ctaLabel}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Compartilhar */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
            <Share2 className="h-4 w-4" />
            Compartilhe
          </span>
          <a
            href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Compartilhar no WhatsApp"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-tech-gray transition-colors hover:border-primary/40 hover:text-primary"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Compartilhar no LinkedIn"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-tech-gray text-xs font-bold transition-colors hover:border-primary/40 hover:text-primary"
          >
            in
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Compartilhar no Facebook"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-tech-gray text-xs font-bold transition-colors hover:border-primary/40 hover:text-primary"
          >
            f
          </a>
          <a
            href={pageUrl}
            aria-label="Copiar link"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-tech-gray transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Link2 className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <h2 id="faq" className="scroll-mt-24 text-2xl sm:text-3xl font-bold mb-10 text-center text-primary">
            Perguntas frequentes
          </h2>
          <Accordion type="single" collapsible>
            {page.faq.map((item, index) => (
              <AccordionItem key={item.question} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-tech-gray">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-16 sm:py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid gap-8 items-center md:grid-cols-[1fr_auto] max-w-4xl mx-auto">
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
                Pronto para automatizar o atendimento de {page.niche.toLowerCase()} {page.stateIn}?
              </h2>
              <p className="text-white/80 mb-8 max-w-2xl">
                Fale agora com a CODEXY e veja como implantar um chatbot no WhatsApp
                para {page.niche.toLowerCase()} {page.stateIn}.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="px-6 sm:px-8 py-4 sm:py-6 tech-glow group text-base sm:text-lg font-semibold"
                onClick={() => openWhatsApp(page.whatsappMessage)}
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                Enviar Mensagem no WhatsApp
              </Button>
            </div>
            <div className="hidden md:block h-40 w-40 overflow-hidden rounded-2xl border-4 border-white/20">
              <img src={CTA_IMAGE} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Segurança — afirmação real e verificável */}
      <section className="py-6 bg-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl flex items-center gap-3 text-sm text-tech-gray">
          <Lock className="h-4 w-4 flex-shrink-0" />
          A conversa acontece no seu WhatsApp normal, com a mesma criptografia de ponta a ponta que você já usa.
        </div>
      </section>

      {recentBlogPosts.length > 0 && (
        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <h2 className="mb-6 text-lg font-semibold text-primary">Leia também no blog</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {recentBlogPosts.map((post) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}/`}
                  className="flex gap-3 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40"
                >
                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                    {post.coverImage && (
                      <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <p className="line-clamp-3 text-sm font-medium text-foreground">{post.title}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {(otherNichesSameLocation.length > 0 || otherLocationsSameNiche.length > 0) && (
        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            {otherNichesSameLocation.length > 0 && (
              <div className="mb-10">
                <h2 className="mb-4 text-lg font-semibold text-primary">
                  Outros serviços {page.stateIn}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {otherNichesSameLocation.map((related) => (
                    <a
                      key={related.slug}
                      href={`/informacoes/${related.slug}/`}
                      className="rounded-full border border-primary/20 bg-background px-4 py-2 text-sm text-primary transition-colors hover:bg-primary hover:text-white"
                    >
                      {related.niche}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {otherLocationsSameNiche.length > 0 && (
              <div>
                <h2 className="mb-4 text-lg font-semibold text-primary">
                  {page.niche} em outras localidades
                </h2>
                <div className="flex flex-wrap gap-3">
                  {otherLocationsSameNiche.map((related) => (
                    <a
                      key={related.slug}
                      href={`/informacoes/${related.slug}/`}
                      className="rounded-full border border-primary/20 bg-background px-4 py-2 text-sm text-primary transition-colors hover:bg-primary hover:text-white"
                    >
                      {related.stateLabel}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />

      <button
        type="button"
        aria-label="Falar no WhatsApp"
        onClick={() => openWhatsApp(page.whatsappMessage)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </>
  );
};

export default InformacoesLandingPage;
