---
title: "Lançamento do EvoX 1.1: Agora com torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "O EvoX 1.1 introduz a integração total do torch.compile (TorchDynamo), substituindo o TorchScript para melhor compatibilidade e desempenho."
---

Estamos entusiasmados em anunciar o lançamento do **EvoX 1.1**, introduzindo a **integração total do torch.compile (TorchDynamo)** como o compilador de backend! Esta atualização substitui a abordagem anterior do TorchScript, tornando o EvoX **mais amigável ao usuário e altamente compatível com o ecossistema Python mais amplo**.

Ao aproveitar o **torch.compile**, o EvoX agora captura grafos de computação dinamicamente em tempo de execução, eliminando a necessidade de rastreamento manual (`tracing`) enquanto otimiza o desempenho automaticamente.

**O que há de novo?**

**torch.compile: Compilação mais inteligente e flexível**

No EvoX 1.1, adotamos totalmente o **torch.compile** como o novo backend de compilação. Diferente da abordagem anterior baseada em `tracing`, o torch.compile — que **internamente utiliza o TorchDynamo** — intercepta a execução do Python, extrai dinamicamente os grafos de computação e os otimiza em tempo real.

Isso significa:

l  **Sem mais tracing manual** — Basta chamar `torch.compile(workflow.step)`, e o EvoX cuida do resto.

l  **Compatibilidade perfeita com Python** — Funciona com funções nativas do Python e bibliotecas externas como NumPy e SciPy.

l  **Melhor desempenho** — Grafos de computação otimizados resultam em **execução mais rápida e melhor utilização do hardware**.

l  **Design à prova de futuro** — Alinha-se com o roadmap do PyTorch, garantindo compatibilidade a longo prazo e melhorias de desempenho.

**Por que mudar do TorchScript para o torch.compile?**

Em versões anteriores, o EvoX dependia de **métodos baseados em tracing**:

l  **Versões anteriores à 1.0.0** usavam **JAX tracing** para extração de grafos de computação.

l  **v1.0.0** mudou para o **TorchScript**, aprimorando a integração com o PyTorch.

No entanto, esses métodos apresentavam várias desvantagens:

l  **Complexo de usar** — Os usuários tinham que rastrear grafos manualmente e lidar com depurações intrincadas.

l  **Compatibilidade limitada** — Dificuldade com workflows dinâmicos e funções que não eram do PyTorch.

l  **Flexibilidade restrita** — Loops, condicionais e outras construções do Python nem sempre eram capturados corretamente.

Com o torch.compile e o **TorchDynamo**, **esses problemas acabaram**. O EvoX agora otimiza dinamicamente, suportando uma gama mais ampla de workflows com **zero esforço extra dos usuários**.

**Como o EvoX 1.1 facilita sua vida**

l  **Sem mais complicações com tracing** — Tudo acontece nos bastidores, tornando seu código mais limpo e fácil de manter.

l  **Funciona com seu código Python existente** — Não há necessidade de modificar seu workflow para compatibilidade.

l  **Execução mais rápida, melhor escalabilidade** — Beneficie-se das otimizações mais recentes do PyTorch para GPUs e TPUs.

l  **Pronto para o futuro** — Mantenha-se alinhado com a evolução de longo prazo do PyTorch, garantindo ganhos contínuos de desempenho.

**Atualize para o EvoX 1.1 agora!**

O EvoX 1.1 já está oficialmente disponível! Atualize hoje para experimentar um workflow computacional **mais inteligente, rápido e intuitivo**.

**Obtenha o EvoX 1.1**: [GitHub](https://github.com/EMI-Group/EvoX)

Tem perguntas ou feedback? Abra uma issue no GitHub ou participe da nossa discussão na comunidade. Vamos expandir os limites da **inteligência computacional juntos!**

**Código-fonte / Comunidade / Documentação**

Paper: [https://arxiv.org/abs/2301.12457](https://arxiv.org/abs/2301.12457 "https://arxiv.org/abs/2301.12457")

GitHub: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Documentação: [https://evox.readthedocs.io/en/latest/](https://evox.readthedocs.io/en/latest/ "https://evox.readthedocs.io/en/latest/")

Grupo QQ: 297969717

![4.png](/images/articles/evox-1-1-0-1.png)