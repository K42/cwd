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

    test('powinien rzucić błędem gdy brak pochodzenia', () => {
      const spec = {};

      expect(() => budujPostac(spec)).toThrow('Brak pochodzenia postaci');
    });

    test('powinien wygenerować losowe atrybuty gdy nie podano własnych', () => {
      const spec = { pochodzenie: 'czlowiek' };

      const postac = budujPostac(spec);

      // Sprawdź że atrybuty są w zakresie 3-18 (3k6)
      expect(postac.atrybuty.sila).toBeGreaterThanOrEqual(3);
      expect(postac.atrybuty.sila).toBeLessThanOrEqual(18);
      expect(postac.atrybuty.zrecznosc).toBeGreaterThanOrEqual(3);
      expect(postac.atrybuty.zrecznosc).toBeLessThanOrEqual(18);
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
});
