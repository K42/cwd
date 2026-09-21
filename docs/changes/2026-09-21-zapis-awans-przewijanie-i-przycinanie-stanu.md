# Zapis na żądanie, Awans, zwijane Korzyści Poziomu, przewijanie na górę i przycinanie stanu po zmianie poziomu

**Data:** 2026-09-21
**Dotyczy:** Krok 8 (Podgląd i Eksport), Krok 2 (Korzyści Poziomu), cała aplikacja (przycisk przewijania), zmiana poziomu postaci

## Co się zmieniło

### 1. Zapis postaci na żądanie zamiast automatycznego (Krok 8)

Każde wejście do Kroku 8 nadpisywało dotychczasowy zapis w pamięci
przeglądarki (`showStep()` wołał `saveCurrentCharacterToCache()`), więc samo
zajrzenie do podsumowania nadpisywało wcześniejszą wersję postaci. Teraz:

- Na samej górze Kroku 8 jest pasek akcji z przyciskiem **"Zapisz postać"**,
  który zapisuje do **tego samego slotu** (`currentSaveCacheId`), więc kolejne
  zapisy nadpisują ten sam wpis, a nie tworzą kopii.
- Przycisk jest aktywny tylko wtedy, gdy od ostatniego zapisu coś się
  zmieniło. Porównanie robi `hasUnsavedChanges()` na zrzucie
  `snapshotForComparison()` - sama sekcja `wybory` plus wersja eksportu, bez
  `utworzono` (znacznik czasu zmieniałby się przy każdym wywołaniu) i bez
  `podsumowanie` (wyliczane z `wybory`). Obok przycisku widać stan:
  "Postać nie jest jeszcze zapisana" / "Masz niezapisane zmiany" /
  "Wszystkie zmiany zapisane".
- `lastSavedSnapshot` jest ustawiany także przy imporcie z pliku i wczytaniu
  z pamięci (te ścieżki nadal zapisują automatycznie, bo tworzą nowy wpis),
  a czyszczony przez "Nowa postać".
- Lista w oknie "Wczytaj postać" pokazuje teraz **imię postaci** (jeśli
  zostało wpisane) przed pochodzeniem i poziomem.

### 2. Przycisk "Awans" (Krok 8)

Podnosi poziom o 1 (maksimum 10 - tam kończy się Tabela Rozwoju w PG), a
potem wypisuje, co nowy poziom daje do wybrania. Korzysta z tej samej listy
`calculateMissingItems()`, co "Możliwe przeoczenia" - nie było potrzeby
tworzenia osobnych komunikatów, bo lista już pokrywa wszystkie przypadki
(nowa ścieżka, punkty atrybutów, kurioza, srebrniki, magia, korzyść z
pochodzenia). Komunikat obok przycisku podsumowuje liczbę pozycji albo mówi
wprost, że nowy poziom nie wymaga żadnych wyborów; osobny komunikat obsługuje
próbę awansu powyżej 10 poziomu.

### 3. Zwijana sekcja "Korzyści Poziomu" (Krok 2), domyślnie zwinięta

Sekcja jest teraz akordeonem (`.collapsible-section` + klikalny nagłówek z
obracaną strzałką, ten sam wzorzec co sekcje ścieżek w Kroku 3), domyślnie
zwiniętym - po ostatniej zmianie potrafi wypisać korzyści z 10 poziomów, więc
rozwinięta zajmowała większość ekranu. Nagłówek działa też z klawiatury
(Enter/Spacja) i niesie `aria-expanded`.

### 4. Przycisk "przewiń na górę" (cała aplikacja, także popupy)

Mały, okrągły przycisk w prawym dolnym rogu (`.scroll-top-btn`), widoczny
dopiero po przewinięciu o ponad 200px. Działa w dwóch kontekstach, bo popupy
przewijają się niezależnie od strony pod spodem: gdy któryś popup jest
otwarty, przewija jego `.modal-body`, w przeciwnym razie całą stronę
(`getActiveScrollContext()`). Widoczność odświeża się na `scroll` strony i
popupów oraz przez `MutationObserver` na atrybucie `[hidden]` overlayów, bo
samo otwarcie/zamknięcie popupu zmienia kontekst, nie generując `scroll`.
Na wąskich ekranach przycisk jest podniesiony, żeby nie nakładał się na
poziome menu boczne.

### 5. Przycinanie stanu po zmianie poziomu

