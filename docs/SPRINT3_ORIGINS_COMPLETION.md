# Sprint 3: Dopełnienie Pochodzeń i Naprawa Ścieżek

## Cel

Kreator miał dwa poważne braki funkcjonalne zgłoszone przez użytkownika:

1. Wybór poziomu eksperckiego/mistrzowskiego (3+/7+) nie pozwalał wybrać ścieżki eksperckiej/mistrzowskiej i blokował dalsze kroki kreatora.
2. Pochodzenia inne niż Człowiek nie mają kompletu tabel losowania (wiek, budowa ciała, wygląd, przeszłość, osobowość itd.), a 8 z 17 pochodzeń nie ma ich wcale.

Ten dokument jest dziennikiem prac naprawczych: dla każdej fazy opisuje co się zmieniło, jakie źródło zostało użyte (z numerem strony/linii), jakie decyzje zostały podjęte przy niejednoznacznościach, oraz co warto zweryfikować przy review.

## Ustalenia z analizy (przed rozpoczęciem prac)

### Bug ścieżek (Faza 0)

**Przyczyna:** `renderPathSectionsVisibility()` w `src/ui/script.js` ustawiała `display:'none'` na `#path-grid-3` i `#path-grid-7` tylko w gałęzi `wybranyPoziom === 0` (stan początkowy strony). Gałąź obsługująca `wybranyPoziom > 0` zmieniała już tylko `opacity`, nigdy nie przywracając `display:'block'`. Efekt: siatki ścieżki eksperckiej/mistrzowskiej były poprawnie wypełnione kafelkami w DOM, ale fizycznie niewidoczne przez cały czas trwania sesji.

Potwierdzone na żywo (Playwright + realna przeglądarka, opis w commitach) przed i po naprawie.

### Błędne etykiety źródeł (`zrodlo`) w `origins.js`

Wszystkie 11 pochodzeń spoza Podręcznika Głównego miały zakodowane na sztywno `zrodlo: 'SP' // Straszliwe Piękno`. To poprawne tylko dla 3 z nich. Rzeczywiste źródła, zweryfikowane bezpośrednio w plikach PDF/markdown:

| Pochodzenie | Poprzednie `zrodlo` | Prawdziwe źródło | Plik źródłowy |
|---|---|---|---|
| Chochlik, Elf, Hobgoblin | SP | Straszliwe Piękno ✓ (bez zmian) | `sources/Straszliwe_Piekno/*.md` |
| Faun, Niziołek | SP (błędne) | Suplement Władcy Demonów | `dodatki/Suplement_digital_1.4.pdf` (markdown w `sources/Suplement/*.md` jest uszkodzony - zły mapping czcionki OCR; użyto `pdftotext -layout` bezpośrednio na PDF) |
| Kambion | SP (błędne) | Rozkoszna Agonia | `sources/Rozkoszna_Agonia/*.md` |
| Fomor, Warg, Niedźwiedzidło, Inkarnacja | SP (błędne) | Głód w Pustce | `sources/Glod_W_Pustce/*.md` |
| Jotun (w aplikacji: "Jötunn") | SP (błędne) | Chwalebna Śmierć | `dodatki/Chwalebna_smierc_digital_1_1.pdf` (brak transkrypcji w `sources/`, użyto `pdftotext -layout`) |

### Ujednolicenie nazw

Zdecydowano zachować istniejące klucze/`id` obiektów (`jotunn`, `niedzwiedziadlo`) bez zmian, żeby nie łamać żadnych odwołań w kodzie/testach - to identyfikatory wewnętrzne, nie muszą być stringiem widocznym dla użytkownika. Poprawiono natomiast pole `nazwa` (widoczne w UI) tam, gdzie odbiegało od pisowni w źródle:

