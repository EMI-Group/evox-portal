---
title: "6. Resolução de Problemas e Otimização"
order: 6
---

# 6. Resolução de Problemas e Otimização

Ao utilizar o EvoX, poderá encontrar problemas ou querer ajustar os seus algoritmos. Este capítulo descreve problemas comuns e soluções, juntamente com estratégias de depuração e dicas de ajuste de desempenho para o ajudar a resolver problemas e otimizar a sua experiência.

---

## 6.1 Problemas Comuns e Soluções

Aqui estão alguns problemas frequentemente encontrados e como resolvê-los:

**(1) Erros de Instalação ou Importação**:

- **Sintoma**: Erro ao executar `import evox`.
- **Solução**:
  - **Verificar a instalação**: Execute `pip show evox` para verificar. Se não estiver instalado, verifique o seu ambiente virtual e reinstale.
  - **Dependências em falta**: Se vir `ModuleNotFoundError: No module named 'torch'`, instale o PyTorch conforme descrito no Capítulo 2.
  - **Incompatibilidade CUDA**: Certifique-se de que a sua versão do PyTorch corresponde aos drivers CUDA instalados.

**(2) GPU Não Está a Ser Utilizada**:

- **Sintoma**: O EvoX está a executar no CPU em vez da GPU.
- **Solução**:
  - Verifique com `torch.cuda.is_available()`. Se `False`, reinstale um PyTorch compatível com GPU e verifique a instalação CUDA.
  - Se `True` mas o EvoX ainda utiliza o CPU, certifique-se de que os seus tensores são movidos para a GPU (consulte o Capítulo 3 para configuração).

**(3) Memória Insuficiente (RAM/VRAM)**:

- **Sintoma**: Vê `OutOfMemoryError`.
- **Solução**:
  - Reduza o tamanho da população, a dimensão do problema ou a frequência de avaliação.
  - Utilize float16 (meia precisão) ou divisão de avaliação em lotes.
  - Desative os modos de depuração/determinísticos no PyTorch.
  - Armazene apenas estatísticas em vez de frentes de Pareto completas (para multi-objetivo).
  - A atualização do hardware é a solução definitiva para gargalos de memória.

**(4) Estagnação da Convergência**:

- **Sintoma**: O algoritmo fica preso num ótimo local.
- **Solução**:
  - Aumente a diversidade da população (por exemplo, taxa de mutação mais alta).
  - Tente diferentes algoritmos ou parâmetros.
  - Certifique-se de que a função objetivo está bem definida (não demasiado ruidosa ou plana).
  - Execute múltiplas tentativas e escolha a melhor — o EvoX facilita execuções paralelas.

**(5) Resultados de Otimização Fracos**:

- **Sintoma**: Os resultados finais estão abaixo das expectativas.
- **Solução**:
  - **Verificar a definição do problema**: Certifique-se de que a aptidão é calculada corretamente (por exemplo, sinais, escala).
  - **Adequação do algoritmo**: Tente outros ou ajuste hiperparâmetros.
  - **Utilizar curvas de convergência**:
    - Estabilização precoce -> convergência prematura.
    - Oscilação -> aleatoriedade demasiado alta.
  - Ajuste as definições do algoritmo e analise o comportamento ao longo do tempo.

**(6) Conflitos de Backend (JAX vs PyTorch)**:

- **Sintoma**: Instalou acidentalmente a versão JAX do EvoX enquanto utiliza exemplos PyTorch.
- **Solução**: O `pip install evox` padrão dá-lhe a versão PyTorch. Se instalou uma versão JAX, reinstale utilizando as instruções do PyTorch (consulte o Capítulo 2). As funcionalidades JAX estão documentadas separadamente.

**(7) Incompatibilidade de Versão**:

- **Sintoma**: As chamadas de API não correspondem à versão instalada.
- **Solução**:
  - As atualizações do EvoX podem alterar nomes de métodos (por exemplo, `ask/tell` -> `step`).
  - Utilize a versão estável mais recente e consulte a sua documentação.
  - Ajuste o código para alinhar com a sua versão do EvoX ou considere atualizar.

---

## 6.2 Dicas de Depuração

