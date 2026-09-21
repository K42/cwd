# Krok 8: lista "Możliwe przeoczenia" na samej górze

**Data:** 2026-09-21
**Dotyczy:** Krok 8 (Podgląd i Eksport)

## Co się zmieniło

Kreator pozwala poruszać się między krokami swobodnie (przyciski "Dalej" i
breadcrumsy), ale kilka wyborów nigdzie nie jest wymuszone - gracz mógł
dotrzeć do Kroku 8 z niekompletną postacią bez żadnego ostrzeżenia. Na samej
górze Kroku 8 pojawia się teraz, gdy potrzeba, informacyjna lista "Możliwe
przeoczenia" - **nigdy nie blokuje** eksportu ani nawigacji, tylko wypisuje,
czego jeszcze nie wybrano.

`calculateMissingItems()` sprawdza, w kolejności:

1. **Ścieżki** (Krok 3) - nowicjusza (poziom ≥1), eksperckiej (≥3),
   mistrzowskiej (≥7). Formalnie zablokowane przyciskiem "Dalej" i
   breadcrumsem *do* Kroku 3-5, ale breadcrumsy pozwalają skoczyć z Kroku 2
   prosto do Kroku 8 - `randomizeToStep()` przy takim skoku sprawdza tylko
   profesje/kurioza, nie ścieżki ani atrybuty (zob. punkt 2), więc bez tej
   listy dałoby się w ten sposób ominąć wybór ścieżki całkowicie.
2. **Atrybuty główne do rozdania** (Krok 4) - to samo `slotAttributesComplete()`,
   co blokuje "Dalej" w Kroku 4, ale nie blokuje skoku breadcrumsem 2→8.
3. **Bonus do atrybutu z pochodzenia** (Krok 2, np. Człowiek +1, Elf +1 i +1)
   - nigdzie nie wymuszony.
4. **Korzyść z Pochodzenia na poziomie 4** (Krok 2) - przykład z prośby
   użytkownika.
5. **Srebrniki za poziom** (Krok 2, "Zasoby") - przykład z prośby użytkownika.
6. **Profesje/języki i kurioza** (Krok 5) - de facto nieosiągalne w
   normalnym flow (Krok 5 i każdy skok breadcrumsem na Krok 6/7/8 to
   wymuszają), ale sprawdzone też tutaj jako zabezpieczenie (np. dla
   postaci zaimportowanej ze starszego eksportu).
7. **Magia** (Krok 6) - tylko jeśli pochodzenie/ścieżki faktycznie coś
   przyznają na obecnym poziomie (`getCurrentAtomsMagic().length > 0`);
   sprawdza `calculateResolutionMagic(...).resolutions.some(r => !r.complete)`.
   Przykład z prośby użytkownika - i jedyny check, który realnie odpala się
   też po użyciu "Losuj postać" (dokumentowane zachowanie: losowanie
   zostawia Krok 6 nierozwiązany).
8. **Zamożność i wyposażenie startowe** (Krok 7) - brak wybranej Zamożności,
   albo wybrana, ale z nierozwiązanym atomem wyboru (np. kostur/pałka/proca,
   zwój z zaklęciem bez wybranego zaklęcia kręgu 0).

`renderMissingItemsWarning()` renderuje wynik jako `.missing-items-warning`
(karta ze złotą ramką, ikona `icon-warning` - już istniała w sprite, nieużywana
wcześniej) w nowym kontenerze `#missing-items-warning`, na samej górze
`#step-8`, wywoływana z `updatePreviewCharacter()` (czyli przy każdym wejściu
do/odświeżeniu Kroku 8). Pusta lista → kontener zostaje puszczony pustym
stringiem (nic się nie renderuje). `newCharacter()` czyści kontener wprost -
`updatePreviewCharacter()` sam nie zdąży tego zrobić, bo jego pierwsza linia
(`if (!selectedOrigin) return;`) ucina się przed dojściem do renderu ostrzeżeń.

## Dlaczego

Prośba użytkownika: "W kroku Podgląd i Eksport na samej górze dodaj
komunikaty jeśli użytkownik zapomni czegoś albo przeoczy, np nie wybierze
korzyści pochodzenia z 4 poziomu, nie wylosuje srebrników, nie wybierze
zaklęć dla postaci posługującej się magią itp. sprawdź co jeszcze ważnego
może zostać pominięte - nie blokuj użytkownika z przechodzenia między
krokami ale na końcu twórz listę brakujących elementów."

## Jak przetestowano

- **Jednostkowo / lint**: `npm test` (155/155), `npm run lint` (czysto).
- **Empirycznie (Playwright)**:
  - Postać w pełni wylosowana ("Losuj postać", poziom 5) - lista poprawnie
    pokazuje wyłącznie punkt o magii (bo losowanie jej nie rozwiązuje - to
    udokumentowane, oczekiwane zachowanie), zero innych przeoczeń.
  - Postać zbudowana minimalnie (pochodzenie + poziom 5, profesje/kurioza
    wypełnione tak, by skok breadcrumsem 2→5→8 się powiódł, ale bez
    ścieżek/bonusu do atrybutu/korzyści poziomu 4/srebrników/Zamożności) -
    lista poprawnie pokazuje wszystkie 6 brakujących elementów, żadnego
    fałszywego alarmu o atrybutach głównych czy magii (bo bez ścieżek nie
    ma nic do rozdania/rozwiązania w tych kategoriach).
  - "Nowa postać" po wylosowanej postaci z niepustą listą - kontener
    `#missing-items-warning` wraca do pustego stringa.
  - Zero błędów konsoli w każdym scenariuszu.

## Wpływ na eksport/import

Brak - zmiana czysto w prezentacji Kroku 8, nie dotyczy danych postaci ani
schematu eksportu/importu.
