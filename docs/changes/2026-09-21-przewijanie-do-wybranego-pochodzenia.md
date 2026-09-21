# Krok 1: przewijanie do nagłówka po rozwinięciu kafelka

**Data:** 2026-09-21
**Dotyczy:** Krok 1 (Wybór Pochodzenia), `expandTile()` i `selectOrigin()`

## Co się zmieniło

Kliknięcie na sam kafelek (rozwinięcie/zwinięcie) i kliknięcie przycisku
"Wybierz X" (w stanie rozwiniętym) to dwie różne akcje, każda z własnym,
celowym zachowaniem przewijania:

- **Rozwinięcie kafelka** (`expandTile()`) - jeśli kliknięcie trafiło w
  dolną część zwiniętego kafelka blisko dołu ekranu, po rozwinięciu widać
  by było środek nowej, długiej treści, a nie nazwę pochodzenia - nie było
  od razu wiadomo, co zostało kliknięte. Teraz strona przewija się do
  nagłówka (`.tile-header`) rozwijanego kafelka, ustawiając go na samej
  górze widoku (`block: 'start'`), więc nazwa pochodzenia jest natychmiast
  widoczna, a cała nowa treść rozwija się czytelnie poniżej.
- **Wybór pochodzenia** (`selectOrigin()`, przycisk "Wybierz X") - bez
  zmian względem stanu przed tą sesją: strona przewija się do przycisku
  "Dalej" w Kroku 1, żeby gracz mógł natychmiast przejść do Kroku 2.
  (Pierwsza wersja tej zmiany błędnie przekierowała to przewijanie na sam
  wybrany kafelek - poprawione z powrotem na prośbę użytkownika, bo o to
  zachowanie akurat nie chodziło.)

## Dlaczego

Prośba użytkownika: "gdy pochodzenie zostanie wybrane (kliknięty kafelek)
automatycznie przewiń stronę do danego pochodzenia jeśli to możliwe", a po
wyjaśnieniu, że dotyczyło to innej akcji: "w momencie kliknięcia przycisku
'wybierz' zachowaj poprzednią funkcjonalność czyli przewinięcie na sam dół
do przycisku Dalej. ale w momencie kliknięcia kafelki czyli rozwinięcia
informacji o pochodzeniu przewiń stronę do nagłówka tego pochodzenia tak
żeby wiadomo był od razu co zostało kliknięte."

## Jak przetestowano

- **Jednostkowo / lint**: `npm test` (155/155), `npm run lint` (czysto).
- **Empirycznie (Playwright)**: kafelek daleko na liście (Kambion, 16. z 17)
  - scroll ustawiony tak, by widoczna była tylko dolna część zwiniętego
    kafelka, potem klik na kafelek (rozwinięcie): nagłówek po przewinięciu
    ląduje na samej górze viewportu (top ≈ 0px z 900px wysokiego viewportu).
  - Klik "Wybierz Kambion" (stan rozwinięty): przycisk "Dalej" ląduje na
    samym dole viewportu (top ≈ 854px z 900px), tak jak przed tą sesją.
  - Zero błędów konsoli w obu scenariuszach.

## Wpływ na eksport/import

Brak - zmiana czysto w zachowaniu przewijania strony.
