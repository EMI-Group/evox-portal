---
title: "6. Resolução de Problemas e Otimização"
order: 6
---

# 6. Resolução de Problemas e Otimização

Ao utilizar o EvoX, poderá encontrar problemas ou desejar ajustar os seus algoritmos. Este capítulo descreve problemas e soluções comuns, juntamente com estratégias de depuração e dicas de ajuste de desempenho para o ajudar a resolver questões e a otimizar a sua experiência.

---

## 6.1 Problemas Comuns e Soluções

Aqui estão alguns problemas encontrados frequentemente e como resolvê-los:

**(1) Erros de Instalação ou Importação**:

- **Sintoma**: Erro ao executar `import evox`.
- **Solução**:
  - **Verificar a instalação**: Execute `pip show evox` para verificar. Se não estiver instalado, verifique o seu ambiente virtual e reinstale.
  - **Dependências em falta**: Se vir `ModuleNotFoundError: No module named 'torch'`, instale o PyTorch conforme descrito no Capítulo 2.
  - **Incompatibilidade de CUDA**: Certifique-se de que a sua versão do PyTorch corresponde aos controladores CUDA instalados.

**(2) GPU Não Está a Ser Utilizada**:

- **Sintoma**: O EvoX está a ser executado no CPU em vez do GPU.
- **Solução**:
  - Verifique com `torch.cuda.is_available()`. Se for `False`, reinstale uma versão do PyTorch compatível com GPU e verifique a instalação do CUDA.
  - Se for `True` mas o EvoX continuar a utilizar o CPU, certifique-se de que os seus tensores são movidos para o GPU (consulte o Capítulo 3 para configuração).

**(3) Memória Esgotada (RAM/VRAM)**:

- **Sintoma**: Visualiza um `OutOfMemoryError`.
- **Solução**:
  - Reduza o tamanho da população, a dimensão do problema ou a frequência de avaliação.
  - Utilize float16 (meia precisão) ou divisão de avaliação por lotes (batch evaluation).
  - Desative os modos de depuração/determinísticos no PyTorch.
  - Armazene apenas estatísticas em vez de frentes de Pareto completas (para multi-objetivo).
  - A atualização do hardware é a solução definitiva para estrangulamentos de memória.

**(4) Estagnação da Convergência**:

- **Sintoma**: O algoritmo fica preso num ótimo local.
- **Solução**:
  - Aumente a diversidade da população (ex: taxa de mutação mais elevada).
  - Tente diferentes algoritmos ou parâmetros.
  - Certifique-se de que a função objetivo está bem definida (não demasiado ruidosa ou plana).
  - Execute várias tentativas e escolha a melhor — o EvoX facilita as execuções paralelas.

**(5) Resultados de Otimização Fracos**:

- **Sintoma**: Os resultados finais estão abaixo das expectativas.
- **Solução**:
  - **Verificar a definição do problema**: Certifique-se de que o fitness é calculado corretamente (ex: sinais, escala).
  - **Ajuste do algoritmo**: Tente outros ou ajuste os hiperparâmetros.
  - **Utilize curvas de convergência**:
    - Linha plana precoce → convergência prematura.
    - Oscilação → aleatoriedade demasiado elevada.
  - Ajuste as configurações do algoritmo e analise o comportamento ao longo do tempo.

**(6) Conflitos de Backend (JAX vs PyTorch)**:

- **Sintoma**: Instalou acidentalmente a versão JAX do EvoX enquanto utilizava exemplos de PyTorch.
- **Solução**: O `pip install evox` padrão fornece a versão PyTorch. Se instalou uma versão JAX, reinstale seguindo as instruções do PyTorch (consulte o Capítulo 2). As funcionalidades JAX estão documentadas separadamente.

**(7) Incompatibilidade de Versão**:

- **Sintoma**: As chamadas de API não correspondem à versão instalada.
- **Solução**:
  - As atualizações do EvoX podem alterar nomes de métodos (ex: `ask/tell` → `step`).
  - Utilize a versão estável mais recente e consulte a sua documentação.
  - Ajuste o código para alinhar com a sua versão do EvoX ou considere a atualização.

---

## 6.2 Dicas de Depuração

