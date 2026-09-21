# Krok 1: przewijanie do wybranego pochodzenia po kliknięciu "Wybierz"

**Data:** 2026-09-21
**Dotyczy:** Krok 1 (Wybór Pochodzenia), `selectOrigin()`

## Co się zmieniło

Po wybraniu pochodzenia (`selectOrigin()`) `collapseAllTiles()` zwija
wszystkie kafelki, w tym ten właśnie wybrany - jeśli był rozwinięty (a
zwykle jest, bo przycisk "Wybierz X" znajduje się w stanie rozwiniętym),
wysokość strony drastycznie się zmniejsza i widok mógł zostać w losowym
miejscu, niezwiązanym z wybranym kafelkiem.

Automatyczne przewijanie (`autoScroll`, domyślnie włączone) celowało
wcześniej w przycisk "Dalej" w Kroku 1. Teraz celuje w sam wybrany
(świeżo zwinięty) kafelek, wyśrodkowany w widoku (`block: 'center'`), żeby
gracz widział potwierdzenie wyboru (złota ramka, plakietka "Wybrano").

## Dlaczego

Prośba użytkownika: "gdy pochodzenie zostanie wybrane (kliknięty kafelek)
automatycznie przewiń stronę do danego pochodzenia jeśli to możliwe".

## Jak przetestowano

- **Jednostkowo / lint**: `npm test` (155/155), `npm run lint` (czysto).
- **Empirycznie (Playwright)**: rozwinięcie kafelka daleko na liście
  (Kambion, 16. z 17), wybór przyciskiem "Wybierz Kambion" - po przewinięciu
  kafelek jest w pełni widoczny i wyśrodkowany w viewporcie (900px wysoki
  viewport, kafelek zajmuje ok. 351-549px). Zero błędów konsoli.

## Wpływ na eksport/import

Brak - zmiana czysto w zachowaniu przewijania strony.
