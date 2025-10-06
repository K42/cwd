/**
 * Frontend JavaScript dla kreatora postaci
 */

let biezacaPostac = null;
let wybranePochodzenie = null;
let wybranyPoziom = 1; // Gra zaczyna się od poziomu 1, nie ma poziomu 0
let dostepnePochodzenia = [];

// Ładowanie opcji przy starcie strony
document.addEventListener('DOMContentLoaded', async () => {
  await zaladujOpcje();
  await zaladujPoziomy();
  inicjalizujPoziomy();
  
  // Inicjalizuj system pomocy
  initializeHelpSystem();

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
    // Pobierz podstawowe opcje z oryginalnego API
    const response = await fetch('/api/options');
    const opcje = await response.json();

    // Sprawdź, które pochodzenia mają tabele z nowego API
    let pochodzeniaZTabelami = [];
    try {
      const originsResponse = await fetch('/api/origins');
      if (originsResponse.ok) {
        const originsData = await originsResponse.json();
        pochodzeniaZTabelami = originsData.pochodzenia || [];
      }
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

    // Wypełnianie selecta ścieżek
    const sciezkaSelect = document.getElementById('sciezka');
    sciezkaSelect.innerHTML = '<option value="">Brak ścieżki</option>';

    opcje.sciezki.forEach(id => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = id.charAt(0).toUpperCase() + id.slice(1);
      sciezkaSelect.appendChild(option);
    });

  } catch (error) {
    pokazBlad(`Nie można załadować opcji: ${  error.message}`);
  }
}

/**
 * Ładuje dostępne poziomy z serwera
 */
async function zaladujPoziomy() {
  try {
    const response = await fetch('/api/levels');
    await response.json(); // Poziomy pobierane, ale obecnie nieużywane
        
    // Poziomy są pobierane, ale obecnie nie są używane w UI
    // dostepnePoziomy = data.poziomy || [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Błąd ładowania poziomów:', error);
    // Fallback do lokalnych danych (obecnie nieużywane - poziomy są w HTML)
  }
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
      aktualizujSciezkiPoziomu(wybranyPoziom);
      aktualizujTytulSekcjiSciezek(wybranyPoziom);
      // Załaduj korzyści dla wybranego poziomu
      await zaladujKorzysciPoziomu(wybranyPoziom);
    });
  });

  // Inicjalizuj ścieżki dla poziomu 1 (domyślnego - gra nie ma poziomu 0)
  aktualizujSciezkiPoziomu(1);
  // Załaduj korzyści dla poziomu 1
  zaladujKorzysciPoziomu(1);
}

/**
 * Aktualizuje dostępne ścieżki na podstawie wybranego poziomu
 * @param {number} poziom - Wybrany poziom postaci
 */
