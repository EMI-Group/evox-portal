---
title: "Genesis reúne proyectos, conversaciones y Git en un mismo entorno de trabajo"
pubDate: 2026-11-22
updatedDate: 2026-11-26
summary: "Los borradores por proyecto y los espacios VCT mantienen el contexto unido al repositorio y nodo correctos al cambiar de tarea."
---

Pasar de una conversación a una tarea de desarrollo y a sus cambios Git no debería exigir reconstruir el contexto del proyecto. La PR #175 de Genesis, integrada en `main` el 20 de noviembre de 2026, incorpora un entorno LiveView con navegación por proyectos, pestañas, historiales de tareas y conversaciones, panel Git y ajustes integrados. Los cambios de espacios VCT y ámbito de borradores permiten trasladar la identidad del proyecto entre esas vistas. [Integración][pr]

![Cajones independientes conservan las notas y herramientas de cada proyecto en un banco común](./cover.webp)

*Ilustración conceptual: cada proyecto conserva su contexto de trabajo.*

## Consultar el proyecto en un solo lugar

El entorno reúne navegación y vistas de trabajo. Puede volver a un proyecto, consultar sus tareas o conversaciones y examinar cambios Git sin empezar de nuevo en cada vista. La integración conserva el selector de espacios, la configuración de cuentas y la pausa y reanudación de tareas. También recupera el contexto de aprobación al reconectar. Estas mejoras amplían el [flujo anterior de tareas de Assistant][previous], cuyas aprobaciones estructuradas siguen determinando la acción autorizada. [Integración del entorno][pr]

Imagine que alterna entre una biblioteca y la aplicación que la utiliza. El borrador de requisitos de la biblioteca debe quedarse allí al abrir la pestaña de la aplicación. Una operación Git debe dirigirse al servidor y repositorio seleccionados. Los cambios comprueban la pertenencia del proyecto antes de operar con Git y mantienen el nodo elegido cuando la conexión no está disponible, sin desviar la operación al equipo del panel.

## La identidad del borrador es más que una ruta

El módulo compartido `DraftScope` identifica un borrador del navegador mediante `{node, token}`. Un proyecto montado en Virtual Context Tree utiliza su punto `vct:///projects/<name>`; si aún no está montado, utiliza su ruta absoluta del sistema. El punto tiene prioridad cuando existen ambos. Así, distintas formas de escribir la ruta del mismo proyecto montado acceden a un único borrador, mientras que puntos VCT distintos sobre la misma ruta siguen separados. [Implementación][scope]

La clave de almacenamiento del navegador combina nodo y token. Una corrección posterior adopta el borrador asociado a la ruta cuando aparece el punto VCT, cubriendo la transición entre seleccionar un directorio y registrar el proyecto. Es continuidad del borrador del navegador, distinta de la persistencia de tareas y de una garantía de recuperación duradera de conversaciones tras reiniciar el servidor. [Adopción del borrador][adopt]

En un proyecto remoto también importa conservar la ruta literalmente: el panel no debe normalizarla según el sistema de archivos del equipo del navegador. Antes de enviar un borrador recuperado, compruebe nodo, repositorio y modelo, especialmente al alternar entre proyectos locales y remotos.

## Los espacios agrupan proyectos; las tareas necesitan un directorio

VCT incorpora una capa de agrupación en `vct:///workspaces/<name>`. Un espacio tiene una lista ordenada de miembros y una descripción opcional. Los miembros apuntan a montajes de proyectos o rutas del sistema; los espacios no se anidan. La paleta Projects y el selector de Assistant pueden mostrar estos grupos, y las API de solo lectura permiten consultar sus miembros. [Interfaz de gestión][workspace]

Un grupo no tiene un directorio de ejecución propio. Por eso `DraftScope.path/1` no devuelve una ruta para una selección que solo contiene un espacio, y la admisión de tareas rechaza puntos VCT como rutas de tarea. En el ejemplo de biblioteca y aplicación, agrupe ambas para explorarlas juntas y seleccione después el miembro concreto que recibirá la tarea. Un espacio no convierte a todos sus miembros en destinos implícitos de escritura.

Desde el código fuente, `mix vct.workspace list` y `mix vct.workspace show <name>` permiten inspeccionar grupos. La orden `create` documentada acepta varios argumentos `--member` y un `--data-dir` opcional; utilice el directorio de datos de la instancia Genesis prevista. La inspección informa de miembros ausentes en vez de omitirlos. Consulte el contrato de la orden antes de modificar un grupo.

## Comprobar el paso entre vistas

La PR recoge comprobaciones en navegador de creación y finalización de tareas, envío con teclado y streaming de Assistant, y pantalla de configuración de cuentas. También registra un tiempo de espera agotado en una consulta de tareas de Assistant acotada a un proyecto. En trabajos largos importa distinguir la aceptación de la solicitud de la observación del resultado. [Registro de comprobaciones][pr]

En una compilación con estos cambios, pruebe dos proyectos con borradores diferentes, reconecte el nodo seleccionado y abra el panel Git del proyecto previsto. Compruebe que el borrador vuelve al proyecto correcto y que la aprobación sigue indicando el destino real. Después siga el estado registrado de la tarea, sin interpretar una pestaña restaurada como prueba de que terminó el trabajo en segundo plano.

[pr]: https://github.com/EMI-Group/genesis/pull/175
[previous]: /es/news/genesis-assistant-project-workflows
[scope]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_dash/lib/evo_dash_web/live/draft_scope.ex
[adopt]: https://github.com/EMI-Group/genesis/commit/a0f7b141ed448590030f6d36de951bbb1ca3673e
[workspace]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/mix/tasks/vct.workspace.ex

Los ajustes del 25 de noviembre de 2026 mantienen las opciones en el formulario, abren proyectos elegidos explícitamente en su vista general y llevan las tareas activas a un inspector de agentes filtrado por tarea. El borrador Assistant del proyecto se ofrece solo tras confirmar su identidad, conservando proyecto y nodo durante la navegación. [GitHub](https://github.com/EMI-Group/genesis/commit/c40b76d207345ed6b9dc1435887b3482ff3ad9a4) · [GitHub](https://github.com/EMI-Group/genesis/commit/732f127e1712424fc4501bfe59200fa4661514f4) · [GitHub](https://github.com/EMI-Group/genesis/commit/e3bba720387f921bd72dda49016cdfb4ef0fa46b) · [GitHub](https://github.com/EMI-Group/genesis/commit/4f8a233f89a1dcecb63ce3d342b437b4d4fbf8af).
