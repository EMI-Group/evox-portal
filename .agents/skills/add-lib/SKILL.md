---
name: add-lib
description: Creates a new library entry in src/content/libs.json based on a GitHub URL and adds corresponding description terms to all i18n locale files. Use when adding a new repository to the libraries collection.
---

# Add Lib

This skill guides the agent through the manual process of adding a new library to the EvoX Ecosystem by parsing its GitHub URL and updating the necessary files.

## Constraints

- **NO SCRIPTS**: You are strictly prohibited from writing or executing scripts (such as Python, Node.js, or Bash scripts) to update the JSON or locale files. You must manually open and update each necessary file using file editing tools (like `replace_file_content`).

## Workflow

When the user asks to add a new library using a GitHub URL:

1. **Fetch Repository Metadata:**
   Extract the owner and repository name from the provided GitHub URL. Do not use the GitHub API to fetch metadata as it is prone to rate limits. Instead, directly read the repository's content (such as its `README.md` file by fetching the raw URL: `https://raw.githubusercontent.com/<owner>/<repo>/main/README.md` or `master/README.md`) to understand its purpose.
   Extract a suitable `name` and a concise `description` from the README. If no description is provided, use a fallback (e.g., "No description provided."). The library `id` should be the repository name converted to lowercase.

2. **Update `src/content/libs.json`:**
   Read `src/content/libs.json` and append a new JSON object to the array. The object should have the following structure:
   ```json
   {
     "id": "<id>",
     "title": "<name>",
     "description": "<description>",
     "url": "<github_url>"
   }
   ```
   Ensure the JSON formatting and array structure remain valid.

3. **Update i18n Locale Files:**
   Find all JSON files in the `src/i18n/locales/` directory. For **each** file, insert the new description key-value pair near the existing `libs.desc.*` entries (or at the end of the JSON object):
   `"libs.desc.<id>": "<description>"`
   *Note: Ensure proper JSON syntax (e.g., add a comma to the preceding line).*
   If you are updating non-English locale files (e.g., `zh-cn.json`, `ja.json`), use your translation capabilities to translate the description appropriately for that locale instead of simply pasting the English text.
