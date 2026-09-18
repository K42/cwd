# Testowanie — funkcjonalne i wsteczne

Każda zmiana musi przejść WSZYSTKIE trzy poziomy poniżej, w tej kolejności, i
żaden z nich nie jest opcjonalny, nawet dla "małej" zmiany. Poziom 3 jest tym,
który wykrywa regresje w całym flow — to na nim najczęściej znajdowano
prawdziwe błędy w historii tego projektu (np. desync `.dataset`/atrybutu HTML,
literówki w skróconych właściwościach obiektu po refaktorze nazw).

## 1. Testy jednostkowe — `npm test` (Jest)

Uruchom z korzenia repo. Traktuj wynik jako baseline do porównania, nie jako
"zero błędów = gotowe": w chwili pisania tego pliku baseline to
**3 nieudane / 96 przechodzące / 99 razem**, z przyczyn niezwiązanych z
bieżącą pracą (rozjazd między testami a danymi pochodzeń). Jeśli po zmianie
liczby się różnią od baseline'u, to REGRESJA, którą trzeba wyjaśnić lub
naprawić — nie ignorować, bo "testy już wcześniej nie przechodziły".

## 2. Lint — `npm run lint` (ESLint)

Musi wychodzić czysto (zero błędów) dla `src/` i `tests/`. Ostrzeżenia
(`no-console` na złapanych błędach z uzasadnionym
`// eslint-disable-next-line`) są akceptowalne, nowe błędy nie są.

## 3. Empiryczny przejazd Playwrightem — obowiązkowy dla każdej zmiany w UI/JS

Testy jednostkowe sprawdzają logikę w izolacji, NIE sprawdzają, czy
faktyczne kliknięcie w faktyczny DOM robi to, co ma robić. Do tego służy
Playwright, sterowany z zewnątrz repo (nigdy nie commituj tych skryptów do
repo — żyją w katalogu roboczym/scratchpadzie sesji i są usuwane po
weryfikacji):

1. Odpal lokalny statyczny serwer: `npx serve src/ui` (albo już działający
   na znanym porcie — sprawdź przed odpalaniem drugiego).
2. Uruchom headless Chromium (`playwright`), wejdź na `index.html`.
3. Steruj PRAWDZIWYMI kliknięciami na faktycznie wyrenderowanych elementach
   (`element.click()` albo `page.click(selector)`) — nigdy przez ręczne
   ustawienie zmiennej stanu w JS i wywołanie funkcji render z boku. Stan
   trzeba doprowadzić tą samą ścieżką, którą przejdzie użytkownik, inaczej
   test nie wykryje błędów w listenerach/kolejności wywołań.
4. Zbieraj zdarzenia konsoli (`page.on('console', ...)` z filtrem na
   `type() === 'error'`) i `pageerror` — lista musi być PUSTA na końcu testu.
   Błąd w konsoli, nawet "nieszkodliwy", jest sygnałem prawdziwego problemu
   (zob. przykład niżej).
5. Rób zrzuty ekranu (`page.screenshot()`) dla zmian wizualnych i faktycznie
   je obejrzyj (Read na wygenerowany plik) — nie zgaduj wyglądu z kodu CSS.

### Testuj funkcjonalnie (nowe zachowanie)

Zweryfikuj bezpośrednio to, co miało się zmienić: nowy przycisk robi to, co
ma robić; nowy popup się otwiera/zamyka/zapisuje wybór; nowe pole pojawia się
w eksporcie.

### Testuj wstecznie (cały flow, nie tylko nowy fragment)

Po każdej zmianie, która dotyka współdzielonego kodu (funkcji renderującej
wiele sekcji, danych czytanych w wielu miejscach, zmiennej stanu), przejedź
też scenariusz, którego "nie powinno to dotyczyć":

- Pełny przejazd Krok 1 → Krok 8 (origin → poziom → ścieżki → atrybuty →
  profesje/kurioza → magia → ekwipunek → podgląd), z prawdziwymi kliknięciami.
- Eksport postaci do JSON, potem import tego samego pliku — dane po imporcie
  muszą się zgadzać z danymi przed eksportem (zob.
  `references/export-import.md`).
- Jeśli zmiana dotyczy funkcji używanej w wielu kontekstach (np.
  `renderEquipmentSection()` wywoływana i z "Dalej", i z okna importu, i z
  losowania całej postaci) — przetestuj WSZYSTKIE wywołujące ją ścieżki, nie
  tylko tę, którą właśnie zmieniałeś.

### Konkretny przykład z historii tego projektu

Podczas tłumaczenia identyfikatorów kodu na angielski, testy jednostkowe
przechodziły, ale empiryczny klik w Krok 3 pokazywał kafelki ścieżek bez
żadnej korzyści — przyczyną była nie-granicowana (bez `\b`) podmiana
tekstowa, która uszkodziła identyfikator `sciezka` w środku innej nazwy.
Żaden test jednostkowy tego nie wykrył; wykrył to dopiero rzeczywisty klik
i obserwacja wyrenderowanego DOM. To jest dowód, czemu krok 3 (Playwright) w
tym pliku nie jest opcjonalny.

## Gdy zmiana dotyczy tylko dokumentacji/tekstu

Kroki 1-2 wciąż obowiązują (lint może złapać przypadkową składnię w pliku,
który edytujesz). Krok 3 można ograniczyć do wizualnej weryfikacji jednego
zrzutu ekranu miejsca, które się zmieniło.
