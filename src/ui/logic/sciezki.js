/**
 * Logika ścieżek dla danego poziomu wyboru - przeniesiona z dawnego
 * endpointu GET /api/paths/:level w src/server.js
 */

import PATHS from '../data/paths.js';
import { getTalentDescription } from './talenty.js';

/**
 * Zwraca listę ścieżek dostępnych do wyboru na danym progu poziomu (1, 3, 7)
 * zgodnie z PG, w kształcie oczekiwanym przez UI.
 * @param {number} poziom - Próg wyboru ścieżki (1, 3 lub 7)
 * @returns {Array} Lista ścieżek
 * @throws {Error} Gdy próg poziomu jest nieprawidłowy
 */
function getPathsForLevel(poziom) {
  if (poziom === 1) {
    // Ścieżki nowicjuszy - poziom wyboru 1
    return Object.values(PATHS.sciezki_nowicjuszy).map(path => ({
      id: path.id,
      nazwa: path.nazwa,
      zrodlo: 'PG',
      opis: path.opis,
      korzysci: {
        1: {
          talenty: (path.poziom_1?.talenty || []).map(t => ({
            nazwa: t,
            opis: getTalentDescription(t)
          })),
          zaklecia: (path.poziom_1?.magia ? [{
            nazwa: 'Magia',
            opis: path.poziom_1.magia
          }] : []),
          mod_atrybuty: {},
          mod_drugorzedne: {
            zdrowie: parseInt(path.poziom_1?.zdrowie?.replace('+', '') || '0')
          },
          bieglosci: path.poziom_1?.jezyki_profesje ? [path.poziom_1.jezyki_profesje] : [],
          sprzet: []
        }
      }
    }));
  } else if (poziom === 3) {
    // Ścieżki ekspertów - poziom wyboru 3
    return Object.values(PATHS.sciezki_ekspertow).map(path => ({
      id: path.id,
      nazwa: path.nazwa,
      zrodlo: 'PG',
      opis: path.opis,
      korzysci: {
        3: {
          talenty: (path.poziom_3?.talenty || []).map(t => ({
            nazwa: t,
            opis: getTalentDescription(t)
          })),
          zaklecia: (path.poziom_3?.magia ? [{
            nazwa: 'Magia',
            opis: path.poziom_3.magia
          }] : []),
          mod_atrybuty: {},
          mod_drugorzedne: {
            zdrowie: parseInt(path.poziom_3?.zdrowie?.replace('+', '') || '0')
          },
          bieglosci: path.poziom_3?.jezyki_profesje ? [path.poziom_3.jezyki_profesje] : [],
          sprzet: []
        }
      }
    }));
  } else if (poziom === 7) {
    // Ścieżki mistrzów - poziom wyboru 7 (w PG to poziom 5, ale w systemie to 7)
    return Object.values(PATHS.sciezki_mistrzow).map(path => ({
      id: path.id,
      nazwa: path.nazwa,
      zrodlo: 'PG',
      opis: path.opis,
      korzysci: {
        7: {
          talenty: (path.poziom_5?.talent ? [{
            nazwa: path.poziom_5.talent,
            opis: getTalentDescription(path.poziom_5.talent)
          }] : []),
          zaklecia: (path.poziom_5?.magia ? [{
            nazwa: 'Magia',
            opis: path.poziom_5.magia
          }] : []),
          mod_atrybuty: {},
          mod_drugorzedne: {
            zdrowie: parseInt(path.poziom_5?.zdrowie?.replace('+', '') || '0')
          },
          bieglosci: path.poziom_5?.jezyki_profesje ? [path.poziom_5.jezyki_profesje] : [],
          sprzet: []
        }
      }
    }));
  }

  throw new Error('Nieprawidłowy poziom wyboru ścieżki');
}

export { getPathsForLevel };
