/**
 * Frontend JavaScript dla kreatora postaci
 */

import { buildCharacter, calculateBenefitsLevel } from './logic/character.js';
import { getPathsForLevel, calculateSlotsAttributes } from './logic/paths.js';
import { getOriginsListUi, getOriginTablesUi } from './logic/origins.js';
import { getProfessionsUi, getCuriosUi } from './logic/professions-curios.js';
import { LANGUAGES, calculateSlotsProfessionsAndLanguages } from './logic/languages-professions.js';
import { calculateSlotsMagic, calculateResolutionMagic, getTraditionsForCategory, getSpellsToLearning, getCircleZeroSpells, isBlackMagic, atomDescription, descriptionMagic } from './logic/magic.js';
import { TRADITIONS } from './data/traditions.js';
import { rollTable } from './data/table_utils.js';
import GAME_DATA from './data/game-data.js';
import SPELLS from './data/spells.js';
import EQUIPMENT from './data/equipment.js';
import { WEALTH, getWealthForRoll } from './data/wealth.js';
import {
  RARITY_LABELS, CATEGORY_LABELS_EQ, getItem, priceOnCopperbits, formatPrice,
  formatCopperbits, priceBuybackCopperbits, calculateAtomsGear, getGuaranteedEntries,
  formatStatsItem, SORT_LABELS, sortItems, CONVERTER_TO_COPPERBITS
} from './logic/equipment.js';
import { getSavedCharacters, saveCharacterToCache, generateSaveId, clearSavedCharacters } from './logic/saves.js';
import { getTalentDescription } from './logic/talents.js';

/** Zwraca znacznik `<svg>` odwołujący się do ikony (linia, bez wypełnienia) zdefiniowanej w sprite w index.html. */
function icon(name) {
  return `<svg class="icon"><use href="#icon-${name}"></use></svg>`;
}

/**
 * Progi wyboru ścieżek: poziom postaci -> klucz w `selectedPaths`. Trzy progi
 * (1/3/7) powtarzają się w całym kreatorze, więc mapowanie żyje w jednym
 * miejscu zamiast w kolejnych blokach `if`.
 */
const PATH_TIER_BY_LEVEL = { 1: 'nowicjusz', 3: 'ekspert', 7: 'mistrz' };
const PATH_LEVEL_BY_TIER = { nowicjusz: 1, ekspert: 3, mistrz: 7 };

let currentCharacter = null;
let selectedOrigin = null;
let selectedLevel = 0; // Gra zaczyna się od poziomu 0
let availableOrigin = [];
let resultsTables = {}; // Przechowuje wyniki tabel losowych dla wybranego pochodzenia
let selectedPaths = { nowicjusz: '', ekspert: '', mistrz: '' };
let grantedBenefitsWithPaths = { 1: null, 3: null, 7: null };
let selectedProfessions = []; // Pochodna odpowiedziSlotow - profesje przypisane do slotów w trybie 'profesja'
let answersSlots = {}; // slotId -> { mode: 'profesja'|'jezyk_nowy'|'jezyk_pismo', profesjaId, jezyk }
let selectedAttributesSlots = {}; // slotId (ze ścieżki) -> tablica wybranych atrybutów (sila/zrecznosc/intelekt/wola)
let selectedCurios = [];
let magicChoices = {}; // atomId (ze slotu magii) -> { mode: 'tradycja'|'zaklecie', tradycjaId, spellId }
let magicRiskResults = {}; // atomId -> { spellId, rzut, przyznane } - zapamiętany rzut k6 ryzyka splugawienia
let magicBlackMagicTooTraditions = new Set(); // tradycje czarnej magii, za które już przyznano 1 Splugawienie
let availableProfessions = [];
let availableCurios = [];
let randomizedSilver = null; // 2k6 za każdy poziom powyżej 0
let numberCurios = 0; // Po 1 za poziomy wyboru ścieżek: 1, 3, 7

// --- Krok 7: Ekwipunek ---
let equipmentWealthResult = null; // wynik rzutu 3k6 (albo null, gdy zamożność wybrano ręcznie bez losowania)
let equipmentWealthId = null; // klucz z ZAMOZNOSC (np. 'komfort')
let equipmentStartingCashRoll = null; // wylosowana suma kostek startowej sakiewki (w jednostce danego poziomu zamożności)
let equipmentChoices = {}; // atomId -> { itemId } (wybor_przedmiotu) albo { typ:'zwoj_zaklecie', tradycjaId, spellId } / { typ:'przedmiot', itemId } (wybor_dodatkowy)
let equipmentSold = []; // klucze startowych pozycji (kluczStart) sprzedanych w sklepie
let equipmentPurchased = []; // { itemId, ilosc } kupione w sklepie
let equipmentDescriptionExpanded = new Set(); // klucze pozycji "Twoje przedmioty", dla których rozwinięto wiersz z opisem

// --- Krok 8: Imię postaci ---
let characterName = ''; // opcjonalne imię wpisane w Kroku 8; trafia do eksportu i nazwy pliku

// --- Zapis w pamięci przeglądarki (localStorage) ---
let currentSaveCacheId = null; // id aktualnie edytowanej postaci w cache; null = jeszcze nie zapisana / nowa postać

// --- Popup "Wylosuj postać" (boczne menu) ---
let randomizeCharacterLevel = 0; // poziom wybrany w popupie - jedyna rzecz, którą wybiera użytkownik, reszta jest losowana

// Ładowanie opcji przy starcie strony
document.addEventListener('DOMContentLoaded', async () => {
  await loadOptions();
  await loadLevels();
  initializeLevels();
  await loadPathsToTiles();
  await loadProfessionsAndCurios();
  
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
  const btnRandomizeProfessions = document.getElementById('btn-randomize-professions');
  if (btnRandomizeProfessions) {
    btnRandomizeProfessions.addEventListener('click', () => randomizeProfessionsCentrally());
  }
  const btnRandomizeCurios = document.getElementById('btn-randomize-curios');
  if (btnRandomizeCurios) {
    btnRandomizeCurios.addEventListener('click', () => randomizeCuriosCentrally());
  }

  // Handlery wyboru ścieżek i zasobów - nowy system kafelków
  // Event listenery dla ścieżek są dodawane dynamicznie w renderPathTile()
  const btnWealth = document.getElementById('btn-roll-wealth');
  if (btnWealth) {
    btnWealth.addEventListener('click', () => {
      if (selectedLevel <= 0) return;
      // 2k6 srebrników za każdy poziom powyżej 0
      let sum = 0;
      const rolls = [];
      for (let i = 0; i < selectedLevel * 2; i++) {
        const r = Math.floor(Math.random() * 6) + 1;
        rolls.push(r);
        sum += r;
      }
      randomizedSilver = sum;
      updateWealthUi(rolls, sum);
      updatePreviewCharacter();
    });
  }

  // Toggle własnych atrybutów
  document.getElementById('default-attributes').addEventListener('change', (e) => {
    const customDiv = document.getElementById('custom-attributes');
    customDiv.style.display = e.target.checked ? 'none' : 'block';
    if (e.target.checked) {
      // Wyczyść zamianę i użyj domyślnych wartości bazujących na pochodzeniu
      document.getElementById('attribute-decreased').value = '';
      document.getElementById('attribute-increased').value = '';
      aktualizujDomyślneAtrybuty();
    } else {
      updateCalculatedAttributes();
    }
  });

  // Jednorazowa zamiana wartości atrybutów (-1/+1)
  ['attribute-decreased', 'attribute-increased'].forEach(id => {
    document.getElementById(id).addEventListener('change', updateCalculatedAttributes);
  });

  // Lokalne przyciski "Wyczyść" - czyszczą tylko wybór swojej sekcji
  document.getElementById('btn-reset-origin')?.addEventListener('click', resetChoiceOrigin);
  document.getElementById('btn-randomize-step-1')?.addEventListener('click', randomizeOriginAndTraits);
  document.getElementById('btn-import-character')?.addEventListener('click', () => {
    document.getElementById('import-character-file')?.click();
  });
  document.getElementById('import-character-file')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileImport(file);
    e.target.value = ''; // pozwala ponownie wybrać ten sam plik po błędzie
  });
  document.getElementById('btn-reset-level')?.addEventListener('click', resetLevel);
  document.getElementById('btn-reset-swap')?.addEventListener('click', resetSwapAttributes);
  document.getElementById('btn-reset-origin-attribute-choice')?.addEventListener('click', resetChoiceAttributeOrigin);
  document.getElementById('btn-reset-curios')?.addEventListener('click', resetCurios);
  document.getElementById('btn-reset-professions')?.addEventListener('click', resetAllProfessionsAndLanguages);
  document.getElementById('btn-reset-magic')?.addEventListener('click', resetMagic);
  document.getElementById('magic-picker-close')?.addEventListener('click', closeMagicPicker);
  document.getElementById('magic-picker-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'magic-picker-overlay') closeMagicPicker();
  });
  document.getElementById('btn-randomize-wealth')?.addEventListener('click', randomizeWealth);
  document.getElementById('btn-reset-wealth')?.addEventListener('click', resetWealth);
  document.getElementById('equipment-picker-close')?.addEventListener('click', closeEquipmentPicker);
  document.getElementById('equipment-picker-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'equipment-picker-overlay') closeEquipmentPicker();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && magicPicker) closeMagicPicker();
    if (e.key === 'Escape' && equipmentPicker) closeEquipmentPicker();
    if (e.key === 'Escape' && !document.getElementById('load-character-overlay')?.hidden) closeLoadCharacterPopup();
    if (e.key === 'Escape' && !document.getElementById('randomize-character-overlay')?.hidden) closeRandomizeCharacterPopup();
  });
  document.querySelectorAll('[data-reset-path]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Sekcja ścieżki jest zwijana/rozwijana przez kliknięcie nagłówka -
      // nie pozwól, by kliknięcie przycisku Wyczyść też przełączało akordeon.
      e.stopPropagation();
      resetPath(btn.dataset.resetPath);
    });
  });

  // Boczne menu (nowa/wczytaj/wylosuj postać) + podpowiedzi zbudowane w JS
  document.getElementById('btn-new-character')?.addEventListener('click', () => {
    if (confirm('Rozpocząć nową postać? Bieżące, niezapisane zmiany zostaną utracone.')) newCharacter();
  });
  document.getElementById('btn-load-character')?.addEventListener('click', openLoadCharacterPopup);
  document.getElementById('btn-randomize-character')?.addEventListener('click', openRandomizeCharacterPopup);
  document.getElementById('load-character-close')?.addEventListener('click', closeLoadCharacterPopup);
  document.getElementById('load-character-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'load-character-overlay') closeLoadCharacterPopup();
  });
  document.getElementById('randomize-character-close')?.addEventListener('click', closeRandomizeCharacterPopup);
  document.getElementById('randomize-character-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'randomize-character-overlay') closeRandomizeCharacterPopup();
  });
  document.getElementById('btn-randomize-character-confirm')?.addEventListener('click', () => {
    closeRandomizeCharacterPopup();
    randomizeWholeCharacter(randomizeCharacterLevel);
  });
  document.getElementById('character-name')?.addEventListener('input', (e) => {
    characterName = e.target.value;
    updatePreviewCharacter();
  });
  initializeTooltips();
});

/**
 * Ładuje dostępne opcje z serwera
 */
async function loadOptions() {
  try {
    // Pobierz podstawowe opcje
    const opcje = {
      pochodzenia: Object.keys(GAME_DATA.pochodzenia),
      sciezki: Object.keys(GAME_DATA.sciezki_nowicjuszy)
    };

    // Sprawdź, które pochodzenia mają tabele
    let originsWithTables = [];
    try {
      const originsData = getOriginsListUi();
      originsWithTables = originsData.pochodzenia || [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Nie udało się załadować metadanych pochodzeń:', error);
    }

    // Ładowanie szczegółowych danych pochodzeń
    availableOrigin = await loadDetailsOriginsExtended(opcje.pochodzenia, originsWithTables);

    // Generowanie kafelków pochodzeń
    generateTilesOrigins(availableOrigin);

    // Wypełnianie selecta ścieżek (jeśli istnieje - dla kompatybilności wstecznej)
    const pathSelect = document.getElementById('sciezka');
    if (pathSelect) {
      pathSelect.innerHTML = '<option value="">Brak ścieżki</option>';

      opcje.sciezki.forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = id.charAt(0).toUpperCase() + id.slice(1);
        pathSelect.appendChild(option);
      });
    }

  } catch (error) {
    showError(`Nie można załadować opcji: ${  error.message}`);
  }
}

/**
 * Ładuje dostępne poziomy z serwera
 */
async function loadLevels() {
  // Poziomy są dostępne w DANE_GRY.poziomy, ale obecnie nie są używane w UI
  // (poziomy są zdefiniowane bezpośrednio w HTML)
}

/**
 * Inicjalizuje obsługę poziomów postaci
 */
function initializeLevels() {
  // Dodaj event listenery dla radio buttonów poziomów
  const levelInputs = document.querySelectorAll('input[name="poziom"]');
  levelInputs.forEach(input => {
    input.addEventListener('change', async (e) => {
      selectedLevel = parseInt(e.target.value);
      updatePathsVisibility(selectedLevel);
      updatePathsLevel(selectedLevel);
      updatePathsSectionTitle(selectedLevel);
      updateWealthSection(selectedLevel);
      updateOriginBenefits(selectedLevel);

      // Aktualizuj widoczność sekcji ścieżek i prze-renderuj kafelki,
      // aby przyciski przeszły ze stanu disabled -> enabled po zmianie poziomu
      renderPathSectionsVisibility();
      await renderPathSection(1);
      await renderPathSection(3);
      await renderPathSection(7);

      // Załaduj korzyści dla wybranego poziomu
      await loadBenefitsLevel(selectedLevel);
    });
  });

  // Inicjalizuj ścieżki dla poziomu 0 (domyślnego)
  updatePathsVisibility(0);
  updatePathsLevel(0);
  updateWealthSection(0);
  updateOriginBenefits(0);
  // Załaduj korzyści dla poziomu 0
  loadBenefitsLevel(0);

  // Breadcrumbs
  const crumbs = document.querySelectorAll('#breadcrumbs .breadcrumb-item');
  crumbs.forEach(c => {
    c.addEventListener('click', () => {
      const step = parseFloat(c.getAttribute('data-step'));
      randomizeToStep(step);
    });
  });
}

/**
 * Ładuje i renderuje kafelki ścieżek w Kroku 3
 */
