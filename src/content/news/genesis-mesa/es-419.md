---
title: "Genesis y MESA: hacer evolucionar el software del cálculo científico"
pubDate: 2026-11-03
updatedDate: 2026-11-07
summary: "La reconstrucción en Rust de módulos MESA seleccionados conecta desarrollo agéntico, conservación y modernización del software científico."
---

*Actualizado el 7 de noviembre de 2026. Los resultados históricos conservan su fecha de referencia.*

El descubrimiento científico depende de software que conserva métodos numéricos y conocimiento acumulado. La reconstrucción de módulos MESA con Genesis conecta Agentic AI con esa base de AI for Science: mejorar la implementación usando el comportamiento numérico existente como referencia de lo que debe preservarse.

## Una tarea acotada

El [registro del 7 de septiembre de 2026](https://genesis.evox.group/evidence/mesa/) cubre **13 módulos**, de **139.414 líneas Fortran a 89.946 líneas Rust**. Son tamaños del snapshot, no del código de biblioteca exclusivamente.

El port incluye interpolación, solvers, redes de reacción, ecuación de estado y opacidad. No reemplaza todo MESA: los motores de evolución estelar y binaria y otros componentes documentados quedan fuera.

## Verificar antes de medir velocidad

Cada módulo corresponde a un crate con interfaces y restricciones documentadas. Las pruebas de referencia comparan salidas Fortran y las de integración comprueban las interacciones.

La equivalencia numérica necesita tolerancia y carga definidas. Un escalar coincidente puede ocultar una trayectoria de solución diferente; por eso se registran también pasos de integración del proxy de combustión de una zona. Esto aporta más que compilar correctamente.

## Validación comunicada

El repositorio informa de **1.052 pruebas superadas, cero fallos y 18 ignoradas**. Las exclusiones deben seguir visibles. Los **10,64 dólares estadounidenses** cubren tokens, no hardware; modelo, episodios y duración no se comunicaron.

Son resultados del proyecto, no una reproducción independiente. Cubren el port y las pruebas descritas, no todos los flujos científicos de MESA.

## Separar las mediciones

Evidence informa de **1,55–6,87× de aceleración mediana**. La tabla README del 5 de agosto usa medianas de 15 ejecuciones y da **1,25×** para el proxy de combustión de una zona de extremo a extremo. No deben fusionarse en una aceleración universal.

Compare cargas, datos, opciones de compilación y tolerancias iguales. Acelerar un núcleo de interpolación no implica el mismo factor en una simulación estelar completa.

## Un camino para modernizar el software científico

El [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/main/README.md) detalla herramientas, compilación, pruebas y benchmarks. Tras preparar el entorno:

```bash
cargo test --workspace
```

El [repositorio de reconstrucción de MESA](https://github.com/EMI-Group/genesis-demo-mesa-rs) muestra cómo el desarrollo agéntico puede continuar la historia del software científico. Para EvoX, la dirección consiste en adaptar esta infraestructura conservando un comportamiento científico comprobable. Ampliarla más allá de los módulos descritos requiere validación adicional del dominio.
