/**
 * Dane gry - wszystkie tabele lookup dla Cienia Władcy Demonów
 * Źródło: Podręcznik główny + suplementy
 */

const DANE_GRY = {
  // Pochodzenia - wszystkie dostępne w podręcznikach
  pochodzenia: {
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
        mala_postura: 'Rozmiar 1/2. Możesz ukryć się za przeciwnikiem.',
        przebiegłość: 'Gdy wykonujesz test Zręczności lub Intelektu, możesz rzucić dodatkową k6.',
        mechaniczny_geniusz: 'Możesz naprawiać i modyfikować mechaniczne urządzenia.'
      },
      strona_zrodlowa: 15
    },

    krasnolud: {
      id: 'krasnolud',
      nazwa: 'Krasnolud',
      opis: 'Krzepcy i uparci, krasnoludy są mistrzami rzemiosła i walki pod ziemią.',
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
        odpornosc_na_magie: 'Odporność na magię. Testy przeciwko magii z przewagą.',
        widzenie_w_ciemności: 'Widzisz w ciemności do 20 metrów.',
        rzemiosło: 'Możesz tworzyć i naprawiać broń, zbroję i narzędzia.'
      },
      strona_zrodlowa: 18
    },

    odmieniec: {
      id: 'odmieniec',
      nazwa: 'Odmieniec',
      opis: 'Istoty zmienione przez magię, posiadające niezwykłe moce i zdolności.',
      atrybuty: {
        sila: 10,
        zrecznosc: 10,
        intelekt: 11,
        wola: 9
      },
      rozmiar: '1',
      predkosc: 10,
      jezyki: ['wspólny'],
      profesje: ['dowolna'],
      cechy_specjalne: {
        mutacja: 'Wybierz jedną mutację z dostępnych opcji.',
        odpornosc_na_magie: 'Częściowa odporność na efekty magiczne.',
        nietypowy_wyglad: 'Twój wygląd wskazuje na zmiany wywołane magią.'
      },
      strona_zrodlowa: 20
    },

    ork: {
      id: 'ork',
      nazwa: 'Ork',
      opis: 'Wojownicze istoty o wielkiej sile i zamiłowaniu do walki.',
      atrybuty: {
        sila: 12,
        zrecznosc: 9,
        intelekt: 8,
        wola: 11
      },
      rozmiar: '1',
      predkosc: 10,
      jezyki: ['wspólny', 'orki'],
      profesje: ['wojownik', 'myśliwy', 'szaman'],
      cechy_specjalne: {
        wsciekłosc: 'Gdy otrzymujesz obrażenia, możesz wpaść w szał bojowy.',
        naturalna_zbroja: 'Obrona +1 dzięki grubej skórze.',
        zmysły_drapieznika: 'Widzenie w ciemności i wyczulony węch.'
      },
      strona_zrodlowa: 22
    },

    // Suplement Władcy Demonów
    faun: {
      id: 'faun',
      nazwa: 'Faun',
      opis: 'Leśne istoty o kozich nogach, związane z naturą i magią.',
      atrybuty: {
        sila: 9,
        zrecznosc: 12,
        intelekt: 10,
        wola: 9
      },
      rozmiar: '1',
      predkosc: 12,
      jezyki: ['wspólny', 'leśny'],
      profesje: ['dowolna'],
      cechy_specjalne: {
        leśne_zdolnosci: 'Możesz porozumiewać się ze zwierzętami.',
        skakanie: 'Możesz skakać dalej i wyżej niż normalnie.',
        magia_natury: 'Dostęp do podstawowych zaklęć natury.'
      },
      strona_zrodlowa: 5
    },

    niziol: {
      id: 'niziol',
      nazwa: 'Niziołek',
      opis: 'Małe, zwinne istoty znane z zamiłowania do komfortu i przygód.',
      atrybuty: {
        sila: 8,
        zrecznosc: 12,
        intelekt: 10,
        wola: 10
      },
      rozmiar: '1/2',
      predkosc: 12,
      jezyki: ['wspólny', 'niziolski'],
      profesje: ['dowolna'],
      cechy_specjalne: {
        mala_postura: 'Rozmiar 1/2. Możesz ukryć się za przeciwnikiem.',
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
      opis: 'Większe i bardziej wojownicze niż gobliny, znane z dyscypliny bojowej.',
      atrybuty: {
        sila: 10,
        zrecznosc: 10,
        intelekt: 10,
        wola: 10
      },
      rozmiar: '1',
      predkosc: 10,
      jezyki: ['wspólny', 'hobgobliński'],
      profesje: ['dowolna'],
      cechy_specjalne: {
        dyscyplina_bojowa: 'Możesz koordynować ataki z sojusznikami.',
        odpornosc_na_strach: 'Odporność na efekty strachu.',
        taktyka: 'Bonus do ataków w grupie.'
      },
      strona_zrodlowa: 11
    },

    // Głód w Pustce
    fomor: {
      id: 'fomor',
      nazwa: 'Fomor',
      opis: 'Potworne istoty z głębin, o przerażającym wyglądzie i mocy.',
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
        wilcze_zmysly: 'Wyczulony węch i słuch.',
        szybkosc: 'Możesz biegać szybciej niż normalnie.',
        tropienie: 'Możesz śledzić ślady na duże odległości.'
      },
      strona_zrodlowa: 50
    },

    inkarnacja: {
      id: 'inkarnacja',
      nazwa: 'Inkarnacja',
      opis: 'Istoty, które wcieliły się w materialną formę z innych płaszczyzn.',
      atrybuty: {
        sila: 10,
        zrecznosc: 10,
        intelekt: 12,
        wola: 8
      },
      rozmiar: '1',
      predkosc: 10,
      jezyki: ['wspólny', 'płaszczyznowy'],
      profesje: ['dowolna'],
      cechy_specjalne: {
        płaszczyznowe_zdolnosci: 'Dostęp do zaklęć związanych z innymi płaszczyznami.',
        odpornosc_na_magie: 'Częściowa odporność na efekty magiczne.',
        nietypowy_wyglad: 'Twój wygląd wskazuje na inneplanarne pochodzenie.'
      },
      strona_zrodlowa: 75
    },

    // Rozkoszna Agonia
    kambion: {
      id: 'kambion',
      nazwa: 'Kambion',
      opis: 'Potomkowie demonów, posiadający mroczne moce i przerażający wygląd.',
      atrybuty: {
        sila: 11,
        zrecznosc: 9,
        intelekt: 10,
        wola: 10
      },
      rozmiar: '1',
      predkosc: 10,
      jezyki: ['wspólny', 'demoniczny'],
      profesje: ['dowolna'],
      cechy_specjalne: {
        demoniczne_zdolnosci: 'Dostęp do demonicznych zaklęć.',
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
  },

  // Ścieżki nowicjuszy - str. 51-70
  sciezki_nowicjuszy: {
    wojownik: {
      id: 'wojownik',
      nazwa: 'Wojownik', 
      opis: 'Mistrz broni i walki, specjalizuje się w zadawaniu i przyjmowaniu obrażeń.',
      poziom_1: {
        atrybuty: '+1 do Siły lub Zwinności',
        zdrowie: '+5',
        talenty: ['Walka bronią', 'Blok tarczą']
      },
      poziom_2: {
        zdrowie: '+5',
        talent: 'Atak okazji'
      },
      poziom_5: {
        zdrowie: '+5', 
        talent: 'Seria ataków'
      },
      strona_zrodlowa: 52
    },

    mag: {
      id: 'mag',
      nazwa: 'Mag',
      opis: 'Poznaje tajemnice magii i włada mocą zaklęć.',
      poziom_1: {
        atrybuty: '+1 do Intelektu lub Woli',
        moc: '+1',
        magia: 'Jedna tradycja magiczna + 1 zaklęcie',
        talenty: ['Kontratakt', 'Zaklęcie mocy']
      },
      poziom_2: {
        moc: '+1',
        talent: 'Dodatkowe zaklęcie'
      },
      poziom_5: {
        moc: '+1',
        talent: 'Mistrz magii'
      },
      strona_zrodlowa: 56
    }
  },

  // Kalkulatory atrybutów
  obliczenia: {
    /**
     * Oblicza atrybuty drugorzędne na podstawie podstawowych
     */
    atrybuty_drugorzedne(atrybuty, pochodzenie) {
      // Obliczanie obrony na podstawie rozmiaru
      let obrona = atrybuty.zrecznosc;
      
      // Modyfikatory obrony na podstawie rozmiaru
      const rozmiar = pochodzenie.rozmiar;
      if (rozmiar === '1/4') {
        obrona += 4; // Bardzo małe istoty są trudniejsze do trafienia
      } else if (rozmiar === '1/2') {
        obrona += 2; // Małe istoty są trudniejsze do trafienia
      } else if (rozmiar === '2') {
        obrona -= 2; // Duże istoty są łatwiejsze do trafienia
      }

      return {
        percepcja: atrybuty.intelekt,
        obrona: Math.max(obrona, 1), // Minimum 1
        zdrowie: atrybuty.sila,
        szybkosc_zdrowienia: Math.floor(atrybuty.sila / 4) || 1,
        rozmiar: pochodzenie.rozmiar,
        predkosc: pochodzenie.predkosc,
        moc: 0
      };
    },

    /**
     * Generuje losowe atrybuty podstawowe (3d6 każdy)
     */
    losowe_atrybuty() {
      const rzut3d6 = () => Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 3;

      return {
        sila: rzut3d6(),
        zrecznosc: rzut3d6(), 
        intelekt: rzut3d6(),
        wola: rzut3d6()
      };
    }
  }
};

// Eksport dla Node.js i przeglądarki
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DANE_GRY;
} else if (typeof window !== 'undefined') {
  window.DANE_GRY = DANE_GRY;
}
