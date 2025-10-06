/**
 * Serwer Express dla kreatora postaci - Cień Władcy Demonów
 */

const express = require('express');
const path = require('path');
const DANE_GRY = require('./data.js');
const { EXTENDED_ORIGINS, losujZTabeli } = require('./data/origins_extended');
const ORIGINS = require('./data/origins');
const { rollTable, getAvailableTables, getTableDetails, hasTables, getOriginsWithTables } = require('./data/table_utils');
const ORIGIN_TABLES = require('./data/origin_tables');
const PATHS = require('./data/paths');
const PROFESSIONS = require('./data/professions');
const CURIOS = require('./data/curios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'ui')));

/**
 * Buduje postać na podstawie specyfikacji zgodnie z zasadami z PDF
 * @param {Object} spec - Specyfikacja postaci
 * @param {string} spec.pochodzenie - ID pochodzenia
 * @param {string} [spec.wybor_atrybutu] - Wybór atrybutu (+1 do wybranego)
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
 * Buduje kompletną postać z progresją poziomów (1-10)
 * @param {Object} spec - Specyfikacja postaci
 * @returns {Object} Kompletny obiekt postaci z progresją
 */
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

// Endpoint do obliczania korzyści poziomu
app.post('/api/calculate-level-benefits', (req, res) => {
  try {
    const { poziom, pochodzenie, sciezka_nowicjusza, sciezka_ekspercka, sciezka_mistrzowska } = req.body;
    
    if (poziom === undefined) {
      return res.status(400).json({ error: 'Brak poziomu' });
    }
    if (!pochodzenie) {
      return res.status(400).json({ error: 'Brak pochodzenia' });
    }

    const korzyści = obliczKorzysciPoziomu(parseInt(poziom), {
      pochodzenie,
      sciezka_nowicjusza,
      sciezka_ekspercka,
      sciezka_mistrzowska
    });

    res.json(korzyści);
  } catch (error) {
    res.status(400).json({
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint do budowania postaci
app.post('/api/build', (req, res) => {
  try {
    const postac = budujPostac(req.body);
    res.json(postac);
  } catch (error) {
    res.status(400).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint do pobierania dostępnych opcji
app.get('/api/options', (req, res) => {
  res.json({
    pochodzenia: Object.keys(DANE_GRY.pochodzenia),
    sciezki: Object.keys(DANE_GRY.sciezki_nowicjuszy)
  });
});

// Endpoint do pobierania dostępnych poziomów (1-10)
app.get('/api/levels', (req, res) => {
  res.json({
    poziomy: Object.entries(DANE_GRY.poziomy).map(([id, poziom]) => ({
      id: parseInt(id),
      nazwa: poziom.nazwa,
      opis: poziom.opis,
      kolor: poziom.kolor,
      bonus_atrybuty: poziom.bonus_atrybuty,
      nastepny_poziom: poziom.nastepny_poziom
    }))
  });
});

// Endpoint do pobierania pełnych danych poziomów
app.get('/api/levels-full', (req, res) => {
  res.json({
    poziomy: DANE_GRY.poziomy,
    progresja: DANE_GRY.progresja
  });
});

// Endpoint do pobierania ścieżek dla danego poziomu wyboru (1, 3, 7)
app.get('/api/paths/:level', (req, res) => {
  const poziom = parseInt(req.params.level);
  
  let sciezki = [];
  
  // Mapowanie poziomów wyboru na ścieżki zgodnie z PG
  if (poziom === 1) {
    // Ścieżki nowicjuszy - poziom wyboru 1
    sciezki = Object.values(PATHS.sciezki_nowicjuszy).map(path => ({
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
    sciezki = Object.values(PATHS.sciezki_ekspertow).map(path => ({
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
    sciezki = Object.values(PATHS.sciezki_mistrzow).map(path => ({
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
  } else {
    return res.status(404).json({ error: 'Nieprawidłowy poziom wyboru ścieżki' });
  }
  
  res.json({ sciezki });
});

/**
 * Pobiera opis talentu z bazy danych
 * @param {string} talentName - Nazwa talentu
 * @returns {string} Opis talentu
 */
function getTalentDescription(talentName) {
  const talentDescriptions = {
    'Modlitwa': 'Możesz użyć akcji, by uleczyć tyle obrażeń, ile wynosi twoja Szybkość Zdrowienia.',
    'Wspólna odnowa': 'Gdy leczysz siebie, możesz uleczyć dodatkowe obrażenia równe twojej Szybkości Zdrowienia u sojusznika w zasięgu 1,5 metra.',
    'Szybka odnowa': 'Możesz użyć akcji, by uleczyć tyle obrażeń, ile wynosi twoja Szybkość Zdrowienia.',
    'Podstęp': 'Ataki z zaskoczenia zadają dodatkowe obrażenia równe twojej Zręczności.',
    'Wykorzystanie okazji': 'Gdy atakujesz z zaskoczenia, możesz wykonać dodatkowy atak.',
    'Nieczyste zagrania': 'Możesz wykonać atak z zaskoczenia jako reakcja.',
    'Furia': 'Gdy twoje Zdrowie spadnie poniżej połowy maksymalnej wartości, wszystkie twoje ataki zadają dodatkowe obrażenia równe twojej Sile.',
    'Wysokie obroty': 'Możesz wykonać dodatkową akcję w swojej turze. Po wykorzystaniu tego talentu musisz odbyć pełny odpoczynek, zanim zdołasz użyć go ponownie.',
    'Determinacja': 'Gdy wyrzucisz 1 na kości ułatwienia, możesz rzucić ponownie i wybrać, którego wyniku użyć.',
    'Odskok': 'Gdy stworzenie, które widzisz, chybi, atakując twoją Obronę lub Zręczność, możesz użyć reakcji, by wykonać odwrót.',
    'Nie do zdarcia': 'Możesz użyć akcji, by uleczyć tyle obrażeń, ile wynosi twoja Szybkość Zdrowienia, a także pozbyć się jednego z następujących stanów: wyczerpanie, osłabienie lub zatrucie.',
    'Prymat sobowtóra': 'W trakcie swojej tury możesz użyć Kradzieży tożsamości jako reakcji. Ponadto gdy skradniesz tożsamość jakiejś istoty, to dopóki naśladujesz jej wygląd, wszelkie ataki przeciw niej wykonujesz z 1 ułatwieniem.',
    'Kontrolowany szał': 'Możesz wpaść w szał bojowy jako akcję. W szał bojowy otrzymujesz +2 do ataków, ale -2 do Obrony. Szał trwa do końca walki lub do momentu, gdy zdecydujesz się go zakończyć jako akcję.',
    'Boskie uderzenie': 'Możesz użyć akcji, by twoje następne uderzenie zadaje dodatkowe obrażenia równe twojej Woli.',
    'Barbarzyński szał': 'Możesz wpaść w szał bojowy jako akcję. W szał bojowy otrzymujesz +2 do ataków, ale -2 do Obrony. Szał trwa do końca walki lub do momentu, gdy zdecydujesz się go zakończyć jako akcję.'
  };
  
  return talentDescriptions[talentName] || 'Opis talentu nie jest dostępny.';
}

// Endpoint do pobierania profesji
app.get('/api/professions', (req, res) => {
  // Flatten PG profession tables into UI-friendly list
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
    map.forEach(([kat, arr]) => {
      (arr || []).forEach((text, idx) => {
        profesje.push({
          id: `${kat.toLowerCase()}_${idx + 1}`,
          nazwa: text,
          kategoria: kat,
          opis: '',
          zrodlo: 'PG'
        });
      });
    });
  }

  res.json({ kategorie, profesje });
});

// Endpoint do pobierania kuriozów
app.get('/api/curios', (req, res) => {
  // Flatten PG tables into UI-friendly list
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
      const kat = `Tabela ${tableNum}`;
      items.forEach((text, idx) => {
        kurioza.push({
          id: `t${tableNum}_k${idx + 1}`,
          nazwa: text,
          opis: '',
          efekt: '',
          wartosc: '',
          kategoria: kat,
          zrodlo: 'PG'
        });
      });
    });
  }

  res.json({ kategorie, kurioza });
});

// Endpoint do budowania kompletnej postaci
app.post('/api/build-complete', (req, res) => {
  try {
    const postac = budujPostacKompletna(req.body);
    res.json(postac);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint do eksportu postaci do JSON
app.post('/api/export/json', (req, res) => {
  try {
    const postac = budujPostacKompletna(req.body);
    const jsonData = JSON.stringify(postac, null, 2);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="postac-${postac.pochodzenie.nazwa}-poziom${postac.poziom.id}.json"`);
    res.send(jsonData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint do eksportu postaci do PDF (placeholder)
app.post('/api/export/pdf', (req, res) => {
  try {
    const postac = budujPostacKompletna(req.body);
    
    // TODO: Implementacja generowania PDF
    res.status(501).json({ 
      error: 'Eksport do PDF nie jest jeszcze zaimplementowany',
      postac
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Endpoint do pobierania tabel losowania dla pochodzenia
 * AC-012: Backend API dla tabel losowania
 * @param {string} originId - ID pochodzenia
 * @returns {Object} Wszystkie tabele dla danego pochodzenia
 */
app.get('/api/origins/:originId/tables', (req, res) => {
  try {
    const { originId } = req.params;
    
    // Sprawdź czy pochodzenie ma tabele
    if (!hasTables(originId)) {
      return res.status(404).json({ 
        error: `Pochodzenie ${originId} nie ma tabel losowania`,
        dostepne: getOriginsWithTables()
      });
    }
    
    // Pobierz dostępne tabele jako obiekt z kluczami
    const tabeleLista = getAvailableTables(originId);
    const tabele = {};
    tabeleLista.forEach(tabela => {
      // Normalizuj klucz tabeli (usuń polskie znaki i spacje)
      const key = tabela.klucz.toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/ą/g, 'a')
        .replace(/ć/g, 'c')
        .replace(/ę/g, 'e')
        .replace(/ł/g, 'l')
        .replace(/ń/g, 'n')
        .replace(/ó/g, 'o')
        .replace(/ś/g, 's')
        .replace(/ź/g, 'z')
        .replace(/ż/g, 'z');
      
      // Pobierz szczegóły tabeli z opcjami (używamy znormalizowanego klucza)
      const tabelaDetails = getTableDetails(originId, key);
      const opcje = Object.keys(tabelaDetails.wyniki).map(rzut => ({
        rzut: parseInt(rzut),
        wynik: tabelaDetails.wyniki[rzut].wynik
      }));
      
      // Używamy znormalizowanego klucza tabeli, aby roll działał poprawnie
      tabele[key] = {
        ...tabela,
        opcje: opcje
      };
    });
    
    res.json({
      pochodzenie: {
        id: originId,
        nazwa: originId === 'czlowiek' ? 'Człowiek' : originId.charAt(0).toUpperCase() + originId.slice(1),
        zrodlo: 'PG'
      },
      tabele: tabele
    });
    
  } catch (error) {
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Endpoint do losowania z tabeli
 * AC-013: Funkcja losowania z tabel
 * @param {string} originId - ID pochodzenia
 * @param {string} tableName - Nazwa tabeli
 * @returns {Object} Wynik losowania
 */
app.post('/api/origins/:originId/tables/:tableName/roll', (req, res) => {
  try {
    const { originId, tableName } = req.params;
    
    // Konwertuj nazwę tabeli z URL na klucz tabeli (normalizacja)
    const tableKey = tableName.toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/ą/g, 'a')
      .replace(/ć/g, 'c')
      .replace(/ę/g, 'e')
      .replace(/ł/g, 'l')
      .replace(/ń/g, 'n')
      .replace(/ó/g, 'o')
      .replace(/ś/g, 's')
      .replace(/ź/g, 'z')
      .replace(/ż/g, 'z');
    
    // Wykonaj losowanie z tabeli
    const wynik = rollTable(originId, tableKey);
    
    // Pobierz szczegóły tabeli
    const tabelaDetails = getTableDetails(originId, tableKey);
    
    res.json({
      pochodzenie: {
        id: originId,
        nazwa: originId === 'czlowiek' ? 'Człowiek' : originId.charAt(0).toUpperCase() + originId.slice(1)
      },
      tabela: {
        nazwa: tabelaDetails.nazwa,
        typ: tabelaDetails.typ,
        opis: tabelaDetails.opis
      },
      wynik: {
        ...wynik,
        wartosc_rzutu: parseInt(wynik.rzut)
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    // Sprawdź typ błędu i zwróć odpowiedni status
    if (error.message.includes('Nie znaleziono pochodzenia') || error.message.includes('Nieznane pochodzenie')) {
      res.status(404).json({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } else if (error.message.includes('Nie znaleziono tabeli')) {
      res.status(404).json({
        error: error.message,
        dostepne_tabele: getAvailableTables(originId),
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(400).json({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
});

/**
 * Endpoint do pobierania listy dostępnych pochodzeń z tabelami
 * @returns {Object} Lista pochodzeń z informacją o tabelach
 */
app.get('/api/origins', (req, res) => {
  try {
    const pochodzenia = Object.values(ORIGINS).map(pochodzenie => ({
      id: pochodzenie.id,
      nazwa: pochodzenie.nazwa,
      zrodlo: pochodzenie.zrodlo,
      ma_tabele: hasTables(pochodzenie.id),
      liczba_tabel: hasTables(pochodzenie.id) ? getAvailableTables(pochodzenie.id).length : 0,
      status: pochodzenie.status,
      strona_zrodlowa: pochodzenie.strona_zrodlowa
    }));
    
    res.json({
      pochodzenia,
      liczba_pochodzen: pochodzenia.length,
      pochodzenia_z_tabelami: pochodzenia.filter(p => p.ma_tabele).length
    });
    
  } catch (error) {
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Strona główna
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

// Start serwera
if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🎲 Kreator postaci działa na porcie ${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`📖 Otórz http://localhost:${PORT} aby rozpocząć`);
  });
}

module.exports = { app, budujPostac, obliczKorzysciPoziomu };
