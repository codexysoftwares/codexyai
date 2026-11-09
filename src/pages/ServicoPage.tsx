import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import NotFound from "@/pages/NotFound";
import SiteLayout from "@/components/landing/SiteLayout";
import PageHero from "@/components/landing/PageHero";
import CtaBand from "@/components/landing/CtaBand";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getServiceBySlug, servicePages } from "@/data/services";
import { segments } from "@/data/segments";
import { getAllBlogPosts } from "@/data/blogPosts";
import { selectRelatedBlogPosts } from "@/lib/relatedBlogPosts";

const SITE_URL = "https://codexy.com.br";

const ServicoPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = getServiceBySlug(slug);

  if (!service) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <NotFound />
      </>
    );
  }

  const pageUrl = `${SITE_URL}/servicos/${service.slug}/`;
  const ogImage = `${SITE_URL}/logo.png`;
  const relatedServices = service.related
    .map((s) => servicePages.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const featured = service.featuredNiches
    .map((s) => segments.find((seg) => seg.slug === s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const posts = selectRelatedBlogPosts(getAllBlogPosts(), service.blogTopic, { limit: 3 });

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: service.name,
        serviceType: service.serviceType,
        description: service.seo.description,
        url: pageUrl,
        areaServed: { "@type": "Country", name: "Brasil" },
        provider: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Serviços", item: `${SITE_URL}/servicos/` },
          { "@type": "ListItem", position: 3, name: service.name, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{service.seo.title}</title>
        <meta name="description" content={service.seo.description} />
        <meta name="keywords" content={service.seo.keywords} />
        <meta property="og:title" content={service.seo.title} />
        <meta property="og:description" content={service.seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={service.seo.title} />
        <meta name="twitter:description" content={service.seo.description} />
        <meta name="twitter:image" content={ogImage} />
        <link rel="canonical" href={pageUrl} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <SiteLayout whatsappMessage={service.whatsappMessage}>
        <PageHero
          eyebrow={service.eyebrow}
          title={service.h1}
          subtitle={service.subheadline}
          whatsappMessage={service.whatsappMessage}
          breadcrumb={[
            { label: "Início", href: "/" },
            { label: "Serviços", href: "/servicos/" },
            { label: service.name },
          ]}
        />

        <section className="bg-background py-14 sm:py-20">
          <div className="container mx-auto max-w-3xl space-y-5 px-4 sm:px-6">
            {service.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-lg leading-relaxed text-tech-gray">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="bg-secondary/40 py-14 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="mb-10 text-center text-2xl font-bold text-primary sm:text-3xl">Para quem é este serviço</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {service.forWhom.map((item) => (
                <Card key={item.title} className="tech-card border-0">
                  <CardContent className="p-6">
                    <h3 className="mb-2 text-lg font-bold text-primary">{item.title}</h3>
                    <p className="text-tech-gray">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-14 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="mb-10 text-center text-2xl font-bold text-primary sm:text-3xl">O que está incluído</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {service.deliverables.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <h3 className="mb-1 font-semibold text-primary">{item.title}</h3>
                    <p className="text-sm text-tech-gray">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-secondary/40 py-14 sm:py-20">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="mb-10 text-center text-2xl font-bold text-primary sm:text-3xl">Como funciona</h2>
            <ol className="space-y-6">
              {service.steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-primary">{step.title}</h3>
                    <p className="text-tech-gray">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-background py-14 sm:py-20">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="mb-8 text-center text-2xl font-bold text-primary sm:text-3xl">Perguntas frequentes</h2>
            <Accordion type="single" collapsible className="w-full">
              {service.faq.map((item, i) => (
                <AccordionItem key={item.question} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-base font-semibold text-primary">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-tech-gray">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {featured.length > 0 && (
          <section className="bg-secondary/40 py-14 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="mb-3 text-center text-2xl font-bold text-primary sm:text-3xl">
                Veja como funciona no seu segmento
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-center text-tech-gray">
                Cada tipo de negócio tem uma rotina de atendimento diferente. Escolha o seu para ver exemplos e as
                cidades atendidas.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {featured.map((segment) => (
                  <a
                    key={segment.slug}
                    href={`/segmentos/${segment.slug}/`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-tech-gray transition-colors hover:border-accent hover:text-primary"
                  >
                    {segment.name}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ))}
                <a
                  href="/segmentos/"
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
                >
                  Todos os segmentos
                </a>
              </div>
            </div>
          </section>
        )}

        {posts.length > 0 && (
          <section className="bg-background py-14 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="mb-8 text-center text-2xl font-bold text-primary sm:text-3xl">
                Artigos para ler antes de decidir
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                {posts.map((post) => (
                  <a
                    key={post.slug}
                    href={`/blog/${post.slug}/`}
                    className="group rounded-xl border border-border p-5 transition-colors hover:border-accent"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-accent">{post.category}</span>
                    <h3 className="mt-2 font-bold text-primary group-hover:text-accent">{post.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-tech-gray">{post.excerpt}</p>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-secondary/40 py-14 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="mb-6 text-center text-xl font-bold text-primary">Outros serviços da CODEXY</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedServices.map((other) => (
                <a
                  key={other.slug}
                  href={`/servicos/${other.slug}/`}
                  className="rounded-xl border border-border bg-background p-5 transition-colors hover:border-accent"
                >
                  <h3 className="font-bold text-primary">{other.name}</h3>
                  <p className="mt-1 text-sm text-tech-gray">{other.subheadline}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <CtaBand
          title={`Vamos conversar sobre ${service.name.toLowerCase()}?`}
          text="Conte rapidamente o que você precisa. Você recebe um retorno com os próximos passos e, se fizer sentido, uma proposta com escopo, prazo e valor."
          whatsappMessage={service.whatsappMessage}
        />
      </SiteLayout>
    </>
  );
};

export default ServicoPage;
