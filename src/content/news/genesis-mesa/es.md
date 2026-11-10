---
title: "Genesis y MESA: Trazado de diferencias numéricas mediante una reescritura de Fortran a Rust"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "La precisión de la interpolación, los jacobianos analíticos y las pruebas de rendimiento con entradas coincidentes muestran cómo se reconstruyeron y verificaron trece módulos de MESA en Rust."
---

La reescritura de software científico puede producir respuestas plausibles alterando al mismo tiempo la ruta numérica que las generó. El caso de MESA en Genesis ofrece verificaciones concretas para ese problema: salidas originales de Fortran, diferencias de punto flotante explicadas, contadores de pasos del resolvedor y pruebas de rendimiento que comparan cargas de trabajo idénticas.

![Salidas de Fortran y Rust comparadas bajo una lupa](./mesa-numerical-continuity.webp)

*Ilustración conceptual: una nueva implementación verificada frente al comportamiento numérico existente.*

El [registro de Evidence](https://genesis.evox.group/evidence/mesa/) informa de trece módulos redesarrollados, 139.414 líneas de Fortran y 89.946 líneas de Rust. Los detalles de ingeniería que figuran a continuación proceden de la [revisión del repositorio 2ad071e](https://github.com/EMI-Group/genesis-demo-mesa-rs/tree/2ad071e658f8d4de21aa9f0e906592c364e10023), cuyas pruebas de rendimiento documentadas están fechadas el 5 de agosto de 2026. Dichos resultados de rendimiento conservan sus propias definiciones de carga de trabajo y tiempos.

## Reconstruir una cadena de dependencias, no trece traducciones aisladas

El espacio de trabajo sigue la cadena desde constantes, utilidades y matemáticas, pasando por matrices, interpolación y resolvedores numéricos, hasta química, tasas, pérdidas de neutrinos, redes de reacciones, ecuación de estado y opacidad. Cada módulo original tiene una crate de Rust correspondiente. El [manifiesto del espacio de trabajo](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/Cargo.toml) hace explícitas esas relaciones entre paquetes.

Esto significa que una tarea de red de reacciones depende de que las rutinas numéricas y los datos físicos sean utilizables conjuntamente. Las API públicas y los documentos de contexto por directorio proporcionan el contrato de integración. La [visión general del repositorio](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#architecture--api-parity) describe structs, métodos y valores `Result` de Rust, conservando los nombres originales de Fortran en la documentación cuando resulta útil para la verificación cruzada.

La implementación incluye resolvedores en Rust en lugar de llamar a LAPACK o BLAS a través de FFI. El alcance se limita a la pila numérica y física seleccionada: los motores completos de evolución estelar y binaria, la mezcla completa de EOS y otros componentes enumerados quedan fuera de la migración.

## Por qué un desajuste en la salida de referencia no se solucionó con una tolerancia laxa

La [prueba de referencia de interpolación bidimensional](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-interp2d/tests/golden.rs) reconstruye la malla original de 31 por 35 y los puntos de evaluación. Distingue los valores que coinciden exactamente de aquellos que requieren una tolerancia documentada.

La investigación de la prueba registra una discrepancia reveladora. Algunas variables temporales de la interpolación de Hermite original en Fortran eran implícitamente `REAL(4)`: precisión simple dentro de un cálculo que, por lo demás, era de mayor precisión. La versión de Rust utiliza `f64`. Los comentarios del código informan que una transcripción de Fortran explícitamente en doble precisión coincidía con el resultado de Rust, mientras que la ruta original de precisión mixta reproducía la salida de referencia antigua.

La mayor diferencia relativa registrada para esos valores de interpolación fue de aproximadamente 3.05e-8, con una tolerancia relativa de 1e-7. Otras magnitudes mantienen comparaciones exactas o tolerancias mucho más estrictas. Se trata de una distinción de ingeniería útil: la prueba conserva el origen de una diferencia numérica en lugar de permitir que todos los resultados se desvíen bajo un único umbral global. El bloque de prueba `_sg` de precisión simple permanece fuera de la migración.

## La red de reacciones necesitaba tanto la ruta de derivadas como la de valores

Las [notas de desarrollo de la red de reacciones](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-net/CONTEXT.md) describen el trabajo en el jacobiano analítico approx21, las derivadas utilizadas por el resolvedor rígido (stiff). Sus mediciones registradas de antes y después muestran que la suma de verificación se acerca a la de Fortran y que los contadores de integración alcanzan una coincidencia exacta.

Para la carga de trabajo de rendimiento documentada, ambas implementaciones alcanzaron **199 pasos: 198 aceptados y 1 rechazado**, con **8.889 evaluaciones de función y 199 evaluaciones del jacobiano**. Estos contadores ayudan a detectar una ejecución aparentemente más rápida que simplemente tomó una ruta de resolución diferente.

Permaneció una diferencia residual en la suma de verificación de aproximadamente 3.1e-9. El [asistente de pruebas de rendimiento](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/common.py) lo atribuye a que la ruta de valores de Fortran utiliza precisión cuádruple mientras que Rust utiliza f64. Por lo tanto, el entorno de pruebas utiliza una tolerancia relativa de suma de verificación documentada de 1e-8; solicitar 1e-9 marca deliberadamente esta carga de trabajo. La coincidencia en los contadores de pasos respalda la comparación, mientras que la diferencia en la ruta de valores permanece explícita.

## Las pruebas de integración también verifican que los módulos estén realmente conectados

Una [prueba de integración de una zona](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/tests/one_zone_burn.rs) independiente ejecuta el quemador con un proveedor de gas ideal y con un proveedor de tablas EOS a través de la interfaz pública `BurnEosInfo`. Espera que los dos cálculos difieran, verifica la conservación y las salidas finitas, y comprueba que las llamadas a EOS equivalgan a la suma de las evaluaciones de la función y del jacobiano.

Esta es una prueba de cableado con un límite físico específico: la temperatura de combustión supera el máximo de la tabla disponible, por lo que la búsqueda en la EOS se limita a su fila superior. Demuestra que el proveedor afecta al cálculo; no es una validación de una EOS estelar completa de alta temperatura. Sus recuentos de pasos también pertenecen a esta prueba separada, no a la prueba de rendimiento anterior.

## Comparar el mismo trabajo antes de informar de una mejora de velocidad

La [especificación de la carga de trabajo](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/bench-fortran/WORKLOADS.md) fija entradas, tamaños, parámetros del resolvedor y definiciones de suma de verificación para ambos lenguajes. Por ejemplo, la prueba de rendimiento de interpolación evalúa dos millones de puntos deterministas en la misma malla; la configuración queda fuera de ese bucle cronometrado.

El [orquestador de pruebas de rendimiento](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/run_benchmarks.py) lee los tiempos internos del controlador y las sumas de verificación, los compara y escribe un informe. La tabla del 5 de agosto del README utiliza medianas de 15 ejecuciones vinculadas a las CPU 0–3, comparando gfortran `-O3 -march=native` con el perfil de release de Rust.

| Carga de trabajo seleccionada | Fortran | Rust | Mejora informada |
| --- | --- | --- | --- |
| Dos millones de evaluaciones bicúbicas | 0,162522 s | 0,090700 s | 1,79× |
| Diez mil resoluciones de Newton | 0,057918 s | 0,009029 s | 6,41× |
| Proxy de combustión approx21 de una zona | 0,303473 s | 0,243294 s | 1,25× |

Fuente: [tabla de rendimiento versionada](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#latest-verified-results-2026-08-05-15-run-medians-taskset-0-3). La página de Evidence informa por separado de un rango de medianas de 1,55–6,87×. Estos registros no establecen una mejora de velocidad universal, y el proxy de una zona no mide una simulación estelar completa.

## Seguir los puntos de entrada de pruebas y rendimiento

El repositorio informa de **1.052 superadas, 0 fallidas y 18 ignoradas**. Su README identifica el conjunto ignorado como las pruebas de rendimiento y la combustión lenta de duración completa. En un entorno preparado con Rust y Fortran, los puntos de entrada documentados son:

```bash
cargo test --workspace
bash scripts/build_fortran_baselines.sh --all
python3 scripts/run_benchmarks.py --runs 15 --taskset-cpus 0-3
```

Estos son comandos documentados en el código fuente, no una nueva reproducción realizada para este artículo. El coste de 10,64 USD del registro de Evidence cubre solo los tokens del modelo; no se informaron el modelo, el recuento de episodios ni el tiempo de ejecución real.

Para una primera inspección útil, lea la prueba de referencia de interpolación junto con sus comparaciones de salida original y, a continuación, siga el contrato de entrada de la prueba de rendimiento. Esa ruta hace que la reescritura sea evaluable a través de un comportamiento numérico específico y un trabajo medido.
