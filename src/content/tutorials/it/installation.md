---
title: "2. Installazione e Configurazione dell'Ambiente"
order: 2
---

# 2. Installazione e Configurazione dell'Ambiente

Prima di utilizzare EvoX, è necessario installare correttamente il software e le sue dipendenze. Questo capitolo copre i passaggi di installazione sia per Windows che per Linux, nonché come preparare e configurare le dipendenze richieste. Assicurati di soddisfare i requisiti di sistema di base prima dell'installazione: **Python 3.10+**, spazio su disco sufficiente e, opzionalmente, una GPU supportata con il driver appropriato.

## Dipendenze e Preparativi

- **Ambiente Python**: EvoX è costruito su Python, quindi assicurati che Python 3.10 o superiore sia installato. Si consiglia di utilizzare un ambiente virtuale (come `venv`) per evitare conflitti di dipendenze.

- **PyTorch**: EvoX utilizza PyTorch per le operazioni sui tensori e l'accelerazione hardware. Pertanto, **PyTorch deve essere installato prima di installare EvoX**. Scegli la versione in base al tuo hardware: installa la versione CUDA se hai una GPU NVIDIA, la versione ROCm per GPU AMD, o la versione CPU se non è disponibile alcuna GPU. Consulta la [guida ufficiale di PyTorch](https://pytorch.org) per il comando appropriato, ad esempio:

  ```bash
  # Per GPU NVIDIA (CUDA)
  pip install torch torchvision torchaudio

  # Per GPU AMD (ROCm)
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.2.4

  # Solo CPU
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
  ```

Si consiglia di aggiornare `pip` all'ultima versione e assicurarsi di avere una connessione internet stabile prima dell'installazione (i pacchetti verranno scaricati da PyPI). Una volta che l'ambiente è pronto, puoi installare EvoX.

### Installazione su Windows

Gli utenti Windows possono scegliere tra **installazione automatica tramite script** o **installazione manuale**. L'installer ufficiale one-click fornisce un modo semplice per configurare EvoX e le sue dipendenze in un ambiente pulito, ma l'installazione manuale consente un maggiore controllo.

**Opzione 1: Utilizzo dello Script di Installazione One-Click (win-install.bat)**
EvoX fornisce uno [script di installazione rapida](/_static/win-install.bat) per Windows 10/11 (64-bit). Lo script installa Miniforge3 (un Conda leggero), Python, PyTorch (con CUDA), EvoX e strumenti utili come VSCode e Git. Per utilizzarlo:

