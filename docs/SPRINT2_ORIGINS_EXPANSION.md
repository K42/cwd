# Sprint 2: Rozszerzenie Danych Pochodzeń
## Plan Architektoniczny

**Data:** 6 października 2025  
**Architekt:** @architect.mdc  
**Cel:** Uzupełnienie pochodzeń o wszystkie dane z podręcznika - kafelek rozwinięty = pełna informacja

---

## 📊 Executive Summary

### Problem
Obecnie kafelki pochodzeń zawierają tylko podstawowe dane (atrybuty bazowe, rozmiar, prędkość). Użytkownik musi sięgać do podręcznika, aby:
- Poznać szczegóły cech specjalnych
- Wylosować wiek, budowę, wygląd, przeszłość, osobowość
- Zobaczyć korzyści na poziomie 4 (ekspert)
- Zrozumieć mechaniki obliczania atrybutów drugorzędnych

### Rozwiązanie
Rozszerzyć strukturę danych `origins.js` o **wszystkie** informacje z sekcji "Tworzenie postaci" w podręczniku, włącznie z:
- Pełnymi opisami cech specjalnych
- Tabelami losowania (6-8 tabel na pochodzenie)
- Wzorami obliczania atrybutów
- Korzyściami poziomu 4
- Przykładowymi imionami i opisami kulturowymi

---

## 📦 Zakres Prac

### Pochodzenia do Uzupełnienia (Podręcznik Główny)

| # | Pochodzenie | Strona | Linie MD | Status | Tabele |
|---|------------|--------|----------|--------|--------|
| 1 | **Człowiek** | 11-13 | 740-861 | ✅ Zlokalizowane | 6 (wiek, budowa, wygląd, przeszłość, osobowość, religia) |
| 2 | **Automaton** | 13-15 | 870-949 | ✅ Zlokalizowane | 3+ (wiek, funkcja, przeszłość) |
| 3 | **Goblin** | 16-17 | 1037-1183 | ✅ Zlokalizowane | 6 (wiek, budowa, cecha, nawyk, przeszłość, osobowość) |
| 4 | **Krasnolud** | 18-20 | 1198-1328 | ✅ Zlokalizowane | 6 (wiek, budowa, wygląd, wrogowie, przeszłość, osobowość) |
| 5 | **Odmieniec** | 20-21 | 1339-1469 | ✅ Zlokalizowane | 6 (wiek, płeć, pochodzenie, przeszłość, dziwactwo, osobowość) |
| 6 | **Ork** | 22-24 | 1482-1594 | ✅ Zlokalizowane | 5 (wiek, budowa, wygląd, przeszłość, osobowość) |

**Łącznie:** ~36 tabel losowania do wpisania

---

## 🏗️ Nowa Struktura Danych

### Przykład: Człowiek (Pełny Schemat)

