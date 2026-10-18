import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PoliticaPrivacidade from "./pages/politica-privacidade";
import TermosUso from "./pages/termos-uso";
import Cookies from "./pages/cookies";
import InformacoesLandingPage from "./pages/InformacoesLandingPage";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";
import ParceiroDoctorChatbot from "./pages/ParceiroDoctorChatbot";
import WhatsAppFloatButton from "./components/WhatsAppFloatButton";
import Preview1Melhorada from "./pages/previews/Preview1Melhorada";
import Preview2Console from "./pages/previews/Preview2Console";
import Preview3Vitrine from "./pages/previews/Preview3Vitrine";
import Preview4Despacho from "./pages/previews/Preview4Despacho";
import Preview5Cinematic from "./pages/previews/Preview5Cinematic";
import Preview6MelhoradaSpotlight from "./pages/previews/Preview6MelhoradaSpotlight";
import Preview7MelhoradaBento from "./pages/previews/Preview7MelhoradaBento";
import Preview8MelhoradaSplit from "./pages/previews/Preview8MelhoradaSplit";
import Preview9CinematicHorizontal from "./pages/previews/Preview9CinematicHorizontal";
import Preview10CinematicTextReveal from "./pages/previews/Preview10CinematicTextReveal";
import Preview11CinematicParallax from "./pages/previews/Preview11CinematicParallax";

const queryClient = new QueryClient();

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* "user": quem ativou reduzir movimento no sistema não vê animação de transform. */}
      <MotionConfig reducedMotion="user">
        <Toaster />
        <Sonner />
        {children}
      </MotionConfig>
    </TooltipProvider>
  </QueryClientProvider>
);

export const AppRoutes = () => (
  <>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
      <Route path="/termos-uso" element={<TermosUso />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/parceiros/doctorchatbot" element={<ParceiroDoctorChatbot />} />
      <Route path="/informacoes/:slug" element={<InformacoesLandingPage />} />
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/preview/melhorada" element={<Preview1Melhorada />} />
      <Route path="/preview/console" element={<Preview2Console />} />
      <Route path="/preview/vitrine" element={<Preview3Vitrine />} />
      <Route path="/preview/despacho" element={<Preview4Despacho />} />
      <Route path="/preview/cinematic" element={<Preview5Cinematic />} />
      <Route path="/preview/melhorada-spotlight" element={<Preview6MelhoradaSpotlight />} />
      <Route path="/preview/melhorada-bento" element={<Preview7MelhoradaBento />} />
      <Route path="/preview/melhorada-split" element={<Preview8MelhoradaSplit />} />
      <Route path="/preview/cinematic-horizontal" element={<Preview9CinematicHorizontal />} />
      <Route path="/preview/cinematic-textreveal" element={<Preview10CinematicTextReveal />} />
      <Route path="/preview/cinematic-parallax" element={<Preview11CinematicParallax />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    <WhatsAppFloatButton />
  </>
);

const App = () => (
  <HelmetProvider>
    <AppProviders>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  </HelmetProvider>
);

export default App;
