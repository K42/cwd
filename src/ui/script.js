/**
 * Frontend JavaScript dla kreatora postaci
 */

let biezacaPostac = null;
let wybranePochodzenie = null;
let dostepnePochodzenia = [];
let aktualnyKrok = 1;

// Ładowanie opcji przy starcie strony
document.addEventListener('DOMContentLoaded', async () => {
    await zaladujOpcje();

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
        const response = await fetch('/api/options');
        const opcje = await response.json();

        // Ładowanie szczegółowych danych pochodzeń
        dostepnePochodzenia = await zaladujSzczegolyPochodzen(opcje.pochodzenia);

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
        pokazBlad('Nie można załadować opcji: ' + error.message);
    }
}

/**
 * Ładuje szczegółowe dane pochodzeń z serwera
 */
async function zaladujSzczegolyPochodzen(pochodzeniaIds) {
    const pochodzenia = [];
    
    for (const id of pochodzeniaIds) {
        try {
            // Tworzymy tymczasową postać aby uzyskać dane pochodzenia
            const response = await fetch('/api/build', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    pochodzenie: id, 
                    atrybuty: { sila: 10, zrecznosc: 10, intelekt: 10, wola: 10 }
                })
            });
            
            if (response.ok) {
                const postac = await response.json();
                pochodzenia.push(postac.pochodzenie);
            }
        } catch (error) {
            console.warn(`Nie udało się załadować danych dla pochodzenia ${id}:`, error);
        }
    }
    
    return pochodzenia;
}

/**
 * Generuje kafelki pochodzeń z kompletnymi informacjami
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
        tile.className = 'origin-tile';
        tile.dataset.originId = pochodzenie.id;
        
        // Krótki opis (2 zdania)
        const krotkiOpis = utworzKrotkiOpis(pochodzenie);
        
        // Oblicz atrybuty drugorzędne - zgodnie z backend (atrybuty pochodzenia to wartości finalne)
        const atrybutyDomyślne = { sila: 10, zrecznosc: 10, intelekt: 10, wola: 10 };
        const atrybutyFinalne = {
            sila: atrybutyDomyślne.sila + (pochodzenie.atrybuty.sila - 10),
            zrecznosc: atrybutyDomyślne.zrecznosc + (pochodzenie.atrybuty.zrecznosc - 10),
            intelekt: atrybutyDomyślne.intelekt + (pochodzenie.atrybuty.intelekt - 10),
            wola: atrybutyDomyślne.wola + (pochodzenie.atrybuty.wola - 10)
        };
        
        // Oblicz obronę zgodnie z zasadami gry (z backend)
        let obrona = atrybutyFinalne.zrecznosc;
        const rozmiar = pochodzenie.rozmiar;
        if (rozmiar === '1/4') {
            obrona += 4;
        } else if (rozmiar === '1/2') {
            obrona += 2;
        } else if (rozmiar === '2') {
            obrona -= 2;
        }
        obrona = Math.max(obrona, 1);
        
        const zdrowie = atrybutyFinalne.sila;
        
        // Pobierz kluczowe cechy specjalne (maksymalnie 2)
        const kluczoweCechy = pobierzKluczoweCechy(pochodzenie.cechy_specjalne);

        tile.innerHTML = `
            <div class="size-badge">${pochodzenie.rozmiar}</div>
            <h4>${pochodzenie.nazwa}</h4>
            <div class="description">${krotkiOpis}</div>
            
            <div class="tile-sections">
                <div class="tile-section attributes-section">
                    <h5>⚔️ Atrybuty</h5>
                    <div class="attributes-grid">
                        <div class="attribute-item">
                            <span class="attr-name">Siła</span>
                            <span class="attr-value">${pochodzenie.atrybuty.sila}</span>
                            <span class="attr-mod">${formatModifier(pochodzenie.atrybuty.sila - 10)}</span>
                        </div>
                        <div class="attribute-item">
                            <span class="attr-name">Zręczność</span>
                            <span class="attr-value">${pochodzenie.atrybuty.zrecznosc}</span>
                            <span class="attr-mod">${formatModifier(pochodzenie.atrybuty.zrecznosc - 10)}</span>
                        </div>
                        <div class="attribute-item">
                            <span class="attr-name">Intelekt</span>
                            <span class="attr-value">${pochodzenie.atrybuty.intelekt}</span>
                            <span class="attr-mod">${formatModifier(pochodzenie.atrybuty.intelekt - 10)}</span>
                        </div>
                        <div class="attribute-item">
                            <span class="attr-name">Wola</span>
                            <span class="attr-value">${pochodzenie.atrybuty.wola}</span>
                            <span class="attr-mod">${formatModifier(pochodzenie.atrybuty.wola - 10)}</span>
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
                
                ${kluczoweCechy ? `
                <div class="tile-section features-section">
                    <h5>✨ Cechy</h5>
                    <div class="features-list">
                        ${kluczoweCechy.map(cecha => `
                            <div class="feature-item">
                                <span class="feature-name">${cecha.nazwa}</span>
                                <span class="feature-desc">${cecha.opis}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;

        tile.addEventListener('click', () => wybierzPochodzenie(pochodzenie.id));
        container.appendChild(tile);
    });
}

/**
 * Tworzy krótki opis pochodzenia (2 zdania)
 */
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
    }

    // Aktywuj przycisk "Dalej" w kroku 1
    document.getElementById('btn-next-1').disabled = false;
}

