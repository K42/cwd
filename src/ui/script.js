/**
 * Frontend JavaScript dla kreatora postaci
 */

let biezacaPostac = null;

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

        // Wypełnianie selecta pochodzeń
        const pochodzenieSelect = document.getElementById('pochodzenie');
        pochodzenieSelect.innerHTML = '<option value="">Wybierz pochodzenie...</option>';

        opcje.pochodzenia.forEach(id => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = id.charAt(0).toUpperCase() + id.slice(1);
            pochodzenieSelect.appendChild(option);
        });

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
 * Tworzy nową postać
 */
async function utworzPostac() {
    const pochodzenie = document.getElementById('pochodzenie').value;
    if (!pochodzenie) {
        pokazBlad('Wybierz pochodzenie postaci!');
        return;
    }

    // Przygotowanie specyfikacji
    const spec = {
        pochodzenie: pochodzenie,
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