```javascript
{
  id: 'czlowiek',
  nazwa: 'Człowiek',
  zrodlo: 'PG',
  
  // === OPIS I FLUFF ===
  opis: 'Determinacja, zaradność i zwykła liczebność sprawiły...',
  opis_pelny: {
    roznorodnosc: 'Ludzie dzielą się na wiele odmiennych grup etnicznych...',
    kultura: 'W kupie siła: W ludzkiej cywilizacji ważną rolę odgrywa wspólnota...',
    osobowosc: 'Wyrafinowani czy nieokrzesani, cnotliwi czy źli...',
    religia: 'Nieliczni ludzie poddają w wątpliwość istnienie bogów...'
  },
  przykladowe_imiona: [
    'Aengus', 'Agnes', 'Aine', 'Alice', 'Anselm', 'Beatrice',
    'Breandan', 'Caitlin', 'Cormac', 'Ella', 'Fiona', 'Geoffrey',
    'Giselle', 'Henry', 'Joan', 'John', 'Kane', 'Kiera',
    'Margery', 'Richard', 'Roisin', 'Rordan', 'Saraid',
    'Seamus', 'Walter', 'Yvonne'
  ],
  
  // === TWORZENIE POSTACI ===
  tworzenie_postaci: {
    // Atrybuty bazowe
    atrybuty_bazowe: {
      sila: 10,
      zrecznosc: 10,
      intelekt: 10,
      wola: 10
    },
    wybor_atrybutu: {
      opis: 'Wybierz jeden z atrybutów i podnieś go o 1',
      opcje: ['sila', 'zrecznosc', 'intelekt', 'wola']
    },
    
    // Wzory obliczania
    percepcja: 'intelekt',
    obrona: 'zrecznosc',
    zdrowie: 'sila',
    szybkosc_zdrowienia: '1/4 Zdrowia (zaokr. w dół)',
    
    // Statystyki bazowe
    rozmiar: '1/2 lub 1',
    rozmiar_opcje: ['1/2', '1'],
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
  
  // === CECHY SPECJALNE ===
  cechy_specjalne: {}, // Człowiek nie ma cech na poziomie 0
  
  // === POZIOM 4 (EKSPERT) ===
  poziom_4: {
    zdrowie_bonus: 5,
    opis: 'Atrybuty drugorzędne: Zdrowie +5',
    opcje: [
      {
        typ: 'zaklecie',
        ilosc: 1,
        opis: 'Możesz nauczyć się jednego zaklęcia'
      },
      {
        typ: 'talent',
        nazwa: 'Determinacja',
        opis: 'Gdy wyrzucisz 1 na kości ułatwienia, możesz rzucić ponownie i wybrać, którego wyniku użyć.',
        mechanika: {
          trigger: 'Wynik 1 na kości ułatwienia',
          efekt: 'Ponowny rzut, wybór lepszego wyniku',
          typ: 'pasywna'
        }
      }
    ]
  },
  
  // === TABELE LOSOWANIA ===
  tabele: {
    wiek: {
      nazwa: 'Człowiek: wiek',
      typ: '3k6',
      opis: 'Większość ludzi dożywa wieku około siedemdziesięciu lat.',
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
      opis: 'Wzrost i waga ludzi są zróżnicowane: od 1 do ponad 2 metrów i od 25 do ponad 250 kilogramów.',
      opcje: [
        { rzut: '3', wynik: 'Jesteś niski i szczupły.' },
        { rzut: '4', wynik: 'Jesteś niski i krępy.' },
        { rzut: '5-6', wynik: 'Jesteś niski.' },
        { rzut: '7-8', wynik: 'Jesteś smukły.' },
        { rzut: '9-12', wynik: 'Jesteś średniego wzrostu i wagi.' },
        { rzut: '13-14', wynik: 'Masz lekką nadwagę.' },
        { rzut: '15-16', wynik: 'Jesteś wysoki.' },
        { rzut: '17', wynik: 'Jesteś wysoki i szczupły.' },
        { rzut: '18', wynik: 'Jesteś bardzo wysoki i masywny.' }
      ]
    },
    
    wyglad: {
      nazwa: 'Człowiek: wygląd',
      typ: '3k6',
      opis: 'Ludzie różnią się wyglądem: od brzydkich po pięknych.',
      opcje: [
        { 
          rzut: '3', 
          wynik: 'Jesteś szpetny. Wyglądasz jak maszkara. Dzieci płaczą na twój widok, osoby co słabszego serca mdleją, a raz ktoś nawet zwymiotował po tym, jak dokładnie przyjrzał się twojej twarzy.' 
        },
        { 
          rzut: '4', 
          wynik: 'Jesteś brzydki; twoja twarz nie podoba się innym z powodu blizny, torbieli, krzaczastych brwi, krost, czyraków, zeza lub innych podobnych defektów.' 
        },
        { rzut: '5-6', wynik: 'Nie jesteś brzydki, ale większość nie uważa cię za atrakcyjnego.' },
        { 
          rzut: '7-8', 
          wynik: 'Jesteś z twarzy podobny zupełnie do nikogo. Inni ludzie cię zauważają, ale nie robisz szczególnego wrażenia.' 
        },
        { rzut: '9-12', wynik: 'Masz przeciętną aparycję. Wyglądasz jak wszyscy inni.' },
        { 
          rzut: '13-14', 
          wynik: 'Posiadasz cechę, którą inni uważają za atrakcyjną. Mogą to być ładne oczy, usta lub włosy, zgrabna figura albo coś innego.' 
        },
        { rzut: '15-16', wynik: 'Posiadasz kilka cech fizycznych, które dodają ci atrakcyjności.' },
        { 
          rzut: '17', 
          wynik: 'Jesteś jedną z najpiękniejszych osób na tych ziemiach, o niemal nieskazitelnej urodzie. Przyciągasz spojrzenia innych.' 
        },
        { 
          rzut: '18', 
          wynik: 'Twoja uroda jest tak zjawiskowa, że gdziekolwiek się pojawisz, wszyscy wodzą za tobą wzrokiem. Samą obecnością mieszasz ludziom w głowach; gdy z tobą rozmawiają, są rozkojarzeni i plączą im się języki. Jednak granica między uwielbieniem a nienawiścią bywa cienka. Jeśli odrzucisz czyjeś awanse, istnieje szansa, że ta osoba zwróci się przeciw tobie.' 
        }
      ]
    },
    
    przeszlosc: {
      nazwa: 'Człowiek: przeszłość',
      typ: 'k20',
      opis: 'Przeszłość twojej postaci określa jej wcześniejsze doświadczenia.',
      opcje: [
        { 
          rzut: '1', 
          wynik: 'Umarłeś i powróciłeś do żywych. Zaczynasz grę z 1k6 punktów Szaleństwa.',
          efekt: { szalenstwo: '1k6' }
        },
        { 
          rzut: '2', 
          wynik: 'Przez krótki czas byłeś opętany przez demona. Zaczynasz grę z 1 punktem Splugawienia.',
          efekt: { splugawienie: 1 }
        },
        { rzut: '3', wynik: 'Spędziłeś 1k6 lat w więzieniu.' },
        { 
          rzut: '4', 
          wynik: 'Zabiłeś kogoś z zimną krwią. Zaczynasz grę z 1 punktem Splugawienia.',
          efekt: { splugawienie: 1 }
        },
        { rzut: '5', wynik: 'Przeszedłeś ciężką chorobę.' },
        { 
          rzut: '6', 
          wynik: 'Należałeś do kultu i byłeś świadkiem wielu dziwnych rzeczy. Zaczynasz grę z 1 punktem Szaleństwa.',
          efekt: { szalenstwo: 1 }
        },
        { rzut: '7', wynik: 'Przez 1k20 lat byłeś więźniem faerie.' },
        { rzut: '8', wynik: 'Nigdy nie otrząsnąłeś się z żalu po utracie bliskiej osoby.' },
        { rzut: '9', wynik: 'Straciłeś palec, kilka zębów albo ucho lub nosisz bliznę.' },
        { rzut: '10', wynik: 'Utrzymujesz się z pracy w swojej profesji.' },
        { rzut: '11', wynik: 'Zakochałeś się; związek ten nadal trwa lub zakończył się dobrze.' },
        { rzut: '12', wynik: 'Masz żonę lub męża i 1k6 − 2 dzieci (minimum 0).' },
        { 
          rzut: '13', 
          wynik: 'Odbyłeś wiele podróży w różne strony świata. Umiesz mówić w jednym dodatkowym języku.',
          efekt: { jezyk_dodatkowy: 1 }
        },
        { 
          rzut: '14', 
          wynik: 'Posiadasz formalne wykształcenie. Umiesz czytać i pisać w języku wspólnym.',
          efekt: { czytanie_pisanie: 'wspólny' }
        },
        { rzut: '15', wynik: 'Obroniłeś rodzinne miasto przed okropnymi potworami.' },
        { rzut: '16', wynik: 'Powstrzymałeś spisek na życie ważnej persony lub schwytałeś zabójcę.' },
        { rzut: '17', wynik: 'Dokonałeś wielkich czynów i w swoich rodzinnych stronach jesteś bohaterem.' },
        { rzut: '18', wynik: 'Znalazłeś starą mapę wiodącą do skarbu.' },
        { rzut: '19', wynik: 'Ktoś ważny i wpływowy jest ci winien przysługę.' },
        { 
          rzut: '20', 
          wynik: 'Odziedziczyłeś w spadku pieniądze; zaczynasz grę z 2k6 miedziaków.',
          efekt: { pieniadze: '2k6_mc' }
        }
      ]
    },
    
    osobowosc: {
      nazwa: 'Człowiek: osobowość',
      typ: '3k6',
      opis: 'Osobowość określa moralne kompasy i motywacje postaci.',
      opcje: [
        { 
          rzut: '3', 
          wynik: 'Jesteś okrutny, niegodziwy i samolubny. Lubisz sprawiać innym ból.' 
        },
        { 
          rzut: '4', 
          wynik: 'Jesteś kapryśny i nieprzewidywalny. Rzadko dotrzymujesz słowa i dajesz się ponosić impulsom.' 
        },
        { 
          rzut: '5-6', 
          wynik: 'Kierujesz się prawem silniejszego. Posłuszeństwo wobec władzy jest najwyższym ideałem.' 
        },
        { 
          rzut: '7-8', 
          wynik: 'Dbasz przede wszystkim o siebie. Jesteś w stanie zdradzić nawet przyjaciół.' 
        },
        { 
          rzut: '9-12', 
          wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.' 
        },
        { rzut: '13-14', wynik: 'Pomagasz innym, bo tak należy.' },
        { 
          rzut: '15-16', 
          wynik: 'Starasz się postępować słusznie, nawet jeśli jest to wbrew prawu czy normom społecznym.' 
        },
        { rzut: '17', wynik: 'We wszystkim kierujesz się honorem i lojalnością.' },
        { 
          rzut: '18', 
          wynik: 'Jesteś oddany dobrym i szlachetnym celom i nie zdradzisz swoich przekonań nawet za cenę życia.' 
        }
      ]
    },
    
    religia: {
      nazwa: 'Człowiek: religia',
      typ: '3k6',
      opis: 'Religijne przekonania ludzi są zróżnicowane.',
      opcje: [
        { rzut: '3', wynik: 'Jesteś członkiem kultu wyznającego jakąś mroczną siłę.' },
        { rzut: '4', wynik: 'Należysz do sekty heretyków.' },
        { rzut: '5-6', wynik: 'Wychowałeś się na wiedźmiarskich naukach.' },
        { rzut: '7-10', wynik: 'Kierujesz się doktryną Starej Wiary.' },
        { rzut: '11-15', wynik: 'Jesteś wyznawcą Nowego Boga.' },
        { rzut: '16-18', wynik: 'Nie jesteś religijny.' }
      ]
    }
  },
  
  // === METADANE ===
  strona_zrodlowa: 11,
  linie_zrodlowe: '740-861',
  status: 'kompletne', // 'w_trakcie', 'niezweryfikowane', 'kompletne'
  data_aktualizacji: '2025-10-06'
}
```

