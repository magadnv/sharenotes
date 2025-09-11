# ShareNotes – Projekt-Setup und Leitfaden

Dieses Dokument erklärt, was wir aufgesetzt haben, warum wir es so gemacht haben, und wie jede:r im Team das Projekt lokal starten und weiterentwickeln kann.

## 1. Was haben wir gemacht – und warum?

### SvelteKit (Frontend-Framework)
- **Warum:** Modernes Full‑Stack Svelte-Framework mit Server Rendering (SSR) und hervorragender DX. Ideal für schnelle, schlanke MVPs.
- **Ergebnis:** Ein lauffähiges Grundgerüst, das wir schrittweise ausbauen (Suche, Ergebnisliste, Notiz-Detail).

### Tailwind CSS v4 + Vite-Plugin
- **Warum:** Utility‑First CSS, konsistente Gestaltung, geringe CSS‑Schreiblast, hervorragende Performance. V4 vereinfacht die Konfiguration („no‑config“), weniger Boilerplate.
- **Wie:** Installation von `tailwindcss@4`, `@tailwindcss/vite` und `@tailwindcss/typography`, Einbindung des Vite‑Plugins, globaler CSS‑Import in `+layout.svelte`.
- **Vorteil:** Keine separaten `tailwind.config.*`/`postcss.config.*` nötig (außer für Sonderfälle).

### Paketmanager: npm
- **Warum:** Out‑of‑the‑box mit Node installierbar, keine Zusatzinstallation nötig. (pnpm wäre performanter, aber optional.)

### Projektstruktur (Zielbild)
```
sharenotes/
  apps/
    web/                 # SvelteKit-App
      src/
        routes/          # Seiten/Layouts
        lib/             # App-Utilities (z. B. Supabase-Client)
        app.css          # Tailwind-Entry
      package.json
      vite.config.ts
  infra/
    supabase/            # SQL-Migrations, Policies, Seeds (später)
  .github/workflows/     # CI (später)
  README.md              # Dieses Dokument (Root-Variante)
```
---

## 2. Schnellstart (lokal)

Voraussetzungen:
- Node.js 20+
- npm
- (Optional) Supabase-Account/Projekt für Backend

Befehle:
```bash
cd sharenotes/apps/web
npm install
npm run dev
```

Öffne den Dev-Server (Standard: http://localhost:5173).

---

## 3. Tailwind v4 Integration (Details)

- Installation (bereits erfolgt):
  ```bash
  npm i -D tailwindcss @tailwindcss/vite @tailwindcss/typography
  ```
- `vite.config.ts`:
  ```ts
  import { sveltekit } from '@sveltejs/kit/vite';
  import { defineConfig } from 'vite';
  import tailwindcss from '@tailwindcss/vite';

  export default defineConfig({
    plugins: [sveltekit(), tailwindcss()]
  });
  ```
- `src/app.css`:
  ```css
  @import "tailwindcss";
  @plugin "@tailwindcss/typography";
  ```
- Globaler Import in `src/routes/+layout.svelte`:
  ```svelte
  <script lang="ts">
    import '../app.css';
  </script>
  <slot />
  ```

Optional: Wenn eine klassische Konfiguration benötigt wird (Themes, Safelist, etc.), kann zusätzlich `tailwind.config.ts` genutzt werden. Für MVP reicht v4 „no‑config“.

---

## 4. Nächste Schritte (Backend-Anbindung mit Supabase)

1. **Supabase-Projekt anlegen** (Cloud), CLI verknüpfen.
2. **Migrations** erstellen (Tabellen: `notes`, `tags`, `note_tags`, `reactions`, optionale `profiles`).
3. **Row Level Security (RLS)** aktivieren und Policies schreiben:
   - Owner darf eigene Notizen lesen/schreiben.
   - Öffentliche Notizen sind für alle lesbar.
4. **Supabase JS-Client** in `src/lib/supabaseClient.ts` anlegen und verbinden.
5. **Suche** zunächst einfach: `ilike` auf `title/subject`, später FTS/Trigram.

---

## 5. Branching-, Commit- und Code‑Style

- **Branching:** `main` (stabil), `feature/<kurzbeschreibung>` für Features.
- **Commits:** `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- **Lint/Format:** ESLint/Prettier optional ergänzen; Svelte‑Prettier‑Plugin empfohlen.
- **PR‑Reviews:** Kleine, fokussierte PRs mit klaren Zielen (< 300 Zeilen ideal).

---

## 6. Umgebungsvariablen & Secrets

Beispiel `apps/web/.env` (lokal):
```
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
```
Secrets niemals commiten. In CI/Hosting (z. B. Vercel) in den Project Settings setzen.

---

## 7. Aufgabenaufteilung (MVP)

- **Frontend:** Header, Sucheingabe, Ergebnisliste (Karten), Notiz‑Detail (Lesen), Leere/Fehler‑Zustände.
- **Backend (Supabase):** Tabellen, Policies, einfache Suche, Seeds.
- **QA:** Happy‑Path Smoke‑Tests (Suche → Ergebnis → Detail), grundlegende Accessibility (Keyboard‑Focus, Kontrast).

**Definition of Done (MVP‑Slice):**
- Nutzer kann eine Suchanfrage stellen, in < 1 Minute eine passende Notiz öffnen und „helpful“ markieren.
- Keine 500er/Dead‑Ends im Happy Path.
- Ladezeiten gefühlt „sofort“ (Ziel: < 300ms Backend‑Antwort).

---

## 8. Aufräumen / Hygiene

- Entferne Demo‑Code aus `+page.svelte`, nutze früh ein klares Layout (Container, Header).
- Lege eine einfache **Ordnerkonvention** fest:
  - `src/lib/components` (UI‑Bausteine)
  - `src/lib/server` (Server‑Utils)
  - `src/lib/types` (TypeScript‑Typen)
  - `src/routes/(app)` für App‑Routen, `src/routes/(public)` für öffentliche Routen
- Notiere Entscheidungen im **CHANGELOG.md** (kurz), damit Historie nachvollziehbar bleibt.
- Lege `README.md` ins Repo‑Root und verlinke auf `apps/web/README.md`.

---

## 9. Stabil über die Zeit

- **Automatisierung:** CI (Build/Lint/Test), später E2E mit Playwright.
- **Messbarkeit:** Telemetrie (z. B. PostHog) – nur wenige Events: `search`, `open_note`, `helpful_click`.
- **Fehlerkultur:** Sentry einbinden; P0‑Bugs zuerst.
- **Versionierung:** Tags/Releases, auch für MVP sinnvoll.

---

## 10. Troubleshooting (häufige Punkte)

- `tailwindcss: command not found`: In v4 normal, nutze `@tailwindcss/vite` und `@import "tailwindcss";`.
- Styles laden nicht: Sicherstellen, dass `app.css` im `+layout.svelte` importiert ist.
- NPM‑Cache/Lock‑Probleme: `rm -rf node_modules package-lock.json && npm i`.
- 404 bei Routen: In SvelteKit gehören Dateien nach `src/routes`, `+page.svelte` erzeugt eine Route.

---

## 11. Lizenz/Ownership
- Projektnutzung im Rahmen der Schulabgabe. Weitere Lizenz/Verwertung nach Abstimmung im Team.

---

## 12. Kontakt/Team
- Product/PM: Magomed Delmukhanov, Dominic Markwardt

---

Stand: initiale Fassung. Änderungen bitte per PR ergänzen.
