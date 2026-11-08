// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

import vercel from "@astrojs/vercel";
import { getArticleUpdateDates } from "./scripts/article-update-dates.mjs";

const isVercelDeployment = process.env.VERCEL === "1" || process.env.VERCEL === "true";
const articleUpdateDates = getArticleUpdateDates();

// https://astro.build/config
export default defineConfig({
  site: "https://www.evox.group",

  devToolbar: { enabled: false },
  markdown: {
    shikiConfig: { themes: { light: "github-light", dark: "github-dark" } },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    locales: [
      "en", "zh-cn", "zh-tw", "ja", "ko", "fr", "de", "it", "es",
      { path: "es-419", codes: ["es-419"] },
      "ru", "pt",
      { path: "pt-br", codes: ["pt-br"] },
    ],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [icon(), sitemap({
    // Preview and error pages remain crawlable so their noindex can be read.
    filter: (page) => !/(?:^|\/)(?:preview|404)(?:\/|$)/.test(new URL(page).pathname),
    serialize: (item) => ({
      ...item,
      url: new URL(item.url).pathname === "/" ? item.url : item.url.replace(/\/$/, ""),
      lastmod: articleUpdateDates.get(new URL(item.url).pathname.replace(/\/$/, "")),
    }),
  })],
  adapter: vercel({
    webAnalytics: {
      enabled: isVercelDeployment,
    },
  }),
});