1. Scarica `win-install.bat` dalla documentazione di EvoX o da GitHub. Assicurati di avere un [driver NVIDIA](https://www.nvidia.com/en-us/drivers/) installato e una connessione internet stabile.
2. Esegui lo script. Non richiede privilegi di amministratore, ma potrebbe richiedere permessi durante l'esecuzione — concedili. Lo script installerà e configurerà tutto automaticamente.
3. Attendi il completamento. Al termine, vedrai un messaggio e possibilmente VSCode che si apre. EvoX e le sue dipendenze saranno installati.

> **Nota**: Se lo script fallisce a causa di problemi di rete, chiudilo e rieseguilo. Supporta la ripresa in caso di errore.

**Opzione 2: Installazione Manuale**
Per installare manualmente EvoX:

1. **Installa il Driver GPU**: Installa l'ultimo driver NVIDIA dal [sito ufficiale](https://www.nvidia.cn/Download/index.aspx). Se non hai una GPU dedicata, salta questo passaggio.

2. **Installa Python**: Scarica [Python 3.10+ per Windows](https://www.python.org/downloads/windows/) e abilita "Add Python to PATH" durante l'installazione.

3. **Installa PyTorch**: Apri CMD o PowerShell e installa PyTorch in base al tuo hardware:

   ```bash
   pip install torch torchvision torchaudio
   ```

4. **(Opzionale) Installa il Compilatore Triton**: PyTorch su Windows non supporta Triton. Se vuoi usare `torch.compile` (disponibile in PyTorch 2.0), installa il pacchetto di terze parti [triton-windows](https://github.com/woct0rdho/triton-windows). Opzionale ma utile per l'ottimizzazione delle prestazioni.

5. **Installa EvoX**:

   ```bash
   pip install "evox[default]"

   # Extra opzionali:
   pip install "evox[vis]"           # Supporto visualizzazione
   pip install "evox[neuroevolution]" # Supporto neuroevoluzione
   ```


  `> **Nota:**
> Alcuni pacchetti potrebbero richiedere dipendenze di sistema aggiuntive. In tal caso, l'installer ti mostrerà un messaggio come il seguente:console
  error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
  ```

  Quando incontri tali messaggi, segui le istruzioni fornite per installare le dipendenze necessarie prima di procedere.
  ````


### Installazione su Linux

Installare EvoX su Linux (ad es. Ubuntu) è semplice e gestito principalmente tramite `pip`.

1. **Installa le Dipendenze di Sistema**: Assicurati che gli strumenti di sviluppo di base e Python 3.10+ siano installati. Puoi usare un gestore di pacchetti (apt, yum) o Anaconda.

2. **Installa il Driver GPU** (se usi la GPU): Usa il gestore di pacchetti appropriato (ad es. `apt`) per installare i driver NVIDIA. Verifica l'installazione con `nvidia-smi`. Salta se usi la CPU.

> **Nota:**
> Su WSL, **non** installare i driver NVIDIA all'interno del sottosistema Linux — installali sul lato Windows.

> **Suggerimento:**
> È molto probabile che tu debba installare solo il driver, ma NON sia necessario installare CUDA o altre dipendenze.
> Queste librerie sono già incluse nell'installazione di PyTorch tramite pip.

> **Suggerimento:**
> La versione del driver richiesta dipende dal tuo hardware. Se hai una GPU NVIDIA recente, usare l'ultima versione del driver è spesso la scelta migliore.
> Per garantire una migliore compatibilità e accesso ai driver più recenti, è generalmente una buona idea usare una distribuzione Linux più recente (ad es. Ubuntu 25.04 invece di 22.04).

1. **Installa PyTorch**: Come su Windows, installa in base all'hardware. Consulta la [guida ufficiale di PyTorch](https://pytorch.org).

2. **Installa EvoX**:

   ```bash
   pip install evox
   ```

   Oppure con extra:

   ```bash
   pip install evox[vis,neuroevolution]
   ```

   Questo installa i moduli di visualizzazione e le dipendenze per la neuroevoluzione (come Brax). Puoi anche scegliere singoli extra come `vis` o `neuroevolution`.

#### Installazione tramite Container (Docker, Podman)

Per gli utenti con GPU AMD o chi cerca l'isolamento dell'ambiente, si consiglia Docker. Ad esempio, utilizzando l'immagine Docker ufficiale di PyTorch con ROCm:

```bash
docker run -it --gpus all --shm-size=8g rocm/pytorch:latest
```

All'interno del container, installa EvoX come al solito usando `pip`.

## Verifica dell'Installazione di EvoX

Per verificare che EvoX sia installato correttamente:

- **Controllo di Base**: Nel terminale o nella shell Python, esegui:

  ```python
  from torch.utils.collect_env import get_pretty_env_info
  import evox
  print(get_pretty_env_info())
  ```

  Questo stampa le informazioni di configurazione di PyTorch e del sistema. Se EvoX viene importato senza errori, l'installazione è riuscita. Puoi anche controllare la versione:

  ```python
  import evox
  print(evox.__version__)
  ```

- **Impostazioni Opzionali**: Potresti regolare le impostazioni relative alle prestazioni, come:

  - Impostare variabili d'ambiente come `OMP_NUM_THREADS` per controllare il numero di thread CPU
  - Aumentare la memoria condivisa di Docker con `--shm-size`
  - Assicurarsi che il tuo IDE (Jupyter, PyCharm, ecc.) utilizzi l'ambiente Python corretto

Una volta completata la configurazione, sei pronto per iniziare a ottimizzare con EvoX.