A depuração de algoritmos evolutivos pode ser complexa devido à sua natureza estocástica. Aqui estão algumas dicas práticas:

**(1) Utilize Testes em Pequena Escala**:

- Reduza o tamanho da população e a contagem de iterações para simplificar a depuração.
- Exemplo: `pop_size=5`, `iterations=20`.
- Torna mais fácil acompanhar o comportamento da população e isolar problemas.

**(2) Insira Instruções de Impressão (Print)**:

- Imprima o fitness da população, os melhores indivíduos e valores intermédios.
- Para tensores grandes, imprima as formas (shapes) ou utilize `.tolist()` para os mais pequenos.
- Ajuda a compreender a convergência e os efeitos dos operadores.

**(3) Utilize Breakpoints de IDE**:

- Utilize o PyCharm ou o VS Code para definir breakpoints dentro do `step()` do algoritmo ou da lógica de avaliação.
- Inspecione valores de variáveis, conteúdos de tensores ou transições de estado.
- Tenha cuidado com tensores grandes — limite o que inspeciona para evitar falhas.

**(4) Teste Unitário de Componentes Personalizados**:

- Teste as funções de cruzamento/mutação separadamente.
- Utilize entradas sintéticas para validar as formas de saída e a lógica antes da integração total.

**(5) Perfilagem (Profile) da Execução**:

- Utilize `torch.autograd.profiler.profile` ou `time.time()` para medir os tempos dos passos.
- Ajuda a localizar estrangulamentos ou loops infinitos.
- Identifique se os abrandamentos estão na avaliação ou na lógica do algoritmo.

**(6) Registe a Saída num Ficheiro (Log)**:

- Escreva logs em ficheiros `.csv` para execuções longas.
- Inclua o melhor fitness por geração, estatísticas de diversidade, etc.
- Útil quando falhas inesperadas impedem a visualização da saída na consola.

No geral, a depuração de projetos EvoX requer um equilíbrio entre verificações de correção e análise de resultados. Foque-se primeiro em garantir que o algoritmo corre corretamente e, depois, otimize a sua eficácia.

---

## 6.3 Guia de Ajuste de Desempenho

Estas dicas ajudam-no a extrair mais velocidade e qualidade do EvoX:

**(1) Escalonamento Progressivo**:

- **Comece pequeno**: Teste a lógica com entradas pequenas.
- **Aumente gradualmente** e observe como o tempo de execução aumenta.
- **Identifique ineficiências** se o escalonamento for não linear (ex: 10x população → >10x tempo).

**(2) Monitorize a Utilização do Hardware**:

- Utilize `nvidia-smi` para GPU, `htop` para CPU.
- Uma utilização elevada do GPU (>50%) é o ideal.
- Uma utilização baixa do GPU pode significar que os dados não estão no GPU ou que transferências frequentes entre CPU-GPU estão a abrandar o processo.

**(3) Ajuste o Paralelismo**:

- Defina as threads do CPU: `torch.set_num_threads(n)`.
- Evite a sobre-subscrição se utilizar ferramentas de avaliação multi-threaded.
- Para GPU, otimize as threads do `DataLoader` se utilizar ambientes ou conjuntos de dados em lote.

**(4) Aproveite a Avaliação por Lotes (Batch Evaluation)**:

- A avaliação por lotes é mais rápida do que a avaliação por indivíduo.
- Vetorize sempre o `Problem.evaluate()` para processar populações inteiras.

**(5) Reduza a Sobrecarga (Overhead) do Python**:

- Mova a lógica pesada para dentro do `Algorithm` ou `Problem`, evite código Python complexo no loop principal.
- Utilize `workflow.step()` para a maioria das operações.
- Minimize os diagnósticos por geração se estes abrandarem as execuções.

**(6) Ajuste a Escolha do Algoritmo**:

- Tente CMA-ES, GA, PSO, RVEA, etc. — nenhum algoritmo é o melhor para todos os problemas.
- Um algoritmo que convirja mais rapidamente pode poupar mais tempo do que a micro-otimização de um que convirja lentamente.

O ajuste de desempenho é iterativo. Com paciência, pode passar de horas de execução para minutos. O EvoX oferece-lhe vários "botões" — utilize-os sabiamente para equilibrar a velocidade e a qualidade da solução.