import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, MapPin } from "lucide-react";
import NotFound from "@/pages/NotFound";
import SiteLayout from "@/components/landing/SiteLayout";
import PageHero from "@/components/landing/PageHero";
import CtaBand from "@/components/landing/CtaBand";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getSegmentBySlug } from "@/data/segments";
import { getAllBlogPosts } from "@/data/blogPosts";
import { selectRelatedBlogPosts } from "@/lib/relatedBlogPosts";

const SITE_URL = "https://codexy.com.br";

const SegmentoPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const segment = getSegmentBySlug(slug);

  if (!segment) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <NotFound />
      </>
    );
  }

  const { name, sample, cities, byUf } = segment;
  const lower = name.toLowerCase();
  const pageUrl = `${SITE_URL}/segmentos/${segment.slug}/`;
  const title = `Chatbot de WhatsApp para ${name} | CODEXY`;
  const description = `Veja como um chatbot de WhatsApp organiza o atendimento de ${lower} e escolha a sua cidade entre as ${cities.length} atendidas pela CODEXY.`;
  const whatsappMessage = `Olá! Vi a página de chatbot para ${lower} da CODEXY e quero conversar sobre automatizar o meu atendimento.`;
  const ogImage = new URL(sample.seo.ogImage ?? "/logo.png", SITE_URL).toString();
  const posts = selectRelatedBlogPosts(getAllBlogPosts(), { title: `${name} chatbot whatsapp`, excerpt: sample.subheadline }, { limit: 3 });

  const faq = [
    {
      question: `Para que serve um chatbot de WhatsApp em ${lower}?`,
      answer: `Ele responde sozinho às perguntas que se repetem no atendimento, como serviços, horários, localização e como contratar, coleta os dados do cliente e chama a equipe quando a conversa pede uma pessoa. Assim, ninguém fica sem resposta mesmo fora do horário comercial.`,
    },
    {
      question: `A CODEXY atende ${lower} na minha cidade?`,
      answer: `A CODEXY atende empresas de todo o Brasil de forma remota. Nesta página você encontra ${cities.length} cidades com conteúdo específico sobre o segmento. Se a sua não estiver na lista, o atendimento funciona do mesmo jeito: é só chamar no WhatsApp.`,
    },
    {
      question: "Quanto custa implantar o chatbot?",
      answer: `O valor depende dos fluxos de conversa, das integrações (agenda, planilhas, CRM) e do volume de atendimento. Por isso a CODEXY monta uma proposta depois de entender a rotina do seu negócio, sem compromisso.`,
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#page`,
        url: pageUrl,
        name: title,
        description,
        isPartOf: { "@type": "WebSite", name: "CODEXY", url: `${SITE_URL}/` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: cities.length,
          itemListElement: cities.map((city, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${name} em ${city.label}, ${city.uf}`,
            url: `${SITE_URL}/informacoes/${city.pageSlug}/`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Segmentos", item: `${SITE_URL}/segmentos/` },
          { "@type": "ListItem", position: 3, name, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
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
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <link rel="canonical" href={pageUrl} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <SiteLayout whatsappMessage={whatsappMessage}>
        <PageHero
          eyebrow={sample.eyebrow}
          title={`Chatbot de WhatsApp para ${lower}`}
          subtitle={sample.subheadline}
          whatsappMessage={whatsappMessage}
          breadcrumb={[
            { label: "Início", href: "/" },
            { label: "Segmentos", href: "/segmentos/" },
            { label: name },
          ]}
        />

        <section className="bg-background py-14 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="mb-6 text-2xl font-bold text-primary sm:text-3xl">O que costuma travar o atendimento</h2>
                <ul className="space-y-5">
                  {sample.painPoints.map((item) => (
                    <li key={item.title}>
                      <h3 className="font-semibold text-primary">{item.title}</h3>
                      <p className="text-tech-gray">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-2xl font-bold text-primary sm:text-3xl">O que o chatbot resolve</h2>
                <ul className="space-y-5">
                  {sample.benefits.map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-accent" aria-hidden="true" />
                      <div>
                        <h3 className="font-semibold text-primary">{item.title}</h3>
                        <p className="text-tech-gray">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-secondary/40 py-14 sm:py-20" id="cidades">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="mb-3 text-center text-2xl font-bold text-primary sm:text-3xl">
              Chatbot para {lower} por cidade
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-center text-tech-gray">
              Escolha a sua cidade para ver os dados do mercado local de {lower} e como o atendimento por WhatsApp se
              encaixa nele.
            </p>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {byUf.map((group) => (
                <div key={group.uf}>
                  <h3 className="mb-3 flex items-center gap-2 font-bold text-primary">
                    <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
                    {group.uf}
                  </h3>
                  <ul className="space-y-1.5">
                    {group.cities.map((city) => (
                      <li key={city.pageSlug}>
                        <a
                          href={`/informacoes/${city.pageSlug}/`}
                          className="text-tech-gray underline-offset-4 hover:text-accent hover:underline"
                        >
                          {name} em {city.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-14 sm:py-20">
          <div className="container mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="mb-8 text-center text-2xl font-bold text-primary sm:text-3xl">Perguntas frequentes</h2>
            <Accordion type="single" collapsible className="w-full">
              {faq.map((item, i) => (
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

        {posts.length > 0 && (
          <section className="bg-secondary/40 py-14 sm:py-20">
            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="mb-8 text-center text-2xl font-bold text-primary sm:text-3xl">Leituras relacionadas</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {posts.map((post) => (
                  <a
                    key={post.slug}
                    href={`/blog/${post.slug}/`}
                    className="group rounded-xl border border-border bg-background p-5 transition-colors hover:border-accent"
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

        <section className="bg-background py-10">
          <div className="container mx-auto px-4 text-center sm:px-6">
            <p className="text-tech-gray">
              Veja também:{" "}
              <a href="/servicos/chatbot-whatsapp/" className="font-semibold text-accent hover:underline">
                chatbot e automação de WhatsApp
              </a>
              {" · "}
              <a href="/segmentos/" className="font-semibold text-accent hover:underline">
                todos os segmentos
              </a>
            </p>
          </div>
        </section>

        <CtaBand
          title={`Quer automatizar o atendimento da sua empresa de ${lower}?`}
          text="Conte como é o seu atendimento hoje. Você recebe um retorno com os próximos passos e uma proposta sem compromisso."
          whatsappMessage={whatsappMessage}
        />
      </SiteLayout>
    </>
  );
};

export default SegmentoPage;
