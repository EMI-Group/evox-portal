---
title: "2. Instalación y Configuración del Entorno"
order: 2
---

# 2. Instalación y Configuración del Entorno

Antes de usar EvoX, es necesario instalar correctamente el software y sus dependencias. Este capítulo cubre los pasos de instalación tanto para Windows como para Linux, así como la forma de preparar y configurar las dependencias requeridas. Asegúrese de cumplir con los requisitos básicos del sistema antes de la instalación: **Python 3.10+**, espacio en disco suficiente y, opcionalmente, una GPU compatible con el driver adecuado.

## Dependencias y Preparativos

- **Entorno de Python**: EvoX está construido sobre Python, así que asegúrese de tener instalado Python 3.10 o superior. Se recomienda utilizar un entorno virtual (como `venv`) para evitar conflictos de dependencias.

- **PyTorch**: EvoX utiliza PyTorch para operaciones de tensores y aceleración de hardware. Por lo tanto, **PyTorch debe instalarse antes de instalar EvoX**. Elija la versión según su hardware: instale la versión CUDA si tiene una GPU NVIDIA, la versión ROCm para GPUs AMD, o la versión CPU si no hay una GPU disponible. Consulte la [guía oficial de PyTorch](https://pytorch.org) para obtener el comando adecuado, por ejemplo:

  ```bash
  # For NVIDIA GPUs (CUDA)
  pip install torch torchvision torchaudio

  # For AMD GPUs (ROCm)
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.2.4

  # For CPU-only
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
  ```

Se recomienda actualizar `pip` a la última versión y asegurar una conexión a internet estable antes de la instalación (los paquetes se descargarán de PyPI). Una vez que el entorno esté listo, puede instalar EvoX.

### Instalación en Windows

Los usuarios de Windows pueden elegir entre la **instalación automática mediante script** o la **instalación manual**. El instalador oficial de un solo clic ofrece una forma sencilla de configurar EvoX y sus dependencias en un entorno limpio, pero la instalación manual permite un mayor control.

**Opción 1: Uso del script de instalación de un solo clic (win-install.bat)**
EvoX proporciona un [script de instalación rápida](/_static/win-install.bat) para Windows 10/11 (64 bits). El script instala Miniforge3 (un Conda ligero), Python, PyTorch (con CUDA), EvoX y herramientas útiles como VSCode y Git. Para usarlo:

1. Descargue `win-install.bat` de la documentación de EvoX o de GitHub. Asegúrese de tener instalado un [driver de NVIDIA](https://www.nvidia.com/en-us/drivers/) y una conexión a internet estable.
2. Ejecute el script. No requiere privilegios de administrador, pero puede solicitar permiso durante la ejecución; acéptelo. El script instalará y configurará todo automáticamente.
3. Espere a que finalice. Tras el éxito, verá un mensaje y posiblemente se abra VSCode. EvoX y sus dependencias estarán instalados.

> **Nota**: Si el script falla debido a problemas de red, ciérrelo y vuelva a ejecutarlo. Admite la reanudación en caso de fallo.

**Opción 2: Instalación manual**
Para instalar EvoX manualmente:

1. **Instalar el driver de la GPU**: Instale el último driver de NVIDIA desde el [sitio web oficial](https://www.nvidia.cn/Download/index.aspx). Si no tiene una GPU dedicada, omita este paso.

2. **Instalar Python**: Descargue [Python 3.10+ para Windows](https://www.python.org/downloads/windows/) y active la opción “Add Python to PATH” durante la instalación.

3. **Instalar PyTorch**: Abra CMD o PowerShell e instale PyTorch según su hardware:

   ```bash
   pip install torch torchvision torchaudio
   ```

4. **(Opcional) Instalar el compilador Triton**: PyTorch en Windows carece de soporte para Triton. Si desea utilizar `torch.compile` (disponible en PyTorch 2.0), instale el paquete de terceros [triton-windows](https://github.com/woct0rdho/triton-windows). Es opcional pero útil para la optimización del rendimiento.

5. **Instalar EvoX**:

   ```bash
   pip install "evox[default]"

   # Optional extras:
   pip install "evox[vis]"           # Visualization support
   pip install "evox[neuroevolution]" # Neuroevolution support
   ```


  > **Nota:**
> Algunos paquetes pueden requerir dependencias adicionales del sistema. Si este es el caso, el instalador le mostrará un mensaje como el siguiente:
  ```console
  error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
  ```

  Cuando encuentre este tipo de mensajes, siga las instrucciones proporcionadas para instalar las dependencias necesarias antes de continuar.


### Instalación en Linux

Instalar EvoX en Linux (por ejemplo, Ubuntu) es sencillo y se realiza principalmente a través de `pip`.

1. **Instalar dependencias del sistema**: Asegúrese de que las herramientas básicas de desarrollo y Python 3.10+ estén instalados. Puede usar un administrador de paquetes (apt, yum) o Anaconda.

2. **Instalar el driver de la GPU** (si usa GPU): Use el administrador de paquetes adecuado (por ejemplo, `apt`) para instalar los drivers de NVIDIA. Verifique la instalación con `nvidia-smi`. Omita este paso si usa CPU.

> **Nota:**
> En WSL, **no** instale los drivers de NVIDIA dentro del subsistema Linux; instálelos en el lado de Windows.

> **Tip:**
> Es muy probable que solo necesite instalar el driver, pero NO necesite instalar CUDA u otras dependencias.
> Esas librerías ya están incluidas en la instalación de PyTorch a través de pip.

> **Tip:**
> La versión del driver requerida depende de su hardware. Si tiene una GPU NVIDIA reciente, usar la versión más reciente del driver suele ser la mejor opción.
> Para asegurar una mejor compatibilidad y acceso a los drivers más recientes, generalmente es una buena idea usar una distribución de Linux más nueva (por ejemplo, Ubuntu 25.04 en lugar de 22.04).

1. **Instalar PyTorch**: Al igual que en Windows, instale según su hardware. Consulte la [guía oficial de PyTorch](https://pytorch.org).

2. **Instalar EvoX**:

   ```bash
   pip install evox
   ```

   O con extras:

   ```bash
   pip install evox[vis,neuroevolution]
   ```

   Esto instala los módulos de visualización y las dependencias de neuroevolución (como Brax). También puede elegir extras individuales como `vis` o `neuroevolution`.

#### Instalación en contenedores (Docker, Podman)

Para los usuarios de GPUs AMD o aquellos que buscan aislamiento del entorno, se recomienda Docker. Por ejemplo, usando la imagen oficial de Docker de PyTorch con ROCm:

```bash
docker run -it --gpus all --shm-size=8g rocm/pytorch:latest
```

Dentro del contenedor, instale EvoX como de costumbre usando `pip`.

## Verificando la Instalación de EvoX

Para verificar que EvoX está instalado correctamente:

- **Comprobación básica**: En la terminal o en el shell de Python, ejecute:

  ```python
  from torch.utils.collect_env import get_pretty_env_info
  import evox
  print(get_pretty_env_info())
  ```

  Esto imprime la información de configuración de PyTorch y del sistema. Si EvoX se importa sin errores, la instalación fue exitosa. También puede verificar la versión:

  ```python
  import evox
  print(evox.__version__)
  ```

- **Configuraciones opcionales**: Puede ajustar configuraciones relacionadas con el rendimiento, como:

  - Configurar variables de entorno como `OMP_NUM_THREADS` para controlar el número de hilos de la CPU.
  - Aumentar la memoria compartida de Docker con `--shm-size`.
  - Asegurarse de que su IDE (Jupyter, PyCharm, etc.) utilice el entorno de Python correcto.

Una vez completada la configuración, estará listo para comenzar a optimizar con EvoX.