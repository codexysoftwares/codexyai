import { motion } from "framer-motion";
import { Check, ExternalLink } from "lucide-react";
import { Section } from "@/components/Section";

const features = [
  "Agenda inteligente automatizada",
  "Chatbot via WhatsApp",
  "Confirmação e cancelamento automático",
  "Gestão de pacientes e histórico",
  "Notificações e lembretes",
  "Painel administrativo para clínicas",
];

const stack = ["React", "Node.js", "WhatsApp API", "MySQL", "IA", "Linux"];

function BrowserMockup() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-full"
    >
      <div className="absolute inset-[-30px] rounded-3xl bg-blue-500/10 blur-[60px]" />
      <div className="relative rounded-xl bg-[#141414] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(255,255,255,0.08)]">
        {/* browser bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 mx-3 px-3 py-1 rounded-md bg-white/[0.05] text-[10px] font-mono text-white/30 truncate">
            doctorchatbot.com.br
          </div>
          <a
            href="https://doctorchatbot.com.br"
            target="_blank"
            rel="noopener"
            aria-label="Abrir o site oficial da DoctorChatBot"
            className="p-1 rounded text-white/20 hover:text-white/60 transition-colors"
          >
            <ExternalLink size={11} />
          </a>
        </div>
        {/* screen */}
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src="/doctorchatbot.jpg"
            alt="DoctorChatBot"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-left-top"
          />
        </div>
      </div>
    </motion.div>
  );
}

export function DoctorShowcase() {
  return (
    <Section
      id="doctorchatbot"
      eyebrow="SaaS · IA"
      description="Atendimento médico mais ágil com agenda inteligente, automação via WhatsApp e uma jornada clara para clínicas que precisam ganhar escala."
      title={
        <>
          DoctorChatBot
        </>
      }
    >
      <div className="grid lg:grid-cols-2 gap-16 items-center">

        {/* left: info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
            Plataforma SaaS com agenda inteligente para médicos e clínicas. O chatbot automatiza agendamentos, confirmações e a comunicação com pacientes — sem intervenção manual.
          </p>
          <a
            href="/parceiros/doctorchatbot/"
            className="mt-4 inline-flex text-sm font-semibold text-accent transition-colors hover:text-accent-glow"
          >
            Empresa parceira da CODEXY
          </a>

          <ul className="mt-8 space-y-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                <span className="h-5 w-5 rounded-full bg-gradient-primary grid place-items-center shrink-0 shadow-[0_0_12px_hsl(var(--accent)/0.45)]">
                  <Check size={11} className="text-white" />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-2">
            {stack.map((s) => (
              <span key={s} className="px-3 py-1.5 rounded-lg tech-card text-xs font-mono text-muted-foreground">
                {s}
              </span>
            ))}
          </div>

          <a
            href="https://doctorchatbot.com.br"
            target="_blank"
            rel="noopener"
            className="mt-8 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-primary font-semibold text-white text-sm shadow-[0_0_24px_hsl(var(--accent)/0.35)] hover:shadow-[0_0_40px_hsl(var(--accent)/0.55)] transition-all"
          >
            <ExternalLink size={14} /> Conhecer a DoctorChatBot
          </a>
        </motion.div>

        {/* right: browser mockup */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <BrowserMockup />
        </motion.div>

      </div>
    </Section>
  );
}
