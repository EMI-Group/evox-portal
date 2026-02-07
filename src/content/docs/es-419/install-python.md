---
title: "Guia de Instalacion de Python"
order: 1
section: "install"
---

# Guia de Instalacion de Python

Esta guia es para aquellos que son nuevos en el lenguaje de programacion Python y desean instalarlo en su sistema.
Te ayudara a configurar el entorno Python necesario para ejecutar EvoX.

> **Consejo:**
> EvoX esta escrito en Python, por lo que necesitaras tener Python instalado en tu sistema.
> EvoX soporta Python 3.10 y superior, y recomendamos usar la **ultima version** de Python.

## Instalar el interprete de Python

### Version para Windows

Ve a [Descargar Python](https://www.python.org/downloads/) y descarga la ultima version de Python.

> **Nota:**
> Asegurate de marcar la casilla que dice "Add Python to PATH" durante el proceso de instalacion.

### Version para Linux

Diferentes distribuciones de Linux tienen diferentes formas de instalar Python.
Depende del gestor de paquetes de tu distribucion.
Aqui hay algunos ejemplos:
- Debian/Ubuntu: `apt`
- Archlinux: `pacman`
- Fedora: `dnf`

### Instalar a traves de `uv`

`uv` es un gestor de paquetes y proyectos Python extremadamente rapido, que funciona en Windows, Linux y MacOS.
Recomendamos usar `uv` para instalar el interprete de Python asi como para gestionar entornos Python.
La guia de instalacion detallada se puede encontrar en la [guia de instalacion de uv](https://docs.astral.sh/uv/getting-started/installation/#installation-methods).


### Windows
Usa `irm` para descargar el script y ejecutarlo con `iex`:

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Cambiar la [politica de ejecucion](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4#powershell-execution-policies) permite ejecutar un script desde internet.

Solicita una version especifica incluyendola en la URL:

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.6.16/install.ps1 | iex"
```


### Linux y MacOS
Usa `curl` para descargar el script y ejecutarlo con `sh`:

```console
$ curl -LsSf https://astral.sh/uv/install.sh | sh
```

Si tu sistema no tiene `curl`, puedes usar `wget`:

```console
$ wget -qO- https://astral.sh/uv/install.sh | sh
```

Solicita una version especifica incluyendola en la URL:

```console
$ curl -LsSf https://astral.sh/uv/0.6.16/install.sh | sh
```


## Gestion de Entornos Python

### Pip y Venv

`pip` es el gestor de paquetes para Python. `venv` es la herramienta integrada para crear entornos virtuales en Python.
Un entorno virtual es un directorio autocontenido que contiene una instalacion de Python para una version particular de Python, mas varios paquetes adicionales.
Esto es util para gestionar dependencias de diferentes proyectos por separado.

Para crear un entorno virtual, ejecuta el siguiente comando en tu terminal:

```console
$ python -m venv <env_path> # generalmente <env_path> es un directorio `.venv` en tu proyecto
```
Esto creara un nuevo directorio llamado `<env_path>` que contiene una copia del interprete de Python y la biblioteca estandar.
Para activar el entorno virtual, ejecuta el siguiente comando:

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```
Esto cambiara el prompt de tu shell para indicar que ahora estas trabajando dentro del entorno virtual.
Para desactivar el entorno virtual, ejecuta el siguiente comando:

```console
$ deactivate
```
Esto te devolvera al interprete de Python predeterminado de tu sistema con todas sus bibliotecas instaladas.

Mientras el entorno virtual este activado, puedes usar `pip` para instalar paquetes en el entorno virtual.
Por ejemplo, para instalar la ultima version de `numpy`, ejecuta el siguiente comando:

```console
$ pip install numpy
```
Esto instalara `numpy` en el entorno virtual, y no afectara la instalacion de Python del sistema.
Para instalar una version especifica de `numpy`, ejecuta el siguiente comando:

```console
$ pip install numpy==1.23.4
```
Esto instalara la version `1.23.4` de `numpy` en el entorno virtual.
Para listar todos los paquetes instalados en el entorno virtual, ejecuta el siguiente comando:

```console
$ pip list
```
Esto te mostrara una lista de todos los paquetes instalados en el entorno virtual, junto con sus versiones.
Para desinstalar un paquete, ejecuta el siguiente comando:

```console
$ pip uninstall numpy
```
Esto desinstalara `numpy` del entorno virtual.
Para actualizar un paquete, ejecuta el siguiente comando:

```console
$ pip install --upgrade numpy
```
Esto actualizara `numpy` a la ultima version en el entorno virtual.

### uv

`uv` no solo puede gestionar versiones de Python, sino tambien gestionar entornos Python.
Para crear un nuevo entorno Python, ejecuta el siguiente comando:

```console
$ uv venv --python <python_version> # por ejemplo 3.10, 3.11, ...
```
Esto creara un nuevo directorio llamado `.venv` que contiene una copia del interprete de Python y la biblioteca estandar.
Para activar el entorno virtual, ejecuta el siguiente comando:

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```

Despues de activar el entorno virtual, puedes usar `uv pip` para instalar paquetes en el entorno virtual.
Por ejemplo, para instalar la ultima version de `numpy`, ejecuta el siguiente comando:

```console
$ uv pip install numpy
```
