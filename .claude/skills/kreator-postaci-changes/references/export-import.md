# Eksport / import / cache — muszą zawsze zawierać kompletne dane postaci

## Schemat (zweryfikowany w `src/ui/script.js`)

`buildExportData()` (Krok 8, przycisk "Eksportuj do JSON") zwraca:

```js
{
  wersjaEksportu: EXPORT_VERSION,
  utworzono: "<ISO timestamp>",
  wybory: {
    // JEDYNA sekcja odczytywana przez importCharacter() przy imporcie.
    pochodzenie, bonusoweAtrybutyPochodzenia, opcjaPoziom4,
    wynikiTabelPochodzenia, poziom, atrybutyGlowne, sciezki,
    atrybutySloty, profesjeJezykiSloty, kurioza,
    magia: { wybory, ryzykoWyniki },
    srebrniki,
    ekwipunek: { zamoznoscId, zamoznoscWynik, gotowkaPoczatkowaWynik,
                 wybory, sprzedane, zakupione }
  },
  podsumowanie: {
    // Czytelne dla człowieka (nazwy, nie id). WYŁĄCZNIE informacyjne -
    // importCharacter() tego pola nie czyta. Nie dodawaj tu nowego pola
    // MYŚLĄC, że to wystarczy - musi też być w `wybory`.
    ...
  }
}
```

`saveCharacterToCache()` (`logic/saves.js`) zapisuje w `localStorage`
DOKŁADNIE ten sam obiekt pod własnym id. **Nie ma trzeciego, osobnego
schematu do pilnowania** — jeśli pole trafia do `wybory`, cache i eksport są
automatycznie zsynchronizowane. To jest zamierzona właściwość architektury,
nie przypadek — nie psuj jej wprowadzając alternatywną ścieżkę zapisu stanu.

## Reguła: każdy nowy wybór gracza dostaje 4 kroki

Gdy dodajesz cokolwiek, co gracz wybiera/wpisuje/losuje i co powinno
przetrwać zapis/wczytanie postaci:

1. **Dodaj pole do `wybory` w `buildExportData()`** (nie tylko do
   `podsumowanie`). Nazwa pola po polsku, zgodnie z resztą schematu.
2. **Dodaj przywracanie w `importCharacter()`** — w tej samej kolejności
   numerowanych kroków, w jakiej funkcja już przechodzi przez Kroki 1-8, i
   TĄ SAMĄ metodą co reszta: jeśli oryginalny wybór był kliknięciem
   przycisku, przywróć go wywołaniem `.click()` na odpowiadającym
   `data-*`-adresowanym elemencie (nie bezpośrednim ustawieniem zmiennej
   stanu z boku) — to gwarantuje, że przywrócenie przechodzi przez te same
   listenery/walidacje co normalna interakcja użytkownika.
3. **Jeśli pole odwołuje się do ID z `data/*.js`** (przedmiot, tradycja,
   ścieżka, zaklęcie...), dodaj sprawdzenie w `validateImportData()` — plik
   wyeksportowany ze starszej wersji kreatora może wskazywać na ID, które już
   nie istnieje; import ma to zgłosić czytelnym komunikatem, nie wybuchnąć.
4. **Zaktualizuj `podsumowanie`** dla czytelności Karty Postaci - ale to
   dodatek do kroków 1-3, nigdy zamiennik.

## Weryfikacja: round-trip

Po dodaniu nowego pola, zawsze przejdź (empirycznie, Playwrightem — zob.
`references/testing.md`):

1. Ustaw nową wartość w UI.
2. Eksportuj do JSON, odczytaj plik i sprawdź, że pole jest w `wybory` z
   poprawną wartością.
3. Zaimportuj ten sam plik (na świeżo załadowanej stronie albo po
   "Nowa postać") i sprawdź, że UI pokazuje dokładnie tę samą wartość co przed
   eksportem — nie tylko że import "nie wywalił błędu".
4. Sprawdź też cache: dotrwaj do Kroku 8 (auto-zapis), otwórz popup "Wczytaj
   postać", wczytaj tę pozycję, potwierdź to samo jak w punkcie 3.

Brak tego round-tripu jest najczęstszym sposobem, w jaki "kompletny eksport"
przestaje być kompletny — pole wygląda dobrze w `podsumowanie`, ale nikt nie
sprawdził, że faktycznie wraca po imporcie.

## `EXPORT_VERSION` — kiedy bumpować

`validateImportData()` odrzuca plik, którego `wersjaEksportu` nie jest
równe DOKŁADNIE aktualnemu `EXPORT_VERSION` (`script.js`) — to twarde
odcięcie, nie ostrzeżenie. W praktyce bumpowano ją tylko przy zmianie
strukturalnej (v1→v2: "dodano sekcję ekwipunku"), nie przy każdym dodatkowym
polu. Dla zwykłego, addytywnego nowego pola w istniejącej sekcji `wybory`
(starsze pliki po prostu go nie mają, kod czyta je przez `?.`/`||`
z sensownym fallbackiem) NIE bumpuj wersji. Bumpuj tylko, gdy stary plik po
imporcie faktycznie nie będzie działał poprawnie bez tego pola.

## Czego nie robić

- Nie przechowuj nowego wyboru WYŁĄCZNIE w zmiennej modułowej `script.js`
  bez odpowiadającego pola w `wybory` — taki wybór "zgubi się" przy
  eksporcie/imporcie/cache, mimo że działa poprawnie w danej sesji.
- Nie duplikuj tej samej informacji pod dwoma różnymi nazwami pól w
  `wybory` "dla wygody" - jedno pole, jedno źródło prawdy.
