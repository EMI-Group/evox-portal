---
title: "Genesis Server: un entorno persistente para desarrollar software"
pubDate: 2026-11-02
summary: "Desde la distribución headless de 0.13.11 hasta la continuidad tras cerrar sesión en 0.14.0, Genesis permite desplegar su panel y agentes de forma independiente."
---

Genesis 0.14.0, publicado el 2 de noviembre de 2026, detecta el estado de lingering de systemd al iniciar el servidor y ofrece activarlo. Continúa la distribución headless introducida en 0.13.11 el 30 de octubre. El entorno de ejecución puede así gestionarse con un ciclo de vida separado de la sesión de escritorio.

## Una distribución de servidor con controles operativos

El paquete incluye el panel y el entorno de los agentes para Linux x64/arm64 y macOS arm64. La CLI permite ejecutar el servicio, iniciarlo, detenerlo y consultar estado, registros, salud y versión. El instalador verifica las sumas de comprobación, instala o actualiza el paquete y enlaza el ejecutable.

Son interfaces prácticas para operar un proceso persistente. El punto de salud informa de estado, versión y tiempo activo; los registros muestran su comportamiento. Un proceso sano no demuestra que los cambios del agente sean correctos ni que el proyecto supere sus pruebas. Salud operativa y validación del software siguen siendo responsabilidades distintas.

## Gestionar el ciclo de vida de la ejecución

En Linux con systemd puede hacer falta lingering para mantener servicios de usuario tras cerrar sesión. La versión 0.14.0 comprueba esta condición y permite configurarla con GENESIS_LINGER o --no-linger. Es una función específica de plataforma, no una promesa de comportamiento idéntico en todos los sistemas.

La versión anterior también mejora el arranque remoto: envoltorio POSIX shell, tratamiento correcto de rutas con espacios y motivos de error legibles. Las correcciones del modo servidor y el tiempo activo preciso facilitan el diagnóstico.

## El despliegue forma parte del desarrollo

En tareas largas, elegir una máquina adecuada para ejecutar es parte del trabajo. El servidor ofrece un componente desplegable con controles explícitos de ciclo de vida. Amplía Genesis más allá del escritorio y refuerza la operación de la infraestructura EvoX, sin sustituir revisión, validación o decisiones sobre qué resultados aceptar.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.14.0)
