---
title: "Distribuição Linux e Driver de GPU"
order: 17
section: "misc"
---

# Distribuição Linux e Driver de GPU

## Escolher uma Distribuição Linux

Muitas pessoas assumem que uma distribuição Linux "antiga e estável" é a melhor escolha para um servidor. No entanto, isto nem sempre é verdade — especialmente para servidores de GPU.

A estabilidade de um servidor de GPU depende frequentemente da versão do kernel e do driver de GPU. Como o hardware de GPU evolui rapidamente, os kernels e drivers mais recentes tendem a ser mais refinados, estáveis e compatíveis com GPUs recentes. Geralmente, incluem mais correções de erros e melhor suporte para o hardware mais recente. Além disso, a compilação `jit` e as otimizações nos kernels e drivers mais recentes são significativamente melhores do que em versões mais antigas.

Por exemplo, embora o Ubuntu 20.04 seja considerado uma versão "estável", está agora bastante datado para cargas de trabalho de GPU. Mesmo a NVIDIA RTX 3090, que não é uma GPU particularmente nova, foi lançada em 2020. Isto significa que os drivers predefinidos fornecidos pelo Ubuntu 20.04 podem não suportar totalmente a 3090, levando potencialmente a problemas de compatibilidade.

Na maioria dos casos, escolher uma distribuição Linux mais recente (como o Ubuntu 25.04 oferece melhor suporte do que o 22.04).

Outro fator importante a considerar é quão bem uma distribuição Linux suporta software não-open-source (proprietário). Algumas distribuições, como o Fedora, priorizam software open-source e podem não incluir drivers proprietários por predefinição — por exemplo, drivers NVIDIA. Isto pode exigir passos adicionais para instalar e configurar drivers de GPU. Outras distribuições, como Arch Linux, Debian, Ubuntu e NixOS, tendem a ser mais flexíveis e facilitam a instalação de drivers proprietários quando necessário.

## Instalar o Driver de GPU

É geralmente recomendado instalar o driver de GPU fornecido pela sua distribuição Linux. Estes drivers são tipicamente bem testados e integrados com o kernel.

> **Aviso:**
> A menos que tenha muita experiência com drivers de GPU e o kernel Linux, deve evitar instalar drivers diretamente do website da NVIDIA, pois podem levar a problemas de compatibilidade ou exigir configuração adicional.