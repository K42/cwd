# Mapowanie: Podręcznik → Struktura Danych
## Przewodnik Migracji Pochodzeń

**Cel:** Skopiowanie danych z `PodrecznikGlowny.md` do `src/data/origins.js`

---

## 📋 Szablon Migracji

### Krok 1: Znajdź Sekcje w Podręczniku

```bash
# Przykład dla Człowieka
## Tworzenie postaci: człowiek       # Linia 740
## Człowiek, poziom 4 (ekspert)      # Linia 756
## Człowiek: przeszłość               # Linia 766
## Człowiek: osobowość                # Linia 793
## Człowiek: religia                  # Linia 807
## Człowiek: wiek                     # Linia 818
## Człowiek: budowa ciała             # Linia 831
## Człowiek: wygląd                   # Linia 848
```

### Krok 2: Wypełnij Sekcję `tworzenie_postaci`

| Element w Podręczniku | Pole w JS | Format |
|----------------------|-----------|--------|
| **Początkowe wartości atrybutów:** Siła 10, Zręczność 10... | `tworzenie_postaci.atrybuty_bazowe` | `{sila: 10, zrecznosc: 10, intelekt: 10, wola: 10}` |
| Wybierz jeden z atrybutów i podnieś go o 1 | `tworzenie_postaci.wybor_atrybutu` | `{opis: '...', opcje: ['sila', ...]}` |
| **Percepcja** równa jest wartości Intelektu | `tworzenie_postaci.percepcja` | `"intelekt"` |
| **Percepcja** równa jest wartości Intelektu + 1 | `tworzenie_postaci.percepcja` | `"intelekt+1"` |
| **Obrona** równa jest wartości Zręczności | `tworzenie_postaci.obrona` | `"zrecznosc"` |
| **Zdrowie** równe jest wartości Siły | `tworzenie_postaci.zdrowie` | `"sila"` |
| **Zdrowie** równe jest wartości Siły + 4 | `tworzenie_postaci.zdrowie` | `"sila+4"` |
| **Szybkość Zdrowienia** = 1/4 Zdrowia (zaokr. w dół) | `tworzenie_postaci.szybkosc_zdrowienia` | `"1/4 Zdrowia (zaokr. w dół)"` |
| **Rozmiar** 1/2 lub 1 | `tworzenie_postaci.rozmiar` | `"1/2 lub 1"` |
| **Prędkość** 10 | `tworzenie_postaci.predkosc` | `10` |
| **Moc** 0 | `tworzenie_postaci.moc` | `0` |
| **Obrażenia** 0 | `tworzenie_postaci.obrazenia` | `0` |
| **Szaleństwo** 0 | `tworzenie_postaci.szalenstwo` | `0` |
| **Splugawienie** 0 | `tworzenie_postaci.splugawienie` | `0` |
| **Języki:** Umiesz mówić w języku wspólnym | `tworzenie_postaci.jezyki` | `["wspólny"]` |
| ...i elfickim | `tworzenie_postaci.jezyki` | `["wspólny", "elficki"]` |

### Krok 3: Wypełnij Cechy Specjalne

**Przykład 1: Goblin - Przebiegłość**
```javascript
cechy_specjalne: {
  przebieglosc: {
    nazwa: 'Przebiegłość',
    opis: 'Testy Zręczności na ukrywanie się lub ciche poruszanie wykonujesz z 1 ułatwieniem.',
    typ: 'pasywna',
    mechanika: {
      trigger: 'Test Zręczności: ukrywanie lub ciche poruszanie',
      efekt: '+1 ułatwienie'
    }
  },
  niewrazliwosc_zauroczenie: {
    nazwa: 'Niewrażliwość na zauroczenie',
    opis: 'Niewrażliwość na zauroczenie, a także na choroby i pochodzące od nich obrażenia.',
    typ: 'pasywna',
    mechanika: {
      efekt: 'Immunitet: zauroczenie, choroby, obrażenia od chorób'
    }
  },
  wrazliwosc_na_zelazo: {
    nazwa: 'Wrażliwość na żelazo',
    opis: 'Jesteś osłabiony, gdy dotykasz żelaza.',
    typ: 'pasywna',
    mechanika: {
      trigger: 'Dotknięcie żelaza',
      efekt: 'Stan: osłabiony'
    }
  },
  widzenie_w_cieniu: {
    nazwa: 'Widzenie w cieniu',
    opis: 'Widzisz w zacienionych obszarach tak samo dobrze jak w oświetlonych.',
    typ: 'pasywna'
  }
}
```

