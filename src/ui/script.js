/**
 * Frontend JavaScript dla kreatora postaci
 */

import { budujPostac, obliczKorzysciPoziomu } from './logic/postac.js';
import { getPathsForLevel, obliczSlotyAtrybutow } from './logic/sciezki.js';
import { getOriginsListUI, getOriginTablesUI } from './logic/origins.js';
import { getProfesjeUI, getKuriozaUI } from './logic/profesje-kurioza.js';
import { JEZYKI, obliczSlotyProfesjiIJezykow } from './logic/jezyki-profesje.js';
import { obliczSlotyMagii, obliczRozwiazanieMagii, pobierzTradycjeDlaKategorii, pobierzZakleciaDoNauki, pobierzZakleciaKregu0, czyCzarnaMagia, opisAtomu, opisMagii } from './logic/magia.js';
import { TRADYCJE } from './data/tradycje.js';
import { rollTable } from './data/table_utils.js';
import DANE_GRY from './data/dane-gry.js';
import SPELLS from './data/spells.js';
import EQUIPMENT from './data/equipment.js';
import { ZAMOZNOSC, pobierzZamoznoscDlaRzutu } from './data/zamoznosc.js';
import {
  RZADKOSC_ETYKIETY, KATEGORIA_ETYKIETY, pobierzPrzedmiot, cenaNaOkrawki, formatujCene,
  formatujOkrawki, cenaSkupuOkrawki, obliczAtomyWyposazenia, pobierzGwarantowanePozycje,
  formatujStatystykiPrzedmiotu, SORTOWANIE_ETYKIETY, sortujPrzedmioty, PRZELICZNIK_NA_OKRAWKI
} from './logic/ekwipunek.js';

let biezacaPostac = null;
let wybranePochodzenie = null;
let wybranyPoziom = 0; // Gra zaczyna się od poziomu 0
let dostepnePochodzenia = [];
let wynikiTabel = {}; // Przechowuje wyniki tabel losowych dla wybranego pochodzenia
let wybraneSciezki = { nowicjusz: '', ekspert: '', mistrz: '' };
let przyznaneKorzysciZeSciezek = { 1: null, 3: null, 7: null };
let wybraneProfesje = []; // Pochodna odpowiedziSlotow - profesje przypisane do slotów w trybie 'profesja'
let odpowiedziSlotow = {}; // slotId -> { mode: 'profesja'|'jezyk_nowy'|'jezyk_pismo', profesjaId, jezyk }
let wybraneAtrybutySlotow = {}; // slotId (ze ścieżki) -> tablica wybranych atrybutów (sila/zrecznosc/intelekt/wola)
let wybraneKurioza = [];
let magiaWybory = {}; // atomId (ze slotu magii) -> { mode: 'tradycja'|'zaklecie', tradycjaId, spellId }
let magiaRyzykoWyniki = {}; // atomId -> { spellId, rzut, przyznane } - zapamiętany rzut k6 ryzyka splugawienia
let magiaCzarnaMagiaZaTradycje = new Set(); // tradycje czarnej magii, za które już przyznano 1 Splugawienie
let dostepneProfesje = [];
let dostepneKurioza = [];
let wylosowaneSrebrniki = null; // 2k6 za każdy poziom powyżej 0
let liczbaKuriozow = 0; // Po 1 za poziomy wyboru ścieżek: 1, 3, 7

// --- Krok 7: Ekwipunek ---
let ekwipunekZamoznoscWynik = null; // wynik rzutu 3k6 (albo null, gdy zamożność wybrano ręcznie bez losowania)
let ekwipunekZamoznoscId = null; // klucz z ZAMOZNOSC (np. 'komfort')
let ekwipunekGotowkaPoczatkowaWynik = null; // wylosowana suma kostek startowej sakiewki (w jednostce danego poziomu zamożności)
let ekwipunekWybory = {}; // atomId -> { itemId } (wybor_przedmiotu) albo { typ:'zwoj_zaklecie', tradycjaId, spellId } / { typ:'przedmiot', itemId } (wybor_dodatkowy)
let ekwipunekSprzedane = []; // klucze startowych pozycji (kluczStart) sprzedanych w sklepie
let ekwipunekZakupione = []; // { itemId, ilosc } kupione w sklepie
let ekwipunekOpisRozwiniete = new Set(); // klucze pozycji "Twoje przedmioty", dla których rozwinięto wiersz z opisem

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
      // Wyczyść zamianę i użyj domyślnych wartości bazujących na pochodzeniu
      document.getElementById('atrybut-zmniejszony').value = '';
      document.getElementById('atrybut-zwiekszony').value = '';
      aktualizujDomyślneAtrybuty();
    } else {
      aktualizujObliczoneAtrybuty();
    }
  });

  // Jednorazowa zamiana wartości atrybutów (-1/+1)
  ['atrybut-zmniejszony', 'atrybut-zwiekszony'].forEach(id => {
    document.getElementById(id).addEventListener('change', aktualizujObliczoneAtrybuty);
  });

  // Lokalne przyciski "Wyczyść" - czyszczą tylko wybór swojej sekcji
  document.getElementById('btn-reset-pochodzenie')?.addEventListener('click', resetujWyborPochodzenia);
  document.getElementById('btn-losuj-krok-1')?.addEventListener('click', losujPochodzenieICechy);
  document.getElementById('btn-import-postac')?.addEventListener('click', () => {
    document.getElementById('import-postac-file')?.click();
  });
  document.getElementById('import-postac-file')?.addEventListener('change', (e) => {
    const plik = e.target.files?.[0];
    if (plik) obslozImportPliku(plik);
    e.target.value = ''; // pozwala ponownie wybrać ten sam plik po błędzie
  });
  document.getElementById('btn-reset-poziom')?.addEventListener('click', resetujPoziom);
  document.getElementById('btn-reset-swap')?.addEventListener('click', resetujSwapAtrybutow);
  document.getElementById('btn-reset-origin-attribute-choice')?.addEventListener('click', resetujWyborAtrybutuPochodzenia);
  document.getElementById('btn-reset-kurioza')?.addEventListener('click', resetujKurioza);
  document.getElementById('btn-reset-professions')?.addEventListener('click', resetujWszystkieProfesjeIJezyki);
  document.getElementById('btn-reset-magia')?.addEventListener('click', resetujMagie);
  document.getElementById('magic-picker-close')?.addEventListener('click', zamknijMagicPicker);
  document.getElementById('magic-picker-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'magic-picker-overlay') zamknijMagicPicker();
  });
  document.getElementById('btn-losuj-zamoznosc')?.addEventListener('click', losujZamoznosc);
  document.getElementById('btn-reset-zamoznosc')?.addEventListener('click', resetujZamoznosc);
  document.getElementById('equipment-picker-close')?.addEventListener('click', zamknijEkwipunekPicker);
  document.getElementById('equipment-picker-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'equipment-picker-overlay') zamknijEkwipunekPicker();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && magiaPicker) zamknijMagicPicker();
    if (e.key === 'Escape' && ekwipunekPicker) zamknijEkwipunekPicker();
  });
  document.querySelectorAll('[data-reset-sciezka]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Sekcja ścieżki jest zwijana/rozwijana przez kliknięcie nagłówka -
      // nie pozwól, by kliknięcie przycisku Wyczyść też przełączało akordeon.
      e.stopPropagation();
      resetujSciezke(btn.dataset.resetSciezka);
    });
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
      const step = parseFloat(c.getAttribute('data-step'));
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
        <small>${renderujZnacznikZrodla(path.zrodlo || 'PG')} Poziom wyboru ${poziomWyboru}</small>
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
  const zaklecia = (pkt.zaklecia || []).map(z => `<li><strong>Magia:</strong> ${z.opis || z.nazwa || z}</li>`).join('');
  const modAttr = pkt.mod_atrybuty ? Object.entries(pkt.mod_atrybuty).map(([k,v]) => `${ETYKIETY_ATRYBUTOW[k] || k}: ${v>0?'+':''}${v}`).join(', ') : '';
  const modSec = pkt.mod_drugorzedne ? Object.entries(pkt.mod_drugorzedne).map(([k,v]) => `${ETYKIETY_ATRYBUTOW_DRUGORZEDNYCH[k] || k}: ${v>0?'+':''}${v}`).join(', ') : '';
  const atrybutyGlowne = pkt.atrybuty_glowne
    ? `<li><strong>Atrybuty:</strong> Zwiększ ${pkt.atrybuty_glowne.ilosc} dowolne o ${pkt.atrybuty_glowne.wartosc} (Krok 4)</li>`
    : '';
  const biegl = (pkt.bieglosci || []).map(b => `<li><strong>Języki i profesje:</strong> ${b}</li>`).join('');
  const sprz = (pkt.sprzet || []).map(s => `<li><strong>Sprzęt:</strong> ${s}</li>`).join('');
  return `
    <div class="benefit-category"><h5>Korzyści poziomu ${poziomWyboru}</h5>
      <ul class="path-benefits">
        ${atrybutyGlowne}
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
  
  // Poprzednie korzyści z tego progu (jeśli były) zostaną zastąpione niżej -
  // dodajBenefity() przelicza atrybuty drugorzędne od zera na podstawie
  // aktualnego stanu przyznaneKorzysciZeSciezek, więc nie trzeba ich osobno odjąć.
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
  przyznaneKorzysciZeSciezek[poziomWyboru] = { sciezkaId: sciezka.id, sciezkaNazwa: sciezka.nazwa, poziomWyboru, pkt };
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
  liczbaKuriozow = obliczIloscWyborow().kurioza;
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
        ${parseInt(benefits.zdrowie.replace('+', '')) > 0 ? `
        <div class="health-bonus">
          <h6>🏥 Bonus do Zdrowia</h6>
          <p><strong>Zdrowie:</strong> +${benefits.zdrowie.replace('+', '')}</p>
        </div>
        ` : ''}

        <div class="options-selection">
          <h6>⚡ Wybierz Opcję</h6>
          <p>Wybierz jedną z poniższych opcji:</p>
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
    } else if (opcja === 'zwiększenie Zdrowia o 4') {
      return `
        <div class="spell-description">
          <strong>Zwiększenie Zdrowia o 4:</strong> Podnosisz swoje Zdrowie o 4 punkty.
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
                    ${pochodzenie.zrodlo ? `<div class="source-badge" title="${PELNE_NAZWY_ZRODEL[pochodzenie.zrodlo] || pochodzenie.zrodlo}">${pochodzenie.zrodlo}</div>` : ''}
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
                                <span class="cultural-value">${formatujJezykiPochodzenia(pochodzenie.jezyki)}</span>
                            </div>
                            <div class="cultural-item">
                                <span class="cultural-label">Profesje:</span>
                                <span class="cultural-value">${formatujBonusProfesjiPochodzenia(pochodzenie)}</span>
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
 * Krok 1 "Losuj postać": wybiera losowe pochodzenie i losuje wszystkie jego tabele
 * (przeszłość, wygląd itd.), naśladując ręczny przepływ (rzuć każdą tabelę, potem
 * kliknij "Wybierz") - dzięki temu wynikiTabel wypełnia się tak samo, jak przy ręcznym
 * wyborze, patrz zbierzWynikiTabel() wywoływane wewnątrz wybierzPochodzenie().
 */
async function losujPochodzenieICechy() {
  if (!dostepnePochodzenia.length) return;

  const losowe = dostepnePochodzenia[Math.floor(Math.random() * dostepnePochodzenia.length)];

  if (losowe.tabele) {
    for (const nazwaTabeli of Object.keys(losowe.tabele)) {
      await losujZTabeliUI(losowe.id, nazwaTabeli);
    }
  }

  wybierzPochodzenie(losowe.id);
}

/**
 * Wybiera pochodzenie
 * @param {string} originId - ID pochodzenia do wyboru
 * @param {Object} [opcje]
 * @param {boolean} [opcje.autoScroll=true] - Czy przewinąć do przycisku "Dalej"
 *   po wyborze. Wyłączane przy imporcie postaci (zob. zaimportujPostac()), żeby
 *   nie odciągać strony od komunikatu importu, zanim użytkownik zdąży go przeczytać.
 */
