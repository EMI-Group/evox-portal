---
title: "Desarrollo de Genesis: un registro persistente para los proyectos"
pubDate: 2026-11-10
updatedDate: 2026-11-10
summary: "Los cambios del 9 de noviembre en main conectan la navegación con un registro VCT persistente. Identidad estable, carga por host y migración protegida aclaran el paso de local a remoto."
---

La ruta de un repositorio solo tiene sentido en la máquina que la contiene. Un portátil y un servidor pueden tener una carpeta `demo`, pero abrir una no debería seleccionar la otra sin avisar. Los cambios incorporados a **Genesis main el 9 de noviembre de 2026** sustituyen el seguimiento de proyectos recientes en Projects por un registro en base de datos y dirigen la activación a través del nodo seleccionado. [Integración en Projects][projects]

![Carpetas de proyectos en archivadores separados por host con sus etiquetas de registro](./project-host-registry.webp)

## Una identidad que permanece al volver a abrir

El Virtual Context Tree, o VCT, asocia una ruta absoluta del sistema a un punto canónico como `vct:///projects/demo`. Un mount es esa correspondencia: punto, ruta, nombre visible y última apertura. Da una identidad estable a la navegación sin mover el repositorio ni crear un montaje del sistema de archivos. [Implementación del registro][store]

Registrar otra vez la misma ruta normalizada actualiza la fecha y conserva el punto. Las rutas distintas con el mismo nombre final reciben puntos diferentes, con sufijos si hace falta. Si la ruta antigua ya no existe, una nueva con el nombre visible y el nombre final del punto coincidentes puede reutilizarlo. Es una regla concreta de traslado, no una deducción general de que carpetas con nombres similares sean el mismo proyecto. [Reglas de identidad][identity]

La persistencia reside en la tabla SQLite `vct_mounts` del almacén de tareas. El proceso VCT mantiene una caché de lectura; cada cambio escribe atómicamente toda la tabla antes de modificar la caché. Si falla la persistencia, devuelve un error y conserva el estado anterior. Los cambios correctos emiten una notificación con el nodo para conectar la identidad guardada con la actualización de la interfaz.

El registro tiene límite: conserva por defecto los 100 mounts más recientes y elimina los más antiguos al superarlo. Es un registro de navegación de trabajo, no un archivo ilimitado de todos los repositorios abiertos. [Almacenamiento y capacidad][store]

## Buscar y abrir con el mismo registro

Projects y la paleta de proyectos utilizan ahora los mounts registrados. Abrir o crear un proyecto llama a la interfaz `mount_project`, que tiene en cuenta el nodo, y recarga la lista. Las sugerencias buscan primero el texto en rutas registradas sin distinguir mayúsculas y minúsculas; después añaden sugerencias por prefijo del sistema de archivos y eliminan duplicados. Un fragmento de una ruta conocida permite encontrar un proyecto sin volver a recorrer su directorio superior. [Cambios de navegación][projects]

El punto VCT del proyecto activo se busca en los mounts ya cargados para mostrarlo. Dibujar una etiqueta no registra un proyecto nuevo. Olvidar un proyecto elimina su entrada del registro, no los archivos del repositorio. Estas diferencias separan la navegación de los cambios en el trabajo.

## Mantener el host seleccionado en el recorrido

Pensemos en un desarrollador con un checkout `demo` local y otro en un servidor SSH. Al seleccionar el host remoto se carga su lista. Mientras la conexión está pendiente, la lista permanece vacía en lugar de ofrecer entradas locales como proyectos remotos. La activación también espera a que la conexión esté lista, evitando que una petición destinada al servidor se ejecute en el nodo todavía local. [Carga remota y activación][projects]

Las rutas remotas se interpretan según el host elegido, incluidas las rutas absolutas POSIX y Windows compatibles. La activación remota es asíncrona para no bloquear LiveView con comprobaciones y registros. Una corrección posterior desempaqueta correctamente el resultado remoto para que el proyecto reciba su punto VCT. [Corrección del mount remoto][remote]

La comprobación útil es concreta: vuelva a conectar al servidor, busque su ruta registrada, ábrala y confirme host y punto visible. Repita con el checkout local. Los nombres parecidos no deben llenar una vista remota pendiente con el registro local.

## Trasladar los registros antiguos con cuidado

En las compilaciones de desarrollo que incluyen este trabajo, la migración genera mounts VCT a partir de filas antiguas `projects` utilizables, conserva nombres no vacíos y resuelve colisiones. Mantiene las 100 entradas más recientes. Las rutas vacías o relativas se anotan y se omiten. Si la tabla antigua no se puede leer, la migración se interrumpe y revierte, conservando tabla y filas en lugar de interpretar el error como una lista vacía. [Protección de la migración y pruebas upstream][migration]

Antes de probar una compilación así con un espacio de trabajo existente, haga una copia de los datos de la aplicación en cada host relevante. Tras arrancar, compruebe los proyectos en el host correcto, el mismo punto al reabrir y la persistencia tras reiniciar. Si aparece un error de migración, conserve la base de datos y el diagnóstico para investigarlo en vez de borrar el almacén para conseguir una lista vacía.

Este trabajo hace visible la frontera del proyecto al elegir dónde trabajar. Para separar los historiales de código, lea [Genesis con varios repositorios: un objetivo, historiales separados](/es/news/genesis-multi-repository).

[projects]: https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d
[store]: https://github.com/EMI-Group/genesis/blob/7383db2f1851c12bace5258bb7da44eab0571a72/apps/evo_git/lib/evo_git/vct.ex
[identity]: https://github.com/EMI-Group/genesis/blob/7383db2f1851c12bace5258bb7da44eab0571a72/apps/evo_git/lib/evo_git/vct/table.ex
[migration]: https://github.com/EMI-Group/genesis/commit/002d6ee324c29b1adbb009dbc38d625e674e70b9
[remote]: https://github.com/EMI-Group/genesis/commit/1eca4865be25f480573fd1df41b7a48fd9392700
