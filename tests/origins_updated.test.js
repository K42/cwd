/**
 * Testy jednostkowe dla zaktualizowanych danych pochodzeń
 */

const ORIGINS = require('../src/data/origins');

describe('Zaktualizowane dane pochodzeń', () => {
  
  describe('Człowiek', () => {
    test('powinien mieć poprawne atrybuty bazowe', () => {
      const czlowiek = ORIGINS.czlowiek;
      
      expect(czlowiek.atrybuty_bazowe.sila).toBe(10);
      expect(czlowiek.atrybuty_bazowe.zrecznosc).toBe(10);
      expect(czlowiek.atrybuty_bazowe.intelekt).toBe(10);
      expect(czlowiek.atrybuty_bazowe.wola).toBe(10);
    });

    test('powinien mieć poprawną cechę specjalną', () => {
      const czlowiek = ORIGINS.czlowiek;
      
      expect(czlowiek.cechy_specjalne).toHaveProperty('determinacja');
      expect(czlowiek.cechy_specjalne.determinacja).toContain('punkt Determinacji');
    });

    test('powinien mieć korzyści poziomu 4', () => {
      const czlowiek = ORIGINS.czlowiek;
      
      expect(czlowiek.poziom_4).toHaveProperty('zdrowie');
      expect(czlowiek.poziom_4).toHaveProperty('opcje');
      expect(czlowiek.poziom_4.zdrowie).toBe('+5');
      expect(czlowiek.poziom_4.opcje).toContain('1 zaklęcie');
      expect(czlowiek.poziom_4.opcje).toContain('talent Determinacja');
    });
  });

  describe('Automaton', () => {
    test('powinien mieć poprawne atrybuty bazowe', () => {
      const automaton = ORIGINS.automaton;
      
      expect(automaton.atrybuty_bazowe.sila).toBe(9);
      expect(automaton.atrybuty_bazowe.zrecznosc).toBe(8);
      expect(automaton.atrybuty_bazowe.intelekt).toBe(9);
      expect(automaton.atrybuty_bazowe.wola).toBe(9);
    });

    test('powinien mieć poprawną prędkość', () => {
      const automaton = ORIGINS.automaton;
      expect(automaton.predkosc).toBe(8);
    });

    test('powinien mieć poprawne cechy specjalne', () => {
      const automaton = ORIGINS.automaton;
      
      expect(automaton.cechy_specjalne).toHaveProperty('niewrazliwosc');
      expect(automaton.cechy_specjalne).toHaveProperty('klucz');
      expect(automaton.cechy_specjalne).toHaveProperty('forma_obiektu');
      expect(automaton.cechy_specjalne.niewrazliwosc).toContain('uśpienie i wyczerpanie');
    });
  });

  describe('Goblin', () => {
    test('powinien mieć poprawne atrybuty bazowe', () => {
      const goblin = ORIGINS.goblin;
      
      expect(goblin.atrybuty_bazowe.sila).toBe(8);
      expect(goblin.atrybuty_bazowe.zrecznosc).toBe(12);
      expect(goblin.atrybuty_bazowe.intelekt).toBe(10);
      expect(goblin.atrybuty_bazowe.wola).toBe(9);
    });

    test('powinien mieć poprawny rozmiar i prędkość', () => {
      const goblin = ORIGINS.goblin;
      expect(goblin.rozmiar).toBe('1/2');
      expect(goblin.predkosc).toBe(10);
    });

    test('powinien mieć poprawne języki', () => {
      const goblin = ORIGINS.goblin;
      expect(goblin.jezyki).toContain('wspólny');
      expect(goblin.jezyki).toContain('elficki');
    });

    test('powinien mieć poprawne cechy specjalne', () => {
      const goblin = ORIGINS.goblin;
      
      expect(goblin.cechy_specjalne).toHaveProperty('niewrazliwosc');
      expect(goblin.cechy_specjalne).toHaveProperty('wrażliwosc_na_zelazo');
      expect(goblin.cechy_specjalne).toHaveProperty('widzenie_w_cieniu');
      expect(goblin.cechy_specjalne).toHaveProperty('przebiegłość');
    });
  });

  describe('Krasnolud', () => {
    test('powinien mieć poprawne atrybuty bazowe', () => {
      const krasnolud = ORIGINS.krasnolud;
      
      expect(krasnolud.atrybuty_bazowe.sila).toBe(10);
      expect(krasnolud.atrybuty_bazowe.zrecznosc).toBe(9);
      expect(krasnolud.atrybuty_bazowe.intelekt).toBe(10);
      expect(krasnolud.atrybuty_bazowe.wola).toBe(10);
    });

    test('powinien mieć poprawny rozmiar i prędkość', () => {
      const krasnolud = ORIGINS.krasnolud;
      expect(krasnolud.rozmiar).toBe('1/2');
      expect(krasnolud.predkosc).toBe(8);
    });

    test('powinien mieć poprawne cechy specjalne', () => {
      const krasnolud = ORIGINS.krasnolud;
      
      expect(krasnolud.cechy_specjalne).toHaveProperty('widzenie_w_ciemności');
      expect(krasnolud.cechy_specjalne).toHaveProperty('znienawidzony_wrog');
      expect(krasnolud.cechy_specjalne).toHaveProperty('naturalna_odpornosc');
    });
  });

  describe('Odmieniec', () => {
    test('powinien mieć poprawne atrybuty bazowe', () => {
      const odmieniec = ORIGINS.odmieniec;
      
      expect(odmieniec.atrybuty_bazowe.sila).toBe(9);
      expect(odmieniec.atrybuty_bazowe.zrecznosc).toBe(10);
      expect(odmieniec.atrybuty_bazowe.intelekt).toBe(10);
      expect(odmieniec.atrybuty_bazowe.wola).toBe(10);
    });

    test('powinien mieć poprawne cechy specjalne', () => {
      const odmieniec = ORIGINS.odmieniec;
      
      expect(odmieniec.cechy_specjalne).toHaveProperty('niewrazliwosc');
      expect(odmieniec.cechy_specjalne).toHaveProperty('wrażliwosc_na_zelazo');
      expect(odmieniec.cechy_specjalne).toHaveProperty('widzenie_w_cieniu');
      expect(odmieniec.cechy_specjalne).toHaveProperty('kradziez_tozsamosci');
    });
  });

  describe('Ork', () => {
    test('powinien mieć poprawne atrybuty bazowe', () => {
      const ork = ORIGINS.ork;
      
      expect(ork.atrybuty_bazowe.sila).toBe(11);
      expect(ork.atrybuty_bazowe.zrecznosc).toBe(10);
      expect(ork.atrybuty_bazowe.intelekt).toBe(9);
      expect(ork.atrybuty_bazowe.wola).toBe(9);
    });

    test('powinien mieć poprawną prędkość', () => {
      const ork = ORIGINS.ork;
      expect(ork.predkosc).toBe(12);
    });

    test('powinien mieć poprawne języki', () => {
      const ork = ORIGINS.ork;
      expect(ork.jezyki).toContain('wspólny');
      expect(ork.jezyki).toContain('mroczna_mowa');
    });

    test('powinien mieć poprawne cechy specjalne', () => {
      const ork = ORIGINS.ork;
      
      expect(ork.cechy_specjalne).toHaveProperty('widzenie_w_cieniu');
      expect(ork.cechy_specjalne).toHaveProperty('splugawienie');
    });

    test('powinien mieć źródło PG', () => {
      const ork = ORIGINS.ork;
      expect(ork.zrodlo).toBe('PG');
    });
  });

  describe('Walidacja struktury danych', () => {
    test('wszystkie pochodzenia powinny mieć wymagane pola', () => {
      Object.values(ORIGINS).forEach(pochodzenie => {
        expect(pochodzenie).toHaveProperty('id');
        expect(pochodzenie).toHaveProperty('nazwa');
        expect(pochodzenie).toHaveProperty('zrodlo');
        expect(pochodzenie).toHaveProperty('opis');
        expect(pochodzenie).toHaveProperty('atrybuty_bazowe');
        expect(pochodzenie).toHaveProperty('rozmiar');
        expect(pochodzenie).toHaveProperty('predkosc');
        expect(pochodzenie).toHaveProperty('jezyki');
        expect(pochodzenie).toHaveProperty('profesje');
        expect(pochodzenie).toHaveProperty('cechy_specjalne');
        expect(pochodzenie).toHaveProperty('strona_zrodlowa');
      });
    });

    test('wszystkie pochodzenia powinny mieć poprawne atrybuty bazowe', () => {
      Object.values(ORIGINS).forEach(pochodzenie => {
        expect(pochodzenie.atrybuty_bazowe).toHaveProperty('sila');
        expect(pochodzenie.atrybuty_bazowe).toHaveProperty('zrecznosc');
        expect(pochodzenie.atrybuty_bazowe).toHaveProperty('intelekt');
        expect(pochodzenie.atrybuty_bazowe).toHaveProperty('wola');
        
        expect(typeof pochodzenie.atrybuty_bazowe.sila).toBe('number');
        expect(typeof pochodzenie.atrybuty_bazowe.zrecznosc).toBe('number');
        expect(typeof pochodzenie.atrybuty_bazowe.intelekt).toBe('number');
        expect(typeof pochodzenie.atrybuty_bazowe.wola).toBe('number');
      });
    });
  });
});