function wybierzPochodzenie(originId, { autoScroll = true } = {}) {
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
  if (autoScroll) {
    requestAnimationFrame(() => {
      nextButton?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  }
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
  wybraneAtrybutySlotow = {};
  wybraneKurioza = [];
  magiaWybory = {};
  magiaRyzykoWyniki = {};
  magiaCzarnaMagiaZaTradycje = new Set();
  wylosowaneSrebrniki = null;
  liczbaKuriozow = 0;
  wynikiTabel = {};
  ekwipunekZamoznoscWynik = null;
  ekwipunekZamoznoscId = null;
  ekwipunekGotowkaPoczatkowaWynik = null;
  ekwipunekWybory = {};
  ekwipunekSprzedane = [];
  ekwipunekZakupione = [];
  ekwipunekOpisRozwiniete = new Set();

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
  ['atrybut-zmniejszony', 'atrybut-zwiekszony'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
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
    renderAtrybutySlotySection();
  } else if (currentStep === 4) {
    pokazKrok(5);
    renderProfessionsSection();
    renderCuriosSection();
  } else if (currentStep === 5) {
    pokazKrok(6);
    renderSpellsSection();
  } else if (currentStep === 6) {
    pokazKrok(7);
    renderEkwipunekSection();
  } else if (currentStep === 7) {
    pokazKrok(8);
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
  } else if (currentStep === 7) {
    pokazKrok(6);
  } else if (currentStep === 8) {
    pokazKrok(7);
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
    // Wymagane rozdanie punktów zwiększenia atrybutów (Krok 4)
    const slotyAtr = obliczSlotyAtrybutow({
      sciezkaNowicjuszaId: wybraneSciezki.nowicjusz || null,
      sciezkaEksperckaId: wybraneSciezki.ekspert || null,
      sciezkaMistrzowskaId: wybraneSciezki.mistrz || null
    });
    if (!slotyAtr.every(slotAtrybutowKompletny)) return;
  }
  if (stepNumber === 6 || stepNumber === 7 || stepNumber === 8) {
    // Wymagane profesje/języki i kurioza (Kroki 6 i 7 są opcjonalne, ale
    // wciąż wymagają, że Krok 5 zostanie zakończony, tak jak wcześniej
    // wymagał tego Krok 8)
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
    renderAtrybutySlotySection();
  }
  if (stepNumber === 5) {
    renderProfessionsSection();
    renderCuriosSection();
  }
  if (stepNumber === 6) {
    renderSpellsSection();
  }
  if (stepNumber === 7) {
    renderEkwipunekSection();
  }
  if (stepNumber === 8) {
    aktualizujPodgladPostaci();
  }
}

function updateBreadcrumbs(activeStep) {
  const crumbs = document.querySelectorAll('#breadcrumbs .breadcrumb-item');
  crumbs.forEach(c => {
    const step = parseFloat(c.getAttribute('data-step'));
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
        <p><strong>Języki:</strong> ${formatujJezykiPochodzenia(pochodzenie.jezyki)}</p>
        <p><strong>Modyfikatory atrybutów:</strong> 
            Siła ${pochodzenie.atrybuty_bazowe.sila - 10 >= 0 ? '+' : ''}${pochodzenie.atrybuty_bazowe.sila - 10}, 
            Zręczność ${pochodzenie.atrybuty_bazowe.zrecznosc - 10 >= 0 ? '+' : ''}${pochodzenie.atrybuty_bazowe.zrecznosc - 10}, 
            Intelekt ${pochodzenie.atrybuty_bazowe.intelekt - 10 >= 0 ? '+' : ''}${pochodzenie.atrybuty_bazowe.intelekt - 10}, 
            Wola ${pochodzenie.atrybuty_bazowe.wola - 10 >= 0 ? '+' : ''}${pochodzenie.atrybuty_bazowe.wola - 10}
        </p>
    `;
}

/**
 * Oblicza finalne atrybuty główne pochodzenia z uwzględnieniem opcjonalnej
 * jednorazowej zmiany wartości (PG: "Możesz podnieść jedną z wartości o 1,
 * jeśli zmniejszysz inną o 1. Wolno ci dokonać takiej zmiany tylko raz.")
 * oraz bonusu do wybranych atrybutów przyznawanego przez samo pochodzenie
 * (np. Człowiek: +1 do wybranego atrybutu, Elf: +1 do dwóch wybranych).
 * @param {Object} pochodzenie - Obiekt pochodzenia (z origins.js)
 * @param {string} [zmniejszony] - Atrybut obniżony o 1 (sila/zrecznosc/intelekt/wola)
 * @param {string} [zwiekszony] - Atrybut podniesiony o 1 (musi różnić się od zmniejszony)
 * @param {string[]} [bonusoweAtrybuty] - Atrybuty wybrane do bonusu z pochodzenia
 * @returns {Object} Finalne wartości czterech atrybutów głównych
 */
function obliczAtrybutyGlowne(pochodzenie, zmniejszony, zwiekszony, bonusoweAtrybuty) {
  const atrybuty = { ...pochodzenie.atrybuty_bazowe };
  if (zmniejszony && zwiekszony && zmniejszony !== zwiekszony) {
    atrybuty[zmniejszony] -= 1;
    atrybuty[zwiekszony] += 1;
  }
  if (pochodzenie.wybor_atrybutu && bonusoweAtrybuty) {
    const wartosc = pochodzenie.wybor_atrybutu.wartosc || 1;
    bonusoweAtrybuty.forEach(atr => {
      if (atr && atrybuty[atr] !== undefined) atrybuty[atr] += wartosc;
    });
  }
  return atrybuty;
}

/**
 * Renderuje selecty pozwalające wybrać atrybut(y) bonusowe przyznawane przez
 * samo pochodzenie (poza jednorazową zamianą wartości). Wywoływane raz przy
 * wyborze/zmianie pochodzenia - dalsze odczyty wartości korzystają z już
 * wyrenderowanych selectów (patrz pobierzWybraneAtrybutyBonusowe).
 * @param {Object} pochodzenie
 */
function renderOriginAttributeChoiceSection(pochodzenie) {
  const sekcja = document.getElementById('origin-attribute-choice-section');
  const selectyDiv = document.getElementById('origin-attribute-choice-selects');
  const hint = document.getElementById('origin-attribute-choice-hint');
  if (!sekcja || !selectyDiv || !hint) return;

  const wybor = pochodzenie && pochodzenie.wybor_atrybutu;
  if (!wybor) {
    sekcja.style.display = 'none';
    selectyDiv.innerHTML = '';
    return;
  }

  sekcja.style.display = 'block';
  hint.textContent = `${pochodzenie.nazwa}: ${wybor.opis}. Wybierz ${wybor.ilosc > 1 ? `${wybor.ilosc} różne atrybuty` : 'atrybut'}.`;

  const ATRYBUTY = [
    ['sila', 'Siła'], ['zrecznosc', 'Zręczność'], ['intelekt', 'Intelekt'], ['wola', 'Wola']
  ];
  const opcjeHtml = (selectId) => `
    <option value="">-- brak wyboru --</option>
    ${ATRYBUTY.map(([val, label]) => `<option value="${val}" id="${selectId}-opt-${val}">${label}</option>`).join('')}
  `;

  selectyDiv.innerHTML = Array.from({ length: wybor.ilosc }, (_, i) => {
    const selectId = `origin-attr-choice-${i}`;
    return `
      <div class="form-group">
        <label for="${selectId}">Atrybut ${i + 1}:</label>
        <select id="${selectId}" class="origin-attr-choice-select">${opcjeHtml(selectId)}</select>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.origin-attr-choice-select').forEach(sel => {
    sel.addEventListener('change', () => {
      odswiezSelektyWyboruAtrybutu();
      aktualizujObliczoneAtrybuty();
    });
  });
  odswiezSelektyWyboruAtrybutu();
}

/**
 * Wyłącza w każdym selectcie wyboru atrybutu bonusowego opcje już wybrane
 * w innych selectach, by nie dało się wybrać tego samego atrybutu dwa razy.
 */
function odswiezSelektyWyboruAtrybutu() {
  const selekty = Array.from(document.querySelectorAll('.origin-attr-choice-select'));
  const wybrane = selekty.map(s => s.value).filter(Boolean);
  selekty.forEach(sel => {
    Array.from(sel.options).forEach(opt => {
      opt.disabled = !!opt.value && opt.value !== sel.value && wybrane.includes(opt.value);
    });
  });
}

/**
 * Odczytuje aktualnie wybrane atrybuty bonusowe z pochodzenia z selectów
 * wyrenderowanych przez renderOriginAttributeChoiceSection.
 * @returns {string[]}
 */
function pobierzWybraneAtrybutyBonusowe() {
  return Array.from(document.querySelectorAll('.origin-attr-choice-select'))
    .map(s => s.value)
    .filter(Boolean);
}

/**
 * Czyści wybór atrybutu(ów) bonusowego z pochodzenia (Krok 2).
 */
function resetujWyborAtrybutuPochodzenia() {
  document.querySelectorAll('.origin-attr-choice-select').forEach(sel => { sel.value = ''; });
  odswiezSelektyWyboruAtrybutu();
  aktualizujObliczoneAtrybuty();
}

/**
 * Aktualizuje wybory dostępne w selektach zamiany atrybutów, by nie można
 * było wybrać tego samego atrybutu do obniżenia i podniesienia, oraz
 * odświeża informację o puli atrybutów.
 */
function odswiezSelektySwapuAtrybutow(pochodzenie) {
  const selZmniejszony = document.getElementById('atrybut-zmniejszony');
  const selZwiekszony = document.getElementById('atrybut-zwiekszony');
  const info = document.getElementById('pula-atrybutow-info');
  if (!selZmniejszony || !selZwiekszony) return;

  const wartoscZmniejszony = selZmniejszony.value;
  const wartoscZwiekszony = selZwiekszony.value;

  Array.from(selZmniejszony.options).forEach(opt => {
    opt.disabled = !!opt.value && opt.value === wartoscZwiekszony;
  });
  Array.from(selZwiekszony.options).forEach(opt => {
    opt.disabled = !!opt.value && opt.value === wartoscZmniejszony;
  });

  if (info && pochodzenie) {
    const pula = Object.values(pochodzenie.atrybuty_bazowe).reduce((a, b) => a + b, 0);
    info.textContent = `Pula atrybutów pochodzenia: ${pula} (suma się nie zmienia po zamianie).`;
  }
}

/**
 * Czyści wybór pochodzenia (Krok 1) i cały zależny od niego stan
 * (poziom, ścieżki, profesje/języki, kurioza).
 */
function resetujWyborPochodzenia() {
  resetujStanPoZmianiePochodzenia();
  wybranePochodzenie = null;
  document.querySelectorAll('.origin-tile').forEach(tile => tile.classList.remove('selected'));
  const info = document.getElementById('selected-origin-info');
  if (info) info.innerHTML = '';
  const message = document.getElementById('step-1')?.querySelector('.selection-message');
  if (message) message.remove();
  const nextButton = document.getElementById('btn-next-1');
  if (nextButton) nextButton.disabled = true;
}

/**
 * Czyści wybór poziomu postaci (Krok 2), wracając do poziomu 0.
 */
function resetujPoziom() {
  const radio0 = document.querySelector('input[name="poziom"][value="0"]');
  if (radio0) {
    radio0.checked = true;
    radio0.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

/**
 * Czyści jednorazową zamianę wartości atrybutów (Krok 2).
 */
function resetujSwapAtrybutow() {
  const selZmniejszony = document.getElementById('atrybut-zmniejszony');
  const selZwiekszony = document.getElementById('atrybut-zwiekszony');
  if (selZmniejszony) selZmniejszony.value = '';
  if (selZwiekszony) selZwiekszony.value = '';
  aktualizujObliczoneAtrybuty();
}

/**
 * Czyści wybór jednej ścieżki (Krok 3) - nowicjusza, eksperckiej lub
 * mistrzowskiej - wraz z korzyściami, które ta ścieżka przyznała.
 * @param {'nowicjusz'|'ekspert'|'mistrz'} tier
 */
function resetujSciezke(tier) {
  const poziomMap = { nowicjusz: 1, ekspert: 3, mistrz: 7 };
  const poziomWyboru = poziomMap[tier];
  if (!poziomWyboru) return;

  if (przyznaneKorzysciZeSciezek[poziomWyboru]) {
    const usuwanaKorzysc = przyznaneKorzysciZeSciezek[poziomWyboru];
    // Wyczyść stan PRZED przeliczeniem, by sumujBonusyDrugorzedneZeSciezek()
    // (wywoływane wewnątrz odejmijBenefity) nie liczyło już usuwanej ścieżki.
    przyznaneKorzysciZeSciezek[poziomWyboru] = null;
    odejmijBenefity(usuwanaKorzysc);
  }
  wybraneSciezki[tier] = '';

  const summaryEl = document.getElementById(`path-summary-${poziomWyboru}`);
  if (summaryEl) summaryEl.innerHTML = '';

  renderPathSectionsVisibility();
  renderPathSection(poziomWyboru);
  aktualizujPodgladPostaci();
}

/**
 * Czyści wszystkie wybrane kurioza (Krok 5).
 */
function resetujKurioza() {
  wybraneKurioza = [];
  renderCuriosSection();
  updateStep5NextButton();
}

/**
 * Czyści wszystkie sloty profesji i języków (Krok 5), by umożliwić
 * ponowny wybór od zera - w przeciwieństwie do lokalnego "Wyczyść" na
 * pojedynczej karcie, ten przycisk resetuje całą sekcję Profesje/Języki.
 */
function resetujWszystkieProfesjeIJezyki() {
  odpowiedziSlotow = {};
  renderProfessionsSection();
}

/**
 * Aktualizuje domyślne atrybuty bazujące na pochodzeniu (bez zmiany wartości)
 */
function aktualizujDomyślneAtrybuty() {
  if (!wybranePochodzenie) return;

  const pochodzenie = dostepnePochodzenia.find(p => p.id === wybranePochodzenie);
  if (!pochodzenie) return;

  renderOriginAttributeChoiceSection(pochodzenie);

  const atrybutyFinalne = obliczAtrybutyGlowne(pochodzenie, undefined, undefined, pobierzWybraneAtrybutyBonusowe());
  wyswietlAtrybutyGlowne(atrybutyFinalne, pochodzenie);
}

/**
 * Aktualizuje obliczone atrybuty na podstawie pochodzenia i (opcjonalnie)
 * jednorazowej zamiany wartości wybranej w selektach.
 */
function aktualizujObliczoneAtrybuty() {
  if (!wybranePochodzenie) return;

  const pochodzenie = dostepnePochodzenia.find(p => p.id === wybranePochodzenie);
  if (!pochodzenie) return;

  odswiezSelektySwapuAtrybutow(pochodzenie);
  const bonusoweAtrybuty = pobierzWybraneAtrybutyBonusowe();

  let atrybutyFinalne;
  if (document.getElementById('domyslne-atrybuty').checked) {
    atrybutyFinalne = obliczAtrybutyGlowne(pochodzenie, undefined, undefined, bonusoweAtrybuty);
  } else {
    const zmniejszony = document.getElementById('atrybut-zmniejszony').value;
    const zwiekszony = document.getElementById('atrybut-zwiekszony').value;
    atrybutyFinalne = obliczAtrybutyGlowne(pochodzenie, zmniejszony, zwiekszony, bonusoweAtrybuty);
  }

  // Zsynchronizuj ukryte pola z finalnymi wartościami atrybutów głównych
  ['sila', 'zrecznosc', 'intelekt', 'wola'].forEach(atr => {
    const input = document.getElementById(`${atr}-base`);
    if (input) input.value = atrybutyFinalne[atr];
  });

  wyswietlAtrybutyGlowne(atrybutyFinalne, pochodzenie);
}

/**
 * Wyświetla finalne atrybuty główne i przelicza atrybuty drugorzędne.
 */
function wyswietlAtrybutyGlowne(atrybutyFinalne, pochodzenie) {
  document.getElementById('sila-final').textContent = atrybutyFinalne.sila;
  document.getElementById('zrecznosc-final').textContent = atrybutyFinalne.zrecznosc;
  document.getElementById('intelekt-final').textContent = atrybutyFinalne.intelekt;
  document.getElementById('wola-final').textContent = atrybutyFinalne.wola;

  // Modyfikator = wartość - 10 (przeciętna wartość atrybutu w PG)
  document.getElementById('sila-mod').textContent = formatModifier(atrybutyFinalne.sila - 10);
  document.getElementById('zrecznosc-mod').textContent = formatModifier(atrybutyFinalne.zrecznosc - 10);
  document.getElementById('intelekt-mod').textContent = formatModifier(atrybutyFinalne.intelekt - 10);
  document.getElementById('wola-mod').textContent = formatModifier(atrybutyFinalne.wola - 10);

  aktualizujAtrybutyDrugorzedne(atrybutyFinalne, pochodzenie);

  // Aktywuj przycisk "Dalej" w kroku 2
  document.getElementById('btn-next-2').disabled = false;
}

/** Etykiety atrybutów głównych używane w Kroku 4. */
const ETYKIETY_ATRYBUTOW = { sila: 'Siła', zrecznosc: 'Zręczność', intelekt: 'Intelekt', wola: 'Wola' };

/** Etykiety atrybutów drugorzędnych - używane przy formatowaniu modyfikatorów ścieżek na kafelkach (Krok 3). */
const ETYKIETY_ATRYBUTOW_DRUGORZEDNYCH = {
  zdrowie: 'Zdrowie', moc: 'Moc', obrona: 'Obrona', predkosc: 'Prędkość', splugawienie: 'Splugawienie'
};

/**
 * Sprawdza, czy dany slot zwiększenia atrybutów (Krok 4) ma kompletną
 * odpowiedź: dokładnie `ilosc` różnych atrybutów wybranych.
 */
function slotAtrybutowKompletny(slot) {
  const wybrane = wybraneAtrybutySlotow[slot.id] || [];
  return wybrane.length === slot.ilosc;
}

/**
 * Oblicza atrybuty główne postaci PRZED uwzględnieniem slotów Kroku 4:
 * pochodzenie + jednorazowa zamiana wartości z Kroku 2.
 */
function obliczBazoweAtrybutyPrzedSciezkami() {
  const pochodzenie = dostepnePochodzenia.find(p => p.id === wybranePochodzenie);
  if (!pochodzenie) return null;
  const zmniejszony = document.getElementById('atrybut-zmniejszony')?.value;
  const zwiekszony = document.getElementById('atrybut-zwiekszony')?.value;
  return obliczAtrybutyGlowne(pochodzenie, zmniejszony, zwiekszony);
}

/**
 * Renderuje Krok 4: sloty zwiększenia atrybutów przyznane przez wybrane
 * ścieżki (PG: "Zwiększ dwa/trzy dowolne o 1" przy wyborze ścieżki).
 * Przelicza i zapisuje finalne atrybuty główne (bazowe + bonusy ze
 * wszystkich slotów) do #sila-final itd., by kolejne kroki widziały
 * poprawne wartości.
 */
function renderAtrybutySlotySection() {
  const container = document.getElementById('attribute-slots');
  if (!container) return;

  const sloty = obliczSlotyAtrybutow({
    sciezkaNowicjuszaId: wybraneSciezki.nowicjusz || null,
    sciezkaEksperckaId: wybraneSciezki.ekspert || null,
    sciezkaMistrzowskaId: wybraneSciezki.mistrz || null
  });

  if (sloty.length === 0) {
    container.innerHTML = '<p class="hint">Żadna z wybranych ścieżek nie daje na tym poziomie możliwości zwiększenia atrybutów.</p>';
  } else {
    container.innerHTML = sloty.map(slot => {
      const wybrane = wybraneAtrybutySlotow[slot.id] || [];
      const limitOsiagniety = wybrane.length >= slot.ilosc;
      const opcje = slot.dostepne.map(atr => {
        const iloscPrzypisana = wybrane.filter(w => w === atr).length;
        return `
          <div class="attribute-stepper" data-slot-id="${slot.id}" data-attr="${atr}">
            <span class="attribute-stepper-label">${ETYKIETY_ATRYBUTOW[atr] || atr}</span>
            <button type="button" class="attribute-stepper-btn" data-delta="-1" ${iloscPrzypisana === 0 ? 'disabled' : ''}>−</button>
            <span class="attribute-stepper-count">${iloscPrzypisana}</span>
            <button type="button" class="attribute-stepper-btn" data-delta="1" ${limitOsiagniety ? 'disabled' : ''}>+</button>
          </div>
        `;
      }).join('');
      return `
        <div class="slot-card" data-slot-id="${slot.id}">
          <div class="slot-source">
            ${slot.source}
            <button type="button" class="section-reset-btn" data-reset-attribute-slot="${slot.id}" title="Wyczyść wybór dla tej ścieżki">Wyczyść</button>
          </div>
          <div class="slot-opis">Rozdaj ${slot.ilosc} punkty(ów) zwiększenia o ${slot.wartosc} - można je łączyć na jednym atrybucie (przypisano ${wybrane.length}/${slot.ilosc})</div>
          <div class="attribute-choice-list">${opcje}</div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.attribute-stepper-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const stepper = e.target.closest('.attribute-stepper');
        const { slotId, attr } = stepper.dataset;
        const delta = parseInt(e.target.dataset.delta);
        const wybrane = [...(wybraneAtrybutySlotow[slotId] || [])];
        const slot = sloty.find(s => s.id === slotId);
        if (delta > 0 && wybrane.length < slot.ilosc) {
          wybrane.push(attr);
        } else if (delta < 0) {
          const idx = wybrane.lastIndexOf(attr);
          if (idx !== -1) wybrane.splice(idx, 1);
        }
        wybraneAtrybutySlotow[slotId] = wybrane;
        renderAtrybutySlotySection();
      });
    });
    container.querySelectorAll('[data-reset-attribute-slot]').forEach(btn => {
      btn.addEventListener('click', () => {
        delete wybraneAtrybutySlotow[btn.dataset.resetAttributeSlot];
        renderAtrybutySlotySection();
      });
    });
  }

  // Przelicz i zapisz finalne atrybuty główne (bazowe + wszystkie sloty)
  const bazowe = obliczBazoweAtrybutyPrzedSciezkami();
  if (bazowe) {
    const pochodzenie = dostepnePochodzenia.find(p => p.id === wybranePochodzenie);
    const finalne = { ...bazowe };
    sloty.forEach(slot => {
      (wybraneAtrybutySlotow[slot.id] || []).forEach(atr => {
        finalne[atr] += slot.wartosc;
      });
    });
    wyswietlAtrybutyGlowne(finalne, pochodzenie);
  }

  const btn = document.getElementById('btn-next-4');
  if (btn) btn.disabled = !sloty.every(slotAtrybutowKompletny);
}

/**
 * Sumuje bonusy do atrybutów drugorzędnych (Zdrowie, Moc, Obrona, Prędkość,
 * Splugawienie) przyznane przez wszystkie aktualnie wybrane ścieżki.
 * @returns {{zdrowie: number, moc: number, obrona: number, predkosc: number, splugawienie: number}}
 */
function sumujBonusyDrugorzedneZeSciezek() {
  const suma = { zdrowie: 0, moc: 0, obrona: 0, predkosc: 0, splugawienie: 0 };
  [1, 3, 7].forEach(poziomWyboru => {
    const mod = przyznaneKorzysciZeSciezek[poziomWyboru]?.pkt?.mod_drugorzedne;
    if (!mod) return;
    Object.keys(suma).forEach(k => { suma[k] += mod[k] || 0; });
  });
  return suma;
}

/**
 * Aktualizuje atrybuty drugorzędne na podstawie atrybutów głównych i pochodzenia
 */
function aktualizujAtrybutyDrugorzedne(atrybuty, pochodzenie) {
  // Oblicz atrybuty drugorzędne zgodnie z Podręcznikiem Głównym
  const bonusySciezek = sumujBonusyDrugorzedneZeSciezek();
  let zdrowie = atrybuty.sila + bonusySciezek.zdrowie;

  // Dodaj bonus do zdrowia z poziomu 4 jeśli jest dostępny
  if (wybranyPoziom >= 4 && pochodzenie.poziom_4 && pochodzenie.poziom_4.zdrowie) {
    const healthBonus = parseInt(pochodzenie.poziom_4.zdrowie.replace('+', ''));
    zdrowie += healthBonus;
  }

  const atrybutyDrugorzedne = {
    percepcja: atrybuty.intelekt,
    obrona: atrybuty.zrecznosc + bonusySciezek.obrona,
    zdrowie,
    szybkosc_zdrowienia: Math.floor(atrybuty.sila / 4) || 1,
    moc: bonusySciezek.moc,
    predkosc: (pochodzenie.predkosc || 0) + bonusySciezek.predkosc,
    splugawienie: bonusySciezek.splugawienie + obliczSplugawienieZMagiiAktualnej()
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
          <div class="attribute-display">
            <label>Prędkość:</label>
            <span id="predkosc-final">${atrybutyDrugorzedne.predkosc}</span>
          </div>
          <div class="attribute-display">
            <label>Moc:</label>
            <span id="moc-final">${atrybutyDrugorzedne.moc}</span>
          </div>
          <div class="attribute-display">
            <label>Splugawienie:</label>
            <span id="splugawienie-final">${atrybutyDrugorzedne.splugawienie}</span>
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
      document.getElementById('predkosc-final').textContent = atrybutyDrugorzedne.predkosc;
      document.getElementById('moc-final').textContent = atrybutyDrugorzedne.moc;
      document.getElementById('splugawienie-final').textContent = atrybutyDrugorzedne.splugawienie;
    }
  }
}

/**
 * Przelicza atrybuty drugorzędne od nowa (np. po zmianie wyboru magii w
 * Kroku 6, gdy poznanie/nauka czarnej magii zmienia Splugawienie) na
 * podstawie atrybutów głównych aktualnie wyświetlonych w Kroku 2.
 */
function odswiezAtrybutyDrugorzedne() {
  if (!wybranePochodzenie) return;
  const pochodzenie = dostepnePochodzenia.find(p => p.id === wybranePochodzenie);
  if (!pochodzenie) return;
  const atrybuty = {
    sila: parseInt(document.getElementById('sila-final')?.textContent, 10) || 0,
    zrecznosc: parseInt(document.getElementById('zrecznosc-final')?.textContent, 10) || 0,
    intelekt: parseInt(document.getElementById('intelekt-final')?.textContent, 10) || 0,
    wola: parseInt(document.getElementById('wola-final')?.textContent, 10) || 0
  };
  aktualizujAtrybutyDrugorzedne(atrybuty, pochodzenie);
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
 * Formatuje listę języków pochodzenia (kluczy z origins.js, np. 'mroczna_mowa')
 * do czytelnych nazw z JEZYKI (np. 'Mroczna mowa') - inaczej wieloczłonowe
 * klucze wyciekałyby do UI jako surowy tekst ze znakiem podkreślenia.
 * @param {string[]} jezyki
 * @returns {string}
 */
function formatujJezykiPochodzenia(jezyki) {
  return (jezyki || []).map(j => JEZYKI[j] || j).join(', ');
}

/**
 * Formatuje opis bonusu profesyjnego/językowego pochodzenia (do wyświetlenia
 * poza Krokiem 4, np. na rozwiniętym kafelku pochodzenia lub w podglądzie).
 * @param {Object} pochodzenie - Obiekt pochodzenia (z origins.js)
 * @returns {string} Opis bonusu
 */
function formatujBonusProfesjiPochodzenia(pochodzenie) {
  if (!pochodzenie.profesje || pochodzenie.profesje.length === 0) {
    return 'brak dodatkowej profesji lub języka';
  }
  const kategorie = pochodzenie.profesje.join(', ');
  return pochodzenie.bonus_jezyk_lub_profesja
    ? `${kategorie} (albo nowy język - wybór w Kroku 5)`
    : `${kategorie} (gwarantowana)`;
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
 * Zamienia klucz w formacie snake_case (np. "znienawidzone_stworzenia") na
 * czytelny tekst ("Znienawidzone stworzenia") - wyłącznie awaryjny fallback,
 * gdy dla klucza brakuje właściwej, poprawnie sformatowanej nazwy w danych.
 */
function humanizujKluczTabeli(klucz) {
  const tekst = klucz.replace(/_/g, ' ');
  return tekst.charAt(0).toUpperCase() + tekst.slice(1);
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
  
  let html = '<div class="preview-section">';
  html += '<h5>🎲 Wyniki Tabel Losowych</h5>';

  Object.entries(wynikiTabel[originId]).forEach(([tableName, result]) => {
    // Nazwa tabeli pochodzi bezpośrednio z jej definicji (pochodzenie.tabele),
    // a nie z osobno utrzymywanej listy - inaczej brakujący wpis pokazywałby
    // surowy klucz (np. "znienawidzone_stworzenia") zamiast czytelnej nazwy.
    const nazwaTabeli = pochodzenie.tabele[tableName]?.nazwa || humanizujKluczTabeli(tableName);
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
 * Zwraca nazwę tieru poziomu postaci (0=startowy, 1-2=Nowicjusz,
 * 3-6=Ekspert, 7-10=Mistrz), zgodnie z etykietami użytymi na kartach
 * poziomu w Kroku 2.
 * @param {number} poziom
 * @returns {string}
 */
function nazwaTieruPoziomu(poziom) {
  if (poziom === 0) return 'Poziom startowy';
  if (poziom <= 2) return 'Nowicjusz';
  if (poziom <= 6) return 'Ekspert';
  return 'Mistrz';
}

/**
 * Renderuje sekcję pochodzenia: nazwa, opis, cechy specjalne, rozmiar,
 * prędkość bazowa, języki i bonus profesyjny/językowy z pochodzenia.
 */
function renderKartaPochodzeniaSection(pochodzenie) {
  const cechy = pobierzWszystkieCechy(pochodzenie.cechy_specjalne);
  return `
    <div class="preview-section">
      <h5>${pochodzenie.nazwa}</h5>
      <p>${pochodzenie.opis}</p>
      <p><strong>Rozmiar:</strong> ${pochodzenie.rozmiar} | <strong>Prędkość bazowa:</strong> ${pochodzenie.predkosc}</p>
      <p><strong>Języki:</strong> ${formatujJezykiPochodzenia(pochodzenie.jezyki)}</p>
      <p><strong>Profesja/język z pochodzenia:</strong> ${formatujBonusProfesjiPochodzenia(pochodzenie)}</p>
      ${cechy ? `
        <div class="trait-list">
          ${cechy.map(c => `<div class="trait-item"><strong>${c.nazwa}:</strong> ${c.opis}</div>`).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Renderuje sekcję atrybutów podstawowych wraz z notatkami o jednorazowej
 * zamianie wartości (Krok 2) i bonusie do atrybutu z pochodzenia, jeśli
 * były użyte.
 */
function renderKartaAtrybutyPodstawoweSection(pochodzenie) {
  const atrybuty = {
    sila: parseInt(document.getElementById('sila-final').textContent),
    zrecznosc: parseInt(document.getElementById('zrecznosc-final').textContent),
    intelekt: parseInt(document.getElementById('intelekt-final').textContent),
    wola: parseInt(document.getElementById('wola-final').textContent)
  };

  const notatki = [];
  const domyslneAtrybuty = document.getElementById('domyslne-atrybuty');
  if (domyslneAtrybuty && !domyslneAtrybuty.checked) {
    const zmniejszony = document.getElementById('atrybut-zmniejszony')?.value;
    const zwiekszony = document.getElementById('atrybut-zwiekszony')?.value;
    if (zmniejszony && zwiekszony) {
      notatki.push(`Zamiana wartości: −1 ${ETYKIETY_ATRYBUTOW[zmniejszony]}, +1 ${ETYKIETY_ATRYBUTOW[zwiekszony]}.`);
    }
  }
  const bonusoweAtrybuty = pobierzWybraneAtrybutyBonusowe();
  if (pochodzenie.wybor_atrybutu && bonusoweAtrybuty.length > 0) {
    const wartoscBonusu = pochodzenie.wybor_atrybutu.wartosc || 1;
    notatki.push(`Bonus z pochodzenia: ${bonusoweAtrybuty.map(a => `${ETYKIETY_ATRYBUTOW[a]} +${wartoscBonusu}`).join(', ')}.`);
  }

  return `
    <div class="preview-section">
      <h5>Atrybuty Podstawowe</h5>
      <div class="attributes-grid">
        <div class="attribute-box"><strong>Siła</strong><br>${atrybuty.sila}</div>
        <div class="attribute-box"><strong>Zręczność</strong><br>${atrybuty.zrecznosc}</div>
        <div class="attribute-box"><strong>Intelekt</strong><br>${atrybuty.intelekt}</div>
        <div class="attribute-box"><strong>Wola</strong><br>${atrybuty.wola}</div>
      </div>
      ${notatki.map(n => `<p class="hint">${n}</p>`).join('')}
    </div>
  `;
}

/**
 * Renderuje sekcję atrybutów drugorzędnych, czytając już poprawnie
 * przeliczone wartości (łącznie z bonusami ze ścieżek) z Kroku 2 -
 * patrz aktualizujAtrybutyDrugorzedne().
 */
function renderKartaAtrybutyDrugorzedneSection() {
  const odczytaj = (id, domyslnie = '0') => document.getElementById(id)?.textContent ?? domyslnie;
  return `
    <div class="preview-section">
      <h5>Atrybuty Drugorzędne</h5>
      <div class="attributes-grid">
        <div class="attribute-box"><strong>Percepcja</strong><br>${odczytaj('percepcja-final')}</div>
        <div class="attribute-box"><strong>Obrona</strong><br>${odczytaj('obrona-final')}</div>
        <div class="attribute-box"><strong>Zdrowie</strong><br>${odczytaj('zdrowie-final')}</div>
        <div class="attribute-box"><strong>Szybkość Zdrowienia</strong><br>${odczytaj('szybkosc-zdrowienia-final', '1')}</div>
        <div class="attribute-box"><strong>Prędkość</strong><br>${odczytaj('predkosc-final')}</div>
        <div class="attribute-box"><strong>Moc</strong><br>${odczytaj('moc-final')}</div>
        <div class="attribute-box"><strong>Splugawienie</strong><br>${odczytaj('splugawienie-final')}</div>
      </div>
    </div>
  `;
}

/**
 * Renderuje wybraną korzyść z pochodzenia na poziomie 4 (spell/talent/inna
 * opcja wybrana w radiobuttonach sekcji "Korzyści z Pochodzenia").
 */
function renderKartaPoziom4Section(pochodzenie) {
  if (wybranyPoziom < 4 || !pochodzenie.poziom_4) return '';
  const wybranaOpcja = document.querySelector(`input[name="origin-option-${pochodzenie.id}"]:checked`)?.value;
  const zdrowieBonus = parseInt((pochodzenie.poziom_4.zdrowie || '+0').replace('+', '')) || 0;
  return `
    <div class="preview-section">
      <h5>Korzyść z Pochodzenia (Poziom 4)</h5>
      ${zdrowieBonus > 0 ? `<p><strong>Zdrowie:</strong> +${zdrowieBonus}</p>` : ''}
      <p><strong>Wybrana opcja:</strong> ${wybranaOpcja || 'nie wybrano'}</p>
    </div>
  `;
}

/**
 * Renderuje sekcję wybranych ścieżek wraz z talentami i magią, które
 * przyznają, oraz zasoby (srebrniki, kurioza) przyznane wraz z poziomem.
 */
function renderKartaSciezkiSection() {
  const etykietyTieru = { 1: 'Nowicjusz', 3: 'Ekspert', 7: 'Mistrz' };
  const sekcje = [1, 3, 7].map(poziomWyboru => {
    const benefit = przyznaneKorzysciZeSciezek[poziomWyboru];
    if (!benefit) return '';
    const pkt = benefit.pkt || {};
    const talenty = (pkt.talenty || []).map(t => `<div class="trait-item"><strong>${t.nazwa}:</strong> ${t.opis}</div>`).join('');
    const magia = (pkt.zaklecia || []).map(z => `<div class="trait-item"><strong>Magia:</strong> ${z.opis}</div>`).join('');
    return `
      <div class="path-benefit-item">
        <h6>${etykietyTieru[poziomWyboru]}: ${benefit.sciezkaNazwa || benefit.sciezkaId} (poziom ${poziomWyboru})</h6>
        ${talenty || magia ? `<div class="trait-list">${talenty}${magia}</div>` : ''}
      </div>
    `;
  }).filter(Boolean);

  if (sekcje.length === 0) return '';

  return `
    <div class="preview-section">
      <h5>Wybrane Ścieżki</h5>
      ${sekcje.join('')}
    </div>
  `;
}

/**
 * Renderuje sekcję zasobów: srebrniki wylosowane za poziomy powyżej 0
 * i liczbę dostępnych kuriozów.
 */
function renderKartaZasobySection() {
  if (wybranyPoziom <= 0) return '';
  const srebro = wylosowaneSrebrniki != null ? wylosowaneSrebrniki : 'nie wylosowano';
  return `
    <div class="preview-section">
      <h5>Zasoby</h5>
      <p><strong>Srebrniki:</strong> ${srebro} | <strong>Kurioza:</strong> ${liczbaKuriozow}</p>
    </div>
  `;
}

/**
 * Renderuje sekcję znanych tradycji i zaklęć wybranych opcjonalnie
 * w Kroku 6, na podstawie rozwiązanych atomowych wyborów magii.
 */
function renderKartaZakleciaSection() {
  const atomy = pobierzAktualneAtomyMagii();
  if (atomy.length === 0) return '';
  const { rozwiazania, znaneTradycje } = obliczRozwiazanieMagii(atomy, magiaWybory);
  const tradycjeList = [...znaneTradycje].map(id => TRADYCJE[id]?.nazwa || id).sort((a, b) => a.localeCompare(b, 'pl'));
  const zaklecia = rozwiazania
    .flatMap(r => {
      if (r.mode === 'zaklecie' && r.spellId) return [r.spellId];
      if (r.mode === 'tradycja' && r.darmowyZaklecieId) return [r.darmowyZaklecieId];
      return [];
    })
    .map(id => SPELLS.find(s => s.id === id))
    .filter(Boolean);

  if (tradycjeList.length === 0 && zaklecia.length === 0) return '';

  const tradycjeHtml = tradycjeList.length
    ? `<div class="trait-item"><strong>Znane tradycje:</strong> ${tradycjeList.join(', ')}</div>`
    : '';
  const zakleciaHtml = zaklecia
    .map(s => `<div class="trait-item"><strong>${s.nazwa}</strong> ${renderujZnacznikZrodla(s.zrodlo)} <em>(${s.tradycjaNazwa}, krąg ${s.krag}, ${s.kategoria === 'atak' ? 'atak' : 'użytkowe'})</em>: ${s.opis}</div>`)
    .join('');

  return `
    <div class="preview-section">
      <h5>Magia - Znane Tradycje i Zaklęcia</h5>
      <div class="trait-list">${tradycjeHtml}${zakleciaHtml}</div>
    </div>
  `;
}

/**
 * Renderuje sekcję ekwipunku (Krok 7): przedmioty posiadane przez postać
 * (wyposażenie startowe pozostałe po sprzedaży + zakupy w sklepie) wraz
 * z dostępną gotówką. Pomija Zamożność bez wybranego poziomu.
 */
function renderKartaEkwipunekSection() {
  const stan = obliczStanEkwipunku();
  if (!stan) return '';

  const pozycje = [...stan.posiadaneStartowe, ...stan.zakupionePozycje];
  if (pozycje.length === 0) return '';

  const pozycjeHtml = pozycje.map(p => {
    const nazwa = p.zwojZaklecie
      ? `Zwój (${TRADYCJE[p.zwojZaklecie.tradycjaId]?.nazwa || p.zwojZaklecie.tradycjaId}${p.zwojZaklecie.spellId ? `: ${SPELLS.find(s => s.id === p.zwojZaklecie.spellId)?.nazwa || ''}` : ''})`
      : (p.itemId ? (pobierzPrzedmiot(p.itemId)?.nazwa || p.itemId) : p.tekst);
    const przedmiot = p.itemId ? pobierzPrzedmiot(p.itemId) : null;
    const ilosc = p.ilosc > 1 ? ` ×${p.ilosc}` : '';
    const statystyki = przedmiot ? formatujStatystykiPrzedmiotu(przedmiot) : null;
    return `<div class="trait-item">${nazwa}${ilosc}${przedmiot ? ` ${renderujZnacznikZrodla(przedmiot.zrodlo)}` : ''}${statystyki ? `<br><small>${statystyki}</small>` : ''}</div>`;
  }).join('');

  return `
    <div class="preview-section">
      <h5>Ekwipunek (Zamożność: ${stan.zam.nazwa})</h5>
      <div class="trait-list">${pozycjeHtml}</div>
      <p><strong>Gotówka:</strong> ${formatujOkrawki(stan.gotowkaOkrawki)}</p>
    </div>
  `;
}

/**
 * Buduje kompletną, czytelną Kartę Postaci ze wszystkich informacji
 * zebranych w kreatorze: pochodzenia, atrybutów, ścieżek z talentami,
 * profesji/języków/kuriozów, zaklęć, ekwipunku, zasobów i wyników tabel
 * losowych. Używana jako żywy podgląd w Kroku 8.
 * @returns {string} HTML karty postaci (bez zewnętrznego <h4>/nagłówka)
 */
function generujKartePostaciHTML() {
  if (!wybranePochodzenie) return '';
  const pochodzenie = dostepnePochodzenia.find(p => p.id === wybranePochodzenie);
  if (!pochodzenie) return '';

  return `
    <div class="preview-section">
      <p><strong>Poziom:</strong> ${wybranyPoziom} (${nazwaTieruPoziomu(wybranyPoziom)})</p>
    </div>
    ${renderKartaPochodzeniaSection(pochodzenie)}
    ${renderKartaAtrybutyPodstawoweSection(pochodzenie)}
    ${renderKartaAtrybutyDrugorzedneSection()}
    ${renderKartaPoziom4Section(pochodzenie)}
    ${renderKartaSciezkiSection()}
    ${renderProfessionsAndCuriosSummary()}
    ${renderKartaZakleciaSection()}
    ${renderKartaEkwipunekSection()}
    ${renderKartaZasobySection()}
    ${generujSekcjeWynikowTabel(pochodzenie.id)}
  `;
}

/**
 * Aktualizuje podgląd postaci (Krok 7) - żywa, aktualizowana na bieżąco
 * wersja Karty Postaci, zanim użytkownik kliknie "Utwórz Postać".
 */
function aktualizujPodgladPostaci() {
  if (!wybranePochodzenie) return;
  const container = document.getElementById('character-preview');
  if (!container) return;
  container.innerHTML = `<h4>📜 Podgląd Postaci</h4>${generujKartePostaciHTML()}`;
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
      magicContent.textContent = opisMagii(benefits.korzyści.magia);
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

/** Wersja schematu danych eksportu/importu postaci - zwiększana przy niekompatybilnych zmianach struktury. */
const WERSJA_EKSPORTU = 2; // v2: dodano sekcję ekwipunku (Krok 7 - Zamożność, wyposażenie startowe, sklep)

/**
 * Buduje kompletny, wersjonowany obiekt zawierający WSZYSTKIE wybory dokonane
 * przez gracza w kreatorze (sekcja `wybory` - jedyne źródło potrzebne do
 * wiernego odtworzenia postaci przy imporcie) oraz czytelne podsumowanie
 * nazw i wartości (sekcja `podsumowanie` - dla kogoś otwierającego plik
 * ręcznie). Zwraca `null`, gdy nie wybrano jeszcze pochodzenia.
 */
function zbudujDaneEksportu() {
  if (!wybranePochodzenie) return null;
  const pochodzenie = dostepnePochodzenia.find(p => p.id === wybranePochodzenie);
  if (!pochodzenie) return null;

  const odczytajTekst = (id, domyslnie = '0') => document.getElementById(id)?.textContent ?? domyslnie;

  const atomyMagii = pobierzAktualneAtomyMagii();
  const { rozwiazania, znaneTradycje } = obliczRozwiazanieMagii(atomyMagii, magiaWybory);
  const zaklecia = rozwiazania
    .flatMap(r => {
      if (r.mode === 'zaklecie' && r.spellId) return [r.spellId];
      if (r.mode === 'tradycja' && r.darmowyZaklecieId) return [r.darmowyZaklecieId];
      return [];
    })
    .map(id => SPELLS.find(s => s.id === id))
    .filter(Boolean);

  const pismo = new Set(pobierzJezykiZPismem());
  const jezyki = pobierzMowioneJezyki().map(k => {
    const nazwa = JEZYKI[k] || k;
    return pismo.has(k) ? `${nazwa} (czytanie/pisanie)` : nazwa;
  });

  const nazwaSciezki = (poziomWyboru, sciezkaId) => {
    if (!sciezkaId) return null;
    const lista = getPathsForLevel(poziomWyboru);
    return lista.find(p => p.id === sciezkaId)?.nazwa || sciezkaId;
  };

  return {
    wersjaEksportu: WERSJA_EKSPORTU,
    utworzono: new Date().toISOString(),
    // Surowe wybory gracza - jedyna sekcja odczytywana przy imporcie.
    wybory: {
      pochodzenie: wybranePochodzenie,
      bonusoweAtrybutyPochodzenia: pobierzWybraneAtrybutyBonusowe(),
      opcjaPoziom4: pobierzWybranaOpcjaPoziom4Aktualna(),
      wynikiTabelPochodzenia: JSON.parse(JSON.stringify(wynikiTabel[wybranePochodzenie] || {})),
      poziom: wybranyPoziom,
      atrybutyGlowne: {
        domyslne: document.getElementById('domyslne-atrybuty')?.checked ?? true,
        zmniejszony: document.getElementById('atrybut-zmniejszony')?.value || '',
        zwiekszony: document.getElementById('atrybut-zwiekszony')?.value || ''
      },
      sciezki: { ...wybraneSciezki },
      atrybutySloty: JSON.parse(JSON.stringify(wybraneAtrybutySlotow)),
      profesjeJezykiSloty: JSON.parse(JSON.stringify(odpowiedziSlotow)),
      kurioza: [...wybraneKurioza],
      magia: {
        wybory: JSON.parse(JSON.stringify(magiaWybory)),
        ryzykoWyniki: JSON.parse(JSON.stringify(magiaRyzykoWyniki))
      },
      srebrniki: wylosowaneSrebrniki,
      ekwipunek: {
        zamoznoscId: ekwipunekZamoznoscId,
        zamoznoscWynik: ekwipunekZamoznoscWynik,
        gotowkaPoczatkowaWynik: ekwipunekGotowkaPoczatkowaWynik,
        wybory: JSON.parse(JSON.stringify(ekwipunekWybory)),
        sprzedane: [...ekwipunekSprzedane],
        zakupione: JSON.parse(JSON.stringify(ekwipunekZakupione))
      }
    },
    // Czytelne podsumowanie (nazwy zamiast id) - wyłącznie informacyjne, nie
    // jest odczytywane przy imporcie.
    podsumowanie: {
      pochodzenie: pochodzenie.nazwa,
      poziom: wybranyPoziom,
      poziomNazwa: nazwaTieruPoziomu(wybranyPoziom),
      atrybutyGlowne: {
        sila: odczytajTekst('sila-final'),
        zrecznosc: odczytajTekst('zrecznosc-final'),
        intelekt: odczytajTekst('intelekt-final'),
        wola: odczytajTekst('wola-final')
      },
      atrybutyDrugorzedne: {
        percepcja: odczytajTekst('percepcja-final'),
        obrona: odczytajTekst('obrona-final'),
        zdrowie: odczytajTekst('zdrowie-final'),
        szybkoscZdrowienia: odczytajTekst('szybkosc-zdrowienia-final', '1'),
        predkosc: odczytajTekst('predkosc-final'),
        moc: odczytajTekst('moc-final'),
        splugawienie: odczytajTekst('splugawienie-final')
      },
      sciezki: {
        nowicjusz: nazwaSciezki(1, wybraneSciezki.nowicjusz),
        ekspert: nazwaSciezki(3, wybraneSciezki.ekspert),
        mistrz: nazwaSciezki(7, wybraneSciezki.mistrz)
      },
      profesje: wybraneProfesje.map(id => dostepneProfesje.find(p => p.id === id)?.nazwa || id),
      jezyki,
      kurioza: wybraneKurioza.map(id => dostepneKurioza.find(c => c.id === id)?.nazwa || id),
      tradycje: [...znaneTradycje].map(id => TRADYCJE[id]?.nazwa || id).sort((a, b) => a.localeCompare(b, 'pl')),
      zaklecia: zaklecia.map(s => s.nazwa),
      srebrniki: wylosowaneSrebrniki,
      ekwipunek: (() => {
        const stan = obliczStanEkwipunku();
        if (!stan) return null;
        const pozycje = [...stan.posiadaneStartowe, ...stan.zakupionePozycje].map(p => {
          if (p.zwojZaklecie) {
            const spell = p.zwojZaklecie.spellId ? SPELLS.find(s => s.id === p.zwojZaklecie.spellId) : null;
            return `Zwój (${TRADYCJE[p.zwojZaklecie.tradycjaId]?.nazwa || p.zwojZaklecie.tradycjaId}${spell ? `: ${spell.nazwa}` : ''})`;
          }
          const nazwa = p.itemId ? (pobierzPrzedmiot(p.itemId)?.nazwa || p.itemId) : p.tekst;
          return p.ilosc > 1 ? `${nazwa} ×${p.ilosc}` : nazwa;
        });
        return { zamoznosc: stan.zam.nazwa, przedmioty: pozycje, gotowka: formatujOkrawki(stan.gotowkaOkrawki) };
      })()
    }
  };
}

/**
 * Eksportuje postać jako JSON - pełny, wersjonowany zrzut wszystkich
 * wyborów dokonanych w kreatorze (zob. zbudujDaneEksportu()).
 */
// eslint-disable-next-line no-unused-vars
function exportJSON() {
  biezacaPostac = zbudujDaneEksportu();
  if (!biezacaPostac) {
    pokazBlad('Wybierz pochodzenie postaci, zanim wyeksportujesz kartę!');
    return;
  }

  const dataStr = JSON.stringify(biezacaPostac, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${ encodeURIComponent(dataStr)}`;

  const exportFileDefaultName = `postac-${biezacaPostac.wybory.pochodzenie}-${new Date().toISOString().split('T')[0]}.json`;

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

// ========== IMPORT POSTACI Z PLIKU JSON (Krok 1) ==========

/**
 * Pokazuje w Kroku 1 wynik importu postaci - pojedynczą wiadomość sukcesu
 * albo nagłówek błędu wraz z listą konkretnych problemów znalezionych
 * w pliku (zob. walidujDaneImportu()). Celowo NIE przewija strony - użytkownik
 * kliknął import z górnej części Kroku 1, więc komunikat (tuż pod przyciskiem)
 * jest już w jego polu widzenia; import nie powinien same z siebie przesuwać
 * widoku (w przeciwieństwie do ręcznego wyboru pochodzenia/poziomu itd.),
 * żeby użytkownik zdążył przeczytać komunikat i sam zdecydował, co dalej.
 */
function pokazKomunikatImportu(typ, wiadomosc, listaBledow = []) {
  const box = document.getElementById('import-feedback');
  if (!box) return;
  box.className = `import-feedback ${typ}`;
  const listaHtml = listaBledow.length
    ? `<ul>${listaBledow.map(b => `<li>${b}</li>`).join('')}</ul>`
    : '';
  box.innerHTML = `${wiadomosc}${listaHtml}`;
  box.style.display = 'block';
}

/**
 * Waliduje strukturę i zawartość pliku importu postaci: sprawdza obecność
 * wymaganych pól oraz to, czy wszystkie odwołania do danych gry
 * (pochodzenie, ścieżki, profesje, języki, kurioza, tradycje magiczne,
 * zaklęcia) istnieją w AKTUALNEJ bazie danych aplikacji - plik mógł
 * zostać wyeksportowany z innej, starszej wersji kreatora. Zwraca tablicę
 * czytelnych komunikatów błędów po polsku; pusta tablica oznacza, że plik
 * jest poprawny i bezpieczny do zaimportowania.
 */
function walidujDaneImportu(dane) {
  if (!dane || typeof dane !== 'object' || Array.isArray(dane)) {
    return ['Plik nie zawiera poprawnego obiektu JSON (oczekiwano danych postaci wyeksportowanych z tego kreatora).'];
  }

  const bledy = [];
  if (dane.wersjaEksportu !== WERSJA_EKSPORTU) {
    bledy.push(`Nieobsługiwana wersja pliku (${dane.wersjaEksportu ?? 'brak'}) - ten kreator obsługuje wersję ${WERSJA_EKSPORTU}.`);
  }

  const w = dane.wybory;
  if (!w || typeof w !== 'object' || Array.isArray(w)) {
    bledy.push('Plik nie zawiera wymaganej sekcji "wybory".');
    return bledy;
  }

  if (!w.pochodzenie || typeof w.pochodzenie !== 'string') {
    bledy.push('Brak pochodzenia postaci w pliku.');
  } else if (!dostepnePochodzenia.some(p => p.id === w.pochodzenie)) {
    bledy.push(`Nieznane pochodzenie: "${w.pochodzenie}" nie istnieje w aktualnej bazie danych.`);
  }

  if (typeof w.poziom !== 'number' || !Number.isInteger(w.poziom) || w.poziom < 0 || w.poziom > 10) {
    bledy.push(`Nieprawidłowy poziom postaci: "${w.poziom}" (oczekiwano liczby całkowitej 0-10).`);
  }

  const NAZWY_ATRYBUTOW = ['sila', 'zrecznosc', 'intelekt', 'wola'];
  if (w.atrybutyGlowne && typeof w.atrybutyGlowne === 'object') {
    ['zmniejszony', 'zwiekszony'].forEach(pole => {
      const wartosc = w.atrybutyGlowne[pole];
      if (wartosc && !NAZWY_ATRYBUTOW.includes(wartosc)) {
        bledy.push(`Nieznany atrybut w polu "atrybutyGlowne.${pole}": "${wartosc}".`);
      }
    });
  }
  if (Array.isArray(w.bonusoweAtrybutyPochodzenia)) {
    w.bonusoweAtrybutyPochodzenia.forEach(atr => {
      if (atr && !NAZWY_ATRYBUTOW.includes(atr)) {
        bledy.push(`Nieznany bonusowy atrybut pochodzenia: "${atr}".`);
      }
    });
  }

  if (w.sciezki && typeof w.sciezki === 'object') {
    const grupy = { nowicjusz: 1, ekspert: 3, mistrz: 7 };
    Object.entries(grupy).forEach(([klucz, poziomWyboru]) => {
      const sciezkaId = w.sciezki[klucz];
      if (!sciezkaId) return;
      if (!getPathsForLevel(poziomWyboru).some(p => p.id === sciezkaId)) {
        bledy.push(`Nieznana ścieżka (${klucz}): "${sciezkaId}" nie istnieje w aktualnej bazie danych.`);
      }
    });
  }

  if (w.atrybutySloty && typeof w.atrybutySloty === 'object') {
    Object.entries(w.atrybutySloty).forEach(([slotId, wartosci]) => {
      if (!Array.isArray(wartosci)) {
        bledy.push(`Nieprawidłowa struktura slotu atrybutów "${slotId}" (oczekiwano tablicy).`);
        return;
      }
      wartosci.forEach(atr => {
        if (!NAZWY_ATRYBUTOW.includes(atr)) {
          bledy.push(`Nieznany atrybut "${atr}" w slocie zwiększenia "${slotId}".`);
        }
      });
    });
  }

  if (w.profesjeJezykiSloty && typeof w.profesjeJezykiSloty === 'object') {
    Object.entries(w.profesjeJezykiSloty).forEach(([slotId, odp]) => {
      if (!odp || typeof odp !== 'object') return;
      if (odp.mode === 'profesja' && odp.profesjaId && !dostepneProfesje.some(p => p.id === odp.profesjaId)) {
        bledy.push(`Nieznana profesja: "${odp.profesjaId}" (slot "${slotId}") nie istnieje w aktualnej bazie danych.`);
      } else if ((odp.mode === 'jezyk_nowy' || odp.mode === 'jezyk_pismo') && odp.jezyk && !JEZYKI[odp.jezyk]) {
        bledy.push(`Nieznany język: "${odp.jezyk}" (slot "${slotId}") nie istnieje w aktualnej bazie danych.`);
      }
    });
  }

  if (Array.isArray(w.kurioza)) {
    w.kurioza.forEach(id => {
      if (!dostepneKurioza.some(c => c.id === id)) {
        bledy.push(`Nieznane kurioza: "${id}" nie istnieje w aktualnej bazie danych.`);
      }
    });
  }

  if (w.magia && w.magia.wybory && typeof w.magia.wybory === 'object') {
    Object.entries(w.magia.wybory).forEach(([atomId, wybor]) => {
      if (!wybor || typeof wybor !== 'object') return;
      if (wybor.tradycjaId && !TRADYCJE[wybor.tradycjaId]) {
        bledy.push(`Nieznana tradycja magiczna: "${wybor.tradycjaId}" (wybór "${atomId}") nie istnieje w aktualnej bazie danych.`);
      }
      ['spellId', 'darmowyZaklecieId'].forEach(pole => {
        const spellId = wybor[pole];
        if (spellId && !SPELLS.some(s => s.id === spellId)) {
          bledy.push(`Nieznane zaklęcie: "${spellId}" (wybór "${atomId}") nie istnieje w aktualnej bazie danych.`);
        }
      });
    });
  }

  if (w.srebrniki !== null && w.srebrniki !== undefined && typeof w.srebrniki !== 'number') {
    bledy.push(`Nieprawidłowa wartość srebrników: "${w.srebrniki}" (oczekiwano liczby albo null).`);
  }

  if (w.ekwipunek && typeof w.ekwipunek === 'object') {
    const ek = w.ekwipunek;
    if (ek.zamoznoscId && !ZAMOZNOSC[ek.zamoznoscId]) {
      bledy.push(`Nieznany poziom zamożności: "${ek.zamoznoscId}" nie istnieje w aktualnej bazie danych.`);
    }
    if (ek.wybory && typeof ek.wybory === 'object') {
      Object.entries(ek.wybory).forEach(([atomId, wybor]) => {
        if (!wybor || typeof wybor !== 'object') return;
        if (wybor.itemId && !pobierzPrzedmiot(wybor.itemId)) {
          bledy.push(`Nieznany przedmiot ekwipunku: "${wybor.itemId}" (wybór "${atomId}") nie istnieje w aktualnej bazie danych.`);
        }
        if (wybor.typ === 'zwoj_zaklecie') {
          if (wybor.tradycjaId && !TRADYCJE[wybor.tradycjaId]) {
            bledy.push(`Nieznana tradycja magiczna: "${wybor.tradycjaId}" (zwój, wybór "${atomId}") nie istnieje w aktualnej bazie danych.`);
          }
          if (wybor.spellId && !SPELLS.some(s => s.id === wybor.spellId)) {
            bledy.push(`Nieznane zaklęcie: "${wybor.spellId}" (zwój, wybór "${atomId}") nie istnieje w aktualnej bazie danych.`);
          }
        }
      });
    }
    if (Array.isArray(ek.zakupione)) {
      ek.zakupione.forEach(z => {
        if (z && z.itemId && !pobierzPrzedmiot(z.itemId)) {
          bledy.push(`Nieznany przedmiot ekwipunku: "${z.itemId}" (zakupiony) nie istnieje w aktualnej bazie danych.`);
        }
      });
    }
  }

  return bledy;
}

/**
 * Odtwarza w widocznym kafelku pochodzenia (Krok 1) zapisane wyniki tabel
 * losowych, dokładnie w tym samym formacie, w jakim wyświetla je losowanie
 * na żywo (zob. losujZTabeliUI()/zastosujWybranaOpcje()) - używane po
 * imporcie, żeby kafelek pokazywał te same wyniki co zapisany stan.
 */
function przywrocWynikiTabelDoDom(originId) {
  const wyniki = wynikiTabel[originId] || {};
  Object.entries(wyniki).forEach(([tableName, wynik]) => {
    const resultDiv = document.getElementById(`roll-result-${originId}-${tableName}`);
    if (!resultDiv) return;
    const etykietaTypu = wynik.typ === 'wybór' ? '🎯 Wybór' : '🎲 Rzut';
    const efekt = wynik.efekt ? `<br><strong>Efekt mechaniczny:</strong> ${wynik.efekt}` : '';
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
      <div class="roll-result-content">
        <div class="roll-dice">${etykietaTypu}: ${wynik.rzut}</div>
        <div class="roll-outcome">${wynik.wynik}</div>
        ${efekt}
      </div>
    `;
  });
}

/**
 * Odtwarza w kreatorze WSZYSTKIE wybory z zaimportowanego, już zwalidowanego
 * pliku (zob. zbudujDaneEksportu()) - dla każdego kroku wywołuje dokładnie
 * te same funkcje i interakcje (kliknięcia, zdarzenia change), które
 * wykonałby użytkownik ręcznie, dzięki czemu korzysta z tej samej logiki
 * co normalny przepływ kreatora zamiast duplikować ją osobno.
 */
async function zaimportujPostac(dane) {
  const w = dane.wybory;

  // 1. Pochodzenie
  wybierzPochodzenie(w.pochodzenie, { autoScroll: false });

  // 2. Wyniki tabel pochodzenia (wybierzPochodzenie zeruje wynikiTabel - nadpisz PO)
  wynikiTabel[w.pochodzenie] = JSON.parse(JSON.stringify(w.wynikiTabelPochodzenia || {}));
  przywrocWynikiTabelDoDom(w.pochodzenie);

  // 3. Bonusowe atrybuty pochodzenia (np. Elf: 2 wybory)
  const bonusSelects = document.querySelectorAll('.origin-attr-choice-select');
  (w.bonusoweAtrybutyPochodzenia || []).forEach((wartosc, i) => {
    if (bonusSelects[i] && wartosc) {
      bonusSelects[i].value = wartosc;
      bonusSelects[i].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // 4. Poziom - ta sama sekwencja co listener zmiany radiobuttona (Krok 2)
  wybranyPoziom = w.poziom;
  const poziomInput = document.querySelector(`input[name="poziom"][value="${w.poziom}"]`);
  if (poziomInput) poziomInput.checked = true;
  aktualizujWidocznoscSciezek(wybranyPoziom);
  await aktualizujSciezkiPoziomu(wybranyPoziom);
  aktualizujTytulSekcjiSciezek(wybranyPoziom);
  aktualizujWealthSection(wybranyPoziom);
  aktualizujOriginBenefits(wybranyPoziom);
  renderPathSectionsVisibility();
  await renderPathSection(1);
  await renderPathSection(3);
  await renderPathSection(7);
  await zaladujKorzysciPoziomu(wybranyPoziom);

  // 5. Wybrana opcja korzyści z pochodzenia na poziomie 4 (np. "1 zaklęcie")
  if (w.opcjaPoziom4) {
    const radio = Array.from(document.querySelectorAll(`input[name="origin-option-${w.pochodzenie}"]`))
      .find(r => r.value === w.opcjaPoziom4);
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  // 6. Atrybuty główne: domyślne albo jednorazowa zamiana -1/+1 (Krok 2)
  const chkDomyslne = document.getElementById('domyslne-atrybuty');
  chkDomyslne.checked = w.atrybutyGlowne?.domyslne ?? true;
  const customDiv = document.getElementById('custom-attributes');
  if (customDiv) customDiv.style.display = chkDomyslne.checked ? 'none' : 'block';
  if (!chkDomyslne.checked) {
    document.getElementById('atrybut-zmniejszony').value = w.atrybutyGlowne?.zmniejszony || '';
    document.getElementById('atrybut-zwiekszony').value = w.atrybutyGlowne?.zwiekszony || '';
  }
  aktualizujObliczoneAtrybuty();

  // 7. Ścieżki (Krok 3) - kliknij przyciski wyboru tak, jak zrobiłby użytkownik
  [[1, w.sciezki?.nowicjusz], [3, w.sciezki?.ekspert], [7, w.sciezki?.mistrz]].forEach(([poziomWyboru, sciezkaId]) => {
    if (!sciezkaId) return;
    document.querySelector(`button[data-path-id="${sciezkaId}"][data-pick-level="${poziomWyboru}"]`)?.click();
  });

  // 8. Sloty zwiększenia atrybutów (Krok 4)
  wybraneAtrybutySlotow = JSON.parse(JSON.stringify(w.atrybutySloty || {}));
  renderAtrybutySlotySection();

  // 9. Profesje i języki (Krok 5)
  odpowiedziSlotow = JSON.parse(JSON.stringify(w.profesjeJezykiSloty || {}));
  renderProfessionsSection();

  // 10. Kurioza (Krok 5)
  wybraneKurioza = [...(w.kurioza || [])];
  renderCuriosSection();
  updateStep5NextButton();

  // 11. Srebrniki (Krok 5) - tylko suma jest zapisywana, pojedyncze rzuty są ulotne
  wylosowaneSrebrniki = (typeof w.srebrniki === 'number') ? w.srebrniki : null;
  const wealthSpan = document.getElementById('wealth-summary');
  if (wealthSpan && wylosowaneSrebrniki != null) {
    wealthSpan.textContent = `Srebrniki: ${wylosowaneSrebrniki} (zaimportowano)`;
  }

  // 12. Magia: tradycje i zaklęcia (Krok 6)
  magiaWybory = JSON.parse(JSON.stringify(w.magia?.wybory || {}));
  magiaRyzykoWyniki = JSON.parse(JSON.stringify(w.magia?.ryzykoWyniki || {}));
  renderSpellsSection();

  // 13. Ekwipunek: zamożność, startowe wyposażenie i sklep (Krok 7)
  ekwipunekZamoznoscId = w.ekwipunek?.zamoznoscId || null;
  ekwipunekZamoznoscWynik = (typeof w.ekwipunek?.zamoznoscWynik === 'number') ? w.ekwipunek.zamoznoscWynik : null;
  ekwipunekGotowkaPoczatkowaWynik = (typeof w.ekwipunek?.gotowkaPoczatkowaWynik === 'number') ? w.ekwipunek.gotowkaPoczatkowaWynik : null;
  ekwipunekWybory = JSON.parse(JSON.stringify(w.ekwipunek?.wybory || {}));
  ekwipunekSprzedane = [...(w.ekwipunek?.sprzedane || [])];
  ekwipunekZakupione = JSON.parse(JSON.stringify(w.ekwipunek?.zakupione || []));
  renderEkwipunekSection();

  aktualizujPodgladPostaci();
}

/**
 * Obsługuje wybrany plik importu: odczytuje go, parsuje jako JSON, waliduje
 * (zob. walidujDaneImportu()) i - jeśli poprawny - odtwarza całą postać
 * w kreatorze (zob. zaimportujPostac()). Pokazuje czytelne komunikaty
 * błędów w Kroku 1, gdy plik jest uszkodzony, ma złą strukturę albo
 * odwołuje się do pochodzeń/ścieżek/profesji/kuriozów/tradycji/zaklęć,
 * które nie istnieją w aktualnej bazie danych aplikacji.
 */
function obslozImportPliku(plik) {
  const reader = new FileReader();
  reader.onload = async (e) => {
    let dane;
    try {
      dane = JSON.parse(e.target.result);
    } catch (err) {
      pokazKomunikatImportu('error', 'Nie udało się odczytać pliku - to nie jest poprawny plik JSON.');
      return;
    }

    const bledy = walidujDaneImportu(dane);
    if (bledy.length > 0) {
      pokazKomunikatImportu('error', 'Nie udało się zaimportować postaci - plik zawiera błędy:', bledy);
      return;
    }

    try {
      await zaimportujPostac(dane);
      pokazKomunikatImportu('success', '✓ Postać została pomyślnie zaimportowana. Przejdź przez kolejne kroki (albo od razu do Kroku 8 z górnego menu), by zweryfikować wynik.');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Błąd importu postaci:', err);
      pokazKomunikatImportu('error', `Wystąpił nieoczekiwany błąd podczas importu: ${err.message}`);
    }
  };
  reader.onerror = () => {
    pokazKomunikatImportu('error', 'Nie udało się odczytać wybranego pliku.');
  };
  reader.readAsText(plik);
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

  const pismo = new Set(pobierzJezykiZPismem());
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

/**
 * Znane języki (mówione) wraz ze źródłem każdego z nich: bazowe z
 * pochodzenia + wyuczone w slotach jezyk_nowy.
 * @returns {Array<{jezyk: string, source: string}>}
 */
function pobierzJezykiZeSzczegolami() {
  const pochodzenie = dostepnePochodzenia.find(p => p.id === wybranePochodzenie);
  const wynik = [];
  if (pochodzenie) {
    pochodzenie.jezyki.forEach(j => wynik.push({ jezyk: j, source: `Pochodzenie: ${pochodzenie.nazwa}` }));
  }
  const { sloty } = obliczSlotyPostaci();
  sloty.forEach(slot => {
    const odp = odpowiedziSlotow[slot.id];
    if (odp && odp.mode === 'jezyk_nowy' && odp.jezyk && !wynik.some(w => w.jezyk === odp.jezyk)) {
      wynik.push({ jezyk: odp.jezyk, source: slot.source });
    }
  });
  return wynik;
}

/** Znane języki (mówione), bez informacji o źródle - patrz pobierzJezykiZeSzczegolami(). */
function pobierzMowioneJezyki() {
  return pobierzJezykiZeSzczegolami().map(w => w.jezyk);
}

/**
 * Języki, w których postać umie czytać/pisać, wraz ze źródłem: automatyczne
 * (Magik - wszystkie znane; niektóre pochodzenia - konkretny język, patrz
 * origins.js) lub wybrane wprost w slocie typu jezyk_pismo.
 * @returns {Array<{jezyk: string, source: string}>}
 */
function pobierzPismoZeSzczegolami() {
  const { autoPismoWszystkieZnane, autoPismoWszystkieZnaneSource, autoPismoZPochodzenia, autoPismoZPochodzeniaSource, sloty } = obliczSlotyPostaci();

  if (autoPismoWszystkieZnane) {
    return pobierzJezykiZeSzczegolami().map(w => ({ jezyk: w.jezyk, source: autoPismoWszystkieZnaneSource }));
  }

  const wynik = autoPismoZPochodzenia.map(j => ({ jezyk: j, source: autoPismoZPochodzeniaSource }));
  sloty.forEach(slot => {
    const odp = odpowiedziSlotow[slot.id];
    if (odp && odp.mode === 'jezyk_pismo' && odp.jezyk && !wynik.some(w => w.jezyk === odp.jezyk)) {
      wynik.push({ jezyk: odp.jezyk, source: slot.source });
    }
  });
  return wynik;
}

/** Języki z pismem, bez informacji o źródle - patrz pobierzPismoZeSzczegolami(). */
function pobierzJezykiZPismem() {
  return pobierzPismoZeSzczegolami().map(w => w.jezyk);
}

/**
 * Renderuje kartę jednego slotu profesyjno-językowego (wybór trybu + odpowiedni picker).
 */
function renderSlotCard(slot) {
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
    const juzPismo = new Set(pobierzJezykiZPismem());
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
      <div class="slot-source">
        ${slot.source}
        <button type="button" class="section-reset-btn" data-reset-jp-slot="${slot.id}" title="Wyczyść wybór dla tego slotu">Wyczyść</button>
      </div>
      ${slot.opis ? `<div class="slot-opis">${slot.opis}</div>` : ''}
      ${trybyHtml}
      ${pickerHtml}
    </div>
  `;
}

/**
 * Renderuje sekcję profesji (sloty) i sekcję znanych języków w Kroku 5.
 */
function renderProfessionsSection() {
  const container = document.getElementById('professions-slots');
  if (!container) return;

  const { sloty } = obliczSlotyPostaci();

  container.innerHTML = sloty.map(slot => renderSlotCard(slot)).join('');

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
  container.querySelectorAll('[data-reset-jp-slot]').forEach(btn => {
    btn.addEventListener('click', () => {
      delete odpowiedziSlotow[btn.dataset.resetJpSlot];
      renderProfessionsSection();
    });
  });

  synchronizujWybraneProfesje();
  updateSelectedProfessions();
  renderLanguagesSummary();
  updateStep5NextButton();
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

/** Pełne nazwy podręczników odpowiadające skrótom używanym w polu `zrodlo`. */
const PELNE_NAZWY_ZRODEL = {
  PG: 'Podręcznik Główny',
  SUP: 'Suplement Władcy Demonów',
  NW: 'Niepewna Wiara',
  RA: 'Rozkoszna Agonia',
  SP: 'Straszliwe Piękno',
  GP: 'Głód w Pustce',
  GWP: 'Grobowce Pustkowia',
  CS: 'Chwalebna Śmierć'
};

/**
 * Renderuje podsumowanie znanych języków (mówionych i z pismem) w Kroku 5.
 */
/**
 * Renderuje małą, czerwoną etykietę ze źródłem danego wyboru (np.
 * "Pochodzenie: Człowiek" albo "Ścieżka: Łotr (poziom 1)"). Etykieta ma
 * atrybut title z pełną nazwą podręcznika, widoczny jako tooltip po
 * najechaniu wskaźnikiem myszy.
 */
function renderujZnacznikZrodla(source) {
  if (!source) return '';
  const pelnaNazwa = PELNE_NAZWY_ZRODEL[source] || source;
  return `<span class="source-tag" title="${pelnaNazwa}">(${source})</span>`;
}

function renderLanguagesSummary() {
  const summary = document.getElementById('languages-known-summary');
  const list = document.getElementById('language-slots');
  if (!summary || !list) return;

  const { autoPismoWszystkieZnane, autoPismoWszystkieZnaneSource } = obliczSlotyPostaci();
  const mowioneSzczegoly = pobierzJezykiZeSzczegolami();
  const pismoWedlugJezyka = new Map(pobierzPismoZeSzczegolami().map(w => [w.jezyk, w.source]));

  summary.innerHTML = mowioneSzczegoly.length
    ? `Znane języki: <strong>${mowioneSzczegoly.map(w => JEZYKI[w.jezyk] || w.jezyk).join(', ')}</strong>`
    : 'Brak wybranego pochodzenia.';

  list.innerHTML = mowioneSzczegoly.map(({ jezyk, source }) => {
    const pismoSource = pismoWedlugJezyka.get(jezyk);
    return `
      <div class="language-chip">
        <div class="language-chip-row">
          <span class="language-name">${JEZYKI[jezyk] || jezyk}</span>
          ${renderujZnacznikZrodla(source)}
        </div>
        <div class="language-chip-row">
          <span class="language-flags">mówiony${pismoSource ? ' • pismo' : ''}</span>
          ${pismoSource ? renderujZnacznikZrodla(pismoSource) : ''}
        </div>
      </div>
    `;
  }).join('') + (autoPismoWszystkieZnane ? `<p class="hint">Magik automatycznie czyta i pisze we wszystkich znanych sobie językach ${renderujZnacznikZrodla(autoPismoWszystkieZnaneSource)}.</p>` : '');
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

  const { sloty } = obliczSlotyPostaci();

  listDiv.innerHTML = sloty.map(slot => {
    const odp = odpowiedziSlotow[slot.id];
    if (!odp || odp.mode !== 'profesja' || !odp.profesjaId) return '';
    const prof = dostepneProfesje.find(p => p.id === odp.profesjaId);
    if (!prof) return '';
    return `
      <div class="selected-item">
        <button class="remove-btn" data-remove-profession-id="${prof.id}">×</button>
        <span>${prof.nazwa}</span>
        ${renderujZnacznikZrodla(slot.source)}
      </div>
    `;
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
  updateStep5NextButton();
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
    updateStep5NextButton();
  }
}

/**
 * Sprawdza, czy dany slot profesyjno-językowy ma kompletną odpowiedź.
 */
function slotOdpowiedzKompletna(slot) {
  const odp = odpowiedziSlotow[slot.id];
  // Gdy slot ma tylko jedną dozwoloną opcję (np. 'tylko_profesja'), UI nie
  // renderuje przełącznika trybu (radiogroup) - tryb trzeba więc wywnioskować
  // tak samo, jak robi to renderSlotCard(), inaczej odpowiedź nigdy nie
  // zostanie uznana za kompletną, mimo wybranej wartości w widocznym select.
  const mode = odp?.mode || (slot.opcje.length === 1 ? slot.opcje[0] : null);
  if (!mode) return false;
  return mode === 'profesja' ? !!odp?.profesjaId : !!odp?.jezyk;
}

/**
 * Zwraca dostępne wartości dla danego trybu ('profesja'/'jezyk_nowy'/
 * 'jezyk_pismo') w kontekście danego slotu.
 */
function opcjeWartosciDlaTrybu(slot, mode) {
  if (mode === 'profesja') {
    return profesjeDlaSlotu(slot).map(p => p.id);
  }
  if (mode === 'jezyk_nowy') {
    const znane = new Set(pobierzMowioneJezyki());
    return Object.keys(JEZYKI).filter(k => !znane.has(k));
  }
  if (mode === 'jezyk_pismo') {
    const juzPismo = new Set(pobierzJezykiZPismem());
    return pobierzMowioneJezyki().filter(k => !juzPismo.has(k));
  }
  return [];
}

/**
 * Zwraca kopię tablicy w losowej, jednorodnej kolejności (Fisher-Yates).
 * `array.sort(() => Math.random() - 0.5)` NIE daje jednorodnego rozkładu -
 * w większości silników JS faworyzuje pierwszy element, co w praktyce
 * sprawiało, że losowanie "zawsze" wybierało tryb 'profesja' (bo jest
 * pierwszy w liście `opcje`).
 */
function losowaKolejnosc(array) {
  const wynik = [...array];
  for (let i = wynik.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wynik[i], wynik[j]] = [wynik[j], wynik[i]];
  }
  return wynik;
}

/**
 * Losuje odpowiedzi (profesja/język) dla wszystkich nierozdanych jeszcze
 * slotów. Jeśli użytkownik już wybrał tryb danego slotu (np. "Nowy język"),
 * losowanie respektuje ten wybór i dobiera tylko wartość w jego ramach -
 * nie zmienia trybu na inny. Tryb losuje się jednorodnie tylko dla slotów,
 * których użytkownik jeszcze w żaden sposób nie dotknął.
 */
function losujProfesjeCentralnie() {
  const { sloty } = obliczSlotyPostaci();

  for (const slot of sloty) {
    if (slotOdpowiedzKompletna(slot)) continue;

    const wybranyTryb = odpowiedziSlotow[slot.id]?.mode;
    const tryby = wybranyTryb ? [wybranyTryb] : losowaKolejnosc(slot.opcje);

    for (const mode of tryby) {
      const opcje = opcjeWartosciDlaTrybu(slot, mode);
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
  updateStep5NextButton();
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
  updateStep5NextButton();
}

/**
 * Aktualizuje przycisk "Dalej" w Kroku 5
 */
function updateStep5NextButton() {
  const btn = document.getElementById('btn-next-5');
  if (!btn) return;

  const { kurioza } = obliczIloscWyborow();
  const { sloty } = obliczSlotyPostaci();
  const hasRequiredProfessions = sloty.every(slot => slotOdpowiedzKompletna(slot));
  const hasRequiredCurios = wybraneKurioza.length >= kurioza;

  btn.disabled = !(hasRequiredProfessions && hasRequiredCurios);
}

/**
 * Zwraca wybraną opcję radiową sekcji "Korzyści z Pochodzenia" (poziom 4),
 * jeśli już wybrana - potrzebne do ustalenia, czy pochodzenie przyznaje
 * dodatkowy atomowy wybór zaklęcia na tym poziomie ("1 zaklęcie").
 */
function pobierzWybranaOpcjaPoziom4Aktualna() {
  if (!wybranePochodzenie) return null;
  return document.querySelector(`input[name="origin-option-${wybranePochodzenie}"]:checked`)?.value || null;
}

/**
 * Oblicza aktualne atomowe wybory magii (jeden atom = jedna karta w Kroku
 * 4.5) na podstawie pochodzenia, wybranych ścieżek i poziomu postaci.
 */
function pobierzAktualneAtomyMagii() {
  if (!wybranePochodzenie) return [];
  const pochodzenie = dostepnePochodzenia.find(p => p.id === wybranePochodzenie);
  if (!pochodzenie) return [];
  return obliczSlotyMagii({
    pochodzenie,
    wybranaOpcjaPoziom4: pobierzWybranaOpcjaPoziom4Aktualna(),
    sciezkaNowicjuszaId: wybraneSciezki.nowicjusz || null,
    sciezkaEksperckaId: wybraneSciezki.ekspert || null,
    sciezkaMistrzowskaId: wybraneSciezki.mistrz || null,
    wybranyPoziom
  });
}

/** Odczytuje aktualną Moc postaci - limit kręgu zaklęć dostępnych do nauki. */
function pobierzAktualnaMoc() {
  return parseInt(document.getElementById('moc-final')?.textContent, 10) || 0;
}

/**
 * Renderuje Krok 6: jedną kartę na każdy atomowy wybór magii faktycznie
 * przyznany przez pochodzenie/ścieżki na obecnym poziomie postaci (zamiast
 * swobodnie przeglądanej biblioteki) - w pełni zgodne z zasadami nauki
 * tradycji i zaklęć z podręcznika (zob. logic/magia.js).
 */
function renderSpellsSection() {
  const atomy = pobierzAktualneAtomyMagii();
  const container = document.getElementById('magic-slots-container');
  const hint = document.getElementById('known-traditions-hint');
  if (!container) return;

  if (atomy.length === 0) {
    container.innerHTML = '<p class="hint">Żadna z dotychczas wybranych ścieżek (ani pochodzenie) nie przyznaje magii na obecnym poziomie postaci - ten krok jest w pełni opcjonalny.</p>';
    if (hint) hint.innerHTML = '';
    return;
  }

  const { rozwiazania, znaneTradycje } = obliczRozwiazanieMagii(atomy, magiaWybory);
  przeliczCzarnaMagieZTradycji(rozwiazania);

  if (hint) {
    const nazwy = [...znaneTradycje].map(id => TRADYCJE[id]?.nazwa || id).sort((a, b) => a.localeCompare(b, 'pl'));
    hint.innerHTML = nazwy.length
      ? `<strong>Znane tradycje:</strong> ${nazwy.join(', ')}`
      : 'Jeszcze nie poznano żadnej tradycji.';
  }

  container.innerHTML = rozwiazania.map(r => renderujKarteMagii(r)).join('');
  podlaczObslugeKartMagii(container);
  odswiezAtrybutyDrugorzedne();
}

/**
 * Przelicza (od zera, na podstawie aktualnych rozwiązań) zbiór tradycji
 * czarnej magii już poznanych - za każdą przysługuje jednorazowo 1 punkt
 * Splugawienia. Liczone od zera przy każdym renderze, żeby wycofanie
 * wcześniejszego wyboru poprawnie usunęło też przyznane Splugawienie.
 */
function przeliczCzarnaMagieZTradycji(rozwiazania) {
  const nowy = new Set();
  rozwiazania.forEach(r => {
    if (r.mode === 'tradycja' && r.tradycjaId && czyCzarnaMagia(r.tradycjaId)) nowy.add(r.tradycjaId);
  });
  magiaCzarnaMagiaZaTradycje = nowy;
}

/**
 * Suma Splugawienia przyznanego przez magię: 1 punkt za każdą poznaną
 * tradycję czarnej magii, plus 1 punkt za każdy rzut ryzyka, który się
 * powiódł (nauka kolejnego zaklęcia czarnej magii z już znanej tradycji).
 */
function obliczSplugawienieZMagiiAktualnej() {
  const zTradycji = magiaCzarnaMagiaZaTradycje.size;
  const zRyzyka = Object.values(magiaRyzykoWyniki).filter(w => w.przyznane).length;
  return zTradycji + zRyzyka;
}

/** Renderuje pojedynczą kartę jednego atomowego wyboru magii. */
function renderujKarteMagii(rozwiazanie) {
  const { atom, mode, tradycjaId, spellId, darmowyZaklecieId, kompletny, czarnaMagiaRyzyko } = rozwiazanie;
  const jestCzarnaTradycja = mode === 'tradycja' && czyCzarnaMagia(tradycjaId);
  const klasy = ['magic-slot-card'];
  if (kompletny) klasy.push('complete');
  if (jestCzarnaTradycja || czarnaMagiaRyzyko) klasy.push('black-magic');

  let bodyHtml = '';
  if (atom.rodzaj === 'wymuszona_tradycja') {
    bodyHtml = renderujWyborTradycji(atom.id, atom.kategoria, tradycjaId);
    if (tradycjaId) bodyHtml += renderujWyborDarmowegoZaklecia(atom.id, tradycjaId, darmowyZaklecieId);
  } else if (atom.rodzaj === 'wybor_fixed') {
    const nazwaTr = TRADYCJE[atom.tradycjaNazwa]?.nazwa || atom.tradycjaNazwa;
    if (mode === 'tradycja') {
      bodyHtml = `<p class="magic-slot-status ok">Tradycja ${nazwaTr} nie jest jeszcze znana - zostanie automatycznie poznana.</p>`;
      bodyHtml += renderujWyborDarmowegoZaklecia(atom.id, atom.tradycjaNazwa, darmowyZaklecieId);
    } else {
      bodyHtml = renderujWyborZaklecia(atom.id, spellId, atom.tradycjaNazwa);
    }
  } else if (atom.rodzaj === 'wybor') {
    bodyHtml = `
      <div class="magic-slot-mode-toggle">
        <button type="button" class="btn-secondary small ${mode === 'tradycja' ? 'active' : ''}" data-magia-mode="${atom.id}" data-mode-value="tradycja">Nowa tradycja</button>
        <button type="button" class="btn-secondary small ${mode === 'zaklecie' ? 'active' : ''}" data-magia-mode="${atom.id}" data-mode-value="zaklecie">Zaklęcie</button>
      </div>
    `;
    if (mode === 'tradycja') {
      bodyHtml += renderujWyborTradycji(atom.id, atom.kategoria, tradycjaId);
      if (tradycjaId) bodyHtml += renderujWyborDarmowegoZaklecia(atom.id, tradycjaId, darmowyZaklecieId);
    } else if (mode === 'zaklecie') {
      bodyHtml += renderujWyborZaklecia(atom.id, spellId);
    }
  } else if (atom.rodzaj === 'zaklecie_tylko') {
    bodyHtml = renderujWyborZaklecia(atom.id, spellId);
  }

  return `
    <div class="${klasy.join(' ')}" data-magic-slot="${atom.id}">
      <p class="magic-slot-source">${atom.source}</p>
      <p class="magic-slot-desc">${opisAtomu(atom)}</p>
      ${bodyHtml}
      ${renderujOstrzezenieCzarnejMagii(rozwiazanie)}
      <p class="magic-slot-status ${kompletny ? 'ok' : ''}">${kompletny ? '✓ Rozwiązano' : 'Nierozwiązane (opcjonalne)'}</p>
    </div>
  `;
}

/**
 * Renderuje przycisk otwarcia popupu wyboru nowej tradycji dla danego
 * atomu wraz z kafelkiem aktualnego wyboru (jeśli już dokonano) - bez
 * dropdownów, wybór odbywa się w popupie na kafelkach (zob. otworzTradycjaPicker()).
 */
function renderujWyborTradycji(atomId, kategoria, aktualnyWybor) {
  const nazwa = aktualnyWybor ? (TRADYCJE[aktualnyWybor]?.nazwa || aktualnyWybor) : null;
  const czarna = aktualnyWybor && czyCzarnaMagia(aktualnyWybor);
  return `
    <div class="magic-slot-picker">
      ${nazwa ? `
        <div class="magic-picked-chip">${nazwa}${czarna ? ' ⚠️' : ''}
          <button type="button" class="chip-remove" data-magia-clear="${atomId}" data-clear-field="tradycjaId" title="Usuń wybór">✕</button>
        </div>
      ` : ''}
      <button type="button" class="btn-secondary small" data-open-tradycja-picker="${atomId}" data-kategoria="${(kategoria || ['dowolna']).join(',')}">${nazwa ? 'Zmień tradycję' : 'Wybierz tradycję'}</button>
    </div>
  `;
}

/**
 * Renderuje przycisk otwarcia popupu wyboru zaklęcia do nauki dla danego
 * atomu wraz z kafelkiem aktualnego wyboru (jeśli już dokonano) - bez
 * dropdownów, wybór odbywa się w popupie na kafelkach (zob. otworzZakleciePicker()).
 * Popup sam ograniczy listę do tradycji już znanych (albo `tradycjaOgraniczenie`,
 * dla wybor_fixed) i kręgu nie wyższego niż Moc postaci.
 */
function renderujWyborZaklecia(atomId, aktualnyWybor, tradycjaOgraniczenie = null) {
  const spell = aktualnyWybor ? SPELLS.find(s => s.id === aktualnyWybor) : null;
  return `
    <div class="magic-slot-picker">
      ${spell ? `
        <div class="magic-picked-chip">${spell.nazwa} (${spell.tradycjaNazwa}, krąg ${spell.krag})${czyCzarnaMagia(spell.tradycja) ? ' ⚠️' : ''}
          <button type="button" class="chip-remove" data-magia-clear="${atomId}" data-clear-field="spellId" title="Usuń wybór">✕</button>
        </div>
      ` : ''}
      <button type="button" class="btn-secondary small" data-open-zaklecie-picker="${atomId}" data-tradycja-ograniczenie="${tradycjaOgraniczenie || ''}">${spell ? 'Zmień zaklęcie' : 'Wybierz zaklęcie'}</button>
    </div>
  `;
}

/**
 * Renderuje przycisk otwarcia popupu wyboru DARMOWEGO zaklęcia kręgu 0
 * przyznawanego automatycznie przy poznaniu nowej tradycji ("Poznawanie
 * tradycji", PG) wraz z kafelkiem aktualnego wyboru - analogicznie do
 * renderujWyborZaklecia(), ale ograniczone wyłącznie do kręgu 0 danej
 * tradycji (zob. otworzDarmoweZakleciePicker()).
 */
function renderujWyborDarmowegoZaklecia(atomId, tradycjaId, aktualnyWybor) {
  const spell = aktualnyWybor ? SPELLS.find(s => s.id === aktualnyWybor) : null;
  return `
    <div class="magic-slot-picker magic-slot-picker-secondary">
      ${spell ? `
        <div class="magic-picked-chip">${spell.nazwa} (krąg 0)
          <button type="button" class="chip-remove" data-magia-clear="${atomId}" data-clear-field="darmowyZaklecieId" title="Usuń wybór">✕</button>
        </div>
      ` : ''}
      <button type="button" class="btn-secondary small" data-open-darmowe-zaklecie-picker="${atomId}" data-tradycja-darmowa="${tradycjaId}">${spell ? 'Zmień darmowe zaklęcie' : 'Wybierz zaklęcie kręgu 0'}</button>
    </div>
  `;
}

/**
 * Renderuje ostrzeżenie/informację o czarnej magii dla danej karty: albo
 * informację o automatycznym Splugawieniu za poznanie tradycji, albo
 * widget rzutu ryzyka (k6) przy nauce kolejnego zaklęcia czarnej magii.
 */
function renderujOstrzezenieCzarnejMagii(rozwiazanie) {
  const { atom, mode, tradycjaId, spellId, czarnaMagiaRyzyko } = rozwiazanie;
  if (mode === 'tradycja' && tradycjaId && czyCzarnaMagia(tradycjaId)) {
    return `<div class="black-magic-warning">⚠️ ${TRADYCJE[tradycjaId]?.nazwa || tradycjaId} to tradycja czarnej magii - poznanie przyznaje automatycznie <strong>1 punkt Splugawienia</strong>.</div>`;
  }
  if (czarnaMagiaRyzyko) {
    const wynik = magiaRyzykoWyniki[atom.id];
    if (wynik && wynik.spellId === spellId) {
      return `<div class="black-magic-warning">⚠️ Zaklęcie czarnej magii. Rzut ryzyka: <span class="black-magic-roll-result">k6 = ${wynik.rzut}</span> ${wynik.przyznane ? '→ +1 Splugawienie' : '→ bez efektu'}.</div>`;
    }
    return `
      <div class="black-magic-warning">
        ⚠️ Zaklęcie czarnej magii - ryzyko Splugawienia (rzut k6 &lt; ${czarnaMagiaRyzyko.liczbaZnanychPrzed} już znanych zaklęć czarnej magii).
        <button type="button" class="btn-secondary small" data-magia-rzut="${atom.id}" data-rzut-spell="${spellId}" data-rzut-limit="${czarnaMagiaRyzyko.liczbaZnanychPrzed}">Rzuć k6</button>
      </div>
    `;
  }
  return '';
}

/** Podłącza obsługę zdarzeń dla wszystkich kart magii w kontenerze (delegacja przez ponowny render). */
function podlaczObslugeKartMagii(container) {
  container.querySelectorAll('[data-magia-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      const atomId = btn.dataset.magiaMode;
      const mode = btn.dataset.modeValue;
      if ((magiaWybory[atomId] || {}).mode === mode) return;
      magiaWybory[atomId] = { mode };
      delete magiaRyzykoWyniki[atomId];
      renderSpellsSection();
    });
  });
  container.querySelectorAll('[data-open-tradycja-picker]').forEach(btn => {
    btn.addEventListener('click', () => {
      const atomId = btn.dataset.openTradycjaPicker;
      const kategoria = btn.dataset.kategoria.split(',').filter(Boolean);
      const { znaneTradycje } = obliczRozwiazanieMagii(pobierzAktualneAtomyMagii(), magiaWybory);
      otworzTradycjaPicker(atomId, kategoria, znaneTradycje);
    });
  });
  container.querySelectorAll('[data-open-zaklecie-picker]').forEach(btn => {
    btn.addEventListener('click', () => {
      const atomId = btn.dataset.openZakleciePicker;
      const tradycjaOgraniczenie = btn.dataset.tradycjaOgraniczenie || null;
      const { znaneTradycje } = obliczRozwiazanieMagii(pobierzAktualneAtomyMagii(), magiaWybory);
      otworzZakleciePicker(atomId, znaneTradycje, pobierzAktualnaMoc(), tradycjaOgraniczenie);
    });
  });
  container.querySelectorAll('[data-open-darmowe-zaklecie-picker]').forEach(btn => {
    btn.addEventListener('click', () => {
      otworzDarmoweZakleciePicker(btn.dataset.openDarmoweZakleciePicker, btn.dataset.tradycjaDarmowa);
    });
  });
  container.querySelectorAll('[data-magia-clear]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const atomId = btn.dataset.magiaClear;
      const wybor = { ...(magiaWybory[atomId] || {}) };
      delete wybor[btn.dataset.clearField];
      magiaWybory[atomId] = wybor;
      delete magiaRyzykoWyniki[atomId];
      renderSpellsSection();
    });
  });
  container.querySelectorAll('[data-magia-rzut]').forEach(btn => {
    btn.addEventListener('click', () => {
      const atomId = btn.dataset.magiaRzut;
      const spellId = btn.dataset.rzutSpell;
      const limit = parseInt(btn.dataset.rzutLimit, 10);
      const rzut = Math.floor(Math.random() * 6) + 1;
      magiaRyzykoWyniki[atomId] = { spellId, rzut, przyznane: rzut < limit };
      renderSpellsSection();
    });
  });
}

/**
 * Stan aktualnie otwartego popupu wyboru magii (Krok 6) - `null` gdy
 * popup jest zamknięty. Patrz otworzTradycjaPicker()/otworzZakleciePicker().
 */
let magiaPicker = null;

/**
 * Otwiera popup wyboru nowej tradycji (kafelki, bez dropdownów) dla danego atomu.
 * `docelowy` ('magia' domyślnie, albo 'ekwipunek') decyduje, do którego stanu
 * trafi wynik wyboru - zob. wybierzTradycjaZPickera(). Ten sam popup obsługuje
 * więc zarówno poznawanie tradycji w Kroku 6, jak i "zwój z zaklęciem kręgu 0"
 * w Kroku Ekwipunek.
 */
function otworzTradycjaPicker(atomId, kategoria, znaneTradycje, docelowy = 'magia') {
  magiaPicker = { atomId, kind: 'tradycja', kategoria, znaneTradycje, search: '', docelowy };
  const title = document.getElementById('magic-picker-title');
  if (title) title.textContent = 'Wybierz tradycję';
  // Odkryj popup PRZED renderowaniem treści - fokus na polu wyszukiwania
  // (ustawiany w renderMagicPickerBody()) nie zadziała na elemencie, który
  // wciąż jest ukryty atrybutem [hidden].
  const overlay = document.getElementById('magic-picker-overlay');
  if (overlay) overlay.hidden = false;
  renderMagicPickerBody();
}

/** Otwiera popup wyboru zaklęcia do nauki (kafelki, bez dropdownów) dla danego atomu. */
function otworzZakleciePicker(atomId, znaneTradycje, moc, tradycjaOgraniczenie) {
  magiaPicker = {
    atomId, kind: 'zaklecie', znaneTradycje, moc, tradycjaOgraniczenie,
    search: '', filterKrag: null, filterKategoria: null, filterTradycja: null
  };
  const title = document.getElementById('magic-picker-title');
  if (title) title.textContent = 'Wybierz zaklęcie';
  const overlay = document.getElementById('magic-picker-overlay');
  if (overlay) overlay.hidden = false;
  renderMagicPickerBody();
}

/**
 * Otwiera popup wyboru DARMOWEGO zaklęcia kręgu 0 danej tradycji, przyznanego
 * automatycznie przy jej poznaniu ("Poznawanie tradycji", PG) - kafelki
 * ograniczone wyłącznie do kręgu 0 tej jednej, konkretnej tradycji.
 */
function otworzDarmoweZakleciePicker(atomId, tradycjaId, docelowy = 'magia') {
  magiaPicker = { atomId, kind: 'darmowe_zaklecie', tradycjaId, search: '', docelowy };
  const title = document.getElementById('magic-picker-title');
  if (title) title.textContent = 'Wybierz zaklęcie kręgu 0';
  const overlay = document.getElementById('magic-picker-overlay');
  if (overlay) overlay.hidden = false;
  renderMagicPickerBody();
}

/** Zamyka popup wyboru magii bez dokonywania wyboru. */
function zamknijMagicPicker() {
  const overlay = document.getElementById('magic-picker-overlay');
  if (overlay) overlay.hidden = true;
  magiaPicker = null;
}

/**
 * Renderuje zawartość popupu wyboru magii: pole wyszukiwania (statyczne,
 * nieprzerenderowywane przy każdym wpisanym znaku, by nie tracić fokusu)
 * i pod nim dynamiczny obszar z chipami filtrów i siatką kafelków.
 */
function renderMagicPickerBody() {
  const body = document.getElementById('magic-picker-body');
  if (!body || !magiaPicker) return;
  const placeholder = magiaPicker.kind === 'tradycja'
    ? 'Szukaj tradycji...'
    : (magiaPicker.kind === 'darmowe_zaklecie' ? 'Szukaj zaklęcia kręgu 0...' : 'Szukaj zaklęcia po nazwie lub opisie...');
  body.innerHTML = `
    <input type="text" class="picker-search" id="picker-search-input" placeholder="${placeholder}">
    <div id="picker-dynamic"></div>
  `;
  const input = document.getElementById('picker-search-input');
  input.value = magiaPicker.search;
  input.addEventListener('input', () => {
    magiaPicker.search = input.value;
    rerenderPickerDynamic();
  });
  input.focus();
  rerenderPickerDynamic();
}

/** Przerenderowuje tylko chipy filtrów + siatkę kafelków popupu (pole wyszukiwania zostaje niezmienione, by nie tracić fokusu/kursora). */
function rerenderPickerDynamic() {
  const el = document.getElementById('picker-dynamic');
  if (!el || !magiaPicker) return;
  if (magiaPicker.kind === 'tradycja') el.innerHTML = renderTradycjaPickerDynamicHtml();
  else if (magiaPicker.kind === 'darmowe_zaklecie') el.innerHTML = renderDarmoweZakleciePickerDynamicHtml();
  else el.innerHTML = renderZakleciePickerDynamicHtml();
  podlaczObslugePickerDynamic(el);
}

/** Renderuje kafelki tradycji dostępnych do poznania w popupie, po zastosowaniu wyszukiwania tekstowego. */
function renderTradycjaPickerDynamicHtml() {
  const wszystkie = pobierzTradycjeDlaKategorii(magiaPicker.kategoria, magiaPicker.znaneTradycje);
  const search = magiaPicker.search.trim().toLowerCase();
  const wynik = search ? wszystkie.filter(t => t.nazwa.toLowerCase().includes(search)) : wszystkie;

  const tiles = wynik.map(t => `
    <button type="button" class="picker-tile" data-pick-tradycja="${t.id}">
      <div class="picker-tile-header"><span>${t.nazwa}</span></div>
      ${t.czarnaMagia ? '<div class="picker-tile-warning">⚠️ Czarna magia - poznanie przyznaje 1 Splugawienie</div>' : ''}
    </button>
  `).join('') || '<p class="hint">Brak tradycji spełniających kryteria wyszukiwania.</p>';

  return `
    <p class="picker-results-count hint">Znaleziono ${wynik.length} z ${wszystkie.length} tradycji</p>
    <div class="picker-tile-grid">${tiles}</div>
  `;
}

/**
 * Zwraca id-y zaklęć już wybranych w INNYCH slotach magii (nie w
 * `wylaczAtomId`, czyli slocie właśnie edytowanym) - używane do wyszarzenia
 * ich w popupie, bo nauka tego samego zaklęcia drugi raz nie ma sensu.
 */
function pobierzZajeteZaklecia(wylaczAtomId) {
  const { rozwiazania } = obliczRozwiazanieMagii(pobierzAktualneAtomyMagii(), magiaWybory);
  const zajete = new Set();
  rozwiazania.forEach(r => {
    if (r.atom.id === wylaczAtomId) return;
    if (r.mode === 'zaklecie' && r.spellId) zajete.add(r.spellId);
    if (r.mode === 'tradycja' && r.darmowyZaklecieId) zajete.add(r.darmowyZaklecieId);
  });
  return zajete;
}

/** Renderuje kafelki zaklęć dostępnych do nauki w popupie, po zastosowaniu wyszukiwania i chipów filtrów. */
function renderZakleciePickerDynamicHtml() {
  const { znaneTradycje, moc, tradycjaOgraniczenie, search, filterKrag, filterKategoria, filterTradycja } = magiaPicker;
  const wszystkie = pobierzZakleciaDoNauki({ znaneTradycje, moc, tradycjaOgraniczenie });

  const kregi = [...new Set(wszystkie.map(s => s.krag))].sort((a, b) => a - b);
  const tradycjeWZbiorze = [...new Map(wszystkie.map(s => [s.tradycja, s.tradycjaNazwa])).entries()]
    .sort((a, b) => a[1].localeCompare(b[1], 'pl'));

  let wynik = wszystkie;
  if (filterKrag !== null) wynik = wynik.filter(s => s.krag === filterKrag);
  if (filterKategoria) wynik = wynik.filter(s => s.kategoria === filterKategoria);
  if (filterTradycja) wynik = wynik.filter(s => s.tradycja === filterTradycja);
  const searchLower = search.trim().toLowerCase();
  if (searchLower) wynik = wynik.filter(s => `${s.nazwa} ${s.opis}`.toLowerCase().includes(searchLower));

  const tradChipy = tradycjeWZbiorze.length > 1
    ? tradycjeWZbiorze.map(([id, nazwa]) => `<button type="button" class="picker-filter-chip ${filterTradycja === id ? 'active' : ''}" data-filter-tradycja="${id}">${nazwa}</button>`).join('')
    : '';
  const kregChipy = kregi.length > 1
    ? kregi.map(k => `<button type="button" class="picker-filter-chip ${filterKrag === k ? 'active' : ''}" data-filter-krag="${k}">Krąg ${k}</button>`).join('')
    : '';
  const katChipy = [['atak', 'Atak'], ['uzytkowe', 'Użytkowe']]
    .map(([id, etykieta]) => `<button type="button" class="picker-filter-chip ${filterKategoria === id ? 'active' : ''}" data-filter-kategoria="${id}">${etykieta}</button>`).join('');
  const chipyHtml = (tradChipy || kregChipy || katChipy)
    ? `<div class="picker-filter-chips">${tradChipy}${kregChipy}${katChipy}</div>`
    : '';

  const zajete = pobierzZajeteZaklecia(magiaPicker.atomId);
  const tiles = wynik
    .slice()
    .sort((a, b) => a.tradycjaNazwa.localeCompare(b.tradycjaNazwa, 'pl') || a.krag - b.krag || a.nazwa.localeCompare(b.nazwa, 'pl'))
    .map(s => {
      const jestZajete = zajete.has(s.id);
      return `
      <button type="button" class="picker-tile ${jestZajete ? 'disabled' : ''}" ${jestZajete ? 'disabled' : ''} data-pick-zaklecie="${s.id}">
        <div class="picker-tile-header">
          <span>${s.nazwa}</span>
          ${renderujZnacznikZrodla(s.zrodlo)}
        </div>
        <div class="picker-tile-meta">${s.tradycjaNazwa} · Krąg ${s.krag} · ${s.kategoria === 'atak' ? 'Atak' : 'Użytkowe'}</div>
        <p class="picker-tile-opis">${s.opis}</p>
        ${jestZajete ? '<div class="picker-tile-taken">Już wybrane w innym slocie</div>' : ''}
        ${!jestZajete && czyCzarnaMagia(s.tradycja) ? '<div class="picker-tile-warning">⚠️ Czarna magia</div>' : ''}
      </button>
    `;
    }).join('') || '<p class="hint">Brak zaklęć spełniających kryteria wyszukiwania.</p>';

  return `
    ${chipyHtml}
    <p class="picker-results-count hint">Znaleziono ${wynik.length} z ${wszystkie.length} zaklęć</p>
    <div class="picker-tile-grid">${tiles}</div>
  `;
}

/**
 * Renderuje kafelki zaklęć kręgu 0 danej tradycji w popupie wyboru
 * darmowego zaklęcia ("Poznawanie tradycji", PG) - bez chipów filtrów, bo
 * krąg jest już z definicji ograniczony do 0, a tradycja jest ustalona.
 */
function renderDarmoweZakleciePickerDynamicHtml() {
  const { tradycjaId, search } = magiaPicker;
  const wszystkie = pobierzZakleciaKregu0(tradycjaId);
  const searchLower = search.trim().toLowerCase();
  const wynik = searchLower ? wszystkie.filter(s => `${s.nazwa} ${s.opis}`.toLowerCase().includes(searchLower)) : wszystkie;

  const zajete = pobierzZajeteZaklecia(magiaPicker.atomId);
  const tiles = wynik
    .slice()
    .sort((a, b) => a.nazwa.localeCompare(b.nazwa, 'pl'))
    .map(s => {
      const jestZajete = zajete.has(s.id);
      return `
      <button type="button" class="picker-tile ${jestZajete ? 'disabled' : ''}" ${jestZajete ? 'disabled' : ''} data-pick-darmowe-zaklecie="${s.id}">
        <div class="picker-tile-header">
          <span>${s.nazwa}</span>
          ${renderujZnacznikZrodla(s.zrodlo)}
        </div>
        <div class="picker-tile-meta">${s.tradycjaNazwa} · Krąg 0 · ${s.kategoria === 'atak' ? 'Atak' : 'Użytkowe'}</div>
        <p class="picker-tile-opis">${s.opis}</p>
        ${jestZajete ? '<div class="picker-tile-taken">Już wybrane w innym slocie</div>' : ''}
      </button>
    `;
    }).join('') || '<p class="hint">Brak zaklęć kręgu 0 spełniających kryteria wyszukiwania.</p>';

  return `
    <p class="picker-results-count hint">Znaleziono ${wynik.length} z ${wszystkie.length} zaklęć kręgu 0</p>
    <div class="picker-tile-grid">${tiles}</div>
  `;
}

/** Podłącza obsługę chipów filtrów i kafelków w dynamicznym obszarze popupu. */
function podlaczObslugePickerDynamic(container) {
  container.querySelectorAll('[data-filter-krag]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.filterKrag, 10);
      magiaPicker.filterKrag = magiaPicker.filterKrag === val ? null : val;
      rerenderPickerDynamic();
    });
  });
  container.querySelectorAll('[data-filter-kategoria]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.filterKategoria;
      magiaPicker.filterKategoria = magiaPicker.filterKategoria === val ? null : val;
      rerenderPickerDynamic();
    });
  });
  container.querySelectorAll('[data-filter-tradycja]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.filterTradycja;
      magiaPicker.filterTradycja = magiaPicker.filterTradycja === val ? null : val;
      rerenderPickerDynamic();
    });
  });
  container.querySelectorAll('[data-pick-tradycja]').forEach(btn => {
    btn.addEventListener('click', () => wybierzTradycjaZPickera(btn.dataset.pickTradycja));
  });
  container.querySelectorAll('[data-pick-zaklecie]').forEach(btn => {
    btn.addEventListener('click', () => wybierzZaklecieZPickera(btn.dataset.pickZaklecie));
  });
  container.querySelectorAll('[data-pick-darmowe-zaklecie]').forEach(btn => {
    btn.addEventListener('click', () => wybierzDarmoweZaklecieZPickera(btn.dataset.pickDarmoweZaklecie));
  });
}

