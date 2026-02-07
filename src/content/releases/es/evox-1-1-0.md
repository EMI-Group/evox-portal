---
title: "EvoX 1.1: ahora con torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 introduce la integración completa de torch.compile (TorchDynamo), reemplazando TorchScript para mejor compatibilidad y rendimiento."
---

Nos complace anunciar el lanzamiento de **EvoX 1.1**, que introduce la **integración completa de torch.compile (TorchDynamo)** como compilador backend. Esta actualización reemplaza el enfoque anterior basado en TorchScript, haciendo que EvoX sea **más fácil de usar y altamente compatible con el ecosistema Python en general**.

Al aprovechar **torch.compile**, EvoX ahora captura los grafos de computación de forma dinámica en tiempo de ejecución, eliminando la necesidad de trazado manual y optimizando el rendimiento automáticamente.

**Novedades**

**torch.compile: compilación más inteligente y flexible**

En EvoX 1.1, adoptamos plenamente **torch.compile** como el nuevo backend de compilación. A diferencia del enfoque anterior basado en trazado, torch.compile --que **utiliza internamente TorchDynamo**-- intercepta la ejecución de Python, extrae dinámicamente los grafos de computación y los optimiza en tiempo real.

Esto significa:

l  **Sin más trazado manual** -- Basta con llamar a **torch.compile(workflow.step)** y EvoX se encarga del resto.

l  **Compatibilidad fluida con Python** -- Funciona con funciones nativas de Python y bibliotecas externas como NumPy y SciPy.

l  **Mejor rendimiento** -- Los grafos de computación optimizados resultan en una **ejecución más rápida y un mejor aprovechamiento del hardware**.

l  **Diseño preparado para el futuro** -- Se alinea con la hoja de ruta de PyTorch, garantizando compatibilidad a largo plazo y mejoras continuas de rendimiento.

**Por qué pasar de TorchScript a torch.compile**

En versiones anteriores, EvoX dependía de **métodos basados en trazado**:

l  **Antes de la 1.0.0** se utilizaba el **trazado de JAX** para la extracción de grafos de computación.

l  **La v1.0.0** cambió a **TorchScript**, mejorando la integración con PyTorch.

Sin embargo, estos métodos tenían varios inconvenientes:

l  **Complejidad de uso** -- Los usuarios debían trazar grafos manualmente y gestionar una depuración compleja.

l  **Compatibilidad limitada** -- Dificultades con flujos de trabajo dinámicos y funciones ajenas a PyTorch.

l  **Flexibilidad restringida** -- Los bucles, condicionales y otras construcciones de Python no siempre se capturaban correctamente.

Con torch.compile y **TorchDynamo**, **estos problemas han desaparecido**. EvoX ahora optimiza de forma dinámica, soportando una gama más amplia de flujos de trabajo **sin ningún esfuerzo adicional por parte de los usuarios**.

**Cómo EvoX 1.1 le facilita la vida**

l  **Sin complicaciones con el trazado** -- Todo ocurre entre bastidores, haciendo que su código sea más limpio y fácil de mantener.

l  **Funciona con su código Python existente** -- No es necesario modificar su flujo de trabajo para lograr compatibilidad.

l  **Ejecución más rápida, mejor escalabilidad** -- Benefíciese de las últimas optimizaciones de PyTorch para GPUs y TPUs.

l  **Preparado para el futuro** -- Manténgase alineado con la evolución a largo plazo de PyTorch, garantizando mejoras continuas de rendimiento.

**Actualice a EvoX 1.1 ahora**

EvoX 1.1 ya está disponible oficialmente. Actualice hoy para experimentar un flujo de trabajo computacional **más inteligente, más rápido y más intuitivo**.

**Obtenga EvoX 1.1**: [GitHub](https://github.com/EMI-Group/EvoX)

¿Tiene preguntas o comentarios? Abra un issue en GitHub o únase a nuestro debate comunitario. ¡Empujemos juntos los límites de la **inteligencia computacional**!

**Código fuente / Comunidad / Documentación**

Paper: [https://arxiv.org/abs/2301.12457](https://arxiv.org/abs/2301.12457 "https://arxiv.org/abs/2301.12457")

GitHub: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Documentación: [https://evox.readthedocs.io/en/latest/](https://evox.readthedocs.io/en/latest/ "https://evox.readthedocs.io/en/latest/")

Grupo QQ: 297969717

![4.png](/images/articles/evox-1-1-0-1.png)
