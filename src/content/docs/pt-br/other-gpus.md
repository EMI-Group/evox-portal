---
title: "Usar GPUs não-NVIDIA"
order: 16
section: "misc"
---

# Usar GPUs não-NVIDIA

Este guia explica como usar GPUs AMD e GPUs Apple Silicon com PyTorch no contexto do EvoX.

Embora as GPUs NVIDIA sejam uma escolha confiável e geralmente ofereçam um desempenho sólido, os modelos mais recentes são otimizados para cargas de trabalho de deep learning e grandes modelos de linguagem. Muitos de seus recursos avançados, como o suporte para tipos de dados de baixa precisão, são atualmente subutilizados no EvoX. Em alguns casos, GPUs não-NVIDIA podem oferecer melhor desempenho e menor custo para tarefas evolutivas.

## Suporte para GPU AMD

O suporte para GPU AMD no PyTorch é fornecido via ROCm. Os dispositivos AMD são reconhecidos como dispositivos `cuda` (assim como as GPUs NVIDIA). Para usar uma GPU AMD:

1. Instale a versão do PyTorch compatível com ROCm.
2. Use a configuração padrão de dispositivo, por exemplo, `device = torch.device("cuda")`.

Nenhuma alteração adicional é necessária além de usar a build do ROCm.

## Suporte para GPU Apple Silicon

Se você possui um Mac com Apple Silicon, pode aproveitar a GPU integrada para acelerar suas cargas de trabalho no EvoX.
As GPUs Apple Silicon são suportadas através do backend Metal Performance Shaders (MPS) e são acessíveis usando o dispositivo `mps` no PyTorch.

Para usar uma GPU Apple Silicon:

1. Certifique-se de ter a versão do PyTorch compatível com MPS instalada.
2. Mova seus tensores e modelos para o dispositivo `mps`, por exemplo, `device = torch.device("mps")`.

> **Nota:**
> O dispositivo `mps` **não** suporta compilação (por exemplo, `#evox.compile`).