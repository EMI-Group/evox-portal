---
title: "Genesis e MESA: fazer evoluir o software do cálculo científico"
pubDate: 2026-11-03
updatedDate: 2026-11-07
summary: "A reconstrução em Rust de módulos MESA selecionados liga desenvolvimento agêntico, preservação e modernização do software científico."
---

*Atualizado a 7 de novembro de 2026. Os resultados históricos mantêm a data de referência.*

A descoberta científica depende de software que preserva métodos numéricos e conhecimento acumulado. A reconstrução de módulos MESA com Genesis liga Agentic AI a esta base de AI for Science: melhorar a implementação, usando o comportamento numérico existente como referência do que deve ser preservado.

## Uma tarefa delimitada

O [registo de 7 de setembro de 2026](https://genesis.evox.group/evidence/mesa/) cobre **13 módulos**, de **139.414 linhas Fortran para 89.946 linhas Rust**. São tamanhos do snapshot, não apenas do código de biblioteca.

O port inclui interpolação, solvers, redes de reação, equação de estado e opacidade. Não substitui todo o MESA: motores de evolução estelar e binária e outros componentes documentados ficam excluídos.

## Verificar antes de medir velocidade

Cada módulo corresponde a um crate com interfaces e restrições documentadas. Testes de referência comparam saídas Fortran; testes de integração verificam interações.

A equivalência numérica precisa de tolerâncias e tarefas definidas. Um escalar igual pode ocultar um percurso diferente do solver; o repositório regista também passos de integração do proxy de combustão de uma zona. Isto informa mais do que compilar com sucesso.

## Validação reportada

O repositório indica **1.052 testes aprovados, zero falhas e 18 ignorados**. As exclusões devem ficar visíveis. Os **10,64 dólares americanos** cobrem tokens sem hardware; modelo, episódios e duração não foram reportados.

São resultados do projeto, não uma reprodução independente. Cobrem o port e os testes descritos, não todos os fluxos científicos do MESA.

## Separar os benchmarks

Evidence reporta **1,55–6,87× de aceleração mediana**. A tabela README de 5 de agosto usa medianas de 15 execuções e dá **1,25×** para o proxy de combustão de uma zona de ponta a ponta. Não devem ser fundidos numa aceleração universal.

Compare tarefas, dados, opções de compilação e tolerâncias iguais. Um núcleo de interpolação mais rápido não implica o mesmo fator numa simulação estelar completa.

## Um caminho para modernizar o software científico

O [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/main/README.md) apresenta ferramentas, compilação, testes e benchmarks. Depois de preparar o ambiente:

```bash
cargo test --workspace
```

O [repositório de reconstrução MESA](https://github.com/EMI-Group/genesis-demo-mesa-rs) mostra como o desenvolvimento agêntico pode dar continuidade à história do software científico. Para o EvoX, a direção é tornar esta infraestrutura adaptável, preservando um comportamento científico verificável. A expansão além dos módulos apresentados exige validação adicional do domínio.
