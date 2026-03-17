---
title: "6. Solución de problemas y optimización"
order: 6
---

# 6. Solución de problemas y optimización

Al usar EvoX, es posible que encuentres problemas o desees ajustar tus algoritmos. Este capítulo describe problemas y soluciones comunes, junto con estrategias de depuración y consejos de ajuste de rendimiento para ayudarte a resolver inconvenientes y optimizar tu experiencia.

---

## 6.1 Problemas comunes y soluciones

Aquí hay algunos problemas encontrados con frecuencia y cómo abordarlos:

**(1) Errores de instalación o importación**:

- **Síntoma**: Error al ejecutar `import evox`.
- **Solución**:
  - **Verifica la instalación**: Ejecuta `pip show evox` para verificar. Si no está instalado, revisa tu entorno virtual y reinstala.
  - **Dependencias faltantes**: Si ves `ModuleNotFoundError: No module named 'torch'`, instala PyTorch como se describe en el Capítulo 2.
  - **Incompatibilidad de CUDA**: Asegúrate de que tu versión de PyTorch coincida con tus controladores CUDA instalados.

**(2) La GPU no se está utilizando**:

- **Síntoma**: EvoX se está ejecutando en la CPU en lugar de la GPU.
- **Solución**:
  - Verifica con `torch.cuda.is_available()`. Si es `False`, reinstala una versión de PyTorch compatible con GPU y verifica la instalación de CUDA.
  - Si es `True` pero EvoX sigue usando la CPU, asegúrate de que tus tensores se muevan a la GPU (consulta el Capítulo 3 para la configuración).

**(3) Memoria agotada (RAM/VRAM)**:

- **Síntoma**: Ves un `OutOfMemoryError`.
- **Solución**:
  - Reduce el tamaño de la población, la dimensión del problema o la frecuencia de evaluación.
  - Usa float16 (precisión media) o división de evaluación por lotes (batch evaluation splitting).
  - Desactiva los modos de depuración/deterministas en PyTorch.
  - Almacena solo estadísticas en lugar de frentes de Pareto completos (para multi-objetivo).
  - Actualizar el hardware es la solución definitiva para los cuellos de botella de memoria.

**(4) Estancamiento de la convergencia**:

- **Síntoma**: El algoritmo se queda atascado en un óptimo local.
- **Solución**:
  - Aumenta la diversidad de la población (por ejemplo, una tasa de mutación más alta).
  - Prueba diferentes algoritmos o parámetros.
  - Asegúrate de que la función objetivo esté bien definida (que no sea demasiado ruidosa o plana).
  - Ejecuta múltiples pruebas y elige la mejor; EvoX facilita las ejecuciones en paralelo.

**(5) Resultados de optimización deficientes**:

- **Síntoma**: Los resultados finales están por debajo de las expectativas.
- **Solución**:
  - **Verifica la definición del problema**: Asegúrate de que el fitness se calcule correctamente (por ejemplo, signos, escalado).
  - **Ajuste del algoritmo**: Prueba otros o ajusta los hiperparámetros.
  - **Usa curvas de convergencia**:
    - Línea plana temprana → convergencia prematura.
    - Oscilación → aleatoriedad demasiado alta.
  - Ajusta la configuración del algoritmo y analiza el comportamiento a lo largo del tiempo.

**(6) Conflictos de backend (JAX vs PyTorch)**:

- **Síntoma**: Instalaste accidentalmente la versión JAX de EvoX mientras usabas ejemplos de PyTorch.
- **Solución**: El comando predeterminado `pip install evox` te da la versión de PyTorch. Si instalaste una versión de JAX, reinstala siguiendo las instrucciones de PyTorch (consulta el Capítulo 2). Las funciones de JAX se documentan por separado.

**(7) Desajuste de versiones**:

- **Síntoma**: Las llamadas a la API no coinciden con la versión instalada.
- **Solución**:
  - Las actualizaciones de EvoX pueden cambiar los nombres de los métodos (por ejemplo, `ask/tell` → `step`).
  - Usa la última versión estable y consulta su documentación.
  - Ajusta el código para alinearlo con tu versión de EvoX o considera actualizar.

---

## 6.2 Consejos de depuración

Depurar algoritmos evolutivos puede ser complicado debido a su naturaleza estocástica. Aquí tienes algunos consejos prácticos:

