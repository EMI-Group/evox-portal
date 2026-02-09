---
title: "Trabalhar com Module no EvoX"
order: 4
section: "developer"
---

# Trabalhar com Module no EvoX

Um **module** é um conceito fundamental em programação que se refere a uma unidade de código autónoma, concebida para realizar uma tarefa específica ou um conjunto de tarefas relacionadas.

Este notebook irá introduzir o module básico no EvoX: `ModuleBase`.

## Introdução ao Module

No [tutorial](#/tutorial/index), mencionámos o processo de execução básico no EvoX:

<center><b>Iniciar um algoritmo e um problema -- Definir um monitor -- Iniciar um workflow -- Executar o workflow</b></center>

Este processo requer quatro classes básicas no EvoX:

- `Algorithm`
- `Problem`
- `Monitor`
- `Workflow`


É necessário fornecer um module unificado para estas classes. No EvoX, as quatro classes são todas herdadas do module base — `ModuleBase`.

![Module base](/_static/modulebase.png)

## Classe ModuleBase

A classe `ModuleBase` é herdada de [`torch.nn.Module`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#).

Existem muitos métodos nesta classe, e alguns métodos importantes estão aqui:

| Método            | Assinatura                                                    | Utilização                                                        |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `__init__`        | `(self, ...)`                                                | Inicializar o module.                                       |
| `load_state_dict` | `(self, state_dict: Mapping[str, torch.Tensor], copy: bool = False, ...)` | Copiar parâmetros e buffers de `state_dict` para este module e os seus descendentes. Substitui [`torch.nn.Module.load_state_dict`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#torch.nn.Module.load_state_dict). |
| `add_mutable`     | `(self, name: str, value: Union[torch.Tensor \| nn.Module, Sequence[torch.Tensor \| nn.Module], Dict[str, torch.Tensor \| nn.Module]]) -> None` | Definir um valor mutável neste module que pode ser acedido através de `self.[name]` e modificado in-place. |

## Papel do Module

No EvoX, o `ModuleBase` pode ajudar a:

- **Conter valores mutáveis**

​	Este module é orientado a objetos e pode conter valores mutáveis.

- **Suportar programação funcional**

​	O modelo de programação funcional é suportado através de `self.state_dict()` e `self.load_state_dict(...)`.

- **Padronizar a inicialização**:

​	Basicamente, submodules predefinidos que serão ADICIONADOS a este module e acedidos posteriormente em métodos de membro devem ser tratados como "membros não estáticos", enquanto quaisquer outros membros devem ser tratados como "membros estáticos".

​	Recomenda-se que a inicialização do module para membros não estáticos seja escrita no método sobreposto de `setup` (ou qualquer outro método de membro) em vez de `__init__`.

## Utilização do Module

Especificamente, existem algumas regras para utilizar o `ModuleBase` no EvoX:

### Métodos estáticos

Os métodos estáticos para serem JIT devem ser definidos da seguinte forma:

```Python
# One example of the static method defined in a Module

@jit
def func(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    return x + y
```
### Métodos não estáticos

Se um método com fluxos de controlo dinâmicos de Python, como `if`, for utilizado com `vmap`, utilize [`torch.cond`](https://pytorch.org/docs/main/generated/torch.cond.html#torch.cond) para definir explicitamente o fluxo de controlo.