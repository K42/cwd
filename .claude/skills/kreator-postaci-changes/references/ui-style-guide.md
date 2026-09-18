# Styl UI — opis obecnego wyglądu i reguła

## Jak wygląda aplikacja dzisiaj (stan faktyczny, `src/ui/styles.css`)

**Paleta** — niemal czarne tła w czterech odcieniach brązu-czerni
(`--bg-0: #0c0a09` … `--bg-4: #3a322c`), tekst w ciepłym pergaminowym beżu
(`--ink: #e9dcc4`), akcenty złota do nagłówków i stanu "wybrane"
(`--gold: #b08d3a`, `--gold-bright: #d4ac4c`), akcenty krwi/czerwieni do
akcji głównych i ostrzeżeń (`--blood: #8b1e1e`, `--blood-bright: #c0392b`).
Tło strony ma dwa bardzo subtelne radialne gradienty (czerwony u góry, złoty
w rogu) na czarnym tle — to jedyne miejsce z gradientem poza przyciskami i
zaznaczonymi kafelkami.

**Typografia** — nagłówki (`h1`-`h5`) czcionką `Cinzel` (szeryfowa,
"rzymsko-kamienna", kojarzona z podręcznikami fantasy), reszta tekstu
`Inter`. Delikatny `letter-spacing`, brak dużych liter wymuszonych CSS-em
(tekst jest już tak napisany, gdzie potrzeba).

**Kształty** — bardzo małe zaokrąglenia (`--radius: 4px`, `--radius-lg: 6px`),
NIE duże/pełne zaokrąglenia poza wyjątkami: chip-y filtrów
(`.picker-filter-chip`) i małe plakietki (`.wealth-badge`, `.section-reset-btn`)
są `border-radius: 999px` (w pełni okrągłe krawędzie), żeby odróżnić
"tag/etykieta" od "karta/przycisk". Jeden globalny cień (`--shadow`) używany
oszczędnie (popupy), zero błyszczących efektów, zero animacji poza prostymi
przejściami `border-color`/`background` 0.15s.

**Ikony** — wyłącznie własny sprite SVG linii (`<symbol id="icon-...">` w
`index.html`), używany jako `<svg class="icon"><use href="#icon-nazwa">`.
Klasa `.icon`: `fill: none`, `stroke: currentColor`, `stroke-width: 1.7`,
zaokrąglone zakończenia linii, rozmiar `1em` (skaluje się z tekstem). Zero
emoji, zero ikon z wypełnieniem/kolorem własnym — kolor ikony to zawsze
kolor tekstu wokół niej.

**Wzorzec "kafelek do wyboru"** (`.picker-tile` + `.picker-tile-grid`) — każda
decyzja gracza (pochodzenie, ścieżka, poziom, Zamożność) to CAŁY kafelek
klikalny (element `<button>`, nie `<div>` z przyciskiem w środku), z:
- ciemniejszym tłem karty (`--bg-2`) na jeszcze ciemniejszym tle strony,
- ramką jaśniejącą na złoto przy `:hover`,
- przy `.selected`: złota ramka + delikatny złoty gradient w tle + plakietka
  "✓ Wybrano" (`.wealth-badge`) w prawym górnym rogu nagłówka kafelka.

**Wzorzec "popup"** (`.modal-overlay` + `.modal-box`) — każdy popup (wybór
tradycji/zaklęcia, katalog sklepu, lista zapisanych postaci, wybór poziomu
przed losowaniem) to ten sam szkielet: półprzezroczyste czarne tło na cały
ekran, wycentrowany box z `.modal-header` (tytuł + ikona X do zamknięcia) i
przewijanym `.modal-body`. Zamykanie: klik na X, klik w tło poza boxem, oraz
klawisz `Escape`.

**Nawigacja krokowa** — każdy krok ma na dole `.step-navigation` z dwoma
przyciskami: `.btn-secondary` "Wstecz" z ikoną `icon-chevron-left` PRZED
tekstem, `.btn-primary` "Dalej" z `icon-chevron-right` PO tekście. `.btn-primary`
to gradient krwi/czerwieni (główna akcja = czerwień, jak pieczęć/krew w
motywie gry), `.btn-secondary` to przezroczyste tło z ramką, jaśniejące na
złoto przy hover — wtórna akcja nigdy nie konkuruje wizualnie z główną.

**Drobne przyciski "Wyczyść"** (`.section-reset-btn`) — małe, w pełni
zaokrąglone, przezroczyste, tekst bez ikony (sam tekst "Wyczyść"/"Wyczyść
wybór"), czerwienieją na `:hover`. Ten sam wzorzec dla KAŻDEJ sekcji z
możliwością wyczyszczenia wyboru — nie wymyślaj nowego dla nowej sekcji.

## Reguła: jak dodawać nowe UI

1. **Nowa decyzja gracza → kafelek `.picker-tile` w `.picker-tile-grid`**, nie
   `<select>`, nie osobny przycisk "Wybierz" przy karcie z opisem. Kafelek
   jest całością klikalną; potwierdzenie wyboru to plakietka `.wealth-badge`
   w nagłówku, nie zmiana tekstu przycisku.
2. **Nowy popup → `.modal-overlay`/`.modal-box`/`.modal-header`/`.modal-body`**
   ze standardowym zestawem zamykania (X + klik w tło + Escape). Nie twórz
   nowego typu okna dialogowego (np. natywny `alert`/`prompt` do prezentacji
   treści — `confirm()` jest OK wyłącznie dla nieodwracalnych akcji, zob.
   istniejące `confirm('Rozpocząć nową postać?...')`).
3. **Nowa ikona → dopisz `<symbol>` do sprite'u w `index.html`** w tym samym
   stylu (tylko linie, `viewBox="0 0 24 24"`, brak wypełnień poza małymi,
   pojedynczymi kropkami-akcentami jak pip-y kostki), użyj przez
   `<svg class="icon"><use href="#icon-nazwa">` (w `script.js` przez helper
   `icon('nazwa')`; w `help-content.js`, który nie jest modułem, wprost jako
   znacznik). Nigdy emoji.
4. **Nowy tekst nagłówka sekcji → `Cinzel` przez istniejące `h3`-`h5`**, kolor
   złoty/pergamentowy z istniejącej palety, nie nowy kolor ad-hoc.
5. **Akcja nieodwracalna/destrukcyjna → czerwień (`--blood*`) + `confirm()`**,
   akcja odwracalna/pomocnicza → neutralna (`--ink-dim`/`--border`,
   jaśniejąca na złoto przy hover). Kolor niesie znaczenie — nie łam tego
   skojarzenia dla nowego przycisku.
6. Trzymaj się istniejących zmiennych CSS (`var(--gold)`, `var(--blood-bright)`
   itd.) — nowy kolor "na oko" wymaga świadomej decyzji, nie przypadku, i
   powinien trafić do `:root` w `styles.css`, nie jako literalny hex w regule.

Efekt końcowy tej reguły: apka ma wyglądać jak ponura, pergamentowo-krwista
karta z podręcznika RPG — spójna niezależnie od tego, który Krok albo popup
akurat widać.
