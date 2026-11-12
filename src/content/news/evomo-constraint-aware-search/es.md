---
title: "EvoMO: conservar la viabilidad de cada candidato"
pubDate: 2026-10-30
summary: "La selección con restricciones, las poblaciones impares coherentes y una ruta OSP-NSDE más eficiente facilitan el control de experimentos multiobjetivo."
---

Un buen valor objetivo solo es útil si el candidato también satisface las restricciones. El 30 de octubre de 2026, EvoMO integró la [PR #48][s1] en main, ampliando el tratamiento de restricciones y corrigiendo la gestión de poblaciones. La actualización conecta tres cuestiones prácticas: qué soluciones conservar, cómo mantener sus estados alineados y cuánto cuesta seleccionarlas.

![Rutas candidatas atraviesan un límite de restricciones por una puerta seleccionada](./cover.webp)

*Ilustración conceptual: la viabilidad acompaña al candidato durante la selección.*

## La viabilidad debe recorrer todo el proceso

Un problema restringido puede devolver `(fitness, cv)`, emparejando objetivos y violaciones. La implementación lleva esta información por la inicialización, evaluaciones exploratorias, apareamiento, archivos y actualización de supervivientes. Las utilidades comunes tratan violación total positiva, empates y distintas formas de restricciones, conservando la correspondencia entre decisiones, aptitud y estado de restricciones.

Si dos candidatos intercambian posiciones, la viabilidad debe seguirlos. Al buscar diseños que equilibren rendimiento y recursos bajo un límite estricto, ordenar solo objetivos podría conservar una propuesta atractiva pero inviable. Mantener ese estado permite aplicar la regla documentada de cada algoritmo, que sigue siendo específica del método.

## Una población impar debe seguir siendo válida

El cambio corrige incompatibilidades de forma en la primera generación con tamaños solicitados como 51 en ocho algoritmos, incluidos SparseEA, SparseEA2, DMMOEA y OSP_NSDE. Emparejamientos y número real de descendientes quedan alineados con máscaras, aptitud y restricciones. Importa cuando el tamaño responde al presupuesto experimental y no a un número par cómodo.

Los métodos dispersos y dinámicos también reciben correcciones respecto a sus flujos de referencia. DMMOEA detecta cambios ambientales reevaluando una muestra y actualiza las cachés de aptitud y restricciones. La familia SparseEA mantiene juntas decisiones y máscaras de dispersión durante variación y selección. Estos detalles determinan la búsqueda ejecutada, no solo si el programa termina.

## Selección más rápida con límites explícitos

OSP-NSDE ordena las distancias vecinas una vez y las actualiza tras eliminar candidatos. Los núcleos Triton opcionales trasladan a CUDA el truncamiento compatible del frente límite. La ruta automática cubre dispositivos admitidos, float32/float64 y poblaciones solicitadas de hasta 128; el resto utiliza PyTorch. La ordenación no dominada permanece en PyTorch.

Para compilar, primero se inicializa y después se usa `torch.compile(workflow.step, fullgraph=False)`. Predicción, búsqueda local y modelos de mezcla conservan partes eager. La PR aporta medidas locales en RTX 5060 Ti con tiempos sincronizados y presupuestos fijos; sus resultados completos muestran que compilar no siempre supera al eager optimizado. La elección debe basarse en toda la carga.

## Comprobar la búsqueda antes de ampliarla

Se añaden MaOEAHAP, NRVMOEA, HEA y GCNMOEA. Los tres primeros rechazan explícitamente tuplas de restricciones. GCNMOEA utiliza violaciones en el reemplazo del vecindario, mientras otros componentes siguen basándose en objetivos. Conviene revisar estos límites antes de intercambiar métodos.

En un experimento existente, fija el [código integrado][s2], la semilla y el presupuesto; tras un paso, compara los objetivos y restricciones guardados con una evaluación nueva. Incluye población impar y un caso restringido, registrando viabilidad, calidad y tiempo por separado. La [presentación de versión EvoMO][related] ofrece la base publicada; este cambio en main aporta el trabajo posterior de selección y restricciones.

[s1]: https://github.com/EMI-Group/evomo/pull/48
[s2]: https://github.com/EMI-Group/evomo/tree/2aa4b3d059090ac9561b18b439002265e4015ca4
[related]: /es/releases/evomo-0-3-1
