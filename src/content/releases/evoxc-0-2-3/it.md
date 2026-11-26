---
title: "EvoX Compiler v0.2.3: installare il backend adatto al carico di lavoro"
pubDate: 2026-11-26
summary: "La serie 0.2 introduce IREE 3.13, il rilevamento automatico dei plugin XLA e correzioni numeriche; v0.2.3 fornisce gli artefatti di distribuzione verificati."
---

EvoX Compiler v0.2.3 è stato pubblicato il 25 novembre 2026 UTC, con wheel Python e un archivio sorgente. La breve nota GitHub rimanda al confronto da v0.2.2 a v0.2.3; il changelog versionato documenta i cambiamenti sostanziali della serie 0.2 e le correzioni di packaging che portano a questa distribuzione. Per chi arriva da 0.1, le domande principali riguardano la coppia compilatore/runtime, il dispositivo fisico da scegliere e i controlli numerici da ripetere. [Pubblicazione][release] · [Changelog][changes]

![Un adattatore sagomato allineato alla presa corrispondente accanto a un pacco controllato](./cover.webp)

*Illustrazione concettuale: una distribuzione utilizzabile deve adattarsi al suo ambiente di esecuzione.*

## Mantenere allineati compilatore e runtime

L’extra IREE richiede ora compilatore e runtime dalla versione 3.13.0 a una versione inferiore alla 3.14. Gli artefatti compilati dipendono dalla versione: un file prodotto con una coppia diversa potrebbe non essere caricabile senza modifiche. Il progetto upstream ha riconvalidato llvm-cpu e ROCm/HIP su AMD Instinct MI300X con ROCm 7.1, inclusi cicli e scan che fallivano con precedenti versioni IREE. Questi controlli non si estendono automaticamente a CUDA, all’esecuzione multi-rank o a tutti i benchmark di modelli. [Requisiti versionati][requirements] · [Changelog][changes]

L’adattatore controlla anche la lettura dei risultati dal dispositivo all’host, senza affidarsi ciecamente alla scorciatoia del runtime. È importante quando il calcolo riesce ma il recupero dei risultati fallisce. La memoria host può mantenere un percorso mappato; i buffer del dispositivo richiedono un trasferimento esplicito. Il tempo di trasferimento va incluso nel carico applicativo, distinguendolo dal tempo del kernel.

## Individuare il plugin XLA, poi scegliere il dispositivo

La registrazione XLA non esegue più una ricerca del plugin priva di opzioni prima che il chiamante possa fornire un percorso. Il rilevamento considera l’opzione esplicita, la relativa variabile d’ambiente, le posizioni note e i pacchetti di plugin JAX installati, senza importare JAX stesso. La disponibilità viene verificata durante compilazione e caricamento, quando le opzioni sono note. Le funzioni di build inoltrano le opzioni risolte al caricamento, correggendo il caso in cui la compilazione trovava il plugin ma il caricamento ne perdeva la configurazione. [Guida ai backend][guide]

Un plugin ROCm deve servire un dispositivo ROCm, un plugin CUDA un dispositivo CUDA. Un plugin GPU con la selezione CPU predefinita viene rifiutato. Per un esperimento GPU occorre scegliere il dispositivo corrispondente e spostarvi esplicitamente i tensori. Prima di copiare i risultati sull’host va controllata la posizione delle uscite. Un errore di esecuzione XLA svuota inoltre gli slot dei puntatori di uscita in cache, evitando che chiamate successive riutilizzino puntatori a buffer obsoleti.

## Ricontrollare la semantica prima della velocità

L’interprete di riferimento NumPy usa piani di dispatch in cache, libera i valori intermedi non più necessari al loro ultimo utilizzo e condivide un’istanza immutabile del dispositivo host. Questo riduce preparazione e allocazioni senza cambiare lo stile pubblico delle chiamate. Le misure TensorNEAT del changelog riguardano carichi specifici, non un fattore universale di accelerazione.

L’operazione compilata di resto segue ora NumPy floormod: il risultato ha il segno del divisore. Gli ingressi negativi sono quindi utili nei test di aggiornamento. Si conservino ingressi fissi e uscite di riferimento, confrontando interprete e compilatore con tolleranze adatte al tipo di dato. Le correzioni di packaging accettano la directory di librerie condivise inclusa da maturin e preparano i file di distribuzione verificati in una struttura piatta, risolvendo gli errori che ne impedivano la pubblicazione. [Correzioni registrate][changes]

## Aggiornare in un ambiente pulito

È richiesto Python 3.11 o successivo. Si installi con pip il wheel 0.2.3 scelto tra gli asset della pubblicazione, che offre wheel Linux, macOS e Windows e un archivio sorgente. Per l’extra IREE si può usare `pip install "evoxc[iree]==0.2.3"`, verificando entrambe le dipendenze IREE. La distribuzione separata evoxc-hf mantiene una propria versione. Prima di trasferire un carico più grande, si esegua `pip check`, si controlli la versione installata e si ripetano un grafo rappresentativo, un caso di resto negativo e un trasferimento di andata e ritorno dal dispositivo. [Guida all’installazione][guide]

Per trasformazioni di grafi, operazioni personalizzate e fasi esplicite di compilazione intorno a questi backend, si consulti l’articolo sulla [compilazione personalizzata][related] insieme alla documentazione di questa release.

[release]: https://github.com/EMI-Group/evoxc/releases/tag/v0.2.3
[changes]: https://github.com/EMI-Group/evoxc/blob/v0.2.3/CHANGELOG.md
[requirements]: https://github.com/EMI-Group/evoxc/blob/v0.2.3/pyproject.toml
[guide]: https://github.com/EMI-Group/evoxc/blob/v0.2.3/README.md
[related]: /it/news/evoxc-custom-compilation-pipeline
