---
title: "EvoNAS: antes de buscar una red mejor, hacer que la comparación importe"
pubDate: 2026-11-14
summary: "Compartir pesos abarata la búsqueda, pero puede cambiar la clasificación. EvoNAS conecta entrenamiento y evaluación para orientar la siguiente elección."
---

Una red puede ganar durante la búsqueda y decepcionar tras entrenarse por separado. En la búsqueda evolutiva, cada generación utiliza evaluaciones anteriores para decidir qué conservar. Si la clasificación está distorsionada, buscar durante más tiempo puede reforzar una mala elección. EvoNAS conecta el aprendizaje de la superred, la evaluación de candidatos y el equilibrio entre precisión y coste de cálculo.

![Ilustración conceptual: marcos con forma de red observan la misma calle y un borde geométrico fino.](./evonas-editorial.webp)

## La búsqueda depende de evaluaciones fiables

Entrenar cada candidato de forma independiente elevaría mucho el coste. Compartir pesos evita empezar de cero, pero también vincula el aprendizaje. La estructura más favorecida por los parámetros compartidos no tiene por qué ser la mejor tras entrenarse sola. Como la selección determina la siguiente generación, una comparación distorsionada puede desviar toda la búsqueda.

Una superred comparte parámetros entre arquitecturas. Sin embargo, el rendimiento con pesos heredados no siempre refleja el potencial de cada candidato. El trabajo presentado el 20 de marzo de 2026 propone una superred híbrida VSS–ViT y CA-DDKD, que alinea representaciones en los dominios espacial y frecuencial. PST amplía progresivamente el entrenamiento desde configuraciones grandes hacia variantes compactas.

Reconocer un edificio no es lo mismo que localizar con precisión sus bordes. En profundidad y segmentación importan una barandilla fina, una esquina o el límite con el fondo. CA-DDKD utiliza restricciones basadas en la transformada discreta del coseno para ayudar a conservar esos detalles geométricos. La posición espacial y los cambios que definen bordes y texturas se complementan.

El entrenamiento pasa así a formar parte del método de búsqueda. Mejores representaciones compartidas permiten comparaciones más útiles; aumentar únicamente el número de candidatos no arregla una clasificación poco fiable.

## Comparar opciones bajo restricciones

En estimación de profundidad, puede aceptarse una variación de precisión para cumplir un límite de latencia. La búsqueda multiobjetivo ofrece varias alternativas. DMMPE evalúa múltiples modelos mediante un conjunto de recursos GPU y planificación asíncrona. La decisión final depende del hardware, los datos y el protocolo de medida.

Los candidatos deben medirse en condiciones de hardware y ejecución comparables. La configuración de búsqueda define qué parece prometedor; el reentrenamiento muestra lo que la estructura elegida puede aprender. Conectar ambas etapas permite volver al problema de clasificación que motiva EvoNAS.

## Antes de iniciar un experimento

El proceso comprende preentrenamiento en ImageNet-1k, ajuste PST en los datos objetivo, búsqueda evolutiva y reentrenamiento de la subred elegida. La guía cubre KITTI y NYU Depth v2 para profundidad, COCO para detección y ADE20K para segmentación. Seguir un conjunto de datos a través de rutas, configuraciones y objetivos permite relacionar la puntuación de búsqueda con el modelo final.

El README sigue indicando que la descarga de la superred preentrenada necesaria está pendiente. Antes de comenzar, compruebe la disponibilidad de los pesos y ajuste el wheel de Mamba SSM al entorno documentado de Python, CUDA y PyTorch.

[Código e instalación](https://github.com/EMI-Group/evonas/blob/e4f6866e8092545b2b9b28f3fe0162e038e34f3c/README.md) · [Artículo científico](https://arxiv.org/abs/2603.19563v1)

[EvoX](/es/libs)
