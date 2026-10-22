import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  Bot,
  CalendarDays,
  Clock,
  Link2,
  ListTree,
  MessageCircle,
  Share2,
} from "lucide-react";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import { Badge } from "@/components/ui/badge";
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
import { getBlogPostBySlug, getOtherPosts, FALLBACK_COVER, type BlogPost as BlogPostData } from "@/data/blogPosts";
import { landingPages, type LandingPageData } from "@/data/landingPages";
import { openWhatsApp } from "@/lib/whatsapp";

const SITE_URL = "https://codexy.com.br";
const DEFAULT_WHATSAPP_MESSAGE = "Olá! Li um post do blog da CODEXY e quero saber mais sobre automação de atendimento.";
const WORDS_PER_MINUTE = 200;
const PRIORITY_NICHES = ["padarias", "clinicas-odontologicas", "imobiliarias"];

function getRelatedServicePages(post: BlogPostData): LandingPageData[] {
  const text = `${post.title} ${post.excerpt} ${post.category}`.toLowerCase();
  const preferredNiches = text.match(/padaria|bolo|encomenda|alimento|delivery/)
    ? ["padarias", "clinicas-odontologicas", "imobiliarias"]
    : text.match(/odonto|dent|clínica|clinica|paciente|consulta/)
      ? ["clinicas-odontologicas", "padarias", "imobiliarias"]
      : text.match(/im[oó]vel|imobili|corretor|loca[cç][aã]o/)
        ? ["imobiliarias", "padarias", "clinicas-odontologicas"]
        : PRIORITY_NICHES;

  return preferredNiches
    .map((nicheSlug) =>
      landingPages.find(
        (page) => page.nicheSlug === nicheSlug && page.locationSlug === "sao-paulo-sp"
      )
    )
    .filter((page): page is LandingPageData => Boolean(page));
}

