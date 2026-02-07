---
title: "6. Solucion de Problemas y Optimizacion"
order: 6
---

# 6. Solucion de Problemas y Optimizacion

Al usar EvoX, puedes encontrar problemas o querer ajustar tus algoritmos. Este capitulo describe problemas comunes y sus soluciones, junto con estrategias de depuracion y consejos de ajuste de rendimiento para ayudarte a resolver problemas y optimizar tu experiencia.

---

## 6.1 Problemas Comunes y Soluciones

Aqui hay algunos problemas frecuentes y como abordarlos:

**(1) Errores de Instalacion o Importacion**:

- **Sintoma**: Error al ejecutar `import evox`.
- **Solucion**:
  - **Verificar instalacion**: Ejecuta `pip show evox` para verificar. Si no esta instalado, revisa tu entorno virtual y reinstala.
  - **Dependencias faltantes**: Si ves `ModuleNotFoundError: No module named 'torch'`, instala PyTorch como se indica en el Capitulo 2.
  - **Incompatibilidad de CUDA**: Asegurate de que tu version de PyTorch coincida con los controladores CUDA instalados.

**(2) La GPU No Se Esta Usando**:

- **Sintoma**: EvoX se ejecuta en CPU en lugar de GPU.
- **Solucion**:
  - Verifica con `torch.cuda.is_available()`. Si devuelve `False`, reinstala un PyTorch compatible con GPU y verifica la instalacion de CUDA.
  - Si devuelve `True` pero EvoX aun usa CPU, asegurate de que tus tensores esten en la GPU (consulta el Capitulo 3 para la configuracion).

**(3) Sin Memoria (RAM/VRAM)**:

- **Sintoma**: Ves `OutOfMemoryError`.
- **Solucion**:
  - Reduce el tamano de la poblacion, la dimension del problema o la frecuencia de evaluacion.
  - Usa float16 (media precision) o division de evaluacion por lotes.
  - Desactiva los modos de depuracion/deterministicos en PyTorch.
  - Almacena solo estadisticas en lugar de frentes de Pareto completos (para multiobjetivo).
  - Actualizar el hardware es la solucion definitiva para cuellos de botella de memoria.

**(4) Estancamiento de Convergencia**:

- **Sintoma**: El algoritmo se queda atrapado en un optimo local.
- **Solucion**:
  - Aumenta la diversidad de la poblacion (por ejemplo, mayor tasa de mutacion).
  - Prueba diferentes algoritmos o parametros.
  - Asegurate de que la funcion objetivo este bien definida (no demasiado ruidosa o plana).
  - Ejecuta multiples pruebas y elige la mejor: EvoX facilita las ejecuciones paralelas.

**(5) Resultados de Optimizacion Deficientes**:

- **Sintoma**: Los resultados finales estan por debajo de las expectativas.
- **Solucion**:
  - **Verifica la definicion del problema**: Asegurate de que la aptitud se calcule correctamente (por ejemplo, signos, escalado).
  - **Ajuste del algoritmo**: Prueba otros o ajusta los hiperparametros.
  - **Usa curvas de convergencia**:
    - Linea plana temprana: convergencia prematura.
    - Oscilante: aleatoriedad demasiado alta.
  - Ajusta la configuracion del algoritmo y analiza el comportamiento a lo largo del tiempo.

**(6) Conflictos de Backend (JAX vs PyTorch)**:

- **Sintoma**: Instalaste accidentalmente la version JAX de EvoX mientras usas ejemplos de PyTorch.
- **Solucion**: El `pip install evox` predeterminado te da la version de PyTorch. Si instalaste una version JAX, reinstala usando las instrucciones de PyTorch (consulta el Capitulo 2). Las caracteristicas de JAX se documentan por separado.

**(7) Incompatibilidad de Version**:

- **Sintoma**: Las llamadas a la API no coinciden con la version instalada.
- **Solucion**:
  - Las actualizaciones de EvoX pueden cambiar nombres de metodos (por ejemplo, `ask/tell` a `step`).
  - Usa la ultima version estable y consulta su documentacion.
  - Ajusta el codigo para alinearlo con tu version de EvoX o considera actualizar.

---

## 6.2 Consejos de Depuracion

