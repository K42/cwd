# Krok 6: wyraźny podział tradycja/zaklęcie + opisy tradycji w popupie

**Data:** 2026-09-21
**Dotyczy:** Krok 6 (Magia) - karty wyboru na stronie bazowej; popup wyboru tradycji

## Co się zmieniło

Karty magii (`.magic-slot-card`) na stronie bazowej Kroku 6 miały wybór
"tradycja czy zaklęcie" (przełącznik dla atomów typu `wybor`) wyrenderowany
jako dwa identyczne, małe `.btn-secondary` - nic w wyglądzie nie odróżniało
"poznaj tradycję" od "naucz się zaklęcia", mimo że to koncepcyjnie bardzo
różne wybory (cała szkoła magii vs jeden konkretny czar). To samo dotyczyło
przycisków "Wybierz tradycję"/"Wybierz zaklęcie"/"Wybierz zaklęcie kręgu 0"
w każdej karcie - wyglądały identycznie niezależnie od kategorii.

1. **Przełącznik tryb (`.magic-mode-option`)** - zamiast dwóch małych
   przycisków, dwie większe karty jedna przy drugiej: ikona + pogrubiona
   nazwa + jednowierszowy podpis ("poznaj całą szkołę magii" /
   "naucz się jednego czaru"), z lewą ramką w kolorze kategorii (niebieski
   `--info` = tradycja, złoty `--gold` = zaklęcie) i tym samym kolorem po
   zaznaczeniu.
2. **Etykieta kategorii nad każdym przyciskiem wyboru** - nowy
   `.magic-slot-picker-label` (ikona + pogrubiony, kolorowy nagłówek
   "TRADYCJA"/"ZAKLĘCIE"/"DARMOWE ZAKLĘCIE (KRĄG 0)") dodany do
   `renderChoiceTraditions()`, `renderChoiceSpells()` i
   `renderChoiceFreeSpells()` - widoczny w KAŻDYM miejscu, gdzie te funkcje
   się pojawiają (wymuszona_tradycja, wybor_fixed, wybor, zaklecie_tylko),
   nie tylko w przełączniku trybu.
3. **`.magic-slot-picker` jako pogrupowany blok** - lewa ramka koloru
   kategorii i lekkie tło grupują etykietę, chip aktualnego wyboru i
   przycisk w jeden czytelny wiersz; gdy karta ma dwa piętra wyboru (np.
   tradycja + darmowe zaklęcie kręgu 0), widać od razu dwa odrębne,
   kolorowo oznaczone bloki, a nie jedną nieforemną kolumnę przycisków.

**Popup wyboru tradycji (bez zmian w wyglądzie/funkcjonalności, jak
poprosił użytkownik)** - dodano tylko krótki, jednozdaniowy opis pod nazwą
każdej tradycji, jeśli jest dostępny. Nowe pole `opis` w `data/traditions.js`
dla 37 z 37 tradycji faktycznie wybieralnych w Kroku 6 (`realTradycja !==
false`) - jedno zdanie streszczające fabularny wstęp tradycji z
odpowiedniego podręcznika (30 z Podręcznika Głównego, 7 z suplementów:
Straszliwe Piękno, Suplement, Grobowce Pustkowia), nie sparafrazowana
mechanika zaklęć. `getTraditionsForCategory()` (`logic/magic.js`) przekazuje
teraz to pole dalej, a kafelek w popupie renderuje je istniejącą klasą
`.picker-tile-description` (tą samą, którą już mają inne popupy w
aplikacji) - żadna nowa reguła CSS, żadna zmiana struktury popupu.

## Dlaczego

Prośba użytkownika: "Krok 6: Magia - stwórz bardziej przejrzyste przyciski
wyboru zaklęcie/tradycja na bazowej stronie, niech będzie wyraźny podział
między tradycją a zaklęciem, zaproponuj przejrzysty, czytelny i ładny
design. nie ruszaj wyglądu i funkcjonalności pop-upów z wyborem konkretnych
zaklęć i tradycji, są dobre - jedyne co to jeśli są dostępne dodaj krótkie
opisy poszczególnych tradycji."

## Jak przetestowano

- **Jednostkowo / lint**: `npm test` (155/155), `npm run lint` (czysto) -
  istniejący test `getTraditionsForCategory` sprawdza tylko `length`/`id`,
  nie dokładny kształt obiektu, więc dodanie pola `opis` nic nie złamało.
- **Empirycznie (Playwright)**: postać wylosowana na poziomie 7 (Magik jako
  ścieżka nowicjusza) - karty typu `wybor` pokazują dwie wyraźnie odróżnione
  kolorem i ikoną karty "Nowa tradycja"/"Zaklęcie"; kliknięcie "Zaklęcie"
  poprawnie przełącza aktywny stan (złota ramka/tło) i odsłania sekcję z
  etykietą "ZAKLĘCIE" i przyciskiem "Wybierz zaklęcie". Popup wyboru
  tradycji otwarty z takiej karty - 9 kafelków, wszystkie z poprawnym,
  jednozdaniowym opisem pod nazwą, reszta wyglądu/funkcji (wyszukiwanie,
  ostrzeżenie o czarnej magii) niezmieniona. Zero błędów konsoli.

## Wpływ na eksport/import

Brak - zmiana czysto w prezentacji Kroku 6 i danych statycznych tradycji
(pole `opis`, nieużywane przy budowaniu/imporcie postaci).
