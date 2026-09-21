# Krok 2: skumulowana lista korzyści poziomu (od poziomu 1)

**Data:** 2026-09-21
**Dotyczy:** Krok 2 (Atrybuty i Poziom Postaci), sekcja "Korzyści Poziomu"

## Co się zmieniło

Sekcja "Korzyści Poziomu" pokazywała korzyści wyłącznie z **aktualnie
wybranego** poziomu. Wybranie np. poziomu 5 nie pokazywało już korzyści
poziomów 1-4, mimo że postać je zachowuje - żeby zobaczyć wcześniejsze
korzyści, trzeba było ręcznie przełączać poziom w tył.

Sekcja teraz pokazuje **wszystkie poziomy od 1 do wybranego, po kolei**:

- `loadBenefitsLevel()` (`script.js`) liczy korzyści dla każdego poziomu
  1..N (pętla wywołująca istniejące `calculateBenefitsLevel()` per poziom,
  bez zmian w `logic/character.js`), zamiast tylko dla samego N.
- Nowa funkcja `renderOneLevelBenefitsBlock()` renderuje jeden blok
  `.path-benefit-item` (ten sam wzorzec co lista wybranych ścieżek w
  podglądzie postaci Krok 8) z nagłówkiem `<h6>Poziom N - Nazwa (Źródło)</h6>`
  na każdy poziom, oddzielone od siebie subtelną linią.
- Gdy poziom czerpie korzyści ze ścieżki (nowicjusza/eksperckiej/
  mistrzowskiej), a żadna ścieżka nie jest jeszcze wybrana, treść bloku to
  teraz prosty tekst **"Korzyść ze ścieżki"** zamiast poprzedniego dłuższego
  zdania z odsyłaczem do Kroku 3.
- Poziom 0 (postać startowa) bez zmian - to wciąż osobny, jednorazowy widok
  ("Postać startowa"), nie wchodzi w skumulowaną listę.
- Nagłówek sekcji zmieniony z "Korzyści dla poziomu X:" na "Korzyści postaci
  od poziomu 1 do poziomu X (włącznie):", zgodnie z nową, skumulowaną treścią.

**Poprawka przy tej okazji:** blok "Języki i profesje" wyświetlał
`[object Object]` dla każdej ścieżki, bo `korzysci.jezyki_profesje` jest
zawsze obiektem `{typ, kategorie, opis}` (zob. komentarz w `data/paths.js`),
a kod wprost interpolował cały obiekt w szablonie zamiast pola `.opis`. Bug
istniał już wcześniej (nie jest efektem tej zmiany) - zauważony i naprawiony
przy weryfikacji tej funkcji, bo z listą wszystkich poziomów naraz było go
dużo łatwiej zauważyć niż przy jednym poziomie na raz.

## Dlaczego

Prośba użytkownika: "w sekcji 'Korzyści Poziomu' wypisz wszystkie korzyści
jakie ma dana postać na tym poziomie uwzględniając również poprzednie
poziomy. opisz je po kolei poziomami. jeśli nie ma wybranej ścieżki to napisz
po prostu 'Korzyść ze ścieżki'."

## Jak przetestowano

- **Jednostkowo / lint**: `npm test` (155/155), `npm run lint` (czysto).
- **Empirycznie (Playwright)**: poziom 3 bez wybranych ścieżek - 3 bloki
  (Poziom 1/2/3), każdy z tekstem "Korzyść ze ścieżki". Postać wylosowana na
  poziomie 5 z realnymi ścieżkami (nowicjusz + ekspert) - 5 bloków z
  poprawną, rzeczywistą treścią na każdym poziomie (atrybuty, talenty,
  magia, języki/profesje - w tym potwierdzenie, że "Języki i profesje" nie
  pokazuje już `[object Object]`), poziom 4 poprawnie oznaczony jako
  "(Pochodzenie)". Zero błędów konsoli w obu scenariuszach.

## Wpływ na eksport/import

Brak - zmiana czysto w prezentacji Kroku 2, nie dotyczy danych postaci.
