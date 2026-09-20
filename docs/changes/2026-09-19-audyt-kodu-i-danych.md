# Audyt kodu i danych: naprawy, weryfikacja wobec podręczników, testy

**Data:** 2026-09-19 – 2026-09-20
**Dotyczy:** cała aplikacja (Kroki 1-8), dane gry, testy, CI

## Co się zmieniło

### Naprawy funkcjonalne

**Sekcja „Korzyści Poziomu" (Krok 2) nie działała w ogóle.**
`displayBenefitsLevel()` pisała do 14 identyfikatorów DOM, których nie ma
w `index.html` od czasu przeprojektowania tego kroku, a `showChoiceAttributes()`
rzucała `TypeError` na nieistniejącym `#primary-attributes-choice`. Wyjątek
połykał `try/catch`, więc sekcja po prostu zostawała pusta. Renderuje teraz
jeden blok do istniejącego `#level-benefits-content` i obsługuje wszystkie pola
z danych, w tym percepcję, prędkość i splugawienie, których stara wersja nie
pokazywała. Rozdawanie punktów atrybutów zostaje wyłącznie w Kroku 4 – tutaj
jest tylko zapowiedź, żeby nie dublować mechaniki.

**Korzyści ścieżek eksperckich i mistrzowskich nigdy się nie pokazywały.**
Trzy moduły interpretowały klucze korzyści na trzy sposoby: `logic/magic.js`
wiedział, że `poziom_1` u ekspertów oznacza poziom postaci 3, a u mistrzów 7;
`logic/paths.js` zawsze czytał `poziom_1`; `logic/character.js` szukał wprost
`poziom_${poziom}` i na poziomach 3 i 7 nie znajdował niczego. Mapowanie mieszka
teraz w jednym miejscu (`data/paths.js`: `PATH_LEVEL_KEYS`, `getBenefitKeyForLevel`).

**Poziom 0 rzucał wyjątek przy każdym wejściu.** Tabela Rozwoju w PG zaczyna się
od poziomu 1, więc `GAME_DATA.poziomy[0]` celowo nie istnieje. Poziom startowy
ma teraz własny, opisowy widok zamiast wpadać w awaryjny fallback.

**Zamienione nazwy podręczników.** Tooltipy etykiet źródła rozwijały skrót GWP
jako „Grobowce Pustkowia", a GP jako „Głód w Pustce" – odwrotnie, niż zapisano
w danych. Kierunek rozstrzyga sama zawartość: wszystkie 35 zaklęć i 2 pochodzenia
oznaczone GWP występują w Głodzie w Pustce, a `origins.js` ma wprost
`zrodlo: 'GWP', // Głód w Pustce`. Zgadza się też ze skrótami: GWP = **G**łód
**W** **P**ustce, GP = **G**robowce **P**ustkowia.