**Przykład 2: Krasnolud - Znienawidzony wróg**
```javascript
cechy_specjalne: {
  widzenie_w_ciemnosci: {
    nazwa: 'Widzenie w ciemności',
    opis: 'W obszarach spowitych cieniem lub mrokiem widzisz na średni zasięg tak samo dobrze jak w oświetlonych. Poza średnim zasięgiem widzisz w cieniu jak w świetle, a w mroku jak w cieniu.',
    typ: 'pasywna'
  },
  znienawidzony_wrog: {
    nazwa: 'Znienawidzony wróg',
    opis: 'Wybierz rodzaj stworzenia z tabeli Znienawidzone stworzenia. Wszystkie rzuty na atak przeciwko stworzeniom tego typu wykonujesz z 1 ułatwieniem.',
    typ: 'pasywna',
    mechanika: {
      wybor: 'tabela_znienawidzone_stworzenia',
      efekt: '+1 ułatwienie do ataków przeciw wybranemu typowi'
    }
  },
  naturalna_odpornosc: {
    nazwa: 'Naturalna odporność',
    opis: 'Otrzymujesz tylko połowę obrażeń od trucizny. Testy na uniknięcie lub pozbycie się zatrucia wykonujesz z 1 ułatwieniem.',
    typ: 'pasywna',
    mechanika: {
      efekt: 'Obrażenia od trucizny × 0.5; +1 ułatwienie do testów zatrucia'
    }
  }
}
```

### Krok 4: Wypełnij Poziom 4

**Szablon:**
```javascript
poziom_4: {
  zdrowie_bonus: 5,  // lub 4, 6 - zależne od pochodzenia
  opis: 'Atrybuty drugorzędne: Zdrowie +5',
  opcje: [
    {
      typ: 'zaklecie',
      ilosc: 1,
      opis: 'Możesz nauczyć się jednego zaklęcia'
    },
    {
      typ: 'talent',
      nazwa: 'Determinacja',  // lub inny talent
      opis: 'Gdy wyrzucisz 1 na kości ułatwienia, możesz rzucić ponownie i wybrać, którego wyniku użyć.',
      mechanika: {
        trigger: 'Wynik 1 na kości ułatwienia',
        efekt: 'Ponowny rzut, wybór wyniku',
        typ: 'pasywna'
      }
    }
  ]
}
```

### Krok 5: Wypełnij Tabele

#### Typ 1: Tabela 3k6 (zakres 3-18)
```javascript
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
}
```

#### Typ 2: Tabela k20 (zakres 1-20)
```javascript
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
    // ... 3-19
    { 
      rzut: '20', 
      wynik: 'Odziedziczyłeś w spadku pieniądze; zaczynasz grę z 2k6 miedziaków.',
      efekt: { pieniadze: '2k6_mc' }
    }
  ]
}
```

#### Typ 3: Tabela z efektami mechanicznymi
```javascript
przeszlosc: {
  // ...
  opcje: [
    { 
      rzut: '1', 
      wynik: 'Tekst opisu z podręcznika',
      efekt: { 
        szalenstwo: 1,          // Stała wartość
        splugawienie: '1k6',     // Rzut kością
        jezyk_dodatkowy: 1,      // Binarny flag
        pieniadze: '2k6_mc'      // Rzut na pieniądze (miedzianki)
      }
    }
  ]
}
```

---

## 🔍 Przykłady Migracji

### Przykład 1: Człowiek (Kompletny)

**Źródło:** `PodrecznikGlowny.md` linie 740-861

