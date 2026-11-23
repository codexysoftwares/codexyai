import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { BookOpen, Check } from "lucide-react";
import Footer from "@/components/Footer";
import PageSeo from "@/components/PageSeo";
import InformacoesNavbar from "@/components/landing/InformacoesNavbar";
import EbookForm from "@/components/ebook/EbookForm";
import { openWhatsApp } from "@/lib/whatsapp";

/**
 * Página própria do e-book (/ebook/). Existe para o e-book ter um link
 * divulgável (Instagram, WhatsApp, e-mail de prospecção, posts do blog),
 * em vez de depender só do popup.
 */

const PAGE_PATH = "/ebook/";
const TITLE = "E-book grátis: IA para automatizar processos | CODEXY";
const DESCRIPTION =
  "Guia gratuito da CODEXY: o que vale automatizar, 8 processos para começar, fluxos prontos, prompts, custos e um plano de 30 dias. Baixe em PDF.";

const CHAPTERS = [
  "O que a IA resolve e o que ela não resolve",
  "Automação, IA e chatbot: qual a diferença",
  "Como descobrir o que vale automatizar",
  "8 processos para começar",
  "Três fluxos montados, passo a passo",
  "Ferramentas de cada categoria",
  "Prompts prontos para o dia a dia",
  "Cuidados com dados, LGPD e revisão humana",
  "Quanto custa e como saber se valeu a pena",
  "Plano de 30 dias e checklist final",
];

const FOR_WHO = [
  "Donos de pequenas e médias empresas que querem tirar tarefas repetidas da equipe",
  "Quem atende muito pelo WhatsApp e não dá conta de responder todo mundo",
  "Gestores que ouvem falar de IA toda semana e querem saber por onde começar",
];

/** De onde a pessoa veio (post do blog, Instagram...), para saber o que trouxe o lead. */
function originPath(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = params.get("utm_source") || params.get("origem");
    if (utm) return `${PAGE_PATH} (origem: ${utm.slice(0, 60)})`;
    if (document.referrer) {
      const ref = new URL(document.referrer);
      if (ref.host === window.location.host) return `${PAGE_PATH} (veio de ${ref.pathname})`;
      return `${PAGE_PATH} (veio de ${ref.host})`;
    }
  } catch {
    // referrer inválido: fica só o caminho da página
  }
  return PAGE_PATH;
}

const EbookPage = () => {
  const [pagePath, setPagePath] = useState(PAGE_PATH);
  useEffect(() => setPagePath(originPath()), []);

  return (
    <div className="min-h-screen bg-background">
      <PageSeo title={TITLE} description={DESCRIPTION} path={PAGE_PATH} />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "E-book: como usar IA para automatizar processos",
            description: DESCRIPTION,
            url: `https://codexy.com.br${PAGE_PATH}`,
            publisher: { "@type": "Organization", name: "CODEXY", url: "https://codexy.com.br" },
          })}
        </script>
      </Helmet>

      <InformacoesNavbar onWhatsAppClick={() => openWhatsApp("Olá! Vim pela página do e-book de IA e quero conversar sobre automação.")} />

      <section className="bg-gradient-primary">
        <div className="container mx-auto grid gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div className="text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-white/70">E-book gratuito · PDF</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Como usar IA para automatizar os processos da sua empresa
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">
              Um guia prático, sem jargão, para descobrir o que vale automatizar, montar os primeiros fluxos e saber
              quanto isso custa antes de contratar qualquer coisa.
            </p>
            <ul className="mt-8 space-y-3">
              {["8 processos para começar ainda este mês", "Fluxos de atendimento, agenda e cobrança montados", "Plano de 30 dias com checklist"].map((item) => (
                <li key={item} className="flex gap-3 text-white/90">
                  <Check className="mt-0.5 h-5 w-5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-background p-6 shadow-2xl sm:p-8">
            <p className="mb-4 text-lg font-bold text-primary">Receba o PDF agora</p>
            <EbookForm pagePath={pagePath} hideHeading />
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-12 px-4 py-14 sm:px-6 md:grid-cols-2">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-primary">
            <BookOpen className="h-6 w-6" /> O que tem dentro
          </h2>
          <ol className="mt-6 space-y-3">
            {CHAPTERS.map((chapter, index) => (
              <li key={chapter} className="flex gap-3 text-tech-gray">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <span className="pt-0.5">{chapter}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary">Para quem é</h2>
          <ul className="mt-6 space-y-3">
            {FOR_WHO.map((item) => (
              <li key={item} className="flex gap-3 text-tech-gray">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 rounded-2xl bg-secondary/50 p-6 text-tech-gray">
            Escrito pela equipe da CODEXY, que implanta chatbots de WhatsApp, sistemas e automações para empresas.
            O e-book é gratuito e você baixa na hora, depois de preencher o formulário.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EbookPage;
