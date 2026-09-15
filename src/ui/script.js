/**
 * Frontend JavaScript dla kreatora postaci
 */

import { budujPostac, obliczKorzysciPoziomu } from './logic/postac.js';
import { getPathsForLevel } from './logic/sciezki.js';
import { getOriginsListUI, getOriginTablesUI } from './logic/origins.js';
import { getProfesjeUI, getKuriozaUI } from './logic/profesje-kurioza.js';
import { JEZYKI, obliczSlotyProfesjiIJezykow } from './logic/jezyki-profesje.js';
import { rollTable } from './data/table_utils.js';
import DANE_GRY from './data/dane-gry.js';

let biezacaPostac = null;
let wybranePochodzenie = null;
let wybranyPoziom = 0; // Gra zaczyna się od poziomu 0
let dostepnePochodzenia = [];
let wynikiTabel = {}; // Przechowuje wyniki tabel losowych dla wybranego pochodzenia
let wybraneSciezki = { nowicjusz: '', ekspert: '', mistrz: '' };
let przyznaneKorzysciZeSciezek = { 1: null, 3: null, 7: null };
let wybraneProfesje = []; // Pochodna odpowiedziSlotow - profesje przypisane do slotów w trybie 'profesja'
let odpowiedziSlotow = {}; // slotId -> { mode: 'profesja'|'jezyk_nowy'|'jezyk_pismo', profesjaId, jezyk }
let wybraneKurioza = [];
let dostepneProfesje = [];
let dostepneKurioza = [];
let wylosowaneSrebrniki = null; // 2k6 za każdy poziom powyżej 0
let liczbaKuriozow = 0; // Po 1 za poziomy wyboru ścieżek: 1, 3, 7

// Ładowanie opcji przy starcie strony
document.addEventListener('DOMContentLoaded', async () => {
  await zaladujOpcje();
  await zaladujPoziomy();
  inicjalizujPoziomy();
  await zaladujSciezkiDoKafelkow();
  await zaladujProfesjeIKurioza();
  
  // Inicjalizuj system pomocy
  initializeHelpSystem();

  // Handler zwijania/rozwijania listy kuriozów
  const btnToggleCur = document.getElementById('btn-toggle-curios');
  const curGrid = document.getElementById('curios-grid');
  if (btnToggleCur && curGrid) {
    btnToggleCur.addEventListener('click', () => {
      const expanded = btnToggleCur.getAttribute('data-expanded') === 'true';
      btnToggleCur.setAttribute('data-expanded', expanded ? 'false' : 'true');
      btnToggleCur.textContent = expanded ? 'Rozwiń' : 'Zwiń';
      curGrid.style.display = expanded ? 'none' : 'grid';
    });
  }

  // Centralne losowanie
  const btnRandProf = document.getElementById('btn-randomize-professions');
  if (btnRandProf) {
    btnRandProf.addEventListener('click', () => losujProfesjeCentralnie());
  }
  const btnRandCur = document.getElementById('btn-randomize-curios');
  if (btnRandCur) {
    btnRandCur.addEventListener('click', () => losujKuriozaCentralnie());
  }

  // Handlery wyboru ścieżek i zasobów - nowy system kafelków
  // Event listenery dla ścieżek są dodawane dynamicznie w renderPathTile()
  const btnWealth = document.getElementById('btn-roll-wealth');
  if (btnWealth) {
    btnWealth.addEventListener('click', () => {
      if (wybranyPoziom <= 0) return;
      // 2k6 srebrników za każdy poziom powyżej 0
      let suma = 0;
      const rzuty = [];
      for (let i = 0; i < wybranyPoziom * 2; i++) {
        const r = Math.floor(Math.random() * 6) + 1;
        rzuty.push(r);
        suma += r;
      }
      wylosowaneSrebrniki = suma;
      aktualizujWealthUI(rzuty, suma);
      aktualizujPodgladPostaci();
    });
  }

  // Toggle własnych atrybutów
  document.getElementById('domyslne-atrybuty').addEventListener('change', (e) => {
    const customDiv = document.getElementById('custom-attributes');
    customDiv.style.display = e.target.checked ? 'none' : 'block';
    if (e.target.checked) {
      // Użyj domyślnych wartości bazujących na pochodzeniu
      aktualizujDomyślneAtrybuty();
    } else {
      aktualizujObliczoneAtrybuty();
    }
  });

  // Event listeners dla atrybutów
  ['sila-base', 'zrecznosc-base', 'intelekt-base', 'wola-base'].forEach(id => {
    document.getElementById(id).addEventListener('input', aktualizujObliczoneAtrybuty);
  });
});

/**
 * Ładuje dostępne opcje z serwera
 */
async function zaladujOpcje() {
  try {
    // Pobierz podstawowe opcje
    const opcje = {
      pochodzenia: Object.keys(DANE_GRY.pochodzenia),
      sciezki: Object.keys(DANE_GRY.sciezki_nowicjuszy)
    };

    // Sprawdź, które pochodzenia mają tabele
    let pochodzeniaZTabelami = [];
    try {
      const originsData = getOriginsListUI();
      pochodzeniaZTabelami = originsData.pochodzenia || [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Nie udało się załadować metadanych pochodzeń:', error);
    }

    // Ładowanie szczegółowych danych pochodzeń
    // eslint-disable-next-line no-console
    console.log('Ładowanie pochodzeń:', opcje.pochodzenia.length);
    dostepnePochodzenia = await zaladujSzczegolyPochodzenRozszerzone(opcje.pochodzenia, pochodzeniaZTabelami);
    // eslint-disable-next-line no-console
    console.log('Załadowane pochodzenia:', dostepnePochodzenia.length);

    // Generowanie kafelków pochodzeń
    generujKafelkiPochodzen(dostepnePochodzenia);

    // Wypełnianie selecta ścieżek (jeśli istnieje - dla kompatybilności wstecznej)
    const sciezkaSelect = document.getElementById('sciezka');
    if (sciezkaSelect) {
      sciezkaSelect.innerHTML = '<option value="">Brak ścieżki</option>';

      opcje.sciezki.forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = id.charAt(0).toUpperCase() + id.slice(1);
        sciezkaSelect.appendChild(option);
      });
    }

  } catch (error) {
    pokazBlad(`Nie można załadować opcji: ${  error.message}`);
  }
}

/**
 * Ładuje dostępne poziomy z serwera
 */
async function zaladujPoziomy() {
  // Poziomy są dostępne w DANE_GRY.poziomy, ale obecnie nie są używane w UI
  // (poziomy są zdefiniowane bezpośrednio w HTML)
}

/**
 * Inicjalizuje obsługę poziomów postaci
 */
function inicjalizujPoziomy() {
  // Dodaj event listenery dla radio buttonów poziomów
  const levelInputs = document.querySelectorAll('input[name="poziom"]');
  levelInputs.forEach(input => {
    input.addEventListener('change', async (e) => {
      wybranyPoziom = parseInt(e.target.value);
      aktualizujWidocznoscSciezek(wybranyPoziom);
      aktualizujSciezkiPoziomu(wybranyPoziom);
      aktualizujTytulSekcjiSciezek(wybranyPoziom);
      aktualizujWealthSection(wybranyPoziom);
      aktualizujOriginBenefits(wybranyPoziom);

      // Aktualizuj widoczność sekcji ścieżek i prze-renderuj kafelki,
      // aby przyciski przeszły ze stanu disabled -> enabled po zmianie poziomu
      renderPathSectionsVisibility();
      await renderPathSection(1);
      await renderPathSection(3);
      await renderPathSection(7);

      // Załaduj korzyści dla wybranego poziomu
      await zaladujKorzysciPoziomu(wybranyPoziom);
    });
  });

  // Inicjalizuj ścieżki dla poziomu 0 (domyślnego)
  aktualizujWidocznoscSciezek(0);
  aktualizujSciezkiPoziomu(0);
  aktualizujWealthSection(0);
  aktualizujOriginBenefits(0);
  // Załaduj korzyści dla poziomu 0
  zaladujKorzysciPoziomu(0);

  // Breadcrumbs
  const crumbs = document.querySelectorAll('#breadcrumbs .breadcrumb-item');
  crumbs.forEach(c => {
    c.addEventListener('click', () => {
      const step = parseInt(c.getAttribute('data-step'));
      goToStep(step);
    });
  });
}

/**
 * Ładuje i renderuje kafelki ścieżek w Kroku 3
 */
async function zaladujSciezkiDoKafelkow() {
  try {
    inicjalizujAkordeonSciezek();
    renderPathSectionsVisibility();
    await renderPathSection(1);
    await renderPathSection(3);
    await renderPathSection(7);
    updateStep3NextButton();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Nie udało się załadować ścieżek:', e);
  }
}

/**
 * Umożliwia ręczne zwijanie/rozwijanie sekcji ścieżek po kliknięciu nagłówka
 * (np. by wrócić do wcześniej wybranej ścieżki i zmienić decyzję).
 */
function inicjalizujAkordeonSciezek() {
  document.querySelectorAll('.path-section-header').forEach(header => {
    header.addEventListener('click', () => {
      const sekcja = header.closest('.path-section');
      if (sekcja) sekcja.classList.toggle('collapsed');
    });
  });
}

function renderPathSectionsVisibility() {
  const can3 = wybranyPoziom >= 3;
  const can7 = wybranyPoziom >= 7;
  const sec1 = document.getElementById('path-section-1');
  const sec3 = document.getElementById('path-section-3');
  const sec7 = document.getElementById('path-section-7');
  const g3 = document.getElementById('path-grid-3');
  const s3 = document.getElementById('path-summary-3');
  const g7 = document.getElementById('path-grid-7');
  const s7 = document.getElementById('path-summary-7');

  // Dla poziomu 0 ukryj wszystkie sekcje ścieżek
  const poziomZero = wybranyPoziom === 0;
  if (sec1) sec1.style.display = poziomZero ? 'none' : '';
  if (sec3) sec3.style.display = poziomZero ? 'none' : '';
  if (sec7) sec7.style.display = poziomZero ? 'none' : '';

  if (!poziomZero) {
    // Dostępność sekcji eksperta i mistrza sygnalizuje opacja kafelków
    if (g3) g3.style.opacity = can3 ? '1' : '0.5';
    if (s3) s3.textContent = can3 ? '' : 'Odblokuj wyborem poziomu 3 w Kroku 2';
    if (g7) g7.style.opacity = can7 ? '1' : '0.5';
    if (s7) s7.textContent = can7 ? '' : 'Odblokuj wyborem poziomu 7 w Kroku 2';
  }

  updatePathAccordion();
  updateStep3NextButton();
}

/**
 * Rozwija sekcję pierwszej niewybranej dostępnej ścieżki, a zwija pozostałe
 * dostępne sekcje. Sekcje niedostępne (zablokowane wyższym poziomem) są
 * domyślnie zwinięte - widoczny zostaje tylko komunikat o odblokowaniu.
 */
function updatePathAccordion() {
  const poziomy = [1, 3, 7];
  const wybraneMapa = { 1: wybraneSciezki.nowicjusz, 3: wybraneSciezki.ekspert, 7: wybraneSciezki.mistrz };
  const dostepnePoziomy = poziomy.filter(p => wybranyPoziom >= p);
  const aktywnyPoziom = dostepnePoziomy.find(p => !wybraneMapa[p]);

  poziomy.forEach(p => {
    const sekcja = document.getElementById(`path-section-${p}`);
    if (!sekcja) return;
    if (!dostepnePoziomy.includes(p)) {
      // Sekcja niedostępna - poza akordeonem, domyślnie zwinięta
      sekcja.classList.add('collapsed');
      return;
    }
    sekcja.classList.toggle('collapsed', p !== aktywnyPoziom);
  });
}

async function renderPathSection(poziomWyboru) {
  const gridId = `path-grid-${poziomWyboru}`;
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  let paths = [];
  try {
    paths = getPathsForLevel(poziomWyboru);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Nie udało się załadować ścieżek:', error);
    return;
  }
  for (const p of paths) {
    const tile = renderPathTile(p, poziomWyboru);
    grid.appendChild(tile);
  }
  // updateStep3NextButton() jest wywoływane w applyPathBenefits
}

function renderPathTile(path, poziomWyboru) {
  const canPick = wybranyPoziom >= poziomWyboru;
  const selectedId = poziomWyboru === 1 ? wybraneSciezki.nowicjusz : (poziomWyboru === 3 ? wybraneSciezki.ekspert : wybraneSciezki.mistrz);
  const isSelected = selectedId === path.id;
  const tile = document.createElement('div');
  tile.className = `tile path-tile${  isSelected ? ' selected' : ''}`;
  tile.style.opacity = canPick ? '1' : '0.5';
  tile.innerHTML = `
    <div class="tile-header">
      <div>
        <div class="tile-title">${path.nazwa}</div>
        <small>${path.zrodlo || 'PG'} • Poziom wyboru ${poziomWyboru}</small>
      </div>
    </div>
    <div class="tile-body">
      ${renderPathBenefitsList(path, poziomWyboru)}
    </div>
    <div class="tile-footer">
      <button class="btn-primary" ${canPick ? '' : 'disabled'} data-path-id="${path.id}" data-pick-level="${poziomWyboru}">${isSelected ? 'Wybrano' : 'Wybierz tę ścieżkę'}</button>
    </div>
  `;
  const btn = tile.querySelector('button');
  if (btn && canPick) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      applyPathBenefits({ poziomWyboru, sciezka: path });
      // Po wyborze prze-renderuj sekcję, aby podświetlić kafel
      renderPathSection(poziomWyboru);
    });
  }
  return tile;
}

function renderPathBenefitsList(path, poziomWyboru) {
  const pkt = (path.korzysci && path.korzysci[poziomWyboru]) || {};
  const talenty = (pkt.talenty || []).map(t => `<li><strong>Talent:</strong> ${t.nazwa || t} – ${t.opis || ''}</li>`).join('');
  const zaklecia = (pkt.zaklecia || []).map(z => `<li><strong>Zaklęcie:</strong> ${z.nazwa || z} ${z.tradycja ? `(${  z.tradycja  })` : ''}</li>`).join('');
  const modAttr = pkt.mod_atrybuty ? Object.entries(pkt.mod_atrybuty).map(([k,v]) => `${k}: ${v>0?'+':''}${v}`).join(', ') : '';
  const modSec = pkt.mod_drugorzedne ? Object.entries(pkt.mod_drugorzedne).map(([k,v]) => `${k}: ${v>0?'+':''}${v}`).join(', ') : '';
  const biegl = (pkt.bieglosci || []).map(b => `<li><strong>Języki i profesje:</strong> ${b}</li>`).join('');
  const sprz = (pkt.sprzet || []).map(s => `<li><strong>Sprzęt:</strong> ${s}</li>`).join('');
  return `
    <div class="benefit-category"><h5>Korzyści poziomu ${poziomWyboru}</h5>
      <ul class="path-benefits">
        ${talenty}
        ${zaklecia}
        ${modAttr?`<li><strong>Modyfikatory atrybutów:</strong> ${modAttr}</li>`:''}
        ${modSec?`<li><strong>Modyfikatory drugorzędne:</strong> ${modSec}</li>`:''}
        ${biegl}
        ${sprz}
      </ul>
    </div>`;
}

function applyPathBenefits({ poziomWyboru, sciezka }) {
  // eslint-disable-next-line no-console
  console.log('applyPathBenefits:', { poziomWyboru, sciezka: sciezka.id, wybranyPoziom });
  
  // Usuń poprzednie benefity z tego progu
  if (przyznaneKorzysciZeSciezek[poziomWyboru]) {
    odejmijBenefity(przyznaneKorzysciZeSciezek[poziomWyboru]);
  }
  // Zapisz wybór ścieżki w stanie uproszczonym
  if (poziomWyboru === 1) {
    wybraneSciezki.nowicjusz = sciezka.id;
    // eslint-disable-next-line no-console
    console.log('Ustawiono ścieżkę nowicjusza:', sciezka.id);
  }
  if (poziomWyboru === 3) {
    wybraneSciezki.ekspert = sciezka.id;
    // eslint-disable-next-line no-console
    console.log('Ustawiono ścieżkę eksperta:', sciezka.id);
  }
  if (poziomWyboru === 7) {
    wybraneSciezki.mistrz = sciezka.id;
    // eslint-disable-next-line no-console
    console.log('Ustawiono ścieżkę mistrza:', sciezka.id);
  }

  // Zastosuj nowy pakiet korzyści
  const pkt = (sciezka.korzysci && sciezka.korzysci[poziomWyboru]) || {};
  przyznaneKorzysciZeSciezek[poziomWyboru] = { sciezkaId: sciezka.id, poziomWyboru, pkt };
  dodajBenefity(pkt);
  aktualizujPodgladPostaci();
  renderPathSummary(poziomWyboru, sciezka);
  updatePathAccordion();
  updateStep3NextButton();
}