/**
 * Zatwierdza wybór tradycji dokonany w popupie. Poznanie tradycji przyznaje
 * automatycznie jedno jej zaklęcie kręgu 0 ("Poznawanie tradycji", PG), więc
 * zamiast zamykać popup, przechodzi wprost do wyboru tego darmowego
 * zaklęcia - albo, gdy tradycja ma tylko jedno zaklęcie kręgu 0, wybiera je
 * automatycznie, bez dodatkowego kliknięcia.
 */
function wybierzTradycjaZPickera(tradycjaId) {
  const atomId = magiaPicker.atomId;
  const docelowy = magiaPicker.docelowy || 'magia';

  if (docelowy === 'ekwipunek') {
    const wybor = ekwipunekWybory[atomId] || {};
    ekwipunekWybory[atomId] = { ...wybor, typ: 'zwoj_zaklecie', tradycjaId, spellId: null };
    const kregZero = pobierzZakleciaKregu0(tradycjaId);
    if (kregZero.length === 1) {
      ekwipunekWybory[atomId].spellId = kregZero[0].id;
      zamknijMagicPicker();
    } else if (kregZero.length > 1) {
      otworzDarmoweZakleciePicker(atomId, tradycjaId, 'ekwipunek');
    } else {
      zamknijMagicPicker();
    }
    renderEkwipunekSection();
    return;
  }

  const wybor = magiaWybory[atomId] || {};
  magiaWybory[atomId] = { ...wybor, mode: wybor.mode || 'tradycja', tradycjaId, darmowyZaklecieId: null };

  const kregZero = pobierzZakleciaKregu0(tradycjaId);
  if (kregZero.length === 1) {
    magiaWybory[atomId].darmowyZaklecieId = kregZero[0].id;
    zamknijMagicPicker();
  } else if (kregZero.length > 1) {
    otworzDarmoweZakleciePicker(atomId, tradycjaId);
  } else {
    zamknijMagicPicker();
  }
  renderSpellsSection();
}

