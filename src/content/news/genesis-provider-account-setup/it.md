---
title: "Genesis collega configurazione degli account, modelli e accesso ChatGPT"
pubDate: 2026-11-22
updatedDate: 2026-11-26
summary: "Un assistente rinnovato riunisce credenziali, inventari dei modelli, ragionamento e orari con una connessione ChatGPT gestita da Genesis."
---

Una connessione utilizzabile richiede più del nome di un modello: autenticazione, endpoint, ragionamento supportato e limiti condivisi devono corrispondere. Le modifiche integrate in Genesis `main` il 19–20 novembre 2026 ricostruiscono Welcome e Settings attorno agli account dei provider. La PR #175 aggiunge **Sign in with ChatGPT**, sostituendo l’importazione delle credenziali Codex per i profili in abbonamento ChatGPT. [Integrazione][pr]

![Una chiave di account e i componenti del modello scelto trovano posto in una custodia ordinata](./cover.webp)

*Illustrazione concettuale: autenticazione e modelli appartengono allo stesso account configurato.*

## Configurare l’account, poi i modelli

Welcome utilizza una procedura guidata per provider; Settings gestisce gli account nel tempo. Nomi e identificatori generati derivano dal provider, non dal modello selezionato. Un account può contenere più modelli e livelli di ragionamento con credenziali, concorrenza e orari condivisi. Account separati restano opportuni quando queste proprietà differiscono. [Contratto dei profili][profiles]

Un gruppo che utilizza un endpoint compatibile con OpenAI può configurare una volta URL di base e credenziale, aggiungere i modelli effettivamente serviti e scegliere modello e ragionamento per l’attività. L’integrazione rende accessibile l’inserimento di chiavi API per endpoint personalizzati e instrada i relativi account tramite OpenAI Chat Completions. Ogni modello selezionabile deve comparire nell’inventario: il solo nome del modello predefinito non lo registra. Provi il modello scelto, non soltanto la compilazione del campo credenziale. [Integrazione e controlli browser][pr]

La procedura distingue i livelli di ragionamento dichiarati dal valore predefinito. Quello selezionato raggiunge la voce salvata del modello e la richiesta di test. La scala canonica è `none`, `minimal`, `low`, `medium`, `high`, `xhigh`; il vecchio `max` viene letto come `xhigh` e risalvato in questa forma. Le grafie del provider vengono adattate al confine della richiesta. Il supporto dipende dal modello reale: mostrare la scala non prova che ogni endpoint accetti tutti i livelli. [Regole di ragionamento][profiles]

## Autorizzare ChatGPT attraverso Genesis

Scelga **ChatGPT Subscription** in Welcome o **Settings → LLM → Provider accounts**. La guida versionata indica `genesis chatgpt login`, `genesis chatgpt status` e `genesis chatgpt models` per accesso e controllo. Dal sorgente, il comando è `mix genesis.chatgpt login`. Apra l’URL mostrato nel browser e autorizzi Genesis. [Guida all’abbonamento][oauth]

Dopo l’accesso, usi **Check connection**, scelga la registrazione e un modello disponibile per quell’account. In Settings salvi l’account prima di **Connection Test**; Welcome testa il modello prima del completamento. Per compatibilità il profilo mantiene `provider = "openai_codex"`, con `auth_mode = "oauth"` e `siwc_account` a identificare la registrazione Genesis.

I profili esistenti richiedono una nuova autorizzazione attraverso Genesis: questa connessione non utilizza le credenziali importate in passato da Codex. Se il vecchio modello manca nell’inventario appena rilevato, ne scelga uno disponibile. Gli account OpenAI con chiave API restano separati. Per più registrazioni, usi un alias esplicito, per esempio `genesis chatgpt login --account work`, quindi lo selezioni nel profilo. [Migrazione e alias][oauth]

## Mantenere la connessione sull’host di esecuzione

