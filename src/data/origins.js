/**
 * Pochodzenia postaci - wszystkie dostępne w podręcznikach
 * Źródło: Podręcznik główny + suplementy
 */

const ORIGINS = {
  // Podręcznik Główny
  czlowiek: {
    id: 'czlowiek',
    nazwa: 'Człowiek',
    opis: 'Wszechstronni i ambitni, ludzie dominują w większości cywilizowanych krain.',
    atrybuty: {
      sila: 10,
      zrecznosc: 10,
      intelekt: 10,
      wola: 10
    },
    rozmiar: '1',
    predkosc: 10,
    jezyki: ['wspólny'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      determinacja: 'Gdy wykonujesz test atrybutu, możesz wydać punkt Determinacji aby rzucić dodatkową k20 i wybrać lepszy wynik.'
    },
    strona_zrodlowa: 11
  },

  automaton: {
    id: 'automaton',
    nazwa: 'Automaton',
    opis: 'Mechaniczne istoty stworzone przez dawnych magów, poszukujące własnej tożsamości.',
    atrybuty: {
      sila: 11,
      zrecznosc: 8,
      intelekt: 10,
      wola: 11
    },
    rozmiar: '1',
    predkosc: 10,
    jezyki: ['wspólny', 'mechaniczny'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      konstrukt: 'Nie oddychasz, nie śpisz, nie jesz. Odporny na choroby i trucizny.',
      mechaniczna_precyzja: 'Rzuty na atak i obrażenia są zawsze traktowane jako minimum 10.',
      naprawa: 'Możesz naprawić się w trakcie krótkiego odpoczynku.'
    },
    strona_zrodlowa: 13
  },

  goblin: {
    id: 'goblin',
    nazwa: 'Goblin',
    opis: 'Małe, zwinne istoty o wielkiej przebiegłości i zamiłowaniu do mechaniki.',
    atrybuty: {
      sila: 8,
      zrecznosc: 12,
      intelekt: 11,
      wola: 9
    },
    rozmiar: '1/2',
    predkosc: 12,
    jezyki: ['wspólny', 'gobliński'],
    profesje: ['dowolna'],
    cechy_specjalne: {
      przebiegłość: 'Gdy wykonujesz test Zręczności lub Intelektu, możesz rzucić dodatkową k6.',
      mechaniczny_geniusz: 'Możesz naprawiać i modyfikować mechaniczne urządzenia.'
    },
    strona_zrodlowa: 15
  },

  krasnolud: {
    id: 'krasnolud',
    nazwa: 'Krasnolud',
    opis: 'Niskie, krępe istoty znane z wytrzymałości i umiejętności rzemieślniczych.',
    atrybuty: {
      sila: 11,
      zrecznosc: 9,
      intelekt: 10,
      wola: 10
    },
    rozmiar: '1',
    predkosc: 10,
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
    opis: 'Istoty zmienione przez magię, poszukujące swojego miejsca w świecie.',
    atrybuty: {
      sila: 10,
      zrecznosc: 9,
      intelekt: 11,
      wola: 9
    },
    rozmiar: '1',
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
    opis: 'Silne, wojownicze istoty o dzikiej naturze i instynktach drapieżnika.',
    atrybuty: {
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
    opis: 'Istoty o kozim wyglądzie, znane z zamiłowania do muzyki i natury.',
    atrybuty: {
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
    opis: 'Małe, spokojne istoty ceniące sobie komfort i dobre jedzenie.',
    atrybuty: {
      sila: 8,
      zrecznosc: 11,
      intelekt: 10,
      wola: 10
    },
    rozmiar: '1/2',
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
    opis: 'Maleńkie istoty magiczne, znane z psot i niezwykłych mocy.',
    atrybuty: {
      sila: 6,
      zrecznosc: 12,
      intelekt: 12,
      wola: 10
    },
    rozmiar: '1/4',
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
    opis: 'Długowieczne istoty o niezwykłej urodzie i zdolnościach magicznych.',
    atrybuty: {
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
    opis: 'Większe od goblinów, znane z dyscypliny i umiejętności wojskowych.',
    atrybuty: {
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
    opis: 'Potworne istoty z głębin, zmienione przez ciemne moce.',
    atrybuty: {
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
    opis: 'Istoty o niedźwiedzim wyglądzie, znane z siły i dzikości.',
    atrybuty: {
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
    opis: 'Wilcze istoty o niezwykłej zwinności i zdolnościach tropienia.',
    atrybuty: {
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
    opis: 'Istoty z innych wymiarów, przybyłe na ten świat.',
    atrybuty: {
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
    opis: 'Hybrydy ludzi i demonów, noszące w sobie mroczną moc.',
    atrybuty: {
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
    opis: 'Potężni giganci z północnych krain, znani z siły i honoru bojowego.',
    atrybuty: {
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
