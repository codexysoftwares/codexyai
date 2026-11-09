import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openWhatsApp } from "@/lib/whatsapp";

const CtaBand = ({ title, text, whatsappMessage }: { title: string; text: string; whatsappMessage: string }) => (
  <section className="bg-primary py-14 text-white sm:py-20">
    <div className="container mx-auto px-4 text-center sm:px-6">
      <h2 className="mb-4 text-2xl font-bold sm:text-3xl">{title}</h2>
      <p className="mx-auto mb-8 max-w-2xl text-white/85">{text}</p>
      <Button
        size="lg"
        variant="secondary"
        className="tech-glow px-8 py-6 text-lg font-semibold"
        onClick={() => openWhatsApp(whatsappMessage)}
      >
        <MessageCircle className="mr-2 h-5 w-5" />
        Falar com a CODEXY no WhatsApp
      </Button>
      <p className="mt-4 text-sm text-white/60">Atendimento em horário comercial, de segunda a sexta.</p>
    </div>
  </section>
);

export default CtaBand;
