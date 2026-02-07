import en from "./locales/en.json";

// All supported locales
export const locales = [
  "en", "zh-cn", "zh-tw", "ja", "ko", "fr", "de", "it", "es", "es-419", "ru", "pt", "pt-br",
] as const;

export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

// Locale display names (native names for the language switcher)
export const localeNames: Record<Locale, string> = {
  "en": "English",
  "zh-cn": "简体中文",
  "zh-tw": "繁體中文",
  "ja": "日本語",
  "ko": "한국어",
  "fr": "Français",
  "de": "Deutsch",
  "it": "Italiano",
  "es": "Español",
  "es-419": "Español (LA)",
  "ru": "Русский",
  "pt": "Português",
  "pt-br": "Português (BR)",
};

// Lazy-load translation files
const translationModules: Record<string, () => Promise<Record<string, string>>> = {
  "en": () => import("./locales/en.json").then((m) => m.default),
  "zh-cn": () => import("./locales/zh-cn.json").then((m) => m.default),
  "zh-tw": () => import("./locales/zh-tw.json").then((m) => m.default),
  "ja": () => import("./locales/ja.json").then((m) => m.default),
  "ko": () => import("./locales/ko.json").then((m) => m.default),
  "fr": () => import("./locales/fr.json").then((m) => m.default),
  "de": () => import("./locales/de.json").then((m) => m.default),
  "it": () => import("./locales/it.json").then((m) => m.default),
  "es": () => import("./locales/es.json").then((m) => m.default),
  "es-419": () => import("./locales/es-419.json").then((m) => m.default),
  "ru": () => import("./locales/ru.json").then((m) => m.default),
  "pt": () => import("./locales/pt.json").then((m) => m.default),
  "pt-br": () => import("./locales/pt-br.json").then((m) => m.default),
};

// Cache loaded translations
const cache: Partial<Record<Locale, Record<string, string>>> = {
  en: en as Record<string, string>,
};

/** Load translations for a locale (with English fallback) */
export async function loadTranslations(locale: Locale): Promise<Record<string, string>> {
  if (cache[locale]) return cache[locale]!;
  try {
    const translations = await translationModules[locale]();
    cache[locale] = translations;
    return translations;
  } catch {
    // Fallback to English if locale file doesn't exist yet
    return en as Record<string, string>;
  }
}

/** Get a translated string. Falls back to English if key is missing. */
export function t(translations: Record<string, string>, key: string, params?: Record<string, string>): string {
  let value = translations[key] ?? (en as Record<string, string>)[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(`{${k}}`, v);
    }
  }
  return value;
}

/** Extract locale from a URL pathname */
export function getLocaleFromUrl(pathname: string): Locale {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && (locales as readonly string[]).includes(first)) {
    return first as Locale;
  }
  return defaultLocale;
}

/** Convert a URL to a different locale */
export function getLocalizedUrl(pathname: string, targetLocale: Locale): string {
  const currentLocale = getLocaleFromUrl(pathname);

  // Strip current locale prefix if present
  let stripped = pathname;
  if (currentLocale !== defaultLocale) {
    stripped = pathname.replace(`/${currentLocale}`, "") || "/";
  }

  // Add target locale prefix (unless it's the default)
  if (targetLocale === defaultLocale) {
    return stripped;
  }
  return `/${targetLocale}${stripped}`;
}

/** Get the date locale string for Intl formatting */
export function getDateLocale(locale: Locale): string {
  const map: Record<string, string> = {
    "en": "en-US",
    "zh-cn": "zh-CN",
    "zh-tw": "zh-TW",
    "ja": "ja-JP",
    "ko": "ko-KR",
    "fr": "fr-FR",
    "de": "de-DE",
    "it": "it-IT",
    "es": "es-ES",
    "es-419": "es-419",
    "ru": "ru-RU",
    "pt": "pt-PT",
    "pt-br": "pt-BR",
  };
  return map[locale] || "en-US";
}

/** Extract slug from a locale-prefixed article ID (e.g. "en/evogp" → "evogp") */
export function getArticleSlug(id: string): string {
  const slash = id.indexOf("/");
  return slash >= 0 ? id.slice(slash + 1) : id;
}

/** Pick locale-specific articles with English fallback. Returns articles with a `slug` field. */
export function getLocalizedArticles<T extends { id: string }>(
  allArticles: T[],
  locale: Locale,
): (T & { slug: string })[] {
  const enArticles = allArticles.filter((a) => a.id.startsWith("en/"));
  const localeArticles = locale === defaultLocale
    ? []
    : allArticles.filter((a) => a.id.startsWith(`${locale}/`));

  return enArticles.map((enArticle) => {
    const slug = getArticleSlug(enArticle.id);
    const localeArticle = localeArticles.find((a) => a.id === `${locale}/${slug}`);
    const picked = localeArticle || enArticle;
    return { ...picked, slug };
  });
}

/** Find a single article by slug for a given locale, with English fallback. */
export function findLocalizedArticle<T extends { id: string }>(
  allArticles: T[],
  slug: string,
  locale: Locale,
): (T & { slug: string }) | undefined {
  const localeArticle = allArticles.find((a) => a.id === `${locale}/${slug}`);
  const enArticle = localeArticle || allArticles.find((a) => a.id === `en/${slug}`);
  return enArticle ? { ...enArticle, slug } : undefined;
}
