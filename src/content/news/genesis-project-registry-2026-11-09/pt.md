---
title: "Desenvolvimento do Genesis: um registo persistente para os projetos"
pubDate: 2026-11-10
updatedDate: 2026-11-10
summary: "As mudanças de 9 de novembro em main ligam a navegação a um registo VCT persistente. Identidade estável, carregamento por anfitrião e migração protegida clarificam a passagem do local para o remoto."
---

O caminho de um repositório só faz sentido na máquina a que pertence. Um portátil e um servidor podem ter uma pasta `demo`, mas abrir uma não deve selecionar silenciosamente a outra. As mudanças integradas em **Genesis main a 9 de novembro de 2026** substituem o acompanhamento dos projetos recentes em Projects por um registo em base de dados e encaminham a ativação pelo nó selecionado. [Integração em Projects][projects]

![Pastas de projeto em armários separados por anfitrião com as respetivas etiquetas de registo](./project-host-registry.webp)

## Uma identidade que permanece ao reabrir

O Virtual Context Tree, ou VCT, associa um caminho absoluto do sistema a um ponto canónico como `vct:///projects/demo`. Um mount é essa correspondência: ponto, caminho, nome apresentado e última abertura. Dá identidade estável à navegação sem mover o repositório nem criar uma montagem do sistema de ficheiros. [Implementação do registo][store]

Registar novamente o mesmo caminho normalizado atualiza a data e mantém o ponto. Caminhos diferentes com o mesmo nome final recebem pontos distintos, com sufixos quando necessário. Se o caminho antigo já não existe, um novo com nome apresentado e nome final do ponto correspondentes pode reutilizá-lo. É uma regra concreta de mudança de localização, não uma inferência geral de que pastas com nomes parecidos sejam o mesmo projeto. [Regras de identidade][identity]

A persistência está na tabela SQLite `vct_mounts` do armazenamento de tarefas. O processo VCT mantém uma cache de leitura; cada alteração escreve atomicamente toda a tabela antes de mudar a cache. Se a persistência falhar, devolve um erro e mantém o estado anterior. As alterações bem-sucedidas enviam uma notificação com o nó, ligando a identidade guardada à atualização da interface.

O registo é limitado: mantém por predefinição os 100 mounts mais recentes e remove os mais antigos quando ultrapassa o limite. É um registo de navegação de trabalho, não um arquivo ilimitado de todos os repositórios abertos. [Armazenamento e capacidade][store]

## Pesquisar e abrir a partir do mesmo registo

A página Projects e a paleta de projetos usam os mounts registados. Abrir ou criar um projeto chama a interface `mount_project`, que considera o nó, e volta a carregar a lista. As sugestões procuram primeiro o texto nos caminhos registados sem distinguir maiúsculas e minúsculas, depois acrescentam sugestões por prefixo do sistema de ficheiros e removem duplicados. Um fragmento de caminho conhecido permite encontrar um projeto sem recomeçar no diretório superior. [Mudanças de navegação][projects]

O ponto VCT do projeto ativo é procurado nos mounts já carregados para apresentação. Mostrar uma etiqueta não regista um novo projeto. Esquecer um projeto remove a entrada do registo, não os ficheiros do repositório. Estas diferenças separam a navegação das alterações ao próprio trabalho.

## Manter o anfitrião selecionado no percurso

Considere um programador com um checkout `demo` local e outro num servidor SSH. Selecionar o anfitrião remoto carrega a sua lista. Enquanto a ligação está pendente, a lista mantém-se vazia em vez de apresentar projetos locais como remotos. A ativação também espera pela ligação pronta, evitando que um pedido destinado ao servidor seja executado no nó ainda local. [Carregamento remoto e ativação][projects]

Os caminhos remotos são interpretados segundo o anfitrião escolhido, incluindo caminhos absolutos POSIX e Windows suportados. A ativação é assíncrona para que verificações de diretórios e registo não bloqueiem o LiveView. Uma correção posterior extrai corretamente o resultado remoto para que o projeto receba o seu ponto VCT. [Correção do mount remoto][remote]

A verificação útil é concreta: volte a ligar ao servidor, pesquise o caminho registado, abra-o e confirme anfitrião e ponto apresentado. Repita com o checkout local. Nomes parecidos não devem preencher uma vista remota pendente com o registo local.

## Transportar os registos antigos com cuidado

Nas compilações de desenvolvimento que incluem este trabalho, a migração deriva mounts VCT das antigas linhas `projects` utilizáveis, preserva nomes não vazios e resolve colisões. Mantém as 100 entradas mais recentes. Caminhos vazios ou relativos são registados e ignorados. Se a tabela antiga não puder ser lida, a migração interrompe e reverte a transação, conservando tabela e linhas em vez de interpretar o erro como uma lista vazia. [Proteção da migração e testes upstream][migration]

Antes de experimentar tal compilação num espaço de trabalho existente, guarde os dados da aplicação em cada anfitrião relevante. Após o arranque, verifique os projetos no anfitrião certo, a estabilidade do ponto ao reabrir e a lista depois de reiniciar. Se o arranque indicar erro de migração, preserve base de dados e diagnóstico para investigação, em vez de eliminar o armazenamento para obter uma lista vazia.

Este trabalho torna visível a fronteira do projeto ao escolher onde trabalhar. Para separar históricos de código, leia [Genesis com vários repositórios: um objetivo, históricos separados](/pt/news/genesis-multi-repository).

[projects]: https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d
[store]: https://github.com/EMI-Group/genesis/blob/7383db2f1851c12bace5258bb7da44eab0571a72/apps/evo_git/lib/evo_git/vct.ex
[identity]: https://github.com/EMI-Group/genesis/blob/7383db2f1851c12bace5258bb7da44eab0571a72/apps/evo_git/lib/evo_git/vct/table.ex
[migration]: https://github.com/EMI-Group/genesis/commit/002d6ee324c29b1adbb009dbc38d625e674e70b9
[remote]: https://github.com/EMI-Group/genesis/commit/1eca4865be25f480573fd1df41b7a48fd9392700
