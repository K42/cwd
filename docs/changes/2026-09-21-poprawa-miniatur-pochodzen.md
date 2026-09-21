# Poprawa kadrowania miniatur pochodzeń (obrazki w Kroku 1)

**Data:** 2026-09-21
**Dotyczy:** `src/ui/assets/origins/*.jpg` (lokalne, gitignored) - miniatury wyświetlane w kafelkach Kroku 1

## Co się zmieniło

Przegląd wszystkich 17 miniatur (220×220) wykazał trzy różne problemy,
częściowo pokrywające się:

1. **Zeskanowane elementy strony bleedowały w kadr** - biały/szary postrzępiony
   brzeg skanu (czlowiek, automaton), kolorowy margines strony (ork, odmieniec),
   a w trzech przypadkach (elf, chochlik, faun) kawałek **tekstu** z sąsiedniej
   kolumny podręcznika. Naprawione przez re-kadrowanie bezpośrednio z
   pełnorozdzielczych źródeł w `sources/_obrazki_pochodzen/*.jpeg`, z granicami
   kadru przesuniętymi tak, by w całości mieściły się w obszarze ilustracji.
2. **Ozdobna ramka jako część kompozycji** (inkarnacja - cierniowa ramka na całą
   grafikę; niedźwiedzidło - ozdobne czerwone zawijasy w tle na krawędziach) -
   ściągnięta ramka, kadr zawężony do samej postaci.
3. **Obrazek "źle się skalował" w stanie rozwiniętym kafelka** - `.origin-thumb`
   używa `object-fit:cover`, a `.tile-top` (Krok 1, zob. poprzednia zmiana z
   tego dnia) daje obrazkowi zmienną wysokość: ok. 190×198px w stanie zwiniętym
   (praktycznie kwadrat - kadr 220×220 pokazuje się prawie w całości), ale
   190×326-350px w stanie rozwiniętym (znacznie węższy stosunek). `cover` przy
   takiej proporcji przycina **środkowe ok. 55-58% szerokości** kadru,
   symetrycznie od centrum - dla kadrów z dwiema postaciami rozłożonymi w
   poziomie (człowiek, goblin) albo z postacią przesunięta w bok względem
   drugiego elementu kompozycji (elf, chochlik) obcinało to główną postać przy
   pierwszym kliknięciu "rozwiń". Naprawione przez zawężenie kadru do **jednej,
   centralnie umieszczonej postaci** dla tych czterech origin-ów (poprzednie
   kadry próbowały pokazać dwie postacie/dużą scenę - nie przetrwało to
   przycinania w wąskim, wysokim stosunku).

Poprawione pliki: `czlowiek, automaton, goblin, odmieniec, ork, chochlik, elf,
faun, niziol, niedzwiedziadlo, inkarnacja, warg, kambion` (13 z 17). Bez zmian:
`krasnolud, hobgoblin, fomor, jotunn` (już dobrze wykadrowane).

## Dlaczego

Prośba użytkownika: "przeanalizuj i popraw obrazki, nie wyglądają dobrze i źle
się skalują, nie chce tam białych ramek, a postać ma być wycentrowana."

## Jak przetestowano

- **Empirycznie (Playwright)**: dla wszystkich 17 origin-ów sprawdzono brak
  404/błędów ładowania (`naturalWidth` > 0) i zero błędów konsoli. Dla każdego
  poprawionego pliku obejrzano wizualnie wynik w dwóch stanach - zwiniętym
  (kafelek ok. 190×198px) i rozwiniętym (ok. 190×326-350px, najbardziej
  wymagający przypadek) - przed i po poprawce, żeby potwierdzić, że postać
  zostaje w kadrze i wycentrowana w OBU proporcjach, nie tylko w jednej.
- Nie dotyczy `npm test`/`npm run lint` - zmiana czysto w plikach graficznych
  (`src/ui/assets/origins/`), które są `.gitignore`d i nie mają odpowiednika w
  kodzie źródłowym; kod wyświetlający obrazki (`generateTilesOrigins()`,
  `styles.css`) nie został zmieniony.

## Wpływ na eksport/import

Brak - zmiana dotyczy wyłącznie lokalnych plików graficznych, nie danych
postaci ani kodu.
