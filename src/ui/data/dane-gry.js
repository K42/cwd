/**
 * Dane gry - wszystkie tabele lookup dla Cienia Władcy Demonów
 * Źródło: Podręcznik główny + suplementy
 */

// Import wszystkich modułów danych
import ORIGINS from './origins.js';
import LEVELS from './levels.js';
import PATHS from './paths.js';
import ITEMS from './items.js';
import SPELLS from './spells.js';
import PROGRESSION from './progression.js';

const DANE_GRY = {
  // Poziomy postaci - system progresji
  poziomy: LEVELS,

  // Pochodzenia - wszystkie dostępne w podręcznikach
  pochodzenia: ORIGINS,

  // Ścieżki nowicjuszy - str. 51-70
  sciezki_nowicjuszy: PATHS.sciezki_nowicjuszy,

  // Ścieżki ekspertów (poziom 3)
  sciezki_ekspertow: PATHS.sciezki_ekspertow,

  // Ścieżki mistrzów (poziom 5)
  sciezki_mistrzow: PATHS.sciezki_mistrzow,

  // Ścieżki legend (poziom 7)
  sciezki_legend: PATHS.sciezki_legend,

  // Ścieżki kontynuacji (poziomy 2, 4, 6, 8)
  sciezki_kontynuacji: PATHS.sciezki_kontynuacji,

  // System progresji
  progresja: PROGRESSION,

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
     * Oblicza atrybuty drugorzędne zgodnie z zasadami z PDF
     * @param {Object} atrybuty - Atrybuty główne postaci
     * @param {Object} pochodzenie - Dane pochodzenia
     * @param {number} poziom - Poziom postaci (0-10)
     * @returns {Object} Atrybuty drugorzędne
     */
    atrybuty_drugorzedne(atrybuty, pochodzenie) {
      // AC-008: Usunięto błędne modyfikatory rozmiaru wpływające na obronę
      // Zgodnie z PDF str. 17 - nie ma modyfikatorów rozmiaru wpływających na atrybuty
      
      return {
        percepcja: atrybuty.intelekt,
        obrona: Math.max(atrybuty.zrecznosc, 1),
        zdrowie: atrybuty.sila,
        szybkosc_zdrowienia: Math.floor(atrybuty.sila / 4) || 1,
        rozmiar: pochodzenie.rozmiar,
        predkosc: pochodzenie.predkosc,
        moc: 0
      };
    },

    /**
     * Oblicza atrybuty postaci zgodnie z zasadami tworzenia
     * @param {Object} pochodzenie - Dane pochodzenia
     * @param {Object} wybor_atrybutu - Wybór gracza (+1 do wybranego atrybutu)
     * @returns {Object} Finalne atrybuty postaci
     */
    oblicz_atrybuty_poczatkowe(pochodzenie, wybor_atrybutu) {
      const atrybuty = { ...pochodzenie.atrybuty_bazowe };
      
      // Dodaj wybór gracza (+1 do wybranego atrybutu)
      if (wybor_atrybutu && atrybuty[wybor_atrybutu]) {
        atrybuty[wybor_atrybutu] += 1;
      }
      
      return atrybuty;
    },

    /**
     * Oblicza korzyści pochodzenia na poziomie 4
     * @param {Object} pochodzenie - Dane pochodzenia
     * @returns {Object} Korzyści z pochodzenia
     */
    korzysci_pochodzenia_poziom_4(pochodzenie) {
      return pochodzenie.poziom_4 || {};
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
      return Object.prototype.hasOwnProperty.call(ORIGINS, id);
    },

    /**
     * Sprawdza czy poziom istnieje
     * @param {number} poziom - Poziom postaci
     * @returns {boolean} True jeśli poziom istnieje
     */
    czyPoziomIstnieje(poziom) {
      return Object.prototype.hasOwnProperty.call(LEVELS, poziom);
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

export default DANE_GRY;