---
title: "Inicio rápido de EvoX: ejecuta computación evolutiva acelerada por GPU en solo 10 minutos"
pubDate: 2025-04-30
summary: "Un tutorial para principiantes para comenzar con la computación evolutiva acelerada por GPU usando EvoX en solo 10 minutos."
---

Por un lado, la computación evolutiva es extremadamente potente en la investigación y la ingeniería del mundo real, pero difícil de utilizar. Por otro lado, las capacidades de las GPUs son cada vez más potentes, pero resulta difícil aprovechar su potencia en tareas de computación evolutiva.

Necesitamos una solución verdaderamente moderna: soporte nativo de GPU, arquitectura modular, interfaces claras, usabilidad inmediata y escalabilidad personalizable. Esto es EvoX: un motor de computación evolutiva para el futuro.

Para ayudar a los usuarios a comenzar rápidamente, el equipo de EvoX ha publicado el "Tutorial para principiantes de EvoX". El tutorial consta de 8 capítulos, que cubren desde los conceptos básicos hasta la aplicación práctica avanzada, guiándole paso a paso sobre cómo ejecutar algoritmos evolutivos en una GPU.

**Recursos completos del tutorial**

Tutorial en línea en chino:

[EvoX Beginners Tutorial - EvoX Document](https://evox.readthedocs.io/zh-cn/latest/tutorial/ "https://evox.readthedocs.io/zh-cn/latest/tutorial/")

Tutorial en PDF en chino:

Únase al Grupo QQ para obtenerlo: 297969717

A continuación, le guiaremos a través de todo el proceso, desde la instalación hasta la ejecución, en solo 10 minutos.

**Paso 1: Configuración del entorno**

Abra su terminal y cree un entorno Python limpio:

![代码片段1.png](/images/articles/quickstart-1.png)

También puede utilizar su herramienta preferida para crear un entorno Python limpio.

**Paso 2: Instalar PyTorch y EvoX**

![代码片段2.png](/images/articles/quickstart-2.png)

Compruebe si la GPU está disponible:

![代码片段3.png](/images/articles/quickstart-3.png)

**Paso 3: Ejecute su primer algoritmo evolutivo**

**![代码片段4.png](/images/articles/quickstart-4.png)![图片2.4.png](/images/articles/quickstart-5.png)**

¿Qué hace esto? Compone un algoritmo (PSO), un problema (Ackley) y un monitor (EvalMonitor) a través de una interfaz estándar. ¡EvoX se encarga de todo el paralelismo, la aceleración y la monitorización!

**Paso 4: Representar la curva de convergencia**

Solo se necesita una línea:

![代码片段5.png](/images/articles/quickstart-6.png "代码片段5.png")

![monitor_output.png](/images/articles/quickstart-7.png)

¿Ve esa curva descendente? Es la **trayectoria en la que su algoritmo evolutivo se aproxima al objetivo**, y **el camino que recorre para explorar el mundo desconocido.**

**Paso 5: Pruebe a ampliar**

Si "simplemente ejecutar un Ackley" no le resulta suficiente, puede:

· Cambiar PSO por GA, DE, CMA-ES, NSGA-II, RVEA...
 · Cambiar Ackley por Rastrigin, Griewank, CEC2022
 · Pasar a un problema multiobjetivo estableciendo n_objs >= 2
 · Implementar su propia lógica con MyProblem y MyAlgorithm
 · Conectar con modelos de PyTorch o entornos de aprendizaje por refuerzo (Gym, Brax, MuJoCo Playground)

Ya se trate de ajuste de hiperparámetros, búsqueda de arquitecturas, neuroevolución u optimización de estrategias de control, EvoX lo gestiona todo con facilidad.

**¿Por qué elegir EvoX?**

![表格-英文.png](/images/articles/quickstart-8.png "表格-英文.png")



**Agradecimientos**

Este tutorial fue escrito por **Boqing Xu**, **Xinmeng Yu**, **Bowen Zheng** y **Xinyao Li**. **Beichen Huang** fue responsable de la recopilación, edición y publicación en línea del tutorial.

Agradecemos sinceramente a cada miembro de la comunidad de EvoX. Son nuestros esfuerzos conjuntos los que han permitido que EvoX siga evolucionando.

**Código abierto / Recursos comunitarios**

Paper:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

Proyecto principal (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Grupo QQ: 297969717

![图片11.png](/images/articles/evox-1-1-0-1.png)

Grupo QQ | Evolving Machine Intelligence

EvoMO está construido sobre el framework EvoX. Si está interesado en conocer más sobre EvoX, no dude en consultar el artículo oficial sobre EvoX 1.0 publicado en nuestra cuenta pública de WeChat para más detalles.

![image.png](/images/articles/metade-1.png)

 ([https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ](https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ "https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ"))
