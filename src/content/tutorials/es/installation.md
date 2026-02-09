---
title: "2. Instalación y configuración del entorno"
order: 2
---

# 2. Instalación y configuración del entorno

Antes de usar EvoX, es necesario instalar correctamente el software y sus dependencias. Este capítulo cubre los pasos de instalación tanto para Windows como para Linux, así como la preparación y configuración de las dependencias necesarias. Asegúrate de cumplir con los requisitos básicos del sistema antes de la instalación: **Python 3.10+**, espacio en disco suficiente y, opcionalmente, una GPU compatible con el controlador adecuado.

## Dependencias y preparativos

- **Entorno de Python**: EvoX está basado en Python, por lo que debes asegurarte de tener instalado Python 3.10 o superior. Se recomienda utilizar un entorno virtual (como `venv`) para evitar conflictos de dependencias.

- **PyTorch**: EvoX utiliza PyTorch para operaciones de tensores y aceleración de hardware. Por lo tanto, **PyTorch debe instalarse antes que EvoX**. Elige la versión según tu hardware: instala la versión CUDA si tienes una GPU NVIDIA, la versión ROCm para GPUs AMD, o la versión CPU si no dispones de GPU. Consulta la [guía oficial de PyTorch](https://pytorch.org) para obtener el comando adecuado, por ejemplo:

  ```bash
  # For NVIDIA GPUs (CUDA)
  pip install torch torchvision torchaudio

  # For AMD GPUs (ROCm)
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.2.4

  # For CPU-only
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
  ```

Se recomienda actualizar `pip` a la última versión y asegurar una conexión a internet estable antes de la instalación (los paquetes se descargarán de PyPI). Una vez que el entorno esté listo, puedes instalar EvoX.

### Instalación en Windows

Los usuarios de Windows pueden elegir entre la **instalación mediante script automático** o la **instalación manual**. El instalador oficial de un solo clic ofrece una forma sencilla de configurar EvoX y sus dependencias en un entorno limpio, mientras que la instalación manual permite un mayor control.

**Opción 1: Uso del script de instalación de un solo clic (win-install.bat)**
EvoX proporciona un [script de instalación rápida](/_static/win-install.bat) para Windows 10/11 (64 bits). El script instala Miniforge3 (un Conda ligero), Python, PyTorch (con CUDA), EvoX y herramientas útiles como VSCode y Git. Para usarlo:

1. Descarga `win-install.bat` desde la documentación de EvoX o GitHub. Asegúrate de tener instalado un [controlador de NVIDIA](https://www.nvidia.com/en-us/drivers/) y una conexión a internet estable.
2. Ejecuta el script. No requiere privilegios de administrador, pero puede solicitar permisos durante la ejecución; acéptalos. El script instalará y configurará todo automáticamente.
3. Espera a que finalice. Si tiene éxito, verás un mensaje y posiblemente se abra VSCode. EvoX y sus dependencias estarán instalados.

> **Nota**: Si el script falla debido a problemas de red, ciérralo y vuelve a ejecutarlo. Admite la reanudación en caso de fallo.

**Opción 2: Instalación manual**
Para instalar EvoX manualmente:

1. **Instalar el controlador de la GPU**: Instala el último controlador de NVIDIA desde el [sitio web oficial](https://www.nvidia.cn/Download/index.aspx). Si no tienes una GPU dedicada, sáltate este paso.

2. **Instalar Python**: Descarga [Python 3.10+ para Windows](https://www.python.org/downloads/windows/) y activa la opción “Add Python to PATH” durante la instalación.

3. **Instalar PyTorch**: Abre CMD o PowerShell e instala PyTorch según tu hardware:

   ```bash
   pip install torch torchvision torchaudio
   ```

4. **(Opcional) Instalar el compilador Triton**: PyTorch en Windows carece de soporte para Triton. Si deseas usar `torch.compile` (disponible en PyTorch 2.0), instala el paquete de terceros [triton-windows](https://github.com/woct0rdho/triton-windows). Es opcional pero útil para la optimización del rendimiento.

5. **Instalar EvoX**:

   ```bash
   pip install "evox[default]"

   # Optional extras:
   pip install "evox[vis]"           # Visualization support
   pip install "evox[neuroevolution]" # Neuroevolution support
   ```


  `> **Nota:**
> Algunos paquetes pueden requerir dependencias de sistema adicionales. Si este es el caso, el instalador te mostrará un mensaje como el siguiente:
  ```console
  error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
  ```

  Cuando encuentres este tipo de mensajes, sigue las instrucciones proporcionadas para instalar las dependencias necesarias antes de continuar.
  ````


### Instalación en Linux

Instalar EvoX en Linux (por ejemplo, Ubuntu) es sencillo y se gestiona principalmente a través de `pip`.

1. **Instalar dependencias del sistema**: Asegúrate de que las herramientas básicas de desarrollo y Python 3.10+ estén instalados. Puedes usar un gestor de paquetes (apt, yum) o Anaconda.

2. **Instalar el controlador de la GPU** (si se usa GPU): Utiliza el gestor de paquetes adecuado (por ejemplo, `apt`) para instalar los controladores de NVIDIA. Verifica la instalación con `nvidia-smi`. Sáltate este paso si usas CPU.

> **Nota:**
> En WSL, **no** instales los controladores de NVIDIA dentro del subsistema Linux; instálalos en el lado de Windows.

> **Consejo:**
> Es muy probable que solo necesites instalar el controlador, pero NO necesites instalar CUDA u otras dependencias.
> Esas librerías ya están incluidas en la instalación de PyTorch a través de pip.

> **Consejo:**
> La versión del controlador requerida depende de tu hardware. Si tienes una GPU NVIDIA reciente, usar la última versión del controlador suele ser la mejor opción.
> Para asegurar una mejor compatibilidad y acceso a los controladores más recientes, generalmente es una buena idea usar una distribución de Linux más nueva (por ejemplo, Ubuntu 25.04 en lugar de 22.04).

1. **Instalar PyTorch**: Al igual que en Windows, instálalo según el hardware. Consulta la [guía oficial de PyTorch](https://pytorch.org).

2. **Instalar EvoX**:

   ```bash
   pip install evox
   ```

   O con extras:

   ```bash
   pip install evox[vis,neuroevolution]
   ```

   Esto instala los módulos de visualización y las dependencias de neuroevolución (como Brax). También puedes elegir extras individuales como `vis` o `neuroevolution`.

#### Instalación en contenedores (Docker, Podman)

Para usuarios de GPUs AMD o aquellos que busquen aislamiento del entorno, se recomienda Docker. Por ejemplo, usando la imagen oficial de Docker de PyTorch con ROCm:

```bash
docker run -it --gpus all --shm-size=8g rocm/pytorch:latest
```

Dentro del contenedor, instala EvoX como de costumbre usando `pip`.

## Verificación de la instalación de EvoX

Para verificar que EvoX está correctamente instalado:

- **Comprobación básica**: En la terminal o en el shell de Python, ejecuta:

  ```python
  from torch.utils.collect_env import get_pretty_env_info
  import evox
  print(get_pretty_env_info())
  ```

  Esto imprime la información de configuración de PyTorch y del sistema. Si EvoX se importa sin errores, la instalación ha sido exitosa. También puedes comprobar la versión:

  ```python
  import evox
  print(evox.__version__)
  ```

- **Ajustes opcionales**: Puedes ajustar configuraciones relacionadas con el rendimiento, como:

  - Configurar variables de entorno como `OMP_NUM_THREADS` para controlar el número de hilos de la CPU.
  - Aumentar la memoria compartida de Docker con `--shm-size`.
  - Asegurarte de que tu IDE (Jupyter, PyCharm, etc.) utilice el entorno de Python correcto.

Una vez completada la configuración, ya estás listo para empezar a optimizar con EvoX.