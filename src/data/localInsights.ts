// Seção "o que os números do IBGE mostram" de cada página nicho×cidade.
// Search Console (2026-11): 772 páginas /informacoes/ em "Detectada, mas
// não indexada" e o diagnóstico de que eram iguais trocando só a cidade.
// Em vez de cortar páginas, cada uma ganha dado oficial próprio (população,
// região, número de estabelecimentos do setor e comparação com o Brasil e
// com as outras cidades) e texto que muda conforme esses números.
// Os dados vêm de localData.ts, gerado por scripts/fetch-ibge.mjs.
import { LOCAL_DATA, type LocalCity } from "./localData";

export interface LocalInsight {
  heading: string;
  paragraphs: string[];
  facts: { label: string; value: string }[];
  sources: string[];
  faq: { question: string; answer: string }[];
}

type CityData = LocalCity;

export const LOCAL_DATA_UPDATED_AT = "2026-11-09";

const fmt = (n: number, digits = 0) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits });

function city(slug: string): CityData | undefined {
  return LOCAL_DATA.cidades[slug];
}

function sectorUnits(units: Record<string, number | null>, classIds: string[]): number | null {
  let total = 0;
  for (const id of classIds) {
    const v = units[id];
    if (typeof v !== "number") return null;
    total += v;
  }
  return total;
}

function per10k(units: number, population: number): number {
  return (units / population) * 10000;
}

function quoteList(labels: string[]): string {
  const quoted = labels.map((l) => `“${l}”`);
  return quoted.length === 1
    ? `na atividade ${quoted[0]}`
    : `nas atividades ${quoted.slice(0, -1).join(", ")} e ${quoted[quoted.length - 1]}`;
}

function pick<T>(options: T[], seed: number): T {
  return options[seed % options.length];
}

/** Cidades da mesma região intermediária primeiro, depois mesma UF, depois por população. */
export function compareByProximity(origin: string, a: string, b: string): number {
  const o = city(origin);
  const ca = city(a);
  const cb = city(b);
  if (!o || !ca || !cb) return 0;
  const score = (c: CityData) =>
    (c.regiaoIntermediaria === o.regiaoIntermediaria ? 2 : 0) + (c.uf === o.uf ? 1 : 0);
  return score(cb) - score(ca) || cb.populacao - ca.populacao;
}

