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
    strona_zrodlowa: 11
  },

  automaton: {
    id: 'automaton',
    nazwa: 'Automaton',
    zrodlo: 'PG', // Podręcznik Główny
    opis: 'Mechaniczne istoty stworzone przez dawnych magów, poszukujące własnej tożsamości.',
    atrybuty_bazowe: {
      sila: 11,
      zrecznosc: 8,
      intelekt: 10,
      wola: 11
    },
    rozmiar: '1', // Uproszczone (PG: zmienny 1/2, 1, lub 2 wg formy)
    predkosc: 10,
    jezyki: ['wspólny', 'mechaniczny'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      konstrukt: 'Nie oddychasz, nie śpisz, nie jesz. Odporny na choroby i trucizny.',
      mechaniczna_precyzja: 'Rzuty na atak i obrażenia są zawsze traktowane jako minimum 10.',
      naprawa: 'Możesz naprawić się w trakcie krótkiego odpoczynku.'
    },
    poziom_4: {
      zdrowie: '+5',
      opcje: ['1 zaklęcie', 'talent Wysokie obroty']
    },
    strona_zrodlowa: 13
  },

  goblin: {
    id: 'goblin',
    nazwa: 'Goblin',
    zrodlo: 'PG', // Podręcznik Główny
    opis: 'Małe, zwinne istoty o wielkiej przebiegłości i zamiłowaniu do mechaniki.',
    atrybuty_bazowe: {
      sila: 8,
      zrecznosc: 12,
      intelekt: 11,
      wola: 9
    },
    rozmiar: '1/2', // POPRAWIONE z '1' zgodnie z PG str. 1047
    predkosc: 10, // POPRAWIONE z 12 zgodnie z PG str. 1047
    jezyki: ['wspólny', 'gobliński'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      przebiegłość: 'Gdy wykonujesz test Zręczności lub Intelektu, możesz rzucić dodatkową k6.',
      mechaniczny_geniusz: 'Możesz naprawiać i modyfikować mechaniczne urządzenia.'
    },
    poziom_4: {
      zdrowie: '+4',
      opcje: ['1 zaklęcie', 'talent Odskok']
    },
    strona_zrodlowa: 15
  },

  krasnolud: {
    id: 'krasnolud',
    nazwa: 'Krasnolud',
    zrodlo: 'PG', // Podręcznik Główny
    opis: 'Niskie, krępe istoty znane z wytrzymałości i umiejętności rzemieślniczych.',
    atrybuty_bazowe: {
      sila: 10, // POPRAWIONE z 11 zgodnie z PG str. 1200
      zrecznosc: 9,
      intelekt: 10,
      wola: 10
    },
    rozmiar: '1/2', // POPRAWIONE z '1' zgodnie z PG str. 1210
    predkosc: 8, // POPRAWIONE z 10 zgodnie z PG str. 1210
    jezyki: ['wspólny', 'krasnoludzki'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      widzenie_w_ciemności: 'Widzisz w ciemności do 20 metrów.',
      rzemiosło: 'Możesz tworzyć i naprawiać broń, zbroję i narzędzia.'
    },
    strona_zrodlowa: 18
  },

  odmieniec: {
    id: 'odmieniec',
    nazwa: 'Odmieniec',
    zrodlo: 'PG', // Podręcznik Główny
    opis: 'Istoty zmienione przez magię, poszukujące swojego miejsca w świecie.',
    atrybuty_bazowe: {
      sila: 9, // POPRAWIONE z 10 zgodnie z PG str. 1341
      zrecznosc: 10, // POPRAWIONE z 9 zgodnie z PG str. 1341
      intelekt: 10, // POPRAWIONE z 11 zgodnie z PG str. 1341
      wola: 10, // POPRAWIONE z 9 zgodnie z PG str. 1341
    },
    rozmiar: '1', // Poprawne zgodnie z PG str. 1349
    predkosc: 10,
    jezyki: ['wspólny'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      odpornosc_na_magie: 'Częściowa odporność na efekty magiczne.',
      nietypowy_wyglad: 'Twój wygląd wskazuje na zmiany wywołane magią.'
    },
    strona_zrodlowa: 20
  },

  ork: {
    id: 'ork',
    nazwa: 'Ork',
    zrodlo: null, // Nie zweryfikowane w PG
    opis: 'Silne, wojownicze istoty o dzikiej naturze i instynktach drapieżnika.',
    atrybuty_bazowe: {
      sila: 12,
      zrecznosc: 9,
      intelekt: 8,
      wola: 11
    },
    rozmiar: '1',
    predkosc: 10,
    jezyki: ['wspólny', 'orki'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      naturalna_zbroja: 'Obrona +1 dzięki grubej skórze.',
      zmysły_drapieznika: 'Widzenie w ciemności i wyczulony węch.'
    },
    strona_zrodlowa: 22
  },

  // Suplement Władcy Demonów
  faun: {
    id: 'faun',
    nazwa: 'Faun',
    zrodlo: null, // Nie zweryfikowane w PG
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
    strona_zrodlowa: 5
  },

  niziol: {
    id: 'niziol',
    nazwa: 'Niziołek',
    zrodlo: null, // Nie zweryfikowane w PG
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
    strona_zrodlowa: 9
  },

  // Straszliwe Piękno
  chochlik: {
    id: 'chochlik',
    nazwa: 'Chochlik',
    zrodlo: null, // Nie zweryfikowane w PG
    opis: 'Maleńkie istoty magiczne, znane z psot i niezwykłych mocy.',
    atrybuty_bazowe: {
      sila: 6,
      zrecznosc: 12,
      intelekt: 12,
      wola: 10
    },
    rozmiar: '0.5',
    predkosc: 8,
    jezyki: ['wspólny', 'chochlikowy'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      malutka_postura: 'Rozmiar 1/4. Możesz ukryć się w kieszeni.',
      magia_chaosu: 'Dostęp do chaotycznych zaklęć.',
      lot: 'Możesz lecieć na wysokość do 3 metrów.'
    },
    strona_zrodlowa: 7
  },

  elf: {
    id: 'elf',
    nazwa: 'Elf',
    zrodlo: null, // Nie zweryfikowane w PG
    opis: 'Długowieczne istoty o niezwykłej urodzie i zdolnościach magicznych.',
    atrybuty_bazowe: {
      sila: 9,
      zrecznosc: 12,
      intelekt: 11,
      wola: 8
    },
    rozmiar: '1',
    predkosc: 12,
    jezyki: ['wspólny', 'elficki'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      magia_elficka: 'Dostęp do elfickich zaklęć.',
      widzenie_w_ciemności: 'Widzisz w ciemności do 20 metrów.',
      długowieczność: 'Żyjesz znacznie dłużej niż ludzie.'
    },
    strona_zrodlowa: 9
  },

  hobgoblin: {
    id: 'hobgoblin',
    nazwa: 'Hobgoblin',
    zrodlo: null, // Nie zweryfikowane w PG
    opis: 'Większe od goblinów, znane z dyscypliny i umiejętności wojskowych.',
    atrybuty_bazowe: {
      sila: 11,
      zrecznosc: 10,
      intelekt: 10,
      wola: 10
    },
    rozmiar: '1',
    predkosc: 10,
    jezyki: ['wspólny', 'gobliński'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      odpornosc_na_strach: 'Odporność na efekty strachu.',
      taktyka: 'Bonus do ataków w grupie.'
    },
    strona_zrodlowa: 11
  },

  // Głód w Pustce
  fomor: {
    id: 'fomor',
    nazwa: 'Fomor',
    zrodlo: null, // Nie zweryfikowane w PG
    opis: 'Potworne istoty z głębin, zmienione przez ciemne moce.',
    atrybuty_bazowe: {
      sila: 12,
      zrecznosc: 8,
      intelekt: 9,
      wola: 11
    },
    rozmiar: '1',
    predkosc: 10,
    jezyki: ['wspólny', 'głębinowy'],
    profesje: ['wojownik', 'szaman', 'mag'],
    cechy_specjalne: {
      potworny_wyglad: 'Twój wygląd wywołuje strach u wrogów.',
      odpornosc_na_wode: 'Możesz oddychać pod wodą.',
      mroczne_moce: 'Dostęp do mrocznych zaklęć.'
    },
    strona_zrodlowa: 47
  },

  niedzwiedziadlo: {
    id: 'niedzwiedziadlo',
    nazwa: 'Niedźwiedziadło',
    zrodlo: null, // Nie zweryfikowane w PG
    opis: 'Istoty o niedźwiedzim wyglądzie, znane z siły i dzikości.',
    atrybuty_bazowe: {
      sila: 13,
      zrecznosc: 8,
      intelekt: 8,
      wola: 11
    },
    rozmiar: '1',
    predkosc: 10,
    jezyki: ['wspólny', 'zwierzęcy'],
    profesje: ['wojownik', 'myśliwy', 'szaman'],
    cechy_specjalne: {
      niedzwiedzia_sila: 'Bonus do testów siły i ataków wręcz.',
      naturalne_pazury: 'Ataki wręcz zadają dodatkowe obrażenia.',
      hibernacja: 'Możesz hibernować w trudnych warunkach.'
    },
    strona_zrodlowa: 49
  },

  warg: {
    id: 'warg',
    nazwa: 'Warg',
    zrodlo: null, // Nie zweryfikowane w PG
    opis: 'Wilcze istoty o niezwykłej zwinności i zdolnościach tropienia.',
    atrybuty_bazowe: {
      sila: 10,
      zrecznosc: 13,
      intelekt: 9,
      wola: 8
    },
    rozmiar: '1',
    predkosc: 14,
    jezyki: ['wspólny', 'wilczy'],
    profesje: ['myśliwy', 'wojownik', 'szaman'],
    cechy_specjalne: {
      szybkosc: 'Możesz biegać szybciej niż normalnie.',
      tropienie: 'Możesz śledzić ślady na duże odległości.'
    },
    strona_zrodlowa: 50
  },

  inkarnacja: {
    id: 'inkarnacja',
    nazwa: 'Inkarnacja',
    zrodlo: null, // Nie zweryfikowane w PG
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
    strona_zrodlowa: 75
  },

  // Rozkoszna Agonia
  kambion: {
    id: 'kambion',
    nazwa: 'Kambion',
    zrodlo: null, // Nie zweryfikowane w PG
    opis: 'Hybrydy ludzi i demonów, noszące w sobie mroczną moc.',
    atrybuty_bazowe: {
      sila: 11,
      zrecznosc: 10,
      intelekt: 10,
      wola: 10
    },
    rozmiar: '1',
    predkosc: 10,
    jezyki: ['wspólny', 'demoniczny'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      odpornosc_na_ogien: 'Odporność na obrażenia od ognia.',
      potworny_wyglad: 'Twój wygląd może wywołać strach u wrogów.'
    },
    strona_zrodlowa: 45
  },

  // Dodatkowe pochodzenie z innych źródeł
  jotunn: {
    id: 'jotunn',
    nazwa: 'Jötunn',
    zrodlo: null, // Nie zweryfikowane w PG
    opis: 'Potężni giganci z północnych krain, znani z siły i honoru bojowego.',
    atrybuty_bazowe: {
      sila: 12,
      zrecznosc: 9,
      intelekt: 9,
      wola: 10
    },
    rozmiar: '2',
    predkosc: 12,
    jezyki: ['wspólny', 'gigancki'],
    profesje: ['wojownik', 'myśliwy', 'kowal'],
    cechy_specjalne: {
      wielki_rozmiar: 'Rozmiar 2. Zajmujesz przestrzeń 2x2 metrów.',
      naturalny_pancerz: 'Obrona +1 dzięki grubej skórze.',
      odpornosc_na_zimno: 'Odporność na obrażenia od zimna.'
    },
    strona_zrodlowa: 45
  }
};

module.exports = ORIGINS;
