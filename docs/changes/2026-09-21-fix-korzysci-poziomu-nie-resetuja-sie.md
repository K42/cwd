# Fix: "Korzyści Poziomu" nie resetowały się po "Nowa postać"

**Data:** 2026-09-21
**Dotyczy:** Krok 2 (Atrybuty i Poziom Postaci), sekcja "Korzyści Poziomu"; przycisk "Nowa postać"

## Co się zmieniło

Po kliknięciu "Nowa postać" sekcja "Korzyści Poziomu" pokazywała wciąż całą
skumulowaną listę korzyści z poprzednio tworzonej postaci, mimo że reszta
Kroku 2 (poziom, atrybuty, ścieżki) poprawnie wracała do stanu początkowego.

Przyczyna: `resetStateAfterOriginChange()` resetuje radio poziomu do "0"
przez `levelZero.checked = true` (ustawienie właściwości DOM wprost) - to
**nie odpala eventu `change`**, a właśnie ten event normalnie woła
`loadBenefitsLevel()`. Funkcja jawnie odświeżała sąsiednie, również zależne
od poziomu sekcje (`updateWealthSection(0)`, `updateOriginBenefits(0)`), ale
zabrakło tam analogicznego wywołania dla "Korzyści Poziomu" - jej zawartość
zostawała nietknięta, bo nic nie kazało jej się przeliczyć na nowo.

Dodano brakujące `loadBenefitsLevel(0);` w `resetStateAfterOriginChange()`,
zaraz przy dwóch pozostałych wywołaniach odświeżających sekcje poziomu 0.

## Dlaczego

Zgłoszenie użytkownika: "Korzyści Poziomu nie resetują się po wybraniu 'Nowa
postać' - pokazuje wszystkie korzyści z poprzednio tworzonej postaci."

## Jak przetestowano

- **Jednostkowo / lint**: `npm test` (155/155), `npm run lint` (czysto).
- **Empirycznie (Playwright)**: wylosowana postać na poziomie 5 (5 bloków
  korzyści, realne ścieżki) → "Nowa postać" → sprawdzono, że
  `#level-benefits-content` ma 0 bloków `.path-benefit-item` i wraca do
  placeholdera "Postać startowa", zamiast zachowywać poprzednie 5 bloków.
  Zero błędów konsoli.

## Wpływ na eksport/import

Brak - zmiana czysto w resetowaniu stanu UI, nie dotyczy danych postaci.