/**
 * Włącza przycisk "Dalej" w Kroku 3, gdy wybrane są wymagane ścieżki
 */
function updateStep3NextButton() {
  const btn = document.getElementById('btn-next-3');
  if (!btn) return;
  
  // Dla poziomu 0 nie wymagaj żadnych ścieżek
  if (wybranyPoziom === 0) {
    btn.disabled = false;
    // eslint-disable-next-line no-console
    console.log('Poziom 0 - przycisk włączony');
    return;
  }
  
  const hasNovice = !!wybraneSciezki.nowicjusz;
  const needExpert = wybranyPoziom >= 3;
  const needMaster = wybranyPoziom >= 7;
  const hasExpert = !!wybraneSciezki.ekspert;
  const hasMaster = !!wybraneSciezki.mistrz;
  const canProceed = hasNovice && (!needExpert || hasExpert) && (!needMaster || hasMaster);
  btn.disabled = !canProceed;
  
  // Debug - sprawdź stan
  // eslint-disable-next-line no-console
  console.log('updateStep3NextButton debug:', {
    wybranyPoziom,
    wybraneSciezki,
    hasNovice,
    needExpert,
    needMaster,
    hasExpert,
    hasMaster,
    canProceed,
    disabled: btn.disabled
  });
}

function renderPathSummary(poziomWyboru, sciezka) {
  const box = document.getElementById(`path-summary-${poziomWyboru}`);
  if (!box) return;
  box.innerHTML = `<div class="inline-box">Wybrana ścieżka: <strong>${sciezka.nazwa}</strong> – zastosowano korzyści poziomu ${poziomWyboru}</div>`;
}

function dodajBenefity(pkt) {
  // Modyfikatory atrybutów podstawowych
  if (pkt.mod_atrybuty) {
    const map = { sila:'sila-final', zrecznosc:'zrecznosc-final', intelekt:'intelekt-final', wola:'wola-final' };
    Object.entries(pkt.mod_atrybuty).forEach(([k,v]) => {
      const el = document.getElementById(map[k]);
      if (el) el.textContent = (parseInt(el.textContent)||0) + v;
    });
  }
  // Atrybuty drugorzędne – przeliczenie przez naszą funkcję
  const pochodzenie = wybranePochodzenie && dostepnePochodzenia.find(p=>p.id===wybranePochodzenie);
  if (pochodzenie) {
    const atrybuty = {
      sila: parseInt(document.getElementById('sila-final').textContent),
      zrecznosc: parseInt(document.getElementById('zrecznosc-final').textContent),
      intelekt: parseInt(document.getElementById('intelekt-final').textContent),
      wola: parseInt(document.getElementById('wola-final').textContent)
    };
    aktualizujAtrybutyDrugorzedne(atrybuty, pochodzenie);
  }
}

function odejmijBenefity(prev) {
  const pkt = prev.pkt || {};
  if (pkt.mod_atrybuty) {
    const map = { sila:'sila-final', zrecznosc:'zrecznosc-final', intelekt:'intelekt-final', wola:'wola-final' };
    Object.entries(pkt.mod_atrybuty).forEach(([k,v]) => {
      const el = document.getElementById(map[k]);
      if (el) el.textContent = (parseInt(el.textContent)||0) - v;
    });
  }
  const pochodzenie = wybranePochodzenie && dostepnePochodzenia.find(p=>p.id===wybranePochodzenie);
  if (pochodzenie) {
    const atrybuty = {
      sila: parseInt(document.getElementById('sila-final').textContent),
      zrecznosc: parseInt(document.getElementById('zrecznosc-final').textContent),
      intelekt: parseInt(document.getElementById('intelekt-final').textContent),
      wola: parseInt(document.getElementById('wola-final').textContent)
    };
    aktualizujAtrybutyDrugorzedne(atrybuty, pochodzenie);
  }
}

/**
 * Aktualizuje dostępne ścieżki na podstawie wybranego poziomu
 * @param {number} poziom - Wybrany poziom postaci
 */
async function aktualizujSciezkiPoziomu(_poziom) {
  // Nowy system kafelków - funkcja jest już obsługiwana przez renderPathSectionsVisibility()
  // i renderPathSection() w głównym flow
}

/**
 * Fallback do ładowania ścieżek gdy API nie działa
 * @param {number} _poziom - Wybrany poziom postaci
 */
/* eslint-disable-next-line no-unused-vars */
function aktualizujSciezkiFallback(_poziom) {
  const selNov = document.getElementById('sciezka-nowicjusza');
  const selExp = document.getElementById('sciezka-eksperta');
  const selMas = document.getElementById('sciezka-mistrza');
  if (selNov) selNov.innerHTML = '<option value="">Wybierz ścieżkę...</option>';
  if (selExp) selExp.innerHTML = '<option value="">Wybierz ścieżkę...</option>';
  if (selMas) selMas.innerHTML = '<option value="">Wybierz ścieżkę...</option>';

  const nowicjusz = [
    { id: 'kleryk', nazwa: 'Kleryk' },
    { id: 'magik', nazwa: 'Magik' },
    { id: 'łotr', nazwa: 'Łotr' },
    { id: 'wojownik', nazwa: 'Wojownik' }
  ];
  const ekspert = [
    { id: 'berserker', nazwa: 'Berserker' },
    { id: 'czarnoksiężnik', nazwa: 'Czarnoksiężnik' },
    { id: 'odkrywca', nazwa: 'Odkrywca' },
    { id: 'pancerniak', nazwa: 'Pancerniak' },
    { id: 'rewolwerowiec', nazwa: 'Rewolwerowiec' },
    { id: 'strzelec_wyborowy', nazwa: 'Strzelec Wyborowy' },
    { id: 'szelma', nazwa: 'Szelma' },
    { id: 'taumaturg', nazwa: 'Taumaturg' },
    { id: 'technomanta', nazwa: 'Technomanta' },
    { id: 'templariusz', nazwa: 'Templariusz' }
  ];
  const mistrz = [
    { id: 'mistrz_oręża', nazwa: 'Mistrz Oręża' },
    { id: 'mędrzec', nazwa: 'Mędrzec' },
    { id: 'negator', nazwa: 'Negator' },
    { id: 'niszczyciel', nazwa: 'Niszczyciel' }
  ];

  if (selNov) {
    nowicjusz.forEach(s => {
      const o = document.createElement('option');
      o.value = s.id; o.textContent = s.nazwa; selNov.appendChild(o);
    });
    if (wybraneSciezki.nowicjusz) selNov.value = wybraneSciezki.nowicjusz;
  }
  if (_poziom >= 3 && selExp) {
    ekspert.forEach(s => {
      const o = document.createElement('option');
      o.value = s.id; o.textContent = s.nazwa; selExp.appendChild(o);
    });
    if (wybraneSciezki.ekspert) selExp.value = wybraneSciezki.ekspert;
  }
  if (_poziom >= 7 && selMas) {
    mistrz.forEach(s => {
      const o = document.createElement('option');
      o.value = s.id; o.textContent = s.nazwa; selMas.appendChild(o);
    });
    if (wybraneSciezki.mistrz) selMas.value = wybraneSciezki.mistrz;
  }
}

/**
 * Aktualizuje tytuł sekcji ścieżek na podstawie poziomu
 * @param {number} poziom - Wybrany poziom postaci
 */
function aktualizujTytulSekcjiSciezek(poziom) {
  const tytul = document.getElementById('path-section-title');
  if (!tytul) return;

  const nazwyPoziomow = {
    1: 'Ścieżka Nowicjusza',
    2: 'Kontynuacja Nowicjusza',
    3: 'Ścieżka Eksperta',
    4: 'Kontynuacja Eksperta',
    5: 'Ścieżka Mistrza',
    6: 'Kontynuacja Mistrza',
    7: 'Ścieżka Legendy',
    8: 'Kontynuacja Legendy',
    9: 'Wszystkie Ścieżki',
    10: 'Wszystkie Ścieżki'
  };

  tytul.textContent = nazwyPoziomow[poziom] || 'Ścieżki';
}

/**
 * Ustawia widoczność selectów ścieżek w zależności od poziomu
 */
function aktualizujWidocznoscSciezek(_poziom) {
  // Funkcja jest już obsługiwana przez renderPathSectionsVisibility()
  renderPathSectionsVisibility();
}

/**
 * Aktualizuje sekcję zasobów (złoto i kurioza) na podstawie poziomu
 */
function aktualizujWealthSection(poziom) {
  const sec = document.getElementById('wealth-section');
  if (!sec) return;
  sec.style.display = poziom > 0 ? 'block' : 'none';
  liczbaKuriozow = (poziom >= 1 ? 1 : 0) + (poziom >= 3 ? 1 : 0) + (poziom >= 7 ? 1 : 0);
  const curiosSpan = document.getElementById('curios-summary');
  if (curiosSpan) curiosSpan.textContent = `Kurioza: ${liczbaKuriozow}`;
  const wealthSpan = document.getElementById('wealth-summary');
  if (wealthSpan && wylosowaneSrebrniki != null) {
    wealthSpan.textContent = `Srebrniki: ${wylosowaneSrebrniki}`;
  }
}

/**
 * Uaktualnia wyświetlanie bogactwa po losowaniu
 */
function aktualizujWealthUI(rzuty, suma) {
  const wealthSpan = document.getElementById('wealth-summary');
  if (wealthSpan) {
    wealthSpan.textContent = `Srebrniki: ${suma} (rzuty: ${rzuty.join(', ')})`;
  }
}

/**
 * Aktualizuje sekcję korzyści z pochodzenia na podstawie poziomu
 */
function aktualizujOriginBenefits(poziom) {
  const sec = document.getElementById('origin-benefits-section');
  if (!sec) return;
  
  // Pokaż sekcję tylko dla poziomu 4
  sec.style.display = poziom >= 4 ? 'block' : 'none';
  
  if (poziom >= 4 && wybranePochodzenie) {
    aktualizujOriginBenefitsContent();
    // Zaktualizuj atrybuty z bonusem z poziomu 4
    aktualizujAtrybutyZPoziomem4();
  }
}

/**
 * Aktualizuje zawartość korzyści z pochodzenia
 */
function aktualizujOriginBenefitsContent() {
  const content = document.getElementById('origin-benefits-content');
  if (!content || !wybranePochodzenie) return;
  
  const pochodzenie = dostepnePochodzenia.find(p => p.id === wybranePochodzenie);
  if (!pochodzenie || !pochodzenie.poziom_4) return;
  
  const benefits = pochodzenie.poziom_4;
  
  // Wyświetl korzyści z pochodzenia dla poziomu 4
  content.innerHTML = `
    <div class="benefit-item">
      <h5>Korzyści z Pochodzenia: ${pochodzenie.nazwa} (Poziom 4)</h5>
      <div class="origin-benefits-details">
        <div class="health-bonus">
          <h6>🏥 Bonus do Zdrowia</h6>
          <p><strong>Zdrowie:</strong> +${benefits.zdrowie.replace('+', '')}</p>
        </div>
        
        <div class="options-selection">
          <h6>⚡ Wybierz Opcję</h6>
          <p>Możesz nauczyć się jednego zaklęcia lub zyskać talent:</p>
          <div class="options-list">
            ${benefits.opcje.map(opcja => `
              <label class="option-choice">
                <input type="radio" name="origin-option-${pochodzenie.id}" value="${opcja}">
                <span class="option-text">${opcja}</span>
              </label>
            `).join('')}
          </div>
        </div>
        
        <div class="talent-descriptions">
          <h6>📖 Opisy Talentów</h6>
          ${generujOpisyTalentow(benefits.opcje)}
        </div>
      </div>
    </div>
  `;
  
  // Dodaj event listenery dla wyboru opcji
  dodajEventListeneryOpcji(pochodzenie.id);
}

/**
 * Generuje opisy talentów na podstawie opcji
 */
function generujOpisyTalentow(opcje) {
  const opisyTalentow = {
    'talent Determinacja': 'Gdy wyrzucisz 1 na kości ułatwienia, możesz rzucić ponownie i wybrać, którego wyniku użyć.',
    'talent Wysokie obroty': 'Możesz wykonać dodatkową akcję w swojej turze. Po wykorzystaniu tego talentu musisz odbyć pełny odpoczynek, zanim zdołasz użyć go ponownie.',
    'talent Odskok': 'Gdy stworzenie, które widzisz, chybi, atakując twoją Obronę lub Zręczność, możesz użyć reakcji, by wykonać odwrót.',
    'talent Nie do zdarcia': 'Możesz użyć akcji, by uleczyć tyle obrażeń, ile wynosi twoja Szybkość Zdrowienia, a także pozbyć się jednego z następujących stanów: wyczerpanie, osłabienie lub zatrucie. Po wykorzystaniu tego talentu musisz odbyć pełny odpoczynek, zanim zdołasz użyć go ponownie.',
    'talent Prymat sobowtóra': 'W trakcie swojej tury możesz użyć Kradzieży tożsamości jako reakcji. Ponadto gdy skradniesz tożsamość jakiejś istoty, to dopóki naśladujesz jej wygląd, wszelkie ataki przeciw niej wykonujesz z 1 ułatwieniem.',
    'talent Furia': 'Gdy twoje Zdrowie spadnie poniżej połowy maksymalnej wartości, wszystkie twoje ataki zadają dodatkowe obrażenia równe twojej Sile.',
    'talent Kontrolowany szał': 'Możesz wpaść w szał bojowy jako akcję. W szał bojowy otrzymujesz +2 do ataków, ale -2 do Obrony. Szał trwa do końca walki lub do momentu, gdy zdecydujesz się go zakończyć jako akcję.'
  };
  
  return opcje.map(opcja => {
    if (opcja.startsWith('talent ')) {
      const nazwaTalentu = opcja;
      const opis = opisyTalentow[nazwaTalentu] || 'Opis talentu nie jest dostępny.';
      return `
        <div class="talent-description">
          <strong>${nazwaTalentu}:</strong> ${opis}
        </div>
      `;
    } else if (opcja === '1 zaklęcie') {
      return `
        <div class="spell-description">
          <strong>1 zaklęcie:</strong> Możesz nauczyć się jednego zaklęcia z dostępnych szkół magii.
        </div>
      `;
    }
    return '';
  }).join('');
}

/**
 * Dodaje event listenery dla wyboru opcji pochodzenia
 */
function dodajEventListeneryOpcji(pochodzenieId) {
  const radioButtons = document.querySelectorAll(`input[name="origin-option-${pochodzenieId}"]`);
  radioButtons.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.checked) {
        // Zaktualizuj obliczone atrybuty z bonusem do zdrowia
        aktualizujAtrybutyZPoziomem4();
      }
    });
  });
}

/**
 * Aktualizuje atrybuty z uwzględnieniem bonusu z poziomu 4
 */
function aktualizujAtrybutyZPoziomem4() {
  if (wybranyPoziom < 4 || !wybranePochodzenie) return;
  
  const pochodzenie = dostepnePochodzenia.find(p => p.id === wybranePochodzenie);
  if (!pochodzenie || !pochodzenie.poziom_4) return;
  
  const healthBonus = parseInt(pochodzenie.poziom_4.zdrowie.replace('+', ''));
  
  // Pobierz aktualne atrybuty
  const atrybuty = {
    sila: parseInt(document.getElementById('sila-final').textContent),
    zrecznosc: parseInt(document.getElementById('zrecznosc-final').textContent),
    intelekt: parseInt(document.getElementById('intelekt-final').textContent),
    wola: parseInt(document.getElementById('wola-final').textContent)
  };
  
  // Dodaj bonus do zdrowia
  const atrybutyZBonusem = {
    ...atrybuty,
    zdrowie: atrybuty.sila + healthBonus
  };
  
  // Aktualizuj wyświetlane atrybuty drugorzędne
  aktualizujAtrybutyDrugorzedne(atrybutyZBonusem, pochodzenie);
}

/**
 * Ładuje rozszerzone dane pochodzeń z nowego API
 * @param {Array} pochodzeniaIds - Lista ID pochodzeń
 * @param {Array} pochodzeniaZTabelami - Lista metadanych pochodzeń z tabelami
 * @returns {Array} Tablica obiektów pochodzeń z pełnymi danymi
 */
