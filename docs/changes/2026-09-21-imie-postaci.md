# Opcjonalne imię postaci w Kroku 8

**Data:** 2026-09-21
**Dotyczy:** Krok 8 (Podgląd i Eksport), eksport/import, nazwa pliku eksportu

## Co się zmieniło

Krok 8 ma teraz pole tekstowe „Imię postaci (opcjonalnie)" nad podglądem karty:

- Wpisane imię pojawia się na bieżąco w nagłówku podglądu
  (`Podgląd Postaci: <imię>` zamiast samego `Podgląd Postaci`).
- Trafia do eksportu jako `wybory.imie` (pole odczytywane przy imporcie) oraz
  `podsumowanie.imie` (informacyjnie, jak reszta `podsumowania`).
- Jeśli imię jest wypełnione, nazwa eksportowanego pliku używa go zamiast
  identyfikatora pochodzenia: `postac-<imię>-<data>.json`. Nowa funkcja
  `sanitizeForFilename()` usuwa polskie znaki diakrytyczne i zamienia
  wszystko poza literami/cyframi na myślniki, więc plik ma bezpieczną nazwę
  niezależnie od tego, co gracz wpisze (np. „Żółć Wąż-Kowalski" →
  `zolc-waz-kowalski`). Puste imię lub imię składające się wyłącznie ze
  znaków specjalnych wraca do starego zachowania (nazwa pochodzenia).
- „Nowa postać" czyści imię razem z resztą wyborów. Import odtwarza je do
  pola i do podglądu, tak jak każdy inny wybór.

## Dlaczego

Użytkownik poprosił o możliwość nazwania postaci na ostatnim kroku, żeby
łatwiej rozpoznawać wyeksportowane pliki JSON bez ich otwierania.

## Wpływ na eksport/import

Pole `wybory.imie` jest nowe, ale **nie jest to zmiana łamiąca schemat** -
stare pliki eksportu bez tego pola importują się normalnie (`imie` wraca
jako pusty string, `EXPORT_VERSION` bez zmian).

## Jak przetestowano

- **Jednostkowo / lint**: `npm test` (155/155) i `npm run lint` bez zmian
  w wyniku - funkcja nie dotyka logiki danych gry.
- **Empirycznie (Playwright)**: wylosowana postać poziomu 5, wpisanie imienia
  z polskimi znakami w Kroku 8, sprawdzenie nagłówka podglądu, przechwycenie
  rzeczywistej nazwy zaproponowanego pliku eksportu i zawartości `wybory.imie`
  / `podsumowanie.imie`, a następnie round-trip przez zapis w pamięci
  przeglądarki (ta sama ścieżka odczytu co import z pliku) i potwierdzenie,
  że pole `#character-name` oraz nagłówek podglądu wracają do wpisanej
  wartości. Zero błędów konsoli.
