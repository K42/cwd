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

### Faza 0: Bugfix widoczności ścieżek eksperckich/mistrzowskich

**Zmiana:** `src/ui/script.js`, `renderPathSectionsVisibility()` - dodano `g3.style.display='block'` i `g7.style.display='block'` (analogicznie dla `s3`/`s7`) w gałęzi `else`, obok istniejącej zmiany `opacity`.

**Weryfikacja:** Playwright, pełny przebieg: wybór Człowieka → poziom 3 (Ekspert) → krok 3 pokazuje 8 kafelków ścieżki eksperckiej, wszystkie widoczne i klikalne → po wybraniu ścieżki nowicjusza i eksperckiej przycisk "Dalej" się odblokowuje. Zero błędów konsoli.

**Status:** ✅ Gotowe.

---

*(kolejne fazy będą dopisywane poniżej w miarę postępu prac)*
