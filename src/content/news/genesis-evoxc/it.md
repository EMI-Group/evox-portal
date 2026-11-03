---
title: "EvoX Compiler: uno stack esplicito di grafi tensoriali costruito con Genesis"
pubDate: 2026-11-03
summary: "Il caso EvoX Compiler di Genesis presenta un compilatore e runtime Python per grafi tensoriali, con NumPy, IREE, XLA e TVM."
---

EvoX Compiler (evoxc) rende il grafo di calcolo un artefatto ispezionabile. Il frontend costruisce e trasforma EvoXIR; fasi esplicite gestiscono abbassamento, compilazione, caricamento ed esecuzione. NumPy è l’unica dipendenza obbligatoria; ottimizzazione e generazione del codice spettano ai compilatori esterni.

L’istantanea Evidence del **28 ottobre 2026** documenta quattro percorsi: **NumPy, IREE, XLA e TVM**. Il repository attribuisce a Genesis la produzione di codice, test e documentazione. Il caso segue il progetto dalla costruzione iniziale allo sviluppo continuo di interfacce e backend.

Con IREE installato, l’istantanea riporta **6,789 test superati, 46 saltati e 3 fallimenti attesi**, senza fallimenti. Sono conteggi storici, non i totali attuali. Le **285,659 righe di testo versionate** includono test, dati di benchmark e documenti: non misurano solo il sorgente del compilatore. I costi dei token sono circa **50 dollari**, escluso l’hardware.

La validazione dipende dalla configurazione: Vulkan usava un dispositivo software, mentre il percorso ROCm di TVM era verificato solo in compilazione. I risultati sono dichiarati dal progetto e non riprodotti indipendentemente. La pipeline esplicita e i rapporti di benchmark nel repository sono un punto di partenza per gli sviluppatori.

[Genesis Evidence](https://genesis.evox.group/evidence/evoxc/) · [GitHub](https://github.com/EMI-Group/evoxc) · [README](https://github.com/EMI-Group/evoxc/blob/main/README.md) · [evoxc_hf benchmarks](https://github.com/EMI-Group/evoxc/blob/main/bench_logs/hf_bench_results.md)
