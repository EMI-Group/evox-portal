---
title: "Genesis: conservar las aportaciones de los agentes en la historia del software"
pubDate: 2026-09-26
summary: "Genesis 0.13.2–0.13.4 conecta el historial Git de cada tarea con carriles de agentes para mantener sus aportaciones revisables tras su finalización."
updatedDate: 2026-11-08
---

El árbol de agentes muestra quién trabaja ahora. La historia del proyecto también debe explicar qué queda después. Genesis 0.13.4, publicado el 26 de septiembre de 2026, amplía la vista de commits de 0.13.2 y las referencias persistentes de tareas de 0.13.3, conectando actividad temporal con versiones inspeccionables.

![Raíles ramificados con piezas de commits llegan a un archivo por capas](./durable-agent-history.webp)

## De agentes activos a referencias persistentes

La API de historial por tarea resuelve referencias persistentes y el commit base. La vista temporal conserva así commits de agentes ya reciclados. La API anterior consulta intervalos y referencias entre repositorios; la capa de tarea aporta el contexto para seguir un trabajo específico. [v0.13.2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.2) · [v0.13.3](https://github.com/EMI-Group/genesis/releases/tag/v0.13.3)

Cuando un agente delega un módulo y termina, su aportación puede seguir necesitando revisión. Git da al cambio una identidad duradera y la vista de tarea ayuda a localizarlo. El fin de una ejecución no tiene por qué borrar la relación entre tarea y código resultante.

## Mostrar las relaciones entre aportaciones

La versión 0.13.4 organiza commits por carriles de agentes, agrupa subárboles y muestra relaciones de delegación y fusión de retorno. Los commits sin propietario tienen un carril neutro. La selección, la sincronización al pasar el cursor y el teclado facilitan la inspección; los fallos parciales de lectura no vacían todo el gráfico. [v0.13.4](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)

La vista señala el truncamiento al alcanzar 100 commits. Para investigar cambios anteriores, usa las referencias de base y extremo de la tarea y examina el intervalo Git correspondiente.

## Seguir una contribución hasta su integración

Parte del commit base de una tarea y sigue un carril de agente por la delegación y la fusión de retorno. Consulta diferencias y resultados de pruebas para decidir qué conservar. En varias bases de código, la [revisión multirrepositorio](/es/news/genesis-multi-repository) permite avanzar hacia la integración.
