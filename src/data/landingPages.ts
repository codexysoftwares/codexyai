export interface FaqItem {
  question: string;
  answer: string;
}

export interface FeatureItem {
  title: string;
  description: string;
}

export interface PartnerRecommendation {
  name: string;
  url: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  detailsPath: string;
}

export interface LandingPageData {
  slug: string;
  service: string;
  productSlug: string;
  niche: string;
  nicheSlug: string;
  /** slug of the location alone (state or city), used to group "same place, other niche" links */
  locationSlug: string;
  stateLabel: string;
  stateUf: string;
  /** e.g. "na Bahia", "no Rio de Janeiro" — grammatically correct locative, precomputed. */
  stateIn: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  heroImage: string;
  heroImageAlt: string;
  introParagraph: string;
  painPoints: FeatureItem[];
  benefits: FeatureItem[];
  faq: FaqItem[];
  /** Data de revisão substancial, usada no sitemap somente quando a página
   * recebeu conteúdo próprio além do template programático. */
  updatedAt?: string;
  partner?: PartnerRecommendation;
  whatsappMessage: string;
  seo: {
    title: string;
    description: string;
    ogImage?: string;
  };
}

type PriorityPageOverride = Pick<
  LandingPageData,
  "introParagraph" | "painPoints" | "benefits" | "faq" | "updatedAt"
>;

interface StateInfo {
  label: string;
  uf: string;
  slug: string;
  /** Locative preposition ("em"/"no"/"na") — Portuguese state names don't all take the same one. */
  preposition: string;
  /** e.g. "na Bahia", "no Rio de Janeiro", "em Minas Gerais" — precomputed so templates don't repeat this. */
  in: string;
  /** Location text used only in SEO metadata; cities include the UF to stay unique from namesake states. */
  seoIn: string;
}