```javascript
const HUMAN_ORIGIN = {
  id: 'czlowiek',
  nazwa: 'Człowiek',
  zrodlo: 'PG',
  
  // === OPIS (z lini 722-738) ===
  opis: 'Determinacja, zaradność i zwykła liczebność sprawiły, że mimo prymitywnych początków ludzkość rozwinęła się w największą i najbardziej rozprzestrzenioną populację na świecie.',
  
  opis_pelny: {
    roznorodnosc: 'Ludzie dzielą się na wiele odmiennych grup etnicznych. Spotyka się przedstawicieli o najróżniejszych kolorach skóry: od prawie czarnego po śnieżnobiały, a nawet zielony, niebieski, różowy czy inne. Niektórzy mają rozmaite wzory na skórze, cętki lub pręgi, charakteryzują się gęstym owłosieniem bądź zupełnym jego brakiem. Ich wzrost i waga również są zróżnicowane: od 1 do ponad 2 metrów i od 25 do ponad 250 kilogramów. Większość ludzi dożywa wieku około siedemdziesięciu lat.',
    kultura: 'W kupie siła: W ludzkiej cywilizacji ważną rolę odgrywa wspólnota. Jej członkowie są silniejsi, działając razem niż w pojedynkę. Wynikająca z tego plemienna kultura to jedno ze źródeł potęgi i czynnik ułatwiający ekspansję, ale z drugiej strony często prowadzi ona do konfliktów i przemocy między rywalizującymi grupami.',
    osobowosc: 'Wyrafinowani czy nieokrzesani, cnotliwi czy źli do szpiku kości, odważni czy tchórzliwi – większość ludzi plasuje się gdzieś pomiędzy tymi ekstremami, a ich zachowaniem kieruje dbanie o korzyści własne lub bliskich.',
    religia: 'Nieliczni ludzie poddają w wątpliwość istnienie bogów, a wielu odnajduje sens życia w ich wyznawaniu. Na Północnych Rubieżach osoby te mogą przynależeć do Kościoła Nowego Boga, kierować się doktryną Starej Wiary bądź praktykować wiedźmie gusła.'
  },
  
  przykladowe_imiona: [
    'Aengus', 'Agnes', 'Aine', 'Alice', 'Anselm', 'Beatrice',
    'Breandan', 'Caitlin', 'Cormac', 'Ella', 'Fiona', 'Geoffrey',
    'Giselle', 'Henry', 'Joan', 'John', 'Kane', 'Kiera',
    'Margery', 'Richard', 'Roisin', 'Rordan', 'Saraid',
    'Seamus', 'Walter', 'Yvonne'
  ],
  
  // === TWORZENIE POSTACI (linie 740-755) ===
  tworzenie_postaci: {
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
    percepcja: 'intelekt',
    obrona: 'zrecznosc',
    zdrowie: 'sila',
    szybkosc_zdrowienia: '1/4 Zdrowia (zaokr. w dół)',
    rozmiar: '1/2 lub 1',
    rozmiar_opcje: ['1/2', '1'],
    predkosc: 10,
    moc: 0,
    obrazenia: 0,
    szalenstwo: 0,
    splugawienie: 0,
    jezyki: ['wspólny'],
    jezyki_opcje: '1 dodatkowy język LUB losowa profesja',
    profesje: []
  },
  
  // Człowiek nie ma cech specjalnych na poziomie 0
  cechy_specjalne: {},
  
  // === POZIOM 4 (linie 756-762) ===
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
          efekt: 'Ponowny rzut, wybór wyniku',
          typ: 'pasywna'
        }
      }
    ]
  },
  
  // === TABELE (linie 766-861) ===
  tabele: {
    // ... (patrz pełny przykład w SPRINT2_ORIGINS_EXPANSION.md)
  },
  
  strona_zrodlowa: 11,
  linie_zrodlowe: '740-861',
  status: 'kompletne',
  data_aktualizacji: '2025-10-06'
};
```

### Przykład 2: Automaton (Specjalny przypadek - Mechanika Klucza)

**Źródło:** Linie 870-925