async function zaladujSzczegolyPochodzenRozszerzone(pochodzeniaIds, _pochodzeniaZTabelami = []) {
  const pochodzenia = [];
  
  // Dopuszczalne źródła zgodne z katalogiem SOURCES
  const dozwoloneZrodla = new Set(['PG', 'SP', 'RA', 'NW', 'GWP', 'GP', 'SUP', 'CS']);
  
  for (const pochodzenieId of pochodzeniaIds) {
    try {
      // Pobierz podstawowe dane pochodzenia
      const postac = budujPostac({
        pochodzenie: pochodzenieId,
        atrybuty: { sila: 10, zrecznosc: 10, intelekt: 10, wola: 10 }
      });
      // Kopia płytka, żeby nie mutować współdzielonego obiektu z DANE_GRY
      const podstawoweDane = { ...postac.pochodzenie };

      // Filtrowanie pochodzeń tylko do tych z dokumentów SOURCES
      if (!podstawoweDane || !podstawoweDane.zrodlo || !dozwoloneZrodla.has(podstawoweDane.zrodlo)) {
        continue;
      }

      // Spróbuj zawsze pobrać tabele (niezależnie od metadanych), jeśli istnieją
      try {
        const tabele = getOriginTablesUI(pochodzenieId);
        if (tabele) {
          podstawoweDane.tabele = tabele;
        }
      } catch (tablesError) {
        // eslint-disable-next-line no-console
        console.warn(`Nie udało się załadować tabel dla pochodzenia ${pochodzenieId}:`, tablesError);
      }

      pochodzenia.push(podstawoweDane);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`Nie udało się załadować danych dla pochodzenia ${pochodzenieId}:`, error);
    }
  }
  
  return pochodzenia;
}

/**
 * Generuje rozwijane kafelki pochodzeń z dwoma stanami (zwinięty/rozwinięty)
 * @param {Array} pochodzenia - Lista obiektów pochodzeń z danymi
 * @throws {Error} Gdy parametr nie jest tablicą
 */
