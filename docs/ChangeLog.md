# Changelog

Alle relevanten Änderungen an diesem Projekt werden hier dokumentiert.  
Format orientiert sich an [Keep a Changelog](https://keepachangelog.com/de/1.0.0/) und SemVer.

---

## [Unreleased]
### Added
- (Platz für neue Features)

### Changed
- (Platz für Änderungen)

### Fixed
- (Platz für Bugfixes)

---

## [v0.1.0-base] – 2025-09-11
### Added
- Grundsetup mit SvelteKit + Tailwind v4
- Basislayout mit Header, Sucheingabe und Platzhalter-Ergebnisliste
- README und Projektdokumentation

---

## [v0.2.0-routing] – 2025-09-12
### Added
- Routen `/search` und `/note/[id]`
- Facade- und Adapter-Pattern für Notes
- Navigation von der Startseite zur Suche
- Toggle zum Anzeigen beliebter Notizen auf der Startseite
- Dezent gestalteter Zurück-Button auf Unterseiten

---

## [v0.3.0-supabase] – 2025-09-12
### Added
- Supabase-Anbindung: Tabellen `notes`, Policies (RLS) und Beispiel-Daten (Seeds)
- Suche über Supabase (`ilike` auf Titel, Excerpt, Subject)
- Notes-Facade und Adapter auf Supabase umgestellt
- End-to-End getestet: Startseite → Suche → Ergebnisliste → Detailansicht

---

## [v0.3.1-live] – 2025-09-12
### Added
- Erste Live-Schaltung von ShareNotes über Vercel
- Custom Domain eingebunden (https://www.sharenotes.cloud)
- Basisfunktionen online: Suche, Ergebnisliste, Detailansicht, Beliebte-Notizen-Toggle
- Responsives Verhalten geprüft (Desktop & Mobile)

---

## [v0.4.0-mvp] – 2025-09-21
### Added
- Notizen können erstellt, gespeichert und mit Text + Anhängen (Bilder/PDFs) veröffentlicht werden
- Detailansicht zeigt Inhalte aus JSON-Blöcken an (Text, Bilder, PDFs)
- Login mit Magic Link (Supabase Auth) integriert
- Dezent platzierter Button auf der Startseite zum Erstellen neuer Notizen

### Changed
- Datenbankstruktur in Supabase für `notes` erweitert (JSON content, subject, excerpt)

### Fixed
- Auth-Redirects verbessert, damit Nutzer nach Login direkt zur gewünschten Seite zurückgeleitet werden

---

## [v1.0.0] – YYYY-MM-DD
### Added
- Erste stabile Abgabe-Version
- Happy Path: Suche → Ergebnis → Detail → Helpful

---

Wie wir es pflegen:
1. Nach jedem Tagging (`git tag -a vX.Y.Z …`) sofort CHANGELOG aktualisieren.  
2. Neue Einträge immer oben einfügen.  
3. Nutzt die Kategorien Added, Changed, Fixed – das reicht, um den Überblick zu behalten.