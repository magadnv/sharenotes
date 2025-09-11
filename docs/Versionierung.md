# Versioning Guide für ShareNotes

Dieses Projekt verwendet **semantische Versionierung (SemVer light)** und Git-Tags, um wichtige Meilensteine nachvollziehbar zu machen.

---

## 1. Prinzip

- **Major (X.0.0)**  
  Große Sprünge oder Abgabe-Versionen mit Breaking Changes.  
  Beispiel: `v1.0.0` = erste stabile Schulabgabe.

- **Minor (0.Y.0)**  
  Neue Features oder wichtige Meilensteine, die abwärtskompatibel sind.  
  Beispiel: `v0.2.0` = Routing eingebaut.

- **Patch (0.0.Z)**  
  Kleine Fixes oder Verbesserungen, die kompatibel bleiben.  
  Beispiel: `v0.2.1` = Bugfix im Routing.

---

## 2. Wann taggen?

**Tag setzen, wenn …**
- ein klarer **Meilenstein** erreicht ist  
- eine **Abgabe oder Präsentation** bevorsteht  
- ein **Breaking Change** eingeführt wurde

**Kein Tag setzen, wenn …**
- es sich nur um kleine Fixes handelt (Typo, UI-Polish, Readme)  
- interne WIP-Branches gemerged werden  

---

## 3. Geplante Meilensteine

- `v0.1.0-base` → Basislayout mit Header, Suche, Platzhalter-Ergebnisse  
- `v0.2.0-routing` → Routing mit `/search` und `/note/[id]` + Dummy-Adapter  
- `v0.3.0-supabase` → Supabase-Anbindung (Tabellen, Policies, Seeds, Suche)  
- `v0.4.0-mvp` → Happy Path läuft: Suche → Ergebnis → Detail → Helpful  
- `v1.0.0` → Erste stabile Abgabe-Version  

---

## 4. Workflow beim Taggen

1. Merge in `main` sicherstellen:  
   ```bash
   git checkout main
   git pull origin main
   git tag -a v0.2.0-routing -m "Routing mit Suchseite und Notiz-Detail"
   git push origin v0.2.0-routing

2.	Im CHANGELOG.md den Eintrag ergänzen.