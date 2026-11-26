---
title: "Genesis refuerza las dependencias de su panel"
pubDate: 2026-11-25
updatedDate: 2026-11-26
summary: "main actualiza Phoenix, LiveView, Bandit y jsv; los despliegues desde código fuente requieren reconstruir la aplicación."
---

El 23 de noviembre de 2026, Genesis actualizó cuatro dependencias en `main`. El mantenimiento afecta a la infraestructura web compartida que permite acceder al espacio de trabajo. Para los equipos que compilan Genesis desde el código fuente, lo importante es el conjunto de dependencias utilizado para construir el servicio en ejecución. [Actualización][lock]

![Una pieza de recambio refuerza el mecanismo de una cerradura](./cover.webp)

*Ilustración conceptual: mantenimiento de los componentes que protegen una entrada compartida.*

## Qué cambia bajo la interfaz

La declaración de dependencias vincula Phoenix con correcciones de fallos del seguimiento de presencia y de la distribución de mensajes, y el mínimo de LiveView con una corrección de los hooks de inicialización de sesión omitidos cuando la conexión no incluye su URL. También describe validaciones y refuerzos HTTP/2 de Bandit. Son los motivos registrados por los responsables de Genesis; el commit no determina si una instalación concreta estuvo expuesta. [Requisitos][pins]

El archivo de bloqueo cambia Phoenix de 1.8.16 a 1.8.17, LiveView de 1.2.13 a 1.2.15, Bandit de 1.14.1 a 1.15.0 y jsv de 0.28.0 a 0.28.1. El mínimo declarado de LiveView es 1.2.14, mientras que la compilación bloqueada utiliza 1.2.15. Un cambio complementario de Nix recalcula el hash de dependencias. [Versiones][lock] · [Cambio de Nix][nix]

## Compruebe la compilación desplegada

Por ejemplo, un equipo con alojamiento propio puede actualizar el código y seguir ejecutando un binario antiguo. Utilice una revisión que contenga estos commits, reconstruya y vuelva a desplegar según el procedimiento habitual del proyecto. Compruebe el `mix.lock` de la compilación, conserve el hash correspondiente de Nix cuando proceda y verifique el acceso al panel y la reconexión en directo. Actualizar únicamente el directorio fuente no sustituye al servicio en ejecución. [Guía de instalación][install]

[lock]: https://github.com/EMI-Group/genesis/commit/99f450252b8c0f8a07ad64bb3f7491b35f9b23d0
[pins]: https://github.com/EMI-Group/genesis/commit/bfcc0115ad1cb714ec54d60265816550c1619bd3
[nix]: https://github.com/EMI-Group/genesis/commit/6a80bba389dec5d120c64a435cab88be4de275bc
[install]: https://github.com/EMI-Group/genesis/blob/43705acdfc9a4ebc885e0d457d75242286924637/README.md

El mantenimiento del 25 de noviembre de 2026 también eleva `db_connection` a 2.10.3. El código atribuye ese mínimo de seguridad a estructuras de flujo falsificadas que alcanzan la opción de registro. También actualiza dependencias nativas de Markdown y hashes Nix. Reconstruya con el archivo de bloqueo y las definiciones Nix correspondientes. [GitHub](https://github.com/EMI-Group/genesis/commit/6e008cbed33eb16bd370136628097933e4906f10).
