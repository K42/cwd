/**
 * Poziomy postaci - system progresji
 * Źródło: Podręcznik główny
 */

const LEVELS = {
  0: {
    nazwa: "Nowicjusz",
    opis: "Początkowa postać - wybierz ścieżkę nowicjusza",
    dostepne_sciezki: ["nowicjusz"],
    nastepny_poziom: 1,
    kolor: "#8b0000"
  },
  1: {
    nazwa: "Ekspert", 
    opis: "Doświadczona postać - wybierz ścieżkę eksperta",
    dostepne_sciezki: ["ekspert"],
    nastepny_poziom: 2,
    kolor: "#0066cc"
  },
  2: {
    nazwa: "Mistrz",
    opis: "Zaawansowana postać - wybierz ścieżkę mistrza", 
    dostepne_sciezki: ["mistrz"],
    nastepny_poziom: 3,
    kolor: "#cc6600"
  },
  3: {
    nazwa: "Legenda",
    opis: "Legendarne postacie - wybierz ścieżkę legendy",
    dostepne_sciezki: ["legenda"],
    nastepny_poziom: null,
    kolor: "#cc0066"
  }
};

module.exports = LEVELS;
