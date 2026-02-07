---
title: "EvoX 1.1: agora com torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 introduz a integração completa do torch.compile (TorchDynamo), substituindo o TorchScript para melhor compatibilidade e desempenho."
---

Temos o prazer de anunciar o lançamento do **EvoX 1.1**, que introduz a **integração completa do torch.compile (TorchDynamo)** como compilador backend! Esta atualização substitui a abordagem anterior baseada em TorchScript, tornando o EvoX **mais fácil de utilizar e altamente compatível com o ecossistema Python mais amplo**.

Ao tirar partido do **torch.compile**, o EvoX captura agora grafos de computação dinamicamente em tempo de execução, eliminando a necessidade de rastreamento manual enquanto otimiza o desempenho automaticamente.

**O Que Há de Novo?**

**torch.compile: Compilação Mais Inteligente e Flexível**

No EvoX 1.1, adotamos plenamente o **torch.compile** como o novo backend de compilação. Ao contrário da abordagem anterior baseada em rastreamento, o torch.compile -- que **utiliza internamente o TorchDynamo** -- interceta a execução Python, extrai dinamicamente grafos de computação e otimiza-os em tempo real.

Isto significa:

l  **Sem mais rastreamento manual** -- Basta chamar **torch.compile(workflow.step)**, e o EvoX trata do resto.

l  **Compatibilidade perfeita com Python** -- Funciona com funções nativas de Python e bibliotecas externas como NumPy e SciPy.

l  **Melhor desempenho** -- Grafos de computação otimizados resultam em **execução mais rápida e melhor utilização do hardware**.

l  **Design preparado para o futuro** -- Alinhado com o roteiro do PyTorch, garantindo compatibilidade a longo prazo e melhorias de desempenho.

**Porquê Mudar do TorchScript para o torch.compile?**

Em versões anteriores, o EvoX dependia de **métodos baseados em rastreamento**:

l  **Antes da 1.0.0** utilizava **rastreamento JAX** para extração de grafos de computação.

l  **v1.0.0** mudou para **TorchScript**, melhorando a integração com PyTorch.

No entanto, estes métodos tinham várias desvantagens:

l  **Complexos de utilizar** -- Os utilizadores tinham de rastrear grafos manualmente e lidar com depuração complexa.

l  **Compatibilidade limitada** -- Dificuldades com workflows dinâmicos e funções não-PyTorch.

l  **Flexibilidade restrita** -- Ciclos, condicionais e outras construções Python nem sempre eram capturados corretamente.

Com o torch.compile e o **TorchDynamo**, **estes problemas desapareceram**. O EvoX otimiza agora dinamicamente, suportando uma gama mais ampla de workflows com **zero esforço extra por parte dos utilizadores**.

**Como o EvoX 1.1 Facilita a Sua Vida**

l  **Sem mais complicações com rastreamento** -- Tudo acontece nos bastidores, tornando o seu código mais limpo e fácil de manter.

l  **Funciona com o seu código Python existente** -- Não é necessário modificar o seu workflow para compatibilidade.

l  **Execução mais rápida, melhor escalabilidade** -- Beneficie das últimas otimizações do PyTorch para GPUs e TPUs.

l  **Preparado para o futuro** -- Mantenha-se alinhado com a evolução a longo prazo do PyTorch, garantindo ganhos contínuos de desempenho.

**Atualize para o EvoX 1.1 Agora!**

O EvoX 1.1 está agora oficialmente disponível! Atualize hoje para experimentar um workflow computacional **mais inteligente, mais rápido e mais intuitivo**.

**Obtenha o EvoX 1.1**: [GitHub](https://github.com/EMI-Group/EvoX)

Tem perguntas ou comentários? Abra uma issue no GitHub ou junte-se à discussão da nossa comunidade. Vamos expandir juntos os limites da **inteligência computacional!**

**Código fonte / Comunidade / Documentação**

Paper: [https://arxiv.org/abs/2301.12457](https://arxiv.org/abs/2301.12457 "https://arxiv.org/abs/2301.12457")

GitHub: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Documentação: [https://evox.readthedocs.io/en/latest/](https://evox.readthedocs.io/en/latest/ "https://evox.readthedocs.io/en/latest/")

Grupo QQ: 297969717

![4.png](/images/articles/evox-1-1-0-1.png)
