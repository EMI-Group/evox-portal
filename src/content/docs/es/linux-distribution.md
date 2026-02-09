---
title: "Distribución de Linux y GPU driver"
order: 17
section: "misc"
---

# Distribución de Linux y GPU driver

## Elegir una distribución de Linux

Mucha gente asume que una distribución de Linux "antigua y estable" es la mejor opción para un servidor. Sin embargo, esto no siempre es cierto, especialmente para servidores GPU.

La estabilidad de un servidor GPU a menudo depende de la versión del kernel y del GPU driver. Debido a que el hardware de GPU evoluciona rápidamente, los kernels y drivers más nuevos tienden a estar más refinados, ser más estables y más compatibles con las GPU recientes. Normalmente incluyen más correcciones de errores y un mejor soporte para el hardware más reciente. Además, la compilación jit y las optimizaciones en los últimos kernels y drivers son significativamente mejores que en las versiones anteriores.

Por ejemplo, aunque Ubuntu 20.04 se considera una versión "estable", ahora está bastante desactualizada para cargas de trabajo de GPU. Incluso la NVIDIA RTX 3090, que no es una GPU especialmente nueva, se lanzó en 2020. Esto significa que los drivers por defecto proporcionados por Ubuntu 20.04 podrían no soportar completamente la 3090, lo que podría provocar problemas de compatibilidad.

En la mayoría de los casos, elegir una distribución de Linux más reciente (como Ubuntu 25.04, que ofrece mejor soporte que la 22.04) es la mejor opción.

Otro factor importante a considerar es qué tan bien soporta una distribución de Linux el software que no es de código abierto (propietario). Algunas distribuciones, como Fedora, priorizan el software de código abierto y pueden no incluir drivers propietarios por defecto; por ejemplo, los drivers de NVIDIA. Esto puede requerir pasos adicionales para instalar y configurar los GPU drivers. Otras distribuciones, como Arch Linux, Debian, Ubuntu y NixOS, tienden a ser más flexibles y facilitan la instalación de drivers propietarios cuando es necesario.

## Instalación del GPU driver

Generalmente se recomienda instalar el GPU driver proporcionado por su distribución de Linux. Estos drivers suelen estar bien probados e integrados con el kernel.

> **Advertencia:**
> A menos que tenga mucha experiencia con los GPU drivers y el kernel de Linux, debe evitar instalar drivers directamente desde el sitio web de NVIDIA, ya que pueden provocar problemas de compatibilidad o requerir una configuración adicional.