/** Zatwierdza wybór zaklęcia dokonany w popupie, zamyka go i przerenderowuje Krok 6. */
function wybierzZaklecieZPickera(spellId) {
  const atomId = magiaPicker.atomId;
  const wybor = magiaWybory[atomId] || {};
  magiaWybory[atomId] = { ...wybor, mode: wybor.mode || 'zaklecie', spellId };
  delete magiaRyzykoWyniki[atomId];
  zamknijMagicPicker();
  renderSpellsSection();
}

/** Zatwierdza wybór darmowego zaklęcia kręgu 0 dokonany w popupie, zamyka go i przerenderowuje Krok 6. */
function wybierzDarmoweZaklecieZPickera(spellId) {
  const atomId = magiaPicker.atomId;
  const docelowy = magiaPicker.docelowy || 'magia';

  if (docelowy === 'ekwipunek') {
    const wybor = ekwipunekWybory[atomId] || {};
    ekwipunekWybory[atomId] = { ...wybor, spellId };
    zamknijMagicPicker();
    renderEkwipunekSection();
    return;
  }

  const wybor = magiaWybory[atomId] || {};
  magiaWybory[atomId] = { ...wybor, darmowyZaklecieId: spellId };
  zamknijMagicPicker();
  renderSpellsSection();
}

