# Dokumentacja — plik per zmiana + sekcja Pomocy

Ta reguła istniała już wcześniej dla tego projektu (`.cursor/rules/documentation.mdc`:
"Po każdej istotnej zmianie zapewnij przygotowanie dokumentacji... oraz tekstu
do sekcji Pomoc"). Ten plik ją formalizuje i uszczegóławia: **dwa miejsca, nie
jedno**, i żadne z nich nie jest opcjonalne dla zmiany widocznej dla gracza.

## 1. Niezależny plik pod `docs/changes/`

Dla każdej istotnej zmiany funkcjonalności utwórz `docs/changes/YYYY-MM-DD-<krotki-slug-en>.md`
(data = dzień zmiany, slug krótki i po angielsku dla stabilności nazwy pliku,
treść po polsku). Szablon:

```markdown
# <Krótki tytuł zmiany po polsku>

**Data:** YYYY-MM-DD
**Dotyczy:** Krok N / komponent / popup (konkretnie)

## Co się zmieniło
Krótko, z konkretnymi nazwami funkcji/plików.

## Dlaczego
Kontekst decyzji - prośba użytkownika, naprawiany błąd, reguła z podręcznika.

## Jak przetestowano
Jakie scenariusze przejechano Playwrightem (funkcjonalne + wsteczne), wynik
`npm test`/`npm run lint`.

## Wpływ na eksport/import (jeśli dotyczy)
Które pola dodano/zmieniono w `wybory`, czy wymagało zmiany w
`importCharacter()`/`validateImportData()`. Jeśli zmiana nie dotyka danych
postaci, napisz to explicite: "Brak - zmiana czysto wizualna/nawigacyjna".
```

Ten plik jest ZAWSZE tworzony, niezależnie od tego, czy zmiana trafia też do
`docs/APLIKACJA.md`/`README.md` (większe dokumenty opisowe aktualizuj przy
zmianach, które faktycznie zmieniają ogólny obraz aplikacji, nie przy każdej
drobnej poprawce).

## 2. Sekcja Pomocy w aplikacji (`src/ui/help-content.js`)

Gracz nie czyta kodu ani `docs/`. Jeśli zmiana dotyka czegoś, co gracz może
zobaczyć albo zrobić, musi to być opisane w lightboxie Pomocy, w odpowiedniej
zakładce:

- `getStartContent()` — "Szybki Start": jeśli zmiana dodaje/zmienia krok w
  głównym flow (np. nowy popup przed losowaniem postaci), dopisz go do
  odpowiedniego punktu numerowanej listy kroków.
- `getGlossaryContent()` — "Słownik": jeśli zmiana wprowadza nowe pojęcie
  mechaniczne (nowy atrybut wtórny, nowy typ zasobu).
- `getFAQContent()` — "FAQ": jeśli zmiana odpowiada na pytanie, które gracz
  może sobie zadać ("jak teraz zrobić X", "co się stało z Y").
- `getShortcutsContent()` — "Skróty": tylko dla zmian w nawigacji
  klawiaturowej.

Cytaty etykiet przycisków w tekście Pomocy (np. `"Dalej →"`) muszą się zgadzać
z faktyczną treścią przycisku w danym momencie — jeśli zmieniasz etykietę
albo ikonę przycisku, zaktualizuj też każde miejsce w `help-content.js`, które
go cytuje (sprawdź przez `grep` frazy przycisku w tym pliku, nie tylko w
`index.html`/`script.js`).

## Kiedy pominąć

Zmiana czysto wewnętrzna, niewidoczna dla gracza i niezmieniająca sposobu
pracy z kodem (np. przyspieszenie funkcji bez zmiany jej zachowania) może
pominąć punkt 2, ale wciąż dostaje krótki plik w `docs/changes/` — ślad "co i
dlaczego" jest wartościowy nawet dla zmian niewidocznych w UI.
