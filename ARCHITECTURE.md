# Architektura Kreatora Postaci - Cień Władcy Demonów

## Przegląd
Aplikacja jest izomorficzną stroną internetową do tworzenia postaci dla gry RPG "Cień Władcy Demonów". Wykorzystuje proste technologie web bez bazy danych.

## Struktura techniczna

### Frontend (statyczny)
- **HTML + vanilla JS** - renderuje pojedynczy `index.html` serwowany przez Node.js
- **Brak frameworków** - czyste rozwiązania JavaScript dla maksymalnej prostoty
- **Caching w pamięci** - reguły gry ładowane raz i cache'owane po stronie klienta

### Backend (Node.js)
- **Express server** - minimalistyczny serwer HTTP
- **Jeden endpoint** - `/api/build` przyjmuje specyfikację postaci, zwraca kompletny obiekt
- **Czyste funkcje** - `budujPostac(spec)` bez efektów ubocznych, umożliwia snapshot testy

### Dane
- **`data.js`** - wszystkie tabele lookup (pochodzenia, ścieżki, zaklęcia) w jednym pliku
- **Hash mapa** - klucze typu `"pochodzenie:jotunn"` dla wyszukiwania O(1)
- **Walidacja** - sprawdzanie zgodności z regułami gry na etapie budowania

## Przepływ danych
1. UI zbiera wybory użytkownika (pochodzenie, atrybuty)
2. POST do `/api/build` z obiektem specyfikacji
3. Serwer buduje kompletną postać używając `data.js`
4. Zwrot JSON z wszystkimi obliczonymi wartościami
5. UI wyświetla kartę postaci

## Zasady implementacji
- **Jedna odpowiedzialność** - każdy moduł ma jedno zadanie
- **Immutability** - dane wejściowe nie są modyfikowane
- **Testowalna logika** - każda reguła gry jako osobna funkcja z testami
- **Rozszerzalność** - dodawanie nowych pochodzeń = aktualizacja `data.js`

## Kryteria Akceptacji - Sprint 1

### AC-001: Podstawowa struktura
- [x] Folder `src/` z plikami `server.js`, `data.js`, `ui/index.html`
- [x] `package.json` z scripts: start, test, lint
- [x] Serwer startuje na porcie 3000

### AC-002: Endpoint budowania postaci
- [x] POST `/api/build` przyjmuje JSON spec
- [x] Zwraca kompletny obiekt postaci
- [x] Waliduje dane wejściowe

### AC-003: Podstawowe pochodzenia
- [x] Człowiek i Jötunn hardkodowane w `data.js`
- [x] Obliczanie atrybutów drugorzędnych (Zdrowie = Siła)
- [x] Test jednostkowy dla każdego pochodzenia

---

## Sprint 2: Rozszerzenie Danych Pochodzeń

### Cel
Uzupełnienie wszystkich pochodzeń o kompletne dane z podręcznika zgodnie z sekcjami "Tworzenie postaci". Kafelek pochodzenia w rozwiniętym stanie musi zawierać WSZYSTKIE informacje potrzebne do stworzenia postaci.

### Struktura Danych Pochodzenia (Pełna)

