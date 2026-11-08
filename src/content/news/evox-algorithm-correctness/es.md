---
title: "EvoX 1.4.1: cuando una pequeña corrección cambia la búsqueda"
pubDate: 2026-10-30
summary: "Las correcciones de SHADE, evolución diferencial y CMA-ES muestran que una infraestructura evolutiva fiable requiere eficiencia y fidelidad algorítmica."
updatedDate: 2026-11-08
---

Una búsqueda puede terminar correctamente mientras sigue una regla de actualización equivocada. EvoX 1.4.1, publicado el 30 de octubre de 2026, corrige esa diferencia en SHADE, evolución diferencial y CMA-ES, y recupera la adaptación, el muestreo y la ejecución que necesitan los algoritmos.

![Verificación y corrección del comportamiento algorítmico](./algorithm-behavior-calibration.webp)

*Alinear la implementación con el comportamiento previsto.*

## Un programa puede funcionar y buscar de otra manera

En SHADE, la memoria de éxitos de F y CR no se adaptaba. Las mejoras se calculaban después de sustituir la aptitud, y la aritmética con matrices llenas de NaN contaminaba los valores elegidos. La corrección calcula las mejoras antes de actualizar y selecciona los éxitos con `torch.where`. [SHADE](https://github.com/EMI-Group/evox/commit/c92918a906eaf075cf885461acc031ee0eb223b3)

El operador compartido de cruce binomial comparaba muestras normales con una probabilidad de cruce. Ahora utiliza muestreo uniforme, acorde con esa probabilidad. Otras correcciones inicializan CoDE, SaDE y SHADE uniformemente dentro de sus límites. Cambia qué candidatos se generan, no solo si el programa falla. [DE](https://github.com/EMI-Group/evox/commit/5e68f81f8b6d6ea0638a44a337efe2183ba47716)

## Definiciones matemáticas y restricciones de ejecución

Las correcciones de CMA-ES abarcan la actualización de covarianza de rango uno, la constante de acumulación y las restricciones de aliasing de `torch.cond`. Esta última también reactiva una prueba CMA-ES deshabilitada. Las fórmulas y las condiciones del framework requieren comprobaciones separadas. [CMA-ES](https://github.com/EMI-Group/evox/commit/bcde7d2a171c34722c37a3559813136f702640cb)

La versión también aborda inicialización y subespacios de estrategias evolutivas, selección por torneo, transferencias de dispositivo de PSO e hipervolumen. [v1.4.1](https://github.com/EMI-Group/evox/releases/tag/v1.4.1)

## La fiabilidad forma parte de la infraestructura

La corrección de SHADE añade una prueba de regresión: ejecuta cinco pasos del flujo y comprueba que la memoria de adaptación cambia y conserva valores finitos. Para comparar versiones, registra semilla, objetivo, población y presupuesto de evaluación; después repite las referencias afectadas. Las [notas de versión](/es/releases/evox-1-4-1) orientan la actualización.
