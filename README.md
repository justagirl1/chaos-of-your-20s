# the chaos of being in your 20s

Ein warmer, statischer Blog in Rosé-/Coral-Tönen mit den Kategorien **Milestones**, **Goals** und **Thoughts** — inklusive einem eigenen Editor zum Schreiben und Foto-Upload direkt im Browser.

**Live:** https://justagirl1.github.io/chaos-of-your-20s/
**Editor:** https://justagirl1.github.io/chaos-of-your-20s/editor.html

## Wie es aufgebaut ist

- `index.html` – Startseite mit Kategorie-Filtern und Post-Übersicht
- `post.html` – Einzelansicht eines Posts
- `editor.html` – dein Schreibtisch: Titel, Kategorie, Text (mit Formatierung), Fotos hochladen, direkt veröffentlichen
- `data/posts.json` – **die eigentlichen, veröffentlichten Inhalte.** Das ist die einzige Datei, die alle Besucher:innen sehen.
- `css/style.css`, `js/` – Design & Logik

Es gibt **keinen eigenen Server und keine Datenbank** – gehostet wird kostenlos über GitHub Pages. Veröffentlicht wird direkt aus dem Editor heraus über die GitHub-API, komplett selbstständig, ohne Zwischenschritte.

## Wie das Schreiben & Veröffentlichen funktioniert

1. Öffne den Editor-Link oben.
2. **Einmalig verbinden:** Klapp unten „⚙ Connect website (one-time setup)“ auf, erstelle auf der verlinkten GitHub-Seite einen Token (nur für dieses eine Repo, nur Lese-/Schreibrecht auf Inhalte), füge ihn ein und klick „Save connection“. Der Token bleibt nur in deinem Browser gespeichert.
3. Klicke **„+ New post“**, schreib Titel, wähl eine Kategorie, lade Fotos hoch, schreib deinen Text.
4. Klick **„💾 Save“** – speichert erstmal nur als Entwurf in deinem Browser.
5. Wenn du zufrieden bist: Klick **„🚀 Publish to website“** – nach ca. einer Minute ist der Post live, ganz ohne weitere Schritte.

Unter „Backup (optional)“ gibt es weiterhin Export/Import als reine Sicherheitskopie, falls du z. B. an einem anderen Gerät weiterschreiben willst – für das normale Veröffentlichen brauchst du das aber nicht.

## Kostenlos gehostet über GitHub Pages

Das Repository liegt unter github.com/justagirl1/chaos-of-your-20s, GitHub Pages ist bereits aktiviert. Jede Veröffentlichung über den Editor aktualisiert automatisch die Live-Seite – dauerhaft kostenlos.

## Lokal testen (optional)

Du brauchst keinen speziellen Server – jeder einfache statische Webserver reicht, z. B. per VS-Code-Erweiterung „Live Server“, oder du öffnest die Seite direkt über den gehosteten Link.

## Design

Farben: Rosé (`#e8a0a5`), Coral (`#f2897c`), Creme (`#fff8f4`), warmes Gold (`#d9a679`).
Schriften: „Playfair Display“ für Überschriften, „Poppins“ für Fließtext (via Google Fonts).
