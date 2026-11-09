import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import PageSeo from "@/components/PageSeo";
import { TrilhaDevShowcase } from "@/components/sections/TrilhaDevShowcase";
import { MobileShowcase } from "@/components/sections/MobileShowcase";
import { DoctorShowcase } from "@/components/sections/DoctorShowcase";
import { ImperialShowcase } from "@/components/sections/ImperialShowcase";
import NicheDirectory from "@/components/NicheDirectory";

const Index = () => {
  return (
    <div className="min-h-screen">
      <PageSeo
        title="Sites, Apps e Chatbot de WhatsApp sob Medida | CODEXY"
        description="CODEXY, de Belo Horizonte: criação de sites, aplicativos, chatbot de WhatsApp e sistemas sob medida para a sua empresa atender melhor e vender mais."
        path="/"
        keywords="chatbot whatsapp, automação de atendimento, desenvolvimento web, aplicativos mobile, chatbots, tecnologia"
        imageAlt="Logo da CODEXY"
      />
      <HeroSection />
      <div id="projetos" data-section="projects" className="portfolio-showcase relative isolate bg-background pt-0">
        <div className="relative pb-[45vh]">
          <div className="sticky top-0 bg-background" style={{ zIndex: 1 }}>
            <TrilhaDevShowcase />
          </div>
        </div>
        <div className="relative pb-[45vh]">
          <div className="sticky top-0 bg-background" style={{ zIndex: 2 }}>
            <MobileShowcase />
          </div>
        </div>
        <div className="relative pb-[45vh]">
          <div className="sticky top-0 bg-background" style={{ zIndex: 3 }}>
            <DoctorShowcase />
          </div>
        </div>
        <div className="relative">
          <div className="sticky top-0 bg-background" style={{ zIndex: 4 }}>
            <ImperialShowcase />
          </div>
        </div>
      </div>
      <ServicesSection />
      <NicheDirectory />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
