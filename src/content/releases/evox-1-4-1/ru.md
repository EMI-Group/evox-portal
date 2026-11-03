---
title: "Примечания к выпуску EvoX v1.4.1"
pubDate: 2026-10-30
summary: "Исправления CMA-ES, вариантов DE, PSO, эволюционных стратегий, турнирного отбора и вычисления гиперобъёма."
---

**EvoX v1.4.1** исправляет алгоритмические ошибки и проблемы выполнения в стабильной серии 1.x.

## Исправления алгоритмов

- **CMA-ES:** исправлены ранговое обновление ковариации первого порядка и константа накопления `c_c`; устранён сбой в `torch.cond`, тест снова включён ([#251](https://github.com/EMI-Group/evox/pull/251), [#255](https://github.com/EMI-Group/evox/pull/255), [#256](https://github.com/EMI-Group/evox/pull/256)).
- **Варианты DE:** в `DE_binary_crossover` нормальное распределение заменено равномерным. Исправлена адаптация `F` и `CR` в SHADE, а начальные популяции вариантов DE теперь генерируются в допустимых границах ([#252](https://github.com/EMI-Group/evox/pull/252), [#258](https://github.com/EMI-Group/evox/pull/258)).
- **PSO:** исправлен перенос границ на устройство ([#253](https://github.com/EMI-Group/evox/pull/253)).
- **Эволюционные стратегии:** исправлены работа ASEBO после активации градиентного подпространства, значение `pop_size` по умолчанию в XNES/SeparableNES и сбои подпространств Guided ES ([#257](https://github.com/EMI-Group/evox/pull/257), [#259](https://github.com/EMI-Group/evox/pull/259)).

## Операторы и метрики

- Устранены сбои турнирного отбора при `n_round=1` ([#259](https://github.com/EMI-Group/evox/pull/259)).
- При вычислении гиперобъёма (`hv`) теперь игнорируются точки, не доминирующие над опорной точкой ([#254](https://github.com/EMI-Group/evox/pull/254)).

Благодарим @bbopen, @raashish1601, @Arthur031221 и @flyingdoubleG за их первые вклады.

**Релиз**: [v1.4.1](https://github.com/EMI-Group/evox/releases/tag/v1.4.1) · **Полный список изменений**: [v1.4.0...v1.4.1](https://github.com/EMI-Group/evox/compare/v1.4.0...v1.4.1)
