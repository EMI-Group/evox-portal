---
title: "Trabalhando com Module no EvoX"
order: 4
section: "developer"
---

# Trabalhando com Module no EvoX

Um **module** é um conceito fundamental na programação que se refere a uma unidade de código independente, projetada para realizar uma tarefa específica ou um conjunto de tarefas relacionadas.

Este notebook apresentará o módulo básico no EvoX: `ModuleBase`.

## Introdução ao Module

No [tutorial](../../tutorials), mencionamos o processo básico de execução no EvoX:

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

Existem muitos métodos nesta classe, e alguns métodos importantes estão aqui:

| Método            | Assinatura                                                    | Uso                                                        |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `__init__`        | `(self, ...)`                                                | Inicializa o módulo.                                       |
| `load_state_dict` | `(self, state_dict: Mapping[str, torch.Tensor], copy: bool = False, ...)` | Copia parâmetros e buffers de `state_dict` para este módulo e seus descendentes. Ele sobrescreve [`torch.nn.Module.load_state_dict`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#torch.nn.Module.load_state_dict). |
| `add_mutable`     | `(self, name: str, value: Union[torch.Tensor \| nn.Module, Sequence[torch.Tensor \| nn.Module], Dict[str, torch.Tensor \| nn.Module]]) -> None` | Define um valor mutável neste módulo que pode ser acessado via `self.[name]` e modificado in-place. |

## Papel do Module

No EvoX, o `ModuleBase` pode ajudar a:

- **Conter valores mutáveis**

​	Este módulo é orientado a objetos e pode conter valores mutáveis.

- **Suportar programação funcional**

​	O modelo de programação funcional é suportado via `self.state_dict()` e `self.load_state_dict(...)`.

- **Padronizar a inicialização**:

​	Basicamente, submódulo(s) predefinido(s) que serão ADICIONADOS a este módulo e acessados posteriormente em método(s) de membro devem ser tratados como "membros não estáticos", enquanto quaisquer outros membros devem ser tratados como "membros estáticos".

​	A inicialização do módulo para membros não estáticos é recomendada para ser escrita no método sobrescrito de `setup` (ou qualquer outro método de membro) em vez de `__init__`.

## Uso do Module

Especificamente, existem algumas regras para usar o `ModuleBase` no EvoX:

### Métodos estáticos

Métodos estáticos para serem JIT devem ser definidos como:

```python
# One example of the static method defined in a Module

@jit
def func(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    return x + y
```
### Métodos não estáticos

Se um método com fluxos de controle dinâmicos do Python, como `if`, for usado com `vmap`, use [`torch.cond`](https://pytorch.org/docs/main/generated/torch.cond.html#torch.cond) para definir explicitamente o fluxo de controle.