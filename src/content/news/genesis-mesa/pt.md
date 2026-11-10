---
title: "Genesis e MESA: Rastreando Diferenças Numéricas Através de uma Reescrita de Fortran para Rust"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "Precisão de interpolação, Jacobianos analíticos e benchmarks com entradas correspondentes mostram como treze módulos MESA foram reconstruídos e verificados em Rust."
---

A reescrita de software científico pode produzir respostas plausíveis, alterando simultaneamente o percurso numérico que as gerou. O caso MESA da Genesis oferece verificações concretas para esse problema: saídas originais em Fortran, diferenças de ponto flutuante explicadas, contadores de passos do solver e benchmarks que comparam cargas de trabalho idênticas.

![Saídas de Fortran e Rust comparadas sob uma lupa](./mesa-numerical-continuity.webp)

*Ilustração conceptual: uma nova implementação verificada contra o comportamento numérico existente.*

O [registo Evidence](https://genesis.evox.group/evidence/mesa/) reporta treze módulos redesenvolvidos, 139.414 linhas de Fortran e 89.946 linhas de Rust. Os detalhes de engenharia abaixo provêm da [revisão do repositório 2ad071e](https://github.com/EMI-Group/genesis-demo-mesa-rs/tree/2ad071e658f8d4de21aa9f0e906592c364e10023), cujos benchmarks documentados datam de 5 de agosto de 2026. Esses resultados de benchmark retêm as suas próprias definições de carga de trabalho e temporização.

## Reconstruir uma cadeia de dependências, não treze traduções isoladas

O workspace segue a cadeia desde constantes, utilitários e matemática, passando por matrizes, interpolação e solvers numéricos, até à química, taxas, perdas de neutrinos, redes de reações, equação de estado e opacidade. Cada módulo original tem uma crate Rust correspondente. O [manifesto do workspace](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/Cargo.toml) torna explícitas essas relações entre pacotes.

Isto significa que uma tarefa de rede de reações depende de rotinas numéricas e dados físicos que possam ser utilizados em conjunto. APIs públicas e documentos de contexto por diretório fornecem o contrato de integração. A [visão geral do repositório](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#architecture--api-parity) descreve structs, métodos e valores `Result` em Rust, mantendo os nomes originais em Fortran na documentação onde for útil para verificação cruzada.

A implementação inclui solvers em Rust em vez de chamar LAPACK ou BLAS via FFI. O âmbito permanece na stack numérica e física selecionada: os motores completos de evolução estelar e binária, o blend total de EOS e outros componentes listados estão fora do port.

## Por que um desvio na saída de referência não foi resolvido com uma tolerância folgada

O [teste de referência de interpolação bidimensional](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-interp2d/tests/golden.rs) reconstrói a grelha original de 31 por 35 e os pontos de avaliação. Este distingue valores que coincidem exatamente de valores que necessitam de uma tolerância documentada.

A investigação do teste regista uma discrepância reveladora. Algumas variáveis temporárias originais da interpolação de Hermite em Fortran eram implicitamente `REAL(4)`: precisão simples dentro de um cálculo que, de outra forma, seria de maior precisão. O port em Rust utiliza `f64`. Os comentários no código reportam que uma transcrição explícita em precisão dupla no Fortran coincidiu com o resultado em Rust, enquanto o percurso original de precisão mista reproduziu a saída de referência mais antiga.

A maior diferença relativa registada para esses valores de interpolação foi de cerca de 3.05e-8, com uma tolerância relativa de 1e-7. Outras quantidades mantêm comparações exatas ou tolerâncias muito mais estreitas. Esta é uma distinção de engenharia útil: o teste retém a origem de uma diferença numérica em vez de permitir que todos os resultados derivem sob um único limiar global. O bloco de teste `_sg` de precisão simples permanece fora do port.

## A rede de reações necessitava tanto do percurso das derivadas como do percurso dos valores

As [notas de desenvolvimento da rede de reações](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-net/CONTEXT.md) descrevem o trabalho no Jacobiano analítico approx21, as derivadas utilizadas pelo stiff solver. As suas medições antes/depois registadas mostram o checksum a aproximar-se do Fortran e os contadores de integração a atingirem uma correspondência exata.

Para a carga de trabalho de benchmark documentada, ambas as implementações atingiram **199 passos: 198 aceites e 1 rejeitado**, com **8.889 avaliações de função e 199 avaliações de Jacobiano**. Estes contadores ajudam a detetar uma execução aparentemente mais rápida que simplesmente tomou um percurso de solver diferente.

Restou uma diferença residual de checksum de cerca de 3.1e-9. O [auxiliar de benchmark](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/common.py) atribui isto ao facto de o percurso de valor em Fortran utilizar precisão quádrupla enquanto o Rust utiliza f64. O sistema de teste utiliza, portanto, uma tolerância de checksum relativa documentada de 1e-8; solicitar 1e-9 sinaliza deliberadamente esta carga de trabalho. A correspondência dos contadores de passos sustenta a comparação, enquanto a diferença no percurso de valor permanece explícita.

## Testes de integração também verificam se os módulos estão realmente ligados

Um [teste de integração de uma zona](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/tests/one_zone_burn.rs) separado executa o burner com um fornecedor de gás ideal e com um fornecedor de tabela EOS através da interface pública `BurnEosInfo`. Espera-se que os dois cálculos difiram, verifica a conservação e saídas finitas, e valida que as chamadas EOS igualam a soma das avaliações de função e do Jacobiano.

Este é um teste de ligação com uma fronteira física específica: a temperatura de combustão excede o máximo da tabela disponível, pelo que a consulta EOS fixa-se na sua linha superior. Demonstra que o fornecedor afeta o cálculo; não é uma validação de uma EOS estelar completa de alta temperatura. As suas contagens de passos também pertencem a este teste separado, não ao benchmark acima.

## Comparar o mesmo trabalho antes de reportar um ganho de velocidade

A [especificação da carga de trabalho](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/bench-fortran/WORKLOADS.md) fixa entradas, tamanhos, parâmetros do solver e definições de checksum para ambas as linguagens. Por exemplo, o benchmark de interpolação avalia dois milhões de pontos determinísticos na mesma grelha; a configuração está fora desse loop temporizado.

O [orquestrador de benchmark](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/run_benchmarks.py) lê temporizações internas e checksums do driver, compara-os e escreve um relatório. A tabela de 5 de agosto no README utiliza medianas de 15 execuções fixadas nos CPUs 0–3, comparando gfortran `-O3 -march=native` com o perfil de release de Rust.

| Carga de trabalho selecionada | Fortran | Rust | Ganho de velocidade reportado |
| --- | --- | --- | --- |
| Dois milhões de avaliações bicúbicas | 0,162522 s | 0,090700 s | 1,79× |
| Dez mil resoluções de Newton | 0,057918 s | 0,009029 s | 6,41× |
| Proxy de combustão approx21 de uma zona | 0,303473 s | 0,243294 s | 1,25× |

Fonte: [tabela de benchmark versionada](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#latest-verified-results-2026-08-05-15-run-medians-taskset-0-3). A página Evidence reporta separadamente um intervalo de mediana de 1,55–6,87×. Estes registos não estabelecem um ganho de velocidade universal, e o proxy de uma zona não mede uma simulação estelar completa.

## Seguir os pontos de entrada de testes e benchmarks

O repositório reporta **1.052 aprovados, 0 falhados e 18 ignorados**. O seu README identifica o conjunto ignorado como sendo os benchmarks e a combustão lenta de duração total. Num ambiente Rust e Fortran preparado, os pontos de entrada documentados são:

```bash
cargo test --workspace
bash scripts/build_fortran_baselines.sh --all
python3 scripts/run_benchmarks.py --runs 15 --taskset-cpus 0-3
```

Estes são comandos documentados na fonte, não uma nova reprodução realizada para este artigo. O custo de US$10,64 no registo Evidence cobre apenas tokens do modelo; o modelo, a contagem de episódios e o tempo de execução real não foram reportados.

Para uma primeira inspeção útil, leia o teste de referência de interpolação juntamente com as suas comparações de saída original e, em seguida, siga o contrato de entrada do benchmark. Esse percurso torna a reescrita avaliável através de comportamento numérico específico e trabalho medido.
