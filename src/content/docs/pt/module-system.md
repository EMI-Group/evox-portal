---
title: "Trabalhar com Módulos no EvoX"
order: 4
section: "developer"
---

# Trabalhar com Módulos no EvoX

Um **módulo** é um conceito fundamental em programação que se refere a uma unidade de código autocontida concebida para realizar uma tarefa específica ou um conjunto de tarefas relacionadas.

Este notebook apresentará o módulo básico no EvoX: `ModuleBase`.

## Introdução ao Módulo

No [tutorial](#/tutorial/index), mencionámos o processo básico de execução no EvoX:

<center><b>Iniciar um algoritmo e um problema -- Definir um monitor -- Iniciar um workflow -- Executar o workflow</b></center>

Este processo requer quatro classes básicas no EvoX:

- `Algorithm`
- `Problem`
- `Monitor`
- `Workflow`


É necessário fornecer um módulo unificado para elas. No EvoX, as quatro classes são todas herdadas do módulo base — `ModuleBase`.

![Module base](/_static/modulebase.png)

## Classe ModuleBase

A classe `ModuleBase` é herdada de [`torch.nn.Module`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#).

Existem muitos métodos nesta classe, e alguns métodos importantes são:

| Método            | Assinatura                                                    | Utilização                                                        |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `__init__`        | `(self, ...)`                                                | Inicializar o módulo.                                       |
| `load_state_dict` | `(self, state_dict: Mapping[str, torch.Tensor], copy: bool = False, ...)` | Copiar parâmetros e buffers de `state_dict` para este módulo e os seus descendentes. Substitui [`torch.nn.Module.load_state_dict`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#torch.nn.Module.load_state_dict). |
| `add_mutable`     | `(self, name: str, value: Union[torch.Tensor \| nn.Module, Sequence[torch.Tensor \| nn.Module], Dict[str, torch.Tensor \| nn.Module]]) -> None` | Definir um valor mutável neste módulo que pode ser acedido via `self.[name]` e modificado in-place. |

## Papel do Módulo

No EvoX, o `ModuleBase` pode ajudar a:

- **Conter valores mutáveis**

	Este módulo é orientado a objetos e pode conter valores mutáveis.

- **Suportar programação funcional**

	O modelo de programação funcional é suportado via `self.state_dict()` e `self.load_state_dict(...)`.

- **Padronizar a inicialização**:

	Basicamente, submódulo(s) predefinido(s) que serão ADICIONADOS a este módulo e acedidos posteriormente em método(s) membro devem ser tratados como "membros não-estáticos", enquanto qualquer outro(s) membro(s) deve(m) ser tratado(s) como "membros estáticos".

	A inicialização do módulo para membros não-estáticos é recomendada ser escrita no método substituído de `setup` (ou qualquer outro método membro) em vez de `__init__`.

## Utilização do Módulo

Especificamente, existem algumas regras para utilizar `ModuleBase` no EvoX:

### Métodos estáticos

Métodos estáticos para JIT devem ser definidos como:

```Python
# One example of the static method defined in a Module

@jit
def func(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    return x + y
```
### Métodos Não-Estáticos

Se um método com fluxos de controlo dinâmicos Python como `if` for utilizado com `vmap`,
por favor utilize [`torch.cond`](https://pytorch.org/docs/main/generated/torch.cond.html#torch.cond) para definir explicitamente o fluxo de controlo.
