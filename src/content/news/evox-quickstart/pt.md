---
title: "Primeiros passos com o EvoX: o seu primeiro fluxo evolutivo"
pubDate: 2025-04-30
updatedDate: 2026-11-08
summary: "Crie uma experiência completa com EvoX 1.4.1 e compreenda como problemas, populações, avaliação e execução formam um fluxo reutilizável."
---

Este tutorial minimiza Ackley em duas dimensões com PSO, verifica o dispositivo e apresenta o histórico. Destina-se ao **EvoX 1.4.1 com PyTorch**, não à API experimental 2.x. A tarefa pequena ensina o fluxo; não é um benchmark GPU.

![Esferas candidatas num relevo de pesquisa ligado a molduras de workflow](./first-search-workflow.webp)

## Preparar um ambiente isolado

Utilize Python 3.10 ou posterior. Crie um ambiente virtual e ative-o conforme a shell.

```bash
python -m venv .venv
```

Em macOS/Linux:

```bash
source .venv/bin/activate
```

Em Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

## Instalar os pacotes adequados

Escolha o comando para o sistema e hardware no [instalador oficial do PyTorch](https://pytorch.org/get-started/locally/). CUDA exige um controlador suportado; instalar EvoX não garante uma GPU disponível. Instale depois a versão fixada:

```bash
python -m pip install "evox[vis]==1.4.1"
```

## Executar uma experiência completa

Guarde o código como script Python. Seleciona CUDA quando disponível, ou CPU, apresenta a escolha e mantém estado e monitorização nesse dispositivo. Uma semente fixa ajuda a repetir experiências, mas os resultados podem variar entre dispositivos e versões.

```python
import torch
from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor

torch.manual_seed(42)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
torch.set_default_device(device)

algorithm = PSO(
    pop_size=50,
    lb=-32 * torch.ones(2, device=device),
    ub=32 * torch.ones(2, device=device),
    device=device,
)
problem = Ackley()
monitor = EvalMonitor(device=device, history_device=device)
workflow = StdWorkflow(algorithm, problem, monitor)

workflow.init_step()
for _ in range(100):
    workflow.step()

print("Device:", device)
print("Best fitness:", monitor.get_best_fitness().item())
```

## Compreender e visualizar o resultado

PSO mantém candidatos, Ackley avalia-os, StdWorkflow liga os componentes e EvalMonitor regista o progresso. Valores menores são melhores; o ótimo teórico é zero na origem. O valor final é aleatório e não é garantido.

Execute o seguinte após a pesquisa no mesmo processo. As dependências de visualização estão incluídas. A imagem vem do tutorial original e não garante o resultado desta semente.

```python
monitor.plot()
```

![PSO convergence](./quickstart-7.png)

## Alargar a experiência com critério

Altere dimensão, população ou semente individualmente. Um problema próprio deve devolver um valor por candidato. A otimização multiobjetivo exige também algoritmo, formato de saída e monitor compatíveis.

Separe compilação e aquecimento da execução estável, sincronize CUDA ao medir e compare orçamentos iguais. Tarefas pequenas podem ser mais rápidas em CPU. Estude a compilação após validar a referência.

## Recursos e agradecimentos

O tutorial original foi escrito por Boqing Xu, Xinmeng Yu, Bowen Zheng e Xinyao Li, com edição e publicação de Beichen Huang. A figura de apresentação é mantida abaixo.

![EvoX overview](./quickstart-8.png)

Consulte o [código da versão](https://github.com/EMI-Group/evox/tree/v1.4.1) e a [documentação](https://evox.readthedocs.io/en/latest/). Verifique a versão antes de copiar uma API de material mais recente.

Antes de ampliar o exemplo, guarde em conjunto versões dos pacotes, dispositivo, semente e melhor aptidão. Altere uma definição e repita o mesmo orçamento. A [explicação do EvoMO](/pt/news/gpu-accelerated-emo) apresenta as decisões adicionais para objetivos concorrentes.
