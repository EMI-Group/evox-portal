---
title: "Python-Installationsanleitung"
order: 1
section: "install"
---

# Python-Installationsanleitung

Dieser Leitfaden richtet sich an diejenigen, die neu in der Programmiersprache Python sind und sie auf ihrem System installieren möchten.
Er hilft Ihnen, die Python-Umgebung einzurichten, die zum Ausführen von EvoX benötigt wird.

> **Tipp:**
> EvoX ist in Python geschrieben, daher müssen Sie Python auf Ihrem System installiert haben.
> EvoX unterstützt Python 3.10 und höher, und wir empfehlen die Verwendung der **neuesten Version** von Python.

## Python-Interpreter installieren

### Windows-Version

Gehen Sie zu [Python herunterladen](https://www.python.org/downloads/) und laden Sie die neueste Version von Python herunter.

> **Hinweis:**
> Stellen Sie sicher, dass Sie während des Installationsprozesses das Kontrollkästchen "Python zu PATH hinzufügen" aktivieren.

### Linux-Version

Verschiedene Linux-Distributionen haben unterschiedliche Wege, Python zu installieren.
Es hängt vom Paketmanager Ihrer Distribution ab.
Hier sind einige Beispiele:
- Debian/Ubuntu: `apt`
- Archlinux: `pacman`
- Fedora: `dnf`

### Installation über `uv`

`uv` ist ein extrem schneller Python-Paket- und Projektmanager, der unter Windows, Linux und MacOS funktioniert.
Wir empfehlen die Verwendung von `uv` zur Installation des Python-Interpreters sowie zur Verwaltung von Python-Umgebungen.
Die detaillierte Installationsanleitung finden Sie in der [uv-Installationsanleitung](https://docs.astral.sh/uv/getting-started/installation/#installation-methods).


### Windows
Verwenden Sie `irm`, um das Skript herunterzuladen und mit `iex` auszuführen:

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Das Ändern der [Ausführungsrichtlinie](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4#powershell-execution-policies) ermöglicht das Ausführen eines Skripts aus dem Internet.

Fordern Sie eine bestimmte Version an, indem Sie sie in die URL aufnehmen:

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.6.16/install.ps1 | iex"
```


### Linux und MacOS
Verwenden Sie `curl`, um das Skript herunterzuladen und mit `sh` auszuführen:

```console
$ curl -LsSf https://astral.sh/uv/install.sh | sh
```

Wenn Ihr System kein `curl` hat, können Sie `wget` verwenden:

```console
$ wget -qO- https://astral.sh/uv/install.sh | sh
```

Fordern Sie eine bestimmte Version an, indem Sie sie in die URL aufnehmen:

```console
$ curl -LsSf https://astral.sh/uv/0.6.16/install.sh | sh
```


## Python-Umgebungen verwalten

### Pip und Venv

`pip` ist der Paketmanager für Python. `venv` ist das eingebaute Tool zum Erstellen virtueller Umgebungen in Python.
Eine virtuelle Umgebung ist ein eigenständiges Verzeichnis, das eine Python-Installation für eine bestimmte Python-Version sowie mehrere zusätzliche Pakete enthält.
Dies ist nützlich, um Abhängigkeiten für verschiedene Projekte separat zu verwalten.

Um eine virtuelle Umgebung zu erstellen, führen Sie den folgenden Befehl in Ihrem Terminal aus:

```console
$ python -m venv <env_path> # usually <env_path> is a `.venv` directory in your project
```
Dies erstellt ein neues Verzeichnis namens `<env_path>`, das eine Kopie des Python-Interpreters und der Standardbibliothek enthält.
Um die virtuelle Umgebung zu aktivieren, führen Sie den folgenden Befehl aus:

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```
Dies ändert Ihre Shell-Eingabeaufforderung, um anzuzeigen, dass Sie jetzt innerhalb der virtuellen Umgebung arbeiten.
Um die virtuelle Umgebung zu deaktivieren, führen Sie den folgenden Befehl aus:

```console
$ deactivate
```
Dies bringt Sie zum Standard-Python-Interpreter Ihres Systems mit allen installierten Bibliotheken zurück.

Während die virtuelle Umgebung aktiviert ist, können Sie `pip` verwenden, um Pakete in die virtuelle Umgebung zu installieren.
Um beispielsweise die neueste Version von `numpy` zu installieren, führen Sie den folgenden Befehl aus:

```console
$ pip install numpy
```
Dies installiert `numpy` in die virtuelle Umgebung und beeinflusst nicht die systemweite Python-Installation.
Um eine bestimmte Version von `numpy` zu installieren, führen Sie den folgenden Befehl aus:

```console
$ pip install numpy==1.23.4
```
Dies installiert Version `1.23.4` von `numpy` in die virtuelle Umgebung.
Um alle in der virtuellen Umgebung installierten Pakete aufzulisten, führen Sie den folgenden Befehl aus:

```console
$ pip list
```
Dies zeigt Ihnen eine Liste aller in der virtuellen Umgebung installierten Pakete zusammen mit ihren Versionen.
Um ein Paket zu deinstallieren, führen Sie den folgenden Befehl aus:

```console
$ pip uninstall numpy
```
Dies deinstalliert `numpy` aus der virtuellen Umgebung.
Um ein Paket zu aktualisieren, führen Sie den folgenden Befehl aus:

```console
$ pip install --upgrade numpy
```
Dies aktualisiert `numpy` auf die neueste Version in der virtuellen Umgebung.

### uv

`uv` kann nicht nur Python-Versionen verwalten, sondern auch Python-Umgebungen.
Um eine neue Python-Umgebung zu erstellen, führen Sie den folgenden Befehl aus:

```console
$ uv venv --python <python_version> # e.g. 3.10, 3.11, ...
```
Dies erstellt ein neues Verzeichnis namens `.venv`, das eine Kopie des Python-Interpreters und der Standardbibliothek enthält.
Um die virtuelle Umgebung zu aktivieren, führen Sie den folgenden Befehl aus:

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```

Nach der Aktivierung der virtuellen Umgebung können Sie `uv pip` verwenden, um Pakete in die virtuelle Umgebung zu installieren.
Um beispielsweise die neueste Version von `numpy` zu installieren, führen Sie den folgenden Befehl aus:

```console
$ uv pip install numpy
```
