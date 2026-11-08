---
title: "Genesis multirrepositorio: un objetivo, historiales independientes"
pubDate: 2026-09-26
summary: "Genesis 0.13.4 incorpora árboles de trabajo persistentes para repositorios asociados modificables y delimita ejecución, revisión e integración."
updatedDate: 2026-11-08
---

Una función puede abarcar un servicio API, una aplicación cliente y una biblioteca compartida. Comparten objetivo, pero no necesariamente repositorio Git. Genesis 0.13.4, publicado el 26 de septiembre de 2026, añade árboles de trabajo persistentes para repositorios asociados modificables y define mejor el lugar de ejecución.

![Tres patios independientes con sus propias entradas unidos por una cinta roja](./companion-worktrees.webp)

## Del acceso al trabajo aislado

La versión 0.11.4 introduce lectura y escritura en repositorios adicionales, revisión individual y restricciones para los de solo lectura. Con 0.13.4, los agentes trabajan en un árbol persistente por repositorio asociado modificable, sin mover su HEAD principal ni alterar su árbol de trabajo primario. [v0.11.4](https://github.com/EMI-Group/genesis/blob/v0.11.4/CHANGELOG.md)

Las rutas se resuelven respecto a ese árbol. El contexto inicial muestra su ubicación y la delegación entre repositorios la utiliza como base. Así queda claro dónde se modifica el código, aunque las estructuras de carpetas o las actividades de desarrollo sean distintas. [v0.13.4](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)

## La integración se decide por repositorio

La versión 0.13.0 introduce tarjetas de revisión con controles de fusión y rechazo, comprobaciones y estados independientes. Un acceso de fusión conjunta acepta los repositorios pendientes y conserva los resultados individuales. También corrige la revisión de tareas que solo modifican repositorios asociados. [v0.13.0](https://github.com/EMI-Group/genesis/releases/tag/v0.13.0)

En un cambio de API, revisa servicio, cliente y biblioteca compartida en sus propias historias. Acuerda versiones de interfaz y orden de integración; después comprueba el resultado conjunto.

## Preparar la revisión entre repositorios

Antes de delegar, identifica el worktree escribible de cada repositorio. Después usa su tarjeta de revisión para inspeccionar cambios, comprobaciones de fusión y estado de resolución. Así el trabajo transversal se concreta en decisiones de aceptación. La [historia de desarrollo](/es/news/genesis-development-history) permite seguir los commits.