/**
 * Nawigacja do następnego kroku
 */
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
    aktualnyKrok = stepNumber;
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
            Siła ${pochodzenie.atrybuty.sila - 10 >= 0 ? '+' : ''}${pochodzenie.atrybuty.sila - 10}, 
            Zręczność ${pochodzenie.atrybuty.zrecznosc - 10 >= 0 ? '+' : ''}${pochodzenie.atrybuty.zrecznosc - 10}, 
            Intelekt ${pochodzenie.atrybuty.intelekt - 10 >= 0 ? '+' : ''}${pochodzenie.atrybuty.intelekt - 10}, 
            Wola ${pochodzenie.atrybuty.wola - 10 >= 0 ? '+' : ''}${pochodzenie.atrybuty.wola - 10}
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
        sila: atrybutyBazowe.sila + (pochodzenie.atrybuty.sila - 10),
        zrecznosc: atrybutyBazowe.zrecznosc + (pochodzenie.atrybuty.zrecznosc - 10),
        intelekt: atrybutyBazowe.intelekt + (pochodzenie.atrybuty.intelekt - 10),
        wola: atrybutyBazowe.wola + (pochodzenie.atrybuty.wola - 10)
    };
    
    // Aktualizuj wyświetlane wartości
    document.getElementById('sila-final').textContent = atrybutyFinalne.sila;
    document.getElementById('zrecznosc-final').textContent = atrybutyFinalne.zrecznosc;
    document.getElementById('intelekt-final').textContent = atrybutyFinalne.intelekt;
    document.getElementById('wola-final').textContent = atrybutyFinalne.wola;
    
    // Aktualizuj modyfikatory
    document.getElementById('sila-mod').textContent = formatModifier(pochodzenie.atrybuty.sila - 10);
    document.getElementById('zrecznosc-mod').textContent = formatModifier(pochodzenie.atrybuty.zrecznosc - 10);
    document.getElementById('intelekt-mod').textContent = formatModifier(pochodzenie.atrybuty.intelekt - 10);
    document.getElementById('wola-mod').textContent = formatModifier(pochodzenie.atrybuty.wola - 10);
    
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
        sila: atrybutyBazowe.sila + (pochodzenie.atrybuty.sila - 10),
        zrecznosc: atrybutyBazowe.zrecznosc + (pochodzenie.atrybuty.zrecznosc - 10),
        intelekt: atrybutyBazowe.intelekt + (pochodzenie.atrybuty.intelekt - 10),
        wola: atrybutyBazowe.wola + (pochodzenie.atrybuty.wola - 10)
    };
    
    // Aktualizuj wyświetlane wartości
    document.getElementById('sila-final').textContent = atrybutyFinalne.sila;
    document.getElementById('zrecznosc-final').textContent = atrybutyFinalne.zrecznosc;
    document.getElementById('intelekt-final').textContent = atrybutyFinalne.intelekt;
    document.getElementById('wola-final').textContent = atrybutyFinalne.wola;
    
    // Aktualizuj modyfikatory
    document.getElementById('sila-mod').textContent = formatModifier(pochodzenie.atrybuty.sila - 10);
    document.getElementById('zrecznosc-mod').textContent = formatModifier(pochodzenie.atrybuty.zrecznosc - 10);
    document.getElementById('intelekt-mod').textContent = formatModifier(pochodzenie.atrybuty.intelekt - 10);
    document.getElementById('wola-mod').textContent = formatModifier(pochodzenie.atrybuty.wola - 10);
    
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
 * Pobiera kluczowe cechy specjalne (maksymalnie 2)
 * @param {Object} cechySpecjalne - Obiekt z cechami specjalnymi
 * @returns {Array|null} Tablica z maksymalnie 2 kluczowymi cechami
 */
function pobierzKluczoweCechy(cechySpecjalne) {
    if (!cechySpecjalne || Object.keys(cechySpecjalne).length === 0) {
        return null;
    }
    
    const cechy = Object.entries(cechySpecjalne);
    const kluczoweCechy = cechy.slice(0, 2).map(([nazwa, opis]) => ({
        nazwa: formatujNazweCechy(nazwa),
        opis: opis.length > 60 ? opis.substring(0, 60) + '...' : opis
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
        pokazBlad('Błąd tworzenia postaci: ' + error.message);
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

/**
 * Eksportuje postać jako JSON
 */
function exportJSON() {
    if (!biezacaPostac) return;

    const dataStr = JSON.stringify(biezacaPostac, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

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