Le credenziali dell’account scelto vengono risolte e rinnovate sul nodo di esecuzione. Gli aggiornamenti sono serializzati fra CLI di accesso e server attivo. Una registrazione visibile nel browser non viene così confusa con una connessione su un altro host remoto. [Archivio account][store]

Per l’installazione autonoma, la guida descrive l’inoltro SSH della porta di accesso loopback e l’esecuzione del login con lo stesso utente e cartella di configurazione del servizio Genesis. Documenta inoltre il trasferimento protetto delle credenziali e `GENESIS_SIWC_HTTPS_PROXY` per host che richiedono un proxy HTTP CONNECT. Segua le istruzioni dell’host prima di provare l’inferenza: accedere sul portatile non configura un server indipendente.

I controlli ChatGPT di rinnovo e streaming della PR utilizzavano fixture; nella revisione restava da verificare una nuova autorizzazione nel browser con un account reale. Per la propria installazione, una risposta effettiva del modello sull’host previsto è la conferma pratica. [Ambito delle verifiche][pr]

## Rendere espliciti gli orari dell’account

Lo stesso account contiene concorrenza di punta e fuori punta, fuso orario e pianificazione. I nuovi preset precompilano gli orari supportati, ma i numeri di slot sono valori Genesis modificabili, non garanzie di capacità del provider o risparmio. Tutti i modelli dell’account condividono gli slot; aggiungerne uno non crea un’altra quota. [Implementazione dei preset][presets]

`off_peak_holidays = "CN"` aggiunge il calendario cinese incluso, con i giorni lavorativi compensativi. I dati statici coprono il 2025–2027 e non si aggiornano da soli. Verifichi fuso, regole del fine settimana e ipotesi dei preset. Una concorrenza di punta pari a zero accoda nuove richieste; una riduzione della capacità non interrompe quelle già in corso. [Semantica degli orari][profiles]

Dopo il passaggio a una build con queste modifiche, controlli inventario, ragionamento predefinito e host di ogni account. Riautorizzi il profilo ChatGPT ed esegua il test di connessione. Per gli account pianificati, controlli gli orari salvati e la prossima transizione prevista. Sono verifiche sulle identità e sui limiti che le attività future useranno realmente.

## Aggiornare i modelli dopo il salvataggio

Gli aggiornamenti su `main` del 23 novembre 2026 collegano il salvataggio delle registrazioni ChatGPT all’aggiornamento della configurazione. Sullo stesso nodo di esecuzione, una modifica ricarica il selettore dei modelli del progetto; anche chiudere le impostazioni del workbench richiede il ricaricamento. I risultati scartati producono ora un errore che consente di riprovare, anziché lasciare il caricamento in sospeso. Attenda che la connessione remota sia pronta prima di riprovare. [GitHub](https://github.com/EMI-Group/genesis/commit/ffb0926723a4f2b695b1562a27954041be0cabd6)

Un account incompleto non provoca più un ciclo di arresti dello scheduler. Il sistema registra il modello predefinito non risolvibile: completi l’elenco dei modelli dell’account e ne selezioni uno valido prima di affidarsi a quel valore predefinito. [GitHub](https://github.com/EMI-Group/genesis/commit/868842557371daff7bcf68ce5ad59199b897d807)

[pr]: https://github.com/EMI-Group/genesis/pull/175
[profiles]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/docs/llm-profiles.md
[oauth]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/docs/llm-oauth.md
[store]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/auth/chatgpt/store.ex
[presets]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/config/provider_presets.ex

Dal 25 novembre 2026 il salvataggio delle impostazioni viene rifiutato se l’identità del nodo BEAM locale è cambiata dopo il montaggio della pagina. Ricarichi il contesto del nodo prima di riprovare, evitando una conferma associata a un ambito di configurazione obsoleto. [GitHub](https://github.com/EMI-Group/genesis/commit/5ed383a3e803df692bd105504b36aa65768e7a3b).