Depurar algoritmos evolutivos puede ser complicado debido a su naturaleza estocastica. Aqui hay consejos practicos:

**(1) Usa Pruebas a Pequena Escala**:

- Reduce el tamano de la poblacion y el conteo de iteraciones para simplificar la depuracion.
- Ejemplo: `pop_size=5`, `iterations=20`.
- Facilita el seguimiento del comportamiento de la poblacion y el aislamiento de problemas.

**(2) Inserta Sentencias Print**:

- Imprime la aptitud de la poblacion, los mejores individuos y valores intermedios.
- Para tensores grandes, imprime las formas o usa `.tolist()` para los mas pequenos.
- Te ayuda a entender la convergencia y los efectos de los operadores.

**(3) Usa Puntos de Interrupcion del IDE**:

- Usa PyCharm o VS Code para establecer puntos de interrupcion dentro del `step()` del algoritmo o la logica de evaluacion.
- Inspecciona valores de variables, contenido de tensores o transiciones de estado.
- Ten cuidado con tensores grandes: limita lo que inspeccionas para evitar bloqueos.

**(4) Pruebas Unitarias de Componentes Personalizados**:

- Prueba las funciones de cruce/mutacion por separado.
- Usa entradas sinteticas para validar las formas de salida y la logica antes de la integracion completa.

**(5) Perfila la Ejecucion**:

- Usa `torch.autograd.profiler.profile` o `time.time()` para medir los tiempos de los pasos.
- Te ayuda a localizar cuellos de botella o bucles infinitos.
- Identifica si las ralentizaciones estan en la evaluacion o en la logica del algoritmo.

**(6) Registra la Salida en Archivo**:

- Escribe registros en archivos `.csv` para ejecuciones largas.
- Incluye la mejor aptitud por generacion, estadisticas de diversidad, etc.
- Util cuando los bloqueos impiden ver la salida de la consola.

En general, depurar proyectos de EvoX requiere un equilibrio entre verificaciones de correccion y analisis de resultados. Enfocate primero en asegurar que el algoritmo se ejecute correctamente, luego optimiza su efectividad.

---

## 6.3 Guia de Ajuste de Rendimiento

Estos consejos te ayudan a obtener mas velocidad y calidad de EvoX:

**(1) Escalado Progresivo**:

- **Comienza pequeno**: Prueba la logica con entradas pequenas.
- **Escala gradualmente** y observa como aumenta el tiempo de ejecucion.
- **Identifica ineficiencias** si el escalado no es lineal (por ejemplo, 10x poblacion -> >10x tiempo).

**(2) Monitorea el Uso del Hardware**:

- Usa `nvidia-smi` para GPU, `htop` para CPU.
- Una alta utilizacion de GPU (>50%) es ideal.
- Baja utilizacion de GPU puede significar que los datos no estan en la GPU o que transferencias frecuentes CPU-GPU estan ralentizando las cosas.

**(3) Ajusta el Paralelismo**:

- Establece hilos de CPU: `torch.set_num_threads(n)`.
- Evita la sobresuscripcion si usas herramientas de evaluacion multihilo.
- Para GPU, optimiza los hilos del `DataLoader` si usas entornos por lotes o conjuntos de datos.

**(4) Aprovecha la Evaluacion por Lotes**:

- La evaluacion por lotes es mas rapida que la evaluacion por individuo.
- Siempre vectoriza `Problem.evaluate()` para procesar poblaciones completas.

**(5) Reduce la Sobrecarga de Python**:

- Mueve la logica pesada dentro de `Algorithm` o `Problem`, evita codigo Python complejo en el bucle principal.
- Usa `workflow.step()` para la mayoria de las operaciones.
- Minimiza los diagnosticos por generacion si ralentizan las ejecuciones.

**(6) Ajusta la Eleccion del Algoritmo**:

- Prueba CMA-ES, GA, PSO, RVEA, etc.: ningun algoritmo es el mejor para todos los problemas.
- Un algoritmo que converge mas rapido puede ahorrar mas tiempo que micro-optimizar uno que converge lentamente.

El ajuste de rendimiento es iterativo. Con paciencia, puedes pasar de horas de ejecucion a minutos. EvoX te da muchas "perillas": usalas sabiamente para equilibrar velocidad y calidad de la solucion.