async function aktualizujSciezkiPoziomu(poziom) {
  try {
    const response = await fetch(`/api/paths/${poziom}`);
    const data = await response.json();
        
    const sciezkaSelect = document.getElementById('sciezka-nowicjusza');
    if (sciezkaSelect && data.sciezki) {
      sciezkaSelect.innerHTML = '<option value="">Wybierz ścieżkę...</option>';
            
      data.sciezki.forEach(sciezka => {
        const option = document.createElement('option');
        option.value = sciezka.id;
        option.textContent = sciezka.nazwa;
        sciezkaSelect.appendChild(option);
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Błąd ładowania ścieżek:', error);
    // Fallback do domyślnych ścieżek
    aktualizujSciezkiFallback(poziom);
  }
}

/**
 * Fallback do ładowania ścieżek gdy API nie działa
 * @param {number} poziom - Wybrany poziom postaci
 */
function aktualizujSciezkiFallback(poziom) {
  const sciezkaSelect = document.getElementById('sciezka-nowicjusza');
  if (!sciezkaSelect) return;

  sciezkaSelect.innerHTML = '<option value="">Wybierz ścieżkę...</option>';
    
  const sciezkiPoziomu = {
    1: [
      { id: 'wojownik', nazwa: 'Wojownik' }, 
      { id: 'mag', nazwa: 'Mag' }, 
      { id: 'kapłan', nazwa: 'Kapłan' }, 
      { id: 'łotr', nazwa: 'Łotr' }
    ],
    2: [
      { id: 'kontynuacja_nowicjusza', nazwa: 'Kontynuacja Nowicjusza' }
    ],
    3: [
      { id: 'berserker', nazwa: 'Berserker' }, 
      { id: 'czarodziej', nazwa: 'Czarodziej' }, 
      { id: 'uzdrowiciel', nazwa: 'Uzdrowiciel' }, 
      { id: 'zabójca', nazwa: 'Zabójca' }
    ],
    4: [
      { id: 'kontynuacja_eksperta', nazwa: 'Kontynuacja Eksperta' }
    ],
    5: [
      { id: 'barbarzyńca', nazwa: 'Barbarzyńca' }, 
      { id: 'arcymag', nazwa: 'Arcymag' }, 
      { id: 'święty', nazwa: 'Święty' }, 
      { id: 'cień', nazwa: 'Cień' }
    ],
    6: [
      { id: 'kontynuacja_mistrza', nazwa: 'Kontynuacja Mistrza' }
    ],
    7: [
      { id: 'władca_wojny', nazwa: 'Władca Wojny' }, 
      { id: 'władca_magii', nazwa: 'Władca Magii' }, 
      { id: 'władca_życia', nazwa: 'Władca Życia' }, 
      { id: 'władca_śmierci', nazwa: 'Władca Śmierci' }
    ],
    8: [
      { id: 'kontynuacja_legendy', nazwa: 'Kontynuacja Legendy' }
    ],
    9: [
      { id: 'wszystkie_ścieżki', nazwa: 'Wszystkie Ścieżki' }
    ],
    10: [
      { id: 'wszystkie_ścieżki', nazwa: 'Wszystkie Ścieżki' }
    ]
  };

  const sciezki = sciezkiPoziomu[poziom] || [];
  sciezki.forEach(sciezka => {
    const option = document.createElement('option');
    option.value = sciezka.id;
    option.textContent = sciezka.nazwa;
    sciezkaSelect.appendChild(option);
  });
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

  tytul.textContent = nazwyPoziomow[poziom] || 'Ścieżka';
}


/**
 * Ładuje rozszerzone dane pochodzeń z nowego API
 * @param {Array} pochodzeniaIds - Lista ID pochodzeń
 * @param {Array} pochodzeniaZTabelami - Lista metadanych pochodzeń z tabelami
 * @returns {Array} Tablica obiektów pochodzeń z pełnymi danymi
 */
async function zaladujSzczegolyPochodzenRozszerzone(pochodzeniaIds, pochodzeniaZTabelami = []) {
  const pochodzenia = [];
    
  for (const pochodzenieId of pochodzeniaIds) {
    try {
      // Pobierz podstawowe dane pochodzenia z oryginalnego API
      const basicResponse = await fetch('/api/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pochodzenie: pochodzenieId, 
          atrybuty: { sila: 10, zrecznosc: 10, intelekt: 10, wola: 10 }
        })
      });
      
      if (basicResponse.ok) {
        const postac = await basicResponse.json();
        const podstawoweDane = postac.pochodzenie;
        
        // Sprawdź, czy to pochodzenie ma tabele
        const metaData = pochodzeniaZTabelami.find(p => p.id === pochodzenieId);
        if (metaData && metaData.ma_tabele) {
          try {
            const tablesResponse = await fetch(`/api/origins/${pochodzenieId}/tables`);
            if (tablesResponse.ok) {
              const tablesData = await tablesResponse.json();
              // Połącz podstawowe dane z tabelami
              podstawoweDane.tabele = tablesData.tabele;
            }
          } catch (tablesError) {
            // eslint-disable-next-line no-console
            console.warn(`Nie udało się załadować tabel dla pochodzenia ${pochodzenieId}:`, tablesError);
          }
        }
        
        pochodzenia.push(podstawoweDane);
      }
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
                    <div class="size-badge">${pochodzenie.rozmiar}</div>
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
                                    <button class="roll-table-btn" data-origin-id="${pochodzenie.id}" data-table-name="${nazwaTabeli}">
                                        🎲 Losuj
                                    </button>
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
    'jotunn': 'Potężni giganci z północnych krain, znani z siły, honoru bojowego i odporności na zimno. Jötunnowie żyją w surowym środowisku, gdzie ich rozmiar i wytrzymałość są kluczowe. Ich społeczeństwa opierają się na tradycji, honorze i szacunku dla siły naturalnej.'
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
 * Wybiera pochodzenie
 * @param {string} originId - ID pochodzenia do wyboru
 */
function wybierzPochodzenie(originId) {
  wybranePochodzenie = originId;
    
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
    
  // Aktywuj przycisk "Dalej" w kroku 2
  document.getElementById('btn-next-2').disabled = false;
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
  const atrybutyDrugorzedne = {
    percepcja: atrybuty.intelekt,
    obrona: atrybuty.zrecznosc,
    zdrowie: atrybuty.sila,
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
    `;
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
  const spec = {
    pochodzenie: wybranePochodzenie,
    sciezka: document.getElementById('sciezka').value || undefined
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
    const response = await fetch('/api/build', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(spec)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    const postac = await response.json();
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
    document.getElementById('level-benefits-section').style.display = 'none';
    return;
  }

  try {
    const response = await fetch('/api/calculate-level-benefits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        poziom,
        pochodzenie: wybranePochodzenie.id,
        sciezka_nowicjusza: null, // TODO: pobierać z wyboru użytkownika
        sciezka_ekspercka: null,
        sciezka_mistrzowska: null
      })
    });

    const benefits = await response.json();
    wyswietlKorzysciPoziomu(benefits);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Błąd ładowania korzyści:', error);
  }
}

/**
 * Wyświetla korzyści poziomu
 */
function wyswietlKorzysciPoziomu(benefits) {
  const section = document.getElementById('level-benefits-section');
  const levelName = document.getElementById('selected-level-name');
  
  section.style.display = 'block';
  levelName.textContent = `${benefits.nazwa_poziomu} (${benefits.nazwa_sciezki || 'Pochodzenie'})`;

  // Resetuj wszystkie sekcje
  document.getElementById('secondary-attributes-growth').style.display = 'none';
  document.getElementById('primary-attributes-choice').style.display = 'none';
  document.getElementById('talents-section').style.display = 'none';
  document.getElementById('magic-section').style.display = 'none';
  document.getElementById('languages-professions-section').style.display = 'none';

  // Wyświetl atrybuty drugorzędne
  if (benefits.korzyści.zdrowie || benefits.korzyści.moc || benefits.korzyści.obrona) {
    const content = [];
    if (benefits.korzyści.zdrowie) content.push(`Zdrowie: ${benefits.korzyści.zdrowie}`);
    if (benefits.korzyści.moc) content.push(`Moc: ${benefits.korzyści.moc}`);
    if (benefits.korzyści.obrona) content.push(`Obrona: ${benefits.korzyści.obrona}`);
    
    document.getElementById('secondary-attrs-content').innerHTML = content.join(', ');
    document.getElementById('secondary-attributes-growth').style.display = 'block';
  }

  // Wyświetl interaktywny wybór atrybutów głównych
  if (benefits.korzyści.atrybuty_glowne && benefits.korzyści.atrybuty_glowne.typ === 'wybor') {
    pokazWyborAtrybutow(benefits.korzyści.atrybuty_glowne);
  }

  // Wyświetl talenty
  if (benefits.korzyści.talenty && benefits.korzyści.talenty.length > 0) {
    document.getElementById('talents-content').innerHTML = 
      `<ul>${  benefits.korzyści.talenty.map(t => `<li>${t}</li>`).join('')  }</ul>`;
    document.getElementById('talents-section').style.display = 'block';
  }

  // Wyświetl magię
  if (benefits.korzyści.magia) {
    document.getElementById('magic-content').textContent = benefits.korzyści.magia;
    document.getElementById('magic-section').style.display = 'block';
  }

  // Wyświetl języki i profesje
  if (benefits.korzyści.jezyki_profesje) {
    document.getElementById('languages-professions-content').textContent = benefits.korzyści.jezyki_profesje;
    document.getElementById('languages-professions-section').style.display = 'block';
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
    
    // Wywołaj API
    const response = await fetch(`/api/origins/${originId}/tables/${tableName}/roll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Wyświetl wynik
    if (resultDiv) {
      const efekt = data.wynik.efekt ? `<br><strong>Efekt mechaniczny:</strong> ${data.wynik.efekt}` : '';
      resultDiv.innerHTML = `
        <div class="roll-result-content">
          <div class="roll-dice">🎲 Rzut: ${data.wynik.rzut}</div>
          <div class="roll-outcome">${data.wynik.wynik}</div>
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
