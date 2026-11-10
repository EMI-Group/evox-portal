---
title: "Genesis WASM Render : Correction de l'ordre de validation et de la précision des pixels dans un moteur de rendu WebGL"
pubDate: 2026-10-15
updatedDate: 2026-11-10
summary: "Deux correctifs WebGL2 documentés relient les causes racines aux résultats de régression, tandis que le registre de vérification final distingue la conformité API de la correspondance visuelle."
---

Un moteur de rendu WebGL logiciel doit faire plus que dessiner une image reconnaissable. Il doit compiler des shaders, maintenir l'état de l'API, valider les entrées dans le bon ordre et préserver la précision de l'image à travers les limites des modules. Le cas Genesis WASM Render contient deux exemples concrets de ces exigences déboguées et revérifiées.

![La géométrie filaire devient une image de pixels ombrée](./software-graphics-pipeline.webp)

Le registre Evidence (le [compte rendu Evidence](https://genesis.evox.group/evidence/tbench-wasm/)) décrit une implémentation TypeScript développée avec DeepSeek V4 Flash : 2 017/2 019 cas Khronos CTS réussis, environ 36 $ US de frais de jetons de modèle, et 65,9 heures entre ses premiers et derniers commits d'agent. Cet intervalle correspond à la durée de l'historique du dépôt, et non à un temps d'exécution mesuré de l'agent actif.

## Diviser le pipeline selon des interfaces utilisables

L'[architecture source](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/src/CONTEXT.md) sépare la compilation et l'édition de liens des shaders, la rastérisation, l'état et les objets WebGL, ainsi que la présentation et le décodage d'images. Le résultat d'un shader doit encore passer par l'interpolation, l'exécution des fragments, la gestion des textures et le tampon de dessin avant de devenir une image visible.

Le moteur de rendu sans dépendance au moment de l'exécution vise une exécution sans rendu GPU natif. Des environnements de conformité basés sur le navigateur sont toujours utilisés pour le tester ; cet environnement de vérification est distinct de la revendication d'absence de dépendance d'exécution du moteur de rendu.

## Une erreur de sécurité devait se produire avant une erreur de liaison de texture

Une page WebGL2 en échec concernait une source d'image dont l'origine était corrompue (origin-tainted). Le [registre de vérification final](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/tests/conformance/FINAL.md#vs-previous-record-bundle-e3565d4-2015p4f) retrace l'origine du problème jusqu'à l'ordre de validation, plutôt qu'à une capacité manquante du worker.

L'implémentation vérifiait la liaison de la texture avant de vérifier si la source était sécurisée au niveau de l'origine. Le correctif `7d8718a` a déplacé le contrôle de sécurité avant la validation de la liaison sur les six points d'entrée de source d'image concernés, couvrant à la fois les chargements d'images et de sous-images. La page affectée est passée de **9 sous-tests réussis / 4 en échec à 13 / 0**.

Il s'agit d'un problème d'intégration : les deux vérifications existaient, mais leur ordonnancement modifiait le comportement observable de l'API. Le résultat visé a ensuite été inclus dans une exécution de la suite complète, plutôt que d'être traité comme une preuve que les comportements non liés restaient inchangés.

## Une texture à haute profondeur de bits échouait avant d'atteindre le moteur de rendu

Une deuxième page testait une entrée de texture de plus haute précision. Le même registre identifie un chemin de décodage d'image qui réduisait la source à huit bits par canal avant le chargement. Les correctifs `89e4559` et `9bd7811` ont ajouté un chemin PNG 16 bits en JavaScript et corrigé la gestion des canaux, y compris l'entrée RGBA.

La page `tex-image-10bpc` est passée de **2 sous-tests réussis / 1 en échec à 3 / 0**. L'implémentation concernée est le [décodeur PNG de la couche de présentation](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/src/present/png.ts). Cet exemple montre pourquoi la modification de l'arithmétique des shaders seule n'aurait pas résolu tous les échecs de précision : les données avaient déjà perdu en précision en amont.

## Vérifier le bundle soumis, y compris le moteur de rendu utilisé

Le [registre final du 29 août](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/tests/conformance/FINAL.md) identifie le commit du bundle `c4ffbff`. Il précise que le fichier `renderer.js` présent dans le dépôt a été testé tel quel, sans être reconstruit pour la vérification.

| Suite évaluée | Réussis | Échoués | Timeouts / erreurs |
| --- | --- | --- | --- |
| WebGL1 | 833/835 | 2 | 0 / 0 |
| WebGL2 | 1,184/1,184 | 0 | 0 / 0 |
| Combinée | 2,017/2,019 | 2 | 0 / 0 |

Le dénominateur suit les manifestes de cette arborescence de tests. Le registre indique également que les 2 019 pages notées ont toutes signalé que le moteur de rendu logiciel était actif, de sorte que le repli natif (native fallback) n'a pas fourni les résultats réussis. Pour ces deux pages WebGL2 corrigées, l'exécution complète a récupéré les deux échecs tout en préservant les pages qui réussissaient précédemment.

![Résultats de conformité WebGL pour l'exécution documentée de Genesis](./wasm-render-results-en.png)

*Figure des résultats historiques ; le registre final versionné définit les manifestes et les décomptes évalués.*

## Enquêter sur les échecs résiduels avec un témoin

Deux pages WebGL1 sont restées en échec. Le registre final attribue le cas de couleur à faible alpha au comportement de présentation/lecture du canvas 2D de Chromium et signale le même échec avec WebGL natif. Pour les identifiants de shader avec double soulignement, il indique que Chrome natif a également échoué sur la page de test.

Il s'agit des résultats témoins documentés du projet, et non d'une reproduction indépendante. Ils expliquent la classification des résidus par les auteurs sans transformer le score de 2 017/2 019 en une revendication de compatibilité inconditionnelle.

La comparaison visuelle est une vérification distincte. Le compte rendu Evidence signale **16/38 pages three.js à un seuil strict de 0,1 % de pixels** et **13/16 scènes Babylon.js**, tous deux étant des sous-ensembles sélectionnés. La conformité API et la correspondance des pixels mesurent des propriétés différentes ; le nombre élevé de tests CTS réussis n'efface pas les échecs visuels.

## Suivre un échec de la page de test jusqu'à l'artéfact final

Une fois les arborescences de tests et les dépendances du harnais préparées, le registre final documente ce point d'entrée WebGL2 :

```bash
npx tsx tests/conformance/run.ts --renderer ./renderer.js --suite webgl2 --report tests/reports/webgl2-FINAL2.json
```

Le registre note que les sorties JSON détaillées sont ignorées par git. Son rapport enregistré et ses identifiants de correctifs constituent la trace publique ; cet article n'a pas réexécuté la suite.

Les 135 165 lignes de texte suivies de l'archive incluent le bundle généré, le matériel tiers, les fichiers de verrouillage (lockfiles) et la documentation. Les 36 $ US couvrent les jetons de modèle, hors matériel. Commencez par le correctif de l'ordre de validation et sa page de test lors de l'inspection de ce cas : il relie un échec spécifique, une modification du code source et le résultat intégré sans se fier uniquement au volume de code.
