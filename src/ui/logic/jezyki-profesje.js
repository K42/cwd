/**
 * Silnik reguł języków i profesji (PG, rozdział 1: "Języki i profesje").
 *
 * Zasady źródłowe:
 * - Każda postać zaczyna z 2 profesjami (dowolnej kategorii). Każdą z nich
 *   można zamienić na naukę mówienia nowym językiem albo na umiejętność
 *   czytania/pisania w języku, którym już mówi.
 * - Pochodzenie może dać dodatkową, obowiązkową profesję (czasem z
 *   ograniczeniem do konkretnej kategorii - patrz `origins.js`).
 * - Wybrane ścieżki (nowicjusza/eksperckie/mistrzowskie) mogą przy wyborze
 *   przyznać język lub profesję - czasem to wybór (język ALBO profesja z
 *   ograniczonych kategorii), czasem to wyłącznie profesja (bez opcji
 *   językowej), a czasem obie korzyści łącznie (patrz `paths.js`,
 *   pole `jezyki_profesje`).
 * - Magik dodatkowo automatycznie zyskuje czytanie/pisanie we wszystkich
 *   znanych sobie językach (nie jest to slot do wyboru).
 */

import PATHS from '../data/paths.js';

/** Języki Północnych Rubieży (PG, ramka w rozdziale 1). */
const JEZYKI = {
  wspólny: 'Wspólny',
  mroczna_mowa: 'Mroczna mowa',
  krasnoludzki: 'Krasnoludzki',
  elficki: 'Elficki',
  wysoki_archaik: 'Wysoki archaik',
  trolli: 'Trolli'
};

/** Mapuje przymiotnikowe formy kategorii (z origins.js/paths.js) na klucze tabel PROFESSIONS.tables. */
const KATEGORIA_ALIASY = {
  naukowa: 'naukowe', naukowe: 'naukowe',
  pospolita: 'pospolite', pospolite: 'pospolite',
  przestepcza: 'przestepcze', przestepcze: 'przestepcze',
  wojenna: 'wojenne', wojenne: 'wojenne',
  koczownicza: 'koczownicze', koczownicze: 'koczownicze',
  religijna: 'religijne', religijne: 'religijne',
  dowolna: 'dowolna'
};

function normalizujKategorie(kategorie) {
  return (kategorie || []).map(k => KATEGORIA_ALIASY[k] || k);
}

function znajdzSciezke(grupaKey, id) {
  if (!id) return null;
  return (PATHS[grupaKey] && PATHS[grupaKey][id]) || null;
}

/**
 * Oblicza wszystkie sloty językowo-profesyjne przyznane postaci na
 * podstawie pochodzenia i wybranych ścieżek.
 *
 * Każdy slot ma pole `opcje` - listę dozwolonych sposobów jego rozdania:
 * - 'profesja' - profesja z kategorii `kategorie` (['dowolna'] = bez ograniczeń)
 * - 'jezyk_nowy' - nauka mówienia nowym językiem
 * - 'jezyk_pismo' - nauka czytania/pisania w już znanym języku
 *
 * @param {Object} params
 * @param {Object|null} params.pochodzenie - obiekt pochodzenia (z origins.js)
 * @param {string} params.sciezkaNowicjuszaId
 * @param {string} params.sciezkaEksperckaId
 * @param {string} params.sciezkaMistrzowskaId
 * @returns {{ sloty: Array, autoPismoWszystkieZnane: boolean }}
 */
function obliczSlotyProfesjiIJezykow({ pochodzenie, sciezkaNowicjuszaId, sciezkaEksperckaId, sciezkaMistrzowskaId }) {
  const sloty = [];
  let autoPismoWszystkieZnane = false;

  // Profesje początkowe - każda postać zaczyna z dwiema, każdą można zamienić
  // na język (mówiony lub pismo w znanym).
  sloty.push({ id: 'start-1', source: 'Profesje początkowe', kategorie: ['dowolna'], opcje: ['profesja', 'jezyk_nowy', 'jezyk_pismo'] });
  sloty.push({ id: 'start-2', source: 'Profesje początkowe', kategorie: ['dowolna'], opcje: ['profesja', 'jezyk_nowy', 'jezyk_pismo'] });

  // Pochodzenie - dodatkowa, obowiązkowa profesja (czasem ograniczona kategorią)
  if (pochodzenie && Array.isArray(pochodzenie.profesje) && pochodzenie.profesje.length > 0) {
    sloty.push({
      id: 'pochodzenie',
      source: `Pochodzenie: ${pochodzenie.nazwa}`,
      kategorie: normalizujKategorie(pochodzenie.profesje),
      opcje: ['profesja']
    });
  }

  const dodajSciezke = (grupaKey, sciezkaId, etykieta) => {
    const sciezka = znajdzSciezke(grupaKey, sciezkaId);
    const grant = sciezka && sciezka.poziom_1 && sciezka.poziom_1.jezyki_profesje;
    if (!grant) return;
    const kategorie = normalizujKategorie(grant.kategorie);
    const source = `Ścieżka: ${sciezka.nazwa} (${etykieta})`;

    if (grant.typ === 'wybor') {
      sloty.push({ id: `${sciezkaId}-jp`, source, kategorie, opcje: ['profesja', 'jezyk_nowy'], opis: grant.opis });
    } else if (grant.typ === 'tylko_profesja') {
      sloty.push({ id: `${sciezkaId}-jp`, source, kategorie, opcje: ['profesja'], opis: grant.opis });
    } else if (grant.typ === 'oba') {
      sloty.push({ id: `${sciezkaId}-jp-jezyk`, source, kategorie: ['dowolna'], opcje: ['jezyk_nowy'], opis: grant.opis });
      sloty.push({ id: `${sciezkaId}-jp-profesja`, source, kategorie, opcje: ['profesja'], opis: grant.opis });
    } else if (grant.typ === 'automatyczne_naukowa') {
      autoPismoWszystkieZnane = true;
      sloty.push({ id: `${sciezkaId}-jp-profesja`, source, kategorie, opcje: ['profesja'], opis: grant.opis });
    }
  };

  dodajSciezke('sciezki_nowicjuszy', sciezkaNowicjuszaId, 'poziom 1');
  dodajSciezke('sciezki_ekspertow', sciezkaEksperckaId, 'poziom 3');
  dodajSciezke('sciezki_mistrzow', sciezkaMistrzowskaId, 'poziom 7');

  return { sloty, autoPismoWszystkieZnane };
}

export { JEZYKI, obliczSlotyProfesjiIJezykow, normalizujKategorie };