function generujKafelkiPochodzen(pochodzenia) {
  if (!Array.isArray(pochodzenia)) {
    throw new Error('pochodzenia musi być tablicą');
  }
    
  const container = document.getElementById('pochodzenie-tiles');
  if (!container) {
    throw new Error('Element #pochodzenie-tiles nie został znaleziony');
  }
    
  container.innerHTML = '';

  pochodzenia.forEach(pochodzenie => {
    const tile = document.createElement('div');
    tile.className = 'origin-tile compact';
    tile.dataset.originId = pochodzenie.id;
        
    // Krótki opis (1 zdanie) dla stanu zwiniętego
    const krotkiOpis = utworzKrotkiOpisZwiniety(pochodzenie);
        
    // Rozszerzony opis (3 zdania) dla stanu rozwiniętego
    const rozszerzonyOpis = utworzRozszerzonyOpis(pochodzenie);
        
    // Oblicz atrybuty drugorzędne
    const atrybutyDomyślne = { sila: 10, zrecznosc: 10, intelekt: 10, wola: 10 };
    const atrybutyFinalne = {
      sila: atrybutyDomyślne.sila + (pochodzenie.atrybuty_bazowe.sila - 10),
      zrecznosc: atrybutyDomyślne.zrecznosc + (pochodzenie.atrybuty_bazowe.zrecznosc - 10),
      intelekt: atrybutyDomyślne.intelekt + (pochodzenie.atrybuty_bazowe.intelekt - 10),
      wola: atrybutyDomyślne.wola + (pochodzenie.atrybuty_bazowe.wola - 10)
    };
        
    // Oblicz obronę (bez modyfikatorów rozmiaru - zgodnie z zasadami gry)
    const obrona = atrybutyFinalne.zrecznosc;
    const zdrowie = atrybutyFinalne.sila;
        
    // Pobierz wszystkie cechy specjalne dla stanu rozwiniętego
    const wszystkieCechy = pobierzWszystkieCechy(pochodzenie.cechy_specjalne);

    tile.innerHTML = `
            <div class="tile-header">
                <div class="badges-container">
                    <div class="feature-desc">rozmiar:</div><div class="size-badge">${pochodzenie.rozmiar}</div>
                    ${pochodzenie.zrodlo ? `<div class="source-badge">${pochodzenie.zrodlo}</div>` : ''}
                </div>
                <h4>${pochodzenie.nazwa}</h4>
            </div>
            
            <!-- Stan zwinięty -->
            <div class="tile-content-collapsed">
                <div class="description">${krotkiOpis}</div>
                <div class="attributes-grid">
                    <div class="attribute-item">
                        <span class="attr-name">Siła</span>
                        <span class="attr-value">${pochodzenie.atrybuty_bazowe.sila}</span>
                        <span class="attr-mod">${formatModifier(pochodzenie.atrybuty_bazowe.sila - 10)}</span>
                    </div>
                    <div class="attribute-item">
                        <span class="attr-name">Zręczność</span>
                        <span class="attr-value">${pochodzenie.atrybuty_bazowe.zrecznosc}</span>
                        <span class="attr-mod">${formatModifier(pochodzenie.atrybuty_bazowe.zrecznosc - 10)}</span>
                    </div>
                    <div class="attribute-item">
                        <span class="attr-name">Intelekt</span>
                        <span class="attr-value">${pochodzenie.atrybuty_bazowe.intelekt}</span>
                        <span class="attr-mod">${formatModifier(pochodzenie.atrybuty_bazowe.intelekt - 10)}</span>
                    </div>
                    <div class="attribute-item">
                        <span class="attr-name">Wola</span>
                        <span class="attr-value">${pochodzenie.atrybuty_bazowe.wola}</span>
                        <span class="attr-mod">${formatModifier(pochodzenie.atrybuty_bazowe.wola - 10)}</span>
                    </div>
                </div>
            </div>
            
            <!-- Stan rozwinięty -->
            <div class="tile-content-expanded">
                <div class="expanded-description">${rozszerzonyOpis}</div>
                
                <div class="tile-sections">
                    <div class="tile-section attributes-section">
                        <h5>⚔️ Atrybuty</h5>
                        <div class="attributes-grid">
                            <div class="attribute-item">
                                <span class="attr-name">Siła</span>
                                <span class="attr-value">${pochodzenie.atrybuty_bazowe.sila}</span>
                                <span class="attr-mod">${formatModifier(pochodzenie.atrybuty_bazowe.sila - 10)}</span>
                            </div>
                            <div class="attribute-item">
                                <span class="attr-name">Zręczność</span>
                                <span class="attr-value">${pochodzenie.atrybuty_bazowe.zrecznosc}</span>
                                <span class="attr-mod">${formatModifier(pochodzenie.atrybuty_bazowe.zrecznosc - 10)}</span>
                            </div>
                            <div class="attribute-item">
                                <span class="attr-name">Intelekt</span>
                                <span class="attr-value">${pochodzenie.atrybuty_bazowe.intelekt}</span>
                                <span class="attr-mod">${formatModifier(pochodzenie.atrybuty_bazowe.intelekt - 10)}</span>
                            </div>
                            <div class="attribute-item">
                                <span class="attr-name">Wola</span>
                                <span class="attr-value">${pochodzenie.atrybuty_bazowe.wola}</span>
                                <span class="attr-mod">${formatModifier(pochodzenie.atrybuty_bazowe.wola - 10)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tile-section mechanics-section">
                        <h5>🎲 Mechanika</h5>
                        <div class="mechanics-grid">
                            <div class="mechanics-item">
                                <span class="mech-label">Obrona:</span>
                                <span class="mech-value">${obrona}</span>
                            </div>
                            <div class="mechanics-item">
                                <span class="mech-label">Zdrowie:</span>
                                <span class="mech-value">${zdrowie}</span>
                            </div>
                            <div class="mechanics-item">
                                <span class="mech-label">Prędkość:</span>
                                <span class="mech-value">${pochodzenie.predkosc}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tile-section cultural-section">
                        <h5>🌍 Kulturowe</h5>
                        <div class="cultural-info">
                            <div class="cultural-item">
                                <span class="cultural-label">Języki:</span>
                                <span class="cultural-value">${pochodzenie.jezyki.join(', ')}</span>
                            </div>
                            <div class="cultural-item">
                                <span class="cultural-label">Profesje:</span>
                                <span class="cultural-value">${pochodzenie.profesje.join(', ')}</span>
                            </div>
                        </div>
                    </div>
                    
                    ${wszystkieCechy ? `
                    <div class="tile-section features-section">
                        <h5>✨ Cechy Specjalne</h5>
                        <div class="features-list">
                            ${wszystkieCechy.map(cecha => `
                                <div class="feature-item">
                                    <span class="feature-name">${cecha.nazwa}</span>
                                    <span class="feature-desc">${cecha.opis}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    ${pochodzenie.tabele && Object.keys(pochodzenie.tabele).length > 0 ? `
                    <div class="tile-section tables-section">
                        <h5>🎲 Tabele Losowania</h5>
                        <div class="tables-grid">
                            ${Object.entries(pochodzenie.tabele).map(([nazwaTabeli, tabela]) => `
                                <div class="table-item">
                                    <div class="table-header">
                                        <span class="table-name">${tabela.nazwa}</span>
                                        <span class="table-type">${tabela.typ}</span>
                                    </div>
                                    <div class="table-description">${tabela.opis}</div>
                                    
                                    <div class="table-controls">
                                        <div class="table-options">
                                            <label for="table-select-${pochodzenie.id}-${nazwaTabeli}">Wybierz opcję:</label>
                                            <select id="table-select-${pochodzenie.id}-${nazwaTabeli}" class="table-dropdown" data-origin-id="${pochodzenie.id}" data-table-name="${nazwaTabeli}">
                                                <option value="">-- Wybierz opcję --</option>
                                                ${tabela.opcje ? tabela.opcje.map(opcja => `
                                                    <option value="${opcja.rzut}" data-wynik="${opcja.wynik}">${opcja.rzut}: ${opcja.wynik}</option>
                                                `).join('') : ''}
                                            </select>
                                        </div>
                                        
                                        <div class="table-buttons">
                                            <button class="roll-table-btn" data-origin-id="${pochodzenie.id}" data-table-name="${nazwaTabeli}">
                                                🎲 Losuj
                                            </button>
                                            <button class="apply-selection-btn" data-origin-id="${pochodzenie.id}" data-table-name="${nazwaTabeli}" style="display: none;">
                                                ✅ Zastosuj wybór
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div class="roll-result" id="roll-result-${pochodzenie.id}-${nazwaTabeli}" style="display: none;">
                                        <!-- Wynik losowania będzie wyświetlany tutaj -->
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>
                
                <!-- Przycisk wyboru -->
                <div class="tile-select-section">
                    <button class="tile-select-btn" data-origin-id="${pochodzenie.id}">
                        Wybierz ${pochodzenie.nazwa}
                    </button>
                </div>
            </div>
        `;

    // Dodaj obsługę dropdownów
    const dropdowns = tile.querySelectorAll('.table-dropdown');
    dropdowns.forEach(dropdown => {
      dropdown.addEventListener('change', (e) => {
        e.stopPropagation();
        const originId = e.target.dataset.originId;
        const tableName = e.target.dataset.tableName;
        const selectedValue = e.target.value;
        const applyBtn = tile.querySelector(`.apply-selection-btn[data-origin-id="${originId}"][data-table-name="${tableName}"]`);
        
        if (selectedValue && applyBtn) {
          applyBtn.style.display = 'inline-block';
        } else if (applyBtn) {
          applyBtn.style.display = 'none';
        }
      });
    });

    // Dodaj obsługę kliknięcia dla rozwijania/zwijania (cały kafelek)
    tile.addEventListener('click', (e) => {
      // Sprawdź czy kliknięto na przycisk "Wybierz"
      if (e.target.classList.contains('tile-select-btn') || 
                e.target.closest('.tile-select-btn')) {
        e.stopPropagation();
        wybierzPochodzenie(pochodzenie.id);
        return;
      }
      
      // Sprawdź czy kliknięto na przycisk losowania
      if (e.target.classList.contains('roll-table-btn') || 
                e.target.closest('.roll-table-btn')) {
        e.stopPropagation();
        const originId = e.target.dataset.originId || e.target.closest('.roll-table-btn').dataset.originId;
        const tableName = e.target.dataset.tableName || e.target.closest('.roll-table-btn').dataset.tableName;
        losujZTabeliUI(originId, tableName);
        return;
      }
      
      // Sprawdź czy kliknięto na przycisk "Zastosuj wybór"
      if (e.target.classList.contains('apply-selection-btn') || 
                e.target.closest('.apply-selection-btn')) {
        e.stopPropagation();
        const originId = e.target.dataset.originId || e.target.closest('.apply-selection-btn').dataset.originId;
        const tableName = e.target.dataset.tableName || e.target.closest('.apply-selection-btn').dataset.tableName;
        zastosujWybranaOpcje(originId, tableName);
        return;
      }
            
      // W przeciwnym razie rozwiń/zwiń kafelek
      e.stopPropagation();
      toggleTileExpansion(pochodzenie.id);
    });

    container.appendChild(tile);
  });
}

/**
 * Tworzy krótki opis pochodzenia (1 zdanie) dla stanu zwiniętego
 * @param {Object} pochodzenie - Obiekt pochodzenia
 * @returns {string} Krótki opis
 */
function utworzKrotkiOpisZwiniety(pochodzenie) {
  const opisy = {
    'czlowiek': 'Wszechstronni i ambitni, dominują w cywilizowanych krainach.',
    'automaton': 'Mechaniczne istoty stworzone przez dawnych magów.',
    'goblin': 'Małe, zwinne istoty o wielkiej przebiegłości.',
    'krasnolud': 'Krzepcy i uparci mistrzowie rzemiosła.',
    'odmieniec': 'Istoty zmienione przez magię o niezwykłych mocach.',
    'ork': 'Wojownicze istoty o wielkiej sile i zamiłowaniu do walki.',
    'faun': 'Leśne istoty o kozich nogach związane z naturą.',
    'niziol': 'Małe, zwinne istoty znane z zamiłowania do komfortu.',
    'chochlik': 'Maleńkie istoty magiczne znane z psot.',
    'elf': 'Długowieczne istoty o niezwykłej urodzie.',
    'hobgoblin': 'Większe i bardziej wojownicze niż gobliny.',
    'fomor': 'Potworne istoty z głębin o przerażającym wyglądzie.',
    'niedzwiedziadlo': 'Istoty o niedźwiedzim wyglądzie znane z siły.',
    'warg': 'Wilcze istoty o niezwykłej zwinności.',
    'inkarnacja': 'Istoty wcielone z innych płaszczyzn.',
    'kambion': 'Potomkowie demonów o mrocznych mocach.',
    'jotunn': 'Potężni giganci z północnych krain.'
  };
    
  return opisy[pochodzenie.id] || 'Nieznane pochodzenie.';
}

/**
 * Tworzy rozszerzony opis pochodzenia (3 zdania) dla stanu rozwiniętego
 * @param {Object} pochodzenie - Obiekt pochodzenia
 * @returns {string} Rozszerzony opis
 */
function utworzRozszerzonyOpis(pochodzenie) {
  const opisy = {
    'czlowiek': 'Wszechstronni i ambitni, dominują w cywilizowanych krainach. Mogą wybrać dowolną profesję i szybko dostosowują się do nowych wyzwań. Ich społeczeństwa opierają się na handlu, wiedzy i eksploracji.',
    'automaton': 'Mechaniczne istoty stworzone przez dawnych magów, poszukujące własnej tożsamości. Nie oddychają, nie śpią i są odporne na choroby oraz trucizny. Zbudowane z metalu i magii, wykazują zdolności analityczne i precyzyjne wykonanie zadań.',
    'goblin': 'Małe, zwinne istoty o wielkiej przebiegłości, znane z zamiłowania do mechaniki i psot. Gobliny tworzą skomplikowane urządzenia z dostępnych materiałów, często niebezpieczne i nieprzewidywalne. Ich społeczeństwa opierają się na hierarchii opartej na wynalazczości i sprycie.',
    'krasnolud': 'Krzepcy i uparci mistrzowie rzemiosła, odporni na magię i posiadający widzenie w ciemności. Ich długowieczność pozwala im doskonalić umiejętności przez wieki, tworząc arcydzieła metalurgii i kamieniarstwa. Krasnoludy cenią tradycję, honor i solidną pracę.',
    'odmieniec': 'Istoty zmienione przez magię o niezwykłych mocach, posiadające częściową odporność na efekty magiczne. Odmieniący często wyglądają inaczej niż ich przodkowie, zyskując fizyczne i magiczne zdolności. Ich społeczeństwa są tolerancyjne wobec różnorodności, ale niektórzy postrzegają ich jako zagrożenie.',
    'ork': 'Wojownicze istoty o wielkiej sile i zamiłowaniu do walki, mogące wpadać w szał bojowy. Orki organizują się w klany oparte na hierarchii wojennej, gdzie pozycja zależy od umiejętności bojowych. Mimo dzikiej reputacji, potrafią być lojalnymi sojusznikami i mądrymi strategami.',
    'faun': 'Leśne istoty o kozich nogach związane z naturą, potrafiące porozumiewać się ze zwierzętami. Fauny żyją w harmonii z przyrodą i są strażnikami lasów. Ich społeczeństwa są egalitarne i oparte na szacunku dla naturalnego porządku.',
    'niziol': 'Małe, zwinne istoty znane z zamiłowania do komfortu, posiadające naturalne szczęście i zwinność. Nizioły są mistrzami architektury i inżynierii, tworząc imponujące konstrukcje. Ich społeczeństwa cenią współpracę, uczciwość i dbałość o szczegóły.',
    'chochlik': 'Maleńkie istoty magiczne znane z psot, mogące latać i mające dostęp do chaotycznych zaklęć. Chochliki uwielbiają żarty i psikusy, ale potrafią być niezwykle pomocne. Ich mały rozmiar kompensują sprytem, magią i umiejętnością ukrywania się.',
    'elf': 'Długowieczne istoty o niezwykłej urodzie, posiadające zdolności magiczne i widzenie w ciemności. Ich społeczeństwa są zorganizowane wokół magii i sztuki, żyjąc w harmonii z naturą. Elfy posiadają głęboką wiedzę o starożytnych tajemnicach i są mistrzami w dziedzinie łuku i magii.',
    'hobgoblin': 'Większe i bardziej wojownicze niż gobliny, znane z dyscypliny bojowej i odporności na strach. Hobgobliny organizują się w struktury wojskowe, ceniąc dyscyplinę, strategię i taktykę. Ich społeczeństwa są hierarchiczne i oparte na zasadach wojskowych, z silnym naciskiem na honor i lojalność.',
    'fomor': 'Potworne istoty z głębin o przerażającym wyglądzie, mogące oddychać pod wodą i mające mroczne moce. Fomory często mają zdeformowane ciała i umysły, ale potężne zdolności magiczne. Ich społeczeństwa są chaotyczne i oparte na sile, gdzie tylko najsilniejsi przetrwają.',
    'niedzwiedziadlo': 'Istoty o niedźwiedzim wyglądzie znane z siły, posiadające naturalne pazury i mogące hibernować. Niedźwiedziadła żyją w surowym środowisku gór i lasów, gdzie ich siła i wytrzymałość są kluczowe. Ich społeczeństwa opierają się na hierarchii siły i szacunku dla natury.',
    'warg': 'Wilcze istoty o niezwykłej zwinności, mające wyczulone zmysły i zdolności tropienia. Wargowie żyją w stadach, gdzie współpraca i komunikacja są kluczowe dla przetrwania. Ich społeczeństwa są oparte na lojalności wobec stada i szacunku dla hierarchii.',
    'inkarnacja': 'Istoty wcielone z innych płaszczyzn, posiadające zdolności płaszczyznowe i odporność na magię. Inkarnacje mogą przybierać różne kształty, dostosowując się do potrzeb sytuacji. Ich społeczeństwa są płynne i adaptacyjne, gdzie tożsamość może być zmienna.',
    'kambion': 'Potomkowie demonów o mrocznych mocach, odporni na ogień i mogący wywołać strach u wrogów. Kambionowie często czują się wyobcowani, nie należąc w pełni do żadnego świata. Ich społeczeństwa są tajemne i oparte na wzajemnym wsparciu w obliczu prześladowań.',
    'jotunn': 'Potężni giganci z północnych krain, znani z siły, honoru bojowego i odporności na zimno. Jotunowie żyją w surowym środowisku, gdzie ich rozmiar i wytrzymałość są kluczowe. Ich społeczeństwa opierają się na tradycji, honorze i szacunku dla siły naturalnej.'
  };
    
  return opisy[pochodzenie.id] || 'Nieznane pochodzenie.';
}

/**
 * Tworzy krótki opis pochodzenia (2 zdania) - zachowane dla kompatybilności
 */
// eslint-disable-next-line no-unused-vars
function utworzKrotkiOpis(pochodzenie) {
  const opisy = {
    'czlowiek': 'Wszechstronni i ambitni, dominują w cywilizowanych krainach. Mogą wybrać dowolną profesję.',
    'automaton': 'Mechaniczne istoty stworzone przez dawnych magów. Nie oddychają, nie śpią i są odporne na choroby.',
    'goblin': 'Małe, zwinne istoty o wielkiej przebiegłości. Znane z zamiłowania do mechaniki i psot.',
    'krasnolud': 'Krzepcy i uparci mistrzowie rzemiosła. Odporni na magię i posiadający widzenie w ciemności.',
    'odmieniec': 'Istoty zmienione przez magię o niezwykłych mocach. Posiadają częściową odporność na efekty magiczne.',
    'ork': 'Wojownicze istoty o wielkiej sile i zamiłowaniu do walki. Mogą wpadać w szał bojowy.',
    'faun': 'Leśne istoty o kozich nogach związane z naturą. Potrafią porozumiewać się ze zwierzętami.',
    'niziol': 'Małe, zwinne istoty znane z zamiłowania do komfortu. Posiadają naturalne szczęście i zwinność.',
    'chochlik': 'Maleńkie istoty magiczne znane z psot. Mogą latać i mają dostęp do chaotycznych zaklęć.',
    'elf': 'Długowieczne istoty o niezwykłej urodzie. Posiadają zdolności magiczne i widzenie w ciemności.',
    'hobgoblin': 'Większe i bardziej wojownicze niż gobliny. Znane z dyscypliny bojowej i odporności na strach.',
    'fomor': 'Potworne istoty z głębin o przerażającym wyglądzie. Mogą oddychać pod wodą i mają mroczne moce.',
    'niedzwiedziadlo': 'Istoty o niedźwiedzim wyglądzie znane z siły. Posiadają naturalne pazury i mogą hibernować.',
    'warg': 'Wilcze istoty o niezwykłej zwinności. Mają wyczulone zmysły i zdolności tropienia.',
    'inkarnacja': 'Istoty wcielone z innych płaszczyzn. Posiadają zdolności płaszczyznowe i odporność na magię.',
    'kambion': 'Potomkowie demonów o mrocznych mocach. Odporni na ogień i mogą wywołać strach u wrogów.',
    'jotunn': 'Potężni giganci z północnych krain. Znani z siły, honoru bojowego i odporności na zimno.'
  };
    
  return opisy[pochodzenie.id] || pochodzenie.opis;
}

/**
 * Zbiera wyniki tabel z kafelka pochodzenia
 * @param {string} originId - ID pochodzenia
 */
function zbierzWynikiTabel(originId) {
  // Znajdź kafelek pochodzenia
  const tile = document.querySelector(`[data-origin-id="${originId}"]`);
  if (!tile) return;
  
  // Znajdź wszystkie wyniki tabel w kafelku
  const resultDivs = tile.querySelectorAll('.roll-result');
  resultDivs.forEach(resultDiv => {
    const id = resultDiv.id;
    const match = id.match(/roll-result-(\w+)-(\w+)/);
    if (match) {
      const [, tableOriginId, tableName] = match;
      if (tableOriginId === originId) {
        const content = resultDiv.querySelector('.roll-result-content');
        if (content && content.style.display !== 'none') {
          const rollDice = content.querySelector('.roll-dice');
          const rollOutcome = content.querySelector('.roll-outcome');
          
          if (rollDice && rollOutcome) {
            const rzutMatch = rollDice.textContent.match(/(\d+)/);
            const rzut = rzutMatch ? rzutMatch[1] : '?';
            const wynik = rollOutcome.textContent;
            const typ = rollDice.textContent.includes('🎯') ? 'wybór' : 'losowanie';
            
            // Zapisz wynik
            if (!wynikiTabel[originId]) {
              wynikiTabel[originId] = {};
            }
            wynikiTabel[originId][tableName] = {
              rzut,
              wynik,
              typ
            };
          }
        }
      }
    }
  });
}

/**
 * Wybiera pochodzenie
 * @param {string} originId - ID pochodzenia do wyboru
 */
function wybierzPochodzenie(originId) {
  // Resetuj stan i UI dla poprzedniego wyboru
  resetujStanPoZmianiePochodzenia();

  wybranePochodzenie = originId;
    
  // Zbierz wyniki tabel z wybranego kafelka
  zbierzWynikiTabel(originId);
    
  // Usuń selekcję z wszystkich kafelków
  document.querySelectorAll('.origin-tile').forEach(tile => {
    tile.classList.remove('selected');
  });
    
  // Dodaj selekcję do wybranego kafelka
  const wybranyTile = document.querySelector(`[data-origin-id="${originId}"]`);
  if (wybranyTile) {
    wybranyTile.classList.add('selected');
        
    // Zwiń wszystkie kafelki po wyborze pochodzenia
    collapseAllTiles();
        
    // Aktualizuj podsumowanie pochodzenia
    aktualizujPodsumowaniePochodzenia();
        
    // Aktualizuj domyślne atrybuty
    aktualizujDomyślneAtrybuty();
  }

  // Aktywuj przycisk "Dalej" w kroku 1
  const nextButton = document.getElementById('btn-next-1');
  if (nextButton) {
    nextButton.disabled = false;
  }

  // Pokaż komunikat o wyborze
  pokazKomunikatWyboru(originId);

  // Przewiń do przycisku "Dalej", by użytkownik mógł przejść do następnego kroku
  requestAnimationFrame(() => {
    nextButton?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });
}

/**
 * Resetuje wszystkie dane kolejnych kroków po zmianie pochodzenia
 */
function resetujStanPoZmianiePochodzenia() {
  // Reset stanu aplikacji
  biezacaPostac = null;
  wybranyPoziom = 0;
  wybraneSciezki = { nowicjusz: '', ekspert: '', mistrz: '' };
  przyznaneKorzysciZeSciezek = { 1: null, 3: null, 7: null };
  wybraneProfesje = [];
  odpowiedziSlotow = {};
  wybraneKurioza = [];
  wylosowaneSrebrniki = null;
  liczbaKuriozow = 0;
  wynikiTabel = {};

  // Reset selektorów poziomu
  const levelInputs = document.querySelectorAll('input[name="poziom"]');
  levelInputs.forEach(input => { input.checked = false; });
  const levelZero = Array.from(levelInputs).find(i => i.value === '0');
  if (levelZero) {
    levelZero.checked = true;
  }

  // Reset sekcji bogactwa i kuriozów
  const curiosSpan = document.getElementById('curios-summary');
  if (curiosSpan) curiosSpan.textContent = 'Kurioza: 0';
  const wealthSpan = document.getElementById('wealth-summary');
  if (wealthSpan) wealthSpan.textContent = 'Srebrniki: 0 (nie wylosowano)';

  // Reset sekcji ścieżek (krok 3) - nowy system kafelków
  // Reset podsumowań ścieżek
  const summary1 = document.getElementById('path-summary-1');
  if (summary1) summary1.innerHTML = '';
  const summary3 = document.getElementById('path-summary-3');
  if (summary3) summary3.innerHTML = '';
  const summary7 = document.getElementById('path-summary-7');
  if (summary7) summary7.innerHTML = '';

  // Reset atrybutów własnych i przełączenie na domyślne
  const chkDomyslne = document.getElementById('domyslne-atrybuty');
  if (chkDomyslne) chkDomyslne.checked = true;
  const customDiv = document.getElementById('custom-attributes');
  if (customDiv) customDiv.style.display = 'none';
  ['sila-base','zrecznosc-base','intelekt-base','wola-base'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = 10;
  });

  // Reset korzyści z pochodzenia (krok 2)
  const originBenefits = document.getElementById('origin-benefits-content');
  if (originBenefits) originBenefits.innerHTML = '';

  // Ukryj/pokaż sekcje zależne od poziomu na start (0)
  aktualizujWealthSection(0);
  aktualizujOriginBenefits(0);
  
  // Reset sekcji ścieżek
  renderPathSectionsVisibility();

  // Oblicz od nowa atrybuty na bazie nowego pochodzenia po ustawieniu w wybierzPochodzenie
}

/**
 * Nawigacja do następnego kroku
 */
// eslint-disable-next-line no-unused-vars
function nextStep(currentStep) {
  if (currentStep === 1) {
    if (!wybranePochodzenie) {
      pokazBlad('Wybierz pochodzenie postaci!');
      return;
    }
    pokazKrok(2);
    aktualizujPodsumowaniePochodzenia();
    aktualizujDomyślneAtrybuty();
  } else if (currentStep === 2) {
    pokazKrok(3);
    aktualizujPodgladPostaci();
  } else if (currentStep === 3) {
    pokazKrok(4);
    renderProfessionsSection();
    renderCuriosSection();
  } else if (currentStep === 4) {
    pokazKrok(5);
    aktualizujPodgladPostaci();
  }
}

/**
 * Nawigacja do poprzedniego kroku
 */
// eslint-disable-next-line no-unused-vars
function prevStep(currentStep) {
  if (currentStep === 2) {
    pokazKrok(1);
  } else if (currentStep === 3) {
    pokazKrok(2);
  } else if (currentStep === 4) {
    pokazKrok(3);
  } else if (currentStep === 5) {
    pokazKrok(4);
  } else if (currentStep === 6) {
    pokazKrok(5);
  }
}

/**
 * Pokazuje określony krok
 */
function pokazKrok(stepNumber) {
  // Ukryj wszystkie kroki
  document.querySelectorAll('.step').forEach(step => {
    step.classList.remove('active');
  });
    
  // Pokaż wybrany krok
  document.getElementById(`step-${stepNumber}`).classList.add('active');
  // aktualnyKrok = stepNumber; // Obecnie nieużywane
  updateBreadcrumbs(stepNumber);
}

/**
 * Przechodzi do kroku z pełnym odświeżeniem UI zależnym od niego
 */
function goToStep(stepNumber) {
  // Proste reguły walidacji: nie pozwól przejść dalej bez wymagań
  if (stepNumber === 2 && !wybranePochodzenie) return;
  if (stepNumber === 3) {
    if (!wybranePochodzenie) return;
  }
  if (stepNumber === 4) {
    // Dla poziomu 0 nie wymagaj żadnych ścieżek
    if (wybranyPoziom === 0) return;
    
    // Wymagane ścieżki zgodnie z poziomem
    const needExpert = wybranyPoziom >= 3;
    const needMaster = wybranyPoziom >= 7;
    if (!wybraneSciezki.nowicjusz) return;
    if (needExpert && !wybraneSciezki.ekspert) return;
    if (needMaster && !wybraneSciezki.mistrz) return;
  }
  if (stepNumber === 5) {
    // Wymagane profesje/języki i kurioza
    const { kurioza } = obliczIloscWyborow();
    const { sloty } = obliczSlotyPostaci();
    if (!sloty.every(slot => slotOdpowiedzKompletna(slot))) return;
    if (wybraneKurioza.length < kurioza) return;
  }
  pokazKrok(stepNumber);
  if (stepNumber === 3) {
    renderPathSectionsVisibility();
    renderPathSection(1);
    renderPathSection(3);
    renderPathSection(7);
    updateStep3NextButton();
  }
  if (stepNumber === 4) {
    renderProfessionsSection();
    renderCuriosSection();
  }
  if (stepNumber === 5) {
    aktualizujPodgladPostaci();
  }
}

function updateBreadcrumbs(activeStep) {
  const crumbs = document.querySelectorAll('#breadcrumbs .breadcrumb-item');
  crumbs.forEach(c => {
    const step = parseInt(c.getAttribute('data-step'));
    if (step === activeStep) c.classList.add('active'); else c.classList.remove('active');
  });
}

/**
 * Aktualizuje podsumowanie wybranego pochodzenia
 */
function aktualizujPodsumowaniePochodzenia() {
  if (!wybranePochodzenie) return;
    
  const pochodzenie = dostepnePochodzenia.find(p => p.id === wybranePochodzenie);
  if (!pochodzenie) return;
    
  const container = document.getElementById('selected-origin-info');
  container.innerHTML = `
        <h4>${pochodzenie.nazwa}</h4>
        <p><strong>Opis:</strong> ${pochodzenie.opis}</p>
        <p><strong>Rozmiar:</strong> ${pochodzenie.rozmiar} | <strong>Prędkość:</strong> ${pochodzenie.predkosc}</p>
        <p><strong>Języki:</strong> ${pochodzenie.jezyki.join(', ')}</p>
        <p><strong>Modyfikatory atrybutów:</strong> 
            Siła ${pochodzenie.atrybuty_bazowe.sila - 10 >= 0 ? '+' : ''}${pochodzenie.atrybuty_bazowe.sila - 10}, 
            Zręczność ${pochodzenie.atrybuty_bazowe.zrecznosc - 10 >= 0 ? '+' : ''}${pochodzenie.atrybuty_bazowe.zrecznosc - 10}, 
            Intelekt ${pochodzenie.atrybuty_bazowe.intelekt - 10 >= 0 ? '+' : ''}${pochodzenie.atrybuty_bazowe.intelekt - 10}, 
            Wola ${pochodzenie.atrybuty_bazowe.wola - 10 >= 0 ? '+' : ''}${pochodzenie.atrybuty_bazowe.wola - 10}
        </p>
    `;
}

/**
 * Aktualizuje domyślne atrybuty bazujące na pochodzeniu
 */
function aktualizujDomyślneAtrybuty() {
  if (!wybranePochodzenie) return;
    
  const pochodzenie = dostepnePochodzenia.find(p => p.id === wybranePochodzenie);
  if (!pochodzenie) return;
    
  // Domyślne wartości atrybutów bazujące na pochodzeniu
  // Używamy wartości 10 jako bazę, a następnie stosujemy modyfikatory pochodzenia
  const atrybutyBazowe = {
    sila: 10,
    zrecznosc: 10,
    intelekt: 10,
    wola: 10
  };
    
  // Oblicz atrybuty z modyfikatorami pochodzenia
  const atrybutyFinalne = {
    sila: atrybutyBazowe.sila + (pochodzenie.atrybuty_bazowe.sila - 10),
    zrecznosc: atrybutyBazowe.zrecznosc + (pochodzenie.atrybuty_bazowe.zrecznosc - 10),
    intelekt: atrybutyBazowe.intelekt + (pochodzenie.atrybuty_bazowe.intelekt - 10),
    wola: atrybutyBazowe.wola + (pochodzenie.atrybuty_bazowe.wola - 10)
  };
    
  // Aktualizuj wyświetlane wartości
  document.getElementById('sila-final').textContent = atrybutyFinalne.sila;
  document.getElementById('zrecznosc-final').textContent = atrybutyFinalne.zrecznosc;
  document.getElementById('intelekt-final').textContent = atrybutyFinalne.intelekt;
  document.getElementById('wola-final').textContent = atrybutyFinalne.wola;
    
  // Aktualizuj modyfikatory
  document.getElementById('sila-mod').textContent = formatModifier(pochodzenie.atrybuty_bazowe.sila - 10);
  document.getElementById('zrecznosc-mod').textContent = formatModifier(pochodzenie.atrybuty_bazowe.zrecznosc - 10);
  document.getElementById('intelekt-mod').textContent = formatModifier(pochodzenie.atrybuty_bazowe.intelekt - 10);
  document.getElementById('wola-mod').textContent = formatModifier(pochodzenie.atrybuty_bazowe.wola - 10);
    
  // Oblicz i wyświetl atrybuty drugorzędne
  aktualizujAtrybutyDrugorzedne(atrybutyFinalne, pochodzenie);
  
  // Aktywuj przycisk "Dalej" w kroku 2
  document.getElementById('btn-next-2').disabled = false;
}

/**
 * Aktualizuje obliczone atrybuty na podstawie pochodzenia
 */
function aktualizujObliczoneAtrybuty() {
  if (!wybranePochodzenie) return;
    
  const pochodzenie = dostepnePochodzenia.find(p => p.id === wybranePochodzenie);
  if (!pochodzenie) return;
    
  let atrybutyBazowe;
    
  if (document.getElementById('domyslne-atrybuty').checked) {
    // Użyj domyślnych wartości (bazujących na pochodzeniu)
    atrybutyBazowe = {
      sila: 10,
      zrecznosc: 10,
      intelekt: 10,
      wola: 10
    };
  } else {
    // Użyj wartości z formularza
    atrybutyBazowe = {
      sila: parseInt(document.getElementById('sila-base').value) || 10,
      zrecznosc: parseInt(document.getElementById('zrecznosc-base').value) || 10,
      intelekt: parseInt(document.getElementById('intelekt-base').value) || 10,
      wola: parseInt(document.getElementById('wola-base').value) || 10
    };
  }
    
  // Oblicz atrybuty z modyfikatorami pochodzenia
  const atrybutyFinalne = {
    sila: atrybutyBazowe.sila + (pochodzenie.atrybuty_bazowe.sila - 10),
    zrecznosc: atrybutyBazowe.zrecznosc + (pochodzenie.atrybuty_bazowe.zrecznosc - 10),
    intelekt: atrybutyBazowe.intelekt + (pochodzenie.atrybuty_bazowe.intelekt - 10),
    wola: atrybutyBazowe.wola + (pochodzenie.atrybuty_bazowe.wola - 10)
  };
    
  // Aktualizuj wyświetlane wartości
  document.getElementById('sila-final').textContent = atrybutyFinalne.sila;
  document.getElementById('zrecznosc-final').textContent = atrybutyFinalne.zrecznosc;
  document.getElementById('intelekt-final').textContent = atrybutyFinalne.intelekt;
  document.getElementById('wola-final').textContent = atrybutyFinalne.wola;
    
  // Aktualizuj modyfikatory
  document.getElementById('sila-mod').textContent = formatModifier(pochodzenie.atrybuty_bazowe.sila - 10);
  document.getElementById('zrecznosc-mod').textContent = formatModifier(pochodzenie.atrybuty_bazowe.zrecznosc - 10);
  document.getElementById('intelekt-mod').textContent = formatModifier(pochodzenie.atrybuty_bazowe.intelekt - 10);
  document.getElementById('wola-mod').textContent = formatModifier(pochodzenie.atrybuty_bazowe.wola - 10);
    
  // Oblicz i wyświetl atrybuty drugorzędne
  aktualizujAtrybutyDrugorzedne(atrybutyFinalne, pochodzenie);
  
  // Aktywuj przycisk "Dalej" w kroku 2
  document.getElementById('btn-next-2').disabled = false;
}

/**
 * Aktualizuje atrybuty drugorzędne na podstawie atrybutów głównych i pochodzenia
 */
function aktualizujAtrybutyDrugorzedne(atrybuty, pochodzenie) {
  // Oblicz atrybuty drugorzędne zgodnie z Podręcznikiem Głównym
  let zdrowie = atrybuty.sila;
  
  // Dodaj bonus do zdrowia z poziomu 4 jeśli jest dostępny
  if (wybranyPoziom >= 4 && pochodzenie.poziom_4 && pochodzenie.poziom_4.zdrowie) {
    const healthBonus = parseInt(pochodzenie.poziom_4.zdrowie.replace('+', ''));
    zdrowie += healthBonus;
  }
  
  const atrybutyDrugorzedne = {
    percepcja: atrybuty.intelekt,
    obrona: atrybuty.zrecznosc,
    zdrowie,
    szybkosc_zdrowienia: Math.floor(atrybuty.sila / 4) || 1
  };
  
  // Modyfikatory obrony na podstawie rozmiaru pochodzenia
  if (pochodzenie.rozmiar === '1/4') {
    atrybutyDrugorzedne.obrona += 4;
  } else if (pochodzenie.rozmiar === '1/2') {
    atrybutyDrugorzedne.obrona += 2;
  } else if (pochodzenie.rozmiar === '2') {
    atrybutyDrugorzedne.obrona -= 2;
  }
  
  // Wyświetl atrybuty drugorzędne w sekcji obliczonych atrybutów
  const container = document.getElementById('calculated-attributes');
  if (container) {
    const secondaryAttrsDiv = document.getElementById('secondary-attributes-display');
    if (!secondaryAttrsDiv) {
      const secondaryDiv = document.createElement('div');
      secondaryDiv.id = 'secondary-attributes-display';
      secondaryDiv.className = 'secondary-attributes';
      secondaryDiv.innerHTML = `
        <h4>Atrybuty drugorzędne:</h4>
        <div class="attributes-grid">
          <div class="attribute-display">
            <label>Percepcja:</label>
            <span id="percepcja-final">${atrybutyDrugorzedne.percepcja}</span>
          </div>
          <div class="attribute-display">
            <label>Obrona:</label>
            <span id="obrona-final">${atrybutyDrugorzedne.obrona}</span>
          </div>
          <div class="attribute-display">
            <label>Zdrowie:</label>
            <span id="zdrowie-final">${atrybutyDrugorzedne.zdrowie}</span>
          </div>
          <div class="attribute-display">
            <label>Szybkość Zdrowienia:</label>
            <span id="szybkosc-zdrowienia-final">${atrybutyDrugorzedne.szybkosc_zdrowienia}</span>
          </div>
        </div>
      `;
      container.appendChild(secondaryDiv);
    } else {
      // Aktualizuj istniejące wartości
      document.getElementById('percepcja-final').textContent = atrybutyDrugorzedne.percepcja;
      document.getElementById('obrona-final').textContent = atrybutyDrugorzedne.obrona;
      document.getElementById('zdrowie-final').textContent = atrybutyDrugorzedne.zdrowie;
      document.getElementById('szybkosc-zdrowienia-final').textContent = atrybutyDrugorzedne.szybkosc_zdrowienia;
    }
  }
}

/**
 * Formatuje modyfikator atrybutu
 * @param {number} modifier - Wartość modyfikatora
 * @returns {string} Sformatowany modyfikator z + lub -
 */
function formatModifier(modifier) {
  if (modifier >= 0) {
    return `+${modifier}`;
  } else {
    return `${modifier}`;
  }
}


/**
 * Pobiera wszystkie cechy specjalne dla stanu rozwiniętego
 * @param {Object} cechySpecjalne - Obiekt z cechami specjalnymi
 * @returns {Array|null} Tablica ze wszystkimi cechami
 */
function pobierzWszystkieCechy(cechySpecjalne) {
  if (!cechySpecjalne || Object.keys(cechySpecjalne).length === 0) {
    return null;
  }
    
  const cechy = Object.entries(cechySpecjalne);
  return cechy.map(([nazwa, opis]) => ({
    nazwa: formatujNazweCechy(nazwa),
    opis
  }));
}

/**
 * Pobiera kluczowe cechy specjalne (maksymalnie 2)
 * @param {Object} cechySpecjalne - Obiekt z cechami specjalnymi
 * @returns {Array|null} Tablica z maksymalnie 2 kluczowymi cechami
 */
// eslint-disable-next-line no-unused-vars
function pobierzKluczoweCechy(cechySpecjalne) {
  if (!cechySpecjalne || Object.keys(cechySpecjalne).length === 0) {
    return null;
  }
    
  const cechy = Object.entries(cechySpecjalne);
  const kluczoweCechy = cechy.slice(0, 2).map(([nazwa, opis]) => ({
    nazwa: formatujNazweCechy(nazwa),
    opis: opis.length > 60 ? `${opis.substring(0, 60)  }...` : opis
  }));
    
  return kluczoweCechy.length > 0 ? kluczoweCechy : null;
}

/**
 * Formatuje nazwę cechy specjalnej
 * @param {string} nazwa - Nazwa cechy w formacie snake_case
 * @returns {string} Sformatowana nazwa cechy
 */
function formatujNazweCechy(nazwa) {
  return nazwa
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Przełącza stan rozwijania kafelka pochodzenia
 * @param {string} originId - ID pochodzenia
 */
function toggleTileExpansion(originId) {
  const tile = document.querySelector(`[data-origin-id="${originId}"]`);
  if (!tile) {
    return;
  }
    
  const isExpanded = tile.classList.contains('expanded');
    
  if (isExpanded) {
    // Zwiń kafelek
    collapseTile(tile);
  } else {
    // Rozwiń kafelek (najpierw zwiń wszystkie inne)
    collapseAllTiles();
    expandTile(tile);
  }
}

/**
 * Rozwija kafelek pochodzenia
 * @param {HTMLElement} tile - Element kafelka
 */
function expandTile(tile) {
  tile.classList.remove('compact');
  tile.classList.add('expanded');
    
  // Zmień ikonę na strzałkę w górę
  const expandIcon = tile.querySelector('.tile-expand-icon');
  if (expandIcon) {
    expandIcon.textContent = '↑';
  }
    
  // Pokaż rozwinięty kontent, ukryj zwinięty
  const collapsedContent = tile.querySelector('.tile-content-collapsed');
  const expandedContent = tile.querySelector('.tile-content-expanded');
    
  if (collapsedContent) {
    collapsedContent.style.display = 'none';
  }
  if (expandedContent) {
    expandedContent.style.display = 'block';
  }
}

/**
 * Zwijanie kafelka pochodzenia
 * @param {HTMLElement} tile - Element kafelka
 */
function collapseTile(tile) {
  tile.classList.remove('expanded');
  tile.classList.add('compact');
    
  // Zmień ikonę na strzałkę w dół
  const expandIcon = tile.querySelector('.tile-expand-icon');
  if (expandIcon) {
    expandIcon.textContent = '↓';
  }
    
  // Pokaż zwinięty kontent, ukryj rozwinięty
  const collapsedContent = tile.querySelector('.tile-content-collapsed');
  const expandedContent = tile.querySelector('.tile-content-expanded');
    
  if (collapsedContent) {
    collapsedContent.style.display = 'block';
  }
  if (expandedContent) {
    expandedContent.style.display = 'none';
  }
}

/**
 * Zwijanie wszystkich kafelków pochodzenia
 */
function collapseAllTiles() {
  const allTiles = document.querySelectorAll('.origin-tile');
  allTiles.forEach(tile => {
    if (tile.classList.contains('expanded')) {
      collapseTile(tile);
    }
  });
}

/**
 * Pokazuje komunikat o wyborze pochodzenia
 * @param {string} originId - ID wybranego pochodzenia
 */
function pokazKomunikatWyboru(originId) {
  const pochodzenie = dostepnePochodzenia.find(p => p.id === originId);
  if (!pochodzenie) {
    return;
  }
    
  // Utwórz komunikat
  const komunikat = document.createElement('div');
  komunikat.className = 'selection-message';
  komunikat.innerHTML = `
        <div class="message-content">
            <span class="message-icon">✓</span>
            <span class="message-text">Wybrano pochodzenie: <strong>${pochodzenie.nazwa}</strong></span>
        </div>
    `;
    
  // Dodaj komunikat do kroku 1
  const step1 = document.getElementById('step-1');
  if (step1) {
    // Usuń poprzedni komunikat jeśli istnieje
    const existingMessage = step1.querySelector('.selection-message');
    if (existingMessage) {
      existingMessage.remove();
    }
        
    // Dodaj nowy komunikat
    step1.appendChild(komunikat);
        
    // Automatycznie usuń komunikat po 3 sekundach
    setTimeout(() => {
      if (komunikat.parentNode) {
        komunikat.remove();
      }
    }, 3000);
  }
}

/**
 * Generuje sekcję z wynikami tabel losowych
 * @param {string} originId - ID pochodzenia
 * @returns {string} HTML sekcji z wynikami tabel
 */
function generujSekcjeWynikowTabel(originId) {
  if (!wynikiTabel[originId] || Object.keys(wynikiTabel[originId]).length === 0) {
    return '';
  }
  
  const pochodzenie = dostepnePochodzenia.find(p => p.id === originId);
  if (!pochodzenie || !pochodzenie.tabele) {
    return '';
  }
  
  // Mapowanie nazw tabel na polskie nazwy
  const nazwyTabel = {
    przeszlosc: 'Przeszłość',
    osobowosc: 'Osobowość', 
    religia: 'Religia',
    wiek: 'Wiek',
    budowa_ciala: 'Budowa Ciała',
    wyglad: 'Wygląd',
    funkcja: 'Funkcja',
    forma: 'Forma'
  };
  
  let html = '<div class="preview-section">';
  html += '<h5>🎲 Wyniki Tabel Losowych</h5>';
  
  Object.entries(wynikiTabel[originId]).forEach(([tableName, result]) => {
    const nazwaTabeli = nazwyTabel[tableName] || tableName;
    const ikona = result.typ === 'wybór' ? '🎯' : '🎲';
    const typTekst = result.typ === 'wybór' ? 'Wybór' : 'Losowanie';
    
    html += '<div class="table-result-item">';
    html += '<div class="table-result-header">';
    html += `<span class="table-result-name">${nazwaTabeli}</span>`;
    html += `<span class="table-result-type">${ikona} ${typTekst}</span>`;
    html += '</div>';
    html += '<div class="table-result-content">';
    html += `<div class="table-result-roll">Rzut: ${result.rzut}</div>`;
    html += `<div class="table-result-outcome">${result.wynik}</div>`;
    if (result.efekt) {
      html += `<div class="table-result-effect"><strong>Efekt mechaniczny:</strong> ${result.efekt}</div>`;
    }
    html += '</div>';
    html += '</div>';
  });
  
  html += '</div>';
  return html;
}

/**
 * Aktualizuje podgląd postaci w kroku 3
 */
function aktualizujPodgladPostaci() {
  if (!wybranePochodzenie) return;
    
  const pochodzenie = dostepnePochodzenia.find(p => p.id === wybranePochodzenie);
  if (!pochodzenie) return;
    
  const container = document.getElementById('character-preview');
    
  // Pobierz obliczone atrybuty
  const atrybuty = {
    sila: parseInt(document.getElementById('sila-final').textContent),
    zrecznosc: parseInt(document.getElementById('zrecznosc-final').textContent),
    intelekt: parseInt(document.getElementById('intelekt-final').textContent),
    wola: parseInt(document.getElementById('wola-final').textContent)
  };
    
  // Oblicz atrybuty drugorzędne
  let zdrowie = atrybuty.sila;
  
  // Dodaj bonus do zdrowia z poziomu 4 jeśli jest dostępny
  if (wybranyPoziom >= 4 && pochodzenie.poziom_4 && pochodzenie.poziom_4.zdrowie) {
    const healthBonus = parseInt(pochodzenie.poziom_4.zdrowie.replace('+', ''));
    zdrowie += healthBonus;
  }
  
  const atrybutyDrugorzedne = {
    percepcja: atrybuty.intelekt,
    obrona: atrybuty.zrecznosc,
    zdrowie,
    szybkosc_zdrowienia: Math.floor(atrybuty.sila / 4) || 1
  };
    
  // Modyfikatory obrony na podstawie rozmiaru
  if (pochodzenie.rozmiar === '1/4') {
    atrybutyDrugorzedne.obrona += 4;
  } else if (pochodzenie.rozmiar === '1/2') {
    atrybutyDrugorzedne.obrona += 2;
  } else if (pochodzenie.rozmiar === '2') {
    atrybutyDrugorzedne.obrona -= 2;
  }
    
  container.innerHTML = `
        <h4>📜 Podgląd Postaci</h4>
        
        <div class="preview-section">
            <h5>${pochodzenie.nazwa}</h5>
            <p>${pochodzenie.opis}</p>
        </div>
        
        <div class="preview-section">
            <h5>Atrybuty Podstawowe</h5>
            <div class="preview-stats">
                <div class="preview-stat">
                    <div class="preview-stat-label">Siła</div>
                    <div class="preview-stat-value">${atrybuty.sila}</div>
                </div>
                <div class="preview-stat">
                    <div class="preview-stat-label">Zręczność</div>
                    <div class="preview-stat-value">${atrybuty.zrecznosc}</div>
                </div>
                <div class="preview-stat">
                    <div class="preview-stat-label">Intelekt</div>
                    <div class="preview-stat-value">${atrybuty.intelekt}</div>
                </div>
                <div class="preview-stat">
                    <div class="preview-stat-label">Wola</div>
                    <div class="preview-stat-value">${atrybuty.wola}</div>
                </div>
            </div>
        </div>
        
        <div class="preview-section">
            <h5>Atrybuty Drugorzędne</h5>
            <div class="preview-stats">
                <div class="preview-stat">
                    <div class="preview-stat-label">Percepcja</div>
                    <div class="preview-stat-value">${atrybutyDrugorzedne.percepcja}</div>
                </div>
                <div class="preview-stat">
                    <div class="preview-stat-label">Obrona</div>
                    <div class="preview-stat-value">${atrybutyDrugorzedne.obrona}</div>
                </div>
                <div class="preview-stat">
                    <div class="preview-stat-label">Zdrowie</div>
                    <div class="preview-stat-value">${atrybutyDrugorzedne.zdrowie}</div>
                </div>
                <div class="preview-stat">
                    <div class="preview-stat-label">Szybkość Zdrowienia</div>
                    <div class="preview-stat-value">${atrybutyDrugorzedne.szybkosc_zdrowienia}</div>
                </div>
            </div>
        </div>
        
        <div class="preview-section">
            <h5>Szczegóły</h5>
            <p><strong>Rozmiar:</strong> ${pochodzenie.rozmiar} | <strong>Prędkość:</strong> ${pochodzenie.predkosc}</p>
            <p><strong>Języki:</strong> ${pochodzenie.jezyki.join(', ')}</p>
            <p><strong>Profesje:</strong> ${pochodzenie.profesje.join(', ')}</p>
        </div>
        
        ${renderPathBenefitsSummary()}
        
        ${renderProfessionsAndCuriosSummary()}
        
        ${generujSekcjeWynikowTabel(pochodzenie.id)}

        ${generujSekcjeSciezekIZasobow()}
    `;
}

/**
 * Generuje sekcję wybranych ścieżek i zasobów w podglądzie
 */
function generujSekcjeSciezekIZasobow() {
  const parts = [];
  const sc = [];
  if (wybraneSciezki.nowicjusz) sc.push(`<li>Nowicjusz: ${formatSciezkaName(wybraneSciezki.nowicjusz)}</li>`);
  if (wybraneSciezki.ekspert) sc.push(`<li>Ekspert: ${formatSciezkaName(wybraneSciezki.ekspert)}</li>`);
  if (wybraneSciezki.mistrz) sc.push(`<li>Mistrz: ${formatSciezkaName(wybraneSciezki.mistrz)}</li>`);
  if (sc.length > 0) {
    parts.push('<div class="preview-section">');
    parts.push('<h5>Ścieżki</h5>');
    parts.push(`<ul>${sc.join('')}</ul>`);
    parts.push('</div>');
  }
  if (wybranyPoziom > 1) {
    const srebro = wylosowaneSrebrniki != null ? wylosowaneSrebrniki : 'nie wylosowano';
    parts.push('<div class="preview-section">');
    parts.push('<h5>Zasoby</h5>');
    parts.push(`<p><strong>Srebrniki:</strong> ${srebro} | <strong>Kurioza:</strong> ${liczbaKuriozow}</p>`);
    parts.push('</div>');
  }
  return parts.join('');
}

function formatSciezkaName(id) {
  return id
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .replace('Ł', 'Ł');
}

/**
 * Tworzy nową postać
 */
// eslint-disable-next-line no-unused-vars
async function utworzPostac() {
  if (!wybranePochodzenie) {
    pokazBlad('Wybierz pochodzenie postaci!');
    return;
  }

  // Przygotowanie specyfikacji
  const sciezkaSelect = document.getElementById('sciezka');
  const spec = {
    pochodzenie: wybranePochodzenie,
    sciezka: (sciezkaSelect && sciezkaSelect.value) || undefined
  };

  // Własne atrybuty jeśli nie domyślne
  if (!document.getElementById('domyslne-atrybuty').checked) {
    spec.atrybuty = {
      sila: parseInt(document.getElementById('sila-base').value),
      zrecznosc: parseInt(document.getElementById('zrecznosc-base').value),
      intelekt: parseInt(document.getElementById('intelekt-base').value),
      wola: parseInt(document.getElementById('wola-base').value)
    };
  }

  // Pokazanie loadingu
  document.getElementById('loading').style.display = 'block';
  document.getElementById('error').style.display = 'none';
  document.getElementById('btn-create').disabled = true;

  try {
    const postac = budujPostac(spec);
    biezacaPostac = postac;

    wyswietlPostac(postac);

  } catch (error) {
    pokazBlad(`Błąd tworzenia postaci: ${  error.message}`);
  } finally {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('btn-create').disabled = false;
  }
}

/**
 * Wyświetla kartę postaci
 */
function wyswietlPostac(postac) {
  const content = document.getElementById('character-content');

  content.innerHTML = `
        <div class="section">
            <h4>🎭 ${postac.pochodzenie.nazwa}</h4>
            <p><em>${postac.pochodzenie.opis}</em></p>

            <div class="attributes-grid">
                <div class="attribute-box">
                    <strong>Siła</strong><br>
                    ${postac.atrybuty.sila}
                </div>
                <div class="attribute-box">
                    <strong>Zręczność</strong><br>
                    ${postac.atrybuty.zrecznosc}
                </div>
                <div class="attribute-box">
                    <strong>Intelekt</strong><br>
                    ${postac.atrybuty.intelekt}
                </div>
                <div class="attribute-box">
                    <strong>Wola</strong><br>
                    ${postac.atrybuty.wola}
                </div>
            </div>
        </div>

        <div class="section">
            <h4>📊 Atrybuty Drugorzędne</h4>
            <div class="attributes-grid">
                <div class="attribute-box">
                    <strong>Percepcja</strong><br>
                    ${postac.atrybuty_drugorzedne.percepcja}
                </div>
                <div class="attribute-box">
                    <strong>Obrona</strong><br>
                    ${postac.atrybuty_drugorzedne.obrona}
                </div>
                <div class="attribute-box">
                    <strong>Zdrowie</strong><br>
                    ${postac.atrybuty_drugorzedne.zdrowie}
                </div>
                <div class="attribute-box">
                    <strong>Szybkość Zdrowienia</strong><br>
                    ${postac.atrybuty_drugorzedne.szybkosc_zdrowienia}
                </div>
            </div>
        </div>

        <div class="section">
            <h4>🎯 Szczegóły</h4>
            <p><strong>Rozmiar:</strong> ${postac.atrybuty_drugorzedne.rozmiar}</p>
            <p><strong>Prędkość:</strong> ${postac.atrybuty_drugorzedne.predkosc}</p>
            <p><strong>Moc:</strong> ${postac.atrybuty_drugorzedne.moc}</p>
            <p><strong>Języki:</strong> ${postac.jezyki.join(', ')}</p>
            <p><strong>Profesje:</strong> ${postac.profesje.join(', ')}</p>
        </div>

        ${postac.cechy_specjalne ? renderujCechySpecjalne(postac.cechy_specjalne) : ''}
        ${postac.sciezka ? renderujSciezke(postac.sciezka) : ''}
    `;

  document.getElementById('character-sheet').style.display = 'block';
  document.getElementById('character-sheet').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Renderuje cechy specjalne pochodzenia
 */
function renderujCechySpecjalne(cechy) {
  let html = '<div class="section"><h4>✨ Cechy Specjalne</h4>';

  Object.entries(cechy).forEach(([nazwa, opis]) => {
    html += `<p><strong>${nazwa}:</strong> ${opis}</p>`;
  });

  html += '</div>';
  return html;
}

/**
 * Renderuje informacje o ścieżce
 */
function renderujSciezke(sciezka) {
  return `
        <div class="section">
            <h4>🛤️ Ścieżka: ${sciezka.nazwa}</h4>
            <p><em>${sciezka.opis}</em></p>
            <!-- Szczegóły ścieżki będą dodane w przyszłych wersjach -->
        </div>
    `;
}

// ========== AC-016: Obsługa Korzyści Poziomu ==========

/**
 * Załaduj korzyści dla wybranego poziomu
 */
async function zaladujKorzysciPoziomu(poziom) {
  if (!wybranePochodzenie) {
    const section = document.getElementById('level-benefits-section');
    if (section) {
      section.style.display = 'none';
    }
    return;
  }

  try {
    const benefits = obliczKorzysciPoziomu(poziom, {
      pochodzenie: wybranePochodzenie,
      sciezka_nowicjusza: wybraneSciezki.nowicjusz || null,
      sciezka_ekspercka: wybraneSciezki.ekspert || null,
      sciezka_mistrzowska: wybraneSciezki.mistrz || null
    });
    wyswietlKorzysciPoziomu(benefits);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Błąd ładowania korzyści:', error);
    // Fallback - wyświetl podstawowe informacje
    wyswietlKorzysciPoziomuFallback(poziom);
  }
}

/**
 * Fallback dla wyświetlania korzyści poziomu
 */
function wyswietlKorzysciPoziomuFallback(poziom) {
  const section = document.getElementById('level-benefits-section');
  const levelName = document.getElementById('selected-level-name');
  
  section.style.display = 'block';
  
  // Podstawowe nazwy poziomów
  const nazwyPoziomow = {
    1: 'Nowicjusz',
    2: 'Nowicjusz', 
    3: 'Ekspert',
    4: 'Ekspert',
    5: 'Ekspert',
    6: 'Ekspert',
    7: 'Mistrz',
    8: 'Mistrz',
    9: 'Mistrz',
    10: 'Mistrz'
  };
  
  const nazwaPoziomu = nazwyPoziomow[poziom] || 'Nieznany poziom';
  const nazwaSciezki = poziom === 4 ? 'Pochodzenie' : 'Brak ścieżki';
  levelName.textContent = `${nazwaPoziomu} (${nazwaSciezki})`;
  
  // Resetuj wszystkie sekcje
  // Sprawdź czy elementy istnieją przed ustawieniem display
  const elements = [
    'secondary-attributes-growth',
    'primary-attributes-choice', 
    'talents-section',
    'magic-section',
    'languages-professions-section'
  ];
  
  elements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = 'none';
    }
  });
  
  // Wyświetl podstawowe informacje
  const content = document.getElementById('level-benefits-content');
  if (content) {
    content.innerHTML = `
      <div class="benefit-category">
        <h5>Podstawowe informacje</h5>
        <p>Poziom ${poziom} - ${nazwaPoziomu}</p>
        <p><em>Szczegółowe korzyści będą dostępne po wyborze pochodzenia i ścieżek.</em></p>
      </div>
    `;
  }
}

/**
 * Wyświetla korzyści poziomu
 */
function wyswietlKorzysciPoziomu(benefits) {
  const section = document.getElementById('level-benefits-section');
  const levelName = document.getElementById('selected-level-name');
  
  section.style.display = 'block';
  
  // Bezpieczne wyświetlanie nazwy poziomu
  const nazwaPoziomu = benefits.nazwa_poziomu || 'Nieznany poziom';
  const nazwaSciezki = benefits.nazwa_sciezki || (benefits.zrodlo_korzysci === 'pochodzenie' ? 'Pochodzenie' : 'Brak ścieżki');
  levelName.textContent = `${nazwaPoziomu} (${nazwaSciezki})`;

  // Resetuj wszystkie sekcje
  // Sprawdź czy elementy istnieją przed ustawieniem display
  const elements = [
    'secondary-attributes-growth',
    'primary-attributes-choice', 
    'talents-section',
    'magic-section',
    'languages-professions-section'
  ];
  
  elements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = 'none';
    }
  });
  
  // Sprawdź czy options-section istnieje
  const optionsSection = document.getElementById('options-section');
  if (optionsSection) {
    optionsSection.style.display = 'none';
  }

  // Wyświetl atrybuty drugorzędne
  if (benefits.korzyści.zdrowie || benefits.korzyści.moc || benefits.korzyści.obrona) {
    const content = [];
    if (benefits.korzyści.zdrowie) content.push(`Zdrowie: ${benefits.korzyści.zdrowie}`);
    if (benefits.korzyści.moc) content.push(`Moc: ${benefits.korzyści.moc}`);
    if (benefits.korzyści.obrona) content.push(`Obrona: ${benefits.korzyści.obrona}`);
    
    const secondaryAttrsContent = document.getElementById('secondary-attrs-content');
    const secondaryAttributesGrowth = document.getElementById('secondary-attributes-growth');
    
    if (secondaryAttrsContent) {
      secondaryAttrsContent.innerHTML = content.join(', ');
    }
    if (secondaryAttributesGrowth) {
      secondaryAttributesGrowth.style.display = 'block';
    }
  }

  // Wyświetl interaktywny wybór atrybutów głównych
  if (benefits.korzyści.atrybuty_glowne && benefits.korzyści.atrybuty_glowne.typ === 'wybor') {
    pokazWyborAtrybutow(benefits.korzyści.atrybuty_glowne);
  }

  // Wyświetl talenty
  if (benefits.korzyści.talenty && benefits.korzyści.talenty.length > 0) {
    const talentsContent = document.getElementById('talents-content');
    const talentsSection = document.getElementById('talents-section');
    if (talentsContent) {
      talentsContent.innerHTML = `<ul>${benefits.korzyści.talenty.map(t => `<li>${t}</li>`).join('')}</ul>`;
    }
    if (talentsSection) {
      talentsSection.style.display = 'block';
    }
  }

  // Wyświetl magię
  if (benefits.korzyści.magia) {
    const magicContent = document.getElementById('magic-content');
    const magicSection = document.getElementById('magic-section');
    if (magicContent) {
      magicContent.textContent = benefits.korzyści.magia;
    }
    if (magicSection) {
      magicSection.style.display = 'block';
    }
  }

  // Wyświetl języki i profesje
  if (benefits.korzyści.jezyki_profesje) {
    const languagesContent = document.getElementById('languages-professions-content');
    const languagesSection = document.getElementById('languages-professions-section');
    if (languagesContent) {
      languagesContent.textContent = benefits.korzyści.jezyki_profesje;
    }
    if (languagesSection) {
      languagesSection.style.display = 'block';
    }
  }

  // Wyświetl opcje (dla poziomu 4 - pochodzenie)
  if (benefits.korzyści.opcje && benefits.korzyści.opcje.length > 0) {
    const optionsContent = document.getElementById('options-content');
    const optionsSection = document.getElementById('options-section');
    if (optionsContent) {
      const optionsList = benefits.korzyści.opcje.map(opcja => `<li>${opcja}</li>`).join('');
      optionsContent.innerHTML = `<ul>${optionsList}</ul>`;
    }
    if (optionsSection) {
      optionsSection.style.display = 'block';
    }
  }
}

