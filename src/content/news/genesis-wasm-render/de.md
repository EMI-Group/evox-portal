---
title: "Genesis WASM Render: Korrektur von Validierungsreihenfolge und Pixelpräzision in einem WebGL-Renderer"
pubDate: 2026-10-15
updatedDate: 2026-11-10
summary: "Zwei dokumentierte WebGL2-Fixes verknüpfen Ursachen mit Regressionsergebnissen, während das abschließende Verifizierungsprotokoll zwischen API-Konformität und visuellem Abgleich unterscheidet."
---

Ein Software-WebGL-Renderer muss mehr leisten, als nur ein erkennbares Bild zu zeichnen. Er muss Shader kompilieren, den API-Status verwalten, Eingaben in der richtigen Reihenfolge validieren und die Bildpräzision über Modulgrenzen hinweg bewahren. Der Fall Genesis WASM Render enthält zwei konkrete Beispiele dafür, wie diese Anforderungen debuggt und erneut geprüft wurden.

![Drahtgittergeometrie wird zu einem schattierten Pixelbild](./software-graphics-pipeline.webp)

Der [Evidence-Bericht](https://genesis.evox.group/evidence/tbench-wasm/) beschreibt eine TypeScript-Implementierung, die mit DeepSeek V4 Flash entwickelt wurde: 2.017/2.019 bestandene Khronos CTS-Fälle, etwa 36 US-Dollar an Modell-Token-Kosten und 65,9 Stunden zwischen dem ersten und letzten Agent-Commit. Dieser Zeitraum entspricht der Historie des Repositories, nicht der gemessenen aktiven Laufzeit der Agenten.

## Aufteilung der Pipeline entlang nutzbarer Schnittstellen

Die [Quellarchitektur](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/src/CONTEXT.md) trennt Shader-Kompilierung und -Linking, Rasterisierung, WebGL-Status und -Objekte sowie Präsentation/Bilddekodierung. Ein Shader-Ergebnis muss noch Interpolation, Fragment-Ausführung, Texturbehandlung und den Drawing-Buffer durchlaufen, bevor es zu einem sichtbaren Bild wird.

Der Renderer ohne Laufzeitabhängigkeiten zielt auf eine Ausführung ohne natives GPU-Rendering ab. Browserbasierte Konformitäts-Harnesses werden dennoch zum Testen verwendet; diese Verifizierungsumgebung ist von dem Anspruch des Renderers auf Unabhängigkeit von Laufzeitkomponenten zu trennen.

## Ein Sicherheitsfehler musste vor einem Texturbindungsfehler auftreten

Eine fehlerhafte WebGL2-Seite betraf eine bildbasierte Quelle mit Origin-Tainting. Das [abschließende Verifizierungsprotokoll](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/tests/conformance/FINAL.md#vs-previous-record-bundle-e3565d4-2015p4f) führt dies auf die Validierungsreihenfolge zurück und nicht auf eine fehlende Worker-Funktionalität.

Die Implementierung prüfte die Texturbindung, bevor sie prüfte, ob die Quelle "origin-clean" war. Fix `7d8718a` verschob die Sicherheitsprüfung vor die Bindungsvalidierung über alle sechs relevanten Einstiegspunkte für Bildquellen hinweg, was sowohl Bild- als auch Teilbilduploads abdeckt. Die betroffene Seite änderte sich von **9 bestandenen / 4 fehlgeschlagenen Subtests auf 13 / 0**.

Dies ist ein Integrationsproblem: Beide Prüfungen existierten, aber ihre Reihenfolge änderte das beobachtbare API-Verhalten. Das angestrebte Ergebnis wurde dann in einen vollständigen Suite-Durchlauf einbezogen, anstatt es als Beweis dafür zu behandeln, dass nicht zusammenhängendes Verhalten unverändert blieb.

## Eine Textur mit hoher Bittiefe scheiterte, bevor sie den Renderer erreichte

Eine zweite Seite testete Textureingaben mit höherer Präzision. Dasselbe Protokoll identifiziert einen Bilddekodierungspfad, der die Quelle vor dem Hochladen auf acht Bit pro Kanal reduzierte. Die Fixes `89e4559` und `9bd7811` fügten einen JavaScript-16-Bit-PNG-Pfad hinzu und korrigierten die Kanalbehandlung, einschließlich RGBA-Eingaben.

Die Seite `tex-image-10bpc` verbesserte sich von **2 bestandenen / 1 fehlgeschlagenen Subtest auf 3 / 0**. Die relevante Implementierung ist der [PNG-Decoder der Präsentationsschicht](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/src/present/png.ts). Dieses Beispiel zeigt, warum eine Änderung der Shader-Arithmetik allein nicht jeden Präzisionsfehler behoben hätte: Die Daten hatten bereits im Vorfeld an Präzision verloren.

## Verifizierung des eingereichten Bundles, einschließlich des aktiven Renderers

Das [abschließende Protokoll vom 29. August](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/tests/conformance/FINAL.md) identifiziert den Bundle-Commit `c4ffbff`. Es besagt, dass die eingecheckte Datei `renderer.js` so getestet wurde, wie sie ausgecheckt wurde, ohne sie für die Verifizierung neu zu erstellen.

| Evaluierte Suite | Bestanden | Fehlgeschlagen | Timeouts / Fehler |
| --- | --- | --- | --- |
| WebGL1 | 833/835 | 2 | 0 / 0 |
| WebGL2 | 1.184/1.184 | 0 | 0 / 0 |
| Kombiniert | 2.017/2.019 | 2 | 0 / 0 |

Der Nenner folgt den Manifesten in diesem Testbaum. Das Protokoll gibt zudem an, dass alle 2.019 bewerteten Seiten den Software-Renderer als aktiv meldeten, sodass kein natives Fallback die positiven Ergebnisse lieferte. Für diese zwei korrigierten WebGL2-Seiten stellte der vollständige Durchlauf beide Fehler ab, während die zuvor bestandenen Seiten erhalten blieben.

![WebGL-Konformitätsergebnisse für den dokumentierten Genesis-Lauf](./wasm-render-results-en.png)

*Historische Ergebnisgrafik; das versionierte Abschlussprotokoll definiert die evaluierten Manifeste und Zählungen.*

## Untersuchung verbleibender Fehler mit einer Kontrolle

Zwei WebGL1-Seiten blieben fehlerhaft. Das Abschlussprotokoll führt den Fall mit niedrigen Alpha-Farbwerten auf das 2D-Canvas-Präsentations- und Readback-Verhalten von Chromium zurück und meldet denselben Fehler bei nativem WebGL. Für Shader-Identifikatoren mit doppeltem Unterstrich wird berichtet, dass auch das native Chrome die Testseite nicht bestand.

Dies sind die dokumentierten Kontrollergebnisse des Projekts, keine unabhängige Reproduktion. Sie erklären die Klassifizierung der verbleibenden Fehler durch die Autoren, ohne 2.017/2.019 in einen bedingungslosen Kompatibilitätsanspruch zu verwandeln.

Der visuelle Vergleich ist eine separate Prüfung. Der Evidence-Bericht meldet **16/38 three.js-Seiten bei einem strengen Pixelschwellenwert von 0,1 %** und **13/16 Babylon.js-Szenen**, beides ausgewählte Teilmengen. API-Konformität und Pixelübereinstimmung messen unterschiedliche Eigenschaften; die hohe CTS-Zahl beseitigt die visuellen Fehler nicht.

## Verfolgung eines Fehlers von der Testseite bis zum fertigen Artefakt

Nachdem die erforderlichen Testbäume und Harness-Abhängigkeiten vorbereitet wurden, dokumentiert das Abschlussprotokoll diesen WebGL2-Einstiegspunkt:

```bash
npx tsx tests/conformance/run.ts --renderer ./renderer.js --suite webgl2 --report tests/reports/webgl2-FINAL2.json
```

Das Protokoll merkt an, dass die detaillierten JSON-Ausgaben in der .gitignore-Datei stehen. Der eingecheckte Bericht und die Fix-Identifikatoren bilden die öffentliche Spur; dieser Artikel hat die Suite nicht erneut ausgeführt.

Die 135.165 verfolgten Textzeilen des Archivs umfassen das generierte Bundle, Drittanbieter-Material, Lockfiles und Dokumentation. 36 US-Dollar decken die Modell-Token ab, exklusive Hardware. Beginnen Sie bei der Untersuchung dieses Falls mit dem Fix für die Validierungsreihenfolge und der zugehörigen Testseite: Er verbindet einen spezifischen Fehler, eine Quellcodeänderung und das integrierte Ergebnis, ohne sich allein auf das Codevolumen zu verlassen.
