---
title: "Genesis e MESA: Rastreando Diferenças Numéricas Através de uma Reescrita de Fortran para Rust"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "Precisão de interpolação, Jacobianos analíticos e benchmarks com entradas correspondentes mostram como treze módulos do MESA foram reconstruídos e verificados em Rust."
---

A reescrita de um software científico pode produzir respostas plausíveis, alterando, no entanto, o caminho numérico que as gerou. O caso do MESA no Genesis oferece verificações concretas para esse problema: saídas originais em Fortran, diferenças de ponto flutuante explicadas, contadores de passos do solver e benchmarks que comparam cargas de trabalho idênticas.

![Saídas de Fortran e Rust comparadas sob uma lupa](./mesa-numerical-continuity.webp)

*Ilustração de conceito: uma nova implementação verificada em relação ao comportamento numérico existente.*

O [registro do Evidence](https://genesis.evox.group/evidence/mesa/) relata treze módulos redesenvolvidos, 139.414 linhas de Fortran e 89.946 linhas de Rust. Os detalhes de engenharia abaixo vêm da [revisão de repositório 2ad071e](https://github.com/EMI-Group/genesis-demo-mesa-rs/tree/2ad071e658f8d4de21aa9f0e906592c364e10023), cujos benchmarks documentados datam de 5 de agosto de 2026. Esses resultados de benchmark mantêm suas próprias definições de carga de trabalho e cronometragem.

## Reconstruir uma cadeia de dependências, não treze traduções isoladas

O workspace segue a cadeia desde constantes, utilitários e matemática, passando por matrizes, interpolação e solvers numéricos, até química, taxas, perdas de neutrinos, redes de reações, equação de estado e opacidade. Cada módulo original possui um crate Rust correspondente. O [manifesto do workspace](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/Cargo.toml) torna explícitas essas relações entre pacotes.

Isso significa que uma tarefa de rede de reações depende de rotinas numéricas e dados de física que sejam utilizáveis em conjunto. APIs públicas e documentos de contexto por diretório fornecem o contrato de integração. A [visão geral do repositório](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#architecture--api-parity) descreve structs, métodos e valores `Result` em Rust, com os nomes originais em Fortran mantidos na documentação onde forem úteis para conferência cruzada.

A implementação inclui solvers em Rust em vez de chamar LAPACK ou BLAS via FFI. O escopo permanece na pilha numérica e de física selecionada: os motores completos de evolução estelar e binária, o blend total de EOS e outros componentes listados estão fora do port.

## Por que uma divergência de saída "golden" não foi resolvida com uma tolerância frouxa

O [teste golden de interpolação bidimensional](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-interp2d/tests/golden.rs) reconstrói a grade original de 31 por 35 e os pontos de avaliação. Ele distingue valores que coincidem exatamente de valores que necessitam de uma tolerância documentada.

A investigação do teste registra uma discrepância reveladora. Algumas variáveis temporárias da interpolação de Hermite no Fortran original eram implicitamente `REAL(4)`: precisão simples dentro de um cálculo que, de outra forma, seria de precisão superior. O port em Rust utiliza `f64`. Os comentários do código-fonte relatam que uma transcrição em Fortran explicitamente em precisão dupla coincidiu com o resultado em Rust, enquanto o caminho original de precisão mista reproduziu a saída golden mais antiga.

A maior diferença relativa registrada para esses valores de interpolação foi de cerca de 3,05e-8, com uma tolerância relativa de 1e-7. Outras quantidades mantêm comparações exatas ou tolerâncias muito mais estreitas. Essa é uma distinção de engenharia útil: o teste retém a origem de uma diferença numérica em vez de permitir que cada resultado derive sob um único limiar global. O bloco de teste `_sg` de precisão simples permanece fora do port.

## A rede de reações precisava tanto do caminho da derivada quanto do caminho do valor

As [notas de desenvolvimento da rede de reações](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-net/CONTEXT.md) descrevem o trabalho no Jacobiano analítico approx21, as derivadas usadas pelo solver stiff. Suas medições de antes/depois registradas mostram o checksum aproximando-se do Fortran e os contadores de integração atingindo uma correspondência exata.

Para a carga de trabalho de benchmark documentada, ambas as implementações atingiram **199 passos: 198 aceitos e 1 rejeitado**, com **8.889 avaliações de função e 199 avaliações de Jacobiano**. Esses contadores ajudam a detectar uma execução aparentemente mais rápida que simplesmente tomou um caminho de solver diferente.

Uma diferença residual de checksum de cerca de 3,1e-9 permaneceu. O [auxiliar de benchmark](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/common.py) atribui isso ao fato de o caminho de valor do Fortran usar precisão quádrupla, enquanto o Rust usa f64. O harness, portanto, utiliza uma tolerância de checksum relativa documentada de 1e-8; solicitar 1e-9 sinaliza deliberadamente esta carga de trabalho. A correspondência dos contadores de passos sustenta a comparação, enquanto a diferença no caminho do valor permanece explícita.

## Testes de integração também verificam se os módulos estão realmente conectados

Um [teste de integração de zona única](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/tests/one_zone_burn.rs) separado executa o burner com um provedor de gás ideal e com um provedor de tabela EOS através da interface pública `BurnEosInfo`. Ele espera que os dois cálculos difiram, verifica a conservação e saídas finitas, e valida que as chamadas de EOS equivalem à soma das avaliações de função e de Jacobiano.

Este é um teste de fiação com um limite físico específico: a temperatura de queima excede o máximo da tabela disponível, então a busca na EOS trava em sua linha superior. Ele demonstra que o provedor afeta o cálculo; não é uma validação de uma EOS estelar completa de alta temperatura. Seus contadores de passos também pertencem a este teste separado, não ao benchmark acima.

## Compare o mesmo trabalho antes de relatar um ganho de velocidade

A [especificação da carga de trabalho](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/bench-fortran/WORKLOADS.md) fixa entradas, tamanhos, parâmetros do solver e definições de checksum para ambas as linguagens. Por exemplo, o benchmark de interpolação avalia dois milhões de pontos determinísticos na mesma grade; a configuração está fora desse loop cronometrado.

O [orquestrador de benchmark](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/run_benchmarks.py) lê cronometragens internas do driver e checksums, compara-os e escreve um relatório. A tabela de 5 de agosto do README utiliza medianas de 15 execuções fixadas nas CPUs 0–3, comparando gfortran `-O3 -march=native` com o perfil de release do Rust.

| Carga de trabalho selecionada | Fortran | Rust | Speedup relatado |
| --- | --- | --- | --- |
| Dois milhões de avaliações bicúbicas | 0,162522 s | 0,090700 s | 1,79× |
| Dez mil resoluções de Newton | 0,057918 s | 0,009029 s | 6,41× |
| Proxy de queima approx21 de zona única | 0,303473 s | 0,243294 s | 1,25× |

Fonte: [tabela de benchmark versionada](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#latest-verified-results-2026-08-05-15-run-medians-taskset-0-3). A página do Evidence relata separadamente uma faixa mediana de 1,55–6,87×. Esses registros não estabelecem um speedup universal único, e o proxy de zona única não mede uma simulação estelar completa.

## Siga os pontos de entrada de testes e benchmarks

O repositório relata **1.052 aprovados, 0 reprovados e 18 ignorados**. Seu README identifica o conjunto ignorado como os benchmarks e a queima de duração total lenta. Em um ambiente Rust e Fortran preparado, os pontos de entrada documentados são:

```bash
cargo test --workspace
bash scripts/build_fortran_baselines.sh --all
python3 scripts/run_benchmarks.py --runs 15 --taskset-cpus 0-3
```

Estes são comandos documentados na fonte, não uma nova reprodução realizada para este artigo. O valor de US$ 10,64 do registro do Evidence cobre apenas tokens do modelo; o modelo, a contagem de episódios e o tempo de execução real não foram relatados.

Para uma primeira inspeção útil, leia o teste golden de interpolação junto com suas comparações de saída original e, em seguida, siga o contrato de entrada do benchmark. Esse caminho torna a reescrita avaliável por meio de comportamento numérico específico e trabalho medido.
