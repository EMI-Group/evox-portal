---
title: "Lanzamiento de EvoX 1.1: Ahora con torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 introduce la integración completa de torch.compile (TorchDynamo), sustituyendo a TorchScript para una mejor compatibilidad y rendimiento."
---

¡Nos complace anunciar el lanzamiento de **EvoX 1.1**, que introduce la **integración completa de torch.compile (TorchDynamo)** como compilador de backend! Esta actualización sustituye el enfoque anterior basado en TorchScript, haciendo que EvoX sea **más fácil de usar y altamente compatible con el ecosistema de Python en general**.

Al aprovechar **torch.compile**, EvoX ahora captura los grafos de computación de forma dinámica en tiempo de ejecución, eliminando la necesidad de realizar un rastreo manual (`tracing`) mientras optimiza el rendimiento automáticamente.

**¿Qué hay de nuevo?**

**torch.compile: Compilación más inteligente y flexible**

En EvoX 1.1, adoptamos plenamente **torch.compile** como el nuevo backend de compilación. A diferencia del enfoque anterior basado en `tracing`, torch.compile —que **utiliza internamente TorchDynamo**— intercepta la ejecución de Python, extrae dinámicamente los grafos de computación y los optimiza en tiempo real.

Esto significa:

l  **Se acabó el tracing manual** — Simplemente llama a **torch.compile(workflow.step)** y EvoX se encarga del resto.

l  **Compatibilidad total con Python** — Funciona con funciones nativas de Python y librerías externas como NumPy y SciPy.

l  **Mejor rendimiento** — Los grafos de computación optimizados dan como resultado una **ejecución más rápida y una mejor utilización del hardware**.

l  **Diseño preparado para el futuro** — Se alinea con la hoja de ruta de PyTorch, garantizando la compatibilidad a largo plazo y mejoras de rendimiento.

**¿Por qué pasar de TorchScript a torch.compile?**

En versiones anteriores, EvoX dependía de **métodos basados en tracing**:

l  **Anterior a 1.0.0** utilizaba **JAX tracing** para la extracción de grafos de computación.

l  **v1.0.0** cambió a **TorchScript**, mejorando la integración con PyTorch.

Sin embargo, estos métodos presentaban varios inconvenientes:

l  **Complejos de usar** — Los usuarios tenían que rastrear manualmente los grafos y lidiar con depuraciones complicadas.

l  **Compatibilidad limitada** — Dificultades con flujos de trabajo dinámicos y funciones ajenas a PyTorch.

l  **Flexibilidad restringida** — Los bucles, condicionales y otras construcciones de Python no siempre se capturaban correctamente.

Con torch.compile y **TorchDynamo**, **estos problemas han desaparecido**. EvoX ahora optimiza de forma dinámica, admitiendo una gama más amplia de flujos de trabajo con **cero esfuerzo adicional por parte de los usuarios**.

**Cómo EvoX 1.1 te facilita la vida**

l  **Sin complicaciones con el tracing** — Todo sucede entre bastidores, lo que hace que tu código sea más limpio y fácil de mantener.

l  **Funciona con tu código Python actual** — No es necesario modificar tu flujo de trabajo para lograr compatibilidad.

l  **Ejecución más rápida, mejor escalabilidad** — Benefíciate de las últimas optimizaciones de PyTorch para GPUs y TPUs.

l  **Preparado para el futuro** — Mantente alineado con la evolución a largo plazo de PyTorch, asegurando ganancias de rendimiento continuas.

**¡Actualiza a EvoX 1.1 ahora!**

¡EvoX 1.1 ya está disponible oficialmente! Actualiza hoy mismo para experimentar un flujo de trabajo computacional **más inteligente, rápido e intuitivo**.

**Obtén EvoX 1.1**: [GitHub](https://github.com/EMI-Group/EvoX)

¿Tienes preguntas o comentarios? Abre una incidencia (`issue`) en GitHub o únete a nuestra discusión comunitaria. ¡Superemos juntos los límites de la **inteligencia computacional!**

**Código fuente / Comunidad / Documentación**

Paper: [https://arxiv.org/abs/2301.12457](https://arxiv.org/abs/2301.12457 "https://arxiv.org/abs/2301.12457")

GitHub: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Documentación: [https://evox.readthedocs.io/en/latest/](https://evox.readthedocs.io/en/latest/ "https://evox.readthedocs.io/en/latest/")

Grupo de QQ: 297969717

![4.png](/images/articles/evox-1-1-0-1.png)