---

## ✅ Kryteria Akceptacji

### AC-010: Struktura Danych ✓
- [x] Schemat zdefiniowany w `ARCHITECTURE.md`
- [ ] Prototyp dla Człowieka wpisany w `origins.js`
- [ ] Walidacja struktury z zespołem
- [ ] Migracja 5 pozostałych pochodzeń

### AC-011: UI - Rozwinięty Kafelek
**Sekcje do wyświetlenia:**
- [ ] Tworzenie Postaci (atrybuty, wzory, rozmiar, prędkość)
- [ ] Cechy Specjalne (z pełnymi opisami mechanik)
- [ ] Poziom 4 (bonus Zdrowia, opcje: zaklęcie/talent)
- [ ] Tabele Losowania (przyciski → modaleakcjonowane z losowaniem)
- [ ] Opis (fluff, przykładowe imiona)

### AC-012: Backend API
- [ ] `GET /api/origins/:id/tables` - zwraca tabele dla pochodzenia
- [ ] Test jednostkowy dla każdego pochodzenia

### AC-013: Funkcja Losowania
- [ ] `losujZTabeli(typRzutu, tabela)` - symuluje rzut
- [ ] Obsługa: k6, k20, 2k6, 3k6
- [ ] Testy jednostkowe i brzegowe

