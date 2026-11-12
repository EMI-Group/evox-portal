---
title: "EvoMO v0.3.1: più strumenti per gli esperimenti multiobiettivo"
pubDate: 2026-10-08
summary: "La serie v0.3 amplia gli algoritmi tensorizzati, corregge selezione e benchmark e documenta confronti riproducibili."
---

L'ottimizzazione multiobiettivo richiede più di una valutazione rapida: selezione dei compromessi, formule corrette e stato ripristinabile. [EvoMO v0.3.1][s1], pubblicato l'8 ottobre 2026 secondo l'ora di Pechino, aggiunge documentazione. Le principali estensioni e correzioni arrivano con [v0.3.0 del 24 settembre][s2].

![Una raccolta di strumenti di ricerca sopra un paesaggio di obiettivi concorrenti](./cover.webp)

*Illustrazione concettuale: algoritmi diversi esplorano compromessi utili differenti.*

## Più algoritmi su una base tensoriale comune

v0.3.0 aggiunge 48 algoritmi multiobiettivo tensorizzati. La base condivisa facilita confronti nello stesso flusso di valutazione, mantenendo differenti regole di selezione, variazione e aggiornamento.

Per obiettivi concorrenti, si possono fissare problema, limiti, popolazione e budget cambiando l'algoritmo. Il valore è l'accesso a comportamenti di ricerca alternativi. Il numero di metodi non dimostra da solo compromessi migliori su un compito specifico.

## La correttezza modifica il confronto

La versione corregge aggiornamento e selezione in più metodi. L'ordinamento non dominato termina dopo il fronte limite completo richiesto; la crowding distance tratta obiettivi costanti, piccole popolazioni, maschere e dispositivi. PyTorch resta predefinito; Triton è un'opzione sperimentale esplicita. [Modifiche di selezione][s3]

ZDT1–4 e ZDT6 ricevono correzioni per riga, incluso il calcolo dimensionale di ZDT6. L'ipervolume Monte Carlo viene corretto per minimizzazione, riferimenti, ingressi vuoti e dispositivi di campionamento. Se uno studio usava quei percorsi, conservi i vecchi risultati e ripeta il confronto controllato senza mescolare definizioni diverse.

## Controllare vincoli e simulazione separatamente

La serie riprende gli 86 benchmark vincolati, NSGA-II con vincoli e `UnifiedWorkflow` di v0.2.2. Aggiunge registrazione differita dei buffer, ripristino dei checkpoint e risorse dei fronti Pareto nelle distribuzioni. [Base dei vincoli][s4]

MoRobtrol aggiunge Playground/MJX, obiettivi specifici e visualizzazione, con miglioramenti a normalizzazione e checkpoint. Nei confronti robotici, registri simulatore e definizioni degli obiettivi quanto l'ottimizzatore: un fronte migliore potrebbe riflettere un compito o una metrica cambiati. [Simulazione e integrazione][s5]

## Aggiornare con un piccolo riferimento

La [guida versionata][s6] installa prima EvoX. Usi `pip install evox`, poi `pip install evomo==0.3.1`, registrando le dipendenze risolte. Il sorgente può essere fissato al tag v0.3.1. La patch aggiunge documentazione; v0.3.0 descrive le modifiche funzionali.

Prima di grandi benchmark, controlli un obiettivo noto, una piccola selezione e il ripristino dello stato. Per i vincoli verifichi fattibilità e qualità, per l'ipervolume mantenga riferimento e campionamento. La [panoramica multiobiettivo GPU][related] spiega la tensorizzazione; v0.3 fornisce una base sperimentale più ampia e definita.

[s1]: https://github.com/EMI-Group/evomo/releases/tag/v0.3.1
[s2]: https://github.com/EMI-Group/evomo/releases/tag/v0.3.0
[s3]: https://github.com/EMI-Group/evomo/pull/38
[s4]: https://github.com/EMI-Group/evomo/pull/34
[s5]: https://github.com/EMI-Group/evomo/pull/39
[s6]: https://github.com/EMI-Group/evomo/blob/v0.3.1/README.md
[related]: /it/news/gpu-accelerated-emo
