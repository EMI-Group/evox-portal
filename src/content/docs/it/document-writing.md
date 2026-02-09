---
title: "Guida alla Scrittura della Documentazione"
order: 7
section: "developer"
---

# Guida alla Scrittura della Documentazione

Questa guida delinea le migliori pratiche per scrivere e mantenere la documentazione all'interno del codice base e dei file supplementari.

---

## Documentazione nel Codice (Docstring)

Le docstring sono essenziali per comprendere lo scopo, l'utilizzo e il comportamento del codice. Si prega di attenersi alle seguenti convenzioni:

### Regole Generali

- Documentare **tutte le classi, i metodi e le funzioni pubbliche** utilizzando le docstring.
- Utilizzare docstring in **stile Sphinx**.
- **Non** includere i tipi dei parametri nella docstring: si prevede che vengano dichiarati nella firma della funzione utilizzando i type hint.

### Formato e Direttive

Utilizzare le seguenti direttive per descrivere i diversi elementi:

- `:param <name>:` — Descrive un parametro.
- `:return:` — Descrive il valore di ritorno.
- `:raises <exception>:` — Descrive le eccezioni che la funzione potrebbe sollevare.

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

- Utilizzare **Markdown (`.md`)** o **Jupyter Notebooks (`.ipynb`)** per la documentazione.
- Markdown è preferito per contenuti narrativi e documentazione statica.
- Utilizzare i Jupyter Notebooks per contenuti eseguibili e interattivi (ad es. tutorial o demo).

### Linee Guida per Jupyter Notebook

- Assicurarsi che tutti i notebook siano **completamente eseguibili**.
- **Eseguire sempre tutte le celle** e **salvare l'output** prima di effettuare il commit.
- Il nostro ambiente CI/CD **non supporta l'esecuzione su GPU**, quindi i notebook devono essere pre-eseguiti localmente.

### Direttive Markdown e Notebook

Utilizzare i seguenti pattern per una formattazione avanzata:

- `[name](#ref)` — Riferimento incrociato interno, ad es. `[ModuleBase](#evox.core.module.ModuleBase)` o `[ModuleBase](#ModuleBase)`
- `![Alt Text](path)` — Incorpora immagini, ad es. `![Module base](/_static/modulebase.png)`

---

## Traduzione

La documentazione supporta contenuti multilingue. Seguire i passaggi seguenti per aggiornare o generare traduzioni.

### Aggiornamento delle Traduzioni (ad es. per `zh_CN`)

```bash
cd docs
make gettext
sphinx-intl update -p build/gettext -l zh_CN
cd ..
python docs/fix_output.py
```