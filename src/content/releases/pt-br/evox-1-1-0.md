---
title: "EvoX 1.1: agora com torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 introduz a integração completa do torch.compile (TorchDynamo), substituindo o TorchScript para melhor compatibilidade e desempenho."
---

Temos o prazer de anunciar o lançamento do **EvoX 1.1**, introduzindo a **integração completa do torch.compile (TorchDynamo)** como compilador backend! Esta atualização substitui a abordagem anterior com TorchScript, tornando o EvoX **mais amigável ao usuário e altamente compatível com o ecossistema Python mais amplo**.

Ao utilizar o **torch.compile**, o EvoX agora captura grafos de computação dinamicamente em tempo de execução, eliminando a necessidade de rastreamento manual enquanto otimiza o desempenho automaticamente.

**O Que Há de Novo?**

**torch.compile: Compilação Mais Inteligente e Flexível**

No EvoX 1.1, adotamos totalmente o **torch.compile** como o novo backend de compilação. Diferente da abordagem anterior baseada em rastreamento, o torch.compile -- que **internamente usa TorchDynamo** -- intercepta a execução Python, extrai dinamicamente grafos de computação e os otimiza em tempo real.

Isso significa:

l  **Sem mais rastreamento manual** -- Basta chamar **torch.compile(workflow.step)**, e o EvoX cuida do resto.

l  **Compatibilidade perfeita com Python** -- Funciona com funções nativas do Python e bibliotecas externas como NumPy e SciPy.

l  **Melhor desempenho** -- Grafos de computação otimizados resultam em **execução mais rápida e melhor utilização do hardware**.

l  **Design preparado para o futuro** -- Alinhado com o roadmap do PyTorch, garantindo compatibilidade de longo prazo e melhorias de desempenho.

**Por Que Migrar do TorchScript para torch.compile?**

Em versões anteriores, o EvoX dependia de **métodos baseados em rastreamento**:

l  **Pré-1.0.0** usava **rastreamento JAX** para extração de grafos de computação.

l  **v1.0.0** mudou para **TorchScript**, aprimorando a integração com PyTorch.

No entanto, esses métodos tinham várias desvantagens:

l  **Complexos de usar** -- Os usuários tinham que rastrear grafos manualmente e lidar com depuração intrincada.

l  **Compatibilidade limitada** -- Dificuldades com workflows dinâmicos e funções não-PyTorch.

l  **Flexibilidade restrita** -- Loops, condicionais e outras construções Python nem sempre eram capturados corretamente.

Com torch.compile e **TorchDynamo**, **esses problemas desapareceram**. O EvoX agora otimiza dinamicamente, suportando uma gama mais ampla de workflows com **zero esforço extra dos usuários**.

**Como o EvoX 1.1 Facilita Sua Vida**

l  **Sem mais complicações com rastreamento** -- Tudo acontece nos bastidores, tornando seu código mais limpo e fácil de manter.

l  **Funciona com seu código Python existente** -- Sem necessidade de modificar seu workflow para compatibilidade.

l  **Execução mais rápida, melhor escalabilidade** -- Beneficie-se das últimas otimizações do PyTorch para GPUs e TPUs.

l  **Preparado para o futuro** -- Mantenha-se alinhado com a evolução de longo prazo do PyTorch, garantindo ganhos contínuos de desempenho.

**Atualize para o EvoX 1.1 Agora!**

O EvoX 1.1 está agora oficialmente disponível! Atualize hoje para experimentar um workflow computacional **mais inteligente, mais rápido e mais intuitivo**.

**Obtenha o EvoX 1.1**: [GitHub](https://github.com/EMI-Group/EvoX)

Tem perguntas ou feedback? Abra uma issue no GitHub ou participe da discussão da nossa comunidade. Vamos expandir os limites da **inteligência computacional juntos!**

**Código-fonte / Comunidade / Documentação**

Artigo: [https://arxiv.org/abs/2301.12457](https://arxiv.org/abs/2301.12457 "https://arxiv.org/abs/2301.12457")

GitHub: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Documentação: [https://evox.readthedocs.io/en/latest/](https://evox.readthedocs.io/en/latest/ "https://evox.readthedocs.io/en/latest/")

Grupo QQ: 297969717

![4.png](/images/articles/evox-1-1-0-1.png)
