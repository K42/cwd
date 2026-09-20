/**
 * Testy logic/paths.js (sloty atrybutów ze ścieżek, mapowanie poziom <-> klucz
 * korzyści) oraz logic/saves.js (zapis postaci w pamięci przeglądarki).
 */

import PATHS, { PATH_LEVEL_KEYS, getBenefitKeyForLevel } from '../src/ui/data/paths.js';
import { getPathsForLevel, calculateSlotsAttributes } from '../src/ui/logic/paths.js';
import { getSavedCharacters, saveCharacterToCache, generateSaveId, clearSavedCharacters } from '../src/ui/logic/saves.js';

describe('Mapowanie poziomu postaci na klucz korzyści ścieżki', () => {
  test('ścieżki nowicjusza używają bezwzględnych poziomów 1, 2, 5, 8', () => {
    expect(getBenefitKeyForLevel('sciezki_nowicjuszy', 1)).toBe('poziom_1');
    expect(getBenefitKeyForLevel('sciezki_nowicjuszy', 5)).toBe('poziom_5');
    expect(getBenefitKeyForLevel('sciezki_nowicjuszy', 8)).toBe('poziom_8');
  });

  test('pierwszy pakiet ścieżki eksperckiej wypada na poziomie 3, a mistrzowskiej na 7', () => {
    expect(getBenefitKeyForLevel('sciezki_ekspertow', 3)).toBe('poziom_1');
    expect(getBenefitKeyForLevel('sciezki_mistrzow', 7)).toBe('poziom_1');
  });

  test('poziom, na którym dana grupa nic nie przyznaje, zwraca null', () => {
    expect(getBenefitKeyForLevel('sciezki_ekspertow', 2)).toBeNull();
    expect(getBenefitKeyForLevel('sciezki_mistrzow', 5)).toBeNull();
    expect(getBenefitKeyForLevel('nie_ma_takiej_grupy', 1)).toBeNull();
  });

  test('każdy klucz w danych ścieżek jest opisany w PATH_LEVEL_KEYS', () => {
    Object.entries(PATH_LEVEL_KEYS).forEach(([grupa, mapa]) => {
      Object.values(PATHS[grupa]).forEach(sciezka => {
        Object.keys(sciezka)
          .filter(k => k.startsWith('poziom_'))
          .forEach(klucz => expect(mapa[klucz]).toBeDefined());
      });
    });
  });
});

describe('Lista ścieżek dla progu wyboru', () => {
  test.each([1, 3, 7])('próg %i zwraca niepustą listę z kompletem pól', (prog) => {
    const lista = getPathsForLevel(prog);
    expect(lista.length).toBeGreaterThan(0);
    lista.forEach(p => {
      expect(p.id).toBeTruthy();
      expect(p.nazwa).toBeTruthy();
      expect(p.zrodlo).toBeTruthy();
      expect(p.korzysci[prog]).toBeDefined();
    });
  });

  test('nieprawidłowy próg wyboru ścieżki kończy się błędem', () => {
    expect(() => getPathsForLevel(4)).toThrow();
  });

  test('źródło ścieżki pochodzi z danych, a nie jest zapisane na sztywno', () => {
    const mistrzowskie = getPathsForLevel(7);
    const zCS = mistrzowskie.filter(p => p.zrodlo === 'CS');
    expect(zCS.length).toBeGreaterThan(0);
  });
});

describe('Sloty zwiększenia atrybutów ze ścieżek', () => {
  test('brak ścieżek oznacza brak slotów', () => {
    expect(calculateSlotsAttributes({})).toEqual([]);
  });

  test('ścieżka nowicjusza maga przyznaje slot wyboru atrybutów', () => {
    const sloty = calculateSlotsAttributes({ pathNoviceId: 'mag' });
    expect(sloty.length).toBeGreaterThan(0);
    sloty.forEach(slot => {
      expect(slot.ilosc).toBeGreaterThan(0);
      expect(Array.isArray(slot.dostepne)).toBe(true);
      expect(slot.dostepne.length).toBeGreaterThan(0);
    });
  });

  test('trzy ścieżki naraz dają sloty o unikalnych identyfikatorach', () => {
    const sloty = calculateSlotsAttributes({
      pathNoviceId: 'mag', pathExpertId: 'czarodziej', pathMasterId: 'mag_zaglady'
    });
    const ids = sloty.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('Zapis postaci w pamięci przeglądarki', () => {
  beforeEach(() => {
    const sklep = {};
    global.localStorage = {
      getItem: (k) => (k in sklep ? sklep[k] : null),
      setItem: (k, v) => { sklep[k] = String(v); },
      removeItem: (k) => { delete sklep[k]; }
    };
  });

  test('pusta pamięć zwraca pusty obiekt', () => {
    expect(getSavedCharacters()).toEqual({});
  });

  test('zapisana postać daje się odczytać pod swoim id', () => {
    expect(saveCharacterToCache('postac-1', { wybory: { pochodzenie: 'elf' } })).toBe(true);
    const wszystkie = getSavedCharacters();
    expect(Object.keys(wszystkie)).toEqual(['postac-1']);
    expect(wszystkie['postac-1'].data.wybory.pochodzenie).toBe('elf');
    expect(wszystkie['postac-1'].savedAt).toBeTruthy();
  });

  test('zapis pod istniejącym id nadpisuje wpis, nie tworzy drugiego', () => {
    saveCharacterToCache('postac-1', { wybory: { pochodzenie: 'elf' } });
    saveCharacterToCache('postac-1', { wybory: { pochodzenie: 'ork' } });
    const wszystkie = getSavedCharacters();
    expect(Object.keys(wszystkie).length).toBe(1);
    expect(wszystkie['postac-1'].data.wybory.pochodzenie).toBe('ork');
  });

  test('czyszczenie usuwa wszystkie zapisane postacie', () => {
    saveCharacterToCache('a', { wybory: {} });
    saveCharacterToCache('b', { wybory: {} });
    expect(Object.keys(getSavedCharacters()).length).toBe(2);
    expect(clearSavedCharacters()).toBe(true);
    expect(getSavedCharacters()).toEqual({});
  });

  test('uszkodzona zawartość pamięci nie wysypuje odczytu', () => {
    global.localStorage.setItem('kreatorPostaci.zapisanePostacie.v1', 'to nie jest JSON');
    expect(getSavedCharacters()).toEqual({});
  });

  test('generateSaveId tworzy różne identyfikatory', () => {
    const ids = new Set(Array.from({ length: 50 }, () => generateSaveId()));
    expect(ids.size).toBe(50);
  });
});