/** Czyści wszystkie wybory magii dokonane w Kroku 6. */
function resetujMagie() {
  magiaWybory = {};
  magiaRyzykoWyniki = {};
  magiaCzarnaMagiaZaTradycje = new Set();
  renderSpellsSection();
}

// ========== KROK 7: EKWIPUNEK (Zamożność, wyposażenie startowe, sklep) ==========

/** Rzuca podaną liczbą kostek k6 (zapis "NkM", tylko k6 używane w tabelach zamożności) i zwraca sumę oczek. */
function rzucKostki(zapis) {
  const [iloscKostekTxt, scianTxt] = zapis.split('k');
  const iloscKostek = parseInt(iloscKostekTxt, 10) || 1;
  const scian = parseInt(scianTxt, 10) || 6;
  let suma = 0;
  for (let i = 0; i < iloscKostek; i++) suma += Math.floor(Math.random() * scian) + 1;
  return suma;
}

/** Renderuje całą sekcję Kroku 7 (Zamożność, wyposażenie startowe, sklep). */
function renderEkwipunekSection() {
  renderZamoznoscGrid();
  renderWyposazenieStartowe();
  renderSklepSection();
}

/** Renderuje kafelki wyboru Zamożności wraz z ewentualnym wynikiem rzutu 3k6. */
function renderZamoznoscGrid() {
  const grid = document.getElementById('zamoznosc-grid');
  const wynikEl = document.getElementById('zamoznosc-wynik');
  if (!grid) return;

  if (wynikEl) {
    wynikEl.textContent = ekwipunekZamoznoscWynik != null
      ? `Wynik rzutu 3k6: ${ekwipunekZamoznoscWynik}`
      : '';
  }

  grid.innerHTML = Object.values(ZAMOZNOSC).map(z => {
    const zakres = z.zakres3k6[0] === z.zakres3k6[1] ? `${z.zakres3k6[0]}` : `${z.zakres3k6[0]}–${z.zakres3k6[1]}`;
    const selected = ekwipunekZamoznoscId === z.id;
    return `
      <button type="button" class="picker-tile zamoznosc-tile ${selected ? 'selected' : ''}" data-wybierz-zamoznosc="${z.id}">
        <div class="picker-tile-header">
          <span>${z.nazwa}</span>
          ${selected ? '<span class="zamoznosc-badge">✓ Wybrano</span>' : ''}
        </div>
        <div class="picker-tile-meta">3k6: ${zakres}</div>
        <p class="picker-tile-opis">${z.opis}</p>
      </button>
    `;
  }).join('');

  grid.querySelectorAll('[data-wybierz-zamoznosc]').forEach(btn => {
    btn.addEventListener('click', () => wybierzZamoznosc(btn.dataset.wybierzZamoznosc, null));
  });
}

