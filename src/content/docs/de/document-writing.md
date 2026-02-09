---
title: "Leitfaden zum Verfassen von Dokumentation"
order: 7
section: "developer"
---

# Leitfaden zum Verfassen von Dokumentation

Dieser Leitfaden beschreibt Best Practices für das Schreiben und Pflegen der Dokumentation innerhalb der Codebasis und ergänzender Dateien.

---

## Dokumentation im Code (Docstrings)

Docstrings sind essenziell, um den Zweck, die Verwendung und das Verhalten Ihres Codes zu verstehen. Bitte halten Sie sich an die folgenden Konventionen:

### Allgemeine Regeln

- Dokumentieren Sie **alle öffentlichen Klassen, Methoden und Funktionen** mittels Docstrings.
- Verwenden Sie Docstrings im **Sphinx-Stil**.
- Fügen Sie **keine** Parametertypen in den Docstring ein – diese sollten in der Funktionssignatur mittels Type Hints deklariert werden.

### Format und Direktiven

Verwenden Sie die folgenden Direktiven, um verschiedene Elemente zu beschreiben:

- `:param <name>:` — Beschreibt einen Parameter.
- `:return:` — Beschreibt den Rückgabewert.
- `:raises <exception>:` — Beschreibt Ausnahmen (Exceptions), die die Funktion auslösen könnte.

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

## Externe Dokumentation (Verzeichnis `docs/`)

Die gesamte Dokumentation auf Projektebene befindet sich im Verzeichnis `docs/`. Diese Dokumente unterstützen sowohl Benutzer als auch Entwickler durch die Bereitstellung von Anleitungen, Beispielen und Referenzen.

### Format

- Verwenden Sie **Markdown (`.md`)** oder **Jupyter Notebooks (`.ipynb`)** für die Dokumentation.
- Markdown wird für narrativen Inhalt und statische Dokumentation bevorzugt.
- Verwenden Sie Jupyter Notebooks für ausführbaren, interaktiven Inhalt (z. B. Tutorials oder Demos).

### Richtlinien für Jupyter Notebooks

- Stellen Sie sicher, dass alle Notebooks **vollständig ausführbar** sind.
- Führen Sie vor dem Committen immer **alle Zellen aus** und **speichern Sie die Ausgabe**.
- Unsere CI/CD-Umgebung unterstützt **keine GPU-Ausführung**, daher müssen Notebooks lokal vorausgeführt werden.

### Markdown- & Notebook-Direktiven

Verwenden Sie die folgenden Muster für erweiterte Formatierung:

- `[name](#ref)` — Interner Querverweis, z. B. `[ModuleBase](#evox.core.module.ModuleBase)` oder `[ModuleBase](#ModuleBase)`
- `![Alt Text](path)` — Bilder einbetten, z. B. `![Module base](/_static/modulebase.png)`

---

## Übersetzung

Die Dokumentation unterstützt mehrsprachige Inhalte. Befolgen Sie die untenstehenden Schritte, um Übersetzungen zu aktualisieren oder zu generieren.

### Aktualisieren von Übersetzungen (z. B. für `zh_CN`)

```bash
cd docs
make gettext
sphinx-intl update -p build/gettext -l zh_CN
cd ..
python docs/fix_output.py
```