A depuração de algoritmos evolutivos pode ser complicada devido à sua natureza estocástica. Aqui estão dicas práticas:

**(1) Utilizar Testes em Pequena Escala**:

- Reduza o tamanho da população e a contagem de iterações para simplificar a depuração.
- Exemplo: `pop_size=5`, `iterations=20`.
- Torna mais fácil acompanhar o comportamento da população e isolar problemas.

**(2) Inserir Instruções de Impressão**:

- Imprima a aptidão da população, os melhores indivíduos e valores intermédios.
- Para tensores grandes, imprima formas ou utilize `.tolist()` para os mais pequenos.
- Ajuda a compreender a convergência e os efeitos dos operadores.

**(3) Utilizar Pontos de Interrupção do IDE**:

- Utilize PyCharm ou VS Code para definir pontos de interrupção dentro do `step()` do algoritmo ou da lógica de avaliação.
- Inspecione valores de variáveis, conteúdos de tensores ou transições de estado.
- Tenha cuidado com tensores grandes — limite o que inspeciona para evitar falhas.

**(4) Testar Unitariamente Componentes Personalizados**:

- Teste funções de cruzamento/mutação separadamente.
- Utilize entradas sintéticas para validar formas de saída e lógica antes da integração completa.

**(5) Analisar a Execução**:

- Utilize `torch.autograd.profiler.profile` ou `time.time()` para medir tempos de passos.
- Ajuda a localizar gargalos ou ciclos infinitos.
- Identifique se as lentidões estão na avaliação ou na lógica do algoritmo.

**(6) Registar Saída em Ficheiro**:

- Escreva registos em ficheiros `.csv` para execuções longas.
- Inclua a melhor aptidão por geração, estatísticas de diversidade, etc.
- Útil quando falhas impedem que a saída da consola seja vista.

No geral, a depuração de projetos EvoX requer um equilíbrio entre verificações de correção e análise de resultados. Concentre-se primeiro em garantir que o algoritmo executa corretamente, depois otimize a sua eficácia.

---

## 6.3 Guia de Ajuste de Desempenho

Estas dicas ajudam-no a extrair mais velocidade e qualidade do EvoX:

**(1) Escalonamento Progressivo**:

- **Comece pequeno**: Teste a lógica com entradas pequenas.
- **Escale gradualmente** e observe como o tempo de execução aumenta.
- **Identifique ineficiências** se o escalonamento for não-linear (por exemplo, 10x população -> >10x tempo).

**(2) Monitorizar Utilização de Hardware**:

- Utilize `nvidia-smi` para GPU, `htop` para CPU.
- Alta utilização de GPU (>50%) é ideal.
- Baixa utilização de GPU pode significar que os dados não estão na GPU ou transferências frequentes CPU-GPU estão a abrandar as coisas.

**(3) Ajustar Paralelismo**:

- Defina threads de CPU: `torch.set_num_threads(n)`.
- Evite sobre-subscrição se utilizar ferramentas de avaliação multi-thread.
- Para GPU, otimize threads do `DataLoader` se utilizar ambientes ou conjuntos de dados em lote.

**(4) Aproveitar Avaliação em Lote**:

- A avaliação em lote é mais rápida do que a avaliação por indivíduo.
- Vectorize sempre `Problem.evaluate()` para processar populações inteiras.

**(5) Reduzir Overhead do Python**:

- Mova lógica pesada para dentro de `Algorithm` ou `Problem`, evite código Python complexo no ciclo principal.
- Utilize `workflow.step()` para a maioria das operações.
- Minimize diagnósticos por geração se abrandarem as execuções.

**(6) Ajustar a Escolha do Algoritmo**:

- Tente CMA-ES, GA, PSO, RVEA, etc. — nenhum algoritmo é o melhor para todos os problemas.
- Um algoritmo de convergência mais rápida pode poupar mais tempo do que micro-otimizar um que converge lentamente.

O ajuste de desempenho é iterativo. Com paciência, pode passar de horas de execução para minutos. O EvoX dá-lhe muitos "botões" — utilize-os sabiamente para equilibrar velocidade e qualidade da solução.
