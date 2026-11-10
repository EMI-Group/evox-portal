---
title: "Handoff do Compilador Genesis: O que o Próximo Modelo Herda e Como a Continuidade é Verificada"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "Um handoff de modelo retém uma linhagem de compilador aceita. Seu resultado relatado e os harnesses de regressão do compilador público mostram o que pode ser verificado através dessa fronteira."
---

O [registro Evidence de 7 de setembro de 2026](https://genesis.evox.group/evidence/compiler-continuation/) descreve um handoff de compilador do **GLM 5.2 para o DeepSeek V4 Flash**, sem carregar o contexto conversacional do agente anterior. A árvore de fontes aceita e a linhagem do Git permaneceram disponíveis. A questão de engenharia é o que o modelo receptor pode inspecionar e como as mudanças subsequentes podem ser avaliadas.

![Um projeto de compilador retido entre diferentes conjuntos de ferramentas](./compiler-model-handoff.webp)

O registro relata **1.820/1.820 casos LLVM SingleSource retidos passando** após a continuidade e a profundidade de recursão de tarefa crescendo de 4 para 8. Ele não publica uma transcrição por correção ou o volume de código adicionado e o custo da continuidade. As fontes públicas do jcc abaixo explicam as interfaces e os mecanismos de regressão do compilador; seu snapshot separado não reconstrói a sequência exata de ações do handoff.

## Um compilador herdado possui fronteiras que um sucessor deve preservar

A [arquitetura jcc](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) separa o frontend, a representação intermediária CIR tipada, o otimizador, o backend de código de máquina, o assembler e o driver de linha de comando. O frontend entrega uma árvore sintática verificada para o lowering; os estágios posteriores consomem a representação resultante em vez de reinterpretar a fonte original de forma independente.

Isso importa quando um novo modelo altera um componente. Uma correção aritmética no lowering ainda deve satisfazer a tipagem CIR; uma mudança na convenção de chamada deve concordar com a alocação de registradores e a emissão de objetos. Estes são exemplos das dependências documentadas pela arquitetura, não afirmações sobre reparos específicos do handoff.

O driver expõe pontos de parada intermediários: `-E` para pré-processamento, `-emit-jcc-ir` para CIR, `-S` para assembly e `-c` para emissão de objeto. Esses artefatos ajudam a localizar qual estágio mudou antes de testar um executável vinculado.

## Verificações de regressão cobrem programas bem-sucedidos e rejeição deliberada

O [guia de testes](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/testing.md) descreve casos de compilação e execução que verificam o status de saída e a saída (output), juntamente com casos de falha de compilação que verificam a severidade do diagnóstico, a mensagem e o intervalo da fonte. Passagens de otimização também possuem verificações de verificação de representação.

Um sucessor, portanto, possui mais de uma condição de aceitação. Gerar um executável é insuficiente se sua saída mudar; aceitar um programa é insuficiente se a política da linguagem exigir sua rejeição. Testar diagnósticos preserva o comportamento que um benchmark apenas de sucesso perderia.

O [README versionado](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/README.md#feature-status) lista limites concretos, como aritmética `long double` parcial e alvos adiados. Esses limites são informações herdadas úteis: alterar uma rejeição documentada é uma decisão de recurso, não automaticamente uma correção de regressão.

## O que o harness LLVM realmente compara

O [executor da suíte LLVM](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/llvm-suite/run.py) público configura a suíte com o compilador em teste, constrói executáveis e compara sua saída com arquivos de referência. Sua comparação direta é baseada em tokens de espaço em branco: tokens não numéricos devem corresponder exatamente; tokens numéricos usam uma tolerância de ponto flutuante configurável, com padrão de 1e-4; o código de saída final deve corresponder exatamente.

Isso ilustra por que uma contagem de testes precisa de um manifesto e de uma política de comparação. O subconjunto Regression/C de 36 casos documentado do executor é um escopo de avaliação diferente do registro de 1.820 casos retidos da continuidade. O snapshot menor não pode ser usado para inferir a taxa de aprovação inicial do handoff, e subtrair os dois totais não mediria o progresso.

## Mantenha o resultado do handoff relatado anexado ao seu escopo

| Item | O que o registro de continuidade relata |
| --- | --- |
| Transição de modelo | GLM 5.2 → DeepSeek V4 Flash |
| Contexto conversacional carregado | 0 |
| Estado do projeto preservado | Linhagem de compilador aceita |
| Profundidade de recursão de tarefa | 4 → 8 |
| Avaliação final | 1.820/1.820 casos LLVM SingleSource retidos |

Fonte: [GW-000002](https://genesis.evox.group/evidence/compiler-continuation/). Estes são resultados relatados pelo projeto de um handoff. A profundidade de recursão descreve a decomposição de tarefas; o resultado do teste fornece a evidência comportamental.

Os registros do compilador inicial e da continuidade vinculam o mesmo repositório. Eles não devem ser contados como dois projetos de compilador independentes, e seus totais de testes com escopos diferentes devem permanecer separados.

## Torne um handoff inspecionável

Para um desenvolvedor que aplica essa abordagem, um pacote de handoff útil consiste em uma revisão aceita, comandos de build, contratos de interface, o manifesto de regressão exato e exclusões conhecidas. Essa é uma recomendação prática extraída da arquitetura e dos harnesses públicos, em vez de uma afirmação de que um pacote completo desta forma foi arquivado para o experimento.

Comece com uma pequena mudança e compare seus artefatos intermediários, diagnósticos e comportamento do executável contra essa revisão. A [visualização do histórico de desenvolvimento do Genesis](/news/genesis-development-history) fornece contexto relacionado para acompanhar as contribuições após o término do agente que as fez.
