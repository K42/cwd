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
          atrybuty_glowne: pkt.atrybuty_glowne || null,
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

/**
 * Oblicza sloty zwiększenia atrybutów głównych przyznane przez wybrane
 * ścieżki (PG: "Zwiększ dwa/trzy dowolne o 1" przy wyborze ścieżki
 * eksperckiej/mistrzowskiej, a u Maga/Wojownika także na poziomie 1).
 * @param {Object} params
 * @param {string} params.sciezkaNowicjuszaId
 * @param {string} params.sciezkaEksperckaId
 * @param {string} params.sciezkaMistrzowskaId
 * @returns {Array<{id: string, source: string, ilosc: number, wartosc: number, dostepne: string[]}>}
 */
function obliczSlotyAtrybutow({ sciezkaNowicjuszaId, sciezkaEksperckaId, sciezkaMistrzowskaId }) {
  const sloty = [];

  const dodaj = (grupaKey, sciezkaId, etykieta) => {
    if (!sciezkaId) return;
    const grupa = PATHS[grupaKey];
    const sciezka = grupa && grupa[sciezkaId];
    const grant = sciezka && sciezka.poziom_1 && sciezka.poziom_1.atrybuty_glowne;
    if (!grant) return;
    sloty.push({
      id: `${sciezkaId}-atr`,
      source: `Ścieżka: ${sciezka.nazwa} (${etykieta})`,
      ilosc: grant.ilosc,
      wartosc: grant.wartosc,
      dostepne: grant.dostepne
    });
  };

  dodaj('sciezki_nowicjuszy', sciezkaNowicjuszaId, 'poziom 1');
  dodaj('sciezki_ekspertow', sciezkaEksperckaId, 'poziom 3');
  dodaj('sciezki_mistrzow', sciezkaMistrzowskaId, 'poziom 7');

  return sloty;
}

export { getPathsForLevel, obliczSlotyAtrybutow };
