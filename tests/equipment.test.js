/**
 * Testy silnika ekwipunku (logic/equipment.js) - przeliczenia walut, ceny
 * skupu, rozwijanie wyposażenia startowego na atomowe wybory gracza.
 * Reguły: PG, "Początkowe wyposażenie" (str. 25-26) oraz rozdział "Ekwipunek".
 */

import {
  priceOnCopperbits, priceBuybackCopperbits, formatCopperbits, formatPrice,
  getItem, calculateAtomsGear, getGuaranteedEntries, formatStatsItem, sortItems,
  CONVERTER_TO_COPPERBITS, RARITY_LABELS, CATEGORY_LABELS_EQ
} from '../src/ui/logic/equipment.js';
import EQUIPMENT from '../src/ui/data/equipment.js';
import { WEALTH } from '../src/ui/data/wealth.js';

describe('Przeliczanie walut', () => {
  test('kurs jednostek zgodny z PG: 10 okrawków = 1 miedziak, 10 miedziaków = 1 srebrnik, 10 srebrników = 1 złota korona', () => {
    expect(CONVERTER_TO_COPPERBITS.okr).toBe(1);
    expect(CONVERTER_TO_COPPERBITS.md).toBe(10);
    expect(CONVERTER_TO_COPPERBITS.sr).toBe(100);
    expect(CONVERTER_TO_COPPERBITS.zk).toBe(1000);
  });

  test('priceOnCopperbits przelicza cenę na okrawki', () => {
    expect(priceOnCopperbits({ wartosc: 5, jednostka: 'md' })).toBe(50);
    expect(priceOnCopperbits({ wartosc: 2, jednostka: 'zk' })).toBe(2000);
    expect(priceOnCopperbits(null)).toBe(0);
  });

  test('formatCopperbits rozbija kwotę na największe pasujące nominały', () => {
    expect(formatCopperbits(0)).toBe('0 okr.');
    expect(formatCopperbits(5)).toBe('5 okr.');
    expect(formatCopperbits(50)).toBe('5 md');
    expect(formatCopperbits(1300)).toBe('1 zk 3 sr');
    expect(formatCopperbits(1234)).toBe('1 zk 2 sr 3 md 4 okr.');
  });

  test('formatCopperbits nie przyjmuje wartości ujemnych ani nieliczbowych', () => {
    expect(formatCopperbits(-10)).toBe('0 okr.');
    expect(formatCopperbits(NaN)).toBe('0 okr.');
  });

  test('formatPrice pokazuje przybliżenie dla cen orientacyjnych', () => {
    expect(formatPrice({ wartosc: 5, jednostka: 'md' })).toBe('5 md');
    expect(formatPrice({ wartosc: 5, jednostka: 'md', orientacyjna: true })).toBe('min. 5 md');
    expect(formatPrice(null)).toBe('—');
  });
});

describe('Cena skupu', () => {
  test('sprzedaż daje dokładnie połowę ceny bazowej, zaokrągloną w dół', () => {
    expect(priceBuybackCopperbits({ wartosc: 5, jednostka: 'md' })).toBe(25);
    expect(priceBuybackCopperbits({ wartosc: 1, jednostka: 'md' })).toBe(5);
    expect(priceBuybackCopperbits({ wartosc: 5, jednostka: 'okr' })).toBe(2);
  });

  test('przedmiot bez ceny nie ma wartości skupu', () => {
    expect(priceBuybackCopperbits(null)).toBe(0);
  });
});

describe('Katalog przedmiotów', () => {
  test('getItem znajduje przedmiot po id i zwraca null dla nieznanego', () => {
    expect(getItem('plecak')).not.toBeNull();
    expect(getItem('nie_ma_takiego_przedmiotu')).toBeNull();
  });

  test('każdy przedmiot ma unikalne id', () => {
    const ids = EQUIPMENT.map(i => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('kategorie i rzadkości przedmiotów mieszczą się w znanych słownikach', () => {
    EQUIPMENT.forEach(item => {
      expect(Object.keys(CATEGORY_LABELS_EQ)).toContain(item.kategoria);
      if (item.rzadkosc) {
        expect(Object.keys(RARITY_LABELS)).toContain(item.rzadkosc);
      }
    });
  });

  test('sortItems porządkuje rosnąco i malejąco po cenie', () => {
    const zCena = EQUIPMENT.filter(i => i.cena).slice(0, 30);
    const rosnaco = sortItems(zCena, 'cena', 'asc').map(i => priceOnCopperbits(i.cena));
    const malejaco = sortItems(zCena, 'cena', 'desc').map(i => priceOnCopperbits(i.cena));
    expect([...rosnaco].sort((a, b) => a - b)).toEqual(rosnaco);
    expect(rosnaco[0]).toBe(malejaco[malejaco.length - 1]);
  });

  test('formatStatsItem opisuje broń, a dla zwykłego wyposażenia zwraca null', () => {
    const bron = EQUIPMENT.find(i => i.kategoria === 'bron_biala' && i.obrazenia);
    expect(formatStatsItem(bron)).toContain('Obrażenia');
    expect(formatStatsItem(null)).toBeNull();
  });
});

describe('Wyposażenie startowe wg Zamożności', () => {
  test('każdy poziom Zamożności zwraca gwarantowane pozycje', () => {
    Object.keys(WEALTH).forEach(id => {
      expect(Array.isArray(getGuaranteedEntries(id))).toBe(true);
    });
  });

  test('atomy wyboru powstają tylko z pozycji oznaczonych jako wybór', () => {
    Object.keys(WEALTH).forEach(id => {
      const atomy = calculateAtomsGear(id);
      atomy.forEach(atom => {
        expect(['wybor_przedmiotu', 'wybor_dodatkowy']).toContain(atom.rodzaj);
        expect(atom.id.startsWith(id)).toBe(true);
        expect(Array.isArray(atom.opcje)).toBe(true);
        expect(atom.opcje.length).toBeGreaterThan(0);
      });
    });
  });

  test('atomy mają unikalne identyfikatory w obrębie poziomu Zamożności', () => {
    Object.keys(WEALTH).forEach(id => {
      const ids = calculateAtomsGear(id).map(a => a.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  test('opcje wyboru przedmiotu wskazują na istniejące pozycje katalogu', () => {
    Object.keys(WEALTH).forEach(id => {
      calculateAtomsGear(id)
        .filter(a => a.rodzaj === 'wybor_przedmiotu')
        .forEach(atom => atom.opcje.forEach(itemId => {
          expect(getItem(itemId)).not.toBeNull();
        }));
    });
  });

  test('nieznany poziom Zamożności nie wysypuje silnika', () => {
    expect(calculateAtomsGear('nie_ma_takiej_zamoznosci')).toEqual([]);
    expect(getGuaranteedEntries('nie_ma_takiej_zamoznosci')).toEqual([]);
  });
});
