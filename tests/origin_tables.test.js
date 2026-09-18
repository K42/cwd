/**
 * Testy jednostkowe dla tabel losowania pochodzeń
 */

import { rollTable, getAvailableTables, getTableDetails, hasTables, getOriginsWithTables } from '../src/ui/data/table_utils.js';

describe('Tabele losowania pochodzeń', () => {
  
  describe('rollTable', () => {
    test('powinien zwrócić wynik dla tabeli k20', () => {
      const result = rollTable('czlowiek', 'przeszlosc');
      
      expect(result).toHaveProperty('rzut');
      expect(result).toHaveProperty('wynik');
      expect(result).toHaveProperty('efekt');
      expect(result.rzut).toBeGreaterThanOrEqual(1);
      expect(result.rzut).toBeLessThanOrEqual(20);
      expect(typeof result.wynik).toBe('string');
      expect(typeof result.efekt).toBe('string');
    });

    test('powinien zwrócić wynik dla tabeli 3k6', () => {
      const result = rollTable('czlowiek', 'osobowosc');
      
      expect(result).toHaveProperty('rzut');
      expect(result).toHaveProperty('wynik');
      expect(result).toHaveProperty('efekt');
      expect(result.rzut).toBeGreaterThanOrEqual(3);
      expect(result.rzut).toBeLessThanOrEqual(18);
      expect(typeof result.wynik).toBe('string');
      expect(typeof result.efekt).toBe('string');
    });

    test('powinien rzucić błąd dla nieznanego pochodzenia', () => {
      expect(() => {
        rollTable('nieznane_pochodzenie', 'przeszłość');
      }).toThrow('Nie znaleziono pochodzenia: nieznane_pochodzenie');
    });

    test('powinien rzucić błąd dla nieznanej tabeli', () => {
      expect(() => {
        rollTable('czlowiek', 'nieznana_tabela');
      }).toThrow('Nie znaleziono tabeli nieznana_tabela dla pochodzenia czlowiek');
    });
  });

  describe('getAvailableTables', () => {
    test('powinien zwrócić listę tabel dla człowieka', () => {
      const tables = getAvailableTables('czlowiek');
      
      expect(Array.isArray(tables)).toBe(true);
      expect(tables.length).toBeGreaterThan(0);
      
      tables.forEach(table => {
        expect(table).toHaveProperty('nazwa');
        expect(table).toHaveProperty('typ');
        expect(table).toHaveProperty('opis');
        expect(typeof table.nazwa).toBe('string');
        expect(typeof table.typ).toBe('string');
        expect(typeof table.opis).toBe('string');
      });
    });

    test('powinien zwrócić pustą tablicę dla nieznanego pochodzenia', () => {
      const tables = getAvailableTables('nieznane_pochodzenie');
      expect(Array.isArray(tables)).toBe(true);
      expect(tables.length).toBe(0);
    });
  });

  describe('getTableDetails', () => {
    test('powinien zwrócić szczegóły tabeli', () => {
      const details = getTableDetails('czlowiek', 'przeszlosc');
      
      expect(details).toHaveProperty('nazwa');
      expect(details).toHaveProperty('typ');
      expect(details).toHaveProperty('opis');
      expect(details).toHaveProperty('wyniki');
      expect(typeof details.nazwa).toBe('string');
      expect(typeof details.typ).toBe('string');
      expect(typeof details.opis).toBe('string');
      expect(typeof details.wyniki).toBe('object');
    });

    test('powinien rzucić błąd dla nieznanego pochodzenia', () => {
      expect(() => {
        getTableDetails('nieznane_pochodzenie', 'przeszłość');
      }).toThrow('Nie znaleziono pochodzenia: nieznane_pochodzenie');
    });

    test('powinien rzucić błąd dla nieznanej tabeli', () => {
      expect(() => {
        getTableDetails('czlowiek', 'nieznana_tabela');
      }).toThrow('Nie znaleziono tabeli nieznana_tabela dla pochodzenia czlowiek');
    });
  });

  describe('hasTables', () => {
    test('powinien zwrócić true dla pochodzenia z tabelami', () => {
      expect(hasTables('czlowiek')).toBe(true);
      expect(hasTables('automaton')).toBe(true);
    });

    test('powinien zwrócić false dla pochodzenia bez tabel', () => {
      expect(hasTables('nieznane_pochodzenie')).toBe(false);
    });
  });

  describe('getOriginsWithTables', () => {
    test('powinien zwrócić listę pochodzeń z tabelami', () => {
      const origins = getOriginsWithTables();
      
      expect(Array.isArray(origins)).toBe(true);
      expect(origins.length).toBeGreaterThan(0);
      
      origins.forEach(origin => {
        expect(origin).toHaveProperty('id');
        expect(origin).toHaveProperty('nazwa');
        expect(origin).toHaveProperty('ma_tabele');
        expect(origin).toHaveProperty('tabele');
        expect(typeof origin.id).toBe('string');
        expect(typeof origin.nazwa).toBe('string');
        expect(typeof origin.ma_tabele).toBe('boolean');
        expect(Array.isArray(origin.tabele)).toBe(true);
      });
    });
  });

  describe('Walidacja danych tabel', () => {
    test('tabela przeszłość człowieka powinna mieć wszystkie wyniki 1-20', () => {
      const details = getTableDetails('czlowiek', 'przeszlosc');
      
      expect(details.typ).toBe('k20');
      expect(details.wyniki).toHaveProperty('1');
      expect(details.wyniki).toHaveProperty('20');
      
      // Sprawdź czy wszystkie wyniki mają wymagane pola
      Object.values(details.wyniki).forEach(wynik => {
        expect(wynik).toHaveProperty('wynik');
        expect(wynik).toHaveProperty('efekt');
        expect(typeof wynik.wynik).toBe('string');
        expect(typeof wynik.efekt).toBe('string');
      });
    });

    test('tabela osobowość człowieka powinna mieć wszystkie wyniki 3-18', () => {
      const details = getTableDetails('czlowiek', 'osobowosc');
      
      expect(details.typ).toBe('3k6');
      expect(details.wyniki).toHaveProperty('3');
      expect(details.wyniki).toHaveProperty('18');
      
      // Sprawdź czy wszystkie wyniki mają wymagane pola
      Object.values(details.wyniki).forEach(wynik => {
        expect(wynik).toHaveProperty('wynik');
        expect(wynik).toHaveProperty('efekt');
        expect(typeof wynik.wynik).toBe('string');
        expect(typeof wynik.efekt).toBe('string');
      });
    });
  });
});
