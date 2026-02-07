---
title: "Linux-Distribution und GPU-Treiber"
order: 17
section: "misc"
---

# Linux-Distribution und GPU-Treiber

## Wahl einer Linux-Distribution

Viele Menschen gehen davon aus, dass eine "alte und stabile" Linux-Distribution die beste Wahl für einen Server ist. Dies ist jedoch nicht immer wahr -- insbesondere für GPU-Server.

Die Stabilität eines GPU-Servers hängt oft von der Kernel-Version und dem GPU-Treiber ab. Da sich GPU-Hardware schnell weiterentwickelt, sind neuere Kernel und Treiber tendenziell ausgereifter, stabiler und kompatibler mit aktuellen GPUs. Sie enthalten in der Regel mehr Fehlerbehebungen und bessere Unterstützung für die neueste Hardware. Zusätzlich sind die JIT-Kompilierung und Optimierungen in den neuesten Kerneln und Treibern deutlich besser als in älteren Versionen.

Zum Beispiel gilt Ubuntu 20.04 zwar als "stabiles" Release, ist aber mittlerweile für GPU-Workloads recht veraltet. Selbst die NVIDIA RTX 3090, die keine besonders neue GPU ist, wurde 2020 veröffentlicht. Das bedeutet, dass die von Ubuntu 20.04 bereitgestellten Standardtreiber die 3090 möglicherweise nicht vollständig unterstützen, was zu Kompatibilitätsproblemen führen kann.

In den meisten Fällen bietet die Wahl einer neueren Linux-Distribution (wie Ubuntu 25.04 bessere Unterstützung als 22.04).

Ein weiterer wichtiger Faktor ist, wie gut eine Linux-Distribution nicht-quelloffene (proprietäre) Software unterstützt. Einige Distributionen, wie Fedora, priorisieren Open-Source-Software und enthalten möglicherweise standardmäßig keine proprietären Treiber -- zum Beispiel NVIDIA-Treiber. Dies kann zusätzliche Schritte zur Installation und Konfiguration von GPU-Treibern erfordern. Andere Distributionen, wie Arch Linux, Debian, Ubuntu und NixOS, sind tendenziell flexibler und erleichtern die Installation proprietärer Treiber bei Bedarf.

## GPU-Treiber installieren

Es wird generell empfohlen, den von Ihrer Linux-Distribution bereitgestellten GPU-Treiber zu installieren. Diese Treiber sind typischerweise gut getestet und in den Kernel integriert.

> **Warnung:**
> Sofern Sie nicht sehr erfahren mit GPU-Treibern und dem Linux-Kernel sind, sollten Sie es vermeiden, Treiber direkt von der NVIDIA-Website zu installieren, da diese zu Kompatibilitätsproblemen führen oder zusätzliche Konfiguration erfordern können.
