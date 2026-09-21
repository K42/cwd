---
name: build-aplikacji
description: Użyj ZAWSZE, gdy użytkownik prosi o zrobienie, odświeżenie lub przebudowanie folderu BUILD (gotowej do spakowania i wysłania kopii aplikacji "Kreator Postaci"). Kopiuje src/ui/ do BUILD/, minifikuje wszystkie pliki .js, żeby zajmowały jak najmniej miejsca, i weryfikuje, że zminimalizowana wersja faktycznie działa w przeglądarce (zero błędów konsoli).
---

# Budowanie folderu BUILD (z minifikacją JS)

`BUILD/` to samodzielna kopia aplikacji do spakowania i wysłania osobie, która
nie pracuje na tym repozytorium (patrz `BUILD/README.md` dla instrukcji
odpalenia, którą trzeba zachować/skopiować przy każdej przebudowie). Przy
KAŻDEJ prośbie o zrobienie/odświeżenie tej kopii minifikuj JS do wersji `.min`
w miejscu — mniejszy rozmiar do wysłania, ta sama funkcjonalność.

## Procedura

1. **Wyczyść i skopiuj źródło**
   ```bash
   rm -rf BUILD && mkdir BUILD
   cp -R src/ui/. BUILD/
   ```
   Kopiuje `index.html`, `styles.css`, `help-content.js`, `script.js`,
   `data/`, `logic/`, `assets/origins/*.jpg` i `package.json`. Assety w
   `src/ui/assets/origins/` są w `.gitignore` (nie wersjonowane), ale fizycznie
   są na dysku — `cp -R` je złapie.

2. **Minifikuj JS — terser, z rozróżnieniem na dwa rodzaje plików**

   Użyj `npx --yes terser` (nie wymaga instalacji na trwałe). **Rozróżnienie
   poniżej jest krytyczne — pomylenie flag realnie rozwala aplikację:**

   - **Pliki modułowe ES** (`script.js` oraz wszystko w `data/` i `logic/` —
     zawierają `import`/`export`): minifikuj z flagą `--module`. Terser wie
     wtedy, które nazwy są eksportowane, i nie mangluje ich — bezpiecznie
     mangluje resztę top-level bindingów, bo referencje między plikami idą
     przez `import`, nie przez gołe nazwy globalne.
     ```bash
     for f in BUILD/script.js BUILD/data/*.js BUILD/logic/*.js; do
       npx --yes terser "$f" --compress --mangle --module -o "$f"
     done
     ```

   - **`help-content.js`** — to KLASYCZNY skrypt (`<script src="help-content.js">`,
     bez `type="module"`), a `script.js` odwołuje się do jego funkcji
     (`getStartContent()`, `getGlossaryContent()`, `getFAQContent()`,
     `getShortcutsContent()`) jako gołych identyfikatorów globalnych, nie
     przez import. Minifikuj go BEZ `--module` i BEZ `--toplevel` — samo
     `--compress --mangle` domyślnie NIE mangluje nazw na najwyższym poziomie
     zakresu, więc te funkcje zostają dostępne pod swoimi nazwami:
     ```bash
     npx --yes terser BUILD/help-content.js --compress --mangle -o BUILD/help-content.js
     ```
     Użycie tu `--module` lub `--toplevel` zmangluje nazwy funkcji i `script.js`
     przestanie widzieć `getStartContent` itd. — to by się nie wywaliło od
     razu przy starcie, tylko dopiero po kliknięciu "POMOC" w aplikacji.

3. **Zachowaj pliki startowe i README dla odbiorcy**

   `cp -R src/ui/.` nie kopiuje `start.command`/`start.sh`/`start.bat`/
   `BUILD/README.md` (nie są w `src/ui/`). Jeśli już istniały w poprzednim
   `BUILD/` (np. z wcześniejszej sesji), odtwórz je z tą samą treścią —
   instrukcja odpalenia dla osoby nietechnicznej to część kompletu, nie tylko
   kod. Te pliki są tekstowe/skryptowe, nie trzeba ich minifikować.

4. **Zweryfikuj, że zminimalizowana wersja działa**

   Nie zgaduj — odpal realnie i sprawdź:
   ```bash
   npx --yes serve -l 5050 BUILD &
   ```
   Headless Playwright (patrz `.claude/skills/kreator-postaci-changes/references/testing.md`
   po ogólną metodologię empirycznego testowania w tym projekcie): otwórz
   `http://localhost:5050/index.html`, sprawdź zero błędów konsoli, że tytuł/
   `<h1>` się renderują, że kafelki pochodzeń w Kroku 1 są obecne, i że okno
   Pomocy (przycisk "POMOC") otwiera się i pokazuje treść z `help-content.js`
   (to konkretnie weryfikuje punkt 2 — że minifikacja `help-content.js` nie
   ukradła nazw funkcji). Zatrzymaj serwer po teście.

5. **Zgłoś rozmiar przed/po**

   Krótko podaj użytkownikowi, o ile skurczyły się pliki `.js` łącznie (np.
   `du -ch` na `src/ui/*.js src/ui/data/*.js src/ui/logic/*.js` vs. te same
   ścieżki w `BUILD/`) — to jest cały sens tej operacji, więc wynik ma być
   widoczny, nie tylko założony.

   Zmierzone przy pierwszym uruchomieniu tej procedury (2026-09-21, jako
   punkt odniesienia — realne liczby przy kolejnych przebudowach będą się
   różnić wraz z rozwojem kodu): `script.js` (kod, dużo nazw zmiennych do
   zmangluwania) skurczył się o ~50% (258 KB → 131 KB); pliki z `data/`,
   które są w większości tabelami danych gry, np. `origin_tables.js` czy
   `spells.js`, tylko o ~11-13% (mniej nazw do manglowania, głównie
   oszczędność na białych znakach/komentarzach); `help-content.js` (prawie
   wyłącznie długie template literały z HTML pomocy) NIE skurczył się
   wcale — terser zamienia backticki na stringi w apostrofach i escapuje
   znaki nowej linii jako `\n` (2 znaki zamiast 1), co znosi zysk z
   usunięcia białych znaków. To nie jest błąd procedury, tylko naturalna
   granica minifikacji dla pliku, który jest w istocie danymi tekstowymi,
   nie kodem — nie próbuj to "poprawiać" dodatkowymi flagami.

## Dlaczego nie jeden uniwersalny zestaw flag

Terser nie ma sposobu, żeby "zgadnąć" z treści pliku, czy jest modułem, czy
klasycznym skryptem współdzielącym globalny zakres — trzeba mu to powiedzieć
przez `--module`. W tym repo te dwa rodzaje plików JS współistnieją (moduły
ES dla właściwej logiki, jeden klasyczny skrypt dla treści Pomocy), więc
procedura musi je rozróżniać per plik, a nie stosować jedną komendę do całego
`BUILD/*.js`.