**(1) Usa pruebas a pequeña escala**:

- Reduce el tamaño de la población y el recuento de iteraciones para simplificar la depuración.
- Ejemplo: `pop_size=5`, `iterations=20`.
- Facilita el seguimiento del comportamiento de la población y el aislamiento de problemas.

**(2) Inserta sentencias de impresión (Print)**:

- Imprime el fitness de la población, los mejores individuos y los valores intermedios.
- Para tensores grandes, imprime las formas (shapes) o usa `.tolist()` para los más pequeños.
- Te ayuda a comprender la convergencia y los efectos de los operadores.

**(3) Usa puntos de interrupción (Breakpoints) del IDE**:

- Usa PyCharm o VS Code para establecer puntos de interrupción dentro del `step()` del algoritmo o la lógica de evaluación.
- Inspecciona los valores de las variables, el contenido de los tensores o las transiciones de estado.
- Ten cuidado con los tensores grandes: limita lo que inspeccionas para evitar bloqueos.

**(4) Realiza pruebas unitarias de componentes personalizados**:

- Prueba las funciones de cruce/mutación por separado.
- Usa entradas sintéticas para validar las formas de salida y la lógica antes de la integración completa.

**(5) Perfilado de ejecución (Profiling)**:

- Usa `torch.autograd.profiler.profile` o `time.time()` para medir los tiempos de los pasos.
- Te ayuda a localizar cuellos de botella o bucles infinitos.
- Identifica si las ralentizaciones están en la evaluación o en la lógica del algoritmo.

**(6) Registra la salida en un archivo (Logging)**:

- Escribe registros en archivos `.csv` para ejecuciones largas.
- Incluye el mejor fitness por generación, estadísticas de diversidad, etc.
- Es útil cuando los bloqueos impiden que se vea la salida de la consola.

En general, depurar proyectos de EvoX requiere un equilibrio entre comprobaciones de corrección y análisis de resultados. Concéntrate primero en asegurar que el algoritmo se ejecute correctamente y luego optimiza su efectividad.

---

## 6.3 Guía de ajuste de rendimiento

Estos consejos te ayudarán a obtener más velocidad y calidad de EvoX:

**(1) Escalado progresivo**:

- **Comienza poco a poco**: Prueba la lógica con entradas pequeñas.
- **Escala gradualmente** y observa cómo aumenta el tiempo de ejecución.
- **Identifica ineficiencias** si el escalado no es lineal (por ejemplo, 10x población → >10x tiempo).

**(2) Monitorea el uso del hardware**:

- Usa `nvidia-smi` para la GPU, `htop` para la CPU.
- Una utilización alta de la GPU (>50%) es ideal.
- Un uso bajo de la GPU puede significar que los datos no están en la GPU o que las transferencias frecuentes entre CPU y GPU están ralentizando las cosas.

**(3) Ajusta el paralelismo**:

- Establece los hilos de la CPU: `torch.set_num_threads(n)`.
- Evita la sobreasignación (oversubscription) si usas herramientas de evaluación multihilo.
- Para la GPU, optimiza los hilos del `DataLoader` si usas entornos por lotes o conjuntos de datos.

**(4) Aprovecha la evaluación por lotes (Batch Evaluation)**:

- La evaluación por lotes es más rápida que la evaluación por individuo.
- Vectoriza siempre `Problem.evaluate()` para procesar poblaciones enteras.

**(5) Reduce la sobrecarga (Overhead) de Python**:

- Mueve la lógica pesada dentro de `Algorithm` o `Problem`, evita código Python complejo en el bucle principal.
- Usa `workflow.step()` para la mayoría de las operaciones.
- Minimiza los diagnósticos por generación si ralentizan las ejecuciones.

**(6) Ajusta la elección del algoritmo**:

- Prueba CMA-ES, GA, PSO, RVEA, etc.; ningún algoritmo es el mejor para todos los problemas.
- Un algoritmo que converja más rápido puede ahorrar más tiempo que micro-optimizar uno que converja lentamente.

El ajuste de rendimiento es iterativo. Con paciencia, puedes pasar de horas de tiempo de ejecución a minutos. EvoX te ofrece muchos "controles"; úsalos sabiamente para equilibrar la velocidad y la calidad de la solución.