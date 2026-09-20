# Krok 1: obrazek pochodzenia w nagłówku po rozwinięciu kafelka

**Data:** 2026-09-21
**Dotyczy:** Krok 1 (Wybór Pochodzenia), stan rozwinięty kafelka

## Co się zmieniło

Po rozwinięciu kafelka pochodzenia (`.origin-tile.expanded`) miniatura
pozostawała pełną kolumną po lewej stronie na całej wysokości karty (tak jak
w stanie zwiniętym), a cała rozwinięta treść (opis, tabele losowania, cechy
specjalne, przycisk "Wybierz") była przez to zwężona o 190px na całej swojej
długości, nawet daleko poniżej miejsca, gdzie obrazek się już kończył.

`.origin-tile.expanded` wraca teraz do normalnego układu blokowego (nie
flex). Obrazek (`.origin-thumb`) unosi się (`float:left`) tylko w obrębie
nagłówka - tekst nagłówka (`.tile-header`) opływa go z prawej strony, tak jak
w stanie zwiniętym. `.tile-content-expanded` ma teraz `clear:both`, więc
zawsze zaczyna nowy, pełnoszerokościowy wiersz pod obrazkiem, niezależnie od
tego, jak krótki lub długi jest nagłówek - nigdy nie jest częściowo zawijana
wzdłuż jego prawej strony.

Stan zwinięty (`.compact`) jest niezmieniony - obrazek wciąż zajmuje całą
lewą stronę kafelka na pełną wysokość.

## Dlaczego

Prośba użytkownika: "popraw krok 1 i obrazki - po rozwinięciu powinny
pozostać w nagłówku a cała reszta obejmować całą szerokość sekcji."

## Jak przetestowano

- **Jednostkowo / lint**: `npm test` (155/155), `npm run lint` (czysto) -
  zmiana czysto w CSS, bez zmian w HTML/JS.
- **Empirycznie (Playwright)**: rozwinięcie kafelka z długą, wielosekcyjną
  treścią (Goblin - opis, atrybuty, mechanika, kultura, cechy specjalne,
  6 tabel losowania, przycisk wyboru) - zmierzono programowo `getBoundingClientRect()`
  obrazka, nagłówka i treści rozwiniętej: treść zajmuje 776px z ok. 818px
  szerokości kafelka (wcześniej byłaby zwężona o całą szerokość obrazka na
  każdej z tych sekcji) i zaczyna się bezpośrednio pod dołem obrazka (odstęp
  15px), nie pod nagłówkiem. Zrzuty ekranu stanu zwiniętego (bez regresji) i
  rozwiniętego obejrzane wizualnie. Zero błędów konsoli.

## Wpływ na eksport/import

Brak - zmiana czysto wizualna, nie dotyka danych postaci ani logiki.
