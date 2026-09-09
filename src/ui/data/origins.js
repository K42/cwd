/**
 * Pochodzenia postaci - wszystkie dostępne w podręcznikach
 * Źródło: Podręcznik główny + suplementy
 */

const ORIGINS = {
  // Podręcznik Główny
  czlowiek: {
    id: 'czlowiek',
    nazwa: 'Człowiek',
    zrodlo: 'PG', // Podręcznik Główny
    opis: 'Wszechstronni i ambitni, ludzie dominują w większości cywilizowanych krain.',
    atrybuty_bazowe: {
      sila: 10,
      zrecznosc: 10,
      intelekt: 10,
      wola: 10
    },
    wybor_atrybutu: '+1 do wybranego atrybutu',
    rozmiar: '1/2 lub 1', // Poprawione zgodnie z PG str. 750
    predkosc: 10,
    jezyki: ['wspólny'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      determinacja: 'Gdy wykonujesz test atrybutu, możesz wydać punkt Determinacji aby rzucić dodatkową k20 i wybrać lepszy wynik.'
    },
    // Korzyści na poziomie 4 (ekspert)
    poziom_4: {
      zdrowie: '+5',
      opcje: ['1 zaklęcie', 'talent Determinacja']
    },
    strona_zrodlowa: 11,
    status: 'kompletne'
  },

  automaton: {
    id: 'automaton',
    nazwa: 'Automaton',
    zrodlo: 'PG', // Podręcznik Główny
    opis: 'Mechaniczne istoty stworzone przez dawnych magów, poszukujące własnej tożsamości.',
    atrybuty_bazowe: {
      sila: 9, // POPRAWIONE z PG str. 874 (nielosowe wartości)
      zrecznosc: 8, // POPRAWIONE z PG str. 874
      intelekt: 9, // POPRAWIONE z PG str. 874
      wola: 9 // POPRAWIONE z PG str. 874
    },
    rozmiar: '1', // PG str. 884
    predkosc: 8, // POPRAWIONE z PG str. 884
    jezyki: ['wspólny'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      niewrazliwosc: 'Niewrażliwość na uśpienie i wyczerpanie, a także na choroby i trucizny, i pochodzące od nich obrażenia.',
      klucz: 'Gdzieś na twoim ciele, w miejscu, do którego sam nie zdołasz sięgnąć, znajduje się klucz. Gdy zostanie nakręcony i obraca się, na potrzeby mechaniki gry jesteś uznawany za stworzenie. Gdy się zatrzyma, liczysz się jako obiekt.',
      forma_obiektu: 'Gdy jesteś obiektem, masz Obronę 5, Zdrowie 15, Prędkość 0 i nie możesz podejmować akcji.'
    },
    poziom_4: {
      zdrowie: '+5',
      opcje: ['1 zaklęcie', 'talent Wysokie obroty']
    },
    strona_zrodlowa: 13,
    status: 'kompletne'
  },

  goblin: {
    id: 'goblin',
    nazwa: 'Goblin',
    zrodlo: 'PG', // Podręcznik Główny
    opis: 'Małe, zwinne istoty o wielkiej przebiegłości i zamiłowaniu do mechaniki.',
    atrybuty_bazowe: {
      sila: 8, // PG str. 1039
      zrecznosc: 12, // PG str. 1039
      intelekt: 10, // POPRAWIONE z PG str. 1039
      wola: 9 // PG str. 1039
    },
    rozmiar: '1/2', // PG str. 1047
    predkosc: 10, // PG str. 1047
    jezyki: ['wspólny', 'elficki'], // POPRAWIONE z PG str. 1051
    profesje: ['dowolna'],
    cechy_specjalne: {
      niewrazliwosc: 'Niewrażliwość na zauroczenie, a także na choroby i pochodzące od nich obrażenia.',
      wrażliwosc_na_zelazo: 'Jesteś osłabiony, gdy dotykasz żelaza.',
      widzenie_w_cieniu: 'Widzisz w zacienionych obszarach tak samo dobrze jak w oświetlonych.',
      przebiegłość: 'Testy Zręczności na ukrywanie się lub ciche poruszanie wykonujesz z 1 ułatwieniem.'
    },
    poziom_4: {
      zdrowie: '+4',
      opcje: ['1 zaklęcie', 'talent Odskok']
    },
    strona_zrodlowa: 15,
    status: 'kompletne'
  },

  krasnolud: {
    id: 'krasnolud',
    nazwa: 'Krasnolud',
    zrodlo: 'PG', // Podręcznik Główny
    opis: 'Niskie, krępe istoty znane z wytrzymałości i umiejętności rzemieślniczych.',
    atrybuty_bazowe: {
      sila: 10, // PG str. 1200
      zrecznosc: 9, // PG str. 1200
      intelekt: 10, // PG str. 1200
      wola: 10 // PG str. 1200
    },
    rozmiar: '1/2', // PG str. 1210
    predkosc: 8, // PG str. 1210
    jezyki: ['wspólny', 'krasnoludzki'], // PG str. 1214
    profesje: ['dowolna'],
    cechy_specjalne: {
      widzenie_w_ciemności: 'W obszarach spowitych cieniem lub mrokiem widzisz na średni zasięg tak samo dobrze jak w oświetlonych. Poza średnim zasięgiem widzisz w cieniu jak w świetle, a w mroku jak w cieniu.',
      znienawidzony_wrog: 'Wybierz rodzaj stworzenia z tabeli Znienawidzone stworzenia. Wszystkie rzuty na atak przeciwko stworzeniom tego typu wykonujesz z 1 ułatwieniem.',
      naturalna_odpornosc: 'Otrzymujesz tylko połowę obrażeń od trucizny. Testy na uniknięcie lub pozbycie się zatrucia wykonujesz z 1 ułatwieniem.'
    },
    poziom_4: {
      zdrowie: '+6',
      opcje: ['1 zaklęcie', 'talent Nie do zdarcia']
    },
    strona_zrodlowa: 18,
    status: 'kompletne'
  },

  odmieniec: {
    id: 'odmieniec',
    nazwa: 'Odmieniec',
    zrodlo: 'PG', // Podręcznik Główny
    opis: 'Istoty zmienione przez magię, poszukujące swojego miejsca w świecie.',
    atrybuty_bazowe: {
      sila: 9, // PG str. 1341
      zrecznosc: 10, // PG str. 1341
      intelekt: 10, // PG str. 1341
      wola: 10 // PG str. 1341
    },
    rozmiar: '1', // PG str. 1349
    predkosc: 10, // PG str. 1349
    jezyki: ['wspólny'], // PG str. 1353
    profesje: ['dowolna'],
    cechy_specjalne: {
      niewrazliwosc: 'Niewrażliwość na zauroczenie, a także na choroby i pochodzące od nich obrażenia.',
      wrażliwosc_na_zelazo: 'Jesteś osłabiony, gdy dotykasz żelaza.',
      widzenie_w_cieniu: 'Widzisz w zacienionych obszarach tak samo dobrze jak w oświetlonych.',
      kradziez_tozsamosci: 'Możesz wykorzystać akcję, by upodobnić się do innej żywej istoty, którą widzisz w bliskim zasięgu. Cel musi mieć Rozmiar 1 lub 1/2 i być humanoidem składającym się z ciała i krwi.'
    },
    poziom_4: {
      zdrowie: '+4',
      opcje: ['1 zaklęcie', 'talent Prymat sobowtóra']
    },
    strona_zrodlowa: 20,
    status: 'kompletne'
  },

  ork: {
    id: 'ork',
    nazwa: 'Ork',
    zrodlo: 'PG', // POPRAWIONE - Ork jest w PG
    opis: 'Silne, wojownicze istoty o dzikiej naturze i instynktach drapieżnika.',
    atrybuty_bazowe: {
      sila: 11, // POPRAWIONE z PG str. 1484
      zrecznosc: 10, // POPRAWIONE z PG str. 1484
      intelekt: 9, // POPRAWIONE z PG str. 1484
      wola: 9 // POPRAWIONE z PG str. 1484
    },
    rozmiar: '1', // PG str. 1492
    predkosc: 12, // POPRAWIONE z PG str. 1492
    jezyki: ['wspólny', 'mroczna_mowa'], // POPRAWIONE z PG str. 1496
    profesje: ['dowolna'],
    cechy_specjalne: {
      widzenie_w_cieniu: 'Widzisz w zacienionych obszarach tak samo dobrze jak w oświetlonych.',
      splugawienie: 'Zaczynasz grę z 1 punktem Splugawienia.'
    },
    poziom_4: {
      zdrowie: '+6',
      opcje: ['1 zaklęcie', 'talent Furia']
    },
    strona_zrodlowa: 22,
    status: 'kompletne'
  },

  // Straszliwe Piękno - Nowe pochodzenia faerie
  chochlik: {
    id: 'chochlik',
    nazwa: 'Chochlik',
    zrodlo: 'SP', // Straszliwe Piękno
    opis: 'Maleńkie istoty faerie, które uwielbiają płatać figle i psocić.',
    atrybuty_bazowe: {
      sila: 5,
      zrecznosc: 12,
      intelekt: 10,
      wola: 8
    },
    rozmiar: '1/8',
    predkosc: 10,
    jezyki: ['elficki'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      niewrazliwosc: 'Niewrażliwość na zauroczenie, a także na choroby i pochodzące od nich obrażenia.',
      trzepot: 'Możesz poruszać się lotem, ale jeśli wzniesiesz się na więcej niż 5 metrów nad ziemię, spadasz.',
      naturalna_niewidzialnosc: 'Jesteś niewidzialny dla większości stworzeń poza innymi chochlikami. Zwierzęta, demony, faerie, potwory, dzieci, istoty o wartości Intelektu 7 lub niższej oraz te z 5 lub więcej punktami Szaleństwa mogą wyraźnie cię widzieć.',
      rozblysk: 'Podczas swojej tury możesz wykorzystać akcję, aby stać się widoczny i rozświetlić obszar w promieniu 2 metrów od siebie.',
      wrażliwosc_na_zelazo: 'Jesteś osłabiony, gdy dotykasz żelaza.',
      widzenie_w_cieniu: 'Widzisz w zacienionych obszarach tak samo dobrze, jak w oświetlonych.',
      tyci: 'Twoje ataki bronią zadają połowę obrażeń. Za każdym razem, kiedy opis ścieżki nakazuje ci podnieść swoje Zdrowie, zwiększasz je jedynie o połowę podanej wartości.'
    },
    poziom_4: {
      zdrowie: '+2',
      opcje: ['1 zaklęcie', 'talent Kontrolowany szał']
    },
    strona_zrodlowa: 7,
    status: 'kompletne'
  },

  elf: {
    id: 'elf',
    nazwa: 'Elf',
    zrodlo: 'SP', // Straszliwe Piękno
    opis: 'Wysokie faerie, panowie i damy z ukrytych królestw.',
    atrybuty_bazowe: {
      sila: 9,
      zrecznosc: 10,
      intelekt: 10,
      wola: 9
    },
    wybor_atrybutu: '+1 do dwóch wybranych atrybutów',
    rozmiar: '1',
    predkosc: 12,
    jezyki: ['wspólny', 'wysoki_archaik', 'elficki'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      niewrazliwosc: 'Niewrażliwość na zauroczenie, a także na choroby i pochodzące od nich obrażenia.',
      widzenie_w_cieniu: 'Widzisz w zacienionych obszarach tak samo dobrze, jak w oświetlonych.',
      ochrona_przed_magia: 'Elfy otrzymują tylko połowę obrażeń zadawanych przez zaklęcia, a wszystkie testy w celu odparcia ich efektów wykonują z 1 ułatwieniem.',
      charyzmatyczna_aura: 'Twoja magiczna natura pozwala ci wpływać na to, jak inni cię postrzegają i zachowują się w twojej obecności.',
      wrażliwosc_na_zelazo: 'Jesteś osłabiony, kiedy dotykasz żelaza. Dodatkowo tracisz Ochronę przed magią, dopóki pozostajesz z nim w kontakcie i na 1 minutę po jego przerwaniu.'
    },
    poziom_4: {
      zdrowie: '+3',
      opcje: ['1 zaklęcie', 'talent Kontrolowany szał']
    },
    strona_zrodlowa: 9,
    status: 'kompletne'
  },

  hobgoblin: {
    id: 'hobgoblin',
    nazwa: 'Hobgoblin',
    zrodlo: 'SP', // Straszliwe Piękno
    opis: 'Szeregowi żołnierze w armiach magicznych krain faerie.',
    atrybuty_bazowe: {
      sila: 11,
      zrecznosc: 10,
      intelekt: 9,
      wola: 11
    },
    rozmiar: '1',
    predkosc: 10,
    jezyki: ['elficki'],
    profesje: ['wojenna'],
    cechy_specjalne: {
      niewrazliwosc: 'Niewrażliwość na zauroczenie, a także na choroby i pochodzące od nich obrażenia.',
      wrażliwosc_na_zelazo: 'Jesteś osłabiony, gdy dotykasz żelaza.',
      widzenie_w_cieniu: 'Widzisz w zacienionych obszarach tak samo dobrze, jak w oświetlonych.',
      szal: 'W trakcie walki rzuć k6 pod koniec każdej rundy, o ile nie jesteś ani obezwładniony, ani pod wpływem tego talentu. Przy wyniku 6 wpadasz w szał, który trwa przez 1 minutę.'
    },
    poziom_4: {
      zdrowie: '+5',
      opcje: ['1 zaklęcie', 'talent Kontrolowany szał']
    },
    strona_zrodlowa: 14,
    status: 'kompletne'
  },

  // Suplement Władcy Demonów
  faun: {
    id: 'faun',
    nazwa: 'Faun',
    zrodlo: 'SUP', // Suplement Władcy Demonów (błędnie oznaczone jako SP - poprawione)
    opis: 'Istoty o kozim wyglądzie, znane z zamiłowania do muzyki i natury.',
    atrybuty_bazowe: {
      sila: 9,
      zrecznosc: 11,
      intelekt: 10,
      wola: 9
    },
    rozmiar: '1',
    predkosc: 12,
    jezyki: ['wspólny', 'zwierzęcy'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      skakanie: 'Możesz skakać dalej i wyżej niż normalnie.',
      magia_natury: 'Dostęp do podstawowych zaklęć natury.'
    },
    strona_zrodlowa: 5,
    status: 'niezweryfikowane' // brak tabel losowania; wymaga weryfikacji cech mechanicznych ze źródła
  },

  niziol: {
    id: 'niziol',
    nazwa: 'Niziołek',
    zrodlo: 'SUP', // Suplement Władcy Demonów (błędnie oznaczone jako SP - poprawione)
    opis: 'Małe, spokojne istoty ceniące sobie komfort i dobre jedzenie.',
    atrybuty_bazowe: {
      sila: 8,
      zrecznosc: 11,
      intelekt: 10,
      wola: 10
    },
    rozmiar: '1',
    predkosc: 12,
    jezyki: ['wspólny'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      szczescie: 'Raz dziennie możesz ponownie rzucić nieudany test.',
      zwinność: 'Możesz poruszać się przez przestrzeń przeciwnika.'
    },
    strona_zrodlowa: 8,
    status: 'niezweryfikowane' // brak tabel losowania; wymaga weryfikacji cech mechanicznych ze źródła
  },


  // Głód w Pustce
  fomor: {
    id: 'fomor',
    nazwa: 'Fomor',
    zrodlo: 'GWP', // Głód w Pustce, "Tworzenie fomora" (str. 45-46 wg stopki PDF)
    opis: 'Zwierzoludzie o cechach kozła, tchórzliwi w osamotnieniu, groźni w stadzie.',
    // Realne atrybuty bazowe to losowy rzut (Siła 1k3+8, Zręczność 1k3+10,
    // Intelekt 1k3+6, Wola 1k3+5) - patrz atrybuty_bazowe_losowe. Wartości
    // poniżej to średnia z rzutu (1k3 śr. 2), używana tylko do podglądu
    // kafelka pochodzenia przed właściwym tworzeniem postaci.
    atrybuty_bazowe: {
      sila: 10,
      zrecznosc: 12,
      intelekt: 8,
      wola: 7
    },
    atrybuty_bazowe_losowe: {
      sila: { kostka: 'k3', modyfikator: 8 },
      zrecznosc: { kostka: 'k3', modyfikator: 10 },
      intelekt: { kostka: 'k3', modyfikator: 6 },
      wola: { kostka: 'k3', modyfikator: 5 }
    },
    rozmiar: '1',
    predkosc: 10,
    jezyki: ['mroczna_mowa'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      percepcja_wyzsza: 'Percepcja równa jest wartości Intelektu + 2 (aplikacja liczy ją jak dla większości pochodzeń, jako Intelekt bez modyfikatora).',
      poczatkowe_stany: 'Zaczynasz grę z 1k3 punktami Szaleństwa i 1k3 punktami Splugawienia.',
      tchorzliwy: 'Jesteś przestraszony, jeśli znajdujesz się w bezpośrednim zasięgu co najmniej dwóch wrogich wobec ciebie stworzeń.',
      walka_w_stadzie: 'Gdy atakujesz cel znajdujący się w bezpośrednim zasięgu innego przyjaznego sobie stworzenia z talentem Walka w stadzie, rzut na atak wykonujesz z 1 ułatwieniem. W przeciwnym wypadku wykonujesz go z 1 utrudnieniem.'
    },
    poziom_4: {
      zdrowie: '+5',
      opcje: ['1 zaklęcie', 'talent Potęga zagnana w kozi róg']
    },
    strona_zrodlowa: 46,
    status: 'kompletne' // brak oficjalnych tabel losowania (wiek/wygląd/przeszłość/osobowość) - Głód w Pustce ich dla tego pochodzenia nie definiuje
  },

  niedzwiedziadlo: {
    id: 'niedzwiedziadlo',
    nazwa: 'Niedźwiedzidło', // poprawiona pisownia zgodna ze źródłem (było: "Niedźwiedziadło")
    zrodlo: 'GWP', // Głód w Pustce, "Niedźwiedzidło, poziom 4" (str. 48-49 wg stopki PDF)
    opis: 'Ogromni, brutalni zwierzoludzie o niedźwiedziej naturze, zwani też straszydłami.',
    // Realne atrybuty bazowe to losowy rzut (Siła 1k3+12, Zręczność 1k3+11,
    // Intelekt 1k3+8, Wola 1k3+8) - patrz atrybuty_bazowe_losowe. Wartości
    // poniżej to średnia z rzutu (1k3 śr. 2), używana tylko do podglądu
    // kafelka pochodzenia przed właściwym tworzeniem postaci.
    atrybuty_bazowe: {
      sila: 14,
      zrecznosc: 13,
      intelekt: 10,
      wola: 10
    },
    atrybuty_bazowe_losowe: {
      sila: { kostka: 'k3', modyfikator: 12 },
      zrecznosc: { kostka: 'k3', modyfikator: 11 },
      intelekt: { kostka: 'k3', modyfikator: 8 },
      wola: { kostka: 'k3', modyfikator: 8 }
    },
    rozmiar: '1',
    predkosc: 10,
    jezyki: ['mroczna_mowa'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      percepcja_wyzsza: 'Percepcja równa jest wartości Intelektu + 2 (aplikacja liczy ją jak dla większości pochodzeń, jako Intelekt bez modyfikatora).',
      zdrowie_wyzsze: 'Zdrowie równe jest wartości Siły + 10 (aplikacja liczy je jak dla większości pochodzeń, jako sama Siła).',
      poczatkowe_stany: 'Zaczynasz grę z 1k3 punktami Szaleństwa i 1k3 punktami Splugawienia.',
      szybki_chwyt: 'Kiedy całkowity wynik rzutu na atak z użyciem broni wyniesie 20 lub więcej i przebije poziom trudności o co najmniej 5, możesz spróbować pochwycić cel bez poświęcania akcji, jeśli masz wolną rękę.',
      przebieglosc: 'Testy Zręczności na ukrywanie się lub skradanie wykonujesz z 1 ułatwieniem.'
    },
    poziom_4: {
      zdrowie: '+7',
      opcje: ['1 zaklęcie', 'talent Niedźwiedzi uścisk']
    },
    strona_zrodlowa: 48,
    status: 'kompletne' // brak oficjalnych tabel losowania (wiek/wygląd/przeszłość/osobowość) - Głód w Pustce ich dla tego pochodzenia nie definiuje
  },

  warg: {
    id: 'warg',
    nazwa: 'Warg',
    zrodlo: 'GWP', // Głód w Pustce, "Tworzenie warga" (str. 49 wg stopki PDF)
    opis: 'Zaciekli zwierzoludzie o wilczej naturze, siła napędowa hord zwierzoludzi.',
    // Realne atrybuty bazowe to losowy rzut (Siła 1k3+11, Zręczność 1k3+10,
    // Intelekt 1k3+7, Wola 1k3+8) - patrz atrybuty_bazowe_losowe. Wartości
    // poniżej to średnia z rzutu (1k3 śr. 2), używana tylko do podglądu
    // kafelka pochodzenia przed właściwym tworzeniem postaci.
    atrybuty_bazowe: {
      sila: 13,
      zrecznosc: 12,
      intelekt: 9,
      wola: 10
    },
    atrybuty_bazowe_losowe: {
      sila: { kostka: 'k3', modyfikator: 11 },
      zrecznosc: { kostka: 'k3', modyfikator: 10 },
      intelekt: { kostka: 'k3', modyfikator: 7 },
      wola: { kostka: 'k3', modyfikator: 8 }
    },
    rozmiar: '1',
    predkosc: 12,
    jezyki: [],
    profesje: ['dowolna'],
    cechy_specjalne: {
      percepcja_wyzsza: 'Percepcja równa jest wartości Intelektu + 2 (aplikacja liczy ją jak dla większości pochodzeń, jako Intelekt bez modyfikatora).',
      zdrowie_wyzsze: 'Zdrowie równe jest wartości Siły + 2 (aplikacja liczy je jak dla większości pochodzeń, jako sama Siła).',
      rozumie_ale_nie_mowi: 'Rozumiesz mroczną mowę, ale nie potrafisz w niej mówić.',
      poczatkowe_stany: 'Zaczynasz grę z 1k3 punktami Szaleństwa i 1k3 punktami Splugawienia.',
      zajadlosc: 'Gdy otrzymasz obrażenia od stworzenia w swoim bezpośrednim zasięgu, możesz wykorzystać reakcję, by je ugryźć. Wykonujesz oparty na Sile rzut na atak z 1 ułatwieniem przeciwko Obronie celu i zadajesz 1k6 obrażeń w razie trafienia.'
    },
    poziom_4: {
      zdrowie: '+6',
      opcje: ['1 zaklęcie', 'talent Okrutna zajadłość']
    },
    strona_zrodlowa: 49,
    status: 'kompletne' // brak oficjalnych tabel losowania (wiek/wygląd/przeszłość/osobowość) - Głód w Pustce ich dla tego pochodzenia nie definiuje
  },

  inkarnacja: {
    id: 'inkarnacja',
    nazwa: 'Inkarnacja',
    zrodlo: 'GWP', // Głód w Pustce (błędnie oznaczone jako SP - poprawione)
    opis: 'Istoty z innych wymiarów, przybyłe na ten świat.',
    atrybuty_bazowe: {
      sila: 10,
      zrecznosc: 9,
      intelekt: 12,
      wola: 8
    },
    rozmiar: '1',
    predkosc: 10,
    jezyki: ['wspólny', 'wymiarowy'],
    profesje: ['mag', 'szaman'],
    cechy_specjalne: {
      odpornosc_na_magie: 'Częściowa odporność na efekty magiczne.',
      nietypowy_wyglad: 'Twój wygląd wskazuje na inneplanarne pochodzenie.'
    },
    strona_zrodlowa: 75,
    status: 'niezweryfikowane' // brak tabel losowania; sekcja "Wcielona forma" w źródle to osobna mechanika wymagająca weryfikacji
  },

  // Rozkoszna Agonia
  kambion: {
    id: 'kambion',
    nazwa: 'Kambion',
    zrodlo: 'RA', // Rozkoszna Agonia, "Tworzenie postaci: kambion" (str. 55 wg stopki PDF)
    opis: 'Potomkowie diabłów i śmiertelników, naznaczeni piekielnym dziedzictwem.',
    atrybuty_bazowe: {
      sila: 10,
      zrecznosc: 10,
      intelekt: 11,
      wola: 9
    },
    rozmiar: '1/2 lub 1',
    predkosc: 10,
    jezyki: ['wspólny'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      niewrazliwosc: 'Niewrażliwość na obrażenia od choroby i trucizny, a także na chorobę i zatrucie.',
      widzenie_w_ciemnosci: 'W obszarach spowitych cieniem lub mrokiem widzisz na średni zasięg tak samo dobrze jak w oświetlonych. Poza średnim zasięgiem widzisz w cieniu jak w świetle, a w mroku jak w cieniu.',
      dziecie_piekla: 'Zyskujesz Odporność na ogień.',
      pietno_ciemnosci: 'Zaczynasz grę z jednym piętnem ciemności.',
      radosc_z_ciemnosci: 'Przez 1 minutę po tym, jak zyskasz Splugawienie, rzuty na atak i testy wykonujesz z 1 ułatwieniem.',
      wrazliwosc_na_zelazo: 'Jesteś osłabiony, gdy dotykasz żelaza.',
      splugawienie_poczatkowe: 'Zaczynasz grę z 2 punktami Splugawienia.'
    },
    poziom_4: {
      zdrowie: '+5',
      opcje: ['1 zaklęcie', 'talent Obdarzenie splugawieniem']
    },
    strona_zrodlowa: 55,
    status: 'kompletne'
  },

  // Dodatkowe pochodzenie z innych źródeł
  jotunn: {
    id: 'jotunn',
    nazwa: 'Jotun', // poprawiona pisownia zgodna ze źródłem (było: "Jötunn")
    zrodlo: 'CS', // Chwalebna Śmierć, sekcja "Serce zimy", "Tworzenie postaci: jotun" (str. 6-9 wg stopki PDF)
    opis: 'Potężni giganci z Mroźnego Bezdroża, dla których tchórzostwo jest największą hańbą.',
    atrybuty_bazowe: {
      sila: 13,
      zrecznosc: 9,
      intelekt: 8,
      wola: 10
    },
    rozmiar: '2',
    predkosc: 10,
    jezyki: ['wspólny', 'trolli'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      przywykly_do_zimna: 'Otrzymujesz połowę obrażeń od zimna i nigdy nie cierpisz z powodu wystawienia na działanie żywiołów w chłodnym środowisku.',
      potezne_pochodzenie: 'Kiedy twoja drużyna osiąga 1 poziom, nie wybierasz ścieżki nowicjusza. Zamiast tego za każdym razem, kiedy tabela w podręczniku głównym mówi, że zyskałbyś korzyści ze ścieżki nowicjusza, otrzymujesz korzyści ze swojego pochodzenia dla danego poziomu.',
      losowa_profesja: 'Zaczynasz grę z jedną profesją wylosowaną z tabeli Jotun: profesje.'
    },
    poziom_4: {
      zdrowie: '+6',
      opcje: ['1 zaklęcie', 'talent Krew olbrzymów']
    },
    strona_zrodlowa: 7,
    status: 'kompletne'
  }
};

export default ORIGINS;
