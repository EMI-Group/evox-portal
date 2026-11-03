---
title: "Genesis ricostruisce 13 moduli MESA in Rust"
pubDate: 2026-11-03
summary: "Il caso MESA di Genesis illustra la riscrittura di software scientifico, con 1,052 test superati e 10.64 dollari di costi dichiarati per i token."
---

La riscrittura del software scientifico deve preservarne il comportamento numerico. Il dossier MESA del 7 settembre 2026 descrive la conversione di **13 moduli Fortran in crates Rust**, usando l’implementazione originale come riferimento.

Il dossier riporta **139,414 righe Fortran → 89,946 righe Rust**, **1,052 test superati** e **10.64 dollari** di costi per i token. Il repository documenta test di riferimento confrontati con gli output Fortran e 18 test ignorati oltre a quelli superati.

Le accelerazioni mediane di **1.55–6.87×** riportate da Evidence riguardano benchmark specifici, non tutto MESA. Separatamente, la tabella del README del 5 agosto indica **1.25×** per la combustione a zona singola, usata come carico rappresentativo end-to-end. Risultati di momenti e carichi diversi vanno tenuti distinti.

Il porting copre i moduli numerici e fisici selezionati, non l’intero MESA; i motori di evoluzione stellare e binaria sono esclusi. Il caso mostra come verifiche del comportamento possano guidare la riscrittura del codice esistente. I risultati sono dichiarati dal progetto, senza riproduzione indipendente; i costi dei token escludono l’hardware.

[Genesis Evidence](https://genesis.evox.group/evidence/mesa/) · [GitHub](https://github.com/EMI-Group/genesis-demo-mesa-rs) · [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/main/README.md)
