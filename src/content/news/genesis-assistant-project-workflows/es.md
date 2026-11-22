---
title: "Genesis Assistant: de la conversación a una tarea de proyecto"
pubDate: 2026-11-16
updatedDate: 2026-11-22
summary: "Elige un proyecto, aprueba una acción concreta y sigue el desarrollo en segundo plano sin vincular su duración al chat."
---

Pedir una corrección en un proyecto requiere un destino, una acción aprobada y una forma de seguir el resultado. Genesis Assistant conecta esos pasos en la PR #172, integrada en `main` el 15 de noviembre de 2026. El flujo amplía la [continuidad de las conversaciones][previous] con trabajo sobre proyectos.

![Una carpeta de proyecto pasa por una estación de aprobación conectada con un taller independiente](./genesis-assistant-project-workflows.webp)

*Ilustración conceptual: definir el proyecto y aprobar el trabajo antes de seguir su ejecución independiente.*

## Elegir el destino antes de empezar

Conversar y controlar tareas ya no requiere una copia de Genesis. Consultar el código es opcional y exige aprobación. Elegir un proyecto del host seleccionado completa rutas omitidas sin leer archivos ni autorizar desarrollo. No se puede cambiar durante una respuesta; otra ruta explícita sigue siendo el destino mostrado para aprobar. [Cambios integrados][workflows]

La selección pertenece al nodo y a la conversación; una nueva conversación en el mismo nodo puede heredarla. El servidor proporciona a las herramientas la identidad del nodo y de la conversación, en lugar de permitir que el modelo la invente. Si una petición especifica otra ruta, la aprobación debe mostrar ese destino real. Esto importa, por ejemplo, con dos repositorios de nombre parecido: comprobar la ruta antes de empezar evita aprobar el trabajo equivocado.

## De la aprobación al seguimiento de una tarea

Las once definiciones compartidas con MCP distinguen la consulta de la modificación. Leer el estado de una tarea se ejecuta directamente; iniciar, cancelar o enviar requisitos exige una aprobación vinculada a parámetros estructurados inmutables. El rechazo o la caducidad no ejecuta la acción. Para corregir una prueba, aporta el contexto del fallo, revisa el destino y los parámetros propuestos y aprueba esa solicitud concreta. Después del inicio, abre el seguimiento y la revisión del resultado, sin deducir el éxito del mero mensaje de aceptación. [Contrato de las herramientas][workflowguide]

Los inicios correctos se siguen automáticamente; el selector Tasks permite buscar tareas existentes.

## Separar el trabajo de la respuesta

Enviar un requisito adicional lo pone en cola; no demuestra que el desarrollador activo ya lo haya incorporado. Del mismo modo, **Stop reply** detiene la respuesta después del lote de herramientas en ejecución y conserva la sesión, mientras la tarea de desarrollo continúa. Las tarjetas muestran estados observados, contadores y horas de actualización, sin inventar porcentajes de progreso. Si falla la actualización, permanece la última observación. Estas distinciones permiten decidir entre esperar, revisar el resultado, precisar la solicitud o pedir una cancelación. Cancelar no deshace cambios Git.

Los enlaces de tareas sobreviven al fin de sesión, pero las conversaciones en memoria no al reinicio del servidor; las tareas persistentes se pueden volver a encontrar. Prueba una compilación con la PR #172 y comprueba el estado antes de repetir un envío incierto. [Guía actualizada][workflowguide]

## Aportar archivos desde el dispositivo correcto

El navegador carga texto, PDF, DOCX, imágenes y audio, cuatro archivos por mensaje de hasta 15 MiB cada uno; los adjuntos completos se pueden enviar sin texto. La entrada secundaria de ruta del servidor admite el nodo local del panel y no lo sustituye por un nodo remoto no compatible.

La carga desde el navegador toma los archivos del dispositivo actual. Leer una ruta del servidor se refiere a otro lugar y está limitado al nodo local del panel. Espera a que termine la carga antes de cambiar de contexto: cambiar de conversación o nodo cancela las transferencias pendientes. Para consultar el código de Genesis, la preparación opcional de la referencia fuente sigue requiriendo aprobación; compara su versión con la del entorno de ejecución activo. El contexto del proyecto y la referencia del código de Genesis cumplen así funciones distintas. [Archivos y referencia fuente][workflowguide]

Los [cambios del entorno del 20 de noviembre](/es/news/genesis-project-workbench) reúnen navegación por proyectos, vistas Git y borradores con ámbito VCT en un espacio común.

[previous]: /es/news/genesis-assistant-interactive-sessions
[workflows]: https://github.com/EMI-Group/genesis/pull/172
[workflowguide]: https://github.com/EMI-Group/genesis/blob/6e10e18dd56ca3c84e2215dac647473c30563fee/docs/genesis-assistant.md
