"""Audit localized blog sources against the production HTML and sitemap.

Run after pnpm build. Uses only the Python standard library.
"""
import json
import re
import sys
import xml.etree.ElementTree as ET
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
SITE = "https://www.evox.group"
LOCALES = ["en", "zh-cn", "zh-tw", "ja", "ko", "fr", "de", "it", "es", "es-419", "ru", "pt", "pt-br"]
LANG = {locale: locale for locale in LOCALES} | {"zh-cn": "zh-CN", "zh-tw": "zh-TW", "pt-br": "pt-BR"}
HREFLANG = LANG | {"es": "es-ES", "es-419": "es"}
ERRORS = []


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.tags = []
        self.title = ""
        self.json_blocks = []
        self.capture = None
        self.buffer = ""
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        self.tags.append((tag, values))
        if tag == "title" or (tag == "script" and values.get("type") == "application/ld+json"):
            self.capture, self.buffer = tag, ""

    def handle_data(self, data):
        if self.capture:
            self.buffer += data

    def handle_endtag(self, tag):
        if tag == self.capture:
            if tag == "title":
                self.title = self.buffer
            else:
                self.json_blocks.append(json.loads(self.buffer))
            self.capture = None

    def find(self, tag, **attrs):
        return [values for name, values in self.tags if name == tag and all(values.get(k) == v for k, v in attrs.items())]

    def meta(self, key):
        return [values.get("content") for tag, values in self.tags if tag == "meta" and (values.get("name") == key or values.get("property") == key)]


def check(condition, route, message):
    if not condition:
        ERRORS.append({"route": route, "issue": message})


def read_source(file):
    text = file.read_text(encoding="utf-8-sig")
    match = re.match(r"---\n(.*?)\n---\n(.*)", text, re.S)
    if not match:
        raise ValueError(f"Invalid frontmatter: {file}")
    fields = {}
    for line in match[1].splitlines():
        key, sep, value = line.partition(":")
        if not sep:
            continue
        value = value.strip()
        if value.startswith('"'):
            value = json.loads(value)
        elif value.startswith("'"):
            value = value[1:-1].replace("''", "'")
        fields[key] = value
    return fields, match[2].strip()


def route_for(kind, slug, locale):
    return ("" if locale == "en" else f"/{locale}") + f"/{kind}/{slug.lower()}"


namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
sitemap = {}
for file in DIST.glob("sitemap-*.xml"):
    for element in ET.parse(file).findall("s:url", namespace):
        sitemap[element.findtext("s:loc", namespaces=namespace)] = element.findtext("s:lastmod", namespaces=namespace)

