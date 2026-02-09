---
title: "6. Solução de Problemas e Otimização"
order: 6
---

# 6. Solução de Problemas e Otimização

Ao usar o EvoX, você pode encontrar problemas ou desejar ajustar seus algoritmos. Este capítulo descreve problemas e soluções comuns, juntamente com estratégias de depuração e dicas de ajuste de desempenho para ajudá-lo a resolver problemas e otimizar sua experiência.

---

## 6.1 Problemas Comuns e Soluções

Aqui estão alguns problemas encontrados com frequência e como resolvê-los:

**(1) Erros de Instalação ou Importação**:

- **Sintoma**: Erro ao executar `import evox`.
- **Solução**:
  - **Verifique a instalação**: Execute `pip show evox` para verificar. Se não estiver instalado, verifique seu ambiente virtual e reinstale.
  - **Dependências ausentes**: Se você vir `ModuleNotFoundError: No module named 'torch'`, instale o PyTorch conforme descrito no Capítulo 2.
  - **Incompatibilidade de CUDA**: Certifique-se de que sua versão do PyTorch corresponde aos drivers CUDA instalados.

**(2) GPU Não Está Sendo Utilizada**:

- **Sintoma**: O EvoX está rodando na CPU em vez da GPU.
- **Solução**:
  - Verifique com `torch.cuda.is_available()`. Se for `False`, reinstale um PyTorch compatível com GPU e verifique a instalação do CUDA.
  - Se for `True`, mas o EvoX ainda usar a CPU, certifique-se de que seus tensores foram movidos para a GPU (consulte o Capítulo 3 para configuração).

**(3) Memória Esgotada (RAM/VRAM)**:

- **Sintoma**: Você vê um `OutOfMemoryError`.
- **Solução**:
  - Reduza o tamanho da população, a dimensão do problema ou a frequência de avaliação.
  - Use float16 (meia precisão) ou divisão de avaliação em lotes (batch evaluation splitting).
  - Desative os modos de depuração/determinísticos no PyTorch.
  - Armazene apenas estatísticas em vez de frentes de Pareto completas (para multi-objetivo).
  - O upgrade de hardware é a solução definitiva para gargalos de memória.

**(4) Estagnação da Convergência**:

- **Sintoma**: O algoritmo fica preso em um ótimo local.
- **Solução**:
  - Aumente a diversidade da população (ex: taxa de mutação mais alta).
  - Tente algoritmos ou parâmetros diferentes.
  - Certifique-se de que a função objetivo esteja bem definida (não muito ruidosa ou plana).
  - Execute várias tentativas e escolha a melhor — o EvoX facilita as execuções paralelas.

**(5) Resultados de Otimização Ruins**:

- **Sintoma**: Os resultados finais estão abaixo das expectativas.
- **Solução**:
  - **Verifique a definição do problema**: Certifique-se de que o fitness é calculado corretamente (ex: sinais, escala).
  - **Ajuste do algoritmo**: Tente outros ou ajuste os hiperparâmetros.
  - **Use curvas de convergência**:
    - Linha reta (flatline) precoce → convergência prematura.
    - Oscilação → aleatoriedade muito alta.
  - Ajuste as configurações do algoritmo e analise o comportamento ao longo do tempo.

**(6) Conflitos de Backend (JAX vs PyTorch)**:

- **Sintoma**: Instalou acidentalmente a versão JAX do EvoX enquanto usava exemplos de PyTorch.
- **Solução**: O comando padrão `pip install evox` fornece a versão PyTorch. Se você instalou uma versão JAX, reinstale usando as instruções do PyTorch (veja o Capítulo 2). Os recursos do JAX são documentados separadamente.

**(7) Incompatibilidade de Versão**:

- **Sintoma**: As chamadas de API não correspondem à versão instalada.
- **Solução**:
  - As atualizações do EvoX podem alterar nomes de métodos (ex: `ask/tell` → `step`).
  - Use a versão estável mais recente e consulte sua documentação.
  - Ajuste o código para alinhar com sua versão do EvoX ou considere a atualização.

---

## 6.2 Dicas de Depuração

