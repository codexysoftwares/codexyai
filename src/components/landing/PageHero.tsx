import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openWhatsApp } from "@/lib/whatsapp";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  whatsappMessage: string;
  ctaLabel?: string;
  breadcrumb: { label: string; href?: string }[];
}

/** Hero compartilhado de serviços e hubs: breadcrumb visível, um único H1 e CTA de WhatsApp. */
const PageHero = ({
  eyebrow,
  title,
  subtitle,
  whatsappMessage,
  ctaLabel = "Pedir orçamento no WhatsApp",
  breadcrumb,
}: PageHeroProps) => (
  <section className="bg-gradient-primary">
    <div className="container mx-auto px-4 py-10 sm:px-6 sm:py-16">
      <nav aria-label="Você está em" className="mb-8 text-sm text-white/75">
        <ol className="flex flex-wrap items-center gap-2">
          {breadcrumb.map((item, i) => (
            <li key={item.label} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {item.href ? (
                <a href={item.href} className="underline-offset-4 hover:text-white hover:underline">
                  {item.label}
                </a>
              ) : (
                <span aria-current="page" className="text-white">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <div className="max-w-3xl">
        <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-semibold text-white">
          {eyebrow}
        </span>
        <h1 className="mb-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl">{title}</h1>
        <p className="mb-10 text-lg text-white/85 sm:text-xl">{subtitle}</p>
        <Button
          size="lg"
          variant="secondary"
          className="tech-glow px-6 py-4 text-base font-semibold sm:px-8 sm:py-6 sm:text-lg"
          onClick={() => openWhatsApp(whatsappMessage)}
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          {ctaLabel}
        </Button>
      </div>
    </div>
  </section>
);

export default PageHero;
