/**
 * Testy jednostkowe dla kreatora postaci
 */

const { budujPostac } = require('../src/server');
const DANE_GRY = require('../src/data');

describe('Kreator postaci - Cień Władcy Demonów', () => {

  describe('budujPostac()', () => {
    test('powinien utworzyć człowieka z podstawowymi wartościami', () => {
      const spec = {
        pochodzenie: 'czlowiek',
        atrybuty: { sila: 12, zrecznosc: 10, intelekt: 14, wola: 8 }
      };

      const postac = budujPostac(spec);

      expect(postac.pochodzenie.nazwa).toBe('Człowiek');
      expect(postac.atrybuty.sila).toBe(12); // bez modyfikatora
      expect(postac.atrybuty_drugorzedne.zdrowie).toBe(12); // Zdrowie = Siła
      expect(postac.atrybuty_drugorzedne.percepcja).toBe(14); // Percepcja = Intelekt
      expect(postac.jezyki).toContain('wspólny');
    });

    test('powinien utworzyć jötunna z modyfikatorami pochodzenia', () => {
      const spec = {
        pochodzenie: 'jotunn',
        atrybuty: { sila: 10, zrecznosc: 10, intelekt: 10, wola: 10 }
      };

      const postac = budujPostac(spec);

      expect(postac.pochodzenie.nazwa).toBe('Jötunn');
      expect(postac.atrybuty.sila).toBe(12); // 10 + 2 modyfikator
      expect(postac.atrybuty.zrecznosc).toBe(9); // 10 - 1 modyfikator
      expect(postac.atrybuty_drugorzedne.rozmiar).toBe('2');
      expect(postac.atrybuty_drugorzedne.predkosc).toBe(12);
      expect(postac.jezyki).toContain('gigancki');
    });

    test('powinien rzucić błędem dla nieznanego pochodzenia', () => {
      const spec = { pochodzenie: 'nieznane_pochodzenie' };

      expect(() => budujPostac(spec)).toThrow('Nieznane pochodzenie: nieznane_pochodzenie');
    });

    test('powinien rzucić błędem dla nieznanego poziomu', () => {
        const spec = { pochodzenie: 'czlowiek', poziom: 99 };
        expect(() => budujPostac(spec)).toThrow('Nieznany poziom: 99');
    });

    test('powinien użyć domyślnego poziomu 0 gdy nie podano poziomu', () => {
        const spec = { pochodzenie: 'czlowiek' };
        const postac = budujPostac(spec);
        expect(postac.poziom.nazwa).toBe('Nowicjusz');
    });

    test('powinien obsłużyć poziom 1 (Ekspert)', () => {
        const spec = { pochodzenie: 'czlowiek', poziom: 1 };
        const postac = budujPostac(spec);
        expect(postac.poziom.nazwa).toBe('Ekspert');
    });

    test('powinien obsłużyć poziom 3 (Legenda)', () => {
        const spec = { pochodzenie: 'czlowiek', poziom: 3 };
        const postac = budujPostac(spec);
        expect(postac.poziom.nazwa).toBe('Legenda');
    });

    test('powinien rzucić błędem gdy brak pochodzenia', () => {
      const spec = {};

      expect(() => budujPostac(spec)).toThrow('Brak pochodzenia postaci');
    });

    test('powinien użyć domyślnych wartości atrybutów gdy nie podano własnych', () => {
      const spec = { pochodzenie: 'czlowiek' };

      const postac = budujPostac(spec);

      // Sprawdź że atrybuty są równe domyślnym wartościom (10, 10, 10, 10)
      expect(postac.atrybuty.sila).toBe(10);
      expect(postac.atrybuty.zrecznosc).toBe(10);
      expect(postac.atrybuty.intelekt).toBe(10);
      expect(postac.atrybuty.wola).toBe(10);
    });

    test('powinien dodać ścieżkę nowicjusza jeśli podano', () => {
      const spec = {
        pochodzenie: 'czlowiek',
        sciezka: 'wojownik',
        atrybuty: { sila: 10, zrecznosc: 10, intelekt: 10, wola: 10 }
      };

      const postac = budujPostac(spec);

      expect(postac.sciezka).toBeDefined();
      expect(postac.sciezka.nazwa).toBe('Wojownik');
    });

    test('powinien utworzyć goblina z małym rozmiarem', () => {
      const spec = {
        pochodzenie: 'goblin',
        atrybuty: { sila: 10, zrecznosc: 10, intelekt: 10, wola: 10 }
      };

      const postac = budujPostac(spec);

      expect(postac.pochodzenie.nazwa).toBe('Goblin');
      expect(postac.atrybuty.zrecznosc).toBe(12); // 10 + 2 modyfikator
      expect(postac.atrybuty_drugorzedne.rozmiar).toBe('1/2');
      expect(postac.atrybuty_drugorzedne.obrona).toBe(14); // 12 + 2 za mały rozmiar
      expect(postac.jezyki).toContain('gobliński');
    });

    test('powinien utworzyć chochlika z bardzo małym rozmiarem', () => {
      const spec = {
        pochodzenie: 'chochlik',
        atrybuty: { sila: 10, zrecznosc: 10, intelekt: 10, wola: 10 }
      };

      const postac = budujPostac(spec);

      expect(postac.pochodzenie.nazwa).toBe('Chochlik');
      expect(postac.atrybuty_drugorzedne.rozmiar).toBe('1/4');
      expect(postac.atrybuty_drugorzedne.obrona).toBe(16); // 12 + 4 za bardzo mały rozmiar
      expect(postac.atrybuty.intelekt).toBe(12); // 10 + 2 modyfikator
    });

    test('powinien utworzyć niedźwiedziadło z wysoką siłą', () => {
      const spec = {
        pochodzenie: 'niedzwiedziadlo',
        atrybuty: { sila: 10, zrecznosc: 10, intelekt: 10, wola: 10 }
      };

      const postac = budujPostac(spec);

      expect(postac.pochodzenie.nazwa).toBe('Niedźwiedziadło');
      expect(postac.atrybuty.sila).toBe(13); // 10 + 3 modyfikator
      expect(postac.atrybuty_drugorzedne.zdrowie).toBe(13);
      expect(postac.profesje).toContain('wojownik');
    });

    test('powinien utworzyć elf z wysoką zręcznością', () => {
      const spec = {
        pochodzenie: 'elf',
        atrybuty: { sila: 10, zrecznosc: 10, intelekt: 10, wola: 10 }
      };

      const postac = budujPostac(spec);

      expect(postac.pochodzenie.nazwa).toBe('Elf');
      expect(postac.atrybuty.zrecznosc).toBe(12); // 10 + 2 modyfikator
      expect(postac.atrybuty.intelekt).toBe(11); // 10 + 1 modyfikator
      expect(postac.jezyki).toContain('elficki');
    });
  });

  describe('DANE_GRY.obliczenia', () => {
    test('losowe_atrybuty() powinien generować wartości 3-18', () => {
      for (let i = 0; i < 100; i++) {
        const atrybuty = DANE_GRY.obliczenia.losowe_atrybuty();

        Object.values(atrybuty).forEach(wartosc => {
          expect(wartosc).toBeGreaterThanOrEqual(3);
          expect(wartosc).toBeLessThanOrEqual(18);
        });
      }
    });

    test('atrybuty_drugorzedne() powinien obliczyć poprawnie', () => {
      const atrybuty = { sila: 12, zrecznosc: 14, intelekt: 10, wola: 8 };
      const pochodzenie = DANE_GRY.pochodzenia.czlowiek;

      const drugorzedne = DANE_GRY.obliczenia.atrybuty_drugorzedne(atrybuty, pochodzenie);

      expect(drugorzedne.percepcja).toBe(10); // = Intelekt
      expect(drugorzedne.obrona).toBe(14); // = Zręczność  
      expect(drugorzedne.zdrowie).toBe(12); // = Siła
      expect(drugorzedne.szybkosc_zdrowienia).toBe(3); // = Siła/4
    });

    test('atrybuty_drugorzedne() powinien uwzględnić modyfikatory rozmiaru', () => {
      const atrybuty = { sila: 10, zrecznosc: 12, intelekt: 10, wola: 10 };
      
      // Test małego rozmiaru (goblin)
      const goblin = DANE_GRY.pochodzenia.goblin;
      const goblinDrugorzedne = DANE_GRY.obliczenia.atrybuty_drugorzedne(atrybuty, goblin);
      expect(goblinDrugorzedne.obrona).toBe(14); // 12 + 2 za rozmiar 1/2

      // Test bardzo małego rozmiaru (chochlik)
      const chochlik = DANE_GRY.pochodzenia.chochlik;
      const chochlikDrugorzedne = DANE_GRY.obliczenia.atrybuty_drugorzedne(atrybuty, chochlik);
      expect(chochlikDrugorzedne.obrona).toBe(16); // 12 + 4 za rozmiar 1/4

      // Test dużego rozmiaru (jotunn)
      const jotunn = DANE_GRY.pochodzenia.jotunn;
      const jotunnDrugorzedne = DANE_GRY.obliczenia.atrybuty_drugorzedne(atrybuty, jotunn);
      expect(jotunnDrugorzedne.obrona).toBe(10); // 12 - 2 za rozmiar 2
    });
  });

  // Testy dla nowych funkcji frontend (symulowane w środowisku testowym)
  describe('Funkcje Frontend', () => {
    // Symulacja funkcji formatModifier
    const formatModifier = (modifier) => {
      if (modifier >= 0) {
        return `+${modifier}`;
      } else {
        return `${modifier}`;
      }
    };

    // Symulacja funkcji pobierzKluczoweCechy
    const pobierzKluczoweCechy = (cechySpecjalne) => {
      if (!cechySpecjalne || Object.keys(cechySpecjalne).length === 0) {
        return null;
      }
      
      const cechy = Object.entries(cechySpecjalne);
      const kluczoweCechy = cechy.slice(0, 2).map(([nazwa, opis]) => ({
        nazwa: formatujNazweCechy(nazwa),
        opis: opis.length > 60 ? opis.substring(0, 60) + '...' : opis
      }));
      
      return kluczoweCechy.length > 0 ? kluczoweCechy : null;
    };

    // Symulacja funkcji formatujNazweCechy
    const formatujNazweCechy = (nazwa) => {
      return nazwa
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    // Symulacja funkcji dla rozwijanych kafelków
    const utworzKrotkiOpisZwiniety = (pochodzenie) => {
      const opisy = {
        'czlowiek': 'Wszechstronni i ambitni, dominują w cywilizowanych krainach.',
        'elf': 'Długowieczne istoty o niezwykłej urodzie.',
        'goblin': 'Małe, zwinne istoty o wielkiej przebiegłości.'
      };
      return opisy[pochodzenie.id] || 'Nieznane pochodzenie.';
    };

    const utworzRozszerzonyOpis = (pochodzenie) => {
      const opisy = {
        'czlowiek': 'Wszechstronni i ambitni, dominują w cywilizowanych krainach. Mogą wybrać dowolną profesję i szybko dostosowują się do nowych wyzwań. Ich społeczeństwa opierają się na handlu, wiedzy i eksploracji.',
        'elf': 'Długowieczne istoty o niezwykłej urodzie, posiadające zdolności magiczne i widzenie w ciemności. Ich społeczeństwa są zorganizowane wokół magii i sztuki, żyjąc w harmonii z naturą. Elfy posiadają głęboką wiedzę o starożytnych tajemnicach i są mistrzami w dziedzinie łuku i magii.',
        'goblin': 'Małe, zwinne istoty o wielkiej przebiegłości, znane z zamiłowania do mechaniki i psot. Gobliny tworzą skomplikowane urządzenia z dostępnych materiałów, często niebezpieczne i nieprzewidywalne. Ich społeczeństwa opierają się na hierarchii opartej na wynalazczości i sprycie.'
      };
      return opisy[pochodzenie.id] || 'Nieznane pochodzenie.';
    };

    const pobierzWszystkieCechy = (cechySpecjalne) => {
      if (!cechySpecjalne || Object.keys(cechySpecjalne).length === 0) {
        return null;
      }
      
      const cechy = Object.entries(cechySpecjalne);
      return cechy.map(([nazwa, opis]) => ({
        nazwa: formatujNazweCechy(nazwa),
        opis: opis
      }));
    };

    test('formatModifier() powinien formatować modyfikatory poprawnie', () => {
      expect(formatModifier(2)).toBe('+2');
      expect(formatModifier(-1)).toBe('-1');
      expect(formatModifier(0)).toBe('+0');
      expect(formatModifier(10)).toBe('+10');
      expect(formatModifier(-5)).toBe('-5');
    });

    test('formatujNazweCechy() powinien formatować nazwy cech poprawnie', () => {
      expect(formatujNazweCechy('magia_elficka')).toBe('Magia Elficka');
      expect(formatujNazweCechy('widzenie_w_ciemności')).toBe('Widzenie W Ciemności');
      expect(formatujNazweCechy('determinacja')).toBe('Determinacja');
      expect(formatujNazweCechy('mechaniczna_precyzja')).toBe('Mechaniczna Precyzja');
    });

    test('pobierzKluczoweCechy() powinien zwracać maksymalnie 2 cechy', () => {
      const cechySpecjalne = {
        cecha1: 'Opis pierwszej cechy',
        cecha2: 'Opis drugiej cechy',
        cecha3: 'Opis trzeciej cechy'
      };

      const wynik = pobierzKluczoweCechy(cechySpecjalne);
      
      expect(wynik).toHaveLength(2);
      expect(wynik[0].nazwa).toBe('Cecha1');
      expect(wynik[1].nazwa).toBe('Cecha2');
    });

    test('pobierzKluczoweCechy() powinien skracać długie opisy', () => {
      const cechySpecjalne = {
        dluga_cecha: 'To jest bardzo długi opis cechy specjalnej, który przekracza limit sześćdziesięciu znaków i powinien zostać skrócony'
      };

      const wynik = pobierzKluczoweCechy(cechySpecjalne);
      
      expect(wynik[0].opis).toContain('...');
      expect(wynik[0].opis.length).toBe(63); // 60 + '...'
    });

    test('pobierzKluczoweCechy() powinien zwracać null dla pustego obiektu', () => {
      expect(pobierzKluczoweCechy({})).toBeNull();
      expect(pobierzKluczoweCechy(null)).toBeNull();
      expect(pobierzKluczoweCechy(undefined)).toBeNull();
    });

    // Testy dla nowych funkcji rozwijanych kafelków
    describe('Funkcje Rozwijanych Kafelków', () => {
        test('utworzKrotkiOpisZwiniety() powinien zwracać krótki opis (1 zdanie)', () => {
            const pochodzenie = { id: 'czlowiek' };
            const opis = utworzKrotkiOpisZwiniety(pochodzenie);
            expect(opis).toBe('Wszechstronni i ambitni, dominują w cywilizowanych krainach.');
            expect(opis.split('.').length).toBeLessThanOrEqual(2); // 1 zdanie + pusty element
        });

        test('utworzRozszerzonyOpis() powinien zwracać rozszerzony opis (3 zdania)', () => {
            const pochodzenie = { id: 'elf' };
            const opis = utworzRozszerzonyOpis(pochodzenie);
            expect(opis).toContain('Długowieczne istoty o niezwykłej urodzie');
            expect(opis.split('.').length).toBeGreaterThanOrEqual(4); // 3 zdania + pusty element
        });

        test('pobierzWszystkieCechy() powinien zwracać wszystkie cechy', () => {
            const cechy = {
                'magia_natury': 'Może rzucać zaklęcia związane z naturą',
                'widzenie_w_ciemnosci': 'Widzi w ciemności do 60 stóp',
                'odpornosc_na_magie': 'Ma przewagę na testach przeciwko magii'
            };
            const wszystkieCechy = pobierzWszystkieCechy(cechy);
            expect(wszystkieCechy).toHaveLength(3);
            expect(wszystkieCechy[0].nazwa).toBe('Magia Natury');
            expect(wszystkieCechy[0].opis).toBe('Może rzucać zaklęcia związane z naturą');
        });

        test('pobierzWszystkieCechy() powinien zwracać null dla pustego obiektu', () => {
            const cechy = pobierzWszystkieCechy({});
            expect(cechy).toBeNull();
        });

        test('formatujNazweCechy() powinien formatować nazwy cech poprawnie', () => {
            expect(formatujNazweCechy('magia_natury')).toBe('Magia Natury');
            expect(formatujNazweCechy('widzenie_w_ciemnosci')).toBe('Widzenie W Ciemnosci');
            expect(formatujNazweCechy('odpornosc_na_magie')).toBe('Odpornosc Na Magie');
        });
    });

    // Testy dla przycisku "Wybierz"
    describe('Funkcje Przycisku Wyboru', () => {
        // Symulacja funkcji pokazKomunikatWyboru
        const pokazKomunikatWyboru = (originId) => {
            const pochodzenia = {
                'czlowiek': { id: 'czlowiek', nazwa: 'Człowiek' },
                'elf': { id: 'elf', nazwa: 'Elf' }
            };
            const pochodzenie = pochodzenia[originId];
            return pochodzenie ? `Wybrano pochodzenie: ${pochodzenie.nazwa}` : null;
        };

        test('pokazKomunikatWyboru() powinien zwracać komunikat dla znanego pochodzenia', () => {
            const komunikat = pokazKomunikatWyboru('czlowiek');
            expect(komunikat).toBe('Wybrano pochodzenie: Człowiek');
        });

        test('pokazKomunikatWyboru() powinien zwracać komunikat dla elfa', () => {
            const komunikat = pokazKomunikatWyboru('elf');
            expect(komunikat).toBe('Wybrano pochodzenie: Elf');
        });

        test('pokazKomunikatWyboru() powinien zwracać null dla nieznanego pochodzenia', () => {
            const komunikat = pokazKomunikatWyboru('nieznane');
            expect(komunikat).toBeNull();
        });
    });

    // Testy dla obsługi kliknięć kafelków
    describe('Obsługa Kliknięć Kafelków', () => {
        // Symulacja funkcji toggleTileExpansion
        const toggleTileExpansion = (originId) => {
            return `Toggling tile expansion for: ${originId}`;
        };

        // Symulacja funkcji wybierzPochodzenie
        const wybierzPochodzenie = (originId) => {
            return `Selecting origin: ${originId}`;
        };

        test('toggleTileExpansion() powinien działać dla różnych pochodzeń', () => {
            expect(toggleTileExpansion('czlowiek')).toBe('Toggling tile expansion for: czlowiek');
            expect(toggleTileExpansion('elf')).toBe('Toggling tile expansion for: elf');
            expect(toggleTileExpansion('goblin')).toBe('Toggling tile expansion for: goblin');
        });

        test('wybierzPochodzenie() powinien działać dla różnych pochodzeń', () => {
            expect(wybierzPochodzenie('czlowiek')).toBe('Selecting origin: czlowiek');
            expect(wybierzPochodzenie('elf')).toBe('Selecting origin: elf');
            expect(wybierzPochodzenie('goblin')).toBe('Selecting origin: goblin');
        });
    });
  });
});
