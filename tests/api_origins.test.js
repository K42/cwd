/**
 * Testy jednostkowe dla API pochodzeń - Sprint 2
 * Testy endpointów /api/origins/* zgodnie z AC-012 i AC-013
 */

const request = require('supertest');
const { app } = require('../src/server');

describe('API Pochodzeń - Sprint 2', () => {
  
  describe('GET /api/origins', () => {
    test('powinien zwrócić listę dostępnych pochodzeń', async () => {
      const response = await request(app)
        .get('/api/origins')
        .expect(200);
      
      expect(response.body).toHaveProperty('pochodzenia');
      expect(response.body).toHaveProperty('liczba_pochodzen');
      expect(response.body).toHaveProperty('pochodzenia_z_tabelami');
      
      expect(Array.isArray(response.body.pochodzenia)).toBe(true);
      expect(response.body.liczba_pochodzen).toBeGreaterThan(0);
    });

    test('powinien zwrócić informacje o pochodzeniach z tabelami', async () => {
      const response = await request(app)
        .get('/api/origins')
        .expect(200);
      
      const pochodzenia = response.body.pochodzenia;
      expect(pochodzenia.length).toBeGreaterThan(0);
      
      // Sprawdź strukturę każdego pochodzenia
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

  describe('GET /api/origins/:originId/tables', () => {
    test('powinien zwrócić tabele dla istniejącego pochodzenia', async () => {
      const response = await request(app)
        .get('/api/origins/czlowiek/tables')
        .expect(200);
      
      expect(response.body).toHaveProperty('pochodzenie');
      expect(response.body).toHaveProperty('tabele');
      
      expect(response.body.pochodzenie.id).toBe('czlowiek');
      expect(response.body.pochodzenie.nazwa).toBe('Człowiek');
      expect(response.body.pochodzenie.zrodlo).toBe('PG');
      
      expect(response.body.tabele).toHaveProperty('wiek');
      expect(response.body.tabele).toHaveProperty('budowa_ciala');
      expect(response.body.tabele).toHaveProperty('wyglad');
      expect(response.body.tabele).toHaveProperty('przeszlosc');
      expect(response.body.tabele).toHaveProperty('osobowosc');
      expect(response.body.tabele).toHaveProperty('religia');
    });

    test('powinien zwrócić 404 dla nieistniejącego pochodzenia', async () => {
      const response = await request(app)
        .get('/api/origins/nieistniejace/tables')
        .expect(404);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('dostepne');
      expect(response.body.error).toContain('nie ma tabel losowania');
    });

    test('powinien zwrócić 404 dla pochodzenia bez tabel', async () => {
      // To test wymagałby pochodzenia bez tabel - na razie wszystkie mają tabele
      // W przyszłości można dodać test dla pochodzenia bez tabel
    });
  });

  describe('POST /api/origins/:originId/tables/:tableName/roll', () => {
    test('powinien wykonać losowanie z tabeli wiek', async () => {
      const response = await request(app)
        .post('/api/origins/czlowiek/tables/wiek/roll')
        .expect(200);
      
      expect(response.body).toHaveProperty('pochodzenie');
      expect(response.body).toHaveProperty('tabela');
      expect(response.body).toHaveProperty('wynik');
      expect(response.body).toHaveProperty('timestamp');
      
      expect(response.body.pochodzenie.id).toBe('czlowiek');
      expect(response.body.tabela.nazwa).toBe('Wiek');
      expect(response.body.tabela.typ).toBe('3k6');
      
      expect(response.body.wynik).toHaveProperty('rzut');
      expect(response.body.wynik).toHaveProperty('wynik');
      expect(response.body.wynik).toHaveProperty('rzut');
      
      // Sprawdź czy wartość rzutu jest w prawidłowym zakresie dla 3k6 (3-18)
      expect(response.body.wynik.rzut).toBeGreaterThanOrEqual(3);
      expect(response.body.wynik.rzut).toBeLessThanOrEqual(18);
    });

    test('powinien wykonać losowanie z tabeli przeszłość', async () => {
      const response = await request(app)
        .post('/api/origins/czlowiek/tables/przeszlosc/roll')
        .expect(200);
      
      expect(response.body.wynik).toHaveProperty('rzut');
      expect(response.body.wynik).toHaveProperty('wynik');
      expect(response.body.wynik).toHaveProperty('rzut');
      
      // Sprawdź czy wartość rzutu jest w prawidłowym zakresie dla k20 (1-20)
      expect(response.body.wynik.wartosc_rzutu).toBeGreaterThanOrEqual(1);
      expect(response.body.wynik.wartosc_rzutu).toBeLessThanOrEqual(20);
    });

    test('powinien zwrócić 404 dla nieistniejącego pochodzenia', async () => {
      const response = await request(app)
        .post('/api/origins/nieistniejace/tables/wiek/roll')
        .expect(404);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Nie znaleziono pochodzenia');
    });

    test('powinien zwrócić 404 dla nieistniejącej tabeli', async () => {
      const response = await request(app)
        .post('/api/origins/czlowiek/tables/nieistniejaca/roll')
        .expect(404);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('dostepne_tabele');
      expect(response.body.error).toContain('nie istnieje');
    });
  });

  describe('Walidacja wyników losowania', () => {
    test('losowanie z tabeli wiek powinno zwracać prawidłowe wyniki', async () => {
      // Wykonaj kilka losowań i sprawdź czy wszystkie są prawidłowe
      const wyniki = [];
      for (let i = 0; i < 10; i++) {
        const response = await request(app)
          .post('/api/origins/czlowiek/tables/wiek/roll')
          .expect(200);
        
        wyniki.push(response.body.wynik);
      }
      
      // Sprawdź czy wszystkie wyniki mają prawidłowe wartości
      wyniki.forEach(wynik => {
        expect(wynik.rzut).toBeGreaterThanOrEqual(3);
        expect(wynik.rzut).toBeLessThanOrEqual(18);
        expect(wynik.wynik).toBeDefined();
        expect(typeof wynik.wynik).toBe('string');
        expect(wynik.wynik.length).toBeGreaterThan(0);
      });
    });

    test('losowanie z tabeli przeszłość powinno zwracać efekty mechaniczne', async () => {
      // Wykonaj kilka losowań i sprawdź czy niektóre mają efekty
      const wyniki = [];
      for (let i = 0; i < 20; i++) {
        const response = await request(app)
          .post('/api/origins/czlowiek/tables/przeszlosc/roll')
          .expect(200);
        
        wyniki.push(response.body.wynik);
      }
      
      // Sprawdź czy przynajmniej jeden wynik ma efekt mechaniczny
      const wynikiZEfektami = wyniki.filter(wynik => wynik.efekt);
      expect(wynikiZEfektami.length).toBeGreaterThan(0);
      
      // Sprawdź konkretne efekty
      const wynik1 = wyniki.find(w => w.rzut === '1');
      if (wynik1) {
        expect(wynik1.efekt).toEqual({ szalenstwo: '1k6' });
      }
    });
  });

  describe('Struktura odpowiedzi API', () => {
    test('odpowiedź powinna mieć prawidłową strukturę dla tabel', async () => {
      const response = await request(app)
        .get('/api/origins/czlowiek/tables')
        .expect(200);
      
      const tabele = response.body.tabele;
      
      // Sprawdź strukturę każdej tabeli
      Object.values(tabele).forEach(tabela => {
        expect(tabela).toHaveProperty('nazwa');
        expect(tabela).toHaveProperty('typ');
        expect(tabela).toHaveProperty('opis');
        expect(tabela).toHaveProperty('opcje');
        
        expect(Array.isArray(tabela.opcje)).toBe(true);
        expect(tabela.opcje.length).toBeGreaterThan(0);
        
        // Sprawdź strukturę opcji
        tabela.opcje.forEach(opcja => {
          expect(opcja).toHaveProperty('rzut');
          expect(opcja).toHaveProperty('wynik');
          expect(typeof opcja.wynik).toBe('string');
        });
      });
    });

    test('odpowiedź powinna mieć prawidłową strukturę dla losowania', async () => {
      const response = await request(app)
        .post('/api/origins/czlowiek/tables/wiek/roll')
        .expect(200);
      
      expect(response.body).toHaveProperty('pochodzenie');
      expect(response.body).toHaveProperty('tabela');
      expect(response.body).toHaveProperty('wynik');
      expect(response.body).toHaveProperty('timestamp');
      
      expect(response.body.pochodzenie).toHaveProperty('id');
      expect(response.body.pochodzenie).toHaveProperty('nazwa');
      
      expect(response.body.tabela).toHaveProperty('nazwa');
      expect(response.body.tabela).toHaveProperty('typ');
      expect(response.body.tabela).toHaveProperty('opis');
      
      expect(response.body.wynik).toHaveProperty('rzut');
      expect(response.body.wynik).toHaveProperty('wynik');
      expect(response.body.wynik).toHaveProperty('rzut');
    });
  });
});

