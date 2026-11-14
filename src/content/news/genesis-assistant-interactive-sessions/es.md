---
title: "Genesis Assistant: retomar una conversación en espera"
pubDate: 2026-11-12
updatedDate: 2026-11-14
summary: "La rama main de Genesis conserva las conversaciones de Assistant en sesiones interactivas y muestra el código exacto y el nodo de destino al revisar una aprobación."
---

Un desarrollador puede pedir a Genesis Assistant que examine una tarea fallida, ir a revisar los cambios y volver con otra pregunta. Para ello necesita recuperar la conversación y su contexto. Los cambios incorporados a Genesis `main` del 10 al 12 de noviembre de 2026 mantienen una sesión interactiva durante la vida de la conversación y trasladan la lista de conversaciones a la barra lateral. [Guía de Assistant][guide]

![Una persona regresa a una conversación marcada y revisa una acción propuesta](./genesis-assistant-interactive-sessions.webp)

*Ilustración editorial sobre cómo retomar una conversación de Assistant y revisar una acción propuesta.*

## Regresar a una conversación que espera respuesta

Abra **Conversations** debajo de **Active Tasks**. La lista reúne sesiones activas del nodo seleccionado y conversaciones guardadas en caché local. Los estados distinguen las que esperan entrada, están en ejecución o han terminado. Al elegir una conversación se abre `/assistant?session=<agent_id>`. Los enlaces antiguos `/help` redirigen a `/assistant` y conservan los parámetros de consulta. [Cambio de ruta][route]

Tras un intercambio, la sesión puede liberar su plaza de ejecución y conservar el contexto y el árbol de trabajo. Un mensaje posterior continúa en la misma sesión del agente con el mismo identificador de caché del prompt. **New chat** abre otra conversación y deja la anterior en la lista. Las conversaciones terminadas pueden seguir visibles en el historial. [Implementación de sesiones][session]

## Examinar la tarea antes de actuar

Imagine que falla una tarea de pruebas. Pida a Assistant que lea su estado, error y resultado en el nodo que está consultando. Abra la página de revisión, compare los cambios con el fallo y regrese mediante **Conversations** para precisar la pregunta. La conversación anterior aporta el contexto. En una instancia local, descargue el código fuente de Genesis cuando se le solicite para que Assistant pueda consultarlo.

Para volver a intentarlo, pida al asistente que proponga una tarea nueva con la anterior como contexto. La consulta utiliza el nivel de lectura, mientras que iniciar el trabajo requiere una llamada de escritura. La decisión corresponde a esa llamada concreta en el nodo seleccionado. [Inspección y niveles de ejecución][guide]

## Revisar la escritura sin perder el punto de lectura

Una barra fija entre la conversación y el cuadro de texto indica las peticiones pendientes. **Review** abre un diálogo que presenta una petición cada vez. Compruebe el código exacto y el destino, y elija **Allow once** o **Deny**. Las peticiones de nivel `sudo` muestran un aviso destacado porque ejecutan Elixir nativo bajo la identidad del servidor Genesis.

El diálogo muestra el nodo de destino indicado por el entorno de ejecución y los avisos de la petición. Cuando hay varias peticiones, se revisan una por una. Una petición restaurada puede aparecer mientras siga pendiente. El texto de la conversación y el cuadro de entrada mantienen su posición cuando cambia la barra. [Cambios de aprobación][approval]

## Volver a la tarea para comprobar el resultado

Después de aprobar una escritura, consulte la tarea resultante y su estado. Si la respuesta se interrumpe o la escritura supera el tiempo de espera, compruebe el estado actual antes de repetirla. En una compilación que incorpore estos cambios, empiece por una consulta de solo lectura, cambie de página y vuelva mediante **Conversations** con otra pregunta. La [introducción anterior a Assistant][related] describe las herramientas en las que se apoya este flujo. [Guía actual][guide]

## Conservar la respuesta final cuando termina la sesión

Actualización del 14 de noviembre: los cambios integrados en `main` el 13 de noviembre entregan una instantánea final autoritativa a Assistant y al inspector del agente seleccionado. La transcripción y el estado terminal se aplican juntos; las notificaciones tardías no reabren la conversación cerrada. Si la transferencia no está disponible, permanece el último texto coherente en caché, sin leer el historial por separado. El inspector puede conservar los detalles del agente terminado fuera del árbol activo. En una compilación con este cambio, mantenga seleccionada la conversación hasta completarse y compruebe que texto final y estado coincidan antes de repetir el trabajo. [Implementación de la transferencia final][handoff]

[guide]: https://github.com/EMI-Group/genesis/blob/ee8f4ed570c86516f1a76639bd71ea7477688439/docs/genesis-assistant.md
[session]: https://github.com/EMI-Group/genesis/commit/7bf561a64c5f4f1dcc2193b6788ee248c5326736
[route]: https://github.com/EMI-Group/genesis/commit/124abbf7eaaa21c5ca6fe803128a962e7384d1b5
[approval]: https://github.com/EMI-Group/genesis/commit/946ff9735c7b03aac4abb6a312c3a111a79fa51b
[related]: /es/news/genesis-development-2026-11-07

[handoff]: https://github.com/EMI-Group/genesis/commit/716c85c93bb171396c30b18b67d6d8a8c554b1ae
