---
title: "TensorNEAT: apprendere parametri con topologie diverse"
pubDate: 2026-03-03
updatedDate: 2026-11-17
summary: "I gradienti paralleli sulla popolazione affinano parametri continui conservando la struttura discreta di ogni candidato."
---

Una popolazione può contenere connessioni diverse senza richiedere un ciclo di addestramento per ogni struttura. La [PR #37][s1] di TensorNEAT, integrata in main il 3 marzo 2026, aggiunge gradienti ai genomi tensorizzati e un percorso vettorizzato con JAX per affinare la popolazione.

![Reti diverse mantengono le connessioni mentre vengono regolati i pesi](./topology-gradients.webp)

*Illustrazione concettuale: regolare parametri continui conservando la topologia di ogni rete.*

## Strutture diverse, una stessa operazione di gradiente

TensorNEAT rappresenta le reti NEAT con tensori di nodi e connessioni. `genome.grad` restituisce perdita scalare e gradienti dei due array. I campi strutturali, come indici e tipi di funzione, e il padding NaN ricevono gradienti nulli. I parametri numerici cambiano, la struttura codificata rimane.

La vettorizzazione JAX applica il calcolo anche a topologie diverse. L'[esempio XOR][s3] inizializza la popolazione, crea diversità con mutazioni e poi ottimizza tramite discesa del gradiente. È una base concreta per studiare insieme topologia e parametri, senza attribuire al gradiente modifiche delle connessioni discrete.

## Rendere differenziabile il percorso diretto

L’implementazione calcola una perdita scalare tramite trasformazione e passaggio diretto del genoma, quindi usa `jax.value_and_grad` per derivare gli array di nodi e connessioni. Un vettore di input usa un passaggio singolo; un batch viene valutato in modo vettorizzato. Cambiare l’obiettivo resta una scelta esplicita del chiamante, non una proprietà implicita della rappresentazione. [Implementazione dei gradienti][implementation]

Servono anche modifiche sotto l’API. Il genoma predefinito percorre un `jax.lax.fori_loop` limitato; connessioni e aggregazioni passano maschere di validità per evitare che NaN inutilizzati contaminino i calcoli. Il padding è rappresentazione, non una connessione addestrabile. Mutazione strutturale e affinamento numerico restano quindi distinti, anche quando condividono gli array.

## L’esempio XOR separa diversità e apprendimento

L’esempio integrato inizializza 1.000 reti per XOR a tre ingressi e applica 20 cicli di mutazione con chiavi casuali differenti. Solo dopo usa la discesa del gradiente, con tasso 0,5 e massimo 500 passi. Questa fase impiega `jax.jit(jax.vmap(...))` sugli individui senza selezione evolutiva. È una dimostrazione del progetto per affinare strutture diverse, non la prova che il gradiente sostituisca la ricerca topologica. [Esempio completo][s3]

Legga il numero di individui validi insieme alla perdita migliore e media. Un candidato disconnesso può produrre valori non finiti; l’esempio filtra le perdite finite nei rapporti, mentre i test conservano l’output NaN delle reti disconnesse. Una perdita minima in discesa non indica quanta popolazione sia utilizzabile. Dopo l’ottimizzazione controlli anche le predizioni della rete scelta.

## Controllare le derivate prima di ampliare l’esperimento

I test aggiunti coprono gradienti finiti di genomi connessi predefiniti e ricorrenti, differenziazione compilata, batch di popolazione, riduzione della perdita e differenze finite. Per un compito personalizzato parta dall’esempio XOR versionato, poi cambi la perdita mantenendo espliciti input e limiti topologici. Controlli gradienti e campi strutturali prima di alternare apprendimento e mutazione. Il successivo [aggiornamento della memoria][memory] cambia il batch di lavoro, un controllo distinto dall’apprendimento dei parametri.

[s1]: https://github.com/EMI-Group/tensorneat/pull/37
[s3]: https://github.com/EMI-Group/tensorneat/blob/bec15bb5bd497dfd1b7ea765fa0b9f9a095a4709/examples/func_fit/xor_grad.py
[implementation]: https://github.com/EMI-Group/tensorneat/blob/bec15bb5bd497dfd1b7ea765fa0b9f9a095a4709/src/tensorneat/genome/base.py
[memory]: /it/news/tensorneat-gradient-memory
