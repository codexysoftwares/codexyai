import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  Bot,
  CalendarCheck,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import Footer from "@/components/Footer";
import InformacoesNavbar from "@/components/landing/InformacoesNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { openWhatsApp } from "@/lib/whatsapp";

const SITE_URL = "https://codexy.com.br";
const PAGE_URL = `${SITE_URL}/parceiros/doctorchatbot/`;
const PARTNER_URL = "https://doctorchatbot.com.br/";
const WHATSAPP_MESSAGE =
  "Olá! Vi a página da parceria entre a CODEXY e a DoctorChatBot e quero saber mais sobre automação para clínicas.";

const benefits = [
  {
    icon: CalendarCheck,
    title: "Agenda inteligente",
    description:
      "Automatiza etapas do agendamento, confirmação e cancelamento para tornar a rotina da clínica mais previsível.",
  },
  {
    icon: MessageCircle,
    title: "Atendimento pelo WhatsApp",
    description:
      "Organiza conversas recorrentes com pacientes e reduz o volume de tarefas manuais da recepção.",
  },
  {
    icon: Bot,
    title: "Automação especializada",
    description:
      "Fluxos pensados para clínicas e profissionais de saúde, com foco em clareza e continuidade do atendimento.",
  },
];

const partnerSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: "DoctorChatBot: parceira tecnológica da CODEXY",
      description:
        "Conheça a DoctorChatBot, empresa parceira da CODEXY com agenda inteligente e automação de atendimento para clínicas.",
      isPartOf: {
        "@type": "WebSite",
        name: "CODEXY",
        url: SITE_URL,
      },
      about: {
        "@type": "SoftwareApplication",
        name: "DoctorChatBot",
        url: PARTNER_URL,
        applicationCategory: "HealthApplication",
        operatingSystem: "Web",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Início",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Parceiros",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "DoctorChatBot",
          item: PAGE_URL,
        },
      ],
    },
  ],
};

const ParceiroDoctorChatbot = () => (
  <>
    <Helmet>
      <title>DoctorChatBot: Parceira para Automação de Clínicas | CODEXY</title>
      <meta
        name="description"
        content="Conheça a DoctorChatBot, empresa parceira da CODEXY com agenda inteligente e automação de atendimento pelo WhatsApp para clínicas."
      />
      <meta
        name="keywords"
        content="DoctorChatBot, agenda inteligente, chatbot para clínicas, automação para clínicas, parceiro CODEXY"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={PAGE_URL} />
      <meta
        property="og:title"
        content="DoctorChatBot: Parceira para Automação de Clínicas | CODEXY"
      />
      <meta
        property="og:description"
        content="Agenda inteligente e automação de atendimento para clínicas em uma solução parceira da CODEXY."
      />
      <meta property="og:image" content={`${SITE_URL}/doctorchatbot.jpg`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="DoctorChatBot: Parceira para Automação de Clínicas | CODEXY"
      />
      <meta
        name="twitter:description"
        content="Conheça a plataforma parceira da CODEXY para agenda e atendimento automatizado em clínicas."
      />
      <meta name="twitter:image" content={`${SITE_URL}/doctorchatbot.jpg`} />
      <link rel="canonical" href={PAGE_URL} />
      <script type="application/ld+json">{JSON.stringify(partnerSchema)}</script>
    </Helmet>

    <InformacoesNavbar onWhatsAppClick={() => openWhatsApp(WHATSAPP_MESSAGE)} />

    <main>
      <section className="relative overflow-hidden bg-gradient-primary py-12 text-white sm:py-20">
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_78%_28%,rgba(255,255,255,0.34),transparent_28%),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:100%_100%,56px_56px,56px_56px]" />
        <div className="container relative mx-auto px-4 sm:px-6">
          <a
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a CODEXY
          </a>

          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold">
                <ShieldCheck className="h-4 w-4" />
                Empresa parceira da CODEXY
              </span>
              <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                DoctorChatBot: agenda inteligente e atendimento automatizado para clínicas
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
                Uma solução especializada na rotina de clínicas, criada para automatizar
                agendamentos, confirmações e conversas recorrentes com pacientes pelo WhatsApp.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" variant="secondary" className="font-semibold">
                  <a href={PARTNER_URL} target="_blank" rel="noopener nofollow sponsored">
                    Conhecer a DoctorChatBot
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/25 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                >
                  <a href="/informacoes/chatbot-para-clinicas-de-estetica-belo-horizonte-mg/">
                    Ver solução para clínicas
                  </a>
                </Button>
              </div>
            </div>

            <a
              href={PARTNER_URL}
              target="_blank"
              rel="noopener"
              aria-label="Visitar o site oficial da DoctorChatBot"
              className="group overflow-hidden rounded-2xl border border-white/15 bg-primary/50 p-2 shadow-2xl shadow-primary/40"
            >
              <img
                src="/doctorchatbot.jpg"
                alt="Interface da plataforma DoctorChatBot para gestão e atendimento de clínicas"
                width="1600"
                height="650"
                loading="eager"
                className="aspect-[32/13] w-full rounded-xl object-cover object-left-top transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Parceria com propósito
            </span>
            <h2 className="mt-3 text-3xl font-bold text-primary sm:text-4xl">
              Tecnologia alinhada à rotina das clínicas
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-tech-gray">
              A CODEXY apresenta a DoctorChatBot como parceira especializada em automação
              para saúde. A indicação é contextual: a plataforma atende necessidades
              específicas de clínicas e equipes de recepção.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="tech-card border-0">
                <CardContent className="p-6">
                  <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-white">
                    <benefit.icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-lg font-semibold text-primary">{benefit.title}</h3>
                  <p className="mt-2 leading-relaxed text-tech-gray">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-4xl rounded-2xl border border-accent/15 bg-white p-8 shadow-xl shadow-primary/5 sm:p-12">
            <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  <CheckCircle2 className="h-4 w-4" />
                  Site oficial verificado
                </span>
                <h2 className="mt-3 text-2xl font-bold text-primary sm:text-3xl">
                  Conheça a solução diretamente na DoctorChatBot
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-tech-gray">
                  Consulte os recursos, a proposta da plataforma e os canais oficiais no
                  domínio da empresa parceira.
                </p>
              </div>
              <Button asChild size="lg" className="font-semibold">
                <a href={PARTNER_URL} target="_blank" rel="noopener nofollow sponsored">
                  Acessar site oficial
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </>
);

export default ParceiroDoctorChatbot;
