---
title: "EvoRL: mantenere coerenti gradienti, dispositivi e metriche"
pubDate: 2026-11-08
summary: "Gli aggiornamenti dell'8 novembre affrontano differenziazione JAX e Playground, dopo le correzioni di collocazione e metriche di popolazione."
---

Un addestramento può fallire prima di apprendere o terminare con log che nascondono cosa sia stato misurato. Gli aggiornamenti main di EvoRL dell'8 novembre 2026 affrontano JAX e compatibilità degli ambienti, proseguendo le correzioni di ottobre su dispositivi e metriche. Il [tag sorgente v0.2.0][s1] conserva questo stato di sviluppo per un esame riproducibile.

![Un robot simulato allineato con telai di calibrazione e griglia del suolo](./cover.webp)

*Illustrazione concettuale: un addestramento coerente richiede più contratti di esecuzione allineati.*

## Un percorso di gradiente sensibile alla versione

La [modifica di compatibilità][s2] estende la soluzione locale a JAX 0.12.0.1. In JAX 0.12.0 e 0.12.0.1, le derivate di `erf` e `erfc` dentro `shard_map` possono fallire i controlli VMA. Il percorso Tanh Normal interessato usa un calcolo alternativo della log CDF normale, inclusa un'espansione delle code.

Nel controllo continuo, la distribuzione della policy deve fornire probabilità differenziabili per aggiornare i parametri. L'ambiente può inizializzarsi correttamente e fallire al gradiente successivo. La correzione è limitata alle versioni interessate; le altre conservano il percorso originale. Il README del tag indica JAX 0.11.0 con CUDA 13 come combinazione testata per questo stato.

## Rendere esplicite le ipotesi su ambiente e dispositivo

Lo stesso commit impone `playground>=0.2.0,<1` per mantenere l'interfaccia JAX/MJX dell'adattatore. Un aggiornamento che la modifica cambia le basi anche se la configurazione di addestramento rimane uguale.

Il lavoro di ottobre ricostruisce inoltre i valori predefiniti degli array catturati con una copia esplicita, rispettando la mesh attiva nell'esecuzione eager JAX. ARS usa il valutatore ordinario quando la normalizzazione delle osservazioni è disattivata, evitando statistiche assenti in quella modalità. Collocazione e normalizzazione diventano contratti verificabili, non supposizioni nell'inizializzazione. [Correzione dispositivi e ARS][s3]

## Una popolazione non è una singola policy

La [correzione delle metriche del 28 ottobre][s4] distingue collezioni e risultati individuali. `pop_episode_returns` e `pop_episode_lengths` mantengono l'asse della popolazione; policy singole e centrali usano opportunamente nomi singolari. Il singolo learner di ERL-EDA riceve metriche scalari, mentre le collezioni mantengono array.

Mediare nuovamente un dato già aggregato o trattare un vettore come uno scalare può produrre grafici plausibili ma fuorvianti nel confronto con una policy unica. Prima di riusare gli script, verifichi nomi e forme al confine dei log. La migrazione deve conservare le riduzioni volute su popolazioni, episodi e learner.

## Riprodurre un piccolo caso prima di riprendere

Il tag richiede Python 3.12 o successivo e JAX/jaxlib 0.10.0 o successivo. La distribuzione è `evorl-jax`, l'import resta `evorl`. Per script e configurazioni, usi il tag e le relative istruzioni. L'esempio base è `python scripts/train.py agent=ppo env=brax/ant`.

Prima delle curve di apprendimento, controlli gradienti, collocazione e forme delle metriche in un breve esperimento. Aim è incluso nel logging predefinito; i recorder opzionali richiedono i rispettivi SDK. Conservi ambiente, seme e budget. L'[introduzione EvoRL][related] illustra apprendimento ed evoluzione; queste modifiche rendono verificabili le ipotesi dei singoli esperimenti.

[s1]: https://github.com/EMI-Group/evorl/blob/v0.2.0/README.md
[s2]: https://github.com/EMI-Group/evorl/commit/5c889cad465ca88e3ec0d9112b0ec55835eb68fc
[s3]: https://github.com/EMI-Group/evorl/commit/a1ca25e9b232fdb6a6160c12cfc8bd702477096b
[s4]: https://github.com/EMI-Group/evorl/commit/992a554eb164a87ef9249592711cebd319ad9ebc
[related]: /it/news/evorl
