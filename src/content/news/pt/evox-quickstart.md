---
title: "Início rápido EvoX: execute computação evolutiva acelerada por GPU em apenas 10 minutos"
pubDate: 2025-04-30
summary: "Um tutorial para iniciantes para começar com computação evolutiva acelerada por GPU usando EvoX em apenas 10 minutos."
---

Por um lado, a Computação Evolutiva é extremamente poderosa na investigação e engenharia do mundo real, mas difícil de utilizar. Por outro lado, as capacidades das GPUs são cada vez mais poderosas, mas é difícil para elas exercerem o seu poder em tarefas de computação evolutiva.

Precisamos de uma solução verdadeiramente moderna: suporte nativo a GPU, arquitetura modular, interfaces claras, usabilidade imediata e escalabilidade personalizável. Isto é o EvoX - um motor de computação evolutiva para o futuro.

Para ajudar os utilizadores a começar rapidamente, a equipa EvoX lançou o "Tutorial para Iniciantes do EvoX". O tutorial é composto por 8 capítulos, cobrindo tudo desde o básico até à aplicação prática avançada, guiando-o passo a passo sobre como executar algoritmos evolutivos numa GPU.

**Recursos Completos do Tutorial**

Tutorial online em chinês:

[EvoX Beginners Tutorial - EvoX Document](https://evox.readthedocs.io/zh-cn/latest/tutorial/ "https://evox.readthedocs.io/zh-cn/latest/tutorial/")

Tutorial em PDF em chinês:

Por favor, junte-se ao Grupo QQ para o obter: 297969717

A seguir, vamos guiá-lo por todo o processo, desde a instalação até à execução, em apenas 10 minutos.

**Passo 1: Configuração do Ambiente**

Abra o seu terminal e crie um ambiente Python limpo:

![代码片段1.png](/images/articles/quickstart-1.png)

Também pode utilizar a sua ferramenta preferida para criar um ambiente Python limpo.

**Passo 2: Instalar PyTorch e EvoX**

![代码片段2.png](/images/articles/quickstart-2.png)

Verifique se a GPU está disponível:

![代码片段3.png](/images/articles/quickstart-3.png)

**Passo 3: Execute o seu primeiro algoritmo evolutivo**

**![代码片段4.png](/images/articles/quickstart-4.png)![图片2.4.png](/images/articles/quickstart-5.png)**

O que é que isto faz? Compõe um algoritmo (PSO), um problema (Ackley) e um monitor (EvalMonitor) através de uma interface padrão. O EvoX trata de todo o paralelismo, aceleração e monitorização!

**Passo 4: Traçar a Curva de Convergência**

Apenas uma linha é suficiente:

![代码片段5.png](/images/articles/quickstart-6.png "代码片段5.png")

![monitor_output.png](/images/articles/quickstart-7.png)

Vê aquela curva descendente? Essa é a **trajetória em que o seu algoritmo evolutivo se aproxima do objetivo**, e **o caminho que percorre para explorar o mundo desconhecido.**

**Passo 5: Experimente Estender**

Se "apenas executar um Ackley" não é satisfatório, pode:

· Trocar PSO por GA, DE, CMA-ES, NSGA-II, RVEA...
 · Trocar Ackley por Rastrigin, Griewank, CEC2022
 · Mudar para um problema multi-objetivo definindo n_objs >= 2
 · Implementar a sua própria lógica com MyProblem e MyAlgorithm
 · Integrar com modelos PyTorch ou ambientes de aprendizagem por reforço (Gym, Brax, MuJoCo Playground)

Quer se trate de ajuste de hiperparâmetros, pesquisa de arquitetura, neuroevolução ou otimização de estratégias de controlo, o EvoX lida com tudo com facilidade.

**Porquê Escolher o EvoX?**

![表格-英文.png](/images/articles/quickstart-8.png "表格-英文.png")



**Agradecimentos**

Este tutorial foi escrito por **Boqing Xu**, **Xinmeng Yu**, **Bowen Zheng** e **Xinyao Li**. **Beichen Huang** foi responsável pela compilação, edição e publicação online do tutorial.

Agradecemos sinceramente a cada membro da comunidade EvoX. São os nossos esforços conjuntos que permitiram ao EvoX continuar a evoluir.

**Código Open Source / Recursos da Comunidade**

Paper:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

Projeto Principal (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Grupo QQ: 297969717

![图片11.png](/images/articles/evox-1-1-0-1.png)

Grupo QQ | Evolving Machine Intelligence

O EvoMO é construído sobre o framework EvoX. Se estiver interessado em saber mais sobre o EvoX, consulte o artigo oficial sobre o EvoX 1.0 publicado na nossa conta pública do WeChat para mais detalhes.

![image.png](/images/articles/metade-1.png)

 ([https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ](https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ "https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ"))
