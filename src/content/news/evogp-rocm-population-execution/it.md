---
title: "EvoGP: riportare le statistiche della popolazione con i tensori"
pubDate: 2026-10-16
updatedDate: 2026-11-17
summary: "Una correzione mirata sostituisce gli estremi della fitness calcolati in Python con riduzioni torch nella pipeline standard."
---

Il reporting non dovrebbe essere la parte costosa di una generazione. La [modifica del 16 ottobre 2026][s1] sostituisce massimo e minimo Python sul tensore di fitness con riduzioni tensoriali. Interviene sui costi del reporting standard conservando il significato degli estremi.

![Un ponte di misura attraversa molti alberi-programma per individuare insieme gli estremi](./reporting-reduction.webp)

*Illustrazione concettuale: calcolare gli estremi collettivamente anziché trattare un candidato alla volta.*

## Mantenere le statistiche nelle operazioni tensoriali

Massimo e minimo Python sul tensore di fitness diventano `torch.max` e `torch.min`. Attraversare grandi tensori del dispositivo in Python crea lavoro al confine del linguaggio che una riduzione esegue nel framework numerico. Conta soprattutto quando valutare la fitness è poco costoso.

Nella regressione simbolica, le espressioni possono essere valutate in parallelo mentre stampare gli estremi resta oneroso. La correzione elimina lo squilibrio senza cambiare la statistica. La PR riporta un forte miglioramento con un milione di individui, ma non un protocollo completo; conviene profilare la generazione intera, compresi i resoconti.

Confronti il tempo completo della generazione con e senza reporting mantenendo input, seme e popolazione. Prima di aumentare il carico, verifichi gli estremi rispetto al tensore di fitness. La [presentazione di EvoGP][related] spiega gli alberi tensorizzati; l’aggiornamento indipendente [AMD ROCm][rocm] riguarda hardware e compilazione. Una riduzione più rapida o un backend supportato non bastano da soli a determinare le prestazioni dell’intera ricerca.

[s1]: https://github.com/EMI-Group/evogp/pull/14
[related]: /it/news/evogp
[rocm]: /it/news/evogp-amd-rocm