async function loadPathsToTiles() {
  try {
    initializeAccordionPaths();
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
function initializeAccordionPaths() {
  document.querySelectorAll('.path-section-header').forEach(header => {
    header.addEventListener('click', () => {
      const section = header.closest('.path-section');
      if (section) section.classList.toggle('collapsed');
    });
  });
}

function renderPathSectionsVisibility() {
  const canTier3 = selectedLevel >= 3;
  const canTier7 = selectedLevel >= 7;
  const sec1 = document.getElementById('path-section-1');
  const sec3 = document.getElementById('path-section-3');
  const sec7 = document.getElementById('path-section-7');
  const g3 = document.getElementById('path-grid-3');
  const s3 = document.getElementById('path-summary-3');
  const g7 = document.getElementById('path-grid-7');
  const s7 = document.getElementById('path-summary-7');

  // Dla poziomu 0 ukryj wszystkie sekcje ścieżek
  const levelZero = selectedLevel === 0;
  if (sec1) sec1.style.display = levelZero ? 'none' : '';
  if (sec3) sec3.style.display = levelZero ? 'none' : '';
  if (sec7) sec7.style.display = levelZero ? 'none' : '';

  if (!levelZero) {
    // Dostępność sekcji eksperta i mistrza sygnalizuje opacja kafelków
    if (g3) g3.style.opacity = canTier3 ? '1' : '0.5';
    if (s3) s3.textContent = canTier3 ? '' : 'Odblokuj wyborem poziomu 3 w Kroku 2';
    if (g7) g7.style.opacity = canTier7 ? '1' : '0.5';
    if (s7) s7.textContent = canTier7 ? '' : 'Odblokuj wyborem poziomu 7 w Kroku 2';
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
  const selectedMap = { 1: selectedPaths.nowicjusz, 3: selectedPaths.ekspert, 7: selectedPaths.mistrz };
  const availableLevels = poziomy.filter(p => selectedLevel >= p);
  const activeLevel = availableLevels.find(p => !selectedMap[p]);

  poziomy.forEach(p => {
    const section = document.getElementById(`path-section-${p}`);
    if (!section) return;
    if (!availableLevels.includes(p)) {
      // Sekcja niedostępna - poza akordeonem, domyślnie zwinięta
      section.classList.add('collapsed');
      return;
    }
    section.classList.toggle('collapsed', p !== activeLevel);
  });
}

async function renderPathSection(levelChoice) {
  const gridId = `path-grid-${levelChoice}`;
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  let paths = [];
  try {
    paths = getPathsForLevel(levelChoice);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Nie udało się załadować ścieżek:', error);
    return;
  }
  for (const p of paths) {
    const tile = renderPathTile(p, levelChoice);
    grid.appendChild(tile);
  }
  // updateStep3NextButton() jest wywoływane w applyPathBenefits
}

function renderPathTile(path, levelChoice) {
  const canPick = selectedLevel >= levelChoice;
  const selectedId = levelChoice === 1 ? selectedPaths.nowicjusz : (levelChoice === 3 ? selectedPaths.ekspert : selectedPaths.mistrz);
  const isSelected = selectedId === path.id;
  const tile = document.createElement('button');
  tile.type = 'button';
  tile.className = `picker-tile path-tile${isSelected ? ' selected' : ''}${canPick ? '' : ' disabled'}`;
  if (!canPick) tile.disabled = true;
  tile.dataset.pathId = path.id;
  tile.dataset.pickLevel = levelChoice;
  tile.innerHTML = `
    <div class="picker-tile-header">
      <span>${path.nazwa}</span>
      ${isSelected ? `<span class="wealth-badge">${icon('check')} Wybrano</span>` : ''}
    </div>
    <div class="picker-tile-meta">${renderSourceTag(path.zrodlo || 'PG')} Poziom wyboru ${levelChoice}</div>
    <div class="tile-body">
      ${renderPathBenefitsList(path, levelChoice)}
    </div>
  `;
  if (canPick) {
    tile.addEventListener('click', (e) => {
      e.preventDefault();
      applyPathBenefits({ levelChoice, sciezka: path });
      // Po wyborze prze-renderuj sekcję, aby podświetlić kafel
      renderPathSection(levelChoice);
    });
  }
  return tile;
}

function renderPathBenefitsList(path, levelChoice) {
  const pkt = (path.korzysci && path.korzysci[levelChoice]) || {};
  const talenty = (pkt.talenty || []).map(t => `<li><strong>Talent:</strong> ${t.nazwa || t} – ${t.opis || ''}</li>`).join('');
  const zaklecia = (pkt.zaklecia || []).map(z => `<li><strong>Magia:</strong> ${z.opis || z.nazwa || z}</li>`).join('');
  const modAttr = pkt.mod_atrybuty ? Object.entries(pkt.mod_atrybuty).map(([k,v]) => `${ATTRIBUTE_LABELS[k] || k}: ${v>0?'+':''}${v}`).join(', ') : '';
  const modSecondary = pkt.mod_drugorzedne ? Object.entries(pkt.mod_drugorzedne).map(([k,v]) => `${SECONDARY_ATTRIBUTE_LABELS[k] || k}: ${v>0?'+':''}${v}`).join(', ') : '';
  const atrybutyGlowne = pkt.atrybuty_glowne
    ? `<li><strong>Atrybuty:</strong> Zwiększ ${pkt.atrybuty_glowne.ilosc} dowolne o ${pkt.atrybuty_glowne.wartosc} (Krok 4)</li>`
    : '';
  const literacy = (pkt.bieglosci || []).map(b => `<li><strong>Języki i profesje:</strong> ${b}</li>`).join('');
  const gear = (pkt.sprzet || []).map(s => `<li><strong>Sprzęt:</strong> ${s}</li>`).join('');
  return `
    <div class="benefit-category"><h5>Korzyści poziomu ${levelChoice}</h5>
      <ul class="path-benefits">
        ${atrybutyGlowne}
        ${talenty}
        ${zaklecia}
        ${modAttr?`<li><strong>Modyfikatory atrybutów:</strong> ${modAttr}</li>`:''}
        ${modSecondary?`<li><strong>Modyfikatory drugorzędne:</strong> ${modSecondary}</li>`:''}
        ${literacy}
        ${gear}
      </ul>
    </div>`;
}

function applyPathBenefits({ levelChoice, sciezka }) {
  // Poprzednie korzyści z tego progu (jeśli były) zostaną zastąpione niżej -
  // dodajBenefity() przelicza atrybuty drugorzędne od zera na podstawie
  // aktualnego stanu przyznaneKorzysciZeSciezek, więc nie trzeba ich osobno odjąć.
  // Zapisz wybór ścieżki w stanie uproszczonym
  const tier = PATH_TIER_BY_LEVEL[levelChoice];
  if (tier) selectedPaths[tier] = sciezka.id;

  // Zastosuj nowy pakiet korzyści
  const pkt = (sciezka.korzysci && sciezka.korzysci[levelChoice]) || {};
  grantedBenefitsWithPaths[levelChoice] = { pathId: sciezka.id, sciezkaNazwa: sciezka.nazwa, levelChoice, pkt };
  addBenefits(pkt);
  updatePreviewCharacter();
  renderPathSummary(levelChoice, sciezka);
  updatePathAccordion();
  updateStep3NextButton();
  // Sekcja "Korzyści Poziomu" w Kroku 2 pokazuje korzyści ze ścieżki
  // przypisanej do bieżącego poziomu - po zmianie ścieżki trzeba ją
  // przeliczyć, inaczej zostałaby przy stanie "Brak ścieżki".
  loadBenefitsLevel(selectedLevel);
}

/**
 * Włącza przycisk "Dalej" w Kroku 3, gdy wybrane są wymagane ścieżki
 */
function updateStep3NextButton() {
  const btn = document.getElementById('btn-next-3');
  if (!btn) return;
  
  // Dla poziomu 0 nie wymagaj żadnych ścieżek
  if (selectedLevel === 0) {
    btn.disabled = false;
    return;
  }
  
  const hasNovice = !!selectedPaths.nowicjusz;
  const needExpert = selectedLevel >= 3;
  const needMaster = selectedLevel >= 7;
  const hasExpert = !!selectedPaths.ekspert;
  const hasMaster = !!selectedPaths.mistrz;
  const canProceed = hasNovice && (!needExpert || hasExpert) && (!needMaster || hasMaster);
  btn.disabled = !canProceed;
}

function renderPathSummary(levelChoice, sciezka) {
  const box = document.getElementById(`path-summary-${levelChoice}`);
  if (!box) return;
  box.innerHTML = `<div class="inline-box">Wybrana ścieżka: <strong>${sciezka.nazwa}</strong> – zastosowano korzyści poziomu ${levelChoice}</div>`;
}

/**
 * Sumuje wymuszone podwyżki atrybutów głównych ze wszystkich aktualnie
 * wybranych ścieżek. Liczone od zera przy każdym przeliczeniu - inaczej
 * ponowne kliknięcie tej samej ścieżki dodawałoby bonus drugi raz.
 */
function sumAttributeBonusesFromPaths() {
  const suma = { sila: 0, zrecznosc: 0, intelekt: 0, wola: 0 };
  Object.values(grantedBenefitsWithPaths).forEach(wpis => {
    const mod = wpis && wpis.pkt && wpis.pkt.mod_atrybuty;
    if (!mod) return;
    Object.entries(mod).forEach(([atrybut, wartosc]) => {
      if (atrybut in suma) suma[atrybut] += wartosc;
    });
  });
  return suma;
}

function addBenefits(pkt) {
  // Atrybuty główne zależą od wybranych ścieżek, więc przelicz je od zera
  // (updateCalculatedAttributes() dolicza sumAttributeBonusesFromPaths()).
  if (pkt.mod_atrybuty) {
    updateCalculatedAttributes();
    return;
  }
  // Atrybuty drugorzędne – przeliczenie przez naszą funkcję
  const pochodzenie = selectedOrigin && availableOrigin.find(p=>p.id===selectedOrigin);
  if (pochodzenie) {
    const atrybuty = {
      sila: parseInt(document.getElementById('strength-final').textContent),
      zrecznosc: parseInt(document.getElementById('agility-final').textContent),
      intelekt: parseInt(document.getElementById('intellect-final').textContent),
      wola: parseInt(document.getElementById('will-final').textContent)
    };
    updateAttributesSecondary(atrybuty, pochodzenie);
  }
}

function subtractBenefits(prev) {
  const pkt = prev.pkt || {};
  // Podobnie jak przy dodawaniu: atrybuty główne przelicza od zera
  // updateCalculatedAttributes(), po wyczyszczeniu wpisu ścieżki.
  if (pkt.mod_atrybuty) {
    updateCalculatedAttributes();
    return;
  }
  const pochodzenie = selectedOrigin && availableOrigin.find(p=>p.id===selectedOrigin);
  if (pochodzenie) {
    const atrybuty = {
      sila: parseInt(document.getElementById('strength-final').textContent),
      zrecznosc: parseInt(document.getElementById('agility-final').textContent),
      intelekt: parseInt(document.getElementById('intellect-final').textContent),
      wola: parseInt(document.getElementById('will-final').textContent)
    };
    updateAttributesSecondary(atrybuty, pochodzenie);
  }
}

/**
 * Aktualizuje dostępne ścieżki na podstawie wybranego poziomu
 * @param {number} poziom - Wybrany poziom postaci
 */
async function updatePathsLevel(_level) {
  // Nowy system kafelków - funkcja jest już obsługiwana przez renderPathSectionsVisibility()
  // i renderPathSection() w głównym flow
}


/**
 * Aktualizuje tytuł sekcji ścieżek na podstawie poziomu
 * @param {number} poziom - Wybrany poziom postaci
 */
function updatePathsSectionTitle(poziom) {
  const title = document.getElementById('path-section-title');
  if (!title) return;

  const namesLevels = {
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

  title.textContent = namesLevels[poziom] || 'Ścieżki';
}

/**
 * Ustawia widoczność selectów ścieżek w zależności od poziomu
 */
function updatePathsVisibility(_level) {
  // Funkcja jest już obsługiwana przez renderPathSectionsVisibility()
  renderPathSectionsVisibility();
}

/**
 * Aktualizuje sekcję zasobów (złoto i kurioza) na podstawie poziomu
 */
function updateWealthSection(poziom) {
  const secondary = document.getElementById('wealth-section');
  if (!secondary) return;
  secondary.style.display = poziom > 0 ? 'block' : 'none';
  numberCurios = calculateChoiceCount().kurioza;
  const curiosSpan = document.getElementById('curios-summary');
  if (curiosSpan) curiosSpan.textContent = `Kurioza: ${numberCurios}`;
  const wealthSpan = document.getElementById('wealth-summary');
  if (wealthSpan && randomizedSilver != null) {
    wealthSpan.textContent = `Srebrniki: ${randomizedSilver}`;
  }
}

/**
 * Uaktualnia wyświetlanie bogactwa po losowaniu
 */
function updateWealthUi(rolls, sum) {
  const wealthSpan = document.getElementById('wealth-summary');
  if (wealthSpan) {
    wealthSpan.textContent = `Srebrniki: ${sum} (rzuty: ${rolls.join(', ')})`;
  }
}

/**
 * Aktualizuje sekcję korzyści z pochodzenia na podstawie poziomu
 */
function updateOriginBenefits(poziom) {
  const secondary = document.getElementById('origin-benefits-section');
  if (!secondary) return;
  
  // Pokaż sekcję tylko dla poziomu 4
  secondary.style.display = poziom >= 4 ? 'block' : 'none';
  
  if (poziom >= 4 && selectedOrigin) {
    updateOriginBenefitsContent();
    // Zaktualizuj atrybuty z bonusem z poziomu 4
    updateAttributesWithLevel4();
  }
}

/**
 * Aktualizuje zawartość korzyści z pochodzenia
 */
function updateOriginBenefitsContent() {
  const content = document.getElementById('origin-benefits-content');
  if (!content || !selectedOrigin) return;
  
  const pochodzenie = availableOrigin.find(p => p.id === selectedOrigin);
  if (!pochodzenie || !pochodzenie.poziom_4) return;
  
  const benefits = pochodzenie.poziom_4;
  
  // Wyświetl korzyści z pochodzenia dla poziomu 4
  content.innerHTML = `
    <div class="benefit-item">
      <h5>Korzyści z Pochodzenia: ${pochodzenie.nazwa} (Poziom 4)</h5>
      <div class="origin-benefits-details">
        ${parseInt(benefits.zdrowie.replace('+', '')) > 0 ? `
        <div class="health-bonus">
          <h6>${icon('heart')} Bonus do Zdrowia</h6>
          <p><strong>Zdrowie:</strong> +${benefits.zdrowie.replace('+', '')}</p>
        </div>
        ` : ''}

        <div class="options-selection">
          <h6>${icon('bolt')} Wybierz Opcję</h6>
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
          <h6>${icon('book')} Opisy Talentów</h6>
          ${generateTalentDescriptions(benefits.opcje)}
        </div>
      </div>
    </div>
  `;
  
  // Dodaj event listenery dla wyboru opcji
  addOptionEventListeners(pochodzenie.id);
}

/**
 * Generuje opisy opcji korzyści z pochodzenia na poziomie 4. Opisy talentów
 * pochodzą z logic/talents.js - jedynego miejsca, w którym są utrzymywane.
 */
function generateTalentDescriptions(opcje) {
  return opcje.map(opcja => {
    if (opcja.startsWith('talent ')) {
      return `
        <div class="talent-description">
          <strong>${opcja}:</strong> ${getTalentDescription(opcja)}
        </div>
      `;
    }
    if (opcja === '1 zaklęcie') {
      return `
        <div class="spell-description">
          <strong>1 zaklęcie:</strong> Uczysz się jednego zaklęcia z tradycji, którą już znasz.
        </div>
      `;
    }
    if (opcja === 'zwiększenie Zdrowia o 4') {
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
function addOptionEventListeners(originId) {
  const radioButtons = document.querySelectorAll(`input[name="origin-option-${originId}"]`);
  radioButtons.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.checked) {
        // Zaktualizuj obliczone atrybuty z bonusem do zdrowia
        updateAttributesWithLevel4();
      }
    });
  });
}

/**
 * Aktualizuje atrybuty z uwzględnieniem bonusu z poziomu 4
 */
function updateAttributesWithLevel4() {
  if (selectedLevel < 4 || !selectedOrigin) return;
  
  const pochodzenie = availableOrigin.find(p => p.id === selectedOrigin);
  if (!pochodzenie || !pochodzenie.poziom_4) return;
  
  const healthBonus = parseInt(pochodzenie.poziom_4.zdrowie.replace('+', ''));
  
  // Pobierz aktualne atrybuty
  const atrybuty = {
    sila: parseInt(document.getElementById('strength-final').textContent),
    zrecznosc: parseInt(document.getElementById('agility-final').textContent),
    intelekt: parseInt(document.getElementById('intellect-final').textContent),
    wola: parseInt(document.getElementById('will-final').textContent)
  };
  
  // Dodaj bonus do zdrowia
  const attributesWithBonus = {
    ...atrybuty,
    zdrowie: atrybuty.sila + healthBonus
  };
  
  // Aktualizuj wyświetlane atrybuty drugorzędne
  updateAttributesSecondary(attributesWithBonus, pochodzenie);
}

/**
 * Ładuje rozszerzone dane pochodzeń z nowego API
 * @param {Array} pochodzeniaIds - Lista ID pochodzeń
 * @param {Array} pochodzeniaZTabelami - Lista metadanych pochodzeń z tabelami
 * @returns {Array} Tablica obiektów pochodzeń z pełnymi danymi
 */
async function loadDetailsOriginsExtended(originIds, _originsWithTables = []) {
  const pochodzenia = [];
  
  // Dopuszczalne źródła zgodne z katalogiem SOURCES
  const allowedSources = new Set(['PG', 'SP', 'RA', 'NW', 'GWP', 'GP', 'SUP', 'CS']);
  
  for (const originId of originIds) {
    try {
      // Pobierz podstawowe dane pochodzenia
      const character = buildCharacter({
        pochodzenie: originId,
        atrybuty: { sila: 10, zrecznosc: 10, intelekt: 10, wola: 10 }
      });
      // Kopia płytka, żeby nie mutować współdzielonego obiektu z DANE_GRY
      const basicData = { ...character.pochodzenie };

      // Filtrowanie pochodzeń tylko do tych z dokumentów SOURCES
      if (!basicData || !basicData.zrodlo || !allowedSources.has(basicData.zrodlo)) {
        continue;
      }

      // Spróbuj zawsze pobrać tabele (niezależnie od metadanych), jeśli istnieją
      try {
        const tabele = getOriginTablesUi(originId);
        if (tabele) {
          basicData.tabele = tabele;
        }
      } catch (tablesError) {
        // eslint-disable-next-line no-console
        console.warn(`Nie udało się załadować tabel dla pochodzenia ${originId}:`, tablesError);
      }

      pochodzenia.push(basicData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(`Nie udało się załadować danych dla pochodzenia ${originId}:`, error);
    }
  }
  
  return pochodzenia;
}

/**
 * Generuje rozwijane kafelki pochodzeń z dwoma stanami (zwinięty/rozwinięty)
 * @param {Array} pochodzenia - Lista obiektów pochodzeń z danymi
 * @throws {Error} Gdy parametr nie jest tablicą
 */
function generateTilesOrigins(pochodzenia) {
  if (!Array.isArray(pochodzenia)) {
    throw new Error('pochodzenia musi być tablicą');
  }
    
  const container = document.getElementById('origin-tiles');
  if (!container) {
    throw new Error('Element #origin-tiles nie został znaleziony');
  }
    
  container.innerHTML = '';

  pochodzenia.forEach(pochodzenie => {
    const tile = document.createElement('div');
    tile.className = 'origin-tile compact';
    tile.dataset.originId = pochodzenie.id;
        
    // Krótki opis (1 zdanie) dla stanu zwiniętego
    const shortDescription = createShortCollapsedDescription(pochodzenie);
        
    // Rozszerzony opis (3 zdania) dla stanu rozwiniętego
    const extendedDescription = createExtendedDescription(pochodzenie);
        
    // Oblicz atrybuty drugorzędne
    const atrybutyDomyślne = { sila: 10, zrecznosc: 10, intelekt: 10, wola: 10 };
    const attributesFinal = {
      sila: atrybutyDomyślne.sila + (pochodzenie.atrybuty_bazowe.sila - 10),
      zrecznosc: atrybutyDomyślne.zrecznosc + (pochodzenie.atrybuty_bazowe.zrecznosc - 10),
      intelekt: atrybutyDomyślne.intelekt + (pochodzenie.atrybuty_bazowe.intelekt - 10),
      wola: atrybutyDomyślne.wola + (pochodzenie.atrybuty_bazowe.wola - 10)
    };
        
    // Oblicz obronę (bez modyfikatorów rozmiaru - zgodnie z zasadami gry)
    const obrona = attributesFinal.zrecznosc;
    const zdrowie = attributesFinal.sila;
        
    // Pobierz wszystkie cechy specjalne dla stanu rozwiniętego
    const allTraits = getAllTraits(pochodzenie.cechy_specjalne);

    tile.innerHTML = `
            <div class="tile-top">
            <img class="origin-thumb" src="assets/origins/${pochodzenie.id}.jpg" alt="" loading="lazy" onerror="this.remove()">
            <div class="tile-body">
            <div class="tile-header">
                <div class="badges-container">
                    <div class="feature-desc">rozmiar:</div><div class="size-badge">${pochodzenie.rozmiar}</div>
                    ${pochodzenie.zrodlo ? `<div class="source-badge" title="${FULL_SOURCE_NAMES[pochodzenie.zrodlo] || pochodzenie.zrodlo}">${pochodzenie.zrodlo}</div>` : ''}
                </div>
                <h4>${pochodzenie.nazwa}</h4>
            </div>

            <!-- Stan zwinięty -->
            <div class="tile-content-collapsed">
                <div class="description">${shortDescription}</div>
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

            <!-- Górna część stanu rozwiniętego - obok obrazka, tak jak w stanie
                 zwiniętym (ten sam układ: obrazek | opis + atrybuty) -->
            <div class="tile-content-expanded-top">
                <div class="expanded-description">${extendedDescription}</div>
                <div class="tile-section attributes-section">
                    <h5>${icon('swords')} Atrybuty</h5>
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
            </div>
            </div>
            </div>

            <!-- Dolna część stanu rozwiniętego - na całą szerokość kafelka,
                 pod obrazkiem, żadna sekcja tu nie jest zwężana przez jego kolumnę -->
            <div class="tile-content-expanded-extra">
                <div class="tile-sections">
                    <div class="tile-section mechanics-section">
                        <h5>${icon('dice')} Atrybuty drugorzędne</h5>
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
                        <h5>${icon('compass')} Kulturowe</h5>
                        <div class="cultural-info">
                            <div class="cultural-item">
                                <span class="cultural-label">Języki:</span>
                                <span class="cultural-value">${formatLanguagesOrigin(pochodzenie.jezyki)}</span>
                            </div>
                            <div class="cultural-item">
                                <span class="cultural-label">Profesje:</span>
                                <span class="cultural-value">${formatBonusProfessionsOrigin(pochodzenie)}</span>
                            </div>
                        </div>
                    </div>

                    ${allTraits ? `
                    <div class="tile-section features-section">
                        <h5>${icon('sparkle')} Cechy Specjalne</h5>
                        <div class="features-list">
                            ${allTraits.map(cecha => `
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
                        <h5>${icon('dice')} Tabele Losowania</h5>
                        <div class="tables-grid">
                            ${Object.entries(pochodzenie.tabele).map(([nameTable, tabela]) => `
                                <div class="table-item">
                                    <div class="table-header">
                                        <span class="table-name">${tabela.nazwa}</span>
                                        <span class="table-type">${tabela.typ}</span>
                                    </div>
                                    <div class="table-description">${tabela.opis}</div>

                                    <div class="table-controls">
                                        <div class="table-options">
                                            <label for="table-select-${pochodzenie.id}-${nameTable}">Wybierz opcję:</label>
                                            <select id="table-select-${pochodzenie.id}-${nameTable}" class="table-dropdown" data-origin-id="${pochodzenie.id}" data-table-name="${nameTable}">
                                                <option value="">-- Wybierz opcję --</option>
                                                ${tabela.opcje ? tabela.opcje.map(opcja => `
                                                    <option value="${opcja.rzut}" data-wynik="${opcja.wynik}">${opcja.rzut}: ${opcja.wynik}</option>
                                                `).join('') : ''}
                                            </select>
                                        </div>

                                        <div class="table-buttons">
                                            <button class="roll-table-btn" data-origin-id="${pochodzenie.id}" data-table-name="${nameTable}">
                                                ${icon('dice')} Losuj
                                            </button>
                                            <button class="apply-selection-btn" data-origin-id="${pochodzenie.id}" data-table-name="${nameTable}" style="display: none;">
                                                ${icon('check')} Zastosuj wybór
                                            </button>
                                        </div>
                                    </div>

                                    <div class="roll-result" id="roll-result-${pochodzenie.id}-${nameTable}" style="display: none;">
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
        selectOrigin(pochodzenie.id);
        return;
      }
      
      // Sprawdź czy kliknięto na przycisk losowania
      if (e.target.classList.contains('roll-table-btn') || 
                e.target.closest('.roll-table-btn')) {
        e.stopPropagation();
        const originId = e.target.dataset.originId || e.target.closest('.roll-table-btn').dataset.originId;
        const tableName = e.target.dataset.tableName || e.target.closest('.roll-table-btn').dataset.tableName;
        randomizeWithTableUi(originId, tableName);
        return;
      }
      
      // Sprawdź czy kliknięto na przycisk "Zastosuj wybór"
      if (e.target.classList.contains('apply-selection-btn') || 
                e.target.closest('.apply-selection-btn')) {
        e.stopPropagation();
        const originId = e.target.dataset.originId || e.target.closest('.apply-selection-btn').dataset.originId;
        const tableName = e.target.dataset.tableName || e.target.closest('.apply-selection-btn').dataset.tableName;
        applySelectedOptions(originId, tableName);
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
function createShortCollapsedDescription(pochodzenie) {
  const descriptions = {
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
    
  return descriptions[pochodzenie.id] || 'Nieznane pochodzenie.';
}

/**
 * Tworzy rozszerzony opis pochodzenia (3 zdania) dla stanu rozwiniętego
 * @param {Object} pochodzenie - Obiekt pochodzenia
 * @returns {string} Rozszerzony opis
 */
function createExtendedDescription(pochodzenie) {
  const descriptions = {
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
    
  return descriptions[pochodzenie.id] || 'Nieznane pochodzenie.';
}


/**
 * Zbiera wyniki tabel z kafelka pochodzenia
 * @param {string} originId - ID pochodzenia
 */
function collectResultsTables(originId) {
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
            const rollMatch = rollDice.textContent.match(/(\d+)/);
            const rzut = rollMatch ? rollMatch[1] : '?';
            const wynik = rollOutcome.textContent;
            const typ = rollDice.textContent.includes('Wybór') ? 'wybór' : 'losowanie';
            
            // Zapisz wynik
            if (!resultsTables[originId]) {
              resultsTables[originId] = {};
            }
            resultsTables[originId][tableName] = {
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
async function randomizeOriginAndTraits() {
  if (!availableOrigin.length) return;

  const random = availableOrigin[Math.floor(Math.random() * availableOrigin.length)];

  if (random.tabele) {
    for (const nameTable of Object.keys(random.tabele)) {
      await randomizeWithTableUi(random.id, nameTable);
    }
  }

  selectOrigin(random.id);
}

/**
 * Wybiera pochodzenie
 * @param {string} originId - ID pochodzenia do wyboru
 * @param {Object} [opcje]
 * @param {boolean} [opcje.autoScroll=true] - Czy przewinąć do przycisku "Dalej"
 *   po wyborze. Wyłączane przy imporcie postaci (zob. zaimportujPostac()), żeby
 *   nie odciągać strony od komunikatu importu, zanim użytkownik zdąży go przeczytać.
 */
function selectOrigin(originId, { autoScroll = true } = {}) {
  // Resetuj stan i UI dla poprzedniego wyboru
  resetStateAfterOriginChange();

  selectedOrigin = originId;
    
  // Zbierz wyniki tabel z wybranego kafelka
  collectResultsTables(originId);
    
  // Usuń selekcję z wszystkich kafelków
  document.querySelectorAll('.origin-tile').forEach(tile => {
    tile.classList.remove('selected');
  });
    
  // Dodaj selekcję do wybranego kafelka
  const selectedTile = document.querySelector(`[data-origin-id="${originId}"]`);
  if (selectedTile) {
    selectedTile.classList.add('selected');
        
    // Zwiń wszystkie kafelki po wyborze pochodzenia
    collapseAllTiles();
        
    // Aktualizuj podsumowanie pochodzenia
    updateSummaryOrigin();
        
    // Aktualizuj domyślne atrybuty
    aktualizujDomyślneAtrybuty();
  }

  // Aktywuj przycisk "Dalej" w kroku 1
  const nextButton = document.getElementById('btn-next-1');
  if (nextButton) {
    nextButton.disabled = false;
  }

  // Pokaż komunikat o wyborze
  showMessageChoice(originId);

  // Przewiń do wybranego (teraz zwiniętego) kafelka, żeby użytkownik widział
  // potwierdzenie wyboru - collapseAllTiles() wyżej zmienia wysokość strony,
  // więc bez tego widok mógłby zostać w losowym miejscu.
  if (autoScroll) {
    requestAnimationFrame(() => {
      selectedTile?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
}

/**
 * Resetuje wszystkie dane kolejnych kroków po zmianie pochodzenia
 */
function resetStateAfterOriginChange() {
  // Reset stanu aplikacji
  currentCharacter = null;
  selectedLevel = 0;
  selectedPaths = { nowicjusz: '', ekspert: '', mistrz: '' };
  grantedBenefitsWithPaths = { 1: null, 3: null, 7: null };
  selectedProfessions = [];
  answersSlots = {};
  selectedAttributesSlots = {};
  selectedCurios = [];
  magicChoices = {};
  magicRiskResults = {};
  magicBlackMagicTooTraditions = new Set();
  randomizedSilver = null;
  numberCurios = 0;
  resultsTables = {};
  equipmentWealthResult = null;
  equipmentWealthId = null;
  equipmentStartingCashRoll = null;
  equipmentChoices = {};
  equipmentSold = [];
  equipmentPurchased = [];
  equipmentDescriptionExpanded = new Set();

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
  const chkDefault = document.getElementById('default-attributes');
  if (chkDefault) chkDefault.checked = true;
  const customDiv = document.getElementById('custom-attributes');
  if (customDiv) customDiv.style.display = 'none';
  ['attribute-decreased', 'attribute-increased'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['strength-base','agility-base','intellect-base','will-base'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = 10;
  });

  // Reset korzyści z pochodzenia (krok 2)
  const originBenefits = document.getElementById('origin-benefits-content');
  if (originBenefits) originBenefits.innerHTML = '';

  // Ukryj/pokaż sekcje zależne od poziomu na start (0)
  updateWealthSection(0);
  updateOriginBenefits(0);
  // Radio poziomu 0 jest zaznaczane wyżej przez ustawienie .checked wprost,
  // co NIE odpala eventu 'change' (a to on normalnie woła loadBenefitsLevel) -
  // bez tego wywołania "Korzyści Poziomu" zostawałyby z treścią poprzedniej postaci.
  loadBenefitsLevel(0);
  
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
    if (!selectedOrigin) {
      showError('Wybierz pochodzenie postaci!');
      return;
    }
    showStep(2);
    updateSummaryOrigin();
    aktualizujDomyślneAtrybuty();
  } else if (currentStep === 2) {
    showStep(3);
    updatePreviewCharacter();
  } else if (currentStep === 3) {
    showStep(4);
    renderAttributesSlotsSection();
  } else if (currentStep === 4) {
    showStep(5);
    renderProfessionsSection();
    renderCuriosSection();
  } else if (currentStep === 5) {
    showStep(6);
    renderSpellsSection();
  } else if (currentStep === 6) {
    showStep(7);
    renderEquipmentSection();
  } else if (currentStep === 7) {
    showStep(8);
    updatePreviewCharacter();
  }
}

/**
 * Nawigacja do poprzedniego kroku
 */
// eslint-disable-next-line no-unused-vars
function prevStep(currentStep) {
  if (currentStep === 2) {
    showStep(1);
  } else if (currentStep === 3) {
    showStep(2);
  } else if (currentStep === 4) {
    showStep(3);
  } else if (currentStep === 5) {
    showStep(4);
  } else if (currentStep === 6) {
    showStep(5);
  } else if (currentStep === 7) {
    showStep(6);
  } else if (currentStep === 8) {
    showStep(7);
  }
}

/**
 * Pokazuje określony krok
 */
function showStep(stepNumber) {
  // Ukryj wszystkie kroki
  document.querySelectorAll('.step').forEach(step => {
    step.classList.remove('active');
  });

  // Pokaż wybrany krok
  document.getElementById(`step-${stepNumber}`).classList.add('active');
  // aktualnyKrok = stepNumber; // Obecnie nieużywane
  updateBreadcrumbs(stepNumber);

  // Każde dotarcie do Kroku 8 (Podgląd) zapisuje/nadpisuje bieżącą postać
  // w pamięci przeglądarki - niezależnie od tego, czy trafiono tu przyciskiem
  // "Dalej", z górnego menu, czy programowo (zob. losujCalaPostac()).
  if (stepNumber === 8) saveCurrentCharacterToCache();
}

/**
 * Zapisuje (albo nadpisuje, jeśli edytowana postać już ma przypisane id w
 * cache - np. po imporcie) bieżącą postać w localStorage, w tym samym
 * formacie co eksport do JSON. Nic nie robi, jeśli postać jest niekompletna
 * (zbudujDaneEksportu() zwraca wtedy null).
 */
function saveCurrentCharacterToCache() {
  const data = buildExportData();
  if (!data) return;
  if (!currentSaveCacheId) currentSaveCacheId = generateSaveId();
  saveCharacterToCache(currentSaveCacheId, data);
}

/**
 * Przechodzi do kroku z pełnym odświeżeniem UI zależnym od niego
 */
function randomizeToStep(stepNumber) {
  // Proste reguły walidacji: nie pozwól przejść dalej bez wymagań
  if (stepNumber === 2 && !selectedOrigin) return;
  if (stepNumber === 3) {
    if (!selectedOrigin) return;
  }
  if (stepNumber === 4) {
    // Dla poziomu 0 nie wymagaj żadnych ścieżek
    if (selectedLevel === 0) return;

    // Wymagane ścieżki zgodnie z poziomem
    const needExpert = selectedLevel >= 3;
    const needMaster = selectedLevel >= 7;
    if (!selectedPaths.nowicjusz) return;
    if (needExpert && !selectedPaths.ekspert) return;
    if (needMaster && !selectedPaths.mistrz) return;
  }
  if (stepNumber === 5) {
    // Wymagane rozdanie punktów zwiększenia atrybutów (Krok 4)
    const slotsAttr = calculateSlotsAttributes({
      pathNoviceId: selectedPaths.nowicjusz || null,
      pathExpertId: selectedPaths.ekspert || null,
      pathMasterId: selectedPaths.mistrz || null
    });
    if (!slotsAttr.every(slotAttributesComplete)) return;
  }
  if (stepNumber === 6 || stepNumber === 7 || stepNumber === 8) {
    // Wymagane profesje/języki i kurioza (Kroki 6 i 7 są opcjonalne, ale
    // wciąż wymagają, że Krok 5 zostanie zakończony, tak jak wcześniej
    // wymagał tego Krok 8)
    const { kurioza } = calculateChoiceCount();
    const { slots } = calculateSlotsCharacter();
    if (!slots.every(slot => slotAnswerComplete(slot))) return;
    if (selectedCurios.length < kurioza) return;
  }
  showStep(stepNumber);
  if (stepNumber === 3) {
    renderPathSectionsVisibility();
    renderPathSection(1);
    renderPathSection(3);
    renderPathSection(7);
    updateStep3NextButton();
  }
  if (stepNumber === 4) {
    renderAttributesSlotsSection();
  }
  if (stepNumber === 5) {
    renderProfessionsSection();
    renderCuriosSection();
  }
  if (stepNumber === 6) {
    renderSpellsSection();
  }
  if (stepNumber === 7) {
    renderEquipmentSection();
  }
  if (stepNumber === 8) {
    updatePreviewCharacter();
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
function updateSummaryOrigin() {
  if (!selectedOrigin) return;
    
  const pochodzenie = availableOrigin.find(p => p.id === selectedOrigin);
  if (!pochodzenie) return;
    
  const container = document.getElementById('selected-origin-info');
  container.innerHTML = `
        <h4>${pochodzenie.nazwa}</h4>
        <p><strong>Opis:</strong> ${pochodzenie.opis}</p>
        <p><strong>Rozmiar:</strong> ${pochodzenie.rozmiar} | <strong>Prędkość:</strong> ${pochodzenie.predkosc}</p>
        <p><strong>Języki:</strong> ${formatLanguagesOrigin(pochodzenie.jezyki)}</p>
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
function calculateAttributesMain(pochodzenie, zmniejszony, zwiekszony, bonusAttributes) {
  const atrybuty = { ...pochodzenie.atrybuty_bazowe };
  if (zmniejszony && zwiekszony && zmniejszony !== zwiekszony) {
    atrybuty[zmniejszony] -= 1;
    atrybuty[zwiekszony] += 1;
  }
  if (pochodzenie.wybor_atrybutu && bonusAttributes) {
    const wartosc = pochodzenie.wybor_atrybutu.wartosc || 1;
    bonusAttributes.forEach(atr => {
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
  const section = document.getElementById('origin-attribute-choice-section');
  const selectsDiv = document.getElementById('origin-attribute-choice-selects');
  const hint = document.getElementById('origin-attribute-choice-hint');
  if (!section || !selectsDiv || !hint) return;

  const wybor = pochodzenie && pochodzenie.wybor_atrybutu;
  if (!wybor) {
    section.style.display = 'none';
    selectsDiv.innerHTML = '';
    return;
  }

  section.style.display = 'block';
  hint.textContent = `${pochodzenie.nazwa}: ${wybor.opis}. Wybierz ${wybor.ilosc > 1 ? `${wybor.ilosc} różne atrybuty` : 'atrybut'}.`;

  const ATTRIBUTES = [
    ['sila', 'Siła'], ['zrecznosc', 'Zręczność'], ['intelekt', 'Intelekt'], ['wola', 'Wola']
  ];
  const optionsHtml = (selectId) => `
    <option value="">-- brak wyboru --</option>
    ${ATTRIBUTES.map(([val, label]) => `<option value="${val}" id="${selectId}-opt-${val}">${label}</option>`).join('')}
  `;

  selectsDiv.innerHTML = Array.from({ length: wybor.ilosc }, (_, i) => {
    const selectId = `origin-attr-choice-${i}`;
    return `
      <div class="form-group">
        <label for="${selectId}">Atrybut ${i + 1}:</label>
        <select id="${selectId}" class="origin-attr-choice-select">${optionsHtml(selectId)}</select>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.origin-attr-choice-select').forEach(sel => {
    sel.addEventListener('change', () => {
      refreshSelectsChoiceAttribute();
      updateCalculatedAttributes();
    });
  });
  refreshSelectsChoiceAttribute();
}

/**
 * Wyłącza w każdym selectcie wyboru atrybutu bonusowego opcje już wybrane
 * w innych selectach, by nie dało się wybrać tego samego atrybutu dwa razy.
 */
function refreshSelectsChoiceAttribute() {
  const selects = Array.from(document.querySelectorAll('.origin-attr-choice-select'));
  const selected = selects.map(s => s.value).filter(Boolean);
  selects.forEach(sel => {
    Array.from(sel.options).forEach(opt => {
      opt.disabled = !!opt.value && opt.value !== sel.value && selected.includes(opt.value);
    });
  });
}

/**
 * Odczytuje aktualnie wybrane atrybuty bonusowe z pochodzenia z selectów
 * wyrenderowanych przez renderOriginAttributeChoiceSection.
 * @returns {string[]}
 */
function getSelectedAttributesBonus() {
  return Array.from(document.querySelectorAll('.origin-attr-choice-select'))
    .map(s => s.value)
    .filter(Boolean);
}

/**
 * Czyści wybór atrybutu(ów) bonusowego z pochodzenia (Krok 2).
 */
function resetChoiceAttributeOrigin() {
  document.querySelectorAll('.origin-attr-choice-select').forEach(sel => { sel.value = ''; });
  refreshSelectsChoiceAttribute();
  updateCalculatedAttributes();
}

/**
 * Aktualizuje wybory dostępne w selektach zamiany atrybutów, by nie można
 * było wybrać tego samego atrybutu do obniżenia i podniesienia, oraz
 * odświeża informację o puli atrybutów.
 */
function refreshAttributeSwapSelects(pochodzenie) {
  const selDecreased = document.getElementById('attribute-decreased');
  const selIncreased = document.getElementById('attribute-increased');
  const info = document.getElementById('attribute-pool-info');
  if (!selDecreased || !selIncreased) return;

  const valueDecreased = selDecreased.value;
  const valueIncreased = selIncreased.value;

  Array.from(selDecreased.options).forEach(opt => {
    opt.disabled = !!opt.value && opt.value === valueIncreased;
  });
  Array.from(selIncreased.options).forEach(opt => {
    opt.disabled = !!opt.value && opt.value === valueDecreased;
  });

  if (info && pochodzenie) {
    const pool = Object.values(pochodzenie.atrybuty_bazowe).reduce((a, b) => a + b, 0);
    info.textContent = `Pula atrybutów pochodzenia: ${pool} (suma się nie zmienia po zamianie).`;
  }
}

/**
 * Czyści wybór pochodzenia (Krok 1) i cały zależny od niego stan
 * (poziom, ścieżki, profesje/języki, kurioza).
 */
function resetChoiceOrigin() {
  resetStateAfterOriginChange();
  selectedOrigin = null;
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
function resetLevel() {
  const radio0 = document.querySelector('input[name="poziom"][value="0"]');
  if (radio0) {
    radio0.checked = true;
    radio0.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

/**
 * Czyści jednorazową zamianę wartości atrybutów (Krok 2).
 */
function resetSwapAttributes() {
  const selDecreased = document.getElementById('attribute-decreased');
  const selIncreased = document.getElementById('attribute-increased');
  if (selDecreased) selDecreased.value = '';
  if (selIncreased) selIncreased.value = '';
  updateCalculatedAttributes();
}

/**
 * Czyści wybór jednej ścieżki (Krok 3) - nowicjusza, eksperckiej lub
 * mistrzowskiej - wraz z korzyściami, które ta ścieżka przyznała.
 * @param {'nowicjusz'|'ekspert'|'mistrz'} tier
 */
function resetPath(tier) {
  const levelChoice = PATH_LEVEL_BY_TIER[tier];
  if (!levelChoice) return;

  if (grantedBenefitsWithPaths[levelChoice]) {
    const removedBenefit = grantedBenefitsWithPaths[levelChoice];
    // Wyczyść stan PRZED przeliczeniem, by sumujBonusyDrugorzedneZeSciezek()
    // (wywoływane wewnątrz odejmijBenefity) nie liczyło już usuwanej ścieżki.
    grantedBenefitsWithPaths[levelChoice] = null;
    subtractBenefits(removedBenefit);
  }
  selectedPaths[tier] = '';

  const summaryEl = document.getElementById(`path-summary-${levelChoice}`);
  if (summaryEl) summaryEl.innerHTML = '';

  renderPathSectionsVisibility();
  renderPathSection(levelChoice);
  updatePreviewCharacter();
  updateStep3NextButton();
  loadBenefitsLevel(selectedLevel);
}

/**
 * Czyści wszystkie wybrane kurioza (Krok 5).
 */
function resetCurios() {
  selectedCurios = [];
  renderCuriosSection();
  updateStep5NextButton();
}

/**
 * Czyści wszystkie sloty profesji i języków (Krok 5), by umożliwić
 * ponowny wybór od zera - w przeciwieństwie do lokalnego "Wyczyść" na
 * pojedynczej karcie, ten przycisk resetuje całą sekcję Profesje/Języki.
 */
function resetAllProfessionsAndLanguages() {
  answersSlots = {};
  renderProfessionsSection();
}

/**
 * Aktualizuje domyślne atrybuty bazujące na pochodzeniu (bez zmiany wartości)
 */
function aktualizujDomyślneAtrybuty() {
  if (!selectedOrigin) return;

  const pochodzenie = availableOrigin.find(p => p.id === selectedOrigin);
  if (!pochodzenie) return;

  renderOriginAttributeChoiceSection(pochodzenie);

  const attributesFinal = calculateAttributesMain(pochodzenie, undefined, undefined, getSelectedAttributesBonus());
  displayAttributesMain(attributesFinal, pochodzenie);
}

/**
 * Aktualizuje obliczone atrybuty na podstawie pochodzenia i (opcjonalnie)
 * jednorazowej zamiany wartości wybranej w selektach.
 */
function updateCalculatedAttributes() {
  if (!selectedOrigin) return;

  const pochodzenie = availableOrigin.find(p => p.id === selectedOrigin);
  if (!pochodzenie) return;

  refreshAttributeSwapSelects(pochodzenie);
  const bonusAttributes = getSelectedAttributesBonus();

  let attributesFinal;
  if (document.getElementById('default-attributes').checked) {
    attributesFinal = calculateAttributesMain(pochodzenie, undefined, undefined, bonusAttributes);
  } else {
    const zmniejszony = document.getElementById('attribute-decreased').value;
    const zwiekszony = document.getElementById('attribute-increased').value;
    attributesFinal = calculateAttributesMain(pochodzenie, zmniejszony, zwiekszony, bonusAttributes);
  }

  // Dolicz wymuszone podwyżki atrybutów przyznane przez wybrane ścieżki
  // (np. Moloch: sztywne +1 do Siły obok jednej podwyżki do wyboru).
  const bonusySciezek = sumAttributeBonusesFromPaths();
  Object.entries(bonusySciezek).forEach(([atrybut, wartosc]) => {
    if (wartosc) attributesFinal[atrybut] += wartosc;
  });

  // Zsynchronizuj ukryte pola z finalnymi wartościami atrybutów głównych
  ['sila', 'zrecznosc', 'intelekt', 'wola'].forEach(atr => {
    const input = document.getElementById(`${atr}-base`);
    if (input) input.value = attributesFinal[atr];
  });

  displayAttributesMain(attributesFinal, pochodzenie);
}

/**
 * Wyświetla finalne atrybuty główne i przelicza atrybuty drugorzędne.
 */
function displayAttributesMain(attributesFinal, pochodzenie) {
  document.getElementById('strength-final').textContent = attributesFinal.sila;
  document.getElementById('agility-final').textContent = attributesFinal.zrecznosc;
  document.getElementById('intellect-final').textContent = attributesFinal.intelekt;
  document.getElementById('will-final').textContent = attributesFinal.wola;

  // Modyfikator = wartość - 10 (przeciętna wartość atrybutu w PG)
  document.getElementById('strength-mod').textContent = formatModifier(attributesFinal.sila - 10);
  document.getElementById('agility-mod').textContent = formatModifier(attributesFinal.zrecznosc - 10);
  document.getElementById('intellect-mod').textContent = formatModifier(attributesFinal.intelekt - 10);
  document.getElementById('will-mod').textContent = formatModifier(attributesFinal.wola - 10);

  updateAttributesSecondary(attributesFinal, pochodzenie);

  // Aktywuj przycisk "Dalej" w kroku 2
  document.getElementById('btn-next-2').disabled = false;
}

/** Etykiety atrybutów głównych używane w Kroku 4. */
const ATTRIBUTE_LABELS = { sila: 'Siła', zrecznosc: 'Zręczność', intelekt: 'Intelekt', wola: 'Wola' };

/** Etykiety atrybutów drugorzędnych - używane przy formatowaniu modyfikatorów ścieżek na kafelkach (Krok 3). */
const SECONDARY_ATTRIBUTE_LABELS = {
  zdrowie: 'Zdrowie', moc: 'Moc', obrona: 'Obrona', predkosc: 'Prędkość', splugawienie: 'Splugawienie'
};

/**
 * Sprawdza, czy dany slot zwiększenia atrybutów (Krok 4) ma kompletną
 * odpowiedź: dokładnie `ilosc` różnych atrybutów wybranych.
 */
function slotAttributesComplete(slot) {
  const selected = selectedAttributesSlots[slot.id] || [];
  return selected.length === slot.ilosc;
}

/**
 * Oblicza atrybuty główne postaci PRZED uwzględnieniem slotów Kroku 4:
 * pochodzenie + jednorazowa zamiana wartości z Kroku 2.
 */
function calculateBaseAttributesBeforePaths() {
  const pochodzenie = availableOrigin.find(p => p.id === selectedOrigin);
  if (!pochodzenie) return null;
  const zmniejszony = document.getElementById('attribute-decreased')?.value;
  const zwiekszony = document.getElementById('attribute-increased')?.value;
  return calculateAttributesMain(pochodzenie, zmniejszony, zwiekszony);
}

/**
 * Renderuje Krok 4: sloty zwiększenia atrybutów przyznane przez wybrane
 * ścieżki (PG: "Zwiększ dwa/trzy dowolne o 1" przy wyborze ścieżki).
 * Przelicza i zapisuje finalne atrybuty główne (bazowe + bonusy ze
 * wszystkich slotów) do #strength-final itd., by kolejne kroki widziały
 * poprawne wartości.
 */
function renderAttributesSlotsSection() {
  const container = document.getElementById('attribute-slots');
  if (!container) return;

  const slots = calculateSlotsAttributes({
    pathNoviceId: selectedPaths.nowicjusz || null,
    pathExpertId: selectedPaths.ekspert || null,
    pathMasterId: selectedPaths.mistrz || null
  });

  if (slots.length === 0) {
    container.innerHTML = '<p class="hint">Żadna z wybranych ścieżek nie daje na tym poziomie możliwości zwiększenia atrybutów.</p>';
  } else {
    container.innerHTML = slots.map(slot => {
      const selected = selectedAttributesSlots[slot.id] || [];
      const limitReached = selected.length >= slot.ilosc;
      const opcje = slot.dostepne.map(atr => {
        const countAssigned = selected.filter(w => w === atr).length;
        return `
          <div class="attribute-stepper" data-slot-id="${slot.id}" data-attr="${atr}">
            <span class="attribute-stepper-label">${ATTRIBUTE_LABELS[atr] || atr}</span>
            <button type="button" class="attribute-stepper-btn" data-delta="-1" ${countAssigned === 0 ? 'disabled' : ''}>−</button>
            <span class="attribute-stepper-count">${countAssigned}</span>
            <button type="button" class="attribute-stepper-btn" data-delta="1" ${limitReached ? 'disabled' : ''}>+</button>
          </div>
        `;
      }).join('');
      return `
        <div class="slot-card" data-slot-id="${slot.id}">
          <div class="slot-source">
            ${slot.source}
            <button type="button" class="section-reset-btn" data-reset-attribute-slot="${slot.id}" title="Wyczyść wybór dla tej ścieżki">Wyczyść</button>
          </div>
          <div class="slot-description">Rozdaj ${slot.ilosc} punkty(ów) zwiększenia o ${slot.wartosc} - można je łączyć na jednym atrybucie (przypisano ${selected.length}/${slot.ilosc})</div>
          <div class="attribute-choice-list">${opcje}</div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.attribute-stepper-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const stepper = e.target.closest('.attribute-stepper');
        const { slotId, attr } = stepper.dataset;
        const delta = parseInt(e.target.dataset.delta);
        const selected = [...(selectedAttributesSlots[slotId] || [])];
        const slot = slots.find(s => s.id === slotId);
        if (delta > 0 && selected.length < slot.ilosc) {
          selected.push(attr);
        } else if (delta < 0) {
          const idx = selected.lastIndexOf(attr);
          if (idx !== -1) selected.splice(idx, 1);
        }
        selectedAttributesSlots[slotId] = selected;
        renderAttributesSlotsSection();
      });
    });
    container.querySelectorAll('[data-reset-attribute-slot]').forEach(btn => {
      btn.addEventListener('click', () => {
        delete selectedAttributesSlots[btn.dataset.resetAttributeSlot];
        renderAttributesSlotsSection();
      });
    });
  }

  // Przelicz i zapisz finalne atrybuty główne (bazowe + wszystkie sloty)
  const base = calculateBaseAttributesBeforePaths();
  if (base) {
    const pochodzenie = availableOrigin.find(p => p.id === selectedOrigin);
    const final = { ...base };
    slots.forEach(slot => {
      (selectedAttributesSlots[slot.id] || []).forEach(atr => {
        final[atr] += slot.wartosc;
      });
    });
    displayAttributesMain(final, pochodzenie);
  }

  const btn = document.getElementById('btn-next-4');
  if (btn) btn.disabled = !slots.every(slotAttributesComplete);
}

/**
 * Sumuje bonusy do atrybutów drugorzędnych (Zdrowie, Moc, Obrona, Prędkość,
 * Splugawienie) przyznane przez wszystkie aktualnie wybrane ścieżki.
 * @returns {{zdrowie: number, moc: number, obrona: number, predkosc: number, splugawienie: number}}
 */
function sumBonusesSecondaryWithPaths() {
  const sum = { zdrowie: 0, moc: 0, obrona: 0, predkosc: 0, splugawienie: 0 };
  [1, 3, 7].forEach(levelChoice => {
    const mod = grantedBenefitsWithPaths[levelChoice]?.pkt?.mod_drugorzedne;
    if (!mod) return;
    Object.keys(sum).forEach(k => { sum[k] += mod[k] || 0; });
  });
  return sum;
}

/**
 * Aktualizuje atrybuty drugorzędne na podstawie atrybutów głównych i pochodzenia
 */
function updateAttributesSecondary(atrybuty, pochodzenie) {
  // Oblicz atrybuty drugorzędne zgodnie z Podręcznikiem Głównym
  const bonusesPaths = sumBonusesSecondaryWithPaths();
  let zdrowie = atrybuty.sila + bonusesPaths.zdrowie;

  // Dodaj bonus do zdrowia z poziomu 4 jeśli jest dostępny
  if (selectedLevel >= 4 && pochodzenie.poziom_4 && pochodzenie.poziom_4.zdrowie) {
    const healthBonus = parseInt(pochodzenie.poziom_4.zdrowie.replace('+', ''));
    zdrowie += healthBonus;
  }

  const attributesSecondary = {
    percepcja: atrybuty.intelekt,
    obrona: atrybuty.zrecznosc + bonusesPaths.obrona,
    zdrowie,
    szybkosc_zdrowienia: Math.floor(atrybuty.sila / 4) || 1,
    moc: bonusesPaths.moc,
    predkosc: (pochodzenie.predkosc || 0) + bonusesPaths.predkosc,
    splugawienie: bonusesPaths.splugawienie + calculateCorruptionFromCurrentMagic()
  };

  // Modyfikatory obrony na podstawie rozmiaru pochodzenia
  if (pochodzenie.rozmiar === '1/4') {
    attributesSecondary.obrona += 4;
  } else if (pochodzenie.rozmiar === '1/2') {
    attributesSecondary.obrona += 2;
  } else if (pochodzenie.rozmiar === '2') {
    attributesSecondary.obrona -= 2;
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
            <span class="attribute-value" id="perception-final">${attributesSecondary.percepcja}</span>
          </div>
          <div class="attribute-display">
            <label>Obrona:</label>
            <span class="attribute-value" id="defense-final">${attributesSecondary.obrona}</span>
          </div>
          <div class="attribute-display">
            <label>Zdrowie:</label>
            <span class="attribute-value" id="health-final">${attributesSecondary.zdrowie}</span>
          </div>
          <div class="attribute-display">
            <label>Szybkość Zdrowienia:</label>
            <span class="attribute-value" id="healing-rate-final">${attributesSecondary.szybkosc_zdrowienia}</span>
          </div>
          <div class="attribute-display">
            <label>Prędkość:</label>
            <span class="attribute-value" id="speed-final">${attributesSecondary.predkosc}</span>
          </div>
          <div class="attribute-display">
            <label>Moc:</label>
            <span class="attribute-value" id="power-final">${attributesSecondary.moc}</span>
          </div>
          <div class="attribute-display">
            <label>Splugawienie:</label>
            <span class="attribute-value" id="corruption-final">${attributesSecondary.splugawienie}</span>
          </div>
        </div>
      `;
      container.appendChild(secondaryDiv);
    } else {
      // Aktualizuj istniejące wartości
      document.getElementById('perception-final').textContent = attributesSecondary.percepcja;
      document.getElementById('defense-final').textContent = attributesSecondary.obrona;
      document.getElementById('health-final').textContent = attributesSecondary.zdrowie;
      document.getElementById('healing-rate-final').textContent = attributesSecondary.szybkosc_zdrowienia;
      document.getElementById('speed-final').textContent = attributesSecondary.predkosc;
      document.getElementById('power-final').textContent = attributesSecondary.moc;
      document.getElementById('corruption-final').textContent = attributesSecondary.splugawienie;
    }
  }
}

/**
 * Przelicza atrybuty drugorzędne od nowa (np. po zmianie wyboru magii w
 * Kroku 6, gdy poznanie/nauka czarnej magii zmienia Splugawienie) na
 * podstawie atrybutów głównych aktualnie wyświetlonych w Kroku 2.
 */
function refreshAttributesSecondary() {
  if (!selectedOrigin) return;
  const pochodzenie = availableOrigin.find(p => p.id === selectedOrigin);
  if (!pochodzenie) return;
  const atrybuty = {
    sila: parseInt(document.getElementById('strength-final')?.textContent, 10) || 0,
    zrecznosc: parseInt(document.getElementById('agility-final')?.textContent, 10) || 0,
    intelekt: parseInt(document.getElementById('intellect-final')?.textContent, 10) || 0,
    wola: parseInt(document.getElementById('will-final')?.textContent, 10) || 0
  };
  updateAttributesSecondary(atrybuty, pochodzenie);
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
function getAllTraits(traitsSpecial) {
  if (!traitsSpecial || Object.keys(traitsSpecial).length === 0) {
    return null;
  }
    
  const cechy = Object.entries(traitsSpecial);
  return cechy.map(([nazwa, opis]) => ({
    nazwa: formatNameTraits(nazwa),
    opis
  }));
}


/**
 * Formatuje listę języków pochodzenia (kluczy z origins.js, np. 'mroczna_mowa')
 * do czytelnych nazw z JEZYKI (np. 'Mroczna mowa') - inaczej wieloczłonowe
 * klucze wyciekałyby do UI jako surowy tekst ze znakiem podkreślenia.
 * @param {string[]} jezyki
 * @returns {string}
 */
function formatLanguagesOrigin(jezyki) {
  return (jezyki || []).map(j => LANGUAGES[j] || j).join(', ');
}

/**
 * Formatuje opis bonusu profesyjnego/językowego pochodzenia (do wyświetlenia
 * poza Krokiem 4, np. na rozwiniętym kafelku pochodzenia lub w podglądzie).
 * @param {Object} pochodzenie - Obiekt pochodzenia (z origins.js)
 * @returns {string} Opis bonusu
 */
function formatBonusProfessionsOrigin(pochodzenie) {
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
function formatNameTraits(nazwa) {
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

  // Pokaż rozwinięty kontent (górę obok obrazka i dół na całą szerokość), ukryj zwinięty
  const collapsedContent = tile.querySelector('.tile-content-collapsed');
  const expandedTop = tile.querySelector('.tile-content-expanded-top');
  const expandedExtra = tile.querySelector('.tile-content-expanded-extra');

  if (collapsedContent) {
    collapsedContent.style.display = 'none';
  }
  if (expandedTop) {
    expandedTop.style.display = 'block';
  }
  if (expandedExtra) {
    expandedExtra.style.display = 'block';
  }
}

/**
 * Zwijanie kafelka pochodzenia
 * @param {HTMLElement} tile - Element kafelka
 */
function collapseTile(tile) {
  tile.classList.remove('expanded');
  tile.classList.add('compact');

  // Pokaż zwinięty kontent, ukryj obie części rozwiniętego
  const collapsedContent = tile.querySelector('.tile-content-collapsed');
  const expandedTop = tile.querySelector('.tile-content-expanded-top');
  const expandedExtra = tile.querySelector('.tile-content-expanded-extra');

  if (collapsedContent) {
    collapsedContent.style.display = 'block';
  }
  if (expandedTop) {
    expandedTop.style.display = 'none';
  }
  if (expandedExtra) {
    expandedExtra.style.display = 'none';
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
function showMessageChoice(originId) {
  const pochodzenie = availableOrigin.find(p => p.id === originId);
  if (!pochodzenie) {
    return;
  }
    
  // Utwórz komunikat
  const message = document.createElement('div');
  message.className = 'selection-message';
  message.innerHTML = `
        <div class="message-content">
            <span class="message-icon">${icon('check')}</span>
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
    step1.appendChild(message);
        
    // Automatycznie usuń komunikat po 3 sekundach
    setTimeout(() => {
      if (message.parentNode) {
        message.remove();
      }
    }, 3000);
  }
}

/**
 * Zamienia klucz w formacie snake_case (np. "znienawidzone_stworzenia") na
 * czytelny tekst ("Znienawidzone stworzenia") - wyłącznie awaryjny fallback,
 * gdy dla klucza brakuje właściwej, poprawnie sformatowanej nazwy w danych.
 */
function humanizeKeyTable(klucz) {
  const tekst = klucz.replace(/_/g, ' ');
  return tekst.charAt(0).toUpperCase() + tekst.slice(1);
}

/**
 * Generuje sekcję z wynikami tabel losowych
 * @param {string} originId - ID pochodzenia
 * @returns {string} HTML sekcji z wynikami tabel
 */
function generateSectionsResultsTables(originId) {
  if (!resultsTables[originId] || Object.keys(resultsTables[originId]).length === 0) {
    return '';
  }
  
  const pochodzenie = availableOrigin.find(p => p.id === originId);
  if (!pochodzenie || !pochodzenie.tabele) {
    return '';
  }
  
  let html = '<div class="preview-section">';
  html += `<h5>${icon('dice')} Wyniki Tabel Losowych</h5>`;

  Object.entries(resultsTables[originId]).forEach(([tableName, result]) => {
    // Nazwa tabeli pochodzi bezpośrednio z jej definicji (pochodzenie.tabele),
    // a nie z osobno utrzymywanej listy - inaczej brakujący wpis pokazywałby
    // surowy klucz (np. "znienawidzone_stworzenia") zamiast czytelnej nazwy.
    const nameTable = pochodzenie.tabele[tableName]?.nazwa || humanizeKeyTable(tableName);
    const resultIcon = result.typ === 'wybór' ? icon('target') : icon('dice');
    const typeText = result.typ === 'wybór' ? 'Wybór' : 'Losowanie';

    html += '<div class="table-result-item">';
    html += '<div class="table-result-header">';
    html += `<span class="table-result-name">${nameTable}</span>`;
    html += `<span class="table-result-type">${resultIcon} ${typeText}</span>`;
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
function nameTierLevel(poziom) {
  if (poziom === 0) return 'Poziom startowy';
  if (poziom <= 2) return 'Nowicjusz';
  if (poziom <= 6) return 'Ekspert';
  return 'Mistrz';
}

/**
 * Renderuje sekcję pochodzenia: nazwa, opis, cechy specjalne, rozmiar,
 * prędkość bazowa, języki i bonus profesyjny/językowy z pochodzenia.
 */
function renderCardOriginSection(pochodzenie) {
  const cechy = getAllTraits(pochodzenie.cechy_specjalne);
  return `
    <div class="preview-section">
      <h5>${pochodzenie.nazwa}</h5>
      <p>${pochodzenie.opis}</p>
      <p><strong>Rozmiar:</strong> ${pochodzenie.rozmiar} | <strong>Prędkość bazowa:</strong> ${pochodzenie.predkosc}</p>
      <p><strong>Języki:</strong> ${formatLanguagesOrigin(pochodzenie.jezyki)}</p>
      <p><strong>Profesja/język z pochodzenia:</strong> ${formatBonusProfessionsOrigin(pochodzenie)}</p>
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
function renderCardAttributesBasicSection(pochodzenie) {
  const atrybuty = {
    sila: parseInt(document.getElementById('strength-final').textContent),
    zrecznosc: parseInt(document.getElementById('agility-final').textContent),
    intelekt: parseInt(document.getElementById('intellect-final').textContent),
    wola: parseInt(document.getElementById('will-final').textContent)
  };

  const notes = [];
  const defaultAttributes = document.getElementById('default-attributes');
  if (defaultAttributes && !defaultAttributes.checked) {
    const zmniejszony = document.getElementById('attribute-decreased')?.value;
    const zwiekszony = document.getElementById('attribute-increased')?.value;
    if (zmniejszony && zwiekszony) {
      notes.push(`Zamiana wartości: −1 ${ATTRIBUTE_LABELS[zmniejszony]}, +1 ${ATTRIBUTE_LABELS[zwiekszony]}.`);
    }
  }
  const bonusAttributes = getSelectedAttributesBonus();
  if (pochodzenie.wybor_atrybutu && bonusAttributes.length > 0) {
    const bonusValue = pochodzenie.wybor_atrybutu.wartosc || 1;
    notes.push(`Bonus z pochodzenia: ${bonusAttributes.map(a => `${ATTRIBUTE_LABELS[a]} +${bonusValue}`).join(', ')}.`);
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
      ${notes.map(n => `<p class="hint">${n}</p>`).join('')}
    </div>
  `;
}

/**
 * Renderuje sekcję atrybutów drugorzędnych, czytając już poprawnie
 * przeliczone wartości (łącznie z bonusami ze ścieżek) z Kroku 2 -
 * patrz aktualizujAtrybutyDrugorzedne().
 */
function renderCardAttributesSecondarySection() {
  const read = (id, domyslnie = '0') => document.getElementById(id)?.textContent ?? domyslnie;
  return `
    <div class="preview-section">
      <h5>Atrybuty Drugorzędne</h5>
      <div class="attributes-grid">
        <div class="attribute-box"><strong>Percepcja</strong><br>${read('perception-final')}</div>
        <div class="attribute-box"><strong>Obrona</strong><br>${read('defense-final')}</div>
        <div class="attribute-box"><strong>Zdrowie</strong><br>${read('health-final')}</div>
        <div class="attribute-box"><strong>Szybkość Zdrowienia</strong><br>${read('healing-rate-final', '1')}</div>
        <div class="attribute-box"><strong>Prędkość</strong><br>${read('speed-final')}</div>
        <div class="attribute-box"><strong>Moc</strong><br>${read('power-final')}</div>
        <div class="attribute-box"><strong>Splugawienie</strong><br>${read('corruption-final')}</div>
      </div>
    </div>
  `;
}

/**
 * Renderuje wybraną korzyść z pochodzenia na poziomie 4 (spell/talent/inna
 * opcja wybrana w radiobuttonach sekcji "Korzyści z Pochodzenia").
 */
function renderCardLevel4Section(pochodzenie) {
  if (selectedLevel < 4 || !pochodzenie.poziom_4) return '';
  const selectedOption = document.querySelector(`input[name="origin-option-${pochodzenie.id}"]:checked`)?.value;
  const healthBonus = parseInt((pochodzenie.poziom_4.zdrowie || '+0').replace('+', '')) || 0;
  return `
    <div class="preview-section">
      <h5>Korzyść z Pochodzenia (Poziom 4)</h5>
      ${healthBonus > 0 ? `<p><strong>Zdrowie:</strong> +${healthBonus}</p>` : ''}
      <p><strong>Wybrana opcja:</strong> ${selectedOption || 'nie wybrano'}</p>
    </div>
  `;
}

/**
 * Renderuje sekcję wybranych ścieżek wraz z talentami i magią, które
 * przyznają, oraz zasoby (srebrniki, kurioza) przyznane wraz z poziomem.
 */
function renderCardPathsSection() {
  const labelsTier = { 1: 'Nowicjusz', 3: 'Ekspert', 7: 'Mistrz' };
  const sections = [1, 3, 7].map(levelChoice => {
    const benefit = grantedBenefitsWithPaths[levelChoice];
    if (!benefit) return '';
    const pkt = benefit.pkt || {};
    const talenty = (pkt.talenty || []).map(t => `<div class="trait-item"><strong>${t.nazwa}:</strong> ${t.opis}</div>`).join('');
    const magia = (pkt.zaklecia || []).map(z => `<div class="trait-item"><strong>Magia:</strong> ${z.opis}</div>`).join('');
    return `
      <div class="path-benefit-item">
        <h6>${labelsTier[levelChoice]}: ${benefit.sciezkaNazwa || benefit.pathId} (poziom ${levelChoice})</h6>
        ${talenty || magia ? `<div class="trait-list">${talenty}${magia}</div>` : ''}
      </div>
    `;
  }).filter(Boolean);

  if (sections.length === 0) return '';

  return `
    <div class="preview-section">
      <h5>Wybrane Ścieżki</h5>
      ${sections.join('')}
    </div>
  `;
}

/**
 * Renderuje sekcję zasobów: srebrniki wylosowane za poziomy powyżej 0
 * i liczbę dostępnych kuriozów.
 */
function renderCardResourcesSection() {
  if (selectedLevel <= 0) return '';
  const silver = randomizedSilver != null ? randomizedSilver : 'nie wylosowano';
  return `
    <div class="preview-section">
      <h5>Zasoby</h5>
      <p><strong>Srebrniki:</strong> ${silver} | <strong>Kurioza:</strong> ${numberCurios}</p>
    </div>
  `;
}

/**
 * Renderuje sekcję znanych tradycji i zaklęć wybranych opcjonalnie
 * w Kroku 6, na podstawie rozwiązanych atomowych wyborów magii.
 */
function renderCardSpellsSection() {
  const atoms = getCurrentAtomsMagic();
  if (atoms.length === 0) return '';
  const { resolutions, knownTraditions } = calculateResolutionMagic(atoms, magicChoices);
  const traditionsList = [...knownTraditions].map(id => TRADITIONS[id]?.nazwa || id).sort((a, b) => a.localeCompare(b, 'pl'));
  const zaklecia = resolutions
    .flatMap(r => {
      if (r.mode === 'zaklecie' && r.spellId) return [r.spellId];
      if (r.mode === 'tradycja' && r.darmowyZaklecieId) return [r.darmowyZaklecieId];
      return [];
    })
    .map(id => SPELLS.find(s => s.id === id))
    .filter(Boolean);

  if (traditionsList.length === 0 && zaklecia.length === 0) return '';

  const traditionsHtml = traditionsList.length
    ? `<div class="trait-item"><strong>Znane tradycje:</strong> ${traditionsList.join(', ')}</div>`
    : '';
  const spellsHtml = zaklecia
    .map(s => `<div class="trait-item"><strong>${s.nazwa}</strong> ${renderSourceTag(s.zrodlo)} <em>(${s.tradycjaNazwa}, krąg ${s.krag}, ${s.kategoria === 'atak' ? 'atak' : 'użytkowe'})</em>: ${s.opis}</div>`)
    .join('');

  return `
    <div class="preview-section">
      <h5>Magia - Znane Tradycje i Zaklęcia</h5>
      <div class="trait-list">${traditionsHtml}${spellsHtml}</div>
    </div>
  `;
}

/**
 * Renderuje sekcję ekwipunku (Krok 7): przedmioty posiadane przez postać
 * (wyposażenie startowe pozostałe po sprzedaży + zakupy w sklepie) wraz
 * z dostępną gotówką. Pomija Zamożność bez wybranego poziomu.
 */
function renderCardEquipmentSection() {
  const state = calculateStateEquipment();
  if (!state) return '';

  const entries = [...state.ownedStarting, ...state.purchasedEntries];
  if (entries.length === 0) return '';

  const entriesHtml = entries.map(p => {
    const nazwa = p.zwojZaklecie
      ? `Zwój (${TRADITIONS[p.zwojZaklecie.tradycjaId]?.nazwa || p.zwojZaklecie.tradycjaId}${p.zwojZaklecie.spellId ? `: ${SPELLS.find(s => s.id === p.zwojZaklecie.spellId)?.nazwa || ''}` : ''})`
      : (p.itemId ? (getItem(p.itemId)?.nazwa || p.itemId) : p.tekst);
    const item = p.itemId ? getItem(p.itemId) : null;
    const ilosc = p.ilosc > 1 ? ` ×${p.ilosc}` : '';
    const stats = item ? formatStatsItem(item) : null;
    return `<div class="trait-item">${nazwa}${ilosc}${item ? ` ${renderSourceTag(item.zrodlo)}` : ''}${stats ? `<br><small>${stats}</small>` : ''}</div>`;
  }).join('');

  return `
    <div class="preview-section">
      <h5>Ekwipunek (Zamożność: ${state.wealthentry.nazwa})</h5>
      <div class="trait-list">${entriesHtml}</div>
      <p><strong>Gotówka:</strong> ${formatCopperbits(state.cashCopperbits)}</p>
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
function generateCardCharacterHtml() {
  if (!selectedOrigin) return '';
  const pochodzenie = availableOrigin.find(p => p.id === selectedOrigin);
  if (!pochodzenie) return '';

  return `
    <div class="preview-section">
      <p><strong>Poziom:</strong> ${selectedLevel} (${nameTierLevel(selectedLevel)})</p>
    </div>
    ${renderCardOriginSection(pochodzenie)}
    ${renderCardAttributesBasicSection(pochodzenie)}
    ${renderCardAttributesSecondarySection()}
    ${renderCardLevel4Section(pochodzenie)}
    ${renderCardPathsSection()}
    ${renderProfessionsAndCuriosSummary()}
    ${renderCardSpellsSection()}
    ${renderCardEquipmentSection()}
    ${renderCardResourcesSection()}
    ${generateSectionsResultsTables(pochodzenie.id)}
  `;
}

/**
 * Aktualizuje podgląd postaci (Krok 7) - żywa, aktualizowana na bieżąco
 * wersja Karty Postaci, zanim użytkownik kliknie "Utwórz Postać".
 */
function updatePreviewCharacter() {
  if (!selectedOrigin) return;
  renderMissingItemsWarning();
  const container = document.getElementById('character-preview');
  if (!container) return;
  const title = characterName ? `Podgląd Postaci: ${characterName}` : 'Podgląd Postaci';
  container.innerHTML = `<h4>${icon('scroll')} ${title}</h4>${generateCardCharacterHtml()}`;
}

/**
 * Sprawdza wybory, które w tej aplikacji nigdzie nie są wymuszone (Kroki 6
 * i 7 są w pełni opcjonalne z punktu widzenia nawigacji, a Krok 2 ma kilka
 * pomocniczych wyborów bez blokady "Dalej"), a które w praktyce są ważne
 * dla kompletności postaci wg podręcznika. Wywoływana wyłącznie do
 * poinformowania gracza w Kroku 8 - nigdy do blokowania nawigacji między
 * krokami.
 * @returns {string[]} lista opisów brakujących elementów (pusta = nic nie brakuje)
 */
function calculateMissingItems() {
  if (!selectedOrigin) return [];
  const pochodzenie = availableOrigin.find(p => p.id === selectedOrigin);
  if (!pochodzenie) return [];

  const missing = [];

  // Ścieżki (Krok 3)
  if (selectedLevel >= 1 && !selectedPaths.nowicjusz) {
    missing.push('Nie wybrano ścieżki nowicjusza (Krok 3).');
  }
  if (selectedLevel >= 3 && !selectedPaths.ekspert) {
    missing.push('Nie wybrano ścieżki eksperckiej (Krok 3).');
  }
  if (selectedLevel >= 7 && !selectedPaths.mistrz) {
    missing.push('Nie wybrano ścieżki mistrzowskiej (Krok 3).');
  }

  // Bonus do atrybutu z pochodzenia (Krok 2, np. Człowiek +1, Elf +1 i +1)
  if (pochodzenie.wybor_atrybutu && getSelectedAttributesBonus().length < pochodzenie.wybor_atrybutu.ilosc) {
    missing.push(`Nie wybrano bonusu do atrybutu z pochodzenia ${pochodzenie.nazwa} (Krok 2).`);
  }

  // Atrybuty główne do rozdania (Krok 4)
  const slotsAttr = calculateSlotsAttributes({
    pathNoviceId: selectedPaths.nowicjusz || null,
    pathExpertId: selectedPaths.ekspert || null,
    pathMasterId: selectedPaths.mistrz || null
  });
  if (!slotsAttr.every(slotAttributesComplete)) {
    missing.push('Nie rozdano wszystkich punktów zwiększenia atrybutów głównych (Krok 4).');
  }

  // Korzyść z Pochodzenia na poziomie 4 (Krok 2)
  if (selectedLevel >= 4 && pochodzenie.poziom_4?.opcje?.length > 0 && !getCurrentSelectedLevel4Option()) {
    missing.push('Nie wybrano korzyści z pochodzenia na poziomie 4 (Krok 2, sekcja "Korzyści z Pochodzenia").');
  }

  // Srebrniki za poziom (Krok 2, sekcja "Zasoby")
  if (selectedLevel > 0 && randomizedSilver === null) {
    missing.push('Nie wylosowano srebrników za poziom (Krok 2, sekcja "Zasoby na wyższym poziomie").');
  }

  // Profesje i języki (Krok 5)
  const { slots } = calculateSlotsCharacter();
  if (!slots.every(slot => slotAnswerComplete(slot))) {
    missing.push('Nie wszystkie sloty profesji/języków są wypełnione (Krok 5).');
  }

  // Kurioza (Krok 5)
  const { kurioza } = calculateChoiceCount();
  if (selectedCurios.length < kurioza) {
    missing.push(`Nie wybrano wszystkich kuriozów (${selectedCurios.length}/${kurioza}) (Krok 5).`);
  }

  // Magia (Krok 6) - tylko jeśli pochodzenie/ścieżki faktycznie coś przyznają
  const atomsMagic = getCurrentAtomsMagic();
  if (atomsMagic.length > 0) {
    const { resolutions } = calculateResolutionMagic(atomsMagic, magicChoices);
    if (resolutions.some(r => !r.complete)) {
      missing.push('Postać ma nierozwiązane wybory magii - tradycje lub zaklęcia (Krok 6).');
    }
  }

  // Zamożność i wyposażenie startowe (Krok 7)
  if (!equipmentWealthId) {
    missing.push('Nie wybrano Zamożności - postać nie ma wyposażenia startowego (Krok 7).');
  } else {
    const incompleteGear = calculateAtomsGear(equipmentWealthId).some(atom => {
      const wybor = equipmentChoices[atom.id];
      if (atom.rodzaj === 'wybor_przedmiotu') return !wybor?.itemId;
      if (!wybor) return true;
      if (wybor.typ === 'zwoj_zaklecie') return !wybor.spellId;
      if (wybor.typ === 'przedmiot') return !wybor.itemId;
      return false;
    });
    if (incompleteGear) {
      missing.push('Nie dokonano wszystkich wyborów wyposażenia startowego (Krok 7).');
    }
  }

  return missing;
}

/**
 * Renderuje na górze Kroku 8 listę rzeczy, które gracz mógł przeoczyć (zob.
 * calculateMissingItems()) - czysto informacyjnie, nie blokuje eksportu.
 */
function renderMissingItemsWarning() {
  const container = document.getElementById('missing-items-warning');
  if (!container) return;

  const missing = calculateMissingItems();
  if (missing.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="missing-items-warning">
      <h4>${icon('warning')} Możliwe przeoczenia</h4>
      <ul>${missing.map(item => `<li>${item}</li>`).join('')}</ul>
    </div>
  `;
}

// ========== AC-016: Obsługa Korzyści Poziomu ==========

/**
 * Załaduj korzyści dla wybranego poziomu
 */
async function loadBenefitsLevel(poziom) {
  if (!selectedOrigin) {
    const section = document.getElementById('level-benefits-section');
    if (section) {
      section.style.display = 'none';
    }
    return;
  }

  // Poziom 0 to postać startowa - tabela Rozwoju w PG zaczyna się dopiero od
  // poziomu 1, więc GAME_DATA.poziomy[0] celowo nie istnieje. Bez tego
  // wyjścia obliczKorzysciPoziomu() rzucałoby wyjątek przy każdym powrocie
  // na poziom 0 i sekcja wchodziła w awaryjny fallback.
  if (poziom === 0) {
    displayStartingLevelBenefits();
    return;
  }

  try {
    const spec = {
      pochodzenie: selectedOrigin,
      sciezka_nowicjusza: selectedPaths.nowicjusz || null,
      sciezka_ekspercka: selectedPaths.ekspert || null,
      sciezka_mistrzowska: selectedPaths.mistrz || null
    };
    // Korzyści są skumulowane - pokazujemy każdy poziom od 1 do wybranego,
    // nie tylko sam wybrany, żeby postać widziała cały swój dotychczasowy rozwój.
    const benefitsAllLevels = [];
    for (let p = 1; p <= poziom; p++) {
      benefitsAllLevels.push(calculateBenefitsLevel(p, spec));
    }
    displayBenefitsLevel(benefitsAllLevels, poziom);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Błąd ładowania korzyści:', error);
    // Fallback - wyświetl podstawowe informacje
    displayLevelBenefitsFallback(poziom);
  }
}

/**
 * Renderuje sekcję korzyści dla poziomu startowego (0), na którym postać ma
 * wyłącznie to, co daje pochodzenie - żadna ścieżka nie jest jeszcze wybrana.
 */
function displayStartingLevelBenefits() {
  const section = document.getElementById('level-benefits-section');
  const levelName = document.getElementById('selected-level-name');
  const content = document.getElementById('level-benefits-content');
  if (!section || !content) return;

  section.style.display = 'block';
  if (levelName) levelName.textContent = 'Poziom startowy (Pochodzenie)';
  content.innerHTML = `
    <div class="benefit-category">
      <h5>Postać startowa</h5>
      <p>Na poziomie 0 postać ma wyłącznie atrybuty, języki i cechy wynikające z pochodzenia - nie wybiera jeszcze żadnej ścieżki.</p>
      <p class="hint">Pierwszą ścieżkę (nowicjusza) wybierzesz po podniesieniu poziomu do 1.</p>
    </div>
  `;
}

/**
 * Fallback dla wyświetlania korzyści poziomu
 */
function displayLevelBenefitsFallback(poziom) {
  const section = document.getElementById('level-benefits-section');
  const levelName = document.getElementById('selected-level-name');
  
  section.style.display = 'block';
  
  // Podstawowe nazwy poziomów
  const namesLevels = {
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
  
  const nameLevel = namesLevels[poziom] || 'Nieznany poziom';
  const namePaths = poziom === 4 ? 'Pochodzenie' : 'Brak ścieżki';
  levelName.textContent = `${nameLevel} (${namePaths})`;
  
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
        <p>Poziom ${poziom} - ${nameLevel}</p>
        <p><em>Szczegółowe korzyści będą dostępne po wyborze pochodzenia i ścieżek.</em></p>
      </div>
    `;
  }
}

/**
 * Wyświetla skumulowane korzyści postaci od poziomu 1 do wybranego poziomu -
 * jeden blok `.path-benefit-item` (z nagłówkiem "Poziom N - ...") na każdy
 * poziom z tej listy, w kolejności rosnącej.
 * @param {Object[]} benefitsAllLevels - wynik calculateBenefitsLevel() dla każdego poziomu 1..poziom
 * @param {number} poziom - wybrany (docelowy) poziom postaci
 */
function displayBenefitsLevel(benefitsAllLevels, poziom) {
  const section = document.getElementById('level-benefits-section');
  const levelName = document.getElementById('selected-level-name');
  const content = document.getElementById('level-benefits-content');
  if (!section || !content) return;

  section.style.display = 'block';
  if (levelName) levelName.textContent = poziom;

  content.innerHTML = benefitsAllLevels.map(renderOneLevelBenefitsBlock).join('');
}

/**
 * Renderuje blok korzyści jednego poziomu w skumulowanej liście (nagłówek
 * "Poziom N - Nazwa (Źródło)" + kategorie korzyści tego poziomu).
 */
function renderOneLevelBenefitsBlock(benefits) {
  const nameLevel = benefits.nazwa_poziomu || 'Nieznany poziom';
  const sourceName = benefits.nazwa_sciezki
    || (benefits.zrodlo_korzysci === 'pochodzenie' ? 'Pochodzenie' : 'Brak ścieżki');
  return `
    <div class="path-benefit-item">
      <h6>Poziom ${benefits.poziom} - ${nameLevel} (${sourceName})</h6>
      ${benefits.opis_poziomu ? `<p class="hint">${benefits.opis_poziomu}</p>` : ''}
      ${renderBenefitsLevelHtml(benefits.korzyści || {}, benefits)}
    </div>
  `;
}

/**
 * Składa HTML listy korzyści jednego poziomu - jeden blok `.benefit-category`
 * na kategorię korzyści. Obsługuje wszystkie pola występujące w blokach
 * `poziom_N` danych ścieżek i pochodzeń: atrybuty drugorzędne (zdrowie, moc,
 * obrona, percepcja, prędkość, splugawienie), punkty atrybutów głównych,
 * talenty, magię, języki/profesje oraz opcje do wyboru (poziom 4 pochodzenia).
 */
function renderBenefitsLevelHtml(korzysci, benefits = {}) {
  const block = (tytul, tresc) => `
    <div class="benefit-category">
      <h5>${tytul}</h5>
      ${tresc}
    </div>
  `;
  const blocks = [];

  const secondary = [
    ['Zdrowie', korzysci.zdrowie],
    ['Moc', korzysci.moc],
    ['Obrona', korzysci.obrona],
    ['Percepcja', korzysci.percepcja],
    ['Prędkość', korzysci.predkosc],
    ['Splugawienie', korzysci.splugawienie]
  ].filter(([, wartosc]) => wartosc).map(([nazwa, wartosc]) => `${nazwa} ${wartosc}`);
  if (secondary.length) {
    blocks.push(block('Atrybuty drugorzędne', `<p>${secondary.join(' · ')}</p>`));
  }

  const attributes = korzysci.atrybuty_glowne;
  if (attributes && attributes.typ === 'wybor') {
    const attributeNames = { sila: 'Siła', zrecznosc: 'Zręczność', intelekt: 'Intelekt', wola: 'Wola' };
    const available = (attributes.dostepne || []).map(a => attributeNames[a] || a).join(', ');
    blocks.push(block('Atrybuty główne', `
      <p>Do rozdania: <strong>${attributes.ilosc}</strong> pkt (maksymalnie ${attributes.wartosc} na jeden atrybut).</p>
      ${available ? `<p class="hint">Do wyboru: ${available}.</p>` : ''}
      <p class="hint">Punkty rozdasz w Kroku 4 (Rozwój Atrybutów).</p>
    `));
  }

  if (korzysci.talenty && korzysci.talenty.length > 0) {
    const items = korzysci.talenty
      .map(talent => `<li><strong>${talent}</strong> - ${getTalentDescription(talent)}</li>`)
      .join('');
    blocks.push(block('Talenty', `<ul>${items}</ul>`));
  }

  if (korzysci.magia) {
    blocks.push(block('Magia', `
      <p>${descriptionMagic(korzysci.magia)}</p>
      <p class="hint">Tradycje i zaklęcia wybierzesz w Kroku 6 (Magia).</p>
    `));
  }

  if (korzysci.jezyki_profesje) {
    blocks.push(block('Języki i profesje', `
      <p>${korzysci.jezyki_profesje.opis}</p>
      <p class="hint">Sloty rozdasz w Kroku 5 (Profesje i Kurioza).</p>
    `));
  }

  if (korzysci.opcje && korzysci.opcje.length > 0) {
    const items = korzysci.opcje.map(opcja => `<li>${opcja}</li>`).join('');
    blocks.push(block('Do wyboru', `
      <ul>${items}</ul>
      <p class="hint">Wyboru dokonasz w sekcji "Korzyści z Pochodzenia" poniżej.</p>
    `));
  }

  if (blocks.length) return blocks.join('');

  // Brak korzyści prawie zawsze znaczy "nie wybrano jeszcze ścieżki, z której
  // ten poziom je czerpie" - powiedz to wprost zamiast sugerować, że poziom
  // niczego nie daje.
  const tierLabels = {
    sciezka_nowicjusza: 'ścieżki nowicjusza',
    sciezka_ekspercka: 'ścieżki eksperckiej',
    sciezka_mistrzowska: 'ścieżki mistrzowskiej'
  };
  const tier = tierLabels[benefits.zrodlo_korzysci];
  if (!tier) return '<p class="hint">Ten poziom nie przyznaje dodatkowych korzyści.</p>';
  // Nazwa ścieżki jest ustawiona tylko wtedy, gdy ścieżka faktycznie została
  // wybrana - inaczej brak korzyści znaczy po prostu "nie ma jeszcze z czego".
  return benefits.nazwa_sciezki
    ? `<p class="hint">Dla ${tier} <strong>${benefits.nazwa_sciezki}</strong> nie mamy jeszcze zapisanych korzyści na tym poziomie.</p>`
    : `<p class="hint">Korzyść ze ${tier}</p>`;
}

/** Wersja schematu danych eksportu/importu postaci - zwiększana przy niekompatybilnych zmianach struktury. */
const EXPORT_VERSION = 2; // v2: dodano sekcję ekwipunku (Krok 7 - Zamożność, wyposażenie startowe, sklep)

/**
 * Buduje kompletny, wersjonowany obiekt zawierający WSZYSTKIE wybory dokonane
 * przez gracza w kreatorze (sekcja `wybory` - jedyne źródło potrzebne do
 * wiernego odtworzenia postaci przy imporcie) oraz czytelne podsumowanie
 * nazw i wartości (sekcja `podsumowanie` - dla kogoś otwierającego plik
 * ręcznie). Zwraca `null`, gdy nie wybrano jeszcze pochodzenia.
 */
function buildExportData() {
  if (!selectedOrigin) return null;
  const pochodzenie = availableOrigin.find(p => p.id === selectedOrigin);
  if (!pochodzenie) return null;

  const readText = (id, domyslnie = '0') => document.getElementById(id)?.textContent ?? domyslnie;

  const atomsMagic = getCurrentAtomsMagic();
  const { resolutions, knownTraditions } = calculateResolutionMagic(atomsMagic, magicChoices);
  const zaklecia = resolutions
    .flatMap(r => {
      if (r.mode === 'zaklecie' && r.spellId) return [r.spellId];
      if (r.mode === 'tradycja' && r.darmowyZaklecieId) return [r.darmowyZaklecieId];
      return [];
    })
    .map(id => SPELLS.find(s => s.id === id))
    .filter(Boolean);

  const script = new Set(getLanguagesWithScript());
  const jezyki = getSpokenLanguages().map(k => {
    const nazwa = LANGUAGES[k] || k;
    return script.has(k) ? `${nazwa} (czytanie/pisanie)` : nazwa;
  });

  const namePaths = (levelChoice, pathId) => {
    if (!pathId) return null;
    const list = getPathsForLevel(levelChoice);
    return list.find(p => p.id === pathId)?.nazwa || pathId;
  };

  return {
    wersjaEksportu: EXPORT_VERSION,
    utworzono: new Date().toISOString(),
    // Surowe wybory gracza - jedyna sekcja odczytywana przy imporcie.
    wybory: {
      imie: characterName || '',
      pochodzenie: selectedOrigin,
      bonusoweAtrybutyPochodzenia: getSelectedAttributesBonus(),
      opcjaPoziom4: getCurrentSelectedLevel4Option(),
      wynikiTabelPochodzenia: JSON.parse(JSON.stringify(resultsTables[selectedOrigin] || {})),
      poziom: selectedLevel,
      atrybutyGlowne: {
        domyslne: document.getElementById('default-attributes')?.checked ?? true,
        zmniejszony: document.getElementById('attribute-decreased')?.value || '',
        zwiekszony: document.getElementById('attribute-increased')?.value || ''
      },
      sciezki: { ...selectedPaths },
      atrybutySloty: JSON.parse(JSON.stringify(selectedAttributesSlots)),
      profesjeJezykiSloty: JSON.parse(JSON.stringify(answersSlots)),
      kurioza: [...selectedCurios],
      magia: {
        wybory: JSON.parse(JSON.stringify(magicChoices)),
        ryzykoWyniki: JSON.parse(JSON.stringify(magicRiskResults))
      },
      srebrniki: randomizedSilver,
      ekwipunek: {
        zamoznoscId: equipmentWealthId,
        zamoznoscWynik: equipmentWealthResult,
        gotowkaPoczatkowaWynik: equipmentStartingCashRoll,
        wybory: JSON.parse(JSON.stringify(equipmentChoices)),
        sprzedane: [...equipmentSold],
        zakupione: JSON.parse(JSON.stringify(equipmentPurchased))
      }
    },
    // Czytelne podsumowanie (nazwy zamiast id) - wyłącznie informacyjne, nie
    // jest odczytywane przy imporcie.
    podsumowanie: {
      imie: characterName || null,
      pochodzenie: pochodzenie.nazwa,
      poziom: selectedLevel,
      poziomNazwa: nameTierLevel(selectedLevel),
      atrybutyGlowne: {
        sila: readText('strength-final'),
        zrecznosc: readText('agility-final'),
        intelekt: readText('intellect-final'),
        wola: readText('will-final')
      },
      attributesSecondary: {
        percepcja: readText('perception-final'),
        obrona: readText('defense-final'),
        zdrowie: readText('health-final'),
        szybkoscZdrowienia: readText('healing-rate-final', '1'),
        predkosc: readText('speed-final'),
        moc: readText('power-final'),
        splugawienie: readText('corruption-final')
      },
      sciezki: {
        nowicjusz: namePaths(1, selectedPaths.nowicjusz),
        ekspert: namePaths(3, selectedPaths.ekspert),
        mistrz: namePaths(7, selectedPaths.mistrz)
      },
      profesje: selectedProfessions.map(id => availableProfessions.find(p => p.id === id)?.nazwa || id),
      jezyki,
      kurioza: selectedCurios.map(id => availableCurios.find(c => c.id === id)?.nazwa || id),
      tradycje: [...knownTraditions].map(id => TRADITIONS[id]?.nazwa || id).sort((a, b) => a.localeCompare(b, 'pl')),
      zaklecia: zaklecia.map(s => s.nazwa),
      srebrniki: randomizedSilver,
      ekwipunek: (() => {
        const state = calculateStateEquipment();
        if (!state) return null;
        const entries = [...state.ownedStarting, ...state.purchasedEntries].map(p => {
          if (p.zwojZaklecie) {
            const spell = p.zwojZaklecie.spellId ? SPELLS.find(s => s.id === p.zwojZaklecie.spellId) : null;
            return `Zwój (${TRADITIONS[p.zwojZaklecie.tradycjaId]?.nazwa || p.zwojZaklecie.tradycjaId}${spell ? `: ${spell.nazwa}` : ''})`;
          }
          const nazwa = p.itemId ? (getItem(p.itemId)?.nazwa || p.itemId) : p.tekst;
          return p.ilosc > 1 ? `${nazwa} ×${p.ilosc}` : nazwa;
        });
        return { zamoznosc: state.wealthentry.nazwa, przedmioty: entries, gotowka: formatCopperbits(state.cashCopperbits) };
      })()
    }
  };
}

/**
 * Sprowadza tekst do postaci bezpiecznej jako fragment nazwy pliku: usuwa
 * polskie znaki diakrytyczne, zamienia wszystko poza literami/cyframi na
 * myślniki i przycina wielokrotne/skrajne myślniki. Zwraca '' dla pustego
 * lub samych znaków specjalnych wejścia (wywołujący ma wtedy własny fallback).
 */
function sanitizeForFilename(text) {
  if (!text) return '';
  return text
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // usuń diakrytyki (ą -> a, ł zostaje, bo to nie akcent)
    .replace(/ł/g, 'l').replace(/Ł/g, 'L')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Eksportuje postać jako JSON - pełny, wersjonowany zrzut wszystkich
 * wyborów dokonanych w kreatorze (zob. zbudujDaneEksportu()).
 */
// eslint-disable-next-line no-unused-vars
function exportJSON() {
  currentCharacter = buildExportData();
  if (!currentCharacter) {
    showError('Wybierz pochodzenie postaci, zanim wyeksportujesz kartę!');
    return;
  }

  const dataStr = JSON.stringify(currentCharacter, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${ encodeURIComponent(dataStr)}`;

  const namePart = sanitizeForFilename(currentCharacter.wybory.imie) || currentCharacter.wybory.pochodzenie;
  const exportFileDefaultName = `postac-${namePart}-${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

/**
 * Pokazuje komunikat błędu
 */
function showError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
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
function showImportMessage(typ, message, errorList = []) {
  const box = document.getElementById('import-feedback');
  if (!box) return;
  box.className = `import-feedback ${typ}`;
  const listHtml = errorList.length
    ? `<ul>${errorList.map(b => `<li>${b}</li>`).join('')}</ul>`
    : '';
  box.innerHTML = `${message}${listHtml}`;
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
function validateImportData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return ['Plik nie zawiera poprawnego obiektu JSON (oczekiwano danych postaci wyeksportowanych z tego kreatora).'];
  }

  const errors = [];
  if (data.wersjaEksportu !== EXPORT_VERSION) {
    errors.push(`Nieobsługiwana wersja pliku (${data.wersjaEksportu ?? 'brak'}) - ten kreator obsługuje wersję ${EXPORT_VERSION}.`);
  }

  const w = data.wybory;
  if (!w || typeof w !== 'object' || Array.isArray(w)) {
    errors.push('Plik nie zawiera wymaganej sekcji "wybory".');
    return errors;
  }

  if (!w.pochodzenie || typeof w.pochodzenie !== 'string') {
    errors.push('Brak pochodzenia postaci w pliku.');
  } else if (!availableOrigin.some(p => p.id === w.pochodzenie)) {
    errors.push(`Nieznane pochodzenie: "${w.pochodzenie}" nie istnieje w aktualnej bazie danych.`);
  }

  if (typeof w.poziom !== 'number' || !Number.isInteger(w.poziom) || w.poziom < 0 || w.poziom > 10) {
    errors.push(`Nieprawidłowy poziom postaci: "${w.poziom}" (oczekiwano liczby całkowitej 0-10).`);
  }

  const ATTRIBUTE_NAMES = ['sila', 'zrecznosc', 'intelekt', 'wola'];
  if (w.atrybutyGlowne && typeof w.atrybutyGlowne === 'object') {
    ['zmniejszony', 'zwiekszony'].forEach(pole => {
      const wartosc = w.atrybutyGlowne[pole];
      if (wartosc && !ATTRIBUTE_NAMES.includes(wartosc)) {
        errors.push(`Nieznany atrybut w polu "atrybutyGlowne.${pole}": "${wartosc}".`);
      }
    });
  }
  if (Array.isArray(w.bonusoweAtrybutyPochodzenia)) {
    w.bonusoweAtrybutyPochodzenia.forEach(atr => {
      if (atr && !ATTRIBUTE_NAMES.includes(atr)) {
        errors.push(`Nieznany bonusowy atrybut pochodzenia: "${atr}".`);
      }
    });
  }

  if (w.sciezki && typeof w.sciezki === 'object') {
    const groups = { nowicjusz: 1, ekspert: 3, mistrz: 7 };
    Object.entries(groups).forEach(([klucz, levelChoice]) => {
      const pathId = w.sciezki[klucz];
      if (!pathId) return;
      if (!getPathsForLevel(levelChoice).some(p => p.id === pathId)) {
        errors.push(`Nieznana ścieżka (${klucz}): "${pathId}" nie istnieje w aktualnej bazie danych.`);
      }
    });
  }

  if (w.atrybutySloty && typeof w.atrybutySloty === 'object') {
    Object.entries(w.atrybutySloty).forEach(([slotId, wartosci]) => {
      if (!Array.isArray(wartosci)) {
        errors.push(`Nieprawidłowa struktura slotu atrybutów "${slotId}" (oczekiwano tablicy).`);
        return;
      }
      wartosci.forEach(atr => {
        if (!ATTRIBUTE_NAMES.includes(atr)) {
          errors.push(`Nieznany atrybut "${atr}" w slocie zwiększenia "${slotId}".`);
        }
      });
    });
  }

  if (w.profesjeJezykiSloty && typeof w.profesjeJezykiSloty === 'object') {
    Object.entries(w.profesjeJezykiSloty).forEach(([slotId, answer]) => {
      if (!answer || typeof answer !== 'object') return;
      if (answer.mode === 'profesja' && answer.profesjaId && !availableProfessions.some(p => p.id === answer.profesjaId)) {
        errors.push(`Nieznana profesja: "${answer.profesjaId}" (slot "${slotId}") nie istnieje w aktualnej bazie danych.`);
      } else if ((answer.mode === 'jezyk_nowy' || answer.mode === 'jezyk_pismo') && answer.jezyk && !LANGUAGES[answer.jezyk]) {
        errors.push(`Nieznany język: "${answer.jezyk}" (slot "${slotId}") nie istnieje w aktualnej bazie danych.`);
      }
    });
  }

  if (Array.isArray(w.kurioza)) {
    w.kurioza.forEach(id => {
      if (!availableCurios.some(c => c.id === id)) {
        errors.push(`Nieznane kurioza: "${id}" nie istnieje w aktualnej bazie danych.`);
      }
    });
  }

  if (w.magia && w.magia.wybory && typeof w.magia.wybory === 'object') {
    Object.entries(w.magia.wybory).forEach(([atomId, wybor]) => {
      if (!wybor || typeof wybor !== 'object') return;
      if (wybor.tradycjaId && !TRADITIONS[wybor.tradycjaId]) {
        errors.push(`Nieznana tradycja magiczna: "${wybor.tradycjaId}" (wybór "${atomId}") nie istnieje w aktualnej bazie danych.`);
      }
      ['spellId', 'darmowyZaklecieId'].forEach(pole => {
        const spellId = wybor[pole];
        if (spellId && !SPELLS.some(s => s.id === spellId)) {
          errors.push(`Nieznane zaklęcie: "${spellId}" (wybór "${atomId}") nie istnieje w aktualnej bazie danych.`);
        }
      });
    });
  }

  if (w.srebrniki !== null && w.srebrniki !== undefined && typeof w.srebrniki !== 'number') {
    errors.push(`Nieprawidłowa wartość srebrników: "${w.srebrniki}" (oczekiwano liczby albo null).`);
  }

  if (w.ekwipunek && typeof w.ekwipunek === 'object') {
    const eq = w.ekwipunek;
    if (eq.zamoznoscId && !WEALTH[eq.zamoznoscId]) {
      errors.push(`Nieznany poziom zamożności: "${eq.zamoznoscId}" nie istnieje w aktualnej bazie danych.`);
    }
    if (eq.wybory && typeof eq.wybory === 'object') {
      Object.entries(eq.wybory).forEach(([atomId, wybor]) => {
        if (!wybor || typeof wybor !== 'object') return;
        if (wybor.itemId && !getItem(wybor.itemId)) {
          errors.push(`Nieznany przedmiot ekwipunku: "${wybor.itemId}" (wybór "${atomId}") nie istnieje w aktualnej bazie danych.`);
        }
        if (wybor.typ === 'zwoj_zaklecie') {
          if (wybor.tradycjaId && !TRADITIONS[wybor.tradycjaId]) {
            errors.push(`Nieznana tradycja magiczna: "${wybor.tradycjaId}" (zwój, wybór "${atomId}") nie istnieje w aktualnej bazie danych.`);
          }
          if (wybor.spellId && !SPELLS.some(s => s.id === wybor.spellId)) {
            errors.push(`Nieznane zaklęcie: "${wybor.spellId}" (zwój, wybór "${atomId}") nie istnieje w aktualnej bazie danych.`);
          }
        }
      });
    }
    if (Array.isArray(eq.zakupione)) {
      eq.zakupione.forEach(z => {
        if (z && z.itemId && !getItem(z.itemId)) {
          errors.push(`Nieznany przedmiot ekwipunku: "${z.itemId}" (zakupiony) nie istnieje w aktualnej bazie danych.`);
        }
      });
    }
  }

  return errors;
}

/**
 * Odtwarza w widocznym kafelku pochodzenia (Krok 1) zapisane wyniki tabel
 * losowych, dokładnie w tym samym formacie, w jakim wyświetla je losowanie
 * na żywo (zob. losujZTabeliUI()/zastosujWybranaOpcje()) - używane po
 * imporcie, żeby kafelek pokazywał te same wyniki co zapisany stan.
 */
function restoreTableResultsToDom(originId) {
  const wyniki = resultsTables[originId] || {};
  Object.entries(wyniki).forEach(([tableName, wynik]) => {
    const resultDiv = document.getElementById(`roll-result-${originId}-${tableName}`);
    if (!resultDiv) return;
    const typeLabel = wynik.typ === 'wybór' ? `${icon('target')} Wybór` : `${icon('dice')} Rzut`;
    const efekt = wynik.efekt ? `<br><strong>Efekt mechaniczny:</strong> ${wynik.efekt}` : '';
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
      <div class="roll-result-content">
        <div class="roll-dice">${typeLabel}: ${wynik.rzut}</div>
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
async function importCharacter(data) {
  const w = data.wybory;

  // 0. Imię postaci (Krok 8) - niezależne od pochodzenia/poziomu/itd.,
  // więc może być przywrócone w dowolnym miejscu tej sekwencji.
  characterName = w.imie || '';
  const nameInput = document.getElementById('character-name');
  if (nameInput) nameInput.value = characterName;

  // 1. Pochodzenie
  selectOrigin(w.pochodzenie, { autoScroll: false });

  // 2. Wyniki tabel pochodzenia (wybierzPochodzenie zeruje wynikiTabel - nadpisz PO)
  resultsTables[w.pochodzenie] = JSON.parse(JSON.stringify(w.wynikiTabelPochodzenia || {}));
  restoreTableResultsToDom(w.pochodzenie);

  // 3. Bonusowe atrybuty pochodzenia (np. Elf: 2 wybory)
  const bonusSelects = document.querySelectorAll('.origin-attr-choice-select');
  (w.bonusoweAtrybutyPochodzenia || []).forEach((wartosc, i) => {
    if (bonusSelects[i] && wartosc) {
      bonusSelects[i].value = wartosc;
      bonusSelects[i].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // 4. Poziom - ta sama sekwencja co listener zmiany radiobuttona (Krok 2)
  selectedLevel = w.poziom;
  const levelInput = document.querySelector(`input[name="poziom"][value="${w.poziom}"]`);
  if (levelInput) levelInput.checked = true;
  updatePathsVisibility(selectedLevel);
  await updatePathsLevel(selectedLevel);
  updatePathsSectionTitle(selectedLevel);
  updateWealthSection(selectedLevel);
  updateOriginBenefits(selectedLevel);
  renderPathSectionsVisibility();
  await renderPathSection(1);
  await renderPathSection(3);
  await renderPathSection(7);
  await loadBenefitsLevel(selectedLevel);

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
  const chkDefault = document.getElementById('default-attributes');
  chkDefault.checked = w.atrybutyGlowne?.domyslne ?? true;
  const customDiv = document.getElementById('custom-attributes');
  if (customDiv) customDiv.style.display = chkDefault.checked ? 'none' : 'block';
  if (!chkDefault.checked) {
    document.getElementById('attribute-decreased').value = w.atrybutyGlowne?.zmniejszony || '';
    document.getElementById('attribute-increased').value = w.atrybutyGlowne?.zwiekszony || '';
  }
  updateCalculatedAttributes();

  // 7. Ścieżki (Krok 3) - kliknij przyciski wyboru tak, jak zrobiłby użytkownik
  [[1, w.sciezki?.nowicjusz], [3, w.sciezki?.ekspert], [7, w.sciezki?.mistrz]].forEach(([levelChoice, pathId]) => {
    if (!pathId) return;
    document.querySelector(`button[data-path-id="${pathId}"][data-pick-level="${levelChoice}"]`)?.click();
  });

  // 8. Sloty zwiększenia atrybutów (Krok 4)
  selectedAttributesSlots = JSON.parse(JSON.stringify(w.atrybutySloty || {}));
  renderAttributesSlotsSection();

  // 9. Profesje i języki (Krok 5)
  answersSlots = JSON.parse(JSON.stringify(w.profesjeJezykiSloty || {}));
  renderProfessionsSection();

  // 10. Kurioza (Krok 5)
  selectedCurios = [...(w.kurioza || [])];
  renderCuriosSection();
  updateStep5NextButton();

  // 11. Srebrniki (Krok 5) - tylko suma jest zapisywana, pojedyncze rzuty są ulotne
  randomizedSilver = (typeof w.srebrniki === 'number') ? w.srebrniki : null;
  const wealthSpan = document.getElementById('wealth-summary');
  if (wealthSpan && randomizedSilver != null) {
    wealthSpan.textContent = `Srebrniki: ${randomizedSilver} (zaimportowano)`;
  }

  // 12. Magia: tradycje i zaklęcia (Krok 6)
  magicChoices = JSON.parse(JSON.stringify(w.magia?.wybory || {}));
  magicRiskResults = JSON.parse(JSON.stringify(w.magia?.ryzykoWyniki || {}));
  renderSpellsSection();

  // 13. Ekwipunek: zamożność, startowe wyposażenie i sklep (Krok 7)
  equipmentWealthId = w.ekwipunek?.zamoznoscId || null;
  equipmentWealthResult = (typeof w.ekwipunek?.zamoznoscWynik === 'number') ? w.ekwipunek.zamoznoscWynik : null;
  equipmentStartingCashRoll = (typeof w.ekwipunek?.gotowkaPoczatkowaWynik === 'number') ? w.ekwipunek.gotowkaPoczatkowaWynik : null;
  equipmentChoices = JSON.parse(JSON.stringify(w.ekwipunek?.wybory || {}));
  equipmentSold = [...(w.ekwipunek?.sprzedane || [])];
  equipmentPurchased = JSON.parse(JSON.stringify(w.ekwipunek?.zakupione || []));
  renderEquipmentSection();

  updatePreviewCharacter();
}

/**
 * Obsługuje wybrany plik importu: odczytuje go, parsuje jako JSON, waliduje
 * (zob. walidujDaneImportu()) i - jeśli poprawny - odtwarza całą postać
 * w kreatorze (zob. zaimportujPostac()). Pokazuje czytelne komunikaty
 * błędów w Kroku 1, gdy plik jest uszkodzony, ma złą strukturę albo
 * odwołuje się do pochodzeń/ścieżek/profesji/kuriozów/tradycji/zaklęć,
 * które nie istnieją w aktualnej bazie danych aplikacji.
 */
function handleFileImport(file) {
  const reader = new FileReader();
  reader.onload = async (e) => {
    let data;
    try {
      data = JSON.parse(e.target.result);
    } catch (err) {
      showImportMessage('error', 'Nie udało się odczytać pliku - to nie jest poprawny plik JSON.');
      return;
    }

    const errors = validateImportData(data);
    if (errors.length > 0) {
      showImportMessage('error', 'Nie udało się zaimportować postaci - plik zawiera błędy:', errors);
      return;
    }

    try {
      await importCharacter(data);
      // Zapisz zaimportowaną postać w cache przeglądarki od razu, pod nowym
      // id - dalsze zmiany, aż do ponownego dotarcia do Kroku 8, nadpiszą
      // ten sam zapis (zob. zapiszAktualnaPostacDoCache()).
      currentSaveCacheId = generateSaveId();
      saveCharacterToCache(currentSaveCacheId, data);
      showImportMessage('success', `${icon('check')} Postać została pomyślnie zaimportowana. Przejdź przez kolejne kroki (albo od razu do Kroku 8 z górnego menu), by zweryfikować wynik.`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Błąd importu postaci:', err);
      showImportMessage('error', `Wystąpił nieoczekiwany błąd podczas importu: ${err.message}`);
    }
  };
  reader.onerror = () => {
    showImportMessage('error', 'Nie udało się odczytać wybranego pliku.');
  };
  reader.readAsText(file);
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
function applySelectedOptions(originId, tableName) {
  const dropdown = document.getElementById(`table-select-${originId}-${tableName}`);
  const resultDiv = document.getElementById(`roll-result-${originId}-${tableName}`);
  const applyBtn = document.querySelector(`.apply-selection-btn[data-origin-id="${originId}"][data-table-name="${tableName}"]`);
  
  if (!dropdown || !resultDiv) return;
  
  const selectedOption = dropdown.options[dropdown.selectedIndex];
  if (!selectedOption || !selectedOption.value) return;
  
  const rzut = selectedOption.value;
  const wynik = selectedOption.dataset.wynik;
  
  // Zapisz wynik w globalnej zmiennej
  if (!resultsTables[originId]) {
    resultsTables[originId] = {};
  }
  resultsTables[originId][tableName] = {
    rzut,
    wynik,
    typ: 'wybór'
  };
  
  // Wyświetl wynik
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `
    <div class="roll-result-content">
      <div class="roll-dice">${icon('target')} Wybór: ${rzut}</div>
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
async function randomizeWithTableUi(originId, tableName) {
  try {
    // Wyświetl loading
    const resultDiv = document.getElementById(`roll-result-${originId}-${tableName}`);
    if (resultDiv) {
      resultDiv.style.display = 'block';
      resultDiv.innerHTML = `<div class="loading">${icon('dice')} Losowanie...</div>`;
    }
    
    // Wykonaj losowanie
    const wynik = rollTable(originId, tableName);

    // Zapisz wynik w globalnej zmiennej
    if (!resultsTables[originId]) {
      resultsTables[originId] = {};
    }
    resultsTables[originId][tableName] = {
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
          <div class="roll-dice">${icon('dice')} Rzut: ${wynik.rzut}</div>
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
      resultDiv.innerHTML = `<div class="error">${icon('x')} Błąd: ${error.message}</div>`;
    }
  }
}

/**
 * Renderuje podsumowanie wybranych profesji i kuriozów w podglądzie postaci
 * @returns {string} HTML z podsumowaniem profesji i kuriozów
 */
function renderProfessionsAndCuriosSummary() {
  const professions = selectedProfessions.map(id => {
    const prof = availableProfessions.find(p => p.id === id);
    return prof ? prof.nazwa : id;
  });

  const curios = selectedCurios.map(id => {
    const curio = availableCurios.find(c => c.id === id);
    return curio ? curio.nazwa : id;
  });

  const script = new Set(getLanguagesWithScript());
  const jezyki = getSpokenLanguages().map(k => {
    const nazwa = LANGUAGES[k] || k;
    return script.has(k) ? `${nazwa} (czytanie/pisanie)` : nazwa;
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
async function loadProfessionsAndCurios() {
  try {
    const profData = getProfessionsUi();
    availableProfessions = profData.profesje;

    const curiosData = getCuriosUi();
    availableCurios = curiosData.kurioza;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Nie udało się załadować profesji i kuriozów:', e);
  }
}

/**
 * Oblicza ilość kuriozów do wyboru na podstawie poziomu (progi 1/3/7).
 * Profesje i języki liczone są przez system slotów - patrz obliczSlotyPostaci().
 */
function calculateChoiceCount() {
  const poziom = selectedLevel;
  let kurioza = 0;

  if (selectedOrigin) kurioza += 1; // Każde pochodzenie daje 1 kurioza
  if (poziom >= 1) kurioza += 1;
  if (poziom >= 3) kurioza += 1;
  if (poziom >= 7) kurioza += 1;

  return { kurioza };
}

/**
 * Oblicza wszystkie sloty językowo-profesyjne przyznane postaci na podstawie
 * wybranego pochodzenia i ścieżek (patrz logic/languages-professions.js).
 */
function calculateSlotsCharacter() {
  const pochodzenie = availableOrigin.find(p => p.id === selectedOrigin) || null;
  return calculateSlotsProfessionsAndLanguages({
    pochodzenie,
    pathNoviceId: selectedPaths.nowicjusz || null,
    pathExpertId: selectedPaths.ekspert || null,
    pathMasterId: selectedPaths.mistrz || null
  });
}

/** Etykiety kategorii profesji używane w PROFESSIONS.tables/dostepneProfesje. */
const CATEGORY_LABELS = {
  naukowe: 'Naukowe', pospolite: 'Pospolite', przestepcze: 'Przestępcze',
  wojenne: 'Wojenne', koczownicze: 'Koczownicze', religijne: 'Religijne'
};

/**
 * Zwraca profesje z dostepneProfesje dopuszczone przez kategorie slotu,
 * z wyłączeniem profesji już przypisanych do innych slotów.
 */
function professionsForSlot(slot) {
  const all = slot.kategorie.includes('dowolna');
  const taken = new Set(
    Object.entries(answersSlots)
      .filter(([id, answer]) => id !== slot.id && answer && answer.mode === 'profesja' && answer.profesjaId)
      .map(([, answer]) => answer.profesjaId)
  );
  return availableProfessions.filter(p => {
    if (taken.has(p.id)) return false;
    if (all) return true;
    const cat = Object.keys(CATEGORY_LABELS).find(k => CATEGORY_LABELS[k] === p.kategoria);
    return slot.kategorie.includes(cat);
  });
}

/**
 * Znane języki (mówione) wraz ze źródłem każdego z nich: bazowe z
 * pochodzenia + wyuczone w slotach jezyk_nowy.
 * @returns {Array<{jezyk: string, source: string}>}
 */
function getLanguagesWithDetails() {
  const pochodzenie = availableOrigin.find(p => p.id === selectedOrigin);
  const wynik = [];
  if (pochodzenie) {
    pochodzenie.jezyki.forEach(j => wynik.push({ jezyk: j, source: `Pochodzenie: ${pochodzenie.nazwa}` }));
  }
  const { slots } = calculateSlotsCharacter();
  slots.forEach(slot => {
    const answer = answersSlots[slot.id];
    if (answer && answer.mode === 'jezyk_nowy' && answer.jezyk && !wynik.some(w => w.jezyk === answer.jezyk)) {
      wynik.push({ jezyk: answer.jezyk, source: slot.source });
    }
  });
  return wynik;
}

/** Znane języki (mówione), bez informacji o źródle - patrz pobierzJezykiZeSzczegolami(). */
function getSpokenLanguages() {
  return getLanguagesWithDetails().map(w => w.jezyk);
}

/**
 * Języki, w których postać umie czytać/pisać, wraz ze źródłem: automatyczne
 * (Magik - wszystkie znane; niektóre pochodzenia - konkretny język, patrz
 * origins.js) lub wybrane wprost w slocie typu jezyk_pismo.
 * @returns {Array<{jezyk: string, source: string}>}
 */
function getScriptWithDetails() {
  const { autoScriptAllKnown, autoScriptAllKnownSource, autoScriptWithOrigin, autoScriptWithOriginSource, slots } = calculateSlotsCharacter();

  if (autoScriptAllKnown) {
    return getLanguagesWithDetails().map(w => ({ jezyk: w.jezyk, source: autoScriptAllKnownSource }));
  }

  const wynik = autoScriptWithOrigin.map(j => ({ jezyk: j, source: autoScriptWithOriginSource }));
  slots.forEach(slot => {
    const answer = answersSlots[slot.id];
    if (answer && answer.mode === 'jezyk_pismo' && answer.jezyk && !wynik.some(w => w.jezyk === answer.jezyk)) {
      wynik.push({ jezyk: answer.jezyk, source: slot.source });
    }
  });
  return wynik;
}

/** Języki z pismem, bez informacji o źródle - patrz pobierzPismoZeSzczegolami(). */
function getLanguagesWithScript() {
  return getScriptWithDetails().map(w => w.jezyk);
}

/**
 * Renderuje kartę jednego slotu profesyjno-językowego (wybór trybu + odpowiedni picker).
 */
function renderSlotCard(slot) {
  const answer = answersSlots[slot.id] || {};
  const mode = answer.mode || (slot.opcje.length === 1 ? slot.opcje[0] : null);

  const labelsModes = { profesja: 'Profesja', jezyk_nowy: 'Nowy język', jezyk_pismo: 'Pismo w znanym języku' };
  const modesHtml = slot.opcje.length > 1 ? `
    <div class="slot-mode-toggle" role="radiogroup">
      ${slot.opcje.map(o => `
        <label class="slot-mode-option">
          <input type="radio" name="mode-${slot.id}" value="${o}" ${mode === o ? 'checked' : ''}>
          ${labelsModes[o]}
        </label>
      `).join('')}
    </div>
  ` : '';

  let pickerHtml = '';
  if (mode === 'profesja') {
    const optionsProf = professionsForSlot(slot);
    const groups = {};
    optionsProf.forEach(p => { (groups[p.kategoria] = groups[p.kategoria] || []).push(p); });
    pickerHtml = `
      <select class="slot-value-select" data-slot-id="${slot.id}" data-slot-field="profesjaId">
        <option value="">-- wybierz profesję --</option>
        ${Object.entries(groups).map(([cat, profs]) => `
          <optgroup label="${cat}">
            ${profs.map(p => `<option value="${p.id}" ${answer.profesjaId === p.id ? 'selected' : ''}>${p.nazwa}</option>`).join('')}
          </optgroup>
        `).join('')}
      </select>
    `;
  } else if (mode === 'jezyk_nowy') {
    const known = new Set(getSpokenLanguages());
    const optionsJ = Object.entries(LANGUAGES).filter(([klucz]) => !known.has(klucz) || klucz === answer.jezyk);
    pickerHtml = `
      <select class="slot-value-select" data-slot-id="${slot.id}" data-slot-field="jezyk">
        <option value="">-- wybierz język --</option>
        ${optionsJ.map(([klucz, nazwa]) => `<option value="${klucz}" ${answer.jezyk === klucz ? 'selected' : ''}>${nazwa}</option>`).join('')}
      </select>
    `;
  } else if (mode === 'jezyk_pismo') {
    const spoken = getSpokenLanguages();
    const alreadyScript = new Set(getLanguagesWithScript());
    const optionsJ = spoken.filter(k => !alreadyScript.has(k) || k === answer.jezyk);
    pickerHtml = `
      <select class="slot-value-select" data-slot-id="${slot.id}" data-slot-field="jezyk">
        <option value="">-- wybierz język --</option>
        ${optionsJ.map(klucz => `<option value="${klucz}" ${answer.jezyk === klucz ? 'selected' : ''}>${LANGUAGES[klucz] || klucz}</option>`).join('')}
      </select>
    `;
  }

  return `
    <div class="slot-card" data-slot-id="${slot.id}">
      <div class="slot-source">
        ${slot.source}
        <button type="button" class="section-reset-btn" data-reset-jp-slot="${slot.id}" title="Wyczyść wybór dla tego slotu">Wyczyść</button>
      </div>
      ${slot.opis ? `<div class="slot-description">${slot.opis}</div>` : ''}
      ${modesHtml}
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

  const { slots } = calculateSlotsCharacter();

  container.innerHTML = slots.map(slot => renderSlotCard(slot)).join('');

  container.querySelectorAll('input[type="radio"][name^="mode-"]').forEach(input => {
    input.addEventListener('change', (e) => {
      const slotId = e.target.closest('.slot-card').dataset.slotId;
      setSlotAnswer(slotId, { mode: e.target.value, profesjaId: null, jezyk: null });
    });
  });
  container.querySelectorAll('.slot-value-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const { slotId, slotField } = e.target.dataset;
      setSlotAnswer(slotId, { [slotField]: e.target.value || null });
    });
  });
  container.querySelectorAll('[data-reset-jp-slot]').forEach(btn => {
    btn.addEventListener('click', () => {
      delete answersSlots[btn.dataset.resetJpSlot];
      renderProfessionsSection();
    });
  });

  syncSelectedProfessions();
  updateSelectedProfessions();
  renderLanguagesSummary();
  updateStep5NextButton();
}

/**
 * Scala częściową odpowiedź w slot i przerenderowuje sekcję.
 */
function setSlotAnswer(slotId, patch) {
  answersSlots[slotId] = { ...answersSlots[slotId], ...patch };
  renderProfessionsSection();
}

/**
 * Odtwarza płaską listę wybranych profesji (do podglądu/eksportu postaci)
 * na podstawie aktualnych odpowiedzi slotów.
 */
function syncSelectedProfessions() {
  selectedProfessions = Object.values(answersSlots)
    .filter(answer => answer && answer.mode === 'profesja' && answer.profesjaId)
    .map(answer => answer.profesjaId);
}

/** Pełne nazwy podręczników odpowiadające skrótom używanym w polu `zrodlo`. */
const FULL_SOURCE_NAMES = {
  PG: 'Podręcznik Główny',
  SUP: 'Suplement Władcy Demonów',
  NW: 'Niepewna Wiara',
  RA: 'Rozkoszna Agonia',
  SP: 'Straszliwe Piękno',
  // Uwaga na skróty: GWP to "Głód W Pustce", a GP to "Grobowce Pustkowia" -
  // tak są oznaczone dane (zob. komentarze przy zrodlo w data/origins.js).
  GP: 'Grobowce Pustkowia',
  GWP: 'Głód w Pustce',
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
function renderSourceTag(source) {
  if (!source) return '';
  const fullName = FULL_SOURCE_NAMES[source] || source;
  return `<span class="source-tag" title="${fullName}">(${source})</span>`;
}

function renderLanguagesSummary() {
  const summary = document.getElementById('languages-known-summary');
  const list = document.getElementById('language-slots');
  if (!summary || !list) return;

  const { autoScriptAllKnown, autoScriptAllKnownSource } = calculateSlotsCharacter();
  const spokenDetails = getLanguagesWithDetails();
  const scriptByLanguage = new Map(getScriptWithDetails().map(w => [w.jezyk, w.source]));

  summary.innerHTML = spokenDetails.length
    ? `Znane języki: <strong>${spokenDetails.map(w => LANGUAGES[w.jezyk] || w.jezyk).join(', ')}</strong>`
    : 'Brak wybranego pochodzenia.';

  list.innerHTML = spokenDetails.map(({ jezyk, source }) => {
    const scriptSource = scriptByLanguage.get(jezyk);
    return `
      <div class="language-chip">
        <div class="language-chip-row">
          <span class="language-name">${LANGUAGES[jezyk] || jezyk}</span>
          ${renderSourceTag(source)}
        </div>
        <div class="language-chip-row">
          <span class="language-flags">mówiony${scriptSource ? ' • pismo' : ''}</span>
          ${scriptSource ? renderSourceTag(scriptSource) : ''}
        </div>
      </div>
    `;
  }).join('') + (autoScriptAllKnown ? `<p class="hint">Magik automatycznie czyta i pisze we wszystkich znanych sobie językach ${renderSourceTag(autoScriptAllKnownSource)}.</p>` : '');
}


/**
 * Aktualizuje listę wybranych profesji (pigułki pod slotami)
 */
function updateSelectedProfessions() {
  const listDiv = document.getElementById('professions-list');
  if (!listDiv) return;

  const { slots } = calculateSlotsCharacter();

  listDiv.innerHTML = slots.map(slot => {
    const answer = answersSlots[slot.id];
    if (!answer || answer.mode !== 'profesja' || !answer.profesjaId) return '';
    const prof = availableProfessions.find(p => p.id === answer.profesjaId);
    if (!prof) return '';
    return `
      <div class="selected-item">
        <button class="remove-btn" data-remove-profession-id="${prof.id}">×</button>
        <span>${prof.nazwa}</span>
        ${renderSourceTag(slot.source)}
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
  const slotId = Object.keys(answersSlots).find(id => {
    const answer = answersSlots[id];
    return answer && answer.mode === 'profesja' && answer.profesjaId === professionId;
  });
  if (slotId) {
    answersSlots[slotId] = { ...answersSlots[slotId], profesjaId: null };
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
  
  const { kurioza } = calculateChoiceCount();
  countSpan.textContent = kurioza;
  
  // Wyczyść grid
  grid.innerHTML = '';
  
  // Grupuj kurioza według kategorii
  const kategorie = {};
  availableCurios.forEach(curio => {
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
  const isSelected = selectedCurios.includes(curio.id);
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
  const { kurioza } = calculateChoiceCount();
  
  if (selectedCurios.includes(curioId)) {
    // Usuń z wybranych
    selectedCurios = selectedCurios.filter(id => id !== curioId);
  } else {
    // Dodaj do wybranych (jeśli nie przekracza limitu)
    if (selectedCurios.length < kurioza) {
      selectedCurios.push(curioId);
    }
  }
  
  renderCuriosSection();
  updateStep5NextButton();
}


/**
 * Sprawdza, czy dany slot profesyjno-językowy ma kompletną odpowiedź.
 */
function slotAnswerComplete(slot) {
  const answer = answersSlots[slot.id];
  // Gdy slot ma tylko jedną dozwoloną opcję (np. 'tylko_profesja'), UI nie
  // renderuje przełącznika trybu (radiogroup) - tryb trzeba więc wywnioskować
  // tak samo, jak robi to renderSlotCard(), inaczej odpowiedź nigdy nie
  // zostanie uznana za kompletną, mimo wybranej wartości w widocznym select.
  const mode = answer?.mode || (slot.opcje.length === 1 ? slot.opcje[0] : null);
  if (!mode) return false;
  return mode === 'profesja' ? !!answer?.profesjaId : !!answer?.jezyk;
}

/**
 * Zwraca dostępne wartości dla danego trybu ('profesja'/'jezyk_nowy'/
 * 'jezyk_pismo') w kontekście danego slotu.
 */
function valueOptionsForMode(slot, mode) {
  if (mode === 'profesja') {
    return professionsForSlot(slot).map(p => p.id);
  }
  if (mode === 'jezyk_nowy') {
    const known = new Set(getSpokenLanguages());
    return Object.keys(LANGUAGES).filter(k => !known.has(k));
  }
  if (mode === 'jezyk_pismo') {
    const alreadyScript = new Set(getLanguagesWithScript());
    return getSpokenLanguages().filter(k => !alreadyScript.has(k));
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
function randomOrder(array) {
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
function randomizeProfessionsCentrally() {
  const { slots } = calculateSlotsCharacter();

  for (const slot of slots) {
    if (slotAnswerComplete(slot)) continue;

    const selectedMode = answersSlots[slot.id]?.mode;
    const modes = selectedMode ? [selectedMode] : randomOrder(slot.opcje);

    for (const mode of modes) {
      const opcje = valueOptionsForMode(slot, mode);
      if (opcje.length === 0) continue;
      const pick = opcje[Math.floor(Math.random() * opcje.length)];
      answersSlots[slot.id] = mode === 'profesja' ? { mode, profesjaId: pick } : { mode, jezyk: pick };
      break;
    }
  }

  renderProfessionsSection();
}

/**
 * Losuje kurioza zgodnie z aktualnym limitem brakujących wyborów
 */
function randomizeCuriosCentrally() {
  const { kurioza } = calculateChoiceCount();
  const remaining = Math.max(0, kurioza - selectedCurios.length);
  if (remaining === 0) return;
  const available = availableCurios.filter(c => !selectedCurios.includes(c.id));
  for (let i = 0; i < remaining && available.length > 0; i++) {
    const idx = Math.floor(Math.random() * available.length);
    const pick = available.splice(idx, 1)[0];
    selectedCurios.push(pick.id);
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
  
  listDiv.innerHTML = selectedCurios.map(id => {
    const curio = availableCurios.find(c => c.id === id);
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
  selectedCurios = selectedCurios.filter(id => id !== curioId);
  renderCuriosSection();
  updateStep5NextButton();
}

/**
 * Aktualizuje przycisk "Dalej" w Kroku 5
 */
function updateStep5NextButton() {
  const btn = document.getElementById('btn-next-5');
  if (!btn) return;

  const { kurioza } = calculateChoiceCount();
  const { slots } = calculateSlotsCharacter();
  const hasRequiredProfessions = slots.every(slot => slotAnswerComplete(slot));
  const hasRequiredCurios = selectedCurios.length >= kurioza;

  btn.disabled = !(hasRequiredProfessions && hasRequiredCurios);
}

/**
 * Zwraca wybraną opcję radiową sekcji "Korzyści z Pochodzenia" (poziom 4),
 * jeśli już wybrana - potrzebne do ustalenia, czy pochodzenie przyznaje
 * dodatkowy atomowy wybór zaklęcia na tym poziomie ("1 zaklęcie").
 */
function getCurrentSelectedLevel4Option() {
  if (!selectedOrigin) return null;
  return document.querySelector(`input[name="origin-option-${selectedOrigin}"]:checked`)?.value || null;
}

/**
 * Oblicza aktualne atomowe wybory magii (jeden atom = jedna karta w Kroku
 * 4.5) na podstawie pochodzenia, wybranych ścieżek i poziomu postaci.
 */
function getCurrentAtomsMagic() {
  if (!selectedOrigin) return [];
  const pochodzenie = availableOrigin.find(p => p.id === selectedOrigin);
  if (!pochodzenie) return [];
  return calculateSlotsMagic({
    pochodzenie,
    wybranaOpcjaPoziom4: getCurrentSelectedLevel4Option(),
    pathNoviceId: selectedPaths.nowicjusz || null,
    pathExpertId: selectedPaths.ekspert || null,
    pathMasterId: selectedPaths.mistrz || null,
    selectedLevel
  });
}

/** Odczytuje aktualną Moc postaci - limit kręgu zaklęć dostępnych do nauki. */
function getCurrentPower() {
  return parseInt(document.getElementById('power-final')?.textContent, 10) || 0;
}

/**
 * Renderuje Krok 6: jedną kartę na każdy atomowy wybór magii faktycznie
 * przyznany przez pochodzenie/ścieżki na obecnym poziomie postaci (zamiast
 * swobodnie przeglądanej biblioteki) - w pełni zgodne z zasadami nauki
 * tradycji i zaklęć z podręcznika (zob. logic/magic.js).
 */
function renderSpellsSection() {
  const atoms = getCurrentAtomsMagic();
  const container = document.getElementById('magic-slots-container');
  const hint = document.getElementById('known-traditions-hint');
  if (!container) return;

  if (atoms.length === 0) {
    container.innerHTML = '<p class="hint">Żadna z dotychczas wybranych ścieżek (ani pochodzenie) nie przyznaje magii na obecnym poziomie postaci - ten krok jest w pełni opcjonalny.</p>';
    if (hint) hint.innerHTML = '';
    return;
  }

  const { resolutions, knownTraditions } = calculateResolutionMagic(atoms, magicChoices);
  recalculateBlackMagicWithTraditions(resolutions);

  if (hint) {
    const names = [...knownTraditions].map(id => TRADITIONS[id]?.nazwa || id).sort((a, b) => a.localeCompare(b, 'pl'));
    hint.innerHTML = names.length
      ? `<strong>Znane tradycje:</strong> ${names.join(', ')}`
      : 'Jeszcze nie poznano żadnej tradycji.';
  }

  container.innerHTML = resolutions.map(r => renderCardMagic(r)).join('');
  attachHandleCardsMagic(container);
  refreshAttributesSecondary();
}

/**
 * Przelicza (od zera, na podstawie aktualnych rozwiązań) zbiór tradycji
 * czarnej magii już poznanych - za każdą przysługuje jednorazowo 1 punkt
 * Splugawienia. Liczone od zera przy każdym renderze, żeby wycofanie
 * wcześniejszego wyboru poprawnie usunęło też przyznane Splugawienie.
 */
function recalculateBlackMagicWithTraditions(resolutions) {
  const updatedSet = new Set();
  resolutions.forEach(r => {
    if (r.mode === 'tradycja' && r.tradycjaId && isBlackMagic(r.tradycjaId)) updatedSet.add(r.tradycjaId);
  });
  magicBlackMagicTooTraditions = updatedSet;
}

/**
 * Suma Splugawienia przyznanego przez magię: 1 punkt za każdą poznaną
 * tradycję czarnej magii, plus 1 punkt za każdy rzut ryzyka, który się
 * powiódł (nauka kolejnego zaklęcia czarnej magii z już znanej tradycji).
 */
function calculateCorruptionFromCurrentMagic() {
  const withTraditions = magicBlackMagicTooTraditions.size;
  const withRisk = Object.values(magicRiskResults).filter(w => w.przyznane).length;
  return withTraditions + withRisk;
}

/** Renderuje pojedynczą kartę jednego atomowego wyboru magii. */
function renderCardMagic(resolution) {
  const { atom, mode, tradycjaId, spellId, darmowyZaklecieId, complete, blackMagicRisk } = resolution;
  const isBlackTradition = mode === 'tradycja' && isBlackMagic(tradycjaId);
  const classes = ['magic-slot-card'];
  if (complete) classes.push('complete');
  if (isBlackTradition || blackMagicRisk) classes.push('black-magic');

  let bodyHtml = '';
  if (atom.rodzaj === 'wymuszona_tradycja') {
    bodyHtml = renderChoiceTraditions(atom.id, atom.kategoria, tradycjaId);
    if (tradycjaId) bodyHtml += renderChoiceFreeSpells(atom.id, tradycjaId, darmowyZaklecieId);
  } else if (atom.rodzaj === 'wybor_fixed') {
    const traditionName = TRADITIONS[atom.tradycjaNazwa]?.nazwa || atom.tradycjaNazwa;
    if (mode === 'tradycja') {
      bodyHtml = `<p class="magic-slot-status ok">Tradycja ${traditionName} nie jest jeszcze znana - zostanie automatycznie poznana.</p>`;
      bodyHtml += renderChoiceFreeSpells(atom.id, atom.tradycjaNazwa, darmowyZaklecieId);
    } else {
      bodyHtml = renderChoiceSpells(atom.id, spellId, atom.tradycjaNazwa);
    }
  } else if (atom.rodzaj === 'wybor') {
    bodyHtml = `
      <div class="magic-slot-mode-toggle">
        <button type="button" class="btn-secondary small ${mode === 'tradycja' ? 'active' : ''}" data-magic-mode="${atom.id}" data-mode-value="tradycja">Nowa tradycja</button>
        <button type="button" class="btn-secondary small ${mode === 'zaklecie' ? 'active' : ''}" data-magic-mode="${atom.id}" data-mode-value="zaklecie">Zaklęcie</button>
      </div>
    `;
    if (mode === 'tradycja') {
      bodyHtml += renderChoiceTraditions(atom.id, atom.kategoria, tradycjaId);
      if (tradycjaId) bodyHtml += renderChoiceFreeSpells(atom.id, tradycjaId, darmowyZaklecieId);
    } else if (mode === 'zaklecie') {
      bodyHtml += renderChoiceSpells(atom.id, spellId);
    }
  } else if (atom.rodzaj === 'zaklecie_tylko') {
    bodyHtml = renderChoiceSpells(atom.id, spellId);
  }

  return `
    <div class="${classes.join(' ')}" data-magic-slot="${atom.id}">
      <p class="magic-slot-source">${atom.source}</p>
      <p class="magic-slot-desc">${atomDescription(atom)}</p>
      ${bodyHtml}
      ${renderBlackMagicWarning(resolution)}
      <p class="magic-slot-status ${complete ? 'ok' : ''}">${complete ? `${icon('check')} Rozwiązano` : 'Nierozwiązane (opcjonalne)'}</p>
    </div>
  `;
}

/**
 * Renderuje przycisk otwarcia popupu wyboru nowej tradycji dla danego
 * atomu wraz z kafelkiem aktualnego wyboru (jeśli już dokonano) - bez
 * dropdownów, wybór odbywa się w popupie na kafelkach (zob. otworzTradycjaPicker()).
 */
function renderChoiceTraditions(atomId, kategoria, currentChoice) {
  const nazwa = currentChoice ? (TRADITIONS[currentChoice]?.nazwa || currentChoice) : null;
  const black = currentChoice && isBlackMagic(currentChoice);
  return `
    <div class="magic-slot-picker">
      ${nazwa ? `
        <div class="magic-picked-chip">${nazwa}${black ? ` ${icon('warning')}` : ''}
          <button type="button" class="chip-remove" data-magic-clear="${atomId}" data-clear-field="tradycjaId" title="Usuń wybór">${icon('x')}</button>
        </div>
      ` : ''}
      <button type="button" class="btn-secondary small" data-open-tradition-picker="${atomId}" data-category="${(kategoria || ['dowolna']).join(',')}">${nazwa ? 'Zmień tradycję' : 'Wybierz tradycję'}</button>
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
function renderChoiceSpells(atomId, currentChoice, tradycjaOgraniczenie = null) {
  const spell = currentChoice ? SPELLS.find(s => s.id === currentChoice) : null;
  return `
    <div class="magic-slot-picker">
      ${spell ? `
        <div class="magic-picked-chip">${spell.nazwa} (${spell.tradycjaNazwa}, krąg ${spell.krag})${isBlackMagic(spell.tradycja) ? ` ${icon('warning')}` : ''}
          <button type="button" class="chip-remove" data-magic-clear="${atomId}" data-clear-field="spellId" title="Usuń wybór">${icon('x')}</button>
        </div>
      ` : ''}
      <button type="button" class="btn-secondary small" data-open-spell-picker="${atomId}" data-tradition-restriction="${tradycjaOgraniczenie || ''}">${spell ? 'Zmień zaklęcie' : 'Wybierz zaklęcie'}</button>
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
function renderChoiceFreeSpells(atomId, tradycjaId, currentChoice) {
  const spell = currentChoice ? SPELLS.find(s => s.id === currentChoice) : null;
  return `
    <div class="magic-slot-picker magic-slot-picker-secondary">
      ${spell ? `
        <div class="magic-picked-chip">${spell.nazwa} (krąg 0)
          <button type="button" class="chip-remove" data-magic-clear="${atomId}" data-clear-field="darmowyZaklecieId" title="Usuń wybór">${icon('x')}</button>
        </div>
      ` : ''}
      <button type="button" class="btn-secondary small" data-open-free-spell-picker="${atomId}" data-tradition-free="${tradycjaId}">${spell ? 'Zmień darmowe zaklęcie' : 'Wybierz zaklęcie kręgu 0'}</button>
    </div>
  `;
}

/**
 * Renderuje ostrzeżenie/informację o czarnej magii dla danej karty: albo
 * informację o automatycznym Splugawieniu za poznanie tradycji, albo
 * widget rzutu ryzyka (k6) przy nauce kolejnego zaklęcia czarnej magii.
 */
function renderBlackMagicWarning(resolution) {
  const { atom, mode, tradycjaId, spellId, blackMagicRisk } = resolution;
  if (mode === 'tradycja' && tradycjaId && isBlackMagic(tradycjaId)) {
    return `<div class="black-magic-warning">${icon('warning')} ${TRADITIONS[tradycjaId]?.nazwa || tradycjaId} to tradycja czarnej magii - poznanie przyznaje automatycznie <strong>1 punkt Splugawienia</strong>.</div>`;
  }
  if (blackMagicRisk) {
    const wynik = magicRiskResults[atom.id];
    if (wynik && wynik.spellId === spellId) {
      return `<div class="black-magic-warning">${icon('warning')} Zaklęcie czarnej magii. Rzut ryzyka: <span class="black-magic-roll-result">k6 = ${wynik.rzut}</span> ${wynik.przyznane ? '→ +1 Splugawienie' : '→ bez efektu'}.</div>`;
    }
    return `
      <div class="black-magic-warning">
        ${icon('warning')} Zaklęcie czarnej magii - ryzyko Splugawienia (rzut k6 &lt; ${blackMagicRisk.liczbaZnanychPrzed} już znanych zaklęć czarnej magii).
        <button type="button" class="btn-secondary small" data-magic-roll="${atom.id}" data-roll-spell="${spellId}" data-roll-limit="${blackMagicRisk.liczbaZnanychPrzed}">Rzuć k6</button>
      </div>
    `;
  }
  return '';
}

/** Podłącza obsługę zdarzeń dla wszystkich kart magii w kontenerze (delegacja przez ponowny render). */
function attachHandleCardsMagic(container) {
  container.querySelectorAll('[data-magic-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      const atomId = btn.dataset.magicMode;
      const mode = btn.dataset.modeValue;
      if ((magicChoices[atomId] || {}).mode === mode) return;
      magicChoices[atomId] = { mode };
      delete magicRiskResults[atomId];
      renderSpellsSection();
    });
  });
  container.querySelectorAll('[data-open-tradition-picker]').forEach(btn => {
    btn.addEventListener('click', () => {
      const atomId = btn.dataset.openTraditionPicker;
      const kategoria = btn.dataset.category.split(',').filter(Boolean);
      const { knownTraditions } = calculateResolutionMagic(getCurrentAtomsMagic(), magicChoices);
      openTraditionPicker(atomId, kategoria, knownTraditions);
    });
  });
  container.querySelectorAll('[data-open-spell-picker]').forEach(btn => {
    btn.addEventListener('click', () => {
      const atomId = btn.dataset.openSpellPicker;
      const tradycjaOgraniczenie = btn.dataset.traditionRestriction || null;
      const { knownTraditions } = calculateResolutionMagic(getCurrentAtomsMagic(), magicChoices);
      openSpellPicker(atomId, knownTraditions, getCurrentPower(), tradycjaOgraniczenie);
    });
  });
  container.querySelectorAll('[data-open-free-spell-picker]').forEach(btn => {
    btn.addEventListener('click', () => {
      openFreeSpellPicker(btn.dataset.openFreeSpellPicker, btn.dataset.traditionFree);
    });
  });
  container.querySelectorAll('[data-magic-clear]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const atomId = btn.dataset.magicClear;
      const wybor = { ...(magicChoices[atomId] || {}) };
      delete wybor[btn.dataset.clearField];
      magicChoices[atomId] = wybor;
      delete magicRiskResults[atomId];
      renderSpellsSection();
    });
  });
  container.querySelectorAll('[data-magic-roll]').forEach(btn => {
    btn.addEventListener('click', () => {
      const atomId = btn.dataset.magicRoll;
      const spellId = btn.dataset.rollSpell;
      const limit = parseInt(btn.dataset.rollLimit, 10);
      const rzut = Math.floor(Math.random() * 6) + 1;
      magicRiskResults[atomId] = { spellId, rzut, przyznane: rzut < limit };
      renderSpellsSection();
    });
  });
}

/**
 * Stan aktualnie otwartego popupu wyboru magii (Krok 6) - `null` gdy
 * popup jest zamknięty. Patrz otworzTradycjaPicker()/otworzZakleciePicker().
 */
let magicPicker = null;

/**
 * Otwiera popup wyboru nowej tradycji (kafelki, bez dropdownów) dla danego atomu.
 * `docelowy` ('magia' domyślnie, albo 'ekwipunek') decyduje, do którego stanu
 * trafi wynik wyboru - zob. wybierzTradycjaZPickera(). Ten sam popup obsługuje
 * więc zarówno poznawanie tradycji w Kroku 6, jak i "zwój z zaklęciem kręgu 0"
 * w Kroku Ekwipunek.
 */
function openTraditionPicker(atomId, kategoria, knownTraditions, target = 'magia') {
  magicPicker = { atomId, kind: 'tradycja', kategoria, knownTraditions, search: '', target };
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
function openSpellPicker(atomId, knownTraditions, moc, tradycjaOgraniczenie) {
  magicPicker = {
    atomId, kind: 'zaklecie', knownTraditions, moc, tradycjaOgraniczenie,
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
function openFreeSpellPicker(atomId, tradycjaId, target = 'magia') {
  magicPicker = { atomId, kind: 'darmowe_zaklecie', tradycjaId, search: '', target };
  const title = document.getElementById('magic-picker-title');
  if (title) title.textContent = 'Wybierz zaklęcie kręgu 0';
  const overlay = document.getElementById('magic-picker-overlay');
  if (overlay) overlay.hidden = false;
  renderMagicPickerBody();
}

/** Zamyka popup wyboru magii bez dokonywania wyboru. */
function closeMagicPicker() {
  const overlay = document.getElementById('magic-picker-overlay');
  if (overlay) overlay.hidden = true;
  magicPicker = null;
}

/**
 * Renderuje zawartość popupu wyboru magii: pole wyszukiwania (statyczne,
 * nieprzerenderowywane przy każdym wpisanym znaku, by nie tracić fokusu)
 * i pod nim dynamiczny obszar z chipami filtrów i siatką kafelków.
 */
function renderMagicPickerBody() {
  const body = document.getElementById('magic-picker-body');
  if (!body || !magicPicker) return;
  const placeholder = magicPicker.kind === 'tradycja'
    ? 'Szukaj tradycji...'
    : (magicPicker.kind === 'darmowe_zaklecie' ? 'Szukaj zaklęcia kręgu 0...' : 'Szukaj zaklęcia po nazwie lub opisie...');
  body.innerHTML = `
    <input type="text" class="picker-search" id="picker-search-input" placeholder="${placeholder}">
    <div id="picker-dynamic"></div>
  `;
  const input = document.getElementById('picker-search-input');
  input.value = magicPicker.search;
  input.addEventListener('input', () => {
    magicPicker.search = input.value;
    rerenderPickerDynamic();
  });
  input.focus();
  rerenderPickerDynamic();
}

/** Przerenderowuje tylko chipy filtrów + siatkę kafelków popupu (pole wyszukiwania zostaje niezmienione, by nie tracić fokusu/kursora). */
function rerenderPickerDynamic() {
  const el = document.getElementById('picker-dynamic');
  if (!el || !magicPicker) return;
  if (magicPicker.kind === 'tradycja') el.innerHTML = renderTraditionPickerDynamicHtml();
  else if (magicPicker.kind === 'darmowe_zaklecie') el.innerHTML = renderFreeSpellPickerDynamicHtml();
  else el.innerHTML = renderSpellPickerDynamicHtml();
  attachHandlePickerDynamic(el);
}

/** Renderuje kafelki tradycji dostępnych do poznania w popupie, po zastosowaniu wyszukiwania tekstowego. */
function renderTraditionPickerDynamicHtml() {
  const all = getTraditionsForCategory(magicPicker.kategoria, magicPicker.knownTraditions);
  const search = magicPicker.search.trim().toLowerCase();
  const wynik = search ? all.filter(t => t.nazwa.toLowerCase().includes(search)) : all;

  const tiles = wynik.map(t => `
    <button type="button" class="picker-tile" data-pick-tradition="${t.id}">
      <div class="picker-tile-header"><span>${t.nazwa}</span></div>
      ${t.czarnaMagia ? `<div class="picker-tile-warning">${icon('warning')} Czarna magia - poznanie przyznaje 1 Splugawienie</div>` : ''}
    </button>
  `).join('') || '<p class="hint">Brak tradycji spełniających kryteria wyszukiwania.</p>';

  return `
    <p class="picker-results-count hint">Znaleziono ${wynik.length} z ${all.length} tradycji</p>
    <div class="picker-tile-grid">${tiles}</div>
  `;
}

/**
 * Zwraca id-y zaklęć już wybranych w INNYCH slotach magii (nie w
 * `wylaczAtomId`, czyli slocie właśnie edytowanym) - używane do wyszarzenia
 * ich w popupie, bo nauka tego samego zaklęcia drugi raz nie ma sensu.
 */
function getTakenSpells(disableAtomId) {
  const { resolutions } = calculateResolutionMagic(getCurrentAtomsMagic(), magicChoices);
  const taken = new Set();
  resolutions.forEach(r => {
    if (r.atom.id === disableAtomId) return;
    if (r.mode === 'zaklecie' && r.spellId) taken.add(r.spellId);
    if (r.mode === 'tradycja' && r.darmowyZaklecieId) taken.add(r.darmowyZaklecieId);
  });
  return taken;
}

/** Renderuje kafelki zaklęć dostępnych do nauki w popupie, po zastosowaniu wyszukiwania i chipów filtrów. */
function renderSpellPickerDynamicHtml() {
  const { knownTraditions, moc, tradycjaOgraniczenie, search, filterKrag, filterKategoria, filterTradycja } = magicPicker;
  const all = getSpellsToLearning({ knownTraditions, moc, tradycjaOgraniczenie });

  const circles = [...new Set(all.map(s => s.krag))].sort((a, b) => a - b);
  const traditionsInSet = [...new Map(all.map(s => [s.tradycja, s.tradycjaNazwa])).entries()]
    .sort((a, b) => a[1].localeCompare(b[1], 'pl'));

  let wynik = all;
  if (filterKrag !== null) wynik = wynik.filter(s => s.krag === filterKrag);
  if (filterKategoria) wynik = wynik.filter(s => s.kategoria === filterKategoria);
  if (filterTradycja) wynik = wynik.filter(s => s.tradycja === filterTradycja);
  const searchLower = search.trim().toLowerCase();
  if (searchLower) wynik = wynik.filter(s => `${s.nazwa} ${s.opis}`.toLowerCase().includes(searchLower));

  const traditionChips = traditionsInSet.length > 1
    ? traditionsInSet.map(([id, nazwa]) => `<button type="button" class="picker-filter-chip ${filterTradycja === id ? 'active' : ''}" data-filter-tradition="${id}">${nazwa}</button>`).join('')
    : '';
  const circleChips = circles.length > 1
    ? circles.map(k => `<button type="button" class="picker-filter-chip ${filterKrag === k ? 'active' : ''}" data-filter-circle="${k}">Krąg ${k}</button>`).join('')
    : '';
  const catChips = [['atak', 'Atak'], ['uzytkowe', 'Użytkowe']]
    .map(([id, etykieta]) => `<button type="button" class="picker-filter-chip ${filterKategoria === id ? 'active' : ''}" data-filter-category="${id}">${etykieta}</button>`).join('');
  const chipsHtml = (traditionChips || circleChips || catChips)
    ? `<div class="picker-filter-chips">${traditionChips}${circleChips}${catChips}</div>`
    : '';

  const taken = getTakenSpells(magicPicker.atomId);
  const tiles = wynik
    .slice()
    .sort((a, b) => a.tradycjaNazwa.localeCompare(b.tradycjaNazwa, 'pl') || a.krag - b.krag || a.nazwa.localeCompare(b.nazwa, 'pl'))
    .map(s => {
      const isTaken = taken.has(s.id);
      return `
      <button type="button" class="picker-tile ${isTaken ? 'disabled' : ''}" ${isTaken ? 'disabled' : ''} data-pick-spell="${s.id}">
        <div class="picker-tile-header">
          <span>${s.nazwa}</span>
          ${renderSourceTag(s.zrodlo)}
        </div>
        <div class="picker-tile-meta">${s.tradycjaNazwa} · Krąg ${s.krag} · ${s.kategoria === 'atak' ? 'Atak' : 'Użytkowe'}</div>
        <p class="picker-tile-description">${s.opis}</p>
        ${isTaken ? '<div class="picker-tile-taken">Już wybrane w innym slocie</div>' : ''}
        ${!isTaken && isBlackMagic(s.tradycja) ? `<div class="picker-tile-warning">${icon('warning')} Czarna magia</div>` : ''}
      </button>
    `;
    }).join('') || '<p class="hint">Brak zaklęć spełniających kryteria wyszukiwania.</p>';

  return `
    ${chipsHtml}
    <p class="picker-results-count hint">Znaleziono ${wynik.length} z ${all.length} zaklęć</p>
    <div class="picker-tile-grid">${tiles}</div>
  `;
}

/**
 * Renderuje kafelki zaklęć kręgu 0 danej tradycji w popupie wyboru
 * darmowego zaklęcia ("Poznawanie tradycji", PG) - bez chipów filtrów, bo
 * krąg jest już z definicji ograniczony do 0, a tradycja jest ustalona.
 */
function renderFreeSpellPickerDynamicHtml() {
  const { tradycjaId, search } = magicPicker;
  const all = getCircleZeroSpells(tradycjaId);
  const searchLower = search.trim().toLowerCase();
  const wynik = searchLower ? all.filter(s => `${s.nazwa} ${s.opis}`.toLowerCase().includes(searchLower)) : all;

  const taken = getTakenSpells(magicPicker.atomId);
  const tiles = wynik
    .slice()
    .sort((a, b) => a.nazwa.localeCompare(b.nazwa, 'pl'))
    .map(s => {
      const isTaken = taken.has(s.id);
      return `
      <button type="button" class="picker-tile ${isTaken ? 'disabled' : ''}" ${isTaken ? 'disabled' : ''} data-pick-free-spell="${s.id}">
        <div class="picker-tile-header">
          <span>${s.nazwa}</span>
          ${renderSourceTag(s.zrodlo)}
        </div>
        <div class="picker-tile-meta">${s.tradycjaNazwa} · Krąg 0 · ${s.kategoria === 'atak' ? 'Atak' : 'Użytkowe'}</div>
        <p class="picker-tile-description">${s.opis}</p>
        ${isTaken ? '<div class="picker-tile-taken">Już wybrane w innym slocie</div>' : ''}
      </button>
    `;
    }).join('') || '<p class="hint">Brak zaklęć kręgu 0 spełniających kryteria wyszukiwania.</p>';

  return `
    <p class="picker-results-count hint">Znaleziono ${wynik.length} z ${all.length} zaklęć kręgu 0</p>
    <div class="picker-tile-grid">${tiles}</div>
  `;
}

/** Podłącza obsługę chipów filtrów i kafelków w dynamicznym obszarze popupu. */
function attachHandlePickerDynamic(container) {
  container.querySelectorAll('[data-filter-circle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.filterCircle, 10);
      magicPicker.filterKrag = magicPicker.filterKrag === val ? null : val;
      rerenderPickerDynamic();
    });
  });
  container.querySelectorAll('[data-filter-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.filterCategory;
      magicPicker.filterKategoria = magicPicker.filterKategoria === val ? null : val;
      rerenderPickerDynamic();
    });
  });
  container.querySelectorAll('[data-filter-tradition]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.filterTradition;
      magicPicker.filterTradycja = magicPicker.filterTradycja === val ? null : val;
      rerenderPickerDynamic();
    });
  });
  container.querySelectorAll('[data-pick-tradition]').forEach(btn => {
    btn.addEventListener('click', () => selectTraditionWithPicker(btn.dataset.pickTradition));
  });
  container.querySelectorAll('[data-pick-spell]').forEach(btn => {
    btn.addEventListener('click', () => selectSpellWithPicker(btn.dataset.pickSpell));
  });
  container.querySelectorAll('[data-pick-free-spell]').forEach(btn => {
    btn.addEventListener('click', () => selectFreeSpellWithPicker(btn.dataset.pickFreeSpell));
  });
}

/**
 * Zatwierdza wybór tradycji dokonany w popupie. Poznanie tradycji przyznaje
 * automatycznie jedno jej zaklęcie kręgu 0 ("Poznawanie tradycji", PG), więc
 * zamiast zamykać popup, przechodzi wprost do wyboru tego darmowego
 * zaklęcia - albo, gdy tradycja ma tylko jedno zaklęcie kręgu 0, wybiera je
 * automatycznie, bez dodatkowego kliknięcia.
 */
function selectTraditionWithPicker(tradycjaId) {
  const atomId = magicPicker.atomId;
  const target = magicPicker.target || 'magia';

  if (target === 'ekwipunek') {
    const wybor = equipmentChoices[atomId] || {};
    equipmentChoices[atomId] = { ...wybor, typ: 'zwoj_zaklecie', tradycjaId, spellId: null };
    const circleZero = getCircleZeroSpells(tradycjaId);
    if (circleZero.length === 1) {
      equipmentChoices[atomId].spellId = circleZero[0].id;
      closeMagicPicker();
    } else if (circleZero.length > 1) {
      openFreeSpellPicker(atomId, tradycjaId, 'ekwipunek');
    } else {
      closeMagicPicker();
    }
    renderEquipmentSection();
    return;
  }

  const wybor = magicChoices[atomId] || {};
  magicChoices[atomId] = { ...wybor, mode: wybor.mode || 'tradycja', tradycjaId, darmowyZaklecieId: null };

  const circleZero = getCircleZeroSpells(tradycjaId);
  if (circleZero.length === 1) {
    magicChoices[atomId].darmowyZaklecieId = circleZero[0].id;
    closeMagicPicker();
  } else if (circleZero.length > 1) {
    openFreeSpellPicker(atomId, tradycjaId);
  } else {
    closeMagicPicker();
  }
  renderSpellsSection();
}

/** Zatwierdza wybór zaklęcia dokonany w popupie, zamyka go i przerenderowuje Krok 6. */
function selectSpellWithPicker(spellId) {
  const atomId = magicPicker.atomId;
  const wybor = magicChoices[atomId] || {};
  magicChoices[atomId] = { ...wybor, mode: wybor.mode || 'zaklecie', spellId };
  delete magicRiskResults[atomId];
  closeMagicPicker();
  renderSpellsSection();
}

/** Zatwierdza wybór darmowego zaklęcia kręgu 0 dokonany w popupie, zamyka go i przerenderowuje Krok 6. */
function selectFreeSpellWithPicker(spellId) {
  const atomId = magicPicker.atomId;
  const target = magicPicker.target || 'magia';

  if (target === 'ekwipunek') {
    const wybor = equipmentChoices[atomId] || {};
    equipmentChoices[atomId] = { ...wybor, spellId };
    closeMagicPicker();
    renderEquipmentSection();
    return;
  }

  const wybor = magicChoices[atomId] || {};
  magicChoices[atomId] = { ...wybor, darmowyZaklecieId: spellId };
  closeMagicPicker();
  renderSpellsSection();
}

/** Czyści wszystkie wybory magii dokonane w Kroku 6. */
function resetMagic() {
  magicChoices = {};
  magicRiskResults = {};
  magicBlackMagicTooTraditions = new Set();
  renderSpellsSection();
}

// ========== KROK 7: EKWIPUNEK (Zamożność, wyposażenie startowe, sklep) ==========

/** Rzuca podaną liczbą kostek k6 (zapis "NkM", tylko k6 używane w tabelach zamożności) i zwraca sumę oczek. */
function rollDice(save) {
  const [iloscKostekTxt, scianTxt] = save.split('k');
  const diceCount = parseInt(iloscKostekTxt, 10) || 1;
  const faces = parseInt(scianTxt, 10) || 6;
  let sum = 0;
  for (let i = 0; i < diceCount; i++) sum += Math.floor(Math.random() * faces) + 1;
  return sum;
}

/** Renderuje całą sekcję Kroku 7 (Zamożność, wyposażenie startowe, sklep). */
function renderEquipmentSection() {
  renderWealthGrid();
  renderGearStarting();
  renderShopSection();
}

/** Renderuje kafelki wyboru Zamożności wraz z ewentualnym wynikiem rzutu 3k6. */
function renderWealthGrid() {
  const grid = document.getElementById('wealth-grid');
  const resultEl = document.getElementById('wealth-roll');
  if (!grid) return;

  if (resultEl) {
    resultEl.textContent = equipmentWealthResult != null
      ? `Wynik rzutu 3k6: ${equipmentWealthResult}`
      : '';
  }

  grid.innerHTML = Object.values(WEALTH).map(z => {
    const range = z.zakres3k6[0] === z.zakres3k6[1] ? `${z.zakres3k6[0]}` : `${z.zakres3k6[0]}–${z.zakres3k6[1]}`;
    const selected = equipmentWealthId === z.id;
    return `
      <button type="button" class="picker-tile zamoznosc-tile ${selected ? 'selected' : ''}" data-select-wealth="${z.id}">
        <div class="picker-tile-header">
          <span>${z.nazwa}</span>
          ${selected ? `<span class="wealth-badge">${icon('check')} Wybrano</span>` : ''}
        </div>
        <div class="picker-tile-meta">3k6: ${range}</div>
        <p class="picker-tile-description">${z.opis}</p>
      </button>
    `;
  }).join('');

  grid.querySelectorAll('[data-select-wealth]').forEach(btn => {
    btn.addEventListener('click', () => wybierzZamoznosc(btn.dataset.selectWealth, null));
  });
}

/** Losuje Zamożność rzutem 3k6 i wybiera odpowiedni poziom z tabeli. */
function randomizeWealth() {
  const wynik = rollDice('3k6');
  const wealthentry = getWealthForRoll(wynik);
  if (wealthentry) wybierzZamoznosc(wealthentry.id, wynik);
}

/**
 * Ustawia poziom Zamożności (ręcznie klikniętej albo wylosowanej) i losuje
 * startową gotówkę (PG: "sakiewka z NkM ..."). Czyści wybory wyposażenia
 * startowego i sklepu, bo należą do poprzedniego poziomu zamożności.
 */
function wybierzZamoznosc(zamoznoscId, resultRoll) {
  const wealthentry = WEALTH[zamoznoscId];
  if (!wealthentry) return;
  equipmentWealthId = zamoznoscId;
  equipmentWealthResult = resultRoll;
  equipmentStartingCashRoll = rollDice(wealthentry.pieniadze.kosci);
  equipmentChoices = {};
  equipmentSold = [];
  equipmentPurchased = [];
  equipmentDescriptionExpanded = new Set();
  renderEquipmentSection();
}

/** Czyści wybraną Zamożność i cały zależny od niej stan ekwipunku. */
function resetWealth() {
  equipmentWealthId = null;
  equipmentWealthResult = null;
  equipmentStartingCashRoll = null;
  equipmentChoices = {};
  equipmentSold = [];
  equipmentPurchased = [];
  equipmentDescriptionExpanded = new Set();
  renderEquipmentSection();
}

/**
 * Oblicza pełny, aktualny stan ekwipunku: rozwiązane pozycje startowe
 * (gwarantowane + wybrane), sprzedane pozycje, zakupione pozycje i
 * dostępną gotówkę (startowa sakiewka + wpływy ze sprzedaży + wylosowane
 * srebrniki z Kroku 2, jeśli postać ma poziom > 0 - PG: "Wyposażenie na
 * wyższych poziomach" - minus wydatki na zakupy). Zwraca `null`, gdy
 * Zamożność nie została jeszcze wybrana.
 */
function calculateStateEquipment() {
  if (!equipmentWealthId) return null;
  const wealthentry = WEALTH[equipmentWealthId];
  const guaranteed = getGuaranteedEntries(equipmentWealthId);
  const atoms = calculateAtomsGear(equipmentWealthId);

  const startingEntries = [];
  guaranteed.forEach((p, idx) => {
    startingEntries.push({ klucz: `g${idx}`, itemId: p.id || null, tekst: p.tekst || null, ilosc: p.ilosc || 1 });
  });
  atoms.forEach(atom => {
    const wybor = equipmentChoices[atom.id];
    if (!wybor) return;
    if (wybor.typ === 'zwoj_zaklecie' && wybor.tradycjaId) {
      startingEntries.push({
        klucz: atom.id, itemId: null, ilosc: 1, atomId: atom.id, sprzedawalny: false,
        zwojZaklecie: { tradycjaId: wybor.tradycjaId, spellId: wybor.spellId || null }
      });
    } else if (wybor.itemId) {
      startingEntries.push({ klucz: atom.id, itemId: wybor.itemId, ilosc: 1, atomId: atom.id });
    }
  });

  const soldSet = new Set(equipmentSold);
  const ownedStarting = startingEntries.filter(p => !soldSet.has(p.klucz));
  const soldStarting = startingEntries.filter(p => soldSet.has(p.klucz));

  const unitCash = wealthentry.pieniadze.jednostka;
  const startingCashCopperbits = equipmentStartingCashRoll != null
    ? equipmentStartingCashRoll * CONVERTER_TO_COPPERBITS[unitCash]
    : 0;
  const withSaleCopperbits = soldStarting.reduce((sum, p) => {
    if (!p.itemId) return sum;
    return sum + priceBuybackCopperbits(getItem(p.itemId)?.cena) * p.ilosc;
  }, 0);
  const tooPurchasesCopperbits = equipmentPurchased.reduce((sum, z) => {
    return sum + priceOnCopperbits(getItem(z.itemId)?.cena) * z.ilosc;
  }, 0);
  const withSilverLevel = (randomizedSilver || 0) * CONVERTER_TO_COPPERBITS.sr;

  const cashCopperbits = startingCashCopperbits + withSaleCopperbits + withSilverLevel - tooPurchasesCopperbits;

  const purchasedEntries = equipmentPurchased.map((z, idx) => ({ klucz: `z${idx}`, itemId: z.itemId, ilosc: z.ilosc }));

  return {
    wealthentry, atoms, guaranteed,
    ownedStarting, soldStarting, purchasedEntries,
    startingCashCopperbits, withSaleCopperbits, tooPurchasesCopperbits, withSilverLevel,
    cashCopperbits
  };
}

/** Renderuje sekcję wyposażenia startowego: gwarantowane pozycje i karty wyboru (jedna karta = jeden atom). */
function renderGearStarting() {
  const container = document.getElementById('starting-gear-section');
  if (!container) return;

  if (!equipmentWealthId) {
    container.innerHTML = '';
    return;
  }

  const state = calculateStateEquipment();
  const guaranteedHtml = state.guaranteed.map(p => {
    const item = p.id ? getItem(p.id) : null;
    const nazwa = item?.nazwa || p.id || p.tekst;
    const ilosc = p.ilosc && p.ilosc > 1 ? ` (${p.ilosc}×)` : '';
    const stats = item ? formatStatsItem(item) : null;
    return `<li${stats ? ` title="${stats}"` : ''}>${nazwa}${ilosc}</li>`;
  }).join('');

  const atomsHtml = state.atoms.map(atom => renderCardGear(atom)).join('');

  container.innerHTML = `
    <h4>${icon('backpack')} Wyposażenie startowe (${state.wealthentry.nazwa})</h4>
    <p class="hint">Gwarantowane: <ul class="guaranteed-list">${guaranteedHtml}</ul></p>
    ${atomsHtml}
    <p class="hint">Startowa gotówka: <strong>${formatCopperbits(state.startingCashCopperbits)}</strong> (sakiewka z ${state.wealthentry.pieniadze.kosci} ${state.wealthentry.pieniadze.jednostka === 'okr' ? 'okrawków' : state.wealthentry.pieniadze.jednostka === 'md' ? 'miedziaków' : 'srebrników'})</p>
    ${state.wealthentry.dodatkowyOpis ? `<p class="hint">${state.wealthentry.dodatkowyOpis}</p>` : ''}
  `;

  container.querySelectorAll('[data-select-starting]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectItemStarting(btn.dataset.selectStarting, btn.dataset.itemId);
    });
  });
  container.querySelectorAll('[data-open-scroll]').forEach(btn => {
    btn.addEventListener('click', () => openTraditionPicker(btn.dataset.openScroll, ['dowolna'], new Set(), 'ekwipunek'));
  });
}

/** Renderuje jedną kartę wyboru wyposażenia startowego (wybor_przedmiotu albo wybor_dodatkowy). */
function renderCardGear(atom) {
  const wybor = equipmentChoices[atom.id];

  if (atom.rodzaj === 'wybor_przedmiotu') {
    const tiles = atom.opcje.map(itemId => {
      const item = getItem(itemId);
      const active = wybor?.itemId === itemId;
      const stats = formatStatsItem(item);
      return `<button type="button" class="btn-secondary small ${active ? 'active' : ''}" data-select-starting="${atom.id}" data-item-id="${itemId}"${stats ? ` title="${stats}"` : ''}>${item?.nazwa || itemId}</button>`;
    }).join('');
    const selectedItem = wybor?.itemId ? getItem(wybor.itemId) : null;
    const statsSelected = selectedItem ? formatStatsItem(selectedItem) : null;
    return `
      <div class="magic-slot-card ${wybor?.itemId ? 'complete' : ''}">
        <p class="magic-slot-desc">Wybierz jedno: ${atom.opcje.map(id => getItem(id)?.nazwa || id).join(' / ')}${atom.opisWyboru ? ` (${atom.opisWyboru})` : ''}</p>
        <div class="magic-slot-mode-toggle">${tiles}</div>
        ${statsSelected ? `<p class="magic-slot-status ok">${selectedItem.nazwa}: ${statsSelected}</p>` : ''}
      </div>
    `;
  }

  // wybor_dodatkowy
  const tiles = atom.opcje.map(opcja => {
    const active = opcja.typ === 'zwoj_zaklecie' ? wybor?.typ === 'zwoj_zaklecie' : (wybor?.typ === 'przedmiot' && wybor?.itemId === opcja.id);
    if (opcja.typ === 'zwoj_zaklecie') {
      return `<button type="button" class="btn-secondary small ${active ? 'active' : ''}" data-open-scroll="${atom.id}">${opcja.etykieta}</button>`;
    }
    const stats = formatStatsItem(getItem(opcja.id));
    return `<button type="button" class="btn-secondary small ${active ? 'active' : ''}" data-select-starting="${atom.id}" data-item-id="${opcja.id}"${stats ? ` title="${stats}"` : ''}>${opcja.etykieta}</button>`;
  }).join('');

  let descriptionResult = '';
  if (wybor?.typ === 'zwoj_zaklecie' && wybor.tradycjaId) {
    const traditionName = TRADITIONS[wybor.tradycjaId]?.nazwa || wybor.tradycjaId;
    const spell = wybor.spellId ? SPELLS.find(s => s.id === wybor.spellId) : null;
    descriptionResult = `<p class="magic-slot-status ok">Wybrano: ${traditionName}${spell ? ` - ${spell.nazwa}` : ' (wybierz zaklęcie kręgu 0)'}</p>`;
  } else if (wybor?.typ === 'przedmiot' && wybor.itemId) {
    const selectedItem = getItem(wybor.itemId);
    const statsSelected = selectedItem ? formatStatsItem(selectedItem) : null;
    if (statsSelected) descriptionResult = `<p class="magic-slot-status ok">${selectedItem.nazwa}: ${statsSelected}</p>`;
  }

  return `
    <div class="magic-slot-card ${wybor ? 'complete' : ''}">
      <p class="magic-slot-desc">${atom.opis}</p>
      <div class="magic-slot-mode-toggle">${tiles}</div>
      ${descriptionResult}
    </div>
  `;
}

/** Zatwierdza wybór w karcie "wybór jednego przedmiotu" (np. pałka/proca) wyposażenia startowego. */
function selectItemStarting(atomId, itemId) {
  equipmentChoices[atomId] = { typ: 'przedmiot', itemId };
  renderEquipmentSection();
}

/** Renderuje sekcję sklepu: aktualna gotówka, posiadane przedmioty (z opcją sprzedaży) i katalog zakupów. */
function renderShopSection() {
  const container = document.getElementById('shop-section');
  if (!container) return;

  if (!equipmentWealthId) {
    container.innerHTML = '';
    return;
  }

  const state = calculateStateEquipment();

  const renderRows = (entries, zrodlo) => entries.map(p => {
    const nazwa = p.zwojZaklecie
      ? `Zwój (${TRADITIONS[p.zwojZaklecie.tradycjaId]?.nazwa || p.zwojZaklecie.tradycjaId}${p.zwojZaklecie.spellId ? `: ${SPELLS.find(s => s.id === p.zwojZaklecie.spellId)?.nazwa || ''}` : ''})`
      : (p.itemId ? (getItem(p.itemId)?.nazwa || p.itemId) : p.tekst);
    const item = p.itemId ? getItem(p.itemId) : null;
    const canSell = zrodlo === 'startowe' ? (item && item.cena) : true;
    const priceBuyback = item ? formatCopperbits(priceBuybackCopperbits(item.cena) * p.ilosc) : null;
    const ilosc = p.ilosc > 1 ? ` ×${p.ilosc}` : '';
    const stats = item ? formatStatsItem(item) : null;
    const hasDescription = !!item?.opis;
    const expanded = equipmentDescriptionExpanded.has(p.klucz);
    const row = `
      <tr>
        <td>${nazwa}${ilosc} ${item ? renderSourceTag(item.zrodlo) : ''}</td>
        <td>${stats || '—'}</td>
        <td>${item ? formatPrice(item.cena) : '—'}</td>
        <td class="equipment-table-actions">
          ${hasDescription ? `<button type="button" class="icon-btn" data-info="${p.klucz}" title="Pokaż opis">${icon('info')}</button>` : ''}
          ${canSell ? `<button type="button" class="icon-btn" data-sell="${p.klucz}" data-zrodlo="${zrodlo}" title="${zrodlo === 'startowe' ? `Sprzedaj za ${priceBuyback}` : 'Zwróć (pełny zwrot)'}">${zrodlo === 'startowe' ? icon('purse') : icon('undo')}</button>` : ''}
        </td>
      </tr>
    `;
    const rowDescription = hasDescription
      ? `<tr class="equipment-table-desc-row" ${expanded ? '' : 'hidden'}><td colspan="4">${item.opis}</td></tr>`
      : '';
    return row + rowDescription;
  }).join('');

  const allEntries = [...state.ownedStarting, ...state.purchasedEntries];
  const tableHtml = allEntries.length ? `
    <div class="equipment-table-wrap">
      <table class="equipment-table">
        <thead><tr><th>Przedmiot</th><th>Statystyki</th><th>Cena</th><th></th></tr></thead>
        <tbody id="ekwipunek-posiadane-list">
          ${renderRows(state.ownedStarting, 'startowe')}
          ${renderRows(state.purchasedEntries, 'kupione')}
        </tbody>
      </table>
    </div>
  ` : '<p class="hint">Brak przedmiotów.</p>';

  container.innerHTML = `
    <div class="flex-row-between">
      <h4>${icon('stall')} Sklep</h4>
      <span id="gotowka-summary" class="inline-summary"><strong>Gotówka: ${formatCopperbits(state.cashCopperbits)}</strong></span>
    </div>
    ${state.withSilverLevel > 0 ? `<p class="hint">Zawiera ${randomizedSilver} wylosowanych srebrników z Kroku 2 (poziom ${selectedLevel}).</p>` : ''}

    <div class="flex-row-between">
      <h5>Twoje przedmioty</h5>
    </div>
    ${tableHtml}

    ${state.soldStarting.length ? `
      <div class="flex-row-between"><h5>Sprzedane</h5></div>
      <div class="equipment-tag-list">${state.soldStarting.map(p => `<span class="equipment-tag sold">${p.itemId ? getItem(p.itemId)?.nazwa : p.tekst}</span>`).join('')}</div>
    ` : ''}

    <div class="flex-row-between">
      <h5>Katalog przedmiotów</h5>
      <button type="button" class="btn-primary small" id="btn-open-shop">${icon('cart')} Przeglądaj katalog</button>
    </div>
  `;

  container.querySelectorAll('[data-sell]').forEach(btn => {
    btn.addEventListener('click', () => sellEntries(btn.dataset.sell, btn.dataset.zrodlo));
  });
  container.querySelectorAll('[data-info]').forEach(btn => {
    btn.addEventListener('click', () => {
      const klucz = btn.dataset.info;
      if (equipmentDescriptionExpanded.has(klucz)) equipmentDescriptionExpanded.delete(klucz);
      else equipmentDescriptionExpanded.add(klucz);
      renderShopSection();
    });
  });
  document.getElementById('btn-open-shop')?.addEventListener('click', () => openEquipmentPicker());
}

/** Sprzedaje (pozycja startowa, za połowę ceny) albo zwraca (pozycja kupiona, pełny zwrot) daną pozycję ekwipunku. */
function sellEntries(klucz, zrodlo) {
  if (zrodlo === 'startowe') {
    if (!equipmentSold.includes(klucz)) equipmentSold.push(klucz);
  } else if (zrodlo === 'kupione') {
    const idx = parseInt(klucz.replace('z', ''), 10);
    const purchase = equipmentPurchased[idx];
    if (purchase) {
      if (purchase.ilosc > 1) purchase.ilosc -= 1;
      else equipmentPurchased.splice(idx, 1);
    }
  }
  renderEquipmentSection();
}

/**
 * Stan aktualnie otwartego popupu katalogu sklepu (Krok 7) - `null`, gdy
 * popup jest zamknięty.
 */
let equipmentPicker = null;

/** Otwiera popup katalogu przedmiotów do kupienia (kafelki z wyszukiwaniem i filtrami kategorii/rzadkości). */
function openEquipmentPicker() {
  equipmentPicker = { search: '', filterKategoria: null, filterRzadkosc: null, sortBy: 'nazwa', sortDir: 'asc', ukryjNiedostepne: true };
  const overlay = document.getElementById('equipment-picker-overlay');
  if (overlay) overlay.hidden = false;
  renderEquipmentPickerBody();
}

/** Zamyka popup katalogu sklepu. */
function closeEquipmentPicker() {
  const overlay = document.getElementById('equipment-picker-overlay');
  if (overlay) overlay.hidden = true;
  equipmentPicker = null;
}

/** Renderuje zawartość popupu katalogu: statyczne pole wyszukiwania + dynamiczny obszar z chipami i kafelkami. */
function renderEquipmentPickerBody() {
  const body = document.getElementById('equipment-picker-body');
  if (!body || !equipmentPicker) return;
  body.innerHTML = `
    <input type="text" class="picker-search" id="equipment-picker-search-input" placeholder="Szukaj przedmiotu...">
    <div id="equipment-picker-dynamic"></div>
  `;
  const input = document.getElementById('equipment-picker-search-input');
  input.value = equipmentPicker.search;
  input.addEventListener('input', () => {
    equipmentPicker.search = input.value;
    rerenderEquipmentPickerDynamic();
  });
  input.focus();
  rerenderEquipmentPickerDynamic();
}

/** Przerenderowuje chipy filtrów i siatkę kafelków katalogu (pole wyszukiwania zostaje niezmienione). */
function rerenderEquipmentPickerDynamic() {
  const el = document.getElementById('equipment-picker-dynamic');
  if (!el || !equipmentPicker) return;

  const { search, filterKategoria, filterRzadkosc, sortBy, sortDir, ukryjNiedostepne } = equipmentPicker;
  let wynik = EQUIPMENT.filter(i => i.cena);
  if (filterKategoria) wynik = wynik.filter(i => i.kategoria === filterKategoria);
  if (filterRzadkosc) wynik = wynik.filter(i => i.rzadkosc === filterRzadkosc);
  const searchLower = search.trim().toLowerCase();
  if (searchLower) wynik = wynik.filter(i => `${i.nazwa} ${i.opis || ''}`.toLowerCase().includes(searchLower));

  const categoriesChips = Object.keys(CATEGORY_LABELS_EQ)
    .filter(k => EQUIPMENT.some(i => i.kategoria === k && i.cena))
    .map(k => `<button type="button" class="picker-filter-chip ${filterKategoria === k ? 'active' : ''}" data-filter-category="${k}">${CATEGORY_LABELS_EQ[k]}</button>`)
    .join('');
  const rarityChips = Object.keys(RARITY_LABELS)
    .map(r => `<button type="button" class="picker-filter-chip ${filterRzadkosc === r ? 'active' : ''}" data-filter-rarity="${r}">${RARITY_LABELS[r]}</button>`)
    .join('');
  const sortChips = Object.keys(SORT_LABELS)
    .map(s => `<button type="button" class="picker-filter-chip ${sortBy === s ? 'active' : ''}" data-sort-by="${s}">${SORT_LABELS[s]}${sortBy === s ? ` ${sortDir === 'desc' ? icon('chevron-down') : icon('chevron-up')}` : ''}</button>`)
    .join('');

  const state = calculateStateEquipment();
  const ownedIds = state
    ? new Set([...state.ownedStarting, ...state.purchasedEntries].filter(p => p.itemId).map(p => p.itemId))
    : new Set();

  let resultToDisplay = sortItems(wynik, sortBy, sortDir).map(i => {
    const tooExpensive = !state || state.cashCopperbits < priceOnCopperbits(i.cena);
    const owned = ownedIds.has(i.id);
    return { i, tooExpensive, owned, niedostepny: tooExpensive || owned };
  });
  const allMatching = resultToDisplay.length;
  if (ukryjNiedostepne) resultToDisplay = resultToDisplay.filter(w => !w.niedostepny);

  const tiles = resultToDisplay
    .map(({ i, tooExpensive, owned, niedostepny }) => {
      const stats = formatStatsItem(i);
      const reason = owned ? 'Już posiadane' : (tooExpensive ? 'Za mało gotówki' : '');
      return `
      <button type="button" class="picker-tile ${niedostepny ? 'disabled' : ''}" ${niedostepny ? 'disabled' : ''} data-buy="${i.id}">
        <div class="picker-tile-header">
          <span>${i.nazwa}</span>
          ${renderSourceTag(i.zrodlo)}
        </div>
        <div class="picker-tile-meta">${CATEGORY_LABELS_EQ[i.kategoria] || i.kategoria} · ${RARITY_LABELS[i.rzadkosc] || '—'} · ${formatPrice(i.cena)}</div>
        ${stats ? `<div class="picker-tile-stats">${stats}</div>` : ''}
        ${i.opis ? `<p class="picker-tile-description">${i.opis}</p>` : ''}
        ${reason ? `<div class="picker-tile-taken">${reason}</div>` : ''}
      </button>
    `;
    }).join('') || '<p class="hint">Brak przedmiotów spełniających kryteria wyszukiwania.</p>';

  el.innerHTML = `
    <div class="picker-filter-chips">${categoriesChips}</div>
    <div class="picker-filter-chips">${rarityChips}</div>
    <div class="picker-filter-chips picker-sort-row"><span class="picker-sort-label">Sortuj:</span>${sortChips}</div>
    <div class="picker-toolbar">
      <p class="picker-results-count hint">Znaleziono ${allMatching} przedmiotów${ukryjNiedostepne && allMatching !== resultToDisplay.length ? ` (${resultToDisplay.length} dostępnych)` : ''}</p>
      <label class="picker-toggle-label">
        <input type="checkbox" id="equipment-picker-hide-unavailable" ${ukryjNiedostepne ? 'checked' : ''}>
        Ukryj niedostępne (za drogie, już posiadane)
      </label>
    </div>
    <div class="picker-tile-grid">${tiles}</div>
  `;

  document.getElementById('equipment-picker-hide-unavailable')?.addEventListener('change', (e) => {
    equipmentPicker.ukryjNiedostepne = e.target.checked;
    rerenderEquipmentPickerDynamic();
  });

  el.querySelectorAll('[data-filter-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.filterCategory;
      equipmentPicker.filterKategoria = equipmentPicker.filterKategoria === val ? null : val;
      rerenderEquipmentPickerDynamic();
    });
  });
  el.querySelectorAll('[data-filter-rarity]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.filterRarity;
      equipmentPicker.filterRzadkosc = equipmentPicker.filterRzadkosc === val ? null : val;
      rerenderEquipmentPickerDynamic();
    });
  });
  el.querySelectorAll('[data-sort-by]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.sortBy;
      if (equipmentPicker.sortBy === val) {
        equipmentPicker.sortDir = equipmentPicker.sortDir === 'desc' ? 'asc' : 'desc';
      } else {
        equipmentPicker.sortBy = val;
        equipmentPicker.sortDir = 'asc';
      }
      rerenderEquipmentPickerDynamic();
    });
  });
  el.querySelectorAll('[data-buy]').forEach(btn => {
    btn.addEventListener('click', () => buyItemFromShop(btn.dataset.buy));
  });
}

/** Kupuje przedmiot z katalogu (jeśli starcza gotówki) i przerenderowuje sklep + katalog. */
function buyItemFromShop(itemId) {
  const item = getItem(itemId);
  if (!item) return;
  const state = calculateStateEquipment();
  if (!state || state.cashCopperbits < priceOnCopperbits(item.cena)) return;

  const existing = equipmentPurchased.find(z => z.itemId === itemId);
  if (existing) existing.ilosc += 1;
  else equipmentPurchased.push({ itemId, ilosc: 1 });

  renderShopSection();
  rerenderEquipmentPickerDynamic();
}

// ========== BOCZNE MENU (nowa/wczytaj/wylosuj postać) ==========

/**
 * Jeden współdzielony element podpowiedzi (tooltip) dla ikon bocznego menu -
 * budowany w JS zamiast natywnego atrybutu `title`, żeby mieć pełną kontrolę
 * nad wyglądem i pozycją (natywne podpowiedzi przeglądarki bywają wolne,
 * obcięte albo słabo czytelne na ciemnym tle aplikacji).
 */
let tooltipEl = null;

/** Tworzy (jednorazowo) pływający element podpowiedzi i dopina obsługę hover/focus do elementów z atrybutem `data-tooltip`. */
function initializeTooltips() {
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'js-tooltip';
    tooltipEl.setAttribute('role', 'tooltip');
    document.body.appendChild(tooltipEl);
  }
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    if (el.dataset.tooltipBound) return;
    el.dataset.tooltipBound = 'true';
    el.addEventListener('mouseenter', () => showTooltip(el));
    el.addEventListener('mouseleave', hideTooltip);
    el.addEventListener('focus', () => showTooltip(el));
    el.addEventListener('blur', hideTooltip);
  });
}

/** Pokazuje podpowiedź obok wskazanego elementu, dobierając stronę (prawo/lewo/góra), żeby zmieścić się w oknie. */
function showTooltip(el) {
  const tekst = el.dataset.tooltip;
  if (!tooltipEl || !tekst) return;
  tooltipEl.textContent = tekst;
  tooltipEl.classList.add('visible');

  const rect = el.getBoundingClientRect();
  const preferTop = window.matchMedia('(max-width: 860px)').matches;

  requestAnimationFrame(() => {
    const tw = tooltipEl.offsetWidth;
    const th = tooltipEl.offsetHeight;
    let left; let top;
    if (preferTop) {
      // Boczne menu jest poziomym paskiem u dołu ekranu - podpowiedź nad ikoną.
      left = rect.left + rect.width / 2 - tw / 2;
      top = rect.top - th - 10;
    } else {
      // Boczne menu jest pionową listwą - podpowiedź z prawej strony ikony.
      left = rect.right + 10;
      top = rect.top + rect.height / 2 - th / 2;
      if (left + tw > window.innerWidth - 8) left = rect.left - tw - 10;
    }
    left = Math.min(Math.max(8, left), window.innerWidth - tw - 8);
    top = Math.min(Math.max(8, top), window.innerHeight - th - 8);
    tooltipEl.style.left = `${left}px`;
    tooltipEl.style.top = `${top}px`;
  });
}

/** Ukrywa aktualnie widoczną podpowiedź. */
function hideTooltip() {
  tooltipEl?.classList.remove('visible');
}

/**
 * Resetuje kreator do stanu początkowego i wraca do Kroku 1. W przeciwieństwie
 * do zwykłego "Wyczyść" w Kroku 1 (resetujWyborPochodzenia()), zeruje też
 * dalsze kroki (profesje, kurioza, magia, ekwipunek) i odrywa bieżącą pracę
 * od dotychczasowego zapisu w cache, żeby kolejny zapis (po dotarciu do
 * Kroku 8) trafił do nowego wpisu zamiast nadpisać poprzednią postać.
 */
function newCharacter() {
  resetChoiceOrigin();
  renderProfessionsSection();
  renderCuriosSection();
  renderSpellsSection();
  renderEquipmentSection();
  const importFeedback = document.getElementById('import-feedback');
  if (importFeedback) importFeedback.innerHTML = '';
  const missingItemsWarning = document.getElementById('missing-items-warning');
  if (missingItemsWarning) missingItemsWarning.innerHTML = '';
  currentSaveCacheId = null;
  characterName = '';
  const nameInput = document.getElementById('character-name');
  if (nameInput) nameInput.value = '';
  showStep(1);
  updatePreviewCharacter();
}

/** Otwiera popup z listą postaci zapisanych w cache przeglądarki (localStorage). */
function openLoadCharacterPopup() {
  const overlay = document.getElementById('load-character-overlay');
  if (!overlay) return;
  overlay.hidden = false;
  renderLoadCharacterList();
}

/** Zamyka popup listy zapisanych postaci. */
function closeLoadCharacterPopup() {
  const overlay = document.getElementById('load-character-overlay');
  if (overlay) overlay.hidden = true;
}

/** Renderuje listę zapisanych postaci (najnowsze na górze) w popupie "Wczytaj postać". */
function renderLoadCharacterList() {
  const body = document.getElementById('load-character-body');
  if (!body) return;

  const all = Object.values(getSavedCharacters()).sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));

  if (all.length === 0) {
    body.innerHTML = '<p class="hint">Brak postaci zapisanych w pamięci tej przeglądarki. Postać zapisuje się automatycznie, gdy dotrzesz do Kroku 8 (Podgląd), oraz przy imporcie z pliku JSON.</p>';
    return;
  }

  body.innerHTML = `
    <div class="flex-row-between">
      <p class="hint">${all.length} ${all.length === 1 ? 'postać zapisana' : 'postaci zapisanych'} w tej przeglądarce.</p>
      <button type="button" class="section-reset-btn" id="btn-clear-saved-characters" title="Usuń wszystkie postacie zapisane w pamięci tej przeglądarki">Wyczyść pamięć przeglądarki</button>
    </div>
    <div class="known-spells-list">
      ${all.map(entry => {
    const originId = entry.data?.wybory?.pochodzenie;
    const pochodzenie = availableOrigin.find(p => p.id === originId)?.nazwa || originId || 'Nieznane pochodzenie';
    const poziom = entry.data?.wybory?.poziom ?? '?';
    const data = entry.savedAt ? new Date(entry.savedAt).toLocaleString('pl-PL') : '';
    return `
          <div class="selected-item">
            <span>${pochodzenie}, poziom ${poziom} <em>(zapisano ${data})</em></span>
            <button type="button" class="btn-secondary small" data-load-character="${entry.id}">Wczytaj</button>
          </div>
        `;
  }).join('')}
    </div>
  `;

  body.querySelectorAll('[data-load-character]').forEach(btn => {
    btn.addEventListener('click', () => loadCharacterWithCache(btn.dataset.loadCharacter));
  });
  document.getElementById('btn-clear-saved-characters')?.addEventListener('click', clearSavedCharactersWithConfirm);
}

/** Czyści (po potwierdzeniu) wszystkie postacie zapisane w pamięci przeglądarki i odświeża listę w popupie. */
function clearSavedCharactersWithConfirm() {
  if (!confirm('Usunąć wszystkie postacie zapisane w pamięci tej przeglądarki? Tej operacji nie można odwrócić.')) return;
  clearSavedCharacters();
  renderLoadCharacterList();
}

/** Wczytuje wybraną zapisaną postać z cache i podpina jej id, żeby dalsze zmiany nadpisywały ten sam wpis. */
async function loadCharacterWithCache(id) {
  const entry = getSavedCharacters()[id];
  if (!entry) return;
  closeLoadCharacterPopup();
  currentSaveCacheId = id;
  try {
    await importCharacter(entry.data);
    showImportMessage('success', `${icon('check')} Postać została wczytana z pamięci przeglądarki. Przejdź przez kolejne kroki (albo od razu do Kroku 8 z górnego menu), by zweryfikować wynik.`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Błąd wczytywania postaci z cache:', err);
    showImportMessage('error', `Wystąpił nieoczekiwany błąd podczas wczytywania postaci: ${err.message}`);
  }
}

/** Otwiera popup wyboru poziomu przed losowaniem całej postaci (jedyna rzecz, którą wybiera użytkownik). */
function openRandomizeCharacterPopup() {
  const overlay = document.getElementById('randomize-character-overlay');
  if (!overlay) return;
  overlay.hidden = false;
  renderRandomizeLevelGrid();
}

/** Zamyka popup wyboru poziomu przed losowaniem całej postaci. */
function closeRandomizeCharacterPopup() {
  const overlay = document.getElementById('randomize-character-overlay');
  if (overlay) overlay.hidden = true;
}

/** Renderuje kafelki wyboru poziomu (0-10) w popupie "Wylosuj postać". */
function renderRandomizeLevelGrid() {
  const grid = document.getElementById('randomize-level-grid');
  if (!grid) return;
  grid.innerHTML = Array.from({ length: 11 }, (_, poziom) => {
    const selected = randomizeCharacterLevel === poziom;
    return `
      <button type="button" class="picker-tile ${selected ? 'selected' : ''}" data-select-randomize-level="${poziom}">
        <div class="picker-tile-header">
          <span>Poziom ${poziom}</span>
          ${selected ? `<span class="wealth-badge">${icon('check')} Wybrano</span>` : ''}
        </div>
        <div class="picker-tile-meta">${nameTierLevel(poziom)}</div>
      </button>
    `;
  }).join('');

  grid.querySelectorAll('[data-select-randomize-level]').forEach(btn => {
    btn.addEventListener('click', () => {
      randomizeCharacterLevel = parseInt(btn.dataset.selectRandomizeLevel, 10);
      renderRandomizeLevelGrid();
    });
  });
}

/**
 * Losuje absolutnie wszystkie elementy kreatora - pochodzenie i jego tabele,
 * bonusowe atrybuty, ścieżki (nowicjusza/eksperckiej/mistrzowskiej), sloty
 * zwiększenia atrybutów, profesje i języki, kurioza, srebrniki oraz
 * Zamożność wraz z wynikającym z niej wyposażeniem startowym - i od razu
 * przechodzi do Kroku 8 z podsumowaniem. Jedyny element, którego NIE losuje,
 * to poziom postaci - decyduje o nim użytkownik w popupie otwieranym przed
 * wywołaniem tej funkcji (zob. otwórzPopupWylosujPostać()). Krok 6 (Magia)
 * pozostaje nierozwiązany, tak jak przy zwykłym pominięciu go przez gracza -
 * to krok w pełni opcjonalny. Sklep w Kroku 7 też pozostaje nietknięty
 * (żadnych dodatkowych zakupów/sprzedaży) - losowana jest wyłącznie
 * Zamożność i gwarantowane/wybieralne pozycje startowego wyposażenia,
 * zgodnie z zasadami podręcznika; opcja "zwój z zaklęciem" (wymagająca
 * ręcznego wyboru tradycji/zaklęcia) jest pomijana na rzecz pozostałych
 * dostępnych opcji.
 */
async function randomizeWholeCharacter(poziom) {
  newCharacter();

  // 1. Pochodzenie + jego tabele (istniejący, przetestowany losowacz z Kroku 1)
  await randomizeOriginAndTraits();

  // 2. Bonusowe atrybuty pochodzenia (np. Elf: 2 wybory)
  document.querySelectorAll('.origin-attr-choice-select').forEach(select => {
    const opcje = Array.from(select.options).filter(o => o.value);
    if (!opcje.length) return;
    select.value = opcje[Math.floor(Math.random() * opcje.length)].value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  // 3. Poziom (0-10) - jedyna wartość niewylosowana, wybrana przez użytkownika
  //    w popupie (zob. renderRandomizeLevelGrid()); ta sama sekwencja co
  //    listener zmiany radiobuttona (Krok 2)
  selectedLevel = poziom;
  const levelInput = document.querySelector(`input[name="poziom"][value="${selectedLevel}"]`);
  if (levelInput) levelInput.checked = true;
  updatePathsVisibility(selectedLevel);
  await updatePathsLevel(selectedLevel);
  updatePathsSectionTitle(selectedLevel);
  updateWealthSection(selectedLevel);
  updateOriginBenefits(selectedLevel);
  renderPathSectionsVisibility();
  await renderPathSection(1);
  await renderPathSection(3);
  await renderPathSection(7);
  await loadBenefitsLevel(selectedLevel);

  // 4. Opcja poziomu 4 z pochodzenia (np. "1 zaklęcie"), jeśli dostępna
  if (selectedLevel >= 4) {
    const radios = Array.from(document.querySelectorAll(`input[name="origin-option-${selectedOrigin}"]`));
    if (radios.length) {
      const radio = radios[Math.floor(Math.random() * radios.length)];
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  // 5. Ścieżki (Krok 3) - losowa dostępna ścieżka na każdym odblokowanym progu
  [[1, 'path-grid-1'], [3, 'path-grid-3'], [7, 'path-grid-7']].forEach(([levelChoice, gridId]) => {
    if (selectedLevel < levelChoice) return;
    const buttons = Array.from(document.getElementById(gridId)?.querySelectorAll('button[data-path-id]') || []);
    if (!buttons.length) return;
    buttons[Math.floor(Math.random() * buttons.length)].click();
  });

  // 6. Sloty zwiększenia atrybutów (Krok 4) - losowy rozdział punktów
  const slotsAttr = calculateSlotsAttributes({
    pathNoviceId: selectedPaths.nowicjusz || null,
    pathExpertId: selectedPaths.ekspert || null,
    pathMasterId: selectedPaths.mistrz || null
  });
  slotsAttr.forEach(slot => {
    const selected = [];
    for (let i = 0; i < slot.ilosc; i++) {
      selected.push(slot.dostepne[Math.floor(Math.random() * slot.dostepne.length)]);
    }
    selectedAttributesSlots[slot.id] = selected;
  });
  renderAttributesSlotsSection();

  // 7. Profesje/języki i kurioza (Krok 5) - istniejące centralne losowacze
  renderProfessionsSection();
  renderCuriosSection();
  randomizeProfessionsCentrally();
  randomizeCuriosCentrally();

  // 8. Srebrniki (Krok 5) - 2k6 za każdy poziom powyżej 0, jak przycisk "Losuj srebrniki"
  if (selectedLevel > 0) {
    let sum = 0;
    const rolls = [];
    for (let i = 0; i < selectedLevel * 2; i++) {
      const r = Math.floor(Math.random() * 6) + 1;
      rolls.push(r);
      sum += r;
    }
    randomizedSilver = sum;
    updateWealthUi(rolls, sum);
  }

  // 9. Ekwipunek (Krok 7): Zamożność + wyposażenie startowe - BEZ sklepu
  //    (żadnych dodatkowych zakupów/sprzedaży) i bez opcji "zwój z zaklęciem"
  //    (wymagałaby ręcznego wyboru tradycji/zaklęcia w popupie).
  randomizeWealth();
  calculateAtomsGear(equipmentWealthId).forEach(atom => {
    if (atom.rodzaj === 'wybor_przedmiotu') {
      const itemId = atom.opcje[Math.floor(Math.random() * atom.opcje.length)];
      selectItemStarting(atom.id, itemId);
    } else if (atom.rodzaj === 'wybor_dodatkowy') {
      const optionsItems = atom.opcje.filter(o => o.typ === 'przedmiot');
      if (!optionsItems.length) return;
      const opcja = optionsItems[Math.floor(Math.random() * optionsItems.length)];
      selectItemStarting(atom.id, opcja.id);
    }
  });

  // 10. Krok 8: podsumowanie (zapisuje się automatycznie w cache w pokazKrok())
  showStep(8);
  updatePreviewCharacter();
}

// Ten plik jest ładowany jako moduł ES (<script type="module">), więc funkcje
// nie trafiają automatycznie do zasięgu globalnego. index.html odwołuje się
// do poniższych funkcji przez atrybuty onclick, więc trzeba je udostępnić na window.
window.nextStep = nextStep;
window.prevStep = prevStep;
window.exportJSON = exportJSON;
window.closeHelp = closeHelp;
window.switchHelpTab = switchHelpTab;
