---
title: "Genesis reforça as dependências do painel"
pubDate: 2026-11-25
updatedDate: 2026-11-26
summary: "main atualiza Phoenix, LiveView, Bandit e jsv; instalações a partir do código-fonte exigem uma nova compilação."
---

Em 23 de novembro de 2026, o Genesis atualizou quatro dependências em `main`. A manutenção abrange a infraestrutura web partilhada que dá acesso ao espaço de trabalho. Para equipas que compilam o Genesis a partir do código-fonte, importa o conjunto de dependências usado para construir o serviço em execução. [Atualização][lock]

![Uma peça de substituição reforça o mecanismo de uma fechadura](./cover.webp)

*Ilustração conceptual: manutenção dos componentes que protegem uma entrada partilhada.*

## O que muda sob a interface

A declaração de dependências associa o Phoenix a correções de falhas no acompanhamento de presença e na distribuição de mensagens, e o mínimo do LiveView à correção de hooks de inicialização de sessão ignorados quando o pedido de ligação omite o URL. Também descreve a validação e o reforço HTTP/2 do Bandit. São as razões registadas pelos responsáveis do Genesis; o commit não determina se uma instalação específica esteve exposta. [Requisitos][pins]

O ficheiro de bloqueio passa o Phoenix de 1.8.16 para 1.8.17, o LiveView de 1.2.13 para 1.2.15, o Bandit de 1.14.1 para 1.15.0 e o jsv de 0.28.0 para 0.28.1. O mínimo declarado do LiveView é 1.2.14, mas a compilação bloqueada usa 1.2.15. Uma alteração Nix recalcula o hash das dependências. [Versões][lock] · [Alteração Nix][nix]

## Verificar a compilação realmente instalada

Por exemplo, uma equipa com alojamento próprio pode atualizar o código e continuar a executar um binário antigo. Utilize uma revisão que inclua estes commits, recompile e volte a instalar segundo o procedimento do projeto. Verifique o `mix.lock` da compilação, mantenha o hash Nix correspondente quando aplicável e teste o acesso ao painel e a religação em tempo real. Atualizar apenas a pasta de código-fonte não substitui o serviço em execução. [Guia de instalação][install]

[lock]: https://github.com/EMI-Group/genesis/commit/99f450252b8c0f8a07ad64bb3f7491b35f9b23d0
[pins]: https://github.com/EMI-Group/genesis/commit/bfcc0115ad1cb714ec54d60265816550c1619bd3
[nix]: https://github.com/EMI-Group/genesis/commit/6a80bba389dec5d120c64a435cab88be4de275bc
[install]: https://github.com/EMI-Group/genesis/blob/43705acdfc9a4ebc885e0d457d75242286924637/README.md

A manutenção de 25 de novembro de 2026 também eleva `db_connection` a 2.10.3. O código associa este mínimo de segurança a estruturas de fluxo forjadas que alcançam a opção de registo. Atualiza ainda dependências nativas de Markdown e hashes Nix. Reconstrua com o ficheiro de bloqueio e as definições Nix correspondentes. [GitHub](https://github.com/EMI-Group/genesis/commit/6e008cbed33eb16bd370136628097933e4906f10).
