---
title: "Usar GPUs Não-NVIDIA"
order: 16
section: "misc"
---

# Usar GPUs Não-NVIDIA

Este guia explica como usar GPUs AMD e GPUs Apple Silicon com PyTorch no contexto do EvoX.

Embora as GPUs NVIDIA sejam uma escolha confiável e geralmente ofereçam bom desempenho, os modelos mais recentes são otimizados para cargas de trabalho de aprendizado profundo e modelos de linguagem de grande escala. Muitos de seus recursos avançados, como suporte a tipos de dados de baixa precisão, são atualmente subutilizados no EvoX. Em alguns casos, GPUs não-NVIDIA podem oferecer melhor desempenho e menor custo para tarefas evolutivas.

## Suporte a GPU AMD

O suporte a GPU AMD no PyTorch é fornecido via ROCm. Dispositivos AMD são reconhecidos como dispositivos `cuda` (assim como GPUs NVIDIA). Para usar uma GPU AMD:

1. Instale a versão do PyTorch compatível com ROCm.
2. Use a configuração padrão de dispositivo, por exemplo, `device = torch.device("cuda")`.

Nenhuma alteração adicional é necessária além de usar a build ROCm.

## Suporte a GPU Apple Silicon

Se você possui um Mac com Apple Silicon, pode aproveitar a GPU integrada para acelerar suas cargas de trabalho com o EvoX.
As GPUs Apple Silicon são suportadas via o backend Metal Performance Shaders (MPS) e são acessíveis usando o dispositivo `mps` no PyTorch.

Para usar uma GPU Apple Silicon:

1. Certifique-se de ter a versão do PyTorch compatível com MPS instalada.
2. Mova seus tensores e modelos para o dispositivo `mps`, por exemplo, `device = torch.device("mps")`.

> **Nota:**
> O dispositivo `mps` **não** suporta compilação (por exemplo, `#evox.compile`).
