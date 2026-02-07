---
title: "Guida all'Installazione di Python"
order: 1
section: "install"
---

# Guida all'Installazione di Python

Questa guida è per coloro che sono nuovi al linguaggio di programmazione Python e vogliono installarlo sul proprio sistema.
Ti aiuterà a configurare l'ambiente Python necessario per eseguire EvoX.

> **Suggerimento:**
> EvoX è scritto in Python, quindi dovrai avere Python installato sul tuo sistema.
> EvoX supporta Python 3.10 e superiore, e consigliamo di usare l'**ultima versione** di Python.

## Installare l'interprete Python

### Versione Windows

Vai su [Download Python](https://www.python.org/downloads/) e scarica l'ultima versione di Python.

> **Nota:**
> Assicurati di selezionare la casella "Add Python to PATH" durante il processo di installazione.

### Versione Linux

Diverse distribuzioni Linux hanno modi diversi per installare Python.
Dipende dal gestore di pacchetti della tua distribuzione.
Ecco alcuni esempi:
- Debian/Ubuntu: `apt`
- Archlinux: `pacman`
- Fedora: `dnf`

### Installazione tramite `uv`

`uv` è un gestore di pacchetti e progetti Python estremamente veloce, funziona su Windows, Linux e MacOS.
Consigliamo di usare `uv` per installare l'interprete Python e per gestire gli ambienti Python.
La guida dettagliata all'installazione può essere trovata nella [guida all'installazione di uv](https://docs.astral.sh/uv/getting-started/installation/#installation-methods).


### Windows
Usa `irm` per scaricare lo script ed eseguirlo con `iex`:

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Modificare la [policy di esecuzione](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4#powershell-execution-policies) consente di eseguire uno script da internet.

Richiedi una versione specifica includendola nell'URL:

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.6.16/install.ps1 | iex"
```


### Linux e MacOS
Usa `curl` per scaricare lo script ed eseguirlo con `sh`:

```console
$ curl -LsSf https://astral.sh/uv/install.sh | sh
```

Se il tuo sistema non ha `curl`, puoi usare `wget`:

```console
$ wget -qO- https://astral.sh/uv/install.sh | sh
```

Richiedi una versione specifica includendola nell'URL:

```console
$ curl -LsSf https://astral.sh/uv/0.6.16/install.sh | sh
```


## Gestione degli Ambienti Python

### Pip e Venv

`pip` è il gestore di pacchetti per Python. `venv` è lo strumento integrato per creare ambienti virtuali in Python.
Un ambiente virtuale è una directory autonoma che contiene un'installazione Python per una particolare versione di Python, più diversi pacchetti aggiuntivi.
Questo è utile per gestire le dipendenze di diversi progetti separatamente.

Per creare un ambiente virtuale, esegui il seguente comando nel tuo terminale:

```console
$ python -m venv <env_path> # solitamente <env_path> è una directory `.venv` nel tuo progetto
```
Questo creerà una nuova directory chiamata `<env_path>` che contiene una copia dell'interprete Python e della libreria standard.
Per attivare l'ambiente virtuale, esegui il seguente comando:

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```
Questo cambierà il prompt della tua shell per indicare che stai lavorando all'interno dell'ambiente virtuale.
Per disattivare l'ambiente virtuale, esegui il seguente comando:

```console
$ deactivate
```
Questo ti riporterà all'interprete Python predefinito del tuo sistema con tutte le sue librerie installate.

Mentre l'ambiente virtuale è attivato, puoi usare `pip` per installare pacchetti nell'ambiente virtuale.
Ad esempio, per installare l'ultima versione di `numpy`, esegui il seguente comando:

```console
$ pip install numpy
```
Questo installerà `numpy` nell'ambiente virtuale, e non influenzerà l'installazione Python a livello di sistema.
Per installare una versione specifica di `numpy`, esegui il seguente comando:

```console
$ pip install numpy==1.23.4
```
Questo installerà la versione `1.23.4` di `numpy` nell'ambiente virtuale.
Per elencare tutti i pacchetti installati nell'ambiente virtuale, esegui il seguente comando:

```console
$ pip list
```
Questo ti mostrerà un elenco di tutti i pacchetti installati nell'ambiente virtuale, insieme alle loro versioni.
Per disinstallare un pacchetto, esegui il seguente comando:

```console
$ pip uninstall numpy
```
Questo disinstallerà `numpy` dall'ambiente virtuale.
Per aggiornare un pacchetto, esegui il seguente comando:

```console
$ pip install --upgrade numpy
```
Questo aggiornerà `numpy` all'ultima versione nell'ambiente virtuale.

### uv

`uv` può non solo gestire le versioni di Python, ma anche gestire gli ambienti Python.
Per creare un nuovo ambiente Python, esegui il seguente comando:

```console
$ uv venv --python <python_version> # ad es. 3.10, 3.11, ...
```
Questo creerà una nuova directory chiamata `.venv` che contiene una copia dell'interprete Python e della libreria standard.
Per attivare l'ambiente virtuale, esegui il seguente comando:

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```

Dopo aver attivato l'ambiente virtuale, puoi usare `uv pip` per installare pacchetti nell'ambiente virtuale.
Ad esempio, per installare l'ultima versione di `numpy`, esegui il seguente comando:

```console
$ uv pip install numpy
```
