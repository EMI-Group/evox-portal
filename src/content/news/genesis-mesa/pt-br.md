---
title: "Genesis e MESA: reescrever o código, preservar o comportamento numérico"
pubDate: 2026-11-03
updatedDate: 2026-11-08
summary: "Treze módulos MESA tornaram-se um workspace Rust. Testes de referência e um proxy de combustão de uma zona mostram como verificar a continuidade numérica."
---

Reescrever software científico exige transmitir mais do que algoritmos. A nova implementação deve preservar o comportamento numérico do qual dependem os cálculos seguintes. No caso MESA do Genesis, treze módulos Fortran foram reconstruídos como crates Rust, usando as saídas originais como referência. O interesse está em tornar essa continuidade verificável.

![Resultados de Fortran e Rust comparados com uma lupa](./mesa-numerical-continuity.webp)

*Ilustração conceitual: uma nova implementação, uma referência numérica comum.*

## Treze módulos em uma cadeia numérica conectada

O [registro de 7 de setembro de 2026](https://genesis.evox.group/evidence/mesa/) cobre **13 módulos**, de **139.414 linhas Fortran para 89.946 linhas Rust**. São tamanhos do snapshot, não apenas do código de biblioteca.

O port inclui interpolação, solvers, redes de reação, equação de estado e opacidade. Não substitui todo o MESA: motores de evolução estelar e binária e outros componentes documentados ficam excluídos.

## Verificar o cálculo, não apenas a compilação

Cada módulo corresponde a um crate com interfaces e restrições documentadas. Testes de referência comparam saídas Fortran; testes de integração verificam interações.

A equivalência numérica precisa de tolerâncias e tarefas definidas. Um escalar igual pode ocultar um percurso diferente do solver; o repositório registra também passos de integração do proxy de combustão de uma zona. Isto informa mais do que compilar com sucesso.

## O que contém o registro dos testes

O repositório relata **1.052 testes aprovados, nenhuma falha e 18 ignorados**, incluindo benchmarks e uma combustão lenta de duração completa. Evidence registra **10,64 dólares de custo de tokens do modelo**, excluindo hardware; modelo, número de episódios e tempo decorrido não são especificados.

São resultados relatados pela fonte para uma única execução, sem reprodução independente. O escopo documentado de módulos e cargas oferece um ponto de partida concreto para examiná-los.

## Dois retratos, diferentes acelerações

[Evidence](https://genesis.evox.group/evidence/mesa/) reporta **1,55–6,87× de aceleração mediana**. A tabela README de 5 de agosto usa medianas de 15 execuções e dá **1,25×** para o proxy de combustão de uma zona de ponta a ponta. [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#latest-verified-results-2026-08-05-15-run-medians-taskset-0-3)

Para o proxy de combustão de uma zona, o README registra **199 passos de integração, 198 aceitos e 1 rejeitado** nas duas implementações. Comparar esse comportamento com as tolerâncias das saídas torna a medição mais informativa do que cronometrar cálculos com caminhos numéricos diferentes.

## Reproduzir uma carga antes de ampliar o escopo

O [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md) apresenta ferramentas, compilação, testes e benchmarks. Depois de preparar o ambiente:

```bash
cargo test --workspace
```

Escolha uma carga relevante e examine saídas de referência, tolerâncias e programas de benchmark no [repositório da reconstrução MESA](https://github.com/EMI-Group/genesis-demo-mesa-rs). A [apresentação do Genesis](/pt-br/news/evox-genesis) fornece o contexto do desenvolvimento com agentes; este caso permite verificar concretamente se a reescrita preservou o comportamento necessário.
