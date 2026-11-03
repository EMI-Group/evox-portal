---
title: "EvoX Compiler: uma pilha explícita de grafos tensoriais construída com Genesis"
pubDate: 2026-11-03
summary: "O caso EvoX Compiler do Genesis documenta um compilador e runtime Python para grafos tensoriais, com NumPy, IREE, XLA e TVM."
---

O EvoX Compiler (evoxc) torna o grafo de cálculo um artefato inspecionável. O frontend constrói e transforma EvoXIR; etapas explícitas fazem a conversão para uma representação de nível inferior, compilação, carregamento e execução. NumPy é a única dependência obrigatória; os compiladores externos otimizam e geram código.

O retrato Evidence de **28 de outubro de 2026** documenta quatro caminhos: **NumPy, IREE, XLA e TVM**. O repositório atribui ao Genesis a produção de código, testes e documentação. O caso acompanha a construção inicial e o desenvolvimento contínuo de interfaces e backends.

Com IREE instalado, o retrato relata **6,789 testes aprovados, 46 ignorados e 3 falhas esperadas**, sem falhas. São números históricos, não os totais atuais. As **285,659 linhas de texto versionadas** incluem testes, dados de benchmark e documentação, não apenas código do compilador. O custo dos tokens foi de cerca de **50 dólares**, sem hardware.

A validação depende da configuração: Vulkan usou um dispositivo de software e o caminho ROCm do TVM foi verificado apenas na compilação. Os resultados são relatados pelo projeto, sem reprodução independente. O fluxo explícito de grafos e os relatórios de benchmark do repositório são um ponto de partida para desenvolvedores.

[Genesis Evidence](https://genesis.evox.group/evidence/evoxc/) · [GitHub](https://github.com/EMI-Group/evoxc) · [README](https://github.com/EMI-Group/evoxc/blob/main/README.md) · [evoxc_hf benchmarks](https://github.com/EMI-Group/evoxc/blob/main/bench_logs/hf_bench_results.md)
