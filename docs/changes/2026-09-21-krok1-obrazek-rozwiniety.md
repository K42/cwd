# Krok 1: obrazek, opis i atrybuty razem po rozwinięciu kafelka

**Data:** 2026-09-21
**Dotyczy:** Krok 1 (Wybór Pochodzenia), stan rozwinięty kafelka

## Co się zmieniło

Po rozwinięciu kafelka pochodzenia miniatura pozostawała pełną kolumną po
lewej stronie na całej wysokości karty (tak jak w stanie zwiniętym), a cała
rozwinięta treść (opis, tabele losowania, cechy specjalne, przycisk
"Wybierz") była przez to zwężona o 190px na całej swojej długości, nawet
daleko poniżej miejsca, gdzie obrazek się już kończył - dużo pustego miejsca
i wąska kolumna tekstu.

Pierwsza wersja poprawki (obrazek jako `float` tylko w nagłówku, reszta na
pełną szerokość) okazała się nietrafiona - zrywała układ "obrazek | opis +
atrybuty", który dobrze działa w stanie zwiniętym. Ostateczne rozwiązanie
zachowuje ten układ także po rozwinięciu i tylko *dodatkową* treść (tej,
której nie ma w stanie zwiniętym) wynosi na pełną szerokość:

- Kafelek ma teraz wewnętrzny wrapper `.tile-top` (`display:flex`) - to on,
  nie cały `.origin-tile`, jest teraz kontenerem flex dla obrazka i
  `.tile-body`. Obrazek (`align-self:stretch`) rozciąga się do wysokości
  `.tile-body` - **w obu stanach**, bez pustego miejsca, bez sztywnej
  wysokości.
- W stanie rozwiniętym `.tile-body` pokazuje teraz `.tile-content-expanded-top`
  (nowy blok: dłuższy opis + siatka atrybutów podstawowych) w tym samym
  miejscu, w którym w stanie zwiniętym jest `.tile-content-collapsed` - ten
  sam układ obok obrazka, tylko z dłuższym tekstem.
- Reszta rozwiniętej treści (atrybuty drugorzędne, informacje kulturowe,
  cechy specjalne, tabele losowania, przycisk wyboru) trafiła do nowego,
  osobnego bloku `.tile-content-expanded-extra` - **poza** `.tile-top`, jako
  sekcja na pełną szerokość całego kafelka, oddzielona linią (`border-top`).
- `expandTile()`/`collapseTile()` (`script.js`) przełączają teraz trzy
  elementy (`tile-content-collapsed`, `-expanded-top`, `-expanded-extra`)
  zamiast dwóch.

Stan zwinięty jest wizualnie niezmieniony.

## Dlaczego

Prośba użytkownika: "popraw krok 1 i obrazki - po rozwinięciu powinny
pozostać w nagłówku a cała reszta obejmować całą szerokość sekcji", a po
zobaczeniu efektu (obrazek tylko w nagłówku, opis+atrybuty też zepchnięte na
pełną szerokość) poprawka: "zachowaj układ obrazka, opisu i atrybutów przy
rozwinięciu danego pochodzenia - chodzi o to żeby wypełnić puste miejsca i
polepszyć UI" - czyli układ "obrazek | opis + atrybuty" ze stanu zwiniętego
miał zostać zachowany, a nie zastąpiony.

## Jak przetestowano

- **Jednostkowo / lint**: `npm test` (155/155), `npm run lint` (czysto).
- **Empirycznie (Playwright)**: rozwinięcie kafelka z krótkim opisem
  (Człowiek) i z długim, wielosekcyjnym opisem + 6 tabelami (Goblin) -
  zmierzono programowo `getBoundingClientRect()`: wysokość obrazka (326px
  dla Człowieka, 348px dla Goblina) dokładnie odpowiada wysokości sąsiadującej
  treści (opis + atrybuty) w obu przypadkach - zero pustego miejsca; blok
  dodatkowy (`tile-content-expanded-extra`) zaczyna się dokładnie na dolnej
  krawędzi obrazka i zajmuje 816 z ok. 818px szerokości kafelka. Dodatkowo
  sprawdzono, że losowanie tabeli i przycisk "Wybierz" (przeniesione do
  nowego bloku) wciąż działają. Zrzuty ekranu obejrzane wizualnie. Zero
  błędów konsoli w każdym scenariuszu.

## Wpływ na eksport/import

Brak - zmiana czysto wizualna/strukturalna w HTML generowanym przez
`generateTilesOrigins()`, nie dotyka danych postaci ani logiki wyboru
pochodzenia.
