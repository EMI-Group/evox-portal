---
title: "Guía de instalación de Python"
order: 1
section: "install"
---

# Guía de instalación de Python

Esta guía está dirigida a quienes se inician en el lenguaje de programación Python y desean instalarlo en su sistema. Te ayudará a configurar el entorno de Python necesario para ejecutar EvoX.

> **Consejo:**
> EvoX está escrito en Python, por lo que necesitarás tener Python instalado en tu sistema. EvoX es compatible con Python 3.10 y versiones superiores, y recomendamos utilizar la **última versión** de Python.

## Instalar el intérprete de Python

### Versión para Windows

Ve a [Download Python](https://www.python.org/downloads/) y descarga la última versión de Python.

> **Nota:**
> Asegúrate de marcar la casilla que dice "Add Python to PATH" durante el proceso de instalación.

### Versión para Linux

Las diferentes distribuciones de Linux tienen distintas formas de instalar Python. Depende del gestor de paquetes de tu distribución. Aquí tienes algunos ejemplos:
- Debian/Ubuntu: `apt`
- Archlinux: `pacman`
- Fedora: `dnf`

### Instalación a través de `uv`

`uv` es un gestor de proyectos y paquetes de Python extremadamente rápido que funciona en Windows, Linux y MacOS. Recomendamos usar `uv` tanto para instalar el intérprete de Python como para gestionar los entornos de Python. Puedes encontrar la guía de instalación detallada en la [guía de instalación de uv](https://docs.astral.sh/uv/getting-started/installation/#installation-methods).


### Windows
Usa `irm` para descargar el script y ejecútalo con `iex`:

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Cambiar la [política de ejecución](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4#powershell-execution-policies) permite ejecutar un script desde Internet.

Solicita una versión específica incluyéndola en la URL:

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.6.16/install.ps1 | iex"
```


### Linux y MacOS
Usa `curl` para descargar el script y ejecútalo con `sh`:

```console
$ curl -LsSf https://astral.sh/uv/install.sh | sh
```

Si tu sistema no tiene `curl`, puedes usar `wget`:

```console
$ wget -qO- https://astral.sh/uv/install.sh | sh
```

Solicita una versión específica incluyéndola en la URL:

```console
$ curl -LsSf https://astral.sh/uv/0.6.16/install.sh | sh
```


## Gestión de entornos de Python

### Pip y Venv

`pip` es el gestor de paquetes de Python. `venv` es la herramienta integrada para crear entornos virtuales en Python. Un entorno virtual es un directorio independiente que contiene una instalación de Python para una versión específica, además de varios paquetes adicionales. Esto es útil para gestionar las dependencias de diferentes proyectos por separado.

Para crear un entorno virtual, ejecuta el siguiente comando en tu terminal:

```console
$ python -m venv <env_path> # normalmente <env_path> es un directorio `.venv` en tu proyecto
```
Esto creará un nuevo directorio llamado `<env_path>` que contiene una copia del intérprete de Python y la biblioteca estándar. Para activar el entorno virtual, ejecuta el siguiente comando:

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```
Esto cambiará el prompt de tu terminal para indicar que ahora estás trabajando dentro del entorno virtual. Para desactivar el entorno virtual, ejecuta el siguiente comando:

```console
$ deactivate
```
Esto te devolverá al intérprete de Python predeterminado de tu sistema con todas sus librerías instaladas.

Mientras el entorno virtual esté activado, puedes usar `pip` para instalar paquetes en él. Por ejemplo, para instalar la última versión de `numpy`, ejecuta el siguiente comando:

```console
$ pip install numpy
```
Esto instalará `numpy` en el entorno virtual y no afectará a la instalación de Python de todo el sistema. Para instalar una versión específica de `numpy`, ejecuta el siguiente comando:

```console
$ pip install numpy==1.23.4
```
Esto instalará la versión `1.23.4` de `numpy` en el entorno virtual. Para listar todos los paquetes instalados en el entorno virtual, ejecuta el siguiente comando:

```console
$ pip list
```
Esto te mostrará una lista de todos los paquetes instalados en el entorno virtual, junto con sus versiones. Para desinstalar un paquete, ejecuta el siguiente comando:

```console
$ pip uninstall numpy
```
Esto desinstalará `numpy` del entorno virtual. Para actualizar un paquete, ejecuta el siguiente comando:

```console
$ pip install --upgrade numpy
```
Esto actualizará `numpy` a la última versión en el entorno virtual.

### uv

`uv` no solo puede gestionar versiones de Python, sino también entornos de Python. Para crear un nuevo entorno de Python, ejecuta el siguiente comando:

```console
$ uv venv --python <python_version> # ej. 3.10, 3.11, ...
```
Esto creará un nuevo directorio llamado `.venv` que contiene una copia del intérprete de Python y la biblioteca estándar. Para activar el entorno virtual, ejecuta el siguiente comando:

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```

Después de activar el entorno virtual, puedes usar `uv pip` para instalar paquetes en él. Por ejemplo, para instalar la última versión de `numpy`, ejecuta el siguiente comando:

```console
$ uv pip install numpy
```