# Kreator Postaci - Cień Władcy Demonów

Aplikacja webowa do tworzenia postaci do gry RPG **Cień Władcy Demonów**
(Shadow of the Demon Lord). Prowadzi użytkownika krok po kroku przez cały
proces tworzenia postaci - wybór pochodzenia, atrybuty i poziom, ścieżki
rozwoju, profesje i kurioza, magię oraz ekwipunek - a na końcu pozwala
zapisać postać w przeglądarce lub wyeksportować ją do pliku JSON.

Aplikacja jest w całości frontendowa (vanilla JavaScript, HTML, CSS, bez
frameworka i bez backendu) - dane postaci trzymane są lokalnie w
przeglądarce (`localStorage`).

## Struktura projektu

- `src/ui/` - kod aplikacji (to, co faktycznie działa w przeglądarce):
  `index.html`, `script.js`, `styles.css`, `help-content.js`, `data/`
  (dane gry), `logic/` (logika domenowa) oraz `assets/` (grafiki pochodzeń).
- `BUILD/` - gotowy do spakowania i wysłania komplet plików aplikacji,
  wraz ze skryptami startowymi - patrz `BUILD/README.md`.
- `tests/` - testy jednostkowe (Jest).
- `docs/` - dokumentacja zmian i audytów.
- `.claude/` - konfiguracja i skille Claude Code używane przy pracy nad
  projektem.

## Uruchomienie (praca deweloperska)

Wymaga zainstalowanego [Node.js](https://nodejs.org).

```bash
npm start
```

To uruchamia lokalny serwer statyczny (`npx serve src/ui`) i wypisuje adres
(domyślnie `http://localhost:3000`), pod którym dostępna jest aplikacja w
przeglądarce.

## Testy i lint

```bash
npm test        # testy jednostkowe (Jest)
npm run lint    # ESLint
```

## Wysyłka aplikacji do kogoś innego

Do przekazania działającej aplikacji osobie, która nie pracuje na tym
repozytorium, użyj folderu `BUILD/` - można go po prostu spakować (zip) i
wysłać. Instrukcja odpalenia jest w `BUILD/README.md`.
