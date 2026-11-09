import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import InformacoesNavbar from "@/components/landing/InformacoesNavbar";
import { openWhatsApp } from "@/lib/whatsapp";

/** Navbar + rodapé das páginas internas de serviço e de segmento. */
const SiteLayout = ({ children, whatsappMessage }: { children: ReactNode; whatsappMessage: string }) => (
  <>
    <InformacoesNavbar onWhatsAppClick={() => openWhatsApp(whatsappMessage)} />
    <main>{children}</main>
    <Footer />
  </>
);

export default SiteLayout;
