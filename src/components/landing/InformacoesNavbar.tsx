import { Github, Instagram, Linkedin, MessageCircle, Phone, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WHATSAPP_PHONE } from "@/lib/whatsapp";
import logo from "/logo.png";

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

interface InformacoesNavbarProps {
  onWhatsAppClick: () => void;
}

const InformacoesNavbar = ({ onWhatsAppClick }: InformacoesNavbarProps) => (
  <header>
    {/* Top contact/social bar */}
    <div className="bg-primary text-white text-xs sm:text-sm">
      <div className="container mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <a
            href="tel:+5531991666106"
            className="flex items-center gap-1.5 hover:text-accent transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            (31) 99166-6106
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 hover:text-accent transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        </div>
        <div className="flex items-center gap-3">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="hover:text-accent transition-colors"
            >
              <social.icon className="w-3.5 h-3.5" />
            </a>
          ))}
        </div>
      </div>
    </div>

    {/* Main nav */}
    <nav className="w-full bg-background border-b border-tech-gray-light py-4 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center flex-shrink-0">
          <img src={logo} alt="Logo Codexy" className="h-10 w-auto" />
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="/" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
            Início
          </a>
          <a href="/servicos/" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
            Serviços
          </a>
          <a href="/segmentos/" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
            Segmentos
          </a>
          <a href="/blog/" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
            Blog
          </a>
          <a href="/#contato" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
            Contato
          </a>
        </div>

        <Button
          className="tech-glow font-semibold flex-shrink-0"
          onClick={onWhatsAppClick}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Falar no </span>WhatsApp
        </Button>
      </div>
    </nav>
  </header>
);

export default InformacoesNavbar;
