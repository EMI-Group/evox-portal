---
title: "2. Instalacion y Configuracion del Entorno"
order: 2
---

# 2. Instalacion y Configuracion del Entorno

Antes de usar EvoX, necesita instalar correctamente el software y sus dependencias. Este capitulo cubre los pasos de instalacion tanto para Windows como para Linux, asi como la preparacion y configuracion de las dependencias requeridas. Asegurese de cumplir con los requisitos basicos del sistema antes de la instalacion: **Python 3.10+**, suficiente espacio en disco y, opcionalmente, una GPU compatible con el controlador apropiado.

## Dependencias y Preparativos

- **Entorno Python**: EvoX esta construido sobre Python, asi que asegurese de tener instalado Python 3.10 o superior. Se recomienda usar un entorno virtual (como `venv`) para evitar conflictos de dependencias.

- **PyTorch**: EvoX utiliza PyTorch para operaciones con tensores y aceleracion por hardware. Por lo tanto, **PyTorch debe instalarse antes de instalar EvoX**. Elija la version segun su hardware: instale la version CUDA si tiene una GPU NVIDIA, la version ROCm para GPUs AMD, o la version CPU si no tiene GPU disponible. Consulte la [guia oficial de PyTorch](https://pytorch.org) para el comando apropiado, por ejemplo:

  ```bash
  # Para GPUs NVIDIA (CUDA)
  pip install torch torchvision torchaudio

  # Para GPUs AMD (ROCm)
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.2.4

  # Solo CPU
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
  ```

Se recomienda actualizar `pip` a la ultima version y asegurar una conexion a internet estable antes de la instalacion (los paquetes se descargaran desde PyPI). Una vez que el entorno este listo, puede instalar EvoX.

### Instalacion en Windows

Los usuarios de Windows pueden elegir entre **instalacion automatica por script** o **instalacion manual**. El instalador oficial de un clic proporciona una forma facil de configurar EvoX y sus dependencias en un entorno limpio, pero la instalacion manual permite mas control.

**Opcion 1: Usando el Script de Instalacion de Un Clic (win-install.bat)**
EvoX proporciona un [script de instalacion rapida](/_static/win-install.bat) para Windows 10/11 (64 bits). El script instala Miniforge3 (un Conda ligero), Python, PyTorch (con CUDA), EvoX y herramientas utiles como VSCode y Git. Para usarlo:

1. Descargue `win-install.bat` de la documentacion de EvoX o GitHub. Asegurese de tener un [controlador NVIDIA](https://www.nvidia.com/en-us/drivers/) instalado y una conexion a internet estable.
2. Ejecute el script. No requiere privilegios de administrador, pero puede solicitar permiso durante la ejecucion; permitalo. El script instalara y configurara todo automaticamente.
3. Espere a que se complete. Al finalizar con exito, vera un mensaje y posiblemente VSCode abriendose. EvoX y sus dependencias estaran instalados.

> **Nota**: Si el script falla debido a problemas de red, cierrelo y vuelva a ejecutarlo. Soporta reanudacion en caso de fallo.

**Opcion 2: Instalacion Manual**
Para instalar EvoX manualmente:

1. **Instalar Controlador GPU**: Instale el ultimo controlador NVIDIA desde el [sitio web oficial](https://www.nvidia.cn/Download/index.aspx). Si no tiene GPU dedicada, omita este paso.

2. **Instalar Python**: Descargue [Python 3.10+ para Windows](https://www.python.org/downloads/windows/) y habilite "Agregar Python al PATH" durante la instalacion.

3. **Instalar PyTorch**: Abra CMD o PowerShell e instale PyTorch segun su hardware:

   ```bash
   pip install torch torchvision torchaudio
   ```

4. **(Opcional) Instalar Compilador Triton**: PyTorch en Windows carece de soporte para Triton. Si desea usar `torch.compile` (disponible en PyTorch 2.0), instale el paquete de terceros [triton-windows](https://github.com/woct0rdho/triton-windows). Opcional pero util para la optimizacion del rendimiento.

5. **Instalar EvoX**:

   ```bash
   pip install "evox[default]"

   # Extras opcionales:
   pip install "evox[vis]"           # Soporte de visualizacion
   pip install "evox[neuroevolution]" # Soporte de neuroevolucion
   ```


  `> **Nota:**
> Algunos paquetes pueden requerir dependencias adicionales del sistema. Si este es el caso, el instalador le mostrara un mensaje como el siguiente:console
  error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
  ```

  Cuando encuentre tales mensajes, siga las instrucciones proporcionadas para instalar las dependencias necesarias antes de continuar.
  ````


### Instalacion en Linux

Instalar EvoX en Linux (por ejemplo, Ubuntu) es sencillo y se maneja principalmente a traves de `pip`.

1. **Instalar Dependencias del Sistema**: Asegurese de que las herramientas basicas de desarrollo y Python 3.10+ esten instalados. Puede usar un gestor de paquetes (apt, yum) o Anaconda.

2. **Instalar Controlador GPU** (si usa GPU): Use el gestor de paquetes apropiado (por ejemplo, `apt`) para instalar los controladores NVIDIA. Verifique la instalacion con `nvidia-smi`. Omita si usa CPU.

> **Nota:**
> En WSL, **no** instale controladores NVIDIA dentro del subsistema Linux; instalelos en el lado de Windows.

> **Consejo:**
> Es muy probable que solo necesite instalar el controlador, pero NO necesite instalar CUDA u otras dependencias.
> Esas bibliotecas ya estan incluidas en la instalacion de PyTorch a traves de pip.

> **Consejo:**
> La version del controlador requerida depende de su hardware. Si tiene una GPU NVIDIA reciente, usar la ultima version del controlador suele ser la mejor opcion.
> Para garantizar mejor compatibilidad y acceso a los ultimos controladores, generalmente es buena idea usar una distribucion Linux mas nueva (por ejemplo, Ubuntu 25.04 en lugar de 22.04).

1. **Instalar PyTorch**: Como en Windows, instale segun su hardware. Consulte la [guia oficial de PyTorch](https://pytorch.org).

2. **Instalar EvoX**:

   ```bash
   pip install evox
   ```

   O con extras:

   ```bash
   pip install evox[vis,neuroevolution]
   ```

   Esto instala modulos de visualizacion y dependencias de neuroevolucion (como Brax). Tambien puede elegir extras individuales como `vis` o `neuroevolution`.

#### Instalacion en Contenedor (Docker, Podman)

Para usuarios de GPU AMD o aquellos que buscan aislamiento de entorno, se recomienda Docker. Por ejemplo, usando la imagen oficial de Docker de PyTorch con ROCm:

```bash
docker run -it --gpus all --shm-size=8g rocm/pytorch:latest
```

Dentro del contenedor, instale EvoX como de costumbre usando `pip`.

## Verificar la Instalacion de EvoX

Para verificar que EvoX esta correctamente instalado:

- **Verificacion Basica**: En la terminal o shell de Python, ejecute:

  ```python
  from torch.utils.collect_env import get_pretty_env_info
  import evox
  print(get_pretty_env_info())
  ```

  Esto imprime informacion de configuracion de PyTorch y del sistema. Si EvoX se importa sin errores, la instalacion fue exitosa. Tambien puede verificar la version:

  ```python
  import evox
  print(evox.__version__)
  ```

- **Configuraciones Opcionales**: Puede ajustar configuraciones relacionadas con el rendimiento, como:

  - Establecer variables de entorno como `OMP_NUM_THREADS` para controlar el numero de hilos de CPU
  - Aumentar la memoria compartida de Docker con `--shm-size`
  - Asegurarse de que su IDE (Jupyter, PyCharm, etc.) use el entorno Python correcto

Una vez que la configuracion este completa, esta listo para comenzar a optimizar con EvoX.