// State zarządzania wyborem atrybutów
let attributeChoiceState = {
  maxPoints: 0,
  remainingPoints: 0,
  maxPerAttribute: 1,
  choices: { sila: 0, zrecznosc: 0, intelekt: 0, wola: 0 }
};

/**
 * Pokazuje interaktywny wybór atrybutów
 */
function pokazWyborAtrybutow(config) {
  const section = document.getElementById('primary-attributes-choice');
  section.style.display = 'block';

  // Inicjalizuj state
  attributeChoiceState = {
    maxPoints: config.ilosc,
    remainingPoints: config.ilosc,
    maxPerAttribute: config.wartosc,
    choices: { sila: 0, zrecznosc: 0, intelekt: 0, wola: 0 }
  };

  // Aktualizuj wyświetlanie
  document.getElementById('total-points').textContent = config.ilosc;
  document.getElementById('remaining-points').textContent = config.ilosc;
  
  // Resetuj wartości
  ['sila', 'zrecznosc', 'intelekt', 'wola'].forEach(attr => {
    document.getElementById(`bonus-${attr}`).textContent = '0';
  });

  aktualizujPrzyciskiAtrybutow();
}

/**
 * Zwiększa wybrany atrybut
 */
// eslint-disable-next-line no-unused-vars
function incrementAttribute(attr) {
  if (attributeChoiceState.remainingPoints > 0 && 
      attributeChoiceState.choices[attr] < attributeChoiceState.maxPerAttribute) {
    attributeChoiceState.choices[attr]++;
    attributeChoiceState.remainingPoints--;
    aktualizujWyswietlanieAtrybutow();
  }
}

