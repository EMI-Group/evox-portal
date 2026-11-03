---
title: "Genesis prosegue lo sviluppo del compilatore dopo un cambio di modello"
pubDate: 2026-11-03
summary: "Il caso di continuazione di Genesis riporta 1,820/1,820 test LLVM SingleSource selezionati superati dopo il passaggio da GLM 5.2 a DeepSeek V4 Flash."
---

Un progetto può avanzare quando cambia il modello sottostante? Il caso Compiler Continuation, datato 7 settembre 2026, descrive la ripresa dal repository accettato del compilatore senza trasferire il contesto della conversazione dell’Agent precedente.

Il resoconto indica un passaggio da **GLM 5.2 a DeepSeek V4 Flash**, con una profondità di ricorsione salita da **4 a 8**. La continuazione ha superato **1,820/1,820 casi LLVM SingleSource mantenuti nella valutazione**. Si tratta di un insieme definito, non dell’intera suite LLVM.

Il codice accettato e la cronologia del progetto costituiscono la base del lavoro successivo: questo è il principio di continuità illustrato da Genesis. La creazione del compilatore e la sua continuazione condividono un repository e non sono progetti indipendenti.

Questa retrospettiva segue il dossier Evidence. I risultati sono dichiarati dal progetto e non riprodotti indipendentemente; costo e volume di codice aggiunto non sono riportati. Il README del branch predefinito descrive una diversa valutazione: i suoi conteggi non vanno combinati con questo risultato.

[Genesis Evidence](https://genesis.evox.group/evidence/compiler-continuation/) · [GitHub](https://github.com/EMI-Group/genesis-demo-jcc)
