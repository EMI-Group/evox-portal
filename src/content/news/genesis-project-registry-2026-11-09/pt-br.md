---
title: "Desenvolvimento do Genesis: um registro persistente para os projetos"
pubDate: 2026-11-10
updatedDate: 2026-11-10
summary: "As mudanças de 9 de novembro em main ligam a navegação a um registro VCT persistente. Identidade estável, carregamento por host e migração protegida esclarecem a passagem do local para o remoto."
---

O caminho de um repositório só faz sentido na máquina a que pertence. Um notebook e um servidor podem ter uma pasta `demo`, mas abrir uma não deve selecionar silenciosamente a outra. As mudanças integradas em **Genesis main em 9 de novembro de 2026** substituem o acompanhamento dos projetos recentes em Projects por um registro em banco de dados e encaminham a ativação pelo nó selecionado. [Integração em Projects][projects]

![Pastas de projeto em armários separados por host com as respectivas etiquetas de registro](./project-host-registry.webp)

## Uma identidade que permanece ao reabrir

O Virtual Context Tree, ou VCT, associa um caminho absoluto do sistema a um ponto canônico como `vct:///projects/demo`. Um mount é essa correspondência: ponto, caminho, nome apresentado e última abertura. Dá identidade estável à navegação sem mover o repositório nem criar uma montagem do sistema de arquivos. [Implementação do registro][store]

Registrar novamente o mesmo caminho normalizado atualiza a data e mantém o ponto. Caminhos diferentes com o mesmo nome final recebem pontos distintos, com sufixos quando necessário. Se o caminho antigo já não existe, um novo com nome apresentado e nome final do ponto correspondentes pode reutilizá-lo. É uma regra concreta de mudança de localização, não uma inferência geral de que pastas com nomes parecidos sejam o mesmo projeto. [Regras de identidade][identity]

A persistência está na tabela SQLite `vct_mounts` do armazenamento de tarefas. O processo VCT mantém um cache de leitura; cada alteração escreve atomicamente toda a tabela antes de mudar o cache. Se a persistência falhar, devolve um erro e mantém o estado anterior. As alterações bem-sucedidas enviam uma notificação com o nó, ligando a identidade salva à atualização da interface.

O registro é limitado: mantém por padrão os 100 mounts mais recentes e remove os mais antigos quando ultrapassa o limite. É um registro de navegação de trabalho, não um arquivo ilimitado de todos os repositórios abertos. [Armazenamento e capacidade][store]

## Pesquisar e abrir a partir do mesmo registro

A página Projects e a paleta de projetos usam os mounts registrados. Abrir ou criar um projeto chama a interface `mount_project`, que considera o nó, e volta a carregar a lista. As sugestões procuram primeiro o texto nos caminhos registrados sem distinguir maiúsculas e minúsculas, depois acrescentam sugestões por prefixo do sistema de arquivos e removem duplicados. Um fragmento de caminho conhecido permite encontrar um projeto sem recomeçar no diretório superior. [Mudanças de navegação][projects]

O ponto VCT do projeto ativo é procurado nos mounts já carregados para apresentação. Mostrar uma etiqueta não registra um novo projeto. Esquecer um projeto remove a entrada do registro, não os arquivos do repositório. Estas diferenças separam a navegação das alterações ao próprio trabalho.

## Manter o host selecionado no percurso

Considere um desenvolvedor com um checkout `demo` local e outro em um servidor SSH. Selecionar o host remoto carrega a sua lista. Enquanto a conexão está pendente, a lista mantém-se vazia em vez de apresentar projetos locais como remotos. A ativação também espera pela conexão pronta, evitando que um pedido destinado ao servidor seja executado no nó ainda local. [Carregamento remoto e ativação][projects]

Os caminhos remotos são interpretados segundo o host escolhido, incluindo caminhos absolutos POSIX e Windows suportados. A ativação é assíncrona para que verificações de diretórios e registro não bloqueiem o LiveView. Uma correção posterior extrai corretamente o resultado remoto para que o projeto receba o seu ponto VCT. [Correção do mount remoto][remote]

A verificação útil é concreta: conecte-se novamente ao servidor, pesquise o caminho registrado, abra-o e confirme host e ponto apresentado. Repita com o checkout local. Nomes parecidos não devem preencher uma vista remota pendente com o registro local.

## Transportar os registros antigos com cuidado

Nas builds de desenvolvimento que incluem este trabalho, a migração deriva mounts VCT das antigas linhas `projects` utilizáveis, preserva nomes não vazios e resolve colisões. Mantém as 100 entradas mais recentes. Caminhos vazios ou relativos são registrados e ignorados. Se a tabela antiga não puder ser lida, a migração interrompe e reverte a transação, conservando tabela e linhas em vez de interpretar o erro como uma lista vazia. [Proteção da migração e testes upstream][migration]

Antes de experimentar tal build em um espaço de trabalho existente, salve os dados da aplicação em cada host relevante. Após a inicialização, verifique os projetos no host certo, a estabilidade do ponto ao reabrir e a lista depois de reiniciar. Se a inicialização indicar erro de migração, preserve banco de dados e diagnóstico para investigação, em vez de eliminar o armazenamento para obter uma lista vazia.

Este trabalho torna visível a fronteira do projeto ao escolher onde trabalhar. Para separar históricos de código, leia [Genesis com vários repositórios: um objetivo, históricos separados](/pt-br/news/genesis-multi-repository).

[projects]: https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d
[store]: https://github.com/EMI-Group/genesis/blob/7383db2f1851c12bace5258bb7da44eab0571a72/apps/evo_git/lib/evo_git/vct.ex
[identity]: https://github.com/EMI-Group/genesis/blob/7383db2f1851c12bace5258bb7da44eab0571a72/apps/evo_git/lib/evo_git/vct/table.ex
[migration]: https://github.com/EMI-Group/genesis/commit/002d6ee324c29b1adbb009dbc38d625e674e70b9
[remote]: https://github.com/EMI-Group/genesis/commit/1eca4865be25f480573fd1df41b7a48fd9392700
