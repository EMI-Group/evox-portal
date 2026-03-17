---
title: "Trabajando con Module en EvoX"
order: 4
section: "developer"
---

# Trabajando con Module en EvoX

Un **module** es un concepto fundamental en programación que se refiere a una unidad de código autónoma diseñada para realizar una tarea específica o un conjunto de tareas relacionadas.

Este notebook presentará el módulo básico en EvoX: `ModuleBase`.

## Introducción a Module

En el [tutorial](../../tutorials), hemos mencionado el proceso de ejecución básico en EvoX:

<center><b>Iniciar un algoritmo y un problema -- Configurar un monitor -- Iniciar un workflow -- Ejecutar el workflow</b></center>

Este proceso requiere cuatro clases básicas en EvoX:

- `Algorithm`
- `Problem`
- `Monitor`
- `Workflow`


Es necesario proporcionar un módulo unificado para ellas. En EvoX, las cuatro clases heredan del módulo base: `ModuleBase`.

![Base de Module](/_static/modulebase.png)

## Clase ModuleBase

La clase `ModuleBase` hereda de [`torch.nn.Module`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#).

Existen muchos métodos en esta clase, y aquí se presentan algunos de los más importantes:

| Método            | Firma                                                        | Uso                                                        |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `__init__`        | `(self, ...)`                                                | Inicializa el módulo.                                       |
| `load_state_dict` | `(self, state_dict: Mapping[str, torch.Tensor], copy: bool = False, ...)` | Copia los parámetros y buffers de `state_dict` en este módulo y sus descendientes. Sobrescribe [`torch.nn.Module.load_state_dict`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#torch.nn.Module.load_state_dict). |
| `add_mutable`     | `(self, name: str, value: Union[torch.Tensor \| nn.Module, Sequence[torch.Tensor \| nn.Module], Dict[str, torch.Tensor \| nn.Module]]) -> None` | Define un valor mutable en este módulo al que se puede acceder a través de `self.[name]` y modificar in-place. |

## Papel de Module

En EvoX, `ModuleBase` puede ayudar a:

- **Contener valores mutables**

​	Este módulo es de tipo orientado a objetos y puede contener valores mutables.

- **Soportar programación funcional**

​	El modelo de programación funcional es compatible a través de `self.state_dict()` y `self.load_state_dict(...)`.

- **Estandarizar la inicialización**:

​	Básicamente, los sub-módulos predefinidos que se AÑADIRÁN a este módulo y a los que se accederá más tarde en los métodos miembro deben tratarse como "miembros no estáticos", mientras que cualquier otro miembro debe tratarse como "miembro estático".

​	Se recomienda que la inicialización del módulo para los miembros no estáticos se escriba en el método sobrescrito `setup` (o cualquier otro método miembro) en lugar de en `__init__`.

## Uso de Module

Específicamente, existen algunas reglas para usar `ModuleBase` en EvoX:

### Métodos estáticos

Los métodos estáticos que vayan a ser procesados por JIT deben definirse de la siguiente manera:

```python
# One example of the static method defined in a Module

@jit
def func(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    return x + y
```
### Métodos no estáticos

Si se va a utilizar un método con flujos de control dinámicos de Python como `if` con `vmap`, por favor use [`torch.cond`](https://pytorch.org/docs/main/generated/torch.cond.html#torch.cond) para definir explícitamente el flujo de control.