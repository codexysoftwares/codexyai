// Gera src/data/localData.ts com dados oficiais do IBGE por cidade das
// páginas /informacoes/: população (Censo 2022, agregado 4709), região
// imediata/intermediária (API de localidades) e número de unidades locais
// por classe CNAE (Cadastro Central de Empresas 2021, agregado 6450), usado
// por src/data/localInsights.ts. As cidades saem de BRAZILIAN_CITIES em
// landingPages.ts; o mapa nicho -> classe CNAE fica em scripts/niche-cnae.json
// (nicho sem classe adequada no IBGE fica fora, e a página mostra só os dados
// da cidade).
//
// A API do IBGE não responde a partir da VPS (conexão expira, provável
// bloqueio de IP estrangeiro), então o script roda numa máquina no Brasil e
// já inclui as próximas cidades da fila do add-cities-batch.mjs, pra cidade
// nova entrar no site com os dados prontos:
//   node scripts/fetch-ibge.mjs --fila ../niche-generator/cities_100k.json --proximas 30
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (name) => { const i = process.argv.indexOf(name); return i === -1 ? undefined : process.argv[i + 1]; };
const landing = readFileSync(join(root, "src/data/landingPages.ts"), "utf8");
const cityBlockStart = landing.indexOf("const BRAZILIAN_CITIES");
const cityBlock = landing.slice(cityBlockStart, landing.indexOf("}));", cityBlockStart));
const cities = [...cityBlock.matchAll(/label: "([^"]+)", uf: "([A-Z]{2})"/g)].map((m) => ({ label: m[1], uf: m[2] }));
if (arg("--fila")) {
  const queue = JSON.parse(readFileSync(arg("--fila"), "utf8")); // [[label, uf, população]], por população
  const have = new Set(cities.map((c) => `${c.label}|${c.uf}`));
  const next = queue.filter(([label, uf]) => !have.has(`${label}|${uf}`)).slice(0, Number(arg("--proximas") ?? 30));
  cities.push(...next.map(([label, uf]) => ({ label, uf })));
}
const nicheMap = JSON.parse(readFileSync(join(root, "scripts/niche-cnae.json"), "utf8"));
const outPath = join(root, "src/data/localData.ts");

const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
const slugify = (s) => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function getJson(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url);
    if (res.ok) return res.json();
    if (attempt === 3) throw new Error(`${res.status} ${url}`);
    await new Promise((r) => setTimeout(r, 1500 * attempt));
  }
}

// 1. código IBGE + regiões, por UF
const byUf = {};
for (const uf of [...new Set(cities.map((c) => c.uf))]) {
  byUf[uf] = await getJson(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
}
const resolved = cities.map((c) => {
  const m = byUf[c.uf].find((x) => norm(x.nome) === norm(c.label));
  if (!m) throw new Error(`município não encontrado: ${c.label}/${c.uf}`);
  const ri = m["regiao-imediata"];
  return {
    slug: `${slugify(c.label)}-${c.uf.toLowerCase()}`,
    label: c.label,
    uf: c.uf,
    ibge: m.id,
    regiaoImediata: ri?.nome,
    regiaoIntermediaria: ri?.["regiao-intermediaria"]?.nome,
  };
});
const codes = resolved.map((c) => c.ibge);

// 2. população Censo 2022
const pop = await getJson(
  `https://servicodados.ibge.gov.br/api/v3/agregados/4709/periodos/2022/variaveis/93?localidades=N6[${codes.join(",")}]|N1[all]`
);
const popBy = {};
for (const s of pop[0].resultados[0].series) popBy[s.localidade.id] = Number(s.serie["2022"]);

// 3. unidades locais por classe CNAE (CEMPRE 2021)
const classIds = [...new Set(Object.values(nicheMap).flat().map((c) => c.id))];
const cempre = {};
for (let i = 0; i < classIds.length; i += 10) {
  const chunk = classIds.slice(i, i + 10);
  const data = await getJson(
    `https://servicodados.ibge.gov.br/api/v3/agregados/6450/periodos/2021/variaveis/706?localidades=N6[${codes.join(",")}]|N1[all]&classificacao=12762[${chunk.join(",")}]`
  );
  for (const r of data[0].resultados) {
    const classId = Object.keys(r.classificacoes[0].categoria)[0];
    for (const s of r.series) {
      const v = s.serie["2021"];
      (cempre[s.localidade.id] ??= {})[classId] = /^\d+$/.test(v) ? Number(v) : null;
    }
  }
}

const out = {
  source: {
    populacao: "IBGE, Censo Demográfico 2022 (tabela 4709)",
    empresas: "IBGE, Cadastro Central de Empresas 2021 (tabela 6450), número de unidades locais",
    regioes: "IBGE, divisão regional em regiões geográficas imediatas e intermediárias (2017)",
  },
  brasil: { populacao: popBy["1"], unidades: cempre["1"] },
  cidades: Object.fromEntries(resolved.map((c) => [c.slug, { ...c, populacao: popBy[c.ibge], unidades: cempre[c.ibge] ?? {} }])),
  nichos: nicheMap,
};
const header = `// Gerado por scripts/fetch-ibge.mjs a partir das APIs públicas do IBGE
// (não editar à mão; rodar o script de novo pra atualizar).
export interface LocalCity {
  slug: string;
  label: string;
  uf: string;
  ibge: number;
  regiaoImediata: string;
  regiaoIntermediaria: string;
  populacao: number;
  /** unidades locais por id de classe CNAE (tabela 6450); null = dado suprimido */
  unidades: Record<string, number | null>;
}

export interface LocalDataset {
  source: { populacao: string; empresas: string; regioes: string };
  brasil: { populacao: number; unidades: Record<string, number | null> };
  cidades: Record<string, LocalCity>;
  /** nicheSlug -> classes CNAE usadas na contagem do setor */
  nichos: Record<string, { id: string; label: string }[]>;
}

export const LOCAL_DATA: LocalDataset = `;
writeFileSync(outPath, header + JSON.stringify(out, null, 2) + ";\n");
const missing = resolved.filter((c) => !popBy[c.ibge]).map((c) => c.slug);
console.log(`cidades: ${resolved.length}, sem população: ${missing.length ? missing.join(",") : 0}, classes: ${classIds.length}`);
