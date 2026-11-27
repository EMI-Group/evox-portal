---
title: "Genesis riunisce progetti, conversazioni e Git in un unico ambiente di lavoro"
pubDate: 2026-11-22
updatedDate: 2026-11-27
summary: "Le bozze per progetto e gli spazi VCT mantengono il contesto associato al repository e al nodo corretti durante il cambio di attività."
---

Passare da una conversazione a un’attività di sviluppo e alle modifiche Git non dovrebbe richiedere di ricostruire ogni volta il contesto. La PR #175 di Genesis, integrata in `main` il 20 novembre 2026, introduce un ambiente LiveView con navigazione per progetto, schede, cronologia di attività e conversazioni, pannello Git e impostazioni integrate. Le modifiche agli spazi VCT e all’ambito delle bozze permettono di mantenere l’identità del progetto fra queste viste. [Integrazione][pr]

![Cassetti separati conservano appunti e strumenti di ciascun progetto su un banco condiviso](./cover.webp)

*Illustrazione concettuale: ogni progetto conserva il proprio contesto di lavoro.*

## Esaminare il progetto in un solo posto

L’ambiente unisce navigazione e viste operative. Può tornare a un progetto, consultarne attività o conversazioni ed esaminare le modifiche Git senza ripartire da zero in ogni vista. L’integrazione conserva selettore degli spazi, configurazione degli account e pausa/ripresa delle attività. Ripristina inoltre il contesto di approvazione dopo la riconnessione. Sono miglioramenti di continuità rispetto al [precedente flusso Assistant][previous], le cui approvazioni strutturate determinano ancora l’azione autorizzata. [Integrazione dell’ambiente][pr]

Si consideri chi alterna una libreria e l’applicazione che la utilizza. La bozza di requisiti della libreria deve restare associata a questa quando si apre la scheda dell’applicazione. Un’operazione Git deve raggiungere server e repository del progetto selezionato. Le modifiche verificano l’appartenenza del progetto prima delle operazioni Git e mantengono il nodo scelto quando la connessione non è disponibile, senza trasferire l’operazione all’host della dashboard.

## L’identità della bozza va oltre il percorso

Il modulo condiviso `DraftScope` identifica una bozza del browser con `{node, token}`. Un progetto già montato nel Virtual Context Tree usa il punto `vct:///projects/<name>`; altrimenti viene usato il percorso assoluto del sistema operativo. Il punto ha precedenza se sono presenti entrambi. Diverse scritture del percorso dello stesso progetto montato raggiungono così un’unica bozza, mentre punti VCT distinti sul medesimo percorso rimangono separati. [Implementazione][scope]

La chiave di archiviazione nel browser combina nodo e token. Una correzione successiva acquisisce la bozza indicizzata per percorso quando diventa disponibile il punto VCT, coprendo il passaggio dalla scelta di una cartella alla registrazione del progetto. È continuità della bozza nel browser, distinta dalla persistenza delle attività o dalla garanzia di recuperare stabilmente le conversazioni dopo un riavvio del server. [Acquisizione della bozza][adopt]

Per un progetto remoto è importante preservare esattamente il percorso: la dashboard non deve normalizzarlo secondo il filesystem dell’host del browser. Prima di inviare una bozza ripristinata, verifichi nodo, repository e modello, soprattutto dopo un passaggio fra progetti locali e remoti.

## Gli spazi raggruppano progetti; le attività richiedono una cartella

VCT introduce un livello di raggruppamento in `vct:///workspaces/<name>`. Uno spazio ha membri ordinati e una descrizione facoltativa. I membri indicano punti di montaggio di progetti o percorsi del sistema; gli spazi non sono annidabili. La palette Projects e il selettore Assistant mostrano i gruppi, mentre API in sola lettura ne espongono i membri. [Interfaccia operativa][workspace]

Un gruppo non possiede una cartella di esecuzione. Perciò `DraftScope.path/1` non restituisce un percorso per una selezione limitata allo spazio, e l’ammissione delle attività rifiuta punti VCT come percorsi di esecuzione. Nell’esempio, raggruppi libreria e applicazione per consultarle insieme, poi scelga il membro concreto cui assegnare l’attività. Lo spazio non rende tutti i membri destinazioni implicite di scrittura.

Dal checkout sorgente, `mix vct.workspace list` e `mix vct.workspace show <name>` esaminano i gruppi. Il comando documentato `create` accetta argomenti `--member` ripetuti e l’opzione `--data-dir`; usi la cartella dati dell’istanza Genesis desiderata. L’ispezione segnala membri mancanti invece di ometterli. Consulti il contratto del comando prima di modificare un gruppo.

## Verificare il passaggio fra viste

La PR riporta controlli nel browser per creazione e completamento di attività, invio da tastiera e streaming Assistant, e schermata di configurazione account. Registra anche un timeout in una query Assistant sulle attività di un progetto. In un flusso lungo, accettazione della richiesta e osservazione del risultato sono eventi distinti. [Verifiche registrate][pr]

Con una build che include queste modifiche, provi due progetti con bozze diverse, riconnetta il nodo e apra il pannello Git del progetto previsto. Controlli che la bozza torni al progetto corretto e che l’approvazione mostri la destinazione reale. Segua poi lo stato registrato dell’attività, senza considerare una scheda ripristinata prova del completamento del lavoro in background.

[pr]: https://github.com/EMI-Group/genesis/pull/175
[previous]: /it/news/genesis-assistant-project-workflows
[scope]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_dash/lib/evo_dash_web/live/draft_scope.ex
[adopt]: https://github.com/EMI-Group/genesis/commit/a0f7b141ed448590030f6d36de951bbb1ca3673e
[workspace]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/mix/tasks/vct.workspace.ex

I miglioramenti del 25 novembre 2026 mantengono le opzioni nel modulo, aprono i progetti scelti esplicitamente nella panoramica e indirizzano le attività in corso a un ispettore agenti filtrato per attività. La bozza Assistant del progetto compare solo dopo la conferma della sua identità, conservando progetto e nodo durante la navigazione. [GitHub](https://github.com/EMI-Group/genesis/commit/c40b76d207345ed6b9dc1435887b3482ff3ad9a4) · [GitHub](https://github.com/EMI-Group/genesis/commit/732f127e1712424fc4501bfe59200fa4661514f4) · [GitHub](https://github.com/EMI-Group/genesis/commit/e3bba720387f921bd72dda49016cdfb4ef0fa46b) · [GitHub](https://github.com/EMI-Group/genesis/commit/4f8a233f89a1dcecb63ce3d342b437b4d4fbf8af).

La PR #178, integrata in main il 27 novembre 2026, migliora il selettore esistente: progetti recenti per primi, esplorazione delle cartelle e inserimento manuale del percorso disponibile ma compresso. La scelta conserva la bozza e resta legata alla conversazione che ha aperto la finestra; una finestra scaduta non può modificarne un’altra. Su Windows il pulsante computer esplora le radici dei dischi del nodo selezionato. Gli avvisi interni spariscono dalla trascrizione visibile ma il modello conserva il contesto; il primo invio non duplica più la cronologia. Dopo un cambio di progetto si attenda che History risolva il nuovo ambito prima di controllare i risultati. [PR #178](https://github.com/EMI-Group/genesis/pull/178) · [History](https://github.com/EMI-Group/genesis/commit/0fc1182ea3e53baa50613f3504ff0a52798984dd).
