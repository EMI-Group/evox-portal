---
title: "Genesis: conservare i contributi degli agenti nella storia del software"
pubDate: 2026-09-26
summary: "Genesis 0.13.2–0.13.4 collega la storia Git delle attività alle corsie degli agenti, mantenendo i contributi verificabili dopo la loro conclusione."
---

L'albero degli agenti mostra chi sta lavorando. La storia del progetto deve spiegare anche cosa rimane dopo. Genesis 0.13.4, pubblicato il 26 settembre 2026, sviluppa la vista dei commit di 0.13.2 e i riferimenti persistenti delle attività di 0.13.3, collegando attività temporanee a versioni ispezionabili.

## Dagli agenti attivi ai riferimenti persistenti

L'API storica per attività risolve riferimenti persistenti e commit di base. La vista temporale conserva così i commit degli agenti riciclati. L'API precedente interroga intervalli e riferimenti tra repository; il livello attività aggiunge il contesto necessario per seguire un particolare lavoro.

Quando un agente delega un modulo e termina, il contributo può ancora richiedere revisione. Git dà alla modifica un'identità durevole; la vista dell'attività aiuta a collocarla. La fine di un'esecuzione non deve cancellare il rapporto tra compito e codice prodotto.

## Mostrare le relazioni tra contributi

La versione 0.13.4 organizza i commit in corsie per agente, mantiene uniti i sottoalberi e mostra deleghe e merge di ritorno. I commit senza proprietario usano una corsia neutra. Selezione, sincronizzazione al passaggio del mouse e tastiera aiutano l'ispezione; errori parziali di lettura non svuotano più l'intero grafico.

La vista segnala il troncamento al limite di 100 commit. È uno strumento per navigare lo sviluppo, non un archivio illimitato o una spiegazione completa di ogni decisione.

## La tracciabilità sostiene la selezione

Il grafico mostra origine e integrazione di una modifica nel branch, ma non ne prova la correttezza. Diff, test e revisione restano necessari. Per l'evoluzione del software di EvoX, rende più visibile il rapporto tra contributi proposti e versioni conservate, aiutando a scegliere cosa portare avanti.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.2) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.3) · [3](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)