/** Losuje Zamożność rzutem 3k6 i wybiera odpowiedni poziom z tabeli. */
function losujZamoznosc() {
  const wynik = rzucKostki('3k6');
  const zam = pobierzZamoznoscDlaRzutu(wynik);
  if (zam) wybierzZamoznosc(zam.id, wynik);
}

/**
 * Ustawia poziom Zamożności (ręcznie klikniętej albo wylosowanej) i losuje
 * startową gotówkę (PG: "sakiewka z NkM ..."). Czyści wybory wyposażenia
 * startowego i sklepu, bo należą do poprzedniego poziomu zamożności.
 */
function wybierzZamoznosc(zamoznoscId, wynikRzutu) {
  const zam = ZAMOZNOSC[zamoznoscId];
  if (!zam) return;
  ekwipunekZamoznoscId = zamoznoscId;
  ekwipunekZamoznoscWynik = wynikRzutu;
  ekwipunekGotowkaPoczatkowaWynik = rzucKostki(zam.pieniadze.kosci);
  ekwipunekWybory = {};
  ekwipunekSprzedane = [];
  ekwipunekZakupione = [];
  ekwipunekOpisRozwiniete = new Set();
  renderEkwipunekSection();
}

/** Czyści wybraną Zamożność i cały zależny od niej stan ekwipunku. */
function resetujZamoznosc() {
  ekwipunekZamoznoscId = null;
  ekwipunekZamoznoscWynik = null;
  ekwipunekGotowkaPoczatkowaWynik = null;
  ekwipunekWybory = {};
  ekwipunekSprzedane = [];
  ekwipunekZakupione = [];
  ekwipunekOpisRozwiniete = new Set();
  renderEkwipunekSection();
}