```javascript
{
  id: 'czlowiek',
  nazwa: 'Człowiek',
  zrodlo: 'PG', // Podręcznik Główny
  
  // Sekcja: Opis i Fluff
  opis: 'Krótki opis z podręcznika',
  opis_pelny: 'Pełny opis z sekcji głównej',
  wygląd: 'Różnorodność: Ludzie dzielą się...',
  kultura: 'W kupie siła: ...',
  przykladowe_imiona: ['Aengus', 'Agnes', ...],
  
  // Sekcja: Tworzenie Postaci - Atrybuty
  tworzenie_postaci: {
    atrybuty_bazowe: {
      sila: 10,
      zrecznosc: 10,
      intelekt: 10,
      wola: 10
    },
    wybor_atrybutu: '+1 do wybranego atrybutu', // Opcjonalne
    
    // Obliczanie atrybutów drugorzędnych
    percepcja: 'intelekt', // lub 'intelekt+1'
    obrona: 'zrecznosc',
    zdrowie: 'sila', // lub 'sila+4' dla krasnoluda
    szybkosc_zdrowienia: '1/4 Zdrowia (zaokr. w dół)',
    
    // Podstawowe statystyki
    rozmiar: '1/2 lub 1',
    predkosc: 10,
    moc: 0,
    
    // Stany początkowe
    obrazenia: 0,
    szalenstwo: 0,
    splugawienie: 0,
    
    // Języki i profesje
    jezyki: ['wspólny'],
    jezyki_opcje: '1 dodatkowy język LUB losowa profesja',
    profesje: []
  },
  
  // Cechy specjalne pochodzenia
  cechy_specjalne: {
    determinacja: {
      nazwa: 'Determinacja',
      opis: 'Gdy wyrzucisz 1 na kości ułatwienia...',
      typ: 'pasywna'
    }
  },
  
  // Poziom 4 (Ekspert)
  poziom_4: {
    zdrowie_bonus: 5,
    opcje: [
      {
        typ: 'zaklecie',
        ilosc: 1
      },
      {
        typ: 'talent',
        nazwa: 'Determinacja',
        opis: 'Gdy wyrzucisz 1 na kości ułatwienia...'
      }
    ]
  },
  
  // Tabele do losowania
  tabele: {
    wiek: {
      nazwa: 'Człowiek: wiek',
      typ: '3k6',
      opcje: [
        { rzut: '3', wynik: 'Dziecko, 11 lat lub mniej.' },
        { rzut: '4-7', wynik: 'Młodociany, 12–17 lat.' },
        { rzut: '8-12', wynik: 'Młody dorosły, 18–35 lat.' },
        { rzut: '13-15', wynik: 'Dorosły w średnim wieku, 36–55 lat.' },
        { rzut: '16-17', wynik: 'Starszy dorosły, 56–75 lat.' },
        { rzut: '18', wynik: 'Sędziwy dorosły, 76 lat lub więcej.' }
      ]
    },
    budowa_ciala: {
      nazwa: 'Człowiek: budowa ciała',
      typ: '3k6',
      opcje: [
        { rzut: '3', wynik: 'Jesteś niski i szczupły.' },
        { rzut: '4', wynik: 'Jesteś niski i krępy.' },
        // ...
      ]
    },
    wyglad: {
      nazwa: 'Człowiek: wygląd',
      typ: '3k6',
      opcje: [...]
    },
    przeszlosc: {
      nazwa: 'Człowiek: przeszłość',
      typ: 'k20',
      opcje: [...]
    },
    osobowosc: {
      nazwa: 'Człowiek: osobowość',
      typ: '3k6',
      opcje: [...]
    },
    religia: {
      nazwa: 'Człowiek: religia',
      typ: '3k6',
      opcje: [...]
    }
  },
  
  // Metadane
  strona_zrodlowa: 11, // Strona w podręczniku
  status: 'zweryfikowane' // lub 'w trakcie', 'niezweryfikowane'
}
```

### AC-010: Rozszerzenie Struktury Danych Pochodzenia

**Podręcznik główny (PG) - 6 pochodzeń:**
- [x] Człowiek (str. 11, linie 740-829)
- [x] Automaton (str. 13, linie 870-949)
- [x] Goblin (str. 16, linie 1037-1183)
- [x] Krasnolud (str. 18, linie 1198-1328)
- [x] Odmieniec (str. 20, linie 1339-1469)
- [x] Ork (str. 22, linie 1482-1594)

**Kryteria:**
- [ ] Każde pochodzenie zawiera pełną sekcję `tworzenie_postaci` zgodnie z podręcznikiem
- [ ] Wszystkie tabele losowania (wiek, budowa, wygląd, przeszłość, osobowość) są zaindeksowane
- [ ] Cechy specjalne opisane z pełnymi mechanicznymi efektami
- [ ] Korzyści poziomu 4 (ekspert) w pełni zdefiniowane
- [ ] Języki i profesje zgodne z podręcznikiem

### AC-011: UI - Rozwinięty Kafelek Pochodzenia

**Cel:** Gdy użytkownik rozwinie kafelek pochodzenia, widzi WSZYSTKIE informacje potrzebne do stworzenia postaci.

