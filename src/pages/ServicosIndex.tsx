import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import SiteLayout from "@/components/landing/SiteLayout";
import PageHero from "@/components/landing/PageHero";
import CtaBand from "@/components/landing/CtaBand";
import { servicePages } from "@/data/services";

const SITE_URL = "https://codexy.com.br";
const PAGE_URL = `${SITE_URL}/servicos/`;
const WHATSAPP_MESSAGE = "Olá! Vi os serviços da CODEXY e quero conversar sobre o meu projeto.";

const ServicosIndex = () => {
  const title = "Serviços: Sites, Apps, Chatbot de WhatsApp e Sistemas | CODEXY";
  const description =
    "Criação de sites, aplicativos mobile, chatbot e automação de WhatsApp e sistemas sob medida. Conheça os serviços da CODEXY, de Belo Horizonte para todo o Brasil.";
  const ogImage = `${SITE_URL}/logo.png`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${PAGE_URL}#page`,
        url: PAGE_URL,
        name: title,
        description,
        isPartOf: { "@type": "WebSite", name: "CODEXY", url: `${SITE_URL}/` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: servicePages.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.name,
            url: `${SITE_URL}/servicos/${s.slug}/`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Serviços", item: PAGE_URL },
        ],
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
        <meta property="og:url" content={PAGE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <link rel="canonical" href={PAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <SiteLayout whatsappMessage={WHATSAPP_MESSAGE}>
        <PageHero
          eyebrow="Serviços da CODEXY"
          title="Tecnologia sob medida para a sua empresa vender e atender melhor"
          subtitle="Sites, aplicativos, chatbot de WhatsApp e sistemas desenvolvidos em Belo Horizonte para empresas de todo o Brasil."
          whatsappMessage={WHATSAPP_MESSAGE}
          ctaLabel="Falar sobre o meu projeto"
          breadcrumb={[{ label: "Início", href: "/" }, { label: "Serviços" }]}
        />

        <section className="bg-background py-14 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid gap-6 md:grid-cols-2">
              {servicePages.map((service) => (
                <a
                  key={service.slug}
                  href={`/servicos/${service.slug}/`}
                  className="group flex flex-col rounded-2xl border border-border p-6 transition-colors hover:border-accent sm:p-8"
                >
                  <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">
                    {service.eyebrow}
                  </span>
                  <h2 className="mb-3 text-xl font-bold text-primary group-hover:text-accent sm:text-2xl">
                    {service.name}
                  </h2>
                  <p className="mb-5 flex-1 text-tech-gray">{service.subheadline}</p>
                  <span className="inline-flex items-center gap-2 font-semibold text-accent">
                    Ver detalhes <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </a>
              ))}
            </div>
            <p className="mt-10 text-center text-tech-gray">
              Procura chatbot para um tipo específico de negócio?{" "}
              <a href="/segmentos/" className="font-semibold text-accent hover:underline">
                Veja os segmentos atendidos
              </a>
              .
            </p>
          </div>
        </section>

        <CtaBand
          title="Conte o que você precisa"
          text="Descreva o projeto em poucas linhas. Você recebe um retorno com os próximos passos e uma proposta com escopo, prazo e valor."
          whatsappMessage={WHATSAPP_MESSAGE}
        />
      </SiteLayout>
    </>
  );
};

export default ServicosIndex;
