import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import SiteLayout from "@/components/landing/SiteLayout";
import PageHero from "@/components/landing/PageHero";
import CtaBand from "@/components/landing/CtaBand";
import { segments } from "@/data/segments";

const SITE_URL = "https://codexy.com.br";
const PAGE_URL = `${SITE_URL}/segmentos/`;
const WHATSAPP_MESSAGE = "Olá! Vi os segmentos atendidos pela CODEXY e quero um chatbot de WhatsApp para o meu negócio.";

const SegmentosIndex = () => {
  const title = "Chatbot de WhatsApp por Segmento de Negócio | CODEXY";
  const description = `Chatbot de WhatsApp para ${segments.length} tipos de negócio: clínicas, salões, restaurantes, escritórios, oficinas e mais. Escolha o seu segmento e a sua cidade.`;
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
          numberOfItems: segments.length,
          itemListElement: segments.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.name,
            url: `${SITE_URL}/segmentos/${s.slug}/`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Segmentos", item: PAGE_URL },
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
          eyebrow="Chatbot por segmento"
          title="Chatbot de WhatsApp para o seu tipo de negócio"
          subtitle="Cada segmento atende de um jeito. Escolha o seu para ver os problemas de atendimento mais comuns, o que o chatbot resolve e as cidades atendidas."
          whatsappMessage={WHATSAPP_MESSAGE}
          breadcrumb={[{ label: "Início", href: "/" }, { label: "Segmentos" }]}
        />

        <section className="bg-background py-14 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {segments.map((segment) => (
                <li key={segment.slug}>
                  <a
                    href={`/segmentos/${segment.slug}/`}
                    className="group flex h-full items-center justify-between gap-3 rounded-xl border border-border p-5 transition-colors hover:border-accent"
                  >
                    <span>
                      <span className="block font-bold text-primary group-hover:text-accent">{segment.name}</span>
                      <span className="text-sm text-tech-gray">{segment.cities.length} cidades</span>
                    </span>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 text-accent" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-center text-tech-gray">
              Quer conhecer tudo o que a CODEXY faz?{" "}
              <a href="/servicos/" className="font-semibold text-accent hover:underline">
                Veja os serviços
              </a>
              .
            </p>
          </div>
        </section>

        <CtaBand
          title="Não encontrou o seu segmento?"
          text="O chatbot funciona em qualquer negócio que recebe clientes pelo WhatsApp. Conte o que você faz e montamos o fluxo sob medida."
          whatsappMessage={WHATSAPP_MESSAGE}
        />
      </SiteLayout>
    </>
  );
};

export default SegmentosIndex;
