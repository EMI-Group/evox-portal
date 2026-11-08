---
title: "Genesis: continuar las tareas largas mientras se reduce el contexto"
pubDate: 2026-10-29
summary: "Genesis 0.13.8–0.13.10 combina compresión, trabajos persistentes en segundo plano y puntos de control con presupuesto para tareas prolongadas."
updatedDate: 2026-11-08
---

Una prueba puede seguir ejecutándose cuando la conversación del agente ya está llena. Genesis 0.13.8–0.13.10, publicado del 26 al 29 de octubre de 2026, separa ambos ciclos: comprime el contexto de trabajo del modelo y mantiene disponibles la salida y el estado final de los trabajos de shell desacoplados.

![Contexto largo comprimido mientras continúan las tareas](./context-compression-continuity.webp)

*Comprimir el contexto de trabajo y continuar la ejecución.*

## Compresión según el presupuesto del modelo

La versión 0.13.8 introduce dos etapas: recortar resultados de herramientas sin llamar al modelo y después generar un resumen de control. La activación depende de la ventana de contexto, configurable por agente, e incluye una actualización del estado de ejecución. Un indicador muestra uso y número de compresiones. [v0.13.8](https://github.com/EMI-Group/genesis/releases/tag/v0.13.8)

La versión 0.13.10 aborda el caso en que mensajes recientes demasiado grandes impiden una reducción suficiente. El historial reciente recibe un presupuesto de tokens, se conservan las parejas de llamada y resultado, y se eliminan las actualizaciones obsoletas para mantener una sola vigente. [v0.13.10](https://github.com/EMI-Group/genesis/releases/tag/v0.13.10)

## La ejecución supera un segmento de conversación

Los trabajos shell independientes de 0.13.8 sobreviven a la compresión y notifican su finalización. El agente puede consultar su salida, enumerarlos o detenerlos sin mantener toda la operación en una llamada bloqueante. La versión 0.13.9 también corrige trabajos que permanecían en estado de ejecución en el entorno aislado systemd. [v0.13.9](https://github.com/EMI-Group/genesis/releases/tag/v0.13.9)

## La continuidad necesita un estado observable

Para compilaciones o pruebas largas, usa un trabajo desacoplado y sigue su estado y salida tras la compresión. El medidor de contexto muestra el uso y las compresiones; el estado terminal indica finalización o fallo. Ambas señales ayudan a decidir el siguiente paso. La [introducción a Genesis](/es/news/evox-genesis) describe el flujo general.
