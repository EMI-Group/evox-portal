---
title: "TensorNEAT: mantenere la popolazione, limitare la memoria di lavoro"
pubDate: 2026-04-04
updatedDate: 2026-11-17
summary: "Batch di popolazione e intermedi di ricerca più piccoli riducono l’insieme di lavoro simultaneo di NEAT senza restringere la popolazione."
---

Anche quando i genomi entrano nella memoria GPU, trasformazione e valutazione possono esaurirla con array temporanei. L’[aggiornamento del 4 aprile 2026][s2] di TensorNEAT sposta la trasformazione dentro batch sequenziali e riduce gli intermedi di ricerca. Conserva i candidati e rende controllabile l’insieme di lavoro.

![Reti neurali diverse attraversano a gruppi una piccola apertura](./cover.webp)

*Illustrazione concettuale: preservare la popolazione limitando il lotto di lavoro attivo.*

## Suddividere il lavoro, non lo spazio di ricerca

L'aggiornamento aggiunge `pop_batch_size` a NEAT e Pipeline. Il valore Pipeline prevale su quello dell'algoritmo e deve dividere la popolazione. Il precedente argomento `eval_batch_size` viene sostituito, quindi le configurazioni esistenti vanno aggiornate.

Sul singolo dispositivo, la trasformazione entra nel ciclo `jax.lax.scan`. Il pipeline trasforma e valuta un lotto alla volta invece di materializzare subito gli intermedi di adiacenza densa dell'intera popolazione. Anche la mutazione segue questo controllo. La popolazione resta uguale; cambia il lavoro simultaneo. È utile quando serve diversità ma la memoria GPU è al limite.

Il punto decisivo è dove inizia il batch. Dividere la valutazione dopo la trasformazione completa lascia già allocato il grande array di adiacenza. Portare entrambe le operazioni nel corpo di scan ne cambia la durata. Il commit descrive il passaggio da popolazione × nodi × nodi a batch × nodi × nodi. È un confronto implementativo, non una formula della memoria totale: genomi, stato persistente e altri buffer restano occupati. [Modifica della trasformazione][s2]

Il batching è una scelta di esecuzione. Non seleziona meno superstiti né cambia la popolazione richiesta. Ridurre la popolazione cambia invece i candidati partecipanti e può modificare la ricerca. Distingua queste impostazioni nella diagnosi della memoria insufficiente. Un primo confronto utile mantiene la popolazione e varia solo un divisore valido per il batch.

## Ricerche senza grandi intermedi di confronto

Il crossover sostituisce confronti annidati con hash e ricerca ordinata; anche le chiavi di connessione vengono associate agli indici dei nodi tramite ordinamento e ricerca. Si riducono array temporanei che crescono insieme a popolazione e capacità delle reti.

Il commit riporta traiettorie identiche per 15 generazioni a seme fisso con DefaultGene e OriginGene. È un risultato di regressione specifico, non una promessa per ogni dipendenza e dispositivo. Gli script di correttezza e memoria permettono di esaminare implementazione e affermazioni insieme.

## Scegliere il lotto con un esperimento riproducibile

Parta da un piccolo fitting di funzione, fissando limiti di nodi e connessioni. Registri la sequenza senza lotti, poi scelga una dimensione che divida la popolazione. Verifichi prima la correttezza, poi misuri picco di memoria, compilazione e tempo per passo separatamente. Un lotto più piccolo riduce memoria ma cambia anche il parallelismo.

Usi lo [snapshot di aprile][s4] per fissare la semantica della configurazione, incluso l’argomento batch rinominato. TensorNEAT è basato su JAX e l’integrazione EvoX documentata riguarda il ramo dell’epoca JAX. Registri le versioni delle dipendenze. L’articolo separato sui [gradienti di popolazione][gradient] descrive l’apprendimento dei parametri. Prima verifichi che cambiare batch preservi i risultati dell’esecuzione scelta, poi valuti il compromesso memoria-tempo.

[s2]: https://github.com/EMI-Group/tensorneat/commit/ce27fa9f794928c9416d9f12c398f58481c821ce
[s4]: https://github.com/EMI-Group/tensorneat/tree/ce27fa9f794928c9416d9f12c398f58481c821ce
[gradient]: /it/news/tensorneat-population-gradients