/**
 * Zmniejsza wybrany atrybut
 */
// eslint-disable-next-line no-unused-vars
function decrementAttribute(attr) {
  if (attributeChoiceState.choices[attr] > 0) {
    attributeChoiceState.choices[attr]--;
    attributeChoiceState.remainingPoints++;
    aktualizujWyswietlanieAtrybutow();
  }
}

/**
 * Aktualizuje wyświetlanie wyborów atrybutów
 */
function aktualizujWyswietlanieAtrybutow() {
  // Aktualizuj wartości
  Object.entries(attributeChoiceState.choices).forEach(([attr, value]) => {
    document.getElementById(`bonus-${attr}`).textContent = value;
  });

  // Aktualizuj licznik
  document.getElementById('remaining-points').textContent = attributeChoiceState.remainingPoints;

  // Aktualizuj przyciski
  aktualizujPrzyciskiAtrybutow();

  // Walidacja przycisku "Dalej"
  const btnNext = document.getElementById('btn-next-2');
  if (attributeChoiceState.remainingPoints === 0) {
    btnNext.disabled = false;
  } else {
    btnNext.disabled = true;
  }
}

/**
 * Aktualizuje stan przycisków +/-
 */
function aktualizujPrzyciskiAtrybutow() {
  ['sila', 'zrecznosc', 'intelekt', 'wola'].forEach(attr => {
    const row = document.querySelector(`[data-attribute="${attr}"]`);
    const btnPlus = row.querySelector('.btn-plus');
    const btnMinus = row.querySelector('.btn-minus');

    // Przycisk + wyłączony gdy:
    // - brak punktów LUB osiągnięto max dla tego atrybutu
    btnPlus.disabled = attributeChoiceState.remainingPoints === 0 || 
                       attributeChoiceState.choices[attr] >= attributeChoiceState.maxPerAttribute;

    // Przycisk - wyłączony gdy wartość = 0
    btnMinus.disabled = attributeChoiceState.choices[attr] === 0;
  });
}

