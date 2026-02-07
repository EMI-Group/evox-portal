// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
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
      enabled: true,
    },
  }),
});
