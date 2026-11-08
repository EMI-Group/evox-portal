---
title: "Genesis Server: um ambiente persistente para desenvolver software"
pubDate: 2026-11-02
summary: "Da distribuição headless em 0.13.11 à continuidade após terminar sessão em 0.14.0, Genesis permite implementar dashboard e agentes de forma independente."
updatedDate: 2026-11-08
---

Genesis 0.14.0, publicado a 2 de novembro de 2026, deteta o estado de lingering do systemd no arranque do servidor e propõe ativá-lo. Prossegue a distribuição headless introduzida em 0.13.11 a 30 de outubro. O ciclo de vida do ambiente de execução pode assim ser gerido separadamente da sessão de desktop.

![Um servidor mantém tarefas com o terminal fechado](./persistent-server-session.webp)

## Uma distribuição servidor com controlos operacionais

O pacote inclui dashboard e ambiente dos agentes para Linux x64/arm64 e macOS arm64. A CLI cobre serviço, arranque, paragem, estado, registos, saúde e versão. O instalador verifica somas de controlo, instala ou atualiza o pacote e cria a ligação ao executável. [v0.13.11](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11)

## Gerir o ciclo de vida da execução

Em Linux com systemd, o lingering pode ser necessário para manter serviços de utilizador após terminar sessão. A versão 0.14.0 verifica esta condição, configurável através de `GENESIS_LINGER` ou `--no-linger`. [v0.14.0](https://github.com/EMI-Group/genesis/releases/tag/v0.14.0)

A versão anterior também melhora o arranque remoto: wrapper POSIX shell, tratamento de caminhos com espaços e causas de erro legíveis. As correções do modo servidor e o tempo de atividade exato facilitam o diagnóstico. [v0.13.11](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11)

## Antes de deixar o servidor a funcionar

Antes de transferir uma tarefa longa para o servidor, verifique o estado, os registos e a resposta de `/health`. Num sistema com systemd, confirme lingering e volte a verificar a disponibilidade depois de terminar a sessão. Estas verificações estabelecem a base de execução; o [histórico de desenvolvimento](/pt/news/genesis-development-history) permite acompanhar o código produzido.
