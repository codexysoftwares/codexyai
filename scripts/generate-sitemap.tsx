import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { landingPages } from "../src/data/landingPages";
import { blogPosts } from "../src/data/blogPosts";
import { servicePages } from "../src/data/services";
import { segments } from "../src/data/segments";

const SITE_URL = "https://codexy.com.br";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");

type SitemapRoute = { path: string; priority: string; lastmod?: string };

// Data fixa da última revisão real do conteúdo (não a do build: lastmod que muda
// a cada deploy perde credibilidade com o Google). Atualizar ao revisar o texto.
const BUILD_DATE = "2026-11-09";

const staticRoutes: SitemapRoute[] = [
  { path: "/", priority: "1.0", lastmod: BUILD_DATE },
  { path: "/servicos/", priority: "0.9", lastmod: BUILD_DATE },
  ...servicePages.map((service) => ({
    path: `/servicos/${service.slug}/`,
    priority: "0.9",
    lastmod: BUILD_DATE,
  })),
  { path: "/segmentos/", priority: "0.8", lastmod: BUILD_DATE },
  ...segments.map((segment) => ({
    path: `/segmentos/${segment.slug}/`,
    priority: "0.7",
    lastmod: BUILD_DATE,
  })),
  { path: "/politica-privacidade/", priority: "0.3" },
  { path: "/termos-uso/", priority: "0.3" },
  { path: "/cookies/", priority: "0.3" },
  { path: "/parceiros/doctorchatbot/", priority: "0.8" },
];

const blogRoutes = [
  { path: "/blog/", priority: "0.6" },
  ...blogPosts.map((post) => ({
    path: `/blog/${post.slug}/`,
    priority: "0.6",
    lastmod: post.publishedAt,
  })),
];

const landingRoutes = landingPages.map((page) => ({
  path: `/informacoes/${page.slug}/`,
  priority: "0.8",
  lastmod: page.updatedAt,
}));

const urls = [...staticRoutes, ...landingRoutes, ...blogRoutes]
  .map(
    ({ path: routePath, priority, lastmod }) => `  <url>
    <loc>${SITE_URL}${routePath}</loc>
${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap, "utf-8");
console.log(`Generated sitemap.xml with ${staticRoutes.length + landingRoutes.length + blogRoutes.length} URLs`);
