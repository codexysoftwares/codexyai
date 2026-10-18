import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import logo from "/logo.png";
import { KineticText, ease } from "@/lib/motion";

const scrollToContact = () =>
  document.querySelector('[data-section="contact"]')?.scrollIntoView({ behavior: "smooth" });

const scrollToProjects = () =>
  document.querySelector('[data-section="projects"]')?.scrollIntoView({ behavior: "smooth" });

const trustedBy = ["Grupo Gontijo Fundações", "Clínica Gabriela Nassif", "Seu Expresso", "DoctorChatBot", "TrilhaDev", "TIP Clínica"];

const beats = [
  { label: "01", title: "Sites e Apps", desc: "Uma presença digital que leva o visitante direto pra conversa." },
  { label: "02", title: "Automação e Chatbots", desc: "WhatsApp, Instagram e e-mail respondendo sozinhos, 24 horas." },
  { label: "03", title: "Sistemas Personalizados", desc: "Agendamento, estoque, CRM e OS desenhados pro seu fluxo real." },
];

function useScrollProgress(ref: React.RefObject<HTMLDivElement>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const compute = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const p = Math.min(Math.max(-rect.top / total, 0), 1);
      setProgress(p);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [ref]);

  return progress;
}

function Beat({ beat, i, progress }: { beat: (typeof beats)[number]; i: number; progress: number }) {
  const start = i / beats.length;
  const fadeIn = start + 0.05;
  const fadeOut = (i + 1) / beats.length - 0.05;
  const end = (i + 1) / beats.length;

  let opacity = 0;
  if (progress <= start || progress >= end) opacity = 0;
  else if (progress < fadeIn) opacity = (progress - start) / 0.05;
  else if (progress > fadeOut) opacity = (end - progress) / 0.05;
  else opacity = 1;

  const mid = (i + 0.5) / beats.length;
  const yProgress = Math.min(Math.max((progress - start) / (mid - start), 0), 1);
  const y = 40 * (1 - yProgress);

  return (
    <div style={{ opacity, transform: `translateY(${y}px)` }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6">
      <span className="text-accent font-mono text-sm mb-4 tracking-widest">{beat.label}</span>
      <h3 className="text-3xl md:text-5xl font-bold text-primary mb-4 max-w-2xl">{beat.title}</h3>
      <p className="text-lg text-tech-gray max-w-md">{beat.desc}</p>
    </div>
  );
}

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(containerRef);

  const heroOpacity = Math.max(1 - progress / 0.04, 0);
  const heroScale = 1 - progress * 0.08;
  const heroY = -progress * 40;
  const glowScale = 1 + progress * 0.7;
  const cueOpacity = progress < 0.05 ? 1 - progress / 0.05 : progress > 0.95 ? (progress - 0.95) / 0.05 : 0;

  return (
    <div ref={containerRef} className="relative hero-gradient" style={{ height: "420vh" }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="CODEXY Hero Background" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-primary/10" />
        </div>

        <div style={{ transform: `scale(${glowScale})` }} className="absolute inset-0 z-[1] pointer-events-none">
          <div className="absolute top-1/4 left-1/5 w-56 h-56 sm:w-96 sm:h-96 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/5 w-48 h-48 sm:w-80 sm:h-80 bg-primary/20 rounded-full blur-3xl" />
        </div>

        <div className="absolute inset-0 z-[1] opacity-10 pointer-events-none grid-drift" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }} />

        <div
          style={{ opacity: heroOpacity, transform: `translateY(${heroY}px) scale(${heroScale})` }}
          className="relative z-20 container mx-auto px-4 sm:px-6 w-full"
        >
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: ease.back }}
            >
              <img src={logo} alt="Logo Codexy" className="h-14 sm:h-16 md:h-20 w-auto mx-auto" />
            </motion.div>

            <KineticText
              as="p"
              onMount
              delay={0.25}
              className="text-lg sm:text-xl lg:text-2xl text-tech-gray font-light"
              parts={[
                { text: "Transformamos ideias em" },
                { text: "soluções digitais", className: "text-accent font-semibold" },
                { text: "que impulsionam o futuro da sua empresa." },
              ]}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75, ease: ease.out }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  className="group px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold tech-glow w-full sm:w-auto"
                  onClick={scrollToContact}
                >
                  Começar Projeto
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold tech-card border-primary/20 hover:border-accent w-full sm:w-auto"
                  onClick={scrollToProjects}
                >
                  <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Ver Portfólio
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9, ease: ease.out }}
              className="pt-1"
            >
              <p className="text-[0.65rem] sm:text-xs uppercase tracking-widest text-tech-gray/70 mb-2">
                Empresas que já confiam na CODEXY
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 sm:gap-x-6 max-w-xl mx-auto">
                {trustedBy.map((name) => (
                  <span key={name} className="text-xs sm:text-sm font-semibold text-primary/70">
                    {name}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {beats.map((beat, i) => (
          <Beat key={beat.label} beat={beat} i={i} progress={progress} />
        ))}

        <div
          style={{ opacity: cueOpacity }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-tech-gray text-xs sm:text-sm"
        >
          <span>role pra continuar</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-px h-6 sm:h-8 bg-tech-gray/40"
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </div>
    </div>
  );
};

export default HeroSection;
