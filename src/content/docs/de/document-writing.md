---
title: "Leitfaden zum Schreiben von Dokumentation"
order: 7
section: "developer"
---

# Leitfaden zum Schreiben von Dokumentation

Dieser Leitfaden beschreibt Best Practices für das Schreiben und Pflegen von Dokumentation im gesamten Codebase und in ergänzenden Dateien.

---

## Code-interne Dokumentation (Docstrings)

Docstrings sind essenziell für das Verständnis des Zwecks, der Verwendung und des Verhaltens Ihres Codes. Bitte halten Sie sich an die folgenden Konventionen:

### Allgemeine Regeln

- Dokumentieren Sie **alle öffentlichen Klassen, Methoden und Funktionen** mit Docstrings.
- Verwenden Sie Docstrings im **Sphinx-Stil**.
- Fügen Sie **keine** Parametertypen in den Docstring ein – diese werden in der Funktionssignatur mittels Type Hints deklariert.

### Format und Direktiven

Verwenden Sie die folgenden Direktiven, um verschiedene Elemente zu beschreiben:

- `:param <name>:` — Beschreibt einen Parameter.
- `:return:` — Beschreibt den Rückgabewert.
- `:raises <exception>:` — Beschreibt Ausnahmen, die die Funktion auslösen könnte.

#### Beispiel

```python
def add(a: int, b: int) -> int:
    """
    Add two integers.

    :param a: The first integer.
    :param b: The second integer.
    :return: The sum of the two integers.
    :raises ValueError: If either input is not an integer.
    """
    if not isinstance(a, int) or not isinstance(b, int):
        raise ValueError("Inputs must be integers.")
    return a + b
```

---

## Externe Dokumentation (`docs/`-Verzeichnis)

Die gesamte Projektdokumentation befindet sich im `docs/`-Verzeichnis. Diese Dokumente unterstützen sowohl Benutzer als auch Entwickler, indem sie Anleitungen, Beispiele und Referenzen bereitstellen.

### Format

- Verwenden Sie **Markdown (`.md`)** oder **Jupyter Notebooks (`.ipynb`)** für die Dokumentation.
- Markdown wird für narrative Inhalte und statische Dokumentation bevorzugt.
- Verwenden Sie Jupyter Notebooks für ausführbare, interaktive Inhalte (z.B. Tutorials oder Demos).

### Jupyter-Notebook-Richtlinien

- Stellen Sie sicher, dass alle Notebooks **vollständig ausführbar** sind.
- Führen Sie immer **alle Zellen aus** und **speichern Sie die Ausgabe**, bevor Sie committen.
- Unsere CI/CD-Umgebung unterstützt **keine GPU-Ausführung**, daher müssen Notebooks lokal vorab ausgeführt werden.

### Markdown- und Notebook-Direktiven

Verwenden Sie die folgenden Muster für reichhaltige Formatierung:

- `[name](#ref)` — Interner Querverweis, z.B. `[ModuleBase](#evox.core.module.ModuleBase)` oder `[ModuleBase](#ModuleBase)`
- `![Alt Text](path)` — Bilder einbetten, z.B. `![Module base](/_static/modulebase.png)`

---

## Übersetzung

Die Dokumentation unterstützt mehrsprachige Inhalte. Befolgen Sie die folgenden Schritte, um Übersetzungen zu aktualisieren oder zu generieren.

### Übersetzungen aktualisieren (z.B. für `zh_CN`)

```bash
cd docs
make gettext
sphinx-intl update -p build/gettext -l zh_CN
cd ..
python docs/fix_output.py
```
