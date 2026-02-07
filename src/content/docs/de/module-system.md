---
title: "Arbeiten mit Modulen in EvoX"
order: 4
section: "developer"
---

# Arbeiten mit Modulen in EvoX

Ein **Modul** ist ein grundlegendes Konzept in der Programmierung, das sich auf eine eigenständige Codeeinheit bezieht, die eine bestimmte Aufgabe oder eine Reihe verwandter Aufgaben ausführen soll.

Dieses Notebook stellt das grundlegende Modul in EvoX vor: `ModuleBase`.

## Einführung in Module

Im [Tutorial](#/tutorial/index) haben wir den grundlegenden Ausführungsprozess in EvoX erwähnt:

<center><b>Einen Algorithmus und ein Problem initiieren -- Einen Monitor einrichten -- Einen Workflow initiieren -- Den Workflow ausführen</b></center>

Dieser Prozess erfordert vier grundlegende Klassen in EvoX:

- `Algorithm`
- `Problem`
- `Monitor`
- `Workflow`


Es ist notwendig, ein einheitliches Modul für sie bereitzustellen. In EvoX erben alle vier Klassen vom Basismodul -- `ModuleBase`.

![Module base](/_static/modulebase.png)

## ModuleBase-Klasse

Die `ModuleBase`-Klasse erbt von [`torch.nn.Module`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#).

Es gibt viele Methoden in dieser Klasse, und einige wichtige Methoden sind hier aufgeführt:

| Methode            | Signatur                                                    | Verwendung                                                        |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `__init__`        | `(self, ...)`                                                | Initialisiert das Modul.                                       |
| `load_state_dict` | `(self, state_dict: Mapping[str, torch.Tensor], copy: bool = False, ...)` | Kopiert Parameter und Puffer aus `state_dict` in dieses Modul und seine Nachkommen. Es überschreibt [`torch.nn.Module.load_state_dict`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#torch.nn.Module.load_state_dict). |
| `add_mutable`     | `(self, name: str, value: Union[torch.Tensor \| nn.Module, Sequence[torch.Tensor \| nn.Module], Dict[str, torch.Tensor \| nn.Module]]) -> None` | Definiert einen veränderbaren Wert in diesem Modul, auf den über `self.[name]` zugegriffen und der in-place modifiziert werden kann. |

## Rolle des Moduls

In EvoX kann `ModuleBase` helfen bei:

- **Veränderbare Werte enthalten**

	Dieses Modul ist ein objektorientiertes Modul, das veränderbare Werte enthalten kann.

- **Funktionale Programmierung unterstützen**

	Das funktionale Programmiermodell wird über `self.state_dict()` und `self.load_state_dict(...)` unterstützt.

- **Initialisierung standardisieren**:

	Grundsätzlich sollten vordefinierte Submodule, die zu diesem Modul HINZUGEFÜGT und später in Mitgliedsmethoden aufgerufen werden, als "nicht-statische Mitglieder" behandelt werden, während alle anderen Mitglieder als "statische Mitglieder" behandelt werden sollten.

	Die Modulinitialisierung für nicht-statische Mitglieder wird empfohlen, in der überschriebenen Methode von `setup` (oder einer anderen Mitgliedsmethode) statt in `__init__` geschrieben zu werden.

## Verwendung des Moduls

Konkret gibt es einige Regeln für die Verwendung von `ModuleBase` in EvoX:

### Statische Methoden

Statische Methoden, die JIT-kompiliert werden sollen, werden wie folgt definiert:

```Python
# One example of the static method defined in a Module

@jit
def func(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    return x + y
```
### Nicht-statische Methoden

Wenn eine Methode mit dynamischen Python-Kontrollflüssen wie `if` mit `vmap` verwendet werden soll,
verwenden Sie bitte [`torch.cond`](https://pytorch.org/docs/main/generated/torch.cond.html#torch.cond), um den Kontrollfluss explizit zu definieren.
