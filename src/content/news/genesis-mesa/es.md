---
title: "Genesis reconstruye 13 módulos de MESA en Rust"
pubDate: 2026-11-03
summary: "El caso MESA de Genesis muestra la reescritura de software científico, con 1,052 pruebas superadas y 10.64 dólares de gasto declarado en tokens."
---

Reescribir software científico exige preservar su comportamiento numérico. El registro MESA del 7 de septiembre de 2026 describe la conversión de **13 módulos Fortran en crates Rust**, utilizando la implementación original como referencia.

El registro informa de **139,414 líneas Fortran → 89,946 líneas Rust**, **1,052 pruebas superadas** y **10.64 dólares** en tokens. El repositorio documenta pruebas de referencia frente a las salidas Fortran y 18 pruebas ignoradas, además de las superadas.

Las aceleraciones medianas de **1.55–6.87×** de Evidence son resultados de benchmarks, no una mejora uniforme de todo MESA. Por separado, la tabla del README del 5 de agosto informa de **1.25×** para la combustión de una zona, usada como carga representativa de extremo a extremo. Deben distinguirse las distintas cargas y fechas.

La migración abarca módulos numéricos y físicos seleccionados, no todo MESA; los motores de evolución estelar y binaria quedan fuera. El caso muestra cómo las comprobaciones de comportamiento pueden guiar una reescritura. Son resultados declarados por el proyecto, sin reproducción independiente; el gasto en tokens excluye el hardware.

[Genesis Evidence](https://genesis.evox.group/evidence/mesa/) · [GitHub](https://github.com/EMI-Group/genesis-demo-mesa-rs) · [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/main/README.md)