/**
 * Oblicza pełny, aktualny stan ekwipunku: rozwiązane pozycje startowe
 * (gwarantowane + wybrane), sprzedane pozycje, zakupione pozycje i
 * dostępną gotówkę (startowa sakiewka + wpływy ze sprzedaży + wylosowane
 * srebrniki z Kroku 2, jeśli postać ma poziom > 0 - PG: "Wyposażenie na
 * wyższych poziomach" - minus wydatki na zakupy). Zwraca `null`, gdy
 * Zamożność nie została jeszcze wybrana.
 */
function obliczStanEkwipunku() {
  if (!ekwipunekZamoznoscId) return null;
  const zam = ZAMOZNOSC[ekwipunekZamoznoscId];
  const gwarantowane = pobierzGwarantowanePozycje(ekwipunekZamoznoscId);
  const atomy = obliczAtomyWyposazenia(ekwipunekZamoznoscId);

  const startowePozycje = [];
  gwarantowane.forEach((p, idx) => {
    startowePozycje.push({ klucz: `g${idx}`, itemId: p.id || null, tekst: p.tekst || null, ilosc: p.ilosc || 1 });
  });
  atomy.forEach(atom => {
    const wybor = ekwipunekWybory[atom.id];
    if (!wybor) return;
    if (wybor.typ === 'zwoj_zaklecie' && wybor.tradycjaId) {
      startowePozycje.push({
        klucz: atom.id, itemId: null, ilosc: 1, atomId: atom.id, sprzedawalny: false,
        zwojZaklecie: { tradycjaId: wybor.tradycjaId, spellId: wybor.spellId || null }
      });
    } else if (wybor.itemId) {
      startowePozycje.push({ klucz: atom.id, itemId: wybor.itemId, ilosc: 1, atomId: atom.id });
    }
  });

  const sprzedaneSet = new Set(ekwipunekSprzedane);
  const posiadaneStartowe = startowePozycje.filter(p => !sprzedaneSet.has(p.klucz));
  const sprzedaneStartowe = startowePozycje.filter(p => sprzedaneSet.has(p.klucz));

  const jednostkaGotowki = zam.pieniadze.jednostka;
  const startowaGotowkaOkrawki = ekwipunekGotowkaPoczatkowaWynik != null
    ? ekwipunekGotowkaPoczatkowaWynik * PRZELICZNIK_NA_OKRAWKI[jednostkaGotowki]
    : 0;
  const zeSprzedazyOkrawki = sprzedaneStartowe.reduce((suma, p) => {
    if (!p.itemId) return suma;
    return suma + cenaSkupuOkrawki(pobierzPrzedmiot(p.itemId)?.cena) * p.ilosc;
  }, 0);
  const zaZakupyOkrawki = ekwipunekZakupione.reduce((suma, z) => {
    return suma + cenaNaOkrawki(pobierzPrzedmiot(z.itemId)?.cena) * z.ilosc;
  }, 0);
  const zeSrebrnikowPoziomu = (wylosowaneSrebrniki || 0) * PRZELICZNIK_NA_OKRAWKI.sr;

  const gotowkaOkrawki = startowaGotowkaOkrawki + zeSprzedazyOkrawki + zeSrebrnikowPoziomu - zaZakupyOkrawki;

  const zakupionePozycje = ekwipunekZakupione.map((z, idx) => ({ klucz: `z${idx}`, itemId: z.itemId, ilosc: z.ilosc }));

  return {
    zam, atomy, gwarantowane,
    posiadaneStartowe, sprzedaneStartowe, zakupionePozycje,
    startowaGotowkaOkrawki, zeSprzedazyOkrawki, zaZakupyOkrawki, zeSrebrnikowPoziomu,
    gotowkaOkrawki
  };
}

/** Renderuje sekcję wyposażenia startowego: gwarantowane pozycje i karty wyboru (jedna karta = jeden atom). */
function renderWyposazenieStartowe() {
  const container = document.getElementById('wyposazenie-startowe-section');
  if (!container) return;

  if (!ekwipunekZamoznoscId) {
    container.innerHTML = '';
    return;
  }

  const stan = obliczStanEkwipunku();
  const gwarantowaneHtml = stan.gwarantowane.map(p => {
    const przedmiot = p.id ? pobierzPrzedmiot(p.id) : null;
    const nazwa = przedmiot?.nazwa || p.id || p.tekst;
    const ilosc = p.ilosc && p.ilosc > 1 ? ` (${p.ilosc}×)` : '';
    const statystyki = przedmiot ? formatujStatystykiPrzedmiotu(przedmiot) : null;
    return `<li${statystyki ? ` title="${statystyki}"` : ''}>${nazwa}${ilosc}</li>`;
  }).join('');

  const atomyHtml = stan.atomy.map(atom => renderujKarteWyposazenia(atom)).join('');

  container.innerHTML = `
    <h4>🎒 Wyposażenie startowe (${stan.zam.nazwa})</h4>
    <p class="hint">Gwarantowane: <ul class="gwarantowane-lista">${gwarantowaneHtml}</ul></p>
    ${atomyHtml}
    <p class="hint">Startowa gotówka: <strong>${formatujOkrawki(stan.startowaGotowkaOkrawki)}</strong> (sakiewka z ${stan.zam.pieniadze.kosci} ${stan.zam.pieniadze.jednostka === 'okr' ? 'okrawków' : stan.zam.pieniadze.jednostka === 'md' ? 'miedziaków' : 'srebrników'})</p>
    ${stan.zam.dodatkowyOpis ? `<p class="hint">${stan.zam.dodatkowyOpis}</p>` : ''}
  `;

  container.querySelectorAll('[data-wybierz-startowy]').forEach(btn => {
    btn.addEventListener('click', () => {
      wybierzPrzedmiotStartowy(btn.dataset.wybierzStartowy, btn.dataset.itemId);
    });
  });
  container.querySelectorAll('[data-otworz-zwoj]').forEach(btn => {
    btn.addEventListener('click', () => otworzTradycjaPicker(btn.dataset.otworzZwoj, ['dowolna'], new Set(), 'ekwipunek'));
  });
}

