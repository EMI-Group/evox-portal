---
title: "EvoX v2.0.0a1: reescrito sobre o EvoX Compiler"
pubDate: 2026-10-30
summary: "Uma versão alfa experimental com uma nova API funcional e um compilador de grafos tensoriais explícitos. A série estável 1.x continua recomendada para produção."
---

![Estrutura do programa exposta para inspeção](./experimental-compiler-runtime.webp)

O **EvoX v2.0.0a1** é a primeira versão alfa de uma reescrita completa baseada no [EvoX Compiler (`evoxc`)](https://github.com/EMI-Group/evoxc).

> **Pré-lançamento experimental:** a nova API é incompatível com 1.x e não permite uma atualização direta. A série estável 1.x continua recomendada para produção. Experimente a alfa num ambiente separado.

## Um processo de compilação explícito

O EvoX Compiler permite inspecionar e transformar grafos tensoriais, separando rastreio, transformações do grafo, conversão para representações de nível inferior, compilação e execução. Disponibiliza transformações combináveis como `vectorize`/`vmap`, `grad`, `jvp`, `vjp` e `batch_functions`, com backends NumPy, IREE, TVM e XLA/PJRT. O StableHLO fornece uma fronteira comum de conversão para os backends compilados.

O EvoX 2.0 já não depende do PyTorch nem do JAX. O NumPy é a única dependência de execução obrigatória do EvoX Compiler; os backends compilados são opcionais.

## Nova API funcional

- Os algoritmos utilizam `init(config, key)` e `step(config, state, evaluate)`.
- Os problemas utilizam `evaluate(config, state, candidates)`.
- As configurações são imutáveis, o estado tensorial é explícito e a aleatoriedade utiliza chaves PRNG reproduzíveis.
- O `StdWorkflow` rastreia um passo evolutivo, compila-o com o backend escolhido e executa o ciclo de otimização.

## Incluído nesta alfa

- **32 classes de algoritmos** e **15 operadores evolutivos**.
- Benchmarks numéricos básicos, DTLZ, CEC2022 e neuroevolução virtual.
- Métricas GD, IGD e hipervolume; visualização Plotly e rastos `.exv`.
- Otimização de hiperparâmetros no host e descoberta de extensões através de `evox_ext`.

O lançamento original indica **552 testes aprovados no backend NumPy**. Isto não demonstra uma cobertura equivalente dos backends compilados ou das GPU.

## Instalação

Requer **Python 3.11+**. Num ambiente separado, escolha uma opção de instalação:

```bash
pip install --pre "evox==2.0.0a1"
```

Para adicionar suporte opcional a compiladores:

```bash
pip install --pre "evox[iree]==2.0.0a1"
pip install --pre "evox[compilers]==2.0.0a1"
```

## Limitações atuais

Os fluxos distribuídos, Brax/MuJoCo, a integração de redes neuronais PyTorch e os kernels Triton ainda não foram portados. Os backends compilados e a execução em GPU continuam experimentais; alguns operadores e padrões de controlo não são suportados em todos os backends. A monitorização, a visualização, as métricas e o HPO são atualmente executados fora dos grafos compilados. As API podem mudar durante os pré-lançamentos.

Pode enviar relatórios de erros, benchmarks e comentários sobre a API em [GitHub Issues](https://github.com/EMI-Group/evox/issues).

**Lançamento**: [v2.0.0a1](https://github.com/EMI-Group/evox/releases/tag/v2.0.0a1)
