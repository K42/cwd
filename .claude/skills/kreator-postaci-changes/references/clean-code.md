# Czysty kod dla stosu tego projektu

Kreator Postaci to statyczna aplikacja: **vanilla JavaScript (moduły ES),
HTML5, CSS3** — bez frameworka, bez bundlera, bez backendu. Serwowana przez
`npx serve src/ui` (albo równoważny statyczny serwer), testowana Jestem,
lintowana ESLintem (`.eslintrc.js` w korzeniu repo). Poniższe reguły dotyczą
tego konkretnego stosu, nie generycznych "best practices".

## Struktura plików — trzymaj się jej

- `src/ui/index.html` — cała statyczna struktura DOM (wszystkie Kroki 1-8,
  wszystkie popupy `.modal-overlay`, sprite ikon SVG). Nowy krok/popup dodajesz
  tutaj, nie generujesz go w całości z JS.
- `src/ui/script.js` — jedyny plik z logiką UI i orkiestracją stanu (moduł ES).
  Duży, ale zorganizowany: jedna funkcja `renderXSection()` per fragment DOM,
  jedna funkcja `handlerY()` per akcja użytkownika.
- `src/ui/logic/*.js` — czyste funkcje bez efektów ubocznych, liczące reguły
  gry (np. `logic/equipment.js`, `logic/magic.js`, `logic/paths.js`). Tu NIE
  dotykasz DOM.
- `src/ui/data/*.js` — surowe dane z podręcznika (pochodzenia, ścieżki,
  przedmioty, zaklęcia). Dane, nie logika.
- `src/ui/help-content.js` — treść zakładek Pomocy; **nie jest modułem ES**
  (wczytywany zwykłym `<script>` przed `script.js`), więc nie może importować
  z `script.js` — jeśli potrzebujesz tam ikony, wklej znacznik `<svg>` wprost
  (zob. `references/ui-style-guide.md`), nie wołaj helpera `icon()`.
- `docs/changes/` — jeden plik Markdown per zmiana (zob.
  `references/documentation.md`).

## Granica język PL/EN (ustalona świadomie, nie łam jej)

- **Dane i tekst widziany przez użytkownika** — po polsku: klucze w
  `data/*.js`, pola w schemacie eksportu/importu/cache (`wybory.pochodzenie`,
  `ekwipunek.zamoznoscId` itd.), wszystkie stringi w UI i w Pomocy.
- **Identyfikatory kodu** — po angielsku: nazwy zmiennych, funkcji, plików,
  atrybutów `id`/`class`/`data-*` w HTML. To wynik świadomego refaktoru
  (branch `code-lang-refactor`) i nie ma już iść w drugą stronę.
- Gdy nie jesteś pewien, do której kategorii coś należy: jeśli pole trafia do
  wyeksportowanego JSON-a postaci — polski. Jeśli to nazwa funkcji/zmiennej w
  `script.js`/`logic/*.js` — angielski.

## Wzorce, których się trzymać

- **Jedna funkcja render = jeden fragment DOM.** `renderWealthGrid()`,
  `renderGearStarting()`, `renderShopSection()` każda renderuje swój `<div>` i
  nic więcej; orkiestrator (`renderEquipmentSection()`) tylko je woła po
  kolei. Nowa sekcja UI = nowa funkcja render w tym samym stylu, nie
  rozrastanie istniejącej.
- **`data-*` jako jedyny hak między znacznikiem a JS-em**, nigdy selektor po
  tekście/kolejności elementu. Przykład: `data-path-id`, `data-pick-level`,
  `data-select-wealth` — stabilne, niezależne od zmian w treści etykiet.
- **Stan modułowy jako płaskie `let` na górze `script.js`**, inicjalizowany
  raz przy starcie i czyszczony explicite w `newCharacter()`/`resetX()`. Nie
  dodawaj drugiego miejsca prawdy dla tej samej informacji o postaci.
- **JSDoc po polsku** nad każdą eksportowaną/ważną funkcją, opisujący *dlaczego*
  (reguła z podręcznika, obejście, założenie), nie *co* (to widać z kodu).
  Krótkie komentarze inline tylko przy nieoczywistych warunkach.
- Optional chaining/nullish coalescing (`?.`, `??`) zamiast zagnieżdżonych
  `if`, zgodnie z resztą kodu.
- Nie zostawiaj "prawie tego samego" kodu w dwóch miejscach — jeśli wzorzec
  (np. kafelek wyboru) powtarza się trzeci raz, wydziel go, ale dopiero
  trzeci raz, nie z wyprzedzeniem.

## Reguły ESLint obowiązujące w tym repo

Z `.eslintrc.js`: 2 spacje wcięcia, cudzysłów pojedynczy, średniki
obowiązkowe, `no-var`/`prefer-const`, `no-unused-vars` (parametry można
ignorować prefiksem `_`), `no-console` jako ostrzeżenie — istniejące
`console.error(...)` mają nad sobą
`// eslint-disable-next-line no-console` z uzasadnieniem, że to zamierzony,
złapany błąd, nie debug-log. `npm run lint` musi wychodzić bez błędów przed
uznaniem zmiany za gotową.