/** Renderuje jedną kartę wyboru wyposażenia startowego (wybor_przedmiotu albo wybor_dodatkowy). */
function renderujKarteWyposazenia(atom) {
  const wybor = ekwipunekWybory[atom.id];

  if (atom.rodzaj === 'wybor_przedmiotu') {
    const kafelki = atom.opcje.map(itemId => {
      const przedmiot = pobierzPrzedmiot(itemId);
      const aktywny = wybor?.itemId === itemId;
      const statystyki = formatujStatystykiPrzedmiotu(przedmiot);
      return `<button type="button" class="btn-secondary small ${aktywny ? 'active' : ''}" data-wybierz-startowy="${atom.id}" data-item-id="${itemId}"${statystyki ? ` title="${statystyki}"` : ''}>${przedmiot?.nazwa || itemId}</button>`;
    }).join('');
    const wybranyPrzedmiot = wybor?.itemId ? pobierzPrzedmiot(wybor.itemId) : null;
    const statystykiWybranego = wybranyPrzedmiot ? formatujStatystykiPrzedmiotu(wybranyPrzedmiot) : null;
    return `
      <div class="magic-slot-card ${wybor?.itemId ? 'complete' : ''}">
        <p class="magic-slot-desc">Wybierz jedno: ${atom.opcje.map(id => pobierzPrzedmiot(id)?.nazwa || id).join(' / ')}${atom.opisWyboru ? ` (${atom.opisWyboru})` : ''}</p>
        <div class="magic-slot-mode-toggle">${kafelki}</div>
        ${statystykiWybranego ? `<p class="magic-slot-status ok">${wybranyPrzedmiot.nazwa}: ${statystykiWybranego}</p>` : ''}
      </div>
    `;
  }

  // wybor_dodatkowy
  const kafelki = atom.opcje.map(opcja => {
    const aktywny = opcja.typ === 'zwoj_zaklecie' ? wybor?.typ === 'zwoj_zaklecie' : (wybor?.typ === 'przedmiot' && wybor?.itemId === opcja.id);
    if (opcja.typ === 'zwoj_zaklecie') {
      return `<button type="button" class="btn-secondary small ${aktywny ? 'active' : ''}" data-otworz-zwoj="${atom.id}">${opcja.etykieta}</button>`;
    }
    const statystyki = formatujStatystykiPrzedmiotu(pobierzPrzedmiot(opcja.id));
    return `<button type="button" class="btn-secondary small ${aktywny ? 'active' : ''}" data-wybierz-startowy="${atom.id}" data-item-id="${opcja.id}"${statystyki ? ` title="${statystyki}"` : ''}>${opcja.etykieta}</button>`;
  }).join('');

  let opisWyniku = '';
  if (wybor?.typ === 'zwoj_zaklecie' && wybor.tradycjaId) {
    const nazwaTr = TRADYCJE[wybor.tradycjaId]?.nazwa || wybor.tradycjaId;
    const spell = wybor.spellId ? SPELLS.find(s => s.id === wybor.spellId) : null;
    opisWyniku = `<p class="magic-slot-status ok">Wybrano: ${nazwaTr}${spell ? ` - ${spell.nazwa}` : ' (wybierz zaklęcie kręgu 0)'}</p>`;
  } else if (wybor?.typ === 'przedmiot' && wybor.itemId) {
    const wybranyPrzedmiot = pobierzPrzedmiot(wybor.itemId);
    const statystykiWybranego = wybranyPrzedmiot ? formatujStatystykiPrzedmiotu(wybranyPrzedmiot) : null;
    if (statystykiWybranego) opisWyniku = `<p class="magic-slot-status ok">${wybranyPrzedmiot.nazwa}: ${statystykiWybranego}</p>`;
  }

  return `
    <div class="magic-slot-card ${wybor ? 'complete' : ''}">
      <p class="magic-slot-desc">${atom.opis}</p>
      <div class="magic-slot-mode-toggle">${kafelki}</div>
      ${opisWyniku}
    </div>
  `;
}

/** Zatwierdza wybór w karcie "wybór jednego przedmiotu" (np. pałka/proca) wyposażenia startowego. */
function wybierzPrzedmiotStartowy(atomId, itemId) {
  ekwipunekWybory[atomId] = { typ: 'przedmiot', itemId };
  renderEkwipunekSection();
}

/** Renderuje sekcję sklepu: aktualna gotówka, posiadane przedmioty (z opcją sprzedaży) i katalog zakupów. */
function renderSklepSection() {
  const container = document.getElementById('sklep-section');
  if (!container) return;

  if (!ekwipunekZamoznoscId) {
    container.innerHTML = '';
    return;
  }

  const stan = obliczStanEkwipunku();

  const renderujWiersze = (pozycje, zrodlo) => pozycje.map(p => {
    const nazwa = p.zwojZaklecie
      ? `Zwój (${TRADYCJE[p.zwojZaklecie.tradycjaId]?.nazwa || p.zwojZaklecie.tradycjaId}${p.zwojZaklecie.spellId ? `: ${SPELLS.find(s => s.id === p.zwojZaklecie.spellId)?.nazwa || ''}` : ''})`
      : (p.itemId ? (pobierzPrzedmiot(p.itemId)?.nazwa || p.itemId) : p.tekst);
    const przedmiot = p.itemId ? pobierzPrzedmiot(p.itemId) : null;
    const mozeSprzedac = zrodlo === 'startowe' ? (przedmiot && przedmiot.cena) : true;
    const cenaSkupu = przedmiot ? formatujOkrawki(cenaSkupuOkrawki(przedmiot.cena) * p.ilosc) : null;
    const ilosc = p.ilosc > 1 ? ` ×${p.ilosc}` : '';
    const statystyki = przedmiot ? formatujStatystykiPrzedmiotu(przedmiot) : null;
    const maOpis = !!przedmiot?.opis;
    const rozwiniety = ekwipunekOpisRozwiniete.has(p.klucz);
    const wiersz = `
      <tr>
        <td>${nazwa}${ilosc} ${przedmiot ? renderujZnacznikZrodla(przedmiot.zrodlo) : ''}</td>
        <td>${statystyki || '—'}</td>
        <td>${przedmiot ? formatujCene(przedmiot.cena) : '—'}</td>
        <td class="equipment-table-actions">
          ${maOpis ? `<button type="button" class="icon-btn" data-info="${p.klucz}" title="Pokaż opis">ℹ️</button>` : ''}
          ${mozeSprzedac ? `<button type="button" class="icon-btn" data-sprzedaj="${p.klucz}" data-zrodlo="${zrodlo}" title="${zrodlo === 'startowe' ? `Sprzedaj za ${cenaSkupu}` : 'Zwróć (pełny zwrot)'}">${zrodlo === 'startowe' ? '💰' : '↩️'}</button>` : ''}
        </td>
      </tr>
    `;
    const wierszOpis = maOpis
      ? `<tr class="equipment-table-desc-row" ${rozwiniety ? '' : 'hidden'}><td colspan="4">${przedmiot.opis}</td></tr>`
      : '';
    return wiersz + wierszOpis;
  }).join('');

  const wszystkiePozycje = [...stan.posiadaneStartowe, ...stan.zakupionePozycje];
  const tabelaHtml = wszystkiePozycje.length ? `
    <div class="equipment-table-wrap">
      <table class="equipment-table">
        <thead><tr><th>Przedmiot</th><th>Statystyki</th><th>Cena</th><th></th></tr></thead>
        <tbody id="ekwipunek-posiadane-list">
          ${renderujWiersze(stan.posiadaneStartowe, 'startowe')}
          ${renderujWiersze(stan.zakupionePozycje, 'kupione')}
        </tbody>
      </table>
    </div>
  ` : '<p class="hint">Brak przedmiotów.</p>';

  container.innerHTML = `
    <div class="flex-row-between">
      <h4>🏪 Sklep</h4>
      <span id="gotowka-summary" class="inline-summary"><strong>Gotówka: ${formatujOkrawki(stan.gotowkaOkrawki)}</strong></span>
    </div>
    ${stan.zeSrebrnikowPoziomu > 0 ? `<p class="hint">Zawiera ${wylosowaneSrebrniki} wylosowanych srebrników z Kroku 2 (poziom ${wybranyPoziom}).</p>` : ''}

    <div class="flex-row-between">
      <h5>Twoje przedmioty</h5>
    </div>
    ${tabelaHtml}

    ${stan.sprzedaneStartowe.length ? `
      <div class="flex-row-between"><h5>Sprzedane</h5></div>
      <div class="equipment-tag-list">${stan.sprzedaneStartowe.map(p => `<span class="equipment-tag sold">${p.itemId ? pobierzPrzedmiot(p.itemId)?.nazwa : p.tekst}</span>`).join('')}</div>
    ` : ''}

    <div class="flex-row-between">
      <h5>Katalog przedmiotów</h5>
      <button type="button" class="btn-primary small" id="btn-otworz-sklep">🛒 Przeglądaj katalog</button>
    </div>
  `;

  container.querySelectorAll('[data-sprzedaj]').forEach(btn => {
    btn.addEventListener('click', () => sprzedajPozycje(btn.dataset.sprzedaj, btn.dataset.zrodlo));
  });
  container.querySelectorAll('[data-info]').forEach(btn => {
    btn.addEventListener('click', () => {
      const klucz = btn.dataset.info;
      if (ekwipunekOpisRozwiniete.has(klucz)) ekwipunekOpisRozwiniete.delete(klucz);
      else ekwipunekOpisRozwiniete.add(klucz);
      renderSklepSection();
    });
  });
  document.getElementById('btn-otworz-sklep')?.addEventListener('click', () => otworzEkwipunekPicker());
}

/** Sprzedaje (pozycja startowa, za połowę ceny) albo zwraca (pozycja kupiona, pełny zwrot) daną pozycję ekwipunku. */
function sprzedajPozycje(klucz, zrodlo) {
  if (zrodlo === 'startowe') {
    if (!ekwipunekSprzedane.includes(klucz)) ekwipunekSprzedane.push(klucz);
  } else if (zrodlo === 'kupione') {
    const idx = parseInt(klucz.replace('z', ''), 10);
    const zakup = ekwipunekZakupione[idx];
    if (zakup) {
      if (zakup.ilosc > 1) zakup.ilosc -= 1;
      else ekwipunekZakupione.splice(idx, 1);
    }
  }
  renderEkwipunekSection();
}

/**
 * Stan aktualnie otwartego popupu katalogu sklepu (Krok 7) - `null`, gdy
 * popup jest zamknięty.
 */
let ekwipunekPicker = null;

/** Otwiera popup katalogu przedmiotów do kupienia (kafelki z wyszukiwaniem i filtrami kategorii/rzadkości). */
function otworzEkwipunekPicker() {
  ekwipunekPicker = { search: '', filterKategoria: null, filterRzadkosc: null, sortBy: 'nazwa', sortDir: 'asc', ukryjNiedostepne: true };
  const overlay = document.getElementById('equipment-picker-overlay');
  if (overlay) overlay.hidden = false;
  renderEkwipunekPickerBody();
}

/** Zamyka popup katalogu sklepu. */
function zamknijEkwipunekPicker() {
  const overlay = document.getElementById('equipment-picker-overlay');
  if (overlay) overlay.hidden = true;
  ekwipunekPicker = null;
}

/** Renderuje zawartość popupu katalogu: statyczne pole wyszukiwania + dynamiczny obszar z chipami i kafelkami. */
function renderEkwipunekPickerBody() {
  const body = document.getElementById('equipment-picker-body');
  if (!body || !ekwipunekPicker) return;
  body.innerHTML = `
    <input type="text" class="picker-search" id="equipment-picker-search-input" placeholder="Szukaj przedmiotu...">
    <div id="equipment-picker-dynamic"></div>
  `;
  const input = document.getElementById('equipment-picker-search-input');
  input.value = ekwipunekPicker.search;
  input.addEventListener('input', () => {
    ekwipunekPicker.search = input.value;
    rerenderEkwipunekPickerDynamic();
  });
  input.focus();
  rerenderEkwipunekPickerDynamic();
}

/** Przerenderowuje chipy filtrów i siatkę kafelków katalogu (pole wyszukiwania zostaje niezmienione). */
function rerenderEkwipunekPickerDynamic() {
  const el = document.getElementById('equipment-picker-dynamic');
  if (!el || !ekwipunekPicker) return;

  const { search, filterKategoria, filterRzadkosc, sortBy, sortDir, ukryjNiedostepne } = ekwipunekPicker;
  let wynik = EQUIPMENT.filter(i => i.cena);
  if (filterKategoria) wynik = wynik.filter(i => i.kategoria === filterKategoria);
  if (filterRzadkosc) wynik = wynik.filter(i => i.rzadkosc === filterRzadkosc);
  const searchLower = search.trim().toLowerCase();
  if (searchLower) wynik = wynik.filter(i => `${i.nazwa} ${i.opis || ''}`.toLowerCase().includes(searchLower));

  const kategorieChipy = Object.keys(KATEGORIA_ETYKIETY)
    .filter(k => EQUIPMENT.some(i => i.kategoria === k && i.cena))
    .map(k => `<button type="button" class="picker-filter-chip ${filterKategoria === k ? 'active' : ''}" data-filter-kategoria="${k}">${KATEGORIA_ETYKIETY[k]}</button>`)
    .join('');
  const rzadkoscChipy = Object.keys(RZADKOSC_ETYKIETY)
    .map(r => `<button type="button" class="picker-filter-chip ${filterRzadkosc === r ? 'active' : ''}" data-filter-rzadkosc="${r}">${RZADKOSC_ETYKIETY[r]}</button>`)
    .join('');
  const sortChipy = Object.keys(SORTOWANIE_ETYKIETY)
    .map(s => `<button type="button" class="picker-filter-chip ${sortBy === s ? 'active' : ''}" data-sort-by="${s}">${SORTOWANIE_ETYKIETY[s]}${sortBy === s ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ''}</button>`)
    .join('');

  const stan = obliczStanEkwipunku();
  const posiadaneIds = stan
    ? new Set([...stan.posiadaneStartowe, ...stan.zakupionePozycje].filter(p => p.itemId).map(p => p.itemId))
    : new Set();

  let wynikDoWyswietlenia = sortujPrzedmioty(wynik, sortBy, sortDir).map(i => {
    const zaDrogi = !stan || stan.gotowkaOkrawki < cenaNaOkrawki(i.cena);
    const posiadany = posiadaneIds.has(i.id);
    return { i, zaDrogi, posiadany, niedostepny: zaDrogi || posiadany };
  });
  const wszystkichPasujacych = wynikDoWyswietlenia.length;
  if (ukryjNiedostepne) wynikDoWyswietlenia = wynikDoWyswietlenia.filter(w => !w.niedostepny);

  const tiles = wynikDoWyswietlenia
    .map(({ i, zaDrogi, posiadany, niedostepny }) => {
      const statystyki = formatujStatystykiPrzedmiotu(i);
      const powod = posiadany ? 'Już posiadane' : (zaDrogi ? 'Za mało gotówki' : '');
      return `
      <button type="button" class="picker-tile ${niedostepny ? 'disabled' : ''}" ${niedostepny ? 'disabled' : ''} data-kup="${i.id}">
        <div class="picker-tile-header">
          <span>${i.nazwa}</span>
          ${renderujZnacznikZrodla(i.zrodlo)}
        </div>
        <div class="picker-tile-meta">${KATEGORIA_ETYKIETY[i.kategoria] || i.kategoria} · ${RZADKOSC_ETYKIETY[i.rzadkosc] || '—'} · ${formatujCene(i.cena)}</div>
        ${statystyki ? `<div class="picker-tile-stats">${statystyki}</div>` : ''}
        ${i.opis ? `<p class="picker-tile-opis">${i.opis}</p>` : ''}
        ${powod ? `<div class="picker-tile-taken">${powod}</div>` : ''}
      </button>
    `;
    }).join('') || '<p class="hint">Brak przedmiotów spełniających kryteria wyszukiwania.</p>';

  el.innerHTML = `
    <div class="picker-filter-chips">${kategorieChipy}</div>
    <div class="picker-filter-chips">${rzadkoscChipy}</div>
    <div class="picker-filter-chips picker-sort-row"><span class="picker-sort-label">Sortuj:</span>${sortChipy}</div>
    <div class="picker-toolbar">
      <p class="picker-results-count hint">Znaleziono ${wszystkichPasujacych} przedmiotów${ukryjNiedostepne && wszystkichPasujacych !== wynikDoWyswietlenia.length ? ` (${wynikDoWyswietlenia.length} dostępnych)` : ''}</p>
      <label class="picker-toggle-label">
        <input type="checkbox" id="equipment-picker-hide-unavailable" ${ukryjNiedostepne ? 'checked' : ''}>
        Ukryj niedostępne (za drogie, już posiadane)
      </label>
    </div>
    <div class="picker-tile-grid">${tiles}</div>
  `;

  document.getElementById('equipment-picker-hide-unavailable')?.addEventListener('change', (e) => {
    ekwipunekPicker.ukryjNiedostepne = e.target.checked;
    rerenderEkwipunekPickerDynamic();
  });

  el.querySelectorAll('[data-filter-kategoria]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.filterKategoria;
      ekwipunekPicker.filterKategoria = ekwipunekPicker.filterKategoria === val ? null : val;
      rerenderEkwipunekPickerDynamic();
    });
  });
  el.querySelectorAll('[data-filter-rzadkosc]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.filterRzadkosc;
      ekwipunekPicker.filterRzadkosc = ekwipunekPicker.filterRzadkosc === val ? null : val;
      rerenderEkwipunekPickerDynamic();
    });
  });
  el.querySelectorAll('[data-sort-by]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.sortBy;
      if (ekwipunekPicker.sortBy === val) {
        ekwipunekPicker.sortDir = ekwipunekPicker.sortDir === 'desc' ? 'asc' : 'desc';
      } else {
        ekwipunekPicker.sortBy = val;
        ekwipunekPicker.sortDir = 'asc';
      }
      rerenderEkwipunekPickerDynamic();
    });
  });
  el.querySelectorAll('[data-kup]').forEach(btn => {
    btn.addEventListener('click', () => kupPrzedmiotZSklepu(btn.dataset.kup));
  });
}

/** Kupuje przedmiot z katalogu (jeśli starcza gotówki) i przerenderowuje sklep + katalog. */
function kupPrzedmiotZSklepu(itemId) {
  const przedmiot = pobierzPrzedmiot(itemId);
  if (!przedmiot) return;
  const stan = obliczStanEkwipunku();
  if (!stan || stan.gotowkaOkrawki < cenaNaOkrawki(przedmiot.cena)) return;

  const istniejacy = ekwipunekZakupione.find(z => z.itemId === itemId);
  if (istniejacy) istniejacy.ilosc += 1;
  else ekwipunekZakupione.push({ itemId, ilosc: 1 });

  renderSklepSection();
  rerenderEkwipunekPickerDynamic();
}

// Ten plik jest ładowany jako moduł ES (<script type="module">), więc funkcje
// nie trafiają automatycznie do zasięgu globalnego. index.html odwołuje się
// do poniższych funkcji przez atrybuty onclick, więc trzeba je udostępnić na window.
window.nextStep = nextStep;
window.prevStep = prevStep;
window.exportJSON = exportJSON;
window.closeHelp = closeHelp;
window.switchHelpTab = switchHelpTab;
