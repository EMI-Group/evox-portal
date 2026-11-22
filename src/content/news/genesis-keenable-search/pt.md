---
title: "Genesis acrescenta pesquisa opcional sem chave API"
pubDate: 2026-11-22
summary: "O adaptador Keenable ativa explicitamente a pesquisa pública, mantendo acesso com chave e fornecedor predefinido."
---

Uma tarefa de investigação de um Agent pode parar antes da primeira consulta se precisar de outra credencial. A PR #174 do Genesis, integrada em `main` a 19 de novembro de 2026, acrescenta **Keenable** como fornecedor opcional cujo endpoint público funciona sem chave API configurada. As instalações existentes mantêm o comportamento predefinido. [Adaptador integrado][pr]

![Uma entrada aberta de biblioteca conduz a documentos selecionados com referências](./cover.webp)

*Ilustração conceptual: uma via pública opcional para investigação na Web.*

## Ativar explicitamente a via pública

Em `[tools.search]`, defina `enabled = true` e `provider = "keenable"`. Sem chave, o adaptador envia consulta e limite de resultados ao endpoint público, inclui `X-Keenable-Title: Genesis` e omite `X-API-Key`. Adicionar `KEENABLE_API_KEY` ao armazenamento de credenciais seleciona o acesso com chave. [Construção dos pedidos][adapter]

A implementação altera os dois controlos necessários: o fornecedor selecionado capaz de funcionar sem chave pode ativar a ferramenta de pesquisa do Agent, e a execução deixa de o rejeitar apenas pela falta da chave. Os fornecedores que exigem credenciais mantêm os seus controlos.

## Ler resultados com os respetivos limites

Para reunir referências documentais, elimina-se uma etapa de configuração. O adaptador converte títulos, URL e `snippet` no formato de resultados existente. Respeita `max_results`; Keenable não tem equivalente de `search_depth`, pelo que ignora essa opção. [Mapeamento das respostas][adapter]

A via pública limita pedidos por IP. A PR regista testes de construção, análise e ativação da ferramenta, incluindo execução simulada, mas nenhuma chamada real à API Keenable. Após ativar, experimente uma consulta pequena a partir do computador de execução e examine fontes e eventuais erros antes de depender dela numa investigação maior. [Verificações registadas][pr]

[pr]: https://github.com/EMI-Group/genesis/pull/174
[adapter]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/agent/tools/web_search_providers.ex