- „Jötunn" → „Jotun" (źródło konsekwentnie używa formy bez umlautu: „Jotunowie", „Tworzenie postaci: jotun", „Jotun, poziom 2")
- „Niedźwiedziadło" → „Niedźwiedzidło" (źródło: „Niedźwiedzidła", „NIEDŹWIEDZIDŁO", „Niedźwiedzidło, poziom 4")

### Automaton: Forma i Wygląd to dwie osobne tabele

Zweryfikowano w `sources/Podrecznik_Glowny/PodrecznikGlowny.md` (linie ~944-985): PG zawiera **obie** tabele jako w pełni odrębne:
- „Automaton: forma" (3k6) - warianty budowy fizycznej z modyfikatorami mechanicznymi (rozmiar, prędkość, obrona) - **już była w aplikacji**, drobne czyszczenie zakresów.
- „Automaton: wygląd" (3k6) - czysto fabularny opis wyglądu, bez efektów mechanicznych - **całkowicie brakowało w aplikacji**, dodano.

(Osobno: „FORMA OBIEKTU" w tej samej sekcji PG to NIE tabela losowa, tylko opis mechaniki „bycia przedmiotem" po zatrzymaniu klucza - nie dotyczy tabel losowania.)

## Stan tabel przed pracami

| Pochodzenie | Miało tabele | Brakowało |
|---|---|---|
| Człowiek | wiek, budowa_ciala, wyglad, przeszlosc, osobowosc, religia | - (komplet) |
| Automaton | wiek, funkcja, forma, przeszłość, osobowość | wygląd |
| Goblin | wiek, przeszłość, osobowość | budowa ciała, cecha szczególna, dziwny nawyk |
| Krasnolud | wiek, przeszłość, osobowość | budowa ciała, wygląd, znienawidzone stworzenia |
| Odmieniec | wiek, przeszłość, osobowość | prawdziwy wiek (zmiana klucza), pozorna płeć, pozorne pochodzenie, dziwactwo |
| Ork | wiek, przeszłość, osobowość | budowa ciała, wygląd |
| Chochlik | wygląd, wiek, przeszłość, budowa ciała, osobowość | skrzydła |
| Elf | przeszłość, wiek | osobowość |
| Hobgoblin | przeszłość, wiek, osobowość | efekt uboczny szału |
| Faun, Niziołek, Fomor, Niedźwiedzidło, Warg, Inkarnacja, Kambion, Jotun | brak (0) | wszystkie |

## Dziennik faz

### ⚠️ Ważne odkrycie w trakcie prac: 8 pochodzeń ma prawdopodobnie zmyślone/przybliżone dane mechaniczne, nie tylko brakujące tabele

Podczas weryfikacji prawdziwych źródeł dla Fomora, Warga, Niedźwiedzidła i Jotuna okazało się, że **nie tylko tabele losowania są nieobecne — całe sekcje `atrybuty_bazowe` i `cechy_specjalne` w `origins.js` odbiegają od materiału źródłowego**, prawdopodobnie zostały wymyślone/przybliżone przy pierwotnym wprowadzaniu tych pochodzeń:

- **Fomor, Warg, Niedźwiedzidło** (Głód w Pustce) używają w oryginale **losowych wartości atrybutów bazowych** (np. Fomor: Siła 1k3+8, Zręczność 1k3+10, Intelekt 1k3+6, Wola 1k3+5), a nie stałych liczb jak reszta pochodzeń w aplikacji. Silnik gry (`src/ui/logic/postac.js` / `dane-gry.js`) obsługuje dziś wyłącznie stałe wartości bazowe - obsłużenie tej mechaniki to realna zmiana w logice budowania postaci, nie tylko wpis danych.
- **Kambion**: to, co znalazłem w *Rozkosznej Agonii* pod hasłem "Kambion", to **statystyki potwora/NPC** ("KAMBION TRUDNOŚĆ 5"), a nie sekcja tworzenia postaci gracza. Ta książka najwyraźniej **nie zawiera Kambiona jako oficjalnie grywalnego pochodzenia z tabelami losowania** - obecny wpis w aplikacji wygląda na domowe (homebrew) przeniesienie statystyk potwora na pochodzenie gracza.
- **Jotun**: prawdziwa sekcja tworzenia postaci istnieje (`Chwalebna Śmierć`, „Tworzenie postaci: jotun") i używa stałych wartości (zgodnie z resztą aplikacji), ale różni się od obecnych danych w `origins.js` (realne: Siła 13/Zręczność 9/Intelekt 8/Wola 10 vs. obecne 12/9/9/10).

**To zmienia charakter prac dla tych 8 pochodzeń** z „dopisz brakujące tabele" na „zweryfikuj i prawdopodobnie przepisz całe pochodzenie od podstaw", a dla Kambiona pojawia się dodatkowo pytanie, czy w ogóle ma być traktowany jako pochodzenie z oficjalnymi tabelami (nie istnieją), czy pozostać domowym rozszerzeniem.

**Decyzja:** Prace nad tymi 8 pochodzeniami (fazy 8-15 w oryginalnym planie) są **wstrzymane do decyzji użytkownika** - patrz sekcja "Otwarte pytania" na końcu dokumentu. W tej sesji ukończono w pełni bezpieczne, dobrze zweryfikowane fazy 0-7 (bugfix, metadane, Automaton, 4 pochodzenia z Podręcznika Głównego, 3 uzupełnienia z Straszliwego Piękna).

---

### Faza 0: Bugfix widoczności ścieżek eksperckich/mistrzowskich

**Zmiana:** `src/ui/script.js`, `renderPathSectionsVisibility()` - dodano `g3.style.display='block'` i `g7.style.display='block'` (analogicznie dla `s3`/`s7`) w gałęzi `else`, obok istniejącej zmiany `opacity`.

**Weryfikacja:** Playwright, pełny przebieg: wybór Człowieka → poziom 3 (Ekspert) → krok 3 pokazuje 8 kafelków ścieżki eksperckiej, wszystkie widoczne i klikalne → po wybraniu ścieżki nowicjusza i eksperckiej przycisk "Dalej" się odblokowuje. Zero błędów konsoli.

**Status:** ✅ Gotowe.

---

### Faza 1: Korekta metadanych źródeł (`origins.js`)

**Zmiany:**
- `zrodlo` poprawione dla 8 pochodzeń: Faun, Niziołek → `'SUP'` (Suplement Władcy Demonów); Fomor, Warg, Niedźwiedzidło, Inkarnacja → `'GWP'` (Głód w Pustce); Kambion → `'RA'` (Rozkoszna Agonia); Jotun → nowy kod `'CS'` (Chwalebna Śmierć).
- `dozwoloneZrodla` w `src/ui/script.js` rozszerzone o `'CS'` (pozostałe kody były już obecne).
- `nazwa`: „Jötunn" → „Jotun", „Niedźwiedziadło" → „Niedźwiedzidło" (pisownia zgodna ze źródłem). Poprawiono też wszystkie odwołania w `tests/postac.test.js`, `src/ui/script.js` (opis rozszerzony pochodzenia) i `src/ui/help-content.js` (3 wystąpienia w glosariuszu/FAQ).
- `strona_zrodlowa`: Niziołek 9→8 (zgodnie ze spisem treści), Kambion 45→30, Jotun 45→6 (sekcja „Serce zimy" ma własną numerację stron w ramach łączonego PDF-u).
- `status`: wszystkie 8 pochodzeń bez tabel zmienione z mylącego `'kompletne'` na `'niezweryfikowane'`, z komentarzem wyjaśniającym co dokładnie wymaga weryfikacji (brak tabel i/lub podejrzane dane mechaniczne - patrz sekcja powyżej).

**Świadomie NIE ruszone w tej fazie:** `atrybuty_bazowe` i `cechy_specjalne` dla Fomora/Warga/Niedźwiedzidła/Inkarnacji/Kambiona/Jotuna - to część większej decyzji opisanej wyżej, żeby nie mieszać "pewnych" poprawek metadanych z niepewnymi poprawkami mechaniki w jednym commicie.

**Status:** ✅ Gotowe. Testy: 98/98, lint czysty.

---

### Faza 2: Automaton - pełna weryfikacja i naprawa tabel (`origin_tables.js`)

Poproszono o pełną weryfikację Automatona względem PG. Wynik weryfikacji okazał się gorszy niż zakładano - problem nie ograniczał się do brakującej tabeli „Wygląd":

- **`wiek`**: miał inny (zmyślony) tekst niż źródło - poprawiono na oryginalne kategorie PG (Nowy/Doświadczony/Stary/Bardzo stary/Wiekowy, 5/10/50/150 lat).
- **`funkcja`**: był **całkowicie niesprawny** - wszystkie 16 wyników (błędnie jako 3k6, zakres 3-18) zwracały identyczny tekst „Jesteś strażnikiem." bez żadnego efektu mechanicznego. Naprawiono: właściwy typ `k20` (zakres 1-20 zgodnie ze źródłem), 5 różnych wyników z realnymi bonusami do atrybutów.
- **`forma`**: treść była poprawna, ale ucięta (brakowało zdań o wzroście/wadze) i miała nadmiarowo rozbite zakresy (np. 6/7/8/9 zamiast jednego wpisu 6–9). Ujednolicono z pełnym tekstem źródła.
- **`wyglad`**: **całkowicie brakowało** - dodano w pełni, zgodnie z PG (czysto fabularna tabela bez efektów mechanicznych, potwierdzona jako odrębna od „Forma").
- **`przeszłość`**: był **całkowicie niesprawny** - wszystkie 20 wyników (k20) zwracały identyczny tekst (błąd kopiuj-wklej). Naprawiono: 20 unikalnych wyników zgodnie ze źródłem, z właściwymi efektami mechanicznymi tam, gdzie źródło je przewiduje (np. Splugawienie, Szaleństwo, dodatkowy język, 2k6 miedziaków).
- **`osobowość`**: treść była parafrazowana z innymi zakresami niż źródło - ujednolicono z dokładnymi zakresami i sformułowaniami PG.

Rdzeń pochodzenia (`origins.js`: atrybuty bazowe, cechy specjalne, poziom 4) zweryfikowany i **poprawny** - bez zmian.

**Weryfikacja:** `table_utils.getAvailableTables('automaton')` zwraca 6 tabel z poprawnymi typami kości; test w przeglądarce potwierdza wszystkie 6 nazw tabel widocznych na rozwiniętym kafelku Automatona (Wiek, Funkcja, Forma, Wygląd, Przeszłość, Osobowość), zero błędów konsoli.

**Wniosek do dalszych faz:** skoro nawet pochodzenie oznaczone jako `status: 'kompletne'` i pochodzące wprost z Podręcznika Głównego miało dwie kompletnie niesprawne tabele, tabele pozostałych pochodzeń PG (Goblin, Krasnolud, Odmieniec, Ork) również zostaną w pełni zweryfikowane wiersz po wierszu względem źródła, a nie tylko uzupełnione o brakujące klucze.

**Status:** ✅ Gotowe. Testy: 98/98, lint czysty.

---

*(kolejne fazy będą dopisywane poniżej w miarę postępu prac)*
