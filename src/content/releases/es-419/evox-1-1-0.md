---
title: "EvoX 1.1: ahora con torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 introduce la integración completa de torch.compile (TorchDynamo), reemplazando TorchScript para mejor compatibilidad y rendimiento."
---

Nos complace anunciar el lanzamiento de **EvoX 1.1**, que introduce la **integración completa de torch.compile (TorchDynamo)** como compilador backend. Esta actualización reemplaza el enfoque anterior de TorchScript, haciendo que EvoX sea **más fácil de usar y altamente compatible con el ecosistema más amplio de Python**.

Al aprovechar **torch.compile**, EvoX ahora captura grafos de computación dinámicamente en tiempo de ejecución, eliminando la necesidad de trazado manual mientras optimiza el rendimiento automáticamente.

**¿Qué hay de nuevo?**

**torch.compile: Compilación más inteligente y flexible**

En EvoX 1.1, adoptamos completamente **torch.compile** como el nuevo backend de compilación. A diferencia del enfoque anterior basado en trazado, torch.compile--que **internamente usa TorchDynamo**--intercepta la ejecución de Python, extrae dinámicamente grafos de computación y los optimiza en tiempo real.

Esto significa:

l  **No más trazado manual** -- Solo llame a **torch.compile(workflow.step)**, y EvoX se encarga del resto.

l  **Compatibilidad perfecta con Python** -- Funciona con funciones nativas de Python y bibliotecas externas como NumPy y SciPy.

l  **Mejor rendimiento** -- Los grafos de computación optimizados resultan en **ejecución más rápida y mejor utilización del hardware**.

l  **Diseño preparado para el futuro** -- Se alinea con la hoja de ruta de PyTorch, asegurando compatibilidad a largo plazo y mejoras de rendimiento.

**¿Por qué pasar de TorchScript a torch.compile?**

En versiones anteriores, EvoX dependía de **métodos basados en trazado**:

l  **Pre-1.0.0** usaba **trazado JAX** para la extracción de grafos de computación.

l  **v1.0.0** cambió a **TorchScript**, mejorando la integración con PyTorch.

Sin embargo, estos métodos tenían varias desventajas:

l  **Complejos de usar** -- Los usuarios tenían que trazar grafos manualmente y manejar depuración intrincada.

l  **Compatibilidad limitada** -- Tenían dificultades con flujos de trabajo dinámicos y funciones no pertenecientes a PyTorch.

l  **Flexibilidad restringida** -- Los bucles, condicionales y otras construcciones de Python no siempre se capturaban correctamente.

Con torch.compile y **TorchDynamo**, **estos problemas desaparecieron**. EvoX ahora optimiza dinámicamente, soportando una gama más amplia de flujos de trabajo con **cero esfuerzo adicional por parte de los usuarios**.

**Cómo EvoX 1.1 les facilita la vida**

l  **No más complicaciones con el trazado** -- Todo sucede detrás de escena, haciendo su código más limpio y fácil de mantener.

l  **Funciona con su código Python existente** -- No necesitan modificar su flujo de trabajo para compatibilidad.

l  **Ejecución más rápida, mejor escalabilidad** -- Benefíciense de las últimas optimizaciones de PyTorch para GPUs y TPUs.

l  **Preparado para el futuro** -- Manténganse alineados con la evolución a largo plazo de PyTorch, asegurando ganancias continuas de rendimiento.

**¡Actualicen a EvoX 1.1 ahora!**

¡EvoX 1.1 ya está oficialmente disponible! Actualicen hoy para experimentar un flujo de trabajo computacional **más inteligente, más rápido y más intuitivo**.

**Obtener EvoX 1.1**: [GitHub](https://github.com/EMI-Group/EvoX)

¿Tienen preguntas o comentarios? Abran un issue en GitHub o únanse a nuestra discusión comunitaria. ¡Empujemos juntos los límites de la **inteligencia computacional**!

**Código fuente / Comunidad / Documentación**

Paper: [https://arxiv.org/abs/2301.12457](https://arxiv.org/abs/2301.12457 "https://arxiv.org/abs/2301.12457")

GitHub: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Documentación: [https://evox.readthedocs.io/en/latest/](https://evox.readthedocs.io/en/latest/ "https://evox.readthedocs.io/en/latest/")

Grupo QQ: 297969717

![4.png](/images/articles/evox-1-1-0-1.png)