**Wymagania:**
- [ ] Sekcja "Tworzenie Postaci" wyświetla:
  - [ ] Początkowe wartości atrybutów z wyjaśnieniem
  - [ ] Wzory obliczania atrybutów drugorzędnych
  - [ ] Rozmiar, Prędkość, Moc
  - [ ] Stany początkowe (Obrażenia, Szaleństwo, Splugawienie)
  - [ ] Języki i profesje
  
- [ ] Sekcja "Cechy Specjalne":
  - [ ] Lista wszystkich zdolności rasowych
  - [ ] Pełne opisy mechaniczne (nie tylko nazwy)
  - [ ] Ikony/znaczniki typu zdolności (pasywna/aktywna)
  
- [ ] Sekcja "Poziom 4 (Ekspert)":
  - [ ] Bonus do Zdrowia
  - [ ] Opcje do wyboru (zaklęcie lub talent)
  - [ ] Pełny opis talentu jeśli dotyczy
  
- [ ] Sekcja "Tabele Losowania":
  - [ ] Przyciski do każdej tabeli: Wiek, Budowa, Wygląd, Przeszłość, Osobowość
  - [ ] Kliknięcie pokazuje tabelę z możliwością losowania lub wyboru
  - [ ] Wylosowana/wybrana wartość jest zapisywana w specyfikacji postaci
  
- [ ] Sekcja "Opis":
  - [ ] Pełny opis rasowy z podręcznika
  - [ ] Przykładowe imiona
  - [ ] Dodatkowe informacje kulturowe

### AC-012: Backend - API dla Tabel Losowania

**Endpoint:** `GET /api/origins/:originId/tables`

**Zwraca:**
```json
{
  "pochodzenie": "czlowiek",
  "tabele": {
    "wiek": { "typ": "3k6", "opcje": [...] },
    "budowa_ciala": { "typ": "3k6", "opcje": [...] },
    "wyglad": { "typ": "3k6", "opcje": [...] },
    "przeszlosc": { "typ": "k20", "opcje": [...] },
    "osobowosc": { "typ": "3k6", "opcje": [...] }
  }
}
```

**Kryteria:**
- [ ] Endpoint zwraca wszystkie tabele dla danego pochodzenia
- [ ] Obsługa różnych typów rzutów (k6, k20, 3k6)
- [ ] Walidacja: 404 jeśli pochodzenie nie istnieje
- [ ] Test jednostkowy dla każdego pochodzenia

### AC-013: Backend - Funkcja Losowania

**Funkcja:** `losujZTabeli(typRzutu, tabela)`

**Parametry:**
- `typRzutu`: "k6", "k20", "2k6", "3k6"
- `tabela`: Obiekt z opcjami i zakresami rzutów

**Zwraca:**
```javascript
{
  rzut: "14",
  wynik: "Dorosły w średnim wieku, 36–55 lat.",
  wartosc_rzutu: 14
}
```

**Kryteria:**
- [ ] Funkcja symuluje rzut kośćmi zgodnie z typem
- [ ] Dopasowuje wynik do właściwego zakresu w tabeli
- [ ] Zwraca obiekt z pełnymi informacjami o wyniku
- [ ] Test jednostkowy dla każdego typu rzutu
- [ ] Test brzegowy: sprawdzenie wszystkich zakresów w tabeli

### AC-014: Migracja Danych - Uzupełnienie origins.js

**Dla każdego pochodzenia z podręcznika głównego:**

1. **Człowiek** (PG str. 11-13)
   - [ ] Sekcja tworzenia postaci (linie 740-755)
   - [ ] Poziom 4: Determinacja (linie 756-762)
   - [ ] Tabela: Przeszłość (linie 766-791)
   - [ ] Tabela: Osobowość (linie 793-805)
   - [ ] Tabela: Religia (linie 807-817)
   - [ ] Tabela: Wiek (linie 818-827)
   - [ ] Tabela: Budowa ciała (linie 831-846)
   - [ ] Tabela: Wygląd (linie 848-861)

2. **Automaton** (PG str. 13-15)
   - [ ] Sekcja tworzenia postaci (linie 870-925)
   - [ ] Mechanika klucza i formy obiektu
   - [ ] Poziom 4: Wysokie obroty (linie 926-932)
   - [ ] Tabela: Wiek (linie 934-942)
   - [ ] Tabela: Funkcja (linie 944-966)
   - [ ] Dodatkowe tabele specyficzne dla automatonów

