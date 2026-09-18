/**
 * Testy jednostkowe dla logiki pochodzeń - Sprint 2
 * Testy src/ui/logic/origins.js i losowania z tabel, zgodnie z AC-012 i AC-013
 *
 * Historycznie te testy uderzały w endpointy HTTP /api/origins/* wystawiane
 * przez src/server.js. Po przejściu aplikacji na czysto statyczny frontend
 * (bez serwera) ta sama logika jest wywoływana bezpośrednio.
 */

import { getOriginsListUi, getOriginTablesUi } from '../src/ui/logic/origins.js';
import { rollTable } from '../src/ui/data/table_utils.js';

describe('Logika pochodzeń - Sprint 2', () => {

  describe('getOriginsListUI', () => {
    test('powinien zwrócić listę dostępnych pochodzeń', () => {
      const data = getOriginsListUi();

      expect(data).toHaveProperty('pochodzenia');
      expect(data).toHaveProperty('liczba_pochodzen');
      expect(data).toHaveProperty('pochodzenia_z_tabelami');

      expect(Array.isArray(data.pochodzenia)).toBe(true);
      expect(data.liczba_pochodzen).toBeGreaterThan(0);
    });

    test('powinien zwrócić informacje o pochodzeniach z tabelami', () => {
      const { pochodzenia } = getOriginsListUi();
      expect(pochodzenia.length).toBeGreaterThan(0);

      pochodzenia.forEach(pochodzenie => {
        expect(pochodzenie).toHaveProperty('id');
        expect(pochodzenie).toHaveProperty('nazwa');
        expect(pochodzenie).toHaveProperty('zrodlo');
        expect(pochodzenie).toHaveProperty('ma_tabele');
        expect(pochodzenie).toHaveProperty('liczba_tabel');
        expect(pochodzenie).toHaveProperty('status');
        expect(typeof pochodzenie.ma_tabele).toBe('boolean');
        expect(typeof pochodzenie.liczba_tabel).toBe('number');
      });
    });
  });

  describe('getOriginTablesUI', () => {
    test('powinien zwrócić tabele dla istniejącego pochodzenia', () => {
      const tabele = getOriginTablesUi('czlowiek');

      expect(tabele).toHaveProperty('wiek');
      expect(tabele).toHaveProperty('budowa_ciala');
      expect(tabele).toHaveProperty('wyglad');
      expect(tabele).toHaveProperty('przeszlosc');
      expect(tabele).toHaveProperty('osobowosc');
      expect(tabele).toHaveProperty('religia');
    });

    test('powinien zwrócić null dla nieistniejącego pochodzenia', () => {
      expect(getOriginTablesUi('nieistniejace')).toBeNull();
    });

    test('powinien mieć prawidłową strukturę dla każdej tabeli', () => {
      const tabele = getOriginTablesUi('czlowiek');

      Object.values(tabele).forEach(tabela => {
        expect(tabela).toHaveProperty('nazwa');
        expect(tabela).toHaveProperty('typ');
        expect(tabela).toHaveProperty('opis');
        expect(tabela).toHaveProperty('opcje');

        expect(Array.isArray(tabela.opcje)).toBe(true);
        expect(tabela.opcje.length).toBeGreaterThan(0);

        tabela.opcje.forEach(opcja => {
          expect(opcja).toHaveProperty('rzut');
          expect(opcja).toHaveProperty('wynik');
          expect(typeof opcja.wynik).toBe('string');
        });
      });
    });
  });

  describe('rollTable - losowanie z tabeli', () => {
    test('powinien wykonać losowanie z tabeli wiek (3k6)', () => {
      const wynik = rollTable('czlowiek', 'wiek');

      expect(wynik).toHaveProperty('rzut');
      expect(wynik).toHaveProperty('wynik');
      expect(wynik).toHaveProperty('efekt');
      expect(wynik.rzut).toBeGreaterThanOrEqual(3);
      expect(wynik.rzut).toBeLessThanOrEqual(18);
    });

    test('powinien wykonać losowanie z tabeli przeszłość (k20)', () => {
      const wynik = rollTable('czlowiek', 'przeszlosc');

      expect(wynik.rzut).toBeGreaterThanOrEqual(1);
      expect(wynik.rzut).toBeLessThanOrEqual(20);
    });

    test('powinien rzucić błąd dla nieistniejącego pochodzenia', () => {
      expect(() => rollTable('nieistniejace', 'wiek')).toThrow('Nie znaleziono pochodzenia');
    });

    test('powinien rzucić błąd dla nieistniejącej tabeli', () => {
      expect(() => rollTable('czlowiek', 'nieistniejaca')).toThrow('Nie znaleziono tabeli');
    });

    test('wielokrotne losowanie z tabeli wiek powinno zawsze mieścić się w zakresie', () => {
      for (let i = 0; i < 10; i++) {
        const wynik = rollTable('czlowiek', 'wiek');
        expect(wynik.rzut).toBeGreaterThanOrEqual(3);
        expect(wynik.rzut).toBeLessThanOrEqual(18);
        expect(typeof wynik.wynik).toBe('string');
        expect(wynik.wynik.length).toBeGreaterThan(0);
      }
    });

    test('losowanie z tabeli przeszłość powinno czasem zwracać efekty mechaniczne', () => {
      const wyniki = [];
      for (let i = 0; i < 20; i++) {
        wyniki.push(rollTable('czlowiek', 'przeszlosc'));
      }

      const wynikiZEfektami = wyniki.filter(wynik => wynik.efekt && wynik.efekt !== 'Brak efektu mechanicznego');
      expect(wynikiZEfektami.length).toBeGreaterThan(0);
    });
  });
});
