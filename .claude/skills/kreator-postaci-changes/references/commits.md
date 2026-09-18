# Granulacja i konwencja commitów

## Format wiadomości

Ten repo od dawna używa konwencji `<typ>: <opis po polsku, tryb rozkazujący>`,
opcjonalnie z zakresem w nawiasie. Typy faktycznie używane w historii:

- `feat:` — nowa funkcjonalność albo rozszerzenie istniejącej
- `fix:` — poprawka błędu (funkcjonalnego albo wizualnego)
- `refactor:` — zmiana struktury kodu bez zmiany zachowania
- `ui:` — zmiana czysto wizualna, bez zmiany logiki
- `docs:` — dokumentacja (README, Pomoc, pliki w `docs/`)
- `style:` — formatowanie/CSS bez zmiany zachowania
- `chore:` — narzędzia, konfiguracja, sprzątanie

Zakres w nawiasie (`feat(skill):`, `fix(ekwipunek):`) jest opcjonalny, ale
przydatny, gdy repo ma wiele niezależnych obszarów zmiany w krótkim czasie.

Commit message zawsze po polsku (tak jak cała resztka projektu), krótki tytuł
(jedna linia), opcjonalny dłuższy opis w treści commitu dla nietrywialnych
zmian.

## Jedna kategoria zmiany = jeden commit

To nie jest sugestia stylistyczna — to wymóg czytelności historii tego repo.
Konkretny, sprawdzony w praktyce przykład (system ekwipunku, trzy niezależne
commity mimo że dotyczą tej samej funkcji Kroku 7):

```
38495a4 feat: dodaj katalog przedmiotów i tabelę Zamożności (silnik ekwipunku)
1d3fec5 feat: dodaj panel sortowania w katalogu sklepu (cena/obrażenia/obrona/rzadkość)
be769ba feat: dodaj opisy do wszystkich 213 przedmiotów w katalogu ekwipunku
```

Każdy z nich osobno da się zrozumieć, zrecenzować i (w razie potrzeby)
odwrócić bez ryzyka dla pozostałych dwóch.

### Reguła podziału

Rozbij pracę na osobne commity, gdy zmiana obejmuje więcej niż jedną z tych
kategorii:

1. **Logika/dane** — nowa funkcja, nowy warunek, nowe pole w schemacie danych.
2. **UI/styl** — nowy CSS, nowy znacznik, nowa ikona, przeprojektowanie
   istniejącego widoku.
3. **Eksport/import/cache** — zmiany w `buildExportData()`/`importCharacter()`
   wynikające z punktu 1.
4. **Dokumentacja** — nowy plik w `docs/changes/` i/lub aktualizacja
   `help-content.js`.
5. **Testy** — nowe/zmienione testy Jest w `tests/`.

Jeśli zmiana dotyka tylko jednej kategorii, jeden commit jest w porządku —
nie dziel sztucznie trywialnej zmiany na pięć mikro-commitów. Reguła działa
w drugą stronę: nigdy nie łącz dwóch NIEZWIĄZANYCH kategorii w jeden commit,
nawet jeśli obie są małe.

## Stan repo po każdym commicie

Każdy commit powinien zostawiać aplikację w stanie, który da się odpalić i
przeklikać (`npx serve src/ui`) bez błędów w konsoli — nie commituj
niedokończonego kroku w połowie roboty. Jeśli zmiana naprawdę musi być
rozbita na commity, które osobno się nie uruchamiają (rzadkie), zaznacz to
wyraźnie w wiadomości commitu.

## Czego nie robić

- Nie używaj `git commit --amend` na commicie, który nie jest twoim
  najnowszym, niepushowanym commitem z tej sesji.
- Nie mieszaj w jednym commicie pliku wygenerowanego (`docs/API.md` z
  `npm run docs:generate`) ze zmianą źródłową, którą dokumentuje — to też są
  dwie kategorie.
- Nie commituj plików tymczasowych z testów Playwright (skrypty i screenshoty
  używane do weryfikacji żyją poza repo, zob. `references/testing.md`).
