/**
 * Dane gry - wszystkie tabele lookup dla Cienia Władcy Demonów
 * Źródło: Podręcznik główny + suplementy
 */

const DANE_GRY = {
  // Pochodzenia - str. 34-50 podręcznika głównego
  pochodzenia: {
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
      strona_zrodlowa: 34
    },

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
      return {
        percepcja: atrybuty.intelekt,
        obrona: atrybuty.zrecznosc,
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
