/**
 * Logika budowania postaci - przeniesiona z dawnego src/server.js
 * Czyste funkcje bez efektów ubocznych, wywoływane bezpośrednio przez UI
 * zamiast przez endpointy /api/build, /api/build-complete i /api/calculate-level-benefits.
 */

import DANE_GRY from '../data/dane-gry.js';

/**
 * Buduje postać na podstawie specyfikacji zgodnie z zasadami z PDF
 * @param {Object} spec - Specyfikacja postaci
 * @param {string} spec.pochodzenie - ID pochodzenia
 * @param {string} [spec.wybor_atrybutu] - Wybór atrybutu (+1 do wybranego atrybutu)
 * @param {string} [spec.sciezka] - ID ścieżki
 * @param {number} [spec.poziom] - Poziom postaci (0-10, domyślnie 0)
 * @returns {Object} Obiekt postaci
 */
function budujPostac(spec) {
  // Walidacja danych wejściowych
  if (!spec.pochodzenie) {
    throw new Error('Brak pochodzenia postaci');
  }

  const pochodzenie = DANE_GRY.pochodzenia[spec.pochodzenie];
  if (!pochodzenie) {
    throw new Error(`Nieznane pochodzenie: ${spec.pochodzenie}`);
  }

  // Poziom postaci - domyślnie 1 (Nowicjusz) - gra nie ma poziomu 0
  const poziomPostaci = spec.poziom !== undefined ? parseInt(spec.poziom) : 1;

  // Sprawdzenie czy poziom istnieje
  const poziomData = DANE_GRY.poziomy[poziomPostaci];
  if (!poziomData) {
    throw new Error(`Nieznany poziom: ${poziomPostaci}`);
  }

  // Oblicz atrybuty zgodnie z zasadami z PDF
  const atrybuty_finalne = DANE_GRY.obliczenia.oblicz_atrybuty_poczatkowe(pochodzenie, spec.wybor_atrybutu);

  // Oblicz atrybuty drugorzędne z modyfikatorami rozmiaru
  const drugorzedne = DANE_GRY.obliczenia.atrybuty_drugorzedne(atrybuty_finalne, pochodzenie, poziomPostaci);

  // Pobierz ścieżkę jeśli podana
  let sciezkaData = null;
  if (spec.sciezka) {
    // Sprawdź w odpowiedniej kategorii ścieżek na podstawie poziomu
    if (poziomPostaci >= 1 && poziomPostaci <= 2 && DANE_GRY.sciezki_nowicjuszy[spec.sciezka]) {
      sciezkaData = DANE_GRY.sciezki_nowicjuszy[spec.sciezka];
    } else if (poziomPostaci >= 3 && poziomPostaci <= 6 && DANE_GRY.sciezki_ekspertow[spec.sciezka]) {
      sciezkaData = DANE_GRY.sciezki_ekspertow[spec.sciezka];
    } else if (poziomPostaci >= 7 && DANE_GRY.sciezki_mistrzow[spec.sciezka]) {
      sciezkaData = DANE_GRY.sciezki_mistrzow[spec.sciezka];
    }
  }

  // Dodaj korzyści z pochodzenia na poziomie 4
  let korzysciPochodzenia = {};
  if (poziomPostaci === 4) {
    korzysciPochodzenia = DANE_GRY.obliczenia.korzysci_pochodzenia_poziom_4(pochodzenie);
  }

  // Składanie finalnego obiektu postaci
  return {
    pochodzenie,
    poziom: poziomData,
    atrybuty: atrybuty_finalne,
    atrybuty_drugorzedne: drugorzedne,
    sciezka: sciezkaData,
    korzysci_pochodzenia: korzysciPochodzenia,
    profesje: pochodzenie.profesje,
    jezyki: pochodzenie.jezyki,
    cechy_specjalne: pochodzenie.cechy_specjalne,
    utworzono: new Date().toISOString()
  };
}

/**
 * Oblicza korzyści dla wybranego poziomu
 * @param {number} poziom - Wybrany poziom (0-10)
 * @param {Object} spec - Specyfikacja postaci
 * @param {string} spec.pochodzenie - ID pochodzenia
 * @param {string} [spec.sciezka_nowicjusza] - ID ścieżki nowicjusza
 * @param {string} [spec.sciezka_ekspercka] - ID ścieżki eksperckiej
 * @param {string} [spec.sciezka_mistrzowska] - ID ścieżki mistrzowskiej
 * @returns {Object} Korzyści dla poziomu
 */