```javascript
const AUTOMATON_ORIGIN = {
  id: 'automaton',
  nazwa: 'Automaton',
  zrodlo: 'PG',
  
  // ... opis i przykladowe_imiona ...
  
  tworzenie_postaci: {
    // UWAGA: Automaton ma LOSOWE wartości atrybutów
    atrybuty_bazowe_losowe: {
      sila: '7+1k3',
      zrecznosc: '6+1k3',
      intelekt: '7+1k3',
      wola: '7+1k3'
    },
    // Alternatywnie: nielosowe
    atrybuty_bazowe_stale: {
      sila: 9,
      zrecznosc: 8,
      intelekt: 9,
      wola: 9
    },
    percepcja: 'intelekt',
    obrona: 13,  // STAŁA wartość!
    zdrowie: 'sila',
    szybkosc_zdrowienia: '1/4 Zdrowia (zaokr. w dół)',
    rozmiar: '1',
    predkosc: 8,
    moc: 0,
    obrazenia: 0,
    szalenstwo: 0,
    splugawienie: 0,
    jezyki: ['wspólny'],
    profesje: []
  },
  
  cechy_specjalne: {
    niewrazliwosc: {
      nazwa: 'Niewrażliwość',
      opis: 'Niewrażliwość na uśpienie i wyczerpanie, a także na choroby i trucizny, i pochodzące od nich obrażenia.',
      typ: 'pasywna',
      mechanika: {
        efekt: 'Immunitet: uśpienie, wyczerpanie, choroby, trucizny, obrażenia od chorób/trucizn'
      }
    },
    klucz: {
      nazwa: 'Klucz',
      opis: 'Gdzieś na twoim ciele, w miejscu, do którego sam nie zdołasz sięgnąć, znajduje się klucz. Gdy zostanie nakręcony i obraca się, na potrzeby mechaniki gry jesteś uznawany za stworzenie. Gdy się zatrzyma, liczysz się jako obiekt...',
      typ: 'mechanika_specjalna',
      mechanika: {
        trigger: [
          'Obezwładnienie',
          'Wynik 0 lub niższy w rzucie na atak/test'
        ],
        efekt: 'Zmiana z stworzenia na obiekt',
        forma_obiektu: {
          rozmiar: 'taki sam',
          percepcja: null,
          obrona: 5,
          zdrowie: 15,
          sila: 0,
          zrecznosc: 0,
          intelekt: null,
          wola: null,
          predkosc: 0,
          niewrazliwosc: 'ataki na Intelekt/Wole/Percepcję',
          zastoj: 'Ignoruje stany, ale rundy liczą się do czasu trwania',
          obiekt: 'Brak akcji, reakcji, ruchu, świadomości',
          zawodna_magia: {
            rzut: 'k6 na końcu każdej rundy',
            wynik_6: 'Magia odzyskuje moc, nie jesteś obezwładniony (ale nadal obiekt do nakręcenia)',
            wynik_2_5: 'Magia traci moc (3× ten wynik = dusza opuszcza ciało na zawsze)',
            wynik_1: 'EKSPLOZJA! 1k6 m promień, 2k6 obrażeń, test Zręczności na połowę, zniszczenie'
          }
        },
        nakrecenie: {
          akcja: 'Wykorzystaj akcję aby nakręcić automatona',
          efekt_bez_obezwladnienia: 'Na koniec rundy stajesz się stworzeniem',
          efekt_z_obezwladnieniem: 'Rzut k6: 3- nadal obezwładniony, 4+ lecz 1 PŻ i na koniec rundy stworzenie'
        },
        naprawa: {
          akcja: 'Zestaw narzędzi + akcja (łącznie 4 godziny pracy)',
          test: 'Intelekt z 1 utrudnieniem',
          sukces: 'Forma obiektu odzyskuje 1k6+1 Zdrowia'
        }
      }
    }
  },
  
  poziom_4: {
    zdrowie_bonus: 5,
    opcje: [
      {
        typ: 'zaklecie',
        ilosc: 1
      },
      {
        typ: 'talent',
        nazwa: 'Wysokie obroty',
        opis: 'W tej turze zyskujesz jedną dodatkową akcję. Na koniec tury rzuć k6. Jeśli wynik jest nieparzysty, na koniec rundy twój mechanizm zatrzymuje się i stajesz się obiektem.',
        mechanika: {
          efekt: '+1 akcja w turze',
          test: 'k6 na koniec tury',
          ryzyko: 'Wynik nieparzysty → mechanizm zatrzymuje się',
          typ: 'aktywna'
        }
      }
    ]
  },
  
  tabele: {
    wiek: {
      nazwa: 'Automaton: wiek',
      typ: '3k6',
      opcje: [
        { rzut: '3-8', wynik: 'Nowy, 5 lat lub mniej.' },
        { rzut: '9-12', wynik: 'Doświadczony, 6–10 lat.' },
        { rzut: '13-15', wynik: 'Stary, 11–50 lat.' },
        { rzut: '16-17', wynik: 'Bardzo stary, 51–150 lat.' },
        { rzut: '18', wynik: 'Wiekowy, powyżej 150 lat.' }
      ]
    },
    funkcja: {
      nazwa: 'Automaton: funkcja',
      typ: 'k20',
      opcje: [
        { 
          rzut: '1-4', 
          wynik: 'Zostałeś stworzony do walki. Zwiększ swoją Siłę lub Zręczność o 2.',
          efekt: { wybor: ['sila+2', 'zrecznosc+2'] }
        },
        { 
          rzut: '5-8', 
          wynik: 'Zostałeś stworzony do pracy. Zwiększ swoją Siłę o 2.',
          efekt: { sila: 2 }
        },
        // ... więcej opcji
      ]
    }
    // ... więcej tabel
  },
  
  strona_zrodlowa: 13,
  linie_zrodlowe: '870-949',
  status: 'kompletne'
};
```

