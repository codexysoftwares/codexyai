import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { AppProviders, AppRoutes } from "./App";
import { landingPages } from "./data/landingPages";
import { blogPosts } from "./data/blogPosts";
import { servicePages } from "./data/services";
import { segments } from "./data/segments";

export const prerenderRoutes = [
  "/",
  "/politica-privacidade",
  "/termos-uso",
  "/cookies",
  "/servicos",
  ...servicePages.map((service) => `/servicos/${service.slug}`),
  "/segmentos",
  ...segments.map((segment) => `/segmentos/${segment.slug}`),
  ...landingPages.map((page) => `/informacoes/${page.slug}`),
  "/blog",
  ...blogPosts.map((post) => `/blog/${post.slug}`),
  "/parceiros/doctorchatbot",
  "/preview/melhorada",
  "/preview/console",
  "/preview/vitrine",
  "/preview/despacho",
  "/preview/cinematic",
  "/preview/melhorada-spotlight",
  "/preview/melhorada-bento",
  "/preview/melhorada-split",
  "/preview/cinematic-horizontal",
  "/preview/cinematic-textreveal",
  "/preview/cinematic-parallax",
  "/404",
];

// React warns about useLayoutEffect on the server (Radix/shadcn components use it);
// Server rendering never runs effects, so the warning is noise, not a real issue.
React.useLayoutEffect = React.useEffect;

export function render(url: string) {
  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <AppProviders>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </AppProviders>
    </HelmetProvider>
  );

  return { html, helmet: helmetContext.helmet };
}