function obliczKorzysciPoziomu(poziom, spec) {
  const poziomData = DANE_GRY.poziomy[poziom];
  if (!poziomData) {
    throw new Error(`Nieznany poziom: ${poziom}`);
  }

  const pochodzenie = DANE_GRY.pochodzenia[spec.pochodzenie];
  if (!pochodzenie) {
    throw new Error(`Nieznane pochodzenie: ${spec.pochodzenie}`);
  }

  const result = {
    poziom,
    nazwa_poziomu: poziomData.nazwa,
    opis_poziomu: poziomData.opis,
    zrodlo_korzysci: poziomData.zrodlo_korzysci,
    korzyści: {}
  };

  // Zależnie od źródła korzyści
  switch (poziomData.zrodlo_korzysci) {
  case 'pochodzenie':
    // Poziom 4 - korzyści z pochodzenia
    if (poziom === 4 && pochodzenie.poziom_4) {
      result.korzyści = pochodzenie.poziom_4;
    }
    break;

  case 'sciezka_nowicjusza':
    if (spec.sciezka_nowicjusza) {
      const sciezka = DANE_GRY.sciezki_nowicjuszy[spec.sciezka_nowicjusza];
      if (sciezka) {
        const klucz = `poziom_${poziom}`;
        result.korzyści = sciezka[klucz] || {};
        result.nazwa_sciezki = sciezka.nazwa;
      }
    }
    break;

  case 'sciezka_ekspercka':
    if (spec.sciezka_ekspercka) {
      const sciezka = DANE_GRY.sciezki_ekspertow[spec.sciezka_ekspercka];
      if (sciezka) {
        const klucz = `poziom_${poziom}`;
        result.korzyści = sciezka[klucz] || {};
        result.nazwa_sciezki = sciezka.nazwa;
      }
    }
    break;

  case 'sciezka_mistrzowska':
    if (spec.sciezka_mistrzowska) {
      const sciezka = DANE_GRY.sciezki_mistrzow[spec.sciezka_mistrzowska];
      if (sciezka) {
        const klucz = `poziom_${poziom}`;
        result.korzyści = sciezka[klucz] || {};
        result.nazwa_sciezki = sciezka.nazwa;
      }
    }
    break;
  }

  return result;
}

/**
 * Buduje kompletną postać z progresją poziomów (1-10)
 * @param {Object} spec - Specyfikacja postaci
 * @returns {Object} Kompletny obiekt postaci z progresją
 */
function budujPostacKompletna(spec) {
  // Buduj podstawową postać
  const postacBazowa = budujPostac(spec);

  // Dodaj progresję atrybutów na podstawie poziomu
  const bonusyPoziomu = DANE_GRY.progresja.obliczBonusyAtrybutow(postacBazowa.poziom.id);

  // Dodaj bonusy ze ścieżek
  const sciezki = spec.sciezki || [];
  const bonusyZdrowia = DANE_GRY.progresja.obliczBonusyZdrowia(sciezki);
  const bonusyMocy = DANE_GRY.progresja.obliczBonusyMocy(sciezki);

  // Oblicz finalne atrybuty z progresją
  const atrybutyFinalne = {
    sila: postacBazowa.atrybuty.sila + (bonusyPoziomu.sila || 0),
    zrecznosc: postacBazowa.atrybuty.zrecznosc + (bonusyPoziomu.zrecznosc || 0),
    intelekt: postacBazowa.atrybuty.intelekt + (bonusyPoziomu.intelekt || 0),
    wola: postacBazowa.atrybuty.wola + (bonusyPoziomu.wola || 0)
  };

  // Aktualizuj atrybuty drugorzędne
  const atrybutyDrugorzedne = DANE_GRY.obliczenia.atrybuty_drugorzedne(atrybutyFinalne, postacBazowa.pochodzenie);
  atrybutyDrugorzedne.zdrowie += bonusyZdrowia;
  atrybutyDrugorzedne.moc += bonusyMocy;

  // Dodaj informacje o progresji
  const progresja = {
    poziom: postacBazowa.poziom,
    bonusy_poziomu: bonusyPoziomu,
    bonusy_zdrowia: bonusyZdrowia,
    bonusy_mocy: bonusyMocy,
    wybrane_sciezki: sciezki,
    opis_poziomu: DANE_GRY.progresja.pobierzOpisPoziomu(postacBazowa.poziom.id)
  };

  return {
    ...postacBazowa,
    atrybuty: atrybutyFinalne,
    atrybuty_drugorzedne: atrybutyDrugorzedne,
    progresja,
    typ_eksportu: 'kompletna'
  };
}

export { budujPostac, obliczKorzysciPoziomu, budujPostacKompletna };
