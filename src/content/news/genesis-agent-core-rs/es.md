---
title: "Genesis convierte openJiuwen Agent Core de Python a Rust"
pubDate: 2026-11-20
updatedDate: 2026-11-20
summary: "Genesis ha reimplementado el SDK de Agents en 30 crates Rust con 26 ejemplos ejecutables. El caso recorre el desarrollo posterior y la verificación de sesiones, herramientas y flujos tras la migración."
---

openJiuwen Agent Core es un SDK de Python para crear aplicaciones de Agents: conecta llamadas a modelos, herramientas, flujos y estado de las sesiones. En el [Evidence publicado el 20 de noviembre de 2026][evidence], EvoX Genesis documenta su conversión a Rust y la creación de **agent-core-rs**, con el SDK de Python v0.1.20 como referencia de solo lectura.

El resultado es un workspace de **30 crates Rust y 26 ejemplos ejecutables**, desarrollado mediante una conversión inicial y una tarea posterior sobre el código conservado. La cuestión de ingeniería es qué comportamientos sobreviven al cambio de lenguaje: restaurar correctamente las sesiones, esperar la aprobación de las herramientas y recorrer la rama prevista de cada flujo.

![Ilustración conceptual de código Python convertido en Rust con ramas de flujo correspondientes](./contract-migration-v2.webp)

## Cambiar la implementación conservando el contrato

El workspace agrupa tipos compartidos, acceso a modelos y herramientas, estado de sesiones, orquestación y puntos de entrada de aplicaciones. Sus artefactos ejecutables abarcan flujos, DeepAgent, colaboración en equipo y CLI. Estas capas dan un significado práctico a los 30 crates: la conversión cubre varias partes de una aplicación de Agents, con el alcance de cada integración recogido en la [matriz de cobertura][parity].

La [instantánea 242b5b5][repo] toma como objetivos los campos Card JSON, los formatos de comunicación con modelos, los datos de sesión persistidos, las referencias de los flujos y el comportamiento de la CLI. Los tipos y traits de Rust, la ejecución asíncrona con Tokio y la serialización Serde sustituyen los mecanismos de Python. Los tipos compartidos quedan por debajo de sus consumidores; los crates de agregación reexportan las API sin duplicar comportamientos.

La compatibilidad abarca el subconjunto implementado. La [matriz de cobertura][parity] distingue interfaces soportadas, implementaciones parciales y áreas aplazadas: ejecución distribuida, GPU/ML y algunas integraciones con proveedores o servicios externos. Cuando existe una ruta Unsupported tipada, devuelve un error explícito; otras carencias no tienen implementación. Esta distinción importa al elegir qué aplicación migrar.

## Una sesión restaurada y una herramienta que espera

El [ejemplo de sesión][session] guarda un punto de control en almacenamiento temporal, crea una sesión nueva con la misma identidad y raíz de almacenamiento y restaura el estado. La prueba cruza un límite de persistencia: conservar el primer objeto en memoria no demostraría lo mismo.

El escenario de aprobación sitúa una barrera antes de una llamada simulada a una herramienta. Un contador comprueba que esta no se ha ejecutado mientras espera aprobación. Una nueva invocación con los datos de aprobación correspondientes permite continuar. Un modelo guionizado y una herramienta instrumentada hacen observable el orden sin credenciales del proveedor.

El [ejemplo de flujo][workflow] verifica otro problema de integración. Dos entradas recorren las ramas corta y larga de la misma topología compilada y transmiten valores mediante referencias a campos de nodos. Conectar directamente dos predecesores mutuamente excluyentes crearía una conjunción que esperaría a ambos. Los componentes de reenvío y la activación explícita de rutas permiten que cualquier rama alcance el final común. Conservar nombres de campos no basta para detectar este problema de planificación.

## Dos tareas con un coste delimitado

