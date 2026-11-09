import type { FaqItem } from "./landingPages";

/**
 * Páginas de serviço da CODEXY (/servicos/<slug>/).
 *
 * Existem para capturar buscas comerciais ("criação de sites em BH",
 * "chatbot para WhatsApp", "sistema sob medida") que o site não cobria:
 * antes o único conteúdo sobre serviços era uma seção da home e centenas de
 * páginas de nicho × cidade. Todo texto aqui descreve o que a CODEXY de fato
 * faz; não há preço, prazo, cliente ou resultado inventado. Quando uma
 * informação depende do projeto, o texto diz isso.
 */

export interface ServiceStep {
  title: string;
  description: string;
}

export interface ServiceBlock {
  title: string;
  description: string;
}

export interface ServicePageData {
  slug: string;
  /** Nome curto usado em menus, breadcrumbs e cards. */
  name: string;
  /** Tipo de serviço para o schema.org/Service. */
  serviceType: string;
  eyebrow: string;
  h1: string;
  subheadline: string;
  seo: { title: string; description: string; keywords: string };
  intro: string[];
  /** Situações reais em que o cliente procura este serviço. */
  forWhom: ServiceBlock[];
  deliverables: ServiceBlock[];
  steps: ServiceStep[];
  faq: FaqItem[];
  whatsappMessage: string;
  /** Termos para escolher posts do blog relacionados. */
  blogTopic: { title: string; excerpt: string };
  /** Slugs de outros serviços para link cruzado. */
  related: string[];
  /** Nichos (slugs de /segmentos/) em destaque nesta página. */
  featuredNiches: string[];
}

const COMMON_STEPS: ServiceStep[] = [
  {
    title: "Conversa e diagnóstico",
    description:
      "Entendemos o negócio, quem é o cliente e qual resultado você espera. Dessa conversa sai um escopo claro, sem surpresa depois.",
  },
  {
    title: "Proposta e combinados",
    description:
      "Você recebe o que será entregue, o prazo e o valor antes de qualquer desenvolvimento começar.",
  },
  {
    title: "Desenvolvimento com validação",
    description:
      "Construímos por etapas e mostramos o andamento, para você aprovar ou ajustar antes de seguir.",
  },
  {
    title: "Publicação e acompanhamento",
    description:
      "Colocamos no ar, conferimos tudo em uso real e seguimos disponíveis para ajustes e suporte.",
  },
];

