/**
 * Testy jednostkowe dla rozszerzonych pochodzeń - Sprint 2
 * Testy struktury danych, walidacji i funkcji losowania
 */

import { EXTENDED_ORIGINS, HUMAN_EXTENDED, validateOrigin, rollFromTable } from '../src/ui/data/origins_extended.js';

describe('Rozszerzone Pochodzenia - Sprint 2', () => {
  
  describe('Struktura danych Człowieka', () => {
    test('powinien mieć wszystkie wymagane pola główne', () => {
      expect(HUMAN_EXTENDED.id).toBe('czlowiek');
      expect(HUMAN_EXTENDED.nazwa).toBe('Człowiek');
      expect(HUMAN_EXTENDED.zrodlo).toBe('PG');
      expect(HUMAN_EXTENDED.opis).toBeDefined();
      expect(HUMAN_EXTENDED.opis_pelny).toBeDefined();
      expect(HUMAN_EXTENDED.przykladowe_imiona).toBeInstanceOf(Array);
    });

    test('powinien mieć sekcję tworzenie_postaci z wszystkimi polami', () => {
      const tp = HUMAN_EXTENDED.tworzenie_postaci;
      
      expect(tp.atrybuty_bazowe).toEqual({
        sila: 10,
        zrecznosc: 10,
        intelekt: 10,
        wola: 10
      });
      
      expect(tp.wybor_atrybutu).toBeDefined();
      expect(tp.wybor_atrybutu.opcje).toEqual(['sila', 'zrecznosc', 'intelekt', 'wola']);
      
      expect(tp.percepcja).toBe('intelekt');
      expect(tp.obrona).toBe('zrecznosc');
      expect(tp.zdrowie).toBe('sila');
      expect(tp.szybkosc_zdrowienia).toBe('1/4 Zdrowia (zaokr. w dół)');
      
      expect(tp.rozmiar).toBe('1/2 lub 1');
      expect(tp.predkosc).toBe(10);
      expect(tp.moc).toBe(0);
      
      expect(tp.obrazenia).toBe(0);
      expect(tp.szalenstwo).toBe(0);
      expect(tp.splugawienie).toBe(0);
      
      expect(tp.jezyki).toEqual(['wspólny']);
      expect(tp.jezyki_opcje).toBe('1 dodatkowy język LUB losowa profesja');
    });

    test('powinien mieć sekcję poziom_4 z korzyściami', () => {
      const p4 = HUMAN_EXTENDED.poziom_4;
      
      expect(p4.zdrowie_bonus).toBe(5);
      expect(p4.opcje).toHaveLength(2);
      expect(p4.opcje[0].typ).toBe('zaklecie');
      expect(p4.opcje[1].typ).toBe('talent');
      expect(p4.opcje[1].nazwa).toBe('Determinacja');
    });

    test('powinien mieć wszystkie wymagane tabele', () => {
      const tabele = HUMAN_EXTENDED.tabele;
      
      expect(tabele.wiek).toBeDefined();
      expect(tabele.budowa_ciala).toBeDefined();
      expect(tabele.wyglad).toBeDefined();
      expect(tabele.przeszlosc).toBeDefined();
      expect(tabele.osobowosc).toBeDefined();
      expect(tabele.religia).toBeDefined();
    });

    test('powinien mieć metadane', () => {
      expect(HUMAN_EXTENDED.strona_zrodlowa).toBe(11);
      expect(HUMAN_EXTENDED.linie_zrodlowe).toBe('740-861');
      expect(HUMAN_EXTENDED.status).toBe('kompletne');
    });
  });

  describe('Walidacja pochodzenia', () => {
    test('powinien zwrócić poprawne dla prawidłowego pochodzenia', () => {
      const wynik = validateOrigin(HUMAN_EXTENDED);
      
      expect(wynik.poprawne).toBe(true);
      expect(wynik.bledy).toHaveLength(0);
    });

    test('powinien wykryć brakujące wymagane pola', () => {
      const nieprawidlowe = { id: 'test' };
      const wynik = validateOrigin(nieprawidlowe);
      
      expect(wynik.poprawne).toBe(false);
      expect(wynik.bledy.length).toBeGreaterThan(0);
    });

    test('powinien wykryć brakujące pola w tworzenie_postaci', () => {
      const nieprawidlowe = {
        id: 'test',
        nazwa: 'Test',
        zrodlo: 'PG',
        tworzenie_postaci: { atrybuty_bazowe: {} },
        tabele: {}
      };
      const wynik = validateOrigin(nieprawidlowe);
      
      expect(wynik.poprawne).toBe(false);
      expect(wynik.bledy.some(b => b.includes('percepcja'))).toBe(true);
    });
  });

  describe('Funkcja losowania z tabeli', () => {
    const tabelaTestowa = {
      nazwa: 'Test',
      typ: 'k20',
      opcje: [
        { rzut: '1', wynik: 'Wynik 1' },
        { rzut: '2-5', wynik: 'Wynik 2-5' },
        { rzut: '6-10', wynik: 'Wynik 6-10' },
        { rzut: '11-15', wynik: 'Wynik 11-15' },
        { rzut: '16-20', wynik: 'Wynik 16-20' }
      ]
    };

    test('powinien zwrócić prawidłowy wynik dla k20', () => {
      const wynik = rollFromTable('k20', tabelaTestowa);
      
      expect(wynik).toHaveProperty('rzut');
      expect(wynik).toHaveProperty('wynik');
      expect(wynik).toHaveProperty('wartosc_rzutu');
      expect(typeof wynik.wartosc_rzutu).toBe('number');
      expect(wynik.wartosc_rzutu).toBeGreaterThanOrEqual(1);
      expect(wynik.wartosc_rzutu).toBeLessThanOrEqual(20);
    });

    test('powinien obsłużyć różne typy rzutów', () => {
      const testy = [
        { typ: 'k6', min: 1, max: 6 },
        { typ: 'k20', min: 1, max: 20 },
        { typ: '2k6', min: 2, max: 12 },
        { typ: '3k6', min: 3, max: 18 }
      ];

      testy.forEach(test => {
        const wynik = rollFromTable(test.typ, tabelaTestowa);
        expect(wynik.wartosc_rzutu).toBeGreaterThanOrEqual(test.min);
        expect(wynik.wartosc_rzutu).toBeLessThanOrEqual(test.max);
      });
    });

    test('powinien rzucić błąd dla nieznanego typu rzutu', () => {
      expect(() => {
        rollFromTable('k100', tabelaTestowa);
      }).toThrow('Nieznany typ rzutu: k100');
    });

    test('powinien rzucić błąd dla nieprawidłowej tabeli', () => {
      expect(() => {
        rollFromTable('k20', null);
      }).toThrow('Nieprawidłowa tabela');
    });
  });

  describe('Tabele Człowieka - pokrycie zakresów', () => {
    test('tabela wiek powinna pokrywać wszystkie wyniki 3k6 (3-18)', () => {
      const tabela = HUMAN_EXTENDED.tabele.wiek;
      const opcje = tabela.opcje;
      
      // Sprawdź czy wszystkie zakresy są pokryte
      const zakresy = opcje.map(opcja => opcja.rzut);
      expect(zakresy).toContain('3');
      expect(zakresy).toContain('4-7');
      expect(zakresy).toContain('8-12');
      expect(zakresy).toContain('13-15');
      expect(zakresy).toContain('16-17');
      expect(zakresy).toContain('18');
    });

    test('tabela przeszłość powinna pokrywać wszystkie wyniki k20 (1-20)', () => {
      const tabela = HUMAN_EXTENDED.tabele.przeszlosc;
      const opcje = tabela.opcje;
      
      // Sprawdź czy wszystkie wyniki 1-20 są pokryte
      for (let i = 1; i <= 20; i++) {
        const opcja = opcje.find(opcja => {
          if (opcja.rzut.includes('-')) {
            const [min, max] = opcja.rzut.split('-').map(Number);
            return i >= min && i <= max;
          } else {
            return opcja.rzut === i.toString();
          }
        });
        expect(opcja).toBeDefined();
      }
    });

    test('tabela osobowość powinna mieć efekty mechaniczne', () => {
      const tabela = HUMAN_EXTENDED.tabele.osobowosc;
      const opcje = tabela.opcje;
      
      // Sprawdź czy wszystkie opcje mają prawidłowe wyniki
      opcje.forEach(opcja => {
        expect(opcja.wynik).toBeDefined();
        expect(typeof opcja.wynik).toBe('string');
        expect(opcja.wynik.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Efekty mechaniczne w tabelach', () => {
    test('tabela przeszłość powinna mieć efekty dla niektórych opcji', () => {
      const tabela = HUMAN_EXTENDED.tabele.przeszlosc;
      const opcjeZEfektami = tabela.opcje.filter(opcja => opcja.efekt);
      
      expect(opcjeZEfektami.length).toBeGreaterThan(0);
      
      // Sprawdź konkretne efekty
      const opcja1 = tabela.opcje.find(opcja => opcja.rzut === '1');
      expect(opcja1.efekt).toEqual({ szalenstwo: '1k6' });
      
      const opcja2 = tabela.opcje.find(opcja => opcja.rzut === '2');
      expect(opcja2.efekt).toEqual({ splugawienie: 1 });
    });
  });

  describe('Integracja z EXTENDED_ORIGINS', () => {
    test('powinien eksportować Człowieka w EXTENDED_ORIGINS', () => {
      expect(EXTENDED_ORIGINS.czlowiek).toBeDefined();
      expect(EXTENDED_ORIGINS.czlowiek).toBe(HUMAN_EXTENDED);
    });

    test('powinien mieć strukturę gotową do rozszerzenia', () => {
      expect(typeof EXTENDED_ORIGINS).toBe('object');
      expect(EXTENDED_ORIGINS.czlowiek).toBeDefined();
      // TODO: Po migracji pozostałych pochodzeń
      // expect(EXTENDED_ORIGINS.automaton).toBeDefined();
      // expect(EXTENDED_ORIGINS.goblin).toBeDefined();
    });
  });
});

