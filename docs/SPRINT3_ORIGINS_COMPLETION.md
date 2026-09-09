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

### ⚠️ Drugie ważne odkrycie: "istniejące" tabele Goblina/Krasnoluda/Odmieńca/Orka też są uszkodzone

Przed dodaniem brakujących tabel sprawdzono, czy istniejące 3 tabele (`wiek`, `przeszłość`, `osobowość`) dla tych 4 pochodzeń faktycznie pochodzą ze źródła. **Nie pochodzą.** Tabele `wiek` i `osobowość` dla WSZYSTKICH CZTERECH pochodzeń (Goblin, Krasnolud, Odmieniec, Ork) to dosłownie ten sam, wspólny, ogólny tekst - identyczny z (błędnym) tekstem, który wcześniej naprawiono w Automatonie (np. wpis 3 tabeli osobowości brzmi identycznie „Jesteś okrutny, niegodziwy i samolubny..." we wszystkich czterech). Tabela `przeszłość` Goblina okazała się być ogólnym, „ludzkim" tekstem (małżeństwo, wykształcenie formalne, mapa skarbu) zupełnie niepasującym do klimatu Goblina ze źródła (zamiana w ropuchę przez Króla Goblinów, zjedzenie stu chorych szczurów, itp.).

**Wniosek:** dla tych 4 pochodzeń **wszystkie 6 tabel** (nie tylko 3 brakujące) wymaga transkrypcji od zera wprost z `PodrecznikGlowny.md`. Fazy 3-6 poniżej to więc pełne przepisanie tabel każdego pochodzenia, analogicznie do Fazy 2 (Automaton), a nie tylko dopisanie brakujących kluczy.

---

### Faza 3: Goblin - pełne przepisanie tabel (PG)

Wszystkie 6 tabel przepisane od zera z `PodrecznikGlowny.md` (str. 16-17 wg stopki PDF): `wiek`, `budowa_ciala` (nowa), `cecha_szczegolna` (nowa), `dziwny_nawyk` (nowa), `przeszlosc`, `osobowosc`. Poprzednie `wiek`/`przeszlosc`/`osobowosc` usunięte w całości - były to placeholder-y współdzielone z innymi pochodzeniami, nie treść goblinia.

**Uwaga metodologiczna:** tabela „Budowa ciała" w markdownowej transkrypcji PG straciła kolumnę z zakresami rzutu (widać było tylko 9 opisów bez liczb). Zamiast zgadywać zakresy, odczytano je bezpośrednio z obrazu strony PDF (`dodatki/Cień Władcy Demonów podręcznik główny.pdf`, str. 16 wg stopki) - **pierwotnie przyjęty zakres (przez analogię do Orka) okazałby się błędny**, co potwierdza, że przy brakujących zakresach trzeba zawsze weryfikować wizualnie, nie ekstrapolować.

**Weryfikacja:** `getAvailableTables('goblin')` zwraca 6 tabel z poprawnymi typami kości (wiek/budowa_ciala/osobowosc: 3k6, cecha_szczegolna/dziwny_nawyk/przeszlosc: k20).

**Status:** ✅ Gotowe. Testy: 98/98, lint czysty.

---

### Faza 4: Krasnolud - pełne przepisanie tabel (PG)

Wszystkie 6 tabel przepisane od zera z `PodrecznikGlowny.md`: `wiek`, `budowa_ciala` (nowa), `wyglad` (nowa), `znienawidzone_stworzenia` (nowa - używana przez cechę specjalną „Znienawidzony wróg"), `przeszlosc`, `osobowosc`. Poprzednie `wiek`/`przeszlosc`/`osobowosc` to ten sam generyczny placeholder co w Automatonie/Goblinie - usunięte w całości.

**Status:** ✅ Gotowe. Testy: 98/98, lint czysty.

---

### Faza 5: Odmieniec - pełne przepisanie tabel (PG)

Przepisano/dodano 6 tabel z `PodrecznikGlowny.md`: `wiek` → **zmieniono klucz na `prawdziwy_wiek`** (treść była poprawna - to jedyna z „istniejących" tabel w tych 4 pochodzeniach, która faktycznie pochodziła ze źródła, tylko pod złym kluczem), `pozorna_plec` (nowa, k6), `pozorne_pochodzenie` (nowa, 3k6), `przeszlosc` (przepisana - poprzednia była tym samym generycznym placeholderem), `dziwactwo` (nowa, k20), `osobowosc` (przepisana).

Sprawdzono, że zmiana klucza `wiek` → `prawdziwy_wiek` nie jest nigdzie w kodzie/testach twardo zakodowana (UI iteruje po kluczach generycznie) - bezpieczna zmiana.

**Status:** ✅ Gotowe. Testy: 98/98, lint czysty.

---

### Faza 6: Ork - pełne przepisanie tabel (PG)

Wszystkie 5 tabel Orka przepisane/dodane z `PodrecznikGlowny.md` (str. 22-23 wg stopki PDF): `wiek` (zakresy potwierdzone wizualnie na stronie PDF - markdown stracił kolumnę liczb), `budowa_ciala` (nowa), `wyglad` (nowa), `przeszlosc` (przepisana), `osobowosc` (przepisana). Ork zgodnie ze źródłem ma 5 tabel, nie 6 - PG nie definiuje dla Orka osobnej tabeli religii ani cechy szczególnej.

**Weryfikacja końcowa fazy 3-6 (przeglądarka, wszystkie 4 pochodzenia w jednej sesji):** każdy kafelek (Goblin, Krasnolud, Odmieniec, Ork) pokazuje właściwy, kompletny i unikalny zestaw tabel (potwierdzone przez `data-origin-id` - dokładniejsze niż dopasowanie po tekście, które w pierwszym podejściu dawało fałszywie mylące wyniki przez nieistniejący selektor CSS). Dodatkowo pełny przebieg dla Orka: wybór pochodzenia → poziom 4 (Ekspert) → wybór ścieżki nowicjusza i eksperckiej → przycisk „Dalej" na kroku 3 odblokowuje się poprawnie, potwierdzając, że naprawa z Fazy 0 działa dla dowolnego pochodzenia, nie tylko Człowieka. Zero błędów konsoli w całym przebiegu.

**Status:** ✅ Gotowe. Testy: 98/98, lint czysty. **To zamyka pełną weryfikację i naprawę wszystkich 6 pochodzeń z Podręcznika Głównego (Człowiek, Automaton, Goblin, Krasnolud, Odmieniec, Ork) - wszystkie mają teraz kompletne, zweryfikowane źródłowo tabele losowania.**

---

### Faza 7a: Chochlik - pełne przepisanie tabel (Straszliwe Piękno)

Weryfikacja przed rozpoczęciem uzupełniania (dodania jednej brakującej tabeli „skrzydła") wykazała, że **Chochlik ma ten sam problem co pochodzenia z PG** - istniejące `wiek`/`przeszlosc`/`osobowosc` to ten sam ogólny placeholder, nie treść chochlikowa. Pełne przepisanie 6 tabel z `sources/Straszliwe_Piekno/Straszliwe-piekno-digital-05122022.md` (str. 7-9): `wyglad` (poprawiony typ z 3k6 na k20 - źródło używa „1k20"), `wiek` (poprawiony typ na `k3` - patrz niżej), `przeszlosc`, `budowa_ciala`, `osobowosc`, `skrzydla` (nowa).

**Zmiana silnika:** tabela „Chochlik: wiek" (i „Elf: wiek" w następnej fazie) używa w źródle kości `k3`, której `rollTable()` w `table_utils.js` wcześniej nie obsługiwał (rzuciłby błędem „Nieznany typ tabeli"). Dodano brakującą gałąź obsługi `k3` (rzut 1-3) - mała, bezpieczna zmiana silnika wspierająca realną treść źródłową.

**Status:** ✅ Gotowe. Testy: 98/98, lint czysty.

---

### Faza 7b: Elf - pełne przepisanie tabel (Straszliwe Piękno)

Ten sam problem: istniejące `przeszlosc`/`wiek` to dosłownie tabele Człowieka (identyczne liczby lat: „Dziecko, 11 lat lub mniej" itd.), nie elfie. Przepisano `przeszlosc` (k20) i `wiek` (typ poprawiony na k3, tak jak Chochlik) z realnej treści, oraz dodano dwie całkowicie brakujące tabele: `cecha_szczegolna` (3k6 - Elf może mieć do trzech takich cech, wielokrotny rzut) i `dziwny_nawyk` (k20). Dodano też brakującą `osobowosc` (3k6).

**Status:** ✅ Gotowe. Testy: 98/98, lint czysty.

---

### Faza 7c: Hobgoblin - pełne przepisanie tabel (Straszliwe Piękno)

Ostatnie z trzech pochodzeń Straszliwego Piękna. Przepisano `przeszlosc` i `wiek` (obie miały błędną, nie-hobgoblinią treść), dodano brakującą `efekt_uboczny_szalu` (k20, aktywuje się przy cesze specjalnej „Szał") oraz `osobowosc`.

**Weryfikacja końcowa Fazy 7 (przeglądarka):** Chochlik (6 tabel), Elf (5 tabel), Hobgoblin (4 tabele) - każde pochodzenie wyświetla właściwy, kompletny zestaw tabel; wykonano rzut na każdą z nich (łącznie z nowo obsługiwaną kością k3) - zero błędów konsoli.

**Status:** ✅ Gotowe. Testy: 98/98, lint czysty. **To zamyka pełną weryfikację i naprawę wszystkich pochodzeń z Straszliwego Piękna (Chochlik, Elf, Hobgoblin) oraz Podręcznika Głównego - 9 z 17 pochodzeń ma teraz w pełni zweryfikowane, kompletne tabele losowania.**

---

### Korekta: Kambion JEDNAK ma oficjalną sekcję tworzenia postaci

Użytkownik poprawił wcześniejsze ustalenie - w *Rozkosznej Agonii* pod nagłówkiem „Kambion" (str. 44 wg stopki) po opisie fabularnym rzeczywiście następuje pełna sekcja „Tworzenie postaci: kambion" (str. 55) z 6 tabelami (wiek, budowa ciała, wygląd, wychowanie, osobowość, przeszłość). Wcześniejsze przeszukanie dokumentu zatrzymało się zbyt wcześnie, na fragmencie opisującym Kambiona jako potwora/NPC we wcześniejszej części książki, nie docierając do właściwej sekcji dla gracza dalej w tekście.

### Faza 8: Kambion - pełne przepisanie od podstaw (Rozkoszna Agonia)

Ustalono realne dane z `sources/Rozkoszna_Agonia/rozkoszna-agonia-digital-09012022.md` (linia 2084+): atrybuty bazowe (Siła 10, Zręczność 10, Intelekt 11, Wola 9 - poprzednio wymyślone 11/10/10/10), Rozmiar „1/2 lub 1", cechy specjalne (niewrażliwość na chorobę/truciznę, widzenie w ciemności, dziecię piekła/odporność na ogień, piętno ciemności, radość z ciemności, wrażliwość na żelazo, początkowe 2 punkty Splugawienia - wcześniej wymyślone „odporność na ogień" i „potworny wygląd" jako jedyne cechy), poziom 4 (talent „Obdarzenie splugawieniem"), oraz wszystkie 6 tabel losowania.

Status zmieniony na `kompletne`, strona źródłowa poprawiona 30→55.

**Weryfikacja:** pełne zbudowanie postaci Kambiona (`budujPostac`) i wyświetlenie kafelka w przeglądarce - 6 tabel, wszystkie rzucone, zero błędów.

**Status:** ✅ Gotowe. Testy: 98/98, lint czysty.

---

### Faza 9: Jotun - pełne przepisanie od podstaw (Chwalebna Śmierć)

Ustalono realne dane z `dodatki/Chwalebna_smierc_digital_1_1.pdf` (sekcja „Serce zimy", `Tworzenie postaci: jotun`, wyekstrahowane przez `pdftotext -layout` - brak transkrypcji w `sources/`): atrybuty bazowe (Siła 13/Zręczność 9/Intelekt 8/Wola 10 - poprzednio wymyślone 12/9/9/10), Rozmiar 2, Prędkość 10 (poprzednio błędnie 12), cechy specjalne („Przywykły do zimna", unikalna mechanika „Potężne pochodzenie" zastępująca wybór ścieżki nowicjusza korzyściami z pochodzenia - opisana we `cechy_specjalne` jako tekst, nie symulowana mechanicznie, podobnie jak inne złożone mechaniki pochodzeń typu „Forma obiektu" Automatona), poziom 4 (talent „Krew olbrzymów"), oraz 6 tabel: `wiek`, `budowa_ciala`, `wyglad`, `przeszlosc`, `osobowosc` i nowa `profesje` (losowa startowa profesja specyficzna dla jotunów, zamiast ogólnej listy).

Zaktualizowano test `tests/postac.test.js`, który miał zaszyte na sztywno stare (błędne) wartości atrybutów Jotuna.

**Weryfikacja:** pełne zbudowanie postaci (`budujPostac`) i wyświetlenie/rzuty wszystkich 6 tabel w przeglądarce, zero błędów.

**Status:** ✅ Gotowe. Testy: 98/98, lint czysty.

---

## Podsumowanie stanu po Fazach 0-9

| Pochodzenie | Źródło | Tabele | Status |
|---|---|---|---|
| Człowiek | PG | 6/6 | ✅ zweryfikowane (było poprawne od początku) |
| Automaton | PG | 6/6 | ✅ naprawione (Faza 2) |
| Goblin | PG | 6/6 | ✅ przepisane (Faza 3) |
| Krasnolud | PG | 6/6 | ✅ przepisane (Faza 4) |
| Odmieniec | PG | 6/6 | ✅ przepisane (Faza 5) |
| Ork | PG | 5/5 | ✅ przepisane (Faza 6) |
| Chochlik | Straszliwe Piękno | 6/6 | ✅ przepisane (Faza 7a) |
| Elf | Straszliwe Piękno | 5/5 | ✅ przepisane (Faza 7b) |
| Hobgoblin | Straszliwe Piękno | 4/4 | ✅ przepisane (Faza 7c) |
| Kambion | Rozkoszna Agonia | 6/6 | ✅ przepisane od zera (Faza 8) |
| Jotun | Chwalebna Śmierć | 6/6 | ✅ przepisane od zera (Faza 9) |
| Faun, Niziołek, Fomor, Niedźwiedzidło, Warg, Inkarnacja | Suplement / Głód w Pustce | 0/0 | 🔄 w trakcie - pełna przebudowa (zaakceptowana przez użytkownika), pozostało 6 pochodzeń. Fomor/Warg/Niedźwiedzidło wymagają dodatkowo rozszerzenia silnika o losowe atrybuty bazowe (1k3+X) |

Bug ścieżek eksperckich/mistrzowskich (Faza 0) naprawiony i zweryfikowany dla wielu pochodzeń - dotyczy WSZYSTKICH 17 pochodzeń jednakowo (to kod UI, nie dane), więc jest w pełni rozwiązany niezależnie od stanu tabel.

---

*(kolejne fazy będą dopisywane poniżej w miarę postępu prac)*
