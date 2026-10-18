import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code, Smartphone, Globe, Database, Shield, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DrawIcon, KineticText, Reveal } from "@/lib/motion";

const services = [
  {
    icon: Code,
    title: "Desenvolvimento Web",
    description: "Sites institucionais, one page, landing pages, lojas virtuais, blogs, portais e portfólios digitais.",
    features: [
      "Sites Institucionais, One Page, Landing Pages",
      "Lojas Virtuais (e-commerce)",
      "Blogs, Portais, Portfólios Digitais"
    ]
  },
  {
    icon: Smartphone,
    title: "Apps Mobile",
    description: "Aplicativos nativos e híbridos para iOS e Android, desenvolvidos sob medida para sua necessidade.",
    features: [
      "iOS & Android",
      "Experiência Intuitiva",
      "Desenvolvimento sob medida"
    ]
  },
  {
    icon: Zap,
    title: "Automação e Chatbots",
    description: "Automatize processos e atenda clientes em múltiplos canais como WhatsApp, Instagram, e-mail e CRM.",
    features: [
      "WhatsApp, Instagram, E-mail",
      "CRM e links inteligentes",
      "Chatbots personalizados"
    ]
  },
  {
    icon: Database,
    title: "Sistemas e Plataformas Personalizadas",
    description: "Soluções sob medida como sistemas de agendamento, diário de obra, CRM, estoque, OS e plataformas para nichos específicos.",
    features: [
      "Sistemas de Agendamento, Diário de Obra, CRM, Estoque, OS",
      "Soluções por nicho: EAD, Projetos Internos, Reservas"
    ]
  },
  {
    icon: Globe,
    title: "Marketing Digital e Design",
    description: "Impulsione sua marca com identidade visual, social media, tráfego pago e branding.",
    features: [
      "Identidade visual",
      "Social media",
      "Tráfego pago, branding"
    ]
  },
  {
    icon: Shield,
    title: "Consultoria e Suporte",
    description: "Apoio completo com diagnóstico, mentoria, suporte técnico, hospedagem e treinamentos.",
    features: [
      "Diagnóstico, mentoria",
      "Suporte técnico, hospedagem",
      "Treinamentos"
    ]
  }
];

function ServiceCard({ service }: { service: (typeof services)[number] }) {
  return (
    <Card className="group tech-card border-0 hover:tech-glow transition-shadow duration-500 h-full">
      <CardContent className="p-6 sm:p-8">
        <div className="mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <DrawIcon>
              <service.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </DrawIcon>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3">{service.title}</h3>
          <p className="text-sm sm:text-base text-tech-gray leading-relaxed mb-6">{service.description}</p>
        </div>
        <div className="space-y-2">
          {service.features.map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
              <span className="text-xs sm:text-sm text-tech-gray font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SolutionsHorizontalTrack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ trackWidth: 0, viewportW: 0, viewportH: 0 });

  useEffect(() => {
    const measure = () => {
      setDims({
        trackWidth: trackRef.current?.scrollWidth ?? 0,
        viewportW: window.innerWidth,
        viewportH: window.innerHeight,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const scrollDistance = Math.max(dims.trackWidth - dims.viewportW, 0);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);
  const progressWidth = useTransform(scrollYProgress, (v) => `${Math.min(Math.max(v, 0), 1) * 100}%`);

  const containerHeight = dims.viewportH ? dims.viewportH + scrollDistance : "220vh";

  return (
    <div ref={containerRef} style={{ height: containerHeight }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center bg-secondary/50">
        <div className="absolute top-12 sm:top-14 left-0 right-0 text-center z-10 px-4">
          <KineticText
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3"
            parts={[{ text: "Nossas" }, { text: "Soluções", className: "gradient-text" }]}
          />
          <p className="text-base sm:text-lg text-tech-gray max-w-2xl mx-auto">
            Um conjunto completo de serviços tecnológicos pra transformar sua visão em realidade digital.
          </p>
        </div>

        <motion.div ref={trackRef} style={{ x }} className="flex gap-6 pl-[6vw]">
          {services.map((service) => (
            <Reveal key={service.title} className="flex-shrink-0 w-[340px] sm:w-[380px]">
              <ServiceCard service={service} />
            </Reveal>
          ))}
          <div className="flex-shrink-0 w-[6vw]" />
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-40 sm:w-56 h-1 rounded-full bg-tech-gray-light overflow-hidden">
          <motion.div style={{ width: progressWidth }} className="h-full bg-accent" />
        </div>
      </div>
    </div>
  );
}

const ServicesSection = () => {
  return (
    <section id="servicos" className="bg-background">
      <div className="hidden md:block">
        <SolutionsHorizontalTrack />
      </div>

      <div className="md:hidden py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <KineticText
              as="h2"
              className="text-3xl sm:text-4xl font-bold mb-6"
              parts={[{ text: "Nossas" }, { text: "Soluções", className: "gradient-text" }]}
            />
            <p className="text-lg text-tech-gray max-w-3xl mx-auto">
              Oferecemos um conjunto completo de serviços tecnológicos para transformar
              sua visão em realidade digital.
            </p>
          </div>

          <div className="grid gap-6">
            {services.map((service) => (
              <Reveal key={service.title}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