rows, pages, schema_images, updated = [], {}, 0, 0
for kind in ["news", "releases"]:
    for directory in sorted((ROOT / "src/content" / kind).iterdir()):
        if not directory.is_dir() or not (directory / "en.md").exists():
            continue
        english, english_body = read_source(directory / "en.md")
        row = {"article": f"{kind}/{directory.name}", "locales": [], "updatedDate": english.get("updatedDate"), "pages": []}
        for locale in LOCALES:
            route = route_for(kind, directory.name, locale)
            source = directory / f"{locale}.md"
            check(source.exists(), route, "Missing translation source")
            if not source.exists():
                continue
            fields, body = read_source(source)
            row["locales"].append(locale)
            check(bool(fields.get("title")) and bool(fields.get("summary")), route, "Missing localized title/summary")
            check(fields.get("pubDate") == english.get("pubDate"), route, "Publication dates differ")
            check(fields.get("updatedDate") == english.get("updatedDate"), route, "Revision dates differ")
            check(locale == "en" or body != english_body, route, "Body duplicates English rather than a translation")
            html_file = DIST / route.lstrip("/") / "index.html"
            check(html_file.exists(), route, "Missing built article")
            if not html_file.exists():
                continue
            page = Page(html_file.read_text(encoding="utf-8"))
            pages[route] = page
            url = SITE + route
            check(page.title == fields["title"], route, "Title differs from localized source")
            check(page.meta("description") == [fields["summary"]], route, "Description differs from localized source")
            check(len(page.find("h1")) == 1, route, "Expected exactly one H1")
            check(page.find("html")[0].get("lang") == LANG[locale], route, "Wrong HTML language")
            check([x.get("href") for x in page.find("link", rel="canonical")] == [url], route, "Wrong canonical")
            alternates = page.find("link", rel="alternate")
            expected = {HREFLANG[l]: SITE + route_for(kind, directory.name, l) for l in LOCALES}
            expected["x-default"] = SITE + route_for(kind, directory.name, "en")
            check(len(alternates) == len(expected) and {x.get("hreflang"): x.get("href") for x in alternates} == expected, route, "Incomplete or incorrect hreflang cluster")
            check(not any("noindex" in (x or "").lower() for x in page.meta("robots")), route, "Article is noindex")
            check(url in sitemap, route, "Article absent from sitemap")
            for key, value in {"og:title": fields["title"], "og:description": fields["summary"], "og:url": url, "og:type": "article", "twitter:title": fields["title"], "twitter:description": fields["summary"], "twitter:card": "summary_large_image"}.items():
                check(page.meta(key) == [value], route, f"Incorrect {key}")
            image = page.meta("og:image")
            check(len(image) == 1 and page.meta("twitter:image") == image, route, "Missing or inconsistent social image")
            if image:
                image_url = urlparse(image[0])
                check(image_url.scheme == "https" and image_url.netloc == "www.evox.group", route, "Social image is not an absolute site URL")
                check((DIST / unquote(image_url.path).lstrip("/")).is_file(), route, "Social image asset missing")
            graph = [node for block in page.json_blocks for node in block.get("@graph", [block])]
            articles = [node for node in graph if node.get("@type") == "BlogPosting"]
            check(len(articles) == 1, route, "Missing/duplicate BlogPosting")
            if articles:
                article = articles[0]
                check(article.get("headline") == fields["title"] and article.get("description") == fields["summary"], route, "Schema text differs from source")
                check(article.get("inLanguage") == LANG[locale] and article.get("mainEntityOfPage", {}).get("@id") == url, route, "Wrong schema language/URL")
                check(article.get("datePublished", "").startswith(fields["pubDate"]), route, "Wrong schema publication date")
                check(bool(article.get("publisher", {}).get("@id")), route, "Missing publisher")
                if article.get("image"):
                    schema_images += 1
                    check(article["image"] == image, route, "Schema/social image mismatch")
                if fields.get("updatedDate"):
                    updated += 1
                    check(article.get("dateModified", "").startswith(fields["updatedDate"]), route, "Missing/wrong schema revision date")
                    check(page.meta("article:modified_time") == [article.get("dateModified")], route, "Wrong Open Graph revision date")
                    check((sitemap.get(url) or "").startswith(fields["updatedDate"]), route, "Wrong sitemap lastmod")
            breadcrumbs = [node for node in graph if node.get("@type") == "BreadcrumbList"]
            check(len(breadcrumbs) == 1 and breadcrumbs[0]["itemListElement"][-1]["item"] == url, route, "Missing/wrong breadcrumbs")
            row["pages"].append({"locale": locale, "route": route, "titleCharacters": len(fields["title"]), "descriptionCharacters": len(fields["summary"])})
        rows.append(row)

# Verify actual reciprocal links, not just the number of annotations.
for route, page in pages.items():
    for alternate in page.find("link", rel="alternate"):
        target = urlparse(alternate["href"]).path
        check(target in pages, route, f"Missing alternate destination: {target}")
        if target in pages:
            check(SITE + route in [x.get("href") for x in pages[target].find("link", rel="alternate")], route, f"Missing reciprocal link from {target}")

excluded = 0
for file in DIST.rglob("index.html"):
    relative = file.relative_to(DIST).as_posix()
    if "preview/" not in relative:
        continue
    page = Page(file.read_text(encoding="utf-8"))
    route = "/" + relative.removesuffix("/index.html")
    check(page.meta("robots") == ["noindex"], route, "Preview must stay noindex")
    check(not page.find("link", rel="canonical") and not page.json_blocks, route, "Preview exposes indexable metadata")
    check(SITE + route not in sitemap, route, "Preview appears in sitemap")
    excluded += 1
robots = (DIST / "robots.txt").read_text(encoding="utf-8")
check("Allow: /" in robots and "Disallow: /" not in robots and SITE + "/sitemap-index.xml" in robots, "/robots.txt", "Wrong crawler rules/sitemap URL")
report = {
    "scope": "Local production build; no deployment or search-engine indexing verification",
    "counts": {"articles": len(rows), "byCollection": dict(Counter(row["article"].split("/")[0] for row in rows)), "locales": len(LOCALES), "pages": len(pages), "updatedPages": updated, "articleImages": schema_images, "previewPagesExcluded": excluded},
    "errors": ERRORS,
    "notes": ["English-body equality catches missing translations, but is not a full linguistic quality evaluation.", "Text-only articles retain the site social card; no invented article illustration or author is added to structured data.", "Titles/descriptions have no hard character cutoff; their lengths are recorded for editorial review.", "HTML es-419 remains valid BCP 47; hreflang uses es-ES for Spain and es for the Latin American/general Spanish edition.", "Indexing, search rankings, Search Console and Core Web Vitals are outside this local audit."],
    "references": ["https://developers.google.com/search/docs/specialty/international/localized-versions", "https://developers.google.com/search/docs/appearance/structured-data/article"],
    "articles": rows,
}
(ROOT / "docs/blog-seo-audit.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"counts": report["counts"], "errors": ERRORS}, ensure_ascii=False, indent=2))
sys.exit(bool(ERRORS))