Zmiana poziomu nie usuwała wyborów z poziomów, których postać już nie ma -
po zejściu np. z 7 na 2 zostawały ścieżka ekspercka i mistrzowska razem z ich
korzyściami, sloty w Kroku 4, kurioza ponad limit i karty magii. Logika
zmiany poziomu została wyciągnięta z listenera radiobuttona do
`applyLevelChange()` (używa jej teraz też "Awans" i losowanie całej postaci,
co usunęło zduplikowaną sekwencję w `randomizeWholeCharacter()`), a przed
odświeżeniem UI woła ona `pruneStateForLevel()`, które usuwa:

1. ścieżki powyżej progu dostępnego na nowym poziomie (przez `resetPath()`,
   więc odejmowane są też przyznane przez nie korzyści),
2. sloty zwiększenia atrybutów (Krok 4) z usuniętych ścieżek,
3. sloty profesji i języków (Krok 5) z usuniętych ścieżek,
4. kurioza ponad limit nowego poziomu,
5. zaznaczoną opcję korzyści z pochodzenia, gdy poziom spadnie poniżej 4,
6. wybory i rzuty ryzyka magii dla korzyści, których już nie ma,
7. wylosowane srebrniki (ich liczba to 2k6 za każdy poziom, więc po zmianie
   poziomu stary rzut nie pasuje i trzeba go powtórzyć - brak rzutu wypisuje
   lista "Możliwe przeoczenia").

**Naprawiony przy okazji:** `updateOriginBenefitsContent()` przebudowywało
radiobuttony korzyści z poziomu 4 bez zaznaczenia, więc **każda** zmiana
poziomu po cichu kasowała ten wybór (a wraz z nim np. przyznane przez niego
zaklęcie). Funkcja odczytuje teraz zaznaczenie przed przebudową i przywraca
je w szablonie.

## Dlaczego

Prośba użytkownika: przycisk "Zapisz postać" zapisujący do tego samego slotu
przy wyłączonym autozapisie, imię postaci na liście zapisów, przycisk
"Awans" z komunikatami o nowych wyborach, zwijana i domyślnie zwinięta sekcja
"Korzyści Poziomu", przycisk przewijania na górę (także w popupach) oraz
poprawne przycinanie/resetowanie Kroku 4 i pozostałych wyborów po zmianie
ustawień we wcześniejszych krokach.

## Jak przetestowano

- **Jednostkowo / lint**: `npm test` (155/155), `npm run lint` (czysto).
- **Empirycznie (Playwright)**:
  - Po wylosowaniu postaci i dojściu do Kroku 8 cache jest **pusty** (0
    zapisów) - autozapis faktycznie wyłączony; po kliknięciu "Zapisz postać"
    jest 1 zapis, przycisk staje się nieaktywny; po zmianie imienia znów
    aktywny ("Masz niezapisane zmiany"), a drugi zapis **nadpisuje ten sam
    wpis** (nadal 1 zapis, tym razem z imieniem). Lista "Wczytaj postać"
    pokazuje "Testowy Bohater - Goblin, poziom 5".
  - "Awans": poziom 5 → 6 z komunikatem "Do wybrania: 2 rzeczy" i zgodną
    listą braków; wybrana korzyść z poziomu 4 ("1 zaklęcie") **przetrwała**
    awans (regresja naprawionego błędu); seria awansów dochodzi do 10 i
    dalsze kliknięcie zwraca komunikat o maksimum.
  - Zejście z poziomu 7 na 2: znikają ścieżki ekspercka i mistrzowska, sloty
    atrybutów spadają z 15 do 5 elementów (zostaje tylko slot nowicjusza),
    kurioza z 4 na 2, opcja poziomu 4 wyczyszczona, srebrniki wyzerowane, a
    karty magii z progów 3/6/7 znikają razem ze znanymi tradycjami.
  - "Korzyści Poziomu": domyślnie zwinięta (`collapsed`, `aria-expanded=false`,
    treść `display:none`), po kliknięciu rozwija 5 bloków poziomów, po
    ponownym kliknięciu znów się zwija.
  - Przycisk przewijania: ukryty na górze strony, pojawia się po przewinięciu
    (scrollY 1200) i wraca na 0; w otwartym popupie katalogu sklepu przewija
    treść popupu (scrollTop 600 → 0), nie stronę pod spodem.
  - Pełny ręczny przejazd Kroków 1-4 po refaktorze `applyLevelChange()` oraz
    lightbox Pomocy z nowym tekstem - bez regresji.
  - Zero błędów konsoli we wszystkich scenariuszach.

## Wpływ na eksport/import

Brak zmian w schemacie. `wersjaEksportu` bez zmian - żadne pole nie zostało
dodane ani usunięte, zmieniło się tylko to, **kiedy** powstaje zapis w pamięci
przeglądarki.
