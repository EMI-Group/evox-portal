---
title: "Início rápido EvoX: execute computação evolutiva acelerada por GPU em apenas 10 minutos"
pubDate: 2025-04-30
summary: "Um tutorial para iniciantes para começar com computação evolutiva acelerada por GPU usando EvoX em apenas 10 minutos."
---

Por um lado, a Computação Evolutiva é extremamente poderosa em pesquisa e engenharia do mundo real, mas difícil de utilizar. Por outro lado, as capacidades das GPUs estão se tornando cada vez mais poderosas, mas é difícil para elas exercerem seu poder em tarefas de computação evolutiva.

Precisamos de uma solução verdadeiramente moderna: suporte nativo a GPU, arquitetura modular, interfaces claras, usabilidade pronta para uso e escalabilidade personalizável. Este é o EvoX - um motor de computação evolutiva para o futuro.

Para ajudar os usuários a começar rapidamente, a equipe EvoX lançou o "Tutorial para Iniciantes do EvoX". O tutorial consiste em 8 capítulos, cobrindo desde o básico até aplicações práticas avançadas, guiando você passo a passo sobre como executar algoritmos evolutivos em uma GPU.

**Recursos Completos do Tutorial**

Tutorial online em chinês:

[EvoX Beginners Tutorial - EvoX Document](https://evox.readthedocs.io/zh-cn/latest/tutorial/ "https://evox.readthedocs.io/zh-cn/latest/tutorial/")

Tutorial em PDF em chinês:

Por favor, entre no Grupo QQ para obtê-lo: 297969717

A seguir, vamos guiá-lo por todo o processo, da instalação à execução, em apenas 10 minutos.

**Passo 1: Configuração do Ambiente**

Abra seu terminal e crie um ambiente Python limpo:

![代码片段1.png](/images/articles/quickstart-1.png)

Você também pode usar sua ferramenta preferida para criar um ambiente Python limpo.

**Passo 2: Instalar PyTorch e EvoX**

![代码片段2.png](/images/articles/quickstart-2.png)

Verifique se a GPU está disponível:

![代码片段3.png](/images/articles/quickstart-3.png)

**Passo 3: Execute seu primeiro algoritmo evolutivo**

**![代码片段4.png](/images/articles/quickstart-4.png)![图片2.4.png](/images/articles/quickstart-5.png)**

O que isso faz? Ele compõe um algoritmo (PSO), um problema (Ackley) e um monitor (EvalMonitor) através de uma interface padrão. O EvoX cuida de todo o paralelismo, aceleração e monitoramento!

**Passo 4: Plotar a Curva de Convergência**

Apenas uma linha é suficiente:

![代码片段5.png](/images/articles/quickstart-6.png "代码片段5.png")

![monitor_output.png](/images/articles/quickstart-7.png)

Vê aquela curva descendente? Essa é a **trajetória onde seu algoritmo evolutivo está se aproximando do alvo**, e **o caminho que ele percorre para explorar o mundo desconhecido.**

**Passo 5: Tente Estender**

Se "apenas executar um Ackley" não é satisfatório, você pode:

· Trocar PSO por GA, DE, CMA-ES, NSGA-II, RVEA...
 · Trocar Ackley por Rastrigin, Griewank, CEC2022
 · Mudar para um problema multiobjetivo definindo n_objs >= 2
 · Implementar sua própria lógica com MyProblem e MyAlgorithm
 · Conectar a modelos PyTorch ou ambientes de aprendizado por reforço (Gym, Brax, MuJoCo Playground)

Seja ajuste de hiperparâmetros, busca de arquitetura, neuroevolução ou otimização de estratégias de controle, o EvoX lida com tudo com facilidade.

**Por Que Escolher o EvoX?**

![表格-英文.png](/images/articles/quickstart-8.png "表格-英文.png")



**Agradecimentos**

Este tutorial foi escrito por **Boqing Xu**, **Xinmeng Yu**, **Bowen Zheng** e **Xinyao Li**. **Beichen Huang** foi responsável pela compilação, edição e publicação online do tutorial.

Agradecemos sinceramente a cada membro da comunidade EvoX. São nossos esforços conjuntos que permitiram ao EvoX continuar evoluindo.

**Código Open Source / Recursos da Comunidade**

Artigo:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

Projeto Upstream (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Grupo QQ: 297969717

![图片11.png](/images/articles/evox-1-1-0-1.png)

Grupo QQ | Evolving Machine Intelligence

O EvoMO é construído sobre o framework EvoX. Se você tem interesse em saber mais sobre o EvoX, confira o artigo oficial sobre o EvoX 1.0 publicado em nossa conta pública do WeChat para mais detalhes.

![image.png](/images/articles/metade-1.png)

 ([https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ](https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ "https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ"))
