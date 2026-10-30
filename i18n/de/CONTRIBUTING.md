<sub>[English](../../CONTRIBUTING.md) | [Tiếng Việt](../vi/CONTRIBUTING.md) | [한국어](../ko/CONTRIBUTING.md) | [简体中文](../zh/CONTRIBUTING.md) | [日本語](../ja/CONTRIBUTING.md) | **Deutsch** | [Français](../fr/CONTRIBUTING.md)</sub>

# Mitwirken

> Diese Übersetzung kann hinter der englischen Fassung zurückliegen. Bei Abweichungen ist die [englische Fassung](../../CONTRIBUTING.md) maßgeblich.

Danke für die Unterstützung. Fehlerberichte, Korrekturen an der Dokumentation und Pull Requests sind gleichermaßen willkommen.

Von allen Beteiligten wird erwartet, dass sie den [Verhaltenskodex](./CODE_OF_CONDUCT.md) einhalten.

## Bevor es losgeht

- **Fehler oder kleine Korrektur?** Direkt einen Pull Request öffnen – oder ein Issue, falls unklar ist, ob es sich um einen Fehler handelt.
- **Neues Feature oder eine Änderung der öffentlichen API?** Zuerst ein Issue öffnen, damit wir uns auf die Form einigen
  können, bevor Code geschrieben wird.

## Einrichtung

Die Node-Version aus [`.nvmrc`](../../.nvmrc) verwenden (`nvm use`), dann:

```sh
npm install            # installiert auch einen pre-push-Hook, der `npm run check` ausführt
npm run dev            # Playground (src/App.vue) mit echten Polaris-Komponenten
npm run docs:dev       # Dokumentations-Website
```

## Grundregeln

1. **`src/lib/generated/` und `docs/components/` niemals von Hand bearbeiten.** Sie werden von den
   Generatoren überschrieben. Stattdessen `scripts/generate.mjs` / `scripts/generate-docs.mjs` ändern, dann
   `npm run generate && npm run docs:generate` ausführen und das Ergebnis committen.
2. **Neue Formularkomponente braucht v-model?** Eine Zeile in `src/lib/overrides.ts` ergänzen (der
   Drift-Guard in `overrides.spec.ts` zeigt genau, was fehlt).
3. **Kuratiertes Beispiel für die Dokumentation?** `docs/examples/<tag>.md` anlegen (komplexe Live-Demos gehören in
   `docs/examples/demos/*.vue`, da SFCs nicht von markdown-it verstümmelt werden); der Docs-Generator
   bindet es automatisch ein. Von Hand geschriebene Best Practices gehören in `docs/best-practices/<tag>.md`.
4. **Polaris-Verhalten im echten Browser überprüfen.** Aussagen über Polaris-Komponenten (Slot-Regeln,
   Rendering-Eigenheiten) müssen gegen die echte CDN-Runtime (`polaris-2.js`) geprüft werden, nicht nur
   gegen jsdom. Bereits überprüfte Erkenntnisse stehen in [`docs/guide/quirks.md`](../../docs/guide/quirks.md).
5. **Einen Test hinzufügen** für jede Verhaltensänderung in `src/lib/runtime/` oder in den Generatoren.

## Bevor ein Pull Request geöffnet wird

Dieselben Prüfungen ausführen, die auch die CI ausführt:

```sh
npm run generate && npm run docs:generate   # generierter Code muss aktuell sein
npm run check                               # oxlint + eslint + vue-tsc
npx vitest run
npm run build:lib
npm run docs:build                          # bei Änderungen an der Doku oder am Docs-Generator
```

Danach:

- **Eine Zeile in `CHANGELOG.md` ergänzen** unter `## [Unreleased]` (in `Added`, `Changed`, `Fixed` oder
  `Removed`) für alles, was Nutzende des Pakets bemerken würden. Reine Doku- und interne Änderungen
  brauchen keinen Eintrag. Das CHANGELOG wird auf Englisch geführt.
- **Den PR-Titel im Stil von [Conventional Commits](https://www.conventionalcommits.org/) formulieren**:
  `fix: ...`, `feat: ...`, `docs: ...`, `chore: ...`, `test: ...`. Breaking Changes mit `!` kennzeichnen
  (`feat!: ...`).
- Pro Pull Request nur eine Änderung.

## Was nach dem Öffnen eines Pull Requests passiert

- Beim ersten Beitrag wartet GitHub Actions darauf, dass ein Maintainer den CI-Lauf freigibt.
  Das ist eine Schutzmaßnahme von GitHub für Pull Requests aus Forks, keine Bewertung der Änderung.
- Der Maintainer prüft und mergt die Änderung und liefert sie mit dem nächsten Release aus. Releases erstellt
  der Maintainer (siehe [Release-Prozess](./README.md#release-prozess)).

## Sicherheit

Eine Sicherheitslücke gefunden? Bitte kein Issue öffnen, sondern die [Sicherheitsrichtlinie](./SECURITY.md) beachten.

## Lizenz

Mit einem Beitrag wird zugestimmt, dass er unter der [MIT-Lizenz](../../LICENSE) lizenziert wird.
