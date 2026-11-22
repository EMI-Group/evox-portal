---
title: "Genesis aggiunge una ricerca opzionale senza chiave API"
pubDate: 2026-11-22
summary: "L’adattatore Keenable abilita esplicitamente la ricerca pubblica conservando accesso con chiave e provider predefinito."
---

Una ricerca di un Agent può fermarsi prima della prima query se richiede credenziali aggiuntive. La PR #174 di Genesis, integrata in `main` il 19 novembre 2026, aggiunge **Keenable** come provider opzionale con endpoint pubblico utilizzabile senza chiave API configurata. Le installazioni esistenti mantengono il comportamento predefinito. [Adattatore integrato][pr]

![Un ingresso aperto di biblioteca conduce a documenti selezionati con riferimenti](./cover.webp)

*Illustrazione concettuale: un percorso pubblico opzionale verso la ricerca web.*

## Abilitare esplicitamente il percorso pubblico

In `[tools.search]`, imposti `enabled = true` e `provider = "keenable"`. Senza chiave, l’adattatore invia query e limite dei risultati all’endpoint pubblico con `X-Keenable-Title: Genesis`, omettendo `X-API-Key`. Aggiungendo `KEENABLE_API_KEY` all’archivio credenziali viene scelto l’accesso con chiave. [Costruzione delle richieste][adapter]

L’implementazione modifica entrambi i controlli necessari: il provider selezionato capace di operare senza chiave può abilitare lo strumento di ricerca dell’Agent e non viene più rifiutato in esecuzione per la sola assenza della chiave. Gli altri provider mantengono i controlli sulle credenziali.

## Leggere i risultati insieme ai limiti

Per raccogliere riferimenti documentali, questo elimina un passaggio di configurazione. Titoli, URL e `snippet` vengono convertiti nel formato di risultati esistente. `max_results` viene rispettato; Keenable non ha un equivalente di `search_depth`, quindi l’opzione viene ignorata. [Mappatura delle risposte][adapter]

Il percorso pubblico limita le richieste per IP. La PR riporta test di costruzione, parsing e abilitazione, inclusa un’esecuzione simulata, ma nessuna chiamata reale all’API Keenable. Dopo l’attivazione, provi una piccola query dall’host effettivo e controlli collegamenti alle fonti ed eventuali errori prima di affidargli una ricerca più ampia. [Controlli registrati][pr]

[pr]: https://github.com/EMI-Group/genesis/pull/174
[adapter]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/agent/tools/web_search_providers.ex
