---
title: "Arbeiten mit Modulen in EvoX"
order: 4
section: "developer"
---

# Arbeiten mit Modulen in EvoX

Ein **Modul** ist ein grundlegendes Konzept in der Programmierung, das sich auf eine eigenständige Code-Einheit bezieht, die dazu entworfen wurde, eine bestimmte Aufgabe oder eine Reihe zusammenhängender Aufgaben auszuführen.

Dieses Notebook stellt das Basismodul in EvoX vor: `ModuleBase`.

## Einführung in Module

Im [Tutorial](/de/tutorials) haben wir den grundlegenden Ablauf in EvoX erwähnt:

<center><b>Einen Algorithmus und ein Problem initialisieren -- Einen Monitor einrichten -- Einen Workflow initialisieren -- Den Workflow ausführen</b></center>

Dieser Prozess erfordert vier grundlegende Klassen in EvoX:

- `Algorithm`
- `Problem`
- `Monitor`
- `Workflow`


Es ist notwendig, ein einheitliches Modul für sie bereitzustellen. In EvoX erben alle vier Klassen vom Basismodul — `ModuleBase`.

![Modulbasis](/_static/modulebase.png)

## Die Klasse ModuleBase

Die Klasse `ModuleBase` erbt von [`torch.nn.Module`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#).

Es gibt viele Methoden in dieser Klasse; hier sind einige wichtige Methoden:

| Methode           | Signatur                                                     | Verwendung                                                   |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `__init__`        | `(self, ...)`                                                | Initialisiert das Modul.                                     |
| `load_state_dict` | `(self, state_dict: Mapping[str, torch.Tensor], copy: bool = False, ...)` | Kopiert Parameter und Puffer aus `state_dict` in dieses Modul und seine Nachkommen. Es überschreibt [`torch.nn.Module.load_state_dict`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#torch.nn.Module.load_state_dict). |
| `add_mutable`     | `(self, name: str, value: Union[torch.Tensor \| nn.Module, Sequence[torch.Tensor \| nn.Module], Dict[str, torch.Tensor \| nn.Module]]) -> None` | Definiert einen veränderlichen Wert in diesem Modul, auf den über `self.[name]` zugegriffen werden kann und der in-place modifiziert wird. |

## Rolle des Moduls

In EvoX hilft `ModuleBase` dabei:

- **Veränderliche Werte enthalten**

​	Dieses Modul ist objektorientiert und kann veränderliche Werte enthalten.

- **Funktionale Programmierung unterstützen**

​	Das funktionale Programmiermodell wird über `self.state_dict()` und `self.load_state_dict(...)` unterstützt.

- **Die Initialisierung standardisieren**:

​	Grundsätzlich sollten vordefinierte Submodule, die diesem Modul HINZUGEFÜGT werden und auf die später in Member-Methoden zugegriffen wird, als „nicht-statische Member“ behandelt werden, während alle anderen Member als „statische Member“ behandelt werden sollten.

​	Es wird empfohlen, die Modulinitialisierung für nicht-statische Member in der überschriebenen `setup`-Methode (oder einer anderen Member-Methode) anstatt in `__init__` vorzunehmen.

## Verwendung von Modulen

Konkret gibt es einige Regeln für die Verwendung von `ModuleBase` in EvoX:

### Statische Methoden

Statische Methoden, die JIT-kompiliert werden sollen, müssen wie folgt definiert werden:

```python
# One example of the static method defined in a Module

@jit
def func(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    return x + y
```
### Nicht-statische Methoden

Wenn eine Methode mit dynamischen Python-Kontrollflüssen wie `if` zusammen mit `vmap` verwendet werden soll,
verwenden Sie bitte [`torch.cond`](https://pytorch.org/docs/main/generated/torch.cond.html#torch.cond), um den Kontrollfluss explizit zu definieren.