/**
 * Serwer Express dla kreatora postaci - Cień Władcy Demonów
 */

const express = require('express');
const path = require('path');
const DANE_GRY = require('./data.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'ui')));

/**
 * Buduje kompletną postać na podstawie specyfikacji
 * @param {Object} spec - Specyfikacja postaci
 * @param {string} spec.pochodzenie - ID pochodzenia
 * @param {Object} [spec.atrybuty] - Własne wartości atrybutów lub null dla losowych
 * @param {string} [spec.sciezka] - ID ścieżki nowicjusza
 * @returns {Object} Kompletny obiekt postaci
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

  // Atrybuty podstawowe - zadane lub domyślne (10, 10, 10, 10)
  const atrybuty = spec.atrybuty || { sila: 10, zrecznosc: 10, intelekt: 10, wola: 10 };

  // Modyfikatory z pochodzenia
  const atrybuty_finalne = {
    sila: atrybuty.sila + (pochodzenie.atrybuty.sila - 10),
    zrecznosc: atrybuty.zrecznosc + (pochodzenie.atrybuty.zrecznosc - 10), 
    intelekt: atrybuty.intelekt + (pochodzenie.atrybuty.intelekt - 10),
    wola: atrybuty.wola + (pochodzenie.atrybuty.wola - 10)
  };

  // Atrybuty drugorzędne
  const drugorzedne = DANE_GRY.obliczenia.atrybuty_drugorzedne(atrybuty_finalne, pochodzenie);

  // Ścieżka nowicjusza (opcjonalnie)
  let sciezka = null;
  if (spec.sciezka && DANE_GRY.sciezki_nowicjuszy[spec.sciezka]) {
    sciezka = DANE_GRY.sciezki_nowicjuszy[spec.sciezka];
  }

  // Składanie finalnego obiektu postaci
  return {
    pochodzenie: pochodzenie,
    atrybuty: atrybuty_finalne,
    atrybuty_drugorzedne: drugorzedne,
    sciezka: sciezka,
    profesje: pochodzenie.profesje,
    jezyki: pochodzenie.jezyki,
    cechy_specjalne: pochodzenie.cechy_specjalne,
    utworzono: new Date().toISOString()
  };
}

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

// Strona główna
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

// Start serwera
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🎲 Kreator postaci działa na porcie ${PORT}`);
    console.log(`📖 Otórz http://localhost:${PORT} aby rozpocząć`);
  });
}

module.exports = { app, budujPostac };
