---
title: "2. Instalacion y Configuracion del Entorno"
order: 2
---

# 2. Instalacion y Configuracion del Entorno

Antes de usar EvoX, necesitas instalar correctamente el software y sus dependencias. Este capitulo cubre los pasos de instalacion tanto para Windows como para Linux, asi como la preparacion y configuracion de las dependencias requeridas. Asegurate de cumplir con los requisitos basicos del sistema antes de la instalacion: **Python 3.10+**, suficiente espacio en disco y, opcionalmente, una GPU compatible con el controlador apropiado.

## Dependencias y Preparativos

- **Entorno Python**: EvoX esta construido sobre Python, asi que asegurate de tener instalado Python 3.10 o superior. Se recomienda usar un entorno virtual (como `venv`) para evitar conflictos de dependencias.

- **PyTorch**: EvoX utiliza PyTorch para operaciones con tensores y aceleracion por hardware. Por lo tanto, **PyTorch debe instalarse antes de instalar EvoX**. Elige la version segun tu hardware: instala la version CUDA si tienes una GPU NVIDIA, la version ROCm para GPUs AMD, o la version CPU si no tienes GPU disponible. Consulta la [guia oficial de PyTorch](https://pytorch.org) para el comando apropiado, por ejemplo:

  ```bash
  # Para GPUs NVIDIA (CUDA)
  pip install torch torchvision torchaudio

  # Para GPUs AMD (ROCm)
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.2.4

  # Solo CPU
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
  ```

Se recomienda actualizar `pip` a la ultima version y asegurar una conexion a internet estable antes de la instalacion (los paquetes se descargaran desde PyPI). Una vez que el entorno este listo, puedes instalar EvoX.

### Instalacion en Windows

Los usuarios de Windows pueden elegir entre **instalacion automatica con script** o **instalacion manual**. El instalador oficial de un clic proporciona una forma facil de configurar EvoX y sus dependencias en un entorno limpio, pero la instalacion manual permite mayor control.

**Opcion 1: Usando el Script de Instalacion de Un Clic (win-install.bat)**
EvoX proporciona un [script de instalacion rapida](/_static/win-install.bat) para Windows 10/11 (64 bits). El script instala Miniforge3 (un Conda ligero), Python, PyTorch (con CUDA), EvoX y herramientas utiles como VSCode y Git. Para usarlo:

1. Descarga `win-install.bat` desde la documentacion de EvoX o GitHub. Asegurate de tener un [controlador NVIDIA](https://www.nvidia.com/en-us/drivers/) instalado y una conexion a internet estable.
2. Ejecuta el script. No requiere privilegios de administrador, pero puede solicitar permisos durante la ejecucion; permitelos. El script instalara y configurara todo automaticamente.
3. Espera a que se complete. Al finalizar exitosamente, veras un mensaje y posiblemente VSCode se abrira. EvoX y sus dependencias estaran instalados.

> **Nota**: Si el script falla debido a problemas de red, cierralo y vuelve a ejecutarlo. Soporta reanudacion en caso de fallo.

**Opcion 2: Instalacion Manual**
Para instalar EvoX manualmente:

1. **Instalar Controlador de GPU**: Instala el ultimo controlador NVIDIA desde el [sitio web oficial](https://www.nvidia.cn/Download/index.aspx). Si no tienes GPU dedicada, omite este paso.

2. **Instalar Python**: Descarga [Python 3.10+ para Windows](https://www.python.org/downloads/windows/) y habilita "Agregar Python al PATH" durante la instalacion.

3. **Instalar PyTorch**: Abre CMD o PowerShell e instala PyTorch segun tu hardware:

   ```bash
   pip install torch torchvision torchaudio
   ```

4. **(Opcional) Instalar Compilador Triton**: PyTorch en Windows carece de soporte para Triton. Si deseas usar `torch.compile` (disponible en PyTorch 2.0), instala el paquete de terceros [triton-windows](https://github.com/woct0rdho/triton-windows). Opcional pero util para optimizacion de rendimiento.

5. **Instalar EvoX**:

   ```bash
   pip install "evox[default]"

   # Extras opcionales:
   pip install "evox[vis]"           # Soporte de visualizacion
   pip install "evox[neuroevolution]" # Soporte de neuroevolucion
   ```


  `> **Nota:**
> Algunos paquetes pueden requerir dependencias adicionales del sistema. Si este es el caso, el instalador te mostrara un mensaje como el siguiente:console
  error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
  ```

  Cuando encuentres tales mensajes, sigue las instrucciones proporcionadas para instalar las dependencias necesarias antes de continuar.
  ````


### Instalacion en Linux

Instalar EvoX en Linux (por ejemplo, Ubuntu) es sencillo y se maneja principalmente a traves de `pip`.

1. **Instalar Dependencias del Sistema**: Asegurate de que las herramientas basicas de desarrollo y Python 3.10+ esten instalados. Puedes usar un gestor de paquetes (apt, yum) o Anaconda.

2. **Instalar Controlador de GPU** (si usas GPU): Usa el gestor de paquetes apropiado (por ejemplo, `apt`) para instalar los controladores NVIDIA. Verifica la instalacion con `nvidia-smi`. Omite si usas CPU.

> **Nota:**
> En WSL, **no** instales controladores NVIDIA dentro del subsistema Linux; instalalo en el lado de Windows.

> **Consejo:**
> Es muy probable que solo necesites instalar el controlador, pero NO necesites instalar CUDA u otras dependencias.
> Esas bibliotecas ya estan incluidas en la instalacion de PyTorch via pip.

> **Consejo:**
> La version del controlador requerida depende de tu hardware. Si tienes una GPU NVIDIA reciente, usar la ultima version del controlador suele ser la mejor opcion.
> Para asegurar mejor compatibilidad y acceso a los ultimos controladores, generalmente es buena idea usar una distribucion Linux mas nueva (por ejemplo, Ubuntu 25.04 en lugar de 22.04).

1. **Instalar PyTorch**: Como en Windows, instala segun el hardware. Consulta la [guia oficial de PyTorch](https://pytorch.org).

2. **Instalar EvoX**:

   ```bash
   pip install evox
   ```

   O con extras:

   ```bash
   pip install evox[vis,neuroevolution]
   ```

   Esto instala modulos de visualizacion y dependencias de neuroevolucion (como Brax). Tambien puedes elegir extras individuales como `vis` o `neuroevolution`.

#### Instalacion en Contenedor (Docker, Podman)

Para usuarios de GPU AMD o aquellos que buscan aislamiento de entorno, se recomienda Docker. Por ejemplo, usando la imagen oficial de Docker de PyTorch con ROCm:

```bash
docker run -it --gpus all --shm-size=8g rocm/pytorch:latest
```

Dentro del contenedor, instala EvoX como de costumbre usando `pip`.

## Verificacion de la Instalacion de EvoX

Para verificar que EvoX esta correctamente instalado:

- **Verificacion Basica**: En la terminal o shell de Python, ejecuta:

  ```python
  from torch.utils.collect_env import get_pretty_env_info
  import evox
  print(get_pretty_env_info())
  ```

  Esto imprime la informacion de configuracion de PyTorch y del sistema. Si EvoX se importa sin errores, la instalacion fue exitosa. Tambien puedes verificar la version:

  ```python
  import evox
  print(evox.__version__)
  ```

- **Configuraciones Opcionales**: Puedes ajustar configuraciones relacionadas con el rendimiento, como:

  - Establecer variables de entorno como `OMP_NUM_THREADS` para controlar el conteo de hilos de CPU
  - Aumentar la memoria compartida de Docker con `--shm-size`
  - Asegurar que tu IDE (Jupyter, PyCharm, etc.) use el entorno Python correcto

Una vez que la configuracion este completa, estas listo para comenzar a optimizar con EvoX.
