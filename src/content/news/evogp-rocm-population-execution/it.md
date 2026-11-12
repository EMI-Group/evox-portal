---
title: "EvoGP: più GPU disponibili, meno lavoro nei log della popolazione"
pubDate: 2026-10-16
summary: "Il supporto AMD ROCm e una riduzione tensoriale corretta affrontano due ostacoli alle grandi popolazioni di programmi."
---

Un kernel rapido è solo una parte di una ricerca utilizzabile. La GPU disponibile deve essere supportata e i resoconti non devono dominare ogni generazione. L'[integrazione del 16 ottobre 2026][s1] sostituisce le riduzioni Python della fitness nel pipeline standard EvoGP. Segue il [supporto AMD ROCm del 17 giugno][s2], ampliando l'accesso alla stessa ricerca ad alberi.

![Gli stessi alberi di programma sopra due schede acceleratrici differenti](./cover.webp)

*Illustrazione concettuale: la stessa rappresentazione attraversa i backend GPU.*

## Mantenere le statistiche nelle operazioni tensoriali

Massimo e minimo Python sul tensore di fitness diventano `torch.max` e `torch.min`. Attraversare grandi tensori del dispositivo in Python crea lavoro al confine del linguaggio che una riduzione esegue nel framework numerico. Conta soprattutto quando valutare la fitness è poco costoso.

Nella regressione simbolica, le espressioni possono essere valutate in parallelo mentre stampare gli estremi resta oneroso. La correzione elimina lo squilibrio senza cambiare la statistica. La PR riporta un forte miglioramento con un milione di individui, ma non un protocollo completo; conviene profilare la generazione intera, compresi i resoconti.

## Una base sorgente per CUDA e ROCm

L'integrazione di giugno sfrutta la conversione HIP di PyTorch durante il build per compilare le estensioni CUDA su AMD. Seleziona le opzioni per backend e protegge un header esclusivo di CUDA. Con PyTorch ROCm non serve mantenere un'altra implementazione degli algoritmi.

L'allocazione dinamica degli stack degli interpreti viene sostituita da array locali fissi. Il contributore collega gli errori AMD all'aliasing delle allocazioni tra wavefront residenti. Separare gli stack è essenziale: usare lo stato temporaneo di un altro thread può falsare fitness e selezione.

## Preparare l'ambiente del backend

Le [istruzioni sorgente][s3] richiedono strumenti GPU, compilatore C++ e PyTorch compatibili. Su AMD servono ROCm con `hipcc` e PyTorch ROCm. Il build con `--no-build-isolation` usa l'ambiente PyTorch già installato.

Gli esempi mantengono le stringhe dispositivo `cuda` sotto ROCm perché è l'interfaccia PyTorch. `PYTORCH_ROCM_ARCH` seleziona un'architettura AMD precisa. È una configurazione di build, non una riscrittura degli alberi o degli operatori evolutivi.

## Verificare una piccola ricerca prima di crescere

Il contributore riporta controlli di regressione simbolica su MI250X, W7800, RX 9070 XT e PRO V710, con sistemi e versioni ROCm elencati nella PR. Usano 1.000 individui, 100 generazioni e seme fisso: sono verifiche riferite a tali configurazioni, non garanzie generali sulle prestazioni.

Dopo il build, esegua `python -m evogp.sr_test` e controlli fitness finita e completamento. Confronti poi un caso con e senza resoconti mantenendo fissi ingressi, seme e popolazione, separando valutazione e gestione. La [panoramica di ricerca EvoGP][related] spiega gli alberi tensorizzati; queste modifiche collegano tale rappresentazione all'hardware disponibile.

[s1]: https://github.com/EMI-Group/evogp/pull/14
[s2]: https://github.com/EMI-Group/evogp/pull/12
[s3]: https://github.com/EMI-Group/evogp/blob/85c9f96490185b371438768668da53de930cc3f6/README.md
[related]: /it/news/evogp
