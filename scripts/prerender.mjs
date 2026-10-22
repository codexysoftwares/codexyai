import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");
const ssrEntryPath = path.resolve(__dirname, "../dist-ssr/entry-server.js");
const templatePath = path.join(distDir, "index.html");

const { render, prerenderRoutes } = await import(pathToFileURL(ssrEntryPath).href);
const template = fs.readFileSync(templatePath, "utf-8");

// Tags that exist once in index.html for the homepage; each prerendered
// route injects its own version of these, so the generic ones must go first.
const STATIC_TAG_PATTERNS = [
  /<title>[\s\S]*?<\/title>\n?/,
  /<meta name="description"[^>]*>\n?/,
  /<meta name="keywords"[^>]*>\n?/,
  /<meta property="og:[^>]*>\n?/g,
  /<meta name="twitter:[^>]*>\n?/g,
  /<link rel="canonical"[^>]*>\n?/,
];

function stripStaticHeadTags(html) {
  return STATIC_TAG_PATTERNS.reduce((result, pattern) => result.replace(pattern, ""), html);
}

const seenTitles = new Map();
const seenDescriptions = new Map();
const seenCanonicals = new Map();

function validateUniqueMetadata(pageHtml, route) {
  const titleMatches = [...pageHtml.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/g)];
  const descriptionMatches = [
    ...pageHtml.matchAll(/<meta[^>]*name="description"[^>]*content="([^"]*)"/g),
  ];
  const canonicalMatches = [
    ...pageHtml.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/g),
  ];
  const title = titleMatches[0]?.[1]?.trim();
  const description = descriptionMatches[0]?.[1]?.trim();

  if (titleMatches.length !== 1 || descriptionMatches.length !== 1 || !title || !description) {
    throw new Error(`Expected exactly one title and meta description for ${route}`);
  }

  if (pageHtml.includes('<div id="root"></div>')) {
    throw new Error(`Missing static HTML content for ${route}`);
  }

  for (const requiredMeta of ["og:title", "og:description", "twitter:title", "twitter:description"]) {
    const attribute = requiredMeta.startsWith("og:") ? "property" : "name";
    const pattern = new RegExp(`<meta[^>]*${attribute}="${requiredMeta}"[^>]*content="[^"]+"`);

    if (!pattern.test(pageHtml)) {
      throw new Error(`Missing ${requiredMeta} metadata for ${route}`);
    }
  }

  for (const [label, value, registry] of [
    ["title", title, seenTitles],
    ["meta description", description, seenDescriptions],
  ]) {
    const existingRoute = registry.get(value);

    if (existingRoute) {
      throw new Error(`Duplicate ${label} for ${existingRoute} and ${route}: ${value}`);
    }

    registry.set(value, route);
  }

  if (route === "/404") {
    if (!/<meta[^>]*name="robots"[^>]*content="noindex, nofollow"/.test(pageHtml)) {
      throw new Error("The static 404 page must include noindex, nofollow");
    }

    if (canonicalMatches.length > 0) {
      throw new Error("The static 404 page must not include a canonical URL");
    }

    return;
  }

  const canonical = canonicalMatches[0]?.[1]?.trim();

  if (canonicalMatches.length !== 1 || !canonical) {
    throw new Error(`Expected exactly one canonical URL for ${route}`);
  }

  const existingCanonicalRoute = seenCanonicals.get(canonical);

  if (existingCanonicalRoute) {
    throw new Error(`Duplicate canonical for ${existingCanonicalRoute} and ${route}: ${canonical}`);
  }

  seenCanonicals.set(canonical, route);
}

for (const route of prerenderRoutes) {
  const { html, helmet } = render(route);

  const headTags = [
    helmet?.title.toString(),
    helmet?.meta.toString(),
    helmet?.link.toString(),
    helmet?.script.toString(),
  ]
    .filter(Boolean)
    .join("\n    ");

  const pageHtml = stripStaticHeadTags(template)
    .replace("</head>", `    ${headTags}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  validateUniqueMetadata(pageHtml, route);

  const outDir = path.join(distDir, route.replace(/^\//, ""));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), pageHtml, "utf-8");

  // Static hosts use /404.html as the fallback while /404/ remains directly accessible.
  if (route === "/404") {
    fs.writeFileSync(path.join(distDir, "404.html"), pageHtml, "utf-8");
  }

  console.log(`Prerendered ${route} -> dist${route}/index.html`);
}

console.log(`Validated unique metadata for ${prerenderRoutes.length} static pages`);
