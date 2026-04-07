---
name: translate
description: Translate a markdown content article to all supported locales or a specific locale using the EvoX project documentation guidelines. Use when the user asks to translate an article, providing the path to the English source markdown file.
---

# Translate Content

Translate a content article to all supported locales or a specific locale.

## Usage
- `/translate <path-to-en.md>` — translate the English source to all other locales
- `/translate <path-to-en.md> zh-cn` — translate to a specific locale only
- `/translate <path-to-en.md> zh-cn,ja,ko` — translate to specific locales

## Instructions

You are a professional translator for the EvoX project documentation. This project is about evolutionary computation, GPU-accelerated optimization, and related AI/ML topics.

### Step 1: Determine the source file and target locales

The user provides the arguments. Parse it as:
- First argument: path to the English source markdown file (e.g. `src/content/news/evogp/en.md`)
- Optional second argument: comma-separated locale codes to translate to

If no locale is specified, translate to ALL of these locales:
`zh-cn, zh-tw, ja, ko, fr, de, it, es, es-419, ru, pt, pt-br`

### Step 2: Read the source file

Read the English source file. Understand the full content including frontmatter (title, pubDate, summary, order, section — whatever fields exist).

### Step 3: Translate

For each target locale, create a translated version following these rules:

1. **Frontmatter**: Translate `title` and `summary` fields. Keep all other fields (pubDate, order, section, etc.) exactly the same.
2. **Body content**: Translate the full markdown body naturally and accurately.
3. **Technical terms**: Keep technical terms, project names, library names, and code in English. Examples: EvoX, EvoGP, PyTorch, CUDA, GPU, CPU, TGP, NSGA-II, Brax, JAX, pip, conda.
4. **URLs and links**: Keep all URLs unchanged. Translate link text if it's descriptive.
5. **Markdown formatting**: Preserve all markdown formatting exactly (headers, bold, italic, lists, code blocks, images).
6. **Image paths**: In markdown image syntax such as `![alt text](/image/path/example.png)`, you may translate the alt text when appropriate, but you must keep the entire path inside parentheses exactly unchanged, including the filename, extension, and any query/hash suffix. Do not translate or modify image references.
7. **Natural tone**: Write naturally in each target language, not word-for-word translation. The text should read as if originally written in that language.

### Locale-specific guidelines:
- **zh-cn** (Simplified Chinese): Use mainland China conventions
- **zh-tw** (Traditional Chinese): Use Taiwan conventions and traditional characters
- **ja** (Japanese): Use appropriate mix of kanji, hiragana, katakana
- **ko** (Korean): Use native Korean terms where natural
- **fr** (French): Use formal "vous" form
- **de** (German): Use formal "Sie" form
- **it** (Italian): Use formal "Lei" form
- **es** (Spanish): Use Spain Spanish conventions
- **es-419** (Latin American Spanish): Use Latin American conventions
- **ru** (Russian): Use formal style
- **pt** (Portuguese): Use Portugal Portuguese
- **pt-br** (Brazilian Portuguese): Use Brazilian conventions

### Step 4: Write the translated files

Write each translated file to the same directory as the source file, named `{locale}.md`.
For example, if the source is `src/content/news/evogp/en.md`, write translations to:
- `src/content/news/evogp/zh-cn.md`
- `src/content/news/evogp/ja.md`
- etc.

If a translation file already exists, overwrite it with the new translation.

### Step 5: Report

After all translations are complete, report:
- How many files were translated
- Which locales were covered
- Any issues encountered (e.g., ambiguous terms)
