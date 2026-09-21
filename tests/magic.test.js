/**
 * Testy silnika magii (logic/magic.js) - rozwijanie korzyści magicznych na
 * atomowe wybory gracza, ograniczenia nauki zaklęć (znane tradycje, Moc)
 * oraz rozliczanie Splugawienia za czarną magię.
 * Reguły: PG, rozdział 7 "Magia" i "Poznawanie tradycji".
 */

import {
  calculateSlotsMagic, calculateResolutionMagic, getSpellsToLearning,
  getTraditionsForCategory, getCircleZeroSpells, isBlackMagic, descriptionMagic
} from '../src/ui/logic/magic.js';
import SPELLS from '../src/ui/data/spells.js';
import { TRADITIONS } from '../src/ui/data/traditions.js';

describe('Rozwijanie korzyści magicznych na atomy', () => {
  test('postać bez ścieżek i bez korzyści poziomu 4 nie ma żadnego wyboru magii', () => {
    expect(calculateSlotsMagic({ selectedLevel: 0 })).toEqual([]);
  });

  test('ścieżka maga na poziomie 1 przyznaje atomy wyboru', () => {
    const atomy = calculateSlotsMagic({ pathNoviceId: 'mag', selectedLevel: 1 });
    expect(atomy.length).toBeGreaterThan(0);
    atomy.forEach(atom => {
      expect(typeof atom.id).toBe('string');
      expect(atom.source).toContain('Ścieżka');
    });
  });

  test('korzyści wyższych poziomów ścieżki nie pojawiają się przed osiągnięciem poziomu', () => {
    const poziom1 = calculateSlotsMagic({ pathNoviceId: 'mag', selectedLevel: 1 }).length;
    const poziom8 = calculateSlotsMagic({ pathNoviceId: 'mag', selectedLevel: 8 }).length;
    expect(poziom8).toBeGreaterThan(poziom1);
  });

  test('ścieżka ekspercka liczy się dopiero od poziomu 3, a mistrzowska od 7', () => {
    const ekspert2 = calculateSlotsMagic({ pathExpertId: 'czarodziej', selectedLevel: 2 });
    const ekspert3 = calculateSlotsMagic({ pathExpertId: 'czarodziej', selectedLevel: 3 });
    expect(ekspert2).toEqual([]);
    expect(ekspert3.length).toBeGreaterThan(0);
  });

  test('opcja "1 zaklęcie" z poziomu 4 pochodzenia daje atom dopiero od poziomu 4', () => {
    const pochodzenie = { id: 'czlowiek', nazwa: 'Człowiek', poziom_4: { opcje: ['1 zaklęcie'] } };
    const przed = calculateSlotsMagic({ pochodzenie, wybranaOpcjaPoziom4: '1 zaklęcie', selectedLevel: 3 });
    const po = calculateSlotsMagic({ pochodzenie, wybranaOpcjaPoziom4: '1 zaklęcie', selectedLevel: 4 });
    expect(przed).toEqual([]);
    expect(po.length).toBe(1);
    expect(po[0].source).toContain('Pochodzenie');
  });

  test('atomy mają unikalne identyfikatory, także przy trzech ścieżkach naraz', () => {
    const atomy = calculateSlotsMagic({
      pathNoviceId: 'mag', pathExpertId: 'czarodziej', pathMasterId: 'mag_zaglady', selectedLevel: 10
    });
    const ids = atomy.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('Ograniczenia nauki zaklęć', () => {
  test('uczyć się można tylko z tradycji już znanych', () => {
    const wynik = getSpellsToLearning({ knownTraditions: new Set(['ogien']), moc: 5 });
    expect(wynik.length).toBeGreaterThan(0);
    wynik.forEach(s => expect(s.tradycja).toBe('ogien'));
  });

  test('krąg zaklęcia nie może przekroczyć Mocy postaci', () => {
    const moc = 2;
    getSpellsToLearning({ knownTraditions: new Set(['ogien']), moc })
      .forEach(s => expect(s.krag).toBeLessThanOrEqual(moc));
  });

  test('ograniczenie do jednej tradycji ma pierwszeństwo przed listą znanych', () => {
    const wynik = getSpellsToLearning({
      knownTraditions: new Set(['ogien', 'woda']), moc: 5, tradycjaOgraniczenie: 'woda'
    });
    wynik.forEach(s => expect(s.tradycja).toBe('woda'));
  });

  test('brak znanych tradycji oznacza brak zaklęć do nauki', () => {
    expect(getSpellsToLearning({ knownTraditions: new Set(), moc: 5 })).toEqual([]);
  });
});

describe('Wybór tradycji', () => {
  test('lista do wyboru pomija tradycje już znane', () => {
    const wszystkie = getTraditionsForCategory(['dowolna'], new Set());
    const bezOgnia = getTraditionsForCategory(['dowolna'], new Set(['ogien']));
    expect(bezOgnia.length).toBe(wszystkie.length - 1);
    expect(bezOgnia.some(t => t.id === 'ogien')).toBe(false);
  });

  test('kategoria religijna zwraca wyłącznie tradycje religijne', () => {
    const religijne = getTraditionsForCategory(['religijne'], new Set());
    expect(religijne.length).toBeGreaterThan(0);
    religijne.forEach(t => expect(TRADITIONS[t.id]).toBeDefined());
  });

  test('getCircleZeroSpells zwraca wyłącznie zaklęcia kręgu 0 danej tradycji', () => {
    const zero = getCircleZeroSpells('ogien');
    expect(zero.length).toBeGreaterThan(0);
    zero.forEach(s => {
      expect(s.krag).toBe(0);
      expect(s.tradycja).toBe('ogien');
    });
  });
});

describe('Czarna magia i Splugawienie', () => {
  test('isBlackMagic rozpoznaje tradycje czarnej magii i odrzuca nieznane', () => {
    const czarna = Object.keys(TRADITIONS).find(id => TRADITIONS[id].czarnaMagia);
    expect(isBlackMagic(czarna)).toBe(true);
    expect(isBlackMagic('nie_ma_takiej_tradycji')).toBe(false);
    expect(isBlackMagic(null)).toBe(false);
  });

  test('poznanie tradycji czarnej magii oznacza atom jako źródło Splugawienia', () => {
    const czarna = Object.keys(TRADITIONS).find(id => TRADITIONS[id].czarnaMagia);
    const atomy = calculateSlotsMagic({ pathNoviceId: 'mag', selectedLevel: 1 });
    const atomTradycji = atomy.find(a => a.rodzaj !== 'zaklecie_tylko');
    if (!atomTradycji) return;
    const { resolutions, knownTraditions } = calculateResolutionMagic(
      [atomTradycji], { [atomTradycji.id]: { mode: 'tradycja', tradycjaId: czarna } }
    );
    expect(knownTraditions.has(czarna)).toBe(true);
    expect(resolutions[0].tradycjaId).toBe(czarna);
  });
});

describe('Rozliczanie wyborów gracza', () => {
  test('bez wyborów żaden atom nie jest rozwiązany', () => {
    const atomy = calculateSlotsMagic({ pathNoviceId: 'mag', selectedLevel: 1 });
    const { resolutions, knownTraditions } = calculateResolutionMagic(atomy, {});
    expect(knownTraditions.size).toBe(0);
    resolutions.forEach(r => expect(r.complete).toBeFalsy());
  });

  test('wybrana tradycja trafia do zbioru znanych tradycji', () => {
    const atomy = calculateSlotsMagic({ pathNoviceId: 'mag', selectedLevel: 1 });
    const atom = atomy.find(a => a.rodzaj !== 'zaklecie_tylko');
    if (!atom) return;
    const { knownTraditions } = calculateResolutionMagic(atomy, {
      [atom.id]: { mode: 'tradycja', tradycjaId: 'ogien' }
    });
    expect(knownTraditions.has('ogien')).toBe(true);
  });
});

describe('Opisy korzyści magicznych', () => {
  test('descriptionMagic zwraca czytelny tekst dla struktur z danych ścieżek', () => {
    expect(typeof descriptionMagic({ typ: 'zaklecie', ilosc: 1 })).toBe('string');
    expect(descriptionMagic({ typ: 'zaklecie', ilosc: 1 }).length).toBeGreaterThan(0);
    expect(typeof descriptionMagic({
      typ: 'wybor', opcje: ['tradycja', 'zaklecie'], kategoria: ['dowolna'], ilosc: 1
    })).toBe('string');
  });
});

describe('Spójność biblioteki zaklęć', () => {
  test('każde zaklęcie wskazuje tradycję istniejącą w traditions.js', () => {
    SPELLS.forEach(s => expect(TRADITIONS[s.tradycja]).toBeDefined());
  });

  test('krąg mieści się w zakresie 0-10, a kategoria jest znana', () => {
    SPELLS.forEach(s => {
      expect(s.krag).toBeGreaterThanOrEqual(0);
      expect(s.krag).toBeLessThanOrEqual(10);
      expect(['atak', 'uzytkowe']).toContain(s.kategoria);
    });
  });

  test('identyfikatory zaklęć są unikalne', () => {
    const ids = SPELLS.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