### AC-014: Migracja Danych
**Człowiek:**
- [ ] Tworzenie postaci (linie 740-755)
- [ ] Poziom 4 (756-762)
- [ ] Tabele: Przeszłość (766-791), Osobowość (793-805), Religia (807-817)
- [ ] Tabele: Wiek (818-827), Budowa (831-846), Wygląd (848-861)

**Automaton:**
- [ ] Tworzenie postaci (870-925) + mechanika klucza
- [ ] Poziom 4 (926-932)
- [ ] Tabele: Wiek (934-942), Funkcja (944-966)

**Goblin:**
- [ ] Tworzenie postaci (1037-1056) + cechy specjalne
- [ ] Poziom 4 (1057-1062)
- [ ] Tabele: Wiek, Budowa, Cecha, Nawyk, Przeszłość, Osobowość

**Krasnolud:**
- [ ] Tworzenie postaci (1198-1221) + cechy specjalne
- [ ] Poziom 4 (1222-1228)
- [ ] Tabele: Wiek, Budowa, Wygląd, Wrogowie, Przeszłość, Osobowość

**Odmieniec:**
- [ ] Tworzenie postaci (1339-1360) + Kradzież tożsamości
- [ ] Poziom 4 (1361-1367)
- [ ] Tabele: Wiek, Płeć, Pochodzenie, Przeszłość, Dziwactwo, Osobowość

**Ork:**
- [ ] Tworzenie postaci (1482-1499) + Splugawienie 1
- [ ] Poziom 4 (1500-1504)
- [ ] Tabele: Wiek, Budowa, Wygląd, Przeszłość, Osobowość

### AC-015: Testy
- [ ] Test weryfikacji pełności danych dla każdego pochodzenia
- [ ] Test obliczania atrybutów (percepcja, obrona, zdrowie)
- [ ] Test losowania z każdego typu tabeli
- [ ] Test API `/api/origins/:id/tables`