function slugifyHeading(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getHeadings(post: BlogPostData) {
  return post.content
    .filter((block) => block.type === "heading" && block.text)
    .map((block) => ({ text: block.text as string, id: slugifyHeading(block.text as string) }));
}

function estimateReadingMinutes(post: BlogPostData): number {
  const words = post.content
    .map((block) => block.text ?? (block.items ?? []).join(" "))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <NotFound />
      </>
    );
  }

  const otherPosts = getOtherPosts(post.slug);
  const relatedServicePages = getRelatedServicePages(post);
  const headings = getHeadings(post);
  const readingMinutes = estimateReadingMinutes(post);
  const pageUrl = `${SITE_URL}/blog/${post.slug}/`;
  const ogImageUrl = new URL(post.seo.ogImage ?? post.coverImage ?? "/logo.png", SITE_URL).toString();
  const shareText = encodeURIComponent(post.title);
  const shareUrl = encodeURIComponent(pageUrl);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo.description,
    datePublished: post.publishedAt,
    image: ogImageUrl,
    publisher: { "@type": "Organization", name: "CODEXY" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog/` },
      { "@type": "ListItem", position: 3, name: post.title, item: pageUrl },
    ],
  };

  const faqSchema = post.faq && post.faq.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  return (
    <>
      <Helmet>
        <title>{post.seo.title}</title>
        <meta name="description" content={post.seo.description} />

        <meta property="og:title" content={post.seo.title} />
        <meta property="og:description" content={post.seo.description} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={post.coverImageAlt} />
        <meta property="og:url" content={pageUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.seo.title} />
        <meta name="twitter:description" content={post.seo.description} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content={post.coverImageAlt} />

        <link rel="canonical" href={pageUrl} />

        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>

      <InformacoesNavbar onWhatsAppClick={() => openWhatsApp(DEFAULT_WHATSAPP_MESSAGE)} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-primary">
        <div className="container relative mx-auto px-4 py-12 sm:px-6 sm:py-16">
          <a
            href="/blog/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar pro blog
          </a>

          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <Badge variant="secondary" className="mb-4 w-fit">
                {post.category}
              </Badge>
              <h1 className="max-w-2xl text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                {post.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg text-white/80">{post.excerpt}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70">
                <span className="flex items-center gap-1.5 font-medium text-white/90">
                  <Bot className="h-4 w-4" />
                  Equipe CODEXY
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(post.publishedAt + "T00:00:00").toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {readingMinutes} min de leitura
                </span>
                {post.source && (
                  <span>
                    Inspirado em{" "}
                    <a
                      href={post.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-white/40 underline-offset-2 hover:text-white"
                    >
                      {post.source.label}
                    </a>
                  </span>
                )}
              </div>
            </div>

            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-primary/30">
              <img
                src={post.coverImage || FALLBACK_COVER}
                alt={post.coverImageAlt ?? post.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Corpo: conteúdo + sidebar */}
      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Início</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/blog/">Blog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">{post.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <article className="min-w-0">
            {post.content.map((block, index) => {
              if (block.type === "heading") {
                return (
                  <h2
                    key={index}
                    id={slugifyHeading(block.text as string)}
                    className="mb-4 mt-10 scroll-mt-24 text-2xl font-bold text-primary first:mt-0"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "list") {
                return (
                  <ul key={index} className="mb-4 list-disc space-y-2 pl-6 text-tech-gray">
                    {block.items?.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={index} className="mb-4 leading-relaxed text-tech-gray">
                  {block.text}
                </p>
              );
            })}

            <div className="mt-12 rounded-2xl bg-secondary/50 p-8 text-center">
              <h2 className="mb-3 text-xl font-bold text-primary">
                Quer automatizar o atendimento da sua empresa?
              </h2>
              <p className="mb-6 text-tech-gray">
                A CODEXY implanta chatbot de WhatsApp pronto pra atender seus clientes 24h.
              </p>
              <Button
                size="lg"
                className="tech-glow group font-semibold"
                onClick={() => openWhatsApp(DEFAULT_WHATSAPP_MESSAGE)}
              >
                <MessageCircle className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                Falar no WhatsApp
              </Button>
            </div>

            {post.faq && post.faq.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-6 text-2xl font-bold text-primary">Perguntas frequentes</h2>
                <Accordion type="single" collapsible>
                  {post.faq.map((item, index) => (
                    <AccordionItem key={item.question} value={`item-${index}`}>
                      <AccordionTrigger className="text-left text-primary">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-tech-gray">{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {/* Compartilhar */}
            <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-8">
              <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
                <Share2 className="h-4 w-4" />
                Compartilhe este artigo
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
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compartilhar no X"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-tech-gray text-xs font-bold transition-colors hover:border-primary/40 hover:text-primary"
              >
                X
              </a>
              <a
                href={pageUrl}
                aria-label="Copiar link"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-tech-gray transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Link2 className="h-4 w-4" />
              </a>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start space-y-6">
            {headings.length > 1 && (
              <nav aria-label="Sumário" className="rounded-xl border border-border bg-secondary/40 p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
                  <ListTree className="h-4 w-4" />
                  Neste artigo
                </div>
                <ol className="space-y-2 text-sm">
                  {headings.map((h) => (
                    <li key={h.id} className="border-l-2 border-transparent pl-3 hover:border-primary/50">
                      <a href={`#${h.id}`} className="text-tech-gray transition-colors hover:text-primary">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div className="rounded-xl bg-primary p-6 text-white">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/70">
                Automatize seu atendimento
              </p>
              <p className="mb-4 text-sm text-white/85">
                Veja como a CODEXY pode ajudar sua empresa a atender melhor no WhatsApp.
              </p>
              <Button
                variant="secondary"
                className="w-full font-semibold"
                onClick={() => openWhatsApp(DEFAULT_WHATSAPP_MESSAGE)}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Falar no WhatsApp
              </Button>
            </div>

            {relatedServicePages.length > 0 && (
              <nav aria-label="Soluções relacionadas" className="rounded-xl border border-border bg-white p-5">
                <h2 className="mb-3 text-sm font-semibold text-primary">Soluções relacionadas</h2>
                <ul className="space-y-2.5 text-sm">
                  {relatedServicePages.map((page) => (
                    <li key={page.slug}>
                      <a
                        href={`/informacoes/${page.slug}/`}
                        className="text-tech-gray transition-colors hover:text-primary hover:underline"
                      >
                        Chatbot para {page.niche.toLowerCase()} em São Paulo
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {otherPosts.length > 0 && (
              <div>
                <h2 className="mb-4 text-sm font-semibold text-primary">Artigos relacionados</h2>
                <div className="space-y-4">
                  {otherPosts.map((other) => (
                    <a key={other.slug} href={`/blog/${other.slug}/`} className="flex gap-3 group">
                      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                        <img
                          src={other.coverImage || FALLBACK_COVER}
                          alt=""
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">
                          {other.title}
                        </p>
                        <p className="mt-1 text-xs text-tech-gray">
                          {estimateReadingMinutes(other)} min de leitura
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogPost;
