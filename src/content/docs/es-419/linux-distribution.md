---
title: "Distribución de Linux y Driver de GPU"
order: 17
section: "misc"
---

# Distribución de Linux y Driver de GPU

## Elegir una Distribución de Linux

Muchas personas asumen que una distribución de Linux "antigua y estable" es la mejor opción para un servidor. Sin embargo, esto no siempre es cierto, especialmente para servidores con GPU.

La estabilidad de un servidor con GPU a menudo depende de la versión del kernel y del driver de GPU. Debido a que el hardware de GPU evoluciona rápidamente, los kernels y drivers más nuevos tienden a ser más refinados, estables y compatibles con las GPU recientes. Por lo general, incluyen más correcciones de errores y un mejor soporte para el hardware más reciente. Además, la compilación jit y las optimizaciones en los kernels y drivers más recientes son significativamente mejores que en las versiones anteriores.

Por ejemplo, aunque Ubuntu 20.04 se considera una versión "estable", ahora está bastante desactualizada para cargas de trabajo de GPU. Incluso la NVIDIA RTX 3090, que no es una GPU particularmente nueva, se lanzó en 2020. Esto significa que los drivers predeterminados proporcionados por Ubuntu 20.04 podrían no ser totalmente compatibles con la 3090, lo que podría generar problemas de compatibilidad.

En la mayoría de los casos, elegir una distribución de Linux más reciente (como Ubuntu 25.04 ofrece mejor soporte que la 22.04).

Otro factor importante a considerar es qué tan bien una distribución de Linux soporta el software que no es de código abierto (propietario). Algunas distribuciones, como Fedora, priorizan el software de código abierto y es posible que no incluyan drivers propietarios de forma predeterminada; por ejemplo, los drivers de NVIDIA. Esto puede requerir pasos adicionales para instalar y configurar los drivers de GPU. Otras distribuciones, como Arch Linux, Debian, Ubuntu y NixOS, tienden a ser más flexibles y facilitan la instalación de drivers propietarios cuando es necesario.

## Instalación del Driver de GPU

Generalmente se recomienda instalar el driver de GPU proporcionado por su distribución de Linux. Estos drivers suelen estar bien probados e integrados con el kernel.

> **Advertencia:**
> A menos que tenga mucha experiencia con los drivers de GPU y el kernel de Linux, debe evitar instalar drivers directamente desde el sitio web de NVIDIA, ya que pueden causar problemas de compatibilidad o requerir configuración adicional.