/**
 * Zapisywanie postaci w pamięci przeglądarki (localStorage), niezależnie od
 * eksportu/importu plików JSON. Każdy zapis trzyma dokładnie te same dane,
 * co eksport (zob. zbudujDaneEksportu() w script.js), pod własnym id, żeby
 * dało się go później odnaleźć na liście i wczytać ponownie albo nadpisać
 * kolejnym zapisem tej samej postaci.
 */

const KLUCZ_LOCALSTORAGE = 'kreatorPostaci.zapisanePostacie.v1';

/** Odczytuje wszystkie zapisane postacie jako obiekt {id: {id, savedAt, dane}}. Zwraca {} przy braku/uszkodzeniu danych. */
function pobierzZapisanePostacie() {
  try {
    const surowe = localStorage.getItem(KLUCZ_LOCALSTORAGE);
    if (!surowe) return {};
    const dane = JSON.parse(surowe);
    return dane && typeof dane === 'object' ? dane : {};
  } catch (e) {
    return {};
  }
}

/** Zapisuje (albo nadpisuje, jeśli `id` już istnieje) postać pod danym id. Zwraca true przy sukcesie. */
function zapiszPostacDoCache(id, dane) {
  try {
    const wszystkie = pobierzZapisanePostacie();
    wszystkie[id] = { id, savedAt: new Date().toISOString(), dane };
    localStorage.setItem(KLUCZ_LOCALSTORAGE, JSON.stringify(wszystkie));
    return true;
  } catch (e) {
    return false;
  }
}

/** Generuje nowe, unikalne id zapisu (znacznik czasu + losowy sufiks). */
function generujIdZapisu() {
  return `postac-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export { KLUCZ_LOCALSTORAGE, pobierzZapisanePostacie, zapiszPostacDoCache, generujIdZapisu };
