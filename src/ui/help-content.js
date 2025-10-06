/**
 * Moduł z treścią pomocy dla lightboxa
 * Zawiera wszystkie teksty i strukturę pomocy
 */

/**
 * Generuje treść zakładki "Szybki Start"
 * @returns {string} HTML z treścią
 */
function getStartContent() {
  return `
    <h4>🚀 Jak utworzyć postać?</h4>
    
    <div class="help-step">
      <div class="help-step-header">
        <span class="help-step-number">1</span>
        <h5>Wybierz Pochodzenie</h5>
      </div>
      <p><strong>Pochodzenie</strong> to rasa Twojej postaci - człowiek, elf, krasnolud, goblin i wiele innych (17 opcji).</p>
      <ul>
        <li><strong>Przeglądaj kafelki</strong> - Kliknij dowolny kafelek aby zobaczyć szczegóły</li>
        <li><strong>Czytaj opisy</strong> - Każde pochodzenie ma unikalny opis, atrybuty i cechy specjalne</li>
        <li><strong>Wybierz</strong> - Kliknij przycisk "Wybierz [Nazwa]" na rozwiniętym kafelku</li>
        <li><strong>Idź dalej</strong> - Kliknij "Dalej →" na dole strony</li>
      </ul>
      <div class="help-tip">
        <strong>💡 Rekomendacje dla początkujących:</strong><br>
        👤 <strong>Człowiek</strong> - Wszechstronny, bez skomplikowanych zasad<br>
        ⚔️ <strong>Krasnolud</strong> - Odporny, świetny dla wojowników<br>
        ✨ <strong>Elf</strong> - Magiczny, dobry dla magów i łuczników
      </div>
    </div>

    <div class="help-step">
      <div class="help-step-header">
        <span class="help-step-number">2</span>
        <h5>Określ Atrybuty i Poziom</h5>
      </div>
      <p><strong>Poziom</strong> określa doświadczenie postaci (0-10):</p>
      <ul>
        <li><strong>Poziom 0 (Start)</strong> - Zupełnie nowa postać, bez ścieżek</li>
        <li><strong>Poziom 1 (Nowicjusz)</strong> - Wybierasz pierwszą ścieżkę (Wojownik, Mag, Kapłan, Łotr)</li>
        <li><strong>Poziom 3 (Ekspert)</strong> - Wybierasz drugą, ekspercką ścieżkę</li>
        <li><strong>Poziom 7 (Mistrz)</strong> - Wybierasz trzecią, mistrzowską ścieżkę</li>
      </ul>
      <p><strong>Atrybuty</strong> możesz ustawić na dwa sposoby:</p>
      <ul>
        <li><strong>Domyślne</strong> (zalecane) - Automatyczne (10, 10, 10, 10) + modyfikatory pochodzenia</li>
        <li><strong>Własne</strong> (zaawansowane) - Ustaw wartości 3-18 dla każdego atrybutu</li>
      </ul>
    </div>

    <div class="help-step">
      <div class="help-step-header">
        <span class="help-step-number">3</span>
        <h5>Podsumowanie i Eksport</h5>
      </div>
      <p>Sprawdź podgląd postaci i zatwierdź:</p>
      <ul>
        <li>Kliknij <strong>"🎲 Utwórz Postać"</strong> aby wygenerować kartę</li>
        <li>Kliknij <strong>"💾 Eksportuj JSON"</strong> aby zapisać postać na dysku</li>
      </ul>
    </div>
  `;
}

/**
 * Generuje treść zakładki "Słownik"
 * @returns {string} HTML z treścią
 */
