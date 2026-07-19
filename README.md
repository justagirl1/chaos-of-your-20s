# the chaos of being in your 20s

Ein warmer, statischer Blog in Rosé-/Coral-Tönen mit den Kategorien **Milestones**, **Goals** und **Thoughts** — inklusive einem eigenen Editor zum Schreiben und Foto-Upload direkt im Browser.

## Wie es aufgebaut ist

- `index.html` – Startseite mit Kategorie-Filtern und Post-Übersicht
- `post.html` – Einzelansicht eines Posts
- `editor.html` – dein Schreibtisch: Titel, Kategorie, Text (mit Formatierung), Fotos hochladen
- `data/posts.json` – **die eigentlichen, veröffentlichten Inhalte.** Das ist die einzige Datei, die alle Besucher:innen sehen.
- `css/style.css`, `js/` – Design & Logik

Es gibt **keinen Server und keine Datenbank** – die Seite ist zu 100 % statisch und funktioniert überall kostenlos.

## Wie das Schreiben funktioniert

1. Öffne `editor.html` (lokal oder auf deiner gehosteten Seite).
2. Klicke **„+ New post“**, schreib Titel, wähl eine Kategorie, lade Fotos hoch, schreib deinen Text.
3. Klick **„💾 Save“** – das speichert lokal in deinem Browser (IndexedDB), noch nicht öffentlich sichtbar.
4. Wenn du fertig bist: Klick **„⬇ Export posts.json“**. Das lädt eine `posts.json`-Datei mit allen deinen Posts herunter.
5. Ersetze `data/posts.json` in deinem Projektordner durch die heruntergeladene Datei.
6. Lade die Änderung dorthin hoch, wo deine Seite gehostet ist (siehe unten) – fertig, der Post ist live.

> Der Editor ist quasi dein privates Schreibzimmer. Erst der Export macht einen Post für alle sichtbar. So bleibt die Seite komplett statisch und kostenlos hostbar.

Mit **„⬆ Import posts.json“** kannst du eine bestehende `posts.json` wieder in den Editor laden, z. B. wenn du an einem anderen Gerät weiterschreiben willst.

## Kostenlos hosten

**Am einfachsten: GitHub Pages**

1. Erstelle ein neues (öffentliches) Repository auf GitHub, z. B. `chaos-of-your-20s`.
2. Lade den kompletten Inhalt dieses Ordners hoch (per GitHub Desktop, Web-Upload oder `git push`).
3. Gehe im Repo zu **Settings → Pages**, wähle als Quelle den `main`-Branch und Ordner `/ (root)`.
4. Nach ein bis zwei Minuten ist deine Seite live unter `https://<dein-username>.github.io/chaos-of-your-20s/`.

**Alternative: Netlify Drop**

1. Gehe auf [app.netlify.com/drop](https://app.netlify.com/drop).
2. Ziehe den ganzen Projektordner ins Browserfenster.
3. Fertig – du bekommst sofort eine kostenlose Live-URL. Für Updates einfach den Ordner erneut hochziehen.

Beide Varianten sind dauerhaft kostenlos für ein persönliches Blog dieser Größe.

## Lokal testen (optional)

Du brauchst keinen speziellen Server – jeder einfache statische Webserver reicht, z. B. per VS-Code-Erweiterung „Live Server“, oder du öffnest die Seite direkt über den gehosteten Link.

## Design

Farben: Rosé (`#e8a0a5`), Coral (`#f2897c`), Creme (`#fff8f4`), warmes Gold (`#d9a679`).
Schriften: „Playfair Display“ für Überschriften, „Poppins“ für Fließtext (via Google Fonts).
