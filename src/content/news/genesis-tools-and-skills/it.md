---
title: "Strumenti e skill Genesis: integrare i metodi del progetto"
pubDate: 2026-09-26
summary: "Gli strumenti personalizzati di Genesis 0.13.1 e le modifiche alle skill nei worktree di 0.13.4 collegano operazioni dedicate e istruzioni riutilizzabili allo sviluppo."
updatedDate: 2026-11-08
---

I progetti conservano codice e metodi per compilarlo, verificarlo e modificarlo. Genesis 0.13.4, pubblicato il 26 settembre 2026, colloca le modifiche degli strumenti per le skill nel worktree e le rende revisionabili in Git. Con gli strumenti personalizzati di 0.13.1, pubblicati il 21 settembre, offre due vie distinte per integrare i metodi del progetto.

![Strumenti del progetto e schede di istruzioni riutilizzabili](./project-tools-guidance.webp)

## Esporre operazioni con strumenti personalizzati

La versione 0.13.1 carica strumenti definiti dall'utente dalla directory tools della configurazione. Appaiono nelle impostazioni, possono entrare nelle liste consentite degli agenti personalizzati e passano dal dispatcher centrale. Il progetto può esporre operazioni esplicite oltre alla shell generale. [v0.13.1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.1)

Un team potrebbe, per esempio, avvolgere un verificatore esistente con un contratto definito di input e output.

La versione 0.13.4 consente anche risultati con testo e immagini o audio. Un’operazione può così restituire un artefatto esaminabile dall’agente insieme al rapporto scritto. [v0.13.4](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)

## Collocare le skill dove si revisiona il codice

La versione 0.13.4 legge e scrive skill nel worktree dell'agente e supporta il commit delle modifiche tramite un flag opzionale. Le istruzioni prodotte dall'agente possono quindi essere esaminate sul suo branch. Corregge inoltre individuazione e rimozione delle skill. [v0.13.4](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)

I tool definiscono operazioni richiamabili; gli skill spiegano quando usarle e come interpretare i risultati. Un verificatore di progetto e la sua guida associano operazione eseguibile e istruzioni revisionabili.

## Iniziare da un’operazione del progetto

Scelga un controllo ripetibile. Definisca input, output e permessi del tool personalizzato e scriva uno skill che ne spieghi il momento d’uso. Prima del riutilizzo, esamini il diff dello skill sul branch dell’agente ed esegua il tool. La [cronologia di sviluppo](/it/news/genesis-development-history) segue le revisioni.