/**
 * Eksportuje postać jako JSON
 */
// eslint-disable-next-line no-unused-vars
function exportJSON() {
  if (!biezacaPostac) return;

  const dataStr = JSON.stringify(biezacaPostac, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${ encodeURIComponent(dataStr)}`;

  const exportFileDefaultName = `postac-${biezacaPostac.pochodzenie.id}-${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

/**
 * Pokazuje komunikat błędu
 */
function pokazBlad(wiadomosc) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = wiadomosc;
  errorDiv.style.display = 'block';
}

// ========== SYSTEM POMOCY (LIGHTBOX) ==========

/**
 * Otwiera lightbox pomocy
 */
// eslint-disable-next-line no-unused-vars
function openHelp() {
  const lightbox = document.getElementById('help-lightbox');
  if (!lightbox) return;
  
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Zablokuj scroll tła
  
  // Załaduj domyślną treść (Szybki Start)
  loadHelpContent('start');
  
  // Focus na modal
  setTimeout(() => {
    const closeButton = lightbox.querySelector('.help-close');
    if (closeButton) closeButton.focus();
  }, 100);
}

/**
 * Zamyka lightbox pomocy
 */
// eslint-disable-next-line no-unused-vars
function closeHelp() {
  const lightbox = document.getElementById('help-lightbox');
  if (!lightbox) return;
  
  lightbox.style.display = 'none';
  document.body.style.overflow = 'auto'; // Odblokuj scroll
  
  // Zwróć focus na przycisk pomocy
  const helpButton = document.getElementById('btn-help');
  if (helpButton) helpButton.focus();
}

/**
 * Przełącza zakładki w pomocy
 * @param {string} tabId - ID zakładki ('start', 'glossary', 'faq', 'shortcuts')
 */
// eslint-disable-next-line no-unused-vars
function switchHelpTab(tabId) {
  // Usuń active ze wszystkich zakładek
  document.querySelectorAll('.help-tab').forEach(tab => {
    tab.classList.remove('active');
    tab.setAttribute('aria-selected', 'false');
  });
  
  // Dodaj active do klikniętej zakładki (znajdź po onclick)
  const tabs = document.querySelectorAll('.help-tab');
  tabs.forEach(tab => {
    const onclickAttr = tab.getAttribute('onclick');
    if (onclickAttr && onclickAttr.includes(`'${tabId}'`)) {
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
    }
  });
  
  // Załaduj treść zakładki
  loadHelpContent(tabId);
}

/**
 * Ładuje treść wybranej zakładki
 * @param {string} tabId - ID zakładki
 */
function loadHelpContent(tabId) {
  const contentArea = document.getElementById('help-content');
  if (!contentArea) return;
  
  // Sprawdź czy funkcje treści są dostępne
  // eslint-disable-next-line no-undef
  if (typeof getStartContent === 'undefined') {
    contentArea.innerHTML = '<p>Ładowanie pomocy...</p>';
    return;
  }
  
  const contents = {
    // eslint-disable-next-line no-undef
    start: getStartContent(),
    // eslint-disable-next-line no-undef
    glossary: getGlossaryContent(),
    // eslint-disable-next-line no-undef
    faq: getFAQContent(),
    // eslint-disable-next-line no-undef
    shortcuts: getShortcutsContent()
  };
  
  contentArea.innerHTML = contents[tabId] || contents.start;
  
  // Przewiń do góry
  contentArea.scrollTop = 0;
}

/**
 * Inicjalizuje event listenery dla systemu pomocy
 */
function initializeHelpSystem() {
  // Przycisk otwierania pomocy
  const helpButton = document.getElementById('btn-help');
  if (helpButton) {
    helpButton.addEventListener('click', openHelp);
  }
  
  // Klawisz ESC zamyka pomoc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const lightbox = document.getElementById('help-lightbox');
      if (lightbox && lightbox.style.display === 'flex') {
        closeHelp();
      }
    }
  });
  
  // F1 otwiera pomoc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F1') {
      e.preventDefault();
      openHelp();
    }
  });
  
  // Kliknięcie poza modalem zamyka pomoc
  const lightbox = document.getElementById('help-lightbox');
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeHelp();
      }
    });
  }
}

/**
 * Obsługuje zastosowanie wybranej opcji z dropdowna
 * @param {string} originId - ID pochodzenia
 * @param {string} tableName - Nazwa tabeli
 */
function zastosujWybranaOpcje(originId, tableName) {
  const dropdown = document.getElementById(`table-select-${originId}-${tableName}`);
  const resultDiv = document.getElementById(`roll-result-${originId}-${tableName}`);
  const applyBtn = document.querySelector(`.apply-selection-btn[data-origin-id="${originId}"][data-table-name="${tableName}"]`);
  
  if (!dropdown || !resultDiv) return;
  
  const selectedOption = dropdown.options[dropdown.selectedIndex];
  if (!selectedOption || !selectedOption.value) return;
  
  const rzut = selectedOption.value;
  const wynik = selectedOption.dataset.wynik;
  
  // Zapisz wynik w globalnej zmiennej
  if (!wynikiTabel[originId]) {
    wynikiTabel[originId] = {};
  }
  wynikiTabel[originId][tableName] = {
    rzut,
    wynik,
    typ: 'wybór'
  };
  
  // Wyświetl wynik
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `
    <div class="roll-result-content">
      <div class="roll-dice">🎯 Wybór: ${rzut}</div>
      <div class="roll-outcome">${wynik}</div>
    </div>
  `;
  
  // Ukryj przycisk "Zastosuj wybór"
  if (applyBtn) {
    applyBtn.style.display = 'none';
  }
  
  // Zresetuj dropdown
  dropdown.selectedIndex = 0;
}

/**
 * Obsługuje losowanie z tabeli w UI
 * @param {string} originId - ID pochodzenia
 * @param {string} tableName - Nazwa tabeli
 */
async function losujZTabeliUI(originId, tableName) {
  try {
    // Wyświetl loading
    const resultDiv = document.getElementById(`roll-result-${originId}-${tableName}`);
    if (resultDiv) {
      resultDiv.style.display = 'block';
      resultDiv.innerHTML = '<div class="loading">🎲 Losowanie...</div>';
    }
    
    // Wykonaj losowanie
    const wynik = rollTable(originId, tableName);

    // Zapisz wynik w globalnej zmiennej
    if (!wynikiTabel[originId]) {
      wynikiTabel[originId] = {};
    }
    wynikiTabel[originId][tableName] = {
      rzut: wynik.rzut,
      wynik: wynik.wynik,
      efekt: wynik.efekt,
      typ: 'losowanie'
    };

    // Wyświetl wynik
    if (resultDiv) {
      const efekt = wynik.efekt ? `<br><strong>Efekt mechaniczny:</strong> ${wynik.efekt}` : '';
      resultDiv.innerHTML = `
        <div class="roll-result-content">
          <div class="roll-dice">🎲 Rzut: ${wynik.rzut}</div>
          <div class="roll-outcome">${wynik.wynik}</div>
          ${efekt}
        </div>
      `;
    }
    
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Błąd losowania z tabeli:', error);
    const resultDiv = document.getElementById(`roll-result-${originId}-${tableName}`);
    if (resultDiv) {
      resultDiv.innerHTML = `<div class="error">❌ Błąd: ${error.message}</div>`;
    }
  }
}

/**
 * Renderuje podsumowanie korzyści ze ścieżek w podglądzie postaci
 * @returns {string} HTML z podsumowaniem ścieżek
 */
function renderPathBenefitsSummary() {
  const benefits = [];
  
  // Sprawdź wybrane ścieżki
  if (wybraneSciezki.nowicjusz) {
    const benefit = przyznaneKorzysciZeSciezek[1];
    if (benefit) {
      benefits.push(`<div class="path-benefit-item"><strong>Ścieżka Nowicjusza:</strong> ${benefit.sciezkaId} (poziom 1)</div>`);
    }
  }
  
  if (wybraneSciezki.ekspert && wybranyPoziom >= 3) {
    const benefit = przyznaneKorzysciZeSciezek[3];
    if (benefit) {
      benefits.push(`<div class="path-benefit-item"><strong>Ścieżka Ekspercka:</strong> ${benefit.sciezkaId} (poziom 3)</div>`);
    }
  }
  
  if (wybraneSciezki.mistrz && wybranyPoziom >= 7) {
    const benefit = przyznaneKorzysciZeSciezek[7];
    if (benefit) {
      benefits.push(`<div class="path-benefit-item"><strong>Ścieżka Mistrzowska:</strong> ${benefit.sciezkaId} (poziom 7)</div>`);
    }
  }
  
  if (benefits.length === 0) {
    return '';
  }
  
  return `
    <div class="preview-section">
      <h5>Wybrane Ścieżki</h5>
      ${benefits.join('')}
    </div>
  `;
}

/**
 * Renderuje podsumowanie wybranych profesji i kuriozów w podglądzie postaci
 * @returns {string} HTML z podsumowaniem profesji i kuriozów
 */
function renderProfessionsAndCuriosSummary() {
  const professions = wybraneProfesje.map(id => {
    const prof = dostepneProfesje.find(p => p.id === id);
    return prof ? prof.nazwa : id;
  });

  const curios = wybraneKurioza.map(id => {
    const curio = dostepneKurioza.find(c => c.id === id);
    return curio ? curio.nazwa : id;
  });

  const { autoPismoWszystkieZnane } = obliczSlotyPostaci();
  const pismo = new Set(pobierzJezykiZPismem(autoPismoWszystkieZnane));
  const jezyki = pobierzMowioneJezyki().map(k => {
    const nazwa = JEZYKI[k] || k;
    return pismo.has(k) ? `${nazwa} (czytanie/pisanie)` : nazwa;
  });

  if (professions.length === 0 && curios.length === 0 && jezyki.length === 0) {
    return '';
  }

  return `
    <div class="preview-section">
      <h5>Profesje, Języki i Kurioza</h5>
      ${professions.length > 0 ? `<p><strong>Profesje:</strong> ${professions.join(', ')}</p>` : ''}
      ${jezyki.length > 0 ? `<p><strong>Języki:</strong> ${jezyki.join(', ')}</p>` : ''}
      ${curios.length > 0 ? `<p><strong>Kurioza:</strong> ${curios.join(', ')}</p>` : ''}
    </div>
  `;
}

/**
 * Ładuje dane profesji i kuriozów
 */
async function zaladujProfesjeIKurioza() {
  try {
    const profData = getProfesjeUI();
    dostepneProfesje = profData.profesje;

    const curiosData = getKuriozaUI();
    dostepneKurioza = curiosData.kurioza;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Nie udało się załadować profesji i kuriozów:', e);
  }
}

/**
 * Oblicza ilość kuriozów do wyboru na podstawie poziomu (progi 1/3/7).
 * Profesje i języki liczone są przez system slotów - patrz obliczSlotyPostaci().
 */
function obliczIloscWyborow() {
  const poziom = wybranyPoziom;
  let kurioza = 0;

  if (wybranePochodzenie) kurioza += 1; // Każde pochodzenie daje 1 kurioza
  if (poziom >= 1) kurioza += 1;
  if (poziom >= 3) kurioza += 1;
  if (poziom >= 7) kurioza += 1;

  return { kurioza };
}

/**
 * Oblicza wszystkie sloty językowo-profesyjne przyznane postaci na podstawie
 * wybranego pochodzenia i ścieżek (patrz logic/jezyki-profesje.js).
 */
function obliczSlotyPostaci() {
  const pochodzenie = dostepnePochodzenia.find(p => p.id === wybranePochodzenie) || null;
  return obliczSlotyProfesjiIJezykow({
    pochodzenie,
    sciezkaNowicjuszaId: wybraneSciezki.nowicjusz || null,
    sciezkaEksperckaId: wybraneSciezki.ekspert || null,
    sciezkaMistrzowskaId: wybraneSciezki.mistrz || null
  });
}

/** Etykiety kategorii profesji używane w PROFESSIONS.tables/dostepneProfesje. */
const ETYKIETY_KATEGORII = {
  naukowe: 'Naukowe', pospolite: 'Pospolite', przestepcze: 'Przestępcze',
  wojenne: 'Wojenne', koczownicze: 'Koczownicze', religijne: 'Religijne'
};

/**
 * Zwraca profesje z dostepneProfesje dopuszczone przez kategorie slotu,
 * z wyłączeniem profesji już przypisanych do innych slotów.
 */
