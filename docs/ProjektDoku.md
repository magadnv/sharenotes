# ShareNotes – Projektdokumentation

## 1. Überblick

**Projektidee:**  
ShareNotes ist eine Web-App, die Lernenden einen Ort bietet, an dem sie Lernzettel und Notizen teilen, suchen und finden können.  
Ziel: Lernende verschwenden keine Zeit mehr mit dem Suchen von Materialien – sie finden sofort, was sie brauchen, und können sich auf das Lernen konzentrieren.

**Status:** Prototyp/MVP im Rahmen des Schulprojekts  
**Technologien:** SvelteKit · Tailwind CSS v4 · Supabase (DB/Auth) · Vercel (Deployment)

---

## 2. Projektstruktur

sharenotes/
apps/
web/                 # Frontend (SvelteKit + Tailwind)
src/
routes/          # Seiten/Layouts
lib/             # Utilities (z. B. Supabase-Client)
app.css          # Tailwind Entry
package.json
vite.config.ts
infra/
supabase/            # DB-Migrations, Policies, Seeds
.github/workflows/     # CI (Build/Test Pipelines)
docs/                  # Projektdokumentation
README.md              # Kurzfassung für Onboarding

---

## 3. Setup & Quickstart

### Voraussetzungen
- Node.js 20+
- npm
- Git
- (optional) Supabase-Account

### Schritte lokal
```bash
git clone https://github.com/magadnv/sharenotes.git
cd sharenotes/apps/web
npm install
npm run dev

Umgebungsvariablen

In apps/web/.env:
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=

Beispiel-Datei: .env.example

4. Technologien & Architektur

Frontend
	•	Framework: SvelteKit (SSR + SPA)
	•	Styling: Tailwind CSS v4 (No-Config, Plugins: Typography)
	•	Design-Prinzipien: Minimalistisch, Apple-ähnlich (Fokus, Weißraum, Ruhe)

Backend
	•	Supabase (Postgres)
	•	Tabellen: notes, tags, note_tags, reactions, profiles
	•	Features: Auth (Magic Links), Storage, Row Level Security
	•	Suche: ilike + Fulltext/Trigram (geplant)

Deployment
	•	Vercel für Hosting & Preview-Umgebungen
	•	CI/CD: GitHub Actions (Build, Lint, Tests)

⸻

5. Aktueller Entwicklungsstand
	•	v0.1.0-base: Layout mit Header, Suche, Platzhalter-Ergebnisse
	•	Nächste Schritte:
	•	Routing (/search, /note/[id])
	•	Supabase-Anbindung (CRUD, Policies, Seeds)
	•	Suche mit Dummy-Adapter → Supabase-Adapter
	•	MVP „Happy Path“: Suche → Ergebnis → Detail → Helpful

⸻

6. Branching & Workflow
	•	Branches:
	•	main = stabil
	•	feature/<beschreibung> = Feature-Branches
	•	Commits: Semantic (feat:, fix:, chore:, docs:)
	•	Pull Requests: klein, fokussiert, Review vor Merge
	•	Tags: SemVer light (v0.1.0-base, v0.2.0-routing, …)

⸻

7. Definition of Done (MVP)
	•	Nutzer kann eine Suchanfrage stellen
	•	Ergebnisse werden angezeigt
	•	Notiz-Detail lässt sich öffnen
	•	„Helpful“ kann markiert werden
	•	Policies verhindern Fremdzugriff
	•	Happy Path getestet, keine Blocker

⸻

8. Qualität & Aufräumen
	•	Prettier + ESLint + Svelte-Plugin für Formatierung
	•	CI-Pipeline prüft Builds
	•	Design-Konsistenz: Abstände (4/8/16/24 px), Radien (2xl), Farben (schwarz/weiß, dezente Transparenzen)
	•	Fehlerlogging (Sentry geplant)
	•	Metriken (PostHog geplant, Events: search, open_note, helpful_click)

⸻

9. Nachhaltigkeit (SDGs)

Das Projekt zahlt auf SDG 4: Hochwertige Bildung ein:
	•	Zugang zu Wissen für alle Lernende
	•	Kollaboratives Lernen
	•	Zeitersparnis = mehr Fokus auf Bildung

⸻

10. Team & Rollen
	•	Product/PM: …
	•	Design: …
	•	Frontend: …
	•	Backend: …
	•	QA: …

⸻

11. Anhang
	•	CHANGELOG.md für wichtige Meilensteine
	•	ARCHITECTURE.md (optional) für tiefere technische Details
    ---