**Dublujące się bonusy do atrybutów.** `addBenefits()` inkrementowało wartość
wprost w DOM, więc ponowny wybór tej samej ścieżki dodawał bonus drugi raz.
Nigdy się to nie ujawniło, bo żadna ścieżka nie używała pola `mod_atrybuty` –
Moloch z Chwalebnej Śmierci („Zwiększ Siłę o 1 i jeden inny atrybut o 1") jest
pierwszy. Bonusy są teraz liczone od zera, tak jak od dawna atrybuty drugorzędne.

### Uzupełnienia danych

| Obszar | Przed | Po |
|---|---|---|
| Opisy talentów | 23 | 252 |
| Talenty bez opisu w UI | 124 | 0 |
| Poziomy ścieżek bez danych | 54 | 0 |
| Ścieżki eksperckie / mistrzowskie | 16 / 64 | 17 / 68 |
| Zaklęcia | 527 | 532 |

- **Opisy talentów**: 124 talenty pokazywały „Opis talentu nie jest dostępny",
  a **9 z 12** dających się porównać opisów było niezgodnych z podręcznikiem
  (np. Furia opisana jako premia do obrażeń przy niskim Zdrowiu, podczas gdy PG
  daje 1 ułatwienie do następnego ataku po otrzymaniu obrażeń). Zniknęła też
  druga, równoległa mapa opisów zaszyta w `generateTalentDescriptions()`.
- **Poziomy ścieżek**: żadna ścieżka ekspercka nie miała `poziom_9`, sześciu
  brakowało `poziom_6`, a połowie mistrzowskich `poziom_10`. Postać powyżej
  5. poziomu nie dostawała nic z wybranej ścieżki.
- **Ścieżki z Chwalebnej Śmierci**: Moloch (ekspercka) oraz Duch walki,
  Kriomanta, Skald i Wieszcz (mistrzowskie) nie istniały w aplikacji, mimo że
  obsługiwała ona zaklęcia i pochodzenie Jotun z tej samej książki.
- **Zaklęcia**: dodano Ochronę Przed Śmiercią, Morowe Powietrze, Księżycowy Most,
  Osobliwość i Czarnostrzały z Zaświatów.

### Sprzątanie i proces

- Usunięto 5 funkcji bez żadnego wywołania (uciszonych wcześniej przez
  `eslint-disable` zamiast skasowania), martwą obsługę `.tile-expand-icon`,
  13 martwych reguł CSS i 8 zapomnianych `console.log`.
- `npm run lint` przechodzi czysto **pierwszy raz** – wcześniej zwracał 8432
  błędy, wszystkie w `spells.js` i wszystkie dotyczące stylu cudzysłowów.
- Dodano CI (`.github/workflows/ci.yml`) uruchamiające lint i testy.

## Dlaczego

Punktem wyjścia była prośba o analizę jakości kodu i danych. Audyt wykazał, że
aplikacja działa poprawnie w przepływie głównym (pełny przejazd Kroków 1-8 bez
błędów konsoli, round-trip eksport/import bajtowo identyczny), ale ma martwy
kod, jedną całkowicie niedziałającą sekcję UI oraz istotne braki i błędy
w danych gry. Kolejna decyzja użytkownika: naprawić wszystko i zweryfikować dane
wobec podręczników.

## Jak przetestowano

- **Jednostkowo**: `npm test` – 155/155 (było 96/99, a 3 nieprzechodzące testy
  sprawdzały nieaktualny model danych, nie realny błąd).
- **Lint**: `npm run lint` – czysto dla całego `src/` i `tests/`.
- **Empirycznie (Playwright)**: pełny przejazd Kroków 1-8 z prawdziwymi
  kliknięciami, popup magii, sklep (kupno i sprzedaż), losowanie całej postaci
  oraz round-trip eksport → import → eksport. 15/15 scenariuszy, zero błędów
  konsoli.
- **Dane wobec źródeł**: wszystkie 532 zaklęcia porównane z transkrypcjami
  podręczników; 19 zaklęć z Chwalebnej Śmierci sprawdzone bezpośrednio w PDF-ie,
  bo ta książka nie ma transkrypcji. Poza pięcioma dodanymi wszystkie zgadzają
  się co do tradycji, kręgu i kategorii.

## Wpływ na eksport/import

Brak zmian w schemacie. Wszystkie uzupełnienia dotyczą danych gry (`data/*.js`)
i opisów, a nie pól postaci. Kompletność potwierdzona testem round-trip: sekcja
`wybory` jest bajtowo identyczna po eksporcie, imporcie i ponownym eksporcie.

## Znane ograniczenia (świadomie zostawione)

- **Amunicja nie ma rzadkości** (5 pozycji). Tabela amunicji w PG jako jedyna
  nie ma kolumny „Dostępność", więc brak wartości jest wierny źródłu. Skutek
  uboczny: amunicja nie pojawia się przy włączonym filtrze rzadkości w sklepie.
- **7 tradycji bez zaklęcia kręgu 0** (Cień, Telekineza, Diabolista, Kleryk,
  Spaczeniec, Opiekun, Szaman). To etykiety tradycji dla zaklęć przyznawanych
  przez konkretne ścieżki; nie ma ich na liście tradycji do nauki i żadna
  ścieżka ich nie przyznaje, więc gracz nie może ich wybrać.
- **7 zaklęć przypisanych do ścieżek** (m.in. Władanie nieumarłymi Nekromanty,
  Egzorcyzm Egzorcysty) jest w podręczniku opisanych wewnątrz ścieżki i nie
  trafiło do biblioteki zaklęć – aplikacja modeluje je jako tekstowe nadanie
  w polu `magia`, zgodnie z kontraktem opisanym w nagłówku `data/paths.js`.
- **Jotun ma mechanikę „Potężne pochodzenie"** (Chwalebna Śmierć str. 7):
  zamiast ścieżki nowicjusza dostaje korzyści pochodzenia. Aplikacja tego nie
  modeluje – wymagałoby to zmiany przepływu Kroku 3.
