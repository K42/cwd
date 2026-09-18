/**
 * Spłaszczanie tabel profesji i kuriozów z podręcznika do list przyjaznych UI
 * - przeniesione z dawnych endpointów GET /api/professions i GET /api/curios
 * w src/server.js
 */

import PROFESSIONS from '../data/professions.js';
import CURIOS from '../data/curios.js';

/**
 * Zwraca kategorie i spłaszczoną listę profesji
 * @returns {Object} { kategorie, profesje }
 */
function getProfessionsUi() {
  const kategorie = {
    'Naukowe': { nazwa: 'Naukowe' },
    'Pospolite': { nazwa: 'Pospolite' },
    'Przestępcze': { nazwa: 'Przestępcze' },
    'Wojenne': { nazwa: 'Wojenne' },
    'Koczownicze': { nazwa: 'Koczownicze' },
    'Religijne': { nazwa: 'Religijne' }
  };

  const profesje = [];
  if (PROFESSIONS && PROFESSIONS.tables) {
    const map = [
      ['Naukowe', PROFESSIONS.tables.naukowe],
      ['Pospolite', PROFESSIONS.tables.pospolite],
      ['Przestępcze', PROFESSIONS.tables.przestepcze],
      ['Wojenne', PROFESSIONS.tables.wojenne],
      ['Koczownicze', PROFESSIONS.tables.koczownicze],
      ['Religijne', PROFESSIONS.tables.religijne]
    ];
    map.forEach(([cat, arr]) => {
      (arr || []).forEach((text, idx) => {
        profesje.push({
          id: `${cat.toLowerCase()}_${idx + 1}`,
          nazwa: text,
          kategoria: cat,
          opis: '',
          zrodlo: 'PG'
        });
      });
    });
  }

  return { kategorie, profesje };
}

/**
 * Zwraca kategorie i spłaszczoną listę kuriozów
 * @returns {Object} { kategorie, kurioza }
 */
function getCuriosUi() {
  const kategorie = {
    'Tabela 1': { nazwa: 'Tabela 1' },
    'Tabela 2': { nazwa: 'Tabela 2' },
    'Tabela 3': { nazwa: 'Tabela 3' },
    'Tabela 4': { nazwa: 'Tabela 4' },
    'Tabela 5': { nazwa: 'Tabela 5' },
    'Tabela 6': { nazwa: 'Tabela 6' }
  };

  const kurioza = [];
  if (CURIOS && CURIOS.tables) {
    Object.entries(CURIOS.tables).forEach(([tableNum, items]) => {
      const cat = `Tabela ${tableNum}`;
      items.forEach((text, idx) => {
        kurioza.push({
          id: `t${tableNum}_k${idx + 1}`,
          nazwa: text,
          opis: '',
          efekt: '',
          wartosc: '',
          kategoria: cat,
          zrodlo: 'PG'
        });
      });
    });
  }

  return { kategorie, kurioza };
}

export { getProfessionsUi, getCuriosUi };
