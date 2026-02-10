---
title: "Lavorare con i Moduli in EvoX"
order: 4
section: "developer"
---

# Lavorare con i Moduli in EvoX

Un **modulo** è un concetto fondamentale nella programmazione che si riferisce a un'unità di codice autonoma progettata per eseguire un compito specifico o un insieme di compiti correlati.

Questo notebook introdurrà il modulo base in EvoX: `ModuleBase`.

## Introduzione ai Moduli

Nel [tutorial](#/tutorial/index), abbiamo menzionato il processo di esecuzione di base in EvoX:

<center><b>Inizializza un algoritmo e un problema -- Imposta un monitor -- Inizializza un workflow -- Esegui il workflow</b></center>

Questo processo richiede quattro classi base in EvoX:

- `Algorithm`
- `Problem`
- `Monitor`
- `Workflow`


È necessario fornire un modulo unificato per esse. In EvoX, le quattro classi ereditano tutte dal modulo base -- `ModuleBase`.

![Module base](/_static/modulebase.png)

## Classe ModuleBase

La classe `ModuleBase` eredita da [`torch.nn.Module`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#).

Ci sono molti metodi in questa classe, e alcuni metodi importanti sono qui:

| Metodo            | Firma                                                    | Utilizzo                                                        |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `__init__`        | `(self, ...)`                                                | Inizializza il modulo.                                       |
| `load_state_dict` | `(self, state_dict: Mapping[str, torch.Tensor], copy: bool = False, ...)` | Copia parametri e buffer da `state_dict` in questo modulo e nei suoi discendenti. Sovrascrive [`torch.nn.Module.load_state_dict`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#torch.nn.Module.load_state_dict). |
| `add_mutable`     | `(self, name: str, value: Union[torch.Tensor \| nn.Module, Sequence[torch.Tensor \| nn.Module], Dict[str, torch.Tensor \| nn.Module]]) -> None` | Definisce un valore mutabile in questo modulo che può essere accessibile tramite `self.[name]` e modificato in-place. |

## Ruolo del Modulo

In EvoX, `ModuleBase` può aiutare a:

- **Contenere valori mutabili**

	Questo modulo è orientato agli oggetti e può contenere valori mutabili.

- **Supportare la programmazione funzionale**

	Il modello di programmazione funzionale è supportato tramite `self.state_dict()` e `self.load_state_dict(...)`.

- **Standardizzare l'inizializzazione**:

	Fondamentalmente, i sottomoduli predefiniti che verranno AGGIUNTI a questo modulo e accessibili successivamente nei metodi membro dovrebbero essere trattati come "membri non statici", mentre qualsiasi altro membro dovrebbe essere trattato come "membro statico".

	L'inizializzazione del modulo per i membri non statici è consigliata nel metodo sovrascritto di `setup` (o qualsiasi altro metodo membro) piuttosto che in `__init__`.

## Utilizzo del Modulo

Nello specifico, ci sono alcune regole per l'uso di `ModuleBase` in EvoX:

### Metodi Statici

I metodi statici da compilare JIT devono essere definiti come:

```python
# Un esempio di metodo statico definito in un Modulo

@jit
def func(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    return x + y
```
### Metodi Non Statici

Se un metodo con flussi di controllo dinamici Python come `if` deve essere usato con `vmap`,
usa [`torch.cond`](https://pytorch.org/docs/main/generated/torch.cond.html#torch.cond) per definire esplicitamente il flusso di controllo.