export const servicePages: ServicePageData[] = [
  {
    slug: "criacao-de-sites",
    name: "Criação de sites",
    serviceType: "Desenvolvimento de sites e lojas virtuais",
    eyebrow: "Criação de sites profissionais",
    h1: "Criação de sites e lojas virtuais que trazem clientes pelo Google e pelo WhatsApp",
    subheadline:
      "Sites institucionais, landing pages, blogs e lojas virtuais desenvolvidos sob medida, rápidos no celular e prontos para aparecer nas buscas.",
    seo: {
      title: "Criação de Sites Profissionais e Lojas Virtuais | CODEXY",
      description:
        "Criação de sites institucionais, landing pages e lojas virtuais sob medida, rápidos no celular e com SEO técnico. Peça um orçamento pelo WhatsApp.",
      keywords:
        "criação de sites, site institucional, landing page, loja virtual, desenvolvimento web, site profissional, criação de sites em Belo Horizonte",
    },
    intro: [
      "Um site precisa fazer duas coisas: ser encontrado por quem procura o que você vende e levar essa pessoa a falar com você. A CODEXY desenvolve sites pensando nesses dois objetivos desde o primeiro desenho, e não como um cartão de visitas parado na internet.",
      "Cada projeto é feito sob medida, com código próprio e sem depender de modelo pronto. O site carrega rápido no celular, tem as páginas organizadas por assunto e vem com a estrutura técnica que o Google lê: títulos, descrições, dados estruturados, mapa do site e páginas que respondem pelo endereço certo.",
    ],
    forWhom: [
      {
        title: "Empresa sem site ou com site antigo",
        description:
          "Quem ainda depende só de Instagram e indicação, ou tem um site lento, que não abre direito no celular e não aparece em nenhuma busca.",
      },
      {
        title: "Negócio local que quer ser achado na cidade",
        description:
          "Clínicas, escritórios, oficinas, restaurantes e prestadores de serviço que precisam aparecer quando alguém busca o serviço na região.",
      },
      {
        title: "Quem vai anunciar e precisa de uma página que converta",
        description:
          "Landing pages objetivas para campanhas, com chamada clara para WhatsApp ou formulário e medição do que funciona.",
      },
      {
        title: "Quem quer vender online",
        description:
          "Lojas virtuais e catálogos com pedido pelo site ou pelo WhatsApp, conforme o jeito que sua operação funciona.",
      },
    ],
    deliverables: [
      {
        title: "Design próprio, pensado para celular primeiro",
        description:
          "Layout criado para a sua marca e seu público, testado em telas pequenas, onde a maior parte das visitas acontece.",
      },
      {
        title: "SEO técnico de base",
        description:
          "Título e descrição por página, URLs limpas, dados estruturados (Schema.org), sitemap, robots e páginas de erro corretas.",
      },
      {
        title: "Velocidade e Core Web Vitals",
        description:
          "Imagens otimizadas, carregamento enxuto e páginas pré-renderizadas, para abrir rápido e não perder visitante na espera.",
      },
      {
        title: "Botões de WhatsApp e formulários",
        description:
          "Chamadas para contato nos pontos certos da página, com mensagem já preenchida para o cliente começar a conversa.",
      },
      {
        title: "Conteúdo organizado por serviço",
        description:
          "Uma página para cada serviço importante, com texto escrito para quem busca aquilo, e não uma página única com tudo misturado.",
      },
      {
        title: "Hospedagem, publicação e suporte",
        description:
          "Colocamos o site no ar, configuramos domínio e certificado e seguimos disponíveis para ajustes e manutenção.",
      },
    ],
    steps: COMMON_STEPS,
    faq: [
      {
        question: "Quanto custa criar um site?",
        answer:
          "Depende do que o site precisa fazer: número de páginas, funcionalidades, integrações e se há loja virtual. Por isso não existe valor fixo. Você conta o que precisa pelo WhatsApp e recebe uma proposta com escopo, prazo e valor antes de qualquer compromisso.",
      },
      {
        question: "O site aparece no Google automaticamente?",
        answer:
          "O site já sai com a base técnica de SEO bem feita, mas aparecer bem nas buscas depende também de conteúdo útil, da concorrência da sua região e de tempo. Nenhuma agência séria promete a primeira posição. O que fazemos é remover os problemas técnicos e organizar o conteúdo para dar a melhor chance de ranqueamento.",
      },
      {
        question: "Vocês fazem loja virtual?",
        answer:
          "Sim. Desenvolvemos lojas virtuais e catálogos com pedido pelo site ou pelo WhatsApp. A escolha entre uma coisa e outra depende do volume de vendas e da sua operação, e discutimos isso na conversa inicial.",
      },
      {
        question: "Preciso ter o conteúdo e as fotos prontos?",
        answer:
          "Não é obrigatório. Ajudamos a organizar a estrutura e os textos. Fotos e logotipo reais do seu negócio sempre funcionam melhor do que imagens genéricas, então se você tiver, use.",
      },
      {
        question: "O site fica no meu nome e eu consigo editar depois?",
        answer:
          "O domínio e o conteúdo são seus. Combinamos desde o início como serão as atualizações: se você quer pedir as mudanças para a CODEXY ou ter uma forma de editar por conta própria.",
      },
      {
        question: "Vocês atendem empresas fora de Belo Horizonte?",
        answer:
          "Sim. A CODEXY fica em Belo Horizonte, MG, e atende empresas de todo o Brasil. Reuniões e acompanhamento acontecem online, pelo WhatsApp e por chamada de vídeo.",
      },
    ],
    whatsappMessage:
      "Olá! Vi a página de criação de sites da CODEXY e quero um orçamento para o meu negócio.",
    blogTopic: {
      title: "criação de site para empresa desenvolvimento web landing page",
      excerpt: "site institucional, loja virtual, SEO, presença digital",
    },
    related: ["chatbot-whatsapp", "aplicativos-mobile", "sistemas-sob-medida"],
    featuredNiches: ["clinicas-odontologicas", "escritorios-de-advocacia", "restaurantes", "imobiliarias"],
  },
  {
    slug: "aplicativos-mobile",
    name: "Aplicativos mobile",
    serviceType: "Desenvolvimento de aplicativos Android e iOS",
    eyebrow: "Desenvolvimento de aplicativos",
    h1: "Desenvolvimento de aplicativos para Android e iOS sob medida",
    subheadline:
      "Do primeiro protótipo à publicação nas lojas: aplicativos pensados para o seu processo, com experiência simples para quem usa.",
    seo: {
      title: "Desenvolvimento de Aplicativos Android e iOS | CODEXY",
      description:
        "Desenvolvimento de aplicativos mobile sob medida para Android e iOS, do protótipo à publicação nas lojas. Fale com a CODEXY pelo WhatsApp.",
      keywords:
        "desenvolvimento de aplicativos, criar aplicativo, app android, app ios, aplicativo mobile sob medida, empresa de desenvolvimento de apps",
    },
    intro: [
      "Um aplicativo faz sentido quando resolve uma rotina que o site ou o WhatsApp não resolvem bem: acesso recorrente, notificações, uso em campo, cadastro de informações no celular. A CODEXY desenvolve aplicativos para Android e iOS a partir do problema real do cliente, e não de um modelo pronto.",
      "A CODEXY mantém um aplicativo próprio publicado na Google Play, o TrilhaDev, plataforma gratuita para aprender a programar. O processo de publicação, as regras das lojas e a manutenção depois do lançamento fazem parte da experiência que levamos para os projetos de clientes.",
    ],
    forWhom: [
      {
        title: "Empresa que quer um canal próprio com o cliente",
        description:
          "Programa de relacionamento, área do cliente, agendamentos e avisos direto no celular de quem usa.",
      },
      {
        title: "Operação que trabalha em campo",
        description:
          "Equipes que registram visitas, vistorias, medições ou entregas e precisam lançar a informação na hora, mesmo com sinal ruim.",
      },
      {
        title: "Quem quer validar uma ideia de produto",
        description:
          "Uma primeira versão enxuta para testar com usuários reais antes de investir em todas as funções.",
      },
      {
        title: "Empresa que já tem sistema e quer levá-lo ao celular",
        description:
          "Aplicativo conectado ao que você já usa, para que a equipe ou o cliente acesse de qualquer lugar.",
      },
    ],
    deliverables: [
      {
        title: "Android e iOS",
        description:
          "Aplicativo que roda nos dois sistemas, com uma base de código única quando faz sentido, para reduzir custo e prazo de manutenção.",
      },
      {
        title: "Design de interface e experiência",
        description:
          "Telas simples, com poucos passos para cada tarefa, desenhadas para quem usa o aplicativo no dia a dia.",
      },
      {
        title: "Painel e back-end quando necessário",
        description:
          "Quando o aplicativo precisa de cadastro, login, dados na nuvem ou um painel de administração, construímos essa parte junto.",
      },
      {
        title: "Notificações e integrações",
        description:
          "Avisos para o usuário e integração com WhatsApp, pagamentos, e-mail e sistemas que você já utiliza.",
      },
      {
        title: "Publicação nas lojas",
        description:
          "Preparamos o material, seguimos as regras da Google Play e da App Store e acompanhamos a aprovação.",
      },
      {
        title: "Manutenção e evolução",
        description:
          "Atualizações para novas versões dos sistemas operacionais, correções e novas funções depois do lançamento.",
      },
    ],
    steps: COMMON_STEPS,
    faq: [
      {
        question: "Quanto custa desenvolver um aplicativo?",
        answer:
          "O valor varia muito com as funções, o número de telas, a necessidade de back-end e as integrações. Um aplicativo simples e um com pagamento, login e painel têm esforços muito diferentes. Descrevendo a ideia pelo WhatsApp, você recebe uma proposta com escopo e valor.",
      },
      {
        question: "Quanto tempo leva para ficar pronto?",
        answer:
          "Depende do escopo. Uma primeira versão enxuta leva bem menos tempo do que um produto completo. O prazo é combinado na proposta, antes de começar, e a aprovação nas lojas tem tempo próprio que não depende da CODEXY.",
      },
      {
        question: "Vocês publicam o aplicativo nas lojas?",
        answer:
          "Sim. Cuidamos da preparação do material e do processo de publicação na Google Play e na App Store. A conta de desenvolvedor da loja fica em nome da sua empresa.",
      },
      {
        question: "Vale a pena um aplicativo ou um site responsivo resolve?",
        answer:
          "Se o uso for esporádico, um site bem feito costuma bastar. O aplicativo compensa quando há uso recorrente, notificações, recursos do aparelho (câmera, localização) ou funcionamento em campo. Ajudamos a decidir isso antes de você investir.",
      },
      {
        question: "O código é meu?",
        answer:
          "Os termos de propriedade e entrega do código são definidos em contrato antes do início do projeto, para ficarem claros para os dois lados.",
      },
    ],
    whatsappMessage:
      "Olá! Vi a página de aplicativos da CODEXY e quero conversar sobre desenvolver um app para o meu negócio.",
    blogTopic: {
      title: "aplicativo mobile desenvolvimento app android ios",
      excerpt: "aplicativo para empresa, app sob medida",
    },
    related: ["sistemas-sob-medida", "criacao-de-sites", "chatbot-whatsapp"],
    featuredNiches: ["construtoras", "academias", "autoescolas", "oficinas-mecanicas"],
  },
  {
    slug: "chatbot-whatsapp",
    name: "Chatbot e automação de WhatsApp",
    serviceType: "Chatbot e automação de atendimento por WhatsApp",
    eyebrow: "Chatbot para WhatsApp",
    h1: "Chatbot para WhatsApp: atendimento automático que não deixa cliente sem resposta",
    subheadline:
      "Respostas às perguntas mais comuns, coleta de dados e encaminhamento para a equipe, funcionando no número de WhatsApp que a sua empresa já usa.",
    seo: {
      title: "Chatbot para WhatsApp e Automação de Atendimento | CODEXY",
      description:
        "Chatbot para WhatsApp e automação de atendimento sob medida: responda clientes a qualquer hora e passe para a equipe só o que precisa. Peça um orçamento.",
      keywords:
        "chatbot para whatsapp, automação de atendimento, chatbot whatsapp business, atendimento automático whatsapp, robô de atendimento, automação whatsapp",
    },
    intro: [
      "Quem escreve para uma empresa espera resposta rápida. Quando ela demora, o cliente procura o concorrente. Um chatbot responde na hora às dúvidas repetidas (horário, endereço, serviços, como agendar), coleta as informações necessárias e só chama uma pessoa quando a conversa realmente exige.",
      "A CODEXY desenvolve o chatbot sob medida para o seu tipo de negócio, com fluxos escritos a partir das perguntas que os seus clientes de fato fazem. Ele funciona no WhatsApp que a empresa já usa, sem obrigar o cliente a salvar um número novo.",
      "Também conectamos o atendimento a outros pontos do processo: agenda, planilhas, CRM e avisos para a equipe. Para clínicas e consultórios, a CODEXY é parceira do DoctorChatBot, solução específica de agenda e atendimento por WhatsApp para a área da saúde.",
    ],
    forWhom: [
      {
        title: "Empresa que recebe as mesmas perguntas o dia todo",
        description:
          "Preço, horário, localização, como contratar. A equipe perde tempo repetindo e demora a atender o que é urgente.",
      },
      {
        title: "Negócio que perde contato fora do horário",
        description:
          "Mensagens que chegam à noite e no fim de semana ficam sem resposta até a manhã seguinte, e muitas viram venda perdida.",
      },
      {
        title: "Quem agenda por mensagem",
        description:
          "Clínicas, salões, oficinas, escolas e prestadores que organizam horários pelo WhatsApp e querem reduzir o vai e volta.",
      },
      {
        title: "Quem anuncia e precisa responder rápido ao lead",
        description:
          "Campanhas que levam o cliente ao WhatsApp rendem mais quando o primeiro retorno é imediato e já qualifica o interesse.",
      },
    ],
    deliverables: [
      {
        title: "Fluxos de conversa sob medida",
        description:
          "Árvore de atendimento escrita para o seu negócio, com linguagem natural e opções claras, e não um menu genérico.",
      },
      {
        title: "Respostas para as perguntas frequentes",
        description:
          "Serviços, preços (quando você quiser divulgar), horários, endereço, formas de pagamento e regras de funcionamento.",
      },
      {
        title: "Encaminhamento para atendente humano",
        description:
          "Quando o cliente pede ou a conversa foge do roteiro, o chatbot passa o atendimento para uma pessoa, com o contexto já registrado.",
      },
      {
        title: "Captação e qualificação de contatos",
        description:
          "Coleta de nome, interesse e dados do pedido, organizados para a equipe retornar com a informação em mãos.",
      },
      {
        title: "Integrações",
        description:
          "Conexão com agenda, planilha, CRM, e-mail e avisos para o time, conforme a sua operação.",
      },
      {
        title: "Acompanhamento depois de ir ao ar",
        description:
          "Lemos as conversas reais, ajustamos respostas que não funcionaram e evoluímos o fluxo com o uso.",
      },
    ],
    steps: [
      {
        title: "Diagnóstico do atendimento",
        description:
          "Mapeamos as perguntas mais comuns, os horários de pico e o ponto em que a equipe precisa entrar na conversa.",
      },
      {
        title: "Desenho dos fluxos",
        description:
          "Escrevemos as conversas com você, no jeito de falar da sua empresa, e definimos as regras de encaminhamento.",
      },
      {
        title: "Configuração e integração",
        description:
          "Conectamos ao WhatsApp da empresa e às ferramentas que você usa, como agenda e planilhas.",
      },
      {
        title: "Testes antes de publicar",
        description:
          "Simulamos conversas reais para validar respostas e exceções antes de o cliente conversar com o robô.",
      },
      {
        title: "Ajustes com uso real",
        description:
          "Acompanhamos as primeiras semanas e melhoramos o que os clientes de fato perguntam.",
      },
    ],
    faq: [
      {
        question: "O chatbot funciona no meu WhatsApp atual?",
        answer:
          "Sim. A integração é feita com o número que a empresa já usa, para o cliente continuar falando com o contato que conhece. A forma de conexão depende de você usar o WhatsApp Business no aplicativo ou a API oficial, e indicamos a opção mais adequada ao seu volume de atendimento.",
      },
      {
        question: "O cliente percebe que está falando com um robô?",
        answer:
          "Recomendamos ser transparente. O chatbot se apresenta como assistente virtual e oferece falar com uma pessoa a qualquer momento. Atendimento honesto gera mais confiança do que tentar disfarçar a automação.",
      },
      {
        question: "Quanto custa um chatbot de WhatsApp?",
        answer:
          "O valor depende da complexidade dos fluxos, das integrações e do volume de mensagens. Um atendimento com poucas perguntas frequentes é bem diferente de um que agenda, consulta sistemas e qualifica clientes. Conte o seu cenário pelo WhatsApp e você recebe uma proposta com escopo e valor.",
      },
      {
        question: "Existe risco de banimento do número?",
        answer:
          "O risco existe quando se faz envio em massa não solicitado. O chatbot da CODEXY é voltado para atender quem entrou em contato com a empresa, o uso que as regras do WhatsApp preveem. Explicamos as práticas seguras de uso antes de colocar no ar.",
      },
      {
        question: "Dá para usar em qualquer tipo de negócio?",
        answer:
          "Funciona melhor onde há perguntas repetidas e processos de atendimento definidos. Temos páginas dedicadas por segmento, com exemplos de como o atendimento se organiza em cada um. Para clínicas, há também a parceria com o DoctorChatBot.",
      },
      {
        question: "A equipe consegue assumir a conversa quando quiser?",
        answer:
          "Sim. A equipe pode entrar em qualquer atendimento, e o chatbot deixa de responder naquela conversa enquanto uma pessoa estiver conduzindo.",
      },
    ],
    whatsappMessage:
      "Olá! Vi a página de chatbot para WhatsApp da CODEXY e quero um orçamento para automatizar o atendimento da minha empresa.",
    blogTopic: {
      title: "chatbot whatsapp automação de atendimento whatsapp business",
      excerpt: "chatbot para pequenas empresas, atendimento automático",
    },
    related: ["sistemas-sob-medida", "criacao-de-sites", "aplicativos-mobile"],
    featuredNiches: [
      "clinicas-odontologicas",
      "clinicas-de-estetica",
      "saloes-de-beleza",
      "imobiliarias",
      "oficinas-mecanicas",
      "restaurantes",
    ],
  },
  {
    slug: "sistemas-sob-medida",
    name: "Sistemas sob medida",
    serviceType: "Desenvolvimento de software e sistemas personalizados",
    eyebrow: "Software sob medida",
    h1: "Desenvolvimento de sistemas sob medida para organizar a sua operação",
    subheadline:
      "Agendamento, CRM, estoque, ordens de serviço, diário de obra e plataformas por nicho, construídos para o jeito que a sua empresa trabalha.",
    seo: {
      title: "Desenvolvimento de Sistemas Sob Medida | CODEXY",
      description:
        "Desenvolvimento de sistemas sob medida: agendamento, CRM, estoque, ordem de serviço e plataformas web para o seu processo. Peça um orçamento.",
      keywords:
        "sistema sob medida, desenvolvimento de software, sistema de agendamento, sistema de gestão, software personalizado, sistema web, ordem de serviço",
    },
    intro: [
      "Planilhas espalhadas, anotações no papel e mensagens soltas funcionam até a empresa crescer. A partir daí, informação se perde, o retrabalho aumenta e ninguém enxerga o negócio inteiro. Um sistema feito para o seu processo reúne tudo num só lugar, com as telas e os relatórios que você realmente usa.",
      "A CODEXY desenvolve sistemas web sob medida, acessíveis do computador e do celular. Em vez de adaptar sua rotina a um software pronto cheio de funções que você não usa, construímos só o que a operação precisa, e evoluímos conforme ela muda.",
    ],
    forWhom: [
      {
        title: "Empresa que controla tudo em planilhas",
        description:
          "Quando a planilha já está lenta, duplicada ou depende de uma única pessoa que sabe mexer nela.",
      },
      {
        title: "Operação com processo específico",
        description:
          "Segmentos cujo fluxo não cabe nos sistemas de prateleira: obras, ensino, reservas, serviços técnicos e projetos internos.",
      },
      {
        title: "Quem precisa de agendamento e confirmação",
        description:
          "Agenda online com regras próprias de horário, equipe, serviço e lembretes ao cliente.",
      },
      {
        title: "Empresa que quer integrar o que já usa",
        description:
          "Unir WhatsApp, site, planilhas e pagamentos em um fluxo só, sem digitar a mesma informação duas vezes.",
      },
    ],
    deliverables: [
      {
        title: "Levantamento do processo atual",
        description:
          "Mapeamos como o trabalho acontece hoje para o sistema resolver os gargalos reais, e não só informatizar a bagunça.",
      },
      {
        title: "Sistema web com login e permissões",
        description:
          "Cada pessoa vê e faz o que cabe ao seu papel, com histórico de quem alterou o quê.",
      },
      {
        title: "Cadastros, agenda, estoque, OS e relatórios",
        description:
          "Os módulos que a sua operação pede, como agendamento, CRM, controle de estoque, ordens de serviço ou diário de obra.",
      },
      {
        title: "Acesso pelo celular",
        description:
          "Telas pensadas para quem precisa registrar informação em campo, no balcão ou na obra.",
      },
      {
        title: "Integrações",
        description:
          "Conexão com WhatsApp, e-mail, pagamentos e outros sistemas para eliminar digitação repetida.",
      },
      {
        title: "Migração dos dados existentes",
        description:
          "Importamos o que já está em planilhas para você começar a usar sem recomeçar do zero.",
      },
    ],
    steps: [
      {
        title: "Levantamento do processo",
        description:
          "Conversamos com quem opera o dia a dia para entender fluxos, exceções e o que hoje dá mais trabalho.",
      },
      {
        title: "Escopo e proposta",
        description:
          "Definimos o que entra na primeira versão, o prazo e o valor, priorizando o que traz retorno mais rápido.",
      },
      {
        title: "Desenvolvimento por etapas",
        description:
          "Você acompanha e valida cada módulo enquanto ele é construído, em vez de esperar o fim para ver o resultado.",
      },
      {
        title: "Implantação e treinamento",
        description:
          "Colocamos em uso, migramos os dados e orientamos a equipe nas primeiras semanas.",
      },
      {
        title: "Suporte e evolução",
        description:
          "O sistema cresce com a empresa: novas funções, relatórios e ajustes conforme a rotina muda.",
      },
    ],
    faq: [
      {
        question: "Sistema sob medida não é muito mais caro que um sistema pronto?",
        answer:
          "O investimento inicial costuma ser maior do que a mensalidade de um software pronto. Em compensação, você não paga por funções que não usa, não depende de adaptar o processo ao sistema e é dono de uma ferramenta que evolui com o negócio. Na proposta mostramos o escopo para você comparar com clareza.",
      },
      {
        question: "Quanto tempo leva para desenvolver?",
        answer:
          "Depende do número de módulos. Por isso começamos com uma primeira versão focada no que dói mais, que pode entrar em uso mais cedo, e evoluímos depois. O prazo é definido na proposta, antes de começar.",
      },
      {
        question: "Que tipos de sistema vocês desenvolvem?",
        answer:
          "Sistemas de agendamento, CRM, controle de estoque, ordens de serviço, diário de obra, plataformas de ensino, reservas, gestão de projetos internos e painéis administrativos. Se o seu processo não está na lista, é justamente o caso em que um sistema sob medida faz mais sentido.",
      },
      {
        question: "Meus dados ficam seguros?",
        answer:
          "Desenvolvemos com controle de acesso por usuário, comunicação criptografada e rotina de backup. Os detalhes de hospedagem, acesso e tratamento de dados pessoais conforme a LGPD são combinados no projeto.",
      },
      {
        question: "Consigo pedir alterações depois que estiver em uso?",
        answer:
          "Sim. Sistemas mudam porque a empresa muda. O suporte e as evoluções ficam previstos no acordo de trabalho, e você prioriza o que quer mudar primeiro.",
      },
    ],
    whatsappMessage:
      "Olá! Vi a página de sistemas sob medida da CODEXY e quero conversar sobre um sistema para organizar a minha operação.",
    blogTopic: {
      title: "sistema sob medida software gestão agendamento sistemas internos",
      excerpt: "sistema de gestão, automação de processos, software personalizado",
    },
    related: ["aplicativos-mobile", "chatbot-whatsapp", "criacao-de-sites"],
    featuredNiches: ["construtoras", "escritorios-de-contabilidade", "empresas-de-reforma", "escolas-de-idiomas"],
  },
];

export function getServiceBySlug(slug?: string): ServicePageData | undefined {
  return servicePages.find((s) => s.slug === slug);
}
