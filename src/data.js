/**
 * Dane gry - wszystkie tabele lookup dla Cienia Władcy Demonów
 * Źródło: Podręcznik główny + suplementy
 */

// Import wszystkich modułów danych
const ORIGINS = require('./data/origins');
const LEVELS = require('./data/levels');
const PATHS = require('./data/paths');
const ITEMS = require('./data/items');
const SPELLS = require('./data/spells');

const DANE_GRY = {
  // Poziomy postaci - system progresji
  poziomy: LEVELS,

  // Pochodzenia - wszystkie dostępne w podręcznikach
  pochodzenia: ORIGINS,

  // Ścieżki nowicjuszy - str. 51-70
  sciezki_nowicjuszy: PATHS.sciezki_nowicjuszy,

  // Kalkulatory atrybutów
  obliczenia: {
    /**
     * Generuje losowe wartości atrybutów (3-18)
     * @returns {Object} Obiekt z atrybutami
     */
    losowe_atrybuty() {
      return {
        sila: Math.floor(Math.random() * 16) + 3,
        zrecznosc: Math.floor(Math.random() * 16) + 3,
        intelekt: Math.floor(Math.random() * 16) + 3,
        wola: Math.floor(Math.random() * 16) + 3
      };
    },

    /**
     * Oblicza atrybuty drugorzędne na podstawie podstawowych
     * @param {Object} atrybuty - Atrybuty podstawowe
     * @param {Object} pochodzenie - Dane pochodzenia
     * @returns {Object} Atrybuty drugorzędne
     */
    atrybuty_drugorzedne(atrybuty, pochodzenie) {
      let obrona = atrybuty.zrecznosc;

      // --- BŁĘDNY KOD - DO USUNIĘCIA (AC-008) ---
      const rozmiar = pochodzenie.rozmiar;
      if (rozmiar === '1/4') {
        obrona += 4;
      } else if (rozmiar === '1/2') {
        obrona += 2;
      } else if (rozmiar === '2') {
        obrona -= 2;
      }
      // --- KONIEC BŁĘDNEGO KODU ---

      return {
        percepcja: atrybuty.intelekt,
        obrona: Math.max(obrona, 1),
        zdrowie: atrybuty.sila,
        szybkosc_zdrowienia: Math.floor(atrybuty.sila / 4) || 1,
        rozmiar: pochodzenie.rozmiar,
        predkosc: pochodzenie.predkosc,
        moc: 0
      };
    },

    /**
     * Oblicza wartość modyfikatora na podstawie atrybutu
     * @param {number} atrybut - Wartość atrybutu
     * @returns {number} Modyfikator
     */
    modyfikator_atrybutu(atrybut) {
      return Math.floor((atrybut - 10) / 2);
    }
  },

  // Przedmioty i wyposażenie
  przedmioty: ITEMS,

  // Zaklęcia i magia
  zaklecia: SPELLS,

  // Dodatkowe funkcje pomocnicze
  utils: {
    /**
     * Formatuje modyfikator atrybutu
     * @param {number} modyfikator - Wartość modyfikatora
     * @returns {string} Sformatowany modyfikator
     */
    formatujModyfikator(modyfikator) {
      if (modyfikator >= 0) {
        return `+${modyfikator}`;
      }
      return `${modyfikator}`;
    },

    /**
     * Sprawdza czy pochodzenie istnieje
     * @param {string} id - ID pochodzenia
     * @returns {boolean} True jeśli pochodzenie istnieje
     */
    czyPochodzenieIstnieje(id) {
      return ORIGINS.hasOwnProperty(id);
    },

    /**
     * Sprawdza czy poziom istnieje
     * @param {number} poziom - Poziom postaci
     * @returns {boolean} True jeśli poziom istnieje
     */
    czyPoziomIstnieje(poziom) {
      return LEVELS.hasOwnProperty(poziom);
    },

    /**
     * Zwraca listę wszystkich dostępnych pochodzeń
     * @returns {Array} Lista ID pochodzeń
     */
    pobierzListePochodzen() {
      return Object.keys(ORIGINS);
    },

    /**
     * Zwraca listę wszystkich dostępnych poziomów
     * @returns {Array} Lista poziomów
     */
    pobierzListePoziomow() {
      return Object.keys(LEVELS).map(Number);
    }
  }
};

module.exports = DANE_GRY;