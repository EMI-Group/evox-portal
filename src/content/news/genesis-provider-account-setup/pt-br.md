---
title: "Genesis liga a configuração de contas, os modelos e o início de sessão ChatGPT"
pubDate: 2026-11-22
summary: "Um assistente renovado reúne credenciais, inventários de modelos, raciocínio e horários, com uma conexão ChatGPT gerida pelo Genesis."
---

Uma conexão utilizável exige mais do que o nome de um modelo: autenticação, endpoint, raciocínio suportado e limites compartilhados têm de corresponder. As alterações integradas em Genesis `main` a 19–20 de novembro de 2026 reconstroem Welcome e Settings em torno das contas dos fornecedores. A PR #175 acrescenta **Sign in with ChatGPT**, substituindo a importação de credenciais Codex nos perfis de assinatura ChatGPT. [Integração][pr]

![Uma chave de conta e os componentes do modelo escolhido encaixam numa caixa de instrumentos](./cover.webp)

*Ilustração conceitual: autenticação e modelos pertencem à mesma conta configurada.*

## Configurar a conta e depois os modelos

Welcome usa agora um assistente de fornecedor por etapas; Settings permite gerir as contas posteriormente. Os nomes e identificadores gerados vêm do fornecedor, não do modelo escolhido. Uma conta pode conter vários modelos e níveis de raciocínio com credenciais, concorrência e horários compartilhados. Contas separadas continuam adequadas quando estas propriedades diferem. [Contrato dos perfis][profiles]

Por exemplo, uma equipe com um endpoint compatível com OpenAI pode configurar uma vez o URL base e a credencial, adicionar os modelos realmente disponíveis e escolher modelo e raciocínio para cada tarefa. A integração torna acessível a introdução da chave API em endpoints personalizados e encaminha as respectivas contas através de OpenAI Chat Completions. Cada modelo selecionável precisa de uma entrada no inventário; indicar apenas o modelo padrão não o registra. Teste o modelo escolhido, não apenas o preenchimento da credencial. [Integração e verificações no navegador][pr]

O assistente separa os níveis de raciocínio anunciados do valor padrão. A escolha chega à entrada salva do modelo e ao pedido de teste. A escala canônica é `none`, `minimal`, `low`, `medium`, `high`, `xhigh`; o antigo `max` é lido como `xhigh` e salvo assim posteriormente. As grafias próprias do fornecedor são adaptadas na construção do pedido. O suporte depende do modelo real: mostrar a escala não prova que todos os endpoints aceitam todos os níveis. [Regras de raciocínio][profiles]

## Autorizar ChatGPT através do Genesis

Escolha **ChatGPT Subscription** em Welcome ou **Settings → LLM → Provider accounts**. O guia versionado indica `genesis chatgpt login`, `genesis chatgpt status` e `genesis chatgpt models` para início de sessão e inspeção. A partir do código-fonte, use `mix genesis.chatgpt login`. Abra o URL apresentado no navegador e autorize o Genesis. [Guia da assinatura][oauth]

Depois use **Check connection**, escolha o registro e um modelo disponível para essa conta. Em Settings, salve a conta antes de **Connection Test**; Welcome testa o modelo antes de terminar. O perfil mantém `provider = "openai_codex"` por compatibilidade, usa `auth_mode = "oauth"` e identifica o registro Genesis com `siwc_account`.

Os perfis existentes precisam de nova autorização através do Genesis: esta conexão não utiliza as antigas credenciais importadas do Codex. Se o modelo anterior não surgir no inventário descoberto, escolha um disponível. As contas OpenAI com chave API continuam a ser uma opção separada. Para vários registros, use um alias explícito como `genesis chatgpt login --account work` e selecione-o no perfil. [Migração e aliases][oauth]

## Manter a conexão no computador de execução

As credenciais da conta selecionada são resolvidas e renovadas no nó de execução. As atualizações são serializadas entre a CLI de início de sessão e o servidor ativo. Assim, um registro visível no navegador não é confundido com uma conexão noutro computador remoto. [Armazenamento de contas][store]

Para alojamento próprio, o guia descreve o reencaminhamento SSH da porta de início de sessão loopback e a execução do login com a mesma conta e pasta de configuração do serviço Genesis. Documenta ainda a transferência protegida de credenciais e `GENESIS_SIWC_HTTPS_PROXY` para computadores que precisam de proxy HTTP CONNECT. Siga as instruções específicas do computador antes de testar inferência: iniciar sessão num portátil não configura um servidor independente.

As verificações de renovação e transmissão ChatGPT da PR usaram fixtures; nessa revisão faltava verificar uma autorização nova no navegador com uma conta ChatGPT real. Confirme a sua instalação com uma resposta efetiva do modelo no computador pretendido. [Âmbito da verificação][pr]

## Tornar explícitos os horários da conta

A mesma conta contém concorrência em horas de ponta e fora delas, fuso horário e política de agendamento. Novas predefinições podem preencher horários suportados, mas os números de slots são valores Genesis editáveis, não garantias de capacidade do fornecedor nem de economia. Todos os modelos da conta compartilham slots; adicionar um modelo não cria outra quota. [Implementação das predefinições][presets]

`off_peak_holidays = "CN"` acrescenta o calendário chinês incluído, com dias de trabalho compensatórios. Os dados são estáticos, cobrem 2025–2027 e não se atualizam sozinhos. Confirme fuso, regras de fim de semana e pressupostos. Concorrência de ponta zero põe novos pedidos em fila; reduzir capacidade não expulsa trabalho já em execução. [Semântica dos horários][profiles]

Depois de mudar para uma compilação com estas alterações, reveja inventário, raciocínio padrão e computador de execução de cada conta. Volte a autorizar o perfil ChatGPT e execute o teste de conexão. Nas contas agendadas, inspecione horários salvos e a próxima transição prevista. Estas verificações incidem nas identidades e limites realmente utilizados pelas tarefas futuras.

[pr]: https://github.com/EMI-Group/genesis/pull/175
[profiles]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/docs/llm-profiles.md
[oauth]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/docs/llm-oauth.md
[store]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/auth/chatgpt/store.ex
[presets]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/config/provider_presets.ex