---

## 🎯 Checklist Migracji Pojedynczego Pochodzenia

Dla każdego pochodzenia:

- [ ] **Identyfikacja sekcji** - znajdź linie w `PodrecznikGlowny.md`
- [ ] **Opis i fluff**
  - [ ] `opis` (krótki)
  - [ ] `opis_pelny` (podsekcje)
  - [ ] `przykladowe_imiona` (lista)
- [ ] **Tworzenie postaci**
  - [ ] `atrybuty_bazowe`
  - [ ] Opcje wyboru atrybutu (jeśli dotyczy)
  - [ ] Wzory: `percepcja`, `obrona`, `zdrowie`, `szybkosc_zdrowienia`
  - [ ] `rozmiar`, `predkosc`, `moc`
  - [ ] Stany początkowe: `obrazenia`, `szalenstwo`, `splugawienie`
  - [ ] `jezyki`, `profesje`
- [ ] **Cechy specjalne**
  - [ ] Każda cecha jako osobny klucz
  - [ ] Pola: `nazwa`, `opis`, `typ`, `mechanika`
- [ ] **Poziom 4**
  - [ ] `zdrowie_bonus`
  - [ ] Opcje: zaklęcie + talent
  - [ ] Pełny opis talentu z mechaniką
- [ ] **Tabele** (zazwyczaj 5-8 tabel)
  - [ ] Wiek
  - [ ] Budowa ciała
  - [ ] Wygląd
  - [ ] Przeszłość
  - [ ] Osobowość
  - [ ] Inne (specyficzne dla pochodzenia)
- [ ] **Metadane**
  - [ ] `strona_zrodlowa`
  - [ ] `linie_zrodlowe`
  - [ ] `status`
  - [ ] `data_aktualizacji`
- [ ] **Walidacja**
  - [ ] Brak błędów składni JS
  - [ ] Wszystkie zakresy w tabelach pokryte
  - [ ] Porównanie z podręcznikiem (peer review)

---

## 📞 Wsparcie

- **Pytania o strukturę:** Zobacz `ARCHITECTURE.md` (Sprint 2)
- **Przykłady:** Ten dokument + `SPRINT2_ORIGINS_EXPANSION.md`
- **Walidacja:** Skorzystaj z testów jednostkowych w `tests/`

---

**Ostatnia aktualizacja:** 6 października 2025

