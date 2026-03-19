---
title: "Lançamento do EvoX 1.1: Agora com torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "O EvoX 1.1 introduz a integração total do torch.compile (TorchDynamo), substituindo o TorchScript para uma melhor compatibilidade e desempenho."
---

Estamos entusiasmados por anunciar o lançamento do **EvoX 1.1**, introduzindo a **integração total do torch.compile (TorchDynamo)** como o compilador de backend! Esta atualização substitui a abordagem anterior do TorchScript, tornando o EvoX **mais fácil de utilizar e altamente compatível com o ecossistema Python mais amplo**.

Ao tirar partido do **torch.compile**, o EvoX agora captura grafos de computação dinamicamente em tempo de execução, eliminando a necessidade de tracing manual enquanto otimiza o desempenho automaticamente.

**O que há de novo?**

**torch.compile: Compilação mais inteligente e flexível**

No EvoX 1.1, adotamos plenamente o **torch.compile** como o novo backend de compilação. Ao contrário da abordagem anterior baseada em tracing, o torch.compile — que **utiliza internamente o TorchDynamo** — interseta a execução de Python, extrai dinamicamente os grafos de computação e otimiza-os em tempo real.

Isto significa:

l  **Fim do tracing manual** — Basta chamar `torch.compile(workflow.step)` e o EvoX trata do resto.

l  **Compatibilidade total com Python** — Funciona com funções nativas de Python e bibliotecas externas como NumPy e SciPy.

l  **Melhor desempenho** — Grafos de computação otimizados resultam numa **execução mais rápida e melhor utilização do hardware**.

l  **Design preparado para o futuro** — Alinha-se com o roteiro do PyTorch, garantindo compatibilidade a longo prazo e melhorias de desempenho.

**Porquê mudar do TorchScript para o torch.compile?**

Em versões anteriores, o EvoX dependia de **métodos baseados em tracing**:

l  As versões **anteriores à 1.0.0** utilizavam **JAX tracing** para a extração do grafo de computação.

l  A **v1.0.0** mudou para o **TorchScript**, melhorando a integração com o PyTorch.

No entanto, estes métodos apresentavam várias desvantagens:

l  **Complexos de utilizar** — Os utilizadores tinham de rastrear (trace) grafos manualmente e lidar com depurações (debugging) intrincadas.

l  **Compatibilidade limitada** — Dificuldade em lidar com fluxos de trabalho dinâmicos e funções não pertencentes ao PyTorch.

l  **Flexibilidade restrita** — Ciclos, condicionais e outras construções de Python nem sempre eram capturados corretamente.

Com torch.compile e **TorchDynamo**, **estes problemas desapareceram**. O EvoX agora otimiza de forma dinâmica, suportando uma gama mais ampla de fluxos de trabalho com **zero esforço extra por parte dos utilizadores**.

**Como o EvoX 1.1 facilita a sua vida**

l  **Sem mais complicações com tracing** — Tudo acontece nos bastidores, tornando o seu código mais limpo e fácil de manter.

l  **Funciona com o seu código Python existente** — Não é necessário modificar o seu fluxo de trabalho para compatibilidade.

l  **Execução mais rápida, melhor escalabilidade** — Beneficie das mais recentes otimizações do PyTorch para GPUs e TPUs.

l  **Pronto para o futuro** — Mantenha-se alinhado com a evolução a longo prazo do PyTorch, garantindo ganhos de desempenho contínuos.

**Atualize para o EvoX 1.1 agora!**

O EvoX 1.1 já está oficialmente disponível! Atualize hoje para experienciar um fluxo de trabalho computacional **mais inteligente, rápido e intuitivo**.

**Obtenha o EvoX 1.1**: [GitHub](https://github.com/EMI-Group/EvoX)

Tem dúvidas ou feedback? Abra um issue no GitHub ou junte-se à discussão na nossa comunidade. Vamos expandir os limites da **inteligência computacional juntos!**

**Código fonte / Comunidade / Documentação**

Paper: [https://arxiv.org/abs/2301.12457](https://arxiv.org/abs/2301.12457 "https://arxiv.org/abs/2301.12457")

GitHub: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Documentation: [https://evox.readthedocs.io/en/latest/](https://evox.readthedocs.io/en/latest/ "https://evox.readthedocs.io/en/latest/")

QQ Group: 297969717

![4.png](./evox-1-1-0-1.png)