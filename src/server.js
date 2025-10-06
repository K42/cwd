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

// Endpoint do pobierania ścieżek dla danego poziomu (1-10)
app.get('/api/paths/:level', (req, res) => {
  const poziom = parseInt(req.params.level);
  
  if (!DANE_GRY.poziomy[poziom]) {
    return res.status(404).json({ error: 'Nieznany poziom' });
  }
  
  let sciezki = [];
  
  // Mapowanie poziomów na ścieżki
  if (poziom === 1) {
    sciezki = Object.values(DANE_GRY.sciezki_nowicjuszy);
  } else if (poziom === 2) {
    sciezki = Object.values(DANE_GRY.sciezki_kontynuacji).filter(s => s.id === 'kontynuacja_nowicjusza');
  } else if (poziom === 3) {
    sciezki = Object.values(DANE_GRY.sciezki_ekspertow);
  } else if (poziom === 4) {
    sciezki = Object.values(DANE_GRY.sciezki_kontynuacji).filter(s => s.id === 'kontynuacja_eksperta');
  } else if (poziom === 5) {
    sciezki = Object.values(DANE_GRY.sciezki_mistrzow);
  } else if (poziom === 6) {
    sciezki = Object.values(DANE_GRY.sciezki_kontynuacji).filter(s => s.id === 'kontynuacja_mistrza');
  } else if (poziom === 7) {
    sciezki = Object.values(DANE_GRY.sciezki_legend);
  } else if (poziom === 8) {
    sciezki = Object.values(DANE_GRY.sciezki_kontynuacji).filter(s => s.id === 'kontynuacja_legendy');
  } else if (poziom === 9 || poziom === 10) {
    // Poziomy 9-10: dostęp do wszystkich ścieżek
    sciezki = [
      ...Object.values(DANE_GRY.sciezki_nowicjuszy),
      ...Object.values(DANE_GRY.sciezki_ekspertow),
      ...Object.values(DANE_GRY.sciezki_mistrzow),
      ...Object.values(DANE_GRY.sciezki_legend)
    ];
  }
  
  res.json({ 
    sciezki: sciezki.map(s => ({ 
      id: s.id, 
      nazwa: s.nazwa,
      opis: s.opis,
      poziom_1: s.poziom_1
    }))
  });
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