3. **Goblin** (PG str. 16-17)
   - [ ] Sekcja tworzenia postaci (linie 1037-1056)
   - [ ] Cechy: Wrażliwość na żelazo, Widzenie w cieniu, Przebiegłość
   - [ ] Poziom 4: Odskok (linie 1057-1062)
   - [ ] Tabela: Wiek (linie 1063-1073)
   - [ ] Tabela: Budowa ciała (linie 1075-1088)
   - [ ] Tabela: Cecha szczególna (linie 1090-1114)
   - [ ] Tabela: Dziwny nawyk (linie 1116-1142)
   - [ ] Tabela: Przeszłość (linie 1144-1168)
   - [ ] Tabela: Osobowość (linie 1170-1182)

4. **Krasnolud** (PG str. 18-20)
   - [ ] Sekcja tworzenia postaci (linie 1198-1221)
   - [ ] Cechy: Widzenie w ciemności, Znienawidzony wróg, Naturalna odporność
   - [ ] Poziom 4: Nie do zdarcia (linie 1222-1228)
   - [ ] Tabela: Wiek (linie 1230-1240)
   - [ ] Tabela: Budowa ciała (linie 1242-1253)
   - [ ] Tabela: Wygląd (linie 1255-1265)
   - [ ] Tabela: Znienawidzone stworzenia (linie 1267-1286)
   - [ ] Tabela: Przeszłość (linie 1288-1315)
   - [ ] Tabela: Osobowość (linie 1316-1328)

5. **Odmieniec** (PG str. 20-21)
   - [ ] Sekcja tworzenia postaci (linie 1339-1360)
   - [ ] Cechy: Kradzież tożsamości, Wrażliwość na żelazo, Widzenie w cieniu
   - [ ] Poziom 4: Prymat sobowtóra (linie 1361-1367)
   - [ ] Tabela: Prawdziwy wiek (linie 1369-1378)
   - [ ] Tabela: Pozorna płeć (linie 1380-1385)
   - [ ] Tabela: Pozorne pochodzenie (linie 1387-1395)
   - [ ] Tabela: Przeszłość (linie 1397-1425)
   - [ ] Tabela: Dziwactwo (linie 1427-1450)
   - [ ] Tabela: Osobowość (linie 1456-1468)

6. **Ork** (PG str. 22-24)
   - [ ] Sekcja tworzenia postaci (linie 1482-1499)
   - [ ] Cecha: Widzenie w cieniu
   - [ ] Splugawienie początkowe: 1
   - [ ] Poziom 4: Furia (linie 1500-1504)
   - [ ] Tabela: Wiek (linie 1506-1516)
   - [ ] Tabela: Budowa ciała (linie 1518-1531)
   - [ ] Tabela: Wygląd (linie 1533-1543)
   - [ ] Tabela: Przeszłość (linie 1544-1570)
   - [ ] Tabela: Osobowość (linie 1572-1594)

### AC-015: Walidacja i Testy

**Testy jednostkowe:**
- [ ] Test dla każdego pochodzenia: weryfikacja pełności danych
- [ ] Test obliczania atrybutów drugorzędnych dla każdego pochodzenia
- [ ] Test losowania z każdej tabeli (wszystkie zakresy)
- [ ] Test API `/api/origins/:id/tables`

**Walidacja danych:**
- [ ] Każde pochodzenie ma wypełnione wszystkie wymagane pola
- [ ] Wszystkie odniesienia do stron podręcznika są prawidłowe
- [ ] Tabele losowania pokrywają wszystkie możliwe wyniki rzutów
- [ ] Brak luk w zakresach (np. 3-4, 5-7, brak 8)

### AC-016: Dokumentacja

- [ ] Aktualizacja `ARCHITECTURE.md` z nową strukturą danych
- [ ] Dokument mapowania: Podręcznik → Struktura danych (tabela)
- [ ] README dla `/src/data/origins.js` z przykładami
- [ ] Diagramy przepływu dla UI kafelka rozwiniętego

---

## Mapowanie: Podręcznik → Dane Aplikacji

### Sekcja "Tworzenie postaci: [POCHODZENIE]"

