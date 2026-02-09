---
title: "2. Installation und Einrichtung der Umgebung"
order: 2
---

# 2. Installation und Einrichtung der Umgebung

Bevor Sie EvoX verwenden, müssen Sie die Software und ihre Abhängigkeiten ordnungsgemäß installieren. Dieses Kapitel behandelt die Installationsschritte sowohl für Windows als auch für Linux sowie die Vorbereitung und Konfiguration der erforderlichen Abhängigkeiten. Stellen Sie sicher, dass Sie die grundlegenden Systemanforderungen erfüllen, bevor Sie mit der Installation beginnen: **Python 3.10+**, ausreichend Speicherplatz und optional eine unterstützte GPU mit dem entsprechenden Treiber.

## Abhängigkeiten und Vorbereitungen

- **Python-Umgebung**: EvoX basiert auf Python, stellen Sie also sicher, dass Python 3.10 oder höher installiert ist. Es wird empfohlen, eine virtuelle Umgebung (wie `venv`) zu verwenden, um Konflikte bei Abhängigkeiten zu vermeiden.

- **PyTorch**: EvoX verwendet PyTorch für Tensor-Operationen und Hardwarebeschleunigung. Daher **muss PyTorch vor der Installation von EvoX installiert werden**. Wählen Sie die Version basierend auf Ihrer Hardware: Installieren Sie die CUDA-Version, wenn Sie eine NVIDIA-GPU haben, die ROCm-Version für AMD-GPUs oder die CPU-Version, wenn keine GPU verfügbar ist. Beziehen Sie sich auf den [offiziellen PyTorch-Leitfaden](https://pytorch.org) für den entsprechenden Befehl, zum Beispiel:

  ```bash
  # For NVIDIA GPUs (CUDA)
  pip install torch torchvision torchaudio

  # For AMD GPUs (ROCm)
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.2.4

  # For CPU-only
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
  ```

Es wird empfohlen, `pip` auf die neueste Version zu aktualisieren und vor der Installation eine stabile Internetverbindung sicherzustellen (Pakete werden von PyPI heruntergeladen). Sobald die Umgebung bereit ist, können Sie EvoX installieren.

### Installation unter Windows

Windows-Benutzer können zwischen einer **automatischen Skript-Installation** und einer **manuellen Installation** wählen. Der offizielle One-Click-Installer bietet eine einfache Möglichkeit, EvoX und seine Abhängigkeiten in einer sauberen Umgebung einzurichten, aber die manuelle Installation ermöglicht mehr Kontrolle.

**Option 1: Verwendung des One-Click-Installationsskripts (win-install.bat)**
EvoX stellt ein [Schnellinstallationsskript](/_static/win-install.bat) für Windows 10/11 (64-Bit) zur Verfügung. Das Skript installiert Miniforge3 (ein leichtgewichtiges Conda), Python, PyTorch (mit CUDA), EvoX und nützliche Tools wie VSCode und Git. Zur Verwendung:

1. Laden Sie `win-install.bat` aus der EvoX-Dokumentation oder von GitHub herunter. Stellen Sie sicher, dass Sie einen [NVIDIA-Treiber](https://www.nvidia.com/en-us/drivers/) installiert haben und über eine stabile Internetverbindung verfügen.
2. Führen Sie das Skript aus. Es erfordert keine Administratorrechte, kann aber während der Ausführung um Erlaubnis bitten – lassen Sie dies zu. Das Skript installiert und konfiguriert alles automatisch.
3. Warten Sie auf den Abschluss. Bei Erfolg sehen Sie eine Meldung und möglicherweise öffnet sich VSCode. EvoX und seine Abhängigkeiten sind dann installiert.

> **Hinweis**: Wenn das Skript aufgrund von Netzwerkproblemen fehlschlägt, schließen Sie es und führen Sie es erneut aus. Es unterstützt die Fortsetzung nach Fehlern.

**Option 2: Manuelle Installation**
Um EvoX manuell zu installieren:

1. **GPU-Treiber installieren**: Installieren Sie den neuesten NVIDIA-Treiber von der [offiziellen Website](https://www.nvidia.cn/Download/index.aspx). Wenn keine dedizierte GPU vorhanden ist, überspringen Sie diesen Schritt.

2. **Python installieren**: Laden Sie [Python 3.10+ für Windows](https://www.python.org/downloads/windows/) herunter und aktivieren Sie während der Installation „Add Python to PATH“.

3. **PyTorch installieren**: Öffnen Sie CMD oder PowerShell und installieren Sie PyTorch basierend auf Ihrer Hardware:

   ```bash
   pip install torch torchvision torchaudio
   ```

4. **(Optional) Triton Compiler installieren**: PyTorch unter Windows fehlt die Triton-Unterstützung. Wenn Sie `torch.compile` (verfügbar in PyTorch 2.0) verwenden möchten, installieren Sie das Drittanbieter-Paket [triton-windows](https://github.com/woct0rdho/triton-windows). Optional, aber nützlich für die Leistungsoptimierung.

5. **EvoX installieren**:

   ```bash
   pip install "evox[default]"

   # Optional extras:
   pip install "evox[vis]"           # Visualization support
   pip install "evox[neuroevolution]" # Neuroevolution support
   ```


  > **Hinweis:**
> Einige Pakete erfordern möglicherweise zusätzliche Systemabhängigkeiten. Sollte dies der Fall sein, wird das Installationsprogramm Sie mit einer Meldung wie der folgenden auffordern:
  ```console
  error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
  ```

  Wenn Sie auf solche Meldungen stoßen, befolgen Sie die bereitgestellten Anweisungen, um die erforderlichen Abhängigkeiten zu installieren, bevor Sie fortfahren.


### Installation unter Linux

Die Installation von EvoX unter Linux (z. B. Ubuntu) ist einfach und erfolgt größtenteils über `pip`.

1. **Systemabhängigkeiten installieren**: Stellen Sie sicher, dass grundlegende Entwicklungswerkzeuge und Python 3.10+ installiert sind. Sie können einen Paketmanager (apt, yum) oder Anaconda verwenden.

2. **GPU-Treiber installieren** (bei Verwendung einer GPU): Verwenden Sie den entsprechenden Paketmanager (z. B. `apt`), um NVIDIA-Treiber zu installieren. Überprüfen Sie die Installation mit `nvidia-smi`. Überspringen Sie diesen Schritt, wenn Sie die CPU verwenden.

> **Hinweis:**
> Installieren Sie unter WSL **keine** NVIDIA-Treiber innerhalb des Linux-Subsystems – installieren Sie sie auf der Windows-Seite.

> **Tipp:**
> Es ist sehr wahrscheinlich, dass Sie nur den Treiber installieren müssen, aber NICHT CUDA oder andere Abhängigkeiten installieren müssen.
> Diese Bibliotheken sind bereits in der PyTorch-Installation via pip enthalten.

> **Tipp:**
> Die erforderliche Treiberversion hängt von Ihrer Hardware ab. Wenn Sie eine aktuelle NVIDIA-GPU haben, ist die Verwendung der neuesten Treiberversion oft die beste Wahl.
> Um eine bessere Kompatibilität und Zugriff auf die neuesten Treiber zu gewährleisten, ist es generell eine gute Idee, eine neuere Linux-Distribution zu verwenden (z. B. Ubuntu 25.04 statt 22.04).

1. **PyTorch installieren**: Wie unter Windows, installieren Sie basierend auf der Hardware. Beziehen Sie sich auf den [offiziellen PyTorch-Leitfaden](https://pytorch.org).

2. **EvoX installieren**:

   ```bash
   pip install evox
   ```

   Oder mit Extras:

   ```bash
   pip install evox[vis,neuroevolution]
   ```

   Dies installiert Visualisierungsmodule und Neuroevolution-Abhängigkeiten (wie Brax). Sie können auch einzelne Extras wie `vis` oder `neuroevolution` wählen.

#### Container-Installation (Docker, Podman)

Für Benutzer von AMD-GPUs oder diejenigen, die eine Umgebungsisolierung suchen, wird Docker empfohlen. Zum Beispiel unter Verwendung des offiziellen PyTorch-Docker-Images mit ROCm:

```bash
docker run -it --gpus all --shm-size=8g rocm/pytorch:latest
```

Innerhalb des Containers installieren Sie EvoX wie gewohnt mit `pip`.

## Überprüfung der EvoX-Installation

Um zu überprüfen, ob EvoX ordnungsgemäß installiert ist:

- **Grundlegende Prüfung**: Führen Sie im Terminal oder in der Python-Shell Folgendes aus:

  ```python
  from torch.utils.collect_env import get_pretty_env_info
  import evox
  print(get_pretty_env_info())
  ```

  Dies gibt Informationen zur PyTorch- und Systemkonfiguration aus. Wenn EvoX ohne Fehler importiert wird, war die Installation erfolgreich. Sie können auch die Version überprüfen:

  ```python
  import evox
  print(evox.__version__)
  ```

- **Optionale Einstellungen**: Sie können leistungsbezogene Einstellungen anpassen, wie zum Beispiel:

  - Setzen von Umgebungsvariablen wie `OMP_NUM_THREADS` zur Steuerung der CPU-Thread-Anzahl
  - Erhöhen des geteilten Docker-Speichers mit `--shm-size`
  - Sicherstellen, dass Ihre IDE (Jupyter, PyCharm, etc.) die korrekte Python-Umgebung verwendet

Sobald die Einrichtung abgeschlossen ist, sind Sie bereit, mit der Optimierung durch EvoX zu beginnen.