Depurar algoritmos evolutivos pode ser complicado devido à sua natureza estocástica. Aqui estão algumas dicas práticas:

**(1) Use Testes em Pequena Escala**:

- Reduza o tamanho da população e a contagem de iterações para simplificar a depuração.
- Exemplo: `pop_size=5`, `iterations=20`.
- Facilita o acompanhamento do comportamento da população e o isolamento de problemas.

**(2) Insira Comandos de Impressão (Print)**:

- Imprima o fitness da população, os melhores indivíduos e valores intermediários.
- Para tensores grandes, imprima os formatos (shapes) ou use `.tolist()` para os menores.
- Ajuda a entender a convergência e os efeitos dos operadores.

**(3) Use Breakpoints da IDE**:

- Use PyCharm ou VS Code para definir breakpoints dentro do `step()` do algoritmo ou da lógica de avaliação.
- Inspecione valores de variáveis, conteúdo de tensores ou transições de estado.
- Tenha cuidado com tensores grandes — limite o que você inspeciona para evitar travamentos.

**(4) Teste Unitário de Componentes Personalizados**:

- Teste as funções de crossover/mutação separadamente.
- Use entradas sintéticas para validar os formatos de saída e a lógica antes da integração total.

**(5) Perfilamento (Profiling) da Execução**:

- Use `torch.autograd.profiler.profile` ou `time.time()` para medir o tempo das etapas.
- Ajuda a localizar gargalos ou loops infinitos.
- Identifique se as lentidões estão na avaliação ou na lógica do algoritmo.

**(6) Registre a Saída em Arquivo (Log)**:

- Escreva logs em arquivos `.csv` para execuções longas.
- Inclua o melhor fitness por geração, estatísticas de diversidade, etc.
- Útil quando travamentos impedem que a saída do console seja visualizada.

No geral, a depuração de projetos EvoX requer um equilíbrio entre verificações de correção e análise de resultados. Concentre-se primeiro em garantir que o algoritmo funcione corretamente e, em seguida, otimize sua eficácia.

---

## 6.3 Guia de Ajuste de Desempenho

Estas dicas ajudam você a extrair mais velocidade e qualidade do EvoX:

**(1) Escalonamento Progressivo**:

- **Comece pequeno**: Teste a lógica com entradas pequenas.
- **Aumente a escala** gradualmente e observe como o tempo de execução aumenta.
- **Identifique ineficiências** se o escalonamento for não linear (ex: 10x população → >10x tempo).

**(2) Monitore o Uso do Hardware**:

- Use `nvidia-smi` para GPU, `htop` para CPU.
- Uma utilização alta de GPU (>50%) é o ideal.
- O baixo uso de GPU pode significar que os dados não estão na GPU ou que transferências frequentes entre CPU-GPU estão atrasando as coisas.

**(3) Ajuste o Paralelismo**:

- Defina as threads da CPU: `torch.set_num_threads(n)`.
- Evite a sobrecarga de recursos (oversubscription) se estiver usando ferramentas de avaliação multi-threaded.
- Para GPU, otimize as threads do `DataLoader` se estiver usando ambientes em lote ou conjuntos de dados.

**(4) Aproveite a Avaliação em Lote (Batch Evaluation)**:

- A avaliação em lote é mais rápida do que a avaliação por indivíduo.
- Sempre vetorize `Problem.evaluate()` para processar populações inteiras.

**(5) Reduza o Overhead do Python**:

- Mova a lógica pesada para dentro do `Algorithm` ou `Problem`, evite código Python complexo no loop principal.
- Use `workflow.step()` para a maioria das operações.
- Minimize os diagnósticos por geração se eles retardarem as execuções.

**(6) Ajuste a Escolha do Algoritmo**:

- Tente CMA-ES, GA, PSO, RVEA, etc. — nenhum algoritmo único é o melhor para todos os problemas.
- Um algoritmo que converge mais rápido pode economizar mais tempo do que micro-otimizar um que converge lentamente.

O ajuste de desempenho é iterativo. Com paciência, você pode passar de horas de execução para minutos. O EvoX oferece muitos "ajustes" — use-os com sabedoria para equilibrar velocidade e qualidade da solução.