function getGlossaryContent() {
  return `
    <h4>📖 Słownik Pojęć</h4>

    <div class="glossary-section">
      <h5>Atrybuty Podstawowe</h5>
      
      <div class="glossary-item">
        <div class="glossary-term">Siła (STR)</div>
        <div class="glossary-def">
          <p><strong>Co określa:</strong> Fizyczna moc, zdolność do noszenia, obrażenia wręcz</p>
          <p><strong>Przykłady:</strong> Podnoszenie ciężarów, walka mieczem, łamanie przedmiotów</p>
          <p><strong>Obliczenia:</strong></p>
          <ul>
            <li>Zdrowie = Siła</li>
            <li>Szybkość Zdrowienia = Siła ÷ 4 (zaokrąglone w dół, min. 1)</li>
          </ul>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">Zręczność (DEX)</div>
        <div class="glossary-def">
          <p><strong>Co określa:</strong> Zwinność, refleks, precyzja ataków dystansowych</p>
          <p><strong>Przykłady:</strong> Uniki, strzały z łuku, akrobacje, skradanie</p>
          <p><strong>Obliczenia:</strong></p>
          <ul>
            <li>Obrona = Zręczność</li>
            <li>Inicjatywa = Zręczność</li>
          </ul>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">Intelekt (INT)</div>
        <div class="glossary-def">
          <p><strong>Co określa:</strong> Inteligencja, wiedza, moc zaklęć</p>
          <p><strong>Przykłady:</strong> Rozwiązywanie zagadek, znajomość języków, rzucanie czarów</p>
          <p><strong>Obliczenia:</strong></p>
          <ul>
            <li>Percepcja = Intelekt</li>
            <li>Moc zaklęć = Intelekt (dla niektórych tradycji)</li>
          </ul>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">Wola (WIL)</div>
        <div class="glossary-def">
          <p><strong>Co określa:</strong> Siła woli, odporność mentalna, charyzma</p>
          <p><strong>Przykłady:</strong> Opieranie się urokom, przekonywanie, odporność na strach</p>
          <p><strong>Obliczenia:</strong></p>
          <ul>
            <li>Odporność na zaklęcia = Wola</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="glossary-section">
      <h5>Atrybuty Drugorzędne</h5>
      
      <div class="glossary-item">
        <div class="glossary-term">❤️ Zdrowie</div>
        <div class="glossary-def">
          <p><strong>Wzór:</strong> Siła + bonusy ze ścieżek</p>
          <p><strong>Co to znaczy:</strong> Ile obrażeń możesz przyjąć zanim upadniesz</p>
          <p><strong>Przykład:</strong> Siła 12 + Wojownik (+6) = 18 Zdrowia</p>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">🛡️ Obrona</div>
        <div class="glossary-def">
          <p><strong>Wzór:</strong> Zręczność</p>
          <p><strong>Co to znaczy:</strong> Jak trudno Cię trafić w walce (cel dla rzutów ataku)</p>
          <p><strong>Przykład:</strong> Zręczność 14 = Obrona 14</p>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">👁️ Percepcja</div>
        <div class="glossary-def">
          <p><strong>Wzór:</strong> Intelekt</p>
          <p><strong>Co to znaczy:</strong> Jak dobrze zauważasz ukryte rzeczy</p>
          <p><strong>Przykład:</strong> Intelekt 11 = Percepcja 11</p>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">💚 Szybkość Zdrowienia</div>
        <div class="glossary-def">
          <p><strong>Wzór:</strong> Siła ÷ 4 (zaokrąglone w dół, minimum 1)</p>
          <p><strong>Co to znaczy:</strong> Ile punktów zdrowia odzyskujesz po odpoczynku</p>
          <p><strong>Przykład:</strong> Siła 12 → 12÷4 = 3 punkty zdrowienia</p>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">🏃 Prędkość</div>
        <div class="glossary-def">
          <p><strong>Źródło:</strong> Pochodzenie (zwykle 10)</p>
          <p><strong>Co to znaczy:</strong> Ile metrów możesz przejść w jednej rundzie (6 sekund)</p>
          <p><strong>Przykład:</strong> Człowiek: 10 m/rundę, Jötunn: 12 m/rundę</p>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">📏 Rozmiar</div>
        <div class="glossary-def">
          <p><strong>Opcje:</strong> 1/4 (malutki), 1/2 (mały), 1 (normalny), 2 (duży)</p>
          <p><strong>Co to znaczy:</strong> Fizyczny rozmiar postaci</p>
          <p><strong>Wpływ:</strong> Może modyfikować niektóre mechaniki (ukrywanie, cel ataku)</p>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">✨ Moc</div>
        <div class="glossary-def">
          <p><strong>Źródło:</strong> Ścieżki magiczne</p>
          <p><strong>Co to znaczy:</strong> Punkty magii do rzucania zaklęć</p>
          <p><strong>Przykład:</strong> Mag (poziom 1) = 1 punkt mocy</p>
        </div>
      </div>
    </div>

    <div class="glossary-section">
      <h5>Pozostałe Terminy</h5>
      
      <div class="glossary-item">
        <div class="glossary-term">Pochodzenie</div>
        <div class="glossary-def">
          <p>Rasa postaci (człowiek, elf, krasnolud, itp.). Określa początkowe atrybuty, języki, profesje i cechy specjalne.</p>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">Ścieżka</div>
        <div class="glossary-def">
          <p>Klasa/profesja postaci. Wybierana na poziomach: 1 (Nowicjusz), 3 (Ekspert), 7 (Mistrz). Przykłady: Wojownik, Mag, Kapłan.</p>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">Poziom</div>
        <div class="glossary-def">
          <p>Doświadczenie postaci (0-10). Każdy poziom daje nowe korzyści: atrybuty, talenty, zaklęcia.</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generuje treść zakładki "FAQ"
 * @returns {string} HTML z treścią
 */
function getFAQContent() {
  return `
    <h4>❓ Często Zadawane Pytania</h4>

    <div class="faq-section">
      <h5>Podstawy</h5>
      
      <div class="faq-item">
        <div class="faq-question">Jak zmienić wybrane pochodzenie?</div>
        <div class="faq-answer">
          Kliknij przycisk <strong>"← Wstecz"</strong> na dole strony aby wrócić do kroku 1.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Czy mogę zapisać postać w trakcie tworzenia?</div>
        <div class="faq-answer">
          Nie, musisz dokończyć wszystkie kroki. Jednak proces jest szybki (2-3 minuty).
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Czy mogę edytować postać po utworzeniu?</div>
        <div class="faq-answer">
          Obecnie nie. Edycja będzie dostępna w przyszłych wersjach. Możesz jednak stworzyć nową postać.
        </div>
      </div>
    </div>

    <div class="faq-section">
      <h5>Pochodzenie</h5>
      
      <div class="faq-item">
        <div class="faq-question">Które pochodzenie jest najlepsze?</div>
        <div class="faq-answer">
          Nie ma "najlepszego" - każde ma swoje mocne strony:<br>
          • <strong>Dla początkujących:</strong> Człowiek (wszechstronny)<br>
          • <strong>Dla wojowników:</strong> Krasnolud, Ork, Jötunn<br>
          • <strong>Dla magów:</strong> Elf, Odmieniec<br>
          • <strong>Dla skrytych:</strong> Goblin, Nizioł, Chochlik
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Co znaczy "Rozmiar 2"?</div>
        <div class="faq-answer">
          Postać jest większa od normalnej (np. Jötunn to gigant). Większy rozmiar może dawać bonusy do siły, ale utrudnia ukrywanie się.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Czy mogę zmienić pochodzenie w trakcie gry?</div>
        <div class="faq-answer">
          Nie, pochodzenie jest stałe. To podstawowa cecha postaci określona przy narodzinach.
        </div>
      </div>
    </div>

    <div class="faq-section">
      <h5>Atrybuty</h5>
      
      <div class="faq-item">
        <div class="faq-question">Jakie atrybuty wybrać dla wojownika?</div>
        <div class="faq-answer">
          Priorytet: <strong>Siła</strong> (obrażenia, zdrowie) i <strong>Zręczność</strong> (obrona). Wola też jest ważna dla odporności.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Jakie atrybuty wybrać dla maga?</div>
        <div class="faq-answer">
          Priorytet: <strong>Intelekt</strong> (moc zaklęć) i <strong>Wola</strong> (odporność). Zręczność pomaga w obronie.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Jak działa "domyślne atrybuty"?</div>
        <div class="faq-answer">
          System ustawia bazowe wartości (10, 10, 10, 10) i dodaje modyfikatory z Twojego pochodzenia. To najprostszy sposób dla początkujących.
        </div>
      </div>
    </div>

    <div class="faq-section">
      <h5>Poziomy i Ścieżki</h5>
      
      <div class="faq-item">
        <div class="faq-question">Czy mogę mieć więcej niż jedną ścieżkę?</div>
        <div class="faq-answer">
          Tak! To sedno rozwoju postaci:<br>
          • <strong>Poziom 1:</strong> 1. ścieżka (Nowicjusz)<br>
          • <strong>Poziom 3:</strong> 2. ścieżka (Ekspert)<br>
          • <strong>Poziom 7:</strong> 3. ścieżka (Mistrz)
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Co to znaczy "Kontynuacja Nowicjusza"?</div>
        <div class="faq-answer">
          Na poziomie 2 otrzymujesz dodatkowe korzyści ze ścieżki nowicjusza (więcej zdrowia, talentów).
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Którą ścieżkę wybrać jako pierwszą?</div>
        <div class="faq-answer">
          Zależy od stylu gry:<br>
          • <strong>Wojownik</strong> - Walka wręcz, wysoka obrona<br>
          • <strong>Mag</strong> - Zaklęcia atakujące i użytkowe<br>
          • <strong>Kapłan</strong> - Uzdrawianie, wsparcie drużyny<br>
          • <strong>Łotr</strong> - Skradanie, zaskakiwanie
        </div>
      </div>
    </div>

    <div class="faq-section">
      <h5>Eksport i Zapis</h5>
      
      <div class="faq-item">
        <div class="faq-question">Jak działa eksport postaci?</div>
        <div class="faq-answer">
          Po kliknięciu "💾 Eksportuj JSON" pobierze się plik tekstowy (JSON) z wszystkimi danymi postaci. Możesz go otworzyć w notatniku, zachować jako backup lub udostępnić Mistrzowi Gry.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Czy mogę importować zapisane postacie?</div>
        <div class="faq-answer">
          Jeszcze nie, ale funkcja importu jest planowana w wersji 1.1.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Czy jest eksport do PDF?</div>
        <div class="faq-answer">
          Jeszcze nie, ale funkcja eksportu PDF jest planowana w wersji 1.1.
        </div>
      </div>
    </div>
  `;
}

/**
 * Generuje treść zakładki "Skróty Klawiszowe"
 * @returns {string} HTML z treścią
 */
function getShortcutsContent() {
  return `
    <h4>⌨️ Skróty Klawiszowe</h4>

    <div class="shortcuts-intro">
      <p>Możesz używać klawiatury do szybszej nawigacji w kreatorze:</p>
    </div>

    <table class="shortcuts-table">
      <thead>
        <tr>
          <th>Klawisz</th>
          <th>Akcja</th>
          <th>Kontekst</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><kbd>F1</kbd></td>
          <td>Otwórz pomoc</td>
          <td>Zawsze dostępne</td>
        </tr>
        <tr>
          <td><kbd>Esc</kbd></td>
          <td>Zamknij pomoc / anuluj</td>
          <td>Gdy pomoc jest otwarta</td>
        </tr>
        <tr>
          <td><kbd>Tab</kbd></td>
          <td>Przejdź do następnego pola</td>
          <td>Formularze</td>
        </tr>
        <tr>
          <td><kbd>Shift</kbd> + <kbd>Tab</kbd></td>
          <td>Przejdź do poprzedniego pola</td>
          <td>Formularze</td>
        </tr>
        <tr>
          <td><kbd>Enter</kbd></td>
          <td>Potwierdź wybór</td>
          <td>Przyciski, formularze</td>
        </tr>
        <tr>
          <td><kbd>Spacja</kbd></td>
          <td>Aktywuj przycisk</td>
          <td>Gdy przycisk ma focus</td>
        </tr>
        <tr>
          <td><kbd>↑</kbd> <kbd>↓</kbd></td>
          <td>Przewiń listę</td>
          <td>Listy rozwijane</td>
        </tr>
      </tbody>
    </table>

    <div class="help-tip" style="margin-top: 20px;">
      <strong>💡 Wskazówka:</strong> Użyj <kbd>Tab</kbd> do nawigacji między polami formularza - to szybsze niż klikanie myszką!
    </div>

    <div class="shortcuts-section">
      <h5>Nawigacja między Krokami</h5>
      <ul>
        <li>Użyj przycisków <strong>"Dalej →"</strong> i <strong>"← Wstecz"</strong> na dole każdego kroku</li>
        <li>Możesz cofnąć się w dowolnym momencie bez utraty danych</li>
      </ul>
    </div>

    <div class="shortcuts-section">
      <h5>Dostępność</h5>
      <p>Kreator wspiera czytniki ekranu i nawigację klawiaturową zgodnie z WCAG 2.1 AA.</p>
      <ul>
        <li>Wszystkie interaktywne elementy dostępne z klawiatury</li>
        <li>Focus widoczny wizualnie (złota ramka)</li>
        <li>Etykiety opisowe dla czytników ekranu</li>
      </ul>
    </div>
  `;
}

// Eksport funkcji (jeśli używane jako moduł)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getStartContent,
    getGlossaryContent,
    getFAQContent,
    getShortcutsContent
  };
}

