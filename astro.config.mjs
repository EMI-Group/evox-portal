// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

import vercel from "@astrojs/vercel";

const isVercelDeployment = process.env.VERCEL === "1" || process.env.VERCEL === "true";

// https://astro.build/config
export default defineConfig({
  site: "https://www.evox.group",

  devToolbar: { enabled: false },

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

  integrations: [icon()],
  adapter: vercel({
    webAnalytics: {
      enabled: isVercelDeployment,
    },
  }),
});
