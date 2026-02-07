---
title: "Guia de Instalacion de Python"
order: 1
section: "install"
---

# Guia de Instalacion de Python

Esta guia es para aquellos que son nuevos en el lenguaje de programacion Python y desean instalarlo en su sistema.
Le ayudara a configurar el entorno Python necesario para ejecutar EvoX.

> **Consejo:**
> EvoX esta escrito en Python, por lo que necesitara tener Python instalado en su sistema.
> EvoX soporta Python 3.10 y superior, y recomendamos usar la **ultima version** de Python.

## Instalar el interprete de Python

### Version de Windows

Vaya a [Descargar Python](https://www.python.org/downloads/) y descargue la ultima version de Python.

> **Nota:**
> Asegurese de marcar la casilla que dice "Add Python to PATH" durante el proceso de instalacion.

### Version de Linux

Diferentes distribuciones de Linux tienen diferentes formas de instalar Python.
Depende del gestor de paquetes de su distribucion.
Aqui hay algunos ejemplos:
- Debian/Ubuntu: `apt`
- Archlinux: `pacman`
- Fedora: `dnf`

### Instalar a traves de `uv`

`uv` es un gestor de paquetes y proyectos Python extremadamente rapido, que funciona en Windows, Linux y MacOS.
Recomendamos usar `uv` para instalar el interprete de Python asi como para gestionar entornos Python.
La guia de instalacion detallada se puede encontrar en la [guia de instalacion de uv](https://docs.astral.sh/uv/getting-started/installation/#installation-methods).


### Windows
Use `irm` para descargar el script y ejecutelo con `iex`:

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Cambiar la [politica de ejecucion](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4#powershell-execution-policies) permite ejecutar un script de internet.

Solicite una version especifica incluyendola en la URL:

```console
$ powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.6.16/install.ps1 | iex"
```


### Linux y MacOS
Use `curl` para descargar el script y ejecutelo con `sh`:

```console
$ curl -LsSf https://astral.sh/uv/install.sh | sh
```

Si su sistema no tiene `curl`, puede usar `wget`:

```console
$ wget -qO- https://astral.sh/uv/install.sh | sh
```

Solicite una version especifica incluyendola en la URL:

```console
$ curl -LsSf https://astral.sh/uv/0.6.16/install.sh | sh
```


## Gestion de Entornos Python

### Pip y Venv

`pip` es el gestor de paquetes para Python. `venv` es la herramienta incorporada para crear entornos virtuales en Python.
Un entorno virtual es un directorio autocontenido que contiene una instalacion de Python para una version particular de Python, mas varios paquetes adicionales.
Esto es util para gestionar dependencias de diferentes proyectos por separado.

Para crear un entorno virtual, ejecute el siguiente comando en su terminal:

```console
$ python -m venv <env_path> # generalmente <env_path> es un directorio `.venv` en su proyecto
```
Esto creara un nuevo directorio llamado `<env_path>` que contiene una copia del interprete de Python y la biblioteca estandar.
Para activar el entorno virtual, ejecute el siguiente comando:

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```
Esto cambiara el prompt de su shell para indicar que ahora esta trabajando dentro del entorno virtual.
Para desactivar el entorno virtual, ejecute el siguiente comando:

```console
$ deactivate
```
Esto le devolvera al interprete de Python predeterminado de su sistema con todas sus bibliotecas instaladas.

Mientras el entorno virtual este activado, puede usar `pip` para instalar paquetes en el entorno virtual.
Por ejemplo, para instalar la ultima version de `numpy`, ejecute el siguiente comando:

```console
$ pip install numpy
```
Esto instalara `numpy` en el entorno virtual, y no afectara la instalacion de Python del sistema.
Para instalar una version especifica de `numpy`, ejecute el siguiente comando:

```console
$ pip install numpy==1.23.4
```
Esto instalara la version `1.23.4` de `numpy` en el entorno virtual.
Para listar todos los paquetes instalados en el entorno virtual, ejecute el siguiente comando:

```console
$ pip list
```
Esto le mostrara una lista de todos los paquetes instalados en el entorno virtual, junto con sus versiones.
Para desinstalar un paquete, ejecute el siguiente comando:

```console
$ pip uninstall numpy
```
Esto desinstalara `numpy` del entorno virtual.
Para actualizar un paquete, ejecute el siguiente comando:

```console
$ pip install --upgrade numpy
```
Esto actualizara `numpy` a la ultima version en el entorno virtual.

### uv

`uv` no solo puede gestionar versiones de Python, sino tambien gestionar entornos Python.
Para crear un nuevo entorno Python, ejecute el siguiente comando:

```console
$ uv venv --python <python_version> # por ejemplo 3.10, 3.11, ...
```
Esto creara un nuevo directorio llamado `.venv` que contiene una copia del interprete de Python y la biblioteca estandar.
Para activar el entorno virtual, ejecute el siguiente comando:

```console
$ source <env_path>/bin/activate # Bash
$ source <env_path>/bin/activate.fish # Fish
$ <env_path>\Scripts\activate # Windows
```

Despues de activar el entorno virtual, puede usar `uv pip` para instalar paquetes en el entorno virtual.
Por ejemplo, para instalar la ultima version de `numpy`, ejecute el siguiente comando:

```console
$ uv pip install numpy
```
