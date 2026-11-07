---
title: "Herramientas y habilidades de Genesis: incorporar métodos del proyecto"
pubDate: 2026-09-26
summary: "Las herramientas personalizadas de Genesis 0.13.1 y las habilidades editadas en árboles de trabajo en 0.13.4 conectan operaciones propias y orientación reutilizable."
---

Los proyectos acumulan código y formas de construirlo, comprobarlo y modificarlo. Genesis 0.13.4, publicado el 26 de septiembre de 2026, sitúa las modificaciones de habilidades en el árbol de trabajo y las hace revisables en Git. Junto con las herramientas personalizadas de 0.13.1, del 21 de septiembre, ofrece dos vías para integrar métodos del proyecto.

## Exponer operaciones mediante herramientas propias

La versión 0.13.1 carga herramientas definidas por el usuario desde el directorio tools de configuración. Aparecen en los ajustes, pueden incluirse en listas permitidas de agentes personalizados y se invocan mediante el distribuidor central. El proyecto puede ofrecer operaciones explícitas además de un shell general.

Por ejemplo, un equipo podría envolver su comprobador existente con un contrato definido de entrada y salida. Es un uso posible de la extensión, no una integración incluida. Implementación, permisos y significado de los resultados siguen correspondiendo al proyecto.

## Situar las habilidades donde se revisa el código

La versión 0.13.4 lee y escribe habilidades en el árbol del agente y permite registrar cambios mediante un indicador opcional de commit. La orientación redactada por el agente puede revisarse en su rama. También corrige la detección y eliminación de habilidades.

Las herramientas exponen operaciones invocables; las habilidades contienen orientación reutilizable. Son complementarias, pero distintas. Git hace que una modificación sea visible y versionada, sin demostrar automáticamente su corrección o utilidad.

## Ampliar capacidades manteniendo la revisión

Estas extensiones acercan la revisión de métodos generados a la del código. En el ecosistema EvoX, la mejora puede afectar tanto a la implementación como a las instrucciones para desarrollarla. Aceptación y validación siguen siendo necesarias para convertir propuestas en una base fiable para el trabajo posterior.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.1) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)
