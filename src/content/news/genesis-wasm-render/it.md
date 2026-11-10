---
title: "Genesis WASM Render: correzione dell'ordine di validazione e della precisione dei pixel in un renderer WebGL"
pubDate: 2026-10-15
updatedDate: 2026-11-10
summary: "Due correzioni WebGL2 documentate collegano le cause scatenanti ai risultati delle regressioni, mentre il record di verifica finale distingue la conformità API dalla corrispondenza visiva."
---

Un renderer WebGL software deve fare molto di più che disegnare un'immagine riconoscibile. Deve compilare shader, mantenere lo stato dell'API, validare gli input nel giusto ordine e preservare la precisione dell'immagine attraverso i confini dei moduli. Il caso Genesis WASM Render contiene due esempi concreti di come tali requisiti siano stati sottoposti a debug e ricontrollati.

![La geometria wireframe diventa un'immagine pixel ombreggiata](./software-graphics-pipeline.webp)

Il [record Evidence](https://genesis.evox.group/evidence/tbench-wasm/) descrive un'implementazione TypeScript sviluppata con DeepSeek V4 Flash: 2.017/2.019 casi Khronos CTS superati, circa 36 USD in costi per i token del modello e 65,9 ore tra il primo e l'ultimo commit dell'agente. Tale intervallo rappresenta l'estensione della cronologia del repository, non il tempo di esecuzione attivo dell'agente misurato.

## Dividere la pipeline lungo interfacce utilizzabili

L'[architettura sorgente](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/src/CONTEXT.md) separa la compilazione e il linking degli shader, la rasterizzazione, lo stato e gli oggetti WebGL, e la presentazione/decodifica delle immagini. Il risultato di uno shader deve comunque passare attraverso l'interpolazione, l'esecuzione dei frammenti, la gestione delle texture e il buffer di disegno prima di diventare un'immagine visibile.

Il renderer, privo di dipendenze a runtime, punta a un'esecuzione senza rendering GPU nativo. Per testarlo vengono comunque utilizzati harness di conformità basati su browser; tale ambiente di verifica è distinto dalla dichiarazione di assenza di dipendenze a runtime del renderer.

## Un errore di sicurezza doveva verificarsi prima di un errore di texture-binding

Una pagina WebGL2 che presentava errori riguardava una sorgente immagine con origine compromessa (origin-tainted). Il [record di verifica finale](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/tests/conformance/FINAL.md#vs-previous-record-bundle-e3565d4-2015p4f) ne traccia l'origine nell'ordine di validazione, piuttosto che in una mancanza di funzionalità del worker.

L'implementazione controllava il binding della texture prima di verificare se la sorgente fosse "origin-clean". La correzione `7d8718a` ha spostato il controllo di sicurezza prima della validazione del binding in tutti e sei i punti di ingresso rilevanti per la sorgente immagine, coprendo sia i caricamenti di immagini che di sotto-immagini. La pagina interessata è passata da **9 subtest superati / 4 falliti a 13 / 0**.

Si tratta di un problema di integrazione: entrambi i controlli esistevano, ma il loro ordine ha cambiato il comportamento osservabile dell'API. Il risultato mirato è stato quindi incluso in un'esecuzione dell'intera suite, invece di essere trattato come prova che il comportamento non correlato fosse rimasto invariato.

## Una texture ad alta profondità di bit falliva prima di raggiungere il renderer

Una seconda pagina testava l'input di texture a precisione superiore. Il medesimo record identifica un percorso di decodifica dell'immagine che riduceva la sorgente a otto bit per canale prima del caricamento. Le correzioni `89e4559` e `9bd7811` hanno aggiunto un percorso PNG a 16 bit in JavaScript e corretto la gestione dei canali, incluso l'input RGBA.

La pagina `tex-image-10bpc` è passata da **2 subtest superati / 1 fallito a 3 / 0**. L'implementazione pertinente è il [decoder PNG del livello di presentazione](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/src/present/png.ts). Questo esempio mostra perché la sola modifica dell'aritmetica dello shader non avrebbe risolto ogni errore di precisione: i dati avevano già perso precisione a monte.

## Verificare il bundle inviato, incluso quale renderer è stato eseguito

Il [record finale del 29 agosto](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/tests/conformance/FINAL.md) identifica il commit del bundle `c4ffbff`. Specifica che il file `renderer.js` archiviato è stato testato così come estratto, senza ricostruirlo per la verifica.

| Suite valutata | Superati | Falliti | Timeout / errori |
| --- | --- | --- | --- |
| WebGL1 | 833/835 | 2 | 0 / 0 |
| WebGL2 | 1.184/1.184 | 0 | 0 / 0 |
| Combinata | 2.017/2.019 | 2 | 0 / 0 |

Il denominatore segue i manifest in quell'albero di test. Il record afferma inoltre che tutte le 2.019 pagine valutate riportavano il renderer software come attivo, quindi il fallback nativo non ha fornito i risultati positivi. Per quelle due pagine WebGL2 corrette, l'esecuzione completa ha recuperato entrambi i fallimenti preservando le pagine precedentemente superate.

![Risultati di conformità WebGL per l'esecuzione documentata di Genesis](./wasm-render-results-en.png)

*Figura dei risultati storici; il record finale con versione definisce i manifest e i conteggi valutati.*

## Indagare i fallimenti residui con un controllo

Due pagine WebGL1 sono rimaste in stato di fallimento. Il record finale attribuisce il caso del colore con alpha basso al comportamento di presentazione/readback del canvas 2D di Chromium e riporta lo stesso errore con WebGL nativo. Per gli identificatori shader con doppio underscore, riporta che anche Chrome nativo ha fallito la pagina di test.

Questi sono i risultati di controllo documentati del progetto, non una riproduzione indipendente. Spiegano la classificazione dei residui da parte degli autori senza trasformare il risultato 2.017/2.019 in una dichiarazione di compatibilità incondizionata.

Il confronto visivo è un controllo separato. Il record Evidence riporta **16/38 pagine three.js a una soglia rigorosa dello 0,1% di pixel** e **13/16 scene Babylon.js**, entrambi sottoinsiemi selezionati. La conformità API e la corrispondenza dei pixel misurano proprietà diverse; l'alto conteggio CTS non cancella i fallimenti visivi.

## Seguire un fallimento dalla pagina di test all'artefatto finale

Con gli alberi di test richiesti e le dipendenze dell'harness preparati, il record finale documenta questo punto di ingresso WebGL2:

```bash
npx tsx tests/conformance/run.ts --renderer ./renderer.js --suite webgl2 --report tests/reports/webgl2-FINAL2.json
```

Il record nota che gli output JSON dettagliati sono inclusi nel gitignore. Il report archiviato e gli identificatori delle correzioni costituiscono la traccia pubblica; questo articolo non ha eseguito nuovamente la suite.

Le 135.165 righe di testo tracciate nell'archivio includono il bundle generato, materiale di terze parti, file di lock e documentazione. I 36 USD coprono i token del modello, escluso l'hardware. Per ispezionare questo caso, si consiglia di iniziare dalla correzione dell'ordine di validazione e dalla relativa pagina di test: essa collega un fallimento specifico, una modifica al sorgente e il risultato integrato senza fare affidamento esclusivamente sul volume del codice.
