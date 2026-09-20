# Krok 2: wyraźniejsze ramki sekcji i kompaktowy widok atrybutów

**Data:** 2026-09-21
**Dotyczy:** Krok 2 (Atrybuty i Poziom Postaci)

## Co się zmieniło

Trzy elementy Kroku 2 nie miały żadnej ramki/tła i wizualnie "wisiały" na
tle strony, bez odgraniczenia od otaczających sekcji:

- **Przypomnienie pochodzenia** (`#selected-origin-info`) - dodano klasę
  `.origin-summary` (karta z lewym złotym akcentem, jak `.preview-section`).
- **Zmiana wartości atrybutów pochodzenia** (`#custom-attributes`) - dodano
  klasę `.level-benefits-section`, tę samą, którą mają już sąsiednie sekcje
  (Korzyści Poziomu, Bonus do atrybutu, Zasoby), więc wszystkie warunkowe
  sekcje Kroku 2 są teraz wizualnie tej samej rodziny.
- **Obliczone atrybuty** (`#calculated-attributes`) - miał klasę w HTML, ale
  żadnej odpowiadającej jej reguły w CSS. Dodano ramkę w stylu `.level-section`
  (lewy złoty akcent), analogicznie do sekcji "Poziom Postaci" powyżej.

Widok samych atrybutów (`.attribute-display`, używany też przez sekcję
"Atrybuty drugorzędne" doklejaną dynamicznie w tym samym kontenerze) był
całkowicie nieostylowany - `label` (blokowy, z globalnej reguły) wymuszał
nazwę atrybutu i wartość na dwóch liniach. Zamieniono na jeden zwarty wiersz
(`display:flex`): nazwa po lewej, wartość na prawo pogrubiona/złota
(nowa klasa `.attribute-value`), modyfikator jeszcze bardziej na prawo -
każdy atrybut zajmuje teraz jedną linię ok. 44px wysokości zamiast dwóch.

Przy tej zmianie omyłkowo usunięto `.attribute-box` jako rzekomo martwy kod
(grep sprawdzał tylko `index.html`, nie `script.js`) - w rzeczywistości jest
używany przez karty atrybutów w podglądzie postaci (Krok 8,
`renderCardAttributesBasicSection`/`renderCardAttributesSecondarySection`).
Przywrócono regułę; oba style (`.attribute-box` - karta "nazwa nad wartością"
w podglądzie, `.attribute-display` - zwarty wiersz w Kroku 2) współistnieją,
bo mają różne układy HTML i różne przeznaczenie.

## Dlaczego

Prośba użytkownika (notatka w `.claude/TODO.md`, potwierdzona wprost na
czacie): "stwórz więcej ramek i odgraniczeń, [...] każda sekcja powinna mieć
wyraźne rozgraniczenie z innymi elementami" oraz "popraw widok atrybutów,
bardziej przejrzyście, klarownie, niech zajmuje mniej miejsca".

## Jak przetestowano

- **Jednostkowo / lint**: `npm test` (155/155), `npm run lint` (czysto) -
  zmiana nie dotyka logiki, tylko HTML/CSS i dwie klasy dodane do już
  istniejących spanów w JS.
- **Empirycznie (Playwright)**: Krok 2 na poziomie 0 (stan minimalny) i na
  poziomie 4 (wszystkie warunkowe sekcje widoczne - Korzyści Poziomu,
  Korzyści z Pochodzenia, zmiana atrybutów, bonus z pochodzenia, zasoby,
  obliczone atrybuty) - sprawdzono programowo obecność ramki (`border`,
  `background`) na każdej sekcji i wysokość jednego wiersza `.attribute-display`
  (44px, wcześniej dwie linie). Dodatkowo Krok 8 (karta podglądu postaci) -
  sprawdzono, że `.attribute-box` renderuje się poprawnie (ramka, tło,
  wyśrodkowany tekst) po przywróceniu reguły. Zero błędów konsoli w obu
  przypadkach; zrzuty ekranu obejrzane wizualnie.

## Wpływ na eksport/import

Brak - zmiana czysto wizualna, nie dotyka danych postaci ani logiki.
