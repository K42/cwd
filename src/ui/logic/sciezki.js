/**
 * Logika ścieżek dla danego poziomu wyboru - przeniesiona z dawnego
 * endpointu GET /api/paths/:level w src/server.js
 */

import PATHS from '../data/paths.js';
import { getTalentDescription } from './talenty.js';

/**
 * Zwraca grupę ścieżek (obiekt id -> ścieżka) z danych PATHS odpowiadającą
 * progowi wyboru (1 = nowicjusz, 3 = ekspert, 7 = mistrz).
 * @param {number} poziom - Próg wyboru ścieżki (1, 3 lub 7)
 * @returns {Object}
 * @throws {Error} Gdy próg poziomu jest nieprawidłowy
 */
function getGrupaSciezekDlaPoziomu(poziom) {
  if (poziom === 1) return PATHS.sciezki_nowicjuszy;
  if (poziom === 3) return PATHS.sciezki_ekspertow;
  if (poziom === 7) return PATHS.sciezki_mistrzow;
  throw new Error('Nieprawidłowy poziom wyboru ścieżki');
}

/**
 * Zwraca listę ścieżek dostępnych do wyboru na danym progu poziomu (1, 3, 7)
 * zgodnie z PG, w kształcie oczekiwanym przez UI.
 *
 * Każda ścieżka (niezależnie od progu) przechowuje swoje korzyści przy
 * wyborze pod kluczem `poziom_1` w danych źródłowych - to korzyści
 * przyznawane w chwili wyboru ścieżki, nie realny poziom drużyny.
 * @param {number} poziom - Próg wyboru ścieżki (1, 3 lub 7)
 * @returns {Array} Lista ścieżek
 * @throws {Error} Gdy próg poziomu jest nieprawidłowy
 */
function getPathsForLevel(poziom) {
  const grupa = getGrupaSciezekDlaPoziomu(poziom);

  return Object.values(grupa).map(path => {
    const pkt = path.poziom_1 || {};
    return {
      id: path.id,
      nazwa: path.nazwa,
      zrodlo: 'PG',
      opis: path.opis,
      korzysci: {
        [poziom]: {
          talenty: (pkt.talenty || []).map(t => ({
            nazwa: t,
            opis: getTalentDescription(t)
          })),
          zaklecia: (pkt.magia ? [{
            nazwa: 'Magia',
            opis: pkt.magia
          }] : []),
          mod_atrybuty: {},
          mod_drugorzedne: {
            zdrowie: parseInt(pkt.zdrowie?.replace('+', '') || '0')
          },
          bieglosci: pkt.jezyki_profesje ? [pkt.jezyki_profesje.opis] : [],
          jezyki_profesje: pkt.jezyki_profesje || null,
          sprzet: []
        }
      }
    };
  });
}

export { getPathsForLevel };
