---
title: "Genesis pausa todo el árbol de tareas sin dar por terminados los hijos pendientes"
pubDate: 2026-11-26
summary: "Una instantánea coordinada conserva las esperas de los padres, identidades de los hijos y puntos de control de los árboles de trabajo, y reanuda la misma tarea con reparación si hace falta."
---

Una tarea de desarrollo puede estar esperando a varios agentes hijos cuando su propietario pulsa Pausa. Dar por terminados sus lotes solo para detenerse alteraría el trabajo que se quiere conservar. Los cambios de Genesis en main del 25 de noviembre de 2026 introducen una instantánea coordinada de todo el árbol: los padres mantienen su posición de espera, los hijos sus identidades y puntos de control, y la reanudación reconstruye las relaciones bajo el mismo ID de tarea. [Diseño e implementación][design]

![Un móvil ramificado sostenido en su posición por un marco de apoyo](./cover.webp)

*Ilustración conceptual: conservar cada rama incompleta antes de reanudar toda la estructura.*

## Una fase de la tarea, no un freno global

La pausa global del planificador impide admitir nuevos trabajos; no lleva una tarea activa concreta a un reposo persistente. El protocolo por tarea pasa por pausing hasta paused, conserva el contexto del resultado y deja sin asignar la fecha de finalización. Cancelar sigue siendo una acción independiente y prevalece si llega durante la pausa. Las sesiones interactivas quedan fuera del protocolo. [Integración del registro][registry]

Por ejemplo, un agente que coordina un analizador y sus pruebas puede estar esperando a dos hijos. La pausa debe conservar esa espera, sin inventar resultados completados. El coordinador marca para pausar a los miembros activos, elimina solicitudes en cola de plazas de modelos y herramientas y aparca a los padres bloqueados en su lote de subagentes. Cada agente se detiene en un límite de turno tras el lote de herramientas, o en su posición de espera. [Coordinador de congelación][coordinator]

## Conservar el trabajo antes de recuperar recursos

Antes de detenerse, un agente recoge los trabajos en segundo plano, crea un punto de control del árbol de trabajo, conserva el marcador persistente de herramientas pendientes y escribe su estado. Los commits de los puntos de control quedan anclados para sobrevivir a la recuperación posterior de los árboles de trabajo. La instantánea registra si el agente estaba en un límite de turno, esperaba hijos o estaba dentro de un lote interrumpido. La pausa comunica su propio resultado; no declara exitoso a un hijo incompleto ni fusiona su trabajo. [Ruta de congelación del agente][agent]

La espera tiene límite. El valor documentado concede 120 segundos de espera hasta la quietud, seguidos de 10 segundos de gracia para una congelación forzada. Una pausa clean requiere que todos los agentes prueben una parada persistente sin interrupciones. Si vence el plazo o falta esa prueba, se registra una pausa dirty. La distinción describe el estado guardado, sin prometer que puedan deshacerse efectos externos arbitrarios.

## Reconstruir la colaboración existente

La reanudación vuelve a poner en cola la misma tarea con sus opciones persistidas. Hace falta una fila raíz duradera: las filas hijas por sí solas no bastan y un almacén ilegible produce un error explícito. El plan de restauración reconstruye identidades, topología y posiciones. Un hijo terminado aporta su resultado guardado, uno activo reinicia con su propia identidad y punto de control, y uno congelado antes de registrarse puede partir de la especificación de llamada original. El padre sigue esperando resultados reales. [Ruta de descongelación][thaw]

Un lote congelado limpiamente se restaura sin la reparación de herramientas pendientes utilizada para trabajo interrumpido. Una instantánea dirty aplica reparación y un aviso de reanudación, distinguiendo trabajo de finalización conocida de ejecución incierta. Si un punto de control no puede probarse, no se adopta silenciosamente como punto limpio de un hijo. Al reiniciar o reconciliar concesiones, una tarea running o pausing con persistencia y fila raíz duradera pasa a paused de tipo dirty; una tarea no reanudable conserva el fallo por caducidad de la concesión.

## Comprobar una pausa y una reanudación primero

Hay que utilizar una compilación desde fuentes que incluya estos commits y habilitar la persistencia del estado de los agentes. Se pausa una tarea con hijos activos, se espera el estado paused y se reanuda, comprobando la identidad, las relaciones entre hijos y el trabajo guardado. Antes de continuar operaciones externas, deben revisarse los avisos dirty. Con la persistencia desactivada se rechaza la pausa; la recuperación queda limitada por los puntos de control duraderos. El [flujo de tareas anterior][related] explica el contexto de proyecto y aprobación; este cambio define cómo conservar la ejecución incompleta.

[design]: https://github.com/EMI-Group/genesis/blob/d0796aeef2372221fa3becb13692f7137ceeaffe/docs/task-pause.md
[registry]: https://github.com/EMI-Group/genesis/commit/4af29fadb58dd0096cff5eb95dfcd1e9b8dbae74
[coordinator]: https://github.com/EMI-Group/genesis/commit/e4b4ef863c5515f61e0ce56a40e3acd8c4970d11
[agent]: https://github.com/EMI-Group/genesis/commit/196261f0157a7139de7e002d20aa7d7c633334ff
[thaw]: https://github.com/EMI-Group/genesis/commit/fbaebed0671282d77fc2972f6818058e115f3616
[related]: /es/news/genesis-assistant-project-workflows
