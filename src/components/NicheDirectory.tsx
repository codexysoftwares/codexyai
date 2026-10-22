import { ArrowRight } from "lucide-react";

/**
 * Achado 2026-08-18: nenhuma página de /informacoes/ era linkada a partir
 * da home -- só existiam no sitemap.xml e nos links entre si mesmas
 * (otherNichesSameLocation/otherLocationsSameNiche em landingPages.ts),
 * uma ilha sem entrada de autoridade vinda de página que o Google já
 * confia. Essa seção dá 1 link real de cada nicho a partir da home
 * (sempre pra variante São Paulo, a mais central) -- dali, o link interno
 * que já existe entre cidades do mesmo nicho alcança as outras 22 cidades
 * sem precisar linkar as 920 direto daqui.
 *
 * Nichos e slugs extraídos de src/data/landingPages.ts (NICHE_TEMPLATES) --
 * atualizar essa lista se nicho novo for adicionado lá.
 */
const NICHES: { slug: string; label: string }[] = [
  { slug: "padarias", label: "Padarias" },
  { slug: "clinicas-de-estetica", label: "Clínicas de Estética" },
  { slug: "construtoras", label: "Construtoras" },
  { slug: "academias", label: "Academias" },
  { slug: "acaiterias", label: "Açaiterias" },
  { slug: "agencias-de-turismo", label: "Agências de Turismo" },
  { slug: "autoescolas", label: "Autoescolas" },
  { slug: "barbearias", label: "Barbearias" },
  { slug: "buffets-e-casas-de-festa", label: "Buffets e Casas de Festa" },
  { slug: "clinicas-odontologicas", label: "Clínicas Odontológicas" },
  { slug: "clinicas-veterinarias", label: "Clínicas Veterinárias" },
  { slug: "confeitarias", label: "Confeitarias" },
  { slug: "corretores-de-seguros", label: "Corretores de Seguros" },
  { slug: "cursos-tecnicos", label: "Cursos Técnicos" },
  { slug: "decoracao-de-festas", label: "Decorações de Festas" },
  { slug: "dedetizadoras", label: "Dedetizadoras" },
  { slug: "desentupidoras", label: "Desentupidoras" },
  { slug: "diaristas-e-limpeza-residencial", label: "Diaristas e Limpeza Residencial" },
  { slug: "empresas-de-reforma", label: "Empresas de Reforma" },
  { slug: "escolas-de-idiomas", label: "Escolas de Idiomas" },
  { slug: "escritorios-de-advocacia", label: "Escritórios de Advocacia" },
  { slug: "escritorios-de-contabilidade", label: "Escritórios de Contabilidade" },
  { slug: "estudios-de-pilates-e-yoga", label: "Estúdios de Pilates e Yoga" },
  { slug: "fotografos-de-eventos", label: "Fotógrafos de Eventos" },
  { slug: "hamburguerias", label: "Hambúrguerias" },
  { slug: "imobiliarias", label: "Imobiliárias" },
  { slug: "instaladores-de-ar-condicionado", label: "Instaladores de Ar-Condicionado" },
  { slug: "lava-rapidos", label: "Lavanderias Rápidas" },
  { slug: "marmitarias", label: "Marmitárias" },
  { slug: "oficinas-mecanicas", label: "Oficinas Mecânicas" },
  { slug: "petshops", label: "Petshops" },
  { slug: "pizzarias", label: "Pizzárias" },
  { slug: "pousadas", label: "Pousadas" },
  { slug: "restaurantes", label: "Restaurantes" },
  { slug: "saloes-de-beleza", label: "Salões de Beleza" },
  { slug: "chaveiros-24-horas", label: "Chaveiros 24 Horas" },
  { slug: "escritorios-de-arquitetura", label: "Escritórios de Arquitetura" },
  { slug: "jardinagem-e-paisagismo", label: "Jardinagem e Paisagismo" },
  { slug: "reforco-escolar", label: "Reforço Escolar" },
  { slug: "funilarias", label: "Funilarias" },
];

const NicheDirectory = () => {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-14 slide-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Chatbot pra <span className="gradient-text">todo tipo de negócio</span>
          </h2>
          <p className="text-lg sm:text-xl text-tech-gray max-w-3xl mx-auto">
            Cada nicho tem uma rotina diferente — veja como o chatbot se adapta ao seu.
          </p>
        </div>

        <nav aria-label="Nichos atendidos" className="flex flex-wrap justify-center gap-3">
          {NICHES.map((niche) => (
            <a
              key={niche.slug}
              href={`/informacoes/chatbot-para-${niche.slug}-sao-paulo-sp/`}
              className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm font-medium text-tech-gray transition-colors hover:border-accent hover:bg-accent/10 hover:text-primary"
            >
              {niche.label}
              <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default NicheDirectory;
