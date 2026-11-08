---
title: "Genesis: conservare i contributi degli agenti nella storia del software"
pubDate: 2026-09-26
summary: "Genesis 0.13.2–0.13.4 collega la storia Git delle attività alle corsie degli agenti, mantenendo i contributi verificabili dopo la loro conclusione."
updatedDate: 2026-11-08
---

L'albero degli agenti mostra chi sta lavorando. La storia del progetto deve spiegare anche cosa rimane dopo. Genesis 0.13.4, pubblicato il 26 settembre 2026, sviluppa la vista dei commit di 0.13.2 e i riferimenti persistenti delle attività di 0.13.3, collegando attività temporanee a versioni ispezionabili.

![Binari ramificati con tessere di commit confluiscono in un archivio stratificato](./durable-agent-history.webp)

## Dagli agenti attivi ai riferimenti persistenti

L'API storica per attività risolve riferimenti persistenti e commit di base. La vista temporale conserva così i commit degli agenti riciclati. L'API precedente interroga intervalli e riferimenti tra repository; il livello attività aggiunge il contesto necessario per seguire un particolare lavoro. [v0.13.2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.2) · [v0.13.3](https://github.com/EMI-Group/genesis/releases/tag/v0.13.3)

Quando un agente delega un modulo e termina, il contributo può ancora richiedere revisione. Git dà alla modifica un'identità durevole; la vista dell'attività aiuta a collocarla. La fine di un'esecuzione non deve cancellare il rapporto tra compito e codice prodotto.

## Mostrare le relazioni tra contributi

La versione 0.13.4 organizza i commit in corsie per agente, mantiene uniti i sottoalberi e mostra deleghe e merge di ritorno. I commit senza proprietario usano una corsia neutra. Selezione, sincronizzazione al passaggio del mouse e tastiera aiutano l'ispezione; errori parziali di lettura non svuotano più l'intero grafico. [v0.13.4](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)

La vista segnala il troncamento al limite di 100 commit. Per modifiche precedenti, usi i riferimenti iniziale e finale dell’attività per esaminare il relativo intervallo Git.

## Seguire un contributo fino all’integrazione

Parta dal commit di base dell’attività e segua una corsia agente attraverso delega e merge di ritorno. Apra diff e risultati dei test per decidere cosa conservare. Per più basi di codice, la [revisione multi-repository](/it/news/genesis-multi-repository) offre il passo successivo d’integrazione.
