---
title: "Genesis 0.14.1: manter a escolha do modelo ligada ao trabalho"
pubDate: 2026-11-10
summary: "Os perfis de conta ligam modelo e raciocínio no Genesis; o desenvolvimento remoto passa para um servidor partilhado."
---

Escolher um modelo envolve conta, credenciais e raciocínio. O Genesis 0.14.1, publicado em 8 de novembro de 2026, transmite essa escolha entre Settings, Projects, Assistant, escalonador e execução, reduzindo diferenças entre pedido e execução real. [v0.14.1](https://github.com/EMI-Group/genesis/releases/tag/v0.14.1)

![O separador de conta selecionado mantém a ligação às opções do modelo](./provider-account-continuity.webp)

## Um perfil, uma seleção coerente

Os perfis canónicos separam conta do fornecedor e modelo. Seletores comuns expõem modelo e raciocínio; as correções do escalonador preservam escolhas explícitas e a configuração completa guardada. Os perfis compatíveis acrescentam OAuth/subscrição, estado de sessão individual e importação de credenciais das CLI dos fornecedores.

## Um servidor para uso local e remoto

O desenvolvimento remoto usa agora genesis_server, como o painel headless. A distribuição separada genesis_remote é retirada. A CLI gere arranque, paragem, estado e registos remotos; a distribuição pode ser alternada em execução mantendo HTTP disponível.

## Verificar a passagem ao atualizar

Após atualizar, verifique conta, modelo e raciocínio em Settings e uma tarefa com escolha explícita. Os caminhos OAuth personalizados pertencem a cada perfil. Reveja o servidor partilhado antes de reutilizar scripts antigos do daemon. As notas da versão contêm a migração e as correções completas. [v0.14.1](https://github.com/EMI-Group/genesis/releases/tag/v0.14.1)

[Genesis Assistant: compreender e gerir o trabalho em curso](/pt/news/genesis-development-2026-11-07)
