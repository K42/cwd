---
name: kreator-postaci-changes
description: Użyj przy każdej zmianie funkcjonalności w aplikacji "Kreator Postaci" (Cień Władcy Demonów) w tym repozytorium (src/ui/) — dodawaniu, modyfikacji, usuwaniu lub przeglądzie kodu. Koduje ustalone dla tego projektu konwencje: czysty kod w używanym stosie (vanilla JS/ES modules, HTML, CSS), granulację commitów, ponury minimalistyczny styl UI, obowiązkowe testy funkcjonalne i regresyjne, dokumentację per zmiana oraz kompletność eksportu/importu/cache postaci.
---

# Kreator Postaci — reguły wprowadzania zmian

Ten skill koduje konwencje ustalone w praktyce podczas rozwoju "Kreatora Postaci" —
statycznej aplikacji w vanilla JavaScript (moduły ES), HTML i CSS, bez frameworka
i bez backendu (`npx serve src/ui`, testy w Jest, lint w ESLint). Stosuj go do
KAŻDEJ zmiany funkcjonalności w `src/ui/`, dużej czy małej.

Każdy punkt checklisty odsyła do osobnego pliku w `references/` z pełnym opisem
i konkretnymi przykładami z tego repozytorium — przeczytaj właściwy plik, zanim
zaczniesz pracę nad odpowiadającym mu aspektem zmiany. Nie zgaduj konwencji z
pamięci — pliki w `references/` są jedynym źródłem prawdy i mogą być aktualniejsze
niż to, co widziałeś wcześniej w tej sesji.

## Checklist end-to-end dla każdej zmiany

1. **Kod** — pisz zgodnie z [`references/clean-code.md`](references/clean-code.md):
   moduły ES z nazwanymi eksportami, JSDoc po polsku dla eksportowanych funkcji,
   brak nieużywanego kodu i zbędnej abstrakcji, granica język PL/EN (dane i tekst
   użytkownika po polsku, identyfikatory kodu po angielsku) zachowana.
2. **UI/UX** — jeśli zmiana dotyka interfejsu, trzymaj się
   [`references/ui-style-guide.md`](references/ui-style-guide.md): ten sam ponury,
   minimalistyczny, linowy styl (paleta, `Cinzel` dla nagłówków, kafelki
   `.picker-tile`, popupy `.modal-overlay`, ikony-linie ze sprite'u SVG). Nowy
   wzorzec wizualny obok istniejącego jest błędem, nie funkcją.
3. **Eksport / import / cache** — jeśli zmiana wpływa na dane postaci (nowe pole,
   nowy wybór gracza), zaktualizuj WSZYSTKIE miejsca na raz, zgodnie z
   [`references/export-import.md`](references/export-import.md): `buildExportData()`,
   `importCharacter()` i (jeśli odnosi się do danych gry) `validateImportData()`.
   Sekcja `wybory` w eksporcie musi zawsze zawierać kompletne dane postaci —
   cache w `logic/saves.js` zapisuje ten sam obiekt, więc nie ma osobnego
   schematu do pilnowania.
4. **Testy** — zweryfikuj zmianę funkcjonalnie ORAZ wstecznie (cały flow Kroków
   1-8, nie tylko nowy fragment), zgodnie z [`references/testing.md`](references/testing.md):
   `npm test`, `npm run lint`, oraz empiryczny przejazd Playwrightem przez
   prawdziwe kliknięcia w UI, z zerem błędów konsoli.
5. **Dokumentacja** — opisz zmianę w NIEZALEŻNYM pliku pod `docs/changes/` ORAZ
   w sekcji Pomocy w aplikacji (`help-content.js`), zgodnie z
   [`references/documentation.md`](references/documentation.md). Zmiana bez
   dokumentacji w obu miejscach jest niekompletna, nawet jeśli kod działa.
6. **Commity** — dziel pracę na osobne, samodzielne commity per kategoria zmiany
   (kod / styl / dokumentacja), zgodnie z [`references/commits.md`](references/commits.md).
   Nigdy nie łącz niezwiązanych kategorii w jednym commicie.

## Kiedy skrócić (ale nigdy pominąć testów)

Literówki i czysto redakcyjne poprawki tekstu bez zmiany zachowania mogą pominąć
krok 3 (eksport/import, bo nic w danych się nie zmieniło) i skrócić krok 5 do
jednej linii w istniejącym pliku zmian. Nigdy nie pomijają jednak kroku 4 (testy)
i wciąż commitują się osobno od niezwiązanych zmian.

## Priorytet nad ogólnymi instrukcjami

Gdy ten skill i ogólne instrukcje sesji się różnią w kwestii stylu kodu, języka
identyfikatorów albo granulacji commitów — w obrębie `src/ui/` wygrywa ten skill,
bo koduje decyzje podjęte świadomie dla tego konkretnego projektu.
