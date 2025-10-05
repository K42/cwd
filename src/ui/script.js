/**
 * Frontend JavaScript dla kreatora postaci
 */

let biezacaPostac = null;
let wybranePochodzenie = null;
let dostepnePochodzenia = [];

// Ładowanie opcji przy starcie strony
document.addEventListener('DOMContentLoaded', async () => {
    await zaladujOpcje();

    // Toggle własnych atrybutów
    document.getElementById('losowe-atrybuty').addEventListener('change', (e) => {
        const customDiv = document.getElementById('custom-attributes');
        customDiv.style.display = e.target.checked ? 'none' : 'block';
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
 * Generuje kafelki pochodzeń
 */
function generujKafelkiPochodzen(pochodzenia) {
    const container = document.getElementById('pochodzenie-tiles');
    container.innerHTML = '';

    pochodzenia.forEach(pochodzenie => {
        const tile = document.createElement('div');
        tile.className = 'origin-tile';
        tile.dataset.originId = pochodzenie.id;
        
        // Krótki opis (2 zdania)
        const krotkiOpis = utworzKrotkiOpis(pochodzenie);
        
        // Statystyki
        const atrybuty = pochodzenie.atrybuty;
        const najwyzszyAtrybut = Object.entries(atrybuty)
            .sort(([,a], [,b]) => b - a)[0];
        const najnizszyAtrybut = Object.entries(atrybuty)
            .sort(([,a], [,b]) => a - b)[0];

        tile.innerHTML = `
            <div class="size-badge">${pochodzenie.rozmiar}</div>
            <h4>${pochodzenie.nazwa}</h4>
            <div class="description">${krotkiOpis}</div>
            <div class="stats">
                <div class="stat">
                    <span class="stat-value">${najwyzszyAtrybut[1]}</span>
                    <span>${najwyzszyAtrybut[0]}</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${pochodzenie.predkosc}</span>
                    <span>Prędkość</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${najnizszyAtrybut[1]}</span>
                    <span>${najnizszyAtrybut[0]}</span>
                </div>
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

    // Własne atrybuty jeśli nie losowe
    if (!document.getElementById('losowe-atrybuty').checked) {
        spec.atrybuty = {
            sila: parseInt(document.getElementById('sila').value),
            zrecznosc: parseInt(document.getElementById('zrecznosc').value),
            intelekt: parseInt(document.getElementById('intelekt').value),
            wola: parseInt(document.getElementById('wola').value)
        };
    }

    // Pokazanie loadingu
    document.getElementById('loading').style.display = 'block';
    document.getElementById('error').style.display = 'none';
    document.getElementById('btn-utworz').disabled = true;

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
        document.getElementById('btn-utworz').disabled = false;
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
