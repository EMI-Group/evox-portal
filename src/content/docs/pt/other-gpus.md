---
title: "Utilizar GPUs Não-NVIDIA"
order: 16
section: "misc"
---

# Utilizar GPUs Não-NVIDIA

Este guia explica como utilizar GPUs AMD e GPUs Apple Silicon com PyTorch no contexto do EvoX.

Embora as GPUs NVIDIA sejam uma escolha fiável e geralmente ofereçam bom desempenho, os modelos mais recentes são otimizados para cargas de trabalho de aprendizagem profunda e modelos de linguagem de grande escala. Muitas das suas funcionalidades avançadas, como o suporte para tipos de dados de baixa precisão, são atualmente subutilizadas no EvoX. Em alguns casos, GPUs não-NVIDIA podem fornecer melhor desempenho e menor custo para tarefas evolutivas.

## Suporte para GPU AMD

O suporte para GPU AMD no PyTorch é fornecido via ROCm. Os dispositivos AMD são reconhecidos como dispositivos `cuda` (tal como as GPUs NVIDIA). Para utilizar uma GPU AMD:

1. Instale a versão do PyTorch compatível com ROCm.
2. Utilize a configuração padrão de dispositivo, por exemplo, `device = torch.device("cuda")`.

Não são necessárias alterações adicionais além de utilizar a compilação ROCm.

## Suporte para GPU Apple Silicon

Se possui um Mac com Apple Silicon, pode aproveitar a GPU integrada para acelerar as suas cargas de trabalho EvoX.
As GPUs Apple Silicon são suportadas através do backend Metal Performance Shaders (MPS) e são acessíveis utilizando o dispositivo `mps` no PyTorch.

Para utilizar uma GPU Apple Silicon:

1. Certifique-se de que tem a versão do PyTorch compatível com MPS instalada.
2. Mova os seus tensores e modelos para o dispositivo `mps`, por exemplo, `device = torch.device("mps")`.

> **Nota:**
> O dispositivo `mps` **não** suporta compilação (por exemplo, `#evox.compile`).
