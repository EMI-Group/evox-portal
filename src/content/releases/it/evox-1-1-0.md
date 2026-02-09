---
title: "EvoX 1.1: ora con torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 introduce l'integrazione completa di torch.compile (TorchDynamo), sostituendo TorchScript per migliore compatibilità e prestazioni."
---

Siamo entusiasti di annunciare il rilascio di **EvoX 1.1**, che introduce l'**integrazione completa di torch.compile (TorchDynamo)** come compilatore backend! Questo aggiornamento sostituisce il precedente approccio basato su TorchScript, rendendo EvoX **più facile da usare è altamente compatibile con il più ampio ecosistema Python**.

Sfruttando **torch.compile**, EvoX ora cattura i grafi di calcolo dinamicamente a runtime, eliminando la necessità del tracing manuale e ottimizzando automaticamente le prestazioni.

**Cosa c'è di nuovo?**

**torch.compile: compilazione più intelligente e flessibile**

In EvoX 1.1, adottiamo pienamente **torch.compile** come nuovo backend di compilazione. A differenza del precedente approccio basato sul tracing, torch.compile -- che **utilizza internamente TorchDynamo** -- intercetta l'esecuzione Python, estrae dinamicamente i grafi di calcolo e li ottimizza in tempo reale.

Questo significa:

l  **Niente più tracing manuale** -- Basta chiamare **torch.compile(workflow.step)**, e EvoX si occupa del resto.

l  **Piena compatibilità con Python** -- Funziona con le funzioni native di Python e librerie esterne come NumPy e SciPy.

l  **Prestazioni migliori** -- I grafi di calcolo ottimizzati producono **un'esecuzione più veloce e un migliore utilizzo dell'hardware**.

l  **Design a prova di futuro** -- Allineato con la roadmap di PyTorch, garantendo compatibilità e miglioramenti delle prestazioni a lungo termine.

**Perché passare da TorchScript a torch.compile?**

Nelle versioni precedenti, EvoX si basava su **metodi basati sul tracing**:

l  **Pre-1.0.0** utilizzava il **tracing JAX** per l'estrazione dei grafi di calcolo.

l  **v1.0.0** è passato a **TorchScript**, migliorando l'integrazione con PyTorch.

Tuttavia, questi metodi presentavano diversi svantaggi:

l  **Complessi da usare** -- Gli utenti dovevano tracciare manualmente i grafi e gestire un debugging complesso.

l  **Compatibilità limitata** -- Difficoltà con workflow dinamici e funzioni non-PyTorch.

l  **Flessibilità ridotta** -- Cicli, condizionali e altri costrutti Python non venivano sempre catturati correttamente.

Con torch.compile e **TorchDynamo**, **questi problemi sono risolti**. EvoX ora ottimizza dinamicamente, supportando una gamma più ampia di workflow con **zero sforzo aggiuntivo da parte degli utenti**.

**Come EvoX 1.1 ti semplifica la vita**

l  **Niente più problemi con il tracing** -- Tutto avviene dietro le quinte, rendendo il tuo codice più pulito e facile da mantenere.

l  **Funziona con il tuo codice Python esistente** -- Non è necessario modificare il tuo workflow per la compatibilità.

l  **Esecuzione più veloce, migliore scalabilità** -- Approfitta delle ultime ottimizzazioni di PyTorch per GPU e TPU.

l  **Pronto per il futuro** -- Resta allineato con l'evoluzione a lungo termine di PyTorch, garantendo miglioramenti continui delle prestazioni.

**Aggiorna a EvoX 1.1 ora!**

EvoX 1.1 è ora ufficialmente disponibile! Aggiorna oggi per sperimentare un workflow computazionale **più intelligente, veloce e intuitivo**.

**Ottieni EvoX 1.1**: [GitHub](https://github.com/EMI-Group/EvoX)

Hai domande o feedback? Apri una issue su GitHub o unisciti alla discussione della nostra comunità. Spingiamo insieme i confini dell'**intelligenza computazionale!**

**Codice sorgente / Comunità / Documentazione**

Paper: [https://arxiv.org/abs/2301.12457](https://arxiv.org/abs/2301.12457 "https://arxiv.org/abs/2301.12457")

GitHub: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Documentazione: [https://evox.readthedocs.io/en/latest/](https://evox.readthedocs.io/en/latest/ "https://evox.readthedocs.io/en/latest/")

Gruppo QQ: 297969717

![4.png](/images/articles/evox-1-1-0-1.png)