export function buildLocalInsight(params: {
  nicheSlug: string;
  niche: string;
  citySlug: string;
  cityIn: string;
  seed: number;
}): LocalInsight | undefined {
  const c = city(params.citySlug);
  if (!c) return undefined;
  const nicheLower = params.niche.toLowerCase();
  const sector = LOCAL_DATA.nichos[params.nicheSlug];
  const isPolo = c.regiaoImediata === c.label;
  const paragraphs: string[] = [];
  const facts: LocalInsight["facts"] = [
    { label: "Moradores (Censo 2022)", value: fmt(c.populacao) },
    { label: "Região geográfica imediata", value: c.regiaoImediata },
  ];
  const faq: LocalInsight["faq"] = [];

  // 1. Contexto da cidade
  const where = isPolo
    ? `é o centro da região geográfica imediata que leva o seu nome${
        c.regiaoIntermediaria !== c.label ? `, dentro da região intermediária de ${c.regiaoIntermediaria}` : ""
      }`
    : `faz parte da região geográfica imediata de ${c.regiaoImediata}${
        c.regiaoIntermediaria !== c.regiaoImediata ? `, na região intermediária de ${c.regiaoIntermediaria}` : ""
      }`;
  const scale =
    c.populacao >= 2_000_000
      ? pick([
          `Numa cidade desse tamanho, quem procura ${nicheLower} costuma comparar várias opções antes de decidir, e boa parte dessa comparação acontece por mensagem.`,
          `Para ${nicheLower}, esse volume de moradores significa receber contato de bairros muito diferentes, em horários que nem sempre batem com o expediente.`,
        ], params.seed)
      : c.populacao >= 700_000
        ? pick([
            `Para ${nicheLower}, é um mercado grande o bastante para ter concorrência em quase todo bairro, e pequeno o bastante para a indicação de cliente ainda pesar na escolha.`,
            `Para ${nicheLower}, nesse porte de cidade, quem responde rápido e com informação clara ganha a conversa antes de o cliente procurar outra opção.`,
          ], params.seed)
        : isPolo
          ? `Como polo regional, o setor de ${nicheLower} da cidade também recebe clientes dos municípios vizinhos, que costumam fazer o primeiro contato à distância, por WhatsApp.`
          : `Por estar na região de ${c.regiaoImediata}, quem procura ${nicheLower} pode pesquisar empresas de mais de um município, e quem responde primeiro tende a ficar com a conversa.`;
  paragraphs.push(`${c.label} tem ${fmt(c.populacao)} moradores, segundo o Censo 2022 do IBGE, e ${where}. ${scale}`);

  // 2. Número de estabelecimentos do setor (quando há classe CNAE adequada)
  const classIds = sector?.map((s) => s.id) ?? [];
  const units = sector ? sectorUnits(c.unidades, classIds) : null;
  if (sector && units !== null) {
    const br = sectorUnits(LOCAL_DATA.brasil.unidades, classIds) ?? 0;
    const local = per10k(units, c.populacao);
    const national = per10k(br, LOCAL_DATA.brasil.populacao);
    const ratio = local / national;
    const cmp = ratio >= 1.15 ? "acima" : ratio <= 0.85 ? "abaixo" : "perto";
    const ranking = Object.values(LOCAL_DATA.cidades)
      .map((other) => {
        const u = sectorUnits(other.unidades, classIds);
        return { slug: other.slug, value: u === null ? -1 : per10k(u, other.populacao) };
      })
      .sort((a, b) => b.value - a.value);
    const rank = ranking.findIndex((r) => r.slug === c.slug) + 1;
    const labels = quoteList(sector.map((s) => s.label));
    // Vizinha mais próxima da lista (mesma região intermediária, senão mesma
    // UF): comparação que só faz sentido pra esta cidade.
    const neighbor = Object.values(LOCAL_DATA.cidades)
      .filter((o) => o.slug !== c.slug && (o.regiaoIntermediaria === c.regiaoIntermediaria || o.uf === c.uf))
      .sort((a, b) => compareByProximity(c.slug, a.slug, b.slug))[0];
    const neighborUnits = neighbor ? sectorUnits(neighbor.unidades, classIds) : null;
    const neighborSentence =
      neighbor && neighborUnits !== null
        ? ` Na mesma ${neighbor.regiaoIntermediaria === c.regiaoIntermediaria ? "região" : "UF"}, ${neighbor.label} tem ${fmt(per10k(neighborUnits, neighbor.populacao), 1)} por 10 mil habitantes.`
        : "";

    paragraphs.push(
      `O Cadastro Central de Empresas do IBGE registrava ${fmt(units)} unidades locais ${labels} ${params.cityIn} em 2021. ` +
        `Isso dá cerca de ${fmt(local, 1)} para cada 10 mil habitantes, ${cmp} da média brasileira, de ${fmt(national, 1)}. ` +
        `Entre as ${ranking.length} maiores cidades analisadas pela CODEXY, ${c.label} fica em ${rank}º lugar nessa proporção.${neighborSentence}`
    );
    paragraphs.push(
      cmp === "acima"
        ? pick([
            `Com mais concorrentes por habitante do que a média do país, a velocidade de resposta pesa: quem demora no WhatsApp vê o cliente fechar com o próximo da lista. Um atendimento automático que responde preço, horário e disponibilidade na hora encurta essa espera sem aumentar a equipe.`,
            `Concorrência acima da média significa que o cliente tem para onde ir. O que segura a conversa é resposta rápida e completa logo na primeira mensagem, inclusive à noite e no fim de semana.`,
          ], params.seed)
        : cmp === "abaixo"
          ? pick([
              `Com menos estabelecimentos por habitante do que a média do país, cada empresa tende a atender mais gente. O gargalo costuma ser dar conta do volume de mensagens nos horários de pico sem deixar ninguém sem resposta.`,
              `Proporção abaixo da média costuma significar demanda maior por empresa. Aí o risco não é falta de cliente, é perder pedido porque a mensagem ficou sem resposta no meio do movimento.`,
            ], params.seed)
          : pick([
              `Com uma proporção parecida com a média do país, o diferencial fica no atendimento: responder rápido, deixar claro preço e disponibilidade e não perder conversa fora do horário comercial.`,
              `Numa concorrência dentro da média, pequenos detalhes decidem a escolha, como responder em minutos, confirmar horário sem o cliente precisar insistir e ter as informações principais prontas.`,
            ], params.seed)
    );
    facts.push(
      { label: "Unidades locais do setor (IBGE, 2021)", value: fmt(units) },
      { label: "Por 10 mil habitantes", value: `${fmt(local, 1)} (Brasil: ${fmt(national, 1)})` }
    );
    faq.push({
      question: `Quantas empresas do setor de ${nicheLower} existem ${params.cityIn}?`,
      answer:
        `O Cadastro Central de Empresas do IBGE registrava ${fmt(units)} unidades locais ${labels} ${params.cityIn} em 2021, ` +
        `o dado oficial mais recente por município. A contagem considera estabelecimentos com CNPJ e não inclui quem trabalha só como pessoa física.`,
    });
  }

  faq.push({
    question: `A CODEXY atende ${nicheLower} ${params.cityIn}?`,
    answer:
      c.slug === "belo-horizonte-mg"
        ? `Sim. A CODEXY tem sede em Belo Horizonte (MG), a mesma cidade, e acompanha o projeto do começo ao fim.`
        : `Sim. A CODEXY tem sede em Belo Horizonte (MG) e atende empresas de todo o Brasil: contato, proposta e acompanhamento do projeto são feitos online.`,
  });

  return {
    heading: `${params.niche} ${params.cityIn}: o que os números do IBGE mostram`,
    paragraphs,
    facts,
    sources: [LOCAL_DATA.source.populacao, LOCAL_DATA.source.empresas, LOCAL_DATA.source.regioes],
    faq,
  };
}