| Element w Podręczniku | Pole w `origins.js` | Przykład |
|----------------------|---------------------|----------|
| Początkowe wartości atrybutów | `tworzenie_postaci.atrybuty_bazowe` | `{sila: 10, zrecznosc: 10, ...}` |
| Percepcja = Intelekt + 1 | `tworzenie_postaci.percepcja` | `"intelekt+1"` |
| Obrona = Zręczność | `tworzenie_postaci.obrona` | `"zrecznosc"` |
| Zdrowie = Siła + 4 | `tworzenie_postaci.zdrowie` | `"sila+4"` |
| Rozmiar 1/2 | `tworzenie_postaci.rozmiar` | `"1/2"` |
| Prędkość 10 | `tworzenie_postaci.predkosc` | `10` |
| Języki: wspólny, elficki | `tworzenie_postaci.jezyki` | `["wspólny", "elficki"]` |
| Niewrażliwość na zauroczenie | `cechy_specjalne.niewrazliwosc_zauroczenie` | `{nazwa: "Niewrażliwość", ...}` |

### Sekcja "[POCHODZENIE], poziom 4 (ekspert)"

| Element w Podręczniku | Pole w `origins.js` | Przykład |
|----------------------|---------------------|----------|
| Zdrowie +5 | `poziom_4.zdrowie_bonus` | `5` |
| 1 zaklęcie lub talent X | `poziom_4.opcje` | `[{typ: "zaklecie", ilosc: 1}, {typ: "talent", nazwa: "X"}]` |
| Opis talentu | `poziom_4.opcje[1].opis` | "Gdy wyrzucisz..." |

### Tabele Losowania

| Tabela w Podręczniku | Pole w `origins.js` | Typ rzutu |
|---------------------|---------------------|-----------|
| [POCHODZENIE]: wiek | `tabele.wiek` | `3k6` lub `k20` |
| [POCHODZENIE]: budowa ciała | `tabele.budowa_ciala` | `3k6` |
| [POCHODZENIE]: wygląd | `tabele.wyglad` | `3k6` |
| [POCHODZENIE]: przeszłość | `tabele.przeszlosc` | `k20` |
| [POCHODZENIE]: osobowość | `tabele.osobowosc` | `3k6` |

---

## Kolejność Implementacji

### Faza 1: Struktura Danych (Sprint 2.1)
1. Rozszerzenie schematu w `origins.js` dla 1 pochodzenia (Człowiek) - prototyp
2. Walidacja struktury z zespołem
3. Migracja pozostałych 5 pochodzeń z PG

### Faza 2: Backend API (Sprint 2.2)
1. Endpoint `/api/origins/:id/tables`
2. Funkcja `losujZTabeli()`
3. Testy jednostkowe

### Faza 3: Frontend UI (Sprint 2.3)
1. Komponent rozwiniętego kafelka
2. Sekcje: Tworzenie postaci, Cechy specjalne, Poziom 4
3. Interfejs tabel losowania
4. Integracja z przepływem kreatora

### Faza 4: Testowanie i Walidacja (Sprint 2.4)
1. Testy end-to-end dla każdego pochodzenia
2. Walidacja zgodności z podręcznikiem
3. Testy użytkownika (UX)
4. Poprawki i optymalizacja

---

## Zależności i Ryzyka

### Zależności
- Dostęp do `PodrecznikGlowny.md` z pełnymi danymi
- Ekstrakcja tabel z PDF (już wykonane)
- Decyzje UI/UX dla interfejsu tabel losowania

### Ryzyka
1. **Objętość danych**: 6 pochodzeń × ~6 tabel = ~36 tabel do wpisania
   - *Mitigacja*: Skrypty pomocnicze do formatowania, walidacja automatyczna
   
2. **Niespójności w podręczniku**: Różne formaty tabel dla różnych pochodzeń
   - *Mitigacja*: Normalizacja do wspólnego schematu, dokumentacja odstępstw
   
3. **Złożoność UI**: Rozwinięty kafelek może być przytłaczający
   - *Mitigacja*: Sekcje zwijane, progressive disclosure, dobre UX

### Metryki Sukcesu
- [ ] 100% danych z sekcji "Tworzenie postaci" dla 6 pochodzeń z PG
- [ ] 100% pokrycia testami dla nowej struktury danych
- [ ] Czas ładowania kafelka < 100ms
- [ ] Użytkownik może stworzyć postać bez konsultacji podręcznika
