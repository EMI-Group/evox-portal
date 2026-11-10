---
title: "Genesis en desarrollo: un registro persistente de proyectos"
pubDate: 2026-11-10
summary: "Los cambios de main del 9 de noviembre sustituyen proyectos recientes por un registro en base de datos y separan opciones locales y remotas."
---

Abrir un repositorio en otra máquina exige distinguirlo de los proyectos locales. Los cambios integrados en Genesis main el 9 de noviembre de 2026 conectan Projects y la paleta con un registro VCT en base de datos, sustituyendo la lista reciente. [main](https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d)

![Carpetas de proyecto en armarios por host con sus etiquetas de registro](./project-host-registry.webp)

## Un lugar registrado para cada proyecto

Abrir o crear registra el montaje mediante la interfaz que reconoce el nodo. La paleta busca rutas registradas y el proyecto activo puede mostrar su punto de montaje. Las listas remotas proceden del host elegido, sin entradas locales mientras se conecta. [main](https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d)

## Revisar el host antes de continuar

En compilaciones de desarrollo con estos cambios, reabra un repositorio local y remoto y revise identidad y sugerencias de ruta. El registro sirve para navegar; los cambios de código siguen la validación habitual del proyecto.

[Genesis multirrepositorio: un objetivo, historiales independientes](/es/news/genesis-multi-repository)
