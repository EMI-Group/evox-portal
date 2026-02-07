---
title: "Trabajando con Modulos en EvoX"
order: 4
section: "developer"
---

# Trabajando con Modulos en EvoX

Un **modulo** es un concepto fundamental en programacion que se refiere a una unidad de codigo autocontenida disenada para realizar una tarea especifica o un conjunto de tareas relacionadas.

Este cuaderno presentara el modulo basico en EvoX: `ModuleBase`.

## Introduccion a los Modulos

En el [tutorial](#/tutorial/index), hemos mencionado el proceso basico de ejecucion en EvoX:

<center><b>Iniciar un algoritmo y un problema -- Establecer un monitor -- Iniciar un flujo de trabajo -- Ejecutar el flujo de trabajo</b></center>

Este proceso requiere cuatro clases basicas en EvoX:

- `Algorithm`
- `Problem`
- `Monitor`
- `Workflow`


Es necesario proporcionar un modulo unificado para ellos. En EvoX, las cuatro clases heredan del modulo base -- `ModuleBase`.

![Module base](/_static/modulebase.png)

## Clase ModuleBase

La clase `ModuleBase` hereda de [`torch.nn.Module`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#).

Hay muchos metodos en esta clase, y algunos metodos importantes son:

| Metodo            | Firma                                                    | Uso                                                        |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `__init__`        | `(self, ...)`                                                | Inicializar el modulo.                                       |
| `load_state_dict` | `(self, state_dict: Mapping[str, torch.Tensor], copy: bool = False, ...)` | Copiar parametros y buffers desde `state_dict` a este modulo y sus descendientes. Sobreescribe [`torch.nn.Module.load_state_dict`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#torch.nn.Module.load_state_dict). |
| `add_mutable`     | `(self, name: str, value: Union[torch.Tensor \| nn.Module, Sequence[torch.Tensor \| nn.Module], Dict[str, torch.Tensor \| nn.Module]]) -> None` | Definir un valor mutable en este modulo que puede ser accedido via `self.[name]` y modificado in situ. |

## Rol del Modulo

En EvoX, el `ModuleBase` puede ayudar a:

- **Contener valores mutables**

	Este modulo es uno orientado a objetos que puede contener valores mutables.

- **Soportar programacion funcional**

	El modelo de programacion funcional es soportado via `self.state_dict()` y `self.load_state_dict(...)`.

- **Estandarizar la inicializacion**:

	Basicamente, los submodulo(s) predefinidos que seran AGREGADOS a este modulo y accedidos posteriormente en metodo(s) miembro deben tratarse como "miembros no estaticos", mientras que cualquier otro miembro(s) debe tratarse como "miembros estaticos".

	La inicializacion del modulo para miembros no estaticos se recomienda escribirla en el metodo sobreescrito de `setup` (o cualquier otro metodo miembro) en lugar de `__init__`.

## Uso del Modulo

Especificamente, hay algunas reglas para usar `ModuleBase` en EvoX:

### Metodos estaticos

Los metodos estaticos para JIT deben definirse como:

```Python
# One example of the static method defined in a Module

@jit
def func(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    return x + y
```
### Metodos no estaticos

Si un metodo con flujos de control dinamicos de Python como `if` fuera a usarse con `vmap`,
por favor use [`torch.cond`](https://pytorch.org/docs/main/generated/torch.cond.html#torch.cond) para definir explicitamente el flujo de control.
