---
title: "Genesis Compiler Handoff: O que o Próximo Modelo Herda e Como a Continuidade é Verificada"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "Uma transferência de modelo retém uma linhagem de compilador aceite. O seu resultado reportado e as baterias de regressão do compilador público mostram o que pode ser verificado através dessa fronteira."
---

O [registo Evidence de 7 de setembro de 2026](https://genesis.evox.group/evidence/compiler-continuation/) descreve uma transferência de compilador do **GLM 5.2 para o DeepSeek V4 Flash**, sem carregar o contexto conversacional do agente anterior. A árvore de código aceite e a linhagem Git permaneceram disponíveis. A questão de engenharia reside no que o modelo recetor pode inspecionar e como as alterações subsequentes podem ser avaliadas.

![Um projeto de compilador retido entre diferentes conjuntos de ferramentas](./compiler-model-handoff.webp)

O registo reporta **1.820/1.820 casos LLVM SingleSource retidos com sucesso** após a continuidade e o crescimento da profundidade de recursão de tarefas de 4 para 8. Não publica uma transcrição por correção nem o volume de código adicionado e o custo da continuidade. As fontes públicas do jcc abaixo explicam as interfaces e os mecanismos de regressão do compilador; o seu snapshot separado não reconstitui a sequência exata das ações de transferência.

## Um compilador herdado possui fronteiras que um sucessor deve preservar

A [arquitetura jcc](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) separa o frontend, a representação intermédia CIR tipificada, o otimizador, o backend de código de máquina, o assembler e o driver de linha de comandos. O frontend entrega uma árvore sintática verificada à conversão; as fases posteriores consomem a representação resultante em vez de reinterpretarem o código fonte original de forma independente.

Isto é relevante quando um novo modelo altera um componente. Uma correção aritmética na conversão deve continuar a satisfazer a tipificação CIR; uma alteração na convenção de chamada deve concordar com a alocação de registos e a emissão de objetos. Estes são exemplos das dependências documentadas pela arquitetura, não afirmações sobre reparações específicas da transferência.

O driver expõe pontos de paragem intermédios: `-E` para pré-processamento, `-emit-jcc-ir` para CIR, `-S` para assembly e `-c` para emissão de objetos. Esses artefactos ajudam a localizar qual a fase que foi alterada antes de testar um executável ligado.

## As verificações de regressão cobrem programas bem-sucedidos e rejeições deliberadas

O [guia de testes](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/testing.md) descreve casos de compilação e execução que verificam o estado de saída e o output, a par de casos de falha de compilação que verificam a gravidade do diagnóstico, a mensagem e o intervalo no código fonte. As passagens de otimização também possuem verificações de verificação de representação.

Um sucessor tem, portanto, mais do que uma condição de aceitação. Gerar um executável é insuficiente se o seu output for alterado; aceitar um programa é insuficiente se a política da linguagem exigir a sua rejeição. Testar diagnósticos preserva o comportamento que um benchmark focado apenas no sucesso ignoraria.

O [README versionado](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/README.md#feature-status) lista limites concretos, tais como aritmética parcial de `long double` e alvos adiados. Esses limites são informações herdadas úteis: alterar uma rejeição documentada é uma decisão de funcionalidade, não automaticamente uma correção de regressão.

## O que o harness LLVM realmente compara

O [executor LLVM-suite](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/llvm-suite/run.py) público configura a suite com o compilador em teste, constrói executáveis e compara o seu output com ficheiros de referência. A sua comparação direta é baseada em tokens de espaço em branco: tokens não numéricos devem coincidir exatamente; tokens numéricos utilizam uma tolerância de vírgula flutuante configurável, por defeito 1e-4; o código de saída final deve coincidir exatamente.

Isto ilustra por que razão uma contagem de testes necessita de um manifesto e de uma política de comparação. O subconjunto Regression/C de 36 casos documentado no executor é um âmbito de avaliação diferente dos 1.820 casos retidos no registo de continuidade. O snapshot mais pequeno não pode ser utilizado para inferir a taxa de sucesso inicial da transferência, e subtrair os dois totais não mediria o progresso.

## Manter o resultado da transferência reportado associado ao seu âmbito

| Item | O que o registo de continuidade reporta |
| --- | --- |
| Transição de modelo | GLM 5.2 → DeepSeek V4 Flash |
| Contexto conversacional transportado | 0 |
| Estado do projeto preservado | Linhagem de compilador aceite |
| Profundidade de recursão de tarefas | 4 → 8 |
| Avaliação final | 1.820/1.820 casos LLVM SingleSource retidos |

Fonte: [GW-000002](https://genesis.evox.group/evidence/compiler-continuation/). Estes são resultados reportados pelo projeto de uma transferência. A profundidade de recursão descreve a decomposição de tarefas; o resultado do teste fornece a evidência comportamental.

Os registos iniciais do compilador e da continuidade ligam ao mesmo repositório. Não devem ser contados como dois projetos de compilador independentes, e os seus totais de testes com âmbitos diferentes devem permanecer separados.

## Tornar uma transferência inspecionável

Para um programador que aplique esta abordagem, um pacote de transferência útil consiste numa revisão aceite, comandos de build, contratos de interface, o manifesto exato de regressão e exclusões conhecidas. Esta é uma recomendação prática extraída da arquitetura e dos harnesses públicos, em vez de uma afirmação de que um pacote completo desta forma foi arquivado para a experiência.

Comece com uma pequena alteração e compare os seus artefactos intermédios, diagnósticos e comportamento do executável com essa revisão. A [vista de histórico de desenvolvimento Genesis](/news/genesis-development-history) fornece contexto relacionado para acompanhar contribuições após o agente que as realizou ter terminado.
