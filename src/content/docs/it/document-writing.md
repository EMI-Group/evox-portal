---
title: "Guida alla Scrittura della Documentazione"
order: 7
section: "developer"
---

# Guida alla Scrittura della Documentazione

Questa guida descrive le migliori pratiche per scrivere e mantenere la documentazione nel codebase e nei file supplementari.

---

## Documentazione nel Codice (Docstring)

Le docstring sono essenziali per comprendere lo scopo, l'utilizzo e il comportamento del codice. Si prega di rispettare le seguenti convenzioni:

### Regole Generali

- Documenta **tutte le classi, i metodi e le funzioni pubbliche** usando le docstring.
- Usa docstring in **stile Sphinx**.
- **Non** includere i tipi dei parametri nella docstring — ci si aspetta che siano dichiarati nella firma della funzione usando i type hint.

### Formato e Direttive

Usa le seguenti direttive per descrivere i diversi elementi:

- `:param <name>:` — Descrivi un parametro.
- `:return:` — Descrivi il valore di ritorno.
- `:raises <exception>:` — Descrivi le eccezioni che la funzione potrebbe sollevare.

#### Esempio

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

## Documentazione Esterna (Directory `docs/`)

Tutta la documentazione a livello di progetto si trova nella directory `docs/`. Questi documenti supportano sia gli utenti che gli sviluppatori fornendo guide, esempi e riferimenti.

### Formato

- Usa **Markdown (`.md`)** o **Jupyter Notebook (`.ipynb`)** per la documentazione.
- Il Markdown è preferito per contenuti narrativi e documentazione statica.
- Usa i Jupyter Notebook per contenuti eseguibili e interattivi (ad es. tutorial o demo).

### Linee Guida per i Jupyter Notebook

- Assicurati che tutti i notebook siano **completamente eseguibili**.
- **Esegui sempre tutte le celle** e **salva l'output** prima di fare il commit.
- Il nostro ambiente CI/CD **non supporta l'esecuzione su GPU**, quindi i notebook devono essere pre-eseguiti localmente.

### Direttive Markdown e Notebook

Usa i seguenti pattern per la formattazione avanzata:

- `[name](#ref)` — Riferimento incrociato interno, ad es. `[ModuleBase](#evox.core.module.ModuleBase)` o `[ModuleBase](#ModuleBase)`
- `![Alt Text](path)` — Incorpora immagini, ad es. `![Module base](/_static/modulebase.png)`

---

## Traduzione

La documentazione supporta contenuti multilingue. Segui i passaggi seguenti per aggiornare o generare le traduzioni.

### Aggiornamento delle Traduzioni (ad es. per `zh_CN`)

```bash
cd docs
make gettext
sphinx-intl update -p build/gettext -l zh_CN
cd ..
python docs/fix_output.py
```
