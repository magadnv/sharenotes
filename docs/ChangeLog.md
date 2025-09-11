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

## [v0.2.0-routing] – YYYY-MM-DD
### Added
- Neue Routen: `/search` und `/note/[id]`
- Dummy-Adapter für Suche

---

## [v0.3.0-supabase] – YYYY-MM-DD
### Added
- Supabase-Projekt angebunden (Tabellen, Policies, Seeds)
- Echte Suche (`ilike`)

---

## [v1.0.0] – YYYY-MM-DD
### Added
- Erste stabile Abgabe-Version
- Happy Path: Suche → Ergebnis → Detail → Helpful

Wie wir es pflegen:
	1.	Nach jedem Tagging (git tag -a vX.Y.Z …) sofort CHANGELOG aktualisieren.
	2.	Neue Einträge immer oben einfügen.
	3.	Nutzt die Kategorien Added, Changed, Fixed – das reicht, um den Überblick zu behalten.