function profesjeDlaSlotu(slot) {
  const wszystkie = slot.kategorie.includes('dowolna');
  const zajete = new Set(
    Object.entries(odpowiedziSlotow)
      .filter(([id, odp]) => id !== slot.id && odp && odp.mode === 'profesja' && odp.profesjaId)
      .map(([, odp]) => odp.profesjaId)
  );
  return dostepneProfesje.filter(p => {
    if (zajete.has(p.id)) return false;
    if (wszystkie) return true;
    const kat = Object.keys(ETYKIETY_KATEGORII).find(k => ETYKIETY_KATEGORII[k] === p.kategoria);
    return slot.kategorie.includes(kat);
  });
}

/** Znane języki (mówione): bazowe z pochodzenia + wyuczone w slotach jezyk_nowy. */
function pobierzMowioneJezyki() {
  const pochodzenie = dostepnePochodzenia.find(p => p.id === wybranePochodzenie);
  const bazowe = pochodzenie ? [...pochodzenie.jezyki] : [];
  const nowe = Object.values(odpowiedziSlotow)
    .filter(odp => odp && odp.mode === 'jezyk_nowy' && odp.jezyk)
    .map(odp => odp.jezyk);
  return [...new Set([...bazowe, ...nowe])];
}

/** Języki, w których postać umie czytać/pisać (automatyczne u Magika lub wybrane wprost). */
function pobierzJezykiZPismem(autoPismoWszystkieZnane) {
  if (autoPismoWszystkieZnane) return pobierzMowioneJezyki();
  return Object.values(odpowiedziSlotow)
    .filter(odp => odp && odp.mode === 'jezyk_pismo' && odp.jezyk)
    .map(odp => odp.jezyk);
}

/**
 * Renderuje kartę jednego slotu profesyjno-językowego (wybór trybu + odpowiedni picker).
 */
function renderSlotCard(slot, autoPismoWszystkieZnane) {
  const odp = odpowiedziSlotow[slot.id] || {};
  const mode = odp.mode || (slot.opcje.length === 1 ? slot.opcje[0] : null);

  const etykietyTrybow = { profesja: 'Profesja', jezyk_nowy: 'Nowy język', jezyk_pismo: 'Pismo w znanym języku' };
  const trybyHtml = slot.opcje.length > 1 ? `
    <div class="slot-mode-toggle" role="radiogroup">
      ${slot.opcje.map(o => `
        <label class="slot-mode-option">
          <input type="radio" name="mode-${slot.id}" value="${o}" ${mode === o ? 'checked' : ''}>
          ${etykietyTrybow[o]}
        </label>
      `).join('')}
    </div>
  ` : '';

  let pickerHtml = '';
  if (mode === 'profesja') {
    const opcjeProf = profesjeDlaSlotu(slot);
    const grupy = {};
    opcjeProf.forEach(p => { (grupy[p.kategoria] = grupy[p.kategoria] || []).push(p); });
    pickerHtml = `
      <select class="slot-value-select" data-slot-id="${slot.id}" data-slot-field="profesjaId">
        <option value="">-- wybierz profesję --</option>
        ${Object.entries(grupy).map(([kat, profs]) => `
          <optgroup label="${kat}">
            ${profs.map(p => `<option value="${p.id}" ${odp.profesjaId === p.id ? 'selected' : ''}>${p.nazwa}</option>`).join('')}
          </optgroup>
        `).join('')}
      </select>
    `;
  } else if (mode === 'jezyk_nowy') {
    const znane = new Set(pobierzMowioneJezyki());
    const opcjeJ = Object.entries(JEZYKI).filter(([klucz]) => !znane.has(klucz) || klucz === odp.jezyk);
    pickerHtml = `
      <select class="slot-value-select" data-slot-id="${slot.id}" data-slot-field="jezyk">
        <option value="">-- wybierz język --</option>
        ${opcjeJ.map(([klucz, nazwa]) => `<option value="${klucz}" ${odp.jezyk === klucz ? 'selected' : ''}>${nazwa}</option>`).join('')}
      </select>
    `;
  } else if (mode === 'jezyk_pismo') {
    const mowione = pobierzMowioneJezyki();
    const juzPismo = new Set(pobierzJezykiZPismem(autoPismoWszystkieZnane));
    const opcjeJ = mowione.filter(k => !juzPismo.has(k) || k === odp.jezyk);
    pickerHtml = `
      <select class="slot-value-select" data-slot-id="${slot.id}" data-slot-field="jezyk">
        <option value="">-- wybierz język --</option>
        ${opcjeJ.map(klucz => `<option value="${klucz}" ${odp.jezyk === klucz ? 'selected' : ''}>${JEZYKI[klucz] || klucz}</option>`).join('')}
      </select>
    `;
  }

  return `
    <div class="slot-card" data-slot-id="${slot.id}">
      <div class="slot-source">${slot.source}</div>
      ${slot.opis ? `<div class="slot-opis">${slot.opis}</div>` : ''}
      ${trybyHtml}
      ${pickerHtml}
    </div>
  `;
}

/**
 * Renderuje sekcję profesji (sloty) i sekcję znanych języków w Kroku 4.
 */
function renderProfessionsSection() {
  const container = document.getElementById('professions-slots');
  if (!container) return;

  const { sloty, autoPismoWszystkieZnane } = obliczSlotyPostaci();

  container.innerHTML = sloty.map(slot => renderSlotCard(slot, autoPismoWszystkieZnane)).join('');

  container.querySelectorAll('input[type="radio"][name^="mode-"]').forEach(input => {
    input.addEventListener('change', (e) => {
      const slotId = e.target.closest('.slot-card').dataset.slotId;
      ustawSlotOdpowiedz(slotId, { mode: e.target.value, profesjaId: null, jezyk: null });
    });
  });
  container.querySelectorAll('.slot-value-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const { slotId, slotField } = e.target.dataset;
      ustawSlotOdpowiedz(slotId, { [slotField]: e.target.value || null });
    });
  });

  synchronizujWybraneProfesje();
  updateSelectedProfessions();
  renderLanguagesSummary(autoPismoWszystkieZnane);
  updateStep4NextButton();
}

/**
 * Scala częściową odpowiedź w slot i przerenderowuje sekcję.
 */
function ustawSlotOdpowiedz(slotId, patch) {
  odpowiedziSlotow[slotId] = { ...odpowiedziSlotow[slotId], ...patch };
  renderProfessionsSection();
}

/**
 * Odtwarza płaską listę wybranych profesji (do podglądu/eksportu postaci)
 * na podstawie aktualnych odpowiedzi slotów.
 */
function synchronizujWybraneProfesje() {
  wybraneProfesje = Object.values(odpowiedziSlotow)
    .filter(odp => odp && odp.mode === 'profesja' && odp.profesjaId)
    .map(odp => odp.profesjaId);
}

/**
 * Renderuje podsumowanie znanych języków (mówionych i z pismem) w Kroku 4.
 */
function renderLanguagesSummary(autoPismoWszystkieZnane) {
  const summary = document.getElementById('languages-known-summary');
  const list = document.getElementById('language-slots');
  if (!summary || !list) return;

  const mowione = pobierzMowioneJezyki();
  const pismo = new Set(pobierzJezykiZPismem(autoPismoWszystkieZnane));

  summary.innerHTML = mowione.length ? `Znane języki: <strong>${mowione.map(k => JEZYKI[k] || k).join(', ')}</strong>` : 'Brak wybranego pochodzenia.';

  list.innerHTML = mowione.map(k => `
    <div class="language-chip">
      <span class="language-name">${JEZYKI[k] || k}</span>
      <span class="language-flags">mówiony${pismo.has(k) ? ' • pismo' : ''}</span>
    </div>
  `).join('') + (autoPismoWszystkieZnane ? '<p class="hint">Magik automatycznie czyta i pisze we wszystkich znanych sobie językach.</p>' : '');
}

/**
 * Losuje odpowiedzi dla wszystkich nierozdanych jeszcze slotów.
 */
/* eslint-disable-next-line no-unused-vars */
function _randomizeProfession() {
  losujProfesjeCentralnie();
}

/**
 * Aktualizuje listę wybranych profesji (pigułki pod slotami)
 */
function updateSelectedProfessions() {
  const listDiv = document.getElementById('professions-list');
  if (!listDiv) return;

  listDiv.innerHTML = wybraneProfesje.map(id => {
    const prof = dostepneProfesje.find(p => p.id === id);
    return prof ? `
      <div class="selected-item">
        <button class="remove-btn" data-remove-profession-id="${id}">×</button>
        <span>${prof.nazwa}</span>
      </div>
    ` : '';
  }).join('');
  listDiv.querySelectorAll('[data-remove-profession-id]').forEach(btn => {
    btn.addEventListener('click', () => removeProfession(btn.dataset.removeProfessionId));
  });
}

/**
 * Usuwa profesję z wybranych, czyszcząc odpowiedź slotu, do którego była przypisana.
 */
function removeProfession(professionId) {
  const slotId = Object.keys(odpowiedziSlotow).find(id => {
    const odp = odpowiedziSlotow[id];
    return odp && odp.mode === 'profesja' && odp.profesjaId === professionId;
  });
  if (slotId) {
    odpowiedziSlotow[slotId] = { ...odpowiedziSlotow[slotId], profesjaId: null };
  }
  renderProfessionsSection();
}

/**
 * Renderuje sekcję kuriozów
 */
function renderCuriosSection() {
  const grid = document.getElementById('curios-grid');
  const countSpan = document.getElementById('curios-count');
  const listDiv = document.getElementById('curios-list');
  
  if (!grid || !countSpan || !listDiv) return;
  
  const { kurioza } = obliczIloscWyborow();
  countSpan.textContent = kurioza;
  
  // Wyczyść grid
  grid.innerHTML = '';
  
  // Grupuj kurioza według kategorii
  const kategorie = {};
  dostepneKurioza.forEach(curio => {
    if (!kategorie[curio.kategoria]) {
      kategorie[curio.kategoria] = [];
    }
    kategorie[curio.kategoria].push(curio);
  });
  
  // Renderuj kafelki
  Object.entries(kategorie).forEach(([_katId, curios]) => {
    curios.forEach(curio => {
      const tile = renderCurioTile(curio);
      grid.appendChild(tile);
    });
  });
  
  // Aktualizuj listę wybranych
  updateSelectedCurios();
}

/**
 * Renderuje kafel kurioza
 */
function renderCurioTile(curio) {
  const isSelected = wybraneKurioza.includes(curio.id);
  const tile = document.createElement('div');
  tile.className = `curio-tile ${isSelected ? 'selected' : ''}`;
  tile.dataset.curioId = curio.id;
  
  tile.innerHTML = `
    <div class="tile-category">${curio.kategoria || ''}</div>
    <div class="tile-title">${curio.nazwa || ''}</div>
    ${curio.opis ? `<div class="tile-description">${curio.opis}</div>` : ''}
  `;
  
  // Event listenery
  tile.addEventListener('click', () => toggleCurio(curio.id));
  
  return tile;
}

/**
 * Przełącza wybór kurioza
 */
function toggleCurio(curioId) {
  const { kurioza } = obliczIloscWyborow();
  
  if (wybraneKurioza.includes(curioId)) {
    // Usuń z wybranych
    wybraneKurioza = wybraneKurioza.filter(id => id !== curioId);
  } else {
    // Dodaj do wybranych (jeśli nie przekracza limitu)
    if (wybraneKurioza.length < kurioza) {
      wybraneKurioza.push(curioId);
    }
  }
  
  renderCuriosSection();
  updateStep4NextButton();
}

/**
 * Losuje kurioza
 */
/* eslint-disable-next-line no-unused-vars */
function _randomizeCurio() {
  const { kurioza } = obliczIloscWyborow();
  const available = dostepneKurioza.filter(curio => !wybraneKurioza.includes(curio.id));
  
  if (available.length > 0 && wybraneKurioza.length < kurioza) {
    const randomCurio = available[Math.floor(Math.random() * available.length)];
    wybraneKurioza.push(randomCurio.id);
    renderCuriosSection();
    updateStep4NextButton();
  }
}

/**
 * Sprawdza, czy dany slot profesyjno-językowy ma kompletną odpowiedź.
 */
function slotOdpowiedzKompletna(slot) {
  const odp = odpowiedziSlotow[slot.id];
  if (!odp || !odp.mode) return false;
  return odp.mode === 'profesja' ? !!odp.profesjaId : !!odp.jezyk;
}

/**
 * Losuje odpowiedzi (profesja/język) dla wszystkich nierozdanych jeszcze slotów.
 */
function opcjeWartosciDlaTrybu(slot, mode, autoPismoWszystkieZnane) {
  if (mode === 'profesja') {
    return profesjeDlaSlotu(slot).map(p => p.id);
  }
  if (mode === 'jezyk_nowy') {
    const znane = new Set(pobierzMowioneJezyki());
    return Object.keys(JEZYKI).filter(k => !znane.has(k));
  }
  if (mode === 'jezyk_pismo') {
    const juzPismo = new Set(pobierzJezykiZPismem(autoPismoWszystkieZnane));
    return pobierzMowioneJezyki().filter(k => !juzPismo.has(k));
  }
  return [];
}

function losujProfesjeCentralnie() {
  const { sloty, autoPismoWszystkieZnane } = obliczSlotyPostaci();

  for (const slot of sloty) {
    if (slotOdpowiedzKompletna(slot)) continue;
    // Wypróbuj tryby w losowej kolejności - jeśli jeden nie ma już dostępnych
    // wartości (np. pismo, gdy wszystkie znane języki są już opanowane),
    // spróbuj kolejnego, zamiast pomijać slot.
    const tryby = [...slot.opcje].sort(() => Math.random() - 0.5);
    for (const mode of tryby) {
      const opcje = opcjeWartosciDlaTrybu(slot, mode, autoPismoWszystkieZnane);
      if (opcje.length === 0) continue;
      const pick = opcje[Math.floor(Math.random() * opcje.length)];
      odpowiedziSlotow[slot.id] = mode === 'profesja' ? { mode, profesjaId: pick } : { mode, jezyk: pick };
      break;
    }
  }

  renderProfessionsSection();
}

/**
 * Losuje kurioza zgodnie z aktualnym limitem brakujących wyborów
 */
function losujKuriozaCentralnie() {
  const { kurioza } = obliczIloscWyborow();
  const remaining = Math.max(0, kurioza - wybraneKurioza.length);
  if (remaining === 0) return;
  const available = dostepneKurioza.filter(c => !wybraneKurioza.includes(c.id));
  for (let i = 0; i < remaining && available.length > 0; i++) {
    const idx = Math.floor(Math.random() * available.length);
    const pick = available.splice(idx, 1)[0];
    wybraneKurioza.push(pick.id);
  }
  renderCuriosSection();
  updateStep4NextButton();
}

/**
 * Aktualizuje listę wybranych kuriozów
 */
function updateSelectedCurios() {
  const listDiv = document.getElementById('curios-list');
  if (!listDiv) return;
  
  listDiv.innerHTML = wybraneKurioza.map(id => {
    const curio = dostepneKurioza.find(c => c.id === id);
    return curio ? `
      <div class="selected-item">
        <button class="remove-btn" data-remove-curio-id="${id}">×</button>
        <span>${curio.nazwa}</span>
      </div>
    ` : '';
  }).join('');
  listDiv.querySelectorAll('[data-remove-curio-id]').forEach(btn => {
    btn.addEventListener('click', () => removeCurio(btn.dataset.removeCurioId));
  });
}

/**
 * Usuwa kurioza z wybranych
 */
function removeCurio(curioId) {
  wybraneKurioza = wybraneKurioza.filter(id => id !== curioId);
  renderCuriosSection();
  updateStep4NextButton();
}

/**
 * Aktualizuje przycisk "Dalej" w Kroku 4
 */
function updateStep4NextButton() {
  const btn = document.getElementById('btn-next-4');
  if (!btn) return;

  const { kurioza } = obliczIloscWyborow();
  const { sloty } = obliczSlotyPostaci();
  const hasRequiredProfessions = sloty.every(slot => slotOdpowiedzKompletna(slot));
  const hasRequiredCurios = wybraneKurioza.length >= kurioza;

  btn.disabled = !(hasRequiredProfessions && hasRequiredCurios);
}

// Ten plik jest ładowany jako moduł ES (<script type="module">), więc funkcje
// nie trafiają automatycznie do zasięgu globalnego. index.html odwołuje się
// do poniższych funkcji przez atrybuty onclick, więc trzeba je udostępnić na window.
window.nextStep = nextStep;
window.prevStep = prevStep;
window.utworzPostac = utworzPostac;
window.exportJSON = exportJSON;
window.closeHelp = closeHelp;
window.switchHelpTab = switchHelpTab;
