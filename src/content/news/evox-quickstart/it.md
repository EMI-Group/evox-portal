---
title: "Avvio rapido EvoX: esegui il calcolo evolutivo accelerato da GPU in soli 10 minuti"
pubDate: 2025-04-30
summary: "Un tutorial per principianti per iniziare con il calcolo evolutivo accelerato da GPU usando EvoX in soli 10 minuti."
---

Da un lato, il calcolo evolutivo è estremamente potente nella ricerca e nell'ingegneria del mondo reale, ma difficile da utilizzare. Dall'altro, le capacità delle GPU sono sempre più potenti, ma è difficile sfruttarne la potenza nei compiti di calcolo evolutivo.

Abbiamo bisogno di una soluzione veramente moderna: supporto nativo per GPU, architettura modulare, interfacce chiare, utilizzabilita immediata e scalabilità personalizzabile. Questo e EvoX -- un motore di calcolo evolutivo per il futuro.

Per aiutare gli utenti a iniziare rapidamente, il team EvoX ha rilasciato il "Tutorial per principianti di EvoX". Il tutorial è composto da 8 capitoli, che coprono tutto dalle basi all'applicazione pratica avanzata, guidandoti passo dopo passo su come eseguire algoritmi evolutivi su una GPU.

**Risorse complete del tutorial**

Tutorial online in cinese:

[EvoX Beginners Tutorial - EvoX Document](https://evox.readthedocs.io/zh-cn/latest/tutorial/ "https://evox.readthedocs.io/zh-cn/latest/tutorial/")

Tutorial PDF in cinese:

Unisciti al Gruppo QQ per ottenerlo: 297969717

Ora ti guideremo attraverso l'intero processo, dall'installazione all'esecuzione, in soli 10 minuti.

**Passo 1: Configurazione dell'ambiente**

Apri il terminale e crea un ambiente Python pulito:

![代码片段1.png](/images/articles/quickstart-1.png)

Puoi anche usare il tuo strumento preferito per creare un ambiente Python pulito.

**Passo 2: Installa PyTorch e EvoX**

![代码片段2.png](/images/articles/quickstart-2.png)

Verifica se la GPU è disponibile:

![代码片段3.png](/images/articles/quickstart-3.png)

**Passo 3: Esegui il tuo primo algoritmo evolutivo**

**![代码片段4.png](/images/articles/quickstart-4.png)![图片2.4.png](/images/articles/quickstart-5.png)**

Cosa fa questo codice? Compone un algoritmo (PSO), un problema (Ackley) e un monitor (EvalMonitor) tramite un'interfaccia standard. EvoX si occupa di tutto il parallelismo, l'accelerazione e il monitoraggio!

**Passo 4: Traccia la curva di convergenza**

Basta una sola riga:

![代码片段5.png](/images/articles/quickstart-6.png "代码片段5.png")

![monitor_output.png](/images/articles/quickstart-7.png)

Vedi quella curva discendente? Quella e la **traiettoria con cui il tuo algoritmo evolutivo si avvicina all'obiettivo**, e **il percorso che compie per esplorare il mondo sconosciuto.**

**Passo 5: Prova ad estendere**

Se "eseguire solo un Ackley" non ti soddisfa, puoi:

· Sostituire PSO con GA, DE, CMA-ES, NSGA-II, RVEA...
 · Sostituire Ackley con Rastrigin, Griewank, CEC2022
 · Passare a un problema multi-obiettivo impostando n_objs >= 2
 · Implementare la tua logica personalizzata con MyProblem e MyAlgorithm
 · Collegarti a modelli PyTorch o ambienti di reinforcement learning (Gym, Brax, MuJoCo Playground)

Che si tratti di regolazione degli iperparametri, ricerca di architetture, neuroevoluzione o ottimizzazione di strategie di controllo, EvoX gestisce tutto con facilita.

**Perché scegliere EvoX?**

![表格-英文.png](/images/articles/quickstart-8.png "表格-英文.png")



**Ringraziamenti**

Questo tutorial è stato scritto da **Boqing Xu**, **Xinmeng Yu**, **Bowen Zheng** e **Xinyao Li**. **Beichen Huang** è stato responsabile della raccolta, dell'editing e della pubblicazione online del tutorial.

Ringraziamo sinceramente ogni membro della comunità EvoX. Sono i nostri sforzi congiunti che hanno permesso a EvoX di continuare a evolversi.

**Codice open source / Risorse della comunità**

Paper:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

Progetto upstream (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Gruppo QQ: 297969717

![图片11.png](/images/articles/evox-1-1-0-1.png)

Gruppo QQ | Evolving Machine Intelligence

EvoMO è costruito sul framework EvoX. Se sei interessato a saperne di più su EvoX, consulta l'articolo ufficiale su EvoX 1.0 pubblicato sul nostro account pubblico WeChat per ulteriori dettagli.

![image.png](/images/articles/metade-1.png)

 ([https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ](https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ "https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ"))
