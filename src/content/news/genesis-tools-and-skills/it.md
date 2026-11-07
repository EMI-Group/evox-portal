---
title: "Strumenti e skill Genesis: integrare i metodi del progetto"
pubDate: 2026-09-26
summary: "Gli strumenti personalizzati di Genesis 0.13.1 e le modifiche alle skill nei worktree di 0.13.4 collegano operazioni dedicate e istruzioni riutilizzabili allo sviluppo."
---

I progetti conservano codice e metodi per compilarlo, verificarlo e modificarlo. Genesis 0.13.4, pubblicato il 26 settembre 2026, colloca le modifiche degli strumenti per le skill nel worktree e le rende revisionabili in Git. Con gli strumenti personalizzati di 0.13.1, pubblicati il 21 settembre, offre due vie distinte per integrare i metodi del progetto.

## Esporre operazioni con strumenti personalizzati

La versione 0.13.1 carica strumenti definiti dall'utente dalla directory tools della configurazione. Appaiono nelle impostazioni, possono entrare nelle liste consentite degli agenti personalizzati e passano dal dispatcher centrale. Il progetto può esporre operazioni esplicite oltre alla shell generale.

Un team potrebbe, per esempio, avvolgere un verificatore esistente con un contratto definito di input e output. È un uso possibile dell'estensione, non un'integrazione inclusa. Implementazione, permessi e significato dei risultati restano responsabilità del progetto.

## Collocare le skill dove si revisiona il codice

La versione 0.13.4 legge e scrive skill nel worktree dell'agente e supporta il commit delle modifiche tramite un flag opzionale. Le istruzioni prodotte dall'agente possono quindi essere esaminate sul suo branch. Corregge inoltre individuazione e rimozione delle skill.

Gli strumenti espongono operazioni invocabili; le skill contengono istruzioni riutilizzabili. I ruoli sono complementari ma distinti. Git rende una modifica visibile e versionata, senza dimostrarne automaticamente correttezza o utilità.

## Estendere senza perdere la revisione

Questi punti di estensione avvicinano la revisione dei metodi generati a quella del codice. Nell'ecosistema EvoX, si possono migliorare sia l'implementazione sia le istruzioni per svilupparla. Accettazione e validazione restano necessarie per trasformare proposte in basi affidabili per il lavoro futuro.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.1) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)