El [anexo de historial][history] recoge una conversión inicial del 11 al 16 de noviembre UTC, detenida manualmente conservando el resultado, seguida de una tarea de evolución completada el 19 de noviembre UTC. Las llamadas atribuidas a DeepSeek V4 Flash suman **150,024283 dólares** entre ambas tareas. La segunda tarea retomó la revisión resultante de la primera, mostrando cómo conservar una implementación y continuar desarrollándola entre tareas.

Sus tiempos de reloj suman **113 horas y 42 minutos**, incluidas esperas y colas; el intervalo de calendario supera ocho días. Las 3.570 instancias de Agent registradas son acumuladas, no el máximo concurrente. El coste excluye infraestructura, trabajo humano y documentación posterior. También excluye una tarea intermedia fallida cuyo consumo se desconoce.

El anexo cuenta 1.434.767 líneas físicas Rust, incluidos comentarios y líneas en blanco, repartidas entre producción, pruebas y ejemplos. Describe el tamaño del artefacto; las comprobaciones de comportamiento determinan qué preserva la reescritura.

## Qué establece la verificación

El [registro de verificación][parity] informa de resultados satisfactorios en formato, Clippy, pruebas offline del workspace, Rustdoc, siete grupos de funcionalidades y compilación de ejemplos. **24.293 es el número de funciones de prueba en el código fuente**, no un total de pruebas aprobadas capturado en una ejecución. Cinco entradas ignoradas son auxiliares o comprobaciones dependientes del entorno. La tarea documental posterior solo repitió controles seleccionados.

Modelos guionizados, servidores locales simulados, almacenamiento temporal y sockets de bucle local ejercitan protocolos y ejecución. Permiten comprobaciones repetibles sin credenciales reales; el éxito con modelos reales requiere una evaluación distinta. Son resultados comunicados por el proyecto; no hemos vuelto a ejecutar de forma independiente la suite Rust.

## Operaciones locales más rápidas, dentro de su carga

El [informe de rendimiento][bench] compara una compilación Rust release con CPython 3.11.15 en un host Linux de ocho CPU lógicas y caché de páginas caliente. El renderizado de prompts tarda **0,356 µs frente a 16,37 µs**, unas **46×** menos. Un grafo de dos nodos sin I/O tarda **7,23 µs frente a 112,3 µs**, unas **15×** menos.

Las mediciones usan lotes repetidos normalizados por operación; los lotes Rust son diez veces mayores. La forma lógica del grafo coincide, aunque los motores difieren. Los ratios describen la sobrecarga local del framework, sin latencia de modelo/red, arranque con caché fría ni escalado concurrente. Las mediciones separadas del primer grafo Python y de un turno de Agent guionizado en Rust realizan trabajos distintos y no establecen un ratio comparable de arranque o memoria.

## Empezar por un comportamiento que deba conservarse

Para evaluar una migración, los ejemplos de recuperación, aprobación y rutas condicionales ofrecen criterios de aceptación concretos. Compruebe la integración prevista en la [matriz][parity], prepare el entorno de compilación y utilice `make verify`. `cargo test --workspace --offline --no-fail-fast` incluye los crates de desarrollo omitidos por un simple `cargo test`.

El workspace se distribuye como código fuente, con `publish = false`. Consulte el [Evidence completo][evidence] y la [implementación fijada][repo]. Junto a la anterior [reimplementación de MESA](/es/news/genesis-mesa), el caso muestra cómo evaluar Genesis por los comportamientos conservados y la nueva implementación.

[evidence]: https://genesis.evox.group/evidence/agent-core-rs/
[repo]: https://github.com/EMI-Group/agent-core-rs/tree/242b5b5243aa46c6b82edd6d3764d0b70c10d571
[parity]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/docs/PARITY.md
[history]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/docs/REWRITE_APPENDIX.md
[session]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/crates/openjiuwen-examples/examples/03_sessions_and_resume.rs
[workflow]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/crates/openjiuwen-examples/examples/04_workflow_pipeline.rs
[bench]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/docs/BENCHMARKS.md

