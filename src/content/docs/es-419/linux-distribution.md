---
title: "Distribucion Linux y Controlador de GPU"
order: 17
section: "misc"
---

# Distribucion Linux y Controlador de GPU

## Elegir una Distribucion Linux

Muchas personas asumen que una distribucion Linux "vieja y estable" es la mejor opcion para un servidor. Sin embargo, esto no siempre es cierto, especialmente para servidores con GPU.

La estabilidad de un servidor con GPU frecuentemente depende de la version del kernel y del controlador de GPU. Debido a que el hardware de GPU evoluciona rapidamente, los kernels y controladores mas nuevos tienden a ser mas refinados, estables y compatibles con GPUs recientes. Generalmente incluyen mas correcciones de errores y mejor soporte para el hardware mas reciente. Adicionalmente, la compilacion JIT y las optimizaciones en los ultimos kernels y controladores son significativamente mejores que en versiones anteriores.

Por ejemplo, aunque Ubuntu 20.04 se considera una version "estable", ahora esta bastante desactualizada para cargas de trabajo con GPU. Incluso la NVIDIA RTX 3090, que no es una GPU particularmente nueva, fue lanzada en 2020. Esto significa que los controladores predeterminados proporcionados por Ubuntu 20.04 pueden no soportar completamente la 3090, lo que potencialmente lleva a problemas de compatibilidad.

En la mayoria de los casos, elegir una distribucion Linux mas nueva (como Ubuntu 25.04 ofrece mejor soporte que 22.04).

Otro factor importante a considerar es que tan bien una distribucion Linux soporta software no libre (propietario). Algunas distribuciones, como Fedora, priorizan el software de codigo abierto y pueden no incluir controladores propietarios por defecto, por ejemplo, controladores NVIDIA. Esto puede requerir pasos adicionales para instalar y configurar controladores de GPU. Otras distribuciones, como Arch Linux, Debian, Ubuntu y NixOS, tienden a ser mas flexibles y facilitan la instalacion de controladores propietarios cuando se necesitan.

## Instalacion del Controlador de GPU

Generalmente se recomienda instalar el controlador de GPU proporcionado por tu distribucion Linux. Estos controladores tipicamente estan bien probados e integrados con el kernel.

> **Advertencia:**
> A menos que tengas mucha experiencia con controladores de GPU y el kernel de Linux, deberias evitar instalar controladores directamente desde el sitio web de NVIDIA, ya que pueden llevar a problemas de compatibilidad o requerir configuracion adicional.
