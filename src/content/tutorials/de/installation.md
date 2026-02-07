---
title: "2. Installation und Umgebungseinrichtung"
order: 2
---

# 2. Installation und Umgebungseinrichtung

Bevor Sie EvoX verwenden, müssen Sie die Software und ihre Abhängigkeiten ordnungsgemäß installieren. Dieses Kapitel behandelt die Installationsschritte für Windows und Linux sowie die Vorbereitung und Konfiguration der erforderlichen Abhängigkeiten. Stellen Sie sicher, dass Sie die grundlegenden Systemanforderungen vor der Installation erfüllen: **Python 3.10+**, ausreichend Speicherplatz und optional eine unterstützte GPU mit dem entsprechenden Treiber.

## Abhängigkeiten und Vorbereitungen

- **Python-Umgebung**: EvoX basiert auf Python, stellen Sie also sicher, dass Python 3.10 oder höher installiert ist. Es wird empfohlen, eine virtuelle Umgebung (wie `venv`) zu verwenden, um Abhängigkeitskonflikte zu vermeiden.

- **PyTorch**: EvoX verwendet PyTorch für Tensor-Operationen und Hardware-Beschleunigung. Daher **muss PyTorch vor der Installation von EvoX installiert werden**. Wählen Sie die Version basierend auf Ihrer Hardware: Installieren Sie die CUDA-Version, wenn Sie eine NVIDIA-GPU haben, die ROCm-Version für AMD-GPUs oder die CPU-Version, wenn keine GPU verfügbar ist. Beziehen Sie sich auf die [offizielle PyTorch-Anleitung](https://pytorch.org) für den entsprechenden Befehl, zum Beispiel:

  ```bash
  # Für NVIDIA-GPUs (CUDA)
  pip install torch torchvision torchaudio

  # Für AMD-GPUs (ROCm)
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.2.4

  # Nur für CPU
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
  ```

Es wird empfohlen, `pip` auf die neueste Version zu aktualisieren und eine stabile Internetverbindung vor der Installation sicherzustellen (Pakete werden von PyPI heruntergeladen). Sobald die Umgebung bereit ist, können Sie EvoX installieren.

### Installation unter Windows

Windows-Benutzer können zwischen **automatischer Skript-Installation** oder **manueller Installation** wählen. Das offizielle Ein-Klick-Installationsprogramm bietet eine einfache Möglichkeit, EvoX und seine Abhängigkeiten in einer sauberen Umgebung einzurichten, aber die manuelle Installation ermöglicht mehr Kontrolle.

**Option 1: Verwendung des Ein-Klick-Installationsskripts (win-install.bat)**
EvoX bietet ein [Schnellinstallationsskript](/_static/win-install.bat) für Windows 10/11 (64-Bit). Das Skript installiert Miniforge3 (ein leichtgewichtiges Conda), Python, PyTorch (mit CUDA), EvoX und nützliche Tools wie VSCode und Git. Zur Verwendung:

1. Laden Sie `win-install.bat` von der EvoX-Dokumentation oder GitHub herunter. Stellen Sie sicher, dass ein [NVIDIA-Treiber](https://www.nvidia.com/en-us/drivers/) installiert ist und eine stabile Internetverbindung besteht.
2. Führen Sie das Skript aus. Es benötigt keine Administratorrechte, kann aber während der Ausführung um Erlaubnis bitten – erlauben Sie dies. Das Skript installiert und konfiguriert alles automatisch.
3. Warten Sie auf den Abschluss. Bei Erfolg sehen Sie eine Nachricht und möglicherweise öffnet sich VSCode. EvoX und seine Abhängigkeiten werden installiert sein.

> **Hinweis**: Wenn das Skript aufgrund von Netzwerkproblemen fehlschlägt, schließen Sie es und führen Sie es erneut aus. Es unterstützt die Wiederaufnahme bei Fehlern.

**Option 2: Manuelle Installation**
Um EvoX manuell zu installieren:

1. **GPU-Treiber installieren**: Installieren Sie den neuesten NVIDIA-Treiber von der [offiziellen Website](https://www.nvidia.cn/Download/index.aspx). Wenn keine dedizierte GPU vorhanden ist, überspringen Sie diesen Schritt.

2. **Python installieren**: Laden Sie [Python 3.10+ für Windows](https://www.python.org/downloads/windows/) herunter und aktivieren Sie "Python zu PATH hinzufügen" während der Installation.

3. **PyTorch installieren**: Öffnen Sie CMD oder PowerShell und installieren Sie PyTorch basierend auf Ihrer Hardware:

   ```bash
   pip install torch torchvision torchaudio
   ```

4. **(Optional) Triton-Compiler installieren**: PyTorch unter Windows hat keine Triton-Unterstützung. Wenn Sie `torch.compile` verwenden möchten (verfügbar in PyTorch 2.0), installieren Sie das Drittanbieter-Paket [triton-windows](https://github.com/woct0rdho/triton-windows). Optional, aber nützlich für Leistungsoptimierung.

5. **EvoX installieren**:

   ```bash
   pip install "evox[default]"

   # Optionale Extras:
   pip install "evox[vis]"           # Visualisierungsunterstützung
   pip install "evox[neuroevolution]" # Neuroevolution-Unterstützung
   ```


  `> **Hinweis:**
> Einige Pakete erfordern möglicherweise zusätzliche Systemabhängigkeiten. In diesem Fall wird das Installationsprogramm Sie mit einer Meldung wie der folgenden auffordern:console
  error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
  ```

  Wenn Sie auf solche Meldungen stoßen, folgen Sie den bereitgestellten Anweisungen, um die erforderlichen Abhängigkeiten zu installieren, bevor Sie fortfahren.
  ````


### Installation unter Linux

Die Installation von EvoX unter Linux (z.B. Ubuntu) ist unkompliziert und wird hauptsächlich über `pip` abgewickelt.

1. **Systemabhängigkeiten installieren**: Stellen Sie sicher, dass grundlegende Entwicklungstools und Python 3.10+ installiert sind. Sie können einen Paketmanager (apt, yum) oder Anaconda verwenden.

2. **GPU-Treiber installieren** (bei Verwendung einer GPU): Verwenden Sie den entsprechenden Paketmanager (z.B. `apt`), um NVIDIA-Treiber zu installieren. Überprüfen Sie die Installation mit `nvidia-smi`. Überspringen Sie dies bei Verwendung der CPU.

> **Hinweis:**
> Unter WSL installieren Sie **keine** NVIDIA-Treiber innerhalb des Linux-Subsystems – installieren Sie sie auf der Windows-Seite.

> **Tipp:**
> Es ist sehr wahrscheinlich, dass Sie nur den Treiber installieren müssen, aber CUDA oder andere Abhängigkeiten NICHT installieren müssen.
> Diese Bibliotheken sind bereits in der PyTorch-Installation über pip enthalten.

> **Tipp:**
> Die erforderliche Treiberversion hängt von Ihrer Hardware ab. Wenn Sie eine neuere NVIDIA-GPU haben, ist die Verwendung der neuesten Treiberversion oft die beste Wahl.
> Um eine bessere Kompatibilität und Zugang zu den neuesten Treibern zu gewährleisten, ist es generell eine gute Idee, eine neuere Linux-Distribution zu verwenden (z.B. Ubuntu 25.04 statt 22.04).

1. **PyTorch installieren**: Wie unter Windows, installieren Sie basierend auf der Hardware. Beziehen Sie sich auf die [offizielle PyTorch-Anleitung](https://pytorch.org).

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

Für AMD-GPU-Benutzer oder diejenigen, die Umgebungsisolierung suchen, wird Docker empfohlen. Zum Beispiel mit dem offiziellen PyTorch-Docker-Image mit ROCm:

```bash
docker run -it --gpus all --shm-size=8g rocm/pytorch:latest
```

Innerhalb des Containers installieren Sie EvoX wie gewohnt mit `pip`.

## Überprüfung der EvoX-Installation

Um zu überprüfen, ob EvoX ordnungsgemäß installiert ist:

- **Grundlegende Überprüfung**: Führen Sie im Terminal oder in der Python-Shell aus:

  ```python
  from torch.utils.collect_env import get_pretty_env_info
  import evox
  print(get_pretty_env_info())
  ```

  Dies gibt PyTorch- und Systemkonfigurationsinformationen aus. Wenn EvoX ohne Fehler importiert wird, war die Installation erfolgreich. Sie können auch die Version überprüfen:

  ```python
  import evox
  print(evox.__version__)
  ```

- **Optionale Einstellungen**: Sie können leistungsbezogene Einstellungen anpassen, wie z.B.:

  - Setzen von Umgebungsvariablen wie `OMP_NUM_THREADS` zur Steuerung der CPU-Thread-Anzahl
  - Erhöhung des Docker-Shared-Memory mit `--shm-size`
  - Sicherstellen, dass Ihre IDE (Jupyter, PyCharm usw.) die richtige Python-Umgebung verwendet

Sobald die Einrichtung abgeschlossen ist, können Sie mit der Optimierung mit EvoX beginnen.
