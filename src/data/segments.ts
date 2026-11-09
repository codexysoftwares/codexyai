import { landingPages, type LandingPageData } from "./landingPages";

/**
 * Hubs por segmento (/segmentos/ e /segmentos/<nicho>/).
 *
 * As páginas de nicho × cidade só se ligavam entre si e a uma cidade por
 * nicho na home; o Search Console as mostrava como "detectada, mas não
 * indexada". Cada hub reúne todas as cidades de um nicho, agrupadas por UF,
 * e dá ao rastreador um caminho curto e permanente (home → hub → cidade).
 * Derivado de `landingPages`: nicho ou cidade novos entram sozinhos.
 */

export interface SegmentCity {
  slug: string;
  label: string;
  uf: string;
  pageSlug: string;
}

export interface SegmentData {
  slug: string;
  name: string;
  /** Página-modelo do nicho (textos de dor/benefício compartilhados). */
  sample: LandingPageData;
  cities: SegmentCity[];
  /** Cidades agrupadas por UF, em ordem alfabética de UF e de cidade. */
  byUf: { uf: string; cities: SegmentCity[] }[];
}

function build(): SegmentData[] {
  const map = new Map<string, SegmentData>();

  for (const page of landingPages) {
    let segment = map.get(page.nicheSlug);
    if (!segment) {
      segment = { slug: page.nicheSlug, name: page.niche, sample: page, cities: [], byUf: [] };
      map.set(page.nicheSlug, segment);
    }
    segment.cities.push({
      slug: page.locationSlug,
      label: page.stateLabel,
      uf: page.stateUf,
      pageSlug: page.slug,
    });
  }

  const collator = new Intl.Collator("pt-BR");
  const segments = [...map.values()];
  for (const segment of segments) {
    segment.cities.sort((a, b) => collator.compare(a.label, b.label));
    const ufs = new Map<string, SegmentCity[]>();
    for (const city of segment.cities) {
      ufs.set(city.uf, [...(ufs.get(city.uf) ?? []), city]);
    }
    segment.byUf = [...ufs.entries()]
      .sort(([a], [b]) => collator.compare(a, b))
      .map(([uf, cities]) => ({ uf, cities }));
  }

  return segments.sort((a, b) => collator.compare(a.name, b.name));
}

export const segments: SegmentData[] = build();

export function getSegmentBySlug(slug?: string): SegmentData | undefined {
  return segments.find((s) => s.slug === slug);
}