### AC-016: Dokumentacja
- [x] `ARCHITECTURE.md` zaktualizowane
- [ ] Mapowanie Podręcznik → Dane (tabela w docs)
- [ ] README dla `/src/data/origins.js`
- [ ] Diagramy UX dla rozwiniętego kafelka

---

## 🚀 Plan Implementacji

### Faza 1: Prototyp (Sprint 2.1) - 1-2 dni
1. **Rozszerzenie schematu** - dodać nowe pola do `origins.js`
2. **Prototyp: Człowiek** - wpisać wszystkie dane dla 1 pochodzenia
3. **Walidacja** - sprawdzić z zespołem, czy struktura jest OK
4. **Migracja** - uzupełnić 5 pozostałych pochodzeń

**Output:** `origins.js` z 6 kompletnymi pochodzeniami

### Faza 2: Backend (Sprint 2.2) - 1 dzień
1. **API Endpoint** - `GET /api/origins/:id/tables`
2. **Funkcja losowania** - `losujZTabeli(typ, tabela)`
3. **Testy** - jednostkowe dla API i losowania

**Output:** Backend gotowy do użycia w UI

### Faza 3: Frontend (Sprint 2.3) - 2-3 dni
1. **Komponent kafelka** - sekcje zwijane/rozwijane
2. **Sekcje danych** - Tworzenie, Cechy, Poziom 4, Tabele, Opis
3. **Modal tabel** - interfejs losowania (przycisk "Losuj" + lista wyboru)
4. **Integracja** - kafelek → kreator → POST /api/build

**Output:** Pełnofunkcjonalny UI z rozwijanymi kafelkami

### Faza 4: Testy i Walidacja (Sprint 2.4) - 1 dzień
1. **Testy E2E** - każde pochodzenie od początku do końca
2. **Walidacja zgodności** - porównanie z podręcznikiem
3. **UX Testing** - czy użytkownik rozumie interfejs?
4. **Poprawki** - based on feedback

**Output:** Produkcyjnie gotowa funkcjonalność

---

## 📈 Metryki Sukcesu

| Metryka | Cel | Sposób Mierzenia |
|---------|-----|------------------|
| **Pełność danych** | 100% sekcji "Tworzenie postaci" | Checklist w AC-014 |
| **Pokrycie testami** | 100% nowych funkcji | Coverage report |
| **Wydajność UI** | Kafelek ładuje się < 100ms | Performance profiler |
| **Samowystarczalność** | Użytkownik nie sięga po podręcznik | User testing (n=5) |
| **Zgodność z zasadami** | 0 błędów mechanicznych | Code review + walidacja |

---

## ⚠️ Ryzyka i Mitigacja

| Ryzyko | Prawdopodobieństwo | Wpływ | Mitigacja |
|--------|-------------------|-------|-----------|
| Objętość danych (36 tabel) | Wysokie | Średni | Skrypty formatujące, walidacja automatyczna |
| Niespójności w podręczniku | Średnie | Niski | Normalizacja, dokumentacja odstępstw |
| Złożoność UI | Średnie | Wysoki | Progressive disclosure, UX review |
| Błędy w tabelach | Średnie | Średni | Testy pokrycia zakresów, peer review |

---

## 📚 Źródła Danych

### Podręcznik Główny (PodrecznikGlowny.md)

| Sekcja | Linie | Zawartość |
|--------|-------|-----------|
| Człowiek | 740-861 | Tworzenie + 6 tabel |
| Automaton | 870-949 | Tworzenie + mechanika + 3 tabele |
| Goblin | 1037-1183 | Tworzenie + 6 tabel |
| Krasnolud | 1198-1328 | Tworzenie + 6 tabel |
| Odmieniec | 1339-1469 | Tworzenie + 6 tabel |
| Ork | 1482-1594 | Tworzenie + 5 tabel |

---

## 👥 Role i Odpowiedzialności

| Rola | Osoba | Odpowiedzialność |
|------|-------|------------------|
| **Architekt** | @architect.mdc | Definicja struktury, AC, review |
| **Developer** | TBD | Implementacja backend + frontend |
| **Tester** | TBD | Testy jednostkowe + E2E |
| **Code Review** | @code-review.mdc | Walidacja kodu i zgodności z zasadami |

---

## 📞 Kontakt i Pytania

- **Dokumentacja:** `ARCHITECTURE.md` (Sprint 2)
- **Tracking:** Task list w AC-010 do AC-016
- **Issues:** GitHub Issues z tagiem `sprint-2-origins`

---

**Status:** ✅ Zaplanowane - oczekuje na rozpoczęcie implementacji  
**Data utworzenia:** 6 października 2025  
**Ostatnia aktualizacja:** 6 października 2025

