---
trigger: always_on
---

# Generated translation files

- Treat every file under `priv/gettext/` as automatically generated output.
- Do not manually edit, regenerate, stage, or include changes under that path in pull requests unless the user explicitly overrides this rule.
- If a task produces changes under `priv/gettext/`, discard only those generated changes before committing. Preserve all unrelated work.
- This rule also applies if the directory is introduced in a future update.