const DIACRITICS_PATTERN = new RegExp(String.fromCharCode(0x5b, 0x5c, 0x75, 0x30, 0x33, 0x30, 0x30, 0x2d, 0x5c, 0x75, 0x30, 0x33, 0x36, 0x66, 0x5d), "g");

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(DIACRITICS_PATTERN, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// All 27 Brazilian states (26 + DF). Adding a state here automatically
// generates a page for every niche below — no per-page work required.
// `preposition` follows standard Brazilian Portuguese usage per state
// ("na Bahia", "no Rio de Janeiro", "em Minas Gerais" — not all "em").
const BRAZILIAN_STATES: StateInfo[] = (
  [
    { label: "Acre", uf: "AC", preposition: "no" },
    { label: "Alagoas", uf: "AL", preposition: "em" },
    { label: "Amapá", uf: "AP", preposition: "no" },
    { label: "Amazonas", uf: "AM", preposition: "no" },
    { label: "Bahia", uf: "BA", preposition: "na" },
    { label: "Ceará", uf: "CE", preposition: "no" },
    { label: "Distrito Federal", uf: "DF", preposition: "no" },
    { label: "Espírito Santo", uf: "ES", preposition: "no" },
    { label: "Goiás", uf: "GO", preposition: "em" },
    { label: "Maranhão", uf: "MA", preposition: "no" },
    { label: "Mato Grosso", uf: "MT", preposition: "no" },
    { label: "Mato Grosso do Sul", uf: "MS", preposition: "no" },
    { label: "Minas Gerais", uf: "MG", preposition: "em" },
    { label: "Pará", uf: "PA", preposition: "no" },
    { label: "Paraíba", uf: "PB", preposition: "na" },
    { label: "Paraná", uf: "PR", preposition: "no" },
    { label: "Pernambuco", uf: "PE", preposition: "em" },
    { label: "Piauí", uf: "PI", preposition: "no" },
    { label: "Rio de Janeiro", uf: "RJ", preposition: "no" },
    { label: "Rio Grande do Norte", uf: "RN", preposition: "no" },
    { label: "Rio Grande do Sul", uf: "RS", preposition: "no" },
    { label: "Rondônia", uf: "RO", preposition: "em" },
    { label: "Roraima", uf: "RR", preposition: "em" },
    { label: "Santa Catarina", uf: "SC", preposition: "em" },
    { label: "São Paulo", uf: "SP", preposition: "em" },
    { label: "Sergipe", uf: "SE", preposition: "em" },
    { label: "Tocantins", uf: "TO", preposition: "no" },
  ] as const
).map((state) => ({
  ...state,
  slug: slugify(state.label),
  in: `${state.preposition} ${state.label}`,
  seoIn: `${state.preposition} ${state.label}`,
}));

// Fase 3 (cidade): maiores cidades do Brasil por população (fonte: estimativa
// IBGE), entrando em lotes de ~50 páginas por vez (3 nichos × N cidades), não
// tudo de uma vez. Slug sempre leva o UF (`sao-paulo-sp`) mesmo quando não
// colide com o slug do estado (ex: "São Paulo" cidade vs "São Paulo" estado
// colidiriam em "sao-paulo" sem o sufixo) — mantém o padrão único e prova
// contra colisão futura.
// Lote 1 (17 cidades = 51 páginas):
const BRAZILIAN_CITIES: StateInfo[] = (
  [
    { label: "São Paulo", uf: "SP", preposition: "em" },
    { label: "Rio de Janeiro", uf: "RJ", preposition: "no" },
    { label: "Brasília", uf: "DF", preposition: "em" },
    { label: "Salvador", uf: "BA", preposition: "em" },
    { label: "Fortaleza", uf: "CE", preposition: "em" },
    { label: "Belo Horizonte", uf: "MG", preposition: "em" },
    { label: "Manaus", uf: "AM", preposition: "em" },
    { label: "Curitiba", uf: "PR", preposition: "em" },
    { label: "Recife", uf: "PE", preposition: "em" },
    { label: "Goiânia", uf: "GO", preposition: "em" },
    { label: "Porto Alegre", uf: "RS", preposition: "em" },
    { label: "Belém", uf: "PA", preposition: "em" },
    { label: "Guarulhos", uf: "SP", preposition: "em" },
    { label: "Campinas", uf: "SP", preposition: "em" },
    { label: "São Luís", uf: "MA", preposition: "em" },
    { label: "São Gonçalo", uf: "RJ", preposition: "em" },
    { label: "Maceió", uf: "AL", preposition: "em" },
      { label: "Campo Grande", uf: "MS", preposition: "em" },
    { label: "Teresina", uf: "PI", preposition: "em" },
      { label: "João Pessoa", uf: "PB", preposition: "em" },
      { label: "São Bernardo do Campo", uf: "SP", preposition: "em" },
      { label: "Duque de Caxias", uf: "RJ", preposition: "em" },
      { label: "Nova Iguaçu", uf: "RJ", preposition: "em" },
      { label: "Natal", uf: "RN", preposition: "em" },
      { label: "Santo André", uf: "SP", preposition: "em" },
      { label: "Osasco", uf: "SP", preposition: "em" },
      { label: "Sorocaba", uf: "SP", preposition: "em" },
      { label: "Uberlândia", uf: "MG", preposition: "em" },
      { label: "Ribeirão Preto", uf: "SP", preposition: "em" },
      { label: "São José dos Campos", uf: "SP", preposition: "em" },
      { label: "Cuiabá", uf: "MT", preposition: "em" },
      { label: "Jaboatão dos Guararapes", uf: "PE", preposition: "em" },
      { label: "Contagem", uf: "MG", preposition: "em" },
      { label: "Joinville", uf: "SC", preposition: "em" },
  ] as const
).map((city) => ({
  ...city,
  slug: `${slugify(city.label)}-${city.uf.toLowerCase()}`,
  in: `${city.preposition} ${city.label}`,
  seoIn: `${city.preposition} ${city.label}, ${city.uf}`,
}));

// One template per niche. Pain points / benefits / FAQ / hero image / partner
// stay identical across all 27 states on purpose (see CLAUDE.md "Landing
// pages" section) — only headline/intro/WhatsApp message/SEO copy is
// regionalized with the state name. This is what keeps adding a new niche
// (one template = 27 pages) or a new state (one entry = +N pages) cheap.
interface NicheTemplate {
  nicheSlug: string;
  /** Templates históricos são de chatbot. Novos produtos devem informar o
   * slug explicitamente para não mudar URLs já publicadas. */
  productSlug?: string;
  niche: string;
  eyebrow: string;
  heroImage: string;
  heroImageAlt: string;
  ogImage: string;
  subheadline: string;
  painPoints: FeatureItem[];
  benefits: FeatureItem[];
  faq: FaqItem[];
  /** Quando presente, cada pagina sorteia (deterministico por local+nicho) uma
   * variante em vez de usar sempre painPoints/benefits/faq -- quebra o
   * conteudo quase-identico entre localidades do mesmo nicho. */
  painPointsVariants?: FeatureItem[][];
  benefitsVariants?: FeatureItem[][];
  faqVariants?: FaqItem[][];
  partner?: PartnerRecommendation;
  headline: (state: StateInfo) => string;
  introParagraph: (state: StateInfo) => string;
  whatsappMessage: (state: StateInfo) => string;
  seoTitle: (state: StateInfo) => string;
  seoDescription: (state: StateInfo) => string;
}

const NICHE_TEMPLATES: NicheTemplate[] = [
  {
    nicheSlug: "padarias",
    productSlug: "chatbot",
    niche: "Padarias",
    eyebrow: "Chatbot para Padarias",
    heroImage: "/images/landing/padarias-hero.webp",
    heroImageAlt: "Atendente organizando encomendas em uma padaria com apoio de atendimento digital",
    ogImage: "/images/og/padarias-og.jpg",
    subheadline:
      "Atenda pedidos e encomendas de bolo pelo WhatsApp 24h por dia, sem perder venda fora do horário de expediente.",
    painPoints: [
      {
        title: "Pedidos perdidos fora do horário",
        description:
          "Cliente manda mensagem à noite ou no domingo e só recebe resposta no dia seguinte — quando já comprou em outra padaria.",
      },
      {
        title: "Fila de mensagens no horário de pico",
        description:
          "Manhã e véspera de feriado lotam o WhatsApp e a equipe do caixa não consegue responder todo mundo a tempo.",
      },
      {
        title: "Encomendas de bolo e festa mal controladas",
        description:
          "Anotações soltas em papel ou memória geram erro de sabor, tamanho, data de entrega e cobrança.",
      },
      {
        title: "Equipe sobrecarregada",
        description:
          "Quem atende o balcão também tenta responder o WhatsApp, e as duas tarefas saem prejudicadas.",
      },
    ],
    benefits: [
      {
        title: "Atendimento automático 24/7",
        description:
          "Cardápio, horário de funcionamento, endereço e formas de pagamento respondidos na hora, todo dia.",
      },
      {
        title: "Encomendas organizadas automaticamente",
        description:
          "O chatbot recebe e confirma pedidos de bolo e festa com data, sabor e quantidade, sem depender de anotação manual.",
      },
      {
        title: "Menos carga para a equipe",
        description:
          "O time do balcão foca em quem já está na loja, enquanto o chatbot cuida do WhatsApp.",
      },
      {
        title: "Resposta instantânea reduz desistência",
        description:
          "Cliente que recebe resposta na hora tem muito mais chance de fechar o pedido em vez de procurar concorrente.",
      },
      {
        title: "Mesmo número que você já usa",
        description:
          "Não precisa trocar de WhatsApp nem pedir para os clientes salvarem um novo contato.",
      },
    ],
    faq: [
      {
        question: "O chatbot substitui o atendente humano?",
        answer:
          "Não. Ele cuida das perguntas repetitivas e dos pedidos simples, e transfere para um atendente humano quando o assunto exige.",
      },
      {
        question: "Funciona no mesmo número de WhatsApp que já uso?",
        answer:
          "Sim, a implantação é feita em cima do número que a padaria já utiliza hoje.",
      },
      {
        question: "Ele recebe encomenda de bolo e festa?",
        answer:
          "Sim, o chatbot coleta sabor, tamanho, data de entrega e demais detalhes e organiza tudo automaticamente.",
      },
      {
        question: "Quanto tempo leva para colocar no ar?",
        answer:
          "A implantação costuma ser rápida, sem necessidade de a padaria mexer em nada técnico.",
      },
      {
        question: "Preciso saber programar para usar?",
        answer:
          "Não. A CODEXY cuida de toda a configuração e entrega o chatbot pronto para uso.",
      },
    ],
    painPointsVariants: [
    [
      {
        "title": "Pedidos perdidos fora do horário",
        "description": "Cliente manda mensagem à noite ou no domingo e só recebe resposta no dia seguinte — quando já comprou em outra padaria."
      },
      {
        "title": "Fila de mensagens no horário de pico",
        "description": "Manhã e véspera de feriado lotam o WhatsApp e a equipe do caixa não consegue responder todo mundo a tempo."
      },
      {
        "title": "Encomendas de bolo e festa mal controladas",
        "description": "Anotações soltas em papel ou memória geram erro de sabor, tamanho, data de entrega e cobrança."
      },
      {
        "title": "Equipe sobrecarregada",
        "description": "Quem atende o balcão também tenta responder o WhatsApp, e as duas tarefas saem prejudicadas."
      }
    ],
    [
      {
        "title": "Atendimento desatualizado",
        "description": "Clientes recebem informações de horário, cardápio e endereço que não estão mais atualizados."
      },
      {
        "title": "Falta de consistência nos pedidos",
        "description": "Encomendas de bolo e festa são feitas com detalhes diferentes cada vez, causando problemas na produção e entrega."
      },
      {
        "title": "Equipe sobrecarregada pelo WhatsApp",
        "description": "A equipe do caixa tenta atender ao balcão e responder mensagens no WhatsApp, reduzindo a qualidade de ambos os serviços."
      },
      {
        "title": "Dificuldade em seguir protocolos",
        "description": "Procedimentos como confirmação de pedidos e cobrança não são seguidos corretamente, gerando problemas."
      }
    ],
    [
      {
        "title": "Perda de pedidos",
        "description": "Clientes enviam mensagens fora do horário ou no domingo, mas só recebem respostas no dia seguinte — quando já compraram em outra padaria."
      },
      {
        "title": "Fila de mensagens durante o horário de pico",
        "description": "Manhã e véspera de feriado criam uma grande demanda, sobrecarregando a equipe do caixa e afetando o atendimento no balcão."
      },
      {
        "title": "Problemas com encomendas de bolo e festa",
        "description": "Anotações soltas em papel ou memória geram erros em sabor, tamanho, data de entrega e cobrança das encomendas."
      },
      {
        "title": "Equipe sobrecarregada",
        "description": "Quem atende ao balcão também tenta responder WhatsApp, resultando na prejudicamento de ambas as tarefas."
      }
    ],
  ],
    benefitsVariants: [
    [
      {
        "title": "Atendimento automático 24/7",
        "description": "Cardápio, horário de funcionamento, endereço e formas de pagamento respondidos na hora, todo dia."
      },
      {
        "title": "Encomendas organizadas automaticamente",
        "description": "O chatbot recebe e confirma pedidos de bolo e festa com data, sabor e quantidade, sem depender de anotação manual."
      },
      {
        "title": "Menos carga para a equipe",
        "description": "O time do balcão foca em quem já está na loja, enquanto o chatbot cuida do WhatsApp."
      },
      {
        "title": "Resposta instantânea reduz desistência",
        "description": "Cliente que recebe resposta na hora tem muito mais chance de fechar o pedido em vez de procurar concorrente."
      },
      {
        "title": "Mesmo número que você já usa",
        "description": "Não precisa trocar de WhatsApp nem pedir para os clientes salvarem um novo contato."
      }
    ],
    [
      {
        "title": "Atendimento automático e preciso",
        "description": "O chatbot fornece informações atualizadas sobre horário, cardápio e endereço para os clientes."
      },
      {
        "title": "Pedidos organizados e confiáveis",
        "description": "O chatbot coleta e confirma encomendas de bolo e festa com dados precisos, evitando problemas na produção e entrega."
      },
      {
        "title": "Carga de trabalho reduzida para a equipe",
        "description": "A equipe do caixa se concentra no atendimento ao balcão, enquanto o chatbot cuida do WhatsApp."
      },
      {
        "title": "Resposta instantânea e consistente",
        "description": "Os clientes recebem respostas rápidas e consistentes em todos os momentos, aumentando a satisfação."
      },
      {
        "title": "Atendimento personalizado sem perder o contato antigo",
        "description": "A padaria mantém seu número de WhatsApp original e oferece atendimento automático personalizado aos clientes."
      }
    ],
    [
      {
        "title": "Atendimento automático 24/7",
        "description": "O chatbot responde a perguntas e mensagens fora do horário, garantindo que os clientes recebam informações atualizadas em todos os momentos."
      },
      {
        "title": "Encomendas organizadas automaticamente",
        "description": "O chatbot coleta e confirma detalhes das encomendas de bolo e festa, como sabor, tamanho e data de entrega."
      },
      {
        "title": "Redução da carga de trabalho para a equipe",
        "description": "A equipe do caixa se concentra no atendimento ao balcão enquanto o chatbot cuida das mensagens do WhatsApp."
      },
      {
        "title": "Resposta instantânea reduz desistência dos pedidos",
        "description": "Clientes que recebem respostas rápidas têm maior chance de concluir a compra em vez de procurar outra padaria."
      },
      {
        "title": "Uso do mesmo número de WhatsApp",
        "description": "A padaria não precisa trocar seu número de WhatsApp ou pedir aos clientes para salvarem um novo contato."
      }
    ],
  ],
    faqVariants: [
    [
      {
        "question": "O chatbot substitui o atendente humano?",
        "answer": "Não. Ele cuida das perguntas repetitivas e dos pedidos simples, e transfere para um atendente humano quando o assunto exige."
      },
      {
        "question": "Funciona no mesmo número de WhatsApp que já uso?",
        "answer": "Sim, a implantação é feita em cima do número que a padaria já utiliza hoje."
      },
      {
        "question": "Ele recebe encomenda de bolo e festa?",
        "answer": "Sim, o chatbot coleta sabor, tamanho, data de entrega e demais detalhes e organiza tudo automaticamente."
      },
      {
        "question": "Quanto tempo leva para colocar no ar?",
        "answer": "A implantação costuma ser rápida, sem necessidade de a padaria mexer em nada técnico."
      },
      {
        "question": "Preciso saber programar para usar?",
        "answer": "Não. A CODEXY cuida de toda a configuração e entrega o chatbot pronto para uso."
      }
    ],
    [
      {
        "question": "O chatbot é capaz de realizar procedimentos complexos?",
        "answer": "Não, ele cuida das tarefas mais simples, transferindo para um atendente humano quando necessário."
      },
      {
        "question": "Posso continuar usando meu número de WhatsApp habitual?",
        "answer": "Sim, a implantação é feita sobre o seu número atual."
      },
      {
        "question": "O chatbot pode coletar e confirmar encomendas de bolo e festa?",
        "answer": "Sim, ele é capaz de coletar todos os detalhes necessários para organizar as encomendas corretamente."
      },
      {
        "question": "Quanto tempo leva para colocar o chatbot no ar?",
        "answer": "A implantação geralmente é rápida e não requer intervenção técnica da padaria."
      },
      {
        "question": "Preciso ter conhecimento de programação para configurá-lo?",
        "answer": "Não, a CODEXY cuida de toda a configuração e entrega o chatbot pronto para uso."
      }
    ],
    [
      {
        "question": "O chatbot substitui os atendentes humanos?",
        "answer": "Não, ele cuida das mensagens simples e transfere para um atendente humano quando necessário."
      },
      {
        "question": "Funciona sobre o mesmo número de WhatsApp que a padaria já usa?",
        "answer": "Sim, a implantação é feita diretamente sobre o seu número atual."
      },
      {
        "question": "Ele pode coletar e confirmar encomendas de bolo e festa?",
        "answer": "Sim, o chatbot coleta todos os detalhes necessários para organizar as encomendas corretamente."
      },
      {
        "question": "Quanto tempo leva para colocar no ar?",
        "answer": "A implantação geralmente é rápida e não requer intervenção técnica da padaria."
      },
      {
        "question": "Preciso ter conhecimento de programação para configurá-lo?",
        "answer": "Não, a CODEXY cuida de toda a configuração e entrega o chatbot pronto para uso."
      }
    ],
  ],
    headline: (state) => `Chatbot para Padarias ${state.in}`,
    introParagraph: (state) =>
      `A CODEXY é especializada em automação e chatbots para o comércio local e implanta o chatbot para padaria ${state.in} direto no WhatsApp que sua padaria já usa hoje. A solução responde cardápio, horário e formas de pagamento na hora, organiza encomendas de bolo e festa automaticamente e funciona 24 horas por dia, todos os dias da semana, sem depender de mão de obra extra na equipe.`,
    whatsappMessage: (state) =>
      `Olá! Vi a página sobre chatbot para padaria ${state.in} e quero saber mais sobre como implantar na minha padaria.`,
    seoTitle: (state) => `Chatbot para Padarias ${state.seoIn} | CODEXY`,
    seoDescription: (state) =>
      `Automatize o atendimento e as encomendas da sua padaria ${state.seoIn} com um chatbot no WhatsApp disponível 24h. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "clinicas-de-estetica",
    productSlug: "chatbot",
    niche: "Clínicas de Estética",
    eyebrow: "Chatbot para Clínicas de Estética",
    heroImage: "/images/landing/clinicas-estetica-hero.webp",
    heroImageAlt: "Profissional de clínica de estética confirmando agendamentos em um tablet",
    ogImage: "/images/og/clinicas-estetica-og.jpg",
    subheadline:
      "Agende consultas e procedimentos automaticamente pelo WhatsApp e reduza o no-show da sua clínica.",
    painPoints: [
      {
        title: "Agenda lotada de perguntas repetitivas",
        description:
          "Recepção gasta o dia respondendo dúvidas de preço e disponibilidade em vez de cuidar de quem já está na clínica.",
      },
      {
        title: "No-show por falta de confirmação",
        description:
          "Paciente esquece o horário marcado e não avisa, deixando um espaço vazio na agenda do profissional.",
      },
      {
        title: "Leads de Instagram e Google Ads sem resposta a tempo",
        description:
          "Contato vindo de campanha esfria quando demora para ser respondido, e o investimento em anúncio se perde.",
      },
      {
        title: "Recepção sobrecarregada",
        description:
          "Uma pessoa só tentando atender telefone, WhatsApp e paciente presencial ao mesmo tempo.",
      },
    ],
    benefits: [
      {
        title: "Agendamento automático via WhatsApp",
        description:
          "Paciente escolhe procedimento e horário disponível direto na conversa, sem precisar ligar.",
      },
      {
        title: "Lembrete e confirmação automática",
        description: "Mensagens automáticas antes da consulta reduzem drasticamente o no-show.",
      },
      {
        title: "Resposta instantânea sobre procedimentos e valores",
        description: "Dúvidas comuns são respondidas na hora, qualquer hora do dia.",
      },
      {
        title: "Qualificação automática de leads de tráfego pago",
        description:
          "O chatbot já identifica o interesse do lead vindo de Instagram ou Google Ads antes de passar para a equipe.",
      },
      {
        title: "Imagem mais profissional",
        description:
          "Atendimento rápido e organizado transmite mais confiança para quem está pesquisando a clínica.",
      },
    ],
    partner: {
      name: "DoctorChatBot",
      url: "https://doctorchatbot.com.br/",
      eyebrow: "Parceiro especializado em saúde",
      title: "Agenda e atendimento automatizado para clínicas",
      description:
        "Para operações que precisam de uma solução especializada na jornada do paciente, a DoctorChatBot combina agenda inteligente e automação de conversas pelo WhatsApp.",
      ctaLabel: "Conhecer a DoctorChatBot",
      detailsPath: "/parceiros/doctorchatbot/",
    },
    faq: [
      {
        question: "O paciente consegue marcar consulta sozinho?",
        answer:
          "Sim, o chatbot apresenta os horários disponíveis e confirma o agendamento sem intervenção manual.",
      },
      {
        question: "Funciona com vários profissionais e procedimentos?",
        answer:
          "Sim, o chatbot pode ser configurado para organizar agenda de diferentes profissionais e serviços da clínica.",
      },
      {
        question: "É seguro em relação à LGPD?",
        answer: "Sim, os dados coletados seguem boas práticas de proteção de dados de pacientes.",
      },
      {
        question: "Posso usar em campanhas de Instagram e Google Ads?",
        answer:
          "Sim, o chatbot é especialmente útil para responder rápido os leads que chegam de campanhas pagas.",
      },
      {
        question: "Quanto tempo leva para configurar?",
        answer:
          "A CODEXY cuida de toda a configuração inicial junto com a clínica, sem exigir conhecimento técnico da equipe.",
      },
    ],
    painPointsVariants: [
    [
      {
        "title": "Agenda lotada de perguntas repetitivas",
        "description": "Recepção gasta o dia respondendo dúvidas de preço e disponibilidade em vez de cuidar de quem já está na clínica."
      },
      {
        "title": "No-show por falta de confirmação",
        "description": "Paciente esquece o horário marcado e não avisa, deixando um espaço vazio na agenda do profissional."
      },
      {
        "title": "Leads de Instagram e Google Ads sem resposta a tempo",
        "description": "Contato vindo de campanha esfria quando demora para ser respondido, e o investimento em anúncio se perde."
      },
      {
        "title": "Recepção sobrecarregada",
        "description": "Uma pessoa só tentando atender telefone, WhatsApp e paciente presencial ao mesmo tempo."
      }
    ],
    [
      {
        "title": "Tempo de atendimento ao paciente presencial",
        "description": "Profissionais estão ocupados respondendo dúvidas e agendando consultas, enquanto pacientes esperam em sala."
      },
      {
        "title": "Falta de comunicação com leads de campanhas pagas",
        "description": "Leads de Instagram e Google Ads não recebem resposta a tempo, resultando em perda de investimento."
      },
      {
        "title": "Recepção sobrecarregada durante horários de pico",
        "description": "Muitos pacientes tentam entrar em contato ao mesmo tempo, causando congestionamento na recepção."
      },
      {
        "title": "Agenda de procedimentos complexos demora para ser gerenciada",
        "description": "Profissionais precisam gastar tempo organizando e priorizando consultas de procedimentos delicados."
      }
    ],
    [
      {
        "title": "Dificuldade em gerenciar a agenda de procedimentos",
        "description": "Profissionais precisam dedicar tempo para organizar e priorizar consultas, o que pode levar a erros e perda de produtividade."
      },
      {
        "title": "Perda de pacientes por falta de comunicação eficaz",
        "description": "Pacientes sentem-se esquecidos ou mal atendidos quando não recebem respostas rápidas a suas dúvidas."
      },
      {
        "title": "Recepção sobrecarregada durante horários de pico",
        "description": "Muitos pacientes tentam entrar em contato ao mesmo tempo, causando congestionamento na recepção e demora no atendimento."
      },
      {
        "title": "Falta de eficiência nos processos de agendamento e confirmação",
        "description": "Manuais procedimentos e confirmações podem ser feitos com rapidez e eficiência, melhorando a experiência do paciente."
      }
    ],
  ],
    benefitsVariants: [
    [
      {
        "title": "Agendamento automático via WhatsApp",
        "description": "Paciente escolhe procedimento e horário disponível direto na conversa, sem precisar ligar."
      },
      {
        "title": "Lembrete e confirmação automática",
        "description": "Mensagens automáticas antes da consulta reduzem drasticamente o no-show."
      },
      {
        "title": "Resposta instantânea sobre procedimentos e valores",
        "description": "Dúvidas comuns são respondidas na hora, qualquer hora do dia."
      },
      {
        "title": "Qualificação automática de leads de tráfego pago",
        "description": "O chatbot já identifica o interesse do lead vindo de Instagram ou Google Ads antes de passar para a equipe."
      },
      {
        "title": "Imagem mais profissional",
        "description": "Atendimento rápido e organizado transmite mais confiança para quem está pesquisando a clínica."
      }
    ],
    [
      {
        "title": "Resposta instantânea a perguntas frequentes",
        "description": "Chatbot responde com rapidez e eficiência, reduzindo a carga de trabalho da equipe."
      },
      {
        "title": "Agendamento automático sem necessidade de intervenção humana",
        "description": "Paciente pode escolher horário e procedimento desejado diretamente no WhatsApp, sem esperar por resposta manual."
      },
      {
        "title": "Lembrete e confirmação de consultas em tempo real",
        "description": "Mensagens automáticas garantem que pacientes não esqueçam suas consultas agendadas."
      },
      {
        "title": "Redução do tempo de atendimento ao paciente presencial",
        "description": "Profissionais podem se concentrar mais no atendimento aos pacientes, sem serem interrompidos por perguntas e procedimentos."
      },
      {
        "title": "Qualificação automática de leads para agilizar a conversação",
        "description": "Chatbot identifica interessados em serviços específicos antes de passá-los para a equipe de atendimento."
      }
    ],
    [
      {
        "title": "Agendamento automático sem necessidade de intervenção humana",
        "description": "Paciente pode escolher horário e procedimento desejado diretamente no WhatsApp, sem esperar por resposta manual."
      },
      {
        "title": "Lembrete e confirmação em tempo real para evitar perda de pacientes",
        "description": "Mensagens automáticas garantem que pacientes não esqueçam suas consultas agendadas, reduzindo a perda de pacientes."
      },
      {
        "title": "Resposta instantânea a perguntas frequentes sem sobrecarregar a equipe",
        "description": "Chatbot responde com rapidez e eficiência, reduzindo a carga de trabalho da equipe e melhorando a experiência do paciente."
      },
      {
        "title": "Redução do tempo de atendimento ao paciente presencial e agilização dos processos",
        "description": "Profissionais podem se concentrar mais no atendimento aos pacientes, sem serem interrompidos por perguntas e procedimentos manuais."
      },
      {
        "title": "Qualificação automática de leads para agilizar a conversação e melhorar o processo",
        "description": "Chatbot identifica interessados em serviços específicos antes de passá-los para a equipe de atendimento, facilitando o processamento das informações."
      }
    ],
  ],
    faqVariants: [
    [
      {
        "question": "O paciente consegue marcar consulta sozinho?",
        "answer": "Sim, o chatbot apresenta os horários disponíveis e confirma o agendamento sem intervenção manual."
      },
      {
        "question": "Funciona com vários profissionais e procedimentos?",
        "answer": "Sim, o chatbot pode ser configurado para organizar agenda de diferentes profissionais e serviços da clínica."
      },
      {
        "question": "É seguro em relação à LGPD?",
        "answer": "Sim, os dados coletados seguem boas práticas de proteção de dados de pacientes."
      },
      {
        "question": "Posso usar em campanhas de Instagram e Google Ads?",
        "answer": "Sim, o chatbot é especialmente útil para responder rápido os leads que chegam de campanhas pagas."
      },
      {
        "question": "Quanto tempo leva para configurar?",
        "answer": "A CODEXY cuida de toda a configuração inicial junto com a clínica, sem exigir conhecimento técnico da equipe."
      }
    ],
    [
      {
        "question": "Como funciona o agendamento automático?",
        "answer": "O chatbot oferece opções de horários e procedimentos disponíveis, facilitando a escolha do paciente."
      },
      {
        "question": "É possível personalizar a configuração do chatbot para atender às necessidades da clínica?",
        "answer": "Sim, podemos adaptar o chatbot às especificidades dos serviços oferecidos pela sua clínica."
      },
      {
        "question": "O que acontece com os dados coletados pelo chatbot?",
        "answer": "Os dados são tratados de acordo com as melhores práticas de proteção de dados, garantindo a segurança dos pacientes."
      },
      {
        "question": "Posso usar o chatbot em conjunto com outras ferramentas de marketing?",
        "answer": "Sim, o chatbot é uma ferramenta integrável que pode ser combinada com outros métodos de comunicação e marketing."
      },
      {
        "question": "O que acontece se eu precisar de ajuda para configurar ou usar o chatbot?",
        "answer": "Nossa equipe estará disponível para ajudar a configurar e utilizar o chatbot, garantindo um suporte eficaz."
      }
    ],
    [
      {
        "question": "Como funciona a proteção dos dados dos pacientes?",
        "answer": "Os dados são tratados de acordo com as melhores práticas de proteção de dados, garantindo a segurança e privacidade dos pacientes."
      },
      {
        "question": "Posso personalizar o chatbot para atender às necessidades específicas da minha clínica?",
        "answer": "Sim, podemos adaptar o chatbot às especificidades dos serviços oferecidos pela sua clínica para melhorar a experiência do paciente."
      },
      {
        "question": "O que acontece se eu precisar de suporte adicional para configurar ou usar o chatbot?",
        "answer": "Nossa equipe estará disponível para ajudar a configurar e utilizar o chatbot, garantindo um suporte eficaz e personalizado."
      },
      {
        "question": "Posso usar o chatbot em conjunto com outras ferramentas de marketing e comunicação?",
        "answer": "Sim, o chatbot é uma ferramenta integrável que pode ser combinada com outros métodos de comunicação e marketing para melhorar a eficiência dos processos."
      },
      {
        "question": "Como posso garantir que os pacientes estejam satisfeitos com a experiência oferecida pela minha clínica?",
        "answer": "O chatbot pode ajudar a melhorar a experiência do paciente ao fornecer respostas rápidas e eficientes, agendar consultas automaticamente e reduzir o tempo de atendimento."
      }
    ],
  ],
    headline: (state) => `Chatbot para Clínicas de Estética ${state.in}`,
    introParagraph: (state) =>
      `A CODEXY implanta chatbot para clínica de estética ${state.in} integrado ao WhatsApp da clínica, automatizando o agendamento de consultas e procedimentos, o envio de lembretes e a qualificação de leads vindos de Instagram e Google Ads. O resultado é menos no-show, recepção mais livre para atender quem já está na clínica e resposta imediata para quem pesquisa procedimentos e valores.`,
    whatsappMessage: (state) =>
      `Olá! Vi a página sobre chatbot para clínica de estética ${state.in} e quero saber mais sobre como implantar na minha clínica.`,
    seoTitle: (state) => `Chatbot para Clínicas de Estética ${state.seoIn} | CODEXY`,
    seoDescription: (state) =>
      `Reduza o no-show e automatize o agendamento da sua clínica de estética ${state.seoIn} com um chatbot no WhatsApp. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "construtoras",
    productSlug: "chatbot",
    niche: "Construtoras",
    eyebrow: "Chatbot para Construtoras",
    heroImage: "/images/landing/construtoras-hero.webp",
    heroImageAlt: "Consultor imobiliário qualificando leads ao lado da maquete de um empreendimento",
    ogImage: "/images/og/construtoras-og.jpg",
    subheadline:
      "Qualifique automaticamente os leads de imóveis pelo WhatsApp antes de repassar para o corretor.",
    painPoints: [
      {
        title: "Alto volume de leads sem triagem",
        description:
          "Portais e anúncios geram muitos contatos, mas boa parte não tem perfil ou orçamento para o empreendimento.",
      },
      {
        title: "Corretor perde tempo com perguntas básicas",
        description:
          "Tempo que poderia ser usado fechando visita é gasto respondendo dúvidas repetitivas sobre planta e valores.",
      },
      {
        title: "Lead esfria por demora no primeiro contato",
        description:
          "Quanto mais demora a resposta, menor a chance de o lead seguir interessado no empreendimento.",
      },
      {
        title: "Dificuldade de organizar múltiplos empreendimentos",
        description:
          "Equipe comercial precisa acompanhar vários lançamentos ao mesmo tempo, cada um com informações diferentes.",
      },
    ],
    benefits: [
      {
        title: "Qualificação automática do lead",
        description:
          "O chatbot pergunta orçamento, tipo de imóvel e prazo antes de encaminhar o contato para o corretor.",
      },
      {
        title: "Resposta 24/7",
        description: "Lead vindo de anúncio ou portal recebe retorno imediato, a qualquer hora do dia.",
      },
      {
        title: "Envio automático de material do empreendimento",
        description:
          "Plantas, valores e condições são enviados automaticamente conforme o interesse do lead.",
      },
      {
        title: "Integração com campanhas de Google e Meta Ads",
        description:
          "O chatbot recebe o lead direto da campanha e já inicia a qualificação sem depender de atendente disponível.",
      },
      {
        title: "Mais visitas agendadas por lead qualificado",
        description:
          "Corretor recebe apenas contatos já filtrados, aumentando a taxa de conversão em visita.",
      },
    ],
    faq: [
      {
        question: "O chatbot substitui o corretor?",
        answer: "Não. Ele filtra e prepara o lead, e o corretor entra para fechar a visita e a negociação.",
      },
      {
        question: "Ele envia planta e valores automaticamente?",
        answer:
          "Sim, conforme o empreendimento de interesse do lead, o chatbot pode enviar os materiais configurados.",
      },
      {
        question: "Funciona para vários empreendimentos ao mesmo tempo?",
        answer:
          "Sim, o chatbot pode ser configurado para atender diferentes lançamentos e direcionar cada lead corretamente.",
      },
      {
        question: "Como o chatbot qualifica o lead?",
        answer:
          "Ele pergunta informações como orçamento, tipo de imóvel desejado e prazo de compra antes de repassar o contato.",
      },
      {
        question: "Quanto tempo leva para implantar?",
        answer:
          "A CODEXY configura o chatbot em conjunto com a equipe comercial da construtora, sem necessidade de conhecimento técnico.",
      },
    ],
    painPointsVariants: [
    [
      {
        "title": "Alto volume de leads sem triagem",
        "description": "Portais e anúncios geram muitos contatos, mas boa parte não tem perfil ou orçamento para o empreendimento."
      },
      {
        "title": "Corretor perde tempo com perguntas básicas",
        "description": "Tempo que poderia ser usado fechando visita é gasto respondendo dúvidas repetitivas sobre planta e valores."
      },
      {
        "title": "Lead esfria por demora no primeiro contato",
        "description": "Quanto mais demora a resposta, menor a chance de o lead seguir interessado no empreendimento."
      },
      {
        "title": "Dificuldade de organizar múltiplos empreendimentos",
        "description": "Equipe comercial precisa acompanhar vários lançamentos ao mesmo tempo, cada um com informações diferentes."
      }
    ],
    [
      {
        "title": "Foco do corretor desviado para respostas",
        "description": "Tempo dedicado a atendimento de leads poderia ser utilizado em prospecção e fechamento de negócios."
      },
      {
        "title": "Perda de qualidade no atendimento",
        "description": "Respostas rápidas, mas não personalizadas, podem levar ao desinteresse do lead e perda de oportunidades."
      },
      {
        "title": "Dificuldade em acompanhar múltiplos leads",
        "description": "Equipe comercial precisa gerenciar contatos de diferentes projetos e canais, o que pode causar confusão e demora na resposta."
      },
      {
        "title": "Falta de visibilidade sobre o pipeline",
        "description": "Dados dispersos em vários sistemas e planilhas dificultam a análise do desempenho dos corretores e ajustes necessários."
      }
    ],
    [
      {
        "title": "Falta de resposta eficaz em tempo real",
        "description": "Leads esperam por respostas imediatas e podem se desinteressar se não receberem retorno a contento."
      },
      {
        "title": "Desgaste do corretor com respostas repetitivas",
        "description": "Corretores perdem tempo respondendo perguntas básicas e repetidas, afastando-se das suas principais tarefas."
      },
      {
        "title": "Dificuldade em seguir as necessidades de cada lead",
        "description": "Equipe comercial enfrenta desafios para atender às especificações e interesses individuais dos leads."
      },
      {
        "title": "Falta de integração entre sistemas de marketing",
        "description": "Sistemas de marketing não se conectam corretamente, dificultando a captura e o tratamento de dados de leads."
      }
    ],
  ],
    benefitsVariants: [
    [
      {
        "title": "Qualificação automática do lead",
        "description": "O chatbot pergunta orçamento, tipo de imóvel e prazo antes de encaminhar o contato para o corretor."
      },
      {
        "title": "Resposta 24/7",
        "description": "Lead vindo de anúncio ou portal recebe retorno imediato, a qualquer hora do dia."
      },
      {
        "title": "Envio automático de material do empreendimento",
        "description": "Plantas, valores e condições são enviados automaticamente conforme o interesse do lead."
      },
      {
        "title": "Integração com campanhas de Google e Meta Ads",
        "description": "O chatbot recebe o lead direto da campanha e já inicia a qualificação sem depender de atendente disponível."
      },
      {
        "title": "Mais visitas agendadas por lead qualificado",
        "description": "Corretor recebe apenas contatos já filtrados, aumentando a taxa de conversão em visita."
      }
    ],
    [
      {
        "title": "Automatização de perguntas iniciais",
        "description": "O chatbot pergunta sobre orçamento, tipo de imóvel e prazo antes de encaminhar o contato para o corretor."
      },
      {
        "title": "Retorno imediato a qualquer hora",
        "description": "Leads recebem resposta instantânea, independentemente do horário em que contatam a construtora."
      },
      {
        "title": "Envio de informações relevantes",
        "description": "O chatbot envia materiais sobre o empreendimento apenas quando relevante para o interesse e necessidade do lead."
      },
      {
        "title": "Integração com campanhas de marketing",
        "description": "O chatbot recebe leads direto das campanhas e já inicia a qualificação, sem precisar de atendente disponível."
      },
      {
        "title": "Aumento da taxa de conversão em visita",
        "description": "Corretores recebem apenas contatos filtrados e preparados para uma boa conversa, aumentando as chances de sucesso."
      }
    ],
    [
      {
        "title": "Automatização de perguntas e respostas iniciais",
        "description": "O chatbot pergunta sobre orçamento, tipo de imóvel e prazo antes de encaminhar o contato para o corretor."
      },
      {
        "title": "Resposta 24/7 sem interrupções",
        "description": "Leads recebem respostas instantâneas a qualquer hora do dia, sem depender da disponibilidade de atendentes."
      },
      {
        "title": "Envio de materiais relevantes e personalizados",
        "description": "O chatbot envia informações sobre o empreendimento apenas quando relevante para o interesse do lead."
      },
      {
        "title": "Integração eficaz com campanhas de marketing",
        "description": "O chatbot recebe leads direto das campanhas e já inicia a qualificação, sem necessidade de intervenção manual."
      },
      {
        "title": "Aumento significativo da taxa de conversão em visita",
        "description": "Corretores recebem apenas contatos filtrados e preparados para uma boa conversa, o que aumenta as chances de sucesso na negociação."
      }
    ],
  ],
    faqVariants: [
    [
      {
        "question": "O chatbot substitui o corretor?",
        "answer": "Não. Ele filtra e prepara o lead, e o corretor entra para fechar a visita e a negociação."
      },
      {
        "question": "Ele envia planta e valores automaticamente?",
        "answer": "Sim, conforme o empreendimento de interesse do lead, o chatbot pode enviar os materiais configurados."
      },
      {
        "question": "Funciona para vários empreendimentos ao mesmo tempo?",
        "answer": "Sim, o chatbot pode ser configurado para atender diferentes lançamentos e direcionar cada lead corretamente."
      },
      {
        "question": "Como o chatbot qualifica o lead?",
        "answer": "Ele pergunta informações como orçamento, tipo de imóvel desejado e prazo de compra antes de repassar o contato."
      },
      {
        "question": "Quanto tempo leva para implantar?",
        "answer": "A CODEXY configura o chatbot em conjunto com a equipe comercial da construtora, sem necessidade de conhecimento técnico."
      }
    ],
    [
      {
        "question": "O chatbot substitui o corretor?",
        "answer": "Não. Ele auxilia no atendimento e filtra os leads, liberando o corretor para agir na negociação."
      },
      {
        "question": "Qual é a capacidade de envio de materiais?",
        "answer": "O chatbot pode enviar informações sobre o empreendimento, como plantas e valores, conforme configurado."
      },
      {
        "question": "Ele funciona para vários empreendimentos?",
        "answer": "Sim, o chatbot pode ser configurado para atender diferentes projetos e direcionar cada lead corretamente."
      },
      {
        "question": "Como o chatbot auxilia na qualificação do lead?",
        "answer": "Pergunta informações sobre orçamento, tipo de imóvel e prazo antes de repassar o contato ao corretor."
      },
      {
        "question": "Quanto tempo leva para configurar o chatbot?",
        "answer": "A CODEXY colabora com a equipe comercial da construtora para configuração do chatbot, sem necessidade de conhecimento técnico."
      }
    ],
    [
      {
        "question": "O chatbot substitui completamente os corretores?",
        "answer": "Não. Ele auxilia no atendimento inicial dos leads e filtra os contatos para os corretores, liberando-os para agir na negociação."
      },
      {
        "question": "Quais são as capacidades de envio de materiais pelo chatbot?",
        "answer": "O chatbot pode enviar informações sobre o empreendimento, como plantas e valores, conforme configurado e relevante para o interesse do lead."
      },
      {
        "question": "Ele é capaz de atender a vários empreendimentos ao mesmo tempo?",
        "answer": "Sim. O chatbot pode ser configurado para atender diferentes projetos e direcionar cada lead corretamente."
      },
      {
        "question": "Como o chatbot auxilia na qualificação dos leads?",
        "answer": "Pergunta informações sobre orçamento, tipo de imóvel e prazo antes de repassar o contato ao corretor."
      },
      {
        "question": "Quanto tempo leva para implementar e configurar o chatbot?",
        "answer": "A CODEXY colabora com a equipe comercial da construtora para configuração do chatbot, sem necessidade de conhecimento técnico ou demora significativa."
      }
    ],
  ],
    headline: (state) => `Chatbot para Construtoras ${state.in}`,
    introParagraph: (state) =>
      `A CODEXY desenvolve chatbot para construtora ${state.in} capaz de atender o alto volume de leads gerado por portais imobiliários e campanhas de Google e Meta Ads. O chatbot qualifica orçamento, tipo de imóvel e prazo de compra antes de repassar o contato ao corretor, envia plantas e valores automaticamente e garante resposta 24 horas por dia para cada lançamento da construtora.`,
    whatsappMessage: (state) =>
      `Olá! Vi a página sobre chatbot para construtora ${state.in} e quero saber mais sobre como implantar na minha construtora.`,
    seoTitle: (state) => `Chatbot para Construtoras ${state.seoIn} | CODEXY`,
    seoDescription: (state) =>
      `Qualifique automaticamente os leads de imóveis da sua construtora ${state.seoIn} com um chatbot no WhatsApp. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "academias",
    niche: "Academias",
    eyebrow: "Chatbot para Academias",
    heroImage: "/images/landing/academias-hero.jpg",
    heroImageAlt: "Um treinador trabalhando com um cliente em uma academia, ambos usando fones de ouvido, enquanto o chatbot aparece no fundo em uma tela de celular.",
    ogImage: "/images/og/academias-og.jpg",
    subheadline: "Libere seus funcionários para a atuação técnica e automatize agendamentos, pedidos e atendimento",
    painPoints: [
      { title: "Dificuldade em gerenciar agendamentos", description: "Muitos clientes se esquecem de suas reservas ou não comparecem às sessões." },
      { title: "Falta de tempo para responder mensagens", description: "Você e seus funcionários estão ocupados com a rotina da academia, deixando mensagens de WhatsApp sem resposta." },
      { title: "Dificuldade em gerenciar pedidos e encomendas", description: "Clientes fazem solicitações ou pedidos que precisam ser atendidos rapidamente." },
    ],
    benefits: [
      { title: "Agilidade no agendamento", description: "Permita que seus clientes reservem horários de treino com facilidade e rapidez." },
      { title: "Melhoria na experiência do cliente", description: "Fale diretamente com seus clientes via WhatsApp e atenda às suas necessidades em tempo real." },
      { title: "Automatização de processos", description: "Libere seu tempo para o que realmente importa: a formação dos treinadores e a manutenção da infraestrutura da academia." },
      { title: "Economia de recursos", description: "Com o chatbot, você pode reduzir os custos associados à mão de obra necessária para responder mensagens e gerenciar agendamentos." },
    ],
    faq: [
      { question: "Como funciona o chatbot?", answer: "O chatbot é um sistema que permite conversar com seus clientes via WhatsApp, automatizando tarefas como agendamento e atendimento." },
      { question: "Posso personalizar a mensagem do chatbot para minha academia?", answer: "Sim, você pode customizar as mensagens e respostas do chatbot para se adequar ao seu negócio." },
      { question: "O que acontece se um cliente tiver uma dúvida complexa?", answer: "Você pode configurar o chatbot para redirecionar os clientes com perguntas mais específicas ou complexas para seus funcionários, garantindo que as necessidades dos clientes sejam atendidas corretamente." },
      { question: "Posso monitorar o desempenho do meu chatbot?", answer: "Sim, você pode ver estatísticas sobre como o chatbot está sendo usado e como ele está ajudando sua academia" },
    ],
    headline: (state) => `Chatbot para Academias ${state.in}`,
    introParagraph: (state) => `A CODEXY entende que gerenciar uma academia é um desafio contínuo. Com nossos chatbots, você pode automatizar agendamentos, pedidos e atendimento, liberando seu tempo para o que realmente importa. ${state.in}, muitas academias estão utilizando nossos produtos com sucesso, melhorando a experiência dos clientes e aumentando a eficiência das operações.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para academia ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Academias ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Melhore sua experiência do cliente com um chatbot personalizado para academias ${state.seoIn}, automatizando agendamentos, pedidos e atendimento. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "acaiterias",
    niche: "Açaiterias",
    eyebrow: "Chatbot para Açaiterias",
    heroImage: "/images/landing/acaiterias-hero.jpg",
    heroImageAlt: "Imagem de uma açaiteria com funcionários atendendo a clientes enquanto um chatbot está em destaque na tela",
    ogImage: "/images/og/acaiterias-og.jpg",
    subheadline: "Automatize os pedidos e agendamentos, liberando seu time para o que realmente importa: oferecer qualidade à sua clientela.",
    painPoints: [
      { title: "Dificuldade de gerenciar demandas", description: "Os funcionários estão ocupados atendendo a clientes em pessoa." },
      { title: "Perda de tempo com agendamentos manuais", description: "Agora você tem que cuidar do agendamento dos pedidos" },
      { title: "Dificuldade em lidar com uma longa lista de pedidos", description: "Seus funcionários estão ocupados atendendo a clientes em pessoa." },
    ],
    benefits: [
      { title: "Redução do tempo gasto nos agendamentos", description: "Agora você tem mais tempo para se concentrar no que realmente importa" },
      { title: "Melhoria da experiência de cliente", description: "Os clientes podem fazer suas solicitações de forma rápida e fácil" },
      { title: "Redução do estresse de gerenciar pedidos", description: "Agora você tem mais tempo para se concentrar no que realmente importa." },
      { title: "Melhoria na eficiência operacional da açaiteria", description: "Os funcionários podem se dedicar a outras tarefas importantes" },
    ],
    faq: [
      { question: "Como funciona o chatbot?", answer: "O chatbot é um sistema de inteligência artificial que pode ser integrado ao WhatsApp para automatizar os pedidos e agendamentos." },
      { question: "Eu preciso ter conhecimento técnico para configurar o chatbot?", answer: "Não, você não precisa ter conhecimento técnico. A CODEXY oferece suporte completo para instalar e configurar o chatbot" },
      { question: "Posso personalizar a interface do chatbot para que ele se adapte à identidade da minha açaiteria?", answer: "Sim, é possível personalizar a interface do chatbot para atender às necessidades específicas da sua açaiteria" },
      { question: "Como posso garantir a segurança dos dados dos meus clientes?", answer: "A CODEXY adota medidas rigorosas de segurança para proteger os dados dos seus clientes. Além disso, você pode configurar o chatbot para cumprir com as leis de privacidade aplicáveis" },
    ],
    headline: (state) => `Chatbot para Açaiterias ${state.in}`,
    introParagraph: (state) => `A CODEXY oferece uma solução inovadora para as açaiterias ${state.in}, permitindo que elas se concentrem em oferecer qualidade à seus clientes. Com o nosso chatbot, você pode automatizar os pedidos e agendamentos, liberando seu time para atender melhor às necessidades dos consumidores.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para açaiterias ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Açaiterias ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Automatize os pedidos e agendamentos de sua açaiteria ${state.seoIn} com o nosso chatbot. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "agencias-de-turismo",
    niche: "Agências de Turismo",
    eyebrow: "Chatbot para Agências de Turismo",
    heroImage: "/images/landing/agencias-de-turismo-hero.jpg",
    heroImageAlt: "Imagem de um agente de viagens sentado em uma mesa com documentos e um computador, com uma expressão de alívio ao lado do chatbot da CODEXY",
    ogImage: "/images/og/agencias-de-turismo-og.jpg",
    subheadline: "Automatize o atendimento a clientes, reserve passagens e hotéis, e gerencie pedidos de forma eficiente",
    painPoints: [
      { title: "Dificuldade em atender a múltiplos canais", description: "Muitos clientes preferem entrar em contato pelas redes sociais ou WhatsApp" },
      { title: "Perda de tempo na gestão de pedidos e reservas", description: "Atendimento ao cliente manual pode ser demorado e propenso a erros" },
      { title: "Dificuldade em manter atualizados os preços e disponibilidade dos pacotes", description: "Preços e opções podem mudar rapidamente, dificultando a gestão" },
    ],
    benefits: [
      { title: "Melhoria no atendimento ao cliente", description: "Responda às solicitações de forma rápida e eficiente" },
      { title: "Redução do tempo de atendimento", description: "Automatize processos, como pedidos e reservas" },
      { title: "Aumento da agilidade em manter atualizados os preços e disponibilidade dos pacotes", description: "Mantenha seus clientes informados sobre as melhores opções de viagens" },
      { title: "Gestão eficiente de pedidos e reservas", description: "Centralize a gestão de todos os processos, facilitando o trabalho" },
    ],
    faq: [
      { question: "Como funciona o chatbot?", answer: "O chatbot da CODEXY é um sistema automatizado que responde às perguntas dos clientes e realiza tarefas específicas" },
      { question: "Posso personalizar o chatbot para atender às necessidades específicas de minha agência?", answer: "Sim, podemos ajustar as configurações para adaptar ao seu negócio" },
      { question: "O chatbot é capaz de lidar com múltiplos idiomas?", answer: "Sim, o nosso sistema suporta diversas línguas, garantindo que você possa atender a um público mais amplo" },
      { question: "Eu posso ter acesso às estatísticas e relatórios sobre o desempenho do chatbot?", answer: "Sim, podemos fornecer dados sobre uso e desempenho para ajudá-lo a tomar decisões informadas" },
    ],
    headline: (state) => `Chatbot para Agências de Turismo ${state.in}`,
    introParagraph: (state) => `A CODEXY entende as necessidades das agências de turismo e desenvolveu um chatbot personalizado para automatizar processos, como atendimento ao cliente, pedidos e reservas. Com nossa solução, você pode oferecer uma experiência mais eficiente e agradável aos seus clientes ${state.in}.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para agências de turismo ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Agências de Turismo ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Melhore o atendimento ao cliente, automatize pedidos e reservas e aumente a eficiência da sua agência de turismo ${state.seoIn}. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "autoescolas",
    niche: "Autoescolas",
    eyebrow: "Chatbot para Autoescolas",
    heroImage: "/images/landing/autoescolas-hero.jpg",
    heroImageAlt: "Alunos aprendendo em uma autoescola com apoio de um chatbot",
    ogImage: "/images/og/autoescolas-og.jpg",
    subheadline: "Automatize agendamentos, atendimento e pedidos de seus alunos",
    painPoints: [
      { title: "Dificuldade em gerenciar demanda", description: "Muitas vezes não conseguimos atender a todos os nossos alunos no momento certo." },
      { title: "Perda de tempo com comunicação", description: "Ficamos muito ocupados respondendo mensagens e fazendo ligações." },
      { title: "Impossibilidade de estar em vários lugares ao mesmo tempo", description: "Não podemos estar fisicamente presente em todas as autoescolas que temos." },
    ],
    benefits: [
      { title: "Melhoria no atendimento", description: "Os alunos recebem respostas rápidas e personalizadas, melhorando sua experiência." },
      { title: "Ganho de tempo", description: "Nós podemos focar em ensinar e não mais perder tempo com comunicação." },
      { title: "Expansão de negócios", description: "Com o chatbot, podemos abrir novas autoescolas sem a necessidade de aumentar nosso pessoal." },
      { title: "Aumento da eficiência", description: "Os alunos podem agendar e solicitar serviços de forma fácil e rápida." },
    ],
    faq: [
      { question: "O chatbot pode substituir meus funcionários?", answer: "Não, ele é uma ferramenta para ajudar a automatizar tarefas, não substituir pessoas." },
      { question: "O chatbot é compatível com meu sistema de gerenciamento?", answer: "Sim, nossa equipe se encarrega de integrá-lo ao seu sistema." },
      { question: "Quem é responsável pela manutenção do chatbot?", answer: "A CODEXY oferece suporte técnico e ajuda a garantir que ele continue funcionando corretamente." },
      { question: "O que acontece se o chatbot não conseguir atender à uma solicitação?", answer: "Nesse caso, o sistema redireciona para um profissional humano que pode ajudar." },
    ],
    headline: (state) => `Chatbot para Autoescolas ${state.in}`,
    introParagraph: (state) => `A CODEXY entende as necessidades das autoescolas e desenvolveu um chatbot para automatizar agendamentos, atendimento e pedidos de seus alunos. Com ele, você pode oferecer uma experiência mais personalizada e eficiente aos seus clientes, mesmo com lojas ${state.in}.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para autoescolas ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Autoescolas ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Melhore sua experiência de atendimento com um chatbot personalizado, desenvolvido especialmente para autoescolas ${state.seoIn}, Fale com a CODEXY.`,
  },
  {
    nicheSlug: "barbearias",
    niche: "Barbearias",
    eyebrow: "Chatbot para Barbearias",
    heroImage: "/images/landing/barbearias-hero.jpg",
    heroImageAlt: "Barbeiro atendendo a clientes com ajuda do chatbot",
    ogImage: "/images/og/barbearias-og.jpg",
    subheadline: "Automatize agendamentos, pedidos e atendimento de forma eficiente",
    painPoints: [
      { title: "Dificuldade em gerenciar agendamentos", description: "A falta de uma ferramenta para organizar horários pode causar atrasos e perda de clientes." },
      { title: "Tempo dedicado ao atendimento", description: "Barbeiros podem perder tempo respondendo perguntas repetidas, afastando-os do seu trabalho principal." },
      { title: "Dificuldade em gerenciar pedidos", description: "O processo de receber e processar pedidos pode ser complexo e demorado." },
      { title: "Falta de personalização no atendimento", description: "Cada cliente é único, mas muitas vezes os barbeiros não têm tempo para oferecer serviços personalizados." },
    ],
    benefits: [
      { title: "Agendamento eficiente", description: "O chatbot ajuda a organizar horários de forma automática, evitando atrasos e perda de clientes." },
      { title: "Atendimento mais rápido", description: "Com o chatbot, os barbeiros podem focar no trabalho principal enquanto o atendimento é feito de forma rápida e eficiente." },
      { title: "Gerenciamento de pedidos simplificado", description: "O chatbot ajuda a processar pedidos de forma rápida e fácil, evitando erros e atrasos." },
      { title: "Personalização no atendimento", description: "Com o chatbot, os barbeiros podem oferecer serviços personalizados para cada cliente." },
      { title: "Redução do tempo dedicado ao atendimento", description: "O chatbot ajuda a reduzir o tempo gasto em responder perguntas repetidas e processar pedidos." },
    ],
    faq: [
      { question: "Como funciona o chatbot?", answer: "O chatbot é uma ferramenta que automatiza tarefas, como agendamentos, pedidos e atendimento." },
      { question: "Quais são as vantagens do uso do chatbot em barbearias?", answer: "As principais vantagens incluem agendamento eficiente, atendimento mais rápido, gerenciamento de pedidos simplificado e personalização no atendimento." },
      { question: "Posso customizar o chatbot para atender às necessidades específicas da minha barbearia?", answer: "Sim, a CODEXY oferece opções de personalização para que você possa adaptar o chatbot às suas necessidades." },
      { question: "Quem tem acesso ao chatbot?", answer: "O chatbot é acessível via WhatsApp e pode ser utilizado por qualquer cliente que tenha o aplicativo instalado." },
      { question: "Como posso implantar o chatbot na minha barbearia?", answer: "A CODEXY oferece suporte técnico e orientação para ajudá-lo a implantar o chatbot de forma eficaz." },
    ],
    headline: (state) => `Chatbot para Barbearias ${state.in}`,
    introParagraph: (state) => `A CODEXY ajuda as barbearias ${state.in} a automatizar tarefas como agendamentos, pedidos e atendimento. Com o nosso chatbot, os barbeiros podem focar no trabalho principal enquanto o atendimento é feito de forma rápida e eficiente.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para barbearia ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Barbearias ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Automatize agendamentos, pedidos e atendimento na sua barbearia ${state.seoIn} com o nosso chatbot. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "buffets-e-casas-de-festa",
    niche: "Buffets e Casas de Festa",
    eyebrow: "Chatbot para Buffets e Casas de Festa",
    heroImage: "/images/landing/buffets-e-casas-de-festa-hero.jpg",
    heroImageAlt: "Um buffet lotado com clientes se divertindo, ao fundo um chatbot em tela na mesa central.",
    ogImage: "/images/og/buffets-e-casas-de-festa-og.jpg",
    subheadline: "Automatize pedidos, agendamentos e atendimento para que os seus clientes possam se concentrar na diversão!",
    painPoints: [
      { title: "Falta de eficiência no atendimento", description: "Os funcionários estão ocupados demais com pedidos e respostas a perguntas." },
      { title: "Perda de oportunidades", description: "Clientes esquecem suas reservas ou não sabem como se comunicar para agendar um evento." },
      { title: "Dificuldade em gerenciar estoques", description: "O buffet está sobrecarregado e precisa planejar melhor as refeições." },
    ],
    benefits: [
      { title: "Redução de tempo no atendimento", description: "Os clientes podem se comunicar diretamente com o chatbot para pedidos e informações." },
      { title: "Aumento da eficiência do serviço", description: "O chatbot ajuda a gerenciar as reservas, os pedidos e as refeições de forma mais organizada." },
      { title: "Melhoria na experiência do cliente", description: "Os clientes podem se comunicar facilmente com o buffet para agendar eventos ou fazer pedidos." },
      { title: "Menor custo com funcionários", description: "O chatbot ajuda a reduzir a necessidade de funcionários adicionais, economizando recursos." },
    ],
    faq: [
      { question: "Como funciona o chatbot?", answer: "O chatbot é uma ferramenta que permite aos clientes se comunicar diretamente com o buffet através do WhatsApp para fazer pedidos e agendar eventos." },
      { question: "Eu preciso de um desenvolvedor para criar o chatbot?", answer: "Não, a CODEXY fornece os chatbots personalizados para cada negócio." },
      { question: "Posso customizar o chatbot para atender às necessidades específicas do meu buffet?", answer: "Sim, é possível personalizar o chatbot para atender às suas necessidades específicas." },
      { question: "Como posso implantar o chatbot no meu negócio?", answer: "A CODEXY fornece suporte e orientação completa para a implementação do chatbot em seu buffet." },
    ],
    headline: (state) => `Chatbot para Buffets e Casas de Festa ${state.in}`,
    introParagraph: (state) => `Imagine ter um sistema automatizado para gerenciar as reservas, os pedidos e as refeições do seu buffet. A CODEXY oferece soluções personalizadas para ajudar a melhorar a experiência do cliente e reduzir o tempo de atendimento em seus buffets e casas de festa ${state.in}.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para buffet ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Buffets e Casas de Festa ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Melhore a experiência do cliente e automatize seu negócio com o chatbot da CODEXY ${state.seoIn}, fale conosco!`,
  },
  {
    nicheSlug: "clinicas-odontologicas",
    niche: "Clínicas Odontológicas",
    eyebrow: "Chatbot para Clínicas Odontológicas",
    heroImage: "/images/landing/clinicas-odontologicas-hero.jpg",
    heroImageAlt: "Equipe de atendimento da clínica conversando com um paciente ao lado do chatbot em uma tela de computador",
    ogImage: "/images/og/clinicas-odontologicas-og.jpg",
    subheadline: "Automatize agendamentos, atendimento e pedidos de materiais médicos para focar no cuidado dos pacientes.",
    painPoints: [
      { title: "Tempo perdido", description: "O tempo dedicado ao atendimento ao cliente pode ser reduzido com o uso de um chatbot." },
      { title: "Maior eficiência", description: "Os funcionários podem se concentrar em procedimentos mais críticos." },
      { title: "Aumento da satisfação do paciente", description: "Pacientes podem agendar consultas e realizar pedidos de forma rápida e fácil." },
    ],
    benefits: [
      { title: "Maior eficiência", description: "Os funcionários podem se concentrar em procedimentos mais críticos." },
      { title: "Redução do tempo de espera", description: "Pacientes aguardam menos tempo para serem atendidos." },
      { title: "Aumento da satisfação do paciente", description: "Pacientes podem agendar consultas e realizar pedidos de forma rápida e fácil." },
      { title: "Redução dos custos operacionais", description: "O uso de recursos pode ser otimizado com a automatização de tarefas." },
    ],
    faq: [
      { question: "Como funciona o chatbot?", answer: "O chatbot é um software que pode ser integrado ao WhatsApp e outros canais para fornecer informações e realizar tarefas automática e personalizada." },
      { question: "Qual é a vantagem de usar um chatbot em vez de um funcionário?", answer: "Os chatbots podem trabalhar 24 horas por dia, sete dias por semana sem precisar de descanso ou folga." },
      { question: "Posso personalizar o chatbot para atender às necessidades específicas da minha clínica?", answer: "Sim, é possível personalizar a experiência do usuário e as interações com o chatbot para atender às necessidades específicas da sua clínica." },
      { question: "Posso acompanhar os dados de uso e desempenho do meu chatbot?", answer: "Sim, você pode acompanhar os dados de uso e desempenho do seu chatbot através do painel de controle fornecido pela CODEXY." },
    ],
    headline: (state) => `Chatbot para Clínicas Odontológicas ${state.in}`,
    introParagraph: (state) => `A CODEXY oferece uma solução inovadora para as clínicas odontológicas ${state.in}, permitindo que elas se concentrem no cuidado dos pacientes enquanto automatizam tarefas rotineiras. Com o chatbot, os pacientes podem agendar consultas e realizar pedidos de forma rápida e fácil, reduzindo o tempo de espera e aumentando a satisfação do paciente.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para clínica odontológica ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Clínicas Odontológicas ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Automatize agendamentos, atendimento e pedidos de materiais médicos com o chatbot da CODEXY ${state.seoIn}. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "clinicas-veterinarias",
    niche: "Clínicas Veterinárias",
    eyebrow: "Chatbot para Clínicas Veterinárias",
    heroImage: "/images/landing/clinicas-veterinarias-hero.jpg",
    heroImageAlt: "Equipe de veterinários atendendo pacientes em uma clínica veterinária com auxílio de um chatbot no WhatsApp.",
    ogImage: "/images/og/clinicas-veterinarias-og.jpg",
    subheadline: "Automatize agendamentos, atendimento e pedidos de consultas para focar na saúde dos seus pacientes.",
    painPoints: [
      { title: "Dificuldade no gerenciamento de agendamentos", description: "Muitos proprietários estão cansados de lidar com ligações e mensagens de clientes, afastando-se do que realmente importa: a saúde dos animais." },
      { title: "Perda de tempo em atendimento ao cliente", description: "Proprietários de clínicas veterinárias passam horas respondendo perguntas e fornecendo informações sobre procedimentos e horários de funcionamento." },
      { title: "Dificuldade no gerenciamento de pedidos de consultas", description: "É comum os proprietários terem dificuldades em manter a organização dos pedidos de consultas, o que pode resultar em atrasos ou perda de clientes." },
    ],
    benefits: [
      { title: "Agilidade no agendamento", description: "O chatbot da CODEXY permite que os proprietários se concentrem na saúde dos pacientes enquanto o atendimento ao cliente é automatizado." },
      { title: "Redução do tempo gasto em atendimento", description: "Com o chatbot, os clientes podem obter as informações necessárias de forma rápida e eficaz, liberando tempo para que os proprietários se concentrem na assistência aos pacientes." },
      { title: "Melhoria no gerenciamento de pedidos de consultas", description: "O chatbot da CODEXY permite que os proprietários gerenciem os pedidos de consultas de forma eficiente e organizada, reduzindo a chance de atrasos ou perda de clientes." },
      { title: "Aumento na satisfação do cliente", description: "Com o atendimento ao cliente automatizado, os clientes têm acesso rápido às informações necessárias, aumentando a satisfação com a clínica veterinária." },
    ],
    faq: [
      { question: "Como funciona o chatbot?", answer: "O chatbot da CODEXY é um sistema de automação que pode ser integrado ao seu WhatsApp e atende perguntas frequentes, agendamentos e pedidos de consultas de forma eficiente." },
      { question: "Posso personalizar as respostas do chatbot?", answer: "Sim, é possível personalizar as respostas do chatbot para que sejam adaptadas às necessidades específicas da sua clínica veterinária." },
      { question: "O chatbot pode agendar consultas automaticamente?", answer: "Sim, o chatbot pode agendar consultas de forma automática, liberando tempo para que os proprietários se concentrem na saúde dos pacientes." },
      { question: "Posso acessar estatísticas sobre o uso do chatbot?", answer: "Sim, a CODEXY fornece ferramentas de análise para que você possa acompanhar o desempenho e ajustar as configurações conforme necessário." },
    ],
    headline: (state) => `Chatbot para Clínicas Veterinárias ${state.in}`,
    introParagraph: (state) => `A CODEXY oferece uma solução inovadora para clínicas veterinárias ${state.in}, permitindo que você automatize agendamentos, atendimento e pedidos de consultas. Com o nosso chatbot, você pode se concentrar na saúde dos seus pacientes enquanto a equipe da CODEXY ajuda a gerenciar as operações do seu negócio.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para clínicas veterinárias ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Clínicas Veterinárias ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Automatize agendamentos, atendimento e pedidos de consultas em sua clínica veterinária com o chatbot da CODEXY ${state.seoIn}. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "confeitarias",
    niche: "Confeitarias",
    eyebrow: "Chatbot para Confeitarias",
    heroImage: "/images/landing/confeitarias-hero.jpg",
    heroImageAlt: "Uma confeitaria com clientes satisfeitos ao redor de uma mesa com bolos e doces.",
    ogImage: "/images/og/confeitarias-og.jpg",
    subheadline: "Libere mais tempo para criar delícias, não para atender a clientes ansiosos.",
    painPoints: [
      { title: "Muitas ligações e mensagens no WhatsApp", description: "Sempre ocupado(a) respondendo perguntas sobre horários de funcionamento, produtos e pedidos." },
      { title: "Perda de tempo com clientes ansiosos", description: "Clientes reclamando de prazos de entrega ou querendo cancelar encomendas." },
      { title: "Dificuldade em agendar horários para atendimento pessoal", description: "Frequente solicitação de agendamentos e marcadores de horário que ficam perdidos." },
    ],
    benefits: [
      { title: "Automatize respostas comuns", description: "Ofereça rapidamente informações sobre produtos, preços e horários de funcionamento." },
      { title: "Agende maratonas de atendimento sem esforço", description: "Liberte tempo para criar novos produtos e cuidar da equipe." },
      { title: "Reduza reclamações por WhatsApp", description: "Mantenha seus clientes satisfeitos com respostas rápidas e precisas." },
      { title: "Melhore a experiência do cliente", description: "Ofereça uma experiência mais personalizada e acolhedora com agendamento de horários para atendimento pessoal." },
    ],
    faq: [
      { question: "Como posso garantir que o chatbot esteja sempre atualizado?", answer: "A CODEXY oferece suporte técnico contínuo para garantir a manutenção do seu chatbot sempre atualizado e funcionando corretamente." },
      { question: "Posso personalizar as respostas do chatbot para melhor atender às necessidades da minha confeitaria?", answer: "Sim, você pode trabalhar com nossa equipe de especialistas em conversacional AI para criar respostas personalizadas que se encaixem perfeitamente à sua marca e necessidades." },
      { question: "Quais são os benefícios do uso de um chatbot em minha confeitaria?", answer: "Os benefícios incluem aumento da eficiência, melhoria na experiência do cliente, redução no tempo gasto com respostas a perguntas frequentes e muito mais." },
      { question: "Posso integrar o meu chatbot ao meu sistema de gerenciamento de confeitaria?", answer: "Sim, nossa equipe pode trabalhar para garantir que seu chatbot esteja integrado a seus sistemas existentes, facilitando ainda mais sua jornada de automação." },
    ],
    headline: (state) => `Chatbot para Confeitarias ${state.in}`,
    introParagraph: (state) => `A CODEXY entende as necessidades únicas das confeitarias e desenvolveu um chatbot personalizado para automatizar tarefas rotineiras, como respostas a perguntas frequentes, agendamento de horários de atendimento pessoal e recebimento de pedidos. Com nosso chatbot, você pode liberar mais tempo para criar delícias incríveis enquanto oferece uma experiência mais personalizada e acolhedora aos seus clientes ${state.in}.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para confeitarias ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Confeitarias ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Automatize respostas comuns, agende maratonas de atendimento sem esforço e melhore a experiência do cliente em sua confeitaria ${state.seoIn}. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "corretores-de-seguros",
    niche: "Corretores de Seguros",
    eyebrow: "Chatbot para Corretores de Seguros",
    heroImage: "/images/landing/corretores-de-seguros-hero.jpg",
    heroImageAlt: "Um corretor de seguros conversando com um cliente por meio do WhatsApp",
    ogImage: "/images/og/corretores-de-seguros-og.jpg",
    subheadline: "Automatize agendamentos, atendimento e pedidos de seguro sem perder a humanidade",
    painPoints: [
      { title: "Perda de tempo em tarefas repetitivas", description: "Atender a clientes e realizar procedimentos burocráticos podem consumir tempo valioso que poderia ser dedicado à venda de seguros." },
      { title: "Falta de agilidade no atendimento", description: "Os clientes esperam respostas rápidas, mas os corretores de seguros precisam gerenciar múltiplos canais de comunicação." },
      { title: "Dificuldade em manter a documentação atualizada", description: "A gestão de documentos e procedimentos pode ser um pesadelo para os negócios que crescem rapidamente." },
    ],
    benefits: [
      { title: "Atendimento personalizado", description: "Os clientes recebem respostas imediatas e atenção individualizada, melhorando a experiência do cliente." },
      { title: "Agilidade no agendamento e atendimento", description: "O chatbot automatiza tarefas rotineiras, liberando tempo para atividades mais importantes." },
      { title: "Melhoria na gestão de documentos", description: "Os dados dos clientes são organizados e fáceis de acessar, facilitando a gestão do negócio." },
      { title: "Redução no tempo de resposta", description: "Os clientes recebem respostas rápidas, melhorando a satisfação e aumentando as chances de venda de seguros." },
    ],
    faq: [
      { question: "Como o chatbot se integra ao meu sistema de gestão?", answer: "A CODEXY fornece ferramentas para fácil integração com os sistemas de gestão existentes, garantindo a fluidez das operações." },
      { question: "O que acontece se o cliente tiver uma dúvida complexa?", answer: "O chatbot direcionará o cliente ao corretor de seguros para um atendimento personalizado e resolução da questão." },
      { question: "Eu posso customizar o conteúdo do chatbot?", answer: "Sim, a CODEXY oferece ferramentas para que os corretores de seguros possam personalizar as mensagens e respostas do chatbot para se alinhar com sua marca e necessidades." },
      { question: "Gostaria de saber mais sobre o custo e como implantar?", answer: "Entre em contato conosco para discutir as opções de implementação e os planos que melhor atendam às suas necessidades específicas, sem comprometer a qualidade do serviço oferecido." },
    ],
    headline: (state) => `Chatbot para Corretores de Seguros ${state.in}`,
    introParagraph: (state) => `A CODEXY entende as necessidades dos corretores de seguros e oferece soluções inovadoras que ajudam a automatizar processos, melhorar a experiência do cliente e aumentar as chances de venda de seguros. Com o nosso chatbot para ${state.in}, você pode agilizar tarefas rotineiras, manter a documentação atualizada e oferecer atendimento personalizado aos seus clientes.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para corretores de seguros ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Corretores de Seguros ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Melhore sua experiência do cliente com o nosso chatbot personalizado para corretores de seguros ${state.seoIn}, aumente as chances de venda e agilize processos. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "cursos-tecnicos",
    niche: "Cursos Técnicos",
    eyebrow: "Chatbot para Cursos Técnicos",
    heroImage: "/images/landing/cursos-tecnicos-hero.jpg",
    heroImageAlt: "Alunos utilizando chatbot em uma sala de aula de cursos técnicos",
    ogImage: "/images/og/cursos-tecnicos-og.jpg",
    subheadline: "Automatize agendamentos e respostas aos estudantes",
    painPoints: [
      { title: "Dificuldade em gerenciar demanda", description: "Muitos alunos solicitam informações e agendamento ao mesmo tempo, sobrecarregando os professores." },
      { title: "Tempo desperdiçado com perguntas repetidas", description: "Alunos frequentemente repõem questões já respondidas, consumindo tempo valioso do time de ensino." },
      { title: "Dificuldade em manter atualização de informações", description: "Informações sobre horários, matérias e professores tendem a se desatualizar facilmente." },
    ],
    benefits: [
      { title: "Agilidade no atendimento", description: "O chatbot responde rapidamente às perguntas mais comuns dos alunos." },
      { title: "Alívio para professores e coordenadores", description: "O sistema de chatbots reduz a carga de trabalho desses profissionais, permitindo que eles se concentrem em atividades mais estratégicas." },
      { title: "Melhoria na experiência do aluno", description: "Os estudantes recebem respostas rápidas e precisas às suas dúvidas." },
      { title: "Flexibilidade e escalabilidade", description: "O sistema de chatbots pode ser facilmente atualizado e configurado para atender às necessidades específicas do seu curso técnico." },
    ],
    faq: [
      { question: "Como o chatbot se comunica com os alunos?", answer: "Por meio de mensagens de texto no WhatsApp, permitindo que os estudantes interajam diretamente com o sistema." },
      { question: "Quais são as limitações do uso de um chatbot em cursos técnicos?", answer: "A principal limitação é a necessidade de atualização constante das informações disponibilizadas, mas isso pode ser facilmente gerenciado com um sistema bem estruturado." },
      { question: "Posso personalizar o conteúdo e as respostas do chatbot?", answer: "Sim, você pode configurar o sistema para atender às necessidades específicas do seu curso técnico e atualizar informações em tempo real." },
      { question: "O que acontece se o aluno tiver uma dúvida complexa ou que demande mais atenção?", answer: "O chatbot direcionará o aluno a um contato humano, garantindo que as necessidades mais críticas sejam atendidas de forma eficaz." },
    ],
    headline: (state) => `Chatbot para Cursos Técnicos ${state.in}`,
    introParagraph: (state) => `A CODEXY entende as necessidades únicas dos cursos técnicos e desenvolveu soluções personalizadas para automatizar processos, como agendamento de aulas e respostas aos estudantes. Com um chatbot configurado especialmente para o seu curso técnico ${state.in}, você pode oferecer experiências mais eficientes e satisfatórias para seus alunos.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para cursos técnicos ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Cursos Técnicos ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Automatize agendamentos, respostas a perguntas e atualização de informações com o chatbot da CODEXY em cursos técnicos ${state.seoIn}, Fale com a CODEXY.`,
  },
  {
    nicheSlug: "decoracao-de-festas",
    niche: "Decorações de Festas",
    eyebrow: "Chatbot para Decorações de Festas",
    heroImage: "/images/landing/decoracao-de-festas-hero.jpg",
    heroImageAlt: "Uma festa bem decorada com um chatbot atendendo os clientes",
    ogImage: "/images/og/decoracao-de-festas-og.jpg",
    subheadline: "Automatize pedidos, agendamentos e respostas comumuns para focar em o que importa: criar momentos inesquecíveis",
    painPoints: [
      { title: "Tempo perdido", description: "Desperdiçar tempo respondendo perguntas comuns e fazendo pedidos de forma manual" },
      { title: "Duplicação de esforços", description: "Ter a mesma conversa repetidamente sobre os mesmos produtos e serviços" },
      { title: "Perda de oportunidades", description: "Não atender aos clientes que precisam agendar um encontro para discutir projetos" },
    ],
    benefits: [
      { title: "Mais tempo livre", description: "Maior eficiência no atendimento e mais tempo disponível para focar na decoração" },
      { title: "Menos esforço", description: "Respostas automáticas para perguntas comuns e pedidos de forma rápida e fácil" },
      { title: "Mais oportunidades", description: "Agendar encontros com clientes interessados em projetos de decoração" },
      { title: "Melhor experiência", description: "Oferecer uma experiência personalizada e atenciosa aos seus clientes" },
    ],
    faq: [
      { question: "Como o chatbot vai ajudar a minha empresa?", answer: "O chatbot automatiza tarefas comuns, como pedidos e respostas, deixando você mais tempo para focar na decoração" },
      { question: "Posso personalizar o chatbot para atender às necessidades da minha empresa?", answer: "Sim, é possível personalizar o chatbot para que ele atenda às suas necessidades específicas" },
      { question: "Como posso garantir a qualidade do serviço oferecido pelo chatbot?", answer: "A CODEXY oferece suporte e manutenção contínuos para garantir que o chatbot esteja funcionando corretamente" },
      { question: "Qual é o custo de implantação de um chatbot?", answer: "O custo varia de acordo com as necessidades da sua empresa, mas a CODEXY oferece soluções personalizadas e competitivas" },
    ],
    headline: (state) => `Chatbot para Decorações de Festas ${state.in}`,
    introParagraph: (state) => `A CODEXY entende que cada decoração de festa é uma oportunidade única para criar momentos inesquecíveis. Com o nosso chatbot, você pode automatizar tarefas comuns e se concentrar no que importa: oferecer a melhor experiência possível aos seus clientes. ${state.in}, as empresas estão procurando por soluções inovadoras para melhorar a eficiência e a satisfação dos clientes.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para decorações de festas ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Decorações de Festas ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Ofereça uma experiência personalizada aos seus clientes com o chatbot da CODEXY ${state.seoIn}. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "dedetizadoras",
    niche: "Dedetizadoras",
    eyebrow: "Chatbot para Dedetizadora",
    heroImage: "/images/landing/dedetizadoras-hero.jpg",
    heroImageAlt: "Uma dedetizadora utilizando um chatbot no WhatsApp",
    ogImage: "/images/og/dedetizadoras-og.jpg",
    subheadline: "Automatize atendimento e agendamentos sem interrupção da rotina diária",
    painPoints: [
      { title: "Dificuldade em gerenciar tempo de atendimento", description: "Muitas dedetizadoras enfrentam dificuldades para responder às demandas dos clientes, o que pode afastar uma parte do mercado" },
      { title: "Falta de agilidade no atendimento", description: "Os proprietários de dedetizadora costumam dedicar muito tempo em lidar com as solicitações dos clientes, o que impacta na capacidade do negócio crescer" },
      { title: "Dificuldade em manter registro de pedidos", description: "As dedetizadoras muitas vezes enfrentam problemas para organizar e controlar suas solicitações" },
    ],
    benefits: [
      { title: "Atendimento personalizado", description: "Os clientes recebem atenção individualizada, melhorando a experiência geral do serviço" },
      { title: "Agilidade no agendamento de dedetização", description: "O cliente pode agendar o atendimento rapidamente e sem precisar esperar por retorno da dedetizadora" },
      { title: "Centralização dos pedidos", description: "Os proprietários podem ter acesso a um registro centralizado de solicitações, facilitando o gerenciamento do negócio" },
      { title: "Flexibilidade no horário de atendimento", description: "O chatbot pode funcionar 24 horas por dia, oferecendo mais opções para os clientes" },
    ],
    faq: [
      { question: "Como funciona o chatbot?", answer: "O chatbot é um software que automatiza as interações com os clientes via WhatsApp, permitindo agilidade e eficiência no atendimento" },
      { question: "Posso configurar meu próprio chatbot?", answer: "Sim, a CODEXY fornece ferramentas para configuração personalizada do chatbot" },
      { question: "O que acontece se o cliente tiver uma dúvida específica?", answer: "O chatbot pode ser programado para encaminhar questões complexas para um contato humano direto" },
      { question: "Posso usar o chatbot para outros serviços?", answer: "Sim, você pode configurar o chatbot para atender a necessidades diferentes" },
    ],
    headline: (state) => `Chatbot para Dedetizadora ${state.in}`,
    introParagraph: (state) => `A CODEXY ajuda as dedetizadoras ${state.in} a automatizar seus processos de atendimento e agendamento, melhorando a experiência do cliente e otimizando o tempo dos proprietários. Com nossa solução, você pode oferecer um serviço mais rápido e eficiente aos clientes, aumentando assim a satisfação e fidelidade deles.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para dedetizadora ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Dedetizadora ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Automatize seu atendimento com um chatbot personalizado, oferecendo experiência inovadora aos clientes ${state.seoIn}. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "desentupidoras",
    niche: "Desentupidoras",
    eyebrow: "Chatbot para Desentupidoras",
    heroImage: "/images/landing/desentupidoras-hero.jpg",
    heroImageAlt: "Desentupidora utilizando um chatbot para agendar serviços e atender clientes",
    ogImage: "/images/og/desentupidoras-og.jpg",
    subheadline: "Automatize o atendimento de clientes e agendamento de serviços com um chatbot personalizado",
    painPoints: [
      { title: "Muitos clientes estão perdendo tempo em contato direto", description: "Desentupidoras enfrentam dificuldade em gerenciar a demanda por serviços" },
      { title: "Dificuldade em agendar serviços", description: "Clientes precisam esperar muito tempo para marcar um horário de atendimento" },
      { title: "Problemas na comunicação com clientes", description: "Desentupidoras enfrentam dificuldades em responder às perguntas e solicitações dos clientes" },
    ],
    benefits: [
      { title: "Aumente a eficiência do atendimento ao cliente", description: "Responda rapidamente a perguntas e solicitações dos clientes" },
      { title: "Melhore a experiência do cliente", description: "Ofereça um atendimento personalizado e eficaz" },
      { title: "Reduza o tempo de resposta aos clientes", description: "Responda rapidamente às perguntas e solicitações dos clientes" },
      { title: "Aumente a produtividade da equipe", description: "Libere mais tempo para os funcionários se concentrarem em serviços importantes" },
    ],
    faq: [
      { question: "Como um chatbot pode ajudar uma desentupidora?", answer: "Um chatbot pode automatizar o atendimento ao cliente e agendamento de serviços, permitindo que as equipes se concentrem em resolver problemas complexos" },
      { question: "Quais são os benefícios de usar um chatbot para uma desentupidora?", answer: "Os principais benefícios incluem aumento da eficiência do atendimento ao cliente, melhoria da experiência do cliente e redução do tempo de resposta aos clientes" },
      { question: "Como posso garantir que o meu chatbot esteja funcionando corretamente?", answer: "A CODEXY fornece suporte técnico e treinamento para garantir que os seus chatsbots sejam personalizados e eficazes para a sua desentupidora" },
      { question: "Posso personalizar o meu chatbot com informações específicas da minha desentupidora?", answer: "Sim, você pode personalizar o seu chatbot com informações específicas da sua desentupidora" },
    ],
    headline: (state) => `Chatbot para Desentupidoras ${state.in}`,
    introParagraph: (state) => `A CODEXY ajuda as desentupidoras ${state.in} a melhorar a experiência do cliente e aumentar a eficiência do atendimento ao cliente com chatbots personalizados. Com um chatbot, você pode automatizar o agendamento de serviços e responder rapidamente às perguntas dos clientes. Isso significa que suas equipes podem se concentrarem em resolver problemas complexos e fornecer serviços mais eficazes para os seus clientes.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para desentupidoras ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Desentupidoras ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Desenvolva um chatbot personalizado para sua desentupidora ${state.seoIn}, aumente a eficiência do atendimento ao cliente e melhore a experiência do cliente. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "diaristas-e-limpeza-residencial",
    niche: "Diaristas e Limpeza Residencial",
    eyebrow: "Chatbot para Diaristas e Limpeza Residencial",
    heroImage: "/images/landing/diaristas-e-limpeza-residencial-hero.jpg",
    heroImageAlt: "Foto de uma diarista conversando com um cliente através do WhatsApp, com a imagem de um chatbot em segundo plano.",
    ogImage: "/images/og/diaristas-e-limpeza-residencial-og.jpg",
    subheadline: "Automatize agendamentos, pedidos e atendimento com um chatbot personalizado para sua empresa de limpeza residencial",
    painPoints: [
      { title: "Dificuldade em gerenciar agendamentos e pedidos", description: "Muitas empresas de limpeza residencial enfrentam problemas para organizar e atender às demandas dos clientes." },
      { title: "Falta de comunicação eficaz com os clientes", description: "Os diaristas e funcionários podem ter dificuldade em manter a comunicação com os clientes, levando a mal-entendidos e frustrações." },
      { title: "Dificuldade em escalonar o negócio", description: "À medida que o negócio cresce, pode ser desafiador gerenciar a expansão e manter a qualidade do serviço." },
    ],
    benefits: [
      { title: "Aumento da eficiência na gestão de agendamentos e pedidos", description: "O chatbot ajuda a organizar e automatizar os processos, liberando tempo para atendimento ao cliente e crescimento do negócio." },
      { title: "Melhoria na comunicação com os clientes", description: "O chatbot oferece uma interface intuitiva e eficaz para que os clientes possam agendar serviços e fazer pedidos de forma fácil e rápida." },
      { title: "Aumento da satisfação do cliente", description: "Com o chatbot, os clientes podem ter acesso a informações precisas e atualizadas sobre seus serviços, melhorando a experiência geral com a empresa." },
      { title: "Flexibilidade e escalabilidade para o negócio", description: "O chatbot pode ser personalizado para atender às necessidades específicas da sua empresa, permitindo uma expansão mais eficiente e controlada." },
    ],
    faq: [
      { question: "Como funciona a implementação do chatbot na minha empresa?", answer: "A CODEXY fornece suporte completo para a instalação e personalização do chatbot para atender às necessidades da sua empresa de limpeza residencial." },
      { question: "Posso customizar o chatbot para corresponder ao meu negócio?", answer: "Sim, é possível personalizar o conteúdo e comportamento do chatbot para refletir a identidade e valores da sua empresa." },
      { question: "O chatbot pode lidar com pedidos de serviços especializados?", answer: "Sim, o chatbot pode ser configurado para atender a necessidades específicas de serviços adicionais ou especializados oferecidos pela sua empresa." },
      { question: "Quem terá acesso ao dashboard do chatbot?", answer: "Você e seus funcionários terão acesso ao painel de controle, permitindo que vocês monitorem e gerenciem o desempenho do chatbot em tempo real." },
    ],
    headline: (state) => `Chatbot para Diaristas e Limpeza Residencial ${state.in}`,
    introParagraph: (state) => `A CODEXY oferece soluções inovadoras para as empresas de limpeza residencial, como a cidade ${state.in}, que buscam melhorar a experiência do cliente e aumentar sua competitividade no mercado. Com o nosso chatbot, você pode automatizar agendamentos, pedidos e atendimento, otimizando os recursos da sua empresa e permitindo que ela cresça de forma sustentável.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para diaristas e limpeza residencial ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Diaristas e Limpeza Residencial ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Desbloqueie a eficiência em sua empresa de limpeza residencial com o chatbot da CODEXY, idealizado para atender às necessidades específicas do seu negócio ${state.seoIn}, melhorando a experiência do cliente e aumentando a competitividade. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "empresas-de-reforma",
    niche: "Empresas de Reforma",
    eyebrow: "Chatbot para Empresas de Reforma",
    heroImage: "/images/landing/empresas-de-reforma-hero.jpg",
    heroImageAlt: "Um exemplo de empresa de reforma utilizando um chatbot para agilizar a comunicação com clientes.",
    ogImage: "/images/og/empresas-de-reforma-og.jpg",
    subheadline: "Transforme a experiência do cliente e otimize o tempo dos profissionais com a ajuda de um chatbot",
    painPoints: [
      { title: "Dificuldade em gerenciar pedidos e agendamentos", description: "Clientes ligam várias vezes para verificar status ou alterar datas, sobrecarregando os funcionários." },
      { title: "Perda de oportunidades por falta de resposta imediata", description: "Pedidos importantes são esquecidos ou não recebem a atenção necessária em tempo hábil." },
      { title: "Dificuldade em manter o controle sobre a comunicação com todos os clientes", description: "Muitos canais de comunicação diferentes podem confundir e sobrecarregar os profissionais." },
    ],
    benefits: [
      { title: "Resposta imediata aos pedidos e agendamentos", description: "O cliente tem acesso rápido às informações solicitadas, evitando recontatos e perda de tempo." },
      { title: "Centralização da comunicação com os clientes", description: "Todas as interações são gerenciadas em um único canal, facilitando a gestão do tempo dos profissionais." },
      { title: "Automatização de processos rotineiros", description: "O chatbot assume tarefas recorrentes, como envio de confirmações e notificações, liberando tempo para atividades mais estratégicas." },
      { title: "Melhoria na experiência do cliente", description: "A comunicação eficiente e imediata fortalece a relação com os clientes, aumentando a satisfação e fidelidade." },
    ],
    faq: [
      { question: "Posso personalizar o chatbot para atender às necessidades específicas da minha empresa de reforma?", answer: "Sim, podemos configurar o chatbot para se adequar ao seu modelo de negócios e processos." },
      { question: "Como garantir que os clientes não se sintam substituídos pelos chatbots?", answer: "O foco é oferecer suporte e eficiência aos profissionais, facilitando a comunicação com os clientes e aumentando a satisfação geral." },
      { question: "Posso integrar o chatbot com outros sistemas de gestão da minha empresa?", answer: "Sim, nossa plataforma é flexível e pode ser integrada com várias ferramentas de software existentes." },
      { question: "Existem limites em termos de custo ou complexidade para a implementação do chatbot?", answer: "Nossa equipe avalia cada caso individualmente para oferecer soluções que atendam às necessidades específicas da sua empresa, sem comprometer a eficácia e eficiência." },
    ],
    headline: (state) => `Chatbot para Empresas de Reforma ${state.in}`,
    introParagraph: (state) => `A CODEXY entende que cada empresa tem suas próprias necessidades e desafios. Por isso, desenvolvemos chatbots personalizados para atender às demandas específicas das empresas de reforma ${state.in}, permitindo uma gestão mais eficiente dos pedidos, agendamentos e comunicação com os clientes.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para reforma ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Empresas de Reforma ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Transforme sua empresa de reforma com um chatbot personalizado, aumentando a eficiência e satisfação dos clientes ${state.seoIn}, Fale com a CODEXY.`,
  },
  {
    nicheSlug: "escolas-de-idiomas",
    niche: "Escolas de Idiomas",
    eyebrow: "Chatbot para Escolas de Idiomas",
    heroImage: "/images/landing/escolas-de-idiomas-hero.jpg",
    heroImageAlt: "Alunos aprendendo idiomas em uma escola com a ajuda de um chatbot",
    ogImage: "/images/og/escolas-de-idiomas-og.jpg",
    subheadline: "Automatize agendamentos, atendimento e pedidos de materiais didáticos",
    painPoints: [
      { title: "Perda de tempo em tarefas administrativas", description: "Escolas de idiomas perdem tempo com tarefas manuais que poderiam ser feitas automaticamente." },
      { title: "Falta de visibilidade sobre a demanda por serviços", description: "Administradores não têm uma visão clara da demanda por serviços como aulas e materiais didáticos." },
      { title: "Problemas em agendar horários para os alunos", description: "Escolas enfrentam dificuldades para agendar horários para os alunos, o que pode levar à perda de alunos potenciais." },
    ],
    benefits: [
      { title: "Redução do tempo desperdiçado em tarefas administrativas", description: "O chatbot ajuda a automatizar tarefas, liberando tempo para atividades mais importantes." },
      { title: "Melhoria na visibilidade sobre a demanda por serviços", description: "O chatbot fornece informações precisas sobre a demanda por serviços, ajudando os administradores a tomar decisões informadas." },
      { title: "Agilização no agendamento de horários para os alunos", description: "O chatbot ajuda a agendar horários de forma eficiente e fácil." },
      { title: "Melhoria na experiência do aluno", description: "O chatbot ajuda a fornecer uma experiência mais personalizada e eficaz aos alunos." },
    ],
    faq: [
      { question: "Como o chatbot funciona?", answer: "O chatbot é uma ferramenta que automatiza tarefas, como agendamento de horários e atendimento ao cliente." },
      { question: "Qual é a vantagem do uso de um chatbot em vez de um humano?", answer: "O chatbot funciona 24 horas por dia, 7 dias por semana, sem precisar de descanso ou férias." },
      { question: "Posso personalizar o chatbot para atender às necessidades específicas da minha escola?", answer: "Sim, é possível personalizar o chatbot para atender às necessidades específicas da sua escola." },
      { question: "O chatbot substitui os funcionários?", answer: "Não, o chatbot ajuda a reduzir a carga de trabalho dos funcionários, permitindo que eles se concentrem em atividades mais importantes." },
    ],
    headline: (state) => `Chatbot para Escolas de Idiomas ${state.in}`,
    introParagraph: (state) => `A CODEXY oferece um chatbot personalizado para escolas de idiomas. Com ele, é possível automatizar tarefas administrativas e melhorar a experiência do aluno ${state.in}. O chatbot fornece informações precisas sobre a demanda por serviços e ajuda a agendar horários de forma eficiente. Além disso, o chatbot pode ser personalizado para atender às necessidades específicas da sua escola.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para escolas de idiomas ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Escolas de Idiomas ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Melhore a experiência dos alunos ${state.seoIn} com o chatbot personalizado da CODEXY. Automatize tarefas e melhorie a visibilidade sobre a demanda por serviços. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "escritorios-de-advocacia",
    niche: "Escritórios de Advocacia",
    eyebrow: "Chatbot para Escritório de Advocacia",
    heroImage: "/images/landing/escritorios-de-advocacia-hero.jpg",
    heroImageAlt: "Foto de um advogado trabalhando em uma mesa com papel e caneta, com o chatbot no celular à mão.",
    ogImage: "/images/og/escritorios-de-advocacia-og.jpg",
    subheadline: "Automatize os atendimentos, agendamentos e pedidos dos clientes para focar no que é mais importante: representá-los",
    painPoints: [
      { title: "Dificuldade em atender todas as demandas", description: "Muitos clientes ligam ao mesmo tempo, ocupando todo o seu dia com perguntas e solicitações." },
      { title: "Perda de produtividade", description: "Você gasta tempo respondendo a mensagens que poderiam ser feitas pelo chatbot" },
      { title: "Dificuldade em gerenciar agendamentos", description: "Muitas vezes, os clientes não têm suas datas e horários atualizados no sistema." },
    ],
    benefits: [
      { title: "Mais tempo para focar na advocacia", description: "Com o chatbot, você pode se concentrar em representar seus clientes de forma eficaz" },
      { title: "Redução do estresse", description: "O chatbot ajuda a gerenciar as demandas dos clientes e reduzir o estresse" },
      { title: "Melhoria na produtividade", description: "Com o chatbot, você pode processar mais pedidos e atendimentos em menos tempo" },
      { title: "Agilidade nos agendamentos", description: "O chatbot garante que as datas e horários dos clientes estejam atualizados no sistema" },
    ],
    faq: [
      { question: "Como o chatbot interage com os clientes?", answer: "O chatbot é configurado para responder a perguntas frequentes e realizar tarefas específicas, como agendar reuniões ou enviar documentos." },
      { question: "Posso personalizar as respostas do chatbot?", answer: "Sim, você pode criar respostas personalizadas para atender às necessidades específicas de seu escritório de advocacia." },
      { question: "O chatbot substitui os funcionários?", answer: "Não, o chatbot é uma ferramenta que ajuda a automatizar tarefas e liberar tempo para os funcionários se concentrarem em atividades mais importantes." },
      { question: "Quais são as plataformas suportadas pelo chatbot?", answer: "O chatbot está disponível para WhatsApp, permitindo que os clientes interajam com o sistema de forma fácil e intuitiva." },
    ],
    headline: (state) => `Chatbot para Escritório de Advocacia ${state.in}`,
    introParagraph: (state) => `A CODEXY entende que a representação jurídica é um assunto delicado e requer atenção meticulosa. Por isso, desenvolvemos o chatbot para escritórios de advocacia ${state.in}, para ajudar a automatizar tarefas rotineiras e liberar tempo para os profissionais focarem na defesa dos seus clientes.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para escritório de advocacia ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Escritório de Advocacia ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Automatize os atendimentos, agendamentos e pedidos dos clientes com o chatbot da CODEXY ${state.seoIn}. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "escritorios-de-contabilidade",
    niche: "Escritórios de Contabilidade",
    eyebrow: "Chatbot para Escritório de Contabilidade",
    heroImage: "/images/landing/escritorios-de-contabilidade-hero.jpg",
    heroImageAlt: "Um escritório de contabilidade com um funcionário trabalhando no computador enquanto outro atende ao telefone",
    ogImage: "/images/og/escritorios-de-contabilidade-og.jpg",
    subheadline: "Automatize o atendimento e agendamento de serviços contábeis sem interrupção da sua rotina",
    painPoints: [
      { title: "Dificuldade em atender a múltiplos clientes", description: "Muitos escritórios de contabilidade enfrentam dificuldades em atender a todos os clientes ao mesmo tempo" },
      { title: "Perda de produtividade com agendamentos manuais", description: "Agendar serviços e reuniões pode ser um processo demorado e propenso a erros" },
      { title: "Falta de comunicação com clientes", description: "Os escritórios podem ter dificuldade em manter os clientes informados sobre o status dos seus serviços" },
    ],
    benefits: [
      { title: "Aumento da eficiência no atendimento", description: "O chatbot pode processar múltiplos pedidos ao mesmo tempo, reduzindo a carga de trabalho" },
      { title: "Redução do tempo de agendamento", description: "Os clientes podem agendar serviços online em segundos" },
      { title: "Melhoria na comunicação com os clientes", description: "O chatbot pode enviar notificações e atualizações aos clientes sobre o status dos seus serviços" },
      { title: "Flexibilidade de atendimento 24/7", description: "Os clientes podem entrar em contato com o escritório por meio do WhatsApp, mesmo fora do horário comercial" },
    ],
    faq: [
      { question: "O chatbot vai substituir os funcionários?", answer: "Não, o objetivo é automatizar tarefas repetitivas e liberar recursos para atividades mais importantes" },
      { question: "Quem cuida do chatbot?", answer: "A CODEXY fornece suporte técnico e atualizações regulares para garantir que o chatbot esteja funcionando corretamente" },
      { question: "Posso customizar o chatbot para atender às necessidades específicas do meu escritório?", answer: "Sim, a CODEXY oferece opções de personalização para se adaptar às necessidades únicas do seu negócio" },
      { question: "Como faço para implantar o chatbot no meu escritório?", answer: "Entre em contato com a CODEXY e um especialista irá orientá-lo sobre os próximos passos" },
    ],
    headline: (state) => `Chatbot para Escritório de Contabilidade ${state.in}`,
    introParagraph: (state) => `A CODEXY entende que cada escritório de contabilidade tem necessidades únicas. Nossa solução de chatbot para escritórios de contabilidade ${state.in} é projetada para automatizar o atendimento e agendamento de serviços, permitindo que você se concentre em seus clientes com mais eficiência e eficácia.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para escritório de contabilidade ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Escritório de Contabilidade ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Automatize o atendimento e agendamento de serviços contábeis ${state.seoIn}, melhorando a eficiência e aumentando a satisfação dos clientes. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "estudios-de-pilates-e-yoga",
    niche: "Estúdios de Pilates e Yoga",
    eyebrow: "Chatbot para Estúdios de Pilates e Yoga",
    heroImage: "/images/landing/estudios-de-pilates-e-yoga-hero.jpg",
    heroImageAlt: "Imagem de um estúdio de Pilates com alunos praticando em frente a uma parede de espelhos, com um tablet no canto mostrando uma tela do chatbot da CODEXY.",
    ogImage: "/images/og/estudios-de-pilates-e-yoga-og.jpg",
    subheadline: "Reduza tempo de atendimento e aumente agendamentos automático",
    painPoints: [
      { title: "Tempo de atendimento é alto", description: "Os funcionários precisam responder a muitas perguntas, deixando pouco tempo para outras tarefas." },
      { title: "Agendamentos são feitos manualmente", description: "O processo de agendar é demorado e pode ser complicado para os clientes." },
      { title: "Pedidos não são atendidos com rapidez", description: "Os pedidos dos clientes podem levar tempo para serem atendidos, o que pode afastar os clientes." },
    ],
    benefits: [
      { title: "Automatize perguntas frequentes", description: "O chatbot responde a perguntas comuns dos clientes, liberando tempo do seu time." },
      { title: "Aumente agendamentos e vendas", description: "Com o chatbot, os clientes podem agendar facilmente, aumentando as suas vendas." },
      { title: "Melhore a experiência do cliente", description: "O chatbot oferece suporte aos seus clientes 24/7, melhorando sua experiência com seu estúdio." },
      { title: "Reduza custos operacionais", description: "Com o chatbot, você pode reduzir os custos operacionais de atendimento e agendamento." },
    ],
    faq: [
      { question: "Como funciona o chatbot da CODEXY?", answer: "O chatbot é um software que interage com os clientes via WhatsApp, automatizando perguntas frequentes e agendamentos." },
      { question: "Posso personalizar o chatbot para meu estúdio?", answer: "Sim, você pode personalizar o chatbot com informações específicas do seu estúdio e serviços oferecidos." },
      { question: "Quais são as vantagens de usar o chatbot da CODEXY?", answer: "O chatbot aumenta agendamentos e vendas, melhora a experiência do cliente e reduz custos operacionais." },
      { question: "Como posso implantar o chatbot no meu estúdio?", answer: "A CODEXY oferece suporte completo para implantação do chatbot em seu estúdio, desde configuração até treinamento dos funcionários." },
    ],
    headline: (state) => `Chatbot para Estúdios de Pilates e Yoga ${state.in}`,
    introParagraph: (state) => `A CODEXY ajuda os estúdios de Pilates e Yoga a automatizar o atendimento, agendamentos e pedidos dos clientes. Com nosso chatbot personalizado, você pode oferecer suporte aos seus clientes 24/7, aumentar as vendas e reduzir custos operacionais. ${state.in}, os estúdios de Pilates e Yoga precisam de soluções inovadoras para se destacar no mercado. Nossa tecnologia é projetada para atender às necessidades específicas do seu negócio.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para pilates ${state.in} e quero saber mais sobre como implantar no meu estúdio.`,
    seoTitle: (state) => `Chatbot para Estúdios de Pilates e Yoga ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Melhore a experiência do cliente, aumente agendamentos e vendas com o chatbot da CODEXY ${state.seoIn}. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "fotografos-de-eventos",
    niche: "Fotógrafos de Eventos",
    eyebrow: "Chatbot para Fotógrafos de Eventos",
    heroImage: "/images/landing/fotografos-de-eventos-hero.jpg",
    heroImageAlt: "Um fotógrafo em ação, capturando um momento especial em um evento",
    ogImage: "/images/og/fotografos-de-eventos-og.jpg",
    subheadline: "Libere mais tempo para o que importa: tirar incríveis fotos. Automatize agendamentos e pedidos com nosso chatbot.",
    painPoints: [
      { title: "Dificuldade em gerenciar pedidos", description: "Não conseguir acompanhar as solicitações de fotos, causando atrasos e estresse." },
      { title: "Falta de tempo para agendamentos", description: "Ter que dedicar tempo valioso para marcar sessões com clientes." },
      { title: "Problemas em manter comunicação", description: "Tentar manter uma linha aberta com os clientes para confirmar detalhes, mas não conseguindo." },
    ],
    benefits: [
      { title: "Agendamentos automáticos", description: "Os clientes podem reservar sessões diretamente no WhatsApp." },
      { title: "Pedidos organizados", description: "Todas as solicitações de fotos estão em um lugar fácil de acessar e gerenciar." },
      { title: "Comunicação eficiente", description: "A CODEXY mantém o canal aberto para os clientes, garantindo que todos estejam cientes dos detalhes." },
      { title: "Tempo liberado", description: "Você pode se concentrar em tirar incríveis fotos e criar experiências inesquecíveis." },
    ],
    faq: [
      { question: "Como o chatbot vai afetar a minha relação com os clientes?", answer: "O chatbot mantém uma comunicação eficiente, garantindo que todos estejam cientes dos detalhes." },
      { question: "Posso personalizar as configurações do chatbot para atender às necessidades específicas da minha empresa?", answer: "Sim, é possível personalizar o chatbot para se adequar às suas necessidades." },
      { question: "Qual a garantia de que o chatbot não vai afastar os clientes?", answer: "O chatbot foi projetado para ser uma ferramenta útil e eficiente, não um substituto para a interação humana." },
      { question: "Posso monitorar as atividades do chatbot em tempo real?", answer: "Sim, você tem acesso às estatísticas e pode acompanhar o desempenho do chatbot." },
    ],
    headline: (state) => `Chatbot para Fotógrafos de Eventos ${state.in}`,
    introParagraph: (state) => `A CODEXY entende que os fotógrafos de eventos precisam de ferramentas eficientes para gerenciar seus negócios. Nossa solução automatiza agendamentos e pedidos, liberando mais tempo para você se concentrar em tirar incríveis fotos. Com o chatbot da CODEXY, você pode oferecer uma experiência inovadora e personalizada aos seus clientes ${state.in}.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para fotógrafos de eventos ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Fotógrafos de Eventos ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Automatize agendamentos e pedidos com o nosso chatbot. Libere tempo e ofereça uma experiência inovadora aos seus clientes ${state.seoIn}, Fale com a CODEXY.`,
  },
  {
    nicheSlug: "hamburguerias",
    niche: "Hambúrguerias",
    eyebrow: "Chatbot para Hamburguerias",
    heroImage: "/images/landing/hamburguerias-hero.jpg",
    heroImageAlt: "Funcionários atendendo ao público e utilizando um smartphone com o aplicativo do WhatsApp aberto, em uma hamburgueria lotada.",
    ogImage: "/images/og/hamburguerias-og.jpg",
    subheadline: "Automatize pedidos, agendamentos e respostas comuns de forma eficiente e escalável.",
    painPoints: [
      { title: "Dificuldade na gestão de pedidos", description: "Muitos clientes encaminham pedidos por WhatsApp, mas é difícil gerenciar a demanda sem recursos adicionais." },
      { title: "Tempo perdido em respostas comuns", description: "Funcionários gastam tempo respondendo perguntas repetidas e fornecendo informações básicas sobre produtos e horários de funcionamento." },
      { title: "Falta de agilidade no atendimento ao cliente", description: "O aumento da demanda pode fazer com que os clientes fiquem esperando por respostas ou sejam direcionados para canais mais demorados, como e-mails ou redes sociais." },
    ],
    benefits: [
      { title: "Melhoria na eficiência dos funcionários", description: "O chatbot pode realizar tarefas rotineiras, liberando o tempo dos funcionários para atividades mais importantes e valorizadas." },
      { title: "Aumento da satisfação do cliente", description: "Com respostas imediatas e informações precisas, os clientes se sentem atendidos e valorizados, aumentando a fidelidade ao negócio." },
      { title: "Redução de custos com recursos adicionais", description: "Pelo contrário, o chatbot pode ser implantado sem necessidade de investir em mais funcionários ou tecnologia adicional." },
      { title: "Escalabilidade e flexibilidade", description: "O chatbot pode adaptar-se às mudanças na demanda e nos horários de funcionamento da hamburgueria, garantindo que o atendimento ao cliente seja consistente em todos os momentos." },
    ],
    faq: [
      { question: "Como implantar um chatbot no meu negócio?", answer: "A CODEXY oferece soluções personalizadas e simplifica a implantação do chatbot para que você possa começar a melhorar sua eficiência em pouco tempo." },
      { question: "Qual é o custo de um chatbot?", answer: "O investimento no chatbot pode variar dependendo das necessidades específicas da hamburgueria, mas é geralmente uma opção mais acessível do que contratar mais funcionários ou adquirir tecnologia adicional." },
      { question: "Como posso garantir a qualidade das respostas do chatbot?", answer: "A CODEXY oferece suporte e treinamento para garantir que o chatbot esteja configurado para atender às necessidades específicas da hamburgueria e forneça respostas precisas e úteis aos clientes." },
      { question: "Pode um chatbot ser personalizado?", answer: "Sim, é possível personalizar o chatbot para que ele se adapte ao tom e ao estilo de comunicação da hamburgueria, garantindo uma experiência coesa e agradável para os clientes." },
    ],
    headline: (state) => `Chatbot para Hamburguerias ${state.in}`,
    introParagraph: (state) => `A CODEXY entende que as hamburguerias precisam de soluções inovadoras para melhorar sua eficiência e satisfação dos clientes. Por isso, criamos chatbots personalizados para automatizar tarefas rotineiras e oferecer um atendimento ao cliente mais rápido e preciso. Com nossa tecnologia, as hamburguerias podem se concentrar em o que realmente importa: servir os melhores hambúrgueres da região, com sabores e opções personalizadas para atender às necessidades locais ${state.in}.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para hamburguerias ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Hamburguerias ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Melhore sua eficiência com um chatbot personalizado da CODEXY, projetado especificamente para as necessidades das hamburguerias ${state.seoIn}, garantindo respostas rápidas e úteis aos clientes. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "imobiliarias",
    niche: "Imobiliárias",
    eyebrow: "Chatbot para Imobiliárias",
    heroImage: "/images/landing/imobiliarias-hero.jpg",
    heroImageAlt: "Imobiliária utilizando chatbot para agendamento de visitas",
    ogImage: "/images/og/imobiliarias-og.jpg",
    subheadline: "Descompromete-se e automatize seu atendimento",
    painPoints: [
      { title: "Atendimento demorado", description: "Clientes esperando por respostas que podem levar horas, prejudicando sua experiência" },
      { title: "Dificuldade em agendar visitas", description: "Processo burocrático e demorado para agendar visitas com os proprietários de imóveis" },
      { title: "Perda de produtividade", description: "Funcionários ocupados respondendo mensagens, afastando-os do que realmente importa" },
    ],
    benefits: [
      { title: "Atendimento personalizado", description: "Respostas rápidas e precisas, sem perder a humanidade" },
      { title: "Agendamento eficiente", description: "Processo simplificado para agendar visitas com os proprietários de imóveis" },
      { title: "Produtividade aumentada", description: "Funcionários livres para focar em venda e marketing do negócio" },
      { title: "Custo reduzido", description: "Menos recursos dedicados ao atendimento, economizando tempo e dinheiro" },
    ],
    faq: [
      { question: "Como funciona o chatbot?", answer: "O chatbot é um sistema de inteligência artificial que simula uma conversa com os clientes" },
      { question: "Quais são as funcionalidades do chatbot?", answer: "O chatbot pode realizar agendamento de visitas, responder perguntas frequentes e fornecer informações sobre imóveis" },
      { question: "Eu preciso ter conhecimento em tecnologia para implantar o chatbot?", answer: "Não, a CODEXY fornece suporte técnico completo para garantir que o chatbot seja implantado corretamente" },
      { question: "Posso personalizar as respostas do chatbot?", answer: "Sim, é possível personalizar as respostas do chatbot para atender às necessidades específicas da sua imobiliária" },
    ],
    headline: (state) => `Chatbot para Imobiliárias ${state.in}`,
    introParagraph: (state) => `A CODEXY oferece uma solução inovadora para as imobiliárias ${state.in}, permitindo que você se descomprometa e automatize seu atendimento. Com o nosso chatbot, você pode agendar visitas de forma eficiente e responder perguntas frequentes dos clientes de maneira rápida e precisa.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para imobiliária ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Imobiliárias ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Descompromete-se com o nosso chatbot para imobiliária ${state.seoIn}, automatize seu atendimento e aumente a produtividade. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "instaladores-de-ar-condicionado",
    niche: "Instaladores de Ar-Condicionado",
    eyebrow: "Chatbot para Instaladores de Ar-Condicionado",
    heroImage: "/images/landing/instaladores-de-ar-condicionado-hero.jpg",
    heroImageAlt: "Um instalador de ar-condicionado trabalhando no local com um smartphone ao lado.",
    ogImage: "/images/og/instaladores-de-ar-condicionado-og.jpg",
    subheadline: "Automatize agendamentos e atendimento aos clientes diretamente via WhatsApp.",
    painPoints: [
      { title: "Dificuldade em gerenciar demanda", description: "Muitos clientes procuram serviço por meio de rede social ou sites de classificados." },
      { title: "Perda de oportunidades", description: "Atendentes ocupados não conseguem atender a todos os clientes que precisam agendar serviços." },
      { title: "Custo elevado", description: "Contratar funcionários para gerenciar demanda pode ser caro e burocrático." },
    ],
    benefits: [
      { title: "Redução de custos", description: "Nenhum investimento extra necessário para implementação do chatbot." },
      { title: "Melhoria na experiência do cliente", description: "Respostas imediatas aos clientes, melhorando a satisfação com o serviço." },
      { title: "Agilidade no agendamento de serviços", description: "Clientes podem escolher horários e dias para os serviços diretamente via WhatsApp." },
      { title: "Redução do tempo de resposta", description: "Atendentes livres para atender a outras demandas, sem perda de oportunidades." },
    ],
    faq: [
      { question: "O chatbot vai substituir meus funcionários?", answer: "Não. O chatbot é uma ferramenta que auxilia no gerenciamento da demanda, liberando os funcionários para outras tarefas." },
      { question: "Eu preciso ter conhecimento em tecnologia para implantar o chatbot?", answer: "Nenhum conhecimento técnico é necessário. A CODEXY fornece suporte completo na implementação do chatbot." },
      { question: "Qual a garantia que o chatbot funciona corretamente?", answer: "A CODEXY oferece suporte contínuo para garantir o funcionamento correto do chatbot." },
      { question: "Quais são os custos associados ao uso do chatbot?", answer: "Nenhum custo adicional além do plano de assinatura da CODEXY, que inclui atualizações e suporte técnico." },
    ],
    headline: (state) => `Chatbot para Instaladores de Ar-Condicionado ${state.in}`,
    introParagraph: (state) => `A CODEXY entende as necessidades específicas dos instaladores de ar-condicionado ${state.in}, onde a eficiência e agilidade no atendimento aos clientes são fundamentais. Com o chatbot, os profissionais podem se concentrar nas suas especialidades enquanto o chatbot gerencia a demanda e agendamentos diretamente via WhatsApp.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para instaladores de ar-condicionado ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Instaladores de Ar-Condicionado ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Melhore a experiência do cliente com o chatbot da CODEXY. Automatize agendamentos e atendimento diretamente via WhatsApp ${state.seoIn}. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "lava-rapidos",
    niche: "Lavanderias Rápidas",
    eyebrow: "Chatbot para Lavanderia Rápida {{STATE_IN}}",
    heroImage: "/images/landing/lava-rapidos-hero.jpg",
    heroImageAlt: "Lavanderia rápida com clientes aguardando por seus roupões limpos, enquanto um atendente trabalha no fundo",
    ogImage: "/images/og/lava-rapidos-og.jpg",
    subheadline: "Desbloqueie mais tempo para você e seus funcionários com o chatbot da CODEXY.",
    painPoints: [
      { title: "Atendimento demorado", description: "Clientes esperando por muito tempo até serem atendidos, perdendo tempo valioso." },
      { title: "Pedidos de roupas demorados", description: "Roupas levas dias para ficarem prontas e os clientes se sentindo frustrados" },
      { title: "Perda de dinheiro por falhas no atendimento", description: "Gastos com funcionários que não estão atendendo clientes, impactando a receita da lavanderia." },
    ],
    benefits: [
      { title: "Atendimento personalizado", description: "Clientes recebem respostas rápidas e específicas às suas necessidades." },
      { title: "Agilidade nos pedidos de roupas", description: "Roupas ficam prontas em menos tempo, melhorando a experiência do cliente." },
      { title: "Aumento da eficiência", description: "Maior produtividade dos funcionários, reduzindo custos e aumentando receita." },
      { title: "Menor estresse para os funcionários", description: "Redução no estresse causado pelo atendimento demorado e falhas no sistema." },
    ],
    faq: [
      { question: "Como funciona o chatbot?", answer: "O chatbot da CODEXY é um sistema automatizado que responde às perguntas dos clientes e facilita os pedidos de roupas." },
      { question: "Será necessário contratar mais funcionários?", answer: "Não, pois o chatbot reduz a demanda por atendimento humano, tornando mais eficiente o uso dos recursos existentes." },
      { question: "Posso personalizar as respostas do chatbot?", answer: "Sim, podendo ajustar para se adequar às suas necessidades específicas e imagem da lavanderia." },
      { question: "Como posso ter certeza de que o chatbot funcionará corretamente?", answer: "A CODEXY oferece suporte técnico contínuo, garantindo a estabilidade e funcionamento do sistema." },
    ],
    headline: (state) => `Chatbot para Lavanderia Rápida ${state.in}`,
    introParagraph: (state) => `A CODEXY ajuda as lavanderias rápidas ${state.in} a melhorar a experiência dos clientes com o uso de chatbots personalizados. Com esses sistemas, os proprietários podem agilizar seus processos e oferecer atendimento mais eficiente aos clientes.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para lavanderia rápida ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Lavanderia Rápida ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Melhore a experiência dos clientes em sua lavanderia rápida com o chatbot da CODEXY ${state.seoIn}. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "marmitarias",
    niche: "Marmitárias",
    eyebrow: "Chatbot para Marmitárias",
    heroImage: "/images/landing/marmitarias-hero.jpg",
    heroImageAlt: "Uma marmitaria com funcionários atendendo ao cliente enquanto um chatbot é exibido em um smartphone",
    ogImage: "/images/og/marmitarias-og.jpg",
    subheadline: "Automatize pedidos, agendamentos e atendimento de forma eficiente",
    painPoints: [
      { title: "Dificuldade em gerenciar pedidos", description: "Marmitárias enfrentam dificuldade em gerenciar pedidos e agendamentos" },
      { title: "Falta de tempo para atender clientes", description: "Muitas vezes, as marmitárias não têm tempo suficiente para atender aos clientes" },
      { title: "Dificuldade em manter a organização", description: "A gestão de pedidos e agendamentos pode ser caótica e difícil de gerenciar" },
    ],
    benefits: [
      { title: "Melhoria na eficiência", description: "O chatbot ajuda a automatizar processos, tornando a gestão mais eficiente" },
      { title: "Redução no tempo de atendimento", description: "Os clientes podem ser atendidos rapidamente, sem fila ou espera" },
      { title: "Melhoria na organização", description: "O chatbot ajuda a manter a organização e gerenciar pedidos e agendamentos com facilidade" },
      { title: "Aumento de satisfação dos clientes", description: "Os clientes estão mais satisfeitos com o atendimento rápido e eficiente" },
    ],
    faq: [
      { question: "Como funciona o chatbot?", answer: "O chatbot é um sistema automatizado que responde às perguntas dos clientes e ajuda a gerenciar pedidos e agendamentos" },
      { question: "Preciso ter conhecimento de tecnologia para implantar?", answer: "Não, não é necessário conhecimento de tecnologia para implantar o chatbot" },
      { question: "Posso personalizar o chatbot para atender às necessidades da minha marmitaria?", answer: "Sim, o chatbot pode ser personalizado para atender às necessidades específicas da sua marmitária" },
      { question: "Qual é a garantia de sucesso do chatbot?", answer: "Não garantimos resultado específico, mas o chatbot automatiza tarefas repetitivas de atendimento e pedido, liberando tempo pra você focar no preparo das marmitas." },
    ],
    headline: (state) => `Chatbot para Marmitárias ${state.in}`,
    introParagraph: (state) => `A CODEXY oferece uma solução inovadora para as marmitárias do estado ${state.in}, permitindo que elas gerenciem pedidos e agendamentos de forma mais eficiente. Com o chatbot, os clientes podem ser atendidos rapidamente e a gestão da marmitaria fica mais organizada.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para marmitárias ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Marmitárias ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Melhore a gestão da sua marmitaria com o chatbot da CODEXY, uma solução inovadora para automação de pedidos e agendamentos ${state.seoIn}. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "oficinas-mecanicas",
    niche: "Oficinas Mecânicas",
    eyebrow: "Chatbot para Oficinas Mecânicas",
    heroImage: "/images/landing/oficinas-mecanicas-hero.jpg",
    heroImageAlt: "Um técnico trabalhando em uma oficina mecânica, com um celular ao lado",
    ogImage: "/images/og/oficinas-mecanicas-og.jpg",
    subheadline: "Automatize agendamentos e atendimento de clientes com o nosso chatbot",
    painPoints: [
      { title: "Dificuldade em gerenciar tempo", description: "Muitas solicitações de serviço e consultas ao mesmo tempo" },
      { title: "Perda de oportunidades", description: "Clientes não conseguem agendar serviços na data desejada" },
      { title: "Custo elevado", description: "Desenvolver um sistema de atendimento personalizado é caro" },
    ],
    benefits: [
      { title: "Agilidade no atendimento", description: "Automatize consultas e agendamentos" },
      { title: "Melhoria na experiência do cliente", description: "Respostas rápidas e personalizadas" },
      { title: "Redução de custos", description: "Não precisa desenvolver um sistema próprio" },
      { title: "Flexibilidade", description: "Gerencie fluxo de trabalho e tempo de forma mais eficiente" },
    ],
    faq: [
      { question: "Como o chatbot vai ajudar a agendar serviços?", answer: "O chatbot automatiza consultas e agendamentos, liberando tempo para focar no serviço" },
      { question: "Vai ser caro?", answer: "Não! Nossa solução é mais acessível do que desenvolver um sistema próprio" },
      { question: "Como vou saber se o chatbot está funcionando corretamente?", answer: "Você receberá relatórios e análises de desempenho para monitorar a eficiência" },
      { question: "Vai substituir os técnicos?", answer: "Não! O chatbot auxilia na comunicação e agendamento, liberando tempo para os profissionais focarem no serviço" },
    ],
    headline: (state) => `Chatbot para Oficinas Mecânicas ${state.in}`,
    introParagraph: (state) => `A CODEXY entende que as oficinas mecânicas têm necessidades específicas de atendimento e agendamento. Com o nosso chatbot, você pode automatizar consultas e agendamentos, liberando tempo para focar no serviço. Isso significa menos estresse e mais eficiência na gestão do seu negócio. ${state.in}, as oficinas mecânicas enfrentam desafios semelhantes de gerenciar tempo e atendimento.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para oficinas mecânicas ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Oficinas Mecânicas ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Automatize consultas e agendamentos em sua oficina mecânica com o nosso chatbot. ${state.seoIn}, confira como a CODEXY pode ajudar no seu negócio, Fale com a CODEXY.`,
  },
  {
    nicheSlug: "petshops",
    niche: "Petshops",
    eyebrow: "Chatbot para Petshops",
    heroImage: "/images/landing/petshops-hero.jpg",
    heroImageAlt: "Um petshop feliz com clientes satisfeitos usando um chatbot",
    ogImage: "/images/og/petshops-og.jpg",
    subheadline: "Automatize o atendimento e agendamento de banhos, cortes e consultas para os seus clientes",
    painPoints: [
      { title: "Dificuldade em atender ao aumento da demanda", description: "Muitos petshops enfrentam dificuldade em atender a todos os clientes que buscam serviços como banho e corte de pelo, além de consultas com veterinários." },
      { title: "Perda de tempo nas ligações telefônicas", description: "Os funcionários dos petshops precisam dedicar muito tempo para atender às ligações telefônicas e agendar serviços." },
      { title: "Falta de organização no agendamento de serviços", description: "Muitas vezes, os petshops não têm uma forma eficiente de organizar o agendamento de serviços como banhos, cortes e consultas." },
    ],
    benefits: [
      { title: "Melhoria na experiência do cliente", description: "O chatbot ajuda a melhorar a experiência do cliente ao fornecer informações precisas e atender às suas necessidades rapidamente." },
      { title: "Redução no tempo de espera dos clientes", description: "Com o chatbot, os clientes não precisam mais esperar por telefone ou pessoalmente para agendar serviços." },
      { title: "Aumento na eficiência operacional", description: "O chatbot automatiza tarefas rotineiras, liberando tempo dos funcionários para atividades mais importantes." },
      { title: "Ganho de visibilidade online", description: "O chatbot ajuda a melhorar a presença online do petshop, aumentando sua visibilidade e atraindo mais clientes." },
    ],
    faq: [
      { question: "Como funciona o chatbot?", answer: "O chatbot é um sistema automatizado que atende às perguntas e solicitações dos clientes por meio de mensagens no WhatsApp." },
      { question: "Posso personalizar o chatbot para atender às necessidades do meu petshop?", answer: "Sim, a CODEXY oferece opção de personalização do chatbot para que ele se adapte às necessidades e características específicas do seu negócio." },
      { question: "O chatbot pode ser integrado com outros sistemas de gerenciamento do meu petshop?", answer: "Sim, o chatbot pode ser integrado com outros sistemas de gerenciamento para garantir uma experiência de usuário completa e eficiente." },
      { question: "Posso acessar estatísticas e dados sobre o desempenho do chatbot?", answer: "Sim, a CODEXY fornece ferramentas para que você possa monitorar o desempenho do chatbot e entender melhor como ele está ajudando seu negócio." },
    ],
    headline: (state) => `Chatbot para Petshops ${state.in}`,
    introParagraph: (state) => `A CODEXY ajuda petshops como o seu a oferecer uma experiência de atendimento mais eficiente e personalizada. Com nosso chatbot, você pode automatizar agendamentos, fornecer informações precisas aos clientes e aumentar a visibilidade online do seu negócio. Aproveite os benefícios de ter um chatbot personalizado para o seu petshop ${state.in}.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para petshops ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Petshops ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Melhore sua experiência de atendimento com o chatbot da CODEXY ${state.seoIn}, aumente a eficiência e a visibilidade online do seu petshop. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "pizzarias",
    niche: "Pizzárias",
    eyebrow: "Chatbot para Pizzárias",
    heroImage: "/images/landing/pizzarias-hero.jpg",
    heroImageAlt: "Pizzaria com chatbot atendendo a clientes via WhatsApp",
    ogImage: "/images/og/pizzarias-og.jpg",
    subheadline: "Automatize pedidos, agendamentos e atendimento em sua pizzaria",
    painPoints: [
      { title: "Dificuldade de atender ao cliente enquanto prepara pizzas", description: "Você não tem tempo para responder todas as mensagens de WhatsApp" },
      { title: "Perda de pedidos por falta de comunicação eficaz", description: "Os clientes ficam desanimados com a demora na resposta" },
      { title: "Dificuldade em gerenciar agendamentos e previsões de entrega", description: "Você não tem um sistema para organizar os pedidos e entregas" },
    ],
    benefits: [
      { title: "Redução do tempo gasto com atendimento ao cliente", description: "O chatbot ajuda a responder perguntas frequentes e agendar pedidos" },
      { title: "Aumento da eficiência no gerenciamento de pedidos e entregas", description: "O chatbot automatiza o processo, reduzindo erros e atrasos" },
      { title: "Melhoria na experiência do cliente", description: "Os clientes recebem respostas rápidas e personalizadas" },
      { title: "Redução dos custos com mão de obra", description: "O chatbot ajuda a reduzir a necessidade de contratar mais funcionários para atendimento" },
    ],
    faq: [
      { question: "Como o chatbot funciona?", answer: "O chatbot é configurado para responder perguntas frequentes e agendar pedidos automaticamente" },
      { question: "Quais são as vantagens do uso de um chatbot em minha pizzaria?", answer: "O chatbot ajuda a reduzir o tempo gasto com atendimento, aumentar a eficiência no gerenciamento de pedidos e melhorar a experiência do cliente" },
      { question: "Posso personalizar o conteúdo do chatbot?", answer: "Sim, é possível personalizar o conteúdo do chatbot para se adequar às necessidades específicas da sua pizzaria" },
      { question: "Qual é o custo de implantação de um chatbot em minha pizzaria?", answer: "O custo é acessível e pode ser discutido com os especialistas da CODEXY" },
    ],
    headline: (state) => `Chatbot para Pizzárias ${state.in}`,
    introParagraph: (state) => `A CODEXY oferece soluções de chatbot personalizadas para pizzarias como a sua, ${state.in}. Com o nosso chatbot, você pode automatizar pedidos e agendamentos, reduzir o tempo gasto com atendimento e melhorar a experiência do cliente. Além disso, podemos ajudar a aumentar a eficiência no gerenciamento de pedidos e entregas, reduzindo erros e atrasos. Contamos com a expertise para implantar um chatbot na sua pizzaria ${state.in}.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para pizzárias ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Pizzárias ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Melhore sua experiência de cliente com um chatbot personalizado em sua pizzaria ${state.seoIn}, Fale com a CODEXY.`,
  },
  {
    nicheSlug: "pousadas",
    niche: "Pousadas",
    eyebrow: "Chatbot para Pousadas",
    heroImage: "/images/landing/pousadas-hero.jpg",
    heroImageAlt: "Atendentes de pousada utilizando um chatbot em computadores",
    ogImage: "/images/og/pousadas-og.jpg",
    subheadline: "Automatize pedidos, agendamentos e atendimento com um chatbot de WhatsApp específico para suas necessidades de gestão de hospedagem.",
    painPoints: [
      { title: "Dificuldade no gerenciamento do fluxo de clientes", description: "Muitas vezes as pousadas enfrentam dificuldades em atender às demandas dos hóspedes em tempo real." },
      { title: "Perda de oportunidades de venda", description: "Os clientes podem se sentir abandonados e não ter a opção de fazer pedidos ou reservas online." },
      { title: "Falta de eficiência no atendimento", description: "O pessoal da recepção pode ficar sobrecarregado, levando a demoras nos serviços e perda de faturamento." },
    ],
    benefits: [
      { title: "Redução do tempo de resposta aos clientes", description: "Os hóspedes recebem respostas imediatas às suas perguntas ou solicitações, melhorando a satisfação e aumentando as chances de retorno." },
      { title: "Aumento da eficiência no atendimento", description: "Com o chatbot lidando com pedidos e reservas, os funcionários podem se concentrar em serviços mais valorizados, como a experiência dos hóspedes." },
      { title: "Melhoria na gestão de fluxo de clientes", description: "O chatbot ajuda a equilibrar o fluxo de entrada e saída de clientes, evitando congestionamentos ou perda de oportunidades." },
      { title: "Redução dos custos com mão de obra", description: "Com menos necessidade de funcionários para atender aos hóspedes, as pousadas podem reduzir seus custos operacionais." },
    ],
    faq: [
      { question: "Como o chatbot vai ajudar a meus funcionários?", answer: "O chatbot distribui a demanda de forma eficiente, permitindo que os funcionários se concentrem em serviços mais importantes e valorizados." },
      { question: "Eu preciso ter conhecimento técnico para gerenciar o chatbot?", answer: "Não, você não precisa ter conhecimento técnico. A CODEXY fornece suporte completo para a implementação e manutenção do seu chatbot." },
      { question: "O chatbot substitui os funcionários da recepção?", answer: "Não, o chatbot é uma ferramenta que ajuda a melhorar a eficiência dos atendimentos. Ele não substitui os funcionários da recepção." },
      { question: "Como posso garantir a segurança dos dados de meus clientes?", answer: "A CODEXY utiliza práticas de segurança rigorosas para proteger os dados dos hóspedes, conforme as melhores práticas de mercado e as leis locais aplicáveis." },
    ],
    headline: (state) => `Chatbot para Pousadas ${state.in}`,
    introParagraph: (state) => `A CODEXY ajuda pousadas ${state.in} a automatizar o atendimento aos hóspedes, melhorar a eficiência e aumentar a satisfação dos clientes. Com um chatbot personalizado, você pode oferecer uma experiência de hospedagem mais inovadora e competitiva no mercado local.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para pousadas ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Pousadas ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Melhore a experiência de hospedagem com um chatbot personalizado, desenvolvido especialmente para pousadas ${state.seoIn}. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "restaurantes",
    niche: "Restaurantes",
    eyebrow: "Chatbot para Restaurantes",
    heroImage: "/images/landing/restaurantes-hero.jpg",
    heroImageAlt: "Funcionários de restaurante digitando no aplicativo do WhatsApp",
    ogImage: "/images/og/restaurantes-og.jpg",
    subheadline: "Automatize agendamentos, pedidos e atendimento de forma eficiente",
    painPoints: [
      { title: "Dificuldade em gerenciar fluxo de clientes", description: "É complicado lidar com uma grande quantidade de pedidos e solicitações ao mesmo tempo." },
      { title: "Perda de oportunidades comerciais", description: "Clientes podem se sentir ignorados ou não atendidos, o que pode levar a perda de negócios." },
      { title: "Custo alto em manter funcionários", description: "Manter uma equipe grande para lidar com os clientes pode ser caro e desgastante" },
    ],
    benefits: [
      { title: "Melhoria no atendimento ao cliente", description: "O chatbot oferece uma experiência de usuário personalizada e eficiente." },
      { title: "Redução do tempo de resposta", description: "Os clientes recebem respostas rápidas, o que melhora a satisfação com a marca." },
      { title: "Aumento na produtividade dos funcionários", description: "O chatbot alivia a carga de trabalho dos funcionários, permitindo que eles se concentrem em outras tarefas importantes." },
      { title: "Melhoria no gerenciamento do fluxo de clientes", description: "O chatbot ajuda a organizar e priorizar as solicitações e pedidos." },
    ],
    faq: [
      { question: "Como funciona o chatbot?", answer: "O chatbot é um sistema automatizado que responde às perguntas e solicitações dos clientes via WhatsApp." },
      { question: "Posso personalizar o chatbot para atender às necessidades específicas do meu restaurante?", answer: "Sim, é possível personalizar o chatbot para atender às necessidades específicas do seu restaurante." },
      { question: "O que acontece se um cliente precisar de uma resposta mais complexa?", answer: "Se um cliente precisar de uma resposta mais complexa, o chatbot pode ser configurado para redirecioná-lo para um funcionário humano." },
      { question: "Posso monitorar as interações do chatbot com meus clientes?", answer: "Sim, é possível monitorar as interações do chatbot com os seus clientes e receber relatórios sobre o desempenho do chatbot." },
    ],
    headline: (state) => `Chatbot para Restaurantes ${state.in}`,
    introParagraph: (state) => `A CODEXY oferece uma solução inovadora para os restaurantes ${state.in}, permitindo que eles sejam mais eficientes e atendam melhor aos seus clientes. Com o nosso chatbot, você pode automatizar agendamentos, pedidos e atendimento de forma rápida e eficaz, reduzindo o tempo de resposta e aumentando a satisfação dos seus clientes.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para restaurantes ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Restaurantes ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Automatize agendamentos, pedidos e atendimento de forma eficiente com o nosso chatbot para restaurantes ${state.seoIn}, Fale com a CODEXY.`,
  },
  {
    nicheSlug: "saloes-de-beleza",
    niche: "Salões de Beleza",
    eyebrow: "Chatbot para Salões de Beleza",
    heroImage: "/images/landing/saloes-de-beleza-hero.jpg",
    heroImageAlt: "Profissionais de beleza atendendo a clientes enquanto usam um chatbot no WhatsApp",
    ogImage: "/images/og/saloes-de-beleza-og.jpg",
    subheadline: "Automatize o atendimento e aumente a produtividade dos seus funcionários",
    painPoints: [
      { title: "Dificuldade em atender ao grande volume de solicitações", description: "Muitos clientes solicitam agendamentos e pedidos ao mesmo tempo, sobrecarregando os profissionais do salão." },
      { title: "Perda de oportunidades comerciais", description: "Clientes que não recebem atendimento rápido podem buscar serviços concorrentes." },
      { title: "Dificuldade em manter a organização e gerenciar o tempo", description: "Profissionais precisam lidar com agendamentos, pedidos e comunicação com os clientes manualmente, o que pode ser confuso e demorado." },
    ],
    benefits: [
      { title: "Aumente a produtividade dos funcionários", description: "O chatbot automatiza tarefas rotineiras, liberando tempo para serviços mais valorizados." },
      { title: "Melhore a experiência do cliente", description: "Respostas rápidas e personalizadas garantem satisfação com os serviços oferecidos pelo salão." },
      { title: "Reduza custos operacionais", description: "A automação de tarefas reduz a necessidade de investir em recursos humanos para execução de tarefas rotineiras." },
      { title: "Obtenha insights valiosos sobre o negócio", description: "O chatbot pode fornecer dados sobre as preferências dos clientes, ajudando na tomada de decisões estratégicas do salão." },
    ],
    faq: [
      { question: "Como funciona a integração com WhatsApp?", answer: "A CODEXY fornece uma solução fácil e rápida para integrar o chatbot ao aplicativo de mensagens do WhatsApp, garantindo que os clientes possam entrar em contato de forma fácil e intuitiva." },
      { question: "Posso personalizar a experiência do cliente com meu próprio layout?", answer: "Sim, é possível. A CODEXY oferece opções para personalização da interface do chatbot, garantindo que ele se alinhe às necessidades específicas do seu negócio e da sua marca." },
      { question: "Existe suporte técnico disponível?", answer: "Sim, a CODEXY fornece apoio especializado para garantir que o seu chatbot esteja funcionando corretamente e atendendo às necessidades do seu negócio." },
      { question: "Posso acompanhar as interações do cliente com o chatbot?", answer: "Sim, a CODEXY oferece ferramentas de monitoramento para que você possa rastrear as conversas e entender melhor os comportamentos dos seus clientes." },
    ],
    headline: (state) => `Chatbot para Salões de Beleza ${state.in}`,
    introParagraph: (state) => `A CODEXY entende a complexidade do negócio de salão de beleza. Com um chatbot personalizado, pode oferecer experiência de atendimento inovadora e aumentar a satisfação dos seus clientes ${state.in}. Automatizar tarefas rotineiras permite que os profissionais se concentrem nas áreas que realmente importam: oferecer serviços de alta qualidade e criar relacionamentos fortes com os clientes.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para salões de beleza ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Salões de Beleza ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Automatize o agendamento do seu salão ${state.seoIn}, com a ajuda da CODEXY. Automatize, melhore e cresça sua presença no mercado. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "chaveiros-24-horas",
    niche: "Chaveiros 24 Horas",
    eyebrow: "Chatbot para Chaveiro",
    heroImage: "/images/landing/chaveiros-24-horas-hero.jpg",
    heroImageAlt: "Um chaveiro trabalhando com um chatbot no WhatsApp",
    ogImage: "/images/og/chaveiros-24-horas-og.jpg",
    subheadline: "Atendimento rápido e eficiente, sem interrupção do trabalho",
    painPoints: [
      { title: "Chamadas constantes", description: "Cliente liga várias vezes perguntando sobre o status da chave ou precisando de ajuda extra." },
      { title: "Tempo perdido com atendimento", description: "Você gasta tempo respondendo a cada chamada, afastando-se do trabalho importante." },
      { title: "Falta de atualização ao cliente", description: "Cliente não recebe informações sobre o status da chave ou precisam aguardar demorado para receber resposta." },
      { title: "Dificuldade em marcar horários", description: "Clientes ligando e marcando horário sem garantia de que estará disponível, afastando-se do trabalho importante" },
    ],
    benefits: [
      { title: "Respostas rápidas no WhatsApp", description: "Cliente recebe atualização imediata sobre o status da chave." },
      { title: "Tempo economizado com atendimento", description: "Você ganha tempo para se concentrar na tarefa importante de abrir chaves." },
      { title: "Atendimento personalizado e eficiente", description: "Cliente recebe informações precisas e atualizadas sobre o status da chave." },
      { title: "Agendamento fácil e rápido", description: "Clientes marcam horário com facilidade e confiança, sem demora ou interrupção do trabalho importante" },
      { title: "Melhoria na experiência do cliente", description: "Cliente satisfeito com o atendimento eficiente e responsivo." },
    ],
    faq: [
      { question: "Como funciona?", answer: "O chatbot é implantado diretamente no WhatsApp da sua chaveira, proporcionando respostas rápidas e atualizadas para os clientes." },
      { question: "Qual é o custo?", answer: "Contate a CODEXY para saber mais sobre o preço e como implementar um chatbot personalizado para sua chaveira" },
      { question: "Como agilizar o atendimento?", answer: "Com o chatbot, você economiza tempo respondendo perguntas comuns e pode se concentrar em abrir chaves." },
      { question: "Posso customizar?", answer: "Sim, a CODEXY oferece personalização para que o chatbot seja adaptado às necessidades específicas da sua chaveira" },
      { question: "Como implantei?", answer: "A CODEXY fornece suporte completo durante todo o processo de implementação e treinamento do chatbot." },
    ],
    headline: (state) => `Chatbot para Chaveiro ${state.in}`,
    introParagraph: (state) => `A CODEXY implantou um sistema eficiente de chatbot para a chaveira ${state.in}, permitindo que os clientes recebam respostas rápidas e atualizadas sobre o status da chave, mantendo-os informados sem interrupção do trabalho importante.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para Chaveiro ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Chaveiro ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Implante um sistema eficiente de atendimento com chatbot para a sua chaveira ${state.seoIn}, Fale com a CODEXY.`,
  },
  {
    nicheSlug: "escritorios-de-arquitetura",
    niche: "Escritórios de Arquitetura",
    eyebrow: "Chatbot para Escritório de Arquitetura",
    heroImage: "/images/landing/escritorios-de-arquitetura-hero.jpg",
    heroImageAlt: "Arquiteto trabalhando no projeto com auxílio do chatbot",
    ogImage: "/images/og/escritorios-de-arquitetura-og.jpg",
    subheadline: "Agilize a comunicação com clientes e aumente a produtividade da sua equipe",
    painPoints: [
      { title: "Orçamento demorado", description: "Cliente pede orçamento por telefone e espera até o fim do dia pra receber resposta, e muitas vezes já fechou com outra arquitetura." },
      { title: "Projetos atrasados sem atualização", description: "Cliente liga várias vezes perguntando status do projeto porque não recebe atualização automática." },
      { title: "Equipe sobrecarregada de tarefas administrativas", description: "Mesma pessoa que trabalha no projeto também tenta responder WhatsApp o dia todo." },
      { title: "Dificuldade em gerenciar múltiplos projetos ao mesmo tempo", description: "Sem sistema, é fácil perder o prazo combinado de entrega do projeto." },
    ],
    benefits: [
      { title: "Orçamento respondido na hora", description: "Cliente manda foto do local e recebe retorno inicial rápido, sem esperar até o fim do dia." },
      { title: "Atualização automática de status dos projetos", description: "Cliente acompanha andamento do projeto sem precisar ligar pra saber." },
      { title: "Agendamento de reuniões organizado", description: "Chatbot confirma data da reunião e evita esquecimento." },
      { title: "Menos ligação repetitiva", description: "Perguntas de status saem do telefone e vão pro chatbot." },
      { title: "Mesmo número que já usa", description: "Não precisa trocar de WhatsApp nem pedir pro cliente salvar novo contato." },
    ],
    faq: [
      { question: "O chatbot interfere na criação de projetos?", answer: "Não, o chatbot é apenas uma ferramenta para agilizar a comunicação e gerenciar tarefas administrativas." },
      { question: "Como posso implantar o chatbot em meu escritório?", answer: "A CODEXY fornece suporte completo para a implementação do chatbot, incluindo configuração e treinamento." },
      { question: "O que é necessário para usar o chatbot?", answer: "Só precisamos de um número de WhatsApp ativo e uma conexão com internet." },
      { question: "Posso personalizar o chatbot para atender às necessidades específicas do meu escritório?", answer: "Sim, a CODEXY oferece opção de personalização para garantir que o chatbot se adeque às suas necessidades." },
      { question: "Como posso medir o retorno sobre o investimento (ROE) do uso do chatbot?", answer: "A CODEXY fornece relatórios detalhados sobre a utilização e eficiência do chatbot, ajudando-o a avaliar seu ROE." },
    ],
    headline: (state) => `Chatbot para Escritório de Arquitetura ${state.in}`,
    introParagraph: (state) => `A CODEXY implanta chatbot para escritórios de arquitetura ${state.in}, agilizando a comunicação com clientes e aumentando a produtividade da equipe. Com o chatbot, você pode responder orçamentos rapidamente, atualizar status dos projetos e gerenciar tarefas administrativas com eficiência.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para escritório de arquitetura ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Escritório de Arquitetura ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Melhore a comunicação com clientes e aumente a produtividade da sua equipe com o chatbot para escritório de arquitetura ${state.seoIn}. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "jardinagem-e-paisagismo",
    niche: "Jardinagem e Paisagismo",
    eyebrow: "Chatbot para Jardinagem e Paisagismo",
    heroImage: "/images/landing/jardinagem-e-paisagismo-hero.jpg",
    heroImageAlt: "Profissionais de jardinagem e paisagismo trabalhando com chatbot",
    ogImage: "/images/og/jardinagem-e-paisagismo-og.jpg",
    subheadline: "A CODEXY ajuda a automatizar o atendimento de clientes, agilizando orçamentos e manutenção",
    painPoints: [
      { title: "Orçamento demorado", description: "Cliente pede orçamento por telefone e espera até o fim do dia pra receber resposta, e muitas vezes já fechou com outro profissional." },
      { title: "Cliente sem notícia do andamento do serviço", description: "Cliente liga várias vezes perguntando quando o jardim fica pronto porque não recebe atualização automática." },
      { title: "Agenda de entrega sem controle", description: "Sem sistema, é fácil perder o prazo combinado de entrega do material necessário." },
      { title: "Equipe sobrecarregada", description: "Mesma pessoa que atende o cliente na loja também tenta responder WhatsApp o dia todo." },
    ],
    benefits: [
      { title: "Orçamento respondido na hora", description: "Cliente manda foto do local e recebe retorno inicial rápido, sem esperar até o fim do dia." },
      { title: "Atualização automática de status", description: "Cliente acompanha andamento da manutenção sem precisar ligar pra saber." },
      { title: "Agendamento de entrega organizado", description: "Chatbot confirma data de retirada do material e evita esquecimento." },
      { title: "Menos ligação repetitiva", description: "Perguntas de status saem do telefone e vão pro chatbot." },
      { title: "Mesmo número que já usa", description: "Não precisa trocar de WhatsApp nem pedir pro cliente salvar novo contato." },
    ],
    faq: [
      { question: "Como funciona o chatbot?", answer: "O chatbot é uma ferramenta automatizada que responde perguntas e realiza tarefas específicas." },
      { question: "Posso personalizar o chatbot para meu negócio?", answer: "Sim, a CODEXY oferece opções de personalização para atender às necessidades específicas do seu negócio." },
      { question: "O chatbot é seguro e privado?", answer: "Sim, o chatbot é desenvolvido com segurança e privacidade em mente, garantindo que os dados dos clientes sejam protegidos." },
      { question: "Posso cancelar o serviço de chatbot a qualquer momento?", answer: "Sim, você pode cancelar o serviço a qualquer momento, sem penalidades ou custos adicionais." },
      { question: "Como posso contatar a CODEXY para mais informações?", answer: "Você pode entrar em contato conosco pelo WhatsApp ou e-mail para mais informações sobre o chatbot e como implantá-lo no seu negócio." },
    ],
    headline: (state) => `Chatbot para Jardinagem e Paisagismo ${state.in}`,
    introParagraph: (state) => `A CODEXY implanta chatbot para jardinagem e paisagismo ${state.in} direto no WhatsApp que a loja já usa, agilizando o primeiro retorno de orçamento e mantendo o cliente atualizado sobre o andamento da manutenção sem precisar ligar.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para jardinagem e paisagismo ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Jardinagem e Paisagismo ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Automatize orçamentos e atualizações de serviço da sua empresa de jardinagem e paisagismo ${state.seoIn}. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "reforco-escolar",
    niche: "Reforço Escolar",
    eyebrow: "Chatbot para Reforço Escolar",
    heroImage: "/images/landing/reforco-escolar-hero.jpg",
    heroImageAlt: "Professor conversando com aluno no escritório de um colégio",
    ogImage: "/images/og/reforco-escolar-og.jpg",
    subheadline: "Resolva problemas de comunicação e agilidade em seu negócio de reforço escolar",
    painPoints: [
      { title: "Orçamento demorado", description: "O cliente pede orçamento por telefone e espera até o fim do dia pra receber resposta, e muitas vezes já fechou com outro profissional." },
      { title: "Aulas canceladas sem atualização", description: "O cliente liga várias vezes perguntando status da aula porque não recebe atualização automática." },
      { title: "Equipe sobrecarregada de comunicação", description: "A mesma pessoa que atende o cliente também tenta responder WhatsApp o dia todo." },
      { title: "Agenda sem controle de compromissos", description: "Sem sistema, é fácil perder o prazo combinado de entrega do material de estudo." },
    ],
    benefits: [
      { title: "Orçamento respondido na hora", description: "O cliente manda foto do material e recebe retorno inicial rápido, sem esperar até o fim do dia." },
      { title: "Atualização automática de status", description: "O cliente acompanha andamento da aula sem precisar ligar pra saber." },
      { title: "Agendamento de compromissos organizado", description: "Chatbot confirma data e hora da aula e evita esquecimento." },
      { title: "Menos ligação repetitiva", description: "Perguntas de status saem do telefone e vão pro chatbot." },
      { title: "Mesmo número que já usa", description: "Não precisa trocar de WhatsApp nem pedir ao cliente salvar novo contato." },
    ],
    faq: [
      { question: "Qual é o benefício de usar um chatbot em meu negócio?", answer: "Um chatbot automatiza tarefas e agiliza comunicação com os clientes, permitindo que você se concentre em oferecer serviços de qualidade." },
      { question: "Como funciona a implantação do chatbot?", answer: "A CODEXY trabalha em conjunto com seu negócio para implantar o chatbot, garantindo uma integração perfeita e personalizada." },
      { question: "Posso alterar as configurações do chatbot após a implantação?", answer: "Sim, você pode alterar as configurações do chatbot a qualquer momento, sem necessidade de intervenção da CODEXY." },
      { question: "O chatbot é compatível com diferentes plataformas de WhatsApp?", answer: "Sim, o chatbot é compatível com diferentes plataformas de WhatsApp, garantindo que seus clientes possam se comunicar de forma eficaz." },
      { question: "Qual é a experiência da CODEXY em implantar chatbots em negócios semelhantes ao meu?", answer: "A CODEXY tem anos de experiência em implantar chatbots em negócios de diferentes setores, garantindo que você tenha o melhor suporte e resultado possível." },
    ],
    headline: (state) => `Chatbot para Reforço Escolar ${state.in}`,
    introParagraph: (state) => `A CODEXY implanta chatbot para reforço escolar ${state.in}, agilizando a comunicação com os clientes e melhorando a experiência geral.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para reforço escolar ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Reforço Escolar ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Melhore a comunicação com seus clientes e agilie sua rotina de reforço escolar com o chatbot da CODEXY ${state.seoIn}, Fale com a CODEXY.`,
  },
  {
    nicheSlug: "funilarias",
    niche: "Funilarias",
    eyebrow: "Chatbot para Funilarias",
    heroImage: "/images/landing/funilarias-hero.jpg",
    heroImageAlt: "Atendente de funilaria mostrando orçamento no celular pro cliente",
    ogImage: "/images/og/funilarias-og.jpg",
    subheadline: "Orçamento rápido e atualização automática do reparo pelo WhatsApp — cliente informado, balcão livre.",
    painPoints: [
      { title: "Orçamento demorado", description: "Cliente pede orçamento por telefone e espera até o fim do dia pra receber resposta, e muitas vezes já fechou com outra oficina." },
      { title: "Carro parado sem atualização", description: "Cliente liga várias vezes perguntando status do reparo porque não recebe atualização automática." },
      { title: "Agenda de entrega sem controle", description: "Sem sistema, é fácil perder o prazo combinado de entrega do veículo." },
      { title: "Equipe do balcão sobrecarregada", description: "Mesma pessoa que atende o cliente na oficina também tenta responder WhatsApp o dia todo." },
    ],
    benefits: [
      { title: "Orçamento respondido na hora", description: "Cliente manda foto do dano e recebe retorno inicial rápido, sem esperar até o fim do dia." },
      { title: "Atualização automática de status", description: "Cliente acompanha andamento do reparo sem precisar ligar pra saber." },
      { title: "Agendamento de entrega organizado", description: "Chatbot confirma data de retirada do veículo e evita esquecimento." },
      { title: "Menos ligação repetitiva", description: "Perguntas de status saem do telefone e vão pro chatbot." },
      { title: "Mesmo número que já usa", description: "Não precisa trocar de WhatsApp nem pedir pro cliente salvar novo contato." },
    ],
    faq: [
      { question: "O chatbot faz orçamento sozinho?", answer: "Ele coleta as informações iniciais (foto, descrição do problema) e agiliza o primeiro retorno; o valor final ainda depende de avaliação da oficina." },
      { question: "Como funciona a atualização de status?", answer: "A oficina atualiza a etapa do reparo e o cliente recebe aviso automático pelo WhatsApp." },
      { question: "O chatbot substitui o atendente do balcão?", answer: "Não. Ele cuida das perguntas repetitivas de status e orçamento inicial; o atendente foca em quem está na oficina." },
      { question: "Funciona pra funilaria com vários carros ao mesmo tempo?", answer: "Sim, dá pra acompanhar o status de vários veículos em paralelo." },
      { question: "Quanto tempo leva pra implantar?", answer: "A CODEXY configura o chatbot em cima do número que a funilaria já usa, sem demora." },
    ],
    headline: (state) => `Chatbot para Funilarias ${state.in}`,
    introParagraph: (state) => `A CODEXY implanta chatbot para funilaria ${state.in} direto no WhatsApp que a oficina já usa, agilizando o primeiro retorno de orçamento e mantendo o cliente atualizado sobre o andamento do reparo sem precisar ligar. O resultado é menos ligação repetitiva pro balcão e cliente mais tranquilo esperando o carro.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para funilaria ${state.in} e quero saber mais sobre como implantar na minha oficina.`,
    seoTitle: (state) => `Chatbot para Funilarias ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Agilize orçamento e atualize o cliente automaticamente sobre o reparo do carro na sua funilaria ${state.seoIn}. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "pet-shop-com-banho-e-tosa",
    niche: "Pet Shop com Banho e Tosa",
    eyebrow: "Chatbot para Pet Shop com Banho e Tosa",
    heroImage: "/images/landing/clinicas-estetica-hero.webp",
    heroImageAlt: "Atendente da pet shop digitando no celular, enquanto animais estão no fundo.",
    ogImage: "/images/og/clinicas-estetica-og.jpg",
    subheadline: "Conheça o nosso chatbot que agiliza orçamentos, agendamento e pedidos de serviços na sua Pet Shop com Banho e Tosa.",
    painPoints: [
      { title: "Atendimento demorado", description: "Cliente espera por minutos até ser atendido no balcão da pet shop." },
      { title: "Prazo de banho não cumprido", description: "Agenda de banhos é difícil de manter e muitas vezes os clientes precisam aguardar mais do que o combinado." },
      { title: "Pedidos de serviços não solicitados", description: "Cliente pega no celular e faz perguntas desnecessárias sobre produtos/serviços da pet shop." },
      { title: "Atendentes sobrecarregados", description: "Muitas vezes atendentes são pegos fazendo várias coisas ao mesmo tempo, como receber cliente e cuidar de animais." },
    ],
    benefits: [
      { title: "Orçamento pronto na hora", description: "Cliente recebe orçamento inicial rápido através do WhatsApp." },
      { title: "Agendamento fácil e automático", description: "Pet Shop com Banho e Tosa aproveita para confirmar data de banho e agendamentos." },
      { title: "Atendimento eficaz em minutos", description: "Chatbot da CODEXY reduz tempo de espera dos clientes." },
      { title: "Perguntas desnecessárias diminuem", description: "Informações sobre produtos e serviços ficam disponíveis no WhatsApp, evitando perguntas repetidas." },
      { title: "Atendentes mais focados", description: "Equipe pode se concentrar em cuidado aos animais e atendimento eficaz a clientes." },
    ],
    faq: [
      { question: "Como funciona o chatbot?", answer: "A CODEXY implantará um chatbot para Pet Shop com Banho e Tosa direto no WhatsApp, agilizando orçamentos, agendamento de serviços, etc." },
      { question: "Quais são os benefícios do chatbot para Pet Shop com Banho e Tosa?", answer: "O chatbot da CODEXY reduz tempo de espera dos clientes, facilita agendamento de banhos, entre outros." },
      { question: "Qual é o custo do serviço?", answer: "Custo está disponível após contato direto com a CODEXY." },
      { question: "Como eu faço para implantar o chatbot na minha Pet Shop com Banho e Tosa?", answer: "Basta entrar em contato com a CODEXY, e elas farão todo o trabalho de configuração." },
      { question: "O chatbot vai me tirar o emprego?", answer: "Não! O chatbot vai ajudar sua equipe a atender melhor aos clientes e liberar tempo para tarefas mais importantes." },
    ],
    headline: (state) => `Chatbot para Pet Shop com Banho e Tosa ${state.in}`,
    introParagraph: (state) => `A CODEXY desenvolveu um chatbot específico para Pet Shop com Banho e Tosa que pode ser implantado direto no WhatsApp, agilizando orçamentos, agendamento de serviços, etc. na sua pet shop ${state.in}.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para pet shop com banho e tosa ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Pet Shop com Banho e Tosa ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `A CODEXY oferece um chatbot para pet shop com banho e tosa ${state.seoIn}, agilizando atendimento e serviços, fale com a CODEXY.`,
  },
  {
    nicheSlug: "estetica-automotiva",
    niche: "Estética Automotiva",
    eyebrow: "Chatbot para Estética Automotiva",
    heroImage: "/images/landing/estetica-automotiva-hero.jpg",
    heroImageAlt: "Pessoal trabalhando no interior de um carro",
    ogImage: "/images/og/estetica-automotiva-og.jpg",
    subheadline: "Agilidade e eficiência nos atendimentos de beleza automotiva com nosso chatbot.",
    painPoints: [
      { title: "Atendimento demorado", description: "Cliente aguarda até o fim do dia pela resposta ao orçamento, e muitas vezes já fechou com outro salão." },
      { title: "Prazo de entrega comprometido", description: "Sem atualização automática, é fácil perder o prazo combinado para devolução do veículo." },
      { title: "Equipe sobrecarregada", description: "Mesma pessoa que atende no salão também tenta responder WhatsApp o dia todo." },
      { title: "Desenvolvimento de pedidos demorado", description: "Processo de entrega dos serviços de beleza automotiva pode levar tempo e esforço para ser concluído." },
    ],
    benefits: [
      { title: "Orçamento respondido rapidamente", description: "Cliente manda foto do dano e recebe retorno inicial rápido, sem esperar até o fim do dia." },
      { title: "Atualização automática de status", description: "Cliente acompanha andamento do serviço sem precisar ligar pra saber." },
      { title: "Agendamento organizado", description: "Chatbot confirma data de devolução do veículo e evita esquecimento." },
      { title: "Menos ligações repetitivas", description: "Perguntas de status saem do telefone e vão pro chatbot." },
      { title: "Continua usando o mesmo WhatsApp", description: "Não precisa trocar de WhatsApp nem pedir ao cliente para salvar novo contato." },
    ],
    faq: [
      { question: "O que é um chatbot?", answer: "Um software que simula uma conversa com o usuário." },
      { question: "Qual o benefício do uso de chatbot para a Estética Automotiva?", answer: "Agilidade e eficiência nos atendimentos de beleza automotiva, otimizando tempo e esforço." },
      { question: "O que é necessário para implantar um chatbot no meu negócio de Estética Automotiva?", answer: "Contate a CODEXY. Ela vai ajudá-lo na implantação do seu chatbot personalizado." },
      { question: "Posso usar o WhatsApp comum?", answer: "Sim, apenas instale nosso aplicativo e comece a trabalhar." },
      { question: "O que é uma página de landing?", answer: "Uma página da internet onde você pode obter informações sobre um produto ou serviço" },
    ],
    headline: (state) => `Chatbot para Estética Automotiva ${state.in}`,
    introParagraph: (state) => `A CODEXY implanta chatbot para Estética Automotiva ${state.in} que agiliza a resposta ao orçamento, mantém o cliente atualizado sobre o andamento do serviço e otimiza os atendimentos de beleza automotiva, direcionado à ${state.in}.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para estética automotiva ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Estética Automotiva ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Aumente a eficiência nos atendimentos de beleza automotiva da sua empresa com um chatbot personalizado. Faça contato e saiba mais sobre como implantar o nosso chatbot na sua Estética Automotiva ${state.seoIn}. Fale com a CODEXY.`,
  },
  {
    nicheSlug: "locacao-de-andaimes",
    niche: "Locação de Andaimes",
    eyebrow: "Chatbot para Locação de Andaimes",
    heroImage: "/images/landing/locacao-de-andaimes-hero.jpg",
    heroImageAlt: "Painéis de andaime em construção com operários trabalhando, monitorados por um tablet com WhatsApp aberto.",
    ogImage: "/images/og/locacao-de-andaimes-og.jpg",
    subheadline: "A CODEXY ajuda a locadora de andaimes a agilizar a contratação e manter os clientes atualizados sobre entrega e uso dos materiais.",
    painPoints: [
      { title: "Contratações demoradas", description: "Cliente pede aluguel por telefone e espera até o fim do dia pra receber resposta, e muitas vezes já agilizou com outra locadora." },
      { title: "Painéis de entrega sem controle", description: "Sem sistema, é fácil perder o prazo combinado de entrega dos painéis." },
      { title: "Equipe sobrecarregada de ligação repetitiva", description: "Mesma pessoa que atende o cliente na locadora também tenta responder WhatsApp o dia todo." },
      { title: "Risco de aluguel sem retorno", description: "Sem sistema de atualização, é fácil perder a possibilidade de rentabilizar os painéis com novo aluguel enquanto está em uso." },
    ],
    benefits: [
      { title: "Contratação respondida na hora", description: "Cliente manda foto do local e recebe retorno inicial rápido, sem esperar até o fim do dia." },
      { title: "Atualização automática de entrega", description: "Cliente acompanha andamento da entrega sem precisar ligar pra saber." },
      { title: "Agendamento de entrega organizado", description: "Chatbot confirma data de retirada dos painéis e evita esquecimento." },
      { title: "Menos ligação repetitiva", description: "Perguntas de status saem do telefone e vão pro chatbot." },
      { title: "Mesmo número que já usa", description: "Não precisa trocar de WhatsApp nem pedir pro cliente salvar novo contato." },
    ],
    faq: [
      { question: "Como funciona o chatbot?", answer: "O chatbot é instalado direto no WhatsApp, recebendo mensagens dos clientes e respondendo às perguntas comuns, como contratação de andaimes." },
      { question: "Eu preciso mudar de número para usar a funcionalidade?", answer: "Não! O cliente já está usando o seu número de WhatsApp, sem precisar trocar." },
      { question: "Como agilizamos a contratação com chatbot?", answer: "O chatbot permite ao cliente enviar fotos do local e receber retorno inicial rápido, sem perder tempo." },
      { question: "Posso monitorar os clientes em tempo real?", answer: "Sim! Com o chatbot você pode acompanhar as atualizações sobre entrega, status de aluguel e perguntas dos clientes em tempo real." },
      { question: "Eu posso personalizar o conteúdo do chatbot?", answer: "Sim, é possível customizar a resposta ao cliente para melhor atender às necessidades específicas da sua locadora." },
    ],
    headline: (state) => `Chatbot para Locação de Andaimes ${state.in}`,
    introParagraph: (state) => `A CODEXY ajuda locadoras de andaimes como você a implantar chatbots no WhatsApp, agilizando contratações e manutenção de clientes ${state.in}, sem precisar trocar o número do cliente.`,
    whatsappMessage: (state) => `Olá! Vi a página sobre chatbot para locação de andaimes ${state.in} e quero saber mais sobre como implantar no meu negócio.`,
    seoTitle: (state) => `Chatbot para Locação de Andaimes ${state.seoIn} | CODEXY`,
    seoDescription: (state) => `Melhore a experiência do cliente com um chatbot personalizado para locação de andaimes ${state.seoIn}, aumente eficiência e reduza custos. Fale com a CODEXY.`,
  },
];

/** Hash simples e estavel (mesmo input = mesmo output sempre, entre builds e
 * entre site1/site2) -- usado so pra escolher variante, nao precisa ser
 * criptografico. */
// Primeira leva de recuperação orgânica: páginas comerciais com conteúdo
// escrito para a combinação exata nicho+cidade. O restante continua usando
// as variantes do template; só promover novas URLs depois de medir esta leva.
const PRIORITY_PAGE_OVERRIDES: Record<string, PriorityPageOverride> = {
  "padarias:sao-paulo-sp": {
    updatedAt: "2026-08-27",
    introParagraph:
      "Uma padaria em São Paulo costuma receber no mesmo WhatsApp perguntas sobre encomendas, retirada, entrega, disponibilidade de produtos e horário de funcionamento. Quando essas conversas chegam durante o pico do balcão ou fora do expediente, o risco não é apenas responder tarde: o pedido pode ficar sem os dados necessários, ser duplicado ou seguir para a unidade errada. Um chatbot bem configurado organiza a primeira etapa do atendimento, coleta data, quantidade, endereço e preferência do cliente, responde dúvidas administrativas aprovadas pela equipe e encaminha exceções para uma pessoa. A automação não substitui a conferência da produção nem promete estoque que não existe. Ela cria um fluxo previsível para que a padaria responda mais rápido, registre o contexto de cada solicitação e deixe a equipe humana concentrada no preparo, na confirmação e nos casos que exigem decisão.",
    painPoints: [
      {
        title: "Encomenda chega sem as informações essenciais",
        description:
          "Mensagens como “quero um bolo para sábado” exigem várias perguntas antes de virar pedido. Sem um roteiro, tamanho, sabor, retirada, endereço e forma de pagamento ficam espalhados na conversa.",
      },
      {
        title: "Pico do balcão vira fila também no WhatsApp",
        description:
          "No começo da manhã, no almoço e antes de datas comemorativas, a mesma equipe precisa atender presencialmente e responder o celular. Contatos recentes acabam descendo na lista e podem ser esquecidos.",
      },
      {
        title: "Cliente não sabe qual unidade atende o endereço",
        description:
          "Em operações com mais de uma loja ou áreas de entrega diferentes, o atendimento manual pode encaminhar o pedido para a unidade errada ou informar prazo incompatível com a região.",
      },
      {
        title: "Perguntas repetidas consomem tempo de produção",
        description:
          "Horário, cardápio, prazo mínimo e política de retirada se repetem diariamente. Responder tudo do zero tira a equipe de tarefas que dependem de atenção dentro da padaria.",
      },
    ],
    benefits: [
      {
        title: "Coleta padronizada antes da confirmação",
        description:
          "O fluxo pode pedir os dados obrigatórios na ordem definida pela padaria e entregar um resumo para conferência humana, reduzindo o vai-e-volta antes de aceitar a encomenda.",
      },
      {
        title: "Triagem por unidade, retirada ou entrega",
        description:
          "A conversa identifica a região e o formato do pedido antes do encaminhamento. Regras de cobertura continuam sob controle da empresa e podem ser atualizadas quando a operação mudar.",
      },
      {
        title: "Respostas administrativas consistentes",
        description:
          "Informações aprovadas, como horário e antecedência mínima, ficam disponíveis sem depender de quem está com o aparelho naquele momento, inclusive fora do expediente.",
      },
      {
        title: "Passagem clara para atendimento humano",
        description:
          "Personalizações, reclamações, indisponibilidade e negociações saem do automático com o histórico já organizado, para que a equipe decida sem pedir tudo novamente.",
      },
    ],
    faq: [
      {
        question: "O chatbot confirma sozinho uma encomenda de padaria?",
        answer:
          "Ele pode coletar os dados e preparar o pedido, mas a confirmação final deve respeitar estoque, capacidade de produção, prazo e política de pagamento definidos pela padaria. Quando essas condições variam, o fluxo encaminha a solicitação para conferência humana.",
      },
      {
        question: "É possível separar conversas por unidade em São Paulo?",
        answer:
          "Sim. O atendimento pode perguntar bairro, CEP, retirada ou entrega e então direcionar o contato conforme as regras de cada unidade. A cobertura precisa ser cadastrada e mantida pela própria operação para não prometer uma entrega indevida.",
      },
      {
        question: "O cardápio e os preços ficam presos no chatbot?",
        answer:
          "Não precisam ficar. A configuração pode usar informações atualizáveis e levar o cliente para o catálogo ou para uma pessoa quando preço e disponibilidade mudam com frequência. O objetivo é não inventar informação que a equipe ainda não confirmou.",
      },
      {
        question: "O número atual do WhatsApp pode continuar sendo usado?",
        answer:
          "A viabilidade depende da solução escolhida e da configuração do número. Antes da implantação, é necessário avaliar o WhatsApp Business atual, os acessos da equipe e as regras da Meta para definir a transição sem interromper o atendimento.",
      },
    ],
  },
  "clinicas-odontologicas:sao-paulo-sp": {
    updatedAt: "2026-08-27",
    introParagraph:
      "Em uma clínica odontológica de São Paulo, o WhatsApp mistura pedidos de avaliação, dúvidas sobre convênio, confirmação de retorno, remarcação e mensagens que precisam de atenção clínica. Automatizar esse canal exige separar o que é administrativo do que depende de um profissional de saúde. O chatbot pode organizar dados de contato, unidade, preferência de horário e tipo de atendimento, além de enviar orientações operacionais aprovadas pela clínica. Sintomas, urgências e decisões clínicas devem ser encaminhados para uma pessoa, sem diagnóstico automático. Com essa divisão explícita, a recepção recebe conversas mais completas, reduz tarefas repetitivas e preserva o histórico necessário para continuar o atendimento com responsabilidade.",
    painPoints: [
      {
        title: "Lead de avaliação chega sem contexto",
        description:
          "A recepção precisa descobrir unidade, procedimento de interesse, disponibilidade e forma de contato antes de oferecer o próximo passo, o que aumenta o tempo até o agendamento.",
      },
      {
        title: "Confirmações competem com pacientes presenciais",
        description:
          "Lembretes e remarcações ocupam a mesma equipe responsável pelo balcão. Quando o volume cresce, faltas e horários ociosos aparecem por simples atraso na comunicação.",
      },
      {
        title: "Mensagem clínica cai no fluxo administrativo",
        description:
          "Relatos de dor, sangramento ou reação não devem receber resposta genérica. Sem critérios de escalonamento, a automação pode atrasar o contato com um profissional habilitado.",
      },
      {
        title: "Dados pessoais circulam sem regra clara",
        description:
          "Coletar informações demais no WhatsApp aumenta exposição desnecessária. O fluxo precisa pedir apenas o necessário e seguir as políticas de privacidade e acesso definidas pela clínica.",
      },
    ],
    benefits: [
      {
        title: "Pré-atendimento administrativo estruturado",
        description:
          "O chatbot reúne os dados necessários para a recepção continuar a conversa e evita repetir perguntas que o paciente já respondeu.",
      },
      {
        title: "Confirmação e remarcação com regra definida",
        description:
          "A clínica escolhe horários, antecedência e condições de cancelamento. Exceções permanecem com a equipe, em vez de serem decididas pelo fluxo automático.",
      },
      {
        title: "Escalonamento de mensagens sensíveis",
        description:
          "Palavras e situações previamente definidas podem interromper o roteiro administrativo e direcionar a conversa para atendimento humano, sem oferecer diagnóstico.",
      },
      {
        title: "Histórico organizado por unidade e interesse",
        description:
          "Em clínicas com mais de um endereço ou especialidade, o contato chega classificado para a equipe certa, com menos transferências e perda de contexto.",
      },
    ],
    faq: [
      {
        question: "O chatbot pode avaliar uma urgência odontológica?",
        answer:
          "Não deve diagnosticar nem definir conduta clínica. Ele pode reconhecer que a mensagem precisa de atenção humana, informar os canais oficiais da clínica e encaminhar o relato para a equipe responsável conforme um protocolo previamente aprovado.",
      },
      {
        question: "Como proteger os dados do paciente no WhatsApp?",
        answer:
          "A implantação deve limitar a coleta ao necessário, definir quem acessa as conversas, estabelecer prazo de retenção e informar a finalidade do uso. Dados clínicos detalhados devem permanecer nos sistemas e processos apropriados da clínica.",
      },
      {
        question: "É possível atender mais de uma unidade em São Paulo?",
        answer:
          "Sim. O fluxo pode identificar a unidade desejada ou a região do paciente antes de consultar as regras de agenda. Cada endereço precisa ter horários, especialidades e responsáveis atualizados para evitar encaminhamento incorreto.",
      },
      {
        question: "A recepção deixa de participar do atendimento?",
        answer:
          "Não. A automação cuida da coleta inicial e de tarefas previsíveis. Negociação, exceções, dúvidas clínicas e situações sensíveis continuam com a equipe, que recebe o histórico da conversa para assumir sem recomeçar do zero.",
      },
    ],
  },
  "imobiliarias:sao-paulo-sp": {
    updatedAt: "2026-08-27",
    introParagraph:
      "O primeiro contato com uma imobiliária em São Paulo costuma ser curto: o interessado envia o link de um imóvel, pergunta se ainda está disponível ou descreve rapidamente o que procura. Para transformar essa mensagem em atendimento útil, é preciso identificar compra ou locação, região, faixa de valor, número de quartos, prazo e condições básicas antes de encaminhar o lead. Um chatbot pode conduzir essa triagem, registrar preferências e organizar o agendamento de visita sem fingir que substitui o corretor. Disponibilidade, valores, documentação e negociação precisam vir das fontes oficiais da imobiliária e ser confirmados por uma pessoa quando houver mudança. O ganho está em responder o contato enquanto o interesse ainda está quente e entregar ao corretor um resumo claro para a continuidade.",
    painPoints: [
      {
        title: "Lead chega sem identificar o imóvel",
        description:
          "Links são encaminhados sem código ou se perdem entre mensagens. O corretor gasta tempo procurando o anúncio antes de descobrir se a unidade continua disponível.",
      },
      {
        title: "Compra e locação entram na mesma fila",
        description:
          "Necessidades, documentos e prazos são diferentes. Sem triagem inicial, o contato passa por pessoas erradas e demora até chegar ao especialista adequado.",
      },
      {
        title: "Preferências ficam espalhadas na conversa",
        description:
          "Bairro, orçamento, metragem, pets e data de mudança aparecem em mensagens separadas. Quando outro corretor assume, parte do contexto precisa ser perguntada novamente.",
      },
      {
        title: "Visita é combinada sem confirmação suficiente",
        description:
          "Agenda do corretor, autorização do imóvel e disponibilidade do interessado precisam convergir. Automatizar sem regras pode criar horários que a operação não consegue cumprir.",
      },
    ],
    benefits: [
      {
        title: "Qualificação sem transformar a conversa em formulário",
        description:
          "O fluxo coleta apenas os critérios que ajudam a selecionar imóveis e adapta as próximas perguntas às respostas já fornecidas pelo interessado.",
      },
      {
        title: "Distribuição para o corretor responsável",
        description:
          "Tipo de negócio, região e empreendimento podem orientar o encaminhamento, reduzindo transferências e mantendo o histórico disponível para quem assume.",
      },
      {
        title: "Agendamento condicionado à operação real",
        description:
          "O chatbot registra a preferência de visita e segue as regras da imobiliária. A confirmação definitiva pode permanecer com o corretor quando depender do proprietário ou da chave.",
      },
      {
        title: "Retomada de contatos com contexto",
        description:
          "Quando surge um imóvel compatível, a equipe consegue entender rapidamente o que o lead procurava, sem depender da memória de quem respondeu a primeira mensagem.",
      },
    ],
    faq: [
      {
        question: "O chatbot informa se um imóvel ainda está disponível?",
        answer:
          "Somente quando estiver conectado a uma fonte atualizada e confiável da imobiliária. Se a disponibilidade não puder ser confirmada automaticamente, o correto é registrar o interesse e encaminhar para o corretor validar antes de prometer a unidade.",
      },
      {
        question: "Ele pode negociar aluguel ou preço de venda?",
        answer:
          "A automação pode coletar a proposta e os dados necessários, mas condições, contrapropostas e aprovações devem seguir a política da imobiliária e ser conduzidas por um profissional responsável.",
      },
      {
        question: "Como funciona para imobiliárias com várias regiões de São Paulo?",
        answer:
          "Bairro, zona, proximidade de transporte e tipo de imóvel podem ser usados para direcionar o contato ao time certo. As regras precisam refletir a divisão comercial real para não criar uma distribuição artificial.",
      },
      {
        question: "É necessário pedir documentos já no primeiro contato?",
        answer:
          "Normalmente não. A triagem inicial deve coletar apenas o necessário para entender a demanda. Documentos e dados sensíveis entram depois, em canal e etapa apropriados, conforme a finalidade e a política de privacidade da imobiliária.",
      },
    ],
  },
};

function hashSeed(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pickVariant<T>(variants: T[][] | undefined, fallback: T, seed: number): T {
  if (!variants || variants.length === 0) return fallback;
  return variants[seed % variants.length];
}

function buildLandingPage(template: NicheTemplate, state: StateInfo): LandingPageData {
  const seed = hashSeed(`${template.nicheSlug}:${state.slug}`);
  const priorityOverride = PRIORITY_PAGE_OVERRIDES[`${template.nicheSlug}:${state.slug}`];
  const productSlug = template.productSlug ?? "chatbot";
  return {
    slug: `${productSlug}-para-${template.nicheSlug}-${state.slug}`,
    service: productSlug,
    productSlug,
    niche: template.niche,
    nicheSlug: template.nicheSlug,
    locationSlug: state.slug,
    stateLabel: state.label,
    stateIn: state.in,
    stateUf: state.uf,
    eyebrow: template.eyebrow,
    headline: template.headline(state),
    subheadline: template.subheadline,
    heroImage: template.heroImage,
    heroImageAlt: template.heroImageAlt,
    introParagraph: priorityOverride?.introParagraph ?? template.introParagraph(state),
    painPoints:
      priorityOverride?.painPoints ?? pickVariant(template.painPointsVariants, template.painPoints, seed),
    benefits:
      priorityOverride?.benefits ?? pickVariant(template.benefitsVariants, template.benefits, seed),
    faq: priorityOverride?.faq ?? pickVariant(template.faqVariants, template.faq, seed),
    updatedAt: priorityOverride?.updatedAt,
    partner: template.partner,
    whatsappMessage: template.whatsappMessage(state),
    seo: {
      title: template.seoTitle(state),
      description: template.seoDescription(state),
      ogImage: template.ogImage,
    },
  };
}

// Nível "estado" removido em 2026-08-17: GSC reportava a maioria do site
// como "Detectada, mas não indexada" (1770/~1850 URLs) -- orçamento de
// rastreamento do Google não acompanhava o volume. Estado também cria
// intenção de busca sobreposta com cidade da mesma UF ("chatbot pra padaria
// Minas Gerais" vs "... Belo Horizonte") e foi o nível que mais precisou de
// diversificação de conteúdo pra não ficar quase-idêntico entre UFs. Corta
// 44 -> 17 páginas por nicho (só cidade, que é a intenção de busca real de
// negócio local). BRAZILIAN_STATES mantido no arquivo (usado por outras
// coisas / referência futura), só não entra mais no array publicado.
export const landingPages: LandingPageData[] = NICHE_TEMPLATES.flatMap((template) => [
  ...BRAZILIAN_CITIES.map((city) => buildLandingPage(template, city)),
]);

export function getLandingPageBySlug(slug?: string): LandingPageData | undefined {
  return landingPages.find((page) => page.slug === slug);
}

// Internal linking entre as 132 páginas: sem isso, cada página é uma ilha só
// alcançável pela home, e o PageRank interno não circula entre nicho/local.
export function getRelatedPages(page: LandingPageData): {
  otherNichesSameLocation: LandingPageData[];
  otherLocationsSameNiche: LandingPageData[];
} {
  const otherNichesSameLocation = landingPages.filter(
    (p) => p.locationSlug === page.locationSlug && p.nicheSlug !== page.nicheSlug
  );

  const otherLocationsSameNiche = landingPages
    .filter((p) => p.nicheSlug === page.nicheSlug && p.locationSlug !== page.locationSlug)
    .slice(0, 8);

  return { otherNichesSameLocation, otherLocationsSameNiche };
}
