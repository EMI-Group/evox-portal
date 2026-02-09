---
title: "Distribuição Linux e Driver de GPU"
order: 17
section: "misc"
---

# Distribuição Linux e Driver de GPU

## Escolhendo uma Distribuição Linux

Muitas pessoas assumem que uma distribuição Linux "antiga e estável" é a melhor escolha para um servidor. No entanto, isso nem sempre é verdade — especialmente para servidores de GPU.

A estabilidade de um servidor de GPU geralmente depende da versão do kernel e do driver de GPU. Como o hardware de GPU evolui rapidamente, kernels e drivers mais novos tendem a ser mais refinados, estáveis e compatíveis com GPUs recentes. Eles geralmente incluem mais correções de bugs e melhor suporte para o hardware mais recente. Além disso, a compilação `jit` e as otimizações nos kernels e drivers mais recentes são significativamente melhores do que em versões mais antigas.

Por exemplo, embora o Ubuntu 20.04 seja considerado uma versão "estável", ele agora está bastante datado para cargas de trabalho de GPU. Mesmo a NVIDIA RTX 3090, que não é uma GPU particularmente nova, foi lançada em 2020. Isso significa que os drivers padrão fornecidos pelo Ubuntu 20.04 podem não suportar totalmente a 3090, levando potencialmente a problemas de compatibilidade.

Na maioria dos casos, escolher uma distribuição Linux mais nova (como o Ubuntu 25.04 oferece melhor suporte do que o 22.04).

Outro fator importante a considerar é o quão bem uma distribuição Linux suporta software não de código aberto (proprietário). Algumas distribuições, como o Fedora, priorizam software de código aberto e podem não incluir drivers proprietários por padrão — por exemplo, drivers NVIDIA. Isso pode exigir etapas adicionais para instalar e configurar drivers de GPU. Outras distribuições, como Arch Linux, Debian, Ubuntu e NixOS, tendem a ser mais flexíveis e facilitam a instalação de drivers proprietários quando necessário.

## Instalando o Driver de GPU

Geralmente é recomendado instalar o driver de GPU fornecido pela sua distribuição Linux. Esses drivers são tipicamente bem testados e integrados ao kernel.

> **Aviso:**
> A menos que você tenha muita experiência com drivers de GPU e o kernel Linux, você deve evitar instalar drivers diretamente do site da NVIDIA, pois eles podem levar a problemas de compatibilidade ou exigir